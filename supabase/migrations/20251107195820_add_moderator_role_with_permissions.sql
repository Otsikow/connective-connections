-- supabase/migrations/20251107195820_add_moderator_role_with_permissions.sql

-- Create can_view_users function
CREATE OR REPLACE FUNCTION public.can_view_users(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE public.user_roles.user_id = user_id
      AND role IN ('admin', 'moderator')
  );
$$;
