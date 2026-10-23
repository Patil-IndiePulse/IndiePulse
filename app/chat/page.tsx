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

  // Pre-registered database of developer & gamer contacts
  const [registeredContacts, setRegisteredContacts] = useState([
    { id: '1', name: '+91 90354 37802', lastMsg: 'Call kr ki', time: '7:34 PM', unread: 1, avatar: '9' },
    { id: '2', name: 'Studio Alpha Developer', lastMsg: 'New indie build uploaded!', time: 'Yesterday', unread: 0, avatar: 'S' },
    { id: '3', name: '+91 80507 64670', lastMsg: 'Direct chat started', time: 'Just now', unread: 0, avatar: '8' }
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
    ],
    '3': [
      { sender: '+91 80507 64670', text: 'Hello developer!', time: 'Just now', isMe: true }
    ]
  });

  // Filter contacts based on availability check in system
  const searchResults = searchQuery.trim() 
    ? registeredContacts.filter(c => c.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : [];

  // Handle selecting a verified contact from search results
  const handleSelectContact = (contact: any) => {
    setActiveChat(contact);
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

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0].name);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#0b141a] text-white flex flex-col font-sans select-none relative overflow-x-hidden">
      
      {/* VIEW 1: CONVERSATION SCREEN (WhatsApp Style Chat Room with Blue Accents & Slim Pink Back Button) */}
      {currentView === 'conversation' && activeChat ? (
        <div className="flex-1 flex flex-col h-screen bg-[#0b141a]">
          
          {/* Top Header */}
          <div className="bg-[#1f2c34] px-4 py-3 flex items-center justify-between border-b border-slate-800 shadow-md">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCurrentView('list')}
                className="px-3 py-1 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-xs font-bold shadow-[0_0_10px_rgba(236,72,153,0.5)] border border-pink-400/40 cursor-pointer"
              >
                ◀ Back
              </button>
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white shadow">
                {activeChat.avatar}
              </div>
              <div>
                <h2 className="text-xs font-bold text-white tracking-wide truncate max-w-[200px]">{activeChat.name}</h2>
                <span className="text-[9px] text-blue-400 font-semibold">online</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-slate-300 text-sm">
              <span className="cursor-pointer">📹</span>
              <span className="cursor-pointer">📞</span>
              <span className="cursor-pointer">⋮</span>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 flex flex-col bg-[#0b141a]">
            <div className="text-center my-2">
              <span className="px-3 py-1 rounded-lg bg-[#182229] text-[10px] text-slate-400 shadow border border-slate-800">
                🔒 Messages & file transfers are end-to-end encrypted.
              </span>
            </div>

            {(messages[activeChat.id] || []).map((msg, idx) => (
              <div key={idx} className={`flex flex-col max-w-[85%] ${msg.isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                <div className={`p-3 rounded-2xl text-xs shadow-md ${msg.isMe ? 'bg-blue-600 text-white rounded-tr-none shadow-[0_0_15px_rgba(37,99,235,0.4)]' : 'bg-[#202c33] text-slate-100 rounded-tl-none'}`}>
                  {msg.file && (
                    <div className="mb-2 p-2 bg-black/40 rounded-lg flex items-center gap-2 border border-white/10 text-[11px] text-blue-300">
                      <span>📎 {msg.file}</span>
                    </div>
                  )}
                  {msg.text && <p className="leading-relaxed">{msg.text}</p>}
                  <span className="block text-[8px] text-slate-300 text-right mt-1">{msg.time}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Attached File Preview Bar */}
          {attachedFile && (
            <div className="bg-[#1f2c34] px-4 py-2 border-t border-slate-800 flex items-center justify-between text-xs text-blue-400">
              <span>Attached: {attachedFile}</span>
              <button onClick={() => setAttachedFile(null)} className="text-pink-400 font-bold">✕ Remove</button>
            </div>
          )}

          {/* Bottom Input & File Upload Bar */}
          <form onSubmit={handleSendMessage} className="bg-[#1f2c34] p-3 flex items-center gap-2 border-t border-slate-800">
            
            {/* File Upload Button */}
            <label className="text-blue-400 hover:text-blue-300 cursor-pointer p-2 text-lg transition-transform hover:scale-110">
              📎
              <input type="file" onChange={handleFileUpload} className="hidden" />
            </label>

            {/* Message Input */}
            <input 
              type="text"
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 py-2.5 px-4 rounded-full bg-[#2a3942] text-white text-xs focus:outline-none placeholder-slate-400 shadow-inner border border-slate-700/50"
            />

            {/* Send Button with Blue Theme */}
            <button 
              type="submit"
              className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center text-sm shadow-[0_0_15px_rgba(37,99,235,0.6)] cursor-pointer shrink-0 transition-all"
            >
              ➤
            </button>
          </form>

        </div>
      ) : currentView === 'search' ? (
        
        /* VIEW 2: SEARCH NUMBER & SYSTEM AVAILABILITY CHECK */
        <div className="flex-1 flex flex-col p-4 w-full">
          <div className="flex items-center gap-3 mb-6">
            <button 
              onClick={() => setCurrentView('list')} 
              className="px-3 py-1 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-xs font-bold shadow-[0_0_10px_rgba(236,72,153,0.5)] border border-pink-400/40 cursor-pointer"
            >
              ◀ Back
            </button>
          </div>

          {/* Number / Name Search Input Box */}
          <div className="relative mb-4">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">🔍</span>
            <input 
              type="text"
              placeholder="Enter mobile number or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full py-3.5 pl-11 pr-4 bg-[#111b21] text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 shadow-inner"
            />
          </div>

          {/* System Availability Verification Results */}
          <div className="flex-1 space-y-2 overflow-y-auto">
            {searchQuery.trim() !== '' ? (
              searchResults.length > 0 ? (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-blue-400 font-bold mb-2">Available in System:</div>
                  {searchResults.map((contact) => (
                    <div 
                      key={contact.id}
                      onClick={() => handleSelectContact(contact)}
                      className="p-3 bg-[#111b21] hover:bg-[#1f2c34] border border-blue-500/30 rounded-xl cursor-pointer flex items-center justify-between shadow transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs text-white">
                          {contact.avatar}
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-white">{contact.name}</h3>
                          <span className="text-[10px] text-blue-400 font-medium">✓ Number Available • Click to chat</span>
                        </div>
                      </div>
                      <span className="text-xs text-blue-400 font-bold">Chat →</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-900/80 border border-red-500/30 rounded-xl text-center text-xs text-red-300">
                  ❌ Number not available in the system database. Try another number or developer name.
                </div>
              )
            ) : (
              <div className="text-center text-xs text-slate-400 mt-8">
                Type a mobile number or developer name above to check availability in the system.
              </div>
            )}
          </div>
        </div>

      ) : (

        /* VIEW 3: MAIN CHAT LIST SCREEN (IndiePulse Branding + Pink Plus Button) */
        <div className="flex-1 flex flex-col w-full pb-20">
          
          {/* Top Header with IndiePulse Logo */}
          <div className="px-4 py-4 flex items-center justify-between bg-[#0b141a] border-b border-slate-900">
            <div className="flex flex-col">
              <div className="text-xl font-black tracking-wider bg-gradient-to-r from-blue-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
                IndiePulse
              </div>
              <span className="text-[10px] text-blue-400 font-bold">Developer & Gamer Chat Hub</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => setCurrentView('search')}
                className="w-9 h-9 rounded-xl bg-pink-600 hover:bg-pink-500 text-white flex items-center justify-center text-xs shadow-[0_0_10px_rgba(236,72,153,0.5)] border border-pink-400/40 cursor-pointer"
              >
                🔍
              </button>
            </div>
          </div>

          {/* Search Bar / Trigger */}
          <div className="px-4 my-3">
            <div 
              onClick={() => setCurrentView('search')}
              className="w-full py-2.5 px-4 bg-[#111b21] text-slate-400 text-xs rounded-full border border-slate-800 flex items-center gap-3 cursor-pointer shadow-inner"
            >
              <span>🔍</span>
              <span>Search available developer number...</span>
            </div>
          </div>

          {/* Active Chats List */}
          <div className="flex-1 space-y-0.5 overflow-y-auto px-2 mt-1">
            {registeredContacts.map((chat) => (
              <div 
                key={chat.id}
                onClick={() => {
                  setActiveChat(chat);
                  setCurrentView('conversation');
                }}
                className="flex items-center gap-3 p-3 rounded-2xl hover:bg-[#202c33] cursor-pointer transition-all border-b border-slate-900/50"
              >
                <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center font-bold text-base text-white shrink-0 shadow-[0_0_12px_rgba(37,99,235,0.4)]">
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
                      <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-black flex items-center justify-center shrink-0 ml-2 shadow">
                        {chat.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Plus (+) Button adjusted nicely to middle-bottom */}
          <div className="fixed bottom-6 right-6 z-40">
            <button 
              onClick={() => setCurrentView('search')}
              className="w-14 h-14 rounded-2xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white flex items-center justify-center text-3xl font-black shadow-[0_0_25px_rgba(236,72,153,0.7)] border border-pink-400/50 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
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