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
  free: "connective_free",
  midMonthly: envOrFallback("VITE_STRIPE_MID_MONTHLY_PRICE_ID", "connective_mid_monthly"),
  midYearly: envOrFallback("VITE_STRIPE_MID_YEARLY_PRICE_ID", "connective_mid_yearly"),
  premiumMonthly: envOrFallback(
    "VITE_STRIPE_PREMIUM_MONTHLY_PRICE_ID",
    "connective_premium_monthly",
  ),
  premiumYearly: envOrFallback(
    "VITE_STRIPE_PREMIUM_YEARLY_PRICE_ID",
    "connective_premium_yearly",
  ),
};

export const STRIPE_DEFAULT_PRICE_ID =
  envOrFallback("VITE_STRIPE_DEFAULT_PRICE_ID", STRIPE_PRICE_IDS.premiumMonthly);

export const STRIPE_DEFAULT_SUCCESS_PATH = "/profile?billing=success";
export const STRIPE_DEFAULT_CANCEL_PATH = "/profile?billing=cancel";
export const STRIPE_DEFAULT_PORTAL_RETURN_PATH = "/profile?billing=updated";

export const hasStripeConfig = () =>
  Boolean(STRIPE_PUBLISHABLE_KEY && STRIPE_FUNCTION_URL);

export type SubscriptionTier = "free" | "mid" | "premium";

export const getBadgeForTier = (tier: SubscriptionTier) => {
  switch (tier) {
    case "premium":
      return {
        label: "Premium",
        className:
          "border border-sky-500/30 bg-sky-500/15 text-sky-700 dark:text-sky-300", // 🔵
        icon: "🔵",
      };
    case "mid":
      return {
        label: "Community Plus",
        className:
          "border border-amber-500/40 bg-amber-500/15 text-amber-700 dark:text-amber-300", // 🟡
        icon: "🟡",
      };
    default:
      return {
        label: "Free",
        className:
          "border border-emerald-500/30 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300", // 🟢
        icon: "🟢",
      };
  }
};
