-- Policies for user_roles table

-- 1. Admins can view all user roles
CREATE POLICY "Allow admins to view user roles"
ON public.user_roles
FOR SELECT
USING (public.is_admin(auth.uid()));

-- 2. Admins can insert new user roles
CREATE POLICY "Allow admins to insert user roles"
ON public.user_roles
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

-- 3. Admins can update user roles
CREATE POLICY "Allow admins to update user roles"
ON public.user_roles
FOR UPDATE
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

-- 4. Admins can delete user roles
CREATE POLICY "Allow admins to delete user roles"
ON public.user_roles
FOR DELETE
USING (public.is_admin(auth.uid()));
