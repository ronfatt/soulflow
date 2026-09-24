-- ==============================================================================
-- SOULFLOW PRODUCTION DATABASE ARCHITECTURE (Supabase / PostgreSQL)
-- Complete Schema, UUID Keys, Foreign Keys, Triggers, Storage & RLS Policies
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS
DO $$ BEGIN
  CREATE TYPE subscription_tier AS ENUM ('free', 'premium', 'premium_plus');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE billing_cycle AS ENUM ('monthly', 'annual');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'cancelled', 'trial');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE payment_provider AS ENUM ('stripe', 'apple_iap', 'google_play', 'manual');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM ('pending', 'succeeded', 'failed', 'refunded');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE commission_status AS ENUM ('pending', 'approved', 'paid');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE content_mood AS ENUM ('stress', 'sleep', 'meditation', 'relax', 'focus', 'spiritual');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE category_slug AS ENUM (
    'healing_music', 
    'guided_meditation', 
    'sleep', 
    'soundscape', 
    'stress_relief', 
    'focus', 
    'emotional_healing', 
    'spiritual', 
    'programs', 
    'mentor_courses'
  );
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ------------------------------------------------------------------------------
-- 3. PROFILES (Extends auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  membership_status subscription_tier NOT NULL DEFAULT 'free',
  billing_cycle billing_cycle DEFAULT 'annual',
  membership_expires_at TIMESTAMPTZ,
  referred_by_code TEXT,
  preferred_duration INT DEFAULT 15,
  wellness_goals TEXT[] DEFAULT ARRAY['Deep Sleep', 'Stress Relief']::TEXT[],
  streak_days INT DEFAULT 1,
  total_minutes_listened INT DEFAULT 0,
  role TEXT DEFAULT 'user', -- 'user', 'mentor', 'admin'
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 4. TAXONOMY: CATEGORIES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug category_slug UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon_name TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 5. CREATORS: ARTISTS & MENTORS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.mentors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  cover_url TEXT NOT NULL,
  specialization TEXT NOT NULL,
  followers_count INT DEFAULT 0,
  students_count INT DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 4.95,
  referral_code TEXT UNIQUE NOT NULL,
  commission_percentage NUMERIC(5,2) DEFAULT 20.00,
  is_featured BOOLEAN DEFAULT false,
  is_suspended BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.mentor_referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL,
  trial_days INT DEFAULT 7,
  discount_percentage NUMERIC(5,2) DEFAULT 15.00,
  is_active BOOLEAN DEFAULT true,
  times_used INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 6. CONTENT: MUSIC, MEDITATIONS & SOUNDSCAPES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.music (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist_or_mentor TEXT NOT NULL,
  mentor_id UUID REFERENCES public.mentors(id) ON DELETE SET NULL,
  category category_slug NOT NULL DEFAULT 'healing_music',
  category_label TEXT NOT NULL DEFAULT 'Healing Music',
  mood content_mood NOT NULL DEFAULT 'relax',
  duration_seconds INT NOT NULL,
  duration_formatted TEXT NOT NULL,
  cover_url TEXT NOT NULL,
  audio_url TEXT NOT NULL, -- Streaming CDN / R2 / S3 / Supabase Storage URL
  tier subscription_tier NOT NULL DEFAULT 'free',
  plays BIGINT DEFAULT 0,
  likes INT DEFAULT 0,
  description TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 7. WELLNESS PROGRAMS & DAILY LESSONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  mentor_id UUID REFERENCES public.mentors(id) ON DELETE SET NULL,
  cover_url TEXT NOT NULL,
  total_days INT NOT NULL DEFAULT 7,
  tier subscription_tier NOT NULL DEFAULT 'premium',
  difficulty TEXT DEFAULT 'All Levels',
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.program_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  duration_minutes INT DEFAULT 15,
  track_id UUID REFERENCES public.music(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(program_id, day_number)
);

CREATE TABLE IF NOT EXISTS public.user_program_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
  completed_day_numbers INT[] DEFAULT '{}'::INT[],
  is_completed BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, program_id)
);

-- ------------------------------------------------------------------------------
-- 8. MENTOR COURSES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  cover_url TEXT NOT NULL,
  total_lessons INT NOT NULL DEFAULT 0,
  duration_hours NUMERIC(4,1) NOT NULL DEFAULT 1.0,
  tier subscription_tier NOT NULL DEFAULT 'premium_plus',
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  lesson_number INT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  duration_formatted TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(course_id, lesson_number)
);

-- ------------------------------------------------------------------------------
-- 9. USER LIBRARY: PLAYLISTS, FAVORITES, DOWNLOADS & HISTORY
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.playlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES public.music(id) ON DELETE CASCADE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(playlist_id, track_id)
);

CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES public.music(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, track_id)
);

CREATE TABLE IF NOT EXISTS public.downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES public.music(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, track_id)
);

CREATE TABLE IF NOT EXISTS public.listening_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id UUID NOT NULL REFERENCES public.music(id) ON DELETE CASCADE,
  listened_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 10. REFERRALS, SUBSCRIPTIONS, PAYMENTS & COMMISSIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  referral_code_id UUID NOT NULL REFERENCES public.mentor_referral_codes(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  has_subscribed BOOLEAN DEFAULT false,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(referred_user_id)
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tier subscription_tier NOT NULL DEFAULT 'premium',
  billing_cycle billing_cycle NOT NULL DEFAULT 'annual',
  status subscription_status NOT NULL DEFAULT 'trial',
  current_period_start TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  current_period_end TIMESTAMPTZ NOT NULL,
  trial_ends_at TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  payment_provider payment_provider DEFAULT 'stripe',
  external_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status payment_status NOT NULL DEFAULT 'succeeded',
  provider payment_provider NOT NULL DEFAULT 'stripe',
  provider_transaction_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  referral_id UUID REFERENCES public.referrals(id) ON DELETE SET NULL,
  referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID NOT NULL REFERENCES public.subscriptions(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  transaction_amount NUMERIC(10,2) NOT NULL,
  commission_percentage NUMERIC(5,2) NOT NULL,
  commission_amount NUMERIC(10,2) NOT NULL,
  status commission_status NOT NULL DEFAULT 'pending',
  payout_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_program_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.listening_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

-- Public content read policies
CREATE POLICY "Public categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public artists are viewable by everyone" ON public.artists FOR SELECT USING (true);
CREATE POLICY "Active mentors are viewable by everyone" ON public.mentors FOR SELECT USING (is_suspended = false);
CREATE POLICY "Active referral codes viewable by everyone" ON public.mentor_referral_codes FOR SELECT USING (is_active = true);
CREATE POLICY "Published music tracks are viewable by everyone" ON public.music FOR SELECT USING (is_published = true);
CREATE POLICY "Published programs are viewable by everyone" ON public.programs FOR SELECT USING (is_published = true);
CREATE POLICY "Program days are viewable by everyone" ON public.program_days FOR SELECT USING (true);
CREATE POLICY "Published courses are viewable by everyone" ON public.courses FOR SELECT USING (is_published = true);
CREATE POLICY "Course lessons are viewable by everyone" ON public.course_lessons FOR SELECT USING (true);

-- User isolated profile policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- User playlists policies
CREATE POLICY "Users can view own playlists" ON public.playlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own playlists" ON public.playlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own playlists" ON public.playlists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own playlists" ON public.playlists FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own playlist items" ON public.playlist_items FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.playlists WHERE id = playlist_id AND user_id = auth.uid()));
CREATE POLICY "Users can insert own playlist items" ON public.playlist_items FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.playlists WHERE id = playlist_id AND user_id = auth.uid()));
CREATE POLICY "Users can delete own playlist items" ON public.playlist_items FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.playlists WHERE id = playlist_id AND user_id = auth.uid()));

-- User favorites policies
CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

-- User downloads & history policies
CREATE POLICY "Users can view own downloads" ON public.downloads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own downloads" ON public.downloads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own downloads" ON public.downloads FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own listening history" ON public.listening_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own listening history" ON public.listening_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User program progress
CREATE POLICY "Users can view own program progress" ON public.user_program_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can upsert own program progress" ON public.user_program_progress FOR ALL USING (auth.uid() = user_id);

-- Subscriptions & Payments policies
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);

-- Mentor commissions policies
CREATE POLICY "Mentors can view their own commissions" ON public.commissions FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.mentors WHERE id = mentor_id AND user_id = auth.uid()));

-- ------------------------------------------------------------------------------
-- 12. STORAGE BUCKETS SETUP & STORAGE RLS
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) VALUES 
('audio', 'audio', true),
('covers', 'covers', true),
('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Audio files are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'audio');
CREATE POLICY "Cover files are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'covers');
CREATE POLICY "Avatar files are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- ------------------------------------------------------------------------------
-- 13. TRIGGERS & AUTOMATION: USER CREATION & COMMISSIONS
-- ------------------------------------------------------------------------------
-- Automatically create public.profiles entry on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  ref_code TEXT;
  mentor_rec RECORD;
BEGIN
  ref_code := UPPER(NULLIF(TRIM(NEW.raw_user_meta_data->>'referral_code'), ''));

  INSERT INTO public.profiles (id, name, email, avatar_url, referred_by_code)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'),
    ref_code
  );

  -- If valid referral code supplied, record referral link & grant trial
  IF ref_code IS NOT NULL THEN
    SELECT m.id AS mentor_id, r.id AS code_id, r.trial_days
    INTO mentor_rec
    FROM public.mentor_referral_codes r
    JOIN public.mentors m ON m.id = r.mentor_id
    WHERE r.code = ref_code AND r.is_active = true
    LIMIT 1;

    IF mentor_rec.mentor_id IS NOT NULL THEN
      -- Record referral
      INSERT INTO public.referrals (mentor_id, referral_code_id, referred_user_id)
      VALUES (mentor_rec.mentor_id, mentor_rec.code_id, NEW.id)
      ON CONFLICT (referred_user_id) DO NOTHING;

      -- Update referral code usage
      UPDATE public.mentor_referral_codes SET times_used = times_used + 1 WHERE id = mentor_rec.code_id;

      -- Set trial subscription
      UPDATE public.profiles
      SET membership_status = 'premium',
          membership_expires_at = timezone('utc'::text, now()) + (mentor_rec.trial_days || ' days')::INTERVAL
      WHERE id = NEW.id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger to record mentor commission whenever a subscription payment succeeds
CREATE OR REPLACE FUNCTION public.handle_subscription_commission()
RETURNS trigger AS $$
DECLARE
  ref_rec RECORD;
  mentor_rec RECORD;
  calc_comm NUMERIC(10,2);
BEGIN
  -- Check if user was referred by a mentor
  SELECT r.id AS referral_id, r.mentor_id
  INTO ref_rec
  FROM public.referrals r
  WHERE r.referred_user_id = NEW.user_id;

  IF ref_rec.mentor_id IS NOT NULL THEN
    SELECT commission_percentage INTO mentor_rec FROM public.mentors WHERE id = ref_rec.mentor_id;
    
    IF mentor_rec.commission_percentage IS NOT NULL THEN
      calc_comm := ROUND(NEW.amount * (mentor_rec.commission_percentage / 100.0), 2);

      INSERT INTO public.commissions (
        mentor_id,
        referral_id,
        referred_user_id,
        subscription_id,
        payment_id,
        transaction_amount,
        commission_percentage,
        commission_amount,
        status
      ) VALUES (
        ref_rec.mentor_id,
        ref_rec.referral_id,
        NEW.user_id,
        NEW.subscription_id,
        NEW.id,
        NEW.amount,
        mentor_rec.commission_percentage,
        calc_comm,
        'approved'
      );

      -- Mark referral as converted
      UPDATE public.referrals SET has_subscribed = true WHERE id = ref_rec.referral_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_payment_recorded ON public.payments;
CREATE TRIGGER on_payment_recorded
  AFTER INSERT ON public.payments
  FOR EACH ROW EXECUTE PROCEDURE public.handle_subscription_commission();
