'use client';

import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-[#070514] text-white flex flex-col px-6 py-10 pb-32 max-w-4xl mx-auto w-full relative select-none">
      {/* Background Glow - Cyan/Blue Tone */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Back Button without Arrow Mark */}
      <div className="mb-8">
        <Link 
          href="/" 
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(59,130,246,0.4)] border border-blue-400/40 transition-all inline-block cursor-pointer"
        >
          Back
        </Link>
      </div>

      <h1 className="text-4xl font-black tracking-wide text-white mb-3">Privacy Policy</h1>
      <p className="text-xs text-slate-400 mb-8">Last updated: October 2026</p>

      <div className="space-y-6 text-sm text-slate-300 leading-relaxed bg-[#120e26]/90 border border-blue-500/30 rounded-3xl p-8 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
        <div>
          <h2 className="text-base font-bold text-cyan-400 mb-2">1. Information We Collect</h2>
          <p className="text-xs text-slate-300">We collect information you provide directly to us when creating an account, uploading indie games, posting in the community feed, or contacting support.</p>
        </div>

        <div>
          <h2 className="text-base font-bold text-cyan-400 mb-2">2. How We Use Your Information</h2>
          <p className="text-xs text-slate-300">Your data is used to maintain your IndiePulse profile, process game uploads, personalize your gaming experience, and secure your account settings.</p>
        </div>

        <div>
          <h2 className="text-base font-bold text-cyan-400 mb-2">3. Data Security</h2>
          <p className="text-xs text-slate-300">We implement robust security measures including password hashing and local storage encryption preferences to protect your personal information.</p>
        </div>
      </div>
    </main>
  );
}