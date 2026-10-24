'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function IndiePulseChatSystem() {
  const router = useRouter();
  
  const [currentView, setCurrentView] = useState<'list' | 'search' | 'conversation'>('list');
  const [listSearchQuery, setListSearchQuery] = useState('');
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [activeChat, setActiveChat] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  
  // WhatsApp Style Popup States
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [emojiCategory, setEmojiCategory] = useState<'recents' | 'smileys' | 'animals' | 'food' | 'travel' | 'activities' | 'objects' | 'symbols' | 'flags'>('smileys');
  
  // WhatsApp Style Live Voice Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Audio Bip Sound Function for WhatsApp Mic Click
  const playMicClickSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      // AudioContext fallback
    }
  };

  // Expanded Comprehensive Emoji Database without any text strings in flags
  const emojiCategories = {
    recents: ['😀', '😂', '❤️', '🔥', '👍', '🎉', '🚀', '⭐', '😎', '🙏', '💯', '✨', '🇮🇳', '💻', '🎮'],
    smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😙', '😚', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐', '😕', '😟', '🙁', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😩', '🥱', '😴', '😤', '😡', '🤬', '😈', '👿', '💀', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🤲', '👐', '🙌', '👏', '🤝', '👍', '👎', '👊', '✊', '🤛', '🤜', '🤞', '✌️', '🤟', '🤘', '👌', '🤌', '🤏', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐️', '🖖', '👋', '🤙', '💪', '🦾', '🖕', '✍️', '🙏', '🦶', '🦵', '🦿', '💄', '💋', '👄', '🦷', '👂', '🦻', '👃', '👣', '👁️', '👀', '🧠', '🗣️', '👤', '👥'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐞', '🐜', '🦟', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦪', '🦐', '🦞', '🦀', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🐐', '🦌', '🐕', '🐩', '🦮', '🐈', '🐓', '🦃', '🦚', '🦜', '🦢', '🦩', '🕊️', '🐇', '🦝', '🦨', '🦡', '🦦', '🦥', '🐁', '🐀', '🐿️', '🦔', '🌵', '🎄', '🌲', '🌳', '🌴', '🌱', '🌿', '☘️', '🍀', '🎍', '🎋', '🍃', '🍂', '🍁', '🍄', '🌾', '💐', '🌷', '🌹', '🥀', '🌺', '🌸', '🌼', '🌻', '🌞', '🌝', '🌛', '🌜', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '🌙', '🌎', '🌍', '🌏', '🪐', '💫', '⭐️', '🌟', '✨', '⚡️', '☄️', '💥', '🔥', '🌪️', '🌈', '☀️', '🌤️', '⛅', '🌥️', '☁️', '🌦️', '🌧️', '⛈️', '🌩️', '🌨️', '❄️', '☃️', '⛄️', '🌬️', '💧', '💦', '☔️', '☂️', '🌊'],
    food: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🍍', '🥭', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠', '🥐', '🍞', '🥖', '🥨', '🧀', '🥚', '🍳', '🥞', '🧇', '🥓', '🥩', '🍗', '🍖', '🦴', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🧆', '🌮', '🌯', '🥗', '🥘', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🍙', '🍘', '🍢', '🍡', '🍧', '🍨', '🍦', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍩', '🍪', '🍯', '☕', '🍵', '🧃', '🥤', '🍶', '🍺', '🍻', '🍷', '🍸', '🍹', '🍾', '🥃', '🥄', '🍴', '🍽️', '🥣', '🥡', '🥢', '🧋', '🧊'],
    travel: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛵', '🏍️', '🚲', '🛴', '🦽', '🦼', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '✈️', '🛫', '🛬', '🛩️', '🛰️', '🚀', '🛸', '🚁', '🛶', '⛵', '🚤', '🛥️', '🛳️', '⛴️', '🚢', '⚓', '⛽', '🚧', '🚦', '🚥', '🗺️', '🗿', '🗽', '🗼', '🏰', '🏯', '🏟️', '🎡', '🎢', '🎠', '⛲', '⛱️', '🏖️', '🏝️', '🏜️', '🌋', '⛰️', '🏔️', '🗻', '⛺', '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏪', '🏫', '🏬', '🏭', '🛕', '⛩️', '🛤️', '🛣️', '🌁', '🌃', '🏙️', '🌄', '🌅', '🌆', '🌇', '🌉', '♨️'],
    activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🪀', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '🪃', '🥅', '⛳', '🪁', '🏹', '🎣', '🤿', '🥊', '🥋', '🛼', '🛹', '🛷', '⛸️', '🥌', '🎿', '⛷️', '🏂', '🪂', '🏋️', '🤼', '🤸', '⛹️', '🤺', '🤾', '🏌️', '🏇', '🧘', '🏄', '🏊', '🤽', '🚣', '🧗', '🚵', '🚴', '🏆', '🥇', '🥈', '🥉', '🏅', '🎖️', '🏵️', '🎗️', '🎫', '🎟️', '🎪', '🤹', '🎭', '🩰', '🎨', '🎬', '🎤', '🎧', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🪕', '🎻', '🎲', '♟️', '🎯', '🎳', '🎮', '🎰', '🧩', '🧸', '🪅', '🪆', '🪩', '🎽', '🥼', '🦺', '👔', '👕', '👖', '🧣', '🧤', '🧥', '🧦', '👗', '👘', '🥻', '🩱', '🩲', '🩳', '👙', '👚', '👛', '👜', '👝', '🎒', '👞', '👟', '🥾', '🥿', '👠', '👡', '👢', '👑', '👒', '🎩', '🎓', '🧢', '⛑️', '📿', '💄', '💍', '💎'],
    objects: ['💻', '📱', '☎️', '📞', '📟', '📠', '🔋', '🔌', '🖨️', '⌨️', '🖱️', '🖲️', '💽', '💾', '💿', '📀', '🎥', '🎞️', '📽️', '📺', '📷', '📸', '📹', '📼', '🔍', '🔎', '🕯️', '💡', '🔦', '🏮', '📔', '📕', '📖', '📗', '📘', '📙', '📚', '📓', '📒', '📃', '📜', '📄', '📰', '🗞️', '📑', '🔖', '🏷️', '💰', '🪙', '💴', '💵', '💶', '💷', '💸', '💳', '✉️', '📧', '📨', '📩', '📤', '📥', '📦', '📫', '📪', '📬', '📭', '📮', '🗳️', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '📝', '💼', '📁', '📂', '📅', '📆', '📇', '📈', '📉', '📊', '📋', '📌', '📍', '📎', '📏', '📐', '✂️', '🗃️', '🗄️', '🗑️', '🔒', '🔓', '🔏', '🔐', '🔑', '🗝️', '🔨', '⛏️', '⚒️', '🛠️', '🗡️', '⚔️', '🔫', '🪃', '🛡️', '🔧', '🔩', '⚙️', '🗜️', '⚖️', '🔗', '⛓️', '🧰', '🧲', '⚗️', '🧪', '🧫', '🧬', '🔬', '🔭', '📡', '💉', '🩸', '💊', '🩹', '🩺', '🚪', '🛏️', '🛋️', '🚽', '🪞', '🪟', '🧻', '🚿', '🛁', '🧼', '🧽', '🧴', '🛎️', '🪑', '🪒', '🧷', '🧹', '🧺', '🪣', '🪥', '🧯', '🛒', '🚬', '⚰️', '⚱️', '🗿'],
    symbols: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '🔸', '🔹', '🔶', '🔷', '🔺', '🔻', '🎴', '🔀', '🔁', '🔂', '▶️', '⏩', '⏭️', '⏯️', '◀️', '⏪', '⏮️', '🔼', '🔽', '⏹️', '⏺️', '⏏️', '🎦', '🔅', '🔆', '📶', '💯', '💢', '💬', '🗨️', '💭', '💤', '🏁', '🚩', '🎌', '🏴', '🏳️', '💱', '💲', '✖️', '➕', '➗', '©️', '®️', '™️', '🔚', '🔙', '🔛', '🔝', '🔜', '✔️', '☑️', '🔘', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '⬛', '⬜', '◼️', '◻️', '◾', '◽', '▪️', '▫️', '💠', '🔲', '🔳', '🧮'],
    flags: [
      '🇮🇳', '🇺🇸', '🇬🇧', '🇨🇦', '🇦🇺', '🇯🇵', '🇩🇪', '🇫🇷', '🇧🇷', '🇷🇺', 
      '🇮🇹', '🇪🇸', '🇨🇳', '🇰🇷', '🇲🇽', '🇦🇷', '🇿🇦', '🇸🇦', '🇦🇪', '🇳🇱', 
      '🇨🇭', '🇸🇪', '🇳🇴', '🇩🇰', '🇫🇮', '🇧🇪', '🇦🇹', '🇵🇱', '🇹🇷', '🇬🇷', 
      '🇵🇹', '🇮🇪', '🇳🇿', '🇸🇬', '🇲🇾', '🇹🇭', '🇮🇩', '🇵🇭', '🇻🇳', '🇵🇰', 
      '🇧🇩', '🇪🇬', '🇳🇬', '🇰🇪', '🇮🇱', '🇨🇱', '🇨🇴', '🇵🇪', '🇻🇪', '🇺🇦', 
      '🇨🇿', '🇭🇺', '🇷🇴', '🇧🇬', '🇭🇷', '🇷🇸', '🇸🇰', '🇸🇮', '🇪🇪', '🇱🇻', 
      '🇱🇹', '🇨🇾', '🇱🇺', '🇲🇹', '🇮🇸', '🇱🇮', '🇲🇨', '🇦🇩', '🇸🇲', '🇻🇦', 
      '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️', '🏁', '🚩', '🎌', '🏴', '🏳️'
    ]
  };

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

  const [messages, setMessages] = useState<Record<string, { sender: string; text: string; file?: string; audioUrl?: string; duration?: string; time: string; isMe: boolean }[]>>({
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
    setShowEmojiPicker(false);
    setShowAttachmentMenu(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachedFile(e.target.files[0].name);
      setShowAttachmentMenu(false);
    }
  };

  // Real Live WhatsApp Style Voice Note Recording using MediaRecorder API
  const startRecording = async () => {
    if (!messageText.trim() && !attachedFile) {
      playMicClickSound();
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          // Do nothing on stop if cancelled
        };

        mediaRecorder.start();
        setIsRecording(true);
        setIsPaused(false);
        setRecordingSeconds(0);

        timerRef.current = setInterval(() => {
          setRecordingSeconds(prev => prev + 1);
        }, 1000);
      } catch (err) {
        alert('Microphone permission denied or not supported.');
      }
    }
  };

  const pauseOrResumeRecording = () => {
    if (mediaRecorderRef.current) {
      if (isPaused) {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        timerRef.current = setInterval(() => {
          setRecordingSeconds(prev => prev + 1);
        }, 1000);
      } else {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        clearInterval(timerRef.current);
      }
    }
  };

  const stopRecordingAndSend = () => {
    clearInterval(timerRef.current);
    if (mediaRecorderRef.current && isRecording) {
      const recorder = mediaRecorderRef.current;
      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);

        const newMsg = {
          sender: 'You',
          text: '',
          audioUrl: url,
          duration: formatTime(recordingSeconds),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMe: true
        };

        setMessages(prev => ({
          ...prev,
          [activeChat.id]: [...(prev[activeChat.id] || []), newMsg]
        }));
      };
      recorder.stop();
      recorder.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  const cancelRecording = () => {
    clearInterval(timerRef.current);
    if (mediaRecorderRef.current && isRecording) {
      const recorder = mediaRecorderRef.current;
      // Clear onstop so it won't send anything when stopped
      recorder.onstop = null;
      recorder.stop();
      recorder.stream.getTracks().forEach(track => track.stop());
    }
    setIsRecording(false);
    setRecordingSeconds(0);
    audioChunksRef.current = [];
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <main className="min-h-screen w-full bg-[#0b141a] text-white flex flex-col font-sans select-none relative overflow-x-hidden">
      
      {currentView === 'conversation' && activeChat ? (
        <div className="h-[100dvh] w-full bg-[#0b141a] grid grid-rows-[auto_1fr_auto] overflow-hidden">
          
          {/* Top WhatsApp Style Header */}
          <div className="bg-[#1f2c34] px-3 py-2.5 flex items-center justify-between border-b border-slate-800 shadow-md w-full z-20 shrink-0">
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

          {/* Messages Container (Scrollable Middle Section) */}
          <div className="p-4 overflow-y-auto space-y-3 flex flex-col bg-[#0b141a] w-full">
            <div className="text-center my-2">
              <span className="px-3 py-1 rounded-lg bg-[#182229] text-[10px] text-slate-400 shadow border border-slate-800">
                🔒 Messages & file transfers are end-to-end encrypted[span_0](start_span)[span_0](end_span).
              </span>
            </div>

            {(messages[activeChat.id] || []).map((msg, idx) => (
              <div key={idx} className={`flex flex-col max-w-[85%] ${msg.isMe ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
                {/* Clean Full Gradient Mixing Color Bubble without any inner box */}
                <div className={`p-3 rounded-2xl text-xs shadow-md ${msg.isMe ? 'bg-gradient-to-r from-pink-600 to-blue-600 text-white rounded-tr-none shadow-[0_0_15px_rgba(236,72,153,0.3)]' : 'bg-[#202c33] text-slate-100 rounded-tl-none'}`}>
                  {msg.file && (
                    <div className="mb-2 p-2 bg-black/40 rounded-lg flex items-center gap-2 border border-white/10 text-[11px] text-blue-300">
                      <span>📎 {msg.file}</span>
                    </div>
                  )}
                  {msg.audioUrl ? (
                    <div className="flex items-center gap-3 min-w-[220px]">
                      <div className="relative shrink-0">
                        <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center font-bold text-xs text-white overflow-hidden border border-white/20">
                          {activeChat.avatar}
                        </div>
                        <span className="absolute -bottom-1 -right-1 text-[10px] bg-pink-600 rounded-full p-0.5 shadow">🎤</span>
                      </div>
                      <div className="flex-1 flex flex-col gap-1">
                        <audio controls src={msg.audioUrl} className="h-8 w-full accent-pink-300 filter invert contrast-200" />
                        <div className="flex justify-between items-center text-[9px] text-slate-100 font-mono px-0.5">
                          <span>{msg.duration || '0:03'}</span>
                          <span>{msg.time} ✓✓</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    msg.text && <p className="leading-relaxed">{msg.text}</p>
                  )}
                  {!msg.audioUrl && <span className="block text-[8px] text-slate-200 text-right mt-1 font-mono">{msg.time} ✓✓</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Footer Section with Fixed WhatsApp Ordering */}
          <div className="w-full bg-[#0b141a] flex flex-col shrink-0 z-40 border-t border-slate-900 shadow-lg">

            {attachedFile && (
              <div className="bg-[#1f2c34] px-4 py-2 border-t border-slate-800 flex items-center justify-between text-xs text-blue-400 shrink-0">
                <span>Attached: {attachedFile}</span>
                <button onClick={() => setAttachedFile(null)} className="text-pink-400 font-bold">✕ Remove</button>
              </div>
            )}

            {/* Main Bottom Input Bar or Clean WhatsApp Style Live Voice Recording Bar */}
            <div className="bg-[#0b141a] px-2 py-2 w-full shrink-0">
              {isRecording ? (
                <div className="bg-[#1f2c34] rounded-full px-4 py-2.5 flex items-center justify-between border border-slate-800 shadow-inner w-full">
                  <div className="flex items-center gap-3">
                    {/* Working WhatsApp Style Delete Trash Icon Button */}
                    <button type="button" onClick={cancelRecording} className="w-9 h-9 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center text-sm cursor-pointer hover:bg-red-600/40 transition-colors" title="Delete Recording">
                      🗑️
                    </button>
                    <span className="text-xs font-mono text-red-400 font-bold">{formatTime(recordingSeconds)}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-300">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                    <span>{isPaused ? 'Paused' : 'Recording...'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={pauseOrResumeRecording} className="text-slate-300 text-xs cursor-pointer px-2 py-1 rounded bg-black/30 font-bold">
                      {isPaused ? '▶' : '⏸'}
                    </button>
                    <button type="button" onClick={stopRecordingAndSend} className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center text-sm shadow cursor-pointer hover:bg-green-500 transition-colors">
                      ➤
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="grid grid-cols-[1fr_auto] items-center gap-2 w-full">
                  
                  {/* Input Box Container */}
                  <div className="bg-[#1f2c34] rounded-full px-3.5 py-2 flex items-center gap-2 border border-slate-800 shadow-inner w-full min-w-0">
                    <span 
                      onClick={() => { setShowEmojiPicker(!showEmojiPicker); setShowAttachmentMenu(false); }}
                      className="text-slate-400 text-base cursor-pointer shrink-0 hover:text-white transition-colors"
                    >
                      😊
                    </span>
                    <input 
                      type="text"
                      placeholder="Message"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="w-full bg-transparent text-white text-xs focus:outline-none placeholder-slate-400 min-w-0"
                    />
                    <span 
                      onClick={() => { setShowAttachmentMenu(!showAttachmentMenu); setShowEmojiPicker(false); }}
                      className="text-slate-400 hover:text-white cursor-pointer text-lg shrink-0" 
                      title="Attach File"
                    >
                      📎
                    </span>
                    {/* Direct Live Camera Capture Option + Gallery Upload */}
                    <label className="text-slate-400 hover:text-white cursor-pointer text-base shrink-0" title="Camera">
                      📷
                      <input type="file" accept="image/*" capture="environment" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>

                  {/* Fixed Send / Exact WhatsApp Style SVG Mic Button with Click Bip Sound */}
                  <button 
                    type={messageText.trim() || attachedFile ? 'submit' : 'button'}
                    onClick={messageText.trim() || attachedFile ? undefined : startRecording}
                    className="w-11 h-11 rounded-full bg-green-600 hover:bg-green-500 text-white flex items-center justify-center shadow-lg cursor-pointer shrink-0 transition-all select-none"
                    title="Hold or click to record voice note"
                  >
                    {messageText.trim() || attachedFile ? (
                      <span className="text-sm font-bold">➤</span>
                    ) : (
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                        <path d="M11.999 14.942c2.001 0 3.631-1.63 3.631-3.631V5.685c0-2.001-1.63-3.631-3.631-3.631-2.001 0-3.631 1.63-3.631 3.631v5.626c0 2.001 1.63 3.631 3.631 3.631zM18.106 11.31c0 3.38-2.748 6.128-6.128 6.128S5.85 14.69 5.85 11.31H4.35c0 3.82 2.943 6.96 6.721 7.437v3.003h1.857v-3.003c3.778-.477 6.721-3.617 6.721-7.437h-1.503z"/>
                      </svg>
                    )}
                  </button>

                </form>
              )}
            </div>

            {/* WhatsApp Style Attachment Popup Menu */}
            {showAttachmentMenu && (
              <div className="bg-[#1f2c34] p-4 border-t border-slate-800 grid grid-cols-4 gap-4 text-center shadow-2xl rounded-t-2xl z-50 shrink-0">
                <label className="flex flex-col items-center gap-1 cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-lg text-white shadow">🖼️</div>
                  <span className="text-[10px] text-slate-300 font-medium">Gallery</span>
                  <input type="file" accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
                </label>
                <label className="flex flex-col items-center gap-1 cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-pink-600 flex items-center justify-center text-lg text-white shadow">📷</div>
                  <span className="text-[10px] text-slate-300 font-medium">Camera</span>
                  <input type="file" accept="image/*" capture="environment" onChange={handleFileUpload} className="hidden" />
                </label>
                <label className="flex flex-col items-center gap-1 cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-lg text-white shadow">📄</div>
                  <span className="text-[10px] text-slate-300 font-medium">Document</span>
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>
                <div onClick={() => alert('Location sharing simulated!')} className="flex flex-col items-center gap-1 cursor-pointer">
                  <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-lg text-white shadow">📍</div>
                  <span className="text-[10px] text-slate-300 font-medium">Location</span>
                </div>
              </div>
            )}

            {/* Clean Emoji Picker */}
            {showEmojiPicker && (
              <div className="bg-[#1f2c34] border-t border-slate-800 shadow-2xl rounded-t-2xl z-50 flex flex-col h-56 w-full shrink-0">
                
                {/* Emoji Categories Tabs */}
                <div className="flex justify-around border-b border-slate-800 py-2 bg-[#111b21] overflow-x-auto text-xs shrink-0">
                  <button onClick={() => setEmojiCategory('recents')} className={`px-2 ${emojiCategory === 'recents' ? 'text-blue-400 font-bold border-b-2 border-blue-400' : 'text-slate-400'}`}>🕒</button>
                  <button onClick={() => setEmojiCategory('smileys')} className={`px-2 ${emojiCategory === 'smileys' ? 'text-blue-400 font-bold border-b-2 border-blue-400' : 'text-slate-400'}`}>😀</button>
                  <button onClick={() => setEmojiCategory('animals')} className={`px-2 ${emojiCategory === 'animals' ? 'text-blue-400 font-bold border-b-2 border-blue-400' : 'text-slate-400'}`}>🐶</button>
                  <button onClick={() => setEmojiCategory('food')} className={`px-2 ${emojiCategory === 'food' ? 'text-blue-400 font-bold border-b-2 border-blue-400' : 'text-slate-400'}`}>🍔</button>
                  <button onClick={() => setEmojiCategory('travel')} className={`px-2 ${emojiCategory === 'travel' ? 'text-blue-400 font-bold border-b-2 border-blue-400' : 'text-slate-400'}`}>🚗</button>
                  <button onClick={() => setEmojiCategory('activities')} className={`px-2 ${emojiCategory === 'activities' ? 'text-blue-400 font-bold border-b-2 border-blue-400' : 'text-slate-400'}`}>⚽</button>
                  <button onClick={() => setEmojiCategory('objects')} className={`px-2 ${emojiCategory === 'objects' ? 'text-blue-400 font-bold border-b-2 border-blue-400' : 'text-slate-400'}`}>💡</button>
                  <button onClick={() => setEmojiCategory('symbols')} className={`px-2 ${emojiCategory === 'symbols' ? 'text-blue-400 font-bold border-b-2 border-blue-400' : 'text-slate-400'}`}>❤️</button>
                  <button onClick={() => setEmojiCategory('flags')} className={`px-2 ${emojiCategory === 'flags' ? 'text-blue-400 font-bold border-b-2 border-blue-400' : 'text-slate-400'}`}>🏳️</button>
                </div>

                {/* Emoji Grid */}
                <div className="p-2.5 grid grid-cols-8 gap-1.5 overflow-y-auto flex-1 bg-[#0b141a]">
                  {emojiCategories[emojiCategory].map((emoji, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setMessageText(prev => prev + emoji)}
                      className="text-2xl p-1 hover:bg-slate-700/50 rounded transition-all text-center cursor-pointer flex items-center justify-center"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}

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