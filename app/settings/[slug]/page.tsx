'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function SettingDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const title = slug
    ? slug
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : 'Setting Details';

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col px-4 py-6 max-w-2xl mx-auto w-full select-none">
      
      {/* Header with Pink 'Back' Button */}
      <div className="flex flex-col items-start gap-4 mb-6">
        <Link 
          href="/menu" 
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-sm font-bold shadow-[0_0_20px_rgba(236,72,153,0.5)] border border-pink-400/40 transition-all flex items-center justify-center cursor-pointer"
        >
          Back
        </Link>
        <h1 className="text-2xl font-bold text-white tracking-wide">{title}</h1>
      </div>

      {/* Content Box */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="text-pink-400 font-semibold mb-2">Manage your {title}</div>
        <p className="text-slate-400 text-sm mb-6">
          Here you can update your preferences, change configurations, and view related information for {title.toLowerCase()}.
        </p>

        {/* Example interactive element */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-950/50 border border-slate-800 rounded-xl">
            <div>
              <div className="text-sm font-medium text-white">Enable Feature</div>
              <div className="text-xs text-slate-500">Turn on or off this setting module</div>
            </div>
            <input type="checkbox" className="w-5 h-5 accent-pink-600 rounded cursor-pointer" defaultChecked />
          </div>

          <button 
            onClick={() => alert('Changes saved successfully!')}
            className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-semibold rounded-xl shadow-lg shadow-pink-600/30 transition-all cursor-pointer border border-pink-400/40"
          >
            Save Changes
          </button>
        </div>
      </div>

    </main>
  );
}