import { supabase, isLiveSupabaseConfigured } from '../lib/supabase';
import { 
  SubscriptionTier, 
  BillingCycle, 
  SubscriptionPlan, 
  SubscriptionRecord, 
  UserProfile, 
  PaymentRecord,
  PaymentProvider 
} from '../types';
import { SUBSCRIPTION_PLANS } from '../data/mockData';

const PLANS_STORAGE_KEY = 'soulflow_subscription_plans';
const SUBS_STORAGE_KEY = 'soulflow_active_subscription';

export const subscriptionService = {
  // Retrieve available subscription plans (configurable)
  getPlans(): SubscriptionPlan[] {
    const local = localStorage.getItem(PLANS_STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error('Failed to parse cached subscription plans', e);
      }
    }
    return SUBSCRIPTION_PLANS;
  },

  // Admin can update plan pricing & features
  updatePlan(planId: string, updates: Partial<SubscriptionPlan>): SubscriptionPlan[] {
    const plans = this.getPlans().map(p => p.id === planId ? { ...p, ...updates } : p);
    localStorage.setItem(PLANS_STORAGE_KEY, JSON.stringify(plans));
    return plans;
  },

  // Get active subscription for user
  getActiveSubscription(userId: string): SubscriptionRecord | null {
    const local = localStorage.getItem(`${SUBS_STORAGE_KEY}_${userId}`);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error('Failed to parse subscription', e);
      }
    }
    return null;
  },

  // Calculate remaining trial days
  getRemainingTrialDays(user: UserProfile): number {
    if (user.membershipStatus === 'free' || !user.membershipExpiresAt) {
      return 0;
    }
    const expires = new Date(user.membershipExpiresAt).getTime();
    const now = Date.now();
    const diff = expires - now;
    if (diff <= 0) return 0;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  },

  // Start free trial (e.g. 7 days)
  async startFreeTrial(userId: string, days: number = 7): Promise<SubscriptionRecord> {
    const now = new Date();
    const trialEnd = new Date(now.getTime() + days * 86400000);
    const subRecord: SubscriptionRecord = {
      id: crypto.randomUUID(),
      user_id: userId,
      tier: 'premium',
      billing_cycle: 'annual',
      status: 'trial',
      start_date: now.toISOString(),
      trial_end_date: trialEnd.toISOString(),
      renewal_date: trialEnd.toISOString(),
      cancelled_at: null,
      payment_provider: 'mock',
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    localStorage.setItem(`${SUBS_STORAGE_KEY}_${userId}`, JSON.stringify(subRecord));

    if (isLiveSupabaseConfigured()) {
      await supabase.from('subscriptions').upsert({
        id: subRecord.id,
        user_id: userId,
        tier: 'premium',
        billing_cycle: 'annual',
        status: 'trial',
        start_date: subRecord.start_date,
        trial_end_date: subRecord.trial_end_date,
      });

      await supabase.from('profiles').update({
        membership_status: 'premium',
        membership_expires_at: trialEnd.toISOString(),
      }).eq('id', userId);
    }

    return subRecord;
  },

  // Upgrade or subscribe to paid plan
  async subscribe(
    userId: string,
    tier: SubscriptionTier,
    billingCycle: BillingCycle,
    paymentProvider: PaymentProvider = 'stripe',
    discountAmount: number = 0
  ): Promise<{ subscription: SubscriptionRecord; payment: PaymentRecord }> {
    const plans = this.getPlans();
    const selectedPlan = plans.find(p => p.slug === tier) || plans[1];
    
    const grossPrice = billingCycle === 'annual' 
      ? selectedPlan.annual_price 
      : selectedPlan.monthly_price;
    
    const finalAmount = Math.max(0, Number((grossPrice - discountAmount).toFixed(2)));
    const now = new Date();
    const daysToAdd = billingCycle === 'annual' ? 365 : 30;
    const renewalDate = new Date(now.getTime() + daysToAdd * 86400000);

    const subRecord: SubscriptionRecord = {
      id: crypto.randomUUID(),
      user_id: userId,
      plan_id: selectedPlan.id,
      tier,
      billing_cycle: billingCycle,
      status: 'active',
      start_date: now.toISOString(),
      renewal_date: renewalDate.toISOString(),
      cancelled_at: null,
      payment_provider: paymentProvider,
      provider_subscription_id: `sub_${paymentProvider}_${Date.now()}`,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
    };

    const paymentRecord: PaymentRecord = {
      id: crypto.randomUUID(),
      user_id: userId,
      subscription_id: subRecord.id,
      provider: paymentProvider,
      provider_payment_id: `pay_${paymentProvider}_${Date.now()}`,
      amount: finalAmount,
      currency: 'MYR',
      status: 'paid',
      paid_at: now.toISOString(),
      created_at: now.toISOString(),
    };

    // Save locally
    localStorage.setItem(`${SUBS_STORAGE_KEY}_${userId}`, JSON.stringify(subRecord));

    // Save in payments history
    const existingPaymentsStr = localStorage.getItem('soulflow_payments_history');
    const existingPayments: PaymentRecord[] = existingPaymentsStr ? JSON.parse(existingPaymentsStr) : [];
    existingPayments.unshift(paymentRecord);
    localStorage.setItem('soulflow_payments_history', JSON.stringify(existingPayments));

    // Sync to Supabase if connected
    if (isLiveSupabaseConfigured()) {
      await supabase.from('subscriptions').upsert({
        id: subRecord.id,
        user_id: userId,
        plan_id: selectedPlan.id,
        tier,
        billing_cycle: billingCycle,
        status: 'active',
        start_date: subRecord.start_date,
        current_period_end: renewalDate.toISOString(),
      });

      await supabase.from('payments').insert({
        id: paymentRecord.id,
        user_id: userId,
        subscription_id: subRecord.id,
        amount: finalAmount,
        currency: 'MYR',
        status: 'paid',
        provider: paymentProvider,
        provider_transaction_id: paymentRecord.provider_payment_id,
        paid_at: paymentRecord.paid_at,
      });

      await supabase.from('profiles').update({
        membership_status: tier,
        billing_cycle: billingCycle,
        membership_expires_at: renewalDate.toISOString(),
      }).eq('id', userId);
    }

    return { subscription: subRecord, payment: paymentRecord };
  },

  // Cancel subscription
  async cancelSubscription(userId: string): Promise<SubscriptionRecord | null> {
    const sub = this.getActiveSubscription(userId);
    if (!sub) return null;

    const updatedSub: SubscriptionRecord = {
      ...sub,
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem(`${SUBS_STORAGE_KEY}_${userId}`, JSON.stringify(updatedSub));

    if (isLiveSupabaseConfigured()) {
      await supabase.from('subscriptions').update({
        status: 'cancelled',
        cancelled_at: updatedSub.cancelled_at,
      }).eq('id', sub.id);
    }

    return updatedSub;
  },

  // Reusable access control logic
  canAccessPremiumContent(
    user: UserProfile, 
    itemTier: SubscriptionTier = 'free', 
    itemType: 'track' | 'program' | 'course' = 'track'
  ): { canAccess: boolean; requiredTier?: SubscriptionTier; reason?: string } {
    // 1. Free content is accessible to all
    if (itemTier === 'free') {
      return { canAccess: true };
    }

    // 2. Premium+ subscribers can access everything
    if (user.membershipStatus === 'premium_plus') {
      return { canAccess: true };
    }

    // 3. Premium subscribers
    if (user.membershipStatus === 'premium') {
      if (itemTier === 'premium_plus' || itemType === 'course') {
        return {
          canAccess: false,
          requiredTier: 'premium_plus',
          reason: 'Premium+ required for Master Mentor Courses & Live Sessions.',
        };
      }
      return { canAccess: true };
    }

    // 4. Free user checking premium or premium_plus content
    return {
      canAccess: false,
      requiredTier: itemTier,
      reason: itemTier === 'premium_plus' 
        ? 'Upgrade to Premium+ to access Masterclasses.' 
        : 'Upgrade to Premium for unlimited healing sound & programs.',
    };
  },
};
