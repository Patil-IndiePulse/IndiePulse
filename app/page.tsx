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
    <main className="min-h-screen bg-[#030014] text-white flex flex-col relative overflow-x-hidden select-none">
      {/* Background Unified Glow Effects */}
      <div className="absolute top-0 left-1/4. w-96 h-96 bg-pink-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Navigation Bar - Steam Mobile Platform Style (Stable Search Bar) */}
      <nav className="w-full bg-[#171a21] border-b border-[#2a475e] px-4 py-3 flex flex-col gap-2.5 relative z-50">
        
        {/* Line 1: Hamburger Menu & Stable Steam Search Bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', alignItems: 'center', width: '100%', gap: '8px', boxSizing: 'border-box' }} className="relative">
          
          {/* Three Lines (Hamburger Menu Button) */}
          <div className="relative shrink-0">
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 bg-[#21242d] border border-[#32353c] rounded text-[#c7d5e0] hover:text-white transition-all cursor-pointer flex items-center justify-center"
              aria-label="Toggle Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>

            {/* Hamburger Menu Drawer */}
            {isMenuOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-[#070514] border border-pink-500/40 rounded-2xl p-4 flex flex-col gap-3 shadow-2xl z-50">
                
                {/* Login & Get Started Buttons */}
                <div className="flex gap-2 w-full mb-1">
                  <Link 
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-center rounded-xl text-xs font-bold text-white border border-pink-400/40"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex-1 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-center rounded-xl text-xs font-bold text-white border border-pink-400/40"
                  >
                    Get Started
                  </Link>
                </div>

                <div className="text-[10px] uppercase tracking-widest text-pink-400 font-bold px-1 mt-1">Navigation & Control</div>
                
                <a href="/discover" onClick={() => setIsMenuOpen(false)} className="px-3.5 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 flex items-center justify-between">
                  <span>🧭 Discover Games & Projects</span> <span>→</span>
                </a>

                <a href="/community" onClick={() => setIsMenuOpen(false)} className="px-3.5 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 flex items-center justify-between">
                  <span>💬 Community Feed</span> <span>→</span>
                </a>

                <a href="/leaderboard" onClick={() => setIsMenuOpen(false)} className="px-3.5 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 flex items-center justify-between">
                  <span>🏆 Leaderboard & Rankings</span> <span>→</span>
                </a>

                <a href="/quests" onClick={() => setIsMenuOpen(false)} className="px-3.5 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 flex items-center justify-between">
                  <span>⚡ Quests & Rewards</span> <span>→</span>
                </a>

                <a href="/profile" onClick={() => setIsMenuOpen(false)} className="px-3.5 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-medium text-slate-200 flex items-center justify-between">
                  <span>👤 My Profile</span> <span>→</span>
                </a>

                <a href="/menu" onClick={() => setIsMenuOpen(false)} className="mt-1 px-3.5 py-3 bg-gradient-to-r from-pink-600/30 to-purple-600/30 border border-pink-500/50 rounded-xl text-xs font-bold text-pink-300 flex items-center justify-between">
                  <span>⚙️ Settings and Activity</span> <span>→</span>
                </a>
              </div>
            )}
          </div>

          {/* Stable Steam-Style Grid Search Bar (Fixed Layout) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', backgroundColor: '#313843', border: '1px solid #000000', borderRadius: '4px', overflow: 'hidden', width: '100%', boxSizing: 'border-box' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearching(true);
              }}
              onFocus={() => setIsSearching(true)}
              placeholder="Search the store"
              style={{ width: '100%', backgroundColor: 'transparent', padding: '8px 10px', fontSize: '12px', color: '#ffffff', fontStyle: 'italic', outline: 'none', border: 'none', boxSizing: 'border-box', minWidth: 0 }}
            />
            <button 
              type="button"
              style={{ backgroundColor: '#0098ff', border: 'none', padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              aria-label="Search"
            >
              <svg style={{ width: '16px', height: '16px', color: '#ffffff' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
          </div>

          {/* Search Results Dropdown */}
          {isSearching && searchQuery.trim().length > 0 && (
            <div className="absolute top-full mt-2 left-0 w-full bg-[#171a21] border border-[#2a475e] rounded-lg shadow-2xl overflow-hidden z-50">
              {mockSearchResults.length > 0 ? (
                mockSearchResults.map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    onClick={() => setIsSearching(false)}
                    className="block px-3.5 py-2.5 hover:bg-[#21242d] border-b border-[#2a475e]/50 last:border-none"
                  >
                    <div className="text-xs font-semibold text-white">{item.title}</div>
                    <div className="text-[9px] text-[#66c0f4] uppercase tracking-wider">{item.type}</div>
                  </a>
                ))
              ) : (
                <div className="px-3.5 py-2.5 text-xs text-slate-400 text-center">
                  No results found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Line 2: Steam Quick Links */}
        <div className="w-full flex items-center gap-4 text-xs text-[#c7d5e0] overflow-x-auto whitespace-nowrap pb-1">
          <a href="/discover" className="hover:text-white">Browse ▾</a>
          <a href="/quests" className="hover:text-white">Recommendations ▾</a>
          <a href="/community" className="hover:text-white">More ▾</a>
          <a href="/profile" className="text-[#66c0f4] ml-auto">IndiePulse Store</a>
        </div>

      </nav>

      {/* Hero Section */}
      <div className="flex-1 px-6 py-6 max-w-6xl mx-auto w-full flex flex-col relative z-10">
        
        {/* IndiePulse Logo Placed on Left Corner */}
        <div className="flex flex-col items-start cursor-pointer group mb-6">
          <div className="text-3xl font-black tracking-wider text-orange-500 drop-shadow-[0_0_12px_rgba(249,115,22,0.5)]">
            IndiePulse
          </div>
          <div className="w-full flex justify-start -mt-1">
            <svg className="w-32 h-3 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.9)]" viewBox="0 0 140 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 2C38 16 102 16 136 4" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              <path d="M122 2L136 4L128 13" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto pt-2 pb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink-500/40 bg-pink-500/10 text-pink-300 text-xs font-bold tracking-wide uppercase mb-4 shadow-[0_0_20px_rgba(236,72,153,0.3)]">
            <span>✦</span> NEXT-GEN INDIE GAME ECOSYSTEM
          </div>
          
          <h1 className="text-3xl md:text-6xl font-black tracking-tight mb-4 leading-tight">
            Where Indie Games <br />
            <span className="bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(236,72,153,0.5)]">
              Come Alive & Thrive
            </span>
          </h1>
          
          <p className="text-slate-300 text-sm md:text-base mb-6 max-w-2xl font-normal leading-relaxed select-none">
            A globally scalable platform powered by Octalysis gamification. Connect with passionate creators, play unique indie titles, and fuel your intrinsic motivation.
          </p>

          <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
            <a 
              href="/submit" 
              className="px-6 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all inline-flex items-center gap-2 border border-pink-400/40 cursor-pointer"
            >
              <span>+</span> Publish Game
            </a>
            
            <Link 
              href="/community"
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl text-sm font-bold shadow-[0_0_20px_rgba(216,72,236,0.4)] transition-all inline-flex items-center gap-2 cursor-pointer border border-pink-400/40"
            >
              <span>+</span> CREATE POST
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <a href="/community" className="px-6 py-3 bg-slate-900/90 hover:bg-slate-800 text-pink-300 font-medium rounded-xl border border-pink-500/30 shadow-[0_0_15px_rgba(236,72,153,0.2)] transition-all">
              Explore Community Feed
            </a>
            <a href="/quests" className="px-6 py-3 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white font-medium rounded-xl border border-slate-700 transition-all">
              Join the Quests
            </a>
          </div>
        </div>
      </div>

      {/* Trending Section */}
      <section className="px-6 py-8 max-w-6xl mx-auto w-full relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold px-3 py-1 bg-pink-500/20 text-pink-300 rounded-md uppercase tracking-wider border border-pink-500/30 shadow-[0_0_10px_rgba(236,72,153,0.2)]">Live & Hot</span>
            <h2 className="text-2xl font-bold mt-2 text-white">Trending Indie Games</h2>
          </div>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-xl bg-slate-900 border border-pink-500/30 flex items-center justify-center text-pink-400 hover:text-white transition-all cursor-pointer shadow-[0_0_10px_rgba(236,72,153,0.2)]">
              ←
            </button>
            <button className="w-9 h-9 rounded-xl bg-slate-900 border border-pink-500/30 flex items-center justify-center text-pink-400 hover:text-white transition-all cursor-pointer shadow-[0_0_10px_rgba(236,72,153,0.2)]">
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/90 border border-pink-500/30 rounded-2xl overflow-hidden hover:border-pink-400 transition-all group shadow-[0_0_20px_rgba(236,72,153,0.2)]">
            <div className="h-40 bg-gradient-to-br from-pink-950 via-purple-950 to-slate-950 flex items-center justify-center relative overflow-hidden">
              <span className="text-4xl group-hover:scale-110 transition-transform duration-300">🎮</span>
              <span className="absolute top-3 right-3 px-2 py-0.5 bg-black/70 backdrop-blur-md text-[10px] text-pink-300 rounded-md font-semibold border border-pink-500/40">
                WebGL
              </span>
            </div>
            <div className="p-5">
              <div className="text-[10px] text-pink-400 uppercase font-bold mb-1">Cyberpunk / Action</div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">Cyber Nexus // RPG</h3>
              <p className="text-xs text-slate-300 mb-4 line-clamp-2">An immersive cyberpunk role-playing adventure uploaded by an indie developer.</p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <span className="text-xs text-slate-300 font-medium">🔥 1.2k Plays</span>
                <Link href="/play/1" className="px-3 py-1.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-[0_0_12px_rgba(236,72,153,0.4)] border border-pink-400/30">
                  Play Game Now ⚡
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-pink-500/30 rounded-2xl overflow-hidden hover:border-pink-400 transition-all group shadow-[0_0_20px_rgba(236,72,153,0.2)]">
            <div className="h-40 bg-gradient-to-br from-purple-950 via-pink-950 to-slate-950 flex items-center justify-center relative overflow-hidden">
              <span className="text-4xl group-hover:scale-110 transition-transform duration-300">🧩</span>
              <span className="absolute top-3 right-3 px-2 py-0.5 bg-black/70 backdrop-blur-md text-[10px] text-purple-300 rounded-md font-semibold border border-purple-500/40">
                Puzzle
              </span>
            </div>
            <div className="p-5">
              <div className="text-[10px] text-purple-400 uppercase font-bold mb-1">Strategy / Grid</div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">Neon Protocol Zero</h3>
              <p className="text-xs text-slate-300 mb-4 line-clamp-2">A tactical grid-based strategy simulation test built on indie engine.</p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <span className="text-xs text-slate-300 font-medium">🔥 850 Plays</span>
                <Link href="/play/2" className="px-3 py-1.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-[0_0_12px_rgba(236,72,153,0.4)] border border-pink-400/30">
                  Play Game Now ⚡
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 border border-pink-500/30 rounded-2xl overflow-hidden hover:border-pink-400 transition-all group shadow-[0_0_20px_rgba(236,72,153,0.2)]">
            <div className="h-40 bg-gradient-to-br from-indigo-950 via-pink-950 to-slate-950 flex items-center justify-center relative overflow-hidden">
              <span className="text-4xl group-hover:scale-110 transition-transform duration-300">🚀</span>
              <span className="absolute top-3 right-3 px-2 py-0.5 bg-black/70 backdrop-blur-md text-[10px] text-indigo-300 rounded-md font-semibold border border-pink-500/40">
                Arcade
              </span>
            </div>
            <div className="p-5">
              <div className="text-[10px] text-indigo-400 uppercase font-bold mb-1">Arcade / Runner</div>
              <h3 className="text-base font-bold text-white mb-2 group-hover:text-pink-300 transition-colors">Quantum Runner 3D</h3>
              <p className="text-xs text-slate-300 mb-4 line-clamp-2">Fast-paced futuristic endless runner game featuring neon obstacles.</p>
              <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                <span className="text-xs text-slate-300 font-medium">🔥 3.4k Plays</span>
                <Link href="/play/3" className="px-3 py-1.5 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer shadow-[0_0_12px_rgba(236,72,153,0.4)] border border-pink-400/30">
                  Play Game Now ⚡
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Drives Section */}
      <section className="px-6 py-12 max-w-6xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <Link 
          href="/development" 
          className="block bg-slate-900/90 border border-pink-500/30 p-6 rounded-2xl hover:border-pink-400 transition-all cursor-pointer shadow-[0_0_20px_rgba(236,72,153,0.15)]"
        >
          <span className="text-xs font-bold px-2.5 py-1 bg-pink-500/20 text-pink-300 rounded-md border border-pink-500/30">Core Drive 2</span>
          <h3 className="text-lg font-bold mt-4 mb-2 text-white">Development & Accomplishment</h3>
          <p className="text-sm text-slate-300">Earn points by uploading game builds, completing milestones, and reviewing indie projects.</p>
        </Link>

        <Link 
          href="/social-influence" 
          className="block bg-slate-900/90 border border-pink-500/30 p-6 rounded-2xl hover:border-pink-400 transition-all cursor-pointer shadow-[0_0_20px_rgba(236,72,153,0.15)]"
        >
          <span className="text-xs font-bold px-2.5 py-1 bg-purple-500/20 text-purple-300 rounded-md border border-pink-500/30">Core Drive 5</span>
          <h3 className="text-lg font-bold mt-4 mb-2 text-white">Social Influence & Peer Praise</h3>
          <p className="text-sm text-slate-300">Gain badges, unlock special creator status, and receive peer validation from global gamers.</p>
        </Link>
        
        <Link 
          href="/curiosity" 
          className="block bg-slate-900/90 border border-pink-500/30 p-6 rounded-2xl hover:border-pink-400 transition-all cursor-pointer shadow-[0_0_20px_rgba(236,72,153,0.15)]"
        >
          <span className="text-xs font-bold px-2.5 py-1 bg-indigo-500/20 text-indigo-300 rounded-md border border-indigo-500/30">Core Drive 7</span>
          <h3 className="text-lg font-bold mt-4 mb-2 text-white">Unpredictability & Curiosity</h3>
          <p className="text-sm text-slate-300">Unlock secret community drops, mystery game tests, and surprise rewards as you level up.</p>
        </Link>

        <Link 
          href="/community/feed" 
          className="block bg-slate-900/90 border border-pink-500/30 p-6 rounded-2xl hover:border-pink-400 transition-all cursor-pointer md:col-span-3 shadow-[0_0_20px_rgba(236,72,153,0.15)]"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold px-2.5 py-1 bg-pink-500/20 text-pink-300 rounded-md border border-pink-500/30">Live Feed</span>
            <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-pink-300 rounded-md">DevLog #4</span>
          </div>
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2 text-white">
            <span>💬</span> Live Community Feed
          </h3>
          <p className="text-sm text-slate-300 mb-4 line-clamp-2">
            "Just integrated dynamic lighting and shadow effects into our cyberpunk indie RPG! Check out the early alpha..."
          </p>
          <div className="flex items-center justify-between text-xs text-pink-400 font-bold pt-2 border-t border-slate-800">
            <span>❤️ 42 Likes • 12 Comments</span>
            <span>Join Discussion →</span>
          </div>
        </Link>
      </section>

      {/* Founder's Note Section */}
      <section className="px-6 pb-16 max-w-6xl mx-auto w-full relative z-10">
        <div className="bg-slate-900/95 border border-pink-500/40 rounded-2xl p-6 shadow-[0_0_30px_rgba(236,72,153,0.2)] transition-all">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 flex items-center justify-center font-bold text-xl text-white shadow-[0_0_15px_rgba(236,72,153,0.5)] border border-pink-400/40">
              BP
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Founder's Direct Note & Feedback</h3>
             <p className="text-xs text-slate-300">Have a suggestion or thought? Send it directly to the founder!</p>
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
                className="w-full bg-slate-800/90 border border-pink-500/40 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-pink-400 mb-4 shadow-inner"
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

      {/* Footer */}
      <footer className="w-full border-t border-pink-500/20 bg-[#030014] py-6 px-6 mt-auto relative z-10 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} IndiePulse. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-pink-400">Privacy Policy</a>
            <a href="/terms" className="hover:text-pink-400">Terms of Service</a>
            <a href="/contact" className="hover:text-pink-400">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  );
}