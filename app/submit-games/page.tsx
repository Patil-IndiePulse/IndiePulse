'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SubmitGame() {
  const [gameTitle, setGameTitle] = useState('');
  const [description, setDescription] = useState('');
  const [gameUrl, setGameUrl] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameTitle && gameUrl) {
      setSubmitted(true);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white px-8 py-10 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="text-indigo-400 text-sm hover:underline">← Back to Home</Link>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <h1 className="text-2xl font-bold mb-2">Publish Your Indie Game</h1>
        <p className="text-slate-400 text-sm mb-6">Share your creation with the global IndiePulse community.</p>

        {submitted ? (
          <div className="bg-emerald-950 border border-emerald-700 text-emerald-200 p-6 rounded-xl text-center">
            <h3 className="text-lg font-bold mb-1">🎉 Game Published Successfully!</h3>
            <p className="text-xs text-emerald-400 mb-4">Your game is now live on the platform ecosystem.</p>
            <Link href="/" className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold">
              Go to Home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Game Title</label>
              <input 
                type="text" 
                value={gameTitle} 
                onChange={(e) => setGameTitle(e.target.value)}
                placeholder="e.g., Cyber Runner 2D" 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                required 
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe your game, controls, and features..." 
                rows={3}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Game Embed URL / WebGL Link</label>
              <input 
                type="text" 
                value={gameUrl} 
                onChange={(e) => setGameUrl(e.target.value)}
                placeholder="https://itch.io/embed-or-playable-link" 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-indigo-500"
                required 
              />
            </div>

            <button 
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-lg transition-all cursor-pointer mt-4"
            >
              Publish Game Now
            </button>
          </form>
        )}
      </div>
    </main>
  );
}