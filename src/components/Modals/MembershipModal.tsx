import React, { useState } from 'react';
import { 
  X, 
  Check, 
  Crown, 
  Sparkles, 
  Shield, 
  Gift, 
  ArrowRight, 
  Clock, 
  AlertCircle,
  Calendar
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SubscriptionTier, BillingCycle } from '../../types';
import { formatMYR } from '../../services/paymentService';
import { subscriptionService } from '../../services/subscriptionService';

interface MembershipModalProps {
  onOpenCheckout?: (tier: SubscriptionTier, cycle: BillingCycle) => void;
}

export const MembershipModal: React.FC<MembershipModalProps> = ({ onOpenCheckout }) => {
  const { 
    showMembershipModal, 
    setShowMembershipModal, 
    user, 
    subscriptionPlans,
    activeSubscription,
    cancelCurrentSubscription,
    applyReferralCode, 
    showToast 
  } = useApp();

  const [billingCycle, setBillingCycle] = useState<BillingCycle>('annual');
  const [referralInput, setReferralInput] = useState('');
  const [referralStatus, setReferralStatus] = useState<{ message: string; success: boolean } | null>(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!showMembershipModal) return null;

  const isSubscribed = user.membershipStatus === 'premium' || user.membershipStatus === 'premium_plus';
  const remainingTrialDays = subscriptionService.getRemainingTrialDays(user);
  const isTrial = activeSubscription?.status === 'trial' || remainingTrialDays > 0;

  const freePlan = subscriptionPlans.find(p => p.slug === 'free') || subscriptionPlans[0];
  const premiumPlan = subscriptionPlans.find(p => p.slug === 'premium') || subscriptionPlans[1];
  const premiumPlusPlan = subscriptionPlans.find(p => p.slug === 'premium_plus') || subscriptionPlans[2];

  const handleApplyReferral = async () => {
    if (!referralInput.trim()) return;
    const res = await applyReferralCode(referralInput);
    setReferralStatus({ message: res.message, success: res.success });
  };

  const handleSelectTier = (tier: SubscriptionTier) => {
    if (onOpenCheckout) {
      setShowMembershipModal(false);
      onOpenCheckout(tier, billingCycle);
    }
  };

  const handleCancelSub = async () => {
    await cancelCurrentSubscription();
    setShowCancelConfirm(false);
    showToast('Subscription cancelled. You will retain access until the end of your billing cycle.');
  };

  return (
    <div 
      onClick={() => setShowMembershipModal(false)}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#0e1124] border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 text-white max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl"
      >
        {/* Close Button */}
        <button 
          onClick={() => setShowMembershipModal(false)}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center pt-2 pb-3">
          <div className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-gradient-to-tr from-[#dfb76c]/20 to-[#a599e0]/20 border border-[#dfb76c]/30 mb-2.5 shadow-gold-glow">
            <Crown className="w-6 h-6 text-[#dfb76c] fill-[#dfb76c]" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Your SoulFlow Practice
          </h2>
          <p className="text-xs text-stone-300 mt-1 max-w-xs mx-auto">
            Deepen your sleep, eliminate chronic stress, and immerse in master-level acoustic healing.
          </p>

          {/* Active Subscription Status Banner if subscribed or in trial */}
          {isSubscribed && (
            <div className="mt-4 p-3.5 rounded-2xl bg-[#161a36] border border-[#dfb76c]/30 text-left">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#dfb76c] block">
                    Current Plan
                  </span>
                  <h4 className="text-sm font-bold text-white capitalize">
                    {user.membershipStatus === 'premium_plus' ? 'Premium+ Master' : 'Premium Journey'}
                  </h4>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-[#dfb76c]/20 text-[#f3cf7a] font-semibold border border-[#dfb76c]/40">
                  {isTrial ? 'Free Trial' : 'Active'}
                </span>
              </div>

              {/* Renewal or trial expiration info */}
              <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-xs text-stone-300">
                <span className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>
                    {isTrial 
                      ? `${remainingTrialDays} days remaining in trial`
                      : `Renews: ${user.membershipExpiresAt ? new Date(user.membershipExpiresAt).toLocaleDateString() : 'Annual'}`}
                  </span>
                </span>
                <span className="capitalize text-stone-400">
                  Cycle: {user.billingCycle || 'Annual'}
                </span>
              </div>

              {/* Manage / Cancel Action */}
              <div className="mt-3 flex items-center space-x-2">
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="text-[11px] text-stone-400 hover:text-rose-400 transition-colors underline"
                >
                  Cancel Subscription
                </button>
              </div>

              {/* Cancel Confirmation Prompt */}
              {showCancelConfirm && (
                <div className="mt-3 p-3 rounded-xl bg-black/40 border border-rose-500/30 text-xs">
                  <p className="text-stone-300 mb-2">
                    Are you sure you want to cancel? You will keep benefits until your billing period ends.
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCancelSub}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 font-semibold hover:bg-rose-500/30"
                    >
                      Confirm Cancellation
                    </button>
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 text-stone-300 font-medium"
                    >
                      Keep Plan
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Billing Cycle Toggle */}
          <div className="mt-4 inline-flex items-center p-1 rounded-full bg-[#181c35] border border-white/10">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                billingCycle === 'monthly' ? 'bg-[#d4af37] text-[#0a0c16] font-semibold' : 'text-stone-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center space-x-1.5 ${
                billingCycle === 'annual' ? 'bg-[#d4af37] text-[#0a0c16] font-semibold' : 'text-stone-400'
              }`}
            >
              <span>Annual</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black/80 text-[#dfb76c] font-bold">
                Save 17%
              </span>
            </button>
          </div>
        </div>

        {/* Mentor Referral Code Box (Only if not already referred or subscribed) */}
        {!isSubscribed && (
          <div className="mb-4 p-3.5 rounded-2xl bg-[#141830] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-300 flex items-center space-x-1.5 font-medium">
                <Gift className="w-3.5 h-3.5 text-[#dfb76c]" />
                <span>Mentor Referral Code</span>
              </span>
              <span className="text-[11px] text-[#a599e0]">Try "MAYA888" or "ALICE888"</span>
            </div>

            <div className="flex items-center space-x-2">
              <input 
                type="text"
                value={referralInput}
                onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
                placeholder="e.g. MAYA888"
                className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-stone-500 font-mono tracking-wider focus:outline-none focus:border-[#dfb76c]"
              />
              <button
                onClick={handleApplyReferral}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-medium text-[#dfb76c] transition-colors flex items-center space-x-1"
              >
                <span>Apply</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {referralStatus && (
              <p className={`text-[11px] font-medium ${referralStatus.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                {referralStatus.message}
              </p>
            )}
          </div>
        )}

        {/* 3 Tier Cards */}
        <div className="space-y-3.5">
          {/* FREE */}
          <div className={`p-4 rounded-2xl border transition-all ${
            user.membershipStatus === 'free' ? 'border-white/20 bg-white/5' : 'border-white/5 bg-[#121528]'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-200">{freePlan.name}</h3>
                <p className="text-[11px] text-stone-400">Basic daily wellness</p>
              </div>
              <span className="text-sm font-semibold text-stone-300">RM0</span>
            </div>
            <ul className="mt-3 space-y-1.5 text-xs text-stone-400">
              {freePlan.features.map((f, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-stone-500" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* PREMIUM (Recommended) */}
          <div className="relative p-4 rounded-2xl border-2 border-[#d4af37] bg-gradient-to-b from-[#1c1b2f] to-[#12152b] shadow-gold-glow">
            <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-[#d4af37] text-[#0a0c16] text-[10px] font-bold uppercase tracking-wider">
              Most Popular
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-base font-bold text-white">{premiumPlan.name}</h3>
                  <Crown className="w-4 h-4 text-[#dfb76c] fill-[#dfb76c]" />
                </div>
                <p className="text-xs text-stone-300">Complete healing catalog & programs</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-white">
                  {billingCycle === 'annual' ? formatMYR(premiumPlan.annual_price) : formatMYR(premiumPlan.monthly_price)}
                </span>
                <span className="text-[11px] text-stone-400 block">
                  {billingCycle === 'annual' ? '/year (RM16.58/mo)' : '/month'}
                </span>
              </div>
            </div>

            <ul className="mt-3.5 space-y-2 text-xs text-stone-200">
              {premiumPlan.features.map((f, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-[#dfb76c] flex-shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelectTier('premium')}
              className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-[#dfb76c] via-[#f3cf7a] to-[#d4af37] text-[#0a0c16] font-bold text-xs shadow-lg hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center space-x-1.5"
            >
              <span>Upgrade to Premium</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* PREMIUM+ */}
          <div className="p-4 rounded-2xl border border-[#a599e0]/40 bg-[#15172e]">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-1.5">
                  <h3 className="text-sm font-bold text-white">{premiumPlusPlan.name}</h3>
                  <Sparkles className="w-3.5 h-3.5 text-[#a599e0]" />
                </div>
                <p className="text-[11px] text-stone-300">All features + Master Mentor Courses</p>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-white">
                  {billingCycle === 'annual' ? formatMYR(premiumPlusPlan.annual_price) : formatMYR(premiumPlusPlan.monthly_price)}
                </span>
                <span className="text-[10px] text-stone-400 block">
                  {billingCycle === 'annual' ? '/year (RM33.25/mo)' : '/month'}
                </span>
              </div>
            </div>

            <ul className="mt-3 space-y-1.5 text-xs text-stone-300">
              {premiumPlusPlan.features.map((f, i) => (
                <li key={i} className="flex items-center space-x-2">
                  <Check className="w-3.5 h-3.5 text-[#a599e0]" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSelectTier('premium_plus')}
              className="mt-3.5 w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-[#a599e0] hover:text-white border border-[#a599e0]/30 font-semibold text-xs transition-all flex items-center justify-center space-x-1"
            >
              <span>Choose Premium+</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Security & Cancellation footnote */}
        <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-center space-x-3 text-[10px] text-stone-500">
          <span className="flex items-center space-x-1">
            <Shield className="w-3 h-3 text-[#dfb76c]" />
            <span>Cancel anytime</span>
          </span>
          <span>•</span>
          <span>Apple Pay & Stripe secured</span>
          <span>•</span>
          <span>Restore Purchase</span>
        </div>
      </div>
    </div>
  );
};
