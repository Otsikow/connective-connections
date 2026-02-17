-- Restrict user_roles write operations to admin users only.
-- Keep existing SELECT policy behavior unchanged.

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- INSERT
DROP POLICY IF EXISTS "Allow admins to insert user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can insert user roles" ON public.user_roles;
CREATE POLICY "Only admins can insert user roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

-- UPDATE
DROP POLICY IF EXISTS "Allow admins to update user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can update user roles" ON public.user_roles;
CREATE POLICY "Only admins can update user roles"
ON public.user_roles
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- DELETE
DROP POLICY IF EXISTS "Allow admins to delete user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can delete user roles" ON public.user_roles;
CREATE POLICY "Only admins can delete user roles"
ON public.user_roles
FOR DELETE
USING (public.is_admin(auth.uid()));
