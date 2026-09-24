import { supabase, isLiveSupabaseConfigured } from '../lib/supabase';
import { 
  Commission, 
  ReferralCodeInfo, 
  ReferralRecord, 
  MentorReferralStats, 
  AdminReferralStats,
  CommissionStatus,
  Coupon,
  PaymentRecord
} from '../types';
import { REFERRAL_CODES, INITIAL_COMMISSIONS, INITIAL_REFERRALS, MENTORS, COUPONS } from '../data/mockData';
import { payoutService } from './payoutService';

export type DateRangeFilter = '7d' | '30d' | '90d' | 'this_year' | 'all';

const PENDING_REF_KEY = 'soulflow_pending_referral_code';
const COUPONS_STORAGE_KEY = 'soulflow_db_coupons';
const REFERRALS_STORAGE_KEY = 'soulflow_db_referrals';
const COMMISSIONS_STORAGE_KEY = 'soulflow_db_commissions';

export const referralService = {
  // --------------------------------------------------------------------------
  // COUPONS ENGINE
  // --------------------------------------------------------------------------
  getCoupons(): Coupon[] {
    const local = localStorage.getItem(COUPONS_STORAGE_KEY);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error('Failed to parse coupons', e);
      }
    }
    return COUPONS;
  },

  createCoupon(coupon: Omit<Coupon, 'id' | 'created_at' | 'usage_count'>): Coupon {
    const newCoupon: Coupon = {
      id: crypto.randomUUID(),
      ...coupon,
      usage_count: 0,
      created_at: new Date().toISOString(),
    };
    const current = this.getCoupons();
    const updated = [newCoupon, ...current];
    localStorage.setItem(COUPONS_STORAGE_KEY, JSON.stringify(updated));
    return newCoupon;
  },

  validateCoupon(code: string, subtotal: number): {
    valid: boolean;
    coupon?: Coupon;
    discountAmount: number;
    message: string;
  } {
    const clean = code.trim().toUpperCase();
    const coupons = this.getCoupons();
    const match = coupons.find(c => c.code.toUpperCase() === clean && c.is_active);

    if (!match) {
      return { valid: false, discountAmount: 0, message: 'Invalid or expired coupon code.' };
    }

    if (match.usage_limit && match.usage_count >= match.usage_limit) {
      return { valid: false, discountAmount: 0, message: 'Coupon usage limit reached.' };
    }

    let discount = 0;
    if (match.type === 'percentage') {
      discount = Number(((subtotal * match.value) / 100).toFixed(2));
    } else if (match.type === 'fixed_amount') {
      discount = Math.min(subtotal, match.value);
    } else if (match.type === 'free_trial_days') {
      discount = 0; // grants trial days
    }

    return {
      valid: true,
      coupon: match,
      discountAmount: discount,
      message: match.type === 'free_trial_days' 
        ? `${match.value} Days Free Trial Unlocked!`
        : `Discount of RM${discount.toFixed(2)} applied!`,
    };
  },

  // --------------------------------------------------------------------------
  // REFERRAL ATTRIBUTION & TEMPORARY STORAGE
  // --------------------------------------------------------------------------
  savePendingReferralCode(rawCode: string): void {
    if (!rawCode) return;
    const clean = rawCode.trim().toUpperCase();
    localStorage.setItem(PENDING_REF_KEY, clean);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(PENDING_REF_KEY, clean);
    }
  },

  getPendingReferralCode(): string | null {
    if (typeof sessionStorage !== 'undefined') {
      const s = sessionStorage.getItem(PENDING_REF_KEY);
      if (s) return s;
    }
    return localStorage.getItem(PENDING_REF_KEY);
  },

  clearPendingReferralCode(): void {
    localStorage.removeItem(PENDING_REF_KEY);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(PENDING_REF_KEY);
    }
  },

  // Validate referral code
  async validateReferralCode(rawCode: string): Promise<{
    valid: boolean;
    info?: ReferralCodeInfo;
    message: string;
  }> {
    const code = rawCode.trim().toUpperCase();

    // Check mentor referral codes
    const mentor = MENTORS.find(m => m.referralCode.toUpperCase() === code || m.referral_code?.toUpperCase() === code);
    if (mentor) {
      const info: ReferralCodeInfo = {
        code,
        mentorId: mentor.id,
        mentorName: mentor.name,
        trialDays: 7,
        discountPercentage: 15,
        timesUsed: 42,
      };
      return {
        valid: true,
        info,
        message: `Referral code ${code} applied. Referred by ${mentor.name} — 7 Days Free VIP Access!`,
      };
    }

    const localInfo = REFERRAL_CODES[code];
    if (localInfo) {
      return {
        valid: true,
        info: localInfo,
        message: `Referral code ${code} applied. Referred by ${localInfo.mentorName} — 7 Days Free VIP Access!`,
      };
    }

    return {
      valid: false,
      message: 'Invalid or inactive referral code. Try MAYA888 or ALICE888',
    };
  },

  // Record referral registration with anti-fraud rules
  async recordReferralRegistration(
    mentorId: string,
    referralCode: string,
    referredUserId: string,
    referredUserName: string,
    referredUserEmail: string,
    status: 'registered' | 'trial' = 'registered'
  ): Promise<ReferralRecord> {
    const existing = this.getStoredReferrals();
    
    // Anti-duplicate rule: One user can only belong to one original mentor referral
    const existingReferral = existing.find(r => r.referredUserId === referredUserId);
    if (existingReferral) {
      return existingReferral; // Immutable attribution
    }

    // Anti-self-referral rule
    if (mentorId === referredUserId) {
      console.warn('Blocked self-referral attempt.');
      return {
        id: crypto.randomUUID(),
        mentorId: '',
        referralCode: '',
        referredUserId,
        referredUserName,
        referredUserEmail,
        registrationDate: new Date().toISOString().split('T')[0],
        conversionStatus: 'registered',
      };
    }

    const now = new Date().toISOString();
    const newRecord: ReferralRecord = {
      id: crypto.randomUUID(),
      mentorId,
      referralCode: referralCode.toUpperCase(),
      referredUserId,
      referredUserName,
      referredUserEmail,
      registrationDate: now.split('T')[0],
      registeredAt: now,
      trialStarted: status === 'trial' ? now : undefined,
      conversionStatus: status,
    };

    const updated = [newRecord, ...existing];
    localStorage.setItem(REFERRALS_STORAGE_KEY, JSON.stringify(updated));
    this.clearPendingReferralCode();

    if (isLiveSupabaseConfigured()) {
      await supabase.from('referrals').insert({
        id: newRecord.id,
        mentor_id: mentorId,
        referral_code: referralCode,
        referred_user_id: referredUserId,
        registered_at: now,
        conversion_status: status,
      });
    }

    return newRecord;
  },

  // Apply referral alias
  async applyReferral(
    userId: string,
    referralCode: string,
    mentorId: string
  ): Promise<ReferralRecord> {
    return this.recordReferralRegistration(
      mentorId,
      referralCode,
      userId,
      'SoulFlow Practitioner',
      'practitioner@soulflow.wellness'
    );
  },

  // --------------------------------------------------------------------------
  // COMMISSION ENGINE
  // --------------------------------------------------------------------------
  async recordSubscriptionCommission(
    userId: string,
    userName: string,
    userEmail: string,
    subscriptionId: string,
    paymentId: string,
    paymentAmount: number,
    planName: string = 'Premium Journey'
  ): Promise<Commission | null> {
    // Commission is generated only from successful payments
    if (paymentAmount <= 0) return null;

    const referrals = this.getStoredReferrals();
    const referral = referrals.find(r => r.referredUserId === userId);

    if (!referral || !referral.mentorId) {
      return null; // Not referred by a mentor
    }

    const mentor = MENTORS.find(m => m.id === referral.mentorId) || MENTORS[0];

    // Anti-self-referral check
    if (mentor.id === userId) return null;

    // Check mentor commission type: first_payment vs recurring
    const existingCommissions = this.getStoredCommissions();
    const hasPriorCommission = existingCommissions.some(
      c => c.mentorId === mentor.id && c.userId === userId && c.commissionStatus !== 'Rejected'
    );

    if (mentor.commission_type === 'first_payment' && hasPriorCommission) {
      // Mentor earns commission only from first payment
      return null;
    }

    // Check duplicate commission for same payment
    const duplicate = existingCommissions.find(c => c.paymentId === paymentId && c.mentorId === mentor.id);
    if (duplicate) {
      return duplicate;
    }

    const rate = mentor.commissionPercentage || 15.0;
    const commissionAmount = Number(((paymentAmount * rate) / 100.0).toFixed(2));
    const now = new Date().toISOString();

    const newCommission: Commission = {
      id: crypto.randomUUID(),
      mentorId: mentor.id,
      mentorName: mentor.name,
      userId,
      referredUserName: userName || referral.referredUserName,
      referredUserEmail: userEmail || referral.referredUserEmail,
      subscriptionId,
      paymentId,
      planName,
      paymentAmount,
      commissionPercentage: rate,
      commissionAmount,
      commissionStatus: 'Pending', // Initially Pending until approved
      commission_type: mentor.commission_type || 'recurring',
      date: now.split('T')[0],
    };

    // Update referral record conversion status to 'converted'
    const updatedReferrals = referrals.map(r => 
      r.id === referral.id 
        ? { 
            ...r, 
            conversionStatus: 'converted' as const, 
            subscriptionId, 
            subscriptionTier: 'premium' as const,
            subscriptionStarted: now 
          }
        : r
    );
    localStorage.setItem(REFERRALS_STORAGE_KEY, JSON.stringify(updatedReferrals));

    // Store commission record
    const updatedCommissions = [newCommission, ...existingCommissions];
    localStorage.setItem(COMMISSIONS_STORAGE_KEY, JSON.stringify(updatedCommissions));

    if (isLiveSupabaseConfigured()) {
      await supabase.from('commissions').insert({
        id: newCommission.id,
        mentor_id: mentor.id,
        referred_user_id: userId,
        subscription_id: subscriptionId,
        payment_id: paymentId,
        gross_amount: paymentAmount,
        commission_rate: rate,
        commission_amount: commissionAmount,
        commission_type: mentor.commission_type || 'recurring',
        status: 'pending',
      });
    }

    return newCommission;
  },

  // Reverse commission if payment is refunded
  reverseCommissionForPayment(paymentId: string, adminId: string = 'adm-001'): Commission | null {
    const commissions = this.getStoredCommissions();
    let reversed: Commission | null = null;
    const updated = commissions.map(c => {
      if (c.paymentId === paymentId) {
        reversed = { ...c, commissionStatus: 'Rejected' as const };
        return reversed;
      }
      return c;
    });

    localStorage.setItem(COMMISSIONS_STORAGE_KEY, JSON.stringify(updated));

    if (reversed) {
      payoutService.logAudit({
        action: 'commission_reversed_refund',
        admin_id: adminId,
        target_type: 'commission',
        target_id: (reversed as Commission).id,
        old_value: { paymentId, status: 'Paid' },
        new_value: { status: 'Rejected', reason: 'Payment refunded' },
      });
    }

    return reversed;
  },

  // --------------------------------------------------------------------------
  // METRICS & ANALYTICS
  // --------------------------------------------------------------------------
  filterRecordsByDate<T extends { registrationDate?: string; date?: string; registeredAt?: string }>(
    records: T[], 
    range: DateRangeFilter
  ): T[] {
    if (range === 'all') return records;
    const now = Date.now();
    const days = range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365;
    const cutoff = now - days * 86400000;

    return records.filter(r => {
      const dateStr = r.registeredAt || r.registrationDate || r.date;
      if (!dateStr) return true;
      const t = new Date(dateStr).getTime();
      return t >= cutoff;
    });
  },

  // Mentor Dashboard Stats
  getMentorStats(mentorId: string, range: DateRangeFilter = 'all'): MentorReferralStats {
    const mentor = MENTORS.find(m => m.id === mentorId) || MENTORS[0];
    const allReferrals = this.getStoredReferrals().filter(r => r.mentorId === mentorId);
    const allCommissions = this.getStoredCommissions().filter(c => c.mentorId === mentorId);

    const referrals = this.filterRecordsByDate(allReferrals, range);
    const commissions = this.filterRecordsByDate(allCommissions, range);

    const totalStudents = referrals.length;
    const thisMonthCutoff = Date.now() - 30 * 86400000;
    const newStudentsThisMonth = allReferrals.filter(r => {
      const t = new Date(r.registrationDate).getTime();
      return t >= thisMonthCutoff;
    }).length;

    const subscriptionsGenerated = referrals.filter(r => r.conversionStatus === 'converted').length;
    const conversionRate = totalStudents > 0 ? Number(((subscriptionsGenerated / totalStudents) * 100).toFixed(1)) : 0;
    
    const totalRevenueGenerated = Number(commissions.reduce((sum, c) => sum + c.paymentAmount, 0).toFixed(2));
    const totalCommission = Number(commissions.reduce((sum, c) => sum + c.commissionAmount, 0).toFixed(2));
    const pendingCommission = Number(commissions.filter(c => c.commissionStatus === 'Pending' || c.commissionStatus === 'pending').reduce((sum, c) => sum + c.commissionAmount, 0).toFixed(2));
    const approvedCommission = Number(commissions.filter(c => c.commissionStatus === 'Approved' || c.commissionStatus === 'approved').reduce((sum, c) => sum + c.commissionAmount, 0).toFixed(2));
    const paidCommission = Number(commissions.filter(c => c.commissionStatus === 'Paid' || c.commissionStatus === 'paid').reduce((sum, c) => sum + c.commissionAmount, 0).toFixed(2));

    // Simulated top of funnel
    const clicksCount = Math.max(totalStudents * 4, 38);
    const trialsCount = Math.max(totalStudents, 12);

    return {
      referralCode: mentor.referralCode,
      totalStudents,
      newStudentsThisMonth,
      subscriptionsGenerated,
      conversionRate,
      totalRevenueGenerated,
      totalCommission,
      pendingCommission,
      approvedCommission,
      paidCommission,
      clicksCount,
      trialsCount,
    };
  },

  // Admin Dashboard Stats
  getAdminStats(): AdminReferralStats {
    const referrals = this.getStoredReferrals();
    const commissions = this.getStoredCommissions();

    const totalReferrals = referrals.length;
    const successfulSubscriptions = referrals.filter(r => r.conversionStatus === 'converted').length;
    const conversionRate = totalReferrals > 0 ? Number(((successfulSubscriptions / totalReferrals) * 100).toFixed(1)) : 0;

    const revenueFromReferrals = Number(commissions.reduce((sum, c) => sum + c.paymentAmount, 0).toFixed(2));
    const totalCommissionGenerated = Number(commissions.reduce((sum, c) => sum + c.commissionAmount, 0).toFixed(2));
    const commissionPaid = Number(commissions.filter(c => c.commissionStatus === 'Paid' || c.commissionStatus === 'paid').reduce((sum, c) => sum + c.commissionAmount, 0).toFixed(2));
    const pendingCommission = Number(commissions.filter(c => c.commissionStatus === 'Pending' || c.commissionStatus === 'pending' || c.commissionStatus === 'Approved' || c.commissionStatus === 'approved').reduce((sum, c) => sum + c.commissionAmount, 0).toFixed(2));

    // Calculate MRR & ARR from active subscriptions & commissions
    const mrr = Number((revenueFromReferrals * 0.45).toFixed(2));
    const arr = Number((mrr * 12).toFixed(2));

    return {
      totalReferrals,
      successfulSubscriptions,
      conversionRate,
      revenueFromReferrals,
      totalCommissionGenerated,
      commissionPaid,
      pendingCommission,
      mrr,
      arr,
    };
  },

  getReferrals(mentorId?: string): ReferralRecord[] {
    const all = this.getStoredReferrals();
    return mentorId ? all.filter(r => r.mentorId === mentorId) : all;
  },

  getCommissions(mentorId?: string): Commission[] {
    const all = this.getStoredCommissions();
    return mentorId ? all.filter(c => c.mentorId === mentorId) : all;
  },

  // Admin updates commission status
  async updateCommissionStatus(
    commissionId: string, 
    status: CommissionStatus, 
    adminId: string = 'adm-001'
  ): Promise<void> {
    const all = this.getStoredCommissions();
    let oldStatus: CommissionStatus = 'Pending';
    const updated = all.map(c => {
      if (c.id === commissionId) {
        oldStatus = c.commissionStatus;
        const now = new Date().toISOString();
        return { 
          ...c, 
          commissionStatus: status,
          approved_at: (status === 'Approved' || status === 'approved') ? now : c.approved_at,
          paid_at: (status === 'Paid' || status === 'paid') ? now : c.paid_at,
        };
      }
      return c;
    });

    localStorage.setItem(COMMISSIONS_STORAGE_KEY, JSON.stringify(updated));

    payoutService.logAudit({
      action: `commission_${status.toLowerCase()}`,
      admin_id: adminId,
      target_type: 'commission',
      target_id: commissionId,
      old_value: { status: oldStatus },
      new_value: { status },
    });

    if (isLiveSupabaseConfigured()) {
      await supabase.from('commissions').update({
        status: status.toLowerCase(),
        approved_at: (status === 'Approved' || status === 'approved') ? new Date().toISOString() : undefined,
        paid_at: (status === 'Paid' || status === 'paid') ? new Date().toISOString() : undefined,
      }).eq('id', commissionId);
    }
  },

  getStoredReferrals(): ReferralRecord[] {
    const saved = localStorage.getItem(REFERRALS_STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    localStorage.setItem(REFERRALS_STORAGE_KEY, JSON.stringify(INITIAL_REFERRALS));
    return INITIAL_REFERRALS;
  },

  getStoredCommissions(): Commission[] {
    const saved = localStorage.getItem(COMMISSIONS_STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    localStorage.setItem(COMMISSIONS_STORAGE_KEY, JSON.stringify(INITIAL_COMMISSIONS));
    return INITIAL_COMMISSIONS;
  },
};
