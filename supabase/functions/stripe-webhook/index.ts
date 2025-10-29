import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.3";
import Stripe from "https://esm.sh/stripe@16.6.0?target=deno";

type SubscriptionTier = "free" | "mid" | "premium";

type ProfileRecord = {
  id: string;
  subscription_tier: SubscriptionTier;
  subscription_expires: string | null;
  monthly_connections: number;
  monthly_event_joins: number;
  stripe_customer_id: string | null;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const tierPriceLookup = {
  mid: [
    Deno.env.get("STRIPE_MID_MONTHLY_PRICE_ID") ?? "connective_mid_monthly",
    Deno.env.get("STRIPE_MID_YEARLY_PRICE_ID") ?? "connective_mid_yearly",
  ],
  premium: [
    Deno.env.get("STRIPE_PREMIUM_MONTHLY_PRICE_ID") ?? "connective_premium_monthly",
    Deno.env.get("STRIPE_PREMIUM_YEARLY_PRICE_ID") ?? "connective_premium_yearly",
  ],
};

const determineTierFromPrice = (priceId?: string | null): SubscriptionTier | null => {
  if (!priceId) return null;
  if (tierPriceLookup.mid.includes(priceId)) return "mid";
  if (tierPriceLookup.premium.includes(priceId)) return "premium";
  return null;
};

const toIsoFromEpoch = (epochSeconds?: number | null) =>
  typeof epochSeconds === "number" ? new Date(epochSeconds * 1000).toISOString() : null;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!stripeSecret || !webhookSecret || !supabaseUrl || !supabaseServiceKey) {
    return new Response(JSON.stringify({ error: "Missing Stripe or Supabase configuration" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response(JSON.stringify({ error: "Missing Stripe signature" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const rawBody = await req.text();

  const stripe = new Stripe(stripeSecret, { apiVersion: "2024-10-28" });
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (error) {
    console.error("stripe-webhook:signature", error);
    return new Response(JSON.stringify({ error: "Invalid signature" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const relevantEvents = new Set([
    "checkout.session.completed",
    "invoice.payment_succeeded",
    "customer.subscription.updated",
    "customer.subscription.deleted",
  ]);

  if (!relevantEvents.has(event.type)) {
    return new Response(JSON.stringify({ received: true, ignored: event.type }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const fetchProfileForCustomer = async (
    customerId: string | null,
    fallbackUserId?: string | null,
  ): Promise<{ profile: ProfileRecord; userId: string } | null> => {
    if (customerId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select(
          "id, subscription_tier, subscription_expires, monthly_connections, monthly_event_joins, stripe_customer_id",
        )
        .eq("stripe_customer_id", customerId)
        .maybeSingle();

      if (profile) {
        return { profile: profile as ProfileRecord, userId: profile.id };
      }
    }

    if (fallbackUserId) {
      const { data: profile } = await supabase
        .from("profiles")
        .select(
          "id, subscription_tier, subscription_expires, monthly_connections, monthly_event_joins, stripe_customer_id",
        )
        .eq("id", fallbackUserId)
        .maybeSingle();

      if (profile) {
        return { profile: profile as ProfileRecord, userId: profile.id };
      }
    }

    return null;
  };

  const updateProfileSubscription = async (
    userId: string,
    customerId: string | null,
    newTier: SubscriptionTier,
    periodEndIso: string | null,
    resetUsage: boolean,
  ) => {
    const updates: Partial<ProfileRecord> & { updated_at?: string } = {
      subscription_tier: newTier,
      subscription_expires: periodEndIso,
      updated_at: new Date().toISOString(),
    };

    if (resetUsage) {
      updates.monthly_connections = 0;
      updates.monthly_event_joins = 0;
    }

    if (customerId) {
      updates.stripe_customer_id = customerId;
    }

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId);

    if (error) {
      console.error("stripe-webhook:update-profile", error);
      throw error;
    }
  };

  try {
    let customerId: string | null = null;
    let userId: string | null = null;
    let supabaseUserId: string | null = null;
    let tier: SubscriptionTier | null = null;
    let periodEndIso: string | null = null;

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        customerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
        supabaseUserId =
          (session.metadata?.supabase_user_id as string | undefined) ?? session.client_reference_id ?? null;

        if (session.subscription) {
          const subscription =
            typeof session.subscription === "string"
              ? await stripe.subscriptions.retrieve(session.subscription)
              : (session.subscription as Stripe.Subscription);
          const priceId = subscription.items.data[0]?.price?.id ?? null;
          tier = determineTierFromPrice(priceId);
          periodEndIso = toIsoFromEpoch(subscription.current_period_end);
        }
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id ?? null;
        const line = invoice.lines.data.find((item) => item.price?.type === "recurring") ?? invoice.lines.data[0];
        const priceId = line?.price?.id ?? null;
        tier = determineTierFromPrice(priceId);
        periodEndIso = toIsoFromEpoch(line?.period?.end ?? invoice.period_end);
        supabaseUserId = (invoice.metadata?.supabase_user_id as string | undefined) ?? null;
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        customerId = typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer?.id ?? null;
        const priceId = subscription.items.data[0]?.price?.id ?? null;
        tier = event.type === "customer.subscription.deleted"
          ? "free"
          : determineTierFromPrice(priceId) ?? "free";
        periodEndIso =
          event.type === "customer.subscription.deleted"
            ? new Date().toISOString()
            : toIsoFromEpoch(subscription.current_period_end);
        supabaseUserId = (subscription.metadata?.supabase_user_id as string | undefined) ?? null;
        break;
      }
      default:
        break;
    }

    const profileResult = await fetchProfileForCustomer(customerId, supabaseUserId);

    if (!profileResult) {
      console.warn("stripe-webhook:profile-not-found", {
        customerId,
        supabaseUserId,
        eventType: event.type,
      });
      return new Response(JSON.stringify({ received: true, userUpdated: false }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    userId = profileResult.userId;
    const profile = profileResult.profile;

    if (event.type === "customer.subscription.deleted") {
      await updateProfileSubscription(userId, customerId, "free", periodEndIso, false);
      return new Response(JSON.stringify({ received: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!tier || tier === "free") {
      console.warn("stripe-webhook:unknown-tier", { eventType: event.type });
      return new Response(JSON.stringify({ received: true, skipped: "unknown-tier" }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const previousExpiration = profile.subscription_expires
      ? new Date(profile.subscription_expires)
      : null;
    const now = new Date();
    const nextExpiration = periodEndIso ? new Date(periodEndIso) : null;
    const shouldResetUsage =
      !previousExpiration || (nextExpiration && previousExpiration <= now);

    await updateProfileSubscription(userId, customerId, tier, periodEndIso, shouldResetUsage);

    return new Response(JSON.stringify({ received: true, tier }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error) {
    console.error("stripe-webhook:error", error);
    return new Response(JSON.stringify({ error: "Webhook processing failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
