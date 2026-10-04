import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  UserProfile, 
  ContentMood, 
  SubscriptionTier, 
  Track, 
  Mentor, 
  Program, 
  Course, 
  Playlist, 
  Commission, 
  ReferralCodeInfo,
  CommissionStatus,
  UserProgramProgress,
  StreakInfo,
  SubscriptionPlan,
  SubscriptionRecord,
  Coupon,
  PaymentRecord,
  PayoutRecord,
  AuditLog,
  PaymentProvider,
  CommissionType,
  BillingCycle
} from '../types';
import { Language, TRANSLATIONS } from '../i18n/translations';
import { 
  TRACKS, 
  MENTORS, 
  PROGRAMS, 
  COURSES, 
  REFERRAL_CODES, 
  INITIAL_COMMISSIONS,
  SUBSCRIPTION_PLANS,
  COUPONS,
  INITIAL_PAYMENTS,
  INITIAL_PAYOUTS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';
import { contentService } from '../services/contentService';
import { libraryService } from '../services/libraryService';
import { referralService } from '../services/referralService';
import { subscriptionService } from '../services/subscriptionService';
import { paymentService } from '../services/paymentService';
import { payoutService } from '../services/payoutService';
import { authService } from '../services/authService';

export type MainTab = 'home' | 'explore' | 'journey' | 'library' | 'profile';

interface AppContextType {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  selectedMood: ContentMood;
  setSelectedMood: (mood: ContentMood) => void;
  user: UserProfile;
  tracks: Track[];
  mentors: Mentor[];
  programs: Program[];
  courses: Course[];
  playlists: Playlist[];
  favorites: string[];
  downloads: string[];
  listeningHistory: string[];
  commissions: Commission[];
  referralCodes: Record<string, ReferralCodeInfo>;
  selectedMentor: Mentor | null;
  selectedProgram: Program | null;
  selectedCourse: Course | null;
  activeDailySession: { program: Program; dayNumber: number } | null;
  followingMentors: string[];
  userProgramProgress: Record<string, UserProgramProgress>;
  streakInfo: StreakInfo;
  showMembershipModal: boolean;
  showOnboarding: boolean;
  showAuthModal: boolean;
  showCheckoutModal: boolean;
  checkoutParams: { tier: SubscriptionTier; cycle: BillingCycle };
  isAdminView: boolean;
  isMentorView: boolean;
  isMobileFrame: boolean;
  toastMessage: string | null;
  setIsMentorView: (show: boolean) => void;
  // Business State
  subscriptionPlans: SubscriptionPlan[];
  activeSubscription: SubscriptionRecord | null;
  coupons: Coupon[];
  payoutRequests: PayoutRecord[];
  payments: PaymentRecord[];
  auditLogs: AuditLog[];
  // Actions
  toggleFavorite: (trackId: string) => void;
  toggleDownload: (trackId: string) => void;
  recordListeningHistory: (trackId: string) => void;
  createPlaylist: (title: string, trackIds?: string[]) => void;
  addTrackToPlaylist: (playlistId: string, trackId: string) => void;
  completeProgramLesson: (programId: string, dayNumber: number) => void;
  startProgram: (programId: string) => void;
  openDailySession: (program: Program, dayNumber: number) => void;
  closeDailySession: () => void;
  completeDailyLesson: (programId: string, dayNumber: number, lessonId: string) => void;
  completeProgramDay: (programId: string, dayNumber: number) => void;
  getActiveProgramProgress: (programId: string) => UserProgramProgress | undefined;
  toggleFollowMentor: (mentorId: string) => void;
  isFollowingMentor: (mentorId: string) => boolean;
  applyReferralCode: (code: string) => Promise<{ success: boolean; message: string; discount?: number; trialDays?: number }>;
  upgradeTier: (tier: SubscriptionTier, billingCycle?: 'monthly' | 'annual') => void;
  openCheckoutModal: (tier: SubscriptionTier, cycle?: BillingCycle) => void;
  closeCheckoutModal: () => void;
  upgradeTierWithPayment: (tier: SubscriptionTier, billingCycle: BillingCycle, provider: PaymentProvider, discount?: number) => Promise<void>;
  cancelCurrentSubscription: () => Promise<void>;
  canAccessPremiumContent: (itemTier?: SubscriptionTier, itemType?: 'track' | 'program' | 'course') => { canAccess: boolean; requiredTier?: SubscriptionTier; reason?: string };
  requestMentorPayout: (mentorId: string, mentorName: string, amount: number, notes?: string) => Promise<{ success: boolean; error?: string }>;
  approvePayout: (payoutId: string) => Promise<void>;
  rejectPayout: (payoutId: string, reason: string) => Promise<void>;
  markPayoutPaid: (payoutId: string, referenceNumber: string) => Promise<void>;
  updateMentorBusinessSettings: (mentorId: string, settings: Partial<Mentor>) => Promise<void>;
  createCoupon: (coupon: Omit<Coupon, 'id' | 'created_at' | 'usage_count'>) => void;
  updateSubscriptionPlan: (planId: string, updates: Partial<SubscriptionPlan>) => void;
  refundPayment: (paymentId: string) => Promise<void>;
  openMentorDetail: (mentor: Mentor) => void;
  openProgramDetail: (program: Program) => void;
  openCourseDetail: (course: Course) => void;
  closeDetailModal: () => void;
  setShowMembershipModal: (show: boolean) => void;
  setShowOnboarding: (show: boolean) => void;
  setShowAuthModal: (show: boolean) => void;
  setIsAdminView: (show: boolean) => void;
  setIsMobileFrame: (isMobile: boolean) => void;
  showToast: (msg: string) => void;
  // Language & i18n
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof TRANSLATIONS['zh'], params?: Record<string, string | number>) => string;
  // Admin actions
  addTrack: (track: Omit<Track, 'id' | 'plays' | 'likes'>) => void;
  updateTrack: (id: string, updates: Partial<Track>) => void;
  deleteTrack: (id: string) => void;
  addMentor: (mentor: Omit<Mentor, 'id' | 'followersCount' | 'studentsCount' | 'rating'>) => void;
  updateCommissionStatus: (commissionId: string, status: CommissionStatus) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Language: Default to Chinese ('zh') as requested
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('soulflow_lang') as Language) || 'zh';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('soulflow_lang', lang);
  };

  const t = (key: keyof typeof TRANSLATIONS['zh'], params?: Record<string, string | number>): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.zh;
    let text = (dict as any)[key] || TRANSLATIONS.zh[key] || String(key);
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return text;
  };

  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [selectedMood, setSelectedMood] = useState<ContentMood>('sleep');
  
  // User profile
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('soulflow_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return {
      id: '00000000-0000-0000-0000-000000001001',
      name: 'Alicia Lin',
      email: 'alicia.lin@soulflow.wellness',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      membershipStatus: 'free',
      billingCycle: 'annual',
      preferredDuration: 15,
      wellnessGoals: ['Deep Sleep', 'Stress Relief', 'Spiritual Growth'],
      streakDays: 4,
      totalMinutesListened: 184,
    };
  });

  const [tracks, setTracks] = useState<Track[]>(TRACKS);
  const [mentors, setMentors] = useState<Mentor[]>(MENTORS);
  const [programs, setPrograms] = useState<Program[]>(PROGRAMS);
  const [courses] = useState<Course[]>(COURSES);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [favorites, setFavorites] = useState<string[]>(['d0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000005']);
  const [downloads, setDownloads] = useState<string[]>(['d0000000-0000-0000-0000-000000000001']);
  const [listeningHistory, setListeningHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem('soulflow_listening_history');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return ['d0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000002'];
  });
  const [commissions, setCommissions] = useState<Commission[]>(INITIAL_COMMISSIONS);
  const [referralCodes, setReferralCodes] = useState<Record<string, ReferralCodeInfo>>(REFERRAL_CODES);

  // Modals & Navigation state
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [activeDailySession, setActiveDailySession] = useState<{ program: Program; dayNumber: number } | null>(null);
  const [showMembershipModal, setShowMembershipModal] = useState<boolean>(false);
  const [showOnboarding, setShowOnboarding] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [isAdminView, setIsAdminView] = useState<boolean>(false);
  const [isMentorView, setIsMentorView] = useState<boolean>(false);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Mentor Following state with persistence
  const [followingMentors, setFollowingMentors] = useState<string[]>(() => {
    const saved = localStorage.getItem('soulflow_following_mentors');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return ['b0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000006'];
  });

  // User Program Progress state with persistence
  const [userProgramProgress, setUserProgramProgress] = useState<Record<string, UserProgramProgress>>(() => {
    const saved = localStorage.getItem('soulflow_program_progress');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return {
      'e0000000-0000-0000-0000-000000000002': {
        id: 'prog-stress-01',
        user_id: '00000000-0000-0000-0000-000000001001',
        program_id: 'e0000000-0000-0000-0000-000000000002',
        current_day: 5,
        completed_days: [1, 2, 3, 4],
        completed_lessons: [
          'e0000000-0000-0000-0000-000000000002-day-1-l1',
          'e0000000-0000-0000-0000-000000000002-day-1-l2',
          'e0000000-0000-0000-0000-000000000002-day-1-l3',
          'e0000000-0000-0000-0000-000000000002-day-1-l4',
          'e0000000-0000-0000-0000-000000000002-day-2-l1',
          'e0000000-0000-0000-0000-000000000002-day-2-l2',
          'e0000000-0000-0000-0000-000000000002-day-3-l1',
          'e0000000-0000-0000-0000-000000000002-day-4-l1',
        ],
        progress_percentage: 35,
        started_at: '2026-09-20T08:00:00Z',
        last_activity: '2026-09-24T20:30:00Z',
      },
      'e0000000-0000-0000-0000-000000000001': {
        id: 'prog-sleep-01',
        user_id: '00000000-0000-0000-0000-000000001001',
        program_id: 'e0000000-0000-0000-0000-000000000001',
        current_day: 3,
        completed_days: [1, 2],
        completed_lessons: [
          'e0000000-0000-0000-0000-000000000001-day-1-l1',
          'e0000000-0000-0000-0000-000000000001-day-2-l1',
        ],
        progress_percentage: 28,
        started_at: '2026-09-22T21:00:00Z',
        last_activity: '2026-09-24T22:00:00Z',
      },
    };
  });

  // Streak state with subtle persistence
  const [streakInfo, setStreakInfo] = useState<StreakInfo>(() => {
    const saved = localStorage.getItem('soulflow_streak_info');
    if (saved) {
      try { return JSON.parse(saved); } catch (_) {}
    }
    return {
      currentStreak: 5,
      longestStreak: 12,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
  });

  // Business Engine States
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>(() => subscriptionService.getPlans());
  const [activeSubscription, setActiveSubscription] = useState<SubscriptionRecord | null>(() => subscriptionService.getActiveSubscription(user.id));
  const [coupons, setCoupons] = useState<Coupon[]>(() => referralService.getCoupons());
  const [payoutRequests, setPayoutRequests] = useState<PayoutRecord[]>(() => payoutService.getPayouts());
  const [payments, setPayments] = useState<PaymentRecord[]>(() => paymentService.getPayments());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => payoutService.getAuditLogs());
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [checkoutParams, setCheckoutParams] = useState<{ tier: SubscriptionTier; cycle: BillingCycle }>({ tier: 'premium', cycle: 'annual' });

  useEffect(() => {
    localStorage.setItem('soulflow_following_mentors', JSON.stringify(followingMentors));
  }, [followingMentors]);

  useEffect(() => {
    localStorage.setItem('soulflow_program_progress', JSON.stringify(userProgramProgress));
  }, [userProgramProgress]);

  useEffect(() => {
    localStorage.setItem('soulflow_streak_info', JSON.stringify(streakInfo));
  }, [streakInfo]);

  // URL Referral auto-detection: https://appdomain.com/signup?ref=ALICE888
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      referralService.savePendingReferralCode(refCode);
      applyReferralCode(refCode).then((res) => {
        if (res.success) {
          showToast(`Referral code ${refCode} automatically applied from invite link! 7 Days Free Unlocked.`);
          setShowAuthModal(true);
        }
      });
    }

    // Check if free trial has expired
    if (user.membershipStatus !== 'free' && user.membershipExpiresAt) {
      const remainingDays = subscriptionService.getRemainingTrialDays(user);
      const activeSub = subscriptionService.getActiveSubscription(user.id);
      if (remainingDays <= 0 && (!activeSub || activeSub.status === 'cancelled' || activeSub.status === 'expired')) {
        setUser(prev => ({
          ...prev,
          membershipStatus: 'free',
        }));
        showToast('Your free trial period has ended. Choose a plan to continue.');
      }
    }
  }, []);

  // Initial fetch from backend services
  useEffect(() => {
    async function loadData() {
      try {
        const [loadedTracks, loadedMentors, loadedPrograms, loadedFavorites, loadedPlaylists] = await Promise.all([
          contentService.fetchTracks(),
          contentService.fetchMentors(),
          contentService.fetchPrograms(),
          libraryService.fetchFavorites(user.id),
          libraryService.fetchPlaylists(user.id),
        ]);

        const loadedCommissions = referralService.getCommissions();

        if (loadedTracks.length > 0) setTracks(loadedTracks);
        if (loadedMentors.length > 0) setMentors(loadedMentors);
        if (loadedPrograms.length > 0) setPrograms(loadedPrograms);
        if (loadedFavorites.length > 0) setFavorites(loadedFavorites);
        if (loadedPlaylists.length > 0) setPlaylists(loadedPlaylists);
        if (loadedCommissions.length > 0) setCommissions(loadedCommissions);
      } catch (err) {
        console.error('Data load error:', err);
      }
    }
    loadData();
  }, [user.id]);

  // Persistence for user
  useEffect(() => {
    localStorage.setItem('soulflow_user', JSON.stringify(user));
  }, [user]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3800);
  };

  const toggleFavorite = async (trackId: string) => {
    const updated = await libraryService.toggleFavorite(user.id, trackId, favorites);
    setFavorites(updated);
    const exists = favorites.includes(trackId);
    showToast(exists ? 'Removed from Favorites' : 'Added to Favorites');
  };

  const toggleDownload = (trackId: string) => {
    if (user.membershipStatus === 'free') {
      setShowMembershipModal(true);
      showToast('Offline download requires SoulFlow Premium');
      return;
    }
    setDownloads(prev => {
      const exists = prev.includes(trackId);
      const updated = exists ? prev.filter(id => id !== trackId) : [...prev, trackId];
      showToast(exists ? 'Offline download removed' : 'Saved for offline listening');
      return updated;
    });
  };

  const recordListeningHistory = (trackId: string) => {
    setListeningHistory(prev => {
      const filtered = prev.filter(id => id !== trackId);
      const updated = [trackId, ...filtered];
      localStorage.setItem('soulflow_listening_history', JSON.stringify(updated));
      return updated;
    });
    libraryService.recordListeningHistory(user.id, trackId);
  };

  const createPlaylist = async (title: string, trackIds: string[] = []) => {
    const newPlaylist = await libraryService.createPlaylist(
      user.id,
      title,
      'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80',
      trackIds
    );
    setPlaylists(prev => [newPlaylist, ...prev]);
    showToast(`Playlist "${title}" created`);
  };

  const addTrackToPlaylist = async (playlistId: string, trackId: string) => {
    await libraryService.addTrackToPlaylist(playlistId, trackId);
    setPlaylists(prev => prev.map(pl => {
      if (pl.id === playlistId && !pl.trackIds.includes(trackId)) {
        return { ...pl, trackIds: [...pl.trackIds, trackId] };
      }
      return pl;
    }));
    showToast('Track added to playlist');
  };

  const completeProgramLesson = (programId: string, dayNumber: number) => {
    setPrograms(prev => prev.map(prog => {
      if (prog.id === programId) {
        const updatedLessons = prog.lessons.map(lesson => 
          lesson.dayNumber === dayNumber ? { ...lesson, isCompleted: true } : lesson
        );
        return { ...prog, lessons: updatedLessons };
      }
      return prog;
    }));
    completeProgramDay(programId, dayNumber);
  };

  const isFollowingMentor = (mentorId: string) => followingMentors.includes(mentorId);

  const toggleFollowMentor = (mentorId: string) => {
    const mentor = mentors.find(m => m.id === mentorId);
    const mentorName = mentor?.name || 'Mentor';
    const isCurrentlyFollowing = followingMentors.includes(mentorId);

    if (isCurrentlyFollowing) {
      setFollowingMentors(prev => prev.filter(id => id !== mentorId));
      setMentors(prev => prev.map(m => m.id === mentorId ? { ...m, followersCount: Math.max(0, m.followersCount - 1) } : m));
      showToast(`Unfollowed ${mentorName}`);
    } else {
      setFollowingMentors(prev => [...prev, mentorId]);
      setMentors(prev => prev.map(m => m.id === mentorId ? { ...m, followersCount: m.followersCount + 1 } : m));
      showToast(`Following ${mentorName}`);
    }
  };

  const getActiveProgramProgress = (programId: string): UserProgramProgress | undefined => {
    return userProgramProgress[programId];
  };

  const startProgram = (programId: string) => {
    const program = programs.find(p => p.id === programId);
    if (!program) return;

    setUserProgramProgress(prev => {
      if (prev[programId]) return prev;
      const newProg: UserProgramProgress = {
        id: crypto.randomUUID(),
        user_id: user.id,
        program_id: programId,
        current_day: 1,
        completed_days: [],
        completed_lessons: [],
        progress_percentage: 0,
        started_at: new Date().toISOString(),
        last_activity: new Date().toISOString(),
      };
      return { ...prev, [programId]: newProg };
    });
    showToast(`Started "${program.title}"`);
  };

  const openDailySession = (program: Program, dayNumber: number) => {
    setActiveDailySession({ program, dayNumber });
  };

  const closeDailySession = () => {
    setActiveDailySession(null);
  };

  const completeDailyLesson = (programId: string, dayNumber: number, lessonId: string) => {
    setUserProgramProgress(prev => {
      const existing = prev[programId] || {
        id: crypto.randomUUID(),
        user_id: user.id,
        program_id: programId,
        current_day: dayNumber,
        completed_days: [],
        completed_lessons: [],
        progress_percentage: 0,
        started_at: new Date().toISOString(),
        last_activity: new Date().toISOString(),
      };

      const updatedLessons = existing.completed_lessons.includes(lessonId)
        ? existing.completed_lessons
        : [...existing.completed_lessons, lessonId];

      const program = programs.find(p => p.id === programId);
      const day = program?.days?.find(d => d.day_number === dayNumber);
      const totalDayLessons = day ? day.lessons.length : 4;
      const completedForThisDay = updatedLessons.filter((l: string) => l.startsWith(`${programId}-day-${dayNumber}`)).length;

      let updatedCompletedDays = existing.completed_days;
      let newCurrentDay = existing.current_day;

      if (completedForThisDay >= totalDayLessons && !existing.completed_days.includes(dayNumber)) {
        updatedCompletedDays = [...existing.completed_days, dayNumber].sort((a, b) => a - b);
        if (dayNumber >= existing.current_day && dayNumber < (program?.totalDays || 7)) {
          newCurrentDay = dayNumber + 1;
        }
      }

      const totalDays = program?.totalDays || 7;
      const pct = Math.min(100, Math.round((updatedCompletedDays.length / totalDays) * 100));

      return {
        ...prev,
        [programId]: {
          ...existing,
          current_day: newCurrentDay,
          completed_days: updatedCompletedDays,
          completed_lessons: updatedLessons,
          progress_percentage: pct,
          last_activity: new Date().toISOString(),
          completed_at: pct >= 100 ? new Date().toISOString() : null,
        },
      };
    });
  };

  const completeProgramDay = (programId: string, dayNumber: number) => {
    const program = programs.find(p => p.id === programId);
    const totalDays = program?.totalDays || 7;

    setUserProgramProgress(prev => {
      const existing = prev[programId] || {
        id: crypto.randomUUID(),
        user_id: user.id,
        program_id: programId,
        current_day: dayNumber,
        completed_days: [],
        completed_lessons: [],
        progress_percentage: 0,
        started_at: new Date().toISOString(),
        last_activity: new Date().toISOString(),
      };

      const newCompletedDays = existing.completed_days.includes(dayNumber)
        ? existing.completed_days
        : [...existing.completed_days, dayNumber].sort((a, b) => a - b);

      const nextDay = Math.min(totalDays, dayNumber + 1);
      const pct = Math.min(100, Math.round((newCompletedDays.length / totalDays) * 100));

      return {
        ...prev,
        [programId]: {
          ...existing,
          current_day: nextDay,
          completed_days: newCompletedDays,
          progress_percentage: pct,
          last_activity: new Date().toISOString(),
        },
      };
    });

    // Increment streak
    setStreakInfo((prev: StreakInfo) => ({
      ...prev,
      currentStreak: prev.currentStreak + 1,
      longestStreak: Math.max(prev.longestStreak, prev.currentStreak + 1),
      lastActiveDate: new Date().toISOString().split('T')[0],
    }));

    setUser(prev => ({
      ...prev,
      streakDays: prev.streakDays + 1,
    }));

    showToast(`Day ${dayNumber} Completed! 🌿`);
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#a599e0', '#dfb76c', '#ffffff']
      });
    } catch (_) {}
  };

  const openCheckoutModal = (tier: SubscriptionTier, cycle: BillingCycle = 'annual') => {
    setCheckoutParams({ tier, cycle });
    setShowCheckoutModal(true);
    setShowMembershipModal(false);
  };

  const closeCheckoutModal = () => {
    setShowCheckoutModal(false);
  };

  const applyReferralCode = async (rawCode: string) => {
    const res = await referralService.validateReferralCode(rawCode);
    if (!res.valid || !res.info) {
      return { success: false, message: res.message };
    }

    const info = res.info;
    await referralService.recordReferralRegistration(
      info.mentorId,
      info.code,
      user.id,
      user.name,
      user.email,
      'trial'
    );

    // Update user state with trial (e.g. 7 days free)
    setUser(prev => ({
      ...prev,
      referredByCode: info.code,
      membershipStatus: prev.membershipStatus === 'free' ? 'premium' : prev.membershipStatus,
      membershipExpiresAt: new Date(Date.now() + (info.trialDays || 7) * 86400000).toISOString(),
    }));

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#dfb76c', '#a599e0', '#f5f0eb'],
      });
    } catch (_) {}

    return {
      success: true,
      message: `Referral code ${info.code} applied! Referred by ${info.mentorName} — ${info.trialDays} Days Free VIP Access Unlocked!`,
      discount: info.discountPercentage,
      trialDays: info.trialDays,
    };
  };

  const upgradeTierWithPayment = async (
    tier: SubscriptionTier,
    billingCycle: BillingCycle,
    provider: PaymentProvider = 'stripe',
    discountAmount: number = 0
  ) => {
    const { subscription, payment } = await subscriptionService.subscribe(
      user.id,
      tier,
      billingCycle,
      provider,
      discountAmount
    );

    // Update active subscription
    setActiveSubscription(subscription);

    // Update payments list
    setPayments(prev => [payment, ...prev]);

    // Update user profile
    const daysToAdd = billingCycle === 'annual' ? 365 : 30;
    const expiresAt = new Date(Date.now() + daysToAdd * 86400000).toISOString();
    setUser(prev => ({
      ...prev,
      membershipStatus: tier,
      billingCycle,
      membershipExpiresAt: expiresAt,
    }));

    // If user was referred by a mentor, generate commission record
    if (user.referredByCode && payment.amount > 0) {
      const plans = subscriptionService.getPlans();
      const planName = plans.find(p => p.slug === tier)?.name || 'Premium Plan';
      const comm = await referralService.recordSubscriptionCommission(
        user.id,
        user.name,
        user.email,
        subscription.id,
        payment.id,
        payment.amount,
        `${billingCycle === 'annual' ? 'Annual' : 'Monthly'} ${planName}`
      );
      if (comm) {
        setCommissions(prev => [comm, ...prev]);
      }
    }
  };

  const upgradeTier = async (tier: SubscriptionTier, billingCycle: BillingCycle = 'annual') => {
    openCheckoutModal(tier, billingCycle);
  };

  const cancelCurrentSubscription = async () => {
    const cancelled = await subscriptionService.cancelSubscription(user.id);
    if (cancelled) {
      setActiveSubscription(cancelled);
      payoutService.logAudit({
        action: 'subscription_cancelled',
        admin_id: user.id,
        target_type: 'subscription',
        target_id: cancelled.id,
        old_value: { status: 'active' },
        new_value: { status: 'cancelled' },
      });
    }
  };

  const canAccessPremiumContent = (
    itemTier: SubscriptionTier = 'free',
    itemType: 'track' | 'program' | 'course' = 'track'
  ) => {
    return subscriptionService.canAccessPremiumContent(user, itemTier, itemType);
  };

  // Payout actions
  const requestMentorPayout = async (mentorId: string, mentorName: string, amount: number, notes?: string) => {
    const res = payoutService.requestPayout(mentorId, mentorName, amount, notes);
    if (res.success && res.payout) {
      setPayoutRequests(prev => [res.payout!, ...prev]);
    }
    return res;
  };

  const approvePayout = async (payoutId: string) => {
    const res = payoutService.approvePayout(payoutId);
    if (res) {
      setPayoutRequests(prev => prev.map(p => p.id === payoutId ? res : p));
      showToast('Payout approved and scheduled for bank transfer');
    }
  };

  const rejectPayout = async (payoutId: string, reason: string) => {
    const res = payoutService.rejectPayout(payoutId, reason);
    if (res) {
      setPayoutRequests(prev => prev.map(p => p.id === payoutId ? res : p));
      showToast('Payout request rejected');
    }
  };

  const markPayoutPaid = async (payoutId: string, referenceNumber: string) => {
    const res = payoutService.markPayoutPaid(payoutId, referenceNumber);
    if (res) {
      setPayoutRequests(prev => prev.map(p => p.id === payoutId ? res : p));
      showToast(`Payout marked as paid (Ref: ${referenceNumber})`);
    }
  };

  // Admin updates mentor settings (commission rate, type, payout min)
  const updateMentorBusinessSettings = async (mentorId: string, settings: Partial<Mentor>) => {
    const oldMentor = mentors.find(m => m.id === mentorId);
    setMentors(prev => prev.map(m => m.id === mentorId ? { ...m, ...settings } : m));
    payoutService.logAudit({
      action: 'mentor_settings_updated',
      admin_id: 'adm-001',
      target_type: 'commission',
      target_id: mentorId,
      old_value: oldMentor ? { 
        commissionPercentage: oldMentor.commissionPercentage, 
        commission_type: oldMentor.commission_type 
      } : {},
      new_value: settings,
    });
    showToast('Mentor settings updated successfully');
  };

  const createCoupon = (coupon: Omit<Coupon, 'id' | 'created_at' | 'usage_count'>) => {
    const created = referralService.createCoupon(coupon);
    setCoupons(prev => [created, ...prev]);
    showToast(`Coupon ${created.code} created successfully`);
  };

  const updateSubscriptionPlan = (planId: string, updates: Partial<SubscriptionPlan>) => {
    const updated = subscriptionService.updatePlan(planId, updates);
    setSubscriptionPlans(updated);
    payoutService.logAudit({
      action: 'plan_pricing_updated',
      admin_id: 'adm-001',
      target_type: 'plan',
      target_id: planId,
      new_value: updates,
    });
    showToast('Subscription plan pricing updated');
  };

  const refundPayment = async (paymentId: string) => {
    const updated = paymentService.updatePaymentStatus(paymentId, 'refunded');
    if (updated) {
      setPayments(prev => prev.map(p => p.id === paymentId ? updated : p));
      // Reverse commission if associated with this payment
      const reversed = referralService.reverseCommissionForPayment(paymentId);
      if (reversed) {
        setCommissions(prev => prev.map(c => c.paymentId === paymentId ? reversed! : c));
      }
      showToast(`Payment ${paymentId} refunded and associated commissions reversed.`);
    }
  };

  const openMentorDetail = (mentor: Mentor) => setSelectedMentor(mentor);
  const openProgramDetail = (program: Program) => setSelectedProgram(program);
  const openCourseDetail = (course: Course) => setSelectedCourse(course);
  const closeDetailModal = () => {
    setSelectedMentor(null);
    setSelectedProgram(null);
    setSelectedCourse(null);
  };

  // Admin Actions
  const addTrack = async (newTrackData: Omit<Track, 'id' | 'plays' | 'likes'>) => {
    const created = await contentService.createTrack(newTrackData);
    setTracks(prev => [created, ...prev]);
    showToast(`Track "${created.title}" published`);
  };

  const updateTrack = async (id: string, updates: Partial<Track>) => {
    await contentService.updateTrack(id, updates);
    setTracks(prev => prev.map(t => (t.id === id ? { ...t, ...updates } : t)));
    showToast('Track updated');
  };

  const deleteTrack = async (id: string) => {
    await contentService.deleteTrack(id);
    setTracks(prev => prev.filter(t => t.id !== id));
    showToast('Track deleted');
  };

  const addMentor = async (mentorData: Omit<Mentor, 'id' | 'followersCount' | 'studentsCount' | 'rating'>) => {
    const created = await contentService.createMentor(mentorData);
    setMentors(prev => [...prev, created]);
    showToast(`Mentor "${created.name}" registered`);
  };

  const updateCommissionStatus = async (commissionId: string, status: CommissionStatus) => {
    await referralService.updateCommissionStatus(commissionId, status);
    setCommissions(prev => prev.map(c => (c.id === commissionId ? { ...c, commissionStatus: status } : c)));
    showToast(`Commission marked as ${status}`);
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedMood,
        setSelectedMood,
        user,
        tracks,
        mentors,
        programs,
        courses,
        playlists,
        favorites,
        downloads,
        listeningHistory,
        commissions,
        referralCodes,
        selectedMentor,
        selectedProgram,
        selectedCourse,
        activeDailySession,
        followingMentors,
        userProgramProgress,
        streakInfo,
        showMembershipModal,
        showOnboarding,
        showAuthModal,
        showCheckoutModal,
        checkoutParams,
        isAdminView,
        isMentorView,
        isMobileFrame,
        toastMessage,
        setIsMentorView,
        // Business Engine state & methods
        subscriptionPlans,
        activeSubscription,
        coupons,
        payoutRequests,
        payments,
        auditLogs,
        openCheckoutModal,
        closeCheckoutModal,
        upgradeTierWithPayment,
        cancelCurrentSubscription,
        canAccessPremiumContent,
        requestMentorPayout,
        approvePayout,
        rejectPayout,
        markPayoutPaid,
        updateMentorBusinessSettings,
        createCoupon,
        updateSubscriptionPlan,
        refundPayment,
        toggleFavorite,
        toggleDownload,
        recordListeningHistory,
        createPlaylist,
        addTrackToPlaylist,
        completeProgramLesson,
        startProgram,
        openDailySession,
        closeDailySession,
        completeDailyLesson,
        completeProgramDay,
        getActiveProgramProgress,
        toggleFollowMentor,
        isFollowingMentor,
        applyReferralCode,
        upgradeTier,
        openMentorDetail,
        openProgramDetail,
        openCourseDetail,
        closeDetailModal,
        setShowMembershipModal,
        setShowOnboarding,
        setShowAuthModal,
        setIsAdminView,
        setIsMobileFrame,
        showToast,
        language,
        setLanguage,
        t,
        addTrack,
        updateTrack,
        deleteTrack,
        addMentor,
        updateCommissionStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
