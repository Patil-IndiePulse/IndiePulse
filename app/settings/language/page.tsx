'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export default function LanguageSettingsPage() {
  const [selectedLanguage, setSelectedLanguage] = useState('मराठी (Marathi)');
  const [selectedRegion, setSelectedRegion] = useState('India (Asia South)');
  const [timeFormat, setTimeFormat] = useState('24-hour');

  // Dropdown open states
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);

  // Load saved preferences from localStorage on page load
  useEffect(() => {
    const savedLang = localStorage.getItem('platform_language');
    const savedRegion = localStorage.getItem('platform_region');
    const savedTime = localStorage.getItem('platform_time_format');

    if (savedLang) setSelectedLanguage(savedLang);
    if (savedRegion) setSelectedRegion(savedRegion);
    if (savedTime) setTimeFormat(savedTime);

    // Close dropdowns on outside click
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) setIsLangOpen(false);
      if (regionRef.current && !regionRef.current.contains(event.target as Node)) setIsRegionOpen(false);
      if (timeRef.current && !timeRef.current.contains(event.target as Node)) setIsTimeOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    localStorage.setItem('platform_language', selectedLanguage);
    localStorage.setItem('platform_region', selectedRegion);
    localStorage.setItem('platform_time_format', timeFormat);

    window.dispatchEvent(new Event('platform-settings-changed'));

    alert(`Language updated to ${selectedLanguage} and applied across all platform tools successfully!`);
  };

  const languagesList = [
    { group: 'Indian Languages (भारतीय भाषा)', items: ['ಕನ್ನಡ (Kannada)', 'मराठी (Marathi)', 'हिन्दी (Hindi)', 'বাংলা (Bengali)', 'தமிழ் (Tamil)', 'తెలుగు (Telugu)', 'ગુજરાતી (Gujarati)', 'മലയാളം (Malayalam)', 'ਪੰਜਾਬੀ (Punjabi)', 'ଓଡ଼ିଆ (Odia)', 'অসমীয়া (Assamese)', 'اردو (Urdu)'] },
    { group: 'Global Languages (आंतरराष्ट्रीय भाषा)', items: ['English (US)', 'English (UK)', 'Español (Spanish)', 'Français (French)', 'Deutsch (German)', '日本語 (Japanese)', '中文 (Chinese)', '한국어 (Korean)', 'Русский (Russian)', 'Português (Portuguese)', 'Italiano (Italian)', 'Türkçe (Turkish)', 'العربية (Arabic)', 'Tiếng Việt (Vietnamese)'] }
  ];

  const regionsList = [
    { group: 'Asia (आशिया)', items: ['India (Asia South)', 'Japan (East Asia)', 'South Korea (East Asia)', 'China (East Asia)', 'Singapore (Southeast Asia)', 'United Arab Emirates (Middle East)', 'Saudi Arabia (Middle East)', 'Israel (Middle East)', 'Pakistan (Asia South)', 'Bangladesh (Asia South)', 'Indonesia (Southeast Asia)', 'Vietnam (Southeast Asia)', 'Thailand (Southeast Asia)', 'Philippines (Southeast Asia)', 'Malaysia (Southeast Asia)'] },
    { group: 'North America (उत्तर अमेरिका)', items: ['United States - East (US Central)', 'United States - West (US West)', 'Canada - Central (North America)', 'Mexico (North America)'] },
    { group: 'Europe (युरोप)', items: ['United Kingdom (Europe West)', 'Germany (Europe Central)', 'France (Europe Central)', 'Ireland (Europe West)', 'Sweden (Europe North)', 'Italy (Europe South)', 'Spain (Europe South)', 'Switzerland (Europe Central)', 'Poland (Europe Central)', 'Netherlands (Europe West)'] },
    { group: 'South America (दक्षिण अमेरिका)', items: ['Brazil (South America)', 'Argentina (South America)', 'Chile (South America)', 'Colombia (South America)'] },
    { group: 'Oceania (ओशनिया)', items: ['Australia - East (Australia)', 'New Zealand (Oceania)'] },
    { group: 'Africa (आफ्रिका)', items: ['South Africa (Africa South)', 'Egypt (Africa North)', 'Nigeria (Africa West)', 'Kenya (Africa East)'] }
  ];

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
          <h1 className="text-2xl font-black tracking-wide text-white">Language & Region</h1>
          <p className="text-xs text-slate-300 mt-1">Configure your preferred platform language, global server regions, and time format.</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-[#120e26]/90 border border-purple-500/30 rounded-2xl p-5 shadow-[0_0_25px_rgba(147,51,234,0.15)] mb-6">
        <div className="text-pink-400 text-[11px] font-bold uppercase tracking-wider mb-4">
          Preferences Settings
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          
          {/* Languages Custom Dropdown */}
          <div className="relative" ref={langRef}>
            <label className="block text-[11px] text-slate-300 mb-1 font-semibold">Platform Language (Indian & Global)</label>
            <div 
              onClick={() => { setIsLangOpen(!isLangOpen); setIsRegionOpen(false); setIsTimeOpen(false); }}
              className="w-full bg-[#070514] border border-purple-500/40 rounded-xl px-3.5 py-3 text-xs text-white flex justify-between items-center cursor-pointer focus:border-pink-500"
            >
              <span>{selectedLanguage}</span>
              <span className="text-pink-400">▼</span>
            </div>

            {isLangOpen && (
              <div className="absolute top-full left-0 mt-2 w-full bg-[#070514] border border-pink-500/50 rounded-xl shadow-2xl max-h-60 overflow-y-auto z-50">
                {languagesList.map((group, idx) => (
                  <div key={idx}>
                    <div className="px-3 py-1.5 text-[10px] font-bold text-pink-400 bg-purple-950/40 sticky top-0">{group.group}</div>
                    {group.items.map((lang, i) => (
                      <div 
                        key={i}
                        onClick={() => { setSelectedLanguage(lang); setIsLangOpen(false); }}
                        className="px-4 py-2.5 text-xs text-slate-300 hover:bg-pink-950/40 hover:text-white cursor-pointer transition-colors border-b border-slate-900 last:border-none"
                      >
                        {lang}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Region Custom Dropdown - Always opens DOWNWARDS */}
          <div className="relative" ref={regionRef}>
            <label className="block text-[11px] text-slate-300 mb-1 font-semibold">Region & Global Server Zone (All Countries)</label>
            <div 
              onClick={() => { setIsRegionOpen(!isRegionOpen); setIsLangOpen(false); setIsTimeOpen(false); }}
              className="w-full bg-[#070514] border border-purple-500/40 rounded-xl px-3.5 py-3 text-xs text-white flex justify-between items-center cursor-pointer focus:border-pink-500"
            >
              <span>{selectedRegion}</span>
              <span className="text-pink-400">▼</span>
            </div>

            {isRegionOpen && (
              <div className="absolute top-full left-0 mt-2 w-full bg-[#070514] border border-pink-500/50 rounded-xl shadow-2xl max-h-64 overflow-y-auto z-50">
                {regionsList.map((group, idx) => (
                  <div key={idx}>
                    <div className="px-3 py-1.5 text-[10px] font-bold text-pink-400 bg-purple-950/40 sticky top-0">{group.group}</div>
                    {group.items.map((reg, i) => (
                      <div 
                        key={i}
                        onClick={() => { setSelectedRegion(reg); setIsRegionOpen(false); }}
                        className="px-4 py-2.5 text-xs text-slate-300 hover:bg-pink-950/40 hover:text-white cursor-pointer transition-colors border-b border-slate-900 last:border-none"
                      >
                        {reg}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Time Format Custom Dropdown */}
          <div className="relative" ref={timeRef}>
            <label className="block text-[11px] text-slate-300 mb-1 font-semibold">Time Format</label>
            <div 
              onClick={() => { setIsTimeOpen(!isTimeOpen); setIsLangOpen(false); setIsRegionOpen(false); }}
              className="w-full bg-[#070514] border border-purple-500/40 rounded-xl px-3.5 py-3 text-xs text-white flex justify-between items-center cursor-pointer focus:border-pink-500"
            >
              <span>{timeFormat === '24-hour' ? '24-hour (14:30)' : '12-hour (02:30 PM)'}</span>
              <span className="text-pink-400">▼</span>
            </div>

            {isTimeOpen && (
              <div className="absolute top-full left-0 mt-2 w-full bg-[#070514] border border-pink-500/50 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div 
                  onClick={() => { setTimeFormat('24-hour'); setIsTimeOpen(false); }}
                  className="px-4 py-2.5 text-xs text-slate-300 hover:bg-pink-950/40 hover:text-white cursor-pointer border-b border-slate-900"
                >
                  24-hour (14:30)
                </div>
                <div 
                  onClick={() => { setTimeFormat('12-hour'); setIsTimeOpen(false); }}
                  className="px-4 py-2.5 text-xs text-slate-300 hover:bg-pink-950/40 hover:text-white cursor-pointer"
                >
                  12-hour (02:30 PM)
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(236,72,153,0.4)] cursor-pointer transition-all"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>

    </main>
  );
}