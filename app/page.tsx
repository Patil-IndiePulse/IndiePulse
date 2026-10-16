'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const [feedback, setFeedback] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  // Menu drawer state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const mockSearchResults = [
    { id: '1', title: 'Cyber Nexus // RPG', type: 'Game', link: '/play/1' },
    { id: '2', title: 'Neon Protocol Zero', type: 'Game', link: '/play/2' },
    { id: '3', title: 'Quantum Runner 3D', type: 'Game', link: '/play/3' },
    { id: 'Bharat Patil (Founder)', title: 'Bharat Patil (Founder)', type: 'Creator', link: '/profile' },
  ].filter(item => item.title.toLowerCase().includes(searchQuery.toLowerCase()));

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
    <main className="min-h-screen bg-[#030014] text-white flex flex-col relative overflow-x-hidden select-none text-lg">
      {/* Background Unified Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Navigation Bar - Large Steam Style */}
      <nav className="w-full bg-[#171a21] border-b border-[#2a475e] px-6 py-4 flex flex-col gap-3 relative z-50">
        
        {/* Line 1: Hamburger Menu & Large Steam-Style Search Bar */}
        <div className="w-full flex items-center gap-4">
          
          {/* Three Lines (Hamburger Menu Button) */}
          <div className="relative shrink-0">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 bg-[#21242d] border border-[#32353c] rounded-lg text-[#c7d5e0] hover:text-white transition-all cursor-pointer flex items-center justify-center shadow-lg"
              aria-label="Toggle Menu"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>

            {/* Hamburger Menu Drawer */}
            {isMenuOpen && (
              <div className="absolute top-full left-0 mt-3 w-80 bg-[#070514] border border-pink-500/40 rounded-2xl p-5 flex flex-col gap-4 shadow-2xl transition-all z-50">
                
                {/* Login & Get Started Buttons in Pink */}
                <div className="flex gap-3 w-full mb-1">
                  <Link 
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-center rounded-xl text-base font-bold text-white border border-pink-400/40 shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-center rounded-xl text-base font-bold text-white border border-pink-400/40 shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all"
                  >
                    Get Started
                  </Link>
                </div>

                <div className="text-sm uppercase tracking-widest text-pink-400 font-bold px-1 mt-1">Navigation & Control</div>
                
                <a href="/discover" onClick={() => setIsMenuOpen(false)} className="px-4 py-3.5 bg-slate-900/90 hover:bg-pink-950/40 border border-slate-800 rounded-xl text-base font-medium text-slate-200 hover:text-pink-300 transition-colors flex items-center justify-between">
                  <span>🧭 Discover Games & Projects</span> <span>→</span>
                </a>

                <a href="/community" onClick={() => setIsMenuOpen(false)} className="px-4 py-3.5 bg-slate-900/90 hover:bg-pink-950/40 border border-slate-800 rounded-xl text-base font-medium text-slate-200 hover:text-pink-300 transition-colors flex items-center justify-between">
                  <span>💬 Community Feed</span> <span>→</span>
                </a>

                <a href="/leaderboard" onClick={() => setIsMenuOpen(false)} className="px-4 py-3.5 bg-slate-900/90 hover:bg-pink-950/40 border border-slate-800 rounded-xl text-base font-medium text-slate-200 hover:text-pink-300 transition-colors flex items-center justify-between">
                  <span>🏆 Leaderboard & Rankings</span> <span>→</span>
                </a>

                <a href="/quests" onClick={() => setIsMenuOpen(false)} className="px-4 py-3.5 bg-slate-900/90 hover:bg-pink-950/40 border border-slate-800 rounded-xl text-base font-medium text-slate-200 hover:text-pink-300 transition-colors flex items-center justify-between">
                  <span>⚡ Quests & Rewards</span> <span>→</span>
                </a>

                <a href="/profile" onClick={() => setIsMenuOpen(false)} className="px-4 py-3.5 bg-slate-900/90 hover:bg-pink-950/40 border border-slate-800 rounded-xl text-base font-medium text-slate-200 hover:text-pink-300 transition-colors flex items-center justify-between">
                  <span>👤 My Profile</span> <span>→</span>
                </a>

                <a href="/menu" onClick={() => setIsMenuOpen(false)} className="mt-1 px-4 py-4 bg-gradient-to-r from-pink-600/30 to-purple-600/30 hover:from-pink-600/50 hover:to-purple-600/50 border border-pink-500/50 rounded-xl text-base font-bold text-pink-300 transition-colors flex items-center justify-between shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                  <span>⚙️ Settings and Activity (Laptop View)</span> <span>→</span>
                </a>
              </div>
            )}
          </div>

          {/* Large Steam-Style Search Bar */}
          <div className="w-full flex items-center bg-[#313843] border border-black rounded-lg overflow-hidden shadow-inner">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearching(true);
              }}
              onFocus={() => setIsSearching(true)}
              placeholder="Search the store"
              className="flex-1 bg-transparent px-4 py-3 text-base text-white italic outline-none border-none min-w-0"
            />
            <button 
              type="button"
              className="bg-[#0098ff] border-none px-5 py-3 flex items-center justify-center cursor-pointer shrink-0"
              aria-label="Search"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
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
                    className="block px-4 py-3.5 hover:bg-[#21242d] border-b border-[#2a475e]/50 last:border-none transition-colors cursor-pointer"
                  >
                    <div className="text-base font-semibold text-white">{item.title}</div>
                    <div className="text-sm text-[#66c0f4] uppercase tracking-wider">{item.type}</div>
                  </a>
                ))
              ) : (
                <div className="px-4 py-3.5 text-base text-slate-400 text-center">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Line 2: Steam Quick Links */}
        <div className="w-full flex items-center gap-6 text-sm md:text-base text-[#c7d5e0] overflow-x-auto whitespace-nowrap pb-1">
          <a href="/discover" className="hover:text-white">Browse ▾</a>
          <a href="/quests" className="hover:text-white">Recommendations ▾</a>
          <a href="/community" className="hover:text-white">More ▾</a>
          <a href="/profile" className="text-[#66c0f4] ml-auto">IndiePulse Store</a>
        </div>

      </nav>

      {/* Hero Section */}
      <div className="flex-1 px-8 py-10 max-w-6xl mx-auto w-full flex flex-col relative z-10">
        
        {/* IndiePulse Logo Placed on Left Corner - Large Size */}
        <div className="flex flex-col items-start cursor-pointer group mb-10">
          <div className="text-4xl md:text-5xl font-black tracking-wider text-orange-500 drop-shadow-[0_0_20px_rgba(249,115,22,0.7)]">
            IndiePulse
          </div>
          <div className="w-full flex justify-start -mt-1">
            <svg className="w-48 h-5 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.9)]" viewBox="0 0 140 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 2C38 16 102 16 136 4" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M122 2L136 4L128 13" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto pt-2 pb-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-pink-500/40 bg-pink-500/10 text-pink-300 text-sm md:text-base font-bold tracking-wide uppercase mb-6 shadow-[0_0_25px_rgba(236,72,153,0.3)]">
            <span>✦</span> NEXT-GEN INDIE GAME ECOSYSTEM
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight">
            Where Indie Games <br />
            <span className="bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(236,72,153,0.6)]">
              Come Alive & Thrive
            </span>
          </h1>
          
          <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-3xl font-normal leading-relaxed select-none">
            A globally scalable platform powered by Octalysis gamification. Connect with passionate creators, play unique indie titles, and fuel your intrinsic motivation.
          </p>

          <div className="mb-10 flex flex-wrap items-center justify-center gap-5">
            <a 
              href="/submit" 
              className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-2xl text-base md:text-lg font-bold shadow-[0_0_25px_rgba(236,72,153,0.5)] transition-all inline-flex items-center gap-3 border border-pink-400/40 cursor-pointer"
            >
              <span>+</span> Publish Game
            </a>
            
            <Link 
              href="/community"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl text-base md:text-lg font-bold shadow-[0_0_25px_rgba(216,72,236,0.4)] transition-all inline-flex items-center gap-3 cursor-pointer border border-pink-400/40"
            >
              <span>+</span> CREATE POST
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-5">
            <a href="/community" className="px-7 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-pink-300 font-medium rounded-xl border border-pink-500/30 shadow-[0_0_20px_rgba(236,72,153,0.2)] transition-all text-base md:text-lg">
              Explore Community Feed
            </a>
            <a href="/quests" className="px-7 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white font-medium rounded-xl border border-slate-700 transition-all text-base md:text-lg">
              Join the Quests
            </a>
          </div>
        </div>
      </div>

      {/* Trending Section */}
      <section className="px-8 py-10 max-w-6xl mx-auto w-full relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-sm font-bold px-3.5 py-1.5 bg-pink-500/20 text-pink-300 rounded-md uppercase tracking-wider border border-pink-500/30 shadow-[0_0_12px_rgba(236,72,153,0.2)]">Live & Hot</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 text-white">Trending Indie Games</h2>
          </div>
          <div className="flex gap-3">
            <button className="w-12 h-12 rounded-xl bg-slate-900 border border-pink-500/30 flex items-center justify-center text-pink-400 hover:text-white transition-all cursor-pointer shadow-[0_0_12px_rgba(236,72,153,0.2)] text-lg">
              ←
            </button>
            <button className="w-12 h-12 rounded-xl bg-slate-900 border border-pink-500/30 flex items-center justify-center text-pink-400 hover:text-white transition-all cursor-pointer shadow-[0_0_12px_rgba(236,72,153,0.2)] text-lg">
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/90 border border-pink-500/30 rounded-3xl overflow-hidden hover:border-pink-400 transition-all group shadow-[0_0_25px_rgba(236,72,153,0.2)]">
            <div className="h-52 bg-gradient-to-br from-pink-950 via-purple-950 to-slate-950 flex items-center justify-center relative overflow-hidden">
              <span className="text-6xl group-hover:scale-110 transition-transform duration-300">🎮</span>
              <span className="absolute top-4 right-4 px-3 py-1 bg-black/70 backdrop-blur-md text-sm text-pink-300 rounded-lg font-semibold border border-pink-500/40">
                WebGL
              </span>
            </div>
            <div className="p-7">
              <div className="text-sm text-pink-400 uppercase font-bold mb-2">Cyberpunk / Action</div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-300 transition-colors">Cyber Nexus // RPG</h3>
              <p className="text-base text-slate-300 mb-6 line-clamp-2">An immersive cyberpunk role-playing adventure uploaded by an indie developer.</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-base text-slate-300 font-medium">🔥 1.2k Plays</span>
                <Link href="/play/1" className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl text-base font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(236,72,153,0.4)] border border-pink-400/30">
                  Play Game Now ⚡
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-pink-500/30 rounded-3xl overflow-hidden hover:border-pink-400 transition-all group shadow-[0_0_25px_rgba(236,72,153,0.2)]">
            <div className="h-52 bg-gradient-to-br from-purple-950 via-pink-950 to-slate-950 flex items-center justify-center relative overflow-hidden">
              <span className="text-6xl group-hover:scale-110 transition-transform duration-300">🧩</span>
              <span className="absolute top-4 right-4 px-3 py-1 bg-black/70 backdrop-blur-md text-sm text-purple-300 rounded-lg font-semibold border border-purple-500/40">
                Puzzle
              </span>
            </div>
            <div className="p-7">
              <div className="text-sm text-purple-400 uppercase font-bold mb-2">Strategy / Grid</div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-300 transition-colors">Neon Protocol Zero</h3>
              <p className="text-base text-slate-300 mb-6 line-clamp-2">A tactical grid-based strategy simulation test built on indie engine.</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-base text-slate-300 font-medium">🔥 850 Plays</span>
                <Link href="/play/2" className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl text-base font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(236,72,153,0.4)] border border-pink-400/30">
                  Play Game Now ⚡
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-pink-500/30 rounded-3xl overflow-hidden hover:border-pink-400 transition-all group shadow-[0_0_25px_rgba(236,72,153,0.2)]">
            <div className="h-52 bg-gradient-to-br from-indigo-950 via-pink-950 to-slate-950 flex items-center justify-center relative overflow-hidden">
              <span className="text-6xl group-hover:scale-110 transition-transform duration-300">🚀</span>
              <span className="absolute top-4 right-4 px-3 py-1 bg-black/70 backdrop-blur-md text-sm text-indigo-300 rounded-lg font-semibold border border-pink-500/40">
                Arcade
              </span>
            </div>
            <div className="p-7">
              <div className="text-sm text-indigo-400 uppercase font-bold mb-2">Arcade / Runner</div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-pink-300 transition-colors">Quantum Runner 3D</h3>
              <p className="text-base text-slate-300 mb-6 line-clamp-2">Fast-paced futuristic endless runner game featuring neon obstacles.</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-base text-slate-300 font-medium">🔥 3.4k Plays</span>
                <Link href="/play/3" className="px-5 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl text-base font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(236,72,153,0.4)] border border-pink-400/30">
                  Play Game Now ⚡
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Drives Section */}
      <section className="px-8 py-14 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        <Link 
          href="/development" 
          className="block bg-slate-900/90 border border-pink-500/30 p-8 rounded-3xl hover:border-pink-400 transition-all cursor-pointer shadow-[0_0_25px_rgba(236,72,153,0.15)]"
        >
          <span className="text-sm font-bold px-3 py-1 bg-pink-500/20 text-pink-300 rounded-md border border-pink-500/30">Core Drive 2</span>
          <h3 className="text-2xl font-bold mt-5 mb-3 text-white">Development & Accomplishment</h3>
          <p className="text-base text-slate-300">Earn points by uploading game builds, completing milestones, and reviewing indie projects.</p>
        </Link>

        <Link 
          href="/social-influence" 
          className="block bg-slate-900/90 border border-pink-500/30 p-8 rounded-3xl hover:border-pink-400 transition-all cursor-pointer shadow-[0_0_25px_rgba(236,72,153,0.15)]"
        >
          <span className="text-sm font-bold px-3 py-1 bg-purple-500/20 text-purple-300 rounded-md border border-pink-500/30">Core Drive 5</span>
          <h3 className="text-2xl font-bold mt-5 mb-3 text-white">Social Influence & Peer Praise</h3>
          <p className="text-base text-slate-300">Gain badges, unlock special creator status, and receive peer validation from global gamers.</p>
        </Link>
        
        <Link 
          href="/curiosity" 
          className="block bg-slate-900/90 border border-pink-500/30 p-8 rounded-3xl hover:border-pink-400 transition-all cursor-pointer shadow-[0_0_25px_rgba(236,72,153,0.15)]"
        >
          <span className="text-sm font-bold px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-md border border-pink-500/30">Core Drive 7</span>
          <h3 className="text-2xl font-bold mt-5 mb-3 text-white">Unpredictability & Curiosity</h3>
          <p className="text-base text-slate-300">Unlock secret community drops, mystery game tests, and surprise rewards as you level up.</p>
        </Link>

        <Link 
          href="/community/feed" 
          className="block bg-slate-900/90 border border-pink-500/30 p-8 rounded-3xl hover:border-pink-400 transition-all cursor-pointer md:col-span-3 shadow-[0_0_25px_rgba(236,72,153,0.15)]"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-bold px-3 py-1 bg-pink-500/20 text-pink-300 rounded-md border border-pink-500/30">Live Feed</span>
            <span className="text-sm px-3 py-1 bg-slate-800 text-pink-300 rounded-md">DevLog #4</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-3 flex items-center gap-3 text-white">
            <span>💬</span> Live Community Feed
          </h3>
          <p className="text-lg text-slate-300 mb-6 line-clamp-2">
            "Just integrated dynamic lighting and shadow effects into our cyberpunk indie RPG! Check out the early alpha..."
          </p>
          <div className="flex items-center justify-between text-base text-pink-400 font-bold pt-4 border-t border-slate-800">
            <span>❤️ 42 Likes • 12 Comments</span>
            <span>Join Discussion →</span>
          </div>
        </Link>
      </section>

      {/* Founder's Note Section */}
      <section className="px-8 pb-20 max-w-6xl mx-auto w-full relative z-10">
        <div className="bg-slate-900/95 border border-pink-500/40 rounded-3xl p-10 shadow-[0_0_35px_rgba(236,72,153,0.25)] transition-all">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center font-bold text-2xl text-white shadow-[0_0_20px_rgba(236,72,153,0.5)] border border-pink-400/40">
              BP
            </div>
            <div>
              <h3 className="text-2xl font-bold text-white">Founder's Direct Note & Feedback</h3>
             <p className="text-base text-slate-300">Have a suggestion or thought? Send it directly to the founder!</p>
            </div>
          </div>

          {submitted ? (
            <div className="bg-emerald-950/90 border border-emerald-600 text-emerald-200 p-6 rounded-2xl text-lg text-center font-medium animate-pulse flex flex-col items-center gap-3 shadow-xl">
              <span>🚀 Success! Your direct note has been securely delivered to the founder's inbox.</span>
              <span className="text-sm text-emerald-400 font-normal">Thank you for helping us make IndiePulse better.</span>
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="mt-4">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                className="w-full bg-slate-800/90 border border-pink-500/40 rounded-2xl p-5 text-base md:text-lg text-white placeholder-slate-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-500/30 mb-5 transition-all shadow-inner"
                placeholder="Write your note or feedback here (e.g., Amazing platform! Would love a dark mode toggle)..."
                required
              />
              <button
                type="submit"
                disabled={isSending}
                className="px-8 py-4 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 disabled:opacity-50 text-white rounded-2xl text-base md:text-lg font-bold shadow-[0_0_25px_rgba(236,72,153,0.4)] transition-all cursor-pointer inline-flex items-center gap-3 border border-pink-400/40"
              >
                {isSending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cy="12" cx="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending to Founder...
                  </>
                ) : (
                  'Send to Founder'
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-pink-500/25 bg-[#030014] py-10 px-8 mt-auto relative z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-base text-slate-400">
          <div>© {new Date().getFullYear()} IndiePulse. All rights reserved.</div>
          <div className="flex gap-8">
            <a href="/privacy" className="hover:text-pink-400 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-pink-400 transition-colors">Terms of Service</a>
            <a href="/contact" className="hover:text-pink-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}