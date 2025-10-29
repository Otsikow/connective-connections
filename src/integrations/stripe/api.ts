import { supabase } from "@/integrations/supabase/client";
import {
  STRIPE_FUNCTION_URL,
  STRIPE_PREMIUM_PRICE_ID,
  STRIPE_DEFAULT_SUCCESS_PATH,
  STRIPE_DEFAULT_CANCEL_PATH,
  STRIPE_DEFAULT_PORTAL_RETURN_PATH,
} from "./config";

export type StripeCheckoutSessionResponse = {
  sessionId?: string;
  url?: string;
};

export type StripeCheckoutPayload = {
  priceId?: string;
  quantity?: number;
  mode?: "payment" | "subscription";
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, string>;
};

export const createStripeCheckoutSession = async (
  payload: StripeCheckoutPayload = {},
): Promise<StripeCheckoutSessionResponse> => {
  if (!STRIPE_FUNCTION_URL) {
    throw new Error("Stripe function URL is not configured");
  }

  const priceId = payload.priceId ?? STRIPE_PREMIUM_PRICE_ID;
  if (!priceId) {
    throw new Error("A Stripe price ID is required to start checkout");
  }

  const origin =
    typeof window !== "undefined" ? window.location.origin : "";

  const successUrl =
    payload.successUrl ?? `${origin}${STRIPE_DEFAULT_SUCCESS_PATH}`;
  const cancelUrl = payload.cancelUrl ?? `${origin}${STRIPE_DEFAULT_CANCEL_PATH}`;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const response = await fetch(STRIPE_FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {}),
    },
    body: JSON.stringify({
      action: "checkout",
      priceId,
      quantity: payload.quantity ?? 1,
      mode: payload.mode ?? "subscription",
      successUrl,
      cancelUrl,
      metadata: payload.metadata,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error ?? "Unable to create Stripe checkout session");
  }

  return response.json();
};

export const createStripeBillingPortalSession = async (
  returnUrl?: string,
): Promise<{ url: string }> => {
  if (!STRIPE_FUNCTION_URL) {
    throw new Error("Stripe function URL is not configured");
  }

  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const resolvedReturnUrl = returnUrl ?? `${origin}${STRIPE_DEFAULT_PORTAL_RETURN_PATH}`;

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const response = await fetch(STRIPE_FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(session?.access_token
        ? { Authorization: `Bearer ${session.access_token}` }
        : {}),
    },
    body: JSON.stringify({
      action: "billing_portal",
      returnUrl: resolvedReturnUrl,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.error ?? "Unable to create Stripe billing portal session",
    );
  }

  return response.json();
};
