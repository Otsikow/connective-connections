import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailPayload {
  subject: string
  message: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // CRITICAL: Verify the request has an authorization header
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

    // Create a Supabase client with the auth header to verify the user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // CRITICAL: Verify the user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // CRITICAL: Check if the user has admin role in the profiles table
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || profile.role !== 'admin') {
      return new Response(
        JSON.stringify({ 
          error: 'Unauthorized: Admin privileges required',
          details: 'Only administrators can send bulk emails'
        }),
        { 
          status: 403, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Parse the request body
    const { subject, message }: EmailPayload = await req.json()

    if (!subject || !message) {
      return new Response(
        JSON.stringify({ error: 'Subject and message are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Now that we've verified the user is an admin, we can use the service role
    // client to query all profiles and send emails
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Fetch all profiles with emails
    const { data: profiles, error: fetchError } = await supabaseAdmin
      .from('profiles')
      .select('id, email')
      .not('email', 'is', null)

    if (fetchError) {
      throw fetchError
    }

    // In a real implementation, you would integrate with an email service here
    // For now, we'll just log that we would send emails
    console.log(`Admin ${user.email} initiated bulk email to ${profiles?.length || 0} users`)
    console.log(`Subject: ${subject}`)
    console.log(`Message preview: ${message.substring(0, 100)}...`)

    // TODO: Integrate with Resend, SendGrid, AWS SES, or another email service
    // Example:
    // for (const profile of profiles || []) {
    //   await sendEmail({
    //     to: profile.email,
    //     subject,
    //     html: message,
    //   })
    // }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Bulk email queued for ${profiles?.length || 0} recipients`,
        adminUser: user.email
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in send-bulk-email function:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
