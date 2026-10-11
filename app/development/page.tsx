'use client';

import Link from 'next/link';

export default function DevelopmentPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col p-8 relative">
      {/* Top Left Back Button (Larger & Clearer matching Login page) */}
      <div className="absolute top-6 left-8">
        <Link 
          href="/" 
          className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          title="Back to Home"
        >
          ←
        </Link>
      </div>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto w-full bg-slate-900/60 border border-slate-800 p-8 rounded-2xl shadow-xl mt-16">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-semibold px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-md">
            Core Drive 2
          </span>
          <span className="text-xs text-slate-400">Accomplishment & Progress Tracker</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">
          Development & Accomplishment
        </h1>
        
        <p className="text-slate-400 text-base mb-8">
          Here you can track your game builds, milestone achievements, and indie project review scores. Level up your developer profile by shipping updates!
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-950/50 border border-slate-800 p-5 rounded-xl">
            <h4 className="text-sm text-slate-400 mb-1">Uploaded Builds</h4>
            <p className="text-2xl font-bold text-indigo-400">03</p>
          </div>
          <div className="bg-slate-950/50 border border-slate-800 p-5 rounded-xl">
            <h4 className="text-sm text-slate-400 mb-1">Milestones Completed</h4>
            <p className="text-2xl font-bold text-purple-400">12 / 15</p>
          </div>
          <div className="bg-slate-950/50 border border-slate-800 p-5 rounded-xl">
            <h4 className="text-sm text-slate-400 mb-1">Developer Points (XP)</h4>
            <p className="text-2xl font-bold text-cyan-400">1,450 XP</p>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <a 
            href="/submit" 
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all inline-flex items-center gap-2"
          >
            <span>+</span> Upload New Game Build
          </a>
        </div>
      </div>
    </main>
  );
}