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
  const [aiAnalysisText, setAiAnalysisText] = useState('AI Engine analyzing game viewport...');
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

    const lowerTitle = detectedTitle.toLowerCase();
    const lowerGenre = detectedGenre.toLowerCase();
    if (lowerTitle.includes('runner') || lowerGenre.includes('strategy') || lowerTitle.includes('cyber')) {
      setAiLayout('landscape');
      setAiAnalysisText('🤖 AI Mode: Landscape Widescreen');
    } else {
      setAiLayout('portrait');
      setAiAnalysisText('🤖 AI Mode: Portrait Vertical View');
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
    <main className="min-h-screen bg-[#05030a] text-white flex flex-col select-none font-mono w-full p-2 md:p-6 items-center justify-center">
      
      {/* Fully Responsive Steam-like Container for both Mobile and Desktop */}
      <div className="w-full max-w-5xl bg-[#0a0618] border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative min-h-[88vh] md:min-h-[82vh]">
        
        {/* Top Navigation Bar */}
        <div className="w-full bg-[#0d091e] border-b border-purple-500/20 px-4 py-3 flex items-center justify-between shadow-lg shrink-0 z-50">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => router.back()}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white text-xs font-bold shadow-md cursor-pointer flex items-center gap-1"
            >
              <span>◀</span> Back
            </button>
            <div className="flex flex-col text-left">
              <h1 className="text-xs font-black uppercase tracking-wider text-pink-300 truncate max-w-[170px] sm:max-w-md">
                {gameTitle}
              </h1>
              <span className="text-[9px] text-purple-400">{aiAnalysisText}</span>
            </div>
          </div>

          <button 
            onClick={() => router.push('/')}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 cursor-pointer border border-slate-700"
          >
            Exit Hub ✕
          </button>
        </div>

        {/* Content Arena */}
        <div className="relative w-full flex-1 flex flex-col items-center justify-center overflow-hidden bg-[#070514]">
          
          {/* Pre-game Launcher Screen */}
          {!isPlaying && !gameOver && (
            <div className="absolute inset-0 z-40 bg-[#070514]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
              <div className="w-24 h-24 mb-6 rounded-3xl bg-gradient-to-tr from-pink-600 via-purple-600 to-indigo-600 flex items-center justify-center text-4xl shadow-2xl shadow-pink-600/50 border border-white/20 animate-pulse">
                🎮
              </div>
              <span className="px-3 py-1 rounded-full bg-purple-950 border border-purple-500/40 text-[10px] text-purple-300 uppercase mb-3">
                AI Verified Engine // Layout: {aiLayout.toUpperCase()}
              </span>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-2 uppercase tracking-wider">{gameTitle}</h2>
              <p className="text-xs md:text-sm text-slate-400 max-w-md mb-8 leading-relaxed">
                AI automated viewport setup complete. Click below to launch the live game session in perfect screen resolution.
              </p>

              <button 
                onClick={startGame}
                className="w-full max-w-sm py-4 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 text-white text-sm font-black uppercase tracking-widest shadow-2xl shadow-pink-600/50 transition-all hover:scale-105 active:scale-95 cursor-pointer border border-pink-400/40"
              >
                Play Game Now ⚡
              </button>
            </div>
          )}

          {/* Active Gameplay Arena */}
          {isPlaying && (
            <div className="absolute inset-0 w-full h-full bg-[#070514] flex flex-col z-40 overflow-hidden">
              
              <div className="w-full bg-slate-950/90 border-b border-purple-500/20 px-6 py-3 flex justify-between items-center z-30 backdrop-blur-md">
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

          {/* Game Over Summary */}
          {gameOver && (
            <div className="absolute inset-0 z-50 bg-[#070514]/95 flex flex-col items-center justify-center backdrop-blur-2xl p-6 text-center">
              <div className="w-20 h-20 mb-4 rounded-3xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-3xl shadow-xl">
                🏆
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-1 uppercase tracking-wider">{gameTitle}</h2>
              <p className="text-xs text-slate-400 mb-6">Game session completed successfully.</p>
              
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
      </div>
    </main>
  );
}