'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function DevelopmentPage() {
  const [uploadedBuildsCount, setUploadedBuildsCount] = useState<number>(3);
  const [milestones] = useState<string>('12 / 15');
  const [xpPoints, setXpPoints] = useState<string>('1,450 XP');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedGames = localStorage.getItem('indiePulse_submitted_games');
      if (savedGames) {
        try {
          const parsed = JSON.parse(savedGames);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setUploadedBuildsCount(parsed.length);
            setXpPoints(`${parsed.length * 350 + 400} XP`);
          }
        } catch (e) {
          // Fallback default
        }
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col p-8 relative">
      {/* Top Left Back Button */}
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
          <span className="text-xs text-slate-400 font-medium">Accomplishment & Progress Tracker</span>
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
            <p className="text-2xl font-bold text-indigo-400">
              {uploadedBuildsCount < 10 ? `0${uploadedBuildsCount}` : uploadedBuildsCount}
            </p>
          </div>
          <div className="bg-slate-950/50 border border-slate-800 p-5 rounded-xl">
            <h4 className="text-sm text-slate-400 mb-1">Milestones Completed</h4>
            <p className="text-2xl font-bold text-purple-400">{milestones}</p>
          </div>
          <div className="bg-slate-950/50 border border-slate-800 p-5 rounded-xl">
            <h4 className="text-sm text-slate-400 mb-1">Developer Points (XP)</h4>
            <p className="text-2xl font-bold text-cyan-400">{xpPoints}</p>
          </div>
        </div>

        {/* Action Button */}
        <div>
          <Link 
            href="/submit" 
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/30 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>+</span> Upload New Game Build
          </Link>
        </div>
      </div>
    </main>
  );
}