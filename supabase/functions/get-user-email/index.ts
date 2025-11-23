import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://esm.sh/zod@3.25.76'

const QuerySchema = z.object({
  userId: z.string().uuid({ message: "Invalid userId" }),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { isAdmin, userId: adminUserId } = await verifyAdminRole(authHeader);

    if (!isAdmin || !adminUserId) {
      return new Response(
        JSON.stringify({
          error: 'Unauthorized: Admin privileges required'
        }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate and parse the request query
    const url = new URL(req.url)
    const query = Object.fromEntries(url.searchParams.entries())
    const validationResult = QuerySchema.safeParse(query)

    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: 'Invalid query parameters',
          details: validationResult.error.flatten().fieldErrors,
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { userId } = validationResult.data

    // Now use the service role client to get the user's email from auth
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Log the admin action
    await supabaseAdmin.from("admin_audit_log").insert({
      admin_id: adminUserId,
      action: "get_user_email",
      target_user_id: userId,
    });

    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId)

    if (authError) {
      console.error('[GET_EMAIL_ERR]', { userId, error: authError.message });
      return new Response(
        JSON.stringify({ error: 'Unable to fetch user information' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify({ 
        userId: authUser.user.id,
        email: authUser.user.email,
        emailConfirmed: authUser.user.email_confirmed_at !== null
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('[GET_EMAIL_ERR]', {
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    })
    return new Response(
      JSON.stringify({ error: 'Unable to process request' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
