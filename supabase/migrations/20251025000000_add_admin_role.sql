-- Add role column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Add check constraint to ensure role is valid
ALTER TABLE profiles
ADD CONSTRAINT check_valid_role 
CHECK (role IN ('user', 'admin'));

-- Create index for faster role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Add comment for documentation
COMMENT ON COLUMN profiles.role IS 'User role: user (default) or admin. Admins can access admin panel and send bulk emails.';

-- Optional: Create RLS policy to protect role updates
-- This ensures only admins can update roles
DROP POLICY IF EXISTS "Only admins can update roles" ON profiles;
CREATE POLICY "Only admins can update roles" ON profiles
  FOR UPDATE
  USING (
    -- Either updating own profile (but not role column)
    (auth.uid() = id AND role = OLD.role)
    OR
    -- Or user is an admin
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );

-- Note: To set your first admin, run this after creating your user:
-- UPDATE profiles SET role = 'admin' WHERE id = 'your-user-id';
