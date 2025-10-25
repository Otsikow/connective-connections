# Security Fixes: Admin Authorization & Secure Email Access

## Overview
This document details the security fixes implemented to address critical vulnerabilities related to bulk email functionality and user email access.

## Issues Fixed

### 1. Unsecured Bulk Email Endpoint (CRITICAL)
**Problem:** The send-bulk-email edge function could be called by any user without authorization checks, allowing anyone to spam all users.

**Solution:** 
- Added explicit authorization header check
- Verify user authentication via JWT token
- Check user's role in profiles table (must be 'admin')
- Only use service role key AFTER authorization passes
- Return 401/403 errors for unauthorized requests

**File:** `/workspace/supabase/functions/send-bulk-email/index.ts`

### 2. Client-Side Admin API Usage (CRITICAL)
**Problem:** Attempting to call `supabase.auth.admin.getUserById()` from the browser, which requires service role key and will fail with 401 errors.

**Solution:**
- Created secure edge function `get-user-email` that handles admin API calls server-side
- Edge function verifies caller is authenticated admin before accessing auth.admin APIs
- Client calls edge function with user's session token, not service role key

**Files:** 
- `/workspace/supabase/functions/get-user-email/index.ts`
- `/workspace/src/pages/Admin.tsx`

## Security Architecture

### Edge Functions (Server-Side)

Both edge functions follow this security pattern:

```typescript
1. Verify Authorization header exists
2. Create Supabase client with user's session token
3. Call auth.getUser() to verify authentication
4. Query profiles table to verify admin role
5. If authorized, use service role client for privileged operations
6. Return 401 for auth errors, 403 for role errors
```

### Client-Side Integration

The Admin component demonstrates proper usage:

```typescript
// ✓ CORRECT: Call edge function with session token
const { data: { session } } = await supabase.auth.getSession();
const response = await fetch(edgeFunctionUrl, {
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
  }
});

// ✗ WRONG: Never do this from client
// await supabase.auth.admin.getUserById(userId)
```

## Required Database Setup

### Add Role Column to Profiles

```sql
-- Add role column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';

-- Create index for faster role checks
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Set a user as admin (replace with actual user ID)
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'your-admin-user-id';
```

### Row Level Security (Recommended)

```sql
-- Ensure only admins can update roles
CREATE POLICY "Only admins can update roles" ON profiles
  FOR UPDATE
  USING (
    auth.uid() IN (
      SELECT id FROM profiles WHERE role = 'admin'
    )
  );
```

## Deployment Checklist

- [ ] Deploy edge functions to Supabase
  ```bash
  supabase functions deploy send-bulk-email
  supabase functions deploy get-user-email
  ```

- [ ] Add role column to profiles table
- [ ] Set initial admin user(s) in database
- [ ] Configure environment variables for edge functions:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

- [ ] Test admin access control:
  - Try accessing admin page as non-admin (should fail)
  - Try calling edge functions without auth (should fail)
  - Verify bulk email works for admin users
  - Verify email fetching works for admin users

## Testing

### Test Admin Authorization

```bash
# Should fail without auth
curl https://your-project.supabase.co/functions/v1/send-bulk-email \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"subject":"Test","message":"Test"}'

# Should fail with non-admin auth
curl https://your-project.supabase.co/functions/v1/send-bulk-email \
  -X POST \
  -H "Authorization: Bearer <non-admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"subject":"Test","message":"Test"}'

# Should succeed with admin auth
curl https://your-project.supabase.co/functions/v1/send-bulk-email \
  -X POST \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"subject":"Test","message":"Test"}'
```

## Best Practices

1. **Never expose service role key to client**
   - Service role key bypasses RLS and should only be used server-side
   - Always use anon key for client-side Supabase client

2. **Always verify authorization server-side**
   - Client-side checks can be bypassed
   - Edge functions must verify both authentication and authorization

3. **Use proper CORS headers**
   - While we use permissive CORS for development, consider restricting origins in production
   - CORS doesn't provide security - authorization checks do

4. **Audit admin actions**
   - Log all admin actions (bulk emails, data access)
   - Consider adding an audit_log table

5. **Rate limiting**
   - Consider adding rate limits to edge functions
   - Prevent abuse even by authenticated users

## Email Service Integration

The bulk email function currently logs emails but doesn't send them. To integrate with an email service:

1. Choose a service (Resend, SendGrid, AWS SES, etc.)
2. Add API key to edge function secrets
3. Replace TODO section in send-bulk-email function
4. Add error handling and retry logic
5. Consider implementing a queue for large sends

## Support

For questions or issues:
- Review edge function logs in Supabase dashboard
- Check browser console for client-side errors
- Verify environment variables are set correctly
- Ensure database migrations have been applied
