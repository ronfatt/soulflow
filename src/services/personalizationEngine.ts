import { 
  Track, 
  Program, 
  UserProfile, 
  ContentMood, 
  CategorySlug,
  RecommendationSignals, 
  ScoredTrack, 
  PersonalizedSections, 
  RecommendationModelAdapter, 
  TimeOfDay 
} from '../types';

/**
 * Determine Time of Day category based on 24-hour clock.
 */
export function determineTimeOfDay(hour: number = new Date().getHours()): { timeOfDay: TimeOfDay; currentHour: number } {
  let timeOfDay: TimeOfDay = 'morning';
  if (hour >= 5 && hour < 12) {
    timeOfDay = 'morning';
  } else if (hour >= 12 && hour < 17) {
    timeOfDay = 'afternoon';
  } else if (hour >= 17 && hour < 22) {
    timeOfDay = 'evening';
  } else {
    timeOfDay = 'night';
  }
  return { timeOfDay, currentHour: hour };
}

/**
 * Default High-Performance Heuristic Recommendation Engine.
 * Transparent, deterministic, zero-latency, and grounded in wellness psychoacoustics.
 */
export class RuleBasedRecommendationAdapter implements RecommendationModelAdapter {
  readonly id = 'rule_v1';
  readonly name = 'SoulFlow Harmonic Heuristic Engine';
  readonly version = '1.2.0';
  readonly type = 'rule_based' as const;

  scoreCandidates(candidates: Track[], signals: RecommendationSignals): ScoredTrack[] {
    return candidates.map(track => {
      const matchReasons: string[] = [];
      const trackMin = Math.round(track.durationSeconds / 60);

      // 1. Current Mood Alignment (Max 30 points)
      let moodScore = 0;
      if (track.mood === signals.currentMood) {
        moodScore = 30;
        matchReasons.push(`Harmonizes with your ${signals.currentMood} mood`);
      } else {
        // Natural mood harmonic pairings
        const compatiblePairings: Record<ContentMood, ContentMood[]> = {
          sleep: ['relax', 'stress'],
          stress: ['relax', 'meditation'],
          relax: ['sleep', 'meditation'],
          meditation: ['spiritual', 'relax'],
          focus: ['meditation', 'relax'],
          spiritual: ['meditation', 'relax'],
        };
        if (compatiblePairings[signals.currentMood]?.includes(track.mood)) {
          moodScore = 18;
        } else {
          moodScore = 8;
        }
      }

      // 2. User Selected Wellness Goals Match (Max 25 points)
      let goalScore = 0;
      const textToSearch = `${track.title} ${track.description} ${track.categoryLabel} ${track.category}`.toLowerCase();

      for (const goal of signals.wellnessGoals) {
        const goalLower = goal.toLowerCase();
        let matched = false;

        if (goalLower.includes('sleep') && (track.category === 'sleep' || textToSearch.includes('delta') || textToSearch.includes('sleep') || textToSearch.includes('drift'))) {
          matched = true;
          matchReasons.push('Targeted for Deep Sleep goal');
        } else if (goalLower.includes('stress') && (track.category === 'stress_relief' || textToSearch.includes('vagus') || textToSearch.includes('stress') || textToSearch.includes('calm'))) {
          matched = true;
          matchReasons.push('Calibrates nervous system for Stress Relief');
        } else if (goalLower.includes('focus') && (track.category === 'focus' || textToSearch.includes('alpha') || textToSearch.includes('clarity') || textToSearch.includes('flow'))) {
          matched = true;
          matchReasons.push('Supports Focus & Clarity');
        } else if (goalLower.includes('spiritual') && (track.category === 'spiritual' || track.category === 'healing_music' || textToSearch.includes('432hz') || textToSearch.includes('528hz') || textToSearch.includes('sacred'))) {
          matched = true;
          matchReasons.push('Resonates with Spiritual Growth goal');
        } else if (goalLower.includes('energy') && (textToSearch.includes('morning') || textToSearch.includes('prana') || textToSearch.includes('breath'))) {
          matched = true;
          matchReasons.push('Awakens vitality & energy');
        }

        if (matched) {
          goalScore = Math.min(25, goalScore + 12.5);
        }
      }

      // 3. Time of Day Appropriateness (Max 20 points)
      let timeOfDayScore = 0;
      switch (signals.timeOfDay) {
        case 'morning':
          if (track.category === 'focus' || track.category === 'guided_meditation' || textToSearch.includes('morning') || textToSearch.includes('prana')) {
            timeOfDayScore = 20;
            matchReasons.push('Perfect morning awakening acoustics');
          } else if (track.category === 'sleep') {
            timeOfDayScore = 5;
          } else {
            timeOfDayScore = 14;
          }
          break;
        case 'afternoon':
          if (track.category === 'focus' || track.category === 'stress_relief' || track.mood === 'focus') {
            timeOfDayScore = 20;
            matchReasons.push('Midday focus and mental renewal');
          } else {
            timeOfDayScore = 13;
          }
          break;
        case 'evening':
          if (track.category === 'stress_relief' || track.category === 'soundscape' || track.mood === 'relax') {
            timeOfDayScore = 20;
            matchReasons.push('Gentle evening wind-down');
          } else {
            timeOfDayScore = 14;
          }
          break;
        case 'night':
          if (track.category === 'sleep' || track.category === 'soundscape' || textToSearch.includes('432hz') || textToSearch.includes('delta')) {
            timeOfDayScore = 20;
            matchReasons.push('Calibrated for nighttime delta transition');
          } else if (track.category === 'focus') {
            timeOfDayScore = 3;
          } else {
            timeOfDayScore = 12;
          }
          break;
      }

      // 4. Session Duration Proximity (Max 15 points)
      const durationDiff = Math.abs(trackMin - signals.preferredDuration);
      const durationProximityScore = Math.max(0, Math.round(15 - durationDiff * 0.7));
      if (durationDiff <= 5) {
        matchReasons.push(`Fits your ${signals.preferredDuration}-min session window`);
      }

      // 5. Affinity to Favorite Mentors & Categories (Max 10 points)
      let affinityScore = 0;
      if (track.mentorId && signals.favoriteMentorIds.includes(track.mentorId)) {
        affinityScore += 6;
        matchReasons.push(`By favorite mentor ${track.artistOrMentor}`);
      }
      if (signals.favoriteCategories.includes(track.category)) {
        affinityScore += 4;
      }

      const rawScore = moodScore + goalScore + timeOfDayScore + durationProximityScore + affinityScore;
      const score = Math.min(100, Math.max(0, Math.round(rawScore)));

      return {
        track,
        score,
        matchReasons: matchReasons.slice(0, 3),
        breakdown: {
          moodScore,
          goalScore,
          timeOfDayScore,
          durationProximityScore,
          affinityScore,
        },
      };
    });
  }

  generateSections(tracks: Track[], programs: Program[], signals: RecommendationSignals): PersonalizedSections {
    // Score all candidates
    const scoredCandidates = this.scoreCandidates(tracks, signals);

    // 1. SECTION: Recommended For You
    // Apply slight novelty damping for tracks played in last 2 history items so discoveries stay fresh
    const noveltyDamped = scoredCandidates.map(sc => {
      const historyIndex = signals.listeningHistory.indexOf(sc.track.id);
      let adjustedScore = sc.score;
      if (historyIndex >= 0 && historyIndex < 2) {
        adjustedScore = Math.max(0, adjustedScore - 8);
      }
      return { ...sc, score: adjustedScore };
    });

    const recommendedForYou = [...noveltyDamped]
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(sc => sc.track);

    // 2. SECTION: Because You Listen To...
    let becauseYouListenTo = null;
    let seedTrack: Track | undefined;

    // Determine seed track from listening history or fallback to top liked track
    if (signals.listeningHistory.length > 0) {
      const recentId = signals.listeningHistory[0];
      seedTrack = tracks.find(t => t.id === recentId);
    }
    if (!seedTrack && signals.favoriteTrackIds.length > 0) {
      seedTrack = tracks.find(t => t.id === signals.favoriteTrackIds[0]);
    }
    if (!seedTrack) {
      seedTrack = tracks[0];
    }

    if (seedTrack) {
      // Find candidate tracks matching same mentor or same category or same mood
      const relatedTracks = tracks
        .filter(t => t.id !== seedTrack?.id)
        .map(t => {
          let similarity = 0;
          if (t.mentorId && t.mentorId === seedTrack?.mentorId) similarity += 40;
          if (t.category === seedTrack?.category) similarity += 35;
          if (t.mood === seedTrack?.mood) similarity += 25;
          return { track: t, similarity };
        })
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 3)
        .map(item => item.track);

      const reason = `Because you regularly practice with ${seedTrack.artistOrMentor} and ${seedTrack.categoryLabel}, we curated resonant harmonic frequencies to deepen your flow.`;

      becauseYouListenTo = {
        seedTrack,
        reason,
        recommendations: relatedTracks,
      };
    }

    // 3. SECTION: For Better Sleep Tonight
    const sleepCandidates = tracks.filter(t => 
      t.category === 'sleep' || 
      t.mood === 'sleep' || 
      t.category === 'soundscape' ||
      t.description.toLowerCase().includes('delta') ||
      t.description.toLowerCase().includes('432hz')
    );

    const forBetterSleepTonight = [...sleepCandidates]
      .sort((a, b) => {
        // Boost delta/432hz and duration closeness to evening
        const aScore = (a.category === 'sleep' ? 30 : 15) + (a.tier === 'free' ? 5 : 0) + (a.durationSeconds >= 1200 ? 10 : 0);
        const bScore = (b.category === 'sleep' ? 30 : 15) + (b.tier === 'free' ? 5 : 0) + (b.durationSeconds >= 1200 ? 10 : 0);
        return bScore - aScore;
      })
      .slice(0, 4);

    // 4. SECTION: Morning Focus
    const focusCandidates = tracks.filter(t => 
      t.category === 'focus' || 
      t.mood === 'focus' || 
      t.category === 'guided_meditation' ||
      t.title.toLowerCase().includes('morning') ||
      t.title.toLowerCase().includes('clarity') ||
      t.title.toLowerCase().includes('alpha')
    );

    const morningFocus = [...focusCandidates]
      .sort((a, b) => {
        const aIsMorning = a.title.toLowerCase().includes('morning') ? 25 : 0;
        const bIsMorning = b.title.toLowerCase().includes('morning') ? 25 : 0;
        const aAlpha = a.category === 'focus' ? 20 : 10;
        const bAlpha = b.category === 'focus' ? 20 : 10;
        return (bIsMorning + bAlpha) - (aIsMorning + aAlpha);
      })
      .slice(0, 4);

    // 5. SECTION: Continue Your Journey
    const recentTrack = signals.listeningHistory.length > 0 
      ? tracks.find(t => t.id === signals.listeningHistory[0]) || tracks[0]
      : tracks[0];

    const activeProgram = programs[0]; // Primary program: 7-Day Deep Sleep Sanctuary
    const completedCount = activeProgram.lessons.filter(l => l.isCompleted).length;
    const currentLesson = activeProgram.lessons.find(l => !l.isCompleted) || activeProgram.lessons[0];
    const completionPercent = Math.round((completedCount / activeProgram.totalDays) * 100);

    const continueYourJourney = {
      recentTrack,
      recentTrackProgressSeconds: 1104, // 18:24 preview
      activeProgram,
      currentLessonNumber: currentLesson.dayNumber,
      totalLessons: activeProgram.totalDays,
      completionPercent,
    };

    return {
      signals,
      recommendedForYou,
      becauseYouListenTo,
      forBetterSleepTonight,
      morningFocus,
      continueYourJourney,
    };
  }
}

/**
 * AI Recommendation Model Adapter (Extensibility Architecture)
 * 
 * Demonstrates how an AI model (e.g. Gemini / custom PyTorch or embeddings service)
 * connects to this personalization pipeline without modifying frontend or client state.
 */
export class AIRecommendationModelAdapter implements RecommendationModelAdapter {
  readonly id = 'ai_neural_v1';
  readonly name = 'SoulFlow Deep Resonance Neural Ranker';
  readonly version = '2.0.0-preview';
  readonly type = 'ai_model' as const;

  private fallbackEngine: RuleBasedRecommendationAdapter;
  private endpointUrl?: string;
  private apiKey?: string;

  constructor(endpointUrl?: string, apiKey?: string) {
    this.endpointUrl = endpointUrl;
    this.apiKey = apiKey;
    this.fallbackEngine = new RuleBasedRecommendationAdapter();
  }

  async scoreCandidates(candidates: Track[], signals: RecommendationSignals): Promise<ScoredTrack[]> {
    if (!this.endpointUrl || !this.apiKey) {
      // Graceful fallback to heuristic engine if AI microservice credentials are not set
      return this.fallbackEngine.scoreCandidates(candidates, signals);
    }

    try {
      // Example payload structure sent to external AI recommendation model
      const response = await fetch(this.endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          signals,
          candidateTrackIds: candidates.map(c => c.id),
        }),
      });

      if (!response.ok) throw new Error(`AI model returned status ${response.status}`);
      const data = await response.json();
      return data.scoredTracks;
    } catch (err) {
      console.warn('AI Recommendation model request failed, falling back to rule engine:', err);
      return this.fallbackEngine.scoreCandidates(candidates, signals);
    }
  }

  async generateSections(tracks: Track[], programs: Program[], signals: RecommendationSignals): Promise<PersonalizedSections> {
    // When connected to AI backend, this requests section rankings from AI embeddings
    return this.fallbackEngine.generateSections(tracks, programs, signals);
  }
}

/**
 * Personalization Engine Singleton Facade
 */
class PersonalizationEngineService {
  private adapter: RecommendationModelAdapter;

  constructor() {
    // Default to the deterministic, high-speed Rule-based engine
    this.adapter = new RuleBasedRecommendationAdapter();
  }

  /**
   * Hot-swap or register a new recommendation model (e.g. AI model, bandit, or remote service)
   */
  setAdapter(adapter: RecommendationModelAdapter): void {
    this.adapter = adapter;
    console.info(`[SoulFlow PersonalizationEngine] Switched adapter to: ${adapter.name} (${adapter.version}) [Type: ${adapter.type}]`);
  }

  getActiveAdapter(): RecommendationModelAdapter {
    return this.adapter;
  }

  /**
   * Aggregate high-level signals from user profile, state and device context
   */
  buildSignals(
    user: UserProfile,
    currentMood: ContentMood,
    listeningHistory: string[],
    favoriteTrackIds: string[],
    allTracks: Track[]
  ): RecommendationSignals {
    const { timeOfDay, currentHour } = determineTimeOfDay();

    // Derive favorite categories from favorites & history
    const relevantTrackIds = [...favoriteTrackIds, ...listeningHistory];
    const categoryCounts: Record<CategorySlug, number> = {} as any;
    const mentorCounts: Record<string, number> = {};

    relevantTrackIds.forEach(id => {
      const track = allTracks.find(t => t.id === id);
      if (track) {
        categoryCounts[track.category] = (categoryCounts[track.category] || 0) + 1;
        if (track.mentorId) {
          mentorCounts[track.mentorId] = (mentorCounts[track.mentorId] || 0) + 1;
        }
      }
    });

    const favoriteCategories = (Object.keys(categoryCounts) as CategorySlug[])
      .sort((a, b) => categoryCounts[b] - categoryCounts[a])
      .slice(0, 3);

    const favoriteMentorIds = Object.keys(mentorCounts)
      .sort((a, b) => mentorCounts[b] - mentorCounts[a])
      .slice(0, 3);

    return {
      wellnessGoals: user.wellnessGoals || ['Deep Sleep', 'Stress Relief'],
      currentMood,
      listeningHistory: listeningHistory || [],
      favoriteTrackIds: favoriteTrackIds || [],
      favoriteCategories,
      favoriteMentorIds,
      preferredDuration: user.preferredDuration || 15,
      timeOfDay,
      currentHour,
    };
  }

  /**
   * Generate all 5 personalized sections
   */
  generateSections(
    tracks: Track[],
    programs: Program[],
    signals: RecommendationSignals
  ): Promise<PersonalizedSections> | PersonalizedSections {
    return this.adapter.generateSections(tracks, programs, signals);
  }
}

export const personalizationEngine = new PersonalizationEngineService();
