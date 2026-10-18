'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LeaderboardPage() {
  const [users, setUsers] = useState([
    { name: "Rahul (You)", xp: 1250 },
    { name: "Aarav Dev", xp: 1190 },
    { name: "Neha_Gamer", xp: 1150 }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const earnPoints = () => {
    setUsers(prevUsers => {
      return prevUsers.map(user => {
        if (user.name.includes('You')) {
          return { ...user, xp: user.xp + 50 };
        }
        return user;
      }).sort((a, b) => b.xp - a.xp);
    });
    setIsModalOpen(true);
  };

  const sortedUsers = [...users].sort((a, b) => b.xp - a.xp);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col px-4 py-6 max-w-xl mx-auto w-full relative overflow-x-hidden select-none">
      
      {/* Background Decorative Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Row with Clear Pink 'Back' Button */}
      <div className="w-full flex items-start mb-6 relative z-10">
        <Link 
          href="/" 
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-sm font-bold shadow-[0_0_20px_rgba(236,72,153,0.5)] border border-pink-400/40 transition-all flex items-center justify-center cursor-pointer"
        >
          Back
        </Link>
      </div>

      {/* Leaderboard Container */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl w-full shadow-2xl shadow-indigo-950/50 text-center relative z-10">
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

      {/* Quest Completed Popup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center relative animate-in fade-in zoom-in duration-200">
            
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-lg font-black text-white mb-2">Quest Completed!</h3>
            <p className="text-slate-300 text-xs mb-6 leading-relaxed">
              Congratulations! You have successfully completed the daily developer quest and earned <span className="text-emerald-400 font-bold">+50 XP</span>!
            </p>

            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all text-xs cursor-pointer border border-pink-400/40"
            >
              Claim & Close 🚀
            </button>

          </div>
        </div>
      )}

    </main>
  );
}