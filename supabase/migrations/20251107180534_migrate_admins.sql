-- Migrate existing admins from profiles table to user_roles table
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM public.profiles
WHERE role = 'admin'
ON CONFLICT (user_id, role) DO NOTHING;
