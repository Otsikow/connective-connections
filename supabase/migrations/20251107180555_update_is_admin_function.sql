-- Update is_admin function to use user_roles table
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE public.user_roles.user_id = user_id
      AND role = 'admin'
  );
$$;
