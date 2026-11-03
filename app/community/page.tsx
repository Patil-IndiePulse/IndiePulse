'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function CommunityPage() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Load user authentication and name from localStorage
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const currentEmail = user?.email || 'bharatrajupatil5200@gmail.com';
  const currentName = user?.displayName || localStorage.getItem('indiePulse_name') || 'Bharat Patil';

  // Fetch community posts from localStorage on page load
  useEffect(() => {
    const savedPosts = localStorage.getItem('indiePulse_community_posts');
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (e) {
        setPosts([]);
      }
    } else {
      const initialPosts = [
        { id: '1', authorName: "Bharat Patil", authorEmail: "bharatrajupatil5200@gmail.com", content: "Working on a new indie platform using Next.js and Tailwind CSS! Excited to share soon. 🚀", likes: 24, comments: 5, time: "Just now" },
        { id: '2', authorName: "Aarav Dev", authorEmail: "aarav@gmail.com", content: "Just released an update for Cyber Neon Runner. Check out the new levels! 🎮✨", likes: 42, comments: 12, time: "2 hours ago" },
        { id: '3', authorName: "Neha_Gamer", authorEmail: "neha@gmail.com", content: "Looking for feedback on my new puzzle game mechanics. Anyone interested in testing? 🧩", likes: 18, comments: 7, time: "5 hours ago" }
      ];
      setPosts(initialPosts);
      localStorage.setItem('indiePulse_community_posts', JSON.stringify(initialPosts));
    }
  }, []);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim()) return;

    const newPostObj = {
      id: Date.now().toString(),
      authorName: currentName,
      authorEmail: currentEmail,
      content: newPost,
      likes: 1,
      comments: 0,
      time: "Just now"
    };

    const updatedPosts = [newPostObj, ...posts];
    setPosts(updatedPosts);
    // Permanently save to localStorage so it doesn't disappear on refresh or back navigation
    localStorage.setItem('indiePulse_community_posts', JSON.stringify(updatedPosts));

    setNewPost("");
    setIsModalOpen(false);
  };

  const handleLike = (id: string) => {
    const updatedPosts = posts.map((post) => 
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    );
    setPosts(updatedPosts);
    localStorage.setItem('indiePulse_community_posts', JSON.stringify(updatedPosts));
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
        
        {/* Create Post Action Button */}
        <div className="mb-6">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all text-sm cursor-pointer border border-pink-400/40 flex items-center justify-center gap-2"
          >
            <span>+</span> Create Post
          </button>
        </div>

        {/* Posts Feed */}
        <div className="flex flex-col gap-3 mb-2 text-left max-h-[380px] overflow-y-auto pr-1">
          {posts.map((post) => {
            // Show "You" on your own posts, and real author name to other users
            const isMyPost = post.authorEmail === currentEmail || post.authorName === currentName;
            const displayAuthor = isMyPost ? "You" : post.authorName;

            return (
              <div 
                key={post.id} 
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 transition-all"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-pink-400 text-sm">{displayAuthor}</span>
                  <span className="text-xs text-slate-400">{post.time}</span>
                </div>
                <p className="text-slate-300 text-sm mb-3">{post.content}</p>
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-1 hover:text-pink-400 transition-colors cursor-pointer"
                  >
                    ❤️ {post.likes} likes
                  </button>
                  <span>💬 {post.comments} comments</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Post Popup Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-pink-500/40 rounded-3xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 whitespace-nowrap">
                <span>✨</span> Create New Post
              </h3>
            </div>

            <form onSubmit={handlePostSubmit} className="flex flex-col gap-4">
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's happening in your game dev journey?"
                className="w-full bg-slate-950 border border-pink-500/30 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-400 resize-none h-32 shadow-inner"
                required
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all text-xs cursor-pointer border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all text-xs cursor-pointer border border-pink-400/40"
                >
                  Post Now 🚀
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </main>
  );
}