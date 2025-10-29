import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
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
import { useSubscription, type SubscriptionTier } from "@/hooks/useSubscription";
import { usePageTitle } from "@/hooks/usePageTitle";
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
type PlanKey = "basic" | "standard" | "pro";

type PlanFeature = {
  icon: ReactNode;
  label: string;
};

const PLAN_LIMITS: Record<SubscriptionTier, { connections: number; events: number }> = {
  basic: { connections: 1, events: 1 },
  standard: { connections: 10, events: Number.POSITIVE_INFINITY },
  pro: { connections: Number.POSITIVE_INFINITY, events: Number.POSITIVE_INFINITY },
};

const PLAN_NAMES: Record<PlanKey, string> = {
  basic: "Basic (Free)",
  standard: "Standard",
  pro: "Pro (Premium)",
};

const PLAN_FEATURES: Record<PlanKey, PlanFeature[]> = {
  basic: [
    { icon: <Users className="h-4 w-4 text-emerald-500" />, label: "1 new friend connection every month" },
    { icon: <Calendar className="h-4 w-4 text-emerald-500" />, label: "Join 1 curated community event" },
  ],
  standard: [
    { icon: <Users className="h-4 w-4 text-amber-500" />, label: "Up to 10 new friend connections monthly" },
    { icon: <Calendar className="h-4 w-4 text-amber-500" />, label: "Unlimited event hosting & joining" },
    { icon: <ShieldCheck className="h-4 w-4 text-amber-500" />, label: "Priority support & trust verification" },
  ],
  pro: [
    { icon: <Sparkles className="h-4 w-4 text-sky-500" />, label: "Unlimited connections, events, and invites" },
    { icon: <Zap className="h-4 w-4 text-sky-500" />, label: "AI suggestions, analytics, and priority visibility" },
    { icon: <ShieldCheck className="h-4 w-4 text-sky-500" />, label: "Concierge hosting support & premium drops" },
  ],
};

const PLAN_PRICING = {
  standard: {
    monthly: { label: "$15 / month", priceId: STRIPE_PRICE_IDS.standardMonthly },
    yearly: { label: "$150 / year", priceId: STRIPE_PRICE_IDS.standardYearly, helper: "Two months free" },
  },
  pro: {
    monthly: { label: "$30 / month", priceId: STRIPE_PRICE_IDS.proMonthly },
    yearly: { label: "$300 / year", priceId: STRIPE_PRICE_IDS.proYearly, helper: "Save 17% annually" },
  },
};

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  usePageTitle("Your Profile");
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

  const formattedExpiration = useMemo(
    () => (subscriptionExpires ? formatDate(subscriptionExpires) : null),
    [subscriptionExpires]
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

  const showConnectionUpgradePrompt = useCallback(() => {
    const highlightTier = tier === "standard" ? "pro" : "standard";
    const message =
      tier === "standard"
        ? "Upgrade to Premium for unlimited connections"
        : "Connect more friends with a paid plan";

    openUpgrade({ message, highlightTier });
  }, [openUpgrade, tier]);

  const showEventUpgradePrompt = useCallback(() => {
    openUpgrade({ message: "Join or host more events with a paid plan", highlightTier: "standard" });
  }, [openUpgrade]);

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
        showConnectionUpgradePrompt();
        break;
      default:
        break;
    }
    navigate("/profile", { replace: true });
  }, [location.search, navigate, showConnectionUpgradePrompt, toast]);

  const handleCheckout = async (targetTier: "standard" | "pro") => {
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

        {/* Membership Summary */}
        <Card className="border-border/60 shadow-lg">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl font-semibold">Your membership</CardTitle>
              <CardDescription className="text-base">
                Stay on top of your connection limits, event access, and billing preferences in one place.
              </CardDescription>
              <div className="flex flex-wrap items-center gap-3">
                <Badge className={`${badge.className} flex items-center gap-2`}>
                  {badge.icon} {badge.label}
                </Badge>
                {formattedExpiration && (
                  <span className="text-sm text-muted-foreground">
                    Renews on {formattedExpiration}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              {tier !== "basic" ? (
                <Button
                  onClick={handleManageSubscription}
                  disabled={isPortalLoading}
                  variant="outline"
                >
                  {isPortalLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Manage subscription
                </Button>
              ) : (
                <Button
                  onClick={() => handleCheckout("standard")}
                  disabled={isCheckoutLoading}
                >
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
                <p className="font-medium">Friend connections</p>
              </div>
              <p className="text-2xl font-semibold">
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
                  <Button
                    variant="link"
                    className="px-0 text-sm"
                    onClick={showConnectionUpgradePrompt}
                  >
                    See upgrade options
                  </Button>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/20 p-5">
              <div className="mb-3 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <p className="font-medium">Events this month</p>
              </div>
              <p className="text-2xl font-semibold">
                {Number.isFinite(eventLimit)
                  ? `${monthlyEventJoins} / ${eventLimit}`
                  : `Unlimited`}
              </p>
              <p className="text-sm text-muted-foreground">
                {usageHelper(eventLimit, monthlyEventJoins)}
              </p>
              {Number.isFinite(eventLimit) && (
                <div className="mt-4 space-y-2">
                  <Progress value={eventProgress} />
                  <Button
                    variant="link"
                    className="px-0 text-sm"
                    onClick={showEventUpgradePrompt}
                  >
                    Unlock more events
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Pricing Tiers */}
        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>Choose your plan</CardTitle>
              <CardDescription>Toggle monthly or annual billing anytime.</CardDescription>
            </div>
            <div className="inline-flex rounded-full border border-border/60 p-1 text-sm">
              {(["monthly", "yearly"] as BillingCadence[]).map((cadence) => (
                <Button
                  key={cadence}
                  variant={billingCadence === cadence ? "default" : "ghost"}
                  className={`rounded-full px-4 py-1 ${
                    billingCadence === cadence
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground"
                  }`}
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
              const pricing = planKey === "basic" ? null : PLAN_PRICING[planKey][billingCadence];
              const helper = pricing?.helper;

              return (
                <div
                  key={planKey}
                  className={`flex flex-col rounded-2xl border border-border/60 bg-card/80 p-6 shadow-sm ${
                    planKey === "pro"
                      ? "ring-2 ring-sky-500/40"
                      : planKey === "standard"
                      ? "ring-1 ring-amber-400/40"
                      : ""
                  }`}
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      {PLAN_NAMES[planKey]}
                    </p>
                    {planKey === "standard" && (
                      <Badge
                        variant="outline"
                        className="border-amber-400/60 bg-amber-500/10 text-amber-600"
                      >
                        Most popular
                      </Badge>
                    )}
                    {planKey === "pro" && (
                      <Badge
                        variant="outline"
                        className="border-sky-400/60 bg-sky-500/10 text-sky-600"
                      >
                        Unlimited access
                      </Badge>
                    )}
                  </div>

                  <div className="mb-6 space-y-1">
                    <p className="text-2xl font-semibold">
                      {pricing?.label ?? "$0 / month"}
                    </p>
                    {helper && <p className="text-sm text-primary">{helper}</p>}
                    {planKey === "basic" && (
                      <p className="text-sm text-muted-foreground">
                        Perfect for exploring Connective at your own pace.
                      </p>
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
                    {planKey === "basic" ? (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={showConnectionUpgradePrompt}
                      >
                        Explore paid plans
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        disabled={isCurrentPlan || isCheckoutLoading}
                        onClick={() => handleCheckout(planKey)}
                      >
                        {isCurrentPlan
                          ? "Current plan"
                          : `Upgrade to ${PLAN_NAMES[planKey]}`}
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Tips Section */}
        <Card className="border-border/60 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Zap className="h-5 w-5" />
              Tips to make the most of your plan
            </CardTitle>
            <CardDescription>
              Track your monthly usage and get personalized recommendations for when to level up.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-primary/10 bg-background/80 p-4">
              <p className="font-medium">Need more connections?</p>
              <p className="text-sm text-muted-foreground">
                Connections reset on the 1st of each month. Upgrade when you consistently max out your quota.
              </p>
              <Button
                variant="link"
                className="px-0 text-sm"
                onClick={showConnectionUpgradePrompt}
              >
                Plan comparison
              </Button>
            </div>
            <div className="rounded-xl border border-primary/10 bg-background/80 p-4">
              <p className="font-medium">Hosting regularly?</p>
              <p className="text-sm text-muted-foreground">
                Pro members unlock concierge help, analytics, and guaranteed placement in featured events.
              </p>
              <Button
                variant="link"
                className="px-0 text-sm"
                onClick={() => handleCheckout("pro")}
                disabled={tier === "pro" || isCheckoutLoading}
              >
                {tier === "pro" ? "Already Pro" : "Try Pro"}
              </Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

