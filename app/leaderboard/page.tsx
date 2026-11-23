'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LeaderboardPage() {
  const [users, setUsers] = useState([
    { name: "Rahul (You)", xp: 1250, streak: "6d 🔥", role: "Creator" },
    { name: "Aarav Dev", xp: 1190, streak: "4d 🔥", role: "Creator" },
    { name: "Neha_Gamer", xp: 1150, streak: "5d 🔥", role: "Playtester" }
  ]);

  const [leaderboardTab, setLeaderboardTab] = useState<'creators' | 'playtesters'>('creators');
  const [syncedProfilePic, setSyncedProfilePic] = useState<string | null>(null);
  const [syncedProfileName, setSyncedProfileName] = useState<string>('Rahul (You)');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const resolveUserName = (name: string) => {
    if (name.includes('You')) {
      return syncedProfileName ? `${syncedProfileName} (You)` : name;
    }
    return name;
  };

  useEffect(() => {
    const readName = () => {
      const keys = ['indiePulse_name', 'indiePulse_profile_name', 'indiePulse_user_name', 'indiePulse_username'];
      for (const key of keys) {
        const val = localStorage.getItem(key);
        if (val && val.trim()) {
          return val.trim();
        }
      }
      return 'Rahul (You)';
    };

    const syncProfile = () => {
      setSyncedProfilePic(localStorage.getItem('indiePulse_pic'));
      const fetchedName = readName();
      setSyncedProfileName(fetchedName);
    };

    syncProfile();
    window.addEventListener('storage', syncProfile);
    window.addEventListener('focus', syncProfile);
    return () => {
      window.removeEventListener('storage', syncProfile);
      window.removeEventListener('focus', syncProfile);
    };
  }, []);

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

  const sortedUsers = [...users]
    .filter(u => leaderboardTab === 'creators' ? true : u.role === 'Playtester' || u.name.includes('You'))
    .sort((a, b) => b.xp - a.xp);

  const myIndex = sortedUsers.findIndex(u => u.name.includes('You'));
  const myUser = myIndex >= 0 ? sortedUsers[myIndex] : null;
  const rivalAbove = myIndex > 0 ? sortedUsers[myIndex - 1] : null;
  const xpNeededForNext = rivalAbove && myUser ? Math.max(0, rivalAbove.xp - myUser.xp + 1) : 0;
  const progressPercent = rivalAbove && myUser
    ? Math.min(100, Math.max(15, Math.round((myUser.xp / (rivalAbove.xp + 1)) * 100)))
    : 100;

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col px-4 py-6 max-w-xl mx-auto w-full relative overflow-x-hidden select-none">
      
      {/* Background Decorative Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Row with Clear Pink 'Back' Button */}
      <div className="w-full flex items-center justify-between mb-6 relative z-10">
        <Link 
          href="/" 
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-sm font-bold shadow-[0_0_20px_rgba(236,72,153,0.5)] border border-pink-400/40 transition-all flex items-center justify-center cursor-pointer"
        >
          Back
        </Link>

        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-full">
          <div className="w-6 h-6 rounded-full overflow-hidden border border-pink-500/60 bg-slate-800 flex items-center justify-center shrink-0">
            {syncedProfilePic ? (
              <img src={syncedProfilePic} alt={syncedProfileName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[10px] font-bold text-pink-400">{syncedProfileName.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <span className="text-xs font-bold text-slate-200 truncate max-w-[120px]">{syncedProfileName}</span>
        </div>
      </div>

      {/* Leaderboard Container */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl w-full shadow-2xl shadow-indigo-950/50 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
          GLOBAL RANKINGS • SEASON 01
        </div>
        <h2 className="text-2xl font-black mb-2 tracking-tight">🏆 IndiePulse Leaderboard</h2>
        <p className="text-slate-400 text-sm mb-4">Compete with nearby developers and climb to the top!</p>

        {/* Dual-Pulse Mode Switch */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => setLeaderboardTab('creators')}
            className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              leaderboardTab === 'creators'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Top Creators
          </button>
          <button
            type="button"
            onClick={() => setLeaderboardTab('playtesters')}
            className={`py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              leaderboardTab === 'playtesters'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🧪 Playtest Hunters
          </button>
        </div>

        {/* Next Target Rivalry Bar */}
        {myUser && (
          <div className="mb-5 p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-left">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-indigo-300">
                {rivalAbove
                  ? `🎯 Next Target: Overtake ${resolveUserName(rivalAbove.name)}`
                  : '👑 You are #1 on this board!'}
              </span>
              <span className="font-bold text-emerald-400">
                {rivalAbove ? `+${xpNeededForNext} XP needed` : 'TOP RANK'}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
        
        <div className="flex flex-col gap-3 mb-6 text-left">
          {sortedUsers.map((user, index) => {
            const isMe = user.name.includes('You');
            const displayName = resolveUserName(user.name);

            return (
              <div 
                key={user.name} 
                className={`flex justify-between items-center p-4 rounded-xl transition-all ${
                  isMe 
                    ? 'border border-indigo-500/50 bg-indigo-950/40 shadow-lg shadow-indigo-900/20' 
                    : 'bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-extrabold text-amber-400 w-6 text-center shrink-0">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                  </span>
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-600 bg-slate-900 flex items-center justify-center shrink-0">
                    {isMe && syncedProfilePic ? (
                      <img src={syncedProfilePic} alt={displayName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-indigo-300">{displayName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium text-slate-200 truncate">{displayName}</span>
                    <span className="text-[10px] text-slate-400">{user.role} • {user.streak}</span>
                  </div>
                </div>
                <span className="text-emerald-400 font-bold shrink-0">{user.xp} XP</span>
              </div>
            );
          })}
        </div>
        
        <button 
          onClick={earnPoints} 
          className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-sm cursor-pointer flex items-center justify-center gap-2 mb-5"
        >
          <span>✨</span> Complete Quest (+50 XP)
        </button>

        {/* Hall of Fame Strip */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/20 text-left">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
            🏛️ Season Hall of Fame
          </span>
          <p className="text-xs text-slate-300">
            Current Champion Track: <span className="font-bold text-white">{resolveUserName(sortedUsers[0]?.name || 'Rahul (You)')}</span> leads with <span className="font-bold text-emerald-400">{sortedUsers[0]?.xp || 1250} XP</span>.
          </p>
        </div>
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