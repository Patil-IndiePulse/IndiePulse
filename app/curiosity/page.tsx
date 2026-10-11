'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CuriosityPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [bonusXP, setBonusXP] = useState(500); // सुरुवातीची XP 500 आहे

  const handleOpenBox = () => {
    setIsOpen(true);
  };

  const handleClaimReward = () => {
    setRewardClaimed(true);
    setBonusXP(750); // क्लेम केल्यावर XP वाढून 750 होईल
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col p-8 relative">
      {/* Back Button */}
      <div className="absolute top-6 left-8">
        <Link 
          href="/" 
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white shadow-lg transition-all cursor-pointer"
          title="Back to Home"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2.5} 
            stroke="currentColor" 
            className="w-7 h-7"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
        </Link>
      </div>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto w-full bg-slate-900/60 border border-slate-800 p-8 rounded-2xl shadow-xl mt-16">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-semibold px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-md">
            Core Drive 7
          </span>
          <span className="text-xs text-slate-400">Mystery & Surprise Tracker</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
          Unpredictability & Curiosity
        </h1>

        <p className="text-slate-400 text-base md:text-lg mb-8 max-w-2xl">
          Unlock secret community drops, mystery game tests, and surprise rewards as you level up your profile and engage with the platform.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl">
            <p className="text-xs text-slate-400 mb-1">Secret Drops Found</p>
            <h3 className="text-2xl font-bold text-cyan-400">05</h3>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl">
            <p className="text-xs text-slate-400 mb-1">Mystery Tests Unlocked</p>
            <h3 className="text-2xl font-bold text-indigo-400">02</h3>
          </div>
          <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-xl">
            <p className="text-xs text-slate-400 mb-1">Surprise Bonus XP</p>
            {/* लाईव्ह बदलणारी XP मूल्य */}
            <h3 className="text-2xl font-bold text-purple-400">+{bonusXP} XP</h3>
          </div>
        </div>

        {/* Open Mystery Reward Box Button */}
        <button
          onClick={handleOpenBox}
          className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:opacity-95 text-white font-semibold rounded-xl shadow-lg shadow-cyan-600/20 transition-all cursor-pointer flex items-center gap-2"
        >
          🎁 Open Mystery Reward Box
        </button>
      </div>

      {/* Pop-up Modal when box is clicked */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl">
            <div className="text-5xl mb-4">🎁</div>
            <h3 className="text-2xl font-bold mb-2">Mystery Reward Box</h3>
            
            {!rewardClaimed ? (
              <>
                <p className="text-slate-400 text-sm mb-6">
                  You discovered a rare mystery box! Click below to reveal your surprise reward.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={handleClaimReward}
                    className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-indigo-600 rounded-xl text-sm font-semibold hover:opacity-90 transition-all cursor-pointer"
                  >
                    Claim Reward 🚀
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl mb-6">
                  <p className="text-cyan-300 font-semibold text-lg">🎉 Congratulations!</p>
                  <p className="text-slate-300 text-sm mt-1">
                    You won <span className="font-bold text-white">+250 Bonus XP</span> and an Exclusive Creator Badge!
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-semibold transition-all cursor-pointer"
                >
                  Awesome!
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}