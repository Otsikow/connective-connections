import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { z } from 'https://esm.sh/zod@3.25.76'

// Schema for query parameters
const QuerySchema = z.object({
  limit: z.string().optional().default('100').transform(Number).pipe(
    z.number().int().min(1, { message: 'Limit must be at least 1' })
  ),
  offset: z.string().optional().default('0').transform(Number).pipe(
    z.number().int().min(0, { message: 'Offset must be non-negative' })
  ),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface UserEmail {
  id: string
  email: string
  full_name?: string
}

// Admin role check function
async function verifyAdminRole(authHeader: string): Promise<boolean> {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Extract token from Authorization header
    const token = authHeader.replace('Bearer ', '')
    
    // Verify the JWT token and get user info
    const { data: { user }, error } = await supabase.auth.getUser(token)
    
    if (error || !user) {
      console.error('Auth error:', error)
      return false
    }
    
    // Check if user has admin role
    const isAdmin = user.user_metadata?.role === 'admin' || 
                   user.app_metadata?.role === 'admin' ||
                   user.email?.endsWith('@admin.connective.com')
    
    return Boolean(isAdmin)
  } catch (error) {
    console.error('Error verifying admin role:', error)
    return false
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Check if request is from an authenticated admin
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

    // Verify admin role
    const isAdmin = await verifyAdminRole(authHeader)
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Admin access required' }),
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

    // Fetch user emails with pagination
    const { data: users, error: usersError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .not('email', 'is', null)
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    if (usersError) {
      console.error('Error fetching user emails:', usersError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user emails' }),
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
      .not('email', 'is', null)

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
    console.error('Error in get-user-emails function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})