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
    <main className="min-h-screen bg-[#030014] text-white flex flex-col relative overflow-x-hidden select-none pb-12">
      {/* Background Unified Glow Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Navigation Bar - Steam Mobile Platform Style */}
      <nav className="w-full bg-[#171a21] border-b border-[#2a475e] px-4 py-3.5 flex flex-col gap-3 relative z-50 shadow-md">
        
        {/* Line 1: Hamburger Menu & Stable Steam Search Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', width: '100%', gap: '10px', boxSizing: 'border-box' }} className="relative">
          
          {/* Three Lines (Hamburger Menu Button) */}
          <div className="relative shrink-0">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 bg-[#21242d] border border-[#32353c] rounded-lg text-[#c7d5e0] hover:text-white transition-all cursor-pointer flex items-center justify-center shadow"
              aria-label="Toggle Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>

            {/* Hamburger Menu Drawer */}
            {isMenuOpen && (
              <div className="absolute top-full left-0 mt-3 w-72 bg-[#070514] border border-pink-500/40 rounded-2xl p-4 flex flex-col gap-3.5 shadow-2xl z-50">
                
                {/* Login & Get Started Buttons */}
                <div className="flex gap-2 w-full mb-1">
                  <Link 
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-center rounded-xl text-xs font-bold text-white border border-pink-400/40 shadow"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 py-2.5 bg-gradient-to-r from-pink-600 to-purple-600 text-center rounded-xl text-xs font-bold text-white border border-pink-400/40 shadow"
                  >
                    Get Started
                  </Link>
                </div>

                <div className="text-[10px] uppercase tracking-widest text-pink-400 font-bold px-1 mt-1">Navigation & Control</div>
                
                <a href="/discover" onClick={() => setIsMenuOpen(false)} className="px-3.5 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 flex items-center justify-between">
                  <span>🧭 Discover Games & Projects</span> <span>→</span>
                </a>

                <a href="/community" onClick={() => setIsMenuOpen(false)} className="px-3.5 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 flex items-center justify-between">
                  <span>💬 Community Feed</span> <span>→</span>
                </a>

                <a href="/leaderboard" onClick={() => setIsMenuOpen(false)} className="px-3.5 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 flex items-center justify-between">
                  <span>🏆 Leaderboard & Rankings</span> <span>→</span>
                </a>

                <a href="/quests" onClick={() => setIsMenuOpen(false)} className="px-3.5 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 flex items-center justify-between">
                  <span>⚡ Quests & Rewards</span> <span>→</span>
                </a>

                <a href="/profile" onClick={() => setIsMenuOpen(false)} className="px-3.5 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 flex items-center justify-between">
                  <span>👤 My Profile</span> <span>→</span>
                </a>

                <a href="/menu" onClick={() => setIsMenuOpen(false)} className="mt-1 px-3.5 py-3 bg-gradient-to-r from-pink-600/30 to-purple-600/30 border border-pink-500/50 rounded-xl text-xs font-bold text-pink-300 flex items-center justify-between">
                  <span>⚙️ Settings and Activity</span> <span>→</span>
                </a>
              </div>
            )}
          </div>

          {/* Stable Steam-Style Grid Search Bar */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', backgroundColor: '#313843', border: '1px solid #000000', borderRadius: '6px', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearching(true);
              }}
              onFocus={() => setIsSearching(true)}
              placeholder="Search the store"
              style={{ width: '100%', backgroundColor: 'transparent', padding: '10px 12px', fontSize: '13px', color: '#ffffff', fontStyle: 'italic', outline: 'none', border: 'none', boxSizing: 'border-box', minWidth: 0 }}
            />
            <button 
              type="button"
              style={{ backgroundColor: '#0098ff', border: 'none', padding: '10px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              aria-label="Search"
            >
              <svg style={{ width: '16px', height: '16px', color: '#ffffff' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
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

      {/* Hero Section with Enhanced Mobile Spacing & Bold Branding */}
      <div className="flex-1 px-5 py-8 max-w-6xl mx-auto w-full flex flex-col relative z-10">
        
        {/* Top Header Row: WhatsApp-Style Profile DP on Left & Highly Bold IndiePulse Logo on Right */}
        <div className="w-full flex items-center justify-between mb-8 px-1">
          
          {/* WhatsApp-Style User Avatar (Large & Clear) */}
          <Link href="/profile" className="relative group cursor-pointer" aria-label="User Profile">
            <div className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-400 shadow-[0_0_20px_rgba(236,72,153,0.6)] transition-transform group-hover:scale-105">
              <div className="w-full h-full rounded-full bg-[#0a192f] overflow-hidden flex items-center justify-center border-2 border-[#030014]">
                <svg className="w-9 h-9 text-[#38bdf8] translate-y-1.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
            </div>
          </Link>

          {/* Highly Bold and Clear IndiePulse Branding Logo with Perfect Bottom Curve */}
          <div className="flex flex-col items-end cursor-pointer group">
            <div className="text-3xl md:text-4xl font-black tracking-wider text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)] font-sans">
              IndiePulse
            </div>
            <div className="w-full flex justify-end -mt-1">
              <svg className="w-36 h-3.5 text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,1)]" viewBox="0 0 140 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 2C38 16 102 16 136 4" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                <path d="M122 2L136 4L128 13" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

        </div>

        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto pt-4 pb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-pink-500/50 bg-pink-500/15 text-pink-300 text-xs font-extrabold tracking-wide uppercase mb-6 shadow-[0_0_25px_rgba(236,72,153,0.4)]">
            <span>✦</span> NEXT-GEN INDIE GAME ECOSYSTEM
          </div>
          
          <h1 className="text-3xl md:text-6xl font-black tracking-tight mb-5 leading-tight">
            Where Indie Games <br />
            <span className="bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(236,72,153,0.6)]">
              Come Alive & Thrive
            </span>
          </h1>
          
          <p className="text-slate-200 text-sm md:text-base mb-8 max-w-2xl font-normal leading-relaxed select-none px-2">
            A globally scalable platform powered by Octalysis gamification. Connect with passionate creators, play unique indie titles, and fuel your intrinsic motivation.
          </p>

          <div className="mb-8 flex flex-wrap items-center justify-center gap-4 w-full">
            <a 
              href="/submit" 
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl text-sm font-bold shadow-[0_0_25px_rgba(236,72,153,0.6)] transition-all inline-flex items-center justify-center gap-2 border border-pink-400/50 cursor-pointer"
            >
              <span>+</span> Publish Game
            </a>
            
            <Link 
              href="/community"
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl text-sm font-bold shadow-[0_0_25px_rgba(216,72,236,0.5)] transition-all inline-flex items-center justify-center gap-2 cursor-pointer border border-pink-400/50"
            >
              <span>+</span> CREATE POST
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-4 w-full">
            <a href="/community" className="w-full sm:w-auto px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-pink-300 font-semibold rounded-xl border border-pink-500/40 shadow-[0_0_15px_rgba(236,72,153,0.25)] transition-all text-center">
              Explore Community Feed
            </a>
            <a href="/quests" className="w-full sm:w-auto px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold rounded-xl border border-slate-700 transition-all text-center">
              Join the Quests
            </a>
          </div>
        </div>
      </div>

      {/* Trending Section with Generous Spacing */}
      <section className="px-5 py-10 max-w-6xl mx-auto w-full relative z-10">
        <div className="flex items-center justify-between mb-8 px-1">
          <div>
            <span className="text-xs font-bold px-3 py-1 bg-pink-500/20 text-pink-300 rounded-md uppercase tracking-wider border border-pink-500/30 shadow-[0_0_12px_rgba(236,72,153,0.3)]">Live & Hot</span>
            <h2 className="text-2xl font-bold mt-2.5 text-white">Trending Indie Games</h2>
          </div>
          <div className="flex gap-2.5">
            <button className="w-10 h-10 rounded-xl bg-slate-900 border border-pink-500/30 flex items-center justify-center text-pink-400 hover:text-white transition-all cursor-pointer shadow-[0_0_12px_rgba(236,72,153,0.3)]">
              ←
            </button>
            <button className="w-10 h-10 rounded-xl bg-slate-900 border border-pink-500/30 flex items-center justify-center text-pink-400 hover:text-white transition-all cursor-pointer shadow-[0_0_12px_rgba(236,72,153,0.3)]">
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-slate-900/90 border border-pink-500/35 rounded-2xl overflow-hidden hover:border-pink-400 transition-all group shadow-[0_0_25px_rgba(236,72,153,0.25)]">
            <div className="h-44 bg-gradient-to-br from-pink-950 via-purple-950 to-slate-950 flex items-center justify-center relative overflow-hidden">
              <span className="text-5xl group-hover:scale-110 transition-transform duration-300">🎮</span>
              <span className="absolute top-3.5 right-3.5 px-2.5 py-1 bg-black/70 backdrop-blur-md text-[11px] text-pink-300 rounded-lg font-semibold border border-pink-500/40">
                WebGL
              </span>
            </div>
            <div className="p-6">
              <div className="text-[11px] text-pink-400 uppercase font-bold mb-1.5 tracking-wide">Cyberpunk / Action</div>
              <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-pink-300 transition-colors">Cyber Nexus // RPG</h3>
              <p className="text-xs text-slate-300 mb-5 line-clamp-2 leading-relaxed">An immersive cyberpunk role-playing adventure uploaded by an indie developer.</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-300 font-semibold">🔥 1.2k Plays</span>
                <Link href="/play/1" className="px-3.5 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(236,72,153,0.5)] border border-pink-400/40">
                  Play Game Now ⚡
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-pink-500/35 rounded-2xl overflow-hidden hover:border-pink-400 transition-all group shadow-[0_0_25px_rgba(236,72,153,0.25)]">
            <div className="h-44 bg-gradient-to-br from-purple-950 via-pink-950 to-slate-950 flex items-center justify-center relative overflow-hidden">
              <span className="text-5xl group-hover:scale-110 transition-transform duration-300">🧩</span>
              <span className="absolute top-3.5 right-3.5 px-2.5 py-1 bg-black/70 backdrop-blur-md text-[11px] text-purple-300 rounded-lg font-semibold border border-purple-500/40">
                Puzzle
              </span>
            </div>
            <div className="p-6">
              <div className="text-[11px] text-purple-400 uppercase font-bold mb-1.5 tracking-wide">Strategy / Grid</div>
              <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-pink-300 transition-colors">Neon Protocol Zero</h3>
              <p className="text-xs text-slate-300 mb-5 line-clamp-2 leading-relaxed">A tactical grid-based strategy simulation test built on indie engine.</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-300 font-semibold">🔥 850 Plays</span>
                <Link href="/play/2" className="px-3.5 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(236,72,153,0.5)] border border-pink-400/40">
                  Play Game Now ⚡
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-pink-500/35 rounded-2xl overflow-hidden hover:border-pink-400 transition-all group shadow-[0_0_25px_rgba(236,72,153,0.25)]">
            <div className="h-44 bg-gradient-to-br from-indigo-950 via-pink-950 to-slate-950 flex items-center justify-center relative overflow-hidden">
              <span className="text-5xl group-hover:scale-110 transition-transform duration-300">🚀</span>
              <span className="absolute top-3.5 right-3.5 px-2.5 py-1 bg-black/70 backdrop-blur-md text-[11px] text-indigo-300 rounded-lg font-semibold border border-pink-500/40">
                Arcade
              </span>
            </div>
            <div className="p-6">
              <div className="text-[11px] text-indigo-400 uppercase font-bold mb-1.5 tracking-wide">Arcade / Runner</div>
              <h3 className="text-lg font-bold text-white mb-2.5 group-hover:text-pink-300 transition-colors">Quantum Runner 3D</h3>
              <p className="text-xs text-slate-300 mb-5 line-clamp-2 leading-relaxed">Fast-paced futuristic endless runner game featuring neon obstacles.</p>
              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <span className="text-xs text-slate-300 font-semibold">🔥 3.4k Plays</span>
                <Link href="/play/3" className="px-3.5 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(236,72,153,0.5)] border border-pink-400/40">
                  Play Game Now ⚡
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Drives Section with Proper Spacing */}
      <section className="px-5 py-12 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        <Link 
          href="/development" 
          className="block bg-slate-900/90 border border-pink-500/35 p-7 rounded-2xl hover:border-pink-400 transition-all cursor-pointer shadow-[0_0_25px_rgba(236,72,153,0.2)]"
        >
          <span className="text-xs font-bold px-3 py-1 bg-pink-500/20 text-pink-300 rounded-lg border border-pink-500/30">Core Drive 2</span>
          <h3 className="text-xl font-bold mt-5 mb-3 text-white">Development & Accomplishment</h3>
          <p className="text-sm text-slate-300 leading-relaxed">Earn points by uploading game builds, completing milestones, and reviewing indie projects.</p>
        </Link>

        <Link 
          href="/social-influence" 
          className="block bg-slate-900/90 border border-pink-500/35 p-7 rounded-2xl hover:border-pink-400 transition-all cursor-pointer shadow-[0_0_25px_rgba(236,72,153,0.2)]"
        >
          <span className="text-xs font-bold px-3 py-1 bg-purple-500/20 text-purple-300 rounded-lg border border-pink-500/30">Core Drive 5</span>
          <h3 className="text-xl font-bold mt-5 mb-3 text-white">Social Influence & Peer Praise</h3>
          <p className="text-sm text-slate-300 leading-relaxed">Gain badges, unlock special creator status, and receive peer validation from global gamers.</p>
        </Link>
        
        <Link 
          href="/curiosity" 
          className="block bg-slate-900/90 border border-pink-500/35 p-7 rounded-2xl hover:border-pink-400 transition-all cursor-pointer shadow-[0_0_25px_rgba(236,72,153,0.2)]"
        >
          <span className="text-xs font-bold px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-lg border border-indigo-500/30">Core Drive 7</span>
          <h3 className="text-xl font-bold mt-5 mb-3 text-white">Unpredictability & Curiosity</h3>
          <p className="text-sm text-slate-300 leading-relaxed">Unlock secret community drops, mystery game tests, and surprise rewards as you level up.</p>
        </Link>

        <Link 
          href="/community/feed" 
          className="block bg-slate-900/90 border border-pink-500/35 p-7 rounded-2xl hover:border-pink-400 transition-all cursor-pointer md:col-span-3 shadow-[0_0_25px_rgba(236,72,153,0.2)]"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold px-3 py-1 bg-pink-500/20 text-pink-300 rounded-lg border border-pink-500/30">Live Feed</span>
            <span className="text-[11px] px-2.5 py-1 bg-slate-800 text-pink-300 rounded-lg">DevLog #4</span>
          </div>
          <h3 className="text-xl font-bold mb-3 flex items-center gap-2.5 text-white">
            <span>💬</span> Live Community Feed
          </h3>
          <p className="text-sm text-slate-300 mb-5 line-clamp-2 leading-relaxed">
            "Just integrated dynamic lighting and shadow effects into our cyberpunk indie RPG! Check out the early alpha..."
          </p>
          <div className="flex items-center justify-between text-xs text-pink-400 font-bold pt-3.5 border-t border-slate-800">
            <span>❤️ 42 Likes • 12 Comments</span>
            <span>Join Discussion →</span>
          </div>
        </Link>
      </section>

      {/* Founder's Note Section */}
      <section className="px-5 pb-16 max-w-6xl mx-auto w-full relative z-10">
        <div className="bg-slate-900/95 border border-pink-500/45 rounded-2xl p-7 shadow-[0_0_35px_rgba(236,72,153,0.25)] transition-all">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center font-bold text-xl text-white shadow-[0_0_15px_rgba(236,72,153,0.6)] border border-pink-400/50">
              BP
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Founder's Direct Note & Feedback</h3>
             <p className="text-xs text-slate-300 mt-0.5">Have a suggestion or thought? Send it directly to the founder!</p>
            </div>
          </div>

          {submitted ? (
            <div className="bg-emerald-950/90 border border-emerald-600 text-emerald-200 p-4 rounded-xl text-xs text-center font-medium shadow-lg">
              🚀 Success! Your direct note has been securely delivered to the founder's inbox.
            </div>
          ) : (
            <form onSubmit={handleFeedbackSubmit} className="mt-4">
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                rows={3}
                className="w-full bg-slate-800/90 border border-pink-500/40 rounded-xl p-3.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-pink-400 mb-4 shadow-inner leading-relaxed"
                placeholder="Write your note or feedback here..."
                required
              />
              <button
                type="submit"
                disabled={isSending}
                className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer border border-pink-400/40"
              >
                {isSending ? 'Sending to Founder...' : 'Send to Founder'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-pink-500/20 bg-[#030014] py-8 px-6 mt-auto relative z-10 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} IndiePulse. All rights reserved.</div>
          <div className="flex gap-6">
            <a href="/privacy" className="hover:text-pink-400 transition-colors">Privacy Policy</a>
            <a href="/terms" className="hover:text-pink-400 transition-colors">Terms of Service</a>
            <a href="/contact" className="hover:text-pink-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}