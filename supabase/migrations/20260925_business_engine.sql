-- ==============================================================================
-- SOULFLOW BUSINESS ENGINE (Supabase / PostgreSQL Migration)
-- Subscriptions, Referrals, Coupons, Commissions, Payouts, Payments & Audit Logs
-- ==============================================================================

-- 1. ENUMS & EXTENSIONS
DO $$ BEGIN
  CREATE TYPE coupon_type AS ENUM ('percentage', 'fixed_amount', 'free_trial_days');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE commission_type AS ENUM ('first_payment', 'recurring');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE payout_status AS ENUM ('requested', 'processing', 'paid', 'rejected');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE referral_conversion_status AS ENUM ('registered', 'trial', 'converted', 'expired', 'cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- Add columns to mentors if not exist
ALTER TABLE public.mentors 
ADD COLUMN IF NOT EXISTS commission_type commission_type DEFAULT 'recurring',
ADD COLUMN IF NOT EXISTS payout_minimum NUMERIC(10,2) DEFAULT 100.00;

-- ------------------------------------------------------------------------------
-- 2. SUBSCRIPTION PLANS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- 'free', 'premium', 'premium_plus'
  monthly_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  annual_price NUMERIC(10,2) NOT NULL DEFAULT 0.00,
  currency TEXT NOT NULL DEFAULT 'MYR',
  features JSONB NOT NULL DEFAULT '[]'::JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed initial plans
INSERT INTO public.subscription_plans (id, name, slug, monthly_price, annual_price, currency, features)
VALUES 
(
  'a1000000-0000-0000-0000-000000000001',
  'Free Sanctuary',
  'free',
  0.00,
  0.00,
  'MYR',
  '["Limited healing music", "Basic daily meditation", "Standard soundscapes", "Gentle ads", "Limited programs"]'::JSONB
),
(
  'a1000000-0000-0000-0000-000000000002',
  'Premium Journey',
  'premium',
  19.90,
  199.00,
  'MYR',
  '["Full Healing Music catalog", "All Guided Meditations", "Binaural 3D Soundscapes", "Zero Ads", "Offline Downloads", "All Multi-Day Wellness Programs", "Personalized Sound Recommendations"]'::JSONB
),
(
  'a1000000-0000-0000-0000-000000000003',
  'Premium+ Master',
  'premium_plus',
  39.90,
  399.00,
  'MYR',
  '["Everything in Premium", "Full Master Mentor Courses", "Exclusive Live Sound Baths", "Advanced Somatic Journeys", "Priority Content Access", "1-on-1 Mentor Community Q&A"]'::JSONB
)
ON CONFLICT (slug) DO UPDATE 
SET monthly_price = EXCLUDED.monthly_price,
    annual_price = EXCLUDED.annual_price,
    features = EXCLUDED.features;

-- ------------------------------------------------------------------------------
-- 3. COUPONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  type coupon_type NOT NULL, -- 'percentage', 'fixed_amount', 'free_trial_days'
  value NUMERIC(10,2) NOT NULL,
  start_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  end_date TIMESTAMPTZ,
  usage_limit INT,
  usage_count INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  mentor_id UUID REFERENCES public.mentors(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Seed initial coupons
INSERT INTO public.coupons (id, code, type, value, usage_limit, is_active)
VALUES
('c1000000-0000-0000-0000-000000000001', 'MAYA7DAYS', 'free_trial_days', 7, 500, true),
('c1000000-0000-0000-0000-000000000002', 'WELCOME20', 'percentage', 20.00, 1000, true),
('c1000000-0000-0000-0000-000000000003', 'ALICE10', 'fixed_amount', 10.00, 200, true)
ON CONFLICT (code) DO NOTHING;

-- ------------------------------------------------------------------------------
-- 4. SUBSCRIPTIONS TABLE (Enhance if already exists)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.subscription_plans(id) ON DELETE SET NULL,
  tier TEXT NOT NULL DEFAULT 'premium',
  billing_cycle TEXT NOT NULL DEFAULT 'annual', -- 'monthly', 'annual'
  status TEXT NOT NULL DEFAULT 'trial', -- 'trial', 'active', 'past_due', 'cancelled', 'expired'
  start_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  renewal_date TIMESTAMPTZ,
  trial_end_date TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  payment_provider TEXT DEFAULT 'mock',
  provider_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 5. PAYMENTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  provider TEXT NOT NULL DEFAULT 'mock', -- 'stripe', 'apple_iap', 'google_play', 'mock'
  provider_payment_id TEXT,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'MYR',
  status TEXT NOT NULL DEFAULT 'paid', -- 'pending', 'paid', 'failed', 'refunded'
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 6. REFERRALS TABLE (Update with full lifecycle tracking)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  referral_code TEXT NOT NULL,
  referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  trial_started TIMESTAMPTZ,
  subscription_started TIMESTAMPTZ,
  conversion_status referral_conversion_status NOT NULL DEFAULT 'registered',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(referred_user_id) -- Rule: One user can only belong to one original mentor referral
);

-- ------------------------------------------------------------------------------
-- 7. COMMISSIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
  gross_amount NUMERIC(10,2) NOT NULL,
  commission_rate NUMERIC(5,2) NOT NULL, -- e.g. 15.00
  commission_amount NUMERIC(10,2) NOT NULL, -- e.g. 29.85
  commission_type commission_type NOT NULL DEFAULT 'recurring',
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'paid', 'rejected'
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  approved_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ
);

-- Prevent duplicate commission records for the same payment
CREATE UNIQUE INDEX IF NOT EXISTS idx_commissions_payment_mentor 
ON public.commissions(payment_id, mentor_id) 
WHERE payment_id IS NOT NULL;

-- ------------------------------------------------------------------------------
-- 8. PAYOUTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mentor_id UUID NOT NULL REFERENCES public.mentors(id) ON DELETE CASCADE,
  amount NUMERIC(10,2) NOT NULL CHECK (amount >= 100.00), -- Minimum payout RM100 rule
  status payout_status NOT NULL DEFAULT 'requested',
  requested_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  approved_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  reference_number TEXT,
  notes TEXT
);

-- ------------------------------------------------------------------------------
-- 9. AUDIT LOGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL, -- 'commission_approved', 'payout_paid', 'referral_override', etc.
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  target_type TEXT NOT NULL, -- 'commission', 'payout', 'referral', 'subscription'
  target_id TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Subscription Plans: Public read
CREATE POLICY "Subscription plans viewable by everyone" 
ON public.subscription_plans FOR SELECT USING (is_active = true);

-- Coupons: Public read for active coupons
CREATE POLICY "Active coupons viewable by everyone" 
ON public.coupons FOR SELECT USING (is_active = true);

-- Subscriptions: User sees own, Admin sees all
CREATE POLICY "Users view own subscriptions" 
ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Payments: User sees own, Admin sees all
CREATE POLICY "Users view own payments" 
ON public.payments FOR SELECT USING (auth.uid() = user_id);

-- Referrals: Mentor sees referred users (privacy protected via schema/view), Admin sees all
CREATE POLICY "Mentors view their own referrals" 
ON public.referrals FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.mentors WHERE id = mentor_id AND user_id = auth.uid()));

-- Commissions: Mentor sees only their own commissions, Admin sees all
CREATE POLICY "Mentors view own commissions" 
ON public.commissions FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.mentors WHERE id = mentor_id AND user_id = auth.uid()));

-- Payouts: Mentor views own payouts, Admin manages all
CREATE POLICY "Mentors view own payouts" 
ON public.payouts FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.mentors WHERE id = mentor_id AND user_id = auth.uid()));

CREATE POLICY "Mentors can request payout" 
ON public.payouts FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.mentors WHERE id = mentor_id AND user_id = auth.uid()));

-- Audit Logs: Admin only
CREATE POLICY "Admins view audit logs" 
ON public.audit_logs FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- ------------------------------------------------------------------------------
-- 11. AUTOMATIC COMMISSION GENERATION TRIGGER
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.process_subscription_payment_commission()
RETURNS trigger AS $$
DECLARE
  ref_record RECORD;
  mentor_rec RECORD;
  comm_amount NUMERIC(10,2);
  existing_count INT;
BEGIN
  -- Only process successful payments with positive amounts
  IF NEW.status <> 'paid' OR NEW.amount <= 0 THEN
    RETURN NEW;
  END IF;

  -- 1. Find referral attribution for this user
  SELECT * INTO ref_record 
  FROM public.referrals 
  WHERE referred_user_id = NEW.user_id 
  LIMIT 1;

  IF ref_record.mentor_id IS NULL THEN
    RETURN NEW; -- Not a referred user
  END IF;

  -- 2. Prevent self-referral
  SELECT * INTO mentor_rec 
  FROM public.mentors 
  WHERE id = ref_record.mentor_id 
  LIMIT 1;

  IF mentor_rec.user_id = NEW.user_id THEN
    RETURN NEW; -- Self-referral blocked
  END IF;

  -- 3. Check commission type: if first_payment only, ensure no prior commissions exist
  IF mentor_rec.commission_type = 'first_payment' THEN
    SELECT COUNT(*) INTO existing_count 
    FROM public.commissions 
    WHERE mentor_id = mentor_rec.id AND referred_user_id = NEW.user_id;

    IF existing_count > 0 THEN
      RETURN NEW; -- First payment already credited
    END IF;
  END IF;

  -- 4. Calculate commission amount
  comm_amount := ROUND((NEW.amount * (mentor_rec.commission_percentage / 100.0)), 2);

  -- 5. Insert commission record (pending status)
  INSERT INTO public.commissions (
    mentor_id,
    referred_user_id,
    subscription_id,
    payment_id,
    gross_amount,
    commission_rate,
    commission_amount,
    commission_type,
    status
  ) VALUES (
    mentor_rec.id,
    NEW.user_id,
    NEW.subscription_id,
    NEW.id,
    NEW.amount,
    mentor_rec.commission_percentage,
    comm_amount,
    mentor_rec.commission_type,
    'pending'
  )
  ON CONFLICT (payment_id, mentor_id) DO NOTHING;

  -- 6. Update referral status to converted
  UPDATE public.referrals
  SET conversion_status = 'converted',
      subscription_started = COALESCE(subscription_started, timezone('utc'::text, now())),
      updated_at = timezone('utc'::text, now())
  WHERE id = ref_record.id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_process_commission ON public.payments;
CREATE TRIGGER trg_process_commission
AFTER INSERT OR UPDATE OF status ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.process_subscription_payment_commission();
