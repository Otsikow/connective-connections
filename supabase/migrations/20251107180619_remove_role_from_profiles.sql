-- Drop the old RLS policy on the profiles table
DROP POLICY IF EXISTS "Only admins can update roles" ON public.profiles;

-- Drop the role column from the profiles table
ALTER TABLE public.profiles
DROP COLUMN IF EXISTS role;
