'use client';

import { useState } from 'react';
import Link from 'next/link';
import { auth } from "@/app/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  OAuthProvider, 
  updateProfile 
} from "firebase/auth";

const ACCOUNT_CENTER_KEY = 'indiePulse_account_center_v1';
const SECURITY_META_KEY = 'indiePulse_security_meta_v1';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupError, setSignupError] = useState('');

  // Helper function to save accounts locally so multiple accounts persist (Steam/Google style)
  const saveAccountLocally = (userEmail: string, userName: string, userPhoto: string = '') => {
    try {
      const existingAccounts = JSON.parse(localStorage.getItem('indiepulse_accounts') || '[]');
      
      // Check if account already exists in stored list
      const isAlreadySaved = existingAccounts.some((acc: any) => acc.email === userEmail);
      
      if (!isAlreadySaved) {
        const newAccount = {
          email: userEmail,
          name: userName || userEmail.split('@')[0],
          photo: userPhoto || `https://api.dicebear.com/7.x/bottts/svg?seed=${userEmail}`
        };
        existingAccounts.push(newAccount);
        localStorage.setItem('indiepulse_accounts', JSON.stringify(existingAccounts));
      }
      // Set active current account
      localStorage.setItem('indiepulse_current_account', userEmail);

      // Sync with Accounts Center & Profile keys while keeping safe defaults
      const cleanName = (userName || userEmail.split('@')[0] || 'Indie Creator').trim();
      const cleanEmail = (userEmail || 'creator@indiepulse.com').trim();
      localStorage.setItem('indiePulse_name', cleanName);
      localStorage.setItem('indiePulse_profile_name', cleanName);
      localStorage.setItem('indiePulse_user_name', cleanName);

      const existingCenterRaw = localStorage.getItem(ACCOUNT_CENTER_KEY);
      const existingCenter = existingCenterRaw ? JSON.parse(existingCenterRaw) : {};
      localStorage.setItem(
        ACCOUNT_CENTER_KEY,
        JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          bio: existingCenter?.bio || 'Passionate developer',
          updatedAt: new Date().toISOString(),
        })
      );

      if (!localStorage.getItem(SECURITY_META_KEY)) {
        localStorage.setItem(
          SECURITY_META_KEY,
          JSON.stringify({
            lastChangedAt: 'Created on sign-up',
            twoFactorEnabled: true,
            loginAlerts: true,
            passDigest: `signup_${Date.now().toString(36)}`,
          })
        );
      }

      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error("Error saving account locally:", error);
    }
  };

  // Enterprise-style background sync hook for new sign-ups (safe fallback when offline)
  const syncSignupToBackend = async (userEmail: string, userName: string, providerType: string) => {
    try {
      await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          name: userName,
          provider: providerType,
          createdAt: new Date().toISOString(),
        }),
      });
    } catch {
      // Safe fallback: local state remains intact if backend route is not yet live
    }
  };

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: 'Create a password (min 6 chars)', color: 'text-slate-400', width: '0%' };
    let score = 0;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    if (score <= 1) return { label: 'Weak Password', color: 'text-rose-400', width: '30%' };
    if (score <= 2) return { label: 'Medium Strength', color: 'text-amber-300', width: '65%' };
    return { label: 'Strong Password', color: 'text-emerald-400', width: '100%' };
  };

  // 1. Email & Password Signup Handler
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');

    if (password.length < 6) {
      setSignupError('Password must be at least 6 characters long for account security.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Update user display name
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: name });
      }

      // Save to local multi-account storage & sync account defaults
      saveAccountLocally(email, name);
      syncSignupToBackend(email, name, 'email');

      alert(`Account created successfully for: ${userCredential.user.email}`);
      window.location.href = "/login";
    } catch (error: any) {
      alert("Signup Failed: " + error.message);
    }
  };

  // 2. Google Signup Handler
  const handleGoogleSignup = async () => {
    setSignupError('');
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save Google account to local storage list
      saveAccountLocally(user.email || '', user.displayName || 'Google User', user.photoURL || '');
      syncSignupToBackend(user.email || '', user.displayName || 'Google User', 'google');

      alert(`Successfully signed up with Google: ${user.email}`);
      window.location.href = "/login";
    } catch (error: any) {
      alert("Google Signup Failed: " + error.message);
    }
  };

  // 3. Apple Signup Handler
  const handleAppleSignup = async () => {
    setSignupError('');
    const provider = new OAuthProvider('apple.com');
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save Apple account to local storage list
      saveAccountLocally(user.email || '', user.displayName || 'Apple User');
      syncSignupToBackend(user.email || '', user.displayName || 'Apple User', 'apple');

      alert(`Successfully signed up with Apple: ${user.email}`);
      window.location.href = "/login";
    } catch (error: any) {
      alert("Apple Signup Failed: " + error.message);
    }
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl max-w-md w-full shadow-2xl">
        <h1 className="text-2xl font-bold mb-2">Create Account</h1>
        <p className="text-sm text-slate-400 mb-6">Sign up to get started with IndiePulse.</p>

        {signupError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-medium">
            {signupError}
          </div>
        )}
        
        {/* Social Login Buttons */}
        <div className="space-y-3 mb-6">
          <button 
            onClick={handleGoogleSignup}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
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
          
          <button 
            onClick={handleAppleSignup}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-3 cursor-pointer"
          >
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
        <form onSubmit={handleEmailSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name" 
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email" 
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password" 
              required
              className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white outline-none focus:border-indigo-500 transition-all"
            />
            <div className="mt-1.5">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className={`${strength.color} font-semibold`}>{strength.label}</span>
                <span className="text-slate-400">Min 6 chars</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-300"
                  style={{ width: strength.width }}
                />
              </div>
            </div>
          </div>
          
          <button 
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg shadow-blue-600/20 cursor-pointer mt-2"
          >
            Create account
          </button>
        </form>

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