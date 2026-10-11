'use client';

import { useParams, useRouter } from 'next/navigation';

export default function GamePlaySession() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.id as string;

  const formattedTitle = gameId
    ? gameId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Indie Game';

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative">
      <button 
        onClick={() => router.back()}
        className="absolute top-6 left-6 w-12 h-12 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center shadow-lg transition-all cursor-pointer"
      >
        <span className="text-xl font-bold text-white">←</span>
      </button>

      <div className="text-center">
        <span className="text-xs px-3 py-1 bg-green-500/20 text-green-400 rounded-full uppercase tracking-wider font-semibold">
          Live Session Active
        </span>
        <h1 className="text-4xl font-extrabold mt-4 mb-2">{formattedTitle}</h1>
        <p className="text-slate-400 text-sm mb-8">Your game build is running inside this container.</p>
        
        <div className="w-[800px] h-[450px] bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center shadow-2xl">
          <p className="text-indigo-400 animate-pulse font-medium">🎮 Game Canvas / Unity / GDevelop Build Loading Here...</p>
        </div>
      </div>
    </main>
  );
}