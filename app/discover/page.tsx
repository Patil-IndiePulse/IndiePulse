'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function DiscoverPage() {
  const [games, setGames] = useState([
    { title: "Cyber Neon Runner", creator: "Aarav Dev", genre: "Action / Sci-Fi", plays: "3.4k plays" },
    { title: "Mystic Quest RPG", creator: "Neha_Gamer", genre: "Adventure", plays: "2.8k plays" },
    { title: "Pixel Bounce", creator: "Rahul (You)", genre: "Arcade", plays: "1.5k plays" }
  ]);

  const [allGames, setAllGames] = useState([
    { title: "Cyber Neon Runner", creator: "Aarav Dev", genre: "Action / Sci-Fi", plays: "3.4k plays" },
    { title: "Mystic Quest RPG", creator: "Neha_Gamer", genre: "Adventure", plays: "2.8k plays" },
    { title: "Pixel Bounce", creator: "Rahul (You)", genre: "Arcade", plays: "1.5k plays" },
    { title: "Galactic Wars", creator: "StarStudio", genre: "Shooter", plays: "4.1k plays" },
    { title: "Speed Drift X", creator: "TurboGamer", genre: "Racing", plays: "5.2k plays" }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col px-4 py-6 max-w-xl mx-auto w-full relative overflow-x-hidden select-none">
      
      {/* Background Decorative Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Row with Clear Pink 'Back' Button */}
      <div className="w-full flex items-start mb-6 relative z-10">
        <Link 
          href="/" 
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-sm font-bold shadow-[0_0_20px_rgba(236,72,153,0.5)] border border-pink-400/40 transition-all flex items-center justify-center cursor-pointer"
        >
          Back
        </Link>
      </div>

      {/* Discover Container */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl w-full shadow-2xl shadow-cyan-950/50 text-center relative z-10">
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
              <div className="text-right shrink-0">
                <span className="text-emerald-400 font-bold text-sm">{game.plays}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full py-3.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-cyan-600/30 transition-all text-sm cursor-pointer"
          >
            🔥 Browse All Games
          </button>
        </div>
      </div>

      {/* Browse All Games Popup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 whitespace-nowrap">
                <span>🔥</span> All Indie Games Catalog
              </h3>
            </div>

            {/* Catalog List */}
            <div className="flex flex-col gap-3 mb-6 max-h-[320px] overflow-y-auto pr-1 text-left">
              {allGames.map((game, index) => (
                <div 
                  key={index} 
                  className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-slate-800"
                >
                  <div>
                    <h4 className="font-bold text-white text-sm">{game.title}</h4>
                    <p className="text-[11px] text-slate-400">By {game.creator} • <span className="text-cyan-400">{game.genre}</span></p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-emerald-400 font-bold text-xs">{game.plays}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Cancel Button with Pink Gradient Theme */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all text-xs cursor-pointer border border-pink-400/40"
            >
              Cancel
            </button>

          </div>
        </div>
      )}

    </main>
  );
}