'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function CommunityPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [mediaFile, setMediaFile] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentName, setCurrentName] = useState('Bharat Patil');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser?.displayName) {
        setCurrentName(currentUser.displayName);
      }
    });

    if (typeof window !== 'undefined') {
      const savedCustomName = localStorage.getItem('indiePulse_name');
      if (savedCustomName) {
        setCurrentName(savedCustomName);
      }

      const savedPosts = localStorage.getItem('indiePulse_community_posts_v32');
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
        localStorage.setItem('indiePulse_community_posts_v32', JSON.stringify(initialPosts));
      }
    }

    return () => unsubscribe();
  }, []);

  // मोठ्या कंपन्यांची पद्धत: window.location द्वारे safe query checking with ?modal=true
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('modal') === 'true') {
        setIsModalOpen(true);
      } else {
        setIsModalOpen(false);
      }
    }
  }, [searchParams]);

  const openModal = () => {
    setIsModalOpen(true);
    if (typeof window !== 'undefined') {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('modal', 'true');
      router.push(currentUrl.pathname + currentUrl.search);
    }
  };

  // Handle Android Back button and history popstate perfectly
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);
        if (params.get('modal') !== 'true') {
          setIsModalOpen(false);
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const currentEmail = user?.email || 'bharatrajupatil5200@gmail.com';

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

  const handleCancel = (e: any) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsModalOpen(false);
    setNewPost("");
    setMediaFile(null);
    setMediaType(null);
    setIsSubmitting(false);
    
    if (typeof window !== 'undefined') {
      if (window.history.length > 2) {
        router.back();
      } else {
        router.push('/');
      }
    }
  };

  const executePostSubmission = (e: any) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!newPost.trim() && !mediaFile) return;
    if (isSubmitting) return;

    setIsSubmitting(true);

    // Force DOM styling instantly for mobile browsers
    if (submitBtnRef.current) {
      submitBtnRef.current.style.backgroundColor = '#059669';
      submitBtnRef.current.style.borderColor = '#34d399';
      submitBtnRef.current.style.boxShadow = '0 0 25px rgba(16, 185, 129, 0.9)';
      submitBtnRef.current.innerText = '✓ Success';
    }

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
    if (typeof window !== 'undefined') {
      localStorage.setItem('indiePulse_community_posts_v32', JSON.stringify(updatedPosts));
    }

    // Success message दाखवल्यानंतर ?modal=true काढून टाकून थेट आधीच्या पेजवर जाण्याची Big Tech पद्धत
    setTimeout(() => {
      setIsModalOpen(false);
      setNewPost("");
      setMediaFile(null);
      setMediaType(null);
      setIsSubmitting(false);

      if (typeof window !== 'undefined') {
        if (window.history.length > 2) {
          router.back();
        } else {
          router.push('/');
        }
      }
    }, 800);
  };

  const handleLike = (id: string) => {
    const updatedPosts = posts.map((post) => 
      post.id === id ? { ...post, likes: post.likes + 1 } : post
    );
    setPosts(updatedPosts);
    if (typeof window !== 'undefined') {
      localStorage.setItem('indiePulse_community_posts_v32', JSON.stringify(updatedPosts));
    }
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
            onClick={openModal}
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
          <div className="bg-slate-900 border border-pink-500/40 rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
            
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2 whitespace-nowrap">
                <span>✨</span> Create New Post
              </h3>
            </div>

            <div className="flex flex-col gap-4">
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
                <div style={{ position: 'relative', width: '100%', height: '140px', backgroundColor: '#020617', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(236, 72, 153, 0.3)' }}>
                  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {mediaType === 'video' ? (
                      <span style={{ fontSize: '12px', color: '#34d399' }}>📹 Video attached successfully</span>
                    ) : (
                      <img src={mediaFile} alt="Preview" style={{ height: '100%', objectFit: 'contain' }} />
                    )}
                  </div>
                  
                  <div style={{ position: 'absolute', top: '8px', right: '8px', zIndex: 99999, width: '28px', height: '28px' }}>
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); setMediaFile(null); setMediaType(null); }}
                      style={{
                        width: '28px',
                        height: '28px',
                        backgroundColor: '#db2777',
                        color: '#ffffff',
                        borderRadius: '50%',
                        border: '2px solid #f472b6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        outline: 'none',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.6)'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={handleCancel}
                  onTouchEnd={handleCancel}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all text-xs cursor-pointer border border-slate-700"
                >
                  Cancel
                </button>
                <button
                  ref={submitBtnRef}
                  type="button"
                  onClick={executePostSubmission}
                  onTouchEnd={executePostSubmission}
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    padding: '12px',
                    fontWeight: 'bold',
                    borderRadius: '12px',
                    fontSize: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    backgroundColor: '#db2777',
                    color: '#ffffff',
                    border: '1px solid rgba(244, 114, 182, 0.4)',
                    boxShadow: '0 0 15px rgba(236, 72, 153, 0.5)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Post Now 🚀
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}