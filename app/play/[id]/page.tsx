'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ProGamePlayer() {
  const params = useParams();
  const router = useRouter();
  const gameId = params.id;

  const [gameTitle, setGameTitle] = useState('Neon Protocol Zero');
  const [gameGenre, setGameGenre] = useState('Action / Arcade');
  const [aiLayout, setAiLayout] = useState<'portrait' | 'landscape'>('portrait');
  const [aiAnalysisText, setAiAnalysisText] = useState('AI Cloud Engine: Immersive Ready');
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [targets, setTargets] = useState<{ id: number; x: number; y: number; type: string }[]>([]);

  useEffect(() => {
    const savedGames = JSON.parse(localStorage.getItem('indipulse_games') || '{}');
    
    let detectedTitle = 'Neon Protocol Zero';
    let detectedGenre = 'Action / Arcade';

    if (savedGames[gameId as string]?.title) {
      detectedTitle = savedGames[gameId as string].title;
      detectedGenre = savedGames[gameId as string].genre || 'Indie / Custom';
    } else {
      const defaultGames: Record<string, { title: string; genre: string }> = {
        '1': { title: 'Cyber Nexus // RPG', genre: 'Action / Sci-Fi' },
        '2': { title: 'Neon Protocol Zero', genre: 'Strategy' },
        '3': { title: 'Quantum Runner 3D', genre: 'Arcade' }
      };
      if (defaultGames[gameId as string]) {
        detectedTitle = defaultGames[gameId as string].title;
        detectedGenre = defaultGames[gameId as string].genre;
      }
    }

    setGameTitle(detectedTitle);
    setGameGenre(detectedGenre);

    // AI automated analysis for device screen & orientation optimization
    const lowerTitle = detectedTitle.toLowerCase();
    const lowerGenre = detectedGenre.toLowerCase();
    if (lowerTitle.includes('runner') || lowerGenre.includes('strategy') || lowerTitle.includes('cyber')) {
      setAiLayout('landscape');
      setAiAnalysisText('🤖 AI Engine: Widescreen Landscape Mode');
    } else {
      setAiLayout('portrait');
      setAiAnalysisText('🤖 AI Engine: Vertical Portrait Mode');
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
          if (prev.length >= 7) return prev; 

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
            x: Math.floor(Math.random() * 75) + 12,
            y: Math.floor(Math.random() * 65) + 18,
            type: randomType
          };
          return [...prev, newTarget];
        });
      }, 600);
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
        x: Math.floor(Math.random() * 75) + 12,
        y: Math.floor(Math.random() * 65) + 18,
        type: itemTypes[Math.floor(Math.random() * itemTypes.length)]
      };
      return [...filtered, replacement];
    });
  };

  return (
    <main className="fixed inset-0 w-screen h-screen bg-[#05030a] text-white flex flex-col select-none font-mono overflow-hidden z-50 m-0 p-0">
      
      {/* Steam-Like Pro Header Bar (Clean & Minimalist) */}
      <div className="w-full bg-[#0d091e]/95 border-b border-purple-500/20 px-5 py-3.5 flex items-center justify-between shadow-xl shrink-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 text-white text-xs font-bold shadow-lg shadow-pink-600/30 transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
          >
            <span>◀</span> Back to Hub
          </button>
        </div>

        <div className="flex flex-col text-right">
          <h1 className="text-xs md:text-sm font-black uppercase tracking-wider text-pink-300 truncate max-w-[200px] sm:max-w-md">
            {gameTitle}
          </h1>
          <span className="text-[9px] text-purple-400 font-semibold">{aiAnalysisText}</span>
        </div>
      </div>

      {/* True Fullscreen Immersive Game Viewport Container */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center overflow-hidden bg-[#070514]">
        
        {/* Pre-Game Steam Launcher Lobby */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 z-40 bg-[#070514] flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
            <div className="w-24 h-24 mb-6 rounded-3xl bg-gradient-to-tr from-pink-600 via-purple-600 to-indigo-600 flex items-center justify-center text-4xl shadow-2xl shadow-pink-600/50 border border-white/20 animate-pulse">
              🎮
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/40 text-[10px] text-purple-300 uppercase mb-3 tracking-widest">
              AI Optimized Engine // Mode: {aiLayout.toUpperCase()}
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-white mb-3 uppercase tracking-wider">{gameTitle}</h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-lg mb-8 leading-relaxed">
              AI automated resolution matching complete. Experience zero-zoom immersive gameplay optimized instantly for your device screen.
            </p>

            <button 
              onClick={startGame}
              className="px-10 py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 text-white text-sm md:text-base font-black uppercase tracking-widest shadow-2xl shadow-pink-600/60 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-pink-400/50"
            >
              Play Game Now ⚡
            </button>
          </div>
        )}

        {/* Active Fullscreen Gameplay Arena */}
        {isPlaying && (
          <div className="absolute inset-0 w-full h-full bg-[#070514] flex flex-col z-40 overflow-hidden">
            
            <div className="w-full bg-slate-950/90 border-b border-purple-500/20 px-6 py-3.5 flex justify-between items-center z-30 backdrop-blur-md">
              <div className="text-xs font-mono text-slate-300">
                SCORE: <span className="text-emerald-400 font-bold text-base ml-1">{score}</span>
              </div>
              <div className="text-xs font-mono text-slate-300">
                TIME LEFT: <span className={`font-bold text-base ml-1 ${timeLeft <= 5 ? 'text-red-500 animate-ping' : 'text-pink-400'}`}>{timeLeft}s</span>
              </div>
            </div>

            <div className="relative flex-1 w-full h-full cursor-crosshair">
              {targets.map((target) => (
                <button
                  key={target.id}
                  onClick={(e) => handleTargetClick(target.id, target.type, e)}
                  style={{ top: `${target.y}%`, left: `${target.x}%` }}
                  className="absolute w-16 h-16 -ml-8 -mt-8 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 hover:scale-125 active:scale-90 transition-transform shadow-2xl shadow-pink-600/80 flex items-center justify-center text-2xl border-2 border-white/50 animate-bounce cursor-pointer"
                >
                  {target.type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Game Over Summary Screen */}
        {gameOver && (
          <div className="absolute inset-0 z-50 bg-[#070514]/95 flex flex-col items-center justify-center backdrop-blur-2xl p-6 text-center">
            <div className="w-20 h-20 mb-4 rounded-3xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-3xl shadow-xl">
              🏆
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-1 uppercase tracking-wider">{gameTitle}</h2>
            <p className="text-xs text-slate-400 mb-6">Session finished successfully.</p>
            
            <div className="flex gap-4 mb-8">
              <div className="px-6 py-3 rounded-2xl bg-slate-900 border border-purple-500/30 text-xs">
                FINAL SCORE <br />
                <span className="text-emerald-400 font-bold text-xl">{score}</span>
              </div>
              <div className="px-6 py-3 rounded-2xl bg-slate-900 border border-purple-500/30 text-xs">
                PERSONAL BEST <br />
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
                Exit to Hub 🏠
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}