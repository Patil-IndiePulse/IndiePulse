'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AccountPrivacyPage() {
  const [privacySettings, setPrivacySettings] = useState({
    privateProfile: false,
    showOnlineStatus: true,
    showGameActivity: true,
    allowDMs: true,
    taggingAllowed: true,
  });

  const togglePrivacy = (key: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <main className="min-h-screen bg-[#070514] text-white flex flex-col px-4 py-8 max-w-2xl mx-auto w-full relative select-none">
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-pink-600/15 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Back Button pointing directly to /menu */}
      <div className="flex flex-col items-start gap-4 mb-6">
        <Link 
          href="/menu" 
          className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(236,72,153,0.4)] border border-pink-400/40 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          Back
        </Link>
        <h1 className="text-2xl font-black tracking-wide text-white">Account Privacy</h1>
        <p className="text-xs text-slate-300">Control who can view your indie profile, game activity, and interact with your projects across IndiePulse.</p>
      </div>

      <div className="bg-[#120e26]/90 border border-purple-500/30 rounded-2xl overflow-hidden divide-y divide-purple-900/40 shadow-[0_0_25px_rgba(147,51,234,0.15)] mb-6">
        
        <div className="p-3.5 bg-gradient-to-r from-pink-900/40 to-purple-900/40 text-pink-400 text-[11px] font-bold uppercase tracking-wider">
          Profile Visibility & Status
        </div>

        <div className="flex items-center justify-between p-4 hover:bg-purple-950/30 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-lg">🔒</span>
            <div>
              <div className="text-sm font-semibold text-white">Private Account</div>
              <div className="text-xs text-slate-400">When active, only your approved followers can see your games and posts</div>
            </div>
          </div>
          <input 
            type="checkbox" 
            checked={privacySettings.privateProfile} 
            onChange={() => togglePrivacy('privateProfile')}
            className="w-4 h-4 accent-pink-600 cursor-pointer" 
          />
        </div>

        <div className="flex items-center justify-between p-4 hover:bg-purple-950/30 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-lg">🟢</span>
            <div>
              <div className="text-sm font-semibold text-white">Show Online Status</div>
              <div className="text-xs text-slate-400">Let other developers and gamers see when you are active on the platform</div>
            </div>
          </div>
          <input 
            type="checkbox" 
            checked={privacySettings.showOnlineStatus} 
            onChange={() => togglePrivacy('showOnlineStatus')}
            className="w-4 h-4 accent-pink-600 cursor-pointer" 
          />
        </div>

        <div className="flex items-center justify-between p-4 hover:bg-purple-950/30 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-lg">🎮</span>
            <div>
              <div className="text-sm font-semibold text-white">Display Gameplay & Build Activity</div>
              <div className="text-xs text-slate-400">Show what indie games you are playing or which projects you are coding</div>
            </div>
          </div>
          <input 
            type="checkbox" 
            checked={privacySettings.showGameActivity} 
            onChange={() => togglePrivacy('showGameActivity')}
            className="w-4 h-4 accent-pink-600 cursor-pointer" 
          />
        </div>

        <div className="p-3.5 bg-gradient-to-r from-pink-900/40 to-purple-900/40 text-pink-400 text-[11px] font-bold uppercase tracking-wider">
          Interactions & Community
        </div>

        <div className="flex items-center justify-between p-4 hover:bg-purple-950/30 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-lg">💬</span>
            <div>
              <div className="text-sm font-semibold text-white">Allow Direct Messages (DMs)</div>
              <div className="text-xs text-slate-400">Allow other community members to send you private messages</div>
            </div>
          </div>
          <input 
            type="checkbox" 
            checked={privacySettings.allowDMs} 
            onChange={() => togglePrivacy('allowDMs')}
            className="w-4 h-4 accent-pink-600 cursor-pointer" 
          />
        </div>

        <div className="flex items-center justify-between p-4 hover:bg-purple-950/30 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-lg">🏷️</span>
            <div>
              <div className="text-sm font-semibold text-white">Tagging & Mentions</div>
              <div className="text-xs text-slate-400">Allow other users to tag you in DevLogs, comments, and game posts</div>
            </div>
          </div>
          <input 
            type="checkbox" 
            checked={privacySettings.taggingAllowed} 
            onChange={() => togglePrivacy('taggingAllowed')}
            className="w-4 h-4 accent-pink-600 cursor-pointer" 
          />
        </div>

      </div>
    </main>
  );
}