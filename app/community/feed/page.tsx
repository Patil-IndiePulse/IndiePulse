'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LiveFeedPage() {
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  
  // Chat state
  const [messages, setMessages] = useState([
    { user: 'PixelCraft Studios', text: 'Welcome everyone to the live playtest!' },
    { user: 'DevRahul', text: 'That lighting glitch looks awesome.' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;
    setMessages([...messages, { user: 'You', text: inputMessage }]);
    setInputMessage('');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col p-8 relative">
      
      {/* Top Left Circular Arrow Back Button */}
      <div className="absolute top-6 left-6">
        <Link 
          href="/" 
          className="w-12 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center text-white shadow-lg transition-all cursor-pointer"
        >
          <span className="text-xl font-bold">←</span>
        </Link>
      </div>

      {/* Main Content Container */}
      <div className="max-w-4xl mx-auto w-full pt-12">
        <div className="mb-8">
          <span className="text-xs font-semibold px-3 py-1 bg-pink-500/20 text-pink-400 rounded-md uppercase tracking-wider">
            Live Stream & Updates
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold mt-3 mb-2">
            Community Live Discussions
          </h1>
          <p className="text-slate-400 text-sm">
            Real-time broadcast, live developer Q&A sessions, and instant community milestones.
          </p>
        </div>

        {/* Live Feed Unique Content Boxes */}
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-red-500/20 text-red-400 text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> LIVE NOW
            </div>
            
            <h3 className="text-lg font-bold mb-2">🎮 Alpha Playtest Stream: Cyber Neon Runner</h3>
            <p className="text-sm text-slate-300 mb-4">
              Join PixelCraft Studios as they live-code and test dynamic lighting glitches in real-time. Drop your questions in the chat!
            </p>
            <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-800">
              <span>👥 340 Developers Watching</span>
              
              {/* Join Stream Room Button */}
              <button 
                onClick={() => setIsRoomOpen(true)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-all cursor-pointer"
              >
                Join Stream Room
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Stream Room Popup Modal */}
      {isRoomOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 relative shadow-2xl my-8">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsRoomOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold cursor-pointer z-10"
            >
              ✕
            </button>

            <span className="text-xs font-semibold px-3 py-1 bg-red-500/20 text-red-400 rounded-md uppercase tracking-wider inline-block mb-2">
              ● LIVE STREAM ROOM
            </span>
            <h2 className="text-2xl font-bold mb-4">Cyber Neon Runner - Alpha Playtest</h2>

            {/* Video Player Box with Controls */}
            <div className="w-full h-56 bg-slate-950 border border-slate-800 rounded-xl flex flex-col items-center justify-center relative mb-4 overflow-hidden">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-600/30 flex items-center justify-center text-indigo-400 text-lg mx-auto mb-2 animate-pulse">
                  {isPlaying ? '▶' : '❚❚'}
                </div>
                <p className="text-xs text-slate-400">
                  {isPlaying ? 'Live video stream is playing...' : 'Stream paused'}
                </p>
              </div>

              {/* Video Control Buttons Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-slate-900/90 border-t border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="hover:text-indigo-400 font-bold cursor-pointer"
                  >
                    {isPlaying ? '⏸ Pause' : '▶ Play'}
                  </button>
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="hover:text-indigo-400 cursor-pointer"
                  >
                    {isMuted ? '🔇 Unmute' : '🔊 Mute'}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-[10px] text-red-400 font-semibold">LIVE</span>
                </div>
              </div>
            </div>

            {/* Live Chat Section */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col h-48">
              <h4 className="font-semibold text-xs text-indigo-400 mb-2">Live Chat</h4>
              
              {/* Messages List */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-2 text-xs mb-3">
                {messages.map((msg, index) => (
                  <div key={index} className="bg-slate-900/80 p-2 rounded-lg border border-slate-800/60">
                    <span className="font-bold text-indigo-300 mr-2">{msg.user}:</span>
                    <span className="text-slate-300">{msg.text}</span>
                  </div>
                ))}
              </div>

              {/* Message Input Form */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input 
                  type="text" 
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask a question or share feedback..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all"
                >
                  Send
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}