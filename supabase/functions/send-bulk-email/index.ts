// Secure bulk email function with admin authorization and strict CORS
// Deno + Supabase Edge Function
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Comma-separated list of allowed origins, e.g. "https://app.example.com,https://admin.example.com"
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter((s) => Boolean(s));

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.length === 0) return false; // require explicit allowlist
  return ALLOWED_ORIGINS.includes(origin);
}

function buildCorsHeaders(origin: string | null): HeadersInit {
  const headers: HeadersInit = { "Vary": "Origin" };
  if (origin && isOriginAllowed(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "POST, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "authorization, content-type";
  }
  return headers;
}

async function isRequesterAdmin(authorizationHeader: string | null): Promise<{ ok: boolean; reason?: string }> {
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return { ok: false, reason: "missing_bearer" };
  }

  // Use the caller's token to get the user
  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authorizationHeader } },
  });
  const { data, error } = await userClient.auth.getUser();
  if (error || !data?.user) {
    return { ok: false, reason: "invalid_user" };
  }

  const user = data.user as any;
  const appMeta = user.app_metadata || {};
  const userMeta = user.user_metadata || {};

  const roles = Array.isArray(appMeta.roles)
    ? appMeta.roles
    : (typeof appMeta.role === "string" ? [appMeta.role] : []);
  const isAdminMeta = roles.includes("admin") || appMeta.is_admin === true || userMeta.is_admin === true;

  if (isAdminMeta) return { ok: true };

  // Optional: check a profiles table flag if available
  try {
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: profileRow, error: profileError } = await adminClient
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();
    if (!profileError && profileRow?.is_admin === true) {
      return { ok: true };
    }
  } catch (_e) {
    // ignore - table may not exist
  }

  return { ok: false, reason: "forbidden" };
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const cors = buildCorsHeaders(origin);

  // Handle preflight
  if (req.method === "OPTIONS") {
    if (!isOriginAllowed(origin)) {
      return new Response("Forbidden", { status: 403, headers: cors });
    }
    return new Response("ok", { headers: cors });
  }

  if (!isOriginAllowed(origin)) {
    return new Response(JSON.stringify({ error: "origin_forbidden" }), {
      status: 403,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const authHeader = req.headers.get("Authorization");
  const adminCheck = await isRequesterAdmin(authHeader);
  if (!adminCheck.ok) {
    const status = adminCheck.reason === "missing_bearer" || adminCheck.reason === "invalid_user" ? 401 : 403;
    return new Response(JSON.stringify({ error: adminCheck.reason ?? "unauthorized" }), {
      status,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // Parse body
  type Payload = { subject: string; body: string; preview?: boolean };
  let payload: Payload | null = null;
  try {
    payload = await req.json();
  } catch (_e) {
    return new Response(JSON.stringify({ error: "invalid_json" }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  if (!payload?.subject || !payload?.body) {
    return new Response(JSON.stringify({ error: "missing_fields" }), {
      status: 400,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  // Build service-role client for privileged operations
  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Fetch user emails using Admin API (server-side only)
  const perPage = 1000;
  let page = 1;
  const allEmails: string[] = [];

  while (true) {
    const { data, error } = await adminClient.auth.admin.listUsers({ page, perPage });
    if (error) {
      return new Response(JSON.stringify({ error: "list_users_failed", details: error.message }), {
        status: 500,
        headers: { ...cors, "Content-Type": "application/json" },
      });
    }
    const users = data?.users ?? [];
    for (const u of users) {
      if (u.email) allEmails.push(u.email);
    }
    if (users.length < perPage) break;
    page += 1;
  }

  // In this template, we do not actually send email.
  // Integrate with your provider here (Resend/SendGrid/Postmark/etc.).
  // If preview flag is set, just return the count and sample.

  const response = {
    sent: payload.preview ? 0 : allEmails.length,
    totalRecipients: allEmails.length,
    preview: payload.preview === true,
    sample: allEmails.slice(0, 10),
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: { ...cors, "Content-Type": "application/json" },
  });
});
