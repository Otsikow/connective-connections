export const STRIPE_PUBLISHABLE_KEY =
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const configuredFunctionUrl = import.meta.env.VITE_STRIPE_FUNCTION_URL;

export const STRIPE_FUNCTION_URL = configuredFunctionUrl
  ? configuredFunctionUrl
  : supabaseUrl
    ? `${supabaseUrl}/functions/v1/stripe-checkout`
    : "";

const envOrFallback = (envKey: string, fallback: string) =>
  (import.meta.env as Record<string, string | undefined>)[envKey] ?? fallback;

export const STRIPE_PRICE_IDS = {
  basic: "connective_basic",
  standardMonthly: envOrFallback(
    "VITE_STRIPE_STANDARD_MONTHLY_PRICE_ID",
    "connective_standard_monthly",
  ),
  standardYearly: envOrFallback(
    "VITE_STRIPE_STANDARD_YEARLY_PRICE_ID",
    "connective_standard_yearly",
  ),
  proMonthly: envOrFallback(
    "VITE_STRIPE_PRO_MONTHLY_PRICE_ID",
    "connective_pro_monthly",
  ),
  proYearly: envOrFallback(
    "VITE_STRIPE_PRO_YEARLY_PRICE_ID",
    "connective_pro_yearly",
  ),
};

export const STRIPE_DEFAULT_PRICE_ID =
  envOrFallback("VITE_STRIPE_DEFAULT_PRICE_ID", STRIPE_PRICE_IDS.proMonthly);

export const STRIPE_DEFAULT_SUCCESS_PATH = "/profile?billing=success";
export const STRIPE_DEFAULT_CANCEL_PATH = "/profile?billing=cancel";
export const STRIPE_DEFAULT_PORTAL_RETURN_PATH = "/profile?billing=updated";

export const hasStripeConfig = () =>
  Boolean(STRIPE_PUBLISHABLE_KEY && STRIPE_FUNCTION_URL);

export type SubscriptionTier = "basic" | "standard" | "pro";

export const getBadgeForTier = (tier: SubscriptionTier) => {
  switch (tier) {
    case "pro":
      return {
        label: "Pro (Premium)",
        className:
          "border border-sky-500/40 bg-sky-500/15 text-sky-700 dark:text-sky-300",
        icon: "🔵",
      };
    case "standard":
      return {
        label: "Standard (Mid-Tier)",
        className:
          "border border-amber-500/40 bg-amber-500/15 text-amber-700 dark:text-amber-300",
        icon: "🟡",
      };
    default:
      return {
        label: "Basic (Free)",
        className:
          "border border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
        icon: "🟢",
      };
  }
};
