'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#070514] text-white flex flex-col px-4 sm:px-8 py-10 pb-32 max-w-5xl mx-auto w-full relative select-none">
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

      <h1 className="text-3xl sm:text-4xl font-black tracking-wide text-white mb-3">Terms of Service</h1>
      <p className="text-xs text-slate-400 mb-8">Last updated: October 2026</p>

      <div className="space-y-6 text-sm text-slate-300 leading-relaxed bg-[#120e26]/90 border border-blue-500/30 rounded-3xl p-6 sm:p-10 shadow-[0_0_30px_rgba(59,130,246,0.15)] w-full">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-cyan-400 mb-2">1. Acceptance of Terms</h2>
          <p className="text-xs sm:text-sm text-slate-300">By accessing or using IndiePulse, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-cyan-400 mb-2">2. Creator Guidelines</h2>
          <p className="text-xs sm:text-sm text-slate-300">Users uploading games or posting content retain their ownership rights but grant IndiePulse a license to display and distribute the content within the platform ecosystem.</p>
        </div>

        <div>
          <h2 className="text-base sm:text-lg font-bold text-cyan-400 mb-2">3. Account Termination</h2>
          <p className="text-xs sm:text-sm text-slate-300">We reserve the right to suspend or terminate accounts that violate community guidelines or engage in malicious platform activities.</p>
        </div>
      </div>
    </main>
  );
}