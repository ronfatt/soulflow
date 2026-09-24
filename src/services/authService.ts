import { supabase, isLiveSupabaseConfigured } from '../lib/supabase';
import { UserProfile, SubscriptionTier } from '../types';

export const authService = {
  async signUp(email: string, password: string, name: string, referralCode?: string): Promise<{
    user: UserProfile | null;
    error: string | null;
  }> {
    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            referral_code: referralCode?.trim().toUpperCase(),
          },
        },
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        return {
          user: {
            id: data.user.id,
            name,
            email,
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            membershipStatus: referralCode ? 'premium' : 'free',
            billingCycle: 'annual',
            preferredDuration: 15,
            wellnessGoals: ['Deep Sleep', 'Stress Relief'],
            streakDays: 1,
            totalMinutesListened: 0,
          },
          error: null,
        };
      }
    }

    // Local authentication mock
    const localUser: UserProfile = {
      id: crypto.randomUUID(),
      name,
      email,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      membershipStatus: referralCode ? 'premium' : 'free',
      billingCycle: 'annual',
      preferredDuration: 15,
      wellnessGoals: ['Deep Sleep', 'Stress Relief'],
      streakDays: 1,
      totalMinutesListened: 0,
    };
    return { user: localUser, error: null };
  },

  async signIn(email: string, password: string): Promise<{
    user: UserProfile | null;
    error: string | null;
  }> {
    if (isLiveSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        return {
          user: {
            id: data.user.id,
            name: profile?.name || splitName(email),
            email: data.user.email || email,
            avatarUrl: profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
            membershipStatus: (profile?.membership_status as SubscriptionTier) || 'free',
            billingCycle: profile?.billing_cycle || 'annual',
            membershipExpiresAt: profile?.membership_expires_at,
            referredByCode: profile?.referred_by_code,
            preferredDuration: profile?.preferred_duration || 15,
            wellnessGoals: profile?.wellness_goals || ['Deep Sleep', 'Stress Relief'],
            streakDays: profile?.streak_days || 1,
            totalMinutesListened: profile?.total_minutes_listened || 0,
          },
          error: null,
        };
      }
    }

    // Local sign in fallback
    const localUser: UserProfile = {
      id: 'usr-1001',
      name: splitName(email),
      email,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      membershipStatus: 'premium',
      billingCycle: 'annual',
      preferredDuration: 15,
      wellnessGoals: ['Deep Sleep', 'Stress Relief'],
      streakDays: 4,
      totalMinutesListened: 184,
    };
    return { user: localUser, error: null };
  },

  async signOut(): Promise<void> {
    if (isLiveSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
  },

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    if (isLiveSupabaseConfigured()) {
      await supabase.from('profiles').update({
        name: updates.name,
        avatar_url: updates.avatarUrl,
        membership_status: updates.membershipStatus,
        preferred_duration: updates.preferredDuration,
        wellness_goals: updates.wellnessGoals,
        streak_days: updates.streakDays,
        total_minutes_listened: updates.totalMinutesListened,
      }).eq('id', userId);
    }
  },
};

const splitName = (email: string) => {
  const part = email.split('@')[0];
  return part.charAt(0).toUpperCase() + part.slice(1);
};
