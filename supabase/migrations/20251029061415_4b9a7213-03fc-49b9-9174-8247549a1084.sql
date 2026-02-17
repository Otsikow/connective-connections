-- Add missing columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin', 'host'));

-- Create groups table
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  location TEXT,
  image_url TEXT,
  next_meeting TIMESTAMP WITH TIME ZONE,
  is_premium BOOLEAN NOT NULL DEFAULT false,
  creator_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for groups
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for groups
CREATE POLICY "Groups are viewable by everyone"
  ON public.groups
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create groups"
  ON public.groups
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = creator_id);

CREATE POLICY "Creators can update their groups"
  ON public.groups
  FOR UPDATE
  USING (auth.uid() = creator_id);

CREATE POLICY "Creators can delete their groups"
  ON public.groups
  FOR DELETE
  USING (auth.uid() = creator_id);

-- Create group_members table for tracking group memberships
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id UUID NOT NULL REFERENCES public.groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Enable RLS for group_members
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for group_members
CREATE POLICY "Authenticated users can view group members"
  ON public.group_members
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can join groups"
  ON public.group_members
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' AND auth.uid() = user_id);

CREATE POLICY "Users can leave groups"
  ON public.group_members
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create trigger for groups updated_at
CREATE TRIGGER update_groups_updated_at
  BEFORE UPDATE ON public.groups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();