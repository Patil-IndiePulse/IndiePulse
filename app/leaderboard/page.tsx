'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LeaderboardPage() {
  const [users, setUsers] = useState([
    { name: "Rahul (You)", xp: 1250 },
    { name: "Aarav Dev", xp: 1190 },
    { name: "Neha_Gamer", xp: 1150 }
  ]);

  const earnPoints = () => {
    setUsers(prevUsers => {
      return prevUsers.map(user => {
        if (user.name.includes('You')) {
          return { ...user, xp: user.xp + 50 };
        }
        return user;
      }).sort((a, b) => b.xp - a.xp);
    });
  };

  const sortedUsers = [...users].sort((a, b) => b.xp - a.xp);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decorative Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Left Back Button (Changed background to blue) */}
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

      {/* Leaderboard Container */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl w-full max-w-lg shadow-2xl shadow-indigo-950/50 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
          GLOBAL RANKINGS
        </div>
        <h2 className="text-2xl font-black mb-2 tracking-tight">🏆 IndiePulse Leaderboard</h2>
        <p className="text-slate-400 text-sm mb-6">Compete with nearby developers and climb to the top!</p>
        
        <div className="flex flex-col gap-3 mb-6 text-left">
          {sortedUsers.map((user, index) => (
            <div 
              key={user.name} 
              className={`flex justify-between items-center p-4 rounded-xl transition-all ${
                user.name.includes('You') 
                  ? 'border border-indigo-500/50 bg-indigo-950/40 shadow-lg shadow-indigo-900/20' 
                  : 'bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-amber-400 w-6 text-center">{index + 1}</span>
                <span className="font-medium text-slate-200">{user.name}</span>
              </div>
              <span className="text-emerald-400 font-bold">{user.xp} XP</span>
            </div>
          ))}
        </div>
        
        <button 
          onClick={earnPoints} 
          className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-sm cursor-pointer flex items-center justify-center gap-2"
        >
          <span>✨</span> Complete Quest (+50 XP)
        </button>
      </div>
    </main>
  );
}