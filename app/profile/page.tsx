'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const [profilePic, setProfilePic] = useState<string | null>(null);
  
  // New States for Profile Features (Name, Bio, Genres)
  const [name, setName] = useState('Indie Creator');
  const [bio, setBio] = useState('Passionate indie game developer building immersive worlds.');
  const [selectedGenres, setSelectedGenres] = useState<string[]>(['Action', 'RPG']);
  const [isEditing, setIsEditing] = useState(false);

  const availableGenres = ['Action', 'RPG', 'Puzzle', 'Strategy', 'Sci-Fi', 'Adventure', 'Horror'];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setProfilePic(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation Buttons: Home & Settings (Replaced positions, pink color theme, and icons) */}
        <div className="flex items-center gap-3 mb-6">
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

        <h1 className="text-3xl font-bold mb-4">Creator Profile</h1>
        <p className="text-slate-400 mb-8">Manage your submitted indie games and community activity.</p>
        
        {/* Profile Picture & Details Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
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
                  <h2 className="text-2xl font-semibold mb-1">{name}</h2>
                )}
                <p className="text-xs text-slate-400 mb-3">Upload a picture and personalize your profile.</p>
                
                <label className="cursor-pointer px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors inline-block">
                  Upload Picture
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
            </div>

            {/* Edit / Save Profile Toggle Button */}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {isEditing ? 'Save Profile' : 'Edit Profile'}
            </button>
          </div>

          {/* Bio Section */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">About Me / Bio</h3>
            {isEditing ? (
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full bg-slate-800 border border-indigo-500 rounded-lg p-3 text-white text-sm focus:outline-none"
                placeholder="Write a short bio about yourself..."
              />
            ) : (
              <p className="text-slate-300 text-sm leading-relaxed">{bio}</p>
            )}
          </div>

          {/* Favorite Game Genres Section */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Favorite Game Genres</h3>
            {isEditing ? (
              <div className="flex flex-wrap gap-2">
                {availableGenres.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => toggleGenre(genre)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
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
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">User Stats</h2>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="bg-slate-800 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-indigo-400">0</p>
              <p className="text-xs text-slate-400 mt-1">Games Published</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-indigo-400">0</p>
              <p className="text-xs text-slate-400 mt-1">Badges Earned</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-indigo-400">0</p>
              <p className="text-xs text-slate-400 mt-1">Total Likes</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}