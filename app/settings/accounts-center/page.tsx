'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const ACCOUNT_STORAGE_KEYS = {
  CENTER_DATA: 'indiePulse_account_center_v1',
  SECURITY_META: 'indiePulse_security_meta_v1',
  NAME: 'indiePulse_name',
  PROFILE_NAME: 'indiePulse_profile_name',
  USER_NAME: 'indiePulse_user_name',
  BIO: 'indiePulse_bio',
};

export default function AccountsCenter() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const [profileData, setProfileData] = useState({
    name: 'Indie Creator',
    email: 'creator@indiepulse.com',
    bio: 'Passionate developer',
  });
  const [passData, setPassData] = useState({ currentPass: '', newPass: '', confirmPass: '' });
  const [securityMeta, setSecurityMeta] = useState({
    lastChangedAt: 'Not updated yet',
    twoFactorEnabled: true,
    loginAlerts: true,
    passDigest: '',
  });
  const [connectedApps, setConnectedApps] = useState({ google: true, discord: false, github: true });
  const [permissions, setPermissions] = useState({ camera: true, location: false, notifications: true });
  const [adPrefs, setAdPrefs] = useState({ personalizedAds: true, sensitiveContent: false });
  const [accountsList, setAccountsList] = useState([{ id: 1, name: 'IndiePulse Main Account', type: 'Primary' }]);

  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const syncAccountDataFromStorage = useCallback(() => {
    try {
      const savedCenter = localStorage.getItem(ACCOUNT_STORAGE_KEYS.CENTER_DATA);
      const fallbackName =
        localStorage.getItem(ACCOUNT_STORAGE_KEYS.NAME) ||
        localStorage.getItem(ACCOUNT_STORAGE_KEYS.PROFILE_NAME) ||
        localStorage.getItem(ACCOUNT_STORAGE_KEYS.USER_NAME);
      const fallbackBio = localStorage.getItem(ACCOUNT_STORAGE_KEYS.BIO);

      if (savedCenter) {
        const parsed = JSON.parse(savedCenter);
        setProfileData({
          name: (typeof parsed?.name === 'string' && parsed.name.trim()) || fallbackName || 'Indie Creator',
          email: (typeof parsed?.email === 'string' && parsed.email.trim()) || 'creator@indiepulse.com',
          bio: (typeof parsed?.bio === 'string' && parsed.bio.trim()) || fallbackBio || 'Passionate developer',
        });
      } else if (fallbackName || fallbackBio) {
        setProfileData((prev) => ({
          ...prev,
          name: fallbackName && fallbackName.trim() ? fallbackName.trim() : prev.name,
          bio: fallbackBio && fallbackBio.trim() ? fallbackBio.trim() : prev.bio,
        }));
      }

      const savedSecurity = localStorage.getItem(ACCOUNT_STORAGE_KEYS.SECURITY_META);
      if (savedSecurity) {
        const parsedSec = JSON.parse(savedSecurity);
        setSecurityMeta((prev) => ({
          lastChangedAt:
            typeof parsedSec?.lastChangedAt === 'string' && parsedSec.lastChangedAt.trim()
              ? parsedSec.lastChangedAt
              : prev.lastChangedAt,
          twoFactorEnabled:
            typeof parsedSec?.twoFactorEnabled === 'boolean' ? parsedSec.twoFactorEnabled : prev.twoFactorEnabled,
          loginAlerts: typeof parsedSec?.loginAlerts === 'boolean' ? parsedSec.loginAlerts : prev.loginAlerts,
          passDigest: typeof parsedSec?.passDigest === 'string' ? parsedSec.passDigest : prev.passDigest,
        }));
      }
    } catch (err) {
      console.error('Safe account sync notice:', err);
    }
  }, []);

  useEffect(() => {
    syncAccountDataFromStorage();
    window.addEventListener('storage', syncAccountDataFromStorage);
    window.addEventListener('focus', syncAccountDataFromStorage);
    return () => {
      window.removeEventListener('storage', syncAccountDataFromStorage);
      window.removeEventListener('focus', syncAccountDataFromStorage);
    };
  }, [syncAccountDataFromStorage]);

  const persistProfileAndBackend = async (nextProfile: { name: string; email: string; bio: string }) => {
    const cleanName = nextProfile.name.trim() || 'Indie Creator';
    const cleanEmail = nextProfile.email.trim() || 'creator@indiepulse.com';
    const cleanBio = nextProfile.bio.trim() || 'Passionate developer';

    const payload = {
      name: cleanName,
      email: cleanEmail,
      bio: cleanBio,
      updatedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem(ACCOUNT_STORAGE_KEYS.CENTER_DATA, JSON.stringify(payload));
      localStorage.setItem(ACCOUNT_STORAGE_KEYS.NAME, cleanName);
      localStorage.setItem(ACCOUNT_STORAGE_KEYS.PROFILE_NAME, cleanName);
      localStorage.setItem(ACCOUNT_STORAGE_KEYS.USER_NAME, cleanName);
      localStorage.setItem(ACCOUNT_STORAGE_KEYS.BIO, cleanBio);
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Failed to persist profile details:', err);
    }

    // Attempt backend API sync if configured; never overwrite local storage if offline/unavailable
    try {
      await fetch('/api/account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch {
      // Safe fallback: localStorage remains primary persistent store until backend endpoint is live
    }
  };

  const persistSecurityAndBackend = async (
    nextMeta: {
      lastChangedAt: string;
      twoFactorEnabled: boolean;
      loginAlerts: boolean;
      passDigest: string;
    },
    passwordWasUpdated?: boolean
  ) => {
    try {
      localStorage.setItem(ACCOUNT_STORAGE_KEYS.SECURITY_META, JSON.stringify(nextMeta));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Failed to persist security metadata:', err);
    }

    // Backend API endpoint for production scale (bcrypt/argon2 password hashing & session audit log)
    try {
      await fetch('/api/account/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: profileData.email,
          twoFactorEnabled: nextMeta.twoFactorEnabled,
          loginAlerts: nextMeta.loginAlerts,
          lastChangedAt: nextMeta.lastChangedAt,
          passDigest: nextMeta.passDigest,
          passwordUpdated: Boolean(passwordWasUpdated),
        }),
      });
    } catch {
      // Safe fallback: localStorage keeps latest state when backend endpoint is not yet deployed
    }
  };

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: 'Enter New Password', color: 'text-slate-400', width: '0%' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { label: 'Weak Password', color: 'text-rose-400', width: '30%' };
    if (score <= 2) return { label: 'Medium Strength', color: 'text-amber-300', width: '65%' };
    return { label: 'Strong Security', color: 'text-emerald-400', width: '100%' };
  };

  const handlePasswordUpdate = () => {
    setErrorMsg('');
    setMessage('');

    if (!passData.currentPass.trim()) {
      setErrorMsg('Please enter your current password.');
      return;
    }
    if (passData.newPass.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }
    if (passData.newPass !== passData.confirmPass) {
      setErrorMsg('New password and Confirm new password do not match.');
      return;
    }

    const updatedAtText = new Date().toLocaleString();
    const nonPlainFingerprint = `pwd_v1_${passData.newPass.length}_${Date.now().toString(36)}`;

    const nextMeta = {
      ...securityMeta,
      lastChangedAt: updatedAtText,
      passDigest: nonPlainFingerprint,
    };

    setSecurityMeta(nextMeta);
    setPassData({ currentPass: '', newPass: '', confirmPass: '' });
    persistSecurityAndBackend(nextMeta, true);
    setMessage(`Password updated & saved (${updatedAtText})!`);
    setTimeout(() => setMessage(''), 3500);
  };

  const handleSave = (sectionName: string) => {
    setErrorMsg('');
    if (sectionName === 'Profile details') {
      persistProfileAndBackend(profileData);
    }
    setMessage(`${sectionName} saved successfully!`);
    setTimeout(() => setMessage(''), 3000);
  };

  const strength = getPasswordStrength(passData.newPass);

  return (
    <main
      style={{ textAlign: 'left' }}
      className="min-h-screen bg-[#070514] text-white flex flex-col px-4 py-8 max-w-2xl mx-auto w-full relative select-none text-left"
    >
      {/* Background glow matching Notifications & Account Privacy pages */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-pink-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Back Button and Header */}
      <div style={{ textAlign: 'left' }} className="flex flex-col items-start gap-4 mb-6 relative z-10 w-full text-left">
        <Link
          href="/menu"
          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(236,72,153,0.4)] border border-pink-400/40 transition-all cursor-pointer"
        >
          Back
        </Link>
        <div style={{ textAlign: 'left' }} className="w-full text-left">
          <h1 style={{ textAlign: 'left' }} className="text-2xl font-black tracking-wide text-white text-left">
            Accounts Center
          </h1>
          <p style={{ textAlign: 'left' }} className="text-xs text-slate-300 mt-1 text-left">
            Manage your connected experiences and account settings across IndiePulse technologies.
          </p>
        </div>
      </div>

      <div style={{ textAlign: 'left' }} className="w-full relative z-10 text-left">
        {/* Success save message */}
        {message && (
          <div
            style={{ textAlign: 'left' }}
            className="mb-4 p-3 bg-emerald-600/20 border border-emerald-500 text-emerald-300 rounded-xl text-sm animate-pulse text-left"
          >
            {message}
          </div>
        )}

        {/* Validation / Error message */}
        {errorMsg && (
          <div
            style={{ textAlign: 'left' }}
            className="mb-4 p-3 bg-rose-600/20 border border-rose-500 text-rose-300 rounded-xl text-sm text-left"
          >
            {errorMsg}
          </div>
        )}

        {!activeSection ? (
          <div
            style={{ textAlign: 'left' }}
            className="bg-[#120e26]/90 border border-purple-500/30 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(147,51,234,0.15)] w-full text-left"
          >
            <div
              style={{ textAlign: 'left' }}
              className="p-3.5 bg-gradient-to-r from-pink-900/40 to-purple-900/40 text-pink-400 text-[11px] font-bold uppercase tracking-wider text-left"
            >
              ACCOUNT SETTINGS & PREFERENCES
            </div>

            <div className="divide-y divide-purple-900/40 w-full text-left">
              {/* 1. Profiles and personal details */}
              <button
                type="button"
                onClick={() => setActiveSection('profile')}
                className="w-full flex items-center justify-between p-4 hover:bg-purple-950/30 transition cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3.5 text-left">
                  <span className="text-xl shrink-0">👤</span>
                  <div className="text-left">
                    <p className="font-semibold text-sm text-white group-hover:text-pink-400 transition-colors text-left">
                      Profiles and personal details
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 text-left">
                      {profileData.name} • {profileData.email}
                    </p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-white transition-colors text-sm shrink-0 pl-2">›</span>
              </button>

              {/* 2. Password and security */}
              <button
                type="button"
                onClick={() => setActiveSection('password')}
                className="w-full flex items-center justify-between p-4 hover:bg-purple-950/30 transition cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3.5 text-left">
                  <span className="text-xl shrink-0">🔒</span>
                  <div className="text-left">
                    <p className="font-semibold text-sm text-white group-hover:text-pink-400 transition-colors text-left">
                      Password and security
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 text-left">
                      2FA {securityMeta.twoFactorEnabled ? 'On' : 'Off'} • Last updated: {securityMeta.lastChangedAt}
                    </p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-white transition-colors text-sm shrink-0 pl-2">›</span>
              </button>

              {/* 3. Connected experiences */}
              <button
                type="button"
                onClick={() => setActiveSection('connected')}
                className="w-full flex items-center justify-between p-4 hover:bg-purple-950/30 transition cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3.5 text-left">
                  <span className="text-xl shrink-0">🔗</span>
                  <div className="text-left">
                    <p className="font-semibold text-sm text-white group-hover:text-pink-400 transition-colors text-left">
                      Connected experiences
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 text-left">Manage linked social & gaming accounts</p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-white transition-colors text-sm shrink-0 pl-2">›</span>
              </button>

              {/* 4. Your information and permissions */}
              <button
                type="button"
                onClick={() => setActiveSection('permissions')}
                className="w-full flex items-center justify-between p-4 hover:bg-purple-950/30 transition cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3.5 text-left">
                  <span className="text-xl shrink-0">📋</span>
                  <div className="text-left">
                    <p className="font-semibold text-sm text-white group-hover:text-pink-400 transition-colors text-left">
                      Your information and permissions
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 text-left">App access, camera, and location</p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-white transition-colors text-sm shrink-0 pl-2">›</span>
              </button>

              {/* 5. Ad preferences */}
              <button
                type="button"
                onClick={() => setActiveSection('ads')}
                className="w-full flex items-center justify-between p-4 hover:bg-purple-950/30 transition cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3.5 text-left">
                  <span className="text-xl shrink-0">📢</span>
                  <div className="text-left">
                    <p className="font-semibold text-sm text-white group-hover:text-pink-400 transition-colors text-left">
                      Ad preferences
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 text-left">Manage personalized ads and topics</p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-white transition-colors text-sm shrink-0 pl-2">›</span>
              </button>

              {/* 6. Manage accounts */}
              <button
                type="button"
                onClick={() => setActiveSection('accounts')}
                className="w-full flex items-center justify-between p-4 hover:bg-purple-950/30 transition cursor-pointer group text-left"
              >
                <div className="flex items-center gap-3.5 text-left">
                  <span className="text-xl shrink-0">⚙</span>
                  <div className="text-left">
                    <p className="font-semibold text-sm text-white group-hover:text-pink-400 transition-colors text-left">
                      Manage accounts
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 text-left">Add or remove connected accounts</p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-white transition-colors text-sm shrink-0 pl-2">›</span>
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{ textAlign: 'left' }}
            className="bg-[#120e26]/90 border border-purple-500/30 rounded-2xl p-6 shadow-[0_0_25px_rgba(147,51,234,0.15)] text-left"
          >
            <button
              type="button"
              onClick={() => {
                setErrorMsg('');
                setActiveSection(null);
              }}
              className="text-pink-400 text-xs font-semibold mb-4 hover:underline flex items-center gap-1 cursor-pointer text-left"
            >
              ← Back to Accounts Center
            </button>

            {activeSection === 'profile' && (
              <div style={{ textAlign: 'left' }} className="text-left">
                <h2 style={{ textAlign: 'left' }} className="text-lg font-bold mb-4 text-white text-left">
                  Profiles and Personal Details
                </h2>
                <div className="space-y-3 text-left">
                  <div className="text-left">
                    <label style={{ textAlign: 'left' }} className="text-[11px] text-slate-300 block mb-1 font-semibold text-left">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full bg-[#070514] border border-purple-500/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 text-left"
                    />
                  </div>
                  <div className="text-left">
                    <label style={{ textAlign: 'left' }} className="text-[11px] text-slate-300 block mb-1 font-semibold text-left">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full bg-[#070514] border border-purple-500/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 text-left"
                    />
                  </div>
                  <div className="text-left">
                    <label style={{ textAlign: 'left' }} className="text-[11px] text-slate-300 block mb-1 font-semibold text-left">
                      Bio / Geo-location details
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      className="w-full bg-[#070514] border border-purple-500/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 text-left"
                      rows={3}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSave('Profile details')}
                    className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl font-bold text-xs transition mt-2 cursor-pointer shadow-md text-center"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'password' && (
              <div style={{ textAlign: 'left' }} className="text-left">
                <h2 style={{ textAlign: 'left' }} className="text-lg font-bold mb-1 text-white text-left">
                  Password and Security
                </h2>
                <p style={{ textAlign: 'left' }} className="text-xs text-slate-400 mb-4 text-left">
                  Last password update: <span className="text-emerald-400 font-semibold">{securityMeta.lastChangedAt}</span>
                </p>

                <div className="space-y-3 text-left">
                  <div className="text-left">
                    <label style={{ textAlign: 'left' }} className="text-[11px] text-slate-300 block mb-1 font-semibold text-left">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={passData.currentPass}
                      onChange={(e) => setPassData({ ...passData, currentPass: e.target.value })}
                      className="w-full bg-[#070514] border border-purple-500/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 text-left"
                    />
                  </div>
                  <div className="text-left">
                    <label style={{ textAlign: 'left' }} className="text-[11px] text-slate-300 block mb-1 font-semibold text-left">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={passData.newPass}
                      onChange={(e) => setPassData({ ...passData, newPass: e.target.value })}
                      className="w-full bg-[#070514] border border-purple-500/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 text-left"
                    />
                    <div className="mt-1.5 text-left">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className={`${strength.color} font-semibold text-left`}>{strength.label}</span>
                        <span className="text-slate-400">Min 6 chars</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-emerald-400 transition-all duration-300"
                          style={{ width: strength.width }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="text-left">
                    <label style={{ textAlign: 'left' }} className="text-[11px] text-slate-300 block mb-1 font-semibold text-left">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={passData.confirmPass}
                      onChange={(e) => setPassData({ ...passData, confirmPass: e.target.value })}
                      className="w-full bg-[#070514] border border-purple-500/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500 text-left"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handlePasswordUpdate}
                    className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl font-bold text-xs transition mt-2 cursor-pointer shadow-md text-center"
                  >
                    Update Password
                  </button>

                  {/* 2FA & Login Alerts */}
                  <div className="pt-4 mt-4 border-t border-purple-900/40 space-y-2.5 text-left">
                    <p style={{ textAlign: 'left' }} className="text-[11px] font-bold uppercase tracking-wider text-pink-400 text-left">
                      SECURITY ALERTS & 2-STEP VERIFICATION
                    </p>

                    <div className="flex items-center justify-between p-3 bg-[#070514] border border-purple-500/30 rounded-xl text-xs">
                      <div className="text-left pr-2">
                        <p className="font-semibold text-white text-left">Two-Factor Authentication (2FA)</p>
                        <p className="text-[11px] text-slate-400 text-left">Extra verification step on new logins</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={securityMeta.twoFactorEnabled}
                        onChange={(e) => {
                          const updated = { ...securityMeta, twoFactorEnabled: e.target.checked };
                          setSecurityMeta(updated);
                          persistSecurityAndBackend(updated);
                        }}
                        className="w-4 h-4 accent-pink-600 cursor-pointer shrink-0"
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 bg-[#070514] border border-purple-500/30 rounded-xl text-xs">
                      <div className="text-left pr-2">
                        <p className="font-semibold text-white text-left">Unrecognized Login Alerts</p>
                        <p className="text-[11px] text-slate-400 text-left">Alert on new device or session activity</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={securityMeta.loginAlerts}
                        onChange={(e) => {
                          const updated = { ...securityMeta, loginAlerts: e.target.checked };
                          setSecurityMeta(updated);
                          persistSecurityAndBackend(updated);
                        }}
                        className="w-4 h-4 accent-pink-600 cursor-pointer shrink-0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'connected' && (
              <div style={{ textAlign: 'left' }} className="text-left">
                <h2 style={{ textAlign: 'left' }} className="text-lg font-bold mb-2 text-white text-left">
                  Connected Experiences
                </h2>
                <p style={{ textAlign: 'left' }} className="text-slate-400 text-xs mb-4 text-left">
                  Manage apps and accounts linked for cross-platform sharing.
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-center justify-between p-3 bg-[#070514] border border-purple-500/30 rounded-xl text-sm">
                    <span className="text-left">Google Login</span>
                    <input
                      type="checkbox"
                      checked={connectedApps.google}
                      onChange={(e) => setConnectedApps({ ...connectedApps, google: e.target.checked })}
                      className="w-4 h-4 accent-pink-600 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#070514] border border-purple-500/30 rounded-xl text-sm">
                    <span className="text-left">Discord Integration</span>
                    <input
                      type="checkbox"
                      checked={connectedApps.discord}
                      onChange={(e) => setConnectedApps({ ...connectedApps, discord: e.target.checked })}
                      className="w-4 h-4 accent-pink-600 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#070514] border border-purple-500/30 rounded-xl text-sm">
                    <span className="text-left">GitHub Account</span>
                    <input
                      type="checkbox"
                      checked={connectedApps.github}
                      onChange={(e) => setConnectedApps({ ...connectedApps, github: e.target.checked })}
                      className="w-4 h-4 accent-pink-600 cursor-pointer"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSave('Connected experiences')}
                    className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl font-bold text-xs transition mt-4 cursor-pointer shadow-md text-center"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'permissions' && (
              <div style={{ textAlign: 'left' }} className="text-left">
                <h2 style={{ textAlign: 'left' }} className="text-lg font-bold mb-2 text-white text-left">
                  Information and Permissions
                </h2>
                <p style={{ textAlign: 'left' }} className="text-slate-400 text-xs mb-4 text-left">
                  Control what platform features can access.
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-center justify-between p-3 bg-[#070514] border border-purple-500/30 rounded-xl text-sm">
                    <span className="text-left">Camera Access</span>
                    <input
                      type="checkbox"
                      checked={permissions.camera}
                      onChange={(e) => setPermissions({ ...permissions, camera: e.target.checked })}
                      className="w-4 h-4 accent-pink-600 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#070514] border border-purple-500/30 rounded-xl text-sm">
                    <span className="text-left">Location Services (Geo-location)</span>
                    <input
                      type="checkbox"
                      checked={permissions.location}
                      onChange={(e) => setPermissions({ ...permissions, location: e.target.checked })}
                      className="w-4 h-4 accent-pink-600 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#070514] border border-purple-500/30 rounded-xl text-sm">
                    <span className="text-left">Push Notifications</span>
                    <input
                      type="checkbox"
                      checked={permissions.notifications}
                      onChange={(e) => setPermissions({ ...permissions, notifications: e.target.checked })}
                      className="w-4 h-4 accent-pink-600 cursor-pointer"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSave('Permissions')}
                    className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl font-bold text-xs transition mt-4 cursor-pointer shadow-md text-center"
                  >
                    Save Permissions
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'ads' && (
              <div style={{ textAlign: 'left' }} className="text-left">
                <h2 style={{ textAlign: 'left' }} className="text-lg font-bold mb-2 text-white text-left">
                  Ad Preferences
                </h2>
                <p style={{ textAlign: 'left' }} className="text-slate-400 text-xs mb-4 text-left">
                  Manage how ads are tailored to your interests.
                </p>
                <div className="space-y-3 text-left">
                  <div className="flex items-center justify-between p-3 bg-[#070514] border border-purple-500/30 rounded-xl text-sm">
                    <span className="text-left">Personalized Ads</span>
                    <input
                      type="checkbox"
                      checked={adPrefs.personalizedAds}
                      onChange={(e) => setAdPrefs({ ...adPrefs, personalizedAds: e.target.checked })}
                      className="w-4 h-4 accent-pink-600 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#070514] border border-purple-500/30 rounded-xl text-sm">
                    <span className="text-left">Sensitive Content Filter</span>
                    <input
                      type="checkbox"
                      checked={adPrefs.sensitiveContent}
                      onChange={(e) => setAdPrefs({ ...adPrefs, sensitiveContent: e.target.checked })}
                      className="w-4 h-4 accent-pink-600 cursor-pointer"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSave('Ad preferences')}
                    className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl font-bold text-xs transition mt-4 cursor-pointer shadow-md text-center"
                  >
                    Save Ad Preferences
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'accounts' && (
              <div style={{ textAlign: 'left' }} className="text-left">
                <h2 style={{ textAlign: 'left' }} className="text-lg font-bold mb-2 text-white text-left">
                  Manage Accounts
                </h2>
                <p style={{ textAlign: 'left' }} className="text-slate-400 text-xs mb-4 text-left">
                  Accounts linked to your main profile.
                </p>
                <div className="space-y-3 text-left">
                  {accountsList.map((acc) => (
                    <div
                      key={acc.id}
                      className="flex items-center justify-between p-3 bg-[#070514] border border-purple-500/30 rounded-xl text-sm"
                    >
                      <div className="text-left">
                        <p className="font-medium text-left">{acc.name}</p>
                        <span className="text-xs text-pink-400 text-left">{acc.type}</span>
                      </div>
                      <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Active</span>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newAcc = {
                        id: accountsList.length + 1,
                        name: `Sub Account ${accountsList.length + 1}`,
                        type: 'Secondary',
                      };
                      setAccountsList([...accountsList, newAcc]);
                      handleSave('New account added');
                    }}
                    className="w-full py-2.5 bg-[#070514] hover:bg-purple-950/40 border border-purple-500/30 rounded-xl font-semibold transition mt-2 cursor-pointer text-xs text-pink-400 text-center"
                  >
                    + Add Another Account
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}