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

    // AI automated layout optimization in background (hidden from UI)
    const lowerTitle = detectedTitle.toLowerCase();
    const lowerGenre = detectedGenre.toLowerCase();
    if (lowerTitle.includes('runner') || lowerGenre.includes('strategy') || lowerTitle.includes('cyber')) {
      setAiLayout('landscape');
    } else {
      setAiLayout('portrait');
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
    <main className="fixed inset-0 w-screen h-screen bg-[#070514] text-white flex flex-col select-none overflow-hidden z-50 m-0 p-0">
      
      {/* Compact Header Bar with strictly fitted Back button */}
      <div className="w-full bg-[#120e26]/90 border-b border-purple-500/30 px-4 py-3 flex items-center justify-between shadow-lg shrink-0 z-50 backdrop-blur-md">
        <div className="flex items-center shrink-0">
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center justify-center px-5 py-1.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold shadow-md cursor-pointer transition-all flex-shrink-0"
            style={{ width: 'fit-content' }}
          >
            Back
          </button>
        </div>

        <h1 className="text-xs md:text-sm font-bold uppercase tracking-wide text-white truncate max-w-[220px] sm:max-w-md text-right">
          {gameTitle}
        </h1>
      </div>

      {/* Immersive Game Viewport */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center overflow-hidden bg-[#070514]">
        
        {/* Pre-Game Lobby */}
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 z-40 bg-[#070514] flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
            <div className="w-20 h-20 mb-5 rounded-2xl bg-gradient-to-br from-pink-600/30 to-purple-600/30 border border-pink-500/40 flex items-center justify-center text-3xl shadow-xl shadow-pink-600/20">
              🎮
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-950 border border-purple-500/40 text-[10px] text-purple-300 uppercase mb-2">
              Genre: {gameGenre}
            </span>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2">{gameTitle}</h2>
            <p className="text-xs text-slate-300 max-w-sm mb-6 leading-relaxed">
              Tap or click the items appearing on the screen to score points before time runs out!
            </p>

            <button 
              onClick={startGame}
              className="w-full max-w-xs py-3 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-pink-600/30 transition-all cursor-pointer"
            >
              Start Game Now ⚡
            </button>
          </div>
        )}

        {/* Active Gameplay Arena */}
        {isPlaying && (
          <div className="absolute inset-0 w-full h-full bg-[#070514] flex flex-col z-40 overflow-hidden">
            
            <div className="w-full bg-[#120e26]/80 border-b border-purple-500/30 px-6 py-3 flex justify-between items-center z-30 backdrop-blur-md">
              <div className="text-xs text-pink-400 font-semibold">SCORE: <span className="text-white font-bold text-sm ml-1">{score}</span></div>
              <div className="text-xs text-purple-300 font-semibold">TIME: <span className={`font-bold text-sm ml-1 ${timeLeft <= 5 ? 'text-red-400 animate-ping' : 'text-white'}`}>{timeLeft}s</span></div>
            </div>

            <div className="relative flex-1 w-full h-full cursor-crosshair">
              {targets.map((target) => (
                <button
                  key={target.id}
                  onClick={(e) => handleTargetClick(target.id, target.type, e)}
                  style={{ top: `${target.y}%`, left: `${target.x}%` }}
                  className="absolute w-14 h-14 -ml-7 -mt-7 rounded-2xl bg-gradient-to-tr from-pink-600 to-purple-600 hover:scale-125 active:scale-90 transition-transform shadow-xl shadow-pink-600/50 flex items-center justify-center text-xl border border-white/40 animate-bounce cursor-pointer"
                >
                  {target.type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Game Over Screen */}
        {gameOver && (
          <div className="absolute inset-0 z-50 bg-[#070514]/95 flex flex-col items-center justify-center backdrop-blur-xl p-6 text-center">
            <div className="w-16 h-16 mb-4 rounded-2xl bg-[#120e26] border border-purple-500/40 flex items-center justify-center text-2xl shadow-xl">
              🏆
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Game Over!</h2>
            <p className="text-xs text-slate-300 mb-6">Final Score: <span className="text-white font-bold">{score}</span></p>
            
            <div className="flex gap-3 w-full max-w-xs">
              <button 
                onClick={startGame}
                className="flex-1 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl font-bold text-xs cursor-pointer shadow-md"
              >
                Play Again 🔄
              </button>
              <button 
                onClick={() => router.push('/')}
                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-xs cursor-pointer"
              >
                Exit Hub 🏠
              </button>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}