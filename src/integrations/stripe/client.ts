import { STRIPE_PUBLISHABLE_KEY } from "./config";

type StripeLike = {
  redirectToCheckout: (options: {
    sessionId: string;
  }) => Promise<{ error?: { message?: string } } | undefined>;
};

declare global {
  interface Window {
    Stripe?: (publishableKey: string) => StripeLike | null;
  }
}

let stripePromise: Promise<StripeLike | null> | undefined;
let stripeScriptPromise: Promise<void> | null = null;

const loadStripeFromCdn = async (): Promise<void> => {
  if (stripeScriptPromise) {
    return stripeScriptPromise;
  }

  if (typeof window === "undefined") {
    stripeScriptPromise = Promise.resolve();
    return stripeScriptPromise;
  }

  if (window.Stripe) {
    stripeScriptPromise = Promise.resolve();
    return stripeScriptPromise;
  }

  stripeScriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load Stripe.js from the CDN."));
    document.body.appendChild(script);
  });

  try {
    await stripeScriptPromise;
  } catch (error) {
    stripeScriptPromise = null;
    throw error;
  }
};

export const getStripe = () => {
  if (!STRIPE_PUBLISHABLE_KEY) {
    console.warn("Stripe publishable key is missing.");
    return Promise.resolve(null);
  }

  if (!stripePromise) {
    stripePromise = (async () => {
      if (typeof window === "undefined") {
        return null;
      }

      try {
        await loadStripeFromCdn();
        return window.Stripe ? window.Stripe(STRIPE_PUBLISHABLE_KEY) : null;
      } catch (error) {
        console.error("Unable to load Stripe.js from CDN", error);
        return null;
      }
    })();
  }

  return stripePromise;
};
