-- ==============================================================================
-- SOULFLOW DATABASE SCHEMA (PostgreSQL / Supabase)
-- Premium Mind, Body & Spiritual Wellbeing Platform
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. ENUMS
-- ------------------------------------------------------------------------------
CREATE TYPE subscription_tier AS ENUM ('free', 'premium', 'premium_plus');
CREATE TYPE subscription_billing_cycle AS ENUM ('monthly', 'annual');
CREATE TYPE subscription_status AS ENUM ('active', 'expired', 'cancelled', 'trial');
CREATE TYPE payment_provider AS ENUM ('stripe', 'apple_iap', 'google_play', 'manual');
CREATE TYPE payment_status AS ENUM ('pending', 'succeeded', 'failed', 'refunded');
CREATE TYPE commission_status AS ENUM ('pending', 'approved', 'paid');
CREATE TYPE content_mood AS ENUM ('stress', 'sleep', 'meditation', 'relax', 'focus', 'spiritual');
CREATE TYPE content_category AS ENUM (
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

-- ------------------------------------------------------------------------------
-- 2. CORE USERS & PROFILES
-- ------------------------------------------------------------------------------
-- Extends Supabase auth.users or standalone auth
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  membership_status subscription_tier DEFAULT 'free',
  membership_expires_at TIMESTAMPTZ,
  role TEXT DEFAULT 'user', -- 'user', 'mentor', 'admin'
  referred_by_code TEXT,
  preferred_session_duration INT DEFAULT 15, -- minutes
  wellness_goals TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 3. CATEGORIES & TAXONOMY
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  cover_url TEXT,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 4. ARTISTS & MENTORS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS artists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  avatar_url TEXT,
  cover_url TEXT,
  is_verified BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS mentors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT NOT NULL,
  avatar_url TEXT NOT NULL,
  cover_url TEXT,
  specialization TEXT NOT NULL,
  followers_count INT DEFAULT 0,
  students_count INT DEFAULT 0,
  rating NUMERIC(3,2) DEFAULT 4.95,
  commission_percentage NUMERIC(5,2) DEFAULT 20.00,
  is_featured BOOLEAN DEFAULT false,
  is_suspended BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS mentor_referral_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  code TEXT UNIQUE NOT NULL, -- e.g. 'ALICE888'
  reward_days_premium INT DEFAULT 7,
  discount_percentage NUMERIC(5,2) DEFAULT 15.00,
  is_active BOOLEAN DEFAULT true,
  times_used INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 5. AUDIO & CONTENT REPOSITORY
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS music (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist_id UUID REFERENCES artists(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  mood content_mood DEFAULT 'relax',
  description TEXT,
  audio_url TEXT NOT NULL, -- Stream URL (R2/S3/CDN)
  cover_url TEXT NOT NULL,
  duration_seconds INT NOT NULL,
  tier_access subscription_tier DEFAULT 'free',
  plays_count BIGINT DEFAULT 0,
  likes_count INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS meditations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  mentor_id UUID REFERENCES mentors(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  mood content_mood DEFAULT 'meditation',
  description TEXT,
  audio_url TEXT NOT NULL,
  cover_url TEXT NOT NULL,
  duration_seconds INT NOT NULL,
  tier_access subscription_tier DEFAULT 'free',
  plays_count BIGINT DEFAULT 0,
  likes_count INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS soundscapes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  mood content_mood DEFAULT 'sleep',
  description TEXT,
  audio_url TEXT NOT NULL,
  cover_url TEXT NOT NULL,
  duration_seconds INT NOT NULL,
  is_loopable BOOLEAN DEFAULT true,
  tier_access subscription_tier DEFAULT 'free',
  plays_count BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 6. WELLNESS JOURNEYS & PROGRAMS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  mentor_id UUID REFERENCES mentors(id) ON DELETE SET NULL,
  cover_url TEXT NOT NULL,
  total_days INT NOT NULL DEFAULT 7,
  difficulty_level TEXT DEFAULT 'All Levels',
  tier_access subscription_tier DEFAULT 'premium',
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS program_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT,
  music_id UUID REFERENCES music(id) ON DELETE SET NULL,
  meditation_id UUID REFERENCES meditations(id) ON DELETE SET NULL,
  duration_minutes INT DEFAULT 15,
  practice_prompt TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(program_id, day_number)
);

-- ------------------------------------------------------------------------------
-- 7. MENTOR COURSES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT NOT NULL,
  total_lessons INT DEFAULT 0,
  duration_hours NUMERIC(4,1) DEFAULT 1.5,
  tier_access subscription_tier DEFAULT 'premium_plus',
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS course_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_number INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  audio_url TEXT NOT NULL,
  duration_seconds INT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(course_id, lesson_number)
);

-- ------------------------------------------------------------------------------
-- 8. USER INTERACTION: PLAYLISTS, FAVORITES, DOWNLOADS & HISTORY
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS playlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS playlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- 'music', 'meditation', 'soundscape'
  content_id UUID NOT NULL,
  position INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(playlist_id, content_type, content_id)
);

CREATE TABLE IF NOT EXISTS favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- 'music', 'meditation', 'soundscape', 'program'
  content_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, content_type, content_id)
);

CREATE TABLE IF NOT EXISTS downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  local_cached_path TEXT,
  file_size_bytes BIGINT,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, content_type, content_id)
);

CREATE TABLE IF NOT EXISTS listening_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  played_duration_seconds INT NOT NULL,
  total_duration_seconds INT NOT NULL,
  completed BOOLEAN DEFAULT false,
  listened_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 9. REFERRALS, SUBSCRIPTIONS, PAYMENTS & COMMISSIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  referral_code_id UUID NOT NULL REFERENCES mentor_referral_codes(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  has_subscribed BOOLEAN DEFAULT false,
  subscription_id UUID,
  UNIQUE(referred_user_id)
);

CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_percentage NUMERIC(5,2) DEFAULT 10.00,
  trial_days INT DEFAULT 7,
  valid_until TIMESTAMPTZ,
  max_redemptions INT,
  times_redeemed INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  tier subscription_tier NOT NULL DEFAULT 'premium',
  billing_cycle subscription_billing_cycle NOT NULL DEFAULT 'annual',
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

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status payment_status NOT NULL DEFAULT 'pending',
  provider payment_provider NOT NULL DEFAULT 'stripe',
  provider_transaction_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES mentors(id) ON DELETE CASCADE,
  referral_id UUID REFERENCES referrals(id) ON DELETE SET NULL,
  referred_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
  payment_id UUID REFERENCES payments(id) ON DELETE SET NULL,
  transaction_amount NUMERIC(10,2) NOT NULL,
  commission_percentage NUMERIC(5,2) NOT NULL,
  commission_amount NUMERIC(10,2) NOT NULL,
  status commission_status NOT NULL DEFAULT 'pending',
  payout_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 10. NOTIFICATIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'system', -- 'referral', 'subscription', 'daily_reminder'
  is_read BOOLEAN DEFAULT false,
  link_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_music_mood ON music(mood);
CREATE INDEX IF NOT EXISTS idx_music_tier ON music(tier_access);
CREATE INDEX IF NOT EXISTS idx_meditations_mood ON meditations(mood);
CREATE INDEX IF NOT EXISTS idx_soundscapes_mood ON soundscapes(mood);
CREATE INDEX IF NOT EXISTS idx_favorites_user ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_commissions_mentor ON commissions(mentor_id);
CREATE INDEX IF NOT EXISTS idx_referrals_code ON referrals(referral_code_id);
