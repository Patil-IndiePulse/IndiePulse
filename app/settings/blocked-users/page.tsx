'use client';

import Link from 'next/link';

export default function AccountsCenterPage() {
  const accountOptions = [
    { title: "Profiles and personal details", desc: "Manage your name, email, and bio", icon: "👤" },
    { title: "Password and security", desc: "Change password, security alerts", icon: "🔒" },
    { title: "Connected experiences", desc: "Manage linked social & gaming accounts", icon: "🔗" },
    { title: "Your information and permissions", desc: "App access, camera, and location", icon: "📋" },
    { title: "Ad preferences", desc: "Manage personalized ads and topics", icon: "📢" },
    { title: "Manage accounts", desc: "Add or remove connected accounts", icon: "⚙️" }
  ];

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col px-4 py-8 max-w-xl mx-auto w-full relative overflow-x-hidden select-none">
      
      {/* Background Decorative Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Row with Clear Pink 'Back' Button */}
      <div className="w-full flex items-start mb-6 relative z-10">
        <Link 
          href="/settings" 
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-sm font-bold shadow-[0_0_20px_rgba(236,72,153,0.5)] border border-pink-400/40 transition-all flex items-center justify-center cursor-pointer"
        >
          Back
        </Link>
      </div>

      {/* Page Title & Subtitle */}
      <div className="mb-6 relative z-10">
        <h1 className="text-3xl font-black tracking-tight text-white mb-2">Accounts Center</h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Manage your connected experiences and account settings across IndiePulse technologies.
        </p>
      </div>

      {/* Accounts Center Options List */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl w-full shadow-2xl shadow-purple-950/50 overflow-hidden relative z-10 mb-6">
        <div className="divide-y divide-slate-800/80">
          {accountOptions.map((item, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3.5">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <h3 className="font-bold text-sm text-white group-hover:text-pink-400 transition-colors">{item.title}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                </div>
              </div>
              <span className="text-slate-500 group-hover:text-white transition-colors text-sm font-bold">→</span>
            </div>
          ))}
        </div>
      </div>

    </main>
  );
}