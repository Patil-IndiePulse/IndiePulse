'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface ActivityItem {
  id: string;
  action: string;
  xpDelta: number;
  timestamp: string;
}

export default function ProfilePage() {
  const [profilePic, setProfilePic] = useState<string | null>(null);

  // New States for Profile Features (Name, Bio, Genres)
  const [name, setName] = useState('Indie Creator');
  const [bio, setBio] = useState('Passionate indie game developer building immersive worlds.');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Action', 'RPG']);
  const [isEditing, setIsEditing] = useState(false);

  // Live Stats & Progression States
  const [gamesPublishedCount, setGamesPublishedCount] = useState<number>(0);
  const [badgesEarnedCount, setBadgesEarnedCount] = useState<number>(0);
  const [totalLikesCount, setTotalLikesCount] = useState<number>(0);
  const [totalXp, setTotalXp] = useState<number>(1250);
  const [streakDays, setStreakDays] = useState<number>(1);
  const [recentLogs, setRecentLogs] = useState<ActivityItem[]>([]);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  const availableGenres = ['Action', 'RPG', 'Puzzle', 'Strategy', 'Sci-Fi', 'Adventure', 'Horror'];

  const syncLiveStatsAndXp = useCallback(() => {
    try {
      let shippedGames = 0;
      let gameLikes = 0;
      const rawGames = localStorage.getItem('indiePulse_submitted_games');
      if (rawGames) {
        const parsedGames = JSON.parse(rawGames);
        if (Array.isArray(parsedGames)) {
          shippedGames = parsedGames.length;
          parsedGames.forEach((g: any) => {
            gameLikes += Number(g?.likes) || 0;
          });
        }
      }
      setGamesPublishedCount(shippedGames);
      setTotalLikesCount(gameLikes);

      let feedbackCount = 0;
      const rawFeedbacks = localStorage.getItem('indiePulse_playtest_feedbacks');
      if (rawFeedbacks) {
        const parsedFb = JSON.parse(rawFeedbacks);
        if (parsedFb && typeof parsedFb === 'object') {
          Object.values(parsedFb).forEach((arr: any) => {
            if (Array.isArray(arr)) feedbackCount += arr.length;
          });
        }
      }

      let bonusXp = 50;
      let logsList: ActivityItem[] = [];
      const rawLedger = localStorage.getItem('indiePulse_leaderboard_ledger_v1');
      if (rawLedger) {
        const parsedLedger = JSON.parse(rawLedger);
        if (typeof parsedLedger?.bonusXp === 'number' && !Number.isNaN(parsedLedger.bonusXp)) {
          bonusXp = parsedLedger.bonusXp;
        }
        if (Array.isArray(parsedLedger?.logs)) {
          logsList = parsedLedger.logs.slice(0, 5);
        }
      }
      setRecentLogs(logsList);

      const computedXp = 1200 + shippedGames * 150 + feedbackCount * 40 + bonusXp;
      setTotalXp(computedXp);

      const savedStreak = Number(localStorage.getItem('indiePulse_quest_streak_v1') || '1');
      const activeStreak = !Number.isNaN(savedStreak) && savedStreak > 0 ? savedStreak : 1;
      setStreakDays(activeStreak);

      let unlocked = 0;
      if (shippedGames >= 1) unlocked += 1;
      if (logsList.length >= 1) unlocked += 1;
      if (activeStreak >= 2 || logsList.length >= 2) unlocked += 1;
      if (computedXp >= 1300) unlocked += 1;
      setBadgesEarnedCount(unlocked);
    } catch (err) {
      console.error('Safe live stats sync notice:', err);
    }
  }, []);

  // Load saved profile data from localStorage when page opens
  useEffect(() => {
    const savedName = localStorage.getItem('indiePulse_name') || localStorage.getItem('indiePulse_community_name');
    const savedBio = localStorage.getItem('indiePulse_bio');
    const savedPic = localStorage.getItem('indiePulse_pic') || localStorage.getItem('indiePulse_user_avatar');
    const savedGenres = localStorage.getItem('indiePulse_genres');

    if (savedName) setName(savedName);
    if (savedBio) setBio(savedBio);
    if (savedPic) setProfilePic(savedPic);
    if (savedGenres) {
      try {
        setSelectedGenres(JSON.parse(savedGenres));
      } catch {
        // keep default genres safely
      }
    }

    syncLiveStatsAndXp();
    window.addEventListener('storage', syncLiveStatsAndXp);
    window.addEventListener('focus', syncLiveStatsAndXp);
    return () => {
      window.removeEventListener('storage', syncLiveStatsAndXp);
      window.removeEventListener('focus', syncLiveStatsAndXp);
    };
  }, [syncLiveStatsAndXp]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const img = new Image();
        img.src = uploadEvent.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 300; // Perfect dimension for avatar storage
          const scaleFactor = MAX_WIDTH / img.width;

          canvas.width = MAX_WIDTH;
          canvas.height = img.height > MAX_WIDTH ? img.height * scaleFactor : img.height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Compress image to JPEG format with 0.5 quality to avoid localStorage quota limits
          const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5);

          setProfilePic(compressedBase64);
          try {
            localStorage.setItem('indiePulse_pic', compressedBase64);
            localStorage.setItem('indiePulse_user_avatar', compressedBase64);
            window.dispatchEvent(new Event('storage'));
          } catch (err) {
            alert('Storage limit reached! Please use a slightly smaller image.');
          }
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleGenre = (genre: string) => {
    let updatedGenres;
    if (selectedGenres.includes(genre)) {
      updatedGenres = selectedGenres.filter((g) => g !== genre);
    } else {
      updatedGenres = [...selectedGenres, genre];
    }
    setSelectedGenres(updatedGenres);
    localStorage.setItem('indiePulse_genres', JSON.stringify(updatedGenres));
  };

  const handleSaveProfile = () => {
    if (isEditing) {
      // Save all data to localStorage across ALL synchronized keys
      localStorage.setItem('indiePulse_name', name);
      localStorage.setItem('indiePulse_bio', bio);
      if (profilePic) {
        localStorage.setItem('indiePulse_pic', profilePic);
        localStorage.setItem('indiePulse_user_avatar', profilePic);
      }
      localStorage.setItem('indiePulse_genres', JSON.stringify(selectedGenres));
      window.dispatchEvent(new Event('storage'));
    }
    setIsEditing(!isEditing);
  };

  const handleCopyCreatorTag = () => {
    const levelNum = Math.floor(totalXp / 250) + 1;
    const text = `${name} • Level ${levelNum} Indie Creator (${totalXp} XP) on IndiePulse`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const currentLevel = Math.floor(totalXp / 250) + 1;
  const levelProgressPercent = Math.min(100, Math.round(((totalXp % 250) / 250) * 100));

  const badgesList = [
    { id: 'shipped', label: 'First Build Shipped', unlocked: gamesPublishedCount >= 1, note: 'Publish 1+ game' },
    { id: 'quest', label: 'Mission Achiever', unlocked: recentLogs.length >= 1, note: 'Complete a quest/reward' },
    { id: 'streak', label: 'Streak Champion', unlocked: streakDays >= 2 || recentLogs.length >= 2, note: 'Build active streak' },
    { id: 'xp', label: 'Arena Rising Star', unlocked: totalXp >= 1300, note: 'Reach 1300+ XP' },
  ];

  return (
    <div style={{ textAlign: 'left' }} className="min-h-screen bg-slate-950 text-white p-6 sm:p-8 text-left">
      <div className="max-w-4xl mx-auto">

        {/* Navigation Buttons: Home & Settings (Replaced positions, pink color theme, and icons) */}
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 border border-purple-500/50 flex items-center gap-2 text-white text-sm font-semibold shadow-lg shadow-purple-500/30 transition-all"
            >
              <span>🏡</span> Home
            </Link>

            <Link
              href="/menu"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 border border-purple-500/50 flex items-center gap-2 text-white text-sm font-semibold shadow-lg shadow-purple-500/30 transition-all"
            >
              <span>⚙️</span> Settings
            </Link>
          </div>

          <button
            type="button"
            onClick={handleCopyCreatorTag}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 cursor-pointer transition-colors"
          >
            {copiedSummary ? 'Tag Copied ✓' : 'Copy Creator Tag'}
          </button>
        </div>

        <h1 style={{ textAlign: 'left' }} className="text-3xl font-bold mb-4 text-left">Creator Profile</h1>
        <p style={{ textAlign: 'left' }} className="text-slate-400 mb-8 text-left">Manage your submitted indie games and community activity.</p>

        {/* Profile Picture & Details Section */}
        <div style={{ textAlign: 'left' }} className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6 text-left">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

            {/* Profile Picture & Name/Bio Edit Area */}
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
                {profilePic ? (
                  <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-slate-400 text-sm">No Image</span>
                )}
              </div>

              <div>
                {isEditing ? (
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-slate-800 border border-indigo-500 rounded px-3 py-1 text-xl font-semibold text-white focus:outline-none mb-2"
                  />
                ) : (
                  <h2 style={{ textAlign: 'left' }} className="text-2xl font-semibold mb-1 text-left">{name}</h2>
                )}
                <p style={{ textAlign: 'left' }} className="text-xs text-slate-400 mb-3 text-left">Upload a picture and personalize your profile.</p>

                <label className="cursor-pointer px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors inline-block">
                  Upload Picture
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>

            {/* Edit / Save Profile Toggle Button */}
            <button
              type="button"
              onClick={handleSaveProfile}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              {isEditing ? 'Save Profile' : 'Edit Profile'}
            </button>
          </div>

          {/* Live Level & XP Meter */}
          <div style={{ textAlign: 'left' }} className="mt-6 pt-5 border-t border-slate-800 text-left">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-amber-300">
                ⚡ Level {currentLevel} Builder • 🔥 {streakDays}d Streak
              </span>
              <span className="font-bold text-emerald-400">
                {totalXp} XP ({levelProgressPercent}% to Next Level)
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${levelProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Bio Section */}
          <div style={{ textAlign: 'left' }} className="mt-6 pt-6 border-t border-slate-800 text-left">
            <h3 style={{ textAlign: 'left' }} className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2 text-left">About Me / Bio</h3>
            {isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-slate-800 border border-indigo-500 rounded-lg p-3 text-white text-sm focus:outline-none"
                placeholder="Write a short bio about yourself..."
              />
            ) : (
              <p style={{ textAlign: 'left' }} className="text-slate-300 text-sm leading-relaxed text-left">{bio}</p>
            )}
          </div>

          {/* Favorite Game Genres Section */}
          <div style={{ textAlign: 'left' }} className="mt-6 pt-6 border-t border-slate-800 text-left">
            <h3 style={{ textAlign: 'left' }} className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 text-left">Favorite Game Genres</h3>
            {isEditing ? (
              <div className="flex flex-wrap gap-2">
                {availableGenres.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                      selectedGenres.includes(genre)
                        ? 'bg-indigo-600 text-white border border-indigo-400'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                    }`}
                  >
                    {genre} {selectedGenres.includes(genre) ? '✓' : '+'}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedGenres.length > 0 ? (
                  selectedGenres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-indigo-950 border border-indigo-800 text-indigo-300 rounded-full text-xs font-medium"
                    >
                      {genre}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 italic text-xs">No genres selected yet.</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* User Stats Section */}
        <div style={{ textAlign: 'left' }} className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6 text-left">
          <h2 style={{ textAlign: 'left' }} className="text-xl font-semibold mb-2 text-left">User Stats</h2>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-slate-800 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-indigo-400">{gamesPublishedCount}</p>
              <p className="text-xs text-slate-400 mt-1">Games Published</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-indigo-400">{badgesEarnedCount}</p>
              <p className="text-xs text-slate-400 mt-1">Badges Earned</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-indigo-400">{totalLikesCount}</p>
              <p className="text-xs text-slate-400 mt-1">Total Likes</p>
            </div>
          </div>
        </div>

        {/* Builder Badges Showcase */}
        <div style={{ textAlign: 'left' }} className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6 text-left">
          <h2 style={{ textAlign: 'left' }} className="text-xl font-semibold mb-4 text-left">🏅 Builder Badges & Achievements</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {badgesList.map((badge) => (
              <div
                key={badge.id}
                style={{ textAlign: 'left' }}
                className={`p-3.5 rounded-xl border text-left ${
                  badge.unlocked
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-white'
                    : 'bg-slate-800/60 border-slate-700/60 text-slate-400'
                }`}
              >
                <p style={{ textAlign: 'left' }} className="text-sm font-bold text-left">
                  {badge.unlocked ? '✓ ' : '🔒 '}
                  {badge.label}
                </p>
                <p style={{ textAlign: 'left' }} className="text-xs text-slate-400 mt-0.5 text-left">{badge.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity & Quick Actions */}
        <div style={{ textAlign: 'left' }} className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-left">
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ textAlign: 'left' }} className="text-xl font-semibold text-left">⚡ Recent XP Activity</h2>
            <div className="flex items-center gap-2">
              <Link
                href="/quests"
                className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold hover:bg-amber-500/30 transition-colors"
              >
                Quests
              </Link>
              <Link
                href="/leaderboard"
                className="px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-bold hover:bg-indigo-500/30 transition-colors"
              >
                Leaderboard
              </Link>
            </div>
          </div>

          {recentLogs.length > 0 ? (
            <div className="flex flex-col gap-2.5">
              {recentLogs.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-slate-800/70 border border-slate-700/60 text-xs"
                >
                  <div className="text-left pr-2">
                    <span className="font-semibold text-slate-200 block">{entry.action}</span>
                    <span className="text-[11px] text-slate-400 block">{entry.timestamp}</span>
                  </div>
                  <span className="font-bold text-emerald-400 shrink-0">+{entry.xpDelta} XP</span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'left' }} className="text-xs text-slate-400 text-left">
              Complete quests or publish games to track your XP history here.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}