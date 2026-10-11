'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function DataControlPage() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');
  
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [downloadHistory, setDownloadHistory] = useState<string[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem('indiepulse_download_history');
    if (savedHistory) {
      setDownloadHistory(JSON.parse(savedHistory));
    }
  }, []);

  // 1. Advanced Data Download Handler
  const handleDownloadData = () => {
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);

      const timestamp = new Date().toISOString();
      const userData = {
        platform: "IndiePulse",
        user: "Bharat Patil",
        role: "Founder & Developer",
        region: localStorage.getItem('platform_region') || "India (Asia South)",
        language: localStorage.getItem('platform_language') || "Marathi",
        exportDate: timestamp,
        format: exportFormat.toUpperCase(),
        activities: ["Uploaded Indie Games", "Community Posts", "Quests Completed"]
      };

      let fileContent = '';
      let fileName = '';
      let fileType = '';

      if (exportFormat === 'csv') {
        fileContent = "Platform,User,Role,Region,Language,ExportDate\nIndiePulse,Bharat Patil,Founder,India,Marathi," + timestamp;
        fileName = 'indiepulse-user-data-export.csv';
        fileType = 'text/csv';
      } else {
        fileContent = JSON.stringify(userData, null, 2);
        fileName = 'indiepulse-user-data-export.json';
        fileType = 'application/json';
      }

      const blob = new Blob([fileContent], { type: fileType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Update Download History
      const newHistory = [`Downloaded ${exportFormat.toUpperCase()} Archive on ${new Date().toLocaleString()}`, ...downloadHistory.slice(0, 4)];
      setDownloadHistory(newHistory);
      localStorage.setItem('indiepulse_download_history', JSON.stringify(newHistory));

      setTimeout(() => setDownloadSuccess(false), 5000);
    }, 1500);
  };

  // 2. Account Deactivation Handler
  const handleDeactivateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      alert('Your IndiePulse account has been successfully deactivated.');
      localStorage.clear();
      window.location.href = '/login';
    } else {
      alert('Please enter your password to confirm deactivation.');
    }
  };

  // 3. Permanent Account Deletion Handler
  const handleDeleteAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (deletePassword.trim()) {
      alert('Your IndiePulse account has been permanently scheduled for deletion.');
      localStorage.clear();
      window.location.href = '/login';
    } else {
      alert('Please enter your password to confirm permanent deletion.');
    }
  };

  return (
    <main className="min-h-screen bg-[#070514] text-white flex flex-col px-4 py-8 pb-32 max-w-2xl mx-auto w-full relative select-none">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-pink-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Back Button */}
      <div className="flex flex-col items-start gap-4 mb-6">
        <Link 
          href="/menu" 
          className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(236,72,153,0.4)] border border-pink-400/40 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          Back
        </Link>
        <div>
          <h1 className="text-2xl font-black tracking-wide text-white">Download Data & Account Deactivation</h1>
          <p className="text-xs text-slate-300 mt-1">Manage your platform data export preferences, download logs, and account lifecycle securely.</p>
        </div>
      </div>

      {/* Section 1: Download Your Data with Format Selection */}
      <div className="bg-[#120e26]/90 border border-purple-500/30 rounded-2xl p-6 shadow-[0_0_25px_rgba(147,51,234,0.15)] mb-6">
        <div className="text-pink-400 text-xs font-bold uppercase tracking-wider mb-2">
          📥 Download Your Platform Data
        </div>
        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          Get a copy of your IndiePulse profile info, uploaded games metadata, and activity logs. Select your preferred file format below.
        </p>

        {/* Format Selector */}
        <div className="flex items-center gap-4 mb-4">
          <label className="text-xs text-slate-300 font-semibold">Select Format:</label>
          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="bg-[#070514] border border-purple-500/40 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="json">JSON (.json)</option>
            <option value="csv">CSV (.csv)</option>
          </select>
        </div>

        {downloadSuccess && (
          <div className="mb-4 bg-emerald-950/80 border border-emerald-600 text-emerald-200 p-3 rounded-xl text-xs font-medium">
            ✅ Success! Your data archive has been successfully downloaded to your device.
          </div>
        )}

        <button
          onClick={handleDownloadData}
          disabled={isDownloading}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 disabled:opacity-50 text-white text-xs font-bold shadow-[0_0_15px_rgba(236,72,153,0.4)] cursor-pointer transition-all inline-flex items-center gap-2 mb-4"
        >
          {isDownloading ? 'Preparing Data Archive...' : `Download Data Archive (.${exportFormat.toUpperCase()})`}
        </button>

        {/* Download History Log */}
        {downloadHistory.length > 0 && (
          <div className="mt-4 pt-4 border-t border-purple-500/20">
            <div className="text-[11px] font-bold text-slate-300 mb-2 uppercase tracking-wide">Recent Download History:</div>
            <ul className="space-y-1">
              {downloadHistory.map((item, index) => (
                <li key={index} className="text-[11px] text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Section 2: Account Deactivation */}
      <div className="bg-[#120e26]/90 border border-amber-500/30 rounded-2xl p-6 shadow-[0_0_25px_rgba(245,158,11,0.15)] mb-6">
        <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
          ⚠️ Deactivate Account (Temporary)
        </div>
        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          Temporarily hide your profile and games from the global community. You can reactivate anytime by logging back in.
        </p>

        {!showDeactivateModal ? (
          <button
            onClick={() => { setShowDeactivateModal(true); setShowDeleteModal(false); }}
            className="px-5 py-2.5 rounded-xl bg-amber-600/20 hover:bg-amber-600/30 border border-amber-500/50 text-amber-300 text-xs font-bold cursor-pointer transition-all"
          >
            Deactivate My Account
          </button>
        ) : (
          <form onSubmit={handleDeactivateAccount} className="space-y-3 mt-4 pt-4 border-t border-amber-500/20">
            <div>
              <label className="block text-[11px] text-slate-300 mb-1 font-semibold">Enter Password to Confirm Deactivation</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your account password..."
                className="w-full bg-[#070514] border border-amber-500/40 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                required
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer transition-all shadow-[0_0_15px_rgba(245,158,11,0.4)]"
              >
                Confirm Deactivation
              </button>
              <button
                type="button"
                onClick={() => setShowDeactivateModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Section 3: Permanent Account Deletion */}
      <div className="bg-[#120e26]/90 border border-red-500/30 rounded-2xl p-6 shadow-[0_0_25px_rgba(239,68,68,0.15)]">
        <div className="text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
          🚨 Delete Account Permanently
        </div>
        <p className="text-xs text-slate-300 mb-4 leading-relaxed">
          Permanently delete your IndiePulse profile, games, and all associated activity data. This action cannot be undone after 30 days.
        </p>

        {!showDeleteModal ? (
          <button
            onClick={() => { setShowDeleteModal(true); setShowDeactivateModal(false); }}
            className="px-5 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-300 text-xs font-bold cursor-pointer transition-all"
          >
            Delete Account Permanently
          </button>
        ) : (
          <form onSubmit={handleDeleteAccount} className="space-y-3 mt-4 pt-4 border-t border-red-500/20">
            <div>
              <label className="block text-[11px] text-slate-300 mb-1 font-semibold">Enter Password to Confirm Permanent Deletion</label>
              <input
                type="password"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Your account password..."
                className="w-full bg-[#070514] border border-red-500/40 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-red-500"
                required
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold cursor-pointer transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]"
              >
                Yes, Delete Permanently
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium cursor-pointer transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

    </main>
  );
}