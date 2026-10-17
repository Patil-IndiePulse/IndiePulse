'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function SettingsAndActivityPage() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Check previous theme on page load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Function to toggle theme
  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      localStorage.setItem('theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <main className={`min-h-screen flex flex-col px-4 py-6 max-w-2xl mx-auto w-full transition-colors duration-300 select-none ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
      
      {/* Header with Pink Gradient 'Back' Button */}
      <div className="flex flex-col items-start gap-4 mb-6">
        <Link 
          href="/" 
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-sm font-bold shadow-[0_0_20px_rgba(236,72,153,0.5)] border border-pink-400/40 transition-all flex items-center justify-center cursor-pointer"
        >
          Back
        </Link>
        <h1 className={`text-2xl font-bold tracking-wide ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Settings and activity</h1>
      </div>

      {/* Search Settings Bar */}
      <div className="relative mb-6">
        <span className="absolute left-4 top-3.5 text-sm">🔍</span>
        <input
          type="text"
          placeholder="Search settings (e.g. password, privacy, theme)..."
          className={`w-full border rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none transition-all shadow-inner ${isDarkMode ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-500 focus:border-pink-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-pink-600'}`}
        />
      </div>

      {/* Section 1: Your Account */}
      <div className="mb-6">
        <h2 className={`text-xs font-semibold uppercase tracking-wider mb-3 px-2 ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>
          1. Your Account
        </h2>
        <div className={`border rounded-2xl overflow-hidden divide-y ${isDarkMode ? 'bg-slate-900/80 border-slate-800 divide-slate-800/80' : 'bg-slate-50 border-slate-200 divide-slate-200'}`}>
          <Link href="/settings/accounts-center" className={`flex items-center justify-between p-4 transition-colors ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-100'}`}>
            <div className="flex items-center gap-3">
              <span className="text-lg">🔐</span>
              <div>
                <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Accounts Center</div>
                <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Password, security, and personal details</div>
              </div>
            </div>
            <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>→</span>
          </Link>

          {/* Edit Profile linked directly to /profile */}
          <Link href="/profile" className={`flex items-center justify-between p-4 transition-colors ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-100'}`}>
            <div className="flex items-center gap-3">
              <span className="text-lg">👤</span>
              <div>
                <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Edit Profile</div>
                <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Name, bio, GitHub, and Discord links</div>
              </div>
            </div>
            <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>→</span>
          </Link>
        </div>
      </div>

      {/* Section 2: How You Use IndiePulse */}
      <div className="mb-6">
        <h2 className={`text-xs font-semibold uppercase tracking-wider mb-3 px-2 ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>
          2. How You Use IndiePulse
        </h2>
        <div className={`border rounded-2xl overflow-hidden divide-y ${isDarkMode ? 'bg-slate-900/80 border-slate-800 divide-slate-800/80' : 'bg-slate-50 border-slate-200 divide-slate-200'}`}>
          <Link href="/settings/saved-games" className={`flex items-center justify-between p-4 transition-colors ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-100'}`}>
            <div className="flex items-center gap-3">
              <span className="text-lg">⭐</span>
              <div>
                <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Saved Games / Projects</div>
                <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>View your bookmarked or favorite indie projects</div>
              </div>
            </div>
            <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>→</span>
          </Link>

          <Link href="/activity" className={`flex items-center justify-between p-4 transition-colors ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-100'}`}>
            <div className="flex items-center gap-3">
              <span className="text-lg">📊</span>
              <div>
                <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Your Activity</div>
                <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>History of posts, submitted games, and comments</div>
              </div>
            </div>
            <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>→</span>
          </Link>

          {/* Updated Notifications Link pointing to /notifications */}
          <Link href="/notifications" className={`flex items-center justify-between p-4 transition-colors ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-100'}`}>
            <div className="flex items-center gap-3">
              <span className="text-lg">🔔</span>
              <div>
                <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Notifications</div>
                <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Game updates, live streams, and community alerts</div>
              </div>
            </div>
            <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>→</span>
          </Link>
        </div>
      </div>

      {/* Section 3: Who Can See Your Content */}
      <div className="mb-6">
        <h2 className={`text-xs font-semibold uppercase tracking-wider mb-3 px-2 ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>
          3. Who Can See Your Content
        </h2>
        <div className={`border rounded-2xl overflow-hidden divide-y ${isDarkMode ? 'bg-slate-900/80 border-slate-800 divide-slate-800/80' : 'bg-slate-50 border-slate-200 divide-slate-200'}`}>
          <Link href="/settings/privacy" className={`flex items-center justify-between p-4 transition-colors ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-100'}`}>
            <div className="flex items-center gap-3">
              <span className="text-lg">🛡️</span>
              <div>
                <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Account Privacy</div>
                <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Set your profile to public or private</div>
              </div>
            </div>
            <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>→</span>
          </Link>

          <Link href="/settings/blocked-users" className={`flex items-center justify-between p-4 transition-colors ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-100'}`}>
            <div className="flex items-center gap-3">
              <span className="text-lg">🚫</span>
              <div>
                <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Blocked Users / Restricted</div>
                <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Manage blocked or restricted accounts</div>
              </div>
            </div>
            <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>→</span>
          </Link>
        </div>
      </div>

      {/* Section 4: Preferences & Support */}
      <div className="mb-6">
        <h2 className={`text-xs font-semibold uppercase tracking-wider mb-3 px-2 ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>
          4. Preferences & Support
        </h2>
        <div className={`border rounded-2xl overflow-hidden divide-y ${isDarkMode ? 'bg-slate-900/80 border-slate-800 divide-slate-800/80' : 'bg-slate-50 border-slate-200 divide-slate-200'}`}>
          
          {/* Interactive Dark/Light Theme Toggle Button */}
          <div 
            onClick={toggleTheme}
            className={`flex items-center justify-between p-4 transition-colors cursor-pointer ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-100'}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">🌓</span>
              <div>
                <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Dark / Light Theme</div>
                <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Switch platform appearance</div>
              </div>
            </div>
            <span className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${isDarkMode ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30' : 'bg-slate-900 text-white shadow-md'}`}>
              {isDarkMode ? 'Dark (Active)' : 'Light (Active)'}
            </span>
          </div>

          <Link href="/settings/bug-report" className={`flex items-center justify-between p-4 transition-colors ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-100'}`}>
            <div className="flex items-center gap-3">
              <span className="text-lg">🛠</span>
              <div>
                <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Bug Report / Support Ticket</div>
                <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Report platform errors or technical issues</div>
              </div>
            </div>
            <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>→</span>
          </Link>
        </div>
      </div>

      {/* Section 5: Language & Account Control */}
      <div className="mb-8">
        <h2 className={`text-xs font-semibold uppercase tracking-wider mb-3 px-2 ${isDarkMode ? 'text-pink-400' : 'text-pink-600'}`}>
          5. Language & Account Control
        </h2>
        <div className={`border rounded-2xl overflow-hidden divide-y ${isDarkMode ? 'bg-slate-900/80 border-slate-800 divide-slate-800/80' : 'bg-slate-50 border-slate-200 divide-slate-200'}`}>
          <Link href="/settings/language" className={`flex items-center justify-between p-4 transition-colors ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-100'}`}>
            <div className="flex items-center gap-3">
              <span className="text-lg">🌐</span>
              <div>
                <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Language & Region</div>
                <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Choose your preferred platform language</div>
              </div>
            </div>
            <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>→</span>
          </Link>

          <Link href="/settings/data-control" className={`flex items-center justify-between p-4 transition-colors ${isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-100'}`}>
            <div className="flex items-center gap-3">
              <span className="text-lg">⚙️</span>
              <div>
                <div className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Download Data & Account Deactivation</div>
                <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Export your platform data or delete account</div>
              </div>
            </div>
            <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>→</span>
          </Link>
        </div>
      </div>

    </main>
  );
}