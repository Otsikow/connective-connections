-- Add subscription tracking columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_tier TEXT NOT NULL DEFAULT 'basic',
  ADD COLUMN IF NOT EXISTS monthly_connections INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS monthly_event_joins INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS subscription_expires TIMESTAMPTZ;

-- Reapply the allowed values constraint for subscription tiers
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_subscription_tier_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_subscription_tier_check
  CHECK (subscription_tier IN ('basic', 'standard', 'pro'));

-- Ensure existing rows have consistent values
UPDATE public.profiles
SET subscription_tier = CASE subscription_tier
      WHEN 'free' THEN 'basic'
      WHEN 'mid' THEN 'standard'
      WHEN 'premium' THEN 'pro'
      ELSE COALESCE(subscription_tier, 'basic')
    END,
    monthly_connections = COALESCE(monthly_connections, 0),
    monthly_event_joins = COALESCE(monthly_event_joins, 0)
WHERE subscription_tier IS NULL
   OR subscription_tier IN ('free', 'mid', 'premium')
   OR monthly_connections IS NULL
   OR monthly_event_joins IS NULL;

-- Function to reset monthly usage counters (invoked via pg_cron)
CREATE OR REPLACE FUNCTION public.reset_profile_monthly_usage()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.profiles
  SET monthly_connections = 0,
      monthly_event_joins = 0,
      updated_at = now()
  WHERE subscription_tier IN ('basic', 'standard')
    AND (monthly_connections <> 0 OR monthly_event_joins <> 0);
END;
$$;

-- Ensure pg_cron is available for scheduling recurring resets
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- Schedule the reset to run at midnight on the first day of every month
SELECT cron.schedule(
  'reset-profile-monthly-usage',
  '0 0 1 * *',
  $$
  SELECT public.reset_profile_monthly_usage();
  $$
);
