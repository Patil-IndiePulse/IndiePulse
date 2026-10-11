'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function YourActivityPage() {
  const [selectedView, setSelectedView] = useState<string | null>(null);

  const renderContent = () => {
    switch (selectedView) {
      case 'likes':
        return (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Game Likes & Favorites</h2>
            <div className="space-y-3">
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/50">
                <div className="text-sm font-bold text-white">Cyber Nexus // RPG</div>
                <div className="text-xs text-pink-400 mt-1">Liked 2 hours ago • Game</div>
              </div>
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/50">
                <div className="text-sm font-bold text-white">Neon Protocol Zero</div>
                <div className="text-xs text-pink-400 mt-1">Liked yesterday • Game</div>
              </div>
            </div>
          </div>
        );
      case 'reviews':
        return (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Reviews & Ratings</h2>
            <div className="space-y-3">
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/50">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-white">Quantum Runner 3D</span>
                  <span className="text-xs">⭐️⭐️⭐️⭐️⭐️</span>
                </div>
                <p className="text-xs text-slate-300">"Absolute masterpiece of indie arcade design!"</p>
              </div>
            </div>
          </div>
        );
      case 'comments':
        return (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Comments & DevLogs</h2>
            <div className="space-y-3">
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/50">
                <div className="text-xs text-slate-400 mb-1">On DevLog #4</div>
                <p className="text-xs text-slate-200">"Amazing lighting effects! Can't wait for the full release."</p>
              </div>
            </div>
          </div>
        );
      case 'published':
        return (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Published Games</h2>
            <div className="space-y-3">
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/50 flex justify-between items-center">
                <div>
                  <div className="text-sm font-bold text-white">Cyber Nexus // RPG</div>
                  <div className="text-xs text-slate-400 mt-1">Total Plays: 1.2k</div>
                </div>
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-xs font-bold">
                  Live
                </span>
              </div>
            </div>
          </div>
        );
      case 'posts':
        return (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Community Posts</h2>
            <div className="space-y-3">
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/50">
                <div className="text-sm font-medium text-white mb-2">"Just integrated dynamic lighting and shadow effects..."</div>
                <div className="text-xs text-pink-400 font-bold">❤️ 42 Likes • 12 Comments</div>
              </div>
            </div>
          </div>
        );
      case 'devlogs':
        return (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">DevLogs (Developer Logs)</h2>
            <div className="space-y-3">
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/50">
                <div className="text-sm font-bold text-white">DevLog #4: Lighting Setup</div>
                <div className="text-xs text-slate-400 mt-1">Published 3 days ago</div>
              </div>
            </div>
          </div>
        );
      case 'history':
        return (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Play History</h2>
            <div className="space-y-3">
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/50 flex justify-between">
                <span className="text-sm font-bold text-white">Quantum Runner 3D</span>
                <span className="text-xs text-slate-400">Today, 4:30 PM</span>
              </div>
            </div>
          </div>
        );
      case 'quests':
        return (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Earned Badges & Quests</h2>
            <div className="space-y-3">
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/50">
                <div className="text-sm font-bold text-white">🏆 Core Drive 2 Master</div>
                <div className="text-xs text-slate-400 mt-1">Unlocked by publishing 1st game build.</div>
              </div>
            </div>
          </div>
        );
      case 'saved':
        return (
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Saved / Bookmarked Projects</h2>
            <div className="space-y-3">
              <div className="p-4 bg-slate-800/80 rounded-xl border border-slate-700/50">
                <div className="text-sm font-bold text-white">Neon Protocol Zero</div>
                <div className="text-xs text-slate-400 mt-1">Bookmarked for offline testing</div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-[#070514] text-white flex flex-col px-4 py-8 max-w-2xl mx-auto w-full relative select-none">
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-pink-600/15 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Header & Back Button (Arrow removed, only 'Back' text) */}
      <div className="flex flex-col items-start gap-4 mb-6">
        {selectedView ? (
          <button 
            onClick={() => setSelectedView(null)}
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(236,72,153,0.4)] border border-pink-400/40 transition-all cursor-pointer"
          >
            Back
          </button>
        ) : (
          <Link 
            href="/menu" 
            className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(236,72,153,0.4)] border border-pink-400/40 transition-all cursor-pointer"
          >
            Back
          </Link>
        )}

        <h1 className="text-2xl font-black tracking-wide text-white">
          {selectedView ? 'Activity Details' : 'Your Activity'}
        </h1>
        <p className="text-xs text-slate-300">
          {selectedView ? 'Detailed view of your selected activity log.' : 'Manage your game interactions, published content, and play history across IndiePulse.'}
        </p>
      </div>

      {/* Dynamic View Container */}
      {selectedView ? (
        <div className="bg-slate-900/90 border border-pink-500/40 rounded-2xl p-6 shadow-[0_0_25px_rgba(236,72,153,0.15)]">
          {renderContent()}
        </div>
      ) : (
        <div className="bg-slate-900/90 border border-pink-500/40 rounded-2xl overflow-hidden divide-y divide-slate-800/80 shadow-[0_0_25px_rgba(236,72,153,0.15)] mb-6">
          
          {/* Section 1: Interactions */}
          <div className="p-3 bg-pink-500/10 text-pink-300 text-[10px] font-bold uppercase tracking-wider">
            Interactions & Feedback
          </div>

          <div onClick={() => setSelectedView('likes')} className="flex items-center justify-between p-4 hover:bg-slate-800/60 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-lg">❤️</span>
              <div>
                <div className="text-sm font-semibold text-white">Game Likes & Favorites</div>
                <div className="text-xs text-slate-400">View your bookmarked and liked indie games</div>
              </div>
            </div>
            <span className="text-pink-400">→</span>
          </div>

          <div onClick={() => setSelectedView('reviews')} className="flex items-center justify-between p-4 hover:bg-slate-800/60 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-lg">⭐</span>
              <div>
                <div className="text-sm font-semibold text-white">Reviews & Ratings</div>
                <div className="text-xs text-slate-400">Manage your ratings and game reviews</div>
              </div>
            </div>
            <span className="text-pink-400">→</span>
          </div>

          <div onClick={() => setSelectedView('comments')} className="flex items-center justify-between p-4 hover:bg-slate-800/60 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-lg">💬</span>
              <div>
                <div className="text-sm font-semibold text-white">Comments & DevLogs</div>
                <div className="text-xs text-slate-400">History of comments on community posts and developer logs</div>
              </div>
            </div>
            <span className="text-pink-400">→</span>
          </div>

          {/* Section 2: Content Shared */}
          <div className="p-3 bg-purple-500/10 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
            Content You Shared & Published
          </div>

          <div onClick={() => setSelectedView('published')} className="flex items-center justify-between p-4 hover:bg-slate-800/60 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-lg">🎮</span>
              <div>
                <div className="text-sm font-semibold text-white">Published Games</div>
                <div className="text-xs text-slate-400">Manage your uploaded builds and live indie projects</div>
              </div>
            </div>
            <span className="text-pink-400">→</span>
          </div>

          <div onClick={() => setSelectedView('posts')} className="flex items-center justify-between p-4 hover:bg-slate-800/60 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-lg">📢</span>
              <div>
                <div className="text-sm font-semibold text-white">Community Posts</div>
                <div className="text-xs text-slate-400">Your shared community updates and feeds</div>
              </div>
            </div>
            <span className="text-pink-400">→</span>
          </div>

          <div onClick={() => setSelectedView('devlogs')} className="flex items-center justify-between p-4 hover:bg-slate-800/60 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-lg">🛠️</span>
              <div>
                <div className="text-sm font-semibold text-white">DevLogs (Developer Logs)</div>
                <div className="text-xs text-slate-400">Track your game development progress logs</div>
              </div>
            </div>
            <span className="text-pink-400">→</span>
          </div>

          {/* Section 3: Gaming History */}
          <div className="p-3 bg-indigo-500/10 text-indigo-300 text-[10px] font-bold uppercase tracking-wider">
            Gaming History & Utility
          </div>

          <div onClick={() => setSelectedView('history')} className="flex items-center justify-between p-4 hover:bg-slate-800/60 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-lg">🕒</span>
              <div>
                <div className="text-sm font-semibold text-white">Play History</div>
                <div className="text-xs text-slate-400">History of games you have played recently</div>
              </div>
            </div>
            <span className="text-pink-400">→</span>
          </div>

          <div onClick={() => setSelectedView('quests')} className="flex items-center justify-between p-4 hover:bg-slate-800/60 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-lg">🏆</span>
              <div>
                <div className="text-sm font-semibold text-white">Earned Badges & Quests</div>
                <div className="text-xs text-slate-400">View completed octalysis quests and rewards</div>
              </div>
            </div>
            <span className="text-pink-400">→</span>
          </div>

          <div onClick={() => setSelectedView('saved')} className="flex items-center justify-between p-4 hover:bg-slate-800/60 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-lg">⭐</span>
              <div>
                <div className="text-sm font-semibold text-white">Saved / Bookmarked Projects</div>
                <div className="text-xs text-slate-400">Projects saved for future gameplay or inspection</div>
              </div>
            </div>
            <span className="text-pink-400">→</span>
          </div>

        </div>
      )}
    </main>
  );
}