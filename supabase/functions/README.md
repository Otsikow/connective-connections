# Supabase Edge Functions

This directory contains secure edge functions for admin operations.

## Functions

### send-bulk-email
Sends bulk emails to all users. Requires admin authentication.

**Endpoint:** `POST /functions/v1/send-bulk-email`

**Headers:**
- `Authorization: Bearer <user-access-token>` (required)
- `Content-Type: application/json`

**Request Body:**
```json
{
  "subject": "Email subject",
  "message": "Email message content"
}
```

**Security:**
- Verifies JWT authentication
- Checks user has admin role in profiles table
- Only uses service role key after authorization passes
- Returns 401 for authentication errors
- Returns 403 for authorization errors

### get-user-email
Fetches a user's email address from auth. Requires admin authentication.

**Endpoint:** `GET /functions/v1/get-user-email?userId=<user-id>`

**Headers:**
- `Authorization: Bearer <user-access-token>` (required)

**Query Parameters:**
- `userId` (required) - The user ID to fetch email for

**Response:**
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "emailConfirmed": true
}
```

**Security:**
- Verifies JWT authentication
- Checks user has admin role in profiles table
- Only uses service role key after authorization passes
- Returns 401 for authentication errors
- Returns 403 for authorization errors
- Returns 404 if user not found

### stripe-webhook
Processes Stripe billing events and updates subscription state on the `profiles` table.

**Endpoint:** `POST /functions/v1/stripe-webhook`

**Events handled:**
- `checkout.session.completed`
- `invoice.payment_succeeded`
- `customer.subscription.updated`
- `customer.subscription.deleted`

**Behavior:**
- Syncs the customer to the matching `profiles.stripe_customer_id`
- Updates `subscription_tier`, `subscription_expires`, and usage counters
- Resets monthly counters when a lapsed subscription becomes active again

> ℹ️ Configure the secret via `STRIPE_WEBHOOK_SECRET` in your Supabase function settings.

### friendship-compatibility
AI-powered friendship compatibility engine that scores and clusters users for meaningful, non-romantic connections.

**Endpoints (all require `Authorization: Bearer <access-token>`):**

- `POST /functions/v1/friendship-compatibility/calculateScore`
  - Body: `{ "user": <profile>, "candidate": <profile>, "weights?": { <category>: number } }`
  - Returns a compatibility score (0-100), shared trait highlights, and recommended next steps.

- `POST /functions/v1/friendship-compatibility/getCompatibleUsers`
  - Body: `{ "user": <profile>, "candidates": [<profile>], "limit?": number }`
  - Ranks candidates by compatibility score and surfaces recommendations for each.

- `POST /functions/v1/friendship-compatibility/personalityClustering`
  - Body: `{ "candidates": [<profile>], "similarityThreshold?": number, "maxClusters?": number }`
  - Groups users into affinity clusters with anchor traits and cluster-level fit scores.

**Profile payload shape:**

```json
{
  "id": "user-123",
  "personalityTraits": ["empathetic", "curious"],
  "humorStyle": "witty",
  "faithAlignment": "interfaith",
  "lifestylePatterns": ["morning person", "fitness"],
  "interests": ["art", "tech"],
  "memes": ["wholesome", "surreal"],
  "eventsAttended": ["hackathons", "community_service"],
  "musicTaste": ["indie", "lofi"],
  "learningGoals": ["spanish", "machine learning"],
  "dailyRoutines": ["early workouts", "evening reading"],
  "timezone": "UTC"
}
```

**Security:**
- Every endpoint requires a valid Supabase session token.
- Requests without authentication receive `401` responses.
- Payloads are validated with Zod before processing.

## Deployment

```bash
# Deploy both functions
supabase functions deploy send-bulk-email
supabase functions deploy get-user-email

# Or deploy all functions
supabase functions deploy
```

## Environment Variables

The edge functions require these environment variables (automatically available in Supabase):
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Public anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (never expose to client)

## Testing

```bash
# Get your access token from browser (after logging in)
# In browser console: (await supabase.auth.getSession()).data.session.access_token

# Test send-bulk-email (replace with your token and URL)
curl https://your-project.supabase.co/functions/v1/send-bulk-email \
  -X POST \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"subject":"Test","message":"Test message"}'

# Test get-user-email
curl "https://your-project.supabase.co/functions/v1/get-user-email?userId=USER_UUID" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Security Notes

1. **Never call auth.admin APIs from client code**
   - These require service role key which must never be exposed to clients
   - Always use edge functions as shown here

2. **Always verify authorization server-side**
   - Client-side checks can be bypassed
   - Edge functions must check both authentication and role

3. **Service role key usage**
   - Only use after verifying admin role
   - Never pass to client
   - Only use in edge functions or server environments

4. **Rate limiting**
   - Consider adding rate limits for production
   - Prevent abuse by authenticated users

## Development

To run functions locally:

```bash
# Start local Supabase
supabase start

# Serve functions locally
supabase functions serve

# Test locally (use http://localhost:54321 instead of production URL)
```
