import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BulkEmailRequest {
  subject: string
  content: string
  template?: string
}

interface UserProfile {
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
    
    // Check if user has admin role in user_metadata or app_metadata
    const isAdmin = user.user_metadata?.role === 'admin' || 
                   user.app_metadata?.role === 'admin' ||
                   user.email?.endsWith('@admin.connective.com') // Example admin email pattern
    
    return isAdmin
  } catch (error) {
    console.error('Error verifying admin role:', error)
    return false
  }
}

// Send email function (placeholder - integrate with your email service)
async function sendEmail(to: string, subject: string, content: string): Promise<boolean> {
  try {
    // TODO: Integrate with your email service (SendGrid, Resend, etc.)
    console.log(`Sending email to ${to}: ${subject}`)
    
    // Example with Resend (uncomment and configure):
    /*
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@connective.com',
        to: [to],
        subject: subject,
        html: content,
      }),
    })
    
    return response.ok
    */
    
    // For now, just log the email (remove in production)
    console.log(`Email would be sent to ${to}`)
    return true
  } catch (error) {
    console.error('Error sending email:', error)
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

    // Parse request body
    const { subject, content, template }: BulkEmailRequest = await req.json()
    
    if (!subject || !content) {
      return new Response(
        JSON.stringify({ error: 'Subject and content are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Fetch all user profiles with email addresses
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .not('email', 'is', null)

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch user profiles' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!profiles || profiles.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No users found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Send emails to all users
    const emailPromises = profiles.map((profile: UserProfile) => 
      sendEmail(profile.email, subject, content)
    )

    const results = await Promise.allSettled(emailPromises)
    const successful = results.filter(result => result.status === 'fulfilled' && result.value).length
    const failed = results.length - successful

    return new Response(
      JSON.stringify({ 
        message: 'Bulk email sent successfully',
        total: profiles.length,
        successful,
        failed
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in send-bulk-email function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})