import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Music, 
  Users, 
  Crown, 
  DollarSign, 
  TrendingUp, 
  Award, 
  Share2, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ArrowLeft, 
  Sparkles, 
  Filter, 
  ChevronRight,
  Eye,
  AlertCircle,
  Clock,
  Shield,
  CreditCard,
  Gift,
  FileText,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { 
  Track, 
  Mentor, 
  Commission, 
  ContentMood, 
  CategorySlug, 
  SubscriptionTier, 
  ReferralRecord,
  Coupon,
  PayoutRecord,
  AuditLog,
  CommissionType,
  CouponType
} from '../types';
import { referralService } from '../services/referralService';
import { formatMYR } from '../services/paymentService';

export const AdminDashboardView: React.FC = () => {
  const { 
    setIsAdminView, 
    tracks, 
    addTrack, 
    updateTrack, 
    deleteTrack, 
    mentors, 
    addMentor, 
    commissions, 
    updateCommissionStatus, 
    subscriptionPlans,
    updateSubscriptionPlan,
    coupons,
    createCoupon,
    payoutRequests,
    approvePayout,
    rejectPayout,
    markPayoutPaid,
    updateMentorBusinessSettings,
    refundPayment,
    payments,
    auditLogs,
    showToast 
  } = useApp();

  const [activeModule, setActiveModule] = useState<
    'dashboard' | 'commissions' | 'mentors' | 'subscriptions' | 'referrals' | 'coupons' | 'audit' | 'music'
  >('dashboard');
  
  // Track Form Modal
  const [showAddTrackModal, setShowAddTrackModal] = useState(false);
  const [trackForm, setTrackForm] = useState({
    title: '',
    artistOrMentor: 'Alicia Sterling',
    category: 'healing_music' as CategorySlug,
    categoryLabel: 'Healing Music',
    mood: 'relax' as ContentMood,
    durationSeconds: 1200,
    durationFormatted: '20:00',
    coverUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=800&q=80',
    audioUrl: 'https://cdn.freesound.org/previews/563/563821_9497060-lq.mp3',
    tier: 'free' as SubscriptionTier,
    description: '',
    published: true,
  });

  // Mentor Form Modal
  const [showAddMentorModal, setShowAddMentorModal] = useState(false);
  const [mentorForm, setMentorForm] = useState({
    name: '',
    title: '',
    bio: '',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    coverUrl: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=80',
    specialization: 'Sound Bath & Frequencies',
    referralCode: '',
    commissionPercentage: 15.0,
    commission_type: 'recurring' as CommissionType,
    payout_minimum: 100.0,
  });

  // Edit Mentor Settings Modal
  const [editingMentor, setEditingMentor] = useState<Mentor | null>(null);
  const [mentorSettingsForm, setMentorSettingsForm] = useState({
    referralCode: '',
    commissionPercentage: 15.0,
    commission_type: 'recurring' as CommissionType,
    payout_minimum: 100.0,
    isSuspended: false,
  });

  // Coupon Creation Modal
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    type: 'percentage' as CouponType,
    value: 20,
    usage_limit: 500,
    start_date: new Date().toISOString(),
    is_active: true,
  });

  // Mark Payout Paid Modal
  const [payoutToPay, setPayoutToPay] = useState<PayoutRecord | null>(null);
  const [payoutReference, setPayoutReference] = useState('');

  // Stats calculation
  const adminStats = referralService.getAdminStats();
  const allReferrals = referralService.getReferrals();
  const allCommissions = commissions;

  const handleAddTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackForm.title.trim()) return;
    addTrack(trackForm);
    setShowAddTrackModal(false);
  };

  const handleAddMentorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mentorForm.name.trim() || !mentorForm.referralCode.trim()) return;
    addMentor(mentorForm);
    setShowAddMentorModal(false);
  };

  const handleOpenEditMentor = (m: Mentor) => {
    setEditingMentor(m);
    setMentorSettingsForm({
      referralCode: m.referralCode,
      commissionPercentage: m.commissionPercentage,
      commission_type: m.commission_type || 'recurring',
      payout_minimum: m.payout_minimum || 100.0,
      isSuspended: !m.isFeatured,
    });
  };

  const handleSaveMentorSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMentor) return;
    await updateMentorBusinessSettings(editingMentor.id, {
      referralCode: mentorSettingsForm.referralCode,
      referral_code: mentorSettingsForm.referralCode,
      commissionPercentage: mentorSettingsForm.commissionPercentage,
      commission_percentage: mentorSettingsForm.commissionPercentage,
      commission_type: mentorSettingsForm.commission_type,
      payout_minimum: mentorSettingsForm.payout_minimum,
      isFeatured: !mentorSettingsForm.isSuspended,
    });
    setEditingMentor(null);
  };

  const handleCreateCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code.trim()) return;
    createCoupon(couponForm);
    setShowAddCouponModal(false);
    setCouponForm({
      code: '',
      type: 'percentage',
      value: 20,
      usage_limit: 500,
      start_date: new Date().toISOString(),
      is_active: true,
    });
  };

  const handleConfirmPayoutPaid = async () => {
    if (!payoutToPay) return;
    await markPayoutPaid(payoutToPay.id, payoutReference || `PAY-MYR-${Date.now()}`);
    setPayoutToPay(null);
    setPayoutReference('');
  };

  return (
    <div className="min-h-screen bg-[#070913] text-[#f5f0eb] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0d1022] border-r border-white/10 flex flex-col justify-between shrink-0 p-4">
        <div className="space-y-6">
          {/* Logo / Header */}
          <div className="flex items-center space-x-3 px-2 pt-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#dfb76c] to-[#a599e0] flex items-center justify-center text-[#070913] font-bold">
              ✦
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-white">SOULFLOW</h1>
              <span className="text-[10px] text-[#dfb76c] font-mono uppercase tracking-wider block">
                Executive Admin
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Executive Overview', icon: LayoutDashboard },
              { id: 'commissions', label: 'Commissions & Payouts', icon: DollarSign, badge: allCommissions.filter(c => c.commissionStatus === 'Pending').length },
              { id: 'referrals', label: 'Referral Tracking', icon: Share2 },
              { id: 'mentors', label: 'Mentor Business Settings', icon: Award },
              { id: 'subscriptions', label: 'Plans & Pricing', icon: Crown },
              { id: 'coupons', label: 'Coupons & Promos', icon: Gift },
              { id: 'audit', label: 'Audit Trail Logs', icon: FileText },
              { id: 'music', label: 'Sound Sanctuary Music', icon: Music },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveModule(item.id as any)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#dfb76c] text-[#070913] font-bold shadow-md'
                      : 'text-stone-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 ? (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-black text-[#dfb76c]' : 'bg-[#dfb76c]/20 text-[#dfb76c]'
                    }`}>
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Back to Client App */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => setIsAdminView(false)}
            className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 text-xs font-medium flex items-center justify-center space-x-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Sanctuary App</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
        {/* MODULE 1: DASHBOARD OVERVIEW */}
        {activeModule === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Executive Business Overview</h2>
                <p className="text-xs text-stone-400">Real-time revenue, referrals, recurring metrics and liability</p>
              </div>
            </div>

            {/* 8 Metric KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-[#0e1224] border border-white/10 space-y-1">
                <span className="text-[10px] text-stone-400 uppercase font-mono">Monthly Recurring (MRR)</span>
                <p className="text-2xl font-bold text-white">{formatMYR(adminStats.mrr)}</p>
                <span className="text-[10px] text-emerald-400">Subscription pipeline</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0e1224] border border-white/10 space-y-1">
                <span className="text-[10px] text-stone-400 uppercase font-mono">Annualized Run-Rate (ARR)</span>
                <p className="text-2xl font-bold text-[#dfb76c]">{formatMYR(adminStats.arr)}</p>
                <span className="text-[10px] text-stone-500">12-Month projection</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0e1224] border border-white/10 space-y-1">
                <span className="text-[10px] text-stone-400 uppercase font-mono">Referral Revenue</span>
                <p className="text-2xl font-bold text-white">{formatMYR(adminStats.revenueFromReferrals)}</p>
                <span className="text-[10px] text-stone-500">{adminStats.successfulSubscriptions} Subscribed</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0e1224] border border-white/10 space-y-1">
                <span className="text-[10px] text-stone-400 uppercase font-mono">Referral Conversion</span>
                <p className="text-2xl font-bold text-emerald-400">{adminStats.conversionRate}%</p>
                <span className="text-[10px] text-stone-500">{adminStats.totalReferrals} Total Students</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0e1224] border border-white/10 space-y-1">
                <span className="text-[10px] text-stone-400 uppercase font-mono">Total Commission</span>
                <p className="text-2xl font-bold text-white">{formatMYR(adminStats.totalCommissionGenerated)}</p>
                <span className="text-[10px] text-stone-500">Mentor earnings</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0e1224] border border-white/10 space-y-1">
                <span className="text-[10px] text-stone-400 uppercase font-mono">Pending Commission</span>
                <p className="text-2xl font-bold text-amber-400">{formatMYR(adminStats.pendingCommission)}</p>
                <span className="text-[10px] text-stone-500">Awaiting approval</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0e1224] border border-white/10 space-y-1">
                <span className="text-[10px] text-stone-400 uppercase font-mono">Paid Commission</span>
                <p className="text-2xl font-bold text-emerald-400">{formatMYR(adminStats.commissionPaid)}</p>
                <span className="text-[10px] text-stone-500">Disbursed to date</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#0e1224] border border-white/10 space-y-1">
                <span className="text-[10px] text-stone-400 uppercase font-mono">Pending Payouts</span>
                <p className="text-2xl font-bold text-[#a599e0]">
                  {payoutRequests.filter(p => p.status === 'requested').length} Requests
                </p>
                <span className="text-[10px] text-stone-500">
                  {formatMYR(payoutRequests.filter(p => p.status === 'requested').reduce((sum, p) => sum + p.amount, 0))}
                </span>
              </div>
            </div>

            {/* Quick Analytics: Revenue by Plan & Top Mentors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Revenue by Plan */}
              <div className="p-6 rounded-3xl bg-[#0e1224] border border-white/10 space-y-4">
                <h3 className="text-sm font-bold text-white">Revenue by Subscription Plan</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-stone-300">Premium Journey (RM19.90 / RM199)</span>
                      <span className="font-bold text-white">68%</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#dfb76c] h-full w-[68%]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-stone-300">Premium+ Master (RM39.90 / RM399)</span>
                      <span className="font-bold text-white">32%</span>
                    </div>
                    <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#a599e0] h-full w-[32%]"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Mentors by Referral Conversions */}
              <div className="p-6 rounded-3xl bg-[#0e1224] border border-white/10 space-y-3">
                <h3 className="text-sm font-bold text-white">Top Referral Mentors</h3>
                <div className="space-y-2">
                  {mentors.slice(0, 4).map((m) => {
                    const mentorComms = commissions.filter(c => c.mentorId === m.id);
                    const totalEarned = mentorComms.reduce((sum, c) => sum + c.commissionAmount, 0);
                    return (
                      <div key={m.id} className="p-2.5 rounded-xl bg-white/5 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2.5">
                          <img src={m.avatarUrl} alt={m.name} className="w-7 h-7 rounded-full object-cover" />
                          <div>
                            <p className="font-semibold text-white">{m.name}</p>
                            <span className="text-[10px] text-stone-400 font-mono">Code {m.referralCode}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-[#dfb76c] block">{formatMYR(totalEarned)}</span>
                          <span className="text-[10px] text-stone-400">{m.commissionPercentage}% rate</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 2: COMMISSIONS & PAYOUTS */}
        {activeModule === 'commissions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Commissions & Payout Settlements</h2>
                <p className="text-xs text-stone-400">Review pending commissions and authorize bank payouts</p>
              </div>
            </div>

            {/* Payout Requests Section */}
            <div className="p-6 rounded-3xl bg-[#0e1224] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <span>Mentor Payout Requests</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-mono">
                    Min. RM100.00
                  </span>
                </h3>
              </div>

              {payoutRequests.length === 0 ? (
                <p className="text-xs text-stone-500 py-4">No payout requests in the queue.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-stone-400 font-semibold text-[10px] uppercase">
                        <th className="pb-2.5 pl-2">Mentor</th>
                        <th className="pb-2.5">Requested Date</th>
                        <th className="pb-2.5">Amount</th>
                        <th className="pb-2.5">Status</th>
                        <th className="pb-2.5">Bank / Notes</th>
                        <th className="pb-2.5 text-right pr-2">Admin Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {payoutRequests.map((p) => (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 pl-2 font-semibold text-white">{p.mentor_name || 'Mentor Guide'}</td>
                          <td className="py-3 text-stone-400">{new Date(p.requested_at).toLocaleDateString()}</td>
                          <td className="py-3 font-bold text-[#dfb76c]">{formatMYR(p.amount)}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              p.status === 'paid'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : p.status === 'processing'
                                ? 'bg-blue-500/20 text-blue-300'
                                : p.status === 'rejected'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3 text-stone-400 text-[11px] max-w-xs truncate">
                            {p.notes || p.reference_number || 'Standard transfer'}
                          </td>
                          <td className="py-3 text-right pr-2 space-x-1.5">
                            {p.status === 'requested' && (
                              <>
                                <button
                                  onClick={() => approvePayout(p.id)}
                                  className="px-2.5 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-semibold text-[10px]"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => rejectPayout(p.id, 'Minimum criteria not met')}
                                  className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold text-[10px]"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {p.status === 'processing' && (
                              <button
                                onClick={() => setPayoutToPay(p)}
                                className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-semibold text-[10px]"
                              >
                                Mark Paid
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Commissions Table */}
            <div className="p-6 rounded-3xl bg-[#0e1224] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white">Commissions Ledger & Approvals</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-stone-400 font-semibold text-[10px] uppercase">
                      <th className="pb-2.5 pl-2">Date</th>
                      <th className="pb-2.5">Mentor</th>
                      <th className="pb-2.5">Student</th>
                      <th className="pb-2.5">Plan</th>
                      <th className="pb-2.5">Payment</th>
                      <th className="pb-2.5">Rate</th>
                      <th className="pb-2.5 font-bold">Commission</th>
                      <th className="pb-2.5">Status</th>
                      <th className="pb-2.5 text-right pr-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {allCommissions.map((c) => {
                      const st = c.commissionStatus.toLowerCase();
                      return (
                        <tr key={c.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 pl-2 text-stone-400">{c.date}</td>
                          <td className="py-3 font-semibold text-white">{c.mentorName}</td>
                          <td className="py-3 text-stone-300">{c.referredUserName}</td>
                          <td className="py-3 text-stone-400">{c.planName}</td>
                          <td className="py-3 text-stone-200">{formatMYR(c.paymentAmount)}</td>
                          <td className="py-3 text-stone-400">{c.commissionPercentage}%</td>
                          <td className="py-3 font-bold text-[#dfb76c]">{formatMYR(c.commissionAmount)}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              st === 'paid'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : st === 'approved'
                                ? 'bg-blue-500/20 text-blue-300'
                                : st === 'rejected'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}>
                              {c.commissionStatus}
                            </span>
                          </td>
                          <td className="py-3 text-right pr-2 space-x-1.5">
                            {st === 'pending' && (
                              <>
                                <button
                                  onClick={() => updateCommissionStatus(c.id, 'Approved')}
                                  className="px-2 py-0.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 text-[10px] font-semibold"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => updateCommissionStatus(c.id, 'Rejected')}
                                  className="px-2 py-0.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-[10px] font-semibold"
                                >
                                  Reject
                                </button>
                              </>
                            )}
                            {st === 'approved' && (
                              <button
                                onClick={() => updateCommissionStatus(c.id, 'Paid')}
                                className="px-2.5 py-0.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-[10px] font-semibold"
                              >
                                Mark Paid
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MODULE 3: REFERRAL TRACKING */}
        {activeModule === 'referrals' && (
          <div className="p-6 rounded-3xl bg-[#0e1224] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Referral Tracking & Attribution</h2>
                <p className="text-xs text-stone-400">Complete immutable record of all mentor referrals</p>
              </div>
              <span className="text-xs text-stone-400">{allReferrals.length} Attributions</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-stone-400 font-semibold text-[10px] uppercase">
                    <th className="pb-2.5 pl-2">Referral Code</th>
                    <th className="pb-2.5">Mentor</th>
                    <th className="pb-2.5">Student</th>
                    <th className="pb-2.5">Registration Date</th>
                    <th className="pb-2.5">Conversion Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {allReferrals.map((r) => {
                    const mentor = mentors.find(m => m.id === r.mentorId) || mentors[0];
                    return (
                      <tr key={r.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 pl-2 font-mono font-bold text-[#dfb76c]">{r.referralCode}</td>
                        <td className="py-3 font-semibold text-white">{mentor.name}</td>
                        <td className="py-3">
                          <p className="text-white font-medium">{r.referredUserName}</p>
                          <p className="text-[10px] text-stone-500 font-mono">{r.referredUserEmail}</p>
                        </td>
                        <td className="py-3 text-stone-400 font-mono">{r.registrationDate}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            r.conversionStatus === 'converted'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {r.conversionStatus === 'converted' ? 'Subscribed' : 'Trialing'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE 4: MENTOR BUSINESS SETTINGS */}
        {activeModule === 'mentors' && (
          <div className="p-6 rounded-3xl bg-[#0e1224] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Mentor Business & Commission Settings</h2>
                <p className="text-xs text-stone-400">Configure referral codes, commission % and models per mentor</p>
              </div>
              <button
                onClick={() => setShowAddMentorModal(true)}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#dfb76c] to-[#d4af37] text-[#070913] text-xs font-bold shadow-md flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add New Mentor</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-stone-400 font-semibold text-[10px] uppercase">
                    <th className="pb-2.5 pl-2">Mentor</th>
                    <th className="pb-2.5">Referral Code</th>
                    <th className="pb-2.5">Commission Rate</th>
                    <th className="pb-2.5">Commission Model</th>
                    <th className="pb-2.5">Payout Minimum</th>
                    <th className="pb-2.5">Status</th>
                    <th className="pb-2.5 text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {mentors.map((m) => (
                    <tr key={m.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 pl-2">
                        <div className="flex items-center space-x-2.5">
                          <img src={m.avatarUrl} alt={m.name} className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="font-semibold text-white">{m.name}</p>
                            <p className="text-[10px] text-stone-400">{m.specialization}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 font-mono font-bold text-[#dfb76c]">{m.referralCode}</td>
                      <td className="py-3 font-semibold text-white">{m.commissionPercentage}%</td>
                      <td className="py-3">
                        <span className="capitalize text-stone-300">
                          {m.commission_type === 'first_payment' ? 'First Payment' : 'Recurring'}
                        </span>
                      </td>
                      <td className="py-3 text-stone-300">{formatMYR(m.payout_minimum || 100)}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300">
                          Active
                        </span>
                      </td>
                      <td className="py-3 text-right pr-2">
                        <button
                          onClick={() => handleOpenEditMentor(m)}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/15 text-stone-300 text-xs font-medium"
                        >
                          Configure
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE 5: SUBSCRIPTIONS & PRICING */}
        {activeModule === 'subscriptions' && (
          <div className="p-6 rounded-3xl bg-[#0e1224] border border-white/10 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Subscription Plans & Pricing</h2>
              <p className="text-xs text-stone-400">Configure pricing and features in Malaysian Ringgit (MYR)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {subscriptionPlans.map((plan) => (
                <div key={plan.id} className="p-5 rounded-2xl bg-[#141830] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-white text-sm">{plan.name}</h3>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-white/10 text-[#dfb76c]">
                      {plan.slug}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-stone-400 uppercase font-semibold">Monthly Price (RM)</label>
                    <input
                      type="number"
                      step="0.10"
                      value={plan.monthly_price}
                      onChange={(e) => updateSubscriptionPlan(plan.id, { monthly_price: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-stone-400 uppercase font-semibold">Annual Price (RM)</label>
                    <input
                      type="number"
                      step="1"
                      value={plan.annual_price}
                      onChange={(e) => updateSubscriptionPlan(plan.id, { annual_price: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white"
                    />
                  </div>

                  <ul className="text-xs text-stone-400 space-y-1 pt-2 border-t border-white/5">
                    {plan.features.map((f, idx) => (
                      <li key={idx} className="flex items-center space-x-1.5 truncate">
                        <Check className="w-3 h-3 text-[#dfb76c] shrink-0" />
                        <span className="truncate">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MODULE 6: COUPONS */}
        {activeModule === 'coupons' && (
          <div className="p-6 rounded-3xl bg-[#0e1224] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Promotional & Mentor Coupons</h2>
                <p className="text-xs text-stone-400">Discount codes, percentage off, and free trial days</p>
              </div>
              <button
                onClick={() => setShowAddCouponModal(true)}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#dfb76c] to-[#d4af37] text-[#070913] text-xs font-bold shadow-md flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Coupon</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-stone-400 font-semibold text-[10px] uppercase">
                    <th className="pb-2.5 pl-2">Coupon Code</th>
                    <th className="pb-2.5">Type</th>
                    <th className="pb-2.5">Value</th>
                    <th className="pb-2.5">Redemptions</th>
                    <th className="pb-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {coupons.map((c) => (
                    <tr key={c.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 pl-2 font-mono font-bold text-[#dfb76c]">{c.code}</td>
                      <td className="py-3 capitalize text-stone-300">{c.type.replace(/_/g, ' ')}</td>
                      <td className="py-3 font-semibold text-white">
                        {c.type === 'percentage' ? `${c.value}% OFF` : c.type === 'fixed_amount' ? formatMYR(c.value) : `${c.value} Free Days`}
                      </td>
                      <td className="py-3 text-stone-400">
                        {c.usage_count} {c.usage_limit ? `/ ${c.usage_limit}` : ''}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.is_active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-stone-500/20 text-stone-400'
                        }`}>
                          {c.is_active ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE 7: AUDIT LOGS */}
        {activeModule === 'audit' && (
          <div className="p-6 rounded-3xl bg-[#0e1224] border border-white/10 space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Executive Audit Trail Logs</h2>
              <p className="text-xs text-stone-400">Immutable ledger of financial and administrative actions</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-stone-400 font-semibold text-[10px] uppercase">
                    <th className="pb-2.5 pl-2">Timestamp</th>
                    <th className="pb-2.5">Action</th>
                    <th className="pb-2.5">Admin</th>
                    <th className="pb-2.5">Target</th>
                    <th className="pb-2.5">Target ID</th>
                    <th className="pb-2.5 text-right pr-2">Changes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-white/5 transition-colors font-mono text-[11px]">
                      <td className="py-3 pl-2 text-stone-400">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="py-3 font-bold text-[#dfb76c]">{log.action}</td>
                      <td className="py-3 text-stone-300">{log.admin_name || log.admin_id}</td>
                      <td className="py-3 uppercase text-stone-400">{log.target_type}</td>
                      <td className="py-3 text-stone-500 truncate max-w-xs">{log.target_id}</td>
                      <td className="py-3 text-right pr-2 text-stone-400 truncate max-w-xs">
                        {JSON.stringify(log.new_value || {})}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MODULE 8: SOUND SANCTUARY MUSIC */}
        {activeModule === 'music' && (
          <div className="p-6 rounded-3xl bg-[#0e1224] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Sound Sanctuary Tracks</h2>
                <p className="text-xs text-stone-400">{tracks.length} acoustic soundscapes and frequency sessions</p>
              </div>
              <button
                onClick={() => setShowAddTrackModal(true)}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-[#dfb76c] to-[#d4af37] text-[#070913] text-xs font-bold shadow-md flex items-center space-x-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Publish Track</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-stone-400 font-semibold text-[10px] uppercase">
                    <th className="pb-2.5 pl-2">Title</th>
                    <th className="pb-2.5">Guide / Mentor</th>
                    <th className="pb-2.5">Category</th>
                    <th className="pb-2.5">Tier</th>
                    <th className="pb-2.5">Duration</th>
                    <th className="pb-2.5 text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {tracks.map((t) => (
                    <tr key={t.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 pl-2 font-semibold text-white">{t.title}</td>
                      <td className="py-3 text-stone-300">{t.artistOrMentor}</td>
                      <td className="py-3 text-stone-400">{t.categoryLabel}</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          t.tier === 'free' ? 'bg-stone-500/20 text-stone-300' : 'bg-[#dfb76c]/20 text-[#dfb76c]'
                        }`}>
                          {t.tier}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-stone-400">{t.durationFormatted}</td>
                      <td className="py-3 text-right pr-2">
                        <button
                          onClick={() => deleteTrack(t.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* MODALS */}
      {/* 1. Configure Mentor Business Settings */}
      {editingMentor && (
        <div 
          onClick={() => setEditingMentor(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#12162d] border border-white/10 rounded-3xl p-6 text-white space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Configure {editingMentor.name}</h3>
              <button onClick={() => setEditingMentor(null)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMentorSettings} className="space-y-3 text-xs">
              <div>
                <label className="text-stone-300 block mb-1">Referral Code</label>
                <input
                  type="text"
                  required
                  value={mentorSettingsForm.referralCode}
                  onChange={(e) => setMentorSettingsForm({ ...mentorSettingsForm, referralCode: e.target.value.toUpperCase() })}
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-300 block mb-1">Commission Rate (%)</label>
                  <input
                    type="number"
                    min="5"
                    max="50"
                    step="0.5"
                    value={mentorSettingsForm.commissionPercentage}
                    onChange={(e) => setMentorSettingsForm({ ...mentorSettingsForm, commissionPercentage: parseFloat(e.target.value) || 15 })}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="text-stone-300 block mb-1">Commission Type</label>
                  <select
                    value={mentorSettingsForm.commission_type}
                    onChange={(e) => setMentorSettingsForm({ ...mentorSettingsForm, commission_type: e.target.value as any })}
                    className="w-full p-2.5 bg-[#141830] border border-white/10 rounded-xl text-white"
                  >
                    <option value="recurring">Recurring (Ongoing)</option>
                    <option value="first_payment">First Payment Only</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-stone-300 block mb-1">Payout Minimum (RM)</label>
                <input
                  type="number"
                  min="50"
                  value={mentorSettingsForm.payout_minimum}
                  onChange={(e) => setMentorSettingsForm({ ...mentorSettingsForm, payout_minimum: parseFloat(e.target.value) || 100 })}
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white"
                />
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#dfb76c] to-[#d4af37] text-[#070913] font-bold text-xs shadow-md"
                >
                  Save Business Settings
                </button>
                <button
                  type="button"
                  onClick={() => setEditingMentor(null)}
                  className="px-4 py-3 rounded-xl bg-white/10 text-stone-300 font-medium text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Create Coupon Modal */}
      {showAddCouponModal && (
        <div 
          onClick={() => setShowAddCouponModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#12162d] border border-white/10 rounded-3xl p-6 text-white space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Create New Coupon</h3>
              <button onClick={() => setShowAddCouponModal(false)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCouponSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-stone-300 block mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. PEACE25"
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white font-mono uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-stone-300 block mb-1">Type</label>
                  <select
                    value={couponForm.type}
                    onChange={(e) => setCouponForm({ ...couponForm, type: e.target.value as any })}
                    className="w-full p-2.5 bg-[#141830] border border-white/10 rounded-xl text-white"
                  >
                    <option value="percentage">Percentage Off (%)</option>
                    <option value="fixed_amount">Fixed Amount (RM)</option>
                    <option value="free_trial_days">Free Trial Days</option>
                  </select>
                </div>

                <div>
                  <label className="text-stone-300 block mb-1">Value</label>
                  <input
                    type="number"
                    required
                    value={couponForm.value}
                    onChange={(e) => setCouponForm({ ...couponForm, value: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-stone-300 block mb-1">Usage Limit</label>
                <input
                  type="number"
                  value={couponForm.usage_limit}
                  onChange={(e) => setCouponForm({ ...couponForm, usage_limit: parseInt(e.target.value) || 500 })}
                  className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white"
                />
              </div>

              <div className="pt-2 flex items-center space-x-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#dfb76c] to-[#d4af37] text-[#070913] font-bold text-xs shadow-md"
                >
                  Create & Activate Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Mark Payout Paid Modal */}
      {payoutToPay && (
        <div 
          onClick={() => setPayoutToPay(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#12162d] border border-white/10 rounded-3xl p-6 text-white space-y-4"
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Confirm Bank Payout</h3>
              <button onClick={() => setPayoutToPay(null)} className="text-stone-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs space-y-1">
              <p className="text-stone-400">Recipient: <strong className="text-white">{payoutToPay.mentor_name}</strong></p>
              <p className="text-stone-400">Amount: <strong className="text-[#dfb76c] text-sm">{formatMYR(payoutToPay.amount)}</strong></p>
            </div>

            <div>
              <label className="text-xs text-stone-300 block mb-1">
                Bank Wire Reference Number (e.g. MBB-TX-99841)
              </label>
              <input
                type="text"
                value={payoutReference}
                onChange={(e) => setPayoutReference(e.target.value)}
                placeholder="Enter bank transfer reference..."
                className="w-full p-2.5 bg-black/40 border border-white/10 rounded-xl text-white font-mono text-xs"
              />
            </div>

            <div className="pt-2 flex items-center space-x-2">
              <button
                type="button"
                onClick={handleConfirmPayoutPaid}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-xs shadow-md"
              >
                Mark Paid & Notify Mentor
              </button>
              <button
                type="button"
                onClick={() => setPayoutToPay(null)}
                className="px-4 py-3 rounded-xl bg-white/10 text-stone-300 text-xs font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
