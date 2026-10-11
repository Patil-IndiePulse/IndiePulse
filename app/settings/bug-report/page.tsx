'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function BugReportPage() {
  const [category, setCategory] = useState('Game Crash / Freeze');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  
  const [tickets, setTickets] = useState([
    { id: 101, title: 'Game lagging during multiplayer session', category: 'Performance', status: 'In Progress', date: 'Oct 08, 2026' },
    { id: 102, title: 'Profile avatar image not uploading', category: 'UI / Display Bug', status: 'Resolved', date: 'Oct 02, 2026' },
  ]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setAttachedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(attachedFiles.filter((_, i) => i !== index));
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newTicket = {
      id: Date.now(),
      title: description.slice(0, 42) + '...',
      category: category,
      status: 'Pending',
      date: 'Just now',
    };

    setTickets([newTicket, ...tickets]);
    setDescription('');
    setAttachedFiles([]);
    alert('Support ticket submitted successfully!');
  };

  return (
    <main className="min-h-screen bg-[#070514] text-white flex flex-col px-4 py-8 max-w-2xl mx-auto w-full relative select-none">
      
      {/* Background glow */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-pink-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Back Button and Header */}
      <div className="flex flex-col items-start gap-4 mb-6">
        <Link 
          href="/menu" 
          className="px-5 py-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(236,72,153,0.4)] border border-pink-400/40 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          Back
        </Link>
        <div>
          <h1 className="text-2xl font-black tracking-wide text-white">Bug Report & Support</h1>
          <p className="text-xs text-slate-300 mt-1">Encountered an error or technical glitch? Submit a ticket to our development team.</p>
        </div>
      </div>

      {/* Submit Ticket Form */}
      <div className="bg-[#120e26]/90 border border-purple-500/30 rounded-2xl p-5 shadow-[0_0_25px_rgba(147,51,234,0.15)] mb-6">
        <div className="text-pink-400 text-[11px] font-bold uppercase tracking-wider mb-4">
          Create New Support Ticket
        </div>

        <form onSubmit={handleSubmitTicket} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] text-slate-300 mb-1 font-semibold">Issue Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#070514] border border-purple-500/40 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
              >
                <option value="Game Crash / Freeze">Game Crash / Freeze</option>
                <option value="UI / Display Bug">UI / Display Bug</option>
                <option value="Account & Login">Account & Login</option>
                <option value="Lag & Performance">Lag & Performance</option>
                <option value="Multiplayer Connection">Multiplayer Connection</option>
                <option value="Audio / Sound Glitch">Audio / Sound Glitch</option>
                <option value="Payment & Billing">Payment & Billing</option>
                <option value="Security Vulnerability">Security Vulnerability</option>
                <option value="Copyright / Content Issue">Copyright / Content Issue</option>
                <option value="General Feedback">General Feedback / Other</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] text-slate-300 mb-1 font-semibold">Priority Level</label>
              <select 
                value={priority} 
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-[#070514] border border-purple-500/40 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-pink-500"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical (Game Breaking)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] text-slate-300 mb-1 font-semibold">
              Describe Your Issue <span className="text-pink-400 font-normal">(Unlimited words supported)</span>
            </label>
            <textarea
              rows={4}
              placeholder="Provide detailed information about what went wrong, steps to reproduce, etc..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#070514] border border-purple-500/40 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-pink-500 resize-y"
              required
            />
          </div>

          {/* Upload Photos / Screenshots (Optimized for Mobile Gallery & PC Explorer) */}
          <div>
            <label className="block text-[11px] text-slate-300 mb-1 font-semibold">
              Attach Screenshots / Photos <span className="text-pink-400 font-normal">(Mobile & PC Gallery supported)</span>
            </label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-purple-500/30 hover:border-pink-500/50 bg-[#070514] rounded-xl p-4 cursor-pointer transition-all">
              <span className="text-xl mb-1">📁</span>
              <span className="text-xs text-slate-300 font-medium">Click to open Mobile Gallery / PC Folder</span>
              <span className="text-[10px] text-slate-500 mt-0.5">Supports multiple images & videos</span>
              <input 
                type="file" 
                multiple 
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden" 
              />
            </label>

            {/* Display Attached Files List */}
            {attachedFiles.length > 0 && (
              <div className="mt-3 space-y-2">
                <div className="text-[10px] text-pink-400 font-bold uppercase tracking-wider">
                  Attached Files ({attachedFiles.length})
                </div>
                <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
                  {attachedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-[#070514] border border-purple-500/30 px-3 py-1.5 rounded-lg text-xs">
                      <span className="text-slate-300 truncate max-w-[260px]">{file.name}</span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-red-400 hover:text-red-300 text-xs font-bold cursor-pointer ml-2"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(236,72,153,0.4)] cursor-pointer transition-all"
            >
              Submit Ticket
            </button>
          </div>
        </form>
      </div>

      {/* Previous Tickets History */}
      <div className="bg-[#120e26]/90 border border-purple-500/30 rounded-2xl overflow-hidden divide-y divide-purple-900/40 shadow-[0_0_25px_rgba(147,51,234,0.15)] mb-6">
        <div className="p-3.5 bg-gradient-to-r from-pink-900/40 to-purple-900/40 text-pink-400 text-[11px] font-bold uppercase tracking-wider">
          Your Submitted Tickets ({tickets.length})
        </div>

        {tickets.map((ticket) => (
          <div key={ticket.id} className="p-4 flex items-center justify-between hover:bg-purple-950/30 transition-colors">
            <div>
              <div className="text-xs font-semibold text-white flex items-center gap-2">
                {ticket.title}
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-950 border border-purple-500/30 text-purple-300">
                  {ticket.category}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1">Submitted on {ticket.date}</div>
            </div>
            
            <div className={`text-[11px] font-bold px-3 py-1 rounded-lg border ${
              ticket.status === 'Resolved' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
              ticket.status === 'In Progress' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
              'bg-pink-500/10 text-pink-400 border-pink-500/30'
            }`}>
              {ticket.status}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}