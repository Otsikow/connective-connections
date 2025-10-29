# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/d0893900-e56a-435e-b065-00e2e6159616

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/d0893900-e56a-435e-b065-00e2e6159616) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/d0893900-e56a-435e-b065-00e2e6159616) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## Stripe payments setup

This project now ships with a Stripe-powered checkout and billing portal experience.

### Frontend environment variables

Add the following keys to your Vite environment (for example in `.env.local`):

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_STRIPE_PREMIUM_PRICE_ID=price_...
# Optional: override the generated Supabase Functions URL
# VITE_STRIPE_FUNCTION_URL=https://<project>.supabase.co/functions/v1/stripe-checkout
```

By default the frontend will call the hosted Supabase Function at
`<SUPABASE_URL>/functions/v1/stripe-checkout`. Override the URL if you proxy the
function elsewhere.

### Supabase Edge Function

Deploy `supabase/functions/stripe-checkout` and provide these secrets:

```bash
STRIPE_SECRET_KEY=sk_live_...
STRIPE_DEFAULT_PRICE_ID=price_...    # Used if the frontend omits a price ID
SUPABASE_URL=...                     # Already configured for other functions
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...        # Enables automatic profile updates
```

The function will:

- Ensure the caller is authenticated.
- Create or reuse a Stripe Customer associated with the Supabase user.
- Start a Checkout Session (subscription by default) and return the session ID and URL.
- Launch the Stripe Billing Portal when requested.
- Persist the `stripe_customer_id` on the `profiles` table for subsequent billing actions.

After checkout completes, Stripe should redirect back to `/profile?billing=success`. The
profile screen displays helpful toasts for success, cancellation, or portal updates and
will automatically show premium-specific UI.
