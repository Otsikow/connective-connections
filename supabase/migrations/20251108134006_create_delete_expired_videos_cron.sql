-- Create the function to delete expired videos
CREATE OR REPLACE FUNCTION delete_expired_videos()
RETURNS void AS $$
DECLARE
  expired_paths TEXT[];
BEGIN
  -- Get paths of expired videos
  SELECT array_agg(storage_path)
  INTO expired_paths
  FROM public.videos
  WHERE delete_at < NOW();

  -- Delete files from storage if any exist
  IF array_length(expired_paths, 1) > 0 THEN
    PERFORM storage.delete_objects('videos', expired_paths);
  END IF;

  -- Delete records from the table
  DELETE FROM public.videos WHERE delete_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule the function to run once a day at midnight
SELECT cron.schedule(
  'delete-expired-videos-job', -- name of the cron job
  '0 0 * * *', -- every day at midnight
  $$SELECT delete_expired_videos()$$
);
