CREATE TABLE videos (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  delete_at TIMESTAMPTZ,
  storage_path TEXT
);
