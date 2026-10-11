'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function QuestsPage() {
  const [quests, setQuests] = useState([
    { id: 1, title: "🚀 Publish Your First Indie Game", xp: 500, completed: false },
    { id: 2, title: "🤝 Connect with 3 Nearby Developers", xp: 150, completed: false },
    { id: 3, title: "📢 Share a DevLog Update in Community", xp: 100, completed: true }
  ]);

  const toggleQuest = (id: number) => {
    setQuests(prev =>
      prev.map(q => q.id === id ? { ...q, completed: !q.completed } : q)
    );
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decorative Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Left Back Button */}
      <div className="absolute top-6 left-6 z-10">
        <Link 
          href="/" 
          className="w-12 h-12 bg-blue-600 hover:bg-blue-700 border border-blue-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer group"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
      </div>

      {/* Quests Container */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl w-full max-w-xl shadow-2xl shadow-amber-950/50 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
          🌟 DAILY & SPECIAL QUESTS 🎯
        </div>
        <h2 className="text-2xl font-black mb-2 tracking-tight">🗺️ IndiePulse Quests ⚔️</h2>
        <p className="text-slate-400 text-sm mb-6">Complete quests, level up your profile, and earn exciting XP rewards! 🎁</p>
        
        {/* Quests List */}
        <div className="flex flex-col gap-3 mb-6 text-left">
          {quests.map((quest) => (
            <div 
              key={quest.id} 
              className={`flex justify-between items-center p-4 rounded-xl border transition-all ${
                quest.completed 
                  ? 'bg-slate-900/40 border-emerald-500/30 opacity-75' 
                  : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800'
              }`}
            >
              <div>
                <h3 className={`font-bold text-sm ${quest.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                  {quest.title}
                </h3>
                <span className="text-xs text-amber-400 font-semibold">✨ +{quest.xp} XP Reward ⚡</span>
              </div>
              <button 
                onClick={() => toggleQuest(quest.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  quest.completed 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-600/30'
                }`}
              >
                {quest.completed ? 'Completed 🎉' : 'Start Quest 🚀'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}