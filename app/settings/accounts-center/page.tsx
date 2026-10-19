'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AccountsCenter() {
  const router = useRouter();

  // State to track which sub-page is open
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Form data states
  const [profileData, setProfileData] = useState({ name: 'Indie Creator', email: 'creator@indiepulse.com', bio: 'Passionate developer' });
  const [passData, setPassData] = useState({ currentPass: '', newPass: '', confirmPass: '' });
  const [connectedApps, setConnectedApps] = useState({ google: true, discord: false, github: true });
  const [permissions, setPermissions] = useState({ camera: true, location: false, notifications: true });
  const [adPrefs, setAdPrefs] = useState({ personalizedAds: true, sensitiveContent: false });
  const [accountsList, setAccountsList] = useState([{ id: 1, name: 'IndiePulse Main Account', type: 'Primary' }]);

  const [message, setMessage] = useState('');

  const handleSave = (sectionName: string) => {
    setMessage(`${sectionName} saved successfully!`);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <main className="min-h-screen bg-[#070514] text-white flex flex-col px-4 py-8 max-w-2xl mx-auto w-full relative select-none">
      
      {/* Background glow matching Account Privacy page */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-pink-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Back Button and Header */}
      <div className="flex flex-col items-start gap-4 mb-6 relative z-10">
        <button 
          onClick={() => router.back()} 
          className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(236,72,153,0.4)] border border-pink-400/40 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          Back
        </button>
        <div className="w-full">
          <h1 className="text-2xl font-black tracking-wide text-white">Accounts Center</h1>
          <p className="text-xs text-slate-300 mt-1">Manage your connected experiences and account settings across IndiePulse technologies.</p>
        </div>
      </div>

      <div className="w-full relative z-10">

        {/* Success save message */}
        {message && (
          <div className="mb-4 p-3 bg-emerald-600/20 border border-emerald-500 text-emerald-300 rounded-xl text-sm animate-pulse">
            {message}
          </div>
        )}

        {/* If no sub-page is open, show the main 6 options */}
        {!activeSection ? (
          <div className="bg-[#120e26]/90 border border-purple-500/30 rounded-2xl overflow-hidden shadow-[0_0_25px_rgba(147,51,234,0.15)]">
            
            <div className="p-3.5 bg-gradient-to-r from-pink-900/40 to-purple-900/40 text-pink-400 text-[11px] font-bold uppercase tracking-wider">
              ACCOUNT SETTINGS & PREFERENCES
            </div>

            <div className="divide-y divide-purple-900/40">
              
              {/* 1. Profiles and personal details */}
              <button 
                onClick={() => setActiveSection('profile')}
                className="w-full flex items-center justify-between p-4 hover:bg-purple-950/30 transition text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-xl">👤</span>
                  <div>
                    <p className="font-semibold text-sm text-white group-hover:text-pink-400 transition-colors">Profiles and personal details</p>
                    <p className="text-xs text-slate-400 mt-0.5">Manage your name, email, and bio</p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-white transition-colors text-sm">›</span>
              </button>

              {/* 2. Password and security */}
              <button 
                onClick={() => setActiveSection('password')}
                className="w-full flex items-center justify-between p-4 hover:bg-purple-950/30 transition text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-xl">🔒</span>
                  <div>
                    <p className="font-semibold text-sm text-white group-hover:text-pink-400 transition-colors">Password and security</p>
                    <p className="text-xs text-slate-400 mt-0.5">Change password, security alerts</p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-white transition-colors text-sm">›</span>
              </button>

              {/* 3. Connected experiences */}
              <button 
                onClick={() => setActiveSection('connected')}
                className="w-full flex items-center justify-between p-4 hover:bg-purple-950/30 transition text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-xl">🔗</span>
                  <div>
                    <p className="font-semibold text-sm text-white group-hover:text-pink-400 transition-colors">Connected experiences</p>
                    <p className="text-xs text-slate-400 mt-0.5">Manage linked social & gaming accounts</p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-white transition-colors text-sm">›</span>
              </button>

              {/* 4. Your information and permissions */}
              <button 
                onClick={() => setActiveSection('permissions')}
                className="w-full flex items-center justify-between p-4 hover:bg-purple-950/30 transition text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-xl">📋</span>
                  <div>
                    <p className="font-semibold text-sm text-white group-hover:text-pink-400 transition-colors">Your information and permissions</p>
                    <p className="text-xs text-slate-400 mt-0.5">App access, camera, and location</p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-white transition-colors text-sm">›</span>
              </button>

              {/* 5. Ad preferences */}
              <button 
                onClick={() => setActiveSection('ads')}
                className="w-full flex items-center justify-between p-4 hover:bg-purple-950/30 transition text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-xl">📢</span>
                  <div>
                    <p className="font-semibold text-sm text-white group-hover:text-pink-400 transition-colors">Ad preferences</p>
                    <p className="text-xs text-slate-400 mt-0.5">Manage personalized ads and topics</p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-white transition-colors text-sm">›</span>
              </button>

              {/* 6. Manage accounts */}
              <button 
                onClick={() => setActiveSection('accounts')}
                className="w-full flex items-center justify-between p-4 hover:bg-purple-950/30 transition text-left cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <span className="text-xl">⚙</span>
                  <div>
                    <p className="font-semibold text-sm text-white group-hover:text-pink-400 transition-colors">Manage accounts</p>
                    <p className="text-xs text-slate-400 mt-0.5">Add or remove connected accounts</p>
                  </div>
                </div>
                <span className="text-slate-400 group-hover:text-white transition-colors text-sm">›</span>
              </button>

            </div>

          </div>
        ) : (
          /* When user clicks an option, open its sub-page */
          <div className="bg-[#120e26]/90 border border-purple-500/30 rounded-2xl p-6 shadow-[0_0_25px_rgba(147,51,234,0.15)]">
            
            {/* Back button to return to Accounts Center main view */}
            <button 
              onClick={() => setActiveSection(null)}
              className="text-pink-400 text-xs font-semibold mb-4 hover:underline flex items-center gap-1 cursor-pointer"
            >
              ← Back to Accounts Center
            </button>

            {/* 1. Profile and Personal Details Form */}
            {activeSection === 'profile' && (
              <div>
                <h2 className="text-lg font-bold mb-4 text-white">Profiles and Personal Details</h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1 font-semibold">Full Name</label>
                    <input 
                      type="text" 
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full bg-[#070514] border border-purple-500/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1 font-semibold">Email Address</label>
                    <input 
                      type="email" 
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full bg-[#070514] border border-purple-500/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1 font-semibold">Bio / Geo-location details</label>
                    <textarea 
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      className="w-full bg-[#070514] border border-purple-500/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500"
                      rows={3}
                    />
                  </div>
                  <button 
                    onClick={() => handleSave('Profile details')}
                    className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl font-bold text-xs transition mt-2 cursor-pointer shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* 2. Password and Security Form */}
            {activeSection === 'password' && (
              <div>
                <h2 className="text-lg font-bold mb-4 text-white">Password and Security</h2>
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1 font-semibold">Current Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={passData.currentPass}
                      onChange={(e) => setPassData({...passData, currentPass: e.target.value})}
                      className="w-full bg-[#070514] border border-purple-500/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1 font-semibold">New Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={passData.newPass}
                      onChange={(e) => setPassData({...passData, newPass: e.target.value})}
                      className="w-full bg-[#070514] border border-purple-500/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 block mb-1 font-semibold">Confirm New Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={passData.confirmPass}
                      onChange={(e) => setPassData({...passData, confirmPass: e.target.value})}
                      className="w-full bg-[#070514] border border-purple-500/40 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-pink-500"
                    />
                  </div>
                  <button 
                    onClick={() => handleSave('Password')}
                    className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl font-bold text-xs transition mt-2 cursor-pointer shadow-md"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {/* 3. Connected Experiences */}
            {activeSection === 'connected' && (
              <div>
                <h2 className="text-lg font-bold mb-2 text-white">Connected Experiences</h2>
                <p className="text-slate-400 text-xs mb-4">Manage apps and accounts linked for cross-platform sharing.</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#070514] border border-purple-500/30 rounded-xl text-sm">
                    <span>Google Login</span>
                    <input 
                      type="checkbox" 
                      checked={connectedApps.google} 
                      onChange={(e) => setConnectedApps({...connectedApps, google: e.target.checked})}
                      className="w-4 h-4 accent-pink-600 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#070514] border border-purple-500/30 rounded-xl text-sm">
                    <span>Discord Integration</span>
                    <input 
                      type="checkbox" 
                      checked={connectedApps.discord} 
                      onChange={(e) => setConnectedApps({...connectedApps, discord: e.target.checked})}
                      className="w-4 h-4 accent-pink-600 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#070514] border border-purple-500/30 rounded-xl text-sm">
                    <span>GitHub Account</span>
                    <input 
                      type="checkbox" 
                      checked={connectedApps.github} 
                      onChange={(e) => setConnectedApps({...connectedApps, github: e.target.checked})}
                      className="w-4 h-4 accent-pink-600 cursor-pointer"
                    />
                  </div>
                  <button 
                    onClick={() => handleSave('Connected experiences')}
                    className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl font-bold text-xs transition mt-4 cursor-pointer shadow-md"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* 4. Information and Permissions */}
            {activeSection === 'permissions' && (
              <div>
                <h2 className="text-lg font-bold mb-2 text-white">Information and Permissions</h2>
                <p className="text-slate-400 text-xs mb-4">Control what platform features can access.</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#070514] border border-purple-500/30 rounded-xl text-sm">
                    <span>Camera Access</span>
                    <input 
                      type="checkbox" 
                      checked={permissions.camera} 
                      onChange={(e) => setPermissions({...permissions, camera: e.target.checked})}
                      className="w-4 h-4 accent-pink-600 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#070514] border border-purple-500/30 rounded-xl text-sm">
                    <span>Location Services (Geo-location)</span>
                    <input 
                      type="checkbox" 
                      checked={permissions.location} 
                      onChange={(e) => setPermissions({...permissions, location: e.target.checked})}
                      className="w-4 h-4 accent-pink-600 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#070514] border border-purple-500/30 rounded-xl text-sm">
                    <span>Push Notifications</span>
                    <input 
                      type="checkbox" 
                      checked={permissions.notifications} 
                      onChange={(e) => setPermissions({...permissions, notifications: e.target.checked})}
                      className="w-4 h-4 accent-pink-600 cursor-pointer"
                    />
                  </div>
                  <button 
                    onClick={() => handleSave('Permissions')}
                    className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl font-bold text-xs transition mt-4 cursor-pointer shadow-md"
                  >
                    Save Permissions
                  </button>
                </div>
              </div>
            )}

            {/* 5. Ad Preferences */}
            {activeSection === 'ads' && (
              <div>
                <h2 className="text-lg font-bold mb-2 text-white">Ad Preferences</h2>
                <p className="text-slate-400 text-xs mb-4">Manage how ads are tailored to your interests.</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-[#070514] border border-purple-500/30 rounded-xl text-sm">
                    <span>Personalized Ads</span>
                    <input 
                      type="checkbox" 
                      checked={adPrefs.personalizedAds} 
                      onChange={(e) => setAdPrefs({...adPrefs, personalizedAds: e.target.checked})}
                      className="w-4 h-4 accent-pink-600 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#070514] border border-purple-500/30 rounded-xl text-sm">
                    <span>Sensitive Content Filter</span>
                    <input 
                      type="checkbox" 
                      checked={adPrefs.sensitiveContent} 
                      onChange={(e) => setAdPrefs({...adPrefs, sensitiveContent: e.target.checked})}
                      className="w-4 h-4 accent-pink-600 cursor-pointer"
                    />
                  </div>
                  <button 
                    onClick={() => handleSave('Ad preferences')}
                    className="w-full py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl font-bold text-xs transition mt-4 cursor-pointer shadow-md"
                  >
                    Save Ad Preferences
                  </button>
                </div>
              </div>
            )}

            {/* 6. Manage Accounts */}
            {activeSection === 'accounts' && (
              <div>
                <h2 className="text-lg font-bold mb-2 text-white">Manage Accounts</h2>
                <p className="text-slate-400 text-xs mb-4">Accounts linked to your main profile.</p>
                <div className="space-y-3">
                  {accountsList.map((acc) => (
                    <div key={acc.id} className="flex items-center justify-between p-3 bg-[#070514] border border-purple-500/30 rounded-xl text-sm">
                      <div>
                        <p className="font-medium">{acc.name}</p>
                        <span className="text-xs text-pink-400">{acc.type}</span>
                      </div>
                      <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">Active</span>
                    </div>
                  ))}
                  <button 
                    onClick={() => {
                      const newAcc = { id: accountsList.length + 1, name: `Sub Account ${accountsList.length + 1}`, type: 'Secondary' };
                      setAccountsList([...accountsList, newAcc]);
                      handleSave('New account added');
                    }}
                    className="w-full py-2.5 bg-[#070514] hover:bg-purple-950/40 border border-purple-500/30 rounded-xl font-semibold transition mt-2 cursor-pointer text-xs text-pink-400"
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