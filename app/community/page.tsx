'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { auth } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function CommunityPage() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [mediaFile, setMediaFile] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const currentEmail = user?.email || 'bharatrajupatil5200@gmail.com';
  const currentName = user?.displayName || localStorage.getItem('indiePulse_name') || 'Bharat Patil';

  // Forcefully clear old cached keys and load clean v4 data
  useEffect(() => {
    localStorage.removeItem('indiePulse_community_posts');
    localStorage.removeItem('indiePulse_community_posts_v2');
    localStorage.removeItem('indiePulse_community_posts_v3');

    const savedPosts = localStorage.getItem('indiePulse_community_posts_v4');
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (e) {
        setPosts([]);
      }
    } else {
      const initialPosts = [
        { 
          id: '1', 
          authorName: "Bharat Patil", 
          authorEmail: "bharatrajupatil5200@gmail.com", 
          content: "Working on a new indie platform using Next.js and Tailwind CSS! Excited to share soon. 🚀", 
          media: null,
          mediaType: null,
          likes: 24, 
          comments: 5, 
          time: "Just now" 
        },
        { 
          id: '2', 
          authorName: "Aarav Dev", 
          authorEmail: "aarav@gmail.com", 
          content: "Just released an update for Cyber Neon Runner. Check out the new levels! 🎮✨", 
          media: null,
          mediaType: null,
          likes: 42, 
          comments: 12, 
          time: "2 hours ago" 
        }
      ];
      setPosts(initialPosts);
      localStorage.setItem('indiePulse_community_posts_v4', JSON.stringify(initialPosts));
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaFile(reader.result as string);
        setMediaType(file.type.startsWith('video') ? 'video' : 'image');
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() && !mediaFile) return;

    const newPostObj = {
      id: Date.now().toString(),
      authorName: currentName,
      authorEmail: currentEmail,
      content: newPost,
      media: mediaFile,
      mediaType: mediaType,
      likes: 1,
      comments: 0,
      time: "Just now"
    };

    const updatedPosts = [newPostObj, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('indiePulse_community_posts_v4', JSON.stringify(updatedPosts));

    setNewPost("");
    setMediaFile(null);
    setMediaType(null);
    setIsModalOpen(false);
  };

  const handleLike = (id: string) => {
    const updatedPosts = posts.map((post) => 
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    );
    setPosts(updatedPosts);
    localStorage.setItem('indiePulse_community_posts_v4', JSON.stringify(updatedPosts));
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col px-4 py-6 max-w-xl mx-auto w-full relative overflow-x-hidden select-none">
      
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full flex items-start mb-6 relative z-10">
        <Link 
          href="/" 
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-sm font-bold shadow-[0_0_20px_rgba(236,72,153,0.5)] border border-pink-400/40 transition-all flex items-center justify-center cursor-pointer"
        >
          Back
        </Link>
      </div>

      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl w-full shadow-2xl shadow-purple-950/50 text-center relative z-10 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-3">
          COMMUNITY FEED
        </div>
        <h2 className="text-2xl font-black mb-2 tracking-tight">💬 IndiePulse Community</h2>
        <p className="text-slate-400 text-sm mb-6">Connect with fellow developers, share updates, and discuss ideas!</p>
        
        <div className="mb-6">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all text-sm cursor-pointer border border-pink-400/40 flex items-center justify-center gap-2"
          >
            <span>+</span> Create Post
          </button>
        </div>

        <div className="flex flex-col gap-4 mb-2 text-left max-h-[420px] overflow-y-auto pr-1">
          {posts.map((post) => {
            const isMyPost = post.authorEmail === currentEmail || post.authorName === currentName || post.authorName === 'Bharat Patil';
            const displayAuthor = isMyPost ? "You" : post.authorName;

            return (
              <div 
                key={post.id} 
                className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50 transition-all flex flex-col gap-2.5"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-pink-400 text-sm">{displayAuthor}</span>
                  <span className="text-xs text-slate-400">{post.time}</span>
                </div>

                {post.content && (
                  <p className="text-slate-300 text-sm leading-relaxed">{post.content}</p>
                )}

                {post.media && (
                  <div className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 mt-1">
                    {post.mediaType === 'video' ? (
                      <video src={post.media} controls className="w-full max-h-64 object-cover" />
                    ) : (
                      <img src={post.media} alt="Post attachment" className="w-full max-h-64 object-cover" />
                    )}
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-700/40 mt-1">
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
                className="w-full bg-slate-950 border border-pink-500/30 rounded-2xl p-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-pink-400 resize-none h-28 shadow-inner"
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] text-pink-300 font-semibold flex items-center gap-1.5 cursor-pointer">
                  <span>📷</span> Attach Photo or Video from Gallery:
                </label>
                <input 
                  type="file" 
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-pink-600/20 file:text-pink-300 hover:file:bg-pink-600/30 cursor-pointer border border-pink-500/20 rounded-xl p-1 bg-slate-950"
                />
              </div>

              {mediaFile && (
                <div className="relative w-full h-24 bg-slate-950 rounded-xl overflow-hidden border border-pink-500/30 flex items-center justify-center">
                  {mediaType === 'video' ? (
                    <span className="text-xs text-emerald-400">📹 Video attached successfully</span>
                  ) : (
                    <img src={mediaFile} alt="Preview" className="h-full object-contain" />
                  )}
                  <button 
                    type="button" 
                    onClick={() => { setMediaFile(null); setMediaType(null); }}
                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 text-[10px] flex items-center justify-center font-bold"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div className="flex gap-3 mt-1">
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