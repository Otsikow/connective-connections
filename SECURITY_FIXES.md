// supabase/functions/send-bulk-email/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.3";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function verifyAdminRole(authHeader: string): Promise<boolean> {
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.replace("Bearer ", "");

  const supabase = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return false;

  const role =
    user.user_metadata?.role ||
    user.app_metadata?.role ||
    (user.email?.endsWith("@admin.connective.com") ? "admin" : "user");

  return role === "admin";
}

serve(async (req: Request) => {
  try {
    // --- Authorization ---
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
      });
    }

    const isAdmin = await verifyAdminRole(authHeader);
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden: Admins only" }), { status: 403 });
    }

    // --- Parse Body ---
    const { subject, message } = await req.json();
    if (!subject || !message) {
      return new Response(JSON.stringify({ error: "Missing subject or message" }), { status: 400 });
    }

    // --- Fetch User Emails ---
    const { data: profiles, error: fetchError } = await supabaseAdmin
      .from("profiles")
      .select("email")
      .neq("role", "admin");

    if (fetchError) throw fetchError;

    // --- Send or Log Emails ---
    for (const user of profiles ?? []) {
      console.log(`Queued email to: ${user.email}`);
      // TODO: integrate with SendGrid / Resend here
    }

    return new Response(JSON.stringify({ success: true, count: profiles?.length || 0 }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Bulk email error:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
