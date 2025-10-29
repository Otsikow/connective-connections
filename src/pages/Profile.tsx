import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import BackButton from "@/components/BackButton";
import { useSubscription } from "@/hooks/useSubscription";
import {
  createStripeBillingPortalSession,
  createStripeCheckoutSession,
  getStripe,
  getBadgeForTier,
  hasStripeConfig,
  STRIPE_PRICE_IDS,
} from "@/integrations/stripe";
import {
  Calendar,
  Loader2,
  ShieldCheck,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

type BillingCadence = "monthly" | "yearly";

type SubscriptionTier = "free" | "mid" | "premium";

type PlanKey = "free" | "mid" | "premium";

type PlanFeature = {
  icon: ReactNode;
  label: string;
};

const PLAN_LIMITS: Record<SubscriptionTier, { connections: number; events: number }> = {
  free: { connections: 1, events: 1 },
  mid: { connections: 10, events: Number.POSITIVE_INFINITY },
  premium: { connections: Number.POSITIVE_INFINITY, events: Number.POSITIVE_INFINITY },
};

const PLAN_NAMES: Record<PlanKey, string> = {
  free: "Free",
  mid: "Community Plus",
  premium: "Premium",
};

const PLAN_FEATURES: Record<PlanKey, PlanFeature[]> = {
  free: [
    { icon: <Users className="h-4 w-4 text-emerald-500" />, label: "1 new friend connection every month" },
    { icon: <Calendar className="h-4 w-4 text-emerald-500" />, label: "Join 1 curated community event" },
  ],
  mid: [
    { icon: <Users className="h-4 w-4 text-amber-500" />, label: "Up to 10 new friend connections monthly" },
    { icon: <Calendar className="h-4 w-4 text-amber-500" />, label: "Unlimited event hosting & joining" },
    { icon: <ShieldCheck className="h-4 w-4 text-amber-500" />, label: "Priority support & trust verification" },
  ],
  premium: [
    { icon: <Sparkles className="h-4 w-4 text-sky-500" />, label: "Unlimited connections and invitations" },
    { icon: <Calendar className="h-4 w-4 text-sky-500" />, label: "Concierge introductions to curated salons" },
    { icon: <ShieldCheck className="h-4 w-4 text-sky-500" />, label: "Host concierge & exclusive drops" },
  ],
};

const PLAN_PRICING = {
  mid: {
    monthly: { label: "$15 / month", priceId: STRIPE_PRICE_IDS.midMonthly },
    yearly: { label: "$150 / year", priceId: STRIPE_PRICE_IDS.midYearly, helper: "Two months free" },
  },
  premium: {
    monthly: { label: "$30 / month", priceId: STRIPE_PRICE_IDS.premiumMonthly },
    yearly: { label: "$300 / year", priceId: STRIPE_PRICE_IDS.premiumYearly, helper: "Save 17% annually" },
  },
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const {
    tier,
    monthlyConnections,
    monthlyEventJoins,
    subscriptionExpires,
    openUpgrade,
  } = useSubscription();

  const [billingCadence, setBillingCadence] = useState<BillingCadence>("monthly");
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const billingStatus = params.get("billing");

    if (!billingStatus) return;

    switch (billingStatus) {
      case "success":
        toast({
          title: "Payment successful",
          description: "Thanks for supporting Connective! Your plan is active.",
        });
        break;
      case "updated":
        toast({
          title: "Subscription updated",
          description: "Your billing preferences have been saved.",
        });
        break;
      case "cancel":
        toast({
          title: "Checkout canceled",
          description: "No charges were made. You can upgrade again anytime.",
          variant: "destructive",
        });
        break;
      case "plans":
        openUpgrade("connections");
        break;
      default:
        break;
    }

    navigate("/profile", { replace: true });
  }, [location.search, navigate, openUpgrade, toast]);

  const formattedExpiration = useMemo(
    () => (subscriptionExpires ? formatDate(subscriptionExpires) : null),
    [subscriptionExpires],
  );

  const badge = getBadgeForTier(tier);
  const connectionLimit = PLAN_LIMITS[tier].connections;
  const eventLimit = PLAN_LIMITS[tier].events;

  const connectionProgress = useMemo(() => {
    if (!Number.isFinite(connectionLimit)) return 0;
    return Math.min(100, Math.round((monthlyConnections / connectionLimit) * 100));
  }, [connectionLimit, monthlyConnections]);

  const eventProgress = useMemo(() => {
    if (!Number.isFinite(eventLimit)) return 0;
    return Math.min(100, Math.round((monthlyEventJoins / eventLimit) * 100));
  }, [eventLimit, monthlyEventJoins]);

  const usageHelper = (limit: number, usage: number) =>
    Number.isFinite(limit)
      ? `${usage} of ${limit} used this month`
      : `Unlimited — ${usage} used`;

  const handleCheckout = async (targetTier: "mid" | "premium") => {
    if (!hasStripeConfig()) {
      toast({
        title: "Stripe not configured",
        description: "Add your Stripe credentials to enable upgrades.",
        variant: "destructive",
      });
      return;
    }

    const pricing = PLAN_PRICING[targetTier][billingCadence];

    if (!pricing.priceId) {
      toast({
        title: "Missing price",
        description: "This plan is not configured in Stripe yet.",
        variant: "destructive",
      });
      return;
    }

    if (isCheckoutLoading) return;
    setIsCheckoutLoading(true);

    try {
      const { sessionId, url } = await createStripeCheckoutSession({
        priceId: pricing.priceId,
        metadata: { plan: targetTier, cadence: billingCadence },
      });
      const stripe = await getStripe();

      if (stripe && sessionId) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error && url) window.location.href = url;
        return;
      }

      if (url) window.location.href = url;
    } catch (error) {
      console.error("stripe-checkout", error);
      toast({
        title: "Unable to start checkout",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while contacting Stripe.",
        variant: "destructive",
      });
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!hasStripeConfig()) {
      toast({
        title: "Stripe not configured",
        description: "Connect Stripe to manage billing from your profile.",
        variant: "destructive",
      });
      return;
    }

    if (isPortalLoading) return;
    setIsPortalLoading(true);

    try {
      const { url } = await createStripeBillingPortalSession();
      window.location.href = url;
    } catch (error) {
      console.error("stripe-portal", error);
      toast({
        title: "Unable to open billing portal",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred while opening the portal.",
        variant: "destructive",
      });
    } finally {
      setIsPortalLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto max-w-5xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <BackButton
          fallbackPath="/home"
          size="icon"
          className="h-10 w-10 border border-border/60 bg-background shadow-sm"
        />

        <Card className="border-border/60 shadow-lg">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold">Your membership</CardTitle>
              <CardDescription className="text-base">
                Stay on top of your connection limits, event access, and billing preferences in one place.
              </CardDescription>
              <div className="flex flex-wrap items-center gap-3">
                <Badge className={`${badge.className} flex items-center gap-2`}>{badge.icon} {badge.label}</Badge>
                {formattedExpiration && (
                  <span className="text-sm text-muted-foreground">
                    Renews on {formattedExpiration}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {tier !== "free" ? (
                <Button
                  onClick={handleManageSubscription}
                  disabled={isPortalLoading}
                  variant="outline"
                  className="sm:w-auto"
                >
                  {isPortalLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Manage subscription
                </Button>
              ) : (
                <Button onClick={() => handleCheckout("mid")} disabled={isCheckoutLoading} className="sm:w-auto">
                  {isCheckoutLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Upgrade now
                </Button>
              )}
            </div>
          </CardHeader>

          <CardContent className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-border/60 bg-muted/20 p-5">
              <div className="mb-3 flex items-center gap-3">
                <Users className="h-5 w-5 text-primary" />
                <p className="font-medium text-foreground">Friend connections</p>
              </div>
              <p className="text-2xl font-semibold text-foreground">
                {Number.isFinite(connectionLimit)
                  ? `${monthlyConnections} / ${connectionLimit}`
                  : `Unlimited`}
              </p>
              <p className="text-sm text-muted-foreground">
                {usageHelper(connectionLimit, monthlyConnections)}
              </p>
              {Number.isFinite(connectionLimit) && (
                <div className="mt-4 space-y-2">
                  <Progress value={connectionProgress} />
                  <Button variant="link" className="px-0 text-sm" onClick={() => openUpgrade("connections")}>See upgrade options</Button>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/20 p-5">
              <div className="mb-3 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <p className="font-medium text-foreground">Events this month</p>
              </div>
              <p className="text-2xl font-semibold text-foreground">
                {Number.isFinite(eventLimit) ? `${monthlyEventJoins} / ${eventLimit}` : `Unlimited`}
              </p>
              <p className="text-sm text-muted-foreground">
                {usageHelper(eventLimit, monthlyEventJoins)}
              </p>
              {Number.isFinite(eventLimit) && (
                <div className="mt-4 space-y-2">
                  <Progress value={eventProgress} />
                  <Button variant="link" className="px-0 text-sm" onClick={() => openUpgrade("events")}>Unlock more events</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Choose the plan that matches your pace</CardTitle>
              <CardDescription>Toggle monthly or annual billing and switch plans anytime.</CardDescription>
            </div>
            <div className="inline-flex rounded-full border border-border/60 p-1 text-sm">
              {(["monthly", "yearly"] as BillingCadence[]).map((cadence) => (
                <Button
                  key={cadence}
                  type="button"
                  variant={billingCadence === cadence ? "default" : "ghost"}
                  className={`rounded-full px-4 py-1 text-sm ${billingCadence === cadence ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                  onClick={() => setBillingCadence(cadence)}
                >
                  {cadence === "monthly" ? "Monthly" : "Yearly"}
                </Button>
              ))}
            </div>
          </CardHeader>

          <CardContent className="grid gap-6 lg:grid-cols-3">
            {(Object.keys(PLAN_NAMES) as PlanKey[]).map((planKey) => {
              const isCurrentPlan = tier === planKey;
              const pricing = PLAN_PRICING[planKey as "mid" | "premium"]?.[billingCadence];
              const helper = pricing?.helper;

              return (
                <div
                  key={planKey}
                  className={`flex flex-col rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm ${
                    planKey === "premium" ? "ring-2 ring-sky-500/40" : planKey === "mid" ? "ring-1 ring-amber-400/40" : ""
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">{PLAN_NAMES[planKey]}</p>
                    {planKey === "mid" && (
                      <Badge variant="outline" className="border-amber-400/60 bg-amber-500/10 text-amber-600">
                        Most popular
                      </Badge>
                    )}
                    {planKey === "premium" && (
                      <Badge variant="outline" className="border-sky-400/60 bg-sky-500/10 text-sky-600">
                        Hosts love this
                      </Badge>
                    )}
                  </div>

                  <div className="mb-6 space-y-1">
                    <p className="text-2xl font-semibold text-foreground">
                      {pricing?.label ?? (planKey === "free" ? "$0 / month" : "Contact support")}
                    </p>
                    {helper && <p className="text-sm text-primary">{helper}</p>}
                    {planKey === "free" && (
                      <p className="text-sm text-muted-foreground">Perfect for exploring Connective.</p>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col gap-3 text-sm">
                    {PLAN_FEATURES[planKey].map((feature) => (
                      <div key={feature.label} className="flex items-center gap-2 text-muted-foreground">
                        {feature.icon}
                        <span>{feature.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    {planKey === "free" ? (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => openUpgrade("connections")}
                      >
                        Explore premium perks
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        disabled={isCurrentPlan || isCheckoutLoading}
                        onClick={() => handleCheckout(planKey as "mid" | "premium")}
                      >
                        {isCurrentPlan ? "Current plan" : `Upgrade to ${PLAN_NAMES[planKey]}`}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Zap className="h-5 w-5" />
              Tips to make the most of your plan
            </CardTitle>
            <CardDescription>
              Track your monthly usage and get personalized recommendations for when it makes sense to level up.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-primary/10 bg-background/80 p-4">
              <p className="font-medium text-foreground">Need more connections?</p>
              <p className="text-sm text-muted-foreground">
                Connections reset on the 1st of each month. Upgrade when you consistently max out your quota.
              </p>
              <Button
                variant="link"
                className="px-0 text-sm"
                onClick={() => openUpgrade("connections")}
              >
                Plan comparison
              </Button>
            </div>
            <div className="rounded-xl border border-primary/10 bg-background/80 p-4">
              <p className="font-medium text-foreground">Hosting regularly?</p>
              <p className="text-sm text-muted-foreground">
                Premium members unlock concierge help for salons and guaranteed placement in featured events.
              </p>
              <Button
                variant="link"
                className="px-0 text-sm"
                onClick={() => handleCheckout("premium")}
                disabled={tier === "premium" || isCheckoutLoading}
              >
                {tier === "premium" ? "Already premium" : "Try premium"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
