'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WhatsAppChatApp() {
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState('chats'); // 'chats' | 'updates' | 'communities' | 'calls'
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  // Chats list matching WhatsApp
  const [chats, setChats] = useState([
    { id: '1', name: 'PHP and SQL 4th sem', lastMsg: '~ shraddha: Reminder', time: '7/10/26', unread: 0, isGroup: true },
    { id: '2', name: 'DATA SCIENCE', lastMsg: '~ soul: Everyone can join the group', time: '10/17/26', unread: 0, isGroup: true },
    { id: '3', name: '2024-25 AITM BCA', lastMsg: 'You reacted ❤️ to “Wishing you a...', time: 'Yesterday', unread: 0, isGroup: true },
    { id: '4', name: '+91 73539 94670', lastMsg: 'git commit -m "feat: redesign chat page..."', time: '10:56 AM', unread: 2, isGroup: false },
    { id: '5', name: '+91 80507 64670', lastMsg: '<Link href="/development">', time: '10:12 AM', unread: 0, isGroup: false },
    { id: '6', name: 'Daily lead\'s update 🤝', lastMsg: 'Shyam: 💬 Sticker', time: '10:11 AM', unread: 0, isGroup: true }
  ]);

  const [messages, setMessages] = useState<Record<string, { sender: string; text: string; time: string; isMe: boolean }[]>>({
    '4': [
      { sender: '+91 73539 94670', text: 'git commit -m "feat: redesign chat page..."', time: '10:56 AM', isMe: false }
    ],
    '5': [
      { sender: '+91 80507 64670', text: '<Link href="/development">', time: '10:12 AM', isMe: false }
    ]
  });

  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    chat.lastMsg.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <main className="min-h-screen bg-[#0b141a] text-white flex flex-col font-sans select-none pb-16">
      
      {/* If inside an active conversation */}
      {activeChat ? (
        <div className="flex-1 flex flex-col h-screen bg-[#0b141a]">
          <div className="bg-[#1f2c34] px-4 py-3 flex items-center justify-between border-b border-slate-800 shadow-md">
            <div className="flex items-center gap-3">
              <button onClick={() => setActiveChat(null)} className="text-slate-300 font-bold text-sm cursor-pointer">◀</button>
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

          <form onSubmit={handleSendMessage} className="bg-[#1f2c34] p-3 flex items-center gap-2 border-t border-slate-800">
            <input 
              type="text"
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 py-2.5 px-4 rounded-full bg-[#2a3942] text-white text-xs focus:outline-none placeholder-slate-400 shadow-inner"
            />
            <button type="submit" className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center text-sm shadow-lg cursor-pointer shrink-0">
              ➤
            </button>
          </form>
        </div>
      ) : (
        /* Main WhatsApp Home Screen with Tabs */
        <div className="flex-1 flex flex-col w-full max-w-md mx-auto">
          
          {/* Top Header */}
          <div className="px-4 py-3.5 flex items-center justify-between bg-[#0b141a] border-b border-slate-900">
            <div className="flex items-center gap-3">
              <button onClick={() => router.push('/')} className="text-emerald-400 font-bold text-xs bg-slate-800 px-2.5 py-1 rounded-lg">Home</button>
              <h1 className="text-xl font-bold text-white tracking-tight">WhatsApp</h1>
            </div>
            <div className="flex items-center gap-5 text-slate-300 text-lg">
              <span>₹</span>
              <span>📷</span>
              <span className="cursor-pointer" onClick={() => {
                const num = prompt("Enter mobile number or name for direct chat:");
                if (num) {
                  const newChat = { id: Date.now().toString(), name: num, lastMsg: 'Direct chat started', time: 'Just now', unread: 0, isGroup: false };
                  setChats([newChat, ...chats]);
                  setActiveChat(newChat);
                }
              }}>⋮</span>
            </div>
          </div>

          {/* CHATS TAB */}
          {currentTab === 'chats' && (
            <div className="flex-1 flex flex-col">
              {/* Search Box */}
              <div className="px-4 my-2">
                <div className="relative flex items-center">
                  <span className="absolute left-4 text-slate-400 text-sm">🔍</span>
                  <input 
                    type="text"
                    placeholder="Ask Meta AI or Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2.5 pl-11 pr-4 bg-[#111b21] text-white text-xs rounded-full border border-slate-800 focus:outline-none focus:border-emerald-500 shadow-inner"
                  />
                </div>
              </div>

              {/* Filter Pills */}
              <div className="px-4 mb-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
                {['All', 'Unread', 'Favorites', 'Groups'].map((filter) => (
                  <button 
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${activeFilter === filter ? 'bg-emerald-600 text-white shadow' : 'bg-[#1f2c34] text-slate-300'}`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Locked Chats banner */}
              <div className="px-4 py-2.5 flex items-center gap-4 text-xs text-slate-300 hover:bg-[#111b21] cursor-pointer">
                <span className="p-2 bg-[#1f2c34] rounded-full">🔒</span>
                <span className="font-semibold">Locked chats</span>
              </div>

              {/* Chat list items */}
              <div className="flex-1 space-y-0.5 overflow-y-auto px-2">
                {filteredChats.map((chat) => (
                  <div 
                    key={chat.id}
                    onClick={() => setActiveChat(chat)}
                    className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#202c33] cursor-pointer transition-all border-b border-slate-900/50"
                  >
                    <div className="w-12 h-12 rounded-full bg-purple-900 flex items-center justify-center font-bold text-base text-white shrink-0 shadow">
                      {chat.name.charAt(0)}
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

          {/* UPDATES TAB (Status & Channels) */}
          {currentTab === 'updates' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              <h2 className="text-lg font-bold text-white">Status</h2>
              <div className="flex gap-3 overflow-x-auto pb-2">
                <div className="flex flex-col items-center shrink-0 cursor-pointer">
                  <div className="w-14 h-14 rounded-full border-2 border-emerald-500 p-0.5 relative">
                    <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center text-xs">👤</div>
                    <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-600 rounded-full text-white text-[10px] flex items-center justify-center">+</span>
                  </div>
                  <span className="text-[10px] text-slate-300 mt-1">My status</span>
                </div>
                {['Padma', 'दिलीप पाटील', 'Gajanan Patil'].map((status, idx) => (
                  <div key={idx} className="flex flex-col items-center shrink-0 cursor-pointer">
                    <div className="w-14 h-14 rounded-full border-2 border-emerald-500 p-0.5">
                      <div className="w-full h-full rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold">
                        {status.charAt(0)}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-300 mt-1 truncate w-16 text-center">{status}</span>
                  </div>
                ))}
              </div>
              <h2 className="text-lg font-bold text-white pt-2">Channels</h2>
              <div className="space-y-3">
                <div className="p-3 bg-[#111b21] rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold">LeadsGuru Official Updates</h4>
                    <p className="text-[10px] text-slate-400">LEADSGRU SPECIAL MEETING...</p>
                  </div>
                  <span className="text-[10px] bg-emerald-600 px-2 py-0.5 rounded-full">213</span>
                </div>
                <div className="p-3 bg-[#111b21] rounded-xl flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold">Chat GPT AI Prompt 🔥</h4>
                    <p className="text-[10px] text-slate-400">Use my uploaded reference...</p>
                  </div>
                  <button className="px-3 py-1 bg-emerald-600 text-white rounded-full text-[10px] font-bold">Follow</button>
                </div>
              </div>
            </div>
          )}

          {/* COMMUNITIES TAB */}
          {currentTab === 'communities' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              <div className="flex items-center gap-3 p-2 bg-[#111b21] rounded-xl cursor-pointer">
                <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center text-lg relative">
                  👥 <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-600 rounded-full text-xs flex items-center justify-center">+</span>
                </div>
                <div>
                  <h3 className="text-xs font-bold">New community</h3>
                  <p className="text-[10px] text-slate-400">Bring your communities together</p>
                </div>
              </div>
              <h4 className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Your Communities</h4>
              <div className="space-y-3">
                <div className="p-3 bg-[#111b21] rounded-xl">
                  <h4 className="text-xs font-bold mb-1">LG MGR SUPPORT TSS</h4>
                  <p className="text-[11px] text-slate-300 border-t border-slate-800 pt-2">TEAM Shyam Sharma ⭐ • Shyam: 💬 ...</p>
                </div>
                <div className="p-3 bg-[#111b21] rounded-xl">
                  <h4 className="text-xs font-bold mb-1">LeadsGuru Manager Support TAS</h4>
                  <p className="text-[11px] text-slate-300 border-t border-slate-800 pt-2">Announcements • Amit: ‼️ Your Seat Is Reserved...</p>
                </div>
              </div>
            </div>
          )}

          {/* CALLS TAB */}
          {currentTab === 'calls' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              <h2 className="text-lg font-bold text-white">Recent Calls</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 hover:bg-[#111b21] rounded-xl cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-sm font-bold">📞</div>
                    <div>
                      <h4 className="text-xs font-bold text-red-400">+91 73539 94670 (Incoming)</h4>
                      <span className="text-[10px] text-slate-400">Today, 10:20 AM</span>
                    </div>
                  </div>
                  <span className="text-emerald-400 text-sm">📞</span>
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-[#111b21] rounded-xl cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-sm font-bold">📹</div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Studio Alpha (Outgoing Video)</h4>
                      <span className="text-[10px] text-slate-400">Yesterday, 04:15 PM</span>
                    </div>
                  </div>
                  <span className="text-emerald-400 text-sm">📹</span>
                </div>
              </div>
            </div>
          )}

          {/* WhatsApp Bottom Navigation Bar (Chats, Updates, Communities, Calls) */}
          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#1f2c34] border-t border-slate-800 flex justify-around items-center py-2 z-50 shadow-2xl">
            <button 
              onClick={() => setCurrentTab('chats')}
              className={`flex flex-col items-center cursor-pointer transition-colors ${currentTab === 'chats' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              <span className="text-lg">💬</span>
              <span className="text-[10px] mt-0.5">Chats</span>
            </button>
            <button 
              onClick={() => setCurrentTab('updates')}
              className={`flex flex-col items-center cursor-pointer transition-colors ${currentTab === 'updates' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              <span className="text-lg">🔔</span>
              <span className="text-[10px] mt-0.5">Updates</span>
            </button>
            <button 
              onClick={() => setCurrentTab('communities')}
              className={`flex flex-col items-center cursor-pointer transition-colors ${currentTab === 'communities' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              <span className="text-lg">👥</span>
              <span className="text-[10px] mt-0.5">Communities</span>
            </button>
            <button 
              onClick={() => setCurrentTab('calls')}
              className={`flex flex-col items-center cursor-pointer transition-colors ${currentTab === 'calls' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              <span className="text-lg">📞</span>
              <span className="text-[10px] mt-0.5">Calls</span>
            </button>
          </div>

        </div>
      )}

    </main>
  );
}