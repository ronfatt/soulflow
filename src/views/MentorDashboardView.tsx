import React, { useState } from 'react';
import { 
  Award, 
  Users, 
  Crown, 
  DollarSign, 
  Share2, 
  Copy, 
  Check, 
  Sparkles, 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Gift,
  QrCode,
  Filter,
  AlertCircle,
  CreditCard,
  Send,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { referralService, DateRangeFilter } from '../services/referralService';
import { payoutService, MINIMUM_PAYOUT_AMOUNT } from '../services/payoutService';
import { formatMYR } from '../services/paymentService';
import { Mentor, PayoutRecord } from '../types';

export const MentorDashboardView: React.FC = () => {
  const { 
    mentors, 
    commissions, 
    payoutRequests,
    requestMentorPayout,
    showToast, 
    setIsAdminView,
    setIsMentorView 
  } = useApp();

  // Active mentor for the dashboard (defaults to Dr. Maya Chen or Alicia Sterling)
  const defaultMentorId = mentors.find(m => m.referralCode === 'MAYA888')?.id || mentors[0]?.id || 'b0000000-0000-0000-0000-000000000005';
  const [activeMentorId, setActiveMentorId] = useState<string>(defaultMentorId);
  const [activeTab, setActiveTab] = useState<'referral' | 'students' | 'commissions' | 'payouts'>('referral');
  const [dateFilter, setDateFilter] = useState<DateRangeFilter>('30d');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Payout request modal
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [payoutNotes, setPayoutNotes] = useState('');
  const [isSubmittingPayout, setIsSubmittingPayout] = useState(false);

  const currentMentor: Mentor = mentors.find(m => m.id === activeMentorId) || mentors[0];
  const stats = referralService.getMentorStats(currentMentor.id, dateFilter);
  const students = referralService.getReferrals(currentMentor.id);
  const mentorCommissions = referralService.getCommissions(currentMentor.id);
  const mentorPayouts = payoutRequests.filter(p => p.mentor_id === currentMentor.id);

  // Available balance for payout is Approved commissions minus already requested/paid payouts
  const approvedBalance = stats.approvedCommission;
  const canRequestPayout = approvedBalance >= MINIMUM_PAYOUT_AMOUNT;

  const referralLink = `${window.location.origin}/signup?ref=${currentMentor.referralCode}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    showToast(`Referral link copied: ${referralLink}`);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentMentor.referralCode);
    setCopiedCode(true);
    showToast(`Referral code copied: ${currentMentor.referralCode}`);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleShareLink = () => {
    if (navigator.share) {
      navigator.share({
        title: `Practice with ${currentMentor.name} on SoulFlow`,
        text: `Join my guided wellness practice on SoulFlow. Use my link to get 7 Days Free VIP Access!`,
        url: referralLink,
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  const handleSubmitPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canRequestPayout) return;
    setIsSubmittingPayout(true);
    try {
      const res = await requestMentorPayout(currentMentor.id, currentMentor.name, approvedBalance, payoutNotes);
      if (res.success) {
        showToast(`Payout request for ${formatMYR(approvedBalance)} submitted successfully!`);
        setShowPayoutModal(false);
        setPayoutNotes('');
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#dfb76c', '#a599e0', '#ffffff'],
        });
      } else {
        showToast(res.error || 'Failed to submit payout request');
      }
    } finally {
      setIsSubmittingPayout(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070913] text-white pb-24">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-40 bg-[#070913]/90 backdrop-blur-xl border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMentorView(false)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 transition-colors flex items-center space-x-1.5 text-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Sanctuary</span>
            </button>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-[#dfb76c]/20 text-[#dfb76c]">
                <Award className="w-4 h-4" />
              </span>
              <h1 className="text-sm sm:text-base font-bold text-white">Mentor Partner Portal</h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Mentor Switcher */}
            <div className="flex items-center space-x-2">
              <img
                src={currentMentor.avatarUrl}
                alt={currentMentor.name}
                className="w-7 h-7 rounded-full object-cover border border-[#dfb76c]/40"
              />
              <select
                value={activeMentorId}
                onChange={(e) => setActiveMentorId(e.target.value)}
                className="bg-[#141830] border border-white/10 rounded-xl px-2.5 py-1 text-xs text-stone-200 focus:outline-none focus:border-[#dfb76c]"
              >
                {mentors.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.referralCode})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                setIsMentorView(false);
                setIsAdminView(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[11px] font-medium text-stone-300 transition-colors hidden sm:block"
            >
              Admin View
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Mentor Profile Greeting & Date Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-[#141830] via-[#101426] to-[#0c0e1c] border border-white/10">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs text-[#dfb76c] font-semibold tracking-wider uppercase">
                Guide Partner • {currentMentor.commission_type === 'recurring' ? 'Recurring (Ongoing)' : 'First Payment Only'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#dfb76c]/20 text-[#f3cf7a] font-bold">
                {currentMentor.commissionPercentage}% Commission
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{currentMentor.name}</h2>
            <p className="text-xs text-stone-400 mt-0.5">{currentMentor.specialization}</p>
          </div>

          {/* Date Filter Pills */}
          <div className="flex items-center space-x-1.5 self-start sm:self-center p-1 rounded-2xl bg-black/40 border border-white/10">
            {(['7d', '30d', '90d', 'this_year', 'all'] as DateRangeFilter[]).map((range) => {
              const labels: Record<DateRangeFilter, string> = {
                '7d': '7 Days',
                '30d': '30 Days',
                '90d': '90 Days',
                'this_year': 'This Year',
                'all': 'All Time',
              };
              return (
                <button
                  key={range}
                  onClick={() => setDateFilter(range)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-all ${
                    dateFilter === range
                      ? 'bg-[#dfb76c] text-[#070913] font-bold shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {labels[range]}
                </button>
              );
            })}
          </div>
        </div>

        {/* 9 Summary KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* 1. Referral Code */}
          <div className="p-4 rounded-2xl bg-[#101428] border border-white/10">
            <span className="text-[11px] text-stone-400 block mb-1">My Referral Code</span>
            <div className="flex items-center justify-between">
              <span className="text-lg font-mono font-bold text-[#dfb76c] tracking-wider">
                {currentMentor.referralCode}
              </span>
              <button
                onClick={handleCopyCode}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-stone-300"
                title="Copy Code"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* 2. Total Students */}
          <div className="p-4 rounded-2xl bg-[#101428] border border-white/10">
            <span className="text-[11px] text-stone-400 block mb-1">Total Students</span>
            <p className="text-xl font-bold text-white">{stats.totalStudents}</p>
            <span className="text-[10px] text-stone-500">Referred accounts</span>
          </div>

          {/* 3. New This Month */}
          <div className="p-4 rounded-2xl bg-[#101428] border border-white/10">
            <span className="text-[11px] text-stone-400 block mb-1">New This Month</span>
            <p className="text-xl font-bold text-white">{stats.newStudentsThisMonth}</p>
            <span className="text-[10px] text-emerald-400">Active acquisition</span>
          </div>

          {/* 4. Paid Subscribers */}
          <div className="p-4 rounded-2xl bg-[#101428] border border-white/10">
            <span className="text-[11px] text-stone-400 block mb-1">Paid Subscribers</span>
            <p className="text-xl font-bold text-[#f3cf7a]">{stats.subscriptionsGenerated}</p>
            <span className="text-[10px] text-stone-500">Converted users</span>
          </div>

          {/* 5. Conversion Rate */}
          <div className="p-4 rounded-2xl bg-[#101428] border border-white/10">
            <span className="text-[11px] text-stone-400 block mb-1">Conversion Rate</span>
            <p className="text-xl font-bold text-emerald-400">{stats.conversionRate}%</p>
            <span className="text-[10px] text-stone-500">Trial to Paid</span>
          </div>

          {/* 6. Total Revenue Generated */}
          <div className="p-4 rounded-2xl bg-[#101428] border border-white/10">
            <span className="text-[11px] text-stone-400 block mb-1">Total Revenue</span>
            <p className="text-xl font-bold text-white">{formatMYR(stats.totalRevenueGenerated)}</p>
            <span className="text-[10px] text-stone-500">Gross student volume</span>
          </div>

          {/* 7. Pending Commission */}
          <div className="p-4 rounded-2xl bg-[#101428] border border-white/10">
            <span className="text-[11px] text-stone-400 block mb-1">Pending Commission</span>
            <p className="text-xl font-bold text-amber-400">{formatMYR(stats.pendingCommission)}</p>
            <span className="text-[10px] text-stone-500">Under verification</span>
          </div>

          {/* 8. Approved Commission */}
          <div className="p-4 rounded-2xl bg-[#101428] border border-[#dfb76c]/30 bg-gradient-to-br from-[#181c38] to-[#121528]">
            <span className="text-[11px] text-[#dfb76c] font-semibold block mb-1">Available for Payout</span>
            <p className="text-xl font-bold text-white">{formatMYR(approvedBalance)}</p>
            <span className="text-[10px] text-stone-400">Min. RM100</span>
          </div>

          {/* 9. Paid Commission */}
          <div className="p-4 rounded-2xl bg-[#101428] border border-white/10">
            <span className="text-[11px] text-stone-400 block mb-1">Paid Commission</span>
            <p className="text-xl font-bold text-emerald-400">{formatMYR(stats.paidCommission)}</p>
            <span className="text-[10px] text-stone-500">Sent to bank</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center space-x-2 border-b border-white/10 pb-2">
          <button
            onClick={() => setActiveTab('referral')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'referral'
                ? 'bg-[#dfb76c] text-[#070913]'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            My Referral & Funnel
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'students'
                ? 'bg-[#dfb76c] text-[#070913]'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            My Students ({students.length})
          </button>
          <button
            onClick={() => setActiveTab('commissions')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'commissions'
                ? 'bg-[#dfb76c] text-[#070913]'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Commissions Ledger ({mentorCommissions.length})
          </button>
          <button
            onClick={() => setActiveTab('payouts')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'payouts'
                ? 'bg-[#dfb76c] text-[#070913]'
                : 'text-stone-400 hover:text-white hover:bg-white/5'
            }`}
          >
            Payout History ({mentorPayouts.length})
          </button>
        </div>

        {/* TAB 1: MY REFERRAL & FUNNEL */}
        {activeTab === 'referral' && (
          <div className="space-y-6">
            {/* Referral Link & QR Card */}
            <div className="p-6 rounded-3xl bg-[#12152b] border border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <div>
                  <span className="text-xs uppercase font-bold tracking-wider text-[#dfb76c]">
                    Unique Student Invitation
                  </span>
                  <h3 className="text-xl font-bold text-white mt-1">Share Your Sacred Practice</h3>
                  <p className="text-xs text-stone-300">
                    Students registering through your link or code automatically receive <strong>7 Days Free VIP Access</strong>, and you earn an ongoing <strong>{currentMentor.commissionPercentage}%</strong> commission on their subscription renewals.
                  </p>
                </div>

                {/* Big Code Pill */}
                <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-semibold">Your Referral Code</span>
                    <p className="text-2xl font-mono font-bold text-[#dfb76c] tracking-widest">
                      {currentMentor.referralCode}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCopyCode}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors flex items-center space-x-1.5"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy Code'}</span>
                    </button>
                    <button
                      onClick={handleShareLink}
                      className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#dfb76c] to-[#d4af37] text-[#070913] text-xs font-bold shadow-md hover:brightness-105 transition-all flex items-center space-x-1.5"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share Link</span>
                    </button>
                  </div>
                </div>

                {/* Full Link Input */}
                <div>
                  <label className="text-xs text-stone-400 block mb-1">Direct Signup Link</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      readOnly
                      value={referralLink}
                      className="flex-1 bg-black/30 border border-white/10 rounded-xl px-3 py-2 text-xs text-stone-300 font-mono select-all focus:outline-none"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-stone-200 transition-colors"
                    >
                      {copiedLink ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>

              {/* QR Code Placeholder */}
              <div className="p-5 rounded-2xl bg-black/40 border border-white/10 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-32 h-32 rounded-2xl bg-white p-2.5 flex items-center justify-center shadow-lg">
                  {/* Clean SVG Mock QR Code */}
                  <div className="w-full h-full border-4 border-black p-1 flex flex-col justify-between">
                    <div className="flex justify-between">
                      <div className="w-6 h-6 bg-black"></div>
                      <div className="w-6 h-6 bg-black"></div>
                    </div>
                    <div className="text-center font-mono text-[9px] font-black text-black">
                      SOULFLOW
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="w-6 h-6 bg-black"></div>
                      <div className="w-3 h-3 bg-black"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Student QR Code</p>
                  <p className="text-[10px] text-stone-400">Scan to open VIP signup directly</p>
                </div>
              </div>
            </div>

            {/* Funnel Visualization */}
            <div className="p-6 rounded-3xl bg-[#12152b] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Referral Conversion Funnel</h3>
                  <p className="text-xs text-stone-400">Flow of students from discovery to ongoing practice</p>
                </div>
                <span className="text-xs font-semibold text-emerald-400">
                  {stats.conversionRate}% Overall Conversion
                </span>
              </div>

              {/* 4-Stage Funnel */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
                {/* 1. Clicks */}
                <div className="p-4 rounded-2xl bg-[#181c38] border border-white/5 space-y-1">
                  <span className="text-[11px] text-stone-400 block font-medium">1. Clicks / Scans</span>
                  <p className="text-2xl font-bold text-white">{stats.clicksCount}</p>
                  <p className="text-[10px] text-stone-500">Link visits</p>
                  <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-blue-400 h-full w-full"></div>
                  </div>
                </div>

                {/* 2. Registrations */}
                <div className="p-4 rounded-2xl bg-[#181c38] border border-white/5 space-y-1">
                  <span className="text-[11px] text-stone-400 block font-medium">2. Registrations</span>
                  <p className="text-2xl font-bold text-white">{stats.totalStudents}</p>
                  <p className="text-[10px] text-stone-500">
                    {stats.clicksCount > 0 ? `${Math.round((stats.totalStudents / stats.clicksCount) * 100)}% of clicks` : '0%'}
                  </p>
                  <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-[#a599e0] h-full"
                      style={{ width: `${Math.min(100, Math.round((stats.totalStudents / stats.clicksCount) * 100))}%` }}
                    ></div>
                  </div>
                </div>

                {/* 3. Trials Started */}
                <div className="p-4 rounded-2xl bg-[#181c38] border border-white/5 space-y-1">
                  <span className="text-[11px] text-stone-400 block font-medium">3. Free Trials</span>
                  <p className="text-2xl font-bold text-white">{stats.trialsCount}</p>
                  <p className="text-[10px] text-stone-500">7-Day VIP trials</p>
                  <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-amber-400 h-full"
                      style={{ width: `${Math.min(100, Math.round((stats.trialsCount / stats.totalStudents) * 100))}%` }}
                    ></div>
                  </div>
                </div>

                {/* 4. Subscriptions */}
                <div className="p-4 rounded-2xl bg-[#181c38] border border-[#dfb76c]/30 space-y-1">
                  <span className="text-[11px] text-[#dfb76c] block font-semibold">4. Paid Subscribers</span>
                  <p className="text-2xl font-bold text-[#f3cf7a]">{stats.subscriptionsGenerated}</p>
                  <p className="text-[10px] text-emerald-400 font-semibold">{stats.conversionRate}% Converted</p>
                  <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div 
                      className="bg-[#dfb76c] h-full"
                      style={{ width: `${stats.conversionRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY STUDENTS */}
        {activeTab === 'students' && (
          <div className="p-6 rounded-3xl bg-[#12152b] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">My Referred Students</h3>
                <p className="text-xs text-stone-400">
                  Privacy-protected roster of practitioners who joined via your referral
                </p>
              </div>
              <span className="text-xs text-stone-400">{students.length} Total</span>
            </div>

            {students.length === 0 ? (
              <div className="text-center py-12 text-stone-500 text-xs">
                No students enrolled yet. Share your code to welcome your first practitioners.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-stone-400 font-semibold">
                      <th className="pb-3 pl-2">Student</th>
                      <th className="pb-3">Join Date</th>
                      <th className="pb-3">Subscription</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 pr-2">Referral Source</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {students.map((s) => (
                      <tr key={s.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 pl-2">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-7 h-7 rounded-full bg-[#1e2348] border border-white/10 flex items-center justify-center text-[11px] font-bold text-stone-300">
                              {s.referredUserName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{s.referredUserName}</p>
                              <p className="text-[10px] text-stone-500">
                                {s.referredUserEmail.replace(/^(.)(.*)(@.*)$/, '$1***$3')}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-stone-300">{s.registrationDate}</td>
                        <td className="py-3">
                          <span className="capitalize text-stone-200 font-medium">
                            {s.subscriptionTier ? `${s.subscriptionTier} Plan` : 'Free Sanctuary'}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            s.conversionStatus === 'converted'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {s.conversionStatus === 'converted' ? 'Converted' : 'Trialing'}
                          </span>
                        </td>
                        <td className="py-3 pr-2 text-stone-400 font-mono text-[11px]">
                          Code {s.referralCode}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: COMMISSIONS LEDGER */}
        {activeTab === 'commissions' && (
          <div className="space-y-4">
            {/* Header & Payout Action Bar */}
            <div className="p-6 rounded-3xl bg-[#12152b] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-white">Commissions Ledger</h3>
                <p className="text-xs text-stone-400">
                  Earned {currentMentor.commissionPercentage}% on student transactions
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 block">Available Balance</span>
                  <span className="text-lg font-bold text-white">{formatMYR(approvedBalance)}</span>
                </div>

                <button
                  onClick={() => setShowPayoutModal(true)}
                  disabled={!canRequestPayout}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#dfb76c] via-[#f3cf7a] to-[#d4af37] text-[#070913] text-xs font-bold shadow-gold-glow hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request Payout</span>
                </button>
              </div>
            </div>

            {!canRequestPayout && (
              <p className="text-[11px] text-stone-400 px-2 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3 text-amber-400" />
                <span>Minimum payout amount is {formatMYR(MINIMUM_PAYOUT_AMOUNT)}. Available: {formatMYR(approvedBalance)}</span>
              </p>
            )}

            {/* Commissions Table */}
            <div className="p-6 rounded-3xl bg-[#12152b] border border-white/10 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-stone-400 font-semibold">
                    <th className="pb-3 pl-2">Date</th>
                    <th className="pb-3">Student</th>
                    <th className="pb-3">Plan</th>
                    <th className="pb-3">Payment</th>
                    <th className="pb-3">Rate</th>
                    <th className="pb-3">Commission</th>
                    <th className="pb-3 pr-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {mentorCommissions.map((c) => {
                    const statusLower = c.commissionStatus.toLowerCase();
                    return (
                      <tr key={c.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 pl-2 text-stone-400">{c.date}</td>
                        <td className="py-3 text-white font-medium">{c.referredUserName}</td>
                        <td className="py-3 text-stone-300">{c.planName}</td>
                        <td className="py-3 text-stone-300">{formatMYR(c.paymentAmount)}</td>
                        <td className="py-3 text-stone-400">{c.commissionPercentage}%</td>
                        <td className="py-3 font-bold text-[#f3cf7a]">{formatMYR(c.commissionAmount)}</td>
                        <td className="py-3 pr-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            statusLower === 'paid'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : statusLower === 'approved'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : statusLower === 'rejected'
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}>
                            {c.commissionStatus}
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

        {/* TAB 4: PAYOUT HISTORY */}
        {activeTab === 'payouts' && (
          <div className="p-6 rounded-3xl bg-[#12152b] border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Payout History</h3>
                <p className="text-xs text-stone-400">Withdrawals transferred to your bank account</p>
              </div>
              <span className="text-xs text-stone-400">{mentorPayouts.length} Transfers</span>
            </div>

            {mentorPayouts.length === 0 ? (
              <div className="text-center py-12 text-stone-500 text-xs">
                No payout requests made yet. When your balance reaches {formatMYR(MINIMUM_PAYOUT_AMOUNT)}, click Request Payout.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-stone-400 font-semibold">
                      <th className="pb-3 pl-2">Requested Date</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Reference Number</th>
                      <th className="pb-3 pr-2">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {mentorPayouts.map((p) => {
                      const st = p.status.toLowerCase();
                      return (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 pl-2 text-stone-300">
                            {new Date(p.requested_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 font-bold text-white">{formatMYR(p.amount)}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              st === 'paid'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : st === 'processing'
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : st === 'rejected'
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            }`}>
                              {p.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 text-stone-400 font-mono text-[11px]">
                            {p.reference_number || 'Pending Processing'}
                          </td>
                          <td className="py-3 pr-2 text-stone-400 text-[11px]">
                            {p.notes || 'Standard wire'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payout Request Modal */}
      {showPayoutModal && (
        <div 
          onClick={() => setShowPayoutModal(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#12152b] border border-white/10 rounded-3xl p-6 text-white space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Request Commission Payout</h3>
              <button onClick={() => setShowPayoutModal(false)} className="text-stone-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10">
              <span className="text-[11px] text-stone-400 block">Requested Amount</span>
              <p className="text-2xl font-bold text-[#dfb76c]">{formatMYR(approvedBalance)}</p>
              <span className="text-[10px] text-stone-500">Processed within 2 business days</span>
            </div>

            <div>
              <label className="text-xs text-stone-300 block mb-1">
                Bank Account / Payout Notes (e.g. Maybank 5140...)
              </label>
              <textarea
                value={payoutNotes}
                onChange={(e) => setPayoutNotes(e.target.value)}
                placeholder="Enter bank name, account number, or DuitNow ID..."
                rows={3}
                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-[#dfb76c]"
              />
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <button
                type="button"
                onClick={handleSubmitPayout}
                disabled={isSubmittingPayout}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#dfb76c] to-[#d4af37] text-[#070913] text-xs font-bold shadow-md hover:brightness-105 transition-all disabled:opacity-50"
              >
                {isSubmittingPayout ? 'Submitting...' : 'Confirm Payout Request'}
              </button>
              <button
                type="button"
                onClick={() => setShowPayoutModal(false)}
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
