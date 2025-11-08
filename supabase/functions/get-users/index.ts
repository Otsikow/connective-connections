// supabase/functions/get-users/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://esm.sh/zod@3.25.76'

// Schema for query parameters with max limit
const QuerySchema = z.object({
  limit: z.string().optional().default('50').transform(Number).pipe(
    z.number().int().min(1, { message: 'Limit must be at least 1' }).max(100, { message: 'Limit cannot exceed 100' })
  ),
  offset: z.string().optional().default('0').transform(Number).pipe(
    z.number().int().min(0, { message: 'Offset must be non-negative' })
  ),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface User {
  id: string
  full_name?: string
}

// Role check function to verify if user can view users
async function verifyHasPermission(authHeader: string): Promise<boolean> {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    // Get authenticated user
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      console.error('Auth error:', error)
      return false
    }

    // Check if user can view users
    const { data: canView, error: roleError } = await supabase.rpc('can_view_users', {
      user_id: user.id
    })

    if (roleError) {
      console.error('Role check error:', roleError)
      return false
    }

    return Boolean(canView)
  } catch (error) {
    console.error('Error verifying permission:', error)
    return false
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Check for Authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Verify user has permission
    const hasPermission = await verifyHasPermission(authHeader)
    if (!hasPermission) {
      return new Response(
        JSON.stringify({ error: 'Access denied' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Validate and parse query parameters
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
    const { limit, offset } = validationResult.data

    // Fetch users with pagination
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, full_name')
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    if (usersError) {
      console.error('Error fetching users:', usersError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch users' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('Error fetching user count:', countError)
    }

    return new Response(
      JSON.stringify({
        users: users || [],
        total: count || 0,
        limit,
        offset
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('[GET_USERS_ERR]', {
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
