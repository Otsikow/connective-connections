import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.3";
import Stripe from "https://esm.sh/stripe@16.6.0?target=deno";

type CheckoutMode = "payment" | "subscription";

type CheckoutRequest = {
  priceId?: string;
  quantity?: number;
  mode?: CheckoutMode;
  successUrl?: string;
  cancelUrl?: string;
  metadata?: Record<string, string>;
  customerId?: string;
  customerEmail?: string;
  returnUrl?: string;
  action?: "checkout" | "billing_portal";
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
      ...(init?.headers ?? {}),
    },
  });
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const stripeSecret = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecret) {
      return jsonResponse(
        { error: "Stripe secret key is not configured" },
        { status: 500 },
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (!supabaseUrl || !supabaseAnonKey) {
      return jsonResponse(
        { error: "Supabase environment is not fully configured" },
        { status: 500 },
      );
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse(
        { error: "Missing Authorization header" },
        { status: 401 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return jsonResponse(
        { error: "Invalid authentication" },
        { status: 401 },
      );
    }

    const body: CheckoutRequest = await req.json();
    const action = body.action ?? "checkout";

    const stripe = new Stripe(stripeSecret, {
      apiVersion: "2024-10-28",
    });

    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabaseAdmin = supabaseServiceKey
      ? createClient(supabaseUrl, supabaseServiceKey)
      : null;

    const ensureCustomer = async (): Promise<string | null> => {
      if (body.customerId) {
        return body.customerId;
      }

      if (user.user_metadata?.stripe_customer_id) {
        return user.user_metadata.stripe_customer_id as string;
      }

      if (supabaseAdmin) {
        const { data: profile } = await supabaseAdmin
          .from("profiles")
          .select("stripe_customer_id")
          .eq("id", user.id)
          .maybeSingle();

        if (profile?.stripe_customer_id) {
          return profile.stripe_customer_id;
        }
      }

      const email = body.customerEmail ?? user.email ?? undefined;
      let customerId: string | null = null;

      if (email) {
        const existing = await stripe.customers.list({
          email,
          limit: 1,
        });
        if (existing.data.length > 0) {
          customerId = existing.data[0].id;
        }
      }

      if (!customerId) {
        const customer = await stripe.customers.create({
          email: body.customerEmail ?? user.email ?? undefined,
          name: user.user_metadata?.full_name,
          metadata: {
            supabaseUserId: user.id,
          },
        });
        customerId = customer.id;
      }

      if (customerId && supabaseAdmin) {
        await supabaseAdmin
          .from("profiles")
          .update({ stripe_customer_id: customerId })
          .eq("id", user.id);
      }

      return customerId;
    };

    if (action === "billing_portal") {
      const returnUrl = body.returnUrl ?? req.headers.get("Origin") ?? "";
      const customerId = await ensureCustomer();

      if (!customerId) {
        return jsonResponse(
          { error: "Unable to locate Stripe customer for user" },
          { status: 400 },
        );
      }

      const portalSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl || undefined,
      });

      return jsonResponse({ url: portalSession.url });
    }

    const priceId = body.priceId ?? Deno.env.get("STRIPE_DEFAULT_PRICE_ID");
    if (!priceId) {
      return jsonResponse(
        { error: "Stripe price identifier is required" },
        { status: 400 },
      );
    }

    const successUrl = body.successUrl;
    const cancelUrl = body.cancelUrl;

    if (!successUrl || !cancelUrl) {
      return jsonResponse(
        {
          error:
            "Both successUrl and cancelUrl must be provided for checkout sessions",
        },
        { status: 400 },
      );
    }

    const customerId = await ensureCustomer();

    const session = await stripe.checkout.sessions.create({
      mode: body.mode ?? "subscription",
      line_items: [
        {
          price: priceId,
          quantity: body.quantity ?? 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      client_reference_id: user.id,
      customer: customerId ?? undefined,
      customer_email: body.customerEmail ?? user.email ?? undefined,
      metadata: {
        supabase_user_id: user.id,
        ...body.metadata,
      },
    });

    if (customerId && supabaseAdmin) {
      await supabaseAdmin
        .from("profiles")
        .update({ stripe_customer_id: customerId })
        .eq("id", user.id);
    }

    return jsonResponse({
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    console.error("stripe-checkout error", error);
    const message =
      error instanceof Error ? error.message : "Unexpected server error";
    return jsonResponse({ error: message }, { status: 500 });
  }
});
