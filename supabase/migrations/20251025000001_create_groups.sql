-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  next_meeting TIMESTAMP WITH TIME ZONE,
  is_premium BOOLEAN DEFAULT false,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create group_members table
CREATE TABLE IF NOT EXISTS group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_groups_creator_id ON groups(creator_id);
CREATE INDEX IF NOT EXISTS idx_groups_category ON groups(category);
CREATE INDEX IF NOT EXISTS idx_groups_created_at ON groups(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);

-- Enable Row Level Security
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;

-- RLS Policies for groups
-- Anyone can view groups
CREATE POLICY "Anyone can view groups" ON groups
  FOR SELECT
  USING (true);

-- Only authenticated users can create groups
CREATE POLICY "Authenticated users can create groups" ON groups
  FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- Only creator can update their groups
CREATE POLICY "Creator can update own groups" ON groups
  FOR UPDATE
  USING (auth.uid() = creator_id);

-- Only creator can delete their groups
CREATE POLICY "Creator can delete own groups" ON groups
  FOR DELETE
  USING (auth.uid() = creator_id);

-- RLS Policies for group_members
-- Anyone can view group members
CREATE POLICY "Anyone can view group members" ON group_members
  FOR SELECT
  USING (true);

-- Authenticated users can join groups
CREATE POLICY "Users can join groups" ON group_members
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can leave groups (delete their membership)
CREATE POLICY "Users can leave groups" ON group_members
  FOR DELETE
  USING (auth.uid() = user_id);

-- Group admins can manage members
CREATE POLICY "Group admins can manage members" ON group_members
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = group_members.group_id
      AND gm.user_id = auth.uid()
      AND gm.role = 'admin'
    )
  );

-- Function to automatically add creator as admin member
CREATE OR REPLACE FUNCTION add_creator_as_admin()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO group_members (group_id, user_id, role)
  VALUES (NEW.id, NEW.creator_id, 'admin');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to add creator as admin when group is created
CREATE TRIGGER add_creator_as_admin_trigger
  AFTER INSERT ON groups
  FOR EACH ROW
  EXECUTE FUNCTION add_creator_as_admin();

-- Function to count members
CREATE OR REPLACE FUNCTION get_group_member_count(group_id UUID)
RETURNS INTEGER AS $$
  SELECT COUNT(*)::INTEGER FROM group_members WHERE group_members.group_id = $1;
$$ LANGUAGE sql STABLE;

-- Comments for documentation
COMMENT ON TABLE groups IS 'Community groups that users can create and join';
COMMENT ON TABLE group_members IS 'Members of each group with their roles';
