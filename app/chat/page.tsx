'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ChatPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  
  // Initial contacts / chat list
  const [chats, setChats] = useState([
    { id: '1', name: '+91 73539 94670', lastMsg: 'Project update shared successfully', time: '10:25 AM' },
    { id: '2', name: '+91 80507 64670', lastMsg: 'Checking the Vercel deployment link...', time: '10:12 AM' },
    { id: '3', name: 'Studio Alpha (Developer)', lastMsg: 'New indie build uploaded!', time: 'Yesterday' }
  ]);

  const [messages, setMessages] = useState<Record<string, { sender: string; text: string; time: string; isMe: boolean }[]>>({
    '1': [
      { sender: '+91 73539 94670', text: 'Project update shared successfully', time: '10:25 AM', isMe: false }
    ],
    '2': [
      { sender: '+91 80507 64670', text: 'Checking the Vercel deployment link...', time: '10:12 AM', isMe: false }
    ],
    '3': [
      { sender: 'Studio Alpha', text: 'New indie build uploaded!', time: 'Yesterday', isMe: false }
    ]
  });

  // Handle number search and starting a direct chat
  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.trim();
    let existing = chats.find(c => c.name.includes(query));
    
    if (!existing) {
      const newChatObj = { id: Date.now().toString(), name: query, lastMsg: 'Direct chat started', time: 'Just now' };
      setChats([newChatObj, ...chats]);
      setActiveChat(newChatObj);
    } else {
      setActiveChat(existing);
    }
    setSearchQuery('');
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
      
      {/* WhatsApp Style Top Header */}
      <div className="w-full bg-[#1f2c34] px-4 py-3.5 flex items-center justify-between border-b border-slate-800 shadow-md">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              if (activeChat) setActiveChat(null);
              else router.push('/');
            }}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold cursor-pointer"
          >
            ◀ Back
          </button>
          <h1 className="text-lg font-bold text-white tracking-wide">
            {activeChat ? activeChat.name : 'WhatsApp Chats'}
          </h1>
        </div>
        <div className="flex items-center gap-3 text-slate-300 text-sm">
          <span>🔍</span>
          <span>⋮</span>
        </div>
      </div>

      {/* Main Content Area */}
      {!activeChat ? (
        <div className="flex-1 flex flex-col p-4 max-w-md mx-auto w-full">
          
          {/* Number Search / Direct Chat Input Box */}
          <form onSubmit={handleStartChat} className="mb-4">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">📞</span>
              <input 
                type="text"
                placeholder="Search name or enter mobile number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 pl-11 pr-4 bg-[#202c33] text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 shadow-inner"
              />
              <button type="submit" className="absolute right-2.5 top-2 px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow">
                Chat
              </button>
            </div>
          </form>

          {/* Chats List */}
          <div className="flex-1 space-y-1 overflow-y-auto">
            {chats.map((chat) => (
              <div 
                key={chat.id}
                onClick={() => setActiveChat(chat)}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#202c33] cursor-pointer transition-all border-b border-slate-900"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-base text-white shrink-0 shadow">
                  {chat.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="text-xs font-bold text-white truncate">{chat.name}</h3>
                    <span className="text-[10px] text-slate-400 shrink-0">{chat.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{chat.lastMsg}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      ) : (
        /* Active Chat Conversation Screen */
        <div className="flex-1 flex flex-col h-[calc(100vh-65px)] bg-[#0b141a]">
          
          <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col">
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
            <button 
              type="submit"
              className="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center text-sm shadow-lg transition-all cursor-pointer shrink-0"
            >
              ➤
            </button>
          </form>

        </div>
      )}

    </main>
  );
}