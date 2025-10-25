// Admin-only function to list user emails for management UI
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter((s) => Boolean(s));

function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.length === 0) return false;
  return ALLOWED_ORIGINS.includes(origin);
}

function buildCorsHeaders(origin: string | null): HeadersInit {
  const headers: HeadersInit = { Vary: "Origin" };
  if (origin && isOriginAllowed(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
    headers["Access-Control-Allow-Methods"] = "GET, OPTIONS";
    headers["Access-Control-Allow-Headers"] = "authorization, content-type";
  }
  return headers;
}

async function isRequesterAdmin(authorizationHeader: string | null): Promise<boolean> {
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) return false;
  const userClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authorizationHeader } },
  });
  const { data } = await userClient.auth.getUser();
  const user = data?.user as any;
  if (!user) return false;
  const appMeta = user.app_metadata || {};
  const userMeta = user.user_metadata || {};
  const roles = Array.isArray(appMeta.roles)
    ? appMeta.roles
    : (typeof appMeta.role === "string" ? [appMeta.role] : []);
  if (roles.includes("admin") || appMeta.is_admin === true || userMeta.is_admin === true) return true;
  try {
    const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: profileRow } = await adminClient
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .maybeSingle();
    return profileRow?.is_admin === true;
  } catch (_e) {
    return false;
  }
}

serve(async (req) => {
  const origin = req.headers.get("origin");
  const cors = buildCorsHeaders(origin);

  if (req.method === "OPTIONS") {
    if (!isOriginAllowed(origin)) return new Response("Forbidden", { status: 403, headers: cors });
    return new Response("ok", { headers: cors });
  }

  if (!isOriginAllowed(origin)) {
    return new Response(JSON.stringify({ error: "origin_forbidden" }), {
      status: 403,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  if (req.method !== "GET") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const authHeader = req.headers.get("Authorization");
  const isAdmin = await isRequesterAdmin(authHeader);
  if (!isAdmin) {
    return new Response(JSON.stringify({ error: "forbidden" }), {
      status: 403,
      headers: { ...cors, "Content-Type": "application/json" },
    });
  }

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const perPage = 1000;
  let page = 1;
  const emails: string[] = [];

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
      if (u.email) emails.push(u.email);
    }
    if (users.length < perPage) break;
    page += 1;
  }

  return new Response(JSON.stringify({ emails, count: emails.length }), {
    status: 200,
    headers: { ...cors, "Content-Type": "application/json" },
  });
});
