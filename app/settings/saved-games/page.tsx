'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SavedGamesPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [gamesList, setGamesList] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
    } else {
      setIsDarkMode(true);
    }

    const mockUploadedGames = [
      { 
        id: 1, 
        title: 'Cyber Nexus // RPG', 
        genre: 'Action / Sci-Fi', 
        developer: 'Studio Alpha', 
        plays: '1.2K',
        description: 'An immersive cyberpunk role-playing adventure uploaded by an indie developer.',
        version: 'v2.4.1'
      },
      { 
        id: 2, 
        title: 'Neon Protocol Zero', 
        genre: 'Strategy', 
        developer: 'Matrix Labs', 
        plays: '850',
        description: 'A tactical grid-based strategy simulation test built on indie engine.',
        version: 'v1.0.8'
      },
      { 
        id: 3, 
        title: 'Quantum Runner 3D', 
        genre: 'Arcade', 
        developer: 'Pixel Vortex', 
        plays: '3.4K',
        description: 'Fast-paced futuristic endless runner game featuring neon obstacles.',
        version: 'v1.5.0'
      },
    ];

    try {
      const storedGamesObj = JSON.parse(localStorage.getItem('indipulse_games') || '{}');
      const userSubmittedGames = Object.values(storedGamesObj).map((game: any) => ({
        id: game.id,
        title: game.title,
        genre: game.genre || 'Action / RPG',
        developer: game.developer || 'Indie Creator',
        plays: '0',
        description: game.description,
        version: 'v1.0.0'
      }));

      setGamesList([...userSubmittedGames, ...mockUploadedGames]);
    } catch (error) {
      console.error('Failed to load local games', error);
      setGamesList(mockUploadedGames);
    }

    setLoading(false);
  }, []);

  const filteredGames = gamesList.filter(game => 
    game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    game.developer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePlayGame = (gameId: number | string) => {
    router.push(`/play/${gameId}`);
  };

  return (
    <main className={`min-h-screen flex flex-col px-4 py-8 max-w-5xl mx-auto w-full transition-colors duration-500 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Top Navigation - Compact Back Button */}
      <div className="flex items-center justify-between mb-6">
        <Link 
          href="/menu" 
          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(236,72,153,0.4)] border border-pink-400/40 transition-all cursor-pointer w-auto"
        >
          Back
        </Link>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-purple-500/30 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          <span className="text-[10px] uppercase tracking-widest text-purple-300">Live Server: Ready</span>
        </div>
      </div>

      {/* Small Clean Header Box (Removed extra text) */}
      <div className="relative mb-6 p-4 rounded-2xl bg-gradient-to-br from-purple-950/50 via-slate-900/80 to-pink-950/30 border border-purple-500/30 backdrop-blur-2xl shadow-xl text-left">
        <h1 className="text-xl md:text-2xl font-black tracking-tight bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400 bg-clip-text text-transparent text-left">
          Saved Games & Projects
        </h1>
      </div>

      {/* Clean Search Bar with 'Search game' */}
      <div className="mb-6">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-purple-400">🔍</span>
          <input 
            type="text" 
            placeholder="Search game" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-900/80 border border-purple-500/30 text-white text-xs focus:outline-none focus:border-pink-500 shadow-xl transition-all backdrop-blur-md text-left"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xs text-pink-400 tracking-widest uppercase animate-pulse">Syncing Developer Database...</p>
        </div>
      ) : (
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs uppercase tracking-widest text-purple-400">Available Games ({filteredGames.length})</h2>
            <span className="text-[10px] text-slate-500">Click any game to play instantly</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGames.length > 0 ? (
              filteredGames.map((game) => (
                <div 
                  key={game.id} 
                  className="p-5 rounded-3xl bg-slate-900/80 border border-purple-500/30 hover:border-pink-500/60 transition-all duration-300 flex flex-col justify-between shadow-xl backdrop-blur-md group text-left"
                >
                  <div className="text-left">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-1 rounded-lg bg-purple-950 border border-purple-500/40 text-[10px] text-purple-300 uppercase">{game.genre}</span>
                      <span className="text-[10px] text-slate-400">Plays: {game.plays}</span>
                    </div>
                    <h3 className="text-lg font-black text-white group-hover:text-pink-400 transition-colors mb-1 text-left">{game.title}</h3>
                    <p className="text-xs text-slate-400 mb-4 line-clamp-2 text-left">{game.description}</p>
                    <p className="text-[10px] text-purple-300 mb-6 text-left">Developer: <span className="text-white font-bold">{game.developer}</span></p>
                  </div>

                  <button 
                    onClick={() => handlePlayGame(game.id)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-pink-600/30 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer"
                  >
                    Play Game Now 🎮
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-16 text-xs text-slate-500 bg-slate-900/40 rounded-3xl border border-slate-800">
                No games found matching "{searchQuery}"
              </div>
            )}
          </div>
        </div>
      )}

    </main>
  );
}