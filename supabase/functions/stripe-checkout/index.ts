import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.3";
import Stripe from "https://esm.sh/stripe@16.6.0?target=deno";
import { z } from "https://esm.sh/zod@3.25.76";

const CheckoutRequestSchema = z.object({
  priceId: z.string().optional(),
  quantity: z.number().int().min(1).optional().default(1),
  mode: z.enum(["payment", "subscription"]).optional().default("subscription"),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
  metadata: z.record(z.string()).optional(),
  customerId: z.string().optional(),
  customerEmail: z.string().email().optional(),
  returnUrl: z.string().url().optional(),
  action: z.enum(["checkout", "billing_portal"]).optional().default("checkout"),
}).refine(data => {
    if (data.action === 'checkout') {
      return !!data.successUrl && !!data.cancelUrl;
    }
    return true;
}, {
    message: "successUrl and cancelUrl are required for checkout action",
    path: ["successUrl", "cancelUrl"],
});

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

    const body = await req.json();
    const validation = CheckoutRequestSchema.safeParse(body);

    if (!validation.success) {
      return jsonResponse(
        {
          error: "Invalid request body",
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { action, ...checkoutData } = validation.data;

    const stripe = new Stripe(stripeSecret, {
      apiVersion: "2024-10-28",
    });

    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const supabaseAdmin = supabaseServiceKey
      ? createClient(supabaseUrl, supabaseServiceKey)
      : null;

    const ensureCustomer = async (): Promise<string | null> => {
      if (checkoutData.customerId) {
        return checkoutData.customerId;
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

      const email = checkoutData.customerEmail ?? user.email ?? undefined;
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
          email: checkoutData.customerEmail ?? user.email ?? undefined,
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
      const returnUrl = checkoutData.returnUrl ?? req.headers.get("Origin") ?? "";
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

    const priceId = checkoutData.priceId ?? Deno.env.get("STRIPE_DEFAULT_PRICE_ID");
    if (!priceId) {
      return jsonResponse(
        { error: "Stripe price identifier is required" },
        { status: 400 },
      );
    }

    const { successUrl, cancelUrl } = checkoutData;

    const customerId = await ensureCustomer();

    const session = await stripe.checkout.sessions.create({
      mode: checkoutData.mode,
      line_items: [
        {
          price: priceId,
          quantity: checkoutData.quantity,
        },
      ],
      success_url: successUrl!,
      cancel_url: cancelUrl!,
      allow_promotion_codes: true,
      client_reference_id: user.id,
      customer: customerId ?? undefined,
      customer_email: checkoutData.customerEmail ?? user.email ?? undefined,
      metadata: {
        supabase_user_id: user.id,
        ...checkoutData.metadata,
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
