'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WhatsAppUnifiedSystem() {
  const router = useRouter();
  
  // 1. Central State for Managing Entire App Navigation
  const [currentTab, setCurrentTab] = useState<'chats' | 'updates' | 'communities' | 'calls'>('chats');
  const [activeChat, setActiveChat] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageInput, setMessageInput] = useState('');

  // 2. Centralized Database State (Mock Data for dynamic handling)
  const [conversations, setConversations] = useState([
    { id: '1', name: 'Parth (BCA Notes)', lastMsg: 'IA2 java.pdf (7.7 MB)', time: '10:39 AM', unread: 3, avatar: 'P', online: true },
    { id: '2', name: 'PHP and SQL 4th sem', lastMsg: '~ shraddha: Reminder', time: '7/10/26', unread: 0, avatar: 'PHP', online: false },
    { id: '3', name: '+91 73539 94670', lastMsg: 'git commit -m "feat: update..."', time: '10:56 AM', unread: 1, avatar: '7', online: true }
  ]);

  const [chatMessages, setChatMessages] = useState<Record<string, { sender: string; text: string; time: string; isMe: boolean }[]>>({
    '1': [
      { sender: 'Parth', text: 'Here are the Java inheritance notes and PDF files.', time: '10:39 AM', isMe: false }
    ]
  });

  // 3. Dynamic Message Sender Handler (Handles all chat operations in one function)
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !activeChat) return;

    const newMsg = {
      sender: 'You',
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setChatMessages(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMsg]
    }));
    setMessageInput('');
  };

  return (
    <main className="min-h-screen bg-[#0b141a] text-white flex flex-col font-sans select-none pb-16">
      
      {/* 4. CONDITIONAL VIEW CONTROLLER (Handles Chat Screen vs Home Screen dynamically) */}
      {activeChat ? (
        
        /* --- ACTIVE CHAT ROOM VIEW --- */
        <div className="flex-1 flex flex-col h-screen bg-[#0b141a]">
          <div className="bg-[#1f2c34] px-4 py-3 flex items-center justify-between border-b border-slate-800 shadow">
            <div className="flex items-center gap-3">
              <button onClick={() => setActiveChat(null)} className="text-emerald-400 font-bold text-sm cursor-pointer">◀</button>
              <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-sm text-white shadow">
                {activeChat.avatar}
              </div>
              <div>
                <h2 className="text-xs font-bold text-white tracking-wide truncate max-w-[180px]">{activeChat.name}</h2>
                <span className="text-[9px] text-emerald-400">{activeChat.online ? 'online' : 'offline'}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-slate-300 text-sm">
              <span>📹</span>
              <span>📞</span>
              <span>⋮</span>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col bg-[#0b141a]">
            <div className="text-center my-2">
              <span className="px-3 py-1 rounded-lg bg-[#182229] text-[10px] text-slate-400 shadow">
                🔒 Messages and calls are end-to-end encrypted.
              </span>
            </div>
            {(chatMessages[activeChat.id] || []).map((msg, idx) => (
              <div key={idx} className={`flex flex-col max-w-[80%] ${msg.isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                <div className={`p-3 rounded-2xl text-xs shadow-md ${msg.isMe ? 'bg-[#005c4b] text-white rounded-tr-none' : 'bg-[#202c33] text-slate-100 rounded-tl-none'}`}>
                  <p className="leading-relaxed">{msg.text}</p>
                  <span className="block text-[8px] text-slate-400 text-right mt-1">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="bg-[#1f2c34] p-3 flex items-center gap-2 border-t border-slate-800">
            <input 
              type="text"
              placeholder="Message"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 py-2.5 px-4 rounded-full bg-[#2a3942] text-white text-xs focus:outline-none placeholder-slate-400 shadow-inner"
            />
            <button type="submit" className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center text-sm shadow-lg cursor-pointer shrink-0">
              ➤
            </button>
          </form>
        </div>

      ) : (

        /* --- MAIN DASHBOARD VIEW (Tabs Controller) --- */
        <div className="flex-1 flex flex-col w-full max-w-md mx-auto">
          
          {/* Top Universal Header */}
          <div className="px-4 py-3.5 flex items-center justify-between bg-[#0b141a] border-b border-slate-900">
            <div className="flex items-center gap-3">
              <button onClick={() => router.push('/')} className="text-emerald-400 font-bold text-xs bg-slate-800 px-2.5 py-1 rounded-lg cursor-pointer">Home</button>
              <h1 className="text-xl font-bold text-white tracking-tight">WhatsApp</h1>
            </div>
            <div className="flex items-center gap-5 text-slate-300 text-lg">
              <span>₹</span>
              <span>📷</span>
              <span className="cursor-pointer" onClick={() => {
                const phone = prompt("Enter mobile number or name for direct chat:");
                if (phone) {
                  const newObj = { id: Date.now().toString(), name: phone, lastMsg: 'Direct chat started', time: 'Just now', unread: 0, avatar: phone.charAt(0), online: true };
                  setConversations([newObj, ...conversations]);
                  setActiveChat(newObj);
                }
              }}>⋮</span>
            </div>
          </div>

          {/* TAB 1: CHATS VIEW */}
          {currentTab === 'chats' && (
            <div className="flex-1 flex flex-col">
              <div className="px-4 my-2">
                <input 
                  type="text"
                  placeholder="Ask Meta AI or Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full py-2.5 pl-4 pr-4 bg-[#111b21] text-white text-xs rounded-full border border-slate-800 focus:outline-none focus:border-emerald-500 shadow-inner"
                />
              </div>

              <div className="flex-1 space-y-0.5 overflow-y-auto px-2 mt-2">
                {conversations.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map((chat) => (
                  <div 
                    key={chat.id}
                    onClick={() => setActiveChat(chat)}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#202c33] cursor-pointer transition-all border-b border-slate-900/50"
                  >
                    <div className="w-12 h-12 rounded-full bg-purple-900 flex items-center justify-center font-bold text-base text-white shrink-0 shadow">
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
            </div>
          )}

          {/* TAB 2: UPDATES VIEW */}
          {currentTab === 'updates' && (
            <div className="flex-1 p-4 space-y-4">
              <h2 className="text-base font-bold">Status & Stories</h2>
              <div className="p-3 bg-[#111b21] rounded-xl text-xs text-slate-300">No recent updates available.</div>
            </div>
          )}

          {/* TAB 3: COMMUNITIES VIEW */}
          {currentTab === 'communities' && (
            <div className="flex-1 p-4 space-y-4">
              <h2 className="text-base font-bold">Communities Hub</h2>
              <div className="p-3 bg-[#111b21] rounded-xl text-xs text-slate-300">All community groups are synced.</div>
            </div>
          )}

          {/* TAB 4: CALLS VIEW */}
          {currentTab === 'calls' && (
            <div className="flex-1 p-4 space-y-4">
              <h2 className="text-base font-bold">Recent Voice & Video Calls</h2>
              <div className="p-3 bg-[#111b21] rounded-xl text-xs text-slate-300">No missed calls.</div>
            </div>
          )}

          {/* UNIVERSAL BOTTOM NAVIGATION BAR (Handles tab switching instantly) */}
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#1f2c34] border-t border-slate-800 flex justify-around items-center py-2 z-50 shadow-2xl">
            <button onClick={() => setCurrentTab('chats')} className={`flex flex-col items-center cursor-pointer ${currentTab === 'chats' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
              <span className="text-lg">💬</span>
              <span className="text-[10px] mt-0.5">Chats</span>
            </button>
            <button onClick={() => setCurrentTab('updates')} className={`flex flex-col items-center cursor-pointer ${currentTab === 'updates' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
              <span className="text-lg">🔔</span>
              <span className="text-[10px] mt-0.5">Updates</span>
            </button>
            <button onClick={() => setCurrentTab('communities')} className={`flex flex-col items-center cursor-pointer ${currentTab === 'communities' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
              <span className="text-lg">👥</span>
              <span className="text-[10px] mt-0.5">Communities</span>
            </button>
            <button onClick={() => setCurrentTab('calls')} className={`flex flex-col items-center cursor-pointer ${currentTab === 'calls' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}>
              <span className="text-lg">📞</span>
              <span className="text-[10px] mt-0.5">Calls</span>
            </button>
          </div>

        </div>
      )}

    </main>
  );
}