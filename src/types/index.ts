export type ContentMood = 'stress' | 'sleep' | 'meditation' | 'relax' | 'focus' | 'spiritual';

export type CategorySlug = 
  | 'healing_music' 
  | 'guided_meditation' 
  | 'sleep' 
  | 'soundscape' 
  | 'stress_relief' 
  | 'focus' 
  | 'emotional_healing' 
  | 'spiritual' 
  | 'programs' 
  | 'mentor_courses';

export type SubscriptionTier = 'free' | 'premium' | 'premium_plus';
export type BillingCycle = 'monthly' | 'annual';
export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'cancelled' | 'expired';
export type CommissionStatus = 'Pending' | 'Approved' | 'Paid' | 'Rejected' | 'pending' | 'approved' | 'paid' | 'rejected';
export type CommissionType = 'first_payment' | 'recurring';
export type ReferralConversionStatus = 'registered' | 'trial' | 'converted' | 'expired' | 'cancelled' | 'pending';
export type CouponType = 'percentage' | 'fixed_amount' | 'free_trial_days';
export type PayoutStatus = 'requested' | 'processing' | 'paid' | 'rejected';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type PaymentProvider = 'stripe' | 'apple_iap' | 'google_play' | 'mock';

export interface Category {
  id: string;
  slug: CategorySlug;
  name: string;
  description: string;
  iconName: string;
}

export type ContentType = 'music' | 'meditation' | 'soundscape' | 'program' | 'course';

export interface RecentlyPlayedRecord {
  content_id: string;
  user_id: string;
  played_at: string;
  progress: number;
  duration: number;
  track: Track;
}

export interface Track {
  id: string;
  title: string;
  type?: ContentType;
  artist?: string;
  mentor?: string;
  artistOrMentor: string;
  mentorId?: string;
  category: CategorySlug;
  categoryLabel: string;
  mood: ContentMood;
  durationSeconds: number;
  durationFormatted: string;
  duration?: number;
  coverUrl: string;
  cover_image?: string;
  audioUrl: string;
  audio_url?: string;
  tier: SubscriptionTier;
  is_premium?: boolean;
  isPremium?: boolean;
  plays: number;
  likes: number;
  description: string;
  published: boolean;
}

export interface Mentor {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatarUrl: string;
  profile_image?: string;
  coverUrl: string;
  specialization: string;
  followersCount: number;
  followers_count?: number;
  studentsCount: number;
  students_count?: number;
  rating: number;
  referralCode: string;
  referral_code?: string;
  commissionPercentage: number;
  commission_percentage?: number;
  commission_type?: CommissionType;
  payout_minimum?: number;
  isFeatured?: boolean;
  is_verified?: boolean;
  languages?: string[];
  experience_years?: number;
  certifications?: string[];
  created_at?: string;
}

export interface MentorFollower {
  id: string;
  mentor_id: string;
  user_id: string;
  created_at: string;
}

export type LessonContentType = 'breathing' | 'meditation' | 'healing_music' | 'soundscape' | 'reflection' | 'practice';

export interface ProgramDayLesson {
  id: string;
  program_day_id?: string;
  content_id?: string;
  content_type: LessonContentType;
  title: string;
  duration: number; // in minutes
  duration_formatted?: string;
  sort_order: number;
  trackId?: string;
  reflection_prompt?: string;
  audio_url?: string;
  is_completed?: boolean;
}

export interface ProgramDay {
  id: string;
  program_id: string;
  day_number: number;
  title: string;
  description: string;
  intention?: string;
  lessons: ProgramDayLesson[];
}

export interface ProgramLesson {
  dayNumber: number;
  title: string;
  durationMinutes: number;
  summary: string;
  trackId: string;
  isCompleted: boolean;
}

export interface Program {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  mentorId: string;
  mentor_id?: string;
  mentorName: string;
  mentorAvatar?: string;
  coverUrl: string;
  cover_image?: string;
  totalDays: number;
  duration_days?: number;
  totalDurationFormatted?: string;
  tier: SubscriptionTier;
  is_premium?: boolean;
  published?: boolean;
  created_at?: string;
  category: CategorySlug;
  difficulty: string;
  lessons: ProgramLesson[];
  days?: ProgramDay[];
}

export interface UserProgramProgress {
  id: string;
  user_id: string;
  program_id: string;
  current_day: number;
  completed_days: number[];
  completed_lessons: string[]; // key format: `${programId}-d${dayNumber}-l${lessonId}`
  progress_percentage: number;
  started_at: string;
  last_activity: string;
  completed_at?: string | null;
}

export interface UserLessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  completed_at?: string;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
}

export interface CourseLesson {
  id: string;
  lessonNumber: number;
  title: string;
  durationFormatted: string;
  audioUrl: string;
  summary: string;
}

export interface Course {
  id: string;
  title: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  coverUrl: string;
  totalLessons: number;
  durationHours: number;
  tier: SubscriptionTier;
  description: string;
  lessons: CourseLesson[];
}

export interface Playlist {
  id: string;
  title: string;
  description?: string;
  coverUrl: string;
  trackIds: string[];
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  membershipStatus: SubscriptionTier;
  billingCycle?: BillingCycle;
  membershipExpiresAt?: string;
  referredByCode?: string;
  preferredDuration: number;
  wellnessGoals: string[];
  streakDays: number;
  totalMinutesListened: number;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: SubscriptionTier;
  monthly_price: number;
  annual_price: number;
  currency: string; // e.g. 'MYR'
  features: string[];
  is_active: boolean;
  created_at?: string;
}

export interface SubscriptionRecord {
  id: string;
  user_id: string;
  plan_id?: string;
  tier: SubscriptionTier;
  billing_cycle: BillingCycle;
  status: SubscriptionStatus;
  start_date: string;
  renewal_date?: string;
  trial_end_date?: string;
  cancelled_at?: string | null;
  payment_provider: PaymentProvider;
  provider_subscription_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number; // percentage (e.g. 20) or fixed amount (e.g. 10) or free days (e.g. 7)
  start_date: string;
  end_date?: string;
  usage_limit?: number;
  usage_count: number;
  is_active: boolean;
  mentor_id?: string;
  created_at: string;
}

export interface PaymentRecord {
  id: string;
  user_id: string;
  subscription_id?: string;
  provider: PaymentProvider;
  provider_payment_id?: string;
  amount: number;
  currency: string; // 'MYR'
  status: PaymentStatus;
  paid_at?: string;
  created_at: string;
}

export interface ReferralRecord {
  id: string;
  mentorId: string;
  referralCode: string;
  referredUserId: string;
  referredUserName: string;
  referredUserEmail: string;
  registrationDate: string;
  registeredAt?: string;
  trialStarted?: string;
  subscriptionStarted?: string;
  conversionStatus: ReferralConversionStatus;
  subscriptionTier?: SubscriptionTier;
  subscriptionId?: string;
}

export interface Commission {
  id: string;
  mentorId: string;
  mentorName: string;
  userId: string;
  referredUserName: string;
  referredUserEmail: string;
  subscriptionId: string;
  paymentId: string;
  planName: string;
  paymentAmount: number;
  commissionPercentage: number;
  commissionAmount: number;
  commissionStatus: CommissionStatus;
  commission_type?: CommissionType;
  date: string;
  approved_at?: string;
  paid_at?: string;
}

export interface PayoutRecord {
  id: string;
  mentor_id: string;
  mentor_name?: string;
  amount: number;
  status: PayoutStatus;
  requested_at: string;
  approved_at?: string;
  paid_at?: string;
  reference_number?: string;
  notes?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  admin_id: string;
  admin_name?: string;
  target_type: 'commission' | 'payout' | 'referral' | 'subscription' | 'plan';
  target_id: string;
  old_value?: any;
  new_value?: any;
  created_at: string;
}

export interface ReferralCodeInfo {
  code: string;
  mentorId: string;
  mentorName: string;
  trialDays: number;
  discountPercentage: number;
  timesUsed: number;
}

export interface MentorReferralStats {
  referralCode: string;
  totalStudents: number;
  newStudentsThisMonth: number;
  subscriptionsGenerated: number;
  conversionRate: number;
  totalRevenueGenerated: number;
  totalCommission: number;
  pendingCommission: number;
  approvedCommission: number;
  paidCommission: number;
  clicksCount: number;
  trialsCount: number;
}

export interface AdminReferralStats {
  totalReferrals: number;
  successfulSubscriptions: number;
  conversionRate: number;
  revenueFromReferrals: number;
  totalCommissionGenerated: number;
  commissionPaid: number;
  pendingCommission: number;
  mrr: number;
  arr: number;
}

export interface RitualStep {
  stepNumber: number;
  title: string;
  instruction: string;
  duration?: string;
}

export interface HealingRitual {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  frequency: string;
  targetState: string;
  description: string;
  steps: RitualStep[];
  recommendedTrackId: string;
  recommendedAmbientLayer?: 'rain' | 'waves' | 'fire' | 'wind' | 'bowl';
}

export interface AIMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  quickOptions?: string[];
  ritualRecommendation?: HealingRitual;
  musicPrescription?: {
    frequency: string;
    listeningMethod: string;
    trackId: string;
    trackTitle: string;
    mentorName: string;
    targetBenefit: string;
  };
}

export interface SoulJournalEntry {
  id: string;
  userId: string;
  createdAt: string;
  moodState: string;
  somaticFeeling?: string;
  summary: string;
  affirmation: string;
  recommendedTrackId?: string;
  recommendedTrackTitle?: string;
  recommendedRitualTitle?: string;
  userNotes?: string;
  tags: string[];
}

export * from './personalization';

