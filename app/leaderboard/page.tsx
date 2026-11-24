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
  const [statusSummaryText, setStatusSummaryText] = useState('Live Sync Active • Verified Ledger');
  const [activityCounts, setActivityCounts] = useState({ games: 0, reviews: 0, collabs: 0 });
  const [highlightUserCard, setHighlightUserCard] = useState(false);

  const resolveUserName = useCallback(
    (user: LeaderboardUser) => {
      if (user.isCurrentUser) {
        return syncedProfileName ? `${syncedProfileName} (You)` : `${user.name} (You)`;
      }
      return user.name;
    },
    [syncedProfileName]
  );

  // Autonomous Scoring & Safe Persistence Engine
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

      setActivityCounts({ games: gamesCount, reviews: feedbackCount, collabs: collabCount });

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

      // Formula: Base (1200) + Games (150 each) + Feedbacks (40 each) + Collabs (30 each) + Claimed Quests
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

      setStatusSummaryText(
        `Live Synced • ${gamesCount} Games, ${feedbackCount} Reviews, ${storedLogs.length} Quests Verified`
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

  const handleClaimAndContinue = () => {
    setIsModalOpen(false);
    setHighlightUserCard(true);
    setTimeout(() => setHighlightUserCard(false), 2600);
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
    <main
      style={{ textAlign: 'left' }}
      className="min-h-screen bg-slate-950 text-white flex flex-col px-3.5 py-5 max-w-xl mx-auto w-full relative overflow-x-hidden select-none pb-14 text-left"
    >
      {/* Ambient Background Glow */}
      <div className="absolute top-12 left-1/4 w-80 h-80 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-24 right-1/4 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navigation & Verified Live Profile Pill */}
      <div style={{ textAlign: 'left' }} className="w-full flex items-center justify-between mb-5 relative z-10 text-left">
        <Link
          href="/"
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-sm font-bold shadow-[0_0_20px_rgba(236,72,153,0.5)] border border-pink-400/40 transition-all flex items-center justify-center cursor-pointer"
        >
          Back
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
      <div style={{ textAlign: 'left' }} className="bg-slate-900/85 backdrop-blur-xl border border-slate-800 p-5 rounded-3xl w-full shadow-2xl relative z-10 text-left">
        {/* Live Verification Header */}
        <div style={{ textAlign: 'left' }} className="flex items-center justify-between gap-2 mb-3 text-left">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-[10px] font-bold tracking-wider uppercase">
            🛡️ SEASON 01 • LIVE ARENA
          </span>
          <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
            <span>⚡</span> Auto-Ranked
          </span>
        </div>

        <h1 style={{ textAlign: 'left' }} className="text-2xl font-black tracking-tight text-left mb-1 w-full">
          🏆 IndiePulse Champions
        </h1>
        <p style={{ textAlign: 'left' }} className="text-slate-400 text-xs text-left mb-4 leading-relaxed w-full">
          Build games, test community builds, and unlock real platform rewards automatically.
        </p>

        {/* Live Activity Breakdown Strip */}
        <div style={{ textAlign: 'left' }} className="grid grid-cols-3 gap-2 mb-4 text-left">
          <div className="bg-slate-950/90 border border-slate-800 p-2.5 rounded-2xl text-left">
            <span className="text-[10px] text-slate-400 block text-left">Games Shipped</span>
            <span className="text-sm font-black text-emerald-400 block text-left">{activityCounts.games}</span>
          </div>
          <div className="bg-slate-950/90 border border-slate-800 p-2.5 rounded-2xl text-left">
            <span className="text-[10px] text-slate-400 block text-left">Reviews Given</span>
            <span className="text-sm font-black text-cyan-400 block text-left">{activityCounts.reviews}</span>
          </div>
          <div className="bg-slate-950/90 border border-slate-800 p-2.5 rounded-2xl text-left">
            <span className="text-[10px] text-slate-400 block text-left">Your Standing</span>
            <span className="text-sm font-black text-amber-400 block text-left">
              {myIndex >= 0 ? `Rank #${myIndex + 1}` : 'Active'}
            </span>
          </div>
        </div>

        {/* Season Rewards Incentive Banner (Why Users Should Care) */}
        <div style={{ textAlign: 'left' }} className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-purple-500/10 border border-amber-400/25 mb-5 text-left">
          <div className="flex items-center justify-between mb-1.5 text-left">
            <span className="text-[11px] font-black text-amber-300 uppercase tracking-wide text-left">
              🎁 Season 01 Top 3 Rewards
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/15 text-amber-300 font-bold">
              Ends in 18d
            </span>
          </div>
          <div style={{ textAlign: 'left' }} className="grid grid-cols-3 gap-2 text-[10px] text-slate-200 text-left">
            <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-left">
              <span className="block font-bold text-amber-400 text-left">🥇 Rank #1</span>
              <span className="text-slate-400 block text-left">Homepage Spotlight</span>
            </div>
            <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-left">
              <span className="block font-bold text-slate-200 text-left">🥈 Rank #2</span>
              <span className="text-slate-400 block text-left">Pro Creator Badge</span>
            </div>
            <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-left">
              <span className="block font-bold text-amber-600 text-left">🥉 Rank #3</span>
              <span className="text-slate-400 block text-left">Priority Playtest</span>
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
                  style={{ textAlign: 'left' }}
                  className={`flex flex-col items-start p-2.5 rounded-2xl border text-left transition-all ${
                    isFirst
                      ? 'bg-gradient-to-b from-amber-500/20 to-slate-950 border-amber-400/50 shadow-lg shadow-amber-500/10 pb-4'
                      : 'bg-slate-950/90 border-slate-800'
                  }`}
                >
                  <span className="text-base mb-1 block text-left">{isFirst ? '👑' : actualRank === 2 ? '🥈' : '🥉'}</span>
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
                  <span style={{ textAlign: 'left' }} className="text-[11px] font-bold text-white truncate w-full text-left">
                    {displayName}
                  </span>
                  <span style={{ textAlign: 'left' }} className="text-[10px] font-extrabold text-emerald-400 mt-0.5 block w-full text-left">
                    {podiumUser.xp} XP
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Next Target Rivalry Progress Bar */}
        {myUser && (
          <div style={{ textAlign: 'left' }} className="mb-5 p-3.5 rounded-2xl bg-slate-950 border border-indigo-500/30 text-left">
            <div className="flex items-center justify-between text-xs mb-1.5 text-left">
              <span className="font-bold text-indigo-300 text-left">
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
        <div style={{ textAlign: 'left' }} className="flex flex-col gap-2.5 mb-5 text-left">
          {sortedUsers.map((user, index) => {
            const displayName = resolveUserName(user);
            return (
              <div
                key={user.id}
                style={{ textAlign: 'left' }}
                className={`flex justify-between items-center p-3.5 rounded-2xl transition-all text-left ${
                  user.isCurrentUser
                    ? `border border-indigo-500/60 bg-indigo-950/45 shadow-md ${
                        highlightUserCard ? 'ring-2 ring-emerald-400 bg-emerald-950/30' : ''
                      }`
                    : 'bg-slate-950/70 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 text-left">
                  <span className="font-black text-amber-400 w-5 text-left text-xs shrink-0">#{index + 1}</span>
                  <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-700 bg-slate-900 flex items-center justify-center shrink-0">
                    {user.isCurrentUser && syncedProfilePic ? (
                      <img src={syncedProfilePic} alt={displayName} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs font-bold text-indigo-300">{displayName.charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div style={{ textAlign: 'left' }} className="flex flex-col min-w-0 text-left">
                    <div className="flex items-center gap-1.5 text-left">
                      <span className="font-bold text-xs text-white truncate text-left">{displayName}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-bold shrink-0">
                        ✓ {user.badge}
                      </span>
                    </div>
                    <span style={{ textAlign: 'left' }} className="text-[10px] text-slate-400 text-left">
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
        <div style={{ textAlign: 'left' }} className="mb-5 text-left">
          <span style={{ textAlign: 'left' }} className="text-[11px] font-black text-slate-300 uppercase tracking-wider block mb-2.5 text-left">
            ⚡ How to Earn XP & Climb Faster
          </span>
          <div style={{ textAlign: 'left' }} className="grid grid-cols-1 gap-2 text-left">
            <button
              type="button"
              onClick={earnPoints}
              style={{ textAlign: 'left' }}
              className="w-full p-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-bold text-xs flex items-center justify-between cursor-pointer shadow-lg shadow-indigo-600/25 text-left"
            >
              <span className="flex items-center gap-2 text-left">
                <span>✨</span>
                <span className="text-left">
                  {dailyClaimedToday ? 'Daily Check-in Completed Today' : 'Claim Daily Developer Check-in'}
                </span>
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-white/15 text-[11px] shrink-0">
                {dailyClaimedToday ? 'Done ✓' : '+50 XP'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => router.push('/submit')}
              style={{ textAlign: 'left' }}
              className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 text-slate-200 font-semibold text-xs flex items-center justify-between cursor-pointer transition-all text-left"
            >
              <span className="flex items-center gap-2 text-left">
                <span>🚀</span>
                <span className="text-left">Publish a New Indie Game</span>
              </span>
              <span className="text-emerald-400 font-bold text-[11px] shrink-0">+150 XP →</span>
            </button>

            <button
              type="button"
              onClick={() => router.push('/discover')}
              style={{ textAlign: 'left' }}
              className="w-full p-3 rounded-xl bg-slate-950 hover:bg-slate-800/90 border border-slate-800 text-slate-200 font-semibold text-xs flex items-center justify-between cursor-pointer transition-all text-left"
            >
              <span className="flex items-center gap-2 text-left">
                <span>🧪</span>
                <span className="text-left">Test a Game & Submit Feedback</span>
              </span>
              <span className="text-cyan-400 font-bold text-[11px] shrink-0">+40 XP →</span>
            </button>
          </div>
        </div>

        {/* Verified Ledger & Data Integrity Footer */}
        <div style={{ textAlign: 'left' }} className="p-3.5 rounded-2xl bg-slate-950/90 border border-slate-800 text-left">
          <div className="flex items-center justify-between mb-1 text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 text-left">
              🔒 Verified Progress Ledger
            </span>
            <span className="text-[9px] text-slate-500">Zero Data Loss</span>
          </div>
          <p style={{ textAlign: 'left' }} className="text-[11px] text-slate-400 leading-snug text-left w-full">
            {statusSummaryText}
          </p>
          {auditLogs.length > 0 && (
            <div style={{ textAlign: 'left' }} className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400 text-left">
              <span className="text-left">Last verified: {auditLogs[0].action}</span>
              <span className="text-emerald-400 font-bold shrink-0">
                +{auditLogs[0].xpDelta} XP ({auditLogs[0].timestamp})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Quest Completed Modal with Clear Next Step */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div style={{ textAlign: 'left' }} className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-left relative">
            <div className="text-4xl mb-3 text-left">🎉</div>
            <h3 style={{ textAlign: 'left' }} className="text-lg font-black text-white mb-2 text-left w-full">
              Verified & Saved!
            </h3>
            <p style={{ textAlign: 'left' }} className="text-slate-300 text-xs mb-4 leading-relaxed text-left w-full">
              Your XP ledger has been securely updated and locked in: <span className="text-emerald-400 font-bold">{modalRewardText}</span>. Your rank and target bar are now refreshed.
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleClaimAndContinue}
                className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all text-xs cursor-pointer border border-pink-400/40 text-center"
              >
                Claim & Continue 🚀
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  router.push('/community');
                }}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-300 font-bold rounded-xl transition-all text-xs cursor-pointer border border-slate-700 text-center"
              >
                Explore Community Feed →
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}