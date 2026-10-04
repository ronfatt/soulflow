import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CreditCard, 
  Sparkles, 
  Gift, 
  Check, 
  ArrowRight, 
  Smartphone, 
  Lock,
  Crown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { SubscriptionTier, BillingCycle, PaymentProvider } from '../../types';
import { formatMYR, paymentService } from '../../services/paymentService';
import { referralService } from '../../services/referralService';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTier: SubscriptionTier;
  initialCycle?: BillingCycle;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  selectedTier,
  initialCycle = 'annual',
}) => {
  const { 
    user, 
    subscriptionPlans, 
    upgradeTierWithPayment, 
    showToast,
    mentors,
    language 
  } = useApp();

  const [billingCycle, setBillingCycle] = useState<BillingCycle>(initialCycle);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number; message: string } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [paymentProvider, setPaymentProvider] = useState<PaymentProvider>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const plan = subscriptionPlans.find(p => p.slug === selectedTier) || subscriptionPlans[1];
  const grossPrice = billingCycle === 'annual' ? plan.annual_price : plan.monthly_price;
  const discount = appliedCoupon ? appliedCoupon.discount : 0;
  const finalPrice = Math.max(0, Number((grossPrice - discount).toFixed(2)));

  const referringMentor = mentors.find(m => m.referralCode === user.referredByCode);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    setCouponError(null);
    const res = referralService.validateCoupon(couponCode, grossPrice);
    if (res.valid) {
      setAppliedCoupon({
        code: couponCode.trim().toUpperCase(),
        discount: res.discountAmount,
        message: res.message,
      });
      showToast(res.message);
    } else {
      setCouponError(res.message);
    }
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    try {
      await upgradeTierWithPayment(selectedTier, billingCycle, paymentProvider, discount);
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#dfb76c', '#a599e0', '#ffffff'],
      });
      showToast(`Welcome to ${plan.name}! Your sanctuary is unlocked ✨`);
      onClose();
    } catch (e: any) {
      showToast(e?.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg bg-[#0e1124] border border-white/10 rounded-t-3xl sm:rounded-3xl p-6 text-white max-h-[92vh] overflow-y-auto no-scrollbar shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-stone-300 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="pt-2 pb-4 text-center">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-gradient-to-tr from-[#dfb76c]/20 to-[#a599e0]/20 border border-[#dfb76c]/30 mb-2 shadow-gold-glow">
            <Crown className="w-6 h-6 text-[#dfb76c]" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            {language === 'zh' ? '完成圣殿会员订阅' : 'Complete Your Sacred Enrollment'}
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            {language === 'zh' ? '开启全方位身心灵蜕变与无限疗愈' : 'Secure sanctuary subscription'}
          </p>
        </div>

        {/* Billing Cycle Picker */}
        <div className="flex justify-center mb-5">
          <div className="inline-flex p-1 rounded-full bg-[#181c35] border border-white/10">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-1 rounded-full text-xs font-medium transition-all ${
                billingCycle === 'monthly' ? 'bg-[#d4af37] text-[#0a0c16] font-bold' : 'text-stone-400'
              }`}
            >
              {language === 'zh' ? '按月订阅' : 'Monthly'} ({formatMYR(plan.monthly_price)}/{language === 'zh' ? '月' : 'mo'})
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`relative px-4 py-1 rounded-full text-xs font-medium transition-all flex items-center space-x-1.5 ${
                billingCycle === 'annual' ? 'bg-[#d4af37] text-[#0a0c16] font-bold' : 'text-stone-400'
              }`}
            >
              <span>{language === 'zh' ? '按年订阅' : 'Annual'} ({formatMYR(plan.annual_price)}/{language === 'zh' ? '年' : 'yr'})</span>
              <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-black/80 text-[#dfb76c] font-bold">
                {language === 'zh' ? '立省 17%' : 'Save 17%'}
              </span>
            </button>
          </div>
        </div>

        {/* Order Summary Box */}
        <div className="p-4 rounded-2xl bg-[#141830] border border-white/10 space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-1.5">
                <span>{language === 'zh' ? (selectedTier === 'premium_plus' ? '圣殿尊享 VIP+' : '圣殿会员 Premium') : plan.name}</span>
                {selectedTier === 'premium_plus' && <Sparkles className="w-3.5 h-3.5 text-[#a599e0]" />}
              </h3>
              <p className="text-[11px] text-stone-400">
                {billingCycle === 'annual' 
                  ? (language === 'zh' ? '按年计费 (365天无限畅听)' : 'Billed annually (365 days)')
                  : (language === 'zh' ? '按月计费 (30天无限畅听)' : 'Billed monthly (30 days)')}
              </p>
            </div>
            <span className="text-sm font-bold text-white">{formatMYR(grossPrice)}</span>
          </div>

          {/* Referred Mentor Benefit */}
          {referringMentor && (
            <div className="p-2.5 rounded-xl bg-[#dfb76c]/10 border border-[#dfb76c]/20 flex items-center justify-between text-xs">
              <span className="flex items-center space-x-1.5 text-[#f3cf7a] font-medium">
                <Gift className="w-3.5 h-3.5 text-[#dfb76c]" />
                <span>{language === 'zh' ? `由导师 ${referringMentor.name} 专属邀请` : `Referred by ${referringMentor.name}`}</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-semibold">
                {language === 'zh' ? '已解锁 7天免费 VIP ✨' : 'VIP Unlocked ✨'}
              </span>
            </div>
          )}

          {/* Discount if applied */}
          {appliedCoupon && appliedCoupon.discount > 0 && (
            <div className="flex items-center justify-between text-xs text-emerald-400">
              <span className="flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>{language === 'zh' ? '优惠减免' : 'Coupon'} ({appliedCoupon.code})</span>
              </span>
              <span className="font-semibold">-{formatMYR(appliedCoupon.discount)}</span>
            </div>
          )}

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-300">
              {language === 'zh' ? '今日实付总额' : 'Total Due Today'}
            </span>
            <span className="text-lg font-bold text-[#dfb76c]">{formatMYR(finalPrice)}</span>
          </div>
        </div>

        {/* Coupon Input */}
        <div className="mb-4">
          <label className="text-xs text-stone-400 font-medium block mb-1">
            {language === 'zh' ? '优惠券或导师专属兑换码' : 'Promo or Mentor Coupon'}
          </label>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Gift className="absolute left-3 top-2.5 w-4 h-4 text-stone-500" />
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder={language === 'zh' ? '例如 WELCOME20 或 MAYA7DAYS' : 'e.g. WELCOME20 or MAYA7DAYS'}
                className="w-full pl-9 pr-3 py-2 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder-stone-500 font-mono tracking-wider focus:outline-none focus:border-[#dfb76c]"
              />
            </div>
            <button
              onClick={handleApplyCoupon}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-[#dfb76c] transition-colors"
            >
              {language === 'zh' ? '兑换' : 'Apply'}
            </button>
          </div>
          {couponError && <p className="text-[11px] text-rose-400 mt-1">{couponError}</p>}
          {appliedCoupon && (
            <p className="text-[11px] text-emerald-400 mt-1 flex items-center space-x-1">
              <Check className="w-3.5 h-3.5" />
              <span>{appliedCoupon.message}</span>
            </p>
          )}
        </div>

        {/* Payment Provider Selection */}
        <div className="mb-5">
          <label className="text-xs text-stone-400 font-medium block mb-2">
            {language === 'zh' ? '选择支付渠道' : 'Select Payment Method'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPaymentProvider('stripe')}
              className={`p-3 rounded-2xl border text-left flex items-center space-x-2.5 transition-all ${
                paymentProvider === 'stripe'
                  ? 'border-[#dfb76c] bg-[#dfb76c]/10 text-white'
                  : 'border-white/10 bg-black/20 text-stone-400 hover:bg-white/5'
              }`}
            >
              <CreditCard className="w-4 h-4 text-[#dfb76c]" />
              <div>
                <p className="text-xs font-semibold">{language === 'zh' ? '国际信用卡' : 'Credit Card'}</p>
                <p className="text-[10px] text-stone-500">{language === 'zh' ? 'Stripe 银行级安全通道' : 'Stripe Secured'}</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentProvider('apple_iap')}
              className={`p-3 rounded-2xl border text-left flex items-center space-x-2.5 transition-all ${
                paymentProvider === 'apple_iap'
                  ? 'border-[#dfb76c] bg-[#dfb76c]/10 text-white'
                  : 'border-white/10 bg-black/20 text-stone-400 hover:bg-white/5'
              }`}
            >
              <Smartphone className="w-4 h-4 text-[#a599e0]" />
              <div>
                <p className="text-xs font-semibold">Apple Pay</p>
                <p className="text-[10px] text-stone-500">{language === 'zh' ? '一键面容极速支付' : '1-Touch Pay'}</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentProvider('google_play')}
              className={`p-3 rounded-2xl border text-left flex items-center space-x-2.5 transition-all ${
                paymentProvider === 'google_play'
                  ? 'border-[#dfb76c] bg-[#dfb76c]/10 text-white'
                  : 'border-white/10 bg-black/20 text-stone-400 hover:bg-white/5'
              }`}
            >
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <div>
                <p className="text-xs font-semibold">Google Pay</p>
                <p className="text-[10px] text-stone-500">{language === 'zh' ? '快速扣费' : 'Instant Billing'}</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentProvider('mock')}
              className={`p-3 rounded-2xl border text-left flex items-center space-x-2.5 transition-all ${
                paymentProvider === 'mock'
                  ? 'border-[#dfb76c] bg-[#dfb76c]/10 text-white'
                  : 'border-white/10 bg-black/20 text-stone-400 hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#dfb76c]" />
              <div>
                <p className="text-xs font-semibold">{language === 'zh' ? '沙盒即时体验' : 'Instant Test'}</p>
                <p className="text-[10px] text-stone-500">{language === 'zh' ? '免支付立即激活' : 'Instant Activate'}</p>
              </div>
            </button>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleConfirmPayment}
          disabled={isProcessing}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#dfb76c] via-[#f3cf7a] to-[#d4af37] text-[#0a0c16] font-bold text-xs shadow-gold-glow hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          {isProcessing ? (
            <span>{language === 'zh' ? '正在连接安全支付网关...' : 'Authorizing Sacred Payment...'}</span>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5" />
              <span>{language === 'zh' ? `确认支付 • ${formatMYR(finalPrice)}` : `Continue to Payment • ${formatMYR(finalPrice)}`}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>

        {/* Security Note */}
        <div className="mt-3 flex items-center justify-center space-x-2 text-[10px] text-stone-500">
          <ShieldCheck className="w-3.5 h-3.5 text-[#dfb76c]" />
          <span>{language === 'zh' ? '256位银行级加密传输 • 随时可在账户设置中取消订阅' : '256-bit encrypted • Cancel anytime in Account settings'}</span>
        </div>
      </div>
    </div>
  );
};
