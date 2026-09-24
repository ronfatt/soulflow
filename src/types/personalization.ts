import { Track, Program, ContentMood, CategorySlug, UserProfile } from './index';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface RecommendationSignals {
  wellnessGoals: string[];
  currentMood: ContentMood;
  listeningHistory: string[]; // Track IDs
  favoriteTrackIds: string[];
  favoriteCategories: CategorySlug[];
  favoriteMentorIds: string[];
  preferredDuration: number; // in minutes
  timeOfDay: TimeOfDay;
  currentHour: number;
}

export interface SignalContributionBreakdown {
  moodScore: number;
  goalScore: number;
  timeOfDayScore: number;
  durationProximityScore: number;
  affinityScore: number;
}

export interface ScoredTrack {
  track: Track;
  score: number; // 0 to 100
  matchReasons: string[];
  breakdown: SignalContributionBreakdown;
}

export interface BecauseYouListenToSection {
  seedTrack: Track;
  reason: string;
  recommendations: Track[];
}

export interface ContinueYourJourneySection {
  recentTrack?: Track;
  recentTrackProgressSeconds?: number;
  activeProgram?: Program;
  currentLessonNumber: number;
  totalLessons: number;
  completionPercent: number;
}

export interface PersonalizedSections {
  signals: RecommendationSignals;
  recommendedForYou: Track[];
  becauseYouListenTo: BecauseYouListenToSection | null;
  forBetterSleepTonight: Track[];
  morningFocus: Track[];
  continueYourJourney: ContinueYourJourneySection;
}

/**
 * Adapter interface allowing any recommendation engine
 * (rule-based, vector-embeddings, or remote AI model) to be plugged in.
 */
export interface RecommendationModelAdapter {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly type: 'rule_based' | 'ml_inference' | 'ai_model' | 'hybrid';

  scoreCandidates(
    candidates: Track[],
    signals: RecommendationSignals
  ): Promise<ScoredTrack[]> | ScoredTrack[];

  generateSections(
    tracks: Track[],
    programs: Program[],
    signals: RecommendationSignals
  ): Promise<PersonalizedSections> | PersonalizedSections;
}
