'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ProGamePlayer() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.id;

  const [gameTitle, setGameTitle] = useState('Neon Protocol Zero');
  const [gameGenre, setGameGenre] = useState('Action / Arcade');
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [targets, setTargets] = useState<{ id: number; x: number; y: number; type: string }[]>([]);
  const [isTheaterMode, setIsTheaterMode] = useState(false);

  useEffect(() => {
    const savedGames = JSON.parse(localStorage.getItem('indipulse_games') || '{}');
    
    if (savedGames[gameId as string]?.title) {
      setGameTitle(savedGames[gameId as string].title);
      setGameGenre(savedGames[gameId as string].genre || 'Indie / Custom');
    } else {
      const defaultGames: Record<string, { title: string; genre: string }> = {
        '1': { title: 'Cyber Nexus // RPG', genre: 'Action / Sci-Fi' },
        '2': { title: 'Neon Protocol Zero', genre: 'Strategy' },
        '3': { title: 'Quantum Runner 3D', genre: 'Arcade' }
      };
      if (defaultGames[gameId as string]) {
        setGameTitle(defaultGames[gameId as string].title);
        setGameGenre(defaultGames[gameId as string].genre);
      }
    }

    const savedHighScore = localStorage.getItem(`highScore_${gameId}`) || '0';
    setHighScore(parseInt(savedHighScore));
  }, [gameId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying && timeLeft > 0 && !gameOver) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameOver(true);
            setIsPlaying(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, gameOver]);

  useEffect(() => {
    let spawner: NodeJS.Timeout;
    if (isPlaying && !gameOver) {
      spawner = setInterval(() => {
        setTargets((prev) => {
          if (prev.length >= 6) return prev; 

          let itemTypes = ['⚡', '💎', '⭐'];
          if (gameTitle.toLowerCase().includes('candy') || gameTitle.toLowerCase().includes('crush')) {
            itemTypes = ['🍬', '🍫', '🍭', '⭐'];
          } else if (gameTitle.toLowerCase().includes('cyber') || gameTitle.toLowerCase().includes('nexus')) {
            itemTypes = ['💻', '🛡️', '⚡', '🔋'];
          } else if (gameTitle.toLowerCase().includes('runner')) {
            itemTypes = ['🚀', '🔥', '⭐', '💎'];
          }

          const randomType = itemTypes[Math.floor(Math.random() * itemTypes.length)];

          const newTarget = {
            id: Date.now() + Math.random(),
            x: Math.floor(Math.random() * 70) + 15,
            y: Math.floor(Math.random() * 60) + 20,
            type: randomType
          };
          return [...prev, newTarget];
        });
      }, 650);
    }
    return () => clearInterval(spawner);
  }, [isPlaying, gameOver, gameTitle]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameOver(false);
    setTargets([
      { id: 1, x: 30, y: 40, type: '⭐' },
      { id: 2, x: 70, y: 50, type: '💎' },
      { id: 3, x: 50, y: 30, type: '⚡' }
    ]);
    setIsPlaying(true);
  };

  const handleTargetClick = (id: number, type: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const points = type === '💎' || type === '🚀' || type === '🍫' ? 250 : 100;

    setScore((prevScore) => {
      const updatedScore = prevScore + points;
      setHighScore((prevHigh) => {
        if (updatedScore > prevHigh) {
          localStorage.setItem(`highScore_${gameId}`, updatedScore.toString());
          return updatedScore;
        }
        return prevHigh;
      });
      return updatedScore;
    });

    setTargets((prev) => {
      const filtered = prev.filter((t) => t.id !== id);
      let itemTypes = ['⚡', '💎', '⭐'];
      if (gameTitle.toLowerCase().includes('candy')) itemTypes = ['🍬', '🍫', '🍭', '⭐'];
      
      const replacement = {
        id: Date.now() + Math.random(),
        x: Math.floor(Math.random() * 70) + 15,
        y: Math.floor(Math.random() * 60) + 20,
        type: itemTypes[Math.floor(Math.random() * itemTypes.length)]
      };
      return [...filtered, replacement];
    });
  };

  return (
    <main className="min-h-screen bg-[#070514] text-white flex flex-col select-none p-3 md:p-6 font-mono w-full">
      
      {/* Steam-like Top Navigation Bar */}
      <div className="w-full bg-slate-900/95 border border-purple-500/30 px-4 py-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-2xl z-50 backdrop-blur-md mb-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 text-white text-xs font-bold shadow-lg shadow-pink-600/40 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-1.5"
          >
            <span>◀</span> Back
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h1 className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 uppercase tracking-widest truncate max-w-[160px] sm:max-w-xs">
              {gameTitle}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Theater Mode Toggle */}
          <button
            onClick={() => setIsTheaterMode(!isTheaterMode)}
            className="px-3.5 py-2 rounded-xl bg-purple-950/80 border border-purple-500/40 text-xs font-bold text-pink-300 hover:bg-purple-900 transition-all cursor-pointer shadow-md"
          >
            🖥️ {isTheaterMode ? 'Standard View' : 'Theater Mode'}
          </button>

          <button 
            onClick={() => router.push('/')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600/50 text-xs text-slate-300 transition-all shadow-md cursor-pointer"
          >
            Exit ✕
          </button>
        </div>
      </div>

      {/* Main Game Arena Container - Fully Clean & Non-Zooming */}
      <div className={`relative w-full flex-1 bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950 rounded-3xl border border-purple-500/30 overflow-hidden flex flex-col items-center justify-center shadow-2xl ${isTheaterMode ? 'h-[85vh]' : 'min-h-[70vh]'}`}>
        
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-950/95 backdrop-blur-xl p-6 text-center overflow-y-auto">
            <div className="w-20 h-20 md:w-24 md:h-24 mb-4 rounded-3xl bg-gradient-to-tr from-pink-600 via-purple-600 to-indigo-600 flex items-center justify-center text-3xl md:text-4xl shadow-2xl shadow-pink-600/50 border border-white/20 animate-bounce">
              {gameTitle.toLowerCase().includes('candy') ? '🍬' : '🎮'}
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-950 border border-purple-500/40 text-[10px] text-purple-300 uppercase mb-2">
              Genre: {gameGenre}
            </span>
            <h2 className="text-xl md:text-3xl font-black text-white mb-2 uppercase tracking-wider">{gameTitle}</h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
              Live Custom Game Mode: Tap or click the items appearing on the screen to score points before time runs out!
            </p>

            <button 
              onClick={startGame}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 text-white text-sm font-black uppercase tracking-widest shadow-2xl shadow-pink-600/50 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-pink-400/40"
            >
              Start Game Now ⚡
            </button>
          </div>
        )}

        {/* Gameplay HUD */}
        {isPlaying && (
          <>
            <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-30 pointer-events-none">
              <div className="px-4 py-2 rounded-xl bg-slate-900/90 border border-purple-500/30 backdrop-blur-md shadow-lg text-xs">
                SCORE: <span className="text-emerald-400 font-bold text-base ml-1">{score}</span>
              </div>
              <div className="px-4 py-2 rounded-xl bg-slate-900/90 border border-purple-500/30 backdrop-blur-md shadow-lg text-xs">
                TIME: <span className={`font-bold text-base ml-1 ${timeLeft <= 5 ? 'text-red-500 animate-ping' : 'text-pink-400'}`}>{timeLeft}s</span>
              </div>
            </div>

            {/* Clickable Items Field */}
            <div className="absolute inset-0 cursor-crosshair">
              {targets.map((target) => (
                <button
                  key={target.id}
                  onClick={(e) => handleTargetClick(target.id, target.type, e)}
                  style={{ top: `${target.y}%`, left: `${target.x}%` }}
                  className="absolute w-16 h-16 -ml-8 -mt-8 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 hover:scale-125 active:scale-90 transition-transform shadow-2xl shadow-pink-600/60 flex items-center justify-center text-2xl border-2 border-white/40 animate-bounce cursor-pointer"
                >
                  {target.type}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Game Over Screen */}
        {gameOver && (
          <div className="absolute inset-0 z-50 bg-slate-950/95 flex flex-col items-center justify-center backdrop-blur-xl p-6 text-center">
            <div className="w-20 h-20 mb-4 rounded-3xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-3xl shadow-xl">
              🏆
            </div>
            <h2 className="text-2xl font-black text-white mb-1 uppercase tracking-wider">{gameTitle} - Finished</h2>
            <p className="text-xs text-slate-400 mb-6">Great session! Your score has been recorded.</p>
            
            <div className="flex gap-4 mb-8">
              <div className="px-6 py-3 rounded-2xl bg-slate-900 border border-purple-500/30 text-xs">
                FINAL SCORE <br />
                <span className="text-emerald-400 font-bold text-xl">{score}</span>
              </div>
              <div className="px-6 py-3 rounded-2xl bg-slate-900 border border-purple-500/30 text-xs">
                HIGH SCORE <br />
                <span className="text-pink-400 font-bold text-xl">{highScore}</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={startGame}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 text-white text-xs font-bold uppercase tracking-widest shadow-lg transition-all hover:scale-105 cursor-pointer"
              >
                Play Again 🔄
              </button>
              <button 
                onClick={() => router.push('/')}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
              >
                Back to Hub 🏠
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}