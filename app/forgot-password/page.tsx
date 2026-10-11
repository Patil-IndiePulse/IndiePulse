'use client';

import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-2xl">
        <h1 className="text-2xl font-bold mb-2">Reset Password</h1>
        <p className="text-sm text-slate-400 mb-6">Enter your email to receive a password reset link.</p>
        
        <input 
          type="email" 
          placeholder="Enter your email" 
          className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg mb-4 text-white outline-none focus:border-indigo-500 transition-all"
        />
        
        <button className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 rounded-lg font-semibold transition-all shadow-lg shadow-indigo-600/20 cursor-pointer mb-4">
          Send Reset Link
        </button>

        {/* Back to Login Button */}
        <div className="text-center">
          <Link 
            href="/login" 
            className="inline-block w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white rounded-lg font-semibold border border-slate-700 transition-all text-center cursor-pointer"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}