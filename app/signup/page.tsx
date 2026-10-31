'use client';

import Link from 'next/link';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-2xl">
        <h1 className="text-2xl font-bold mb-2">Create Account</h1>
        <p className="text-sm text-slate-400 mb-6">Sign up to get started with IndiePulse.</p>
        
        {/* Social Login Buttons */}
        <div className="space-y-3 mb-6">
          <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-3 cursor-pointer">
            {/* Google SVG Logo */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.18v3.15C3.17 21.32 7.23 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.18C.43 8.12 0 9.81 0 12s.43 3.88 1.18 5.4l4.09-3.16z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.23 0 3.17 2.68 1.18 6.6l4.09 3.15c.95-2.85 3.6-4.96 6.73-4.96z"
              />
            </svg>
            Sign up with Google
          </button>
          
          <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-3 cursor-pointer">
            <span>🍎</span> Sign up with Apple
          </button>
        </div>

        {/* Divider with Blue Text */}
        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-slate-800"></div>
          <span className="px-3 text-xs font-semibold text-indigo-400 uppercase tracking-wide">Or continue with email</span>
          <div className="flex-1 border-t border-slate-800"></div>
        </div>

        {/* Regular Signup Form */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
            <input 
              type="text" 
              placeholder="Enter your name" 
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
            <input 
              type="password" 
              placeholder="Create a strong password" 
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none focus:border-indigo-500 transition-all"
            />
          </div>
          
          <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-blue-600/20 cursor-pointer mt-2">
            Create account
          </button>
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-400 hover:underline font-medium">
            Login
          </Link>
        </div>

        {/* Back to Home Blue Button */}
        <div className="mt-4">
          <Link href="/">
            <button className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-blue-600/20 cursor-pointer text-sm">
              Back to Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}