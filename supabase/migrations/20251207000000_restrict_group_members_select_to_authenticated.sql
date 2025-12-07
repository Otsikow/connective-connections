-- Update group_members RLS policy to restrict SELECT access to authenticated users
-- Previously, the policy allowed public (anyone) access

-- Drop the existing public SELECT policies
DROP POLICY IF EXISTS "Anyone can view group members" ON public.group_members;
DROP POLICY IF EXISTS "Group members are viewable by everyone" ON public.group_members;

-- Create new policy that restricts SELECT to authenticated users only
CREATE POLICY "Authenticated users can view group members"
  ON public.group_members
  FOR SELECT
  TO authenticated
  USING (true);
