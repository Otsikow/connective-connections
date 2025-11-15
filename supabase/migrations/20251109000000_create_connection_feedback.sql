-- Create table for storing connection feedback between members
CREATE TABLE IF NOT EXISTS public.connection_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  connection_identifier TEXT NOT NULL,
  connection_name TEXT NOT NULL,
  met_context TEXT,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.connection_feedback ENABLE ROW LEVEL SECURITY;

-- Allow members to view their own feedback entries
DROP POLICY IF EXISTS "Users can view their own connection feedback" ON public.connection_feedback;
CREATE POLICY "Users can view their own connection feedback"
  ON public.connection_feedback
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow members to insert feedback for themselves
DROP POLICY IF EXISTS "Users can add connection feedback" ON public.connection_feedback;
CREATE POLICY "Users can add connection feedback"
  ON public.connection_feedback
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Allow members to update feedback they previously shared
DROP POLICY IF EXISTS "Users can update their connection feedback" ON public.connection_feedback;
CREATE POLICY "Users can update their connection feedback"
  ON public.connection_feedback
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow members to delete their own feedback if they change their mind
DROP POLICY IF EXISTS "Users can delete their connection feedback" ON public.connection_feedback;
CREATE POLICY "Users can delete their connection feedback"
  ON public.connection_feedback
  FOR DELETE
  USING (auth.uid() = user_id);

-- Keep the updated_at column in sync automatically
DROP TRIGGER IF EXISTS update_connection_feedback_updated_at ON public.connection_feedback;
CREATE TRIGGER update_connection_feedback_updated_at
  BEFORE UPDATE ON public.connection_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
