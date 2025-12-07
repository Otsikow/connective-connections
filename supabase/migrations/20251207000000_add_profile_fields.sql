-- Add phone_number and country columns to profiles table for complete profile data persistence
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS country TEXT,
ADD COLUMN IF NOT EXISTS headline TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS website TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT;

-- Update the handle_new_user function to ensure profile creation works with new columns
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, subscription_tier, monthly_connections, monthly_event_joins)
  VALUES (NEW.id, NEW.email, 'basic', 0, 0)
  ON CONFLICT (id) DO UPDATE
  SET email = COALESCE(NEW.email, public.profiles.email);
  RETURN NEW;
END;
$$;

-- Add comment to document the columns
COMMENT ON COLUMN public.profiles.phone_number IS 'User phone number for contact';
COMMENT ON COLUMN public.profiles.country IS 'User country for location-based matching';
COMMENT ON COLUMN public.profiles.headline IS 'Short tagline about the user';
COMMENT ON COLUMN public.profiles.location IS 'City/region location';
COMMENT ON COLUMN public.profiles.website IS 'Personal website or link-in-bio URL';
COMMENT ON COLUMN public.profiles.bio IS 'Extended bio text about the user';
