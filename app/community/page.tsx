'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CommunityPage() {
  const [posts, setPosts] = useState([
    { author: "Rahul (You)", content: "Working on a new indie platform using Next.js and Tailwind CSS! Excited to share soon. 🚀", likes: 24, comments: 5 },
    { author: "Aarav Dev", content: "Just released an update for Cyber Neon Runner. Check out the new levels! 🎮✨", likes: 42, comments: 12 },
    { author: "Neha_Gamer", content: "Looking for feedback on my new puzzle game mechanics. Anyone interested in testing? 🧩", likes: 18, comments: 7 }
  ]);

  const [newPost, setNewPost] = useState("");

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    setPosts([
      { author: "Rahul (You)", content: newPost, likes: 1, comments: 0 },
      ...posts
    ]);
    setNewPost("");
  };

  const handleLike = (index: number) => {
    setPosts(prevPosts => 
      prevPosts.map((post, i) => 
        i === index ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col px-4 py-6 max-w-xl mx-auto w-full relative overflow-x-hidden select-none">
      
      {/* Background Decorative Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Row with Clear Pink 'Back' Button */}
      <div className="w-full flex items-start mb-6 relative z-10">
        <Link 
          href="/" 
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-sm font-bold shadow-[0_0_20px_rgba(236,72,153,0.5)] border border-pink-400/40 transition-all flex items-center justify-center cursor-pointer"
        >
          Back
        </Link>
      </div>

      {/* Community Container */}
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl w-full shadow-2xl shadow-purple-950/50 text-center relative z-10 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-3">
          COMMUNITY FEED
        </div>
        <h2 className="text-2xl font-black mb-2 tracking-tight">💬 IndiePulse Community</h2>
        <p className="text-slate-400 text-sm mb-6">Connect with fellow developers, share updates, and discuss ideas!</p>
        
        {/* Create Post Form */}
        <form onSubmit={handlePostSubmit} className="mb-6 text-left">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="What's happening in your game dev journey?"
            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 mb-3 resize-none h-20"
          ></textarea>
          <button 
            type="submit"
            className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold rounded-xl shadow-lg shadow-purple-600/30 transition-all text-sm cursor-pointer"
          >
            + Create Post
          </button>
        </form>

        {/* Posts Feed */}
        <div className="flex flex-col gap-3 mb-2 text-left max-h-[320px] overflow-y-auto pr-1">
          {posts.map((post, index) => (
            <div 
              key={index} 
              className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 transition-all"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-slate-200 text-sm">{post.author}</span>
                <span className="text-xs text-slate-400">Just now</span>
              </div>
              <p className="text-slate-300 text-sm mb-3">{post.content}</p>
              <div className="flex items-center gap-4 text-xs text-slate-400">
                <button 
                  onClick={() => handleLike(index)}
                  className="flex items-center gap-1 hover:text-purple-400 transition-colors cursor-pointer"
                >
                  ❤️ {post.likes} likes
                </button>
                <span>💬 {post.comments} comments</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}