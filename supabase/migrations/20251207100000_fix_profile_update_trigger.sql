-- Fix: Drop the prevent_role_escalation trigger and function that references the removed 'role' column
-- 
-- Context: The 'role' column was removed from profiles table in migration 20251107180619,
-- but the prevent_role_escalation trigger/function that referenced this column was not dropped.
-- This causes all profile updates to fail because the trigger tries to access non-existent columns.
--
-- The role-based access control now uses the separate 'user_roles' table instead.

-- Drop the trigger first (depends on the function)
DROP TRIGGER IF EXISTS prevent_role_escalation ON public.profiles;

-- Drop the function
DROP FUNCTION IF EXISTS public.prevent_role_escalation();

-- Add a comment documenting the fix
COMMENT ON TABLE public.profiles IS 'User profiles table. Role-based access is now managed via the user_roles table.';
