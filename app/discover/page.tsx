'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function IndiePulseEcoSystemPage() {
  const router = useRouter();

  const [activeView, setActiveView] = useState<'discover' | 'browse' | 'gameDetail' | 'playGame' | 'projectDetail' | 'submitGame' | 'playtest' | 'teamFinder' | 'dashboard' | 'talent'>('discover');

  const [selectedGame, setSelectedGame] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Synced DP from localStorage ('indiePulse_pic')
  const [syncedProfilePic, setSyncedProfilePic] = useState<string | null>(null);

  // Team Finder Custom Message States & Saved Requests
  const [collabMessage, setCollabMessage] = useState('');
  const [requestSent, setRequestSent] = useState(false);
  const [savedRequests, setSavedRequests] = useState<any[]>([]);

  // Real Playtest & Feedback States
  const [activeFeedbackReqId, setActiveFeedbackReqId] = useState<string | null>(null);
  const [feedbackRating, setFeedbackRating] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState<Record<string, any[]>>({});
  const [feedbackSavedToast, setFeedbackSavedToast] = useState<string | null>(null);

  // New Playtest Request States
  const [showNewPlaytestForm, setShowNewPlaytestForm] = useState(false);
  const [newPlaytestTitle, setNewPlaytestTitle] = useState('');
  const [newPlaytestTags, setNewPlaytestTags] = useState('#Playtest, #Feedback');

  const [gamesList, setGamesList] = useState<any[]>([
    { id: '1', title: "Cyber Neon Runner", creator: "Aarav Dev", genre: "Action / Sci-Fi", plays: "3.4k plays", desc: "A fast-paced cyberpunk endless runner built with WebGL. Dodge obstacles and hack neon grids!", rating: "4.9 ⭐", banner: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80", link: "#" },
    { id: '2', title: "Mystic Quest RPG", creator: "Neha_Gamer", genre: "Adventure", plays: "2.8k plays", desc: "Immersive 2D pixel RPG featuring dungeon crawling and dynamic turn-based combat.", rating: "4.7 ⭐", banner: "https://images.unsplash.com/photo-1612287233002-81d0f53488d7?auto=format&fit=crop&w=800&q=80", link: "#" },
    { id: '3', title: "Pixel Bounce", creator: "Rahul (You)", genre: "Arcade", plays: "1.5k plays", desc: "Addictive physics-based puzzle arcade game with over 50 unique handcrafted levels.", rating: "4.8 ⭐", banner: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80", link: "#" },
    { id: '4', title: "Galactic Wars", creator: "StarStudio", genre: "Shooter", plays: "4.1k plays", desc: "Intense space shooter with epic boss fights and custom starship upgrading systems.", rating: "4.9 ⭐", banner: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80", link: "#" },
    { id: '5', title: "Speed Drift X", creator: "TurboGamer", genre: "Racing", plays: "5.2k plays", desc: "Next-gen arcade drifting simulator with neon tracks and multiplayer leaderboard support.", rating: "4.6 ⭐", banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80", link: "#" }
  ]);

  const [devLogs, setDevLogs] = useState([
    { id: '1', title: "Day 45: Physics Bug Fix & Lighting Polish", author: "Bharat Patil", time: "2 hours ago", content: "Optimized collision detection and added bloom lighting to the neon platforms.", likes: 24, comments: 5 },
    { id: '2', title: "Building the Inventory UI System", author: "Rahul Dev", time: "1 day ago", content: "Implemented drag-and-drop mechanics using TypeScript and Tailwind CSS.", likes: 41, comments: 12 }
  ]);

  const [playtestRequests, setPlaytestRequests] = useState([
    { id: '1', title: "C# Coder needed for RPG Boss Battle Logic", author: "Aarav Dev", tags: ["#C#", "#Unity", "#TeamFinder"] },
    { id: '2', title: "Playtest: Looking for 10 testers for Cyber Neon Runner v2", author: "Bharat Patil", tags: ["#Playtest", "#Feedback"] }
  ]);

  // Load submitted games, collaboration requests, synced DP, playtest requests, and playtest feedbacks from localStorage automatically on page load
  useEffect(() => {
    const loadSyncedPic = () => {
      const pic = localStorage.getItem('indiePulse_pic');
      setSyncedProfilePic(pic);
    };

    loadSyncedPic();
    window.addEventListener('storage', loadSyncedPic);

    const savedGames = localStorage.getItem('indiePulse_submitted_games');
    if (savedGames) {
      try {
        const parsed = JSON.parse(savedGames);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setGamesList(prev => [...parsed, ...prev]);
        }
      } catch (e) {
        console.error("Failed to load submitted games", e);
      }
    }

    const savedReqs = localStorage.getItem('indiePulse_collab_requests');
    if (savedReqs) {
      try {
        setSavedRequests(JSON.parse(savedReqs));
      } catch (e) {
        console.error("Failed to load collaboration requests", e);
      }
    }

    const savedPlaytests = localStorage.getItem('indiePulse_playtest_requests');
    if (savedPlaytests) {
      try {
        const parsedPlaytests = JSON.parse(savedPlaytests);
        if (Array.isArray(parsedPlaytests) && parsedPlaytests.length > 0) {
          setPlaytestRequests(prev => [...parsedPlaytests, ...prev]);
        }
      } catch (e) {
        console.error("Failed to load playtest requests", e);
      }
    }

    const savedFeedbacks = localStorage.getItem('indiePulse_playtest_feedbacks');
    if (savedFeedbacks) {
      try {
        const parsedFeedbacks = JSON.parse(savedFeedbacks);
        if (parsedFeedbacks && typeof parsedFeedbacks === 'object') {
          setSubmittedFeedbacks(parsedFeedbacks);
        }
      } catch (e) {
        console.error("Failed to load playtest feedbacks", e);
      }
    }

    return () => {
      window.removeEventListener('storage', loadSyncedPic);
    };
  }, []);

  const handleFeedbackSubmit = (reqId: string) => {
    const cleanText = feedbackText.trim();
    if (!cleanText) {
      return;
    }

    let currentStorageMap: Record<string, any[]> = { ...submittedFeedbacks };
    try {
      const raw = localStorage.getItem('indiePulse_playtest_feedbacks');
      if (raw) {
        currentStorageMap = { ...currentStorageMap, ...JSON.parse(raw) };
      }
    } catch (e) {
      // ignore parse error
    }

    const existingForReq = currentStorageMap[reqId] || [];
    const newFeedback = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      tester: "Bharat Patil",
      rating: feedbackRating,
      comment: cleanText,
      time: "Just now"
    };

    const updatedFeedbacks: Record<string, any[]> = {
      ...currentStorageMap,
      [reqId]: [newFeedback, ...existingForReq]
    };

    setSubmittedFeedbacks(updatedFeedbacks);
    try {
      localStorage.setItem('indiePulse_playtest_feedbacks', JSON.stringify(updatedFeedbacks));
    } catch (e) {
      console.error("Failed to save feedback to localStorage", e);
    }

    setFeedbackText('');
    setFeedbackRating(5);
    setActiveFeedbackReqId(null);
    setFeedbackSavedToast(reqId);
    setTimeout(() => setFeedbackSavedToast(null), 2500);
  };

  const handleCreatePlaytestRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaytestTitle.trim()) return;

    const formattedTags = newPlaytestTags
      .split(',')
      .map(tag => tag.trim())
      .filter(Boolean)
      .map(tag => (tag.startsWith('#') ? tag : `#${tag}`));

    const newReq = {
      id: Date.now().toString(),
      title: newPlaytestTitle.trim(),
      author: "Bharat Patil",
      tags: formattedTags.length > 0 ? formattedTags : ["#Playtest", "#Feedback"]
    };

    const updatedRequests = [newReq, ...playtestRequests];
    setPlaytestRequests(updatedRequests);

    const existingStored = localStorage.getItem('indiePulse_playtest_requests');
    let storedList: any[] = [];
    if (existingStored) {
      try {
        storedList = JSON.parse(existingStored);
      } catch (err) {
        storedList = [];
      }
    }
    localStorage.setItem('indiePulse_playtest_requests', JSON.stringify([newReq, ...storedList]));

    setNewPlaytestTitle('');
    setNewPlaytestTags('#Playtest, #Feedback');
    setShowNewPlaytestForm(false);
  };

  const ratingLabels: Record<number, string> = {
    1: "Needs Work",
    2: "Fair",
    3: "Good",
    4: "Great",
    5: "Awesome"
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col px-3 py-6 max-w-xl mx-auto w-full relative overflow-x-hidden select-none pb-28 text-left">
      
      {/* Neon Glow Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Badge */}
      <div className="w-full flex items-center justify-center mb-4 relative z-10">
        <span className="text-[11px] font-black tracking-widest text-pink-400 uppercase bg-slate-900/90 px-4 py-2 rounded-full border border-slate-800 shadow-md">
          🎮 INDIEPULSE ECOSYSTEM
        </span>
      </div>

      {/* ========================================================= */}
      {/* VIEW 1: DISCOVER (Swipe Feed) */}
      {/* ========================================================= */}
      {activeView === 'discover' && (
        <div className="flex flex-col gap-4 relative z-10 w-full text-left">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-5 rounded-3xl shadow-2xl relative overflow-hidden text-left">
            <div className="absolute inset-0 bg-cover bg-center opacity-30 filter blur-sm" style={{ backgroundImage: `url(${gamesList[0]?.banner || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f'})` }}></div>
            <div className="relative z-10 flex flex-col items-start text-left py-6 w-full">
              <span className="px-3 py-1 rounded-full bg-pink-500/20 text-pink-400 text-[10px] font-bold mb-2 border border-pink-500/30">🔥 DISCOVER SWIPE FEED</span>
              <h2 className="text-2xl font-black mb-1.5 text-left w-full">{gamesList[0]?.title}</h2>
              <p className="text-slate-300 text-xs max-w-xs mb-5 leading-relaxed text-left w-full">{gamesList[0]?.desc || gamesList[0]?.description}</p>
              
              {/* Short & Compact Balanced Buttons */}
              <div className="flex items-center justify-start gap-2.5 w-full">
                <button 
                  onClick={() => { setSelectedGame(gamesList[0]); setActiveView('playGame'); }}
                  className="py-2.5 px-5 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl shadow-md text-xs cursor-pointer flex items-center gap-1.5"
                >
                  <span>▶️</span> Play Game
                </button>
                <button 
                  onClick={() => { setSelectedGame(gamesList[0]); setActiveView('gameDetail'); }}
                  className="py-2.5 px-5 bg-slate-800/90 hover:bg-slate-700 text-pink-300 font-semibold rounded-xl border border-pink-500/30 text-xs cursor-pointer shadow-inner flex items-center gap-1"
                >
                  <span>✨</span> Details
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full text-left">
            <button onClick={() => setActiveView('browse')} className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-left hover:border-pink-500/50 transition-all cursor-pointer shadow-md flex flex-col items-start justify-start w-full">
              <span className="text-xl mb-1 text-left">🔥</span>
              <h4 className="font-bold text-xs text-left w-full">Browse All</h4>
              <span className="text-[10px] text-slate-400 text-left w-full mt-0.5 block">Explore game catalog</span>
            </button>
            <button onClick={() => setActiveView('submitGame')} className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-left hover:border-pink-500/50 transition-all cursor-pointer shadow-md flex flex-col items-start justify-start w-full">
              <span className="text-xl mb-1 text-left">🚀</span>
              <h4 className="font-bold text-xs text-left w-full">Submit Game</h4>
              <span className="text-[10px] text-slate-400 text-left w-full mt-0.5 block">Publish your title</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 2: BROWSE ALL */}
      {/* ========================================================= */}
      {activeView === 'browse' && (
        <div className="flex flex-col gap-4 relative z-10 text-left w-full">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-4 rounded-2xl shadow-xl text-left w-full">
            <h2 className="text-lg font-black mb-2.5 text-left w-full">🔥 All Indie Games Catalog</h2>
            <input 
              type="text" 
              placeholder="Search games by title or genre..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 mb-2.5 text-left"
            />
            
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-left w-full">
              {['All', 'Action', 'Adventure', 'Arcade', 'Shooter', 'Racing'].map((cat) => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap cursor-pointer transition-all ${selectedCategory === cat ? 'bg-pink-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2.5 text-left w-full">
            {gamesList
              .filter(g => selectedCategory === 'All' || (g.genre && g.genre.toLowerCase().includes(selectedCategory.toLowerCase())))
              .filter(g => g.title && g.title.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((game) => (
                <div 
                  key={game.id} 
                  onClick={() => { setSelectedGame(game); setActiveView('gameDetail'); }}
                  className="flex justify-between items-center p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-pink-500/40 transition-all cursor-pointer text-left w-full"
                >
                  <div className="flex items-center gap-3 text-left">
                    <img src={game.banner || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80"} alt={game.title} className="w-11 h-11 rounded-xl object-cover border border-slate-700" />
                    <div className="text-left">
                      <h3 className="font-bold text-white text-xs text-left w-full">{game.title}</h3>
                      <p className="text-[10px] text-slate-400 text-left w-full">By {game.creator || game.developer || 'Bharat Patil'} • <span className="text-pink-400">{game.genre || 'Action / Indie'}</span></p>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-emerald-400 font-bold text-[11px]">{game.plays || '0 plays'}</span>
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
        <div className="flex flex-col gap-4 relative z-10 text-left w-full">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-5 rounded-3xl shadow-2xl text-left w-full">
            <img src={selectedGame.banner || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80"} alt="Banner" className="w-full h-44 rounded-2xl object-cover mb-3.5 border border-slate-700 shadow-md" />
            <div className="flex justify-between items-start mb-1.5 text-left w-full">
              <h2 className="text-xl font-black text-left w-full">{selectedGame.title}</h2>
              <span className="bg-emerald-500/20 text-emerald-400 text-[11px] px-2.5 py-0.5 rounded-full font-bold shrink-0">{selectedGame.rating || '5.0 ⭐'}</span>
            </div>
            <p className="text-[11px] text-pink-400 font-semibold mb-2.5 text-left w-full">Developed by {selectedGame.creator || selectedGame.developer || 'Bharat Patil'} • {selectedGame.genre || 'Indie'}</p>
            <p className="text-slate-300 text-xs leading-relaxed mb-5 text-left w-full">{selectedGame.desc || selectedGame.description}</p>

            <div className="flex flex-col gap-2.5 text-left w-full">
              {selectedGame.link && selectedGame.link !== '#' ? (
                <a 
                  href={selectedGame.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-pink-600/40 text-xs cursor-pointer text-center block"
                >
                  🎮 Play External Link 🚀
                </a>
              ) : (
                <button 
                  onClick={() => setActiveView('playGame')}
                  className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-pink-600/40 text-xs cursor-pointer text-center"
                >
                  🎮 Play Game Now (WebGL)
                </button>
              )}
              <button 
                onClick={() => setActiveView('projectDetail')}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-[11px] cursor-pointer border border-slate-700 text-center"
              >
                📜 View Dev Logs & Project Updates
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 4: PLAY GAME */}
      {/* ========================================================= */}
      {activeView === 'playGame' && (
        <div className="flex flex-col gap-4 relative z-10 text-center w-full">
          <div className="bg-black border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative h-[350px] flex flex-col items-center justify-center p-5 w-full">
            <div className="absolute inset-0 bg-cover bg-center opacity-40 filter blur-xs" style={{ backgroundImage: `url(${selectedGame?.banner || gamesList[0].banner})` }}></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <span className="w-14 h-14 bg-pink-600/30 border border-pink-500 rounded-full flex items-center justify-center text-2xl mb-3 animate-pulse">🎮</span>
              <h3 className="text-lg font-black mb-1">{selectedGame?.title || gamesList[0].title}</h3>
              <p className="text-[11px] text-slate-300 mb-5">Running live in IndiePulse Cloud Sandbox</p>

              <div className="flex gap-2.5">
                {selectedGame?.link && selectedGame.link !== '#' ? (
                  <a href={selectedGame.link} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl text-xs shadow-lg cursor-pointer">
                    Open Game URL 🚀
                  </a>
                ) : (
                  <button onClick={() => alert('Game active!')} className="px-5 py-2.5 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl text-xs shadow-lg cursor-pointer">
                    Start Playing 🚀
                  </button>
                )}
                <button onClick={() => setActiveView('gameDetail')} className="px-4 py-2.5 bg-slate-800 text-slate-300 font-bold rounded-xl text-xs cursor-pointer">
                  Exit
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
        <div className="flex flex-col gap-4 relative z-10 text-left w-full">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl shadow-xl text-left w-full">
            <h2 className="text-lg font-black mb-1 text-left w-full">📜 Dev Logs & Updates</h2>
            <p className="text-slate-400 text-xs mb-3.5 text-left w-full">Behind-the-scenes progress from indie creators.</p>
            
            <div className="flex flex-col gap-2.5 text-left w-full">
              {devLogs.map((log) => (
                <div key={log.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-left w-full">
                  <div className="flex justify-between items-center mb-1 text-left w-full">
                    <span className="font-bold text-pink-400 text-[11px] text-left">{log.author}</span>
                    <span className="text-[10px] text-slate-500 text-right">{log.time}</span>
                  </div>
                  <h4 className="font-bold text-white text-xs mb-1 text-left w-full">{log.title}</h4>
                  <p className="text-slate-300 text-[11px] mb-2.5 text-left w-full">{log.content}</p>
                  <div className="flex gap-3 text-[10px] text-slate-400 border-t border-slate-900 pt-2 text-left w-full">
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
      {/* VIEW 6: SUBMIT GAME (Intermediate Card) */}
      {/* ========================================================= */}
      {activeView === 'submitGame' && (
        <div className="flex flex-col gap-4 relative z-10 text-center items-center justify-center py-12 w-full">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl w-full max-w-sm flex flex-col items-center">
            <span className="text-4xl mb-3">🚀</span>
            <h2 className="text-xl font-black mb-2 text-center w-full">Publish Your Game</h2>
            <p className="text-slate-400 text-xs mb-6 text-center w-full">Ready to share your creation with the IndiePulse community?</p>

            <button 
              onClick={() => router.push('/submit')}
              className="w-full py-3.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-pink-600/40 cursor-pointer border border-pink-400/40 text-center"
            >
              Publish Game Now 🚀
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
{/* VIEW 7: PLAYTEST REQUESTS (Clean & Real Interactive Board) */}
{/* ========================================================= */}
{activeView === 'playtest' && (
  <div className="flex flex-col gap-3.5 relative z-10 text-left w-full align-left" style={{ textAlign: 'left' }}>
    <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-4 rounded-2xl shadow-xl text-left w-full align-left" style={{ textAlign: 'left' }}>
      <div className="flex items-center justify-between gap-2 mb-3 w-full">
        <h2 className="text-base font-black text-white whitespace-nowrap min-w-0" style={{ textAlign: 'left' }}>
          🧪 Playtest Board
        </h2>
        <button
          type="button"
          onClick={() => setShowNewPlaytestForm(!showNewPlaytestForm)}
          style={{ width: 'auto', display: 'inline-flex' }}
          className="w-fit inline-flex items-center justify-center px-2 py-1 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-sm text-[11px] leading-none cursor-pointer shrink-0 whitespace-nowrap"
        >
          {showNewPlaytestForm ? '✕ Close' : '+ Post'}
        </button>
      </div>

      {showNewPlaytestForm && (
        <form onSubmit={handleCreatePlaytestRequest} className="mb-3.5 p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-2 text-left w-full align-left" style={{ textAlign: 'left' }}>
          <input
            type="text"
            value={newPlaytestTitle}
            onChange={(e) => setNewPlaytestTitle(e.target.value)}
            placeholder="Playtest topic..."
            style={{ textAlign: 'left' }}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-left"
            required
          />
          <input
            type="text"
            value={newPlaytestTags}
            onChange={(e) => setNewPlaytestTags(e.target.value)}
            placeholder="#Playtest, #Feedback"
            style={{ textAlign: 'left' }}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-left"
          />
          <button
            type="submit"
            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs cursor-pointer text-center"
          >
            Post Request ✓
          </button>
        </form>
      )}
      
      <div className="flex flex-col gap-3 text-left w-full align-left" style={{ textAlign: 'left' }}>
        {playtestRequests.map((req) => {
          const reqFeedbacks = submittedFeedbacks[req.id] || [];
          const isFormOpen = activeFeedbackReqId === req.id;

          return (
            <div key={req.id} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-left w-full align-left" style={{ textAlign: 'left' }}>
              <div className="flex items-center justify-start gap-2 mb-1 text-left w-full align-left">
                <div className="w-6 h-6 rounded-full bg-slate-800 border border-pink-500/70 overflow-hidden flex items-center justify-center shrink-0">
                  {syncedProfilePic ? (
                    <img src={syncedProfilePic} alt={req.author} className="w-full h-full object-cover block" />
                  ) : (
                    <span className="text-[10px] font-bold text-pink-400">B</span>
                  )}
                </div>
                <span className="text-[11px] text-pink-400 font-bold text-left" style={{ textAlign: 'left' }}>
                  {req.author}
                </span>
              </div>

              <h4 className="font-bold text-white text-xs mb-2 text-left self-start w-full align-left" style={{ textAlign: 'left' }}>
                {req.title}
              </h4>
              <div className="flex items-center justify-start gap-1.5 flex-wrap mb-3 text-left w-full align-left">
                {req.tags.map((t, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 text-[10px]">{t}</span>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveFeedbackReqId(isFormOpen ? null : req.id);
                  setFeedbackText('');
                  setFeedbackRating(5);
                }}
                className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-lg text-xs cursor-pointer text-center"
              >
                {isFormOpen ? 'Close ✕' : `Test Game & Give Feedback 💬 (${reqFeedbacks.length})`}
              </button>

              {isFormOpen && (
                <div className="mt-3 p-3 rounded-xl bg-slate-900 border border-emerald-500/30 flex flex-col gap-2.5 text-left w-full align-left" style={{ textAlign: 'left' }}>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[11px] font-bold text-emerald-400 text-left" style={{ textAlign: 'left' }}>
                      {feedbackRating}★ • {ratingLabels[feedbackRating]}
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackRating(star)}
                          className={`text-lg leading-none cursor-pointer transition-transform active:scale-125 ${
                            feedbackRating >= star
                              ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.7)]'
                              : 'text-slate-600 hover:text-emerald-300/60'
                          }`}
                          aria-label={`Rate ${star} stars`}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder="Write feedback..."
                    style={{ textAlign: 'left' }}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 resize-none text-left"
                  />

                  <button
                    type="button"
                    onClick={() => handleFeedbackSubmit(req.id)}
                    disabled={!feedbackText.trim()}
                    className={`w-full py-2 font-bold rounded-lg text-xs text-center transition ${
                      feedbackText.trim()
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    Submit Feedback ✓
                  </button>
                </div>
              )}

              {reqFeedbacks.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-slate-800 flex flex-col gap-2 text-left w-full align-left" style={{ textAlign: 'left' }}>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider text-left self-start w-full align-left" style={{ textAlign: 'left' }}>
                    Saved Feedbacks ({reqFeedbacks.length})
                  </span>
                  {reqFeedbacks.map((fb) => (
                    <div key={fb.id} className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col items-start text-left w-full align-left" style={{ textAlign: 'left' }}>
                      <div className="flex items-center justify-between text-[10px] mb-1 w-full">
                        <div className="flex items-center justify-start gap-1.5 text-left">
                          <div className="w-5 h-5 rounded-full bg-slate-800 border border-emerald-500/60 overflow-hidden flex items-center justify-center shrink-0">
                            {syncedProfilePic ? (
                              <img src={syncedProfilePic} alt={fb.tester} className="w-full h-full object-cover block" />
                            ) : (
                              <span className="text-[9px] font-bold text-emerald-400">B</span>
                            )}
                          </div>
                          <span className="font-bold text-emerald-400 text-left" style={{ textAlign: 'left' }}>
                            {fb.tester} • {'★'.repeat(fb.rating)}{'☆'.repeat(5 - fb.rating)}
                          </span>
                        </div>
                        <span className="text-slate-500">{fb.time}</span>
                      </div>
                      <p
                        style={{ textAlign: 'left', width: '100%' }}
                        className="text-[11px] text-slate-200 leading-snug text-left self-start mr-auto w-full align-left break-words"
                      >
                        {fb.comment}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  </div>
)}

      {/* ========================================================= */}
      {/* VIEW 8: TEAM FINDER (Live DP from localStorage 'indiePulse_pic') */}
      {/* ========================================================= */}
      {activeView === 'teamFinder' && (
        <div className="flex flex-col gap-4 relative z-10 text-left w-full">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl shadow-xl text-center w-full">
            
            {/* Live DP Image synced from localStorage ('indiePulse_pic') with Glowing Border */}
            <div className="w-20 h-20 rounded-full mx-auto p-[2px] bg-gradient-to-tr from-pink-500 to-purple-500 mb-2.5 shadow-lg">
              <div className="w-full h-full rounded-full bg-[#111827] overflow-hidden flex items-center justify-center border-2 border-slate-950">
                {syncedProfilePic ? (
                  <img src={syncedProfilePic} alt="Bharat Patil DP" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-10 h-10 text-[#9ca3af] translate-y-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                )}
              </div>
            </div>

            <h2 className="text-lg font-black text-center w-full">Bharat Patil</h2>
            <p className="text-[11px] text-pink-400 font-semibold mb-3.5 text-center w-full">Solo Game Developer & Creator</p>
            
            {/* Custom Message Textarea for Collaboration Request */}
            <div className="flex flex-col gap-1.5 mb-3.5 text-left w-full">
              <label className="text-[11px] font-semibold text-slate-300">Your Message / Proposal:</label>
              <textarea
                rows={3}
                value={collabMessage}
                onChange={(e) => setCollabMessage(e.target.value)}
                placeholder="Write what you want to collaborate on..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 resize-none shadow-inner"
              />
            </div>

            {requestSent ? (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold rounded-xl w-full text-center">
                ✓ Collaboration Request Saved & Sent Successfully!
              </div>
            ) : (
              <button 
                onClick={() => {
                  if (!collabMessage.trim()) {
                    alert('Please write a message before sending the request!');
                    return;
                  }

                  // Save request to localStorage backend
                  const newRequest = {
                    id: Date.now().toString(),
                    sender: "Guest Developer",
                    message: collabMessage,
                    timestamp: new Date().toLocaleString()
                  };

                  const updatedRequests = [newRequest, ...savedRequests];
                  localStorage.setItem('indiePulse_collab_requests', JSON.stringify(updatedRequests));
                  setSavedRequests(updatedRequests);

                  setRequestSent(true);
                  setCollabMessage('');

                  setTimeout(() => {
                    setRequestSent(false);
                  }, 3500);
                }} 
                className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md text-center"
              >
                🤝 Send Collaboration Request
              </button>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* VIEW 9: CREATOR DASHBOARD & UPI */}
      {/* ========================================================= */}
      {activeView === 'dashboard' && (
        <div className="flex flex-col gap-4 relative z-10 text-left w-full">
          <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-5 rounded-2xl shadow-xl text-left w-full">
            <h2 className="text-lg font-black mb-1 text-left w-full">📊 Creator Dashboard & UPI</h2>
            <p className="text-slate-400 text-xs mb-3.5 text-left w-full">Track your plays, tips, and earnings.</p>

            <div className="grid grid-cols-2 gap-2.5 mb-3.5 text-left w-full">
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block text-center w-full">Total Plays</span>
                <span className="text-lg font-black text-emerald-400 text-center w-full block">10.5K</span>
              </div>
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-center">
                <span className="text-[10px] text-slate-400 block text-center w-full">UPI Tips Received</span>
                <span className="text-lg font-black text-pink-400 text-center w-full block">₹5,500</span>
              </div>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-center w-full">
              <h4 className="text-xs font-bold text-white mb-1.5 text-left w-full">⚡ Setup UPI Donations</h4>
              <p className="text-[10px] text-slate-400 mb-2.5 text-left w-full">Allow players to tip you directly via UPI.</p>
              <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-xs font-mono text-cyan-400 mb-2.5 text-center">
                bharatpatil@upi
              </div>
              <button onClick={() => alert('UPI QR generated!')} className="w-full py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl text-xs cursor-pointer text-center">
                Generate UPI QR Code 📱
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* FIXED BOTTOM NAVIGATION DOCK */}
      {/* ========================================================= */}
      <div className="fixed bottom-0 inset-x-0 bg-slate-950/98 backdrop-blur-2xl border-t border-slate-800 py-1.5 px-0 z-50 max-w-xl mx-auto grid grid-cols-6 text-[8px] font-bold text-slate-400">
        <button onClick={() => setActiveView('discover')} className={`flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors py-1 px-0 ${activeView === 'discover' ? 'text-pink-400 font-black' : 'hover:text-white'}`}>
          <span className="text-sm">🔥</span>
          <span className="w-full text-center truncate">Discover</span>
        </button>
        <button onClick={() => setActiveView('browse')} className={`flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors py-1 px-0 ${activeView === 'browse' ? 'text-pink-400 font-black' : 'hover:text-white'}`}>
          <span className="text-sm">🎮</span>
          <span className="w-full text-center truncate">Browse</span>
        </button>
        <button onClick={() => setActiveView('submitGame')} className={`flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors py-1 px-0 ${activeView === 'submitGame' ? 'text-pink-400 font-black' : 'hover:text-white'}`}>
          <span className="text-sm">🚀</span>
          <span className="w-full text-center truncate">Submit</span>
        </button>
        <button onClick={() => setActiveView('playtest')} className={`flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors py-1 px-0 ${activeView === 'playtest' ? 'text-pink-400 font-black' : 'hover:text-white'}`}>
          <span className="text-sm">🧪</span>
          <span className="w-full text-center truncate">Playtest</span>
        </button>
        <button onClick={() => setActiveView('teamFinder')} className={`flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors py-1 px-0 ${activeView === 'teamFinder' ? 'text-pink-400 font-black' : 'hover:text-white'}`}>
          <span className="text-sm">👥</span>
          <span className="w-full text-center truncate">Team</span>
        </button>
        <button onClick={() => setActiveView('dashboard')} className={`flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-colors py-1 px-0 ${activeView === 'dashboard' ? 'text-pink-400 font-black' : 'hover:text-white'}`}>
          <span className="text-sm">📊</span>
          <span className="w-full text-center truncate">Stats</span>
        </button>
      </div>

    </main>
  );
}