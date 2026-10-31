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
  
  // Multi-account states
  const [savedAccounts, setSavedAccounts] = useState<any[]>([]);
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [showManageModal, setShowManageModal] = useState(false);

  useEffect(() => {
    // Load saved accounts from localStorage
    try {
      const accounts = JSON.parse(localStorage.getItem('indiepulse_accounts') || '[]');
      setSavedAccounts(accounts);
    } catch (e) {
      console.error("Failed to load accounts", e);
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.email) {
        try {
          const accounts = JSON.parse(localStorage.getItem('indiepulse_accounts') || '[]');
          const exists = accounts.some((acc: any) => acc.email === currentUser.email);
          if (!exists) {
            accounts.push({
              email: currentUser.email,
              name: currentUser.displayName || currentUser.email.split('@')[0],
              photo: currentUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser.email}`
            });
            localStorage.setItem('indiepulse_accounts', JSON.stringify(accounts));
            setSavedAccounts(accounts);
          }
          localStorage.setItem('indiepulse_current_account', currentUser.email);
        } catch (err) {
          console.error(err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const loggedUser = userCred.user;
      
      const accounts = JSON.parse(localStorage.getItem('indiepulse_accounts') || '[]');
      if (!accounts.some((acc: any) => acc.email === loggedUser.email)) {
        accounts.push({
          email: loggedUser.email,
          name: loggedUser.displayName || loggedUser.email?.split('@')[0],
          photo: loggedUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${loggedUser.email}`
        });
        localStorage.setItem('indiepulse_accounts', JSON.stringify(accounts));
      }
      localStorage.setItem('indiepulse_current_account', loggedUser.email || '');

      alert(`Logged in successfully with: ${email}`);
      window.location.href = "/";
    } catch (error: any) {
      alert("Login Failed: " + error.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('indiepulse_current_account');
    setShowPopup(false);
    setShowSwitchModal(false);
    setShowManageModal(false);
  };

  const handleSwitchAccount = (accEmail: string) => {
    setEmail(accEmail);
    setShowSwitchModal(false);
    setShowPopup(false);
  };

  // Remove specific account from local storage list
  const handleRemoveAccount = (accEmail: string) => {
    const updatedAccounts = savedAccounts.filter((acc) => acc.email !== accEmail);
    setSavedAccounts(updatedAccounts);
    localStorage.setItem('indiepulse_accounts', JSON.stringify(updatedAccounts));
    alert(`Removed ${accEmail} from saved accounts.`);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Glow & Design Elements */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Top Left Back Button */}
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

      {/* Top Right Profile Icon & Advanced Popup Menu */}
      <div className="absolute top-6 right-6 z-50">
        {user ? (
          <div className="relative">
            <button
              onClick={() => {
                setShowPopup(!showPopup);
                setShowSwitchModal(false);
                setShowManageModal(false);
              }}
              className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 flex items-center justify-center text-white font-bold text-lg shadow-xl shadow-emerald-500/20 border-2 border-white/20 transition-all cursor-pointer focus:outline-none"
            >
              {user.email ? user.email.charAt(0).toUpperCase() : "B"}
            </button>

            {/* Main Popup Menu */}
            {showPopup && !showSwitchModal && !showManageModal && (
              <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-5 text-white backdrop-blur-md z-50">
                
                <div className="text-center pb-4 border-b border-slate-800">
                  <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-2xl mb-2 shadow-md">
                    {user.email ? user.email.charAt(0).toUpperCase() : "B"}
                  </div>
                  <p className="text-sm font-semibold truncate text-slate-200">{user.email}</p>
                  <p className="text-xs text-slate-400 mt-0.5">IndiePulse Account ({savedAccounts.length} saved)</p>
                </div>

                <div className="py-2 flex flex-col gap-1 text-sm">
                  <button 
                    onClick={() => setShowSwitchModal(true)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 transition text-slate-300 hover:text-white text-left cursor-pointer"
                  >
                    <span className="text-base">🔄</span>
                    <span className="font-medium">Switch account</span>
                  </button>

                  <button 
                    onClick={() => {
                      signOut(auth);
                      localStorage.removeItem('indiepulse_current_account');
                      alert("Browsing IndiePulse without an account.");
                      window.location.href = "/";
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 transition text-slate-300 hover:text-white text-left cursor-pointer"
                  >
                    <span className="text-base">🚫</span>
                    <span className="font-medium">Use IndiePulse without an account</span>
                  </button>

                  <button 
                    onClick={() => window.location.href = "/signup"}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 transition text-slate-300 hover:text-white text-left cursor-pointer"
                  >
                    <span className="text-base">➕</span>
                    <span className="font-medium">Add another account</span>
                  </button>

                  {/* Manage Account Option */}
                  <button 
                    onClick={() => setShowManageModal(true)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 transition text-slate-300 hover:text-white text-left cursor-pointer"
                  >
                    <span className="text-base">⚙️</span>
                    <span className="font-medium">Manage account on IndiePulse</span>
                  </button>
                </div>

                <hr className="my-2 border-slate-800" />

                <button
                  onClick={handleLogout}
                  className="w-full mt-2 py-2.5 bg-pink-600 hover:bg-pink-500 text-white rounded-xl transition text-sm font-bold shadow-lg shadow-pink-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>🚪</span> Sign Out / Logout
                </button>

              </div>
            )}

            {/* Switch Account Modal */}
            {showPopup && showSwitchModal && (
              <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-5 text-white backdrop-blur-md z-50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <h3 className="text-sm font-bold">Select Account</h3>
                  <button 
                    onClick={() => setShowSwitchModal(false)}
                    className="text-xs text-indigo-400 hover:underline cursor-pointer"
                  >
                    Back
                  </button>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {savedAccounts.length > 0 ? (
                    savedAccounts.map((acc, index) => (
                      <div 
                        key={index}
                        onClick={() => handleSwitchAccount(acc.email)}
                        className={`p-2.5 rounded-xl border flex items-center gap-3 cursor-pointer transition ${
                          user?.email === acc.email 
                            ? 'bg-indigo-600/20 border-indigo-500 text-white' 
                            : 'bg-slate-800/50 border-slate-800 hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-sm shrink-0">
                          {acc.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-semibold truncate">{acc.name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{acc.email}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-4">No other accounts saved yet.</p>
                  )}
                </div>

                <button 
                  onClick={() => window.location.href = "/signup"}
                  className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>➕</span> Add another account
                </button>
              </div>
            )}

            {/* Manage Accounts Modal */}
            {showPopup && showManageModal && (
              <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-5 text-white backdrop-blur-md z-50">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <h3 className="text-sm font-bold">Manage Saved Accounts</h3>
                  <button 
                    onClick={() => setShowManageModal(false)}
                    className="text-xs text-indigo-400 hover:underline cursor-pointer"
                  >
                    Back
                  </button>
                </div>

                <p className="text-[11px] text-slate-400 mb-3">Remove accounts you no longer want saved on this device.</p>

                <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                  {savedAccounts.length > 0 ? (
                    savedAccounts.map((acc, index) => (
                      <div 
                        key={index}
                        className="p-2.5 rounded-xl border bg-slate-800/50 border-slate-800 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                            {acc.email.charAt(0).toUpperCase()}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-semibold truncate">{acc.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{acc.email}</p>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleRemoveAccount(acc.email)}
                          className="px-2.5 py-1 bg-pink-600/20 hover:bg-pink-600 text-pink-400 hover:text-white rounded-lg text-xs font-medium transition cursor-pointer shrink-0"
                        >
                          Remove
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 text-center py-4">No accounts saved to manage.</p>
                  )}
                </div>

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
          <p className="text-slate-400 text-sm mt-1.5">Select an account or enter credentials to sign in.</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
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
              placeholder="Enter password"
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