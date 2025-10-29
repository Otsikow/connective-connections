// supabase/functions/send-bulk-email/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.3";

// --- CORS headers ---
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// --- Interfaces ---
interface BulkEmailRequest {
  subject: string;
  message: string;
}

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
}

// --- Verify admin role ---
async function verifyAdminRole(authHeader: string): Promise<boolean> {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) {
      console.error("Auth error:", error);
      return false;
    }

    const role =
      user.user_metadata?.role ||
      user.app_metadata?.role ||
      (user.email?.endsWith("@admin.connective.com") ? "admin" : "user");

    return role === "admin";
  } catch (err) {
    console.error("Error verifying admin role:", err);
    return false;
  }
}

// --- Placeholder email sender (replace with Resend/SendGrid integration) ---
async function sendEmail(
  to: string,
  subject: string,
  message: string
): Promise<boolean> {
  try {
    console.log(`Queued email to ${to}: ${subject}`);
    // Example integration:
    // await fetch('https://api.resend.com/emails', {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     from: 'noreply@connective.com',
    //     to: [to],
    //     subject,
    //     html: message,
    //   }),
    // });
    return true;
  } catch (err) {
    console.error("Error sending email:", err);
    return false;
  }
}

// --- Main handler ---
serve(async (req: Request) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Verify admin
    const isAdmin = await verifyAdminRole(authHeader);
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: "Forbidden: Admin access required" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse request body
    const { subject, message }: BulkEmailRequest = await req.json();
    if (!subject || !message) {
      return new Response(
        JSON.stringify({ error: "Subject and message are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Fetch all user emails (excluding admins)
    const { data: profiles, error: fetchError } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name")
      .neq("role", "admin")
      .not("email", "is", null);

    if (fetchError) {
      console.error("Error fetching profiles:", fetchError);
      throw new Error("Failed to fetch user profiles");
    }

    // Send emails (parallel)
    const emailResults = await Promise.allSettled(
      (profiles || []).map((p: UserProfile) =>
        sendEmail(p.email, subject, message)
      )
    );

    const successful = emailResults.filter(
      (r) => r.status === "fulfilled" && r.value
    ).length;

    const failed = emailResults.length - successful;

    return new Response(
      JSON.stringify({
        success: true,
        message: "Bulk email operation completed",
        total: profiles?.length || 0,
        successful,
        failed,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("send-bulk-email error:", err);
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Internal server error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
