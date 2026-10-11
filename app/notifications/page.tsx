'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState({
    gameReleases: true,
    gameUpdates: true,
    comments: true,
    mentions: true,
    livestreams: false,
    gameJams: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
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
          className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(236,72,153,0.4)] border border-pink-400/40 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          Back
        </Link>
        <h1 className="text-2xl font-black tracking-wide text-white">Notifications</h1>
        <p className="text-xs text-slate-300">Manage how you receive game updates, community alerts, and developer live streams across IndiePulse.</p>
      </div>

      <div className="bg-slate-900/90 border border-pink-500/40 rounded-2xl overflow-hidden divide-y divide-slate-800/80 shadow-[0_0_25px_rgba(236,72,153,0.15)] mb-6">
        
        <div className="p-3 bg-pink-500/10 text-pink-300 text-[10px] font-bold uppercase tracking-wider">
          Games & Projects Updates
        </div>

        <div className="flex items-center justify-between p-4 hover:bg-slate-800/60 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-lg">🎮</span>
            <div>
              <div className="text-sm font-semibold text-white">New Game Releases</div>
              <div className="text-xs text-slate-400">Get notified when developers publish brand new indie games</div>
            </div>
          </div>
          <input 
            type="checkbox" 
            checked={notifications.gameReleases} 
            onChange={() => toggleNotification('gameReleases')}
            className="w-4 h-4 accent-pink-600 cursor-pointer" 
          />
        </div>

        <div className="flex items-center justify-between p-4 hover:bg-slate-800/60 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-lg">⚡</span>
            <div>
              <div className="text-sm font-semibold text-white">Game Patches & Updates</div>
              <div className="text-xs text-slate-400">Alerts for updates and bug fixes on games you follow</div>
            </div>
          </div>
          <input 
            type="checkbox" 
            checked={notifications.gameUpdates} 
            onChange={() => toggleNotification('gameUpdates')}
            className="w-4 h-4 accent-pink-600 cursor-pointer" 
          />
        </div>

        <div className="p-3 bg-purple-500/10 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
          Community & Social Activity
        </div>

        <div className="flex items-center justify-between p-4 hover:bg-slate-800/60 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-lg">💬</span>
            <div>
              <div className="text-sm font-semibold text-white">Comments & Reviews</div>
              <div className="text-xs text-slate-400">When someone comments on your game or reviews your project</div>
            </div>
          </div>
          <input 
            type="checkbox" 
            checked={notifications.comments} 
            onChange={() => toggleNotification('comments')}
            className="w-4 h-4 accent-pink-600 cursor-pointer" 
          />
        </div>

        <div className="flex items-center justify-between p-4 hover:bg-slate-800/60 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-lg">🏷️</span>
            <div>
              <div className="text-sm font-semibold text-white">Mentions & Tags</div>
              <div className="text-xs text-slate-400">Get notified when you are tagged in community posts or DevLogs</div>
            </div>
          </div>
          <input 
            type="checkbox" 
            checked={notifications.mentions} 
            onChange={() => toggleNotification('mentions')}
            className="w-4 h-4 accent-pink-600 cursor-pointer" 
          />
        </div>

        <div className="p-3 bg-indigo-500/10 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
          Events & Live Streams
        </div>

        <div className="flex items-center justify-between p-4 hover:bg-slate-800/60 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-lg">🔴</span>
            <div>
              <div className="text-sm font-semibold text-white">Developer Live Streams</div>
              <div className="text-xs text-slate-400">Alerts when followed indie creators go live building games</div>
            </div>
          </div>
          <input 
            type="checkbox" 
            checked={notifications.livestreams} 
            onChange={() => toggleNotification('livestreams')}
            className="w-4 h-4 accent-pink-600 cursor-pointer" 
          />
        </div>

        <div className="flex items-center justify-between p-4 hover:bg-slate-800/60 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-lg">🏆</span>
            <div>
              <div className="text-sm font-semibold text-white">Game Jams & Competitions</div>
              <div className="text-xs text-slate-400">Reminders for upcoming community game jams and event deadlines</div>
            </div>
          </div>
          <input 
            type="checkbox" 
            checked={notifications.gameJams} 
            onChange={() => toggleNotification('gameJams')}
            className="w-4 h-4 accent-pink-600 cursor-pointer" 
          />
        </div>

      </div>
    </main>
  );
}