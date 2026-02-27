-- Create programme_type enum
DO $$ BEGIN
  CREATE TYPE programme_type AS ENUM ('Bachelor', 'Master', 'PhD', 'Certificate', 'Diploma');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Create programmes table
CREATE TABLE IF NOT EXISTS programmes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  type programme_type NOT NULL DEFAULT 'Bachelor',
  duration TEXT,
  image_url TEXT,
  is_published BOOLEAN DEFAULT false,
  creator_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_programmes_creator_id ON programmes(creator_id);
CREATE INDEX IF NOT EXISTS idx_programmes_type ON programmes(type);
CREATE INDEX IF NOT EXISTS idx_programmes_is_published ON programmes(is_published);
CREATE INDEX IF NOT EXISTS idx_programmes_created_at ON programmes(created_at DESC);

-- Enable Row Level Security
ALTER TABLE programmes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for programmes
-- Anyone can view published programmes
CREATE POLICY "Anyone can view published programmes" ON programmes
  FOR SELECT
  USING (is_published = true);

-- Creators can view their own programmes (published or not)
CREATE POLICY "Creators can view own programmes" ON programmes
  FOR SELECT
  USING (auth.uid() = creator_id);

-- Only authenticated users can create programmes
CREATE POLICY "Authenticated users can create programmes" ON programmes
  FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- Only creator can update their programmes
CREATE POLICY "Creator can update own programmes" ON programmes
  FOR UPDATE
  USING (auth.uid() = creator_id);

-- Only creator can delete their programmes
CREATE POLICY "Creator can delete own programmes" ON programmes
  FOR DELETE
  USING (auth.uid() = creator_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_programmes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on update
CREATE TRIGGER update_programmes_updated_at_trigger
  BEFORE UPDATE ON programmes
  FOR EACH ROW
  EXECUTE FUNCTION update_programmes_updated_at();

-- Comments for documentation
COMMENT ON TABLE programmes IS 'University programmes that partners can create and publish';
COMMENT ON COLUMN programmes.is_published IS 'Whether the programme is visible to agents and students';
