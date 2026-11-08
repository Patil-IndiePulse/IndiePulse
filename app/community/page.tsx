'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth } from "@/app/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function CommunityPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState("");
  const [mediaFile, setMediaFile] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentName, setCurrentName] = useState('Bharat Patil');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Full-screen Viewer States
  const [selectedMediaPost, setSelectedMediaPost] = useState<any>(null);
  const [commentText, setCommentText] = useState("");
  const [commentMediaFiles, setCommentMediaFiles] = useState<string[]>([]);
  const [postComments, setPostComments] = useState<{[key: string]: Array<{id: string, author: string, text: string, media?: string[], time: string}>}>({});
  const [showCommentSheet, setShowCommentSheet] = useState(false);
  const [userLikedPosts, setUserLikedPosts] = useState<{[key: string]: boolean}>({});
  const [showRepostToast, setShowRepostToast] = useState(false);

  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const commentFileInputRef = useRef<HTMLInputElement>(null);

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
            reposts: 3,
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
            reposts: 7,
            time: "2 hours ago" 
          }
        ];
        setPosts(initialPosts);
        localStorage.setItem('indiePulse_community_posts_v32', JSON.stringify(initialPosts));
      }

      const savedComments = localStorage.getItem('indiePulse_comments_v1');
      if (savedComments) {
        try {
          setPostComments(JSON.parse(savedComments));
        } catch (e) {
          setPostComments({});
        }
      }

      const savedLikes = localStorage.getItem('indiePulse_user_likes_v1');
      if (savedLikes) {
        try {
          setUserLikedPosts(JSON.parse(savedLikes));
        } catch (e) {
          setUserLikedPosts({});
        }
      }
    }

    return () => unsubscribe();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    if (typeof window !== 'undefined') {
      window.history.pushState({ modalOpen: true }, '');
    }
  };

  const openMediaViewer = (post: any) => {
    setSelectedMediaPost(post);
    if (typeof window !== 'undefined') {
      window.history.pushState({ mediaViewerOpen: true }, '');
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      if (showCommentSheet) {
        setShowCommentSheet(false);
      } else if (isModalOpen) {
        setIsModalOpen(false);
      } else if (selectedMediaPost) {
        setSelectedMediaPost(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isModalOpen, selectedMediaPost, showCommentSheet]);

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

  const handleCommentMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles: string[] = [];
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          if (reader.result) {
            newFiles.push(reader.result as string);
            if (newFiles.length === files.length) {
              setCommentMediaFiles((prev) => [...prev, ...newFiles]);
            }
          }
        };
        reader.readAsDataURL(file);
      });
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
    
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push('/');
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
      reposts: 0,
      time: "Just now"
    };

    const updatedPosts = [newPostObj, ...posts];
    setPosts(updatedPosts);
    if (typeof window !== 'undefined') {
      localStorage.setItem('indiePulse_community_posts_v32', JSON.stringify(updatedPosts));
    }

    setTimeout(() => {
      setIsModalOpen(false);
      setNewPost("");
      setMediaFile(null);
      setMediaType(null);
      setIsSubmitting(false);

      if (window.history.length > 2) {
        router.back();
      } else {
        router.push('/');
      }
    }, 800);
  };

  // Instagram Style Single-Like Logic (Toggle Like/Unlike)
  const handleLike = (id: string, e?: any) => {
    if (e) e.stopPropagation();
    
    const isCurrentlyLiked = !!userLikedPosts[id];
    const newLikedState = !isCurrentlyLiked;
    
    const updatedLikedMap = { ...userLikedPosts, [id]: newLikedState };
    setUserLikedPosts(updatedLikedMap);

    const updatedPosts = posts.map((post) => {
      if (post.id === id) {
        const newLikesCount = newLikedState ? post.likes + 1 : Math.max(0, post.likes - 1);
        return { ...post, likes: newLikesCount };
      }
      return post;
    });

    setPosts(updatedPosts);

    if (selectedMediaPost && selectedMediaPost.id === id) {
      const newLikesCount = newLikedState ? selectedMediaPost.likes + 1 : Math.max(0, selectedMediaPost.likes - 1);
      setSelectedMediaPost({ ...selectedMediaPost, likes: newLikesCount });
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('indiePulse_community_posts_v32', JSON.stringify(updatedPosts));
      localStorage.setItem('indiePulse_user_likes_v1', JSON.stringify(updatedLikedMap));
    }
  };

  const handleRepost = (id: string, e?: any) => {
    if (e) e.stopPropagation();
    const updatedPosts = posts.map((post) => 
      post.id === id ? { ...post, reposts: (post.reposts || 0) + 1 } : post
    );
    setPosts(updatedPosts);
    if (selectedMediaPost && selectedMediaPost.id === id) {
      setSelectedMediaPost({ ...selectedMediaPost, reposts: (selectedMediaPost.reposts || 0) + 1 });
    }
    
    setShowRepostToast(true);
    setTimeout(() => setShowRepostToast(false), 3000);

    if (typeof window !== 'undefined') {
      localStorage.setItem('indiePulse_community_posts_v32', JSON.stringify(updatedPosts));
    }
  };

  const handleShare = (post: any, e?: any) => {
    if (e) e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: 'IndiePulse Post',
        text: post.content || 'Check out this post on IndiePulse!',
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleAddComment = (postId: string) => {
    if (!commentText.trim() && commentMediaFiles.length === 0) return;

    const newCommentObj = {
      id: Date.now().toString(),
      author: currentName,
      text: commentText.trim(),
      media: commentMediaFiles,
      time: "Just now"
    };

    const updatedComments = {
      ...postComments,
      [postId]: [newCommentObj, ...(postComments[postId] || [])]
    };

    setPostComments(updatedComments);
    setCommentText("");
    setCommentMediaFiles([]);

    const updatedPosts = posts.map((post) =>
      post.id === postId ? { ...post, comments: post.comments + 1 } : post
    );
    setPosts(updatedPosts);

    if (selectedMediaPost && selectedMediaPost.id === postId) {
      setSelectedMediaPost({ ...selectedMediaPost, comments: selectedMediaPost.comments + 1 });
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('indiePulse_comments_v1', JSON.stringify(updatedComments));
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
            const isLiked = !!userLikedPosts[post.id];

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
                  <div 
                    onClick={() => openMediaViewer(post)}
                    className="rounded-xl overflow-hidden border border-slate-700 bg-slate-950 mt-1 cursor-pointer relative group"
                  >
                    {post.mediaType === 'video' ? (
                      <video src={post.media} className="w-full max-h-64 object-cover pointer-events-none" />
                    ) : (
                      <img src={post.media} alt="Post attachment" className="w-full max-h-64 object-cover transition-transform group-hover:scale-105" />
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-xs font-semibold text-white">
                      🔍 Tap to View Full Screen
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 border-t border-slate-700/40 mt-1">
                  <button 
                    onClick={(e) => handleLike(post.id, e)}
                    className={`flex items-center gap-1 transition-colors cursor-pointer ${isLiked ? 'text-red-500 font-bold' : 'hover:text-pink-400'}`}
                  >
                    {isLiked ? '❤️' : '🤍'} {post.likes}
                  </button>
                  <button 
                    onClick={() => openMediaViewer(post)}
                    className="flex items-center gap-1 hover:text-pink-400 transition-colors cursor-pointer"
                  >
                    💬 {post.comments}
                  </button>
                  <button 
                    onClick={(e) => handleRepost(post.id, e)}
                    className="flex items-center gap-1 hover:text-pink-400 transition-colors cursor-pointer"
                  >
                    🔁 {post.reposts || 0}
                  </button>
                  <button 
                    onClick={(e) => handleShare(post, e)}
                    className="flex items-center gap-1 hover:text-pink-400 transition-colors cursor-pointer"
                  >
                    ↗️ Share
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 100% Fullscreen Gaming Clips Media Viewer */}
      {selectedMediaPost && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col justify-between overflow-hidden select-none">
          
          {/* Background Media */}
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black">
            {selectedMediaPost.mediaType === 'video' ? (
              <video 
                src={selectedMediaPost.media} 
                controls
                autoPlay 
                loop
                playsInline 
                className="w-full h-full object-cover" 
              />
            ) : (
              <img 
                src={selectedMediaPost.media} 
                alt="Full screen media" 
                className="w-full h-full object-contain" 
              />
            )}
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/80 pointer-events-none"></div>

          {/* Top Gaming Platform Header */}
          <div className="relative z-10 p-4 flex items-center justify-between text-white drop-shadow-md">
            <span className="text-xs font-black tracking-widest text-pink-400 flex items-center gap-1.5">
              <span>🎮</span> INDIEPULSE CLIPS
            </span>
          </div>

          {/* Bottom Left Caption + Right Action Buttons */}
          <div className="relative z-10 p-4 pb-8 flex items-end justify-between w-full">
            
            {/* Bottom Caption */}
            <div className="flex flex-col gap-2 max-w-[75%] text-left">
              {selectedMediaPost.content && (
                <p className="text-xs text-slate-100 line-clamp-3 leading-relaxed drop-shadow-sm font-medium">
                  {selectedMediaPost.content}
                </p>
              )}
            </div>

            {/* Right Side Action Buttons */}
            <div className="flex flex-col items-center gap-5 pb-2">
              
              {/* Single Like Toggle */}
              <button 
                onClick={(e) => handleLike(selectedMediaPost.id, e)}
                className="flex flex-col items-center gap-1 text-white active:scale-125 transition-all cursor-pointer drop-shadow-lg"
              >
                <div className={`p-3 rounded-full border transition-all ${userLikedPosts[selectedMediaPost.id] ? 'bg-red-600/80 border-red-400' : 'bg-black/40 border-white/20'}`}>
                  <span className="text-2xl">{userLikedPosts[selectedMediaPost.id] ? '❤️' : '🤍'}</span>
                </div>
                <span className="text-xs font-bold drop-shadow">{selectedMediaPost.likes}</span>
              </button>

              {/* Comment Button */}
              <button 
                onClick={() => {
                  setShowCommentSheet(true);
                  setTimeout(() => commentInputRef.current?.focus(), 200);
                }}
                className="flex flex-col items-center gap-1 text-white hover:text-blue-400 active:scale-125 transition-all cursor-pointer drop-shadow-lg"
              >
                <div className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/20">
                  <span className="text-2xl">💬</span>
                </div>
                <span className="text-xs font-bold drop-shadow">{selectedMediaPost.comments}</span>
              </button>

              {/* Repost Button */}
              <button 
                onClick={(e) => handleRepost(selectedMediaPost.id, e)}
                className="flex flex-col items-center gap-1 text-white hover:text-green-400 active:scale-125 transition-all cursor-pointer drop-shadow-lg"
              >
                <div className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/20">
                  <span className="text-2xl">🔁</span>
                </div>
                <span className="text-xs font-bold drop-shadow">{selectedMediaPost.reposts || 0}</span>
              </button>

              {/* Share Button */}
              <button 
                onClick={(e) => handleShare(selectedMediaPost, e)}
                className="flex flex-col items-center gap-1 text-white hover:text-purple-400 active:scale-125 transition-all cursor-pointer drop-shadow-lg"
              >
                <div className="p-3 bg-black/40 backdrop-blur-md rounded-full border border-white/20">
                  <span className="text-2xl">↗️</span>
                </div>
                <span className="text-xs font-bold drop-shadow">Share</span>
              </button>

            </div>

          </div>

          {/* Instagram Repost Toast Popup */}
          {showRepostToast && (
            <div className="absolute bottom-6 left-4 right-4 z-50 bg-slate-900/95 border border-slate-700 text-white p-3.5 rounded-2xl flex items-center justify-between shadow-2xl backdrop-blur-md animate-bounce">
              <div className="flex items-center gap-2 text-xs font-semibold">
                <span>🔁</span> Reposted to your feed
              </div>
              <button 
                onClick={() => setShowRepostToast(false)}
                className="text-xs font-bold text-slate-400 hover:text-white"
              >
                Undo
              </button>
            </div>
          )}

          {/* Real Instagram Style Comment Bottom Sheet */}
          {showCommentSheet && (
            <div className="absolute inset-x-0 bottom-0 z-50 bg-slate-900/98 backdrop-blur-2xl border-t border-slate-700 rounded-t-3xl p-4 flex flex-col max-h-[70vh] transition-all shadow-2xl">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2"></div>
                <h4 className="text-xs font-bold text-slate-300 mt-2">Comments ({selectedMediaPost.comments})</h4>
                <button 
                  onClick={() => setShowCommentSheet(false)}
                  className="text-slate-400 hover:text-white text-xs font-bold px-2 py-1"
                >
                  Close
                </button>
              </div>

              {/* Comments List */}
              <div className="flex flex-col gap-3 my-3 overflow-y-auto max-h-56 pr-1 text-left">
                {(postComments[selectedMediaPost.id] || []).length === 0 ? (
                  <p className="text-slate-500 text-xs text-center py-6">No comments yet. Be the first to comment!</p>
                ) : (
                  (postComments[selectedMediaPost.id] || []).map((c) => (
                    <div key={c.id} className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/40 flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-pink-400 text-xs">{c.author}</span>
                        <span className="text-[10px] text-slate-400">{c.time}</span>
                      </div>
                      {c.text && <p className="text-slate-200 text-xs leading-relaxed">{c.text}</p>}
                      {c.media && c.media.length > 0 && (
                        <div className="flex gap-2 flex-wrap mt-1">
                          {c.media.map((img, idx) => (
                            <img key={idx} src={img} alt="Comment media" className="w-16 h-16 object-cover rounded-lg border border-slate-700" />
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Media Preview in Comment Box */}
              {commentMediaFiles.length > 0 && (
                <div className="flex gap-2 mb-2 overflow-x-auto p-1 bg-slate-950 rounded-xl border border-slate-800">
                  {commentMediaFiles.map((src, i) => (
                    <div key={i} className="relative w-12 h-12 flex-shrink-0">
                      <img src={src} className="w-full h-full object-cover rounded-lg" />
                      <button 
                        onClick={() => setCommentMediaFiles(commentMediaFiles.filter((_, index) => index !== i))}
                        className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center font-bold"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Real Instagram Comment Input Bar */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800 relative">
                
                <input 
                  type="file" 
                  ref={commentFileInputRef} 
                  onChange={handleCommentMediaChange} 
                  multiple 
                  accept="image/*" 
                  className="hidden" 
                />

                <div className="relative flex-1 flex items-center">
                  <input 
                    ref={commentInputRef}
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-full pl-4 pr-10 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddComment(selectedMediaPost.id);
                      }
                    }}
                  />

                  {/* Dynamic Right Button inside Input Box (Gallery Icon or Blue Send Arrow) */}
                  {!commentText.trim() && commentMediaFiles.length === 0 ? (
                    <button 
                      type="button"
                      onClick={() => commentFileInputRef.current?.click()}
                      className="absolute right-3 text-slate-400 hover:text-white transition-colors cursor-pointer text-base"
                    >
                      🖼️
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleAddComment(selectedMediaPost.id)}
                      className="absolute right-2.5 w-7 h-7 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center font-black text-sm shadow-md transition-all cursor-pointer"
                    >
                      ↑
                    </button>
                  )}
                </div>

              </div>

            </div>
          )}

        </div>
      )}

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