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

  // Function to show save success message
  const handleSave = (sectionName: string) => {
    setMessage(`${sectionName} saved successfully!`);
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12">
      {/* Header and back button */}
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => router.back()} 
            className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition cursor-pointer"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold">Accounts Center</h1>
        </div>

        <p className="text-slate-400 text-sm mb-6">
          Manage your connected experiences and account settings across IndiePulse technologies.
        </p>

        {/* Success save message */}
        {message && (
          <div className="mb-4 p-3 bg-emerald-600/20 border border-emerald-500 text-emerald-300 rounded-xl text-sm animate-pulse">
            {message}
          </div>
        )}

        {/* If no sub-page is open, show the main 6 options */}
        {!activeSection ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            
            {/* 1. Profiles and personal details */}
            <button 
              onClick={() => setActiveSection('profile')}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-800/60 transition border-b border-slate-800 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">👤</span>
                <div>
                  <p className="font-medium">Profiles and personal details</p>
                  <p className="text-xs text-slate-400">Manage your name, email, and bio</p>
                </div>
              </div>
              <span className="text-slate-400">›</span>
            </button>

            {/* 2. Password and security */}
            <button 
              onClick={() => setActiveSection('password')}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-800/60 transition border-b border-slate-800 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🔒</span>
                <div>
                  <p className="font-medium">Password and security</p>
                  <p className="text-xs text-slate-400">Change password, security alerts</p>
                </div>
              </div>
              <span className="text-slate-400">›</span>
            </button>

            {/* 3. Connected experiences */}
            <button 
              onClick={() => setActiveSection('connected')}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-800/60 transition border-b border-slate-800 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">🔗</span>
                <div>
                  <p className="font-medium">Connected experiences</p>
                  <p className="text-xs text-slate-400">Manage linked social & gaming accounts</p>
                </div>
              </div>
              <span className="text-slate-400">›</span>
            </button>

            {/* 4. Your information and permissions */}
            <button 
              onClick={() => setActiveSection('permissions')}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-800/60 transition border-b border-slate-800 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">📋</span>
                <div>
                  <p className="font-medium">Your information and permissions</p>
                  <p className="text-xs text-slate-400">App access, camera, and location</p>
                </div>
              </div>
              <span className="text-slate-400">›</span>
            </button>

            {/* 5. Ad preferences */}
            <button 
              onClick={() => setActiveSection('ads')}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-800/60 transition border-b border-slate-800 text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">📢</span>
                <div>
                  <p className="font-medium">Ad preferences</p>
                  <p className="text-xs text-slate-400">Manage personalized ads and topics</p>
                </div>
              </div>
              <span className="text-slate-400">›</span>
            </button>

            {/* 6. Manage accounts */}
            <button 
              onClick={() => setActiveSection('accounts')}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-800/60 transition text-left cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">⚙</span>
                <div>
                  <p className="font-medium">Manage accounts</p>
                  <p className="text-xs text-slate-400">Add or remove connected accounts</p>
                </div>
              </div>
              <span className="text-slate-400">›</span>
            </button>

          </div>
        ) : (
          /* When user clicks an option, open its sub-page */
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            
            {/* Back button to return to Accounts Center main view */}
            <button 
              onClick={() => setActiveSection(null)}
              className="text-indigo-400 text-sm mb-4 hover:underline flex items-center gap-1 cursor-pointer"
            >
              ← Back to Accounts Center
            </button>

            {/* 1. Profile and Personal Details Form */}
            {activeSection === 'profile' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Profiles and Personal Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Email Address</label>
                    <input 
                      type="email" 
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Bio / Geo-location details</label>
                    <textarea 
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                      rows={3}
                    />
                  </div>
                  <button 
                    onClick={() => handleSave('Profile details')}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition mt-2 cursor-pointer"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            )}

            {/* 2. Password and Security Form */}
            {activeSection === 'password' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Password and Security</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Current Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={passData.currentPass}
                      onChange={(e) => setPassData({...passData, currentPass: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">New Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={passData.newPass}
                      onChange={(e) => setPassData({...passData, newPass: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Confirm New Password</label>
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      value={passData.confirmPass}
                      onChange={(e) => setPassData({...passData, confirmPass: e.target.value})}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button 
                    onClick={() => handleSave('Password')}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition mt-2 cursor-pointer"
                  >
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {/* 3. Connected Experiences */}
            {activeSection === 'connected' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Connected Experiences</h2>
                <p className="text-slate-400 text-sm mb-4">Manage apps and accounts linked for cross-platform sharing.</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                    <span>Google Login</span>
                    <input 
                      type="checkbox" 
                      checked={connectedApps.google} 
                      onChange={(e) => setConnectedApps({...connectedApps, google: e.target.checked})}
                      className="w-5 h-5 accent-indigo-600 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                    <span>Discord Integration</span>
                    <input 
                      type="checkbox" 
                      checked={connectedApps.discord} 
                      onChange={(e) => setConnectedApps({...connectedApps, discord: e.target.checked})}
                      className="w-5 h-5 accent-indigo-600 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                    <span>GitHub Account</span>
                    <input 
                      type="checkbox" 
                      checked={connectedApps.github} 
                      onChange={(e) => setConnectedApps({...connectedApps, github: e.target.checked})}
                      className="w-5 h-5 accent-indigo-600 cursor-pointer"
                    />
                  </div>
                  <button 
                    onClick={() => handleSave('Connected experiences')}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition mt-4 cursor-pointer"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* 4. Information and Permissions */}
            {activeSection === 'permissions' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Information and Permissions</h2>
                <p className="text-slate-400 text-sm mb-4">Control what platform features can access.</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                    <span>Camera Access</span>
                    <input 
                      type="checkbox" 
                      checked={permissions.camera} 
                      onChange={(e) => setPermissions({...permissions, camera: e.target.checked})}
                      className="w-5 h-5 accent-indigo-600 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                    <span>Location Services (Geo-location)</span>
                    <input 
                      type="checkbox" 
                      checked={permissions.location} 
                      onChange={(e) => setPermissions({...permissions, location: e.target.checked})}
                      className="w-5 h-5 accent-indigo-600 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                    <span>Push Notifications</span>
                    <input 
                      type="checkbox" 
                      checked={permissions.notifications} 
                      onChange={(e) => setPermissions({...permissions, notifications: e.target.checked})}
                      className="w-5 h-5 accent-indigo-600 cursor-pointer"
                    />
                  </div>
                  <button 
                    onClick={() => handleSave('Permissions')}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition mt-4 cursor-pointer"
                  >
                    Save Permissions
                  </button>
                </div>
              </div>
            )}

            {/* 5. Ad Preferences */}
            {activeSection === 'ads' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Ad Preferences</h2>
                <p className="text-slate-400 text-sm mb-4">Manage how ads are tailored to your interests.</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                    <span>Personalized Ads</span>
                    <input 
                      type="checkbox" 
                      checked={adPrefs.personalizedAds} 
                      onChange={(e) => setAdPrefs({...adPrefs, personalizedAds: e.target.checked})}
                      className="w-5 h-5 accent-indigo-600 cursor-pointer"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                    <span>Sensitive Content Filter</span>
                    <input 
                      type="checkbox" 
                      checked={adPrefs.sensitiveContent} 
                      onChange={(e) => setAdPrefs({...adPrefs, sensitiveContent: e.target.checked})}
                      className="w-5 h-5 accent-indigo-600 cursor-pointer"
                    />
                  </div>
                  <button 
                    onClick={() => handleSave('Ad preferences')}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-semibold transition mt-4 cursor-pointer"
                  >
                    Save Ad Preferences
                  </button>
                </div>
              </div>
            )}

            {/* 6. Manage Accounts */}
            {activeSection === 'accounts' && (
              <div>
                <h2 className="text-xl font-bold mb-4">Manage Accounts</h2>
                <p className="text-slate-400 text-sm mb-4">Accounts linked to your main profile.</p>
                <div className="space-y-3">
                  {accountsList.map((acc) => (
                    <div key={acc.id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
                      <div>
                        <p className="font-medium">{acc.name}</p>
                        <span className="text-xs text-indigo-400">{acc.type}</span>
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
                    className="w-full py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-semibold transition mt-2 cursor-pointer"
                  >
                    + Add Another Account
                  </button>
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}