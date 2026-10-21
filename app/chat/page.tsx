'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  
  // WhatsApp chat list with numbers & names
  const [chats, setChats] = useState([
    { id: '1', name: '+91 73539 94670', lastMsg: 'Project update shared successfully', time: '10:49 AM', unread: 2 },
    { id: '2', name: '+91 80507 64670', lastMsg: 'Checking the Vercel deployment link...', time: '10:12 AM', unread: 0 },
    { id: '3', name: 'Studio Alpha (Developer)', lastMsg: 'New indie build uploaded!', time: 'Yesterday', unread: 1 }
  ]);

  const [messages, setMessages] = useState<Record<string, { sender: string; text: string; time: string; isMe: boolean }[]>>({
    '1': [
      { sender: '+91 73539 94670', text: 'Project update shared successfully', time: '10:49 AM', isMe: false }
    ],
    '2': [
      { sender: '+91 80507 64670', text: 'Checking the Vercel deployment link...', time: '10:12 AM', isMe: false }
    ],
    '3': [
      { sender: 'Studio Alpha', text: 'New indie build uploaded!', time: 'Yesterday', isMe: false }
    ]
  });

  // Filter chats based on search query or mobile number input
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    chat.lastMsg.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // If user types a new number or name and presses enter / chats, open or create direct chat
  const handleDirectSearchChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim();
    let existing = chats.find(c => c.name.toLowerCase().includes(query.toLowerCase()));
    
    if (!existing) {
      const newChatObj = { id: Date.now().toString(), name: query, lastMsg: 'Direct chat started', time: 'Just now', unread: 0 };
      setChats([newChatObj, ...chats]);
      setActiveChat(newChatObj);
    } else {
      setActiveChat(existing);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChat) return;

    const newMsg = {
      sender: 'You',
      text: messageText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setMessages(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMsg]
    }));
    setMessageText('');
  };

  return (
    <main className="min-h-screen bg-[#0b141a] text-white flex flex-col font-sans select-none">
      
      {/* Active Chat Screen (WhatsApp Style Conversation) */}
      {activeChat ? (
        <div className="flex-1 flex flex-col h-screen bg-[#0b141a]">
          {/* Chat Header */}
          <div className="bg-[#1f2c34] px-4 py-3 flex items-center justify-between border-b border-slate-800 shadow-md">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setActiveChat(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-xs font-bold cursor-pointer"
              >
                ◀
              </button>
              <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-sm text-white shadow">
                {activeChat.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-xs font-bold text-white tracking-wide truncate max-w-[180px]">{activeChat.name}</h2>
                <span className="text-[9px] text-emerald-400">online</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-slate-300 text-sm">
              <span>📹</span>
              <span>📞</span>
              <span>⋮</span>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col bg-[#0b141a]">
            <div className="text-center my-2">
              <span className="px-3 py-1 rounded-lg bg-[#182229] text-[10px] text-slate-400 shadow">
                Messages are end-to-end encrypted.
              </span>
            </div>

            {(messages[activeChat.id] || []).map((msg, index) => (
              <div key={index} className={`flex flex-col max-w-[80%] ${msg.isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                <div className={`p-3 rounded-2xl text-xs shadow-md ${msg.isMe ? 'bg-[#005c4b] text-white rounded-tr-none' : 'bg-[#202c33] text-slate-100 rounded-tl-none'}`}>
                  <p className="leading-relaxed">{msg.text}</p>
                  <span className="block text-[8px] text-slate-400 text-right mt-1">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Bar */}
          <form onSubmit={handleSendMessage} className="bg-[#1f2c34] p-3 flex items-center gap-2 border-t border-slate-800">
            <input 
              type="text"
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 py-2.5 px-4 rounded-full bg-[#2a3942] text-white text-xs focus:outline-none placeholder-slate-400 shadow-inner"
            />
            <button 
              type="submit"
              className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center text-sm shadow-lg transition-all cursor-pointer shrink-0"
            >
              ➤
            </button>
          </form>
        </div>
      ) : (
        /* Main WhatsApp Home Screen with Top Title & Search Bar */
        <div className="flex-1 flex flex-col w-full max-w-md mx-auto">
          
          {/* Top WhatsApp Title & Action Icons */}
          <div className="px-4 py-4 flex items-center justify-between bg-[#0b141a]">
            <div className="flex items-center gap-2">
              <button onClick={() => router.push('/')} className="text-slate-300 text-xs mr-1 font-bold">◀ Home</button>
              <h1 className="text-xl font-bold text-white tracking-tight">WhatsApp</h1>
            </div>
            <div className="flex items-center gap-5 text-slate-300 text-lg">
              <span>📷</span>
              <span>🔍</span>
              <span onClick={() => router.push('/')} className="cursor-pointer">⋮</span>
            </div>
          </div>

          {/* Search / Ask Meta AI Bar */}
          <div className="px-4 mb-3">
            <form onSubmit={handleDirectSearchChat}>
              <div className="relative flex items-center">
                <span className="absolute left-4 text-emerald-500 text-sm">✨</span>
                <input 
                  type="text"
                  placeholder="Ask Meta AI or search / enter mobile number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2.5 pl-11 pr-16 bg-[#111b21] text-white text-xs rounded-full border border-slate-800 focus:outline-none focus:border-emerald-500 shadow-inner"
                />
                <button type="submit" className="absolute right-2 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-[10px] font-bold shadow">
                  Chat
                </button>
              </div>
            </form>
          </div>

          {/* Filter Pills (All, Unread, Favorites, Groups) */}
          <div className="px-4 mb-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {['All', 'Unread', 'Favorites', 'Groups'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${activeTab === tab ? 'bg-emerald-600 text-white shadow' : 'bg-[#1f2c34] text-slate-300 hover:bg-slate-800'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Chat List */}
          <div className="flex-1 space-y-0.5 overflow-y-auto px-2">
            {filteredChats.map((chat) => (
              <div 
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#202c33] cursor-pointer transition-all border-b border-slate-900/50"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-base text-white shrink-0 shadow">
                  {chat.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-xs font-bold text-white truncate">{chat.name}</h3>
                    <span className={`text-[10px] ${chat.unread > 0 ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>{chat.time}</span>
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

          {/* Floating Action Button (New Chat Icon at Bottom Right) */}
          <div className="absolute bottom-6 right-6 z-40">
            <button 
              onClick={() => {
                const num = prompt("Enter mobile number to chat:");
                if (num) {
                  const newChatObj = { id: Date.now().toString(), name: num, lastMsg: 'Direct chat started', time: 'Just now', unread: 0 };
                  setChats([newChatObj, ...chats]);
                  setActiveChat(newChatObj);
                }
              }}
              className="w-14 h-14 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center text-2xl shadow-xl transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              💬
            </button>
          </div>

        </div>
      )}

    </main>
  );
}