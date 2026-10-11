'use client';

import Link from 'next/link';

export default function SocialInfluencePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col p-8 relative">
      {/* Top Left Back Button */}
      <div className="absolute top-6 left-8">
        <Link 
          href="/" 
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white shadow-lg shadow-blue-600/40 transition-all cursor-pointer"
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
      <div className="max-w-4xl mx-auto w-full bg-slate-900/60 border border-slate-800 p-8 rounded-2xl shadow-xl mt-20">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-semibold px-3 py-1 bg-purple-500/20 text-purple-400 rounded-md">
            Core Drive 5
          </span>
          <span className="text-xs text-slate-400">Community Recognition & Status Tracker</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
          Social Influence & Peer Praise
        </h1>
        
        <p className="text-slate-400 text-base mb-8">
          Gain badges, unlock special creator status, and receive peer validation from global gamers by sharing your achievements and engaging with the community.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-950/50 border border-slate-800 p-5 rounded-xl">
            <h4 className="text-sm text-slate-400 mb-1">Badges Unlocked</h4>
            <p className="text-2xl font-bold text-purple-400">08 / 20</p>
          </div>
          <div className="bg-slate-950/50 border border-slate-800 p-5 rounded-xl">
            <h4 className="text-sm text-slate-400 mb-1">Peer Praises Received</h4>
            <p className="text-2xl font-bold text-pink-400">142</p>
          </div>
          <div className="bg-slate-950/50 border border-slate-800 p-5 rounded-xl">
            <h4 className="text-sm text-slate-400 mb-1">Creator Status</h4>
            <p className="text-2xl font-bold text-yellow-400">Rising Star</p>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <a 
            href="/community" 
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-purple-600/30 transition-all inline-flex items-center gap-2"
          >
            <span>✨</span> Showcase Achievements & Get Praise
          </a>
        </div>
      </div>
    </main>
  );
}