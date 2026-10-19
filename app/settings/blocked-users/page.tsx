'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function BlockedUsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newReason, setNewReason] = useState('');

  const [blockedList, setBlockedList] = useState([
    { id: 1, name: 'CyberGamer99', handle: '@cybergamer99', reason: 'Toxic comments on game post', avatar: '🎮' },
    { id: 2, name: 'GlitchMaster', handle: '@glitch_dev', reason: 'Spamming direct messages', avatar: '⚡' },
    { id: 3, name: 'PixelPhantom', handle: '@phantom_x', reason: 'Inappropriate community behavior', avatar: '👾' },
  ]);

  const handleUnblock = (id: number) => {
    setBlockedList(blockedList.filter(user => user.id !== id));
  };

  const handleBlockNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) return;

    const newUser = {
      id: Date.now(),
      name: newUsername,
      handle: `@${newUsername.toLowerCase().replace(/\s+/g, '')}`,
      reason: newReason.trim() || 'Blocked by user preference',
      avatar: '👤',
    };

    setBlockedList([newUser, ...blockedList]);
    setNewUsername('');
    setNewReason('');
    setShowBlockModal(false);
  };

  const filteredUsers = blockedList.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.handle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-[#070514] text-white flex flex-col px-4 py-8 max-w-2xl mx-auto w-full relative select-none">
      
      {/* Background glow matching Notifications page */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-pink-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Back Button and Header */}
      <div className="flex flex-col items-start gap-4 mb-6">
        <Link 
          href="/menu" 
          className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(236,72,153,0.4)] border border-pink-400/40 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          Back
        </Link>
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-2xl font-black tracking-wide text-white">Blocked Users</h1>
            <p className="text-xs text-slate-300 mt-1">Manage accounts you have restricted or blocked from viewing your profile.</p>
          </div>
          <button
            onClick={() => setShowBlockModal(true)}
            className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all cursor-pointer border border-pink-400/50 flex items-center gap-1.5"
          >
            + Block New
          </button>
        </div>
      </div>

      {/* Modal / New Page view to Block User */}
      {showBlockModal && (
        <div className="mb-6 bg-[#120e26] border border-pink-500/50 rounded-2xl p-5 shadow-[0_0_30px_rgba(236,72,153,0.2)] animate-fadeIn">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-bold text-pink-400 uppercase tracking-wider">Block a New Account</h2>
            <button 
              onClick={() => setShowBlockModal(false)}
              className="text-slate-400 hover:text-white text-sm font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
          <form onSubmit={handleBlockNewUser} className="space-y-3">
            <div>
              <label className="block text-[11px] text-slate-300 mb-1 font-semibold">Username or Handle</label>
              <input
                type="text"
                placeholder="e.g. ToxicityMaster"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="w-full bg-[#070514] border border-purple-500/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-300 mb-1 font-semibold">Reason for blocking (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Spamming comments"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                className="w-full bg-[#070514] border border-purple-500/40 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBlockModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Block Account
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Search Bar for Blocked Users */}
      <div className="relative mb-6">
        <span className="absolute left-4 top-3.5 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Search blocked users by name or handle..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#120e26] border border-purple-500/30 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-pink-500 transition-all shadow-inner"
        />
      </div>

      {/* Main Container */}
      <div className="bg-[#120e26]/90 border border-purple-500/30 rounded-2xl overflow-hidden divide-y divide-purple-900/40 shadow-[0_0_25px_rgba(147,51,234,0.15)] mb-6">
        
        <div className="p-3.5 bg-gradient-to-r from-pink-900/40 to-purple-900/40 text-pink-400 text-[11px] font-bold uppercase tracking-wider">
          Restricted & Blocked Accounts ({filteredUsers.length})
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No blocked users found matching your search.
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 hover:bg-purple-950/30 transition-colors">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-600/30 to-purple-600/30 border border-pink-500/40 flex items-center justify-center text-lg shadow-inner">
                  {user.avatar}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white flex items-center gap-2">
                    {user.name} 
                    <span className="text-[11px] text-pink-400/80 font-normal">{user.handle}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{user.reason}</div>
                </div>
              </div>
              
              <button 
                onClick={() => handleUnblock(user.id)}
                className="px-3.5 py-1.5 rounded-xl bg-[#1e1638] hover:bg-pink-600/30 text-pink-400 border border-pink-500/30 text-xs font-semibold transition-all cursor-pointer shadow-sm"
              >
                Unblock
              </button>
            </div>
          ))
        )}

      </div>
    </main>
  );
}