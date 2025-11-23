// supabase/functions/send-bulk-email/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.3";
import { z } from "https://esm.sh/zod@3.25.76";

// --- Zod Schema for request body with improved validation ---
const BodySchema = z.object({
  subject: z.string()
    .trim()
    .min(3, { message: "Subject must be at least 3 characters" })
    .max(200, { message: "Subject must be under 200 characters" }),
  message: z.string()
    .trim()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(5000, { message: "Message must be under 5000 characters" }),
});

// --- CORS headers ---
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
}

// --- Verify admin role and return user ID ---
async function verifyAdminRole(
  authHeader: string
): Promise<{ isAdmin: boolean; userId: string | null }> {
  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) {
      console.error("Auth error:", error);
      return { isAdmin: false, userId: null };
    }

    const { data: isAdmin, error: roleError } = await supabase.rpc(
      "has_role",
      {
        _user_id: user.id,
        _role: "admin",
      }
    );

    if (roleError) {
      console.error("Role check error:", roleError);
      return { isAdmin: false, userId: user.id };
    }

    return { isAdmin: Boolean(isAdmin), userId: user.id };
  } catch (err) {
    console.error("Error verifying admin role:", err);
    return { isAdmin: false, userId: null };
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

    // Verify admin and get user ID
    const { isAdmin, userId } = await verifyAdminRole(authHeader);
    if (!isAdmin || !userId) {
      return new Response(
        JSON.stringify({ error: "Forbidden: Admin access required" }),
        {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Validate and parse request body
    const body = await req.json();
    const validationResult = BodySchema.safeParse(body);

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: "Invalid request body",
          details: validationResult.error.flatten().fieldErrors,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
    const { subject, message } = validationResult.data;

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Log the admin action
    await supabaseAdmin.from("admin_audit_log").insert({
      admin_id: userId,
      action: "send_bulk_email",
    });

    // Fetch all user emails
    const { data: profiles, error: fetchError } = await supabaseAdmin
      .from("profiles")
      .select("id, email, full_name")
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
    console.error("[BULK_EMAIL_ERR]", {
      error: err instanceof Error ? err.message : String(err),
      timestamp: new Date().toISOString()
    });
    return new Response(
      JSON.stringify({
        error: "Unable to send bulk email. Please try again later.",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
