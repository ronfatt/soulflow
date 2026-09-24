import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Gift, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const { 
    showAuthModal, 
    setShowAuthModal, 
    applyReferralCode, 
    referralCodes, 
    user,
    showToast 
  } = useApp();

  const [mode, setMode] = useState<'signup' | 'login' | 'forgot'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [referralFeedback, setReferralFeedback] = useState<string | null>(null);

  // Auto-populate referral code if present in URL param ?ref=... or user profile
  useEffect(() => {
    if (user?.referredByCode && !referralCode) {
      setReferralCode(user.referredByCode);
      if (referralCodes[user.referredByCode]) {
        setReferralFeedback(`Valid code from ${referralCodes[user.referredByCode].mentorName}: 7 Days Premium Unlocked! ✨`);
      }
    } else if (!referralCode && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const codeFromUrl = urlParams.get('ref');
      if (codeFromUrl) {
        const upper = codeFromUrl.toUpperCase();
        setReferralCode(upper);
        if (referralCodes[upper]) {
          setReferralFeedback(`Valid code from ${referralCodes[upper].mentorName}: 7 Days Premium Unlocked! ✨`);
        }
      }
    }
  }, [showAuthModal, user?.referredByCode, referralCodes]);

  if (!showAuthModal) return null;

  const handleReferralChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.toUpperCase();
    setReferralCode(val);
    if (referralCodes[val]) {
      setReferralFeedback(`Valid code from ${referralCodes[val].mentorName}: 7 Days Premium Unlocked! ✨`);
    } else if (val.length >= 4) {
      setReferralFeedback(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (referralCode.trim()) {
      applyReferralCode(referralCode.trim());
    }
    setShowAuthModal(false);
    showToast(mode === 'signup' ? 'Welcome to SoulFlow! Account created.' : 'Signed in successfully.');
  };

  return (
    <div 
      onClick={() => setShowAuthModal(false)}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md bg-[#0e1124] border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 text-white max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl"
      >
        <button 
          onClick={() => setShowAuthModal(false)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="text-center pt-2 pb-4">
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {mode === 'signup' && 'Join SoulFlow Sanctuary'}
            {mode === 'login' && 'Welcome Back'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs text-stone-400 mt-1">
            {mode === 'signup' && 'Step into peace, guided meditation, and sound healing.'}
            {mode === 'login' && 'Resume your mind, body and spiritual practice.'}
            {mode === 'forgot' && 'Enter your email to receive recovery instructions.'}
          </p>
        </div>

        {/* Referred by Mentor Banner */}
        {mode === 'signup' && referralCode && referralCodes[referralCode] && (
          <div className="mb-4 p-3 rounded-2xl bg-[#dfb76c]/10 border border-[#dfb76c]/30 flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#dfb76c]/20 flex items-center justify-center text-[#dfb76c] font-bold text-xs shrink-0">
              ✨
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#f3cf7a]">
                Referred by {referralCodes[referralCode].mentorName}
              </p>
              <p className="text-[11px] text-stone-300">
                VIP Access: 7 Days Free Premium Membership Unlocked
              </p>
            </div>
          </div>
        )}

        {/* Social Login Buttons (Apple & Google) */}
        {mode !== 'forgot' && (
          <div className="space-y-2 mb-4">
            <button
              onClick={() => {
                setShowAuthModal(false);
                showToast('Signed in with Apple');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-white text-black font-semibold text-xs flex items-center justify-center space-x-2 hover:bg-stone-200 transition-all shadow-md"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.58-.71.97-1.7.86-2.69-.85.04-1.89.57-2.49 1.28-.53.61-.99 1.62-.87 2.58.95.07 1.92-.47 2.5-1.17z"/>
              </svg>
              <span>Continue with Apple</span>
            </button>

            <button
              onClick={() => {
                setShowAuthModal(false);
                showToast('Signed in with Google');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#1b203c] border border-white/10 text-white font-medium text-xs flex items-center justify-center space-x-2 hover:bg-[#22284b] transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative px-3 bg-[#0e1124] text-[10px] uppercase text-stone-500 font-semibold tracking-wider">
                Or with email
              </span>
            </div>
          </div>
        )}

        {/* Email Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="text-xs text-stone-300 font-medium block mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-stone-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alicia Sterling"
                  className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#dfb76c]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs text-stone-300 font-medium block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-stone-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#dfb76c]"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-stone-300 font-medium">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-[#a599e0] hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-stone-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#dfb76c]"
                />
              </div>
            </div>
          )}

          {/* Referral Code (Optional on sign up) */}
          {mode === 'signup' && (
            <div className="pt-1">
              <label className="text-xs text-stone-300 font-medium block mb-1">
                Referral Code <span className="text-stone-500 font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <Gift className="absolute left-3 top-2.5 w-4 h-4 text-[#dfb76c]" />
                <input
                  type="text"
                  value={referralCode}
                  onChange={handleReferralChange}
                  placeholder="e.g. ALICE888"
                  className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-stone-500 font-mono tracking-wider focus:outline-none focus:border-[#dfb76c]"
                />
              </div>
              {referralFeedback && (
                <p className="text-[11px] text-emerald-400 font-medium mt-1 flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>{referralFeedback}</span>
                </p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-[#dfb76c] via-[#f3cf7a] to-[#d4af37] text-[#0a0c16] font-bold text-xs shadow-gold-glow hover:brightness-105 active:scale-[0.99] transition-all"
          >
            {mode === 'signup' && 'Create Free Account'}
            {mode === 'login' && 'Sign In'}
            {mode === 'forgot' && 'Send Reset Link'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-4 pt-3 border-t border-white/5 text-center text-xs text-stone-400">
          {mode === 'signup' ? (
            <p>
              Already have an account?{' '}
              <button onClick={() => setMode('login')} className="text-[#dfb76c] font-semibold hover:underline">
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New to SoulFlow?{' '}
              <button onClick={() => setMode('signup')} className="text-[#dfb76c] font-semibold hover:underline">
                Create Account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
