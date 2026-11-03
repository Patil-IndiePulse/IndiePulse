'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from "@/app/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [feedback, setFeedback] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Menu drawer state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Lock Popup States
  const [showLockPopup, setShowLockPopup] = useState(false);
  const [lockedFeatureName, setLockedFeatureName] = useState('');

  // Profile Picture State for Homepage
  const [homeProfilePic, setHomeProfilePic] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Load saved profile picture from localStorage on homepage load
    const savedPic = localStorage.getItem('indiePulse_pic');
    if (savedPic) {
      setHomeProfilePic(savedPic);
    }

    return () => unsubscribe();
  }, []);

  const mockSearchResults = [
    { id: '1', title: 'Cyber Nexus // RPG', type: 'Game', link: '/play/1' },
    { id: '2', title: 'Neon Protocol Zero', type: 'Game', link: '/play/2' },
    { id: '3', title: 'Quantum Runner 3D', type: 'Game', link: '/play/3' },
    { id: 'Bharat Patil (Founder)', title: 'Bharat Patil (Founder)', type: 'Creator', link: '/profile' },
  ].filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

  // 5 Main Protected Menu Options
  const menuOptions = [
    { name: 'Discover Games & Projects', href: '/discover' },
    { name: 'Community Feed', href: '/community' },
    { name: 'Leaderboard & Rankings', href: '/leaderboard' },
    { name: 'Quests & Rewards', href: '/quests' },
    { name: 'My Profile', href: '/profile' },
  ];

  const handleProtectedClick = (e: React.MouseEvent, optionName: string) => {
    if (!user) {
      e.preventDefault(); // Stop navigation if not logged in
      setLockedFeatureName(optionName);
      setShowLockPopup(true);
      setIsMenuOpen(false); // Close menu drawer to show popup clearly
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      setIsSending(true);
      setTimeout(() => {
        setIsSending(false);
        setSubmitted(true);
        setFeedback('');
        setTimeout(() => setSubmitted(false), 5000);
      }, 1200);
    }
  };

  return (
    <main className="min-h-screen bg-[#030014] text-white flex flex-col relative overflow-x-hidden select-none pb-12">
      {/* Background Unified Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Navigation Bar - Steam Mobile Platform Style (Slim & Compact) */}
      <nav className="w-full bg-[#171a21] border-b border-[#2a475e] px-3 py-2 flex flex-col gap-2 relative z-50 shadow-md">
        
        {/* Line 1: Hamburger Menu & Slim Steam Search Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', width: '100%', gap: '8px', boxSizing: 'border-box' }} className="relative">
          
          {/* Three Lines (Hamburger Menu Button) - Slim & Compact */}
          <div className="relative shrink-0">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 border border-pink-400/30 rounded-md text-white transition-all cursor-pointer flex items-center justify-center shadow-md shadow-pink-600/30"
              aria-label="Toggle Menu"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>

            {/* Hamburger Menu Drawer */}
            {isMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-[#070514] border border-pink-500/40 rounded-2xl p-4 flex flex-col gap-3.5 shadow-2xl z-50">
                
                {/* Dynamic Auth Header inside Menu Drawer - All 3 Buttons in One Line */}
                <div className="flex items-center justify-between gap-1.5 w-full mb-1 bg-slate-900/90 border border-slate-800 p-2 rounded-xl">
                  {!user ? (
                    <div className="flex gap-2 w-full">
                      <Link 
                        href="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex-1 py-1.5 bg-gradient-to-r from-pink-600 to-purple-600 text-center rounded-lg text-[11px] font-bold text-white border border-pink-400/40 shadow"
                      >
                        Login
                      </Link>
                      <Link 
                        href="/signup"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex-1 py-1.5 bg-gradient-to-r from-pink-600 to-purple-600 text-center rounded-lg text-[11px] font-bold text-white border border-pink-400/40 shadow"
                      >
                        Get Started
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between w-full gap-1">
                      <div className="px-2 py-1 bg-pink-600/20 border border-pink-500/40 rounded-lg text-[10px] font-bold text-pink-300 flex items-center gap-1 shadow">
                        Login <span className="text-emerald-400">✓</span>
                      </div>
                      <div className="px-2 py-1 bg-pink-600/20 border border-pink-500/40 rounded-lg text-[10px] font-bold text-pink-300 flex items-center gap-1 shadow">
                        Get Started <span className="text-emerald-400">✓</span>
                      </div>
                      <button 
                        onClick={() => {
                          signOut(auth);
                          setIsMenuOpen(false);
                        }}
                        className="px-2.5 py-1 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-center rounded-lg text-[10px] font-bold text-white border border-pink-400/40 shadow cursor-pointer transition"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-[10px] uppercase tracking-widest text-pink-400 font-bold px-1 mt-1">Navigation & Control</div>
                
                {menuOptions.map((opt, idx) => {
                  const isLocked = !user;
                  return (
                    <a
                      key={idx}
                      href={opt.href}
                      onClick={(e) => handleProtectedClick(e, opt.name)}
                      className={`px-3.5 py-3 border rounded-xl text-xs font-medium flex items-center justify-between transition ${
                        isLocked 
                          ? 'bg-slate-900/60 border-slate-800 text-slate-400' 
                          : 'bg-slate-900/90 border-slate-700 text-slate-200 hover:text-white'
                      }`}
                    >
                      <span>
                        {opt.name === 'Discover Games & Projects' && '🧭 '}
                        {opt.name === 'Community Feed' && '💬 '}
                        {opt.name === 'Leaderboard & Rankings' && '🏆 '}
                        {opt.name === 'Quests & Rewards' && '⚡ '}
                        {opt.name === 'My Profile' && '👤 '}
                        {opt.name}
                      </span>
                      {isLocked ? (
                        <span className="text-sm" title="Locked - Please Login">🔐</span>
                      ) : (
                        <span className="text-pink-400">→</span>
                      )}
                    </a>
                  );
                })}

                <a 
                  href="/menu" 
                  onClick={(e) => handleProtectedClick(e, 'Settings and Activity')} 
                  className="mt-1 px-3.5 py-3 bg-gradient-to-r from-pink-600/30 to-purple-600/30 border border-pink-500/50 rounded-xl text-xs font-bold text-pink-300 flex items-center justify-between"
                >
                  <span>⚙️ Settings and Activity</span> <span>{!user ? '🔐' : '→'}</span>
                </a>
              </div>
            )}
          </div>

          {/* Steam-Style Slim Search Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', backgroundColor: '#313843', border: '1px solid #000000', borderRadius: '5px', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearching(true);
              }}
              onFocus={() => setIsSearching(true)}
              placeholder="Search the store"
              style={{ width: '100%', backgroundColor: 'transparent', padding: '6px 10px', fontSize: '12px', color: '#ffffff', fontStyle: 'italic', outline: 'none', border: 'none', boxSizing: 'border-box', minWidth: 0 }}
            />
            <button 
              type="button"
              style={{ backgroundColor: '#0098ff', border: 'none', padding: '6px 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              aria-label="Search"
            >
              <svg style={{ width: '14px', height: '14px', color: '#ffffff' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </div>

          {/* Search Results Dropdown */}
          {isSearching && searchQuery.trim().length > 0 && (
            <div className="absolute top-full mt-2 left-0 w-full bg-[#171a21] border border-[#2a475e] rounded-xl shadow-2xl overflow-hidden z-50">
              {mockSearchResults.length > 0 ? (
                mockSearchResults.map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    onClick={() => setIsSearching(false)}
                    className="block px-4 py-3 hover:bg-[#21242d] border-b border-[#2a475e]/50 last:border-none"
                  >
                    <div className="text-xs font-semibold text-white">{item.title}</div>
                    <div className="text-[10px] text-[#66c0f4] uppercase tracking-wider">{item.type}</div>
                  </a>
                ))
              ) : (
                <div className="px-4 py-3 text-xs text-slate-400 text-center">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

      </nav>

      {/* Hero Section */}
      <div className="flex-1 px-5 py-6 max-w-6xl mx-auto w-full flex flex-col relative z-10">
        
        {/* Top Header Row */}
        <div className="w-full flex items-center justify-between mb-6 px-1">
          <Link href="/profile" className="relative group cursor-pointer" aria-label="User Profile">
            <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-pink-500 via-purple-500 to-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.6)] transition-transform group-hover:scale-105">
              <div className="w-full h-full rounded-full bg-[#111827] overflow-hidden flex items-center justify-center border-2 border-[#030014]">
                {homeProfilePic ? (
                  <img src={homeProfilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-8 h-8 text-[#9ca3af] translate-y-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                )}
              </div>
            </div>
          </Link>

          <div className="flex flex-col items-end cursor-pointer group">
            <div className="text-2xl md:text-3xl font-black tracking-wider font-sans bg-gradient-to-r from-blue-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(236,72,153,0.6)]">
              IndiePulse
            </div>
            <div className="w-full flex justify-end -mt-1">
              <svg className="w-28 h-3 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,1)]" viewBox="0 0 140 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 2C38 16 102 16 136 4" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                <path d="M122 2L136 4L128 13" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto pt-2 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-pink-500/50 bg-pink-500/15 text-pink-300 text-[11px] font-extrabold tracking-wide uppercase mb-4 shadow-[0_0_20px_rgba(236,72,153,0.4)]">
            <span>✦</span> NEXT-GEN INDIE GAME ECOSYSTEM
          </div>
          
          <h1 className="text-2xl md:text-5xl font-black tracking-tight mb-4 leading-tight">
            Where Indie Games <br />
            <span className="bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(236,72,153,0.6)]">
              Come Alive & Thrive
            </span>
          </h1>
          
          <p className="text-slate-200 text-xs md:text-sm mb-6 max-w-2xl font-normal leading-relaxed select-none px-2">
            A globally scalable platform powered by Octalysis gamification. Connect with passionate creators, play unique indie titles, and fuel your intrinsic motivation.
          </p>

          <div className="mb-6 flex flex-wrap items-center justify-center gap-3 w-full">
            <a 
              href="/submit" 
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-[0_0_20px_rgba(236,72,153,0.6)] transition-all inline-flex items-center justify-center gap-2 border border-pink-400/50 cursor-pointer"
            >
              <span>+</span> Publish Game
            </a>
            
            <Link 
              href="/community"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold shadow-[0_0_20px_rgba(216,72,236,0.5)] transition-all inline-flex items-center justify-center gap-2 cursor-pointer border border-pink-400/50"
            >
              <span>+</span> CREATE POST
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-3 w-full">
            <a href="/community" className="w-full sm:w-auto px-5 py-3 bg-slate-900/90 hover:bg-slate-800 text-pink-300 font-semibold rounded-xl border border-pink-500/40 shadow-[0_0_12px_rgba(236,72,153,0.25)] transition-all text-xs text-center">
              Explore Community Feed
            </a>
            <Link 
              href="/chat"
              className="w-full sm:w-auto px-5 py-3 bg-slate-900/90 hover:bg-slate-800 text-emerald-400 font-semibold rounded-xl border border-emerald-500/40 shadow-[0_0_12px_rgba(16,185,129,0.25)] transition-all text-xs text-center cursor-pointer flex items-center justify-center gap-2 mx-auto"
            >
              <span>💬</span> Chat
            </Link>
          </div>
        </div>
      </div>

      {/* Trending Section - Compact & Small Tap-Size Cards Grid */}
      <section className="px-4 py-8 max-w-6xl mx-auto w-full relative z-10">
        <div className="flex items-center justify-between mb-6 px-1">
          <div>
            <span className="text-[10px] font-bold px-2.5 py-1 bg-pink-500/20 text-pink-300 rounded-md uppercase tracking-wider border border-pink-500/30 shadow-[0_0_10px_rgba(236,72,153,0.3)]">Live & Hot</span>
            <h2 className="text-xl font-bold mt-2 text-white">Trending Indie Games</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/90 border border-pink-500/35 rounded-xl overflow-hidden hover:border-pink-400 transition-all group shadow-[0_0_15px_rgba(236,72,153,0.2)] p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-pink-400 uppercase font-bold tracking-wide">Cyberpunk / Action</span>
                <span className="px-2 py-0.5 bg-black/70 text-[10px] text-pink-300 rounded-md font-semibold border border-pink-500/30">WebGL</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1 group-hover:text-pink-300 transition-colors">Cyber Nexus // RPG</h3>
              <p className="text-[11px] text-slate-300 mb-3 line-clamp-2 leading-snug">An immersive cyberpunk role-playing adventure uploaded by an indie developer.</p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold">🔥 1.2k Plays</span>
              <Link href="/play/1" className="px-3 py-1.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-[0_0_10px_rgba(236,72,153,0.4)] border border-pink-400/40">
                Play ⚡
              </Link>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-pink-500/35 rounded-xl overflow-hidden hover:border-pink-400 transition-all group shadow-[0_0_15px_rgba(236,72,153,0.2)] p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-purple-400 uppercase font-bold tracking-wide">Strategy / Grid</span>
                <span className="px-2 py-0.5 bg-black/70 text-[10px] text-purple-300 rounded-md font-semibold border border-purple-500/30">Puzzle</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1 group-hover:text-pink-300 transition-colors">Neon Protocol Zero</h3>
              <p className="text-[11px] text-slate-300 mb-3 line-clamp-2 leading-snug">A tactical grid-based strategy simulation test built on indie engine.</p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold">🔥 850 Plays</span>
              <Link href="/play/2" className="px-3 py-1.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-[0_0_10px_rgba(236,72,153,0.4)] border border-pink-400/40">
                Play ⚡
              </Link>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-pink-500/35 rounded-xl overflow-hidden hover:border-pink-400 transition-all group shadow-[0_0_15px_rgba(236,72,153,0.2)] p-4 flex flex-col justify-between sm:col-span-2 md:col-span-1">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] text-indigo-400 uppercase font-bold tracking-wide">Arcade / Runner</span>
                <span className="px-2 py-0.5 bg-black/70 text-[10px] text-indigo-300 rounded-md font-semibold border border-pink-500/30">Arcade</span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1 group-hover:text-pink-300 transition-colors">Quantum Runner 3D</h3>
              <p className="text-[11px] text-slate-300 mb-3 line-clamp-2 leading-snug">Fast-paced futuristic endless runner game featuring neon obstacles.</p>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 font-semibold">🔥 3.4k Plays</span>
              <Link href="/play/3" className="px-3 py-1.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg text-[11px] font-bold transition-all cursor-pointer shadow-[0_0_10px_rgba(236,72,153,0.4)] border border-pink-400/40">
                Play ⚡
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Core Drives & Community Feed Section (Fully Restored & Linked) */}
      <section className="px-4 py-8 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <Link 
          href="/development" 
          className="block bg-slate-900/90 border border-pink-500/35 p-5 rounded-xl hover:border-pink-400 transition-all cursor-pointer shadow-[0_0_20px_rgba(236,72,153,0.15)]"
        >
          <span className="text-[10px] font-bold px-2.5 py-1 bg-pink-500/20 text-pink-300 rounded-md border border-pink-500/30">Core Drive 2</span>
          <h3 className="text-base font-bold mt-3 mb-2 text-white">Development & Accomplishment</h3>
          <p className="text-xs text-slate-300 leading-relaxed">Earn points by uploading game builds, completing milestones, and reviewing indie projects.</p>
        </Link>

        <Link 
          href="/social-influence" 
          className="block bg-slate-900/90 border border-pink-500/35 p-5 rounded-xl hover:border-pink-400 transition-all cursor-pointer shadow-[0_0_20px_rgba(236,72,153,0.15)]"
        >
          <span className="text-[10px] font-bold px-2.5 py-1 bg-purple-500/20 text-purple-300 rounded-md border border-pink-500/30">Core Drive 5</span>
          <h3 className="text-base font-bold mt-3 mb-2 text-white">Social Influence & Peer Praise</h3>
          <p className="text-xs text-slate-300 leading-relaxed">Gain badges, unlock special creator status, and receive peer validation from global gamers.</p>
        </Link>
        
        <Link 
          href="/curiosity" 
          className="block bg-slate-900/90 border border-pink-500/35 p-5 rounded-xl hover:border-pink-400 transition-all cursor-pointer shadow-[0_0_20px_rgba(236,72,153,0.15)]"
        >
          <span className="text-[10px] font-bold px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-md border border-pink-500/30">Core Drive 7</span>
          <h3 className="text-base font-bold mt-3 mb-2 text-white">Unpredictability & Curiosity</h3>
          <p className="text-xs text-slate-300 leading-relaxed">Unlock secret community drops, mystery game tests, and surprise rewards as you level up.</p>
        </Link>

        <Link 
          href="/community" 
          className="block bg-slate-900/90 border border-pink-500/35 p-5 rounded-xl hover:border-pink-400 transition-all cursor-pointer md:col-span-3 shadow-[0_0_20px_rgba(236,72,153,0.15)]"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold px-2.5 py-1 bg-pink-500/20 text-pink-300 rounded-md border border-pink-500/30">Live Feed</span>
            <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-pink-300 rounded-md">DevLog #4</span>
          </div>
          <h3 className="text-base font-bold mb-2 flex items-center gap-2 text-white">
            <span>💬</span> Live Community Feed
          </h3>
          <p className="text-xs text-slate-300 mb-4 line-clamp-2 leading-relaxed">
            "Just integrated dynamic lighting and shadow effects into our cyberpunk indie RPG! Check out the early alpha..."
          </p>
          <div className="flex items-center justify-between text-[11px] text-pink-400 font-bold pt-3 border-t border-slate-800">
            <span>❤️ 42 Likes • 12 Comments</span>
            <span>Join Discussion →</span>
          </div>
        </Link>
      </section>

      {/* Founder's Note Section */}
      <section className="px-4 pb-12 max-w-6xl mx-auto w-full relative z-10">
        <div className="bg-slate-900/95 border border-pink-500/45 rounded-2xl p-6 shadow-[0_0_30px_rgba(236,72,153,0.2)] transition-all">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center font-bold text-lg text-white shadow-[0_0_12px_rgba(236,72,153,0.6)] border border-pink-400/50">
              BP
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Founder's Direct Note & Feedback</h3>
              <p className="text-[11px] text-slate-300 mt-0.5">Have a suggestion or thought? Send it directly to the founder!</p>
            </div>
          </div>

          {submitted ? (
            <div className="bg-emerald-950/90 border border-emerald-600 text-emerald-200 p-3 rounded-xl text-xs text-center font-medium shadow-lg">
              🚀 Success! Your direct note has been securely delivered to the founder's inbox.
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="mt-3">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                className="w-full bg-slate-800/90 border border-pink-500/40 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-pink-400 mb-3 shadow-inner leading-relaxed"
                placeholder="Write your note or feedback here..."
                required
              />
              <button
                type="submit"
                disabled={isSending}
                className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer border border-pink-400/40"
              >
                {isSending ? 'Sending to Founder...' : 'Send to Founder'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Lock Warning Popup Modal */}
      {showLockPopup && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-pink-500/50 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-16 h-16 bg-pink-600/20 border border-pink-500/30 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl shadow-[0_0_20px_rgba(236,72,153,0.4)]">
              🔐
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Authentication Required</h3>
            <p className="text-xs text-slate-300 mb-6 leading-relaxed">
              Please sign-up or login to access <span className="text-pink-400 font-semibold">"{lockedFeatureName}"</span> and explore IndiePulse!
            </p>

            <div className="flex flex-col gap-2.5">
              <Link 
                href="/login" 
                className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 rounded-xl text-xs font-bold transition text-white shadow-lg shadow-pink-600/30 border border-pink-400/40 cursor-pointer"
              >
                Login Now
              </Link>
              <Link 
                href="/signup" 
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-purple-500 rounded-xl text-xs font-bold transition text-white shadow-lg shadow-purple-600/30 border border-pink-400/40 cursor-pointer"
              >
                Create Account (Sign Up)
              </Link>
              <button 
                onClick={() => setShowLockPopup(false)}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold transition text-slate-400 hover:text-white mt-1 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full border-t border-pink-500/20 bg-[#030014] py-6 px-4 mt-auto relative z-10 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div>© {new Date().getFullYear()} IndiePulse. All rights reserved.</div>
          <div className="flex gap-5">
            <a href="/privacy" className="hover:text-pink-400 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-pink-400 transition-colors">Terms of Service</a>
            <a href="/contact" className="hover:text-pink-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}