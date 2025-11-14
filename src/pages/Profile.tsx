import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
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
import { useTheme } from "@/components/ThemeProvider";
import {
  createStripeBillingPortalSession,
  createStripeCheckoutSession,
  getStripe,
  getBadgeForTier,
  hasStripeConfig,
  STRIPE_PRICE_IDS,
} from "@/integrations/stripe";
import {
  Bell,
  Calendar,
  Loader2,
  Lock,
  MapPin,
  Palette,
  ShieldCheck,
  Sparkles,
  Moon,
  Sun,
  Users,
  Zap,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

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

const PLAN_PRICING: Record<Exclude<PlanKey, "basic">, Record<BillingCadence, { label: string; priceId: string; helper?: string }>> = {
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

const PROFILE_FOCUS_OPTIONS = [
  "Wellness salons",
  "Tech meetups",
  "Creative collabs",
  "Volunteering",
  "Professional mixers",
] as const;

const NOTIFICATION_OPTIONS = [
  {
    key: "communityDigest" as const,
    label: "Community digest",
    description: "A curated summary of new people, hosts, and happenings every Monday.",
  },
  {
    key: "eventReminders" as const,
    label: "Event reminders",
    description: "Smart reminders for RSVPs, travel time, and last-minute host updates.",
  },
  {
    key: "hostTips" as const,
    label: "Host coaching",
    description: "Playbooks and prompts to help you deliver unforgettable gatherings.",
  },
  {
    key: "securityAlerts" as const,
    label: "Security alerts",
    description: "Be the first to know if something looks unusual about your account.",
  },
];

const ACCENT_COLORS = [
  { value: "emerald", label: "Emerald", swatch: "bg-emerald-500" },
  { value: "sky", label: "Sky", swatch: "bg-sky-500" },
  { value: "violet", label: "Violet", swatch: "bg-violet-500" },
  { value: "amber", label: "Amber", swatch: "bg-amber-500" },
  { value: "rose", label: "Rose", swatch: "bg-rose-500" },
] as const;

type NotificationKey = (typeof NOTIFICATION_OPTIONS)[number]["key"];
type AccentColor = (typeof ACCENT_COLORS)[number]["value"];

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  usePageTitle("Your Profile");
  const { theme, setTheme } = useTheme();
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
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isPreferencesSaving, setIsPreferencesSaving] = useState(false);
  const [isNotificationsSaving, setIsNotificationsSaving] = useState(false);
  const [isSecuritySaving, setIsSecuritySaving] = useState(false);

  const [profileForm, setProfileForm] = useState({
    fullName: "Avery Johnson",
    headline: "Designing gatherings that spark lasting friendships",
    location: "Austin, Texas",
    website: "avery.community",
    bio: "Community architect, supper club host, and adventure seeker. I curate intimate gatherings that help ambitious people feel at home in new cities.",
  });
  const [focusAreas, setFocusAreas] = useState<string[]>([PROFILE_FOCUS_OPTIONS[0], PROFILE_FOCUS_OPTIONS[2]]);
  const [accentColor, setAccentColor] = useState<AccentColor>("emerald");
  const [notificationPrefs, setNotificationPrefs] = useState<Record<NotificationKey, boolean>>({
    communityDigest: true,
    eventReminders: true,
    hostTips: false,
    securityAlerts: true,
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const formattedExpiration = useMemo(
    () => (subscriptionExpires ? formatDate(subscriptionExpires) : null),
    [subscriptionExpires]
  );
  const joinedDate = useMemo(() => formatDate(new Date("2023-04-19")), []);

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

  const handleProfileChange = useCallback(
    (field: keyof typeof profileForm) =>
      (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value;
        setProfileForm((prev) => ({ ...prev, [field]: value }));
      },
    []
  );

  const toggleFocusArea = useCallback((area: string) => {
    setFocusAreas((previous) =>
      previous.includes(area)
        ? previous.filter((item) => item !== area)
        : [...previous, area]
    );
  }, []);

  const handleProfileSave = useCallback(() => {
    if (isProfileSaving) return;
    setIsProfileSaving(true);
    setTimeout(() => {
      setIsProfileSaving(false);
      toast({
        title: "Profile updated",
        description: "Your public details are now up to date.",
      });
    }, 700);
  }, [isProfileSaving, toast]);

  const handlePreferencesSave = useCallback(() => {
    if (isPreferencesSaving) return;
    setIsPreferencesSaving(true);
    setTimeout(() => {
      setIsPreferencesSaving(false);
      toast({
        title: "Preferences saved",
        description: "Theme, accent color, and accessibility settings updated.",
      });
    }, 600);
  }, [isPreferencesSaving, toast]);

  const handleNotificationsSave = useCallback(() => {
    if (isNotificationsSaving) return;
    setIsNotificationsSaving(true);
    setTimeout(() => {
      setIsNotificationsSaving(false);
      toast({
        title: "Notifications updated",
        description: "We'll tailor alerts to match your preferences.",
      });
    }, 600);
  }, [isNotificationsSaving, toast]);

  const handleSecurityChange = useCallback(
    (field: keyof typeof securityForm) =>
      (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSecurityForm((prev) => ({ ...prev, [field]: value }));
      },
    []
  );

  const handleSecuritySave = useCallback(() => {
    if (isSecuritySaving) return;
    if (!securityForm.currentPassword || !securityForm.newPassword) {
      toast({
        title: "Add your password",
        description: "Enter both your current and new password to continue.",
        variant: "destructive",
      });
      return;
    }

    if (securityForm.newPassword.length < 8) {
      toast({
        title: "Password too short",
        description: "Use at least 8 characters for your new password.",
        variant: "destructive",
      });
      return;
    }

    if (securityForm.newPassword !== securityForm.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Double-check the confirmation field and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSecuritySaving(true);
    setTimeout(() => {
      setIsSecuritySaving(false);
      setSecurityForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      toast({
        title: "Security updated",
        description: twoFactorEnabled
          ? "Two-factor authentication stays active on your account."
          : "Consider enabling two-factor authentication to keep things extra secure.",
      });
    }, 800);
  }, [isSecuritySaving, securityForm, toast, twoFactorEnabled]);

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
      default:
        break;
    }
    navigate("/profile", { replace: true });
  }, [location.search, navigate, toast]);

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
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background pb-20">
      <div className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6 lg:px-8">
        <BackButton fallbackPath="/home" className="border border-border/60 bg-background/90 shadow-sm" />

        <section className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-primary/10 via-background to-background p-6 shadow-xl sm:p-10">
          <div className="absolute inset-0 -z-10 opacity-60">
            <div className="h-full w-full bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.25),transparent_55%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.35),transparent_55%)]" />
          </div>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-6">
              <Avatar className="h-20 w-20 border-4 border-background shadow-lg">
                <AvatarImage src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=256&q=80" alt={profileForm.fullName} />
                <AvatarFallback>{profileForm.fullName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">Profile</p>
                  <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{profileForm.fullName}</h1>
                </div>
                <p className="max-w-xl text-base text-muted-foreground">{profileForm.headline}</p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {profileForm.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <Sun className="h-4 w-4" />
                    Active since {joinedDate}
                  </span>
                  <span className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Accent: {accentColor}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {focusAreas.length ? (
                    focusAreas.map((area) => (
                      <Badge
                        key={area}
                        className="rounded-full bg-background/80 text-sm shadow-sm text-black dark:text-amber-300"
                      >
                        {area}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">Select focus areas below to highlight your expertise.</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button variant="outline" className="border-border/50 bg-background/80">
                View public profile
              </Button>
              <Button className="bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/20">
                Share profile
              </Button>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="border-border/60 shadow-lg">
              <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Profile information</CardTitle>
                  <CardDescription>Craft a compelling presence that reflects your personality.</CardDescription>
                </div>
                <Button onClick={handleProfileSave} disabled={isProfileSaving}>
                  {isProfileSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save updates
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full name</Label>
                    <Input id="fullName" value={profileForm.fullName} onChange={handleProfileChange("fullName")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="headline">Headline</Label>
                    <Input
                      id="headline"
                      value={profileForm.headline}
                      onChange={handleProfileChange("headline")}
                      placeholder="What should people know about you?"
                    />
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileForm.location}
                      onChange={handleProfileChange("location")}
                      placeholder="City, Region"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website or link-in-bio</Label>
                    <Input
                      id="website"
                      value={profileForm.website}
                      onChange={handleProfileChange("website")}
                      placeholder="yourname.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">About you</Label>
                  <Textarea
                    id="bio"
                    value={profileForm.bio}
                    onChange={handleProfileChange("bio")}
                    rows={5}
                    className="resize-none"
                    placeholder="Share your hosting style, passions, and the kind of people you'd like to meet."
                  />
                </div>

                <div className="space-y-3">
                  <Label>Focus areas</Label>
                  <p className="text-sm text-muted-foreground">
                    Choose the themes that best represent the experiences you create.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {PROFILE_FOCUS_OPTIONS.map((option) => {
                      const isActive = focusAreas.includes(option);
                      return (
                        <Button
                          key={option}
                          type="button"
                          variant={isActive ? "default" : "outline"}
                          className={`rounded-full border-border/60 px-4 text-sm ${isActive ? "shadow-md" : "bg-background"}`}
                          onClick={() => toggleFocusArea(option)}
                        >
                          {option}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-lg">
              <CardHeader>
                <CardTitle>Hosting highlights</CardTitle>
                <CardDescription>Celebrate what makes your community experiences unique.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5 md:grid-cols-3">
                <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">Member satisfaction</p>
                  <p className="mt-2 text-3xl font-semibold">4.9 / 5</p>
                  <p className="mt-3 text-sm text-muted-foreground">Based on 120 event reflections this year.</p>
                </div>
                <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">Signature gathering</p>
                  <p className="mt-2 text-lg font-medium">Sunset storytelling salon</p>
                  <p className="mt-3 text-sm text-muted-foreground">A monthly rooftop circle blending dinner, acoustic music, and open mic moments.</p>
                </div>
                <div className="rounded-2xl border border-border/50 bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">Looking for</p>
                  <p className="mt-2 text-lg font-medium">Hosts-in-training</p>
                  <p className="mt-3 text-sm text-muted-foreground">Invite co-hosts to shadow you and scale intimate experiences.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-border/60 shadow-lg">
              <CardHeader className="space-y-3">
                <div className="flex items-center gap-3">
                  <Palette className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Theme & appearance</CardTitle>
                    <CardDescription>Tailor the interface to match your vibe.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Theme mode</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {(
                      [
                        { value: "light", label: "Light" },
                        { value: "dark", label: "Dark" },
                      ] as const
                    ).map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={theme === option.value ? "default" : "outline"}
                        className="flex items-center justify-center gap-2 border-border/60 py-6"
                        onClick={() => setTheme(option.value)}
                      >
                        {option.value === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Accent color</Label>
                  <div className="flex flex-wrap gap-3">
                    {ACCENT_COLORS.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition ${
                          accentColor === color.value
                            ? "border-primary shadow-md shadow-primary/30"
                            : "border-transparent"
                        }`}
                        onClick={() => setAccentColor(color.value)}
                        aria-label={`Select ${color.label}`}
                      >
                        <span className={`h-8 w-8 rounded-full ${color.swatch}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Accessibility</Label>
                  <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
                    <div>
                      <p className="font-medium">High contrast headlines</p>
                      <p className="text-sm text-muted-foreground">Improve legibility for dimly lit event spaces.</p>
                    </div>
                    <Switch
                      checked={accentColor === "amber"}
                      onCheckedChange={(checked) => setAccentColor(checked ? "amber" : accentColor === "amber" ? "emerald" : accentColor)}
                      aria-label="Toggle high contrast mode"
                    />
                  </div>
                </div>

                <Button className="w-full" onClick={handlePreferencesSave} disabled={isPreferencesSaving}>
                  {isPreferencesSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save appearance
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Fine-tune when you hear from Connective.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {NOTIFICATION_OPTIONS.map((option) => (
                  <div key={option.key} className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-medium">{option.label}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    <Switch
                      checked={notificationPrefs[option.key]}
                      onCheckedChange={(checked) =>
                        setNotificationPrefs((prev) => ({ ...prev, [option.key]: checked }))
                      }
                      aria-label={`Toggle ${option.label}`}
                    />
                  </div>
                ))}

                <Button className="w-full" onClick={handleNotificationsSave} disabled={isNotificationsSaving}>
                  {isNotificationsSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save preferences
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Account security</CardTitle>
                    <CardDescription>Keep your information safe and in your control.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current password</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={securityForm.currentPassword}
                    onChange={handleSecurityChange("currentPassword")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New password</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={securityForm.newPassword}
                    onChange={handleSecurityChange("newPassword")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm new password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={securityForm.confirmPassword}
                    onChange={handleSecurityChange("confirmPassword")}
                  />
                </div>

                <Separator className="my-2" />

                <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
                  <div>
                    <p className="font-medium">Two-factor authentication</p>
                    <p className="text-sm text-muted-foreground">Require a verification code on new devices.</p>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                    aria-label="Toggle two-factor authentication"
                  />
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <Button variant="outline" className="w-full sm:w-auto">
                    Manage trusted devices
                  </Button>
                  <Button className="w-full sm:w-auto" onClick={handleSecuritySave} disabled={isSecuritySaving}>
                    {isSecuritySaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Update password
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

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
        <Card className="border-border/60 shadow-lg">
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
              const helper = pricing?.helper ?? null;

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

