'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function QuestsPage() {
  const [quests, setQuests] = useState([
    { id: 1, title: "🚀 Publish Your First Indie Game", xp: 500, completed: false, desc: "Upload your game build or prototype to the IndiePulse discover catalog.", actionText: "Upload Game Build" },
    { id: 2, title: "🤝 Connect with 3 Nearby Developers", xp: 150, completed: false, desc: "Interact and send connection requests to local game developers.", actionText: "Find Developers" },
    { id: 3, title: "📢 Share a DevLog Update in Community", xp: 100, completed: true, desc: "Post your daily game dev progress in the community feed.", actionText: "Open Community" }
  ]);

  const [selectedQuest, setSelectedQuest] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskStarted, setTaskStarted] = useState(false);

  const handleStartQuest = (quest: any) => {
    setSelectedQuest(quest);
    setTaskStarted(false);
    setIsModalOpen(true);
  };

  const handleExecuteTask = () => {
    setTaskStarted(true); // युझरने टास्क ॲक्शन पूर्ण केल्याशिवाय 'Complete Quest' बटण येणार नाही
  };

  const handleCompleteQuest = () => {
    if (selectedQuest) {
      setQuests(prev =>
        prev.map(q => q.id === selectedQuest.id ? { ...q, completed: true } : q)
      );
      setIsModalOpen(false);
      setSelectedQuest(null);
      setTaskStarted(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col px-4 py-6 max-w-xl mx-auto w-full relative overflow-x-hidden select-none">
      
      {/* Background Decorative Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header Row with Clear Pink 'Back' Button */}
      <div className="w-full flex items-start mb-6 relative z-10">
        <Link 
          href="/" 
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-sm font-bold shadow-[0_0_20px_rgba(236,72,153,0.5)] border border-pink-400/40 transition-all flex items-center justify-center cursor-pointer"
        >
          Back
        </Link>
      </div>

      {/* Quests Container */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl w-full shadow-2xl shadow-amber-950/50 text-center relative z-10 mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold mb-3">
          🌟 DAILY & SPECIAL QUESTS 🎯
        </div>
        <h2 className="text-2xl font-black mb-2 tracking-tight">🗺️ IndiePulse Quests ⚔️</h2>
        <p className="text-slate-400 text-sm mb-6">Complete quests, level up your profile, and earn exciting XP rewards! 🎁</p>
        
        {/* Quests List */}
        <div className="flex flex-col gap-4 mb-2 text-left max-h-[380px] overflow-y-auto pr-1">
          {quests.map((quest) => (
            <div 
              key={quest.id} 
              className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all ${
                quest.completed 
                  ? 'bg-slate-900/40 border-emerald-500/30 opacity-75' 
                  : 'bg-slate-800/50 border-slate-700/50 hover:bg-slate-800'
              }`}
            >
              <div className="space-y-1">
                <h3 className={`font-bold text-sm ${quest.completed ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                  {quest.title}
                </h3>
                <span className="text-xs text-amber-400 font-semibold block">✨ +{quest.xp} XP Reward ⚡</span>
              </div>
              <button 
                onClick={() => !quest.completed && handleStartQuest(quest)}
                disabled={quest.completed}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 self-start sm:self-center ${
                  quest.completed 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/35 cursor-default' 
                    : 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-md shadow-amber-600/30 cursor-pointer'
                }`}
              >
                {quest.completed ? 'Completed 🎉' : 'Start Quest 🚀'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quest Interactive Popup Modal */}
      {isModalOpen && selectedQuest && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center relative animate-in fade-in zoom-in duration-200">
            
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-lg font-black text-white mb-2">{selectedQuest.title}</h3>
            <p className="text-slate-300 text-xs mb-4 leading-relaxed">
              {selectedQuest.desc}
            </p>
            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 font-bold text-xs mb-6">
              Reward upon completion: +{selectedQuest.xp} XP ⚡
            </div>

            {!taskStarted ? (
              <div className="flex flex-col gap-3">
                <button
                  type="button"
                  onClick={handleExecuteTask}
                  className="w-full py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  🎮 {selectedQuest.actionText}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs shadow-[0_0_15px_rgba(236,72,153,0.5)] border border-pink-400/40 transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold">
                  Task Action Performed! Now you can complete quest. ✅
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs shadow-[0_0_15px_rgba(236,72,153,0.5)] border border-pink-400/40 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCompleteQuest}
                    className="flex-1 py-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold rounded-xl text-xs shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all text-xs cursor-pointer border border-pink-400/40"
                  >
                    Complete Quest ✅
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </main>
  );
}