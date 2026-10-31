'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth } from "@/app/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  
  const [user, setUser] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert(`Logged in successfully with: ${email}`);
      
    } catch (error: any) {
      alert("Login Failed: " + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setShowPopup(false);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Glow & Design Elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Top Left Back Button (Bright Blue Color) */}
      <div className="absolute top-6 left-6 z-20">
        <Link 
          href="/" 
          className="w-12 h-12 bg-blue-600 hover:bg-blue-500 border border-blue-400 rounded-full flex items-center justify-center shadow-xl shadow-blue-600/40 transition-all transform hover:-translate-y-0.5 cursor-pointer group"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6 text-white" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
      </div>

      {/* Top Right Google-Style Profile Icon & Popup Menu */}
      <div className="absolute top-6 right-6 z-50">
        {user ? (
          <div className="relative">
            
            <button
              onClick={() => setShowPopup(!showPopup)}
              className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center text-white font-bold text-lg shadow-xl shadow-emerald-500/20 border-2 border-white/20 transition-all cursor-pointer focus:outline-none"
            >
              {user.email ? user.email.charAt(0).toUpperCase() : "B"}
            </button>

            {showPopup && (
              <div className="absolute right-0 mt-3 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-4 text-center text-white backdrop-blur-md">
                <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-2xl mb-2 shadow-md">
                  {user.email ? user.email.charAt(0).toUpperCase() : "B"}
                </div>
                <p className="text-sm font-semibold truncate text-slate-200">{user.email}</p>
                <p className="text-xs text-slate-400 mt-1">IndiePulse Account</p>
                
                <hr className="my-3 border-slate-700" />

                <button
                  onClick={handleLogout}
                  className="w-full py-2 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg transition text-sm font-medium cursor-pointer"
                >
                  Sign Out / Logout
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* Login Card Container */}
      <div className="bg-slate-900/90 backdrop-blur-2xl border border-slate-800/80 p-8 rounded-3xl w-full max-w-md shadow-2xl shadow-indigo-950/60 relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3 tracking-wide">
            🔐 WELCOME BACK
          </div>
          <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
            Login to IndiePulse
          </h2>
          <p className="text-slate-400 text-sm mt-1.5">Enter your credentials to access your creator dashboard.</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
              required
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <Link href="/forgot-password" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                Forgot Password?
              </Link>
            </div>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              required
              className="w-full bg-slate-950/60 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <button 
            type="submit"
            className="w-full mt-3 py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all text-sm cursor-pointer"
          >
            Sign In 🚀
          </button>
        </form>

        {/* Sign Up Redirect Link */}
        <div className="text-center mt-6 text-xs text-slate-400">
          Don't have an account?{' '}
          <Link href="/signup" className="text-indigo-400 font-semibold hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </main>
  );
}