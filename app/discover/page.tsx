'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function IndiePulseEcoSystemPage() {
  const router = useRouter();

  // Navigation View State ('discover' | 'browse' | 'gameDetail' | 'playGame' | 'projectDetail' | 'submitGame' | 'playtest' | 'teamFinder' | 'dashboard' | 'talent')
  const [activeView, setActiveView] = useState<'discover' | 'browse' | 'gameDetail' | 'playGame' | 'projectDetail' | 'submitGame' | 'playtest' | 'teamFinder' | 'dashboard' | 'talent'>('discover');

  // Interactive States
  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Persistent Games Catalog
  const [gamesList, setGamesList] = useState([
    { id: '1', title: "Cyber Neon Runner", creator: "Aarav Dev", genre: "Action / Sci-Fi", plays: "3.4k plays", desc: "A fast-paced cyberpunk endless runner built with WebGL. Dodge obstacles and hack neon grids!", rating: "4.9 ⭐", banner: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80" },
    { id: '2', title: "Mystic Quest RPG", creator: "Neha_Gamer", genre: "Adventure", plays: "2.8k plays", desc: "Immersive 2D pixel RPG featuring dungeon crawling and dynamic turn-based combat.", rating: "4.7 ⭐", banner: "https://images.unsplash.com/photo-1612287233002-81d0f53488d7?auto=format&fit=crop&w=800&q=80" },
    { id: '3', title: "Pixel Bounce", creator: "Rahul (You)", genre: "Arcade", plays: "1.5k plays", desc: "Addictive physics-based puzzle arcade game with over 50 unique handcrafted levels.", rating: "4.8 ⭐", banner: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80" },
    { id: '4', title: "Galactic Wars", creator: "StarStudio", genre: "Shooter", plays: "4.1k plays", desc: "Intense space shooter with epic boss fights and custom starship upgrading systems.", rating: "4.9 ⭐", banner: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80" },
    { id: '5', title: "Speed Drift X", creator: "TurboGamer", genre: "Racing", plays: "5.2k plays", desc: "Next-gen arcade drifting simulator with neon tracks and multiplayer leaderboard support.", rating: "4.6 ⭐", banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80" }
  ]);

  // Dev Logs & Projects
  const [devLogs, setDevLogs] = useState([
    { id: '1', title: "Day 45: Physics Bug Fix & Lighting Polish", author: "Bharat Patil", time: "2 hours ago", content: "Optimized collision detection and added bloom lighting to the neon platforms.", likes: 24, comments: 5 },
    { id: '2', title: "Building the Inventory UI System", author: "Rahul Dev", time: "1 day ago", content: "Implemented drag-and-drop mechanics using TypeScript and Tailwind CSS.", likes: 41, comments: 12 }
  ]);

  // Playtest Requests & Team Finder
  const [playtestRequests, setPlaytestRequests] = useState([
    { id: '1', title: "C# Coder needed for RPG Boss Battle Logic", author: "Aarav Dev", tags: ["#C#", "#Unity", "#TeamFinder"] },
    { id: '2', title: "Playtest: Looking for 10 testers for Cyber Neon Runner v2", author: "Bharat Patil", tags: ["#Playtest", "#Feedback"] }
  ]);

  // Submit Form States
  const [newGameTitle, setNewGameTitle] = useState('');
  const [newGameGenre, setNewGameGenre] = useState('Action');
  const [newGameDesc, setNewGameDesc] = useState('');
  const [successToast, setSuccessToast] = useState(false);

  const handleGameSubmit = (e: any) => {
    e.preventDefault();
    if (!newGameTitle.trim()) return;

    const newEntry = {
      id: Date.now().toString(),
      title: newGameTitle,
      creator: "You",
      genre: newGameGenre,
      plays: "1 play",
      desc: newGameDesc || "Indie game crafted with passion.",
      rating: "5.0 ⭐",
      banner: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80"
    };

    setGamesList([newEntry, ...gamesList]);
    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      setNewGameTitle('');
      setNewGameDesc('');
      setActiveView('browse');
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col px-4 py-6 max-w-xl mx-auto w-full relative overflow-x-hidden select-none pb-24">
      
      {/* Neon Glow Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header & Back Navigation */}
      <div className="w-full flex items-center justify-between mb-4 relative z-10">
        <Link 
          href="/" 
          className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white text-xs font-bold shadow-[0_0_15px_rgba(236,72,153,0.4)] border border-pink-400/40 transition-all flex items-center justify-center cursor-pointer"
        >
          ← Home
        </Link>
        <span className="text-xs font-black tracking-widest text-pink-400 uppercase bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-800">
          🎮 IndiePulse Ecosystem
        </span>
      </div>

      {/* ========================================================= */}
      {/* VIEW 1: DISCOVER (TikTok/Reels Swipe Feed) */}
      {/* ========================================================= */}
      {activeView === 'discover' && (
        <div className="flex flex-col gap-4 relative z-10">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center opacity-30 filter blur-sm" style={{ backgroundImage: `url(${gamesList[0].banner})` }}></div>
            <div className="relative z-10 flex flex-col items-center text-center py-10">
              <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-400 text-[11px] font-bold mb-2 border border-pink-500/30">🔥 DISCOVER SWIPE FEED</span>
              <h2 className="text-3xl font-black mb-2">{gamesList[0].title}</h2>
              <p className="text-slate-300 text-xs max-w-xs mb-6">{gamesList[0].desc}</p>
              
              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => { setSelectedGame(gamesList[0]); setActiveView('playGame'); }}
                  className="flex-1 py-3.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-2xl shadow-lg shadow-pink-600/40 text-sm cursor-pointer"
                >
                  ▶️ Play Game Now
                </button>
                <button 
                  onClick={() => { setSelectedGame(gamesList[0]); setActiveView('gameDetail'); }}
                  className="px-5 py-3.5 bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold rounded-2xl border border-slate-700 text-sm cursor-pointer"
                >
                  ℹ️ Details
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setActiveView('browse')} className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-left hover:border-pink-500/50 transition-all cursor-pointer">
              <span className="text-xl">🔥</span>
              <h4 className="font-bold text-sm mt-1">Browse All</h4>
              <p className="text-[11px] text-slate-400">Explore game catalog</p>
            </button>
            <button onClick={() => setActiveView('submitGame')} className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-left hover:border-pink-500/50 transition-all cursor-pointer">
              <span className="text-xl">🚀</span>
              <h4 className="font-bold text-sm mt-1">Submit Game</h4>
              <p className="text-[11px] text-slate-400">Publish your title</p>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: BROWSE ALL (Catalog & Search) */}
      {/* ========================================================= */}
      {activeView === 'browse' && (
        <div className="flex flex-col gap-4 relative z-10">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl shadow-xl">
            <h2 className="text-xl font-black mb-3">🔥 All Indie Games Catalog</h2>
            <input 
              type="text" 
              placeholder="Search games by title or genre..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 mb-3"
            />
            
            <div className="flex gap-2 overflow-x-auto pb-1">
              {['All', 'Action', 'Adventure', 'Arcade', 'Shooter', 'Racing'].map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${selectedCategory === cat ? 'bg-pink-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {gamesList
              .filter(g => selectedCategory === 'All' || g.genre.toLowerCase().includes(selectedCategory.toLowerCase()))
              .filter(g => g.title.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((game) => (
                <div 
                  key={game.id} 
                  onClick={() => { setSelectedGame(game); setActiveView('gameDetail'); }}
                  className="flex justify-between items-center p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-pink-500/40 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <img src={game.banner} alt={game.title} className="w-12 h-12 rounded-xl object-cover border border-slate-700" />
                    <div>
                      <h3 className="font-bold text-white text-sm">{game.title}</h3>
                      <p className="text-[11px] text-slate-400">By {game.creator} • <span className="text-pink-400">{game.genre}</span></p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-emerald-400 font-bold text-xs">{game.plays}</span>
                  </div>
                </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 3: GAME DETAIL */}
      {/* ========================================================= */}
      {activeView === 'gameDetail' && selectedGame && (
        <div className="flex flex-col gap-4 relative z-10">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl shadow-2xl text-left">
            <img src={selectedGame.banner} alt="Banner" className="w-full h-48 rounded-2xl object-cover mb-4 border border-slate-700 shadow-md" />
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-2xl font-black">{selectedGame.title}</h2>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-bold">{selectedGame.rating}</span>
            </div>
            <p className="text-xs text-pink-400 font-semibold mb-3">Developed by {selectedGame.creator} • {selectedGame.genre}</p>
            <p className="text-slate-300 text-xs leading-relaxed mb-6">{selectedGame.desc}</p>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setActiveView('playGame')}
                className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-pink-600/40 text-sm cursor-pointer"
              >
                🎮 Play Game Now (WebGL)
              </button>
              <button 
                onClick={() => setActiveView('projectDetail')}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs cursor-pointer border border-slate-700"
              >
                📜 View Dev Logs & Project Updates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 4: PLAY GAME (Instant WebGL Simulator) */}
      {/* ========================================================= */}
      {activeView === 'playGame' && (
        <div className="flex flex-col gap-4 relative z-10 text-center">
          <div className="bg-black border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative h-[380px] flex flex-col items-center justify-center p-6">
            <div className="absolute inset-0 bg-cover bg-center opacity-40 filter blur-xs" style={{ backgroundImage: `url(${selectedGame?.banner || gamesList[0].banner})` }}></div>
            <div className="relative z-10 flex flex-col items-center">
              <span className="w-16 h-16 bg-pink-600/30 border border-pink-500 rounded-full flex items-center justify-center text-3xl mb-3 animate-pulse">🎮</span>
              <h3 className="text-xl font-black mb-1">{selectedGame?.title || gamesList[0].title}</h3>
              <p className="text-xs text-slate-300 mb-6">Running live in IndiePulse Cloud Sandbox</p>
              
              <div className="flex gap-3">
                <button onClick={() => alert('Game controller connected / Simulated play active!')} className="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl text-xs shadow-lg cursor-pointer">
                  Start Playing 🚀
                </button>
                <button onClick={() => setActiveView('gameDetail')} className="px-5 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs cursor-pointer">
                  Exit Game
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 5: PROJECT DETAIL (Dev Logs) */}
      {/* ========================================================= */}
      {activeView === 'projectDetail' && (
        <div className="flex flex-col gap-4 relative z-10 text-left">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-black mb-1">📜 Dev Logs & Updates</h2>
            <p className="text-slate-400 text-xs mb-4">Behind-the-scenes progress from indie creators.</p>
            
            <div className="flex flex-col gap-3">
              {devLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-pink-400 text-xs">{log.author}</span>
                    <span className="text-[10px] text-slate-500">{log.time}</span>
                  </div>
                  <h4 className="font-bold text-white text-sm mb-1">{log.title}</h4>
                  <p className="text-slate-300 text-xs mb-3">{log.content}</p>
                  <div className="flex gap-4 text-[11px] text-slate-400 border-t border-slate-900 pt-2">
                    <span>❤️ {log.likes} Likes</span>
                    <span>💬 {log.comments} Comments</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 6: SUBMIT GAME / PROJECT */}
      {/* ========================================================= */}
      {activeView === 'submitGame' && (
        <div className="flex flex-col gap-4 relative z-10 text-left">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-black mb-1">🚀 Submit Game or Project</h2>
            <p className="text-slate-400 text-xs mb-4">Publish your indie title to the community feed instantly.</p>

            {successToast && (
              <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl text-center animate-bounce">
                ✓ Game published successfully! Redirecting...
              </div>
            )}

            <form onSubmit={handleGameSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-semibold text-pink-300 mb-1 block">Game Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Cyber Neon Runner"
                  value={newGameTitle}
                  onChange={(e) => setNewGameTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-pink-300 mb-1 block">Genre</label>
                <select 
                  value={newGameGenre}
                  onChange={(e) => setNewGameGenre(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-pink-500"
                >
                  <option value="Action / Sci-Fi">Action / Sci-Fi</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Arcade">Arcade</option>
                  <option value="Shooter">Shooter</option>
                  <option value="Racing">Racing</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-pink-300 mb-1 block">Description</label>
                <textarea 
                  rows={3}
                  placeholder="Write a short summary of your game..."
                  value={newGameDesc}
                  onChange={(e) => setNewGameDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-pink-500 resize-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl text-xs shadow-lg shadow-pink-600/30 cursor-pointer mt-2"
              >
                Publish Game Now 🚀
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 7: PLAYTEST REQUESTS & FEEDBACK FORM */}
      {/* ========================================================= */}
      {activeView === 'playtest' && (
        <div className="flex flex-col gap-4 relative z-10 text-left">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-black mb-1">🧪 Playtest & Feedback Board</h2>
            <p className="text-slate-400 text-xs mb-4">Request player feedback or test upcoming indie builds.</p>
            
            <div className="flex flex-col gap-3">
              {playtestRequests.map((req) => (
                <div key={req.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-pink-400 font-bold block mb-1">Posted by {req.author}</span>
                  <h4 className="font-bold text-white text-sm mb-2">{req.title}</h4>
                  <div className="flex gap-2 flex-wrap mb-3">
                    {req.tags.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-[10px]">{t}</span>
                    ))}
                  </div>
                  <button onClick={() => alert('Feedback submitted! Thank you for helping indie developers.')} className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-lg text-xs cursor-pointer">
                    Test Game & Give Feedback 💬
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 8: TEAM FINDER & DEVELOPER PROFILE */}
      {/* ========================================================= */}
      {activeView === 'teamFinder' && (
        <div className="flex flex-col gap-4 relative z-10 text-left">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-xl text-center">
            <div className="w-20 h-20 bg-gradient-to-tr from-pink-500 to-purple-500 rounded-full mx-auto flex items-center justify-center text-3xl font-black mb-3 shadow-lg">
              BP
            </div>
            <h2 className="text-xl font-black">Bharat Patil</h2>
            <p className="text-xs text-pink-400 font-semibold mb-4">Solo Game Developer & Creator</p>
            
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left mb-4">
              <h4 className="text-xs font-bold text-slate-300 mb-2">🛠️ Skills & Stack</h4>
              <p className="text-[11px] text-slate-400">Next.js, TypeScript, Unity, C#, Tailwind CSS, WebGL</p>
            </div>

            <button onClick={() => alert('Collab request sent successfully!')} className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md">
              🤝 Send Collaboration / Hire Request
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 9: DEVELOPER DASHBOARD & UPI SUPPORT */}
      {/* ========================================================= */}
      {activeView === 'dashboard' && (
        <div className="flex flex-col gap-4 relative z-10 text-left">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-black mb-1">📊 Creator Dashboard & UPI</h2>
            <p className="text-slate-400 text-xs mb-4">Track your plays, tips, and earnings.</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">Total Plays</span>
                <span className="text-xl font-black text-emerald-400">10.5K</span>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block">UPI Tips Received</span>
                <span className="text-xl font-black text-pink-400">₹5,500</span>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
              <h4 className="text-xs font-bold text-white mb-2">⚡ Setup UPI Donations / Support</h4>
              <p className="text-[11px] text-slate-400 mb-3">Allow players to tip you directly via UPI ID or QR code.</p>
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs font-mono text-cyan-400 mb-3">
                bharatpatil@upi
              </div>
              <button onClick={() => alert('UPI QR generated successfully!')} className="w-full py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl text-xs cursor-pointer">
                Generate UPI QR Code 📱
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 10: TALENT & HIRE */}
      {/* ========================================================= */}
      {activeView === 'talent' && (
        <div className="flex flex-col gap-4 relative z-10 text-left">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-black mb-1">💼 Talent & Hire Directory</h2>
            <p className="text-slate-400 text-xs mb-4">Find verified indie developers, level designers, and artists.</p>
            
            <div className="flex flex-col gap-3">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white text-sm">Bharat Patil</h4>
                  <p className="text-[11px] text-pink-400">Full-Stack Dev & Game Creator</p>
                </div>
                <button onClick={() => alert('Message sent!')} className="px-4 py-2 bg-pink-600 text-white text-xs font-bold rounded-xl cursor-pointer">
                  Hire 🤝
                </button>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-white text-sm">Aarav Dev</h4>
                  <p className="text-[11px] text-pink-400">Unity C# & Mechanics Specialist</p>
                </div>
                <button onClick={() => alert('Message sent!')} className="px-4 py-2 bg-pink-600 text-white text-xs font-bold rounded-xl cursor-pointer">
                  Hire 🤝
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* FIXED BOTTOM NAVIGATION DOCK (App-like Multi-Page Switcher) */}
      {/* ========================================================= */}
      <div className="fixed bottom-0 inset-x-0 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800 py-3 px-4 z-50 max-w-xl mx-auto flex items-center justify-around text-[10px] font-bold text-slate-400">
        <button onClick={() => setActiveView('discover')} className={`flex flex-col items-center gap-1 cursor-pointer ${activeView === 'discover' ? 'text-pink-400 font-black' : 'hover:text-white'}`}>
          <span className="text-lg">🔥</span> Discover
        </button>
        <button onClick={() => setActiveView('browse')} className={`flex flex-col items-center gap-1 cursor-pointer ${activeView === 'browse' ? 'text-pink-400 font-black' : 'hover:text-white'}`}>
          <span className="text-lg">🎮</span> Browse
        </button>
        <button onClick={() => setActiveView('submitGame')} className={`flex flex-col items-center gap-1 cursor-pointer ${activeView === 'submitGame' ? 'text-pink-400 font-black' : 'hover:text-white'}`}>
          <span className="text-lg">🚀</span> Submit
        </button>
        <button onClick={() => setActiveView('playtest')} className={`flex flex-col items-center gap-1 cursor-pointer ${activeView === 'playtest' ? 'text-pink-400 font-black' : 'hover:text-white'}`}>
          <span className="text-lg">🧪</span> Playtest
        </button>
        <button onClick={() => setActiveView('teamFinder')} className={`flex flex-col items-center gap-1 cursor-pointer ${activeView === 'teamFinder' ? 'text-pink-400 font-black' : 'hover:text-white'}`}>
          <span className="text-lg">👥</span> Team
        </button>
        <button onClick={() => setActiveView('dashboard')} className={`flex flex-col items-center gap-1 cursor-pointer ${activeView === 'dashboard' ? 'text-pink-400 font-black' : 'hover:text-white'}`}>
          <span className="text-lg">📊</span> Stats
        </button>
      </div>

    </main>
  );
}