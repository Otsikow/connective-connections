-- Helper function to check if a user is an admin without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = user_id
      AND role = 'admin'
  );
$$;

-- Ensure authenticated users can execute the helper function
REVOKE ALL ON FUNCTION public.is_admin(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin(uuid) TO authenticated;

-- Recreate the policy to use the helper function instead of a recursive subquery
DROP POLICY IF EXISTS "Only admins can update roles" ON public.profiles;

CREATE POLICY "Only admins can update roles" ON public.profiles
  FOR UPDATE
  USING (
    auth.uid() = id
    OR public.is_admin(auth.uid())
  )
  WITH CHECK (
    auth.uid() = id
    OR public.is_admin(auth.uid())
  );
