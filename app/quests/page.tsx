'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface QuestData {
  id: number | string;
  title: string;
  xp: number;
  completed: boolean;
  desc: string;
  actionText: string;
  stepsRequired: number;
  stepsCompleted: number;
  category?: string;
}

interface SponsorAd {
  id: string;
  companyName: string;
  headline: string;
  offerText: string;
  ctaLabel: string;
  targetUrl: string;
  bonusXp: number;
}

const STORAGE_KEYS = {
  DAILY_QUESTS: 'indiePulse_daily_quests_v1',
  LEDGER: 'indiePulse_leaderboard_ledger_v1',
  STREAK: 'indiePulse_quest_streak_v1',
  AD_IMPRESSIONS: 'indiePulse_ad_impressions_v1',
};

const SPONSOR_POOL: SponsorAd[] = [
  {
    id: 'sp-1',
    companyName: 'PulseCloud Hosting',
    headline: 'Deploy Multiplayer & WebGL Builds Faster',
    offerText: 'Free starter tier for indie creators + bonus community spotlight.',
    ctaLabel: 'Explore Sponsor Offer',
    targetUrl: '/discover',
    bonusXp: 40,
  },
  {
    id: 'sp-2',
    companyName: 'PixelForge Assets',
    headline: 'Daily Game Art, SFX & UI Packs',
    offerText: 'Check out fresh dev assets and boost your prototype polish.',
    ctaLabel: 'Check Creator Pack',
    targetUrl: '/submit',
    bonusXp: 45,
  },
  {
    id: 'sp-3',
    companyName: 'IndiePlaytest Guild',
    headline: 'Get Real Bug & Gameplay Feedback',
    offerText: 'Connect with active playtesters and level up your build faster.',
    ctaLabel: 'Visit Playtest Hub',
    targetUrl: '/community',
    bonusXp: 35,
  },
];

function getTodayDateKey() {
  return new Date().toISOString().slice(0, 10);
}

function getDailySponsorForDate(dateKey: string): SponsorAd {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash * 31 + dateKey.charCodeAt(i)) % 1000;
  }
  return SPONSOR_POOL[hash % SPONSOR_POOL.length];
}

function generateDailyQuests(dateKey: string): QuestData[] {
  let seed = 0;
  for (let i = 0; i < dateKey.length; i++) {
    seed = (seed * 29 + dateKey.charCodeAt(i)) % 10000;
  }

  const baseQuests: QuestData[] = [
    {
      id: 1,
      title: '🚀 Publish Your First Indie Game',
      xp: 500,
      completed: false,
      desc: 'Upload your game build or prototype to the IndiePulse discover catalog.',
      actionText: 'Upload Game Build',
      stepsRequired: 2,
      stepsCompleted: 0,
      category: 'Creator Mission',
    },
    {
      id: 2,
      title: '🤝 Connect with 3 Nearby Developers',
      xp: 150,
      completed: false,
      desc: 'Interact and send connection requests to local game developers.',
      actionText: 'Find Developers',
      stepsRequired: 3,
      stepsCompleted: 0,
      category: 'Community',
    },
    {
      id: 3,
      title: '📢 Share a DevLog Update in Community',
      xp: 100,
      completed: true,
      desc: 'Post your daily game dev progress in the community feed.',
      actionText: 'Open Community',
      stepsRequired: 2,
      stepsCompleted: 2,
      category: 'Daily DevLog',
    },
  ];

  if (seed % 2 === 1) {
    return [
      {
        ...baseQuests[1],
        id: 21,
        title: '🧪 Daily Playtest Sprint (2 Builds)',
        xp: 180,
        completed: false,
        stepsRequired: 2,
        stepsCompleted: 0,
        category: 'Daily Sprint',
      },
      {
        ...baseQuests[0],
        id: 11,
        stepsRequired: 2,
        stepsCompleted: 0,
      },
      {
        ...baseQuests[2],
        id: 31,
        completed: false,
        stepsRequired: 2,
        stepsCompleted: 0,
      },
    ];
  }

  return baseQuests;
}

export default function QuestsPage() {
  const router = useRouter();
  const todayKey = getTodayDateKey();
  const dailySponsor = getDailySponsorForDate(todayKey);

  const [quests, setQuests] = useState<QuestData[]>([
    {
      id: 1,
      title: '🚀 Publish Your First Indie Game',
      xp: 500,
      completed: false,
      desc: 'Upload your game build or prototype to the IndiePulse discover catalog.',
      actionText: 'Upload Game Build',
      stepsRequired: 2,
      stepsCompleted: 0,
      category: 'Creator Mission',
    },
    {
      id: 2,
      title: '🤝 Connect with 3 Nearby Developers',
      xp: 150,
      completed: false,
      desc: 'Interact and send connection requests to local game developers.',
      actionText: 'Find Developers',
      stepsRequired: 3,
      stepsCompleted: 0,
      category: 'Community',
    },
    {
      id: 3,
      title: '📢 Share a DevLog Update in Community',
      xp: 100,
      completed: true,
      desc: 'Post your daily game dev progress in the community feed.',
      actionText: 'Open Community',
      stepsRequired: 2,
      stepsCompleted: 2,
      category: 'Daily DevLog',
    },
  ]);

  const [selectedQuest, setSelectedQuest] = useState<QuestData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingState, setLoadingState] = useState<'idle' | 'scanning' | 'verified'>('idle');
  const [streakCount, setStreakCount] = useState<number>(1);
  const [adViewsCount, setAdViewsCount] = useState<number>(0);
  const [adViewedToday, setAdViewedToday] = useState<boolean>(false);

  const syncQuestsAndAds = useCallback(() => {
    try {
      const savedStreak = Number(localStorage.getItem(STORAGE_KEYS.STREAK) || '1');
      if (!Number.isNaN(savedStreak) && savedStreak > 0) {
        setStreakCount(savedStreak);
      }

      const rawAdStats = localStorage.getItem(STORAGE_KEYS.AD_IMPRESSIONS);
      if (rawAdStats) {
        const parsedAd = JSON.parse(rawAdStats);
        if (typeof parsedAd?.totalViews === 'number') {
          setAdViewsCount(parsedAd.totalViews);
        }
        if (parsedAd?.lastDate === todayKey && parsedAd?.lastSponsorId === dailySponsor.id) {
          setAdViewedToday(true);
        }
      }

      const rawQuests = localStorage.getItem(STORAGE_KEYS.DAILY_QUESTS);
      if (rawQuests) {
        const parsedQuests = JSON.parse(rawQuests);
        if (parsedQuests?.dateKey === todayKey && Array.isArray(parsedQuests?.quests) && parsedQuests.quests.length > 0) {
          setQuests(parsedQuests.quests);
          return;
        }
      }

      const freshQuests = generateDailyQuests(todayKey);
      setQuests(freshQuests);
      localStorage.setItem(
        STORAGE_KEYS.DAILY_QUESTS,
        JSON.stringify({ dateKey: todayKey, quests: freshQuests })
      );
    } catch (err) {
      console.error('Safe quest sync error:', err);
    }
  }, [todayKey, dailySponsor.id]);

  useEffect(() => {
    syncQuestsAndAds();
  }, [syncQuestsAndAds]);

  const saveQuestsToStorage = (updated: QuestData[]) => {
    setQuests(updated);
    try {
      localStorage.setItem(
        STORAGE_KEYS.DAILY_QUESTS,
        JSON.stringify({ dateKey: todayKey, quests: updated })
      );
    } catch (err) {
      console.error('Failed to persist quests:', err);
    }
  };

  const handleStartQuest = (quest: QuestData) => {
    setSelectedQuest(quest);
    setLoadingState('idle');
    setIsModalOpen(true);
  };

  // Step-by-Step Verification Simulation
  const handleExecuteTask = () => {
    if (!selectedQuest) return;
    setLoadingState('scanning');
    setTimeout(() => {
      const nextStep = Math.min(selectedQuest.stepsRequired, selectedQuest.stepsCompleted + 1);
      const updatedQuest: QuestData = {
        ...selectedQuest,
        stepsCompleted: nextStep,
      };
      const updatedList = quests.map((q) => (q.id === selectedQuest.id ? updatedQuest : q));
      saveQuestsToStorage(updatedList);
      setSelectedQuest(updatedQuest);

      if (nextStep >= selectedQuest.stepsRequired) {
        setLoadingState('verified');
      } else {
        setLoadingState('idle');
      }
    }, 1200);
  };

  const handleCompleteQuest = () => {
    if (selectedQuest) {
      const updatedList = quests.map((q) =>
        q.id === selectedQuest.id
          ? { ...q, completed: true, stepsCompleted: q.stepsRequired }
          : q
      );
      saveQuestsToStorage(updatedList);

      // Direct sync with Leaderboard Verified Ledger (indiePulse_leaderboard_ledger_v1)
      try {
        const rawLedger = localStorage.getItem(STORAGE_KEYS.LEDGER);
        const parsedLedger = rawLedger ? JSON.parse(rawLedger) : { bonusXp: 0, logs: [] };
        const currentBonus = Number(parsedLedger?.bonusXp) || 0;
        const newBonus = currentBonus + selectedQuest.xp;

        const newLog = {
          id: `${Date.now()}`,
          action: `Quest Reward: ${selectedQuest.title}`,
          xpDelta: selectedQuest.xp,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        localStorage.setItem(
          STORAGE_KEYS.LEDGER,
          JSON.stringify({
            bonusXp: newBonus,
            logs: [newLog, ...(Array.isArray(parsedLedger?.logs) ? parsedLedger.logs : [])].slice(0, 25),
            lastUpdated: new Date().toISOString(),
          })
        );

        const allCompleted = updatedList.every((item) => item.completed);
        if (allCompleted) {
          const nextStreak = streakCount + 1;
          setStreakCount(nextStreak);
          localStorage.setItem(STORAGE_KEYS.STREAK, String(nextStreak));
        }
      } catch (err) {
        console.error('Failed to sync XP to leaderboard ledger:', err);
      }

      setIsModalOpen(false);
      setSelectedQuest(null);
      setLoadingState('idle');
    }
  };

  // Daily Company Advertisement Impression & Bonus XP Sync
  const handleSponsorEngage = () => {
    try {
      const rawAdStats = localStorage.getItem(STORAGE_KEYS.AD_IMPRESSIONS);
      const parsedAd = rawAdStats ? JSON.parse(rawAdStats) : { totalViews: 0, history: [] };
      const nextViews = (Number(parsedAd?.totalViews) || 0) + 1;

      const updatedAdRecord = {
        totalViews: nextViews,
        lastDate: todayKey,
        lastSponsorId: dailySponsor.id,
        companyName: dailySponsor.companyName,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.AD_IMPRESSIONS, JSON.stringify(updatedAdRecord));
      setAdViewsCount(nextViews);

      if (!adViewedToday) {
        setAdViewedToday(true);
        const rawLedger = localStorage.getItem(STORAGE_KEYS.LEDGER);
        const parsedLedger = rawLedger ? JSON.parse(rawLedger) : { bonusXp: 0, logs: [] };
        const currentBonus = Number(parsedLedger?.bonusXp) || 0;
        const sponsorLog = {
          id: `${Date.now()}`,
          action: `Sponsor Spotlight: ${dailySponsor.companyName}`,
          xpDelta: dailySponsor.bonusXp,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        localStorage.setItem(
          STORAGE_KEYS.LEDGER,
          JSON.stringify({
            bonusXp: currentBonus + dailySponsor.bonusXp,
            logs: [sponsorLog, ...(Array.isArray(parsedLedger?.logs) ? parsedLedger.logs : [])].slice(0, 25),
            lastUpdated: new Date().toISOString(),
          })
        );
      }
    } catch (err) {
      console.error('Sponsor impression error:', err);
    }

    router.push(dailySponsor.targetUrl);
  };

  return (
    <main
      style={{ textAlign: 'left' }}
      className="min-h-screen bg-slate-950 text-white flex flex-col px-4 py-6 max-w-xl mx-auto w-full relative overflow-x-hidden select-none text-left"
    >
      {/* Background Decorative Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Row with Clear Pink 'Back' Button (No Arrow) */}
      <div style={{ textAlign: 'left' }} className="w-full flex items-center justify-between mb-6 relative z-10 text-left">
        <Link
          href="/"
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-sm font-bold shadow-[0_0_20px_rgba(236,72,153,0.5)] border border-pink-400/40 transition-all flex items-center justify-center cursor-pointer"
        >
          Back
        </Link>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full bg-slate-900 border border-amber-500/30 text-amber-300 text-xs font-bold">
            🔥 {streakCount}d Streak
          </span>
          <Link
            href="/leaderboard"
            className="px-3 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 text-xs font-bold hover:bg-indigo-900/80 transition-all"
          >
            Leaderboard
          </Link>
        </div>
      </div>

      {/* Daily Rotating Company Advertisement Spotlight */}
      <div
        style={{ textAlign: 'left' }}
        className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-purple-600/15 border border-amber-400/35 p-4 rounded-2xl w-full shadow-lg relative z-10 mb-5 text-left"
      >
        <div className="flex items-center justify-between gap-2 mb-1.5 text-left">
          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/20 text-amber-300">
            📢 SPONSORED SPOTLIGHT • {todayKey}
          </span>
          <span className="text-[10px] text-emerald-400 font-bold">
            +{dailySponsor.bonusXp} XP • {adViewsCount} Views
          </span>
        </div>
        <h3 style={{ textAlign: 'left' }} className="text-sm font-black text-white mb-0.5 text-left w-full">
          {dailySponsor.companyName} — {dailySponsor.headline}
        </h3>
        <p style={{ textAlign: 'left' }} className="text-xs text-slate-300 mb-3 leading-relaxed text-left w-full">
          {dailySponsor.offerText}
        </p>
        <button
          type="button"
          onClick={handleSponsorEngage}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs cursor-pointer transition-all text-left flex items-center justify-between"
        >
          <span>{adViewedToday ? `${dailySponsor.ctaLabel} (Reward Claimed ✓)` : dailySponsor.ctaLabel}</span>
          <span>→</span>
        </button>
      </div>

      {/* Quests Container */}
      <div
        style={{ textAlign: 'left' }}
        className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-6 sm:p-8 rounded-2xl w-full shadow-2xl shadow-amber-950/50 text-left relative z-10 mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
          🌟 DAILY & SPECIAL QUESTS 🎯
        </div>
        <h2 style={{ textAlign: 'left' }} className="text-2xl font-black mb-2 tracking-tight text-left w-full">
          🗺️ IndiePulse Quests ⚔️
        </h2>
        <p style={{ textAlign: 'left' }} className="text-slate-400 text-sm mb-6 text-left w-full">
          Complete real mission steps, level up your profile, and earn exciting XP rewards synced directly to the leaderboard! 🎁
        </p>

        {/* Quests List */}
        <div style={{ textAlign: 'left' }} className="flex flex-col gap-4 mb-2 text-left max-h-[420px] overflow-y-auto pr-1">
          {quests.map((quest) => (
            <div
              key={quest.id}
              style={{ textAlign: 'left' }}
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all text-left ${
                quest.completed
                  ? 'bg-slate-900/40 border-emerald-500/30 opacity-80'
                  : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800'
              }`}
            >
              <div className="space-y-1 text-left">
                <h3
                  style={{ textAlign: 'left' }}
                  className={`font-bold text-sm text-left ${quest.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}
                >
                  {quest.title}
                </h3>
                <p style={{ textAlign: 'left' }} className="text-xs text-slate-400 text-left">
                  {quest.desc}
                </p>
                <span style={{ textAlign: 'left' }} className="text-xs text-amber-400 font-semibold block text-left">
                  ✨ +{quest.xp} XP Reward ⚡ • Step {quest.stepsCompleted}/{quest.stepsRequired}
                </span>
              </div>
              <button
                type="button"
                onClick={() => !quest.completed && handleStartQuest(quest)}
                disabled={quest.completed}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 self-start sm:self-center ${
                  quest.completed
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/35 cursor-default'
                    : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-md shadow-amber-600/30 cursor-pointer'
                }`}
              >
                {quest.completed ? 'Completed 🎉' : quest.stepsCompleted > 0 ? 'Continue 🚀' : 'Start Quest 🚀'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quest Interactive Popup Modal */}
      {isModalOpen && selectedQuest && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div
            style={{ textAlign: 'left' }}
            className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-left relative animate-in fade-in zoom-in duration-200"
          >
            <div className="text-4xl mb-3 text-left">🎯</div>
            <h3 style={{ textAlign: 'left' }} className="text-lg font-black text-white mb-2 text-left w-full">
              {selectedQuest.title}
            </h3>
            <p style={{ textAlign: 'left' }} className="text-slate-300 text-xs mb-3 leading-relaxed text-left w-full">
              {selectedQuest.desc}
            </p>

            {/* Step Progress Indicator */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl mb-4 text-left">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-slate-300 font-bold">Mission Progress</span>
                <span className="text-emerald-400 font-black">
                  {selectedQuest.stepsCompleted}/{selectedQuest.stepsRequired} Steps
                </span>
              </div>
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.round((selectedQuest.stepsCompleted / selectedQuest.stepsRequired) * 100))}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 font-bold text-xs mb-5 text-left">
              Reward upon completion: +{selectedQuest.xp} XP ⚡ (Synced to Leaderboard)
            </div>

            {loadingState === 'idle' && (
              <div className="flex flex-col gap-3">
                {selectedQuest.stepsCompleted < selectedQuest.stepsRequired ? (
                  <button
                    type="button"
                    onClick={handleExecuteTask}
                    className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                  >
                    Verify Step ({selectedQuest.stepsCompleted + 1}/{selectedQuest.stepsRequired}): {selectedQuest.actionText}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCompleteQuest}
                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                  >
                    Complete Quest & Claim +{selectedQuest.xp} XP ✅
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs shadow-[0_0_15px_rgba(236,72,153,0.5)] border border-pink-400/40 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}

            {loadingState === 'scanning' && (
              <div className="flex flex-col items-start gap-3 py-4 text-left">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-xs text-amber-400 font-semibold animate-pulse text-left">
                  Verifying your mission step progress...
                </p>
              </div>
            )}

            {loadingState === 'verified' && (
              <div className="flex flex-col gap-3 text-left">
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold text-left">
                  All mission steps verified! Task completed. ✅
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs shadow-[0_0_15px_rgba(236,72,153,0.5)] border border-pink-400/40 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCompleteQuest}
                    className="flex-1 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all text-xs cursor-pointer border border-pink-400/40"
                  >
                    Complete Quest ✅
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}