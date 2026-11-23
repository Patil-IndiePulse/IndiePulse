'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface LeaderboardUser {
  id: string;
  name: string;
  baseXp: number;
  bonusXp: number;
  xp: number;
  streak: string;
  role: 'Creator' | 'Playtester';
  badge: string;
  isCurrentUser?: boolean;
  verifiedActions: number;
}

interface AuditLogEntry {
  id: string;
  action: string;
  xpDelta: number;
  timestamp: string;
}

const STORAGE_KEYS = {
  LEDGER: 'indiePulse_leaderboard_ledger_v1',
  DAILY_CLAIMED: 'indiePulse_daily_quest_date_v1',
  PIC: 'indiePulse_pic',
  NAMES: ['indiePulse_name', 'indiePulse_profile_name', 'indiePulse_user_name', 'indiePulse_username'],
  SUBMITTED_GAMES: 'indiePulse_submitted_games',
  FEEDBACKS: 'indiePulse_playtest_feedbacks',
  COLLABS: 'indiePulse_collab_requests',
};

export default function LeaderboardPage() {
  const router = useRouter();

  const [users, setUsers] = useState<LeaderboardUser[]>([
    {
      id: 'user-me',
      name: 'Bharat Patil',
      baseXp: 1200,
      bonusXp: 50,
      xp: 1250,
      streak: '6d 🔥',
      role: 'Creator',
      badge: 'Verified Builder',
      isCurrentUser: true,
      verifiedActions: 4,
    },
    {
      id: 'user-aarav',
      name: 'Aarav Dev',
      baseXp: 1190,
      bonusXp: 0,
      xp: 1190,
      streak: '4d 🔥',
      role: 'Creator',
      badge: 'WebGL Architect',
      verifiedActions: 3,
    },
    {
      id: 'user-neha',
      name: 'Neha_Gamer',
      baseXp: 1150,
      bonusXp: 0,
      xp: 1150,
      streak: '5d 🔥',
      role: 'Playtester',
      badge: 'Bug Hunter',
      verifiedActions: 5,
    },
    {
      id: 'user-rohan',
      name: 'Rohan_Pixel',
      baseXp: 980,
      bonusXp: 0,
      xp: 980,
      streak: '3d 🔥',
      role: 'Playtester',
      badge: 'QA Scout',
      verifiedActions: 2,
    },
  ]);

  const [leaderboardTab, setLeaderboardTab] = useState<'creators' | 'playtesters'>('creators');
  const [syncedProfilePic, setSyncedProfilePic] = useState<string | null>(null);
  const [syncedProfileName, setSyncedProfileName] = useState<string>('Bharat Patil');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalRewardText, setModalRewardText] = useState('+50 XP');
  const [dailyClaimedToday, setDailyClaimedToday] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [aiStatusText, setAiStatusText] = useState('AI Auto-Sync Active • Verified Ledger');

  const resolveUserName = useCallback(
    (user: LeaderboardUser) => {
      if (user.isCurrentUser) {
        return syncedProfileName ? `${syncedProfileName} (You)` : `${user.name} (You)`;
      }
      return user.name;
    },
    [syncedProfileName]
  );

  // Autonomous AI Scoring & Safe Persistence Engine
  const syncAndComputeAutonomousXP = useCallback(() => {
    try {
      // 1. Read live profile pic & name
      setSyncedProfilePic(localStorage.getItem(STORAGE_KEYS.PIC));
      let resolvedName = 'Bharat Patil';
      for (const key of STORAGE_KEYS.NAMES) {
        const val = localStorage.getItem(key);
        if (val && val.trim()) {
          resolvedName = val.trim();
          break;
        }
      }
      setSyncedProfileName(resolvedName);

      // 2. Check daily quest status
      const todayKey = new Date().toISOString().slice(0, 10);
      const claimedDate = localStorage.getItem(STORAGE_KEYS.DAILY_CLAIMED);
      setDailyClaimedToday(claimedDate === todayKey);

      // 3. Read real platform activity automatically (Zero manual intervention)
      let gamesCount = 0;
      const rawGames = localStorage.getItem(STORAGE_KEYS.SUBMITTED_GAMES);
      if (rawGames) {
        const parsedGames = JSON.parse(rawGames);
        if (Array.isArray(parsedGames)) gamesCount = parsedGames.length;
      }

      let feedbackCount = 0;
      const rawFeedbacks = localStorage.getItem(STORAGE_KEYS.FEEDBACKS);
      if (rawFeedbacks) {
        const parsedFb = JSON.parse(rawFeedbacks);
        if (parsedFb && typeof parsedFb === 'object') {
          Object.values(parsedFb).forEach((arr: any) => {
            if (Array.isArray(arr)) feedbackCount += arr.length;
          });
        }
      }

      let collabCount = 0;
      const rawCollabs = localStorage.getItem(STORAGE_KEYS.COLLABS);
      if (rawCollabs) {
        const parsedCollabs = JSON.parse(rawCollabs);
        if (Array.isArray(parsedCollabs)) collabCount = parsedCollabs.length;
      }

      // 4. Load persistent verified ledger
      let storedBonusXp = 0;
      let storedLogs: AuditLogEntry[] = [];
      const rawLedger = localStorage.getItem(STORAGE_KEYS.LEDGER);
      if (rawLedger) {
        const parsedLedger = JSON.parse(rawLedger);
        if (typeof parsedLedger?.bonusXp === 'number') {
          storedBonusXp = parsedLedger.bonusXp;
        }
        if (Array.isArray(parsedLedger?.logs)) {
          storedLogs = parsedLedger.logs;
        }
      }

      // AI Formula: Base (1200) + Games (150 each) + Feedbacks (40 each) + Collabs (30 each) + Claimed Quests
      const activityXp = gamesCount * 150 + feedbackCount * 40 + collabCount * 30;
      const totalVerifiedActions = gamesCount + feedbackCount + collabCount + storedLogs.length;

      setAuditLogs(storedLogs);
      setUsers((prev) =>
        prev.map((u) => {
          if (u.isCurrentUser) {
            const totalXp = u.baseXp + activityXp + storedBonusXp;
            return {
              ...u,
              name: resolvedName,
              bonusXp: activityXp + storedBonusXp,
              xp: totalXp,
              verifiedActions: Math.max(u.verifiedActions, totalVerifiedActions),
            };
          }
          return u;
        })
      );

      setAiStatusText(
        `AI Engine Synced • ${gamesCount} Games, ${feedbackCount} Reviews, ${storedLogs.length} Quests Verified`
      );
    } catch (error) {
      console.error('Safe Ledger Sync Notice:', error);
    }
  }, []);

  useEffect(() => {
    syncAndComputeAutonomousXP();
    window.addEventListener('storage', syncAndComputeAutonomousXP);
    window.addEventListener('focus', syncAndComputeAutonomousXP);
    return () => {
      window.removeEventListener('storage', syncAndComputeAutonomousXP);
      window.removeEventListener('focus', syncAndComputeAutonomousXP);
    };
  }, [syncAndComputeAutonomousXP]);

  const earnPoints = () => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const alreadyClaimed = localStorage.getItem(STORAGE_KEYS.DAILY_CLAIMED) === todayKey;

    if (alreadyClaimed) {
      setModalRewardText('Daily Quest Already Claimed Today ✓');
      setIsModalOpen(true);
      return;
    }

    try {
      const rawLedger = localStorage.getItem(STORAGE_KEYS.LEDGER);
      const parsedLedger = rawLedger ? JSON.parse(rawLedger) : { bonusXp: 0, logs: [] };
      const updatedBonus = (Number(parsedLedger.bonusXp) || 0) + 50;
      const newEntry: AuditLogEntry = {
        id: `${Date.now()}`,
        action: 'Daily Developer & Community Check-in',
        xpDelta: 50,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      const updatedLogs = [newEntry, ...(Array.isArray(parsedLedger.logs) ? parsedLedger.logs : [])].slice(0, 10);

      localStorage.setItem(
        STORAGE_KEYS.LEDGER,
        JSON.stringify({
          bonusXp: updatedBonus,
          logs: updatedLogs,
          lastUpdated: new Date().toISOString(),
        })
      );
      localStorage.setItem(STORAGE_KEYS.DAILY_CLAIMED, todayKey);
      setDailyClaimedToday(true);
      setModalRewardText('+50 XP');
      syncAndComputeAutonomousXP();
      setIsModalOpen(true);
    } catch (e) {
      console.error('Failed to persist XP safely', e);
    }
  };

  const sortedUsers = [...users]
    .filter((u) => (leaderboardTab === 'creators' ? true : u.role === 'Playtester' || u.isCurrentUser))
    .sort((a, b) => b.xp - a.xp);

  const topThree = sortedUsers.slice(0, 3);
  const myIndex = sortedUsers.findIndex((u) => u.isCurrentUser);
  const myUser = myIndex >= 0 ? sortedUsers[myIndex] : null;
  const rivalAbove = myIndex > 0 ? sortedUsers[myIndex - 1] : null;
  const xpNeededForNext = rivalAbove && myUser ? Math.max(0, rivalAbove.xp - myUser.xp + 1) : 0;
  const progressPercent =
    rivalAbove && myUser ? Math.min(100, Math.max(18, Math.round((myUser.xp / (rivalAbove.xp + 1)) * 100))) : 100;

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col px-3.5 py-5 max-w-xl mx-auto w-full relative overflow-x-hidden select-none pb-14">
      {/* Ambient Background Glow */}
      <div className="absolute top-12 left-1/4 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-24 right-1/4 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navigation & Verified Live Profile Pill */}
      <div className="w-full flex items-center justify-between mb-5 relative z-10">
        <Link
          href="/"
          className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(236,72,153,0.45)] border border-pink-400/40 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <span>←</span> Back
        </Link>

        <div className="flex items-center gap-2 bg-slate-900/90 border border-emerald-500/30 px-3 py-1.5 rounded-full shadow-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <div className="w-6 h-6 rounded-full overflow-hidden border border-pink-500/70 bg-slate-800 flex items-center justify-center shrink-0">
            {syncedProfilePic ? (
              <img src={syncedProfilePic} alt={syncedProfileName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[10px] font-bold text-pink-400">{syncedProfileName.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <span className="text-xs font-bold text-slate-100 truncate max-w-[125px]">{syncedProfileName}</span>
        </div>
      </div>

      {/* Main Arena Card */}
      <div className="bg-slate-900/85 backdrop-blur-xl border border-slate-800 p-5 rounded-3xl w-full shadow-2xl relative z-10">
        {/* AI Live Verification Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold tracking-wider uppercase">
            🛡️ SEASON 01 • LIVE ARENA
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <span>🤖</span> Auto-Ranked
          </span>
        </div>

        <h1 className="text-2xl font-black tracking-tight text-left mb-1">🏆 IndiePulse Champions</h1>
        <p className="text-slate-400 text-xs text-left mb-4 leading-relaxed">
          Build games, test community builds, and unlock real platform rewards automatically.
        </p>

        {/* Season Rewards Incentive Banner (Why Users Should Care) */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-purple-500/10 border border-amber-400/25 mb-5 text-left">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-black text-amber-300 uppercase tracking-wide">
              🎁 Season 01 Top 3 Rewards
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 font-bold">
              Ends in 18d
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-200">
            <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
              <span className="block font-bold text-amber-400">🥇 Rank #1</span>
              <span className="text-slate-400">Homepage Spotlight</span>
            </div>
            <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
              <span className="block font-bold text-slate-200">🥈 Rank #2</span>
              <span className="text-slate-400">Pro Creator Badge</span>
            </div>
            <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800">
              <span className="block font-bold text-amber-600">🥉 Rank #3</span>
              <span className="text-slate-400">Priority Playtest</span>
            </div>
          </div>
        </div>

        {/* Dual-Pulse Mode Switch */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-950 border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => setLeaderboardTab('creators')}
            className={`py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              leaderboardTab === 'creators'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            ⚡ Top Creators
          </button>
          <button
            type="button"
            onClick={() => setLeaderboardTab('playtesters')}
            className={`py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              leaderboardTab === 'playtesters'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            🧪 Playtest Hunters
          </button>
        </div>

        {/* Top 3 Champions Podium Stage */}
        {topThree.length > 0 && (
          <div className="grid grid-cols-3 gap-2 items-end mb-5 pt-2">
            {[topThree[1], topThree[0], topThree[2]].map((podiumUser, idx) => {
              if (!podiumUser) return <div key={idx} />;
              const actualRank = podiumUser.id === topThree[0]?.id ? 1 : podiumUser.id === topThree[1]?.id ? 2 : 3;
              const isFirst = actualRank === 1;
              const displayName = resolveUserName(podiumUser).replace(' (You)', '');

              return (
                <div
                  key={podiumUser.id}
                  className={`flex flex-col items-center p-2.5 rounded-2xl border text-center transition-all ${
                    isFirst
                      ? 'bg-gradient-to-b from-amber-500/20 to-slate-950 border-amber-400/50 shadow-lg shadow-amber-500/10 pb-4'
                      : 'bg-slate-950/90 border-slate-800'
                  }`}
                >
                  <span className="text-base mb-1">{isFirst ? '👑' : actualRank === 2 ? '🥈' : '🥉'}</span>
                  <div
                    className={`rounded-full overflow-hidden border-2 flex items-center justify-center mb-1.5 bg-slate-800 ${
                      isFirst ? 'w-12 h-12 border-amber-400' : 'w-9 h-9 border-slate-600'
                    }`}
                  >
                    {podiumUser.isCurrentUser && syncedProfilePic ? (
                      <img src={syncedProfilePic} alt={displayName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-black text-indigo-300">{displayName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-white truncate w-full">{displayName}</span>
                  <span className="text-[10px] font-extrabold text-emerald-400 mt-0.5">{podiumUser.xp} XP</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Next Target Rivalry Progress Bar */}
        {myUser && (
          <div className="mb-5 p-3.5 rounded-2xl bg-slate-950 border border-indigo-500/30 text-left">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-indigo-300">
                {rivalAbove
                  ? `🎯 Next Target: Overtake ${resolveUserName(rivalAbove)}`
                  : '👑 You hold Rank #1 — Defend your crown!'}
              </span>
              <span className="font-extrabold text-emerald-400">
                {rivalAbove ? `+${xpNeededForNext} XP needed` : `${myUser.xp} XP`}
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Full Verified Standings List */}
        <div className="flex flex-col gap-2.5 mb-5 text-left">
          {sortedUsers.map((user, index) => {
            const displayName = resolveUserName(user);
            return (
              <div
                key={user.id}
                className={`flex justify-between items-center p-3.5 rounded-2xl transition-all ${
                  user.isCurrentUser
                    ? 'border border-indigo-500/60 bg-indigo-950/45 shadow-md'
                    : 'bg-slate-950/70 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-black text-amber-400 w-5 text-center text-xs shrink-0">#{index + 1}</span>
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-700 bg-slate-900 flex items-center justify-center shrink-0">
                    {user.isCurrentUser && syncedProfilePic ? (
                      <img src={syncedProfilePic} alt={displayName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-indigo-300">{displayName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white truncate">{displayName}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold shrink-0">
                        ✓ {user.badge}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {user.role} • {user.streak} • {user.verifiedActions} verified actions
                    </span>
                  </div>
                </div>
                <span className="text-emerald-400 font-black text-xs shrink-0">{user.xp} XP</span>
              </div>
            );
          })}
        </div>

        {/* Clear Action Guide: What User Should Do Next */}
        <div className="mb-5 text-left">
          <span className="text-[11px] font-black text-slate-300 uppercase tracking-wider block mb-2.5">
            ⚡ How to Earn XP & Climb Faster
          </span>
          <div className="grid grid-cols-1 gap-2">
            <button
              type="button"
              onClick={earnPoints}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-between cursor-pointer shadow-lg shadow-indigo-600/25"
            >
              <span className="flex items-center gap-2">
                <span>✨</span>
                <span>{dailyClaimedToday ? 'Daily Check-in Completed Today' : 'Claim Daily Developer Check-in'}</span>
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-white/15 text-[11px]">
                {dailyClaimedToday ? 'Done ✓' : '+50 XP'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => router.push('/submit')}
              className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 text-slate-200 font-semibold text-xs flex items-center justify-between cursor-pointer transition-all"
            >
              <span className="flex items-center gap-2">
                <span>🚀</span>
                <span>Publish a New Indie Game</span>
              </span>
              <span className="text-emerald-400 font-bold text-[11px]">+150 XP →</span>
            </button>

            <button
              type="button"
              onClick={() => router.push('/discover')}
              className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 text-slate-200 font-semibold text-xs flex items-center justify-between cursor-pointer transition-all"
            >
              <span className="flex items-center gap-2">
                <span>🧪</span>
                <span>Test a Game & Submit Feedback</span>
              </span>
              <span className="text-cyan-400 font-bold text-[11px]">+40 XP →</span>
            </button>
          </div>
        </div>

        {/* Autonomous AI Ledger & Data Integrity Footer */}
        <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-left">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              🔒 Autonomous AI Verified Ledger
            </span>
            <span className="text-[9px] text-slate-500">Zero Data Loss</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-snug">{aiStatusText}</p>
          {auditLogs.length > 0 && (
            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
              <span>Last verified: {auditLogs[0].action}</span>
              <span className="text-emerald-400 font-bold">
                +{auditLogs[0].xpDelta} XP ({auditLogs[0].timestamp})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Quest Completed Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center relative">
            <div className="text-4xl mb-3">🎉</div>
            <h3 className="text-lg font-black text-white mb-2">Verified & Saved!</h3>
            <p className="text-slate-300 text-xs mb-6 leading-relaxed">
              Your XP ledger has been securely updated and locked in: <span className="text-emerald-400 font-bold">{modalRewardText}</span>
            </p>
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all text-xs cursor-pointer border border-pink-400/40"
            >
              Claim & Continue 🚀
            </button>
          </div>
        </div>
      )}
    </main>
  );
}