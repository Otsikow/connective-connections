-- Create a dedicated bucket for uploaded videos that can be reused by hero media
-- and user recordings. Public read access keeps the hero background playable
-- while authenticated users can manage their own uploads.
insert into storage.buckets (id, name, public)
values ('videos', 'videos', true)
on conflict (id) do update set public = excluded.public;

alter table storage.objects enable row level security;

-- Anyone can read videos so the hero section background is always accessible.
create policy "Allow public read access to videos"
  on storage.objects for select
  using (bucket_id = 'videos');

-- Authenticated users can upload new videos.
create policy "Allow authenticated uploads to videos"
  on storage.objects for insert
  with check (
    bucket_id = 'videos'
    and auth.role() = 'authenticated'
  );

-- Users can update objects they own within the videos bucket.
create policy "Allow owners to update videos"
  on storage.objects for update
  using (bucket_id = 'videos' and owner = auth.uid())
  with check (bucket_id = 'videos' and owner = auth.uid());

-- Users can delete their own uploaded videos.
create policy "Allow owners to delete videos"
  on storage.objects for delete
  using (bucket_id = 'videos' and owner = auth.uid());
