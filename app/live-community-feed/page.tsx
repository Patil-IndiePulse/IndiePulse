'use client';

import Link from 'next/link';

export default function LiveFeedPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Navbar Section */}
      <nav className="w-full border-b border-slate-800/80 px-8 py-4 flex items-center justify-between">
        <div className="text-2xl font-black tracking-wider bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          IndiePulse
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/" 
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm font-medium transition-all text-white"
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 px-8 py-10 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <span className="text-xs font-semibold px-3 py-1 bg-pink-500/20 text-pink-400 rounded-md uppercase tracking-wider">
            Live Stream & Updates
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-3 mb-2">
            Community Live Discussions
          </h1>
          <p className="text-slate-400 text-sm">
            Real-time broadcast, live developer Q&A sessions, and instant community milestones.
          </p>
        </div>

        {/* Live Feed Unique Content Boxes */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-red-500/20 text-red-400 text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> LIVE NOW
            </div>
            
            <h3 className="text-lg font-bold mb-2">🎮 Alpha Playtest Stream: Cyber Neon Runner</h3>
            <p className="text-sm text-slate-300 mb-4">
              Join PixelCraft Studios as they live-code and test dynamic lighting glitches in real-time. Drop your questions in the chat!
            </p>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800">
              <span>👥 340 Developers Watching</span>
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all">
                Join Stream Room
              </button>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl">
            <h3 className="text-lg font-bold mb-2">⚡ Weekly Dev Jam #12 Results</h3>
            <p className="text-sm text-slate-400 mb-4">
              The results are in! Check out which indie games scored the highest in Core Drive 2 (Accomplishment) this week.
            </p>
            <div className="text-xs text-indigo-400 font-medium">
              <span>🏆 View Leaderboard Rankings →</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}