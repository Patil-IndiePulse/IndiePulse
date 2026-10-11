'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#070514] text-white flex flex-col px-4 sm:px-8 py-10 pb-32 max-w-5xl mx-auto w-full relative select-none">
      {/* Background Glow - Cyan/Blue Tone */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Back Button without Arrow Mark */}
      <div className="mb-8">
        <Link 
          href="/" 
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(59,130,246,0.4)] border border-blue-400/40 transition-all inline-block cursor-pointer"
        >
          Back
        </Link>
      </div>

      <h1 className="text-3xl sm:text-4xl font-black tracking-wide text-white mb-3">Contact Support</h1>
      <p className="text-xs sm:text-sm text-slate-300 mb-8">Have questions, bug reports, or need assistance? Reach out directly to the IndiePulse team.</p>

      {submitted ? (
        <div className="bg-blue-950/80 border border-blue-600 text-blue-200 p-6 rounded-3xl text-xs sm:text-sm font-medium shadow-[0_0_30px_rgba(59,130,246,0.2)]">
          ✅ Thank you! Your message and attachment have been sent successfully. We will get back to you soon.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-[#120e26]/90 border border-blue-500/30 rounded-3xl p-6 sm:p-10 shadow-[0_0_30px_rgba(59,130,246,0.15)] space-y-6 w-full">
          <div>
            <label className="block text-xs sm:text-sm text-slate-300 mb-2 font-semibold">Your Name</label>
            <input 
              type="text" 
              required 
              placeholder="Enter your name..."
              className="w-full bg-[#070514] border border-blue-500/40 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm text-slate-300 mb-2 font-semibold">Email Address</label>
            <input 
              type="email" 
              required 
              placeholder="name@example.com..."
              className="w-full bg-[#070514] border border-blue-500/40 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm text-slate-300 mb-2 font-semibold">Message</label>
            <textarea 
              rows={5} 
              required 
              placeholder="Write your message, feedback, or issue here..."
              className="w-full bg-[#070514] border border-blue-500/40 rounded-2xl px-4 py-3 text-xs sm:text-sm text-white focus:outline-none focus:border-cyan-400 transition-all resize-none"
            ></textarea>
          </div>
          <div>
            <label className="block text-xs sm:text-sm text-slate-300 mb-2 font-semibold">Upload Image / Screenshot (Optional)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedFile(e.target.files[0]);
                }
              }}
              className="w-full bg-[#070514] border border-blue-500/40 rounded-2xl px-4 py-3 text-xs sm:text-slate-400 text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer transition-all"
            />
            {selectedFile && (
              <p className="text-[11px] text-cyan-400 mt-2">Selected File: {selectedFile.name}</p>
            )}
          </div>
          <button 
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(59,130,246,0.4)] cursor-pointer transition-all border border-blue-400/40"
          >
            Send Message
          </button>
        </form>
      )}
    </main>
  );
}