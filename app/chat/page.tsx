'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function IndiePulseChatSystem() {
  const router = useRouter();
  
  // App navigation state: 'list' | 'search' | 'conversation'
  const [currentView, setCurrentView] = useState<'list' | 'search' | 'conversation'>('list');
  
  // Search query for mobile number or developer name
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active selected chat
  const [activeChat, setActiveChat] = useState<any>(null);
  
  // Message input and file attachment state
  const [messageText, setMessageText] = useState('');
  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  // Initial chat list (Developers & Gamers)
  const [chats, setChats] = useState([
    { id: '1', name: '+91 90354 37802', lastMsg: 'Call kr ki', time: '7:34 PM', unread: 1, avatar: '9' },
    { id: '2', name: 'Studio Alpha Developer', lastMsg: 'New indie build uploaded!', time: 'Yesterday', unread: 0, avatar: 'S' }
  ]);

  // Messages database for each chat
  const [messages, setMessages] = useState<Record<string, { sender: string; text: string; file?: string; time: string; isMe: boolean }[]>>({
    '1': [
      { sender: '+91 90354 37802', text: 'Hi', time: '7:33 PM', isMe: false },
      { sender: 'You', text: 'Hello 👋', time: '7:33 PM', isMe: true },
      { sender: '+91 90354 37802', text: 'Call kr ki', time: '7:34 PM', isMe: false }
    ],
    '2': [
      { sender: 'Studio Alpha Developer', text: 'Check out the new game engine alpha release.', time: 'Yesterday', isMe: false }
    ]
  });

  // Handle starting a chat via number search
  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim();
    let existing = chats.find(c => c.name.toLowerCase().includes(query.toLowerCase()));

    if (!existing) {
      const newChatObj = { id: Date.now().toString(), name: query, lastMsg: 'Direct chat started', time: 'Just now', unread: 0, avatar: query.charAt(0) };
      setChats([newChatObj, ...chats]);
      setActiveChat(newChatObj);
    } else {
      setActiveChat(existing);
    }
    setCurrentView('conversation');
    setSearchQuery('');
  };

  // Handle sending text or files
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if ((!messageText.trim() && !attachedFile) || !activeChat) return;

    const newMsg = {
      sender: 'You',
      text: messageText,
      file: attachedFile || undefined,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setMessages(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMsg]
    }));
    setMessageText('');
    setAttachedFile(null);
  };

  // Handle file attachment simulation
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0].name);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b141a] text-white flex flex-col font-sans select-none relative overflow-hidden">
      
      {/* VIEW 1: CONVERSATION SCREEN (WhatsApp Style Chat Room) */}
      {currentView === 'conversation' && activeChat ? (
        <div className="flex-1 flex flex-col h-screen bg-[#0b141a]">
          
          {/* Top Header */}
          <div className="bg-[#1f2c34] px-4 py-3 flex items-center justify-between border-b border-slate-800 shadow-md">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCurrentView('list')}
                className="text-emerald-400 font-bold text-sm cursor-pointer"
              >
                ◀
              </button>
              <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-sm text-white shadow">
                {activeChat.avatar}
              </div>
              <div>
                <h2 className="text-xs font-bold text-white tracking-wide truncate max-w-[160px]">{activeChat.name}</h2>
                <span className="text-[9px] text-emerald-400 font-medium">online</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-slate-300 text-sm">
              <span className="cursor-pointer">📹</span>
              <span className="cursor-pointer">📞</span>
              <span className="cursor-pointer">⋮</span>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col bg-[#0b141a]">
            <div className="text-center my-2">
              <span className="px-3 py-1 rounded-lg bg-[#182229] text-[10px] text-slate-400 shadow">
                🔒 Messages are end-to-end encrypted for developers & gamers.
              </span>
            </div>

            {(messages[activeChat.id] || []).map((msg, idx) => (
              <div key={idx} className={`flex flex-col max-w-[85%] ${msg.isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                <div className={`p-3 rounded-2xl text-xs shadow-md ${msg.isMe ? 'bg-[#005c4b] text-white rounded-tr-none' : 'bg-[#202c33] text-slate-100 rounded-tl-none'}`}>
                  {msg.file && (
                    <div className="mb-2 p-2 bg-black/30 rounded-lg flex items-center gap-2 border border-white/10 text-[11px] text-emerald-300">
                      <span>📄 {msg.file}</span>
                    </div>
                  )}
                  {msg.text && <p className="leading-relaxed">{msg.text}</p>}
                  <span className="block text-[8px] text-slate-400 text-right mt-1">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Attached File Preview Bar */}
          {attachedFile && (
            <div className="bg-[#1f2c34] px-4 py-2 border-t border-slate-800 flex items-center justify-between text-xs text-emerald-400">
              <span>Attached: {attachedFile}</span>
              <button onClick={() => setAttachedFile(null)} className="text-red-400 font-bold">✕ Remove</button>
            </div>
          )}

          {/* Bottom Input & File Upload Bar */}
          <form onSubmit={handleSendMessage} className="bg-[#1f2c34] p-3 flex items-center gap-2 border-t border-slate-800">
            
            {/* Attachment Button */}
            <label className="text-slate-300 hover:text-white cursor-pointer p-2 text-base">
              📎
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>

            {/* Message Input */}
            <input 
              type="text"
              placeholder="Message"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 py-2.5 px-4 rounded-full bg-[#2a3942] text-white text-xs focus:outline-none placeholder-slate-400 shadow-inner"
            />

            {/* Send or Mic Button */}
            <button 
              type="submit"
              className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center text-sm shadow-lg cursor-pointer shrink-0 transition-all"
            >
              {messageText.trim() || attachedFile ? '➤' : '🎤'}
            </button>
          </form>

        </div>
      ) : currentView === 'search' ? (
        
        /* VIEW 2: SEARCH NUMBER OR DEVELOPER PAGE */
        <div className="flex-1 flex flex-col w-full max-w-md mx-auto p-4">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => setCurrentView('list')} className="text-emerald-400 font-bold text-sm cursor-pointer">◀ Back</button>
            <h1 className="text-base font-bold text-white">Search Developer / Gamer</h1>
          </div>

          <form onSubmit={handleStartChat} className="space-y-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">🔍</span>
              <input 
                type="text"
                placeholder="Enter mobile number or name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full py-3.5 pl-11 pr-4 bg-[#111b21] text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 shadow-inner"
              />
            </div>
            <button 
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg cursor-pointer transition-all"
            >
              Start Direct Chat ⚡
            </button>
          </form>
        </div>

      ) : (

        /* VIEW 3: MAIN CHAT LIST SCREEN (IndiePulse Branding + Plus Button) */
        <div className="flex-1 flex flex-col w-full max-w-md mx-auto">
          
          {/* Top Header with IndiePulse Logo */}
          <div className="px-4 py-4 flex items-center justify-between bg-[#0b141a] border-b border-slate-900">
            <div className="flex flex-col">
              <div className="text-xl font-black tracking-wider bg-gradient-to-r from-blue-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
                IndiePulse
              </div>
              <span className="text-[10px] text-emerald-400 font-bold">Developer & Gamer Chat Hub</span>
            </div>
            
            <div className="flex items-center gap-5 text-slate-300 text-lg">
              <span className="cursor-pointer" onClick={() => setCurrentView('search')}>🔍</span>
              <span className="cursor-pointer" onClick={() => setCurrentView('search')}>⋮</span>
            </div>
          </div>

          {/* Search Bar / Meta AI trigger */}
          <div className="px-4 my-3">
            <div 
              onClick={() => setCurrentView('search')}
              className="w-full py-2.5 px-4 bg-[#111b21] text-slate-400 text-xs rounded-full border border-slate-800 flex items-center gap-3 cursor-pointer shadow-inner"
            >
              <span>🔍</span>
              <span>Search developer number or name...</span>
            </div>
          </div>

          {/* Active Chats List */}
          <div className="flex-1 space-y-0.5 overflow-y-auto px-2 mt-1">
            {chats.map((chat) => (
              <div 
                key={chat.id}
                onClick={() => {
                  setActiveChat(chat);
                  setCurrentView('conversation');
                }}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#202c33] cursor-pointer transition-all border-b border-slate-900/50"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-base text-white shrink-0 shadow">
                  {chat.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-xs font-bold text-white truncate">{chat.name}</h3>
                    <span className="text-[10px] text-slate-400">{chat.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[11px] text-slate-400 truncate">{chat.lastMsg}</p>
                    {chat.unread > 0 && (
                      <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[9px] font-black flex items-center justify-center shrink-0 ml-2">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* WhatsApp Style Floating Plus (+) Button at Bottom Right */}
          <div className="absolute bottom-6 right-6 z-40">
            <button 
              onClick={() => setCurrentView('search')}
              className="w-14 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center text-3xl font-black shadow-2xl transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="New Chat"
            >
              +
            </button>
          </div>

        </div>
      )}

    </main>
  );
}