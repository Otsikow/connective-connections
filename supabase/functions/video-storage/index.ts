import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const formData = await req.formData();
  const video = formData.get('video') as File;
  const user_id = formData.get('user_id') as string;
  const delete_at = formData.get('delete_at') as string;

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  );

  const storagePath = `${user_id}/${Date.now()}`;
  const { error: storageError } = await supabase.storage
    .from('videos')
    .upload(storagePath, video);

  if (storageError) {
    return new Response(JSON.stringify({ error: storageError.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  const { error: dbError } = await supabase.from('videos').insert({
    user_id,
    delete_at,
    storage_path: storagePath,
  });

  if (dbError) {
    return new Response(JSON.stringify({ error: dbError.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
