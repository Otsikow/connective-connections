import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Max-Age': '86400',
};

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100MB
const ALLOWED_MIME_TYPES = new Set([
  'video/mp4',
  'video/quicktime',
  'video/webm',
  'video/ogg',
]);

function jsonResponse(body: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

function getUserIdFromJwt(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.slice(7).trim();
  const parts = token.split('.');
  if (parts.length < 2) {
    return null;
  }

  try {
    const base64Payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const paddedPayload = base64Payload.padEnd(base64Payload.length + ((4 - (base64Payload.length % 4)) % 4), '=');
    const payload = JSON.parse(atob(paddedPayload));
    return typeof payload?.sub === 'string' && payload.sub.length > 0 ? payload.sub : null;
  } catch (error) {
    console.error('JWT parse error', error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Invalid request.' }, 405);
  }

  const authHeader = req.headers.get('Authorization');
  const userId = getUserIdFromJwt(authHeader);

  if (!userId) {
    return jsonResponse({ error: 'Unauthorized request.' }, 401);
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user || user.id !== userId) {
      console.error('Auth validation error', authError);
      return jsonResponse({ error: 'Unauthorized request.' }, 401);
    }

    const contentType = req.headers.get('content-type')?.toLowerCase() || '';
    if (!contentType.includes('multipart/form-data')) {
      return jsonResponse({ error: 'Invalid request.' }, 400);
    }

    const formData = await req.formData();
    const video = formData.get('video');
    const deleteAt = formData.get('delete_at') as string | null;

    if (!(video instanceof File)) {
      return jsonResponse({ error: 'Invalid request.' }, 400);
    }

    if (!video.type || !ALLOWED_MIME_TYPES.has(video.type.toLowerCase())) {
      return jsonResponse({ error: 'Invalid request.' }, 415);
    }

    if (video.size <= 0 || video.size > MAX_FILE_SIZE_BYTES) {
      return jsonResponse({ error: 'Invalid request.' }, 413);
    }

    let parsedDeleteAt: string | null = null;
    if (typeof deleteAt === 'string' && deleteAt.length > 0) {
      const parsedDate = new Date(deleteAt);
      if (Number.isNaN(parsedDate.getTime())) {
        return jsonResponse({ error: 'Invalid request.' }, 400);
      }
      parsedDeleteAt = parsedDate.toISOString();
    }

    const storagePath = `${userId}/${Date.now()}`;
    const { error: storageError } = await supabase.storage
      .from('videos')
      .upload(storagePath, video, { contentType: video.type });

    if (storageError) {
      console.error('Storage upload error', storageError);
      return jsonResponse({ error: 'Request could not be completed.' }, 500);
    }

    const { error: dbError } = await supabase.from('videos').insert({
      user_id: userId,
      delete_at: parsedDeleteAt,
      storage_path: storagePath,
    });

    if (dbError) {
      console.error('Database insert error', dbError);
      return jsonResponse({ error: 'Request could not be completed.' }, 500);
    }

    return jsonResponse({ success: true });
  } catch (error) {
    console.error('Unhandled error', error);
    return jsonResponse({ error: 'Request could not be completed.' }, 500);
  }
});
