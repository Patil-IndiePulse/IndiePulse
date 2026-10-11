'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function GamePlayerPage() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.id as string;
  
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(1240);

  const formattedTitle = gameId
    ? gameId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Indie Game';

  const handleLike = () => {
    if (!isLiked) {
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
    } else {
      setIsLiked(false);
      setLikeCount(prev => prev - 1);
    }
  };

  const handleFullScreen = () => {
    const elem = document.getElementById('game-container');
    if (elem) {
      if (!document.fullscreenElement) {
        elem.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
        });
      } else {
        document.exitFullscreen();
      }
    }
  };

  const handleStartSession = () => {
    router.push(`/games/${gameId}/play`);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col px-8 py-10 max-w-5xl mx-auto relative">
      <div className="mb-6">
        <button 
          onClick={() => router.push('/')}
          className="w-12 h-12 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center shadow-lg shadow-indigo-600/40 transition-all cursor-pointer"
          title="Back to Home"
        >
          <span className="text-xl font-bold text-white">←</span>
        </button>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-semibold px-2.5 py-1 bg-indigo-500/20 text-indigo-400 rounded-md uppercase tracking-wider">
            WebGL Game Player
          </span>
          <h1 className="text-3xl font-extrabold mt-2">{formattedTitle}</h1>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleLike}
            className={`px-4 py-2 border rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
              isLiked 
                ? 'bg-rose-500/20 border-rose-500 text-rose-400' 
                : 'bg-slate-900 border-slate-800 hover:border-indigo-500 text-white'
            }`}
          >
            <span>{isLiked ? '❤️' : '🤍'}</span>
            <span>{likeCount} Likes</span>
          </button>
          <button 
            onClick={handleFullScreen}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            Full Screen ⛶
          </button>
        </div>
      </div>

      <div 
        id="game-container" 
        className="w-full h-[480px] bg-slate-900 border border-slate-800 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950/40 via-purple-950/20 to-slate-950 pointer-events-none"></div>
        
        <div className="text-center z-10 p-6">
          <div className="w-20 h-20 bg-indigo-600/20 border border-indigo-500/50 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce">
            <span className="text-4xl">🎮</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Ready to Play?</h3>
          <p className="text-xs text-slate-400 max-w-md mb-6">
            This is the live WebGL sandbox container for <span className="text-indigo-300 font-semibold">{formattedTitle}</span>. Click below to open the game session page.
          </p>
          <button 
            onClick={handleStartSession}
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
          >
            Start Game Session ▶
          </button>
        </div>
      </div>

      <div className="mt-8 bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
        <h4 className="text-sm font-bold text-white mb-2">Controls & Instructions</h4>
        <p className="text-xs text-slate-400">
          Use Keyboard Arrow Keys or WASD to move. Press Spacebar to jump or interact with objects in the game world.
        </p>
      </div>
    </main>
  );
}