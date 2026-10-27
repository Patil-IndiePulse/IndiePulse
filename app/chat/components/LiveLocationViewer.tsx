'use client';

import React from 'react';

interface LiveLocationProps {
  locationUrl: string;
  locationName?: string;
}

export default function LiveLocationViewer({ locationUrl, locationName }: LiveLocationProps) {
  return (
    <a 
      href={locationUrl} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="mb-1 rounded-xl overflow-hidden max-w-[260px] border border-white/20 flex flex-col gap-2 bg-black/60 p-3 block hover:bg-black/80 transition-colors shadow-lg cursor-pointer"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-green-600/30 border border-green-400/40 flex items-center justify-center text-sm font-bold text-green-300 shrink-0">
          📍
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-bold text-white truncate">{locationName || 'Live GPS Location'}</span>
          <span className="text-[9px] text-green-400 font-bold uppercase tracking-wider">TAP TO OPEN GOOGLE MAPS LIVE</span>
        </div>
      </div>
      <div className="w-full h-24 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-green-900/40 to-blue-900/40 flex items-center justify-center">
          <span className="text-2xl animate-bounce">📍</span>
        </div>
        <span className="absolute bottom-1 right-1 text-[8px] bg-black/70 px-1.5 py-0.5 rounded text-white font-mono">GPS Active</span>
      </div>
    </a>
  );
}