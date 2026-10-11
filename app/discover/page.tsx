'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DiscoverPage() {
  const [games, setGames] = useState([
    { title: "Cyber Neon Runner", creator: "Aarav Dev", genre: "Action / Sci-Fi", plays: "3.4k" },
    { title: "Mystic Quest RPG", creator: "Neha_Gamer", genre: "Adventure", plays: "2.8k" },
    { title: "Pixel Bounce", creator: "Rahul (You)", genre: "Arcade", plays: "1.5k" }
  ]);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decorative Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

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

      {/* Discover Container */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl w-full max-w-xl shadow-2xl shadow-cyan-950/50 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold mb-3">
          DISCOVER GAMES
        </div>
        <h2 className="text-2xl font-black mb-2 tracking-tight">🎮 Explore Indie Titles</h2>
        <p className="text-slate-400 text-sm mb-6">Play, explore, and support unique indie games created by developers!</p>
        
        <div className="flex flex-col gap-3 mb-6 text-left">
          {games.map((game, index) => (
            <div 
              key={index} 
              className="flex justify-between items-center p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-all"
            >
              <div>
                <h3 className="font-bold text-slate-100 text-base">{game.title}</h3>
                <p className="text-xs text-slate-400">By {game.creator} • <span className="text-cyan-400">{game.genre}</span></p>
              </div>
              <div className="text-right">
                <span className="text-emerald-400 font-bold text-sm block">{game.plays} plays</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-3">
          <button 
            className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-cyan-600/30 transition-all text-sm cursor-pointer"
          >
            🔥 Browse All Games
          </button>
        </div>
      </div>
    </main>
  );
}