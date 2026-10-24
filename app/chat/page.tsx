'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function IndiePulseChatSystem() {
  const router = useRouter();
  
  const [currentView, setCurrentView] = useState<'list' | 'search' | 'conversation'>('list');
  const [listSearchQuery, setListSearchQuery] = useState('');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  const [attachedFile, setAttachedFile] = useState<string | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      if (currentView === 'conversation' || currentView === 'search') {
        setCurrentView('list');
        setActiveChat(null);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [currentView]);

  const changeView = (view: 'list' | 'search' | 'conversation') => {
    setCurrentView(view);
    window.history.pushState({ view }, '');
  };

  const [registeredContacts, setRegisteredContacts] = useState([
    { id: '1', name: '+91 90354 37802', lastMsg: 'Tap to start chatting', time: '', unread: 0, avatar: '9' },
    { id: '2', name: 'Studio Alpha Developer', lastMsg: 'New indie build uploaded!', time: 'Yesterday', unread: 0, avatar: 'S' },
    { id: '3', name: '+91 80507 64670', lastMsg: 'Direct chat started', time: 'Just now', unread: 0, avatar: '8' }
  ]);

  const [messages, setMessages] = useState<Record<string, { sender: string; text: string; file?: string; time: string; isMe: boolean }[]>>({
    '1': [],
    '2': [],
    '3': []
  });

  const filteredChatList = registeredContacts.filter(c => 
    c.name.toLowerCase().includes(listSearchQuery.toLowerCase()) || 
    c.lastMsg.toLowerCase().includes(listSearchQuery.toLowerCase())
  );

  const globalSearchResults = globalSearchQuery.trim() 
    ? registeredContacts.filter(c => c.name.toLowerCase().includes(globalSearchQuery.trim().toLowerCase()))
    : [];

  const handleSelectContact = (contact: any) => {
    setActiveChat(contact);
    changeView('conversation');
    setGlobalSearchQuery('');
  };

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0].name);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#0b141a] text-white flex flex-col font-sans select-none relative overflow-x-hidden">
      
      {currentView === 'conversation' && activeChat ? (
        <div className="flex-1 flex flex-col h-screen bg-[#0b141a] justify-between">
          
          {/* Top Header */}
          <div className="bg-[#1f2c34] px-3 py-2.5 flex items-center justify-between border-b border-slate-800 shadow-md shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-sm text-white shadow shrink-0">
                {activeChat.avatar}
              </div>
              <div className="flex flex-col min-w-0">
                <h2 className="text-xs font-bold text-white tracking-wide truncate">{activeChat.name}</h2>
                <span className="text-[9px] text-blue-400 font-semibold">online</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-slate-300 text-sm shrink-0 pr-1">
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

          {attachedFile && (
            <div className="bg-[#1f2c34] px-4 py-2 border-t border-slate-800 flex items-center justify-between text-xs text-blue-400 shrink-0">
              <span>Attached: {attachedFile}</span>
              <button onClick={() => setAttachedFile(null)} className="text-pink-400 font-bold">✕ Remove</button>
            </div>
          )}

          {/* Bottom Input Bar - WhatsApp Exact Layout using CSS Grid to prevent overflow/disappearing */}
          <div className="bg-[#0b141a] px-2 py-2 shrink-0 w-full">
            <form onSubmit={handleSendMessage} className="grid grid-cols-[1fr_auto] items-center gap-2 w-full max-w-full">
              
              {/* Input Box Container */}
              <div className="bg-[#1f2c34] rounded-full px-3.5 py-2 flex items-center gap-2 border border-slate-800 shadow-inner w-full">
                <span className="text-slate-400 text-base cursor-pointer shrink-0">😊</span>
                <input 
                  type="text"
                  placeholder="Message"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="w-full bg-transparent text-white text-xs focus:outline-none placeholder-slate-400"
                />
                <label className="text-slate-400 hover:text-white cursor-pointer text-lg shrink-0">
                  📎
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>
                <span className="text-slate-400 text-base cursor-pointer shrink-0">📷</span>
              </div>

              {/* Fixed Send / Mic Button */}
              <button 
                type="submit"
                className="w-11 h-11 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center text-sm shadow-lg cursor-pointer shrink-0 transition-all select-none"
              >
                {messageText.trim() || attachedFile ? '➤' : '🎤'}
              </button>

            </form>
          </div>

        </div>
      ) : currentView === 'search' ? (
        
        <div className="flex-1 flex flex-col p-4 w-full">
          <div className="flex items-center mb-4">
            <button onClick={() => changeView('list')} className="text-xs text-blue-400 font-semibold cursor-pointer">
              ← Back to Chats
            </button>
          </div>

          <div className="relative mb-4">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">🔍</span>
            <input 
              type="text"
              placeholder="Search global developer number or name..."
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
              autoFocus
              className="w-full py-3.5 pl-11 pr-4 bg-[#111b21] text-white text-xs rounded-xl border border-slate-700 focus:outline-none focus:border-blue-500 shadow-inner"
            />
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto">
            {globalSearchQuery.trim() !== '' ? (
              globalSearchResults.length > 0 ? (
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-blue-400 font-bold mb-2">Global System Results:</div>
                  {globalSearchResults.map((contact) => (
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
                          <span className="text-[10px] text-blue-400 font-medium">✓ Number Found • Click to chat</span>
                        </div>
                      </div>
                      <span className="text-xs text-blue-400 font-bold">Chat →</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-slate-900/80 border border-red-500/30 rounded-xl text-center text-xs text-red-300">
                  ❌ Number not found in global system database.
                </div>
              )
            ) : (
              <div className="text-center text-xs text-slate-400 mt-8">
                Type any developer number or name to search globally.
              </div>
            )}
          </div>
        </div>

      ) : (

        <div className="flex-1 flex flex-col w-full pb-20">
          
          <div className="px-4 py-4 flex items-center justify-between bg-[#0b141a] border-b border-slate-900">
            <div className="flex flex-col">
              <div className="text-xl font-black tracking-wider bg-gradient-to-r from-blue-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
                IndiePulse
              </div>
              <span className="text-[10px] text-blue-400 font-bold">Developer & Gamer Chat Hub</span>
            </div>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={() => changeView('search')}
                className="w-9 h-9 rounded-xl bg-pink-600 hover:bg-pink-500 text-white flex items-center justify-center text-xs shadow-[0_0_10px_rgba(236,72,153,0.5)] border border-pink-400/40 cursor-pointer"
              >
                🔍
              </button>
            </div>
          </div>

          <div className="px-4 my-3">
            <div className="relative flex items-center">
              <span className="absolute left-4 text-slate-400 text-xs">🔍</span>
              <input 
                type="text"
                placeholder="Search chats or messages..."
                value={listSearchQuery}
                onChange={(e) => setListSearchQuery(e.target.value)}
                className="w-full py-2.5 pl-11 pr-4 bg-[#111b21] text-white text-xs rounded-full border border-slate-800 focus:outline-none focus:border-blue-500 shadow-inner"
              />
            </div>
          </div>

          <div className="flex-1 space-y-0.5 overflow-y-auto px-2 mt-1">
            {filteredChatList.length > 0 ? (
              filteredChatList.map((chat) => (
                <div 
                  key={chat.id}
                  onClick={() => {
                    setActiveChat(chat);
                    changeView('conversation');
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
              ))
            ) : (
              <div className="text-center text-xs text-slate-400 mt-10">
                No chats found matching your search. Click the (+) button below to start a new chat.
              </div>
            )}
          </div>

          <div className="fixed bottom-20 right-6 z-40">
            <button 
              onClick={() => changeView('search')}
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