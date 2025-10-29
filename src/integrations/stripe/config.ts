export const STRIPE_PUBLISHABLE_KEY =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const configuredFunctionUrl = import.meta.env.VITE_STRIPE_FUNCTION_URL;

export const STRIPE_FUNCTION_URL = configuredFunctionUrl
  ? configuredFunctionUrl
  : supabaseUrl
    ? `${supabaseUrl}/functions/v1/stripe-checkout`
    : "";

export const STRIPE_PREMIUM_PRICE_ID =
  import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID ?? "";

export const STRIPE_DEFAULT_SUCCESS_PATH = "/profile?billing=success";
export const STRIPE_DEFAULT_CANCEL_PATH = "/profile?billing=cancel";
export const STRIPE_DEFAULT_PORTAL_RETURN_PATH = "/profile?billing=updated";

export const hasStripeConfig = () =>
  Boolean(STRIPE_PUBLISHABLE_KEY && STRIPE_FUNCTION_URL);
