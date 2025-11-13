import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { isSupabaseConfigured, supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PostgrestError } from "@supabase/supabase-js";

export type SubscriptionTier = "basic" | "standard" | "pro";

type UsageAction = "connection" | "event";

type UpgradeHighlightTier = Extract<SubscriptionTier, "standard" | "pro">;

type UpgradePrompt = {
  message: string;
  title?: string;
  highlightTier?: UpgradeHighlightTier;
};

type SubscriptionContextValue = {
  userId: string | null;
  fullName: string | null;
  email: string | null;
  tier: SubscriptionTier;
  monthlyConnections: number;
  monthlyEventJoins: number;
  subscriptionExpires: Date | null;
  isLoading: boolean;
  attemptConnection: () => Promise<boolean>;
  attemptEventJoin: () => Promise<boolean>;
  refresh: () => Promise<void>;
  openUpgrade: (prompt: UpgradePrompt) => void;
  requireProFeature: () => boolean;
};

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(
  undefined,
);

const limitByTier: Record<SubscriptionTier, { connection: number; event: number }> = {
  basic: { connection: 1, event: 1 },
  standard: { connection: 10, event: Number.POSITIVE_INFINITY },
  pro: { connection: Number.POSITIVE_INFINITY, event: Number.POSITIVE_INFINITY },
};

const defaultProfileState = {
  tier: "basic" as SubscriptionTier,
  monthlyConnections: 0,
  monthlyEventJoins: 0,
  subscriptionExpires: null as Date | null,
  fullName: null as string | null,
  email: null as string | null,
};

type ProfileUsage = Pick<
  Tables<"profiles">,
  |
    "subscription_tier"
    | "monthly_connections"
    | "monthly_event_joins"
    | "subscription_expires"
    | "full_name"
    | "email"
>;

const normalizeProfileUsage = (profile?: ProfileUsage | null) => ({
  tier: (profile?.subscription_tier ?? "basic") as SubscriptionTier,
  monthlyConnections: profile?.monthly_connections ?? 0,
  monthlyEventJoins: profile?.monthly_event_joins ?? 0,
  subscriptionExpires: profile?.subscription_expires
    ? new Date(profile.subscription_expires)
    : null,
  fullName: profile?.full_name ?? null,
  email: profile?.email ?? null,
});

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [state, setState] = useState({
    ...defaultProfileState,
    isLoading: true,
  });
  const [upgradePrompt, setUpgradePrompt] = useState<UpgradePrompt | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const resetProfileState = useCallback(() => {
    if (!isMountedRef.current) return;
    setState({ ...defaultProfileState, isLoading: false });
  }, []);

  const handleSignedOut = useCallback(() => {
    setUserId(null);
    resetProfileState();
  }, [resetProfileState]);

  const handleProfileLoaded = useCallback(
    (profile: ProfileUsage | null | undefined) => {
      if (!isMountedRef.current) return;
      setState({
        ...normalizeProfileUsage(profile ?? undefined),
        isLoading: false,
      });
    },
    [],
  );

  const isAuthorizationError = useCallback((error: PostgrestError) => {
    const code = error.code;
    const normalized = `${error.message ?? ""} ${error.details ?? ""}`.toLowerCase();
    return (
      code === "PGRST301" ||
      code === "PGRST302" ||
      code === "42501" ||
      normalized.includes("jwt") ||
      normalized.includes("auth") ||
      normalized.includes("permission") ||
      normalized.includes("authorized")
    );
  }, []);

  const fetchProfile = useCallback(async () => {
    if (!isSupabaseConfigured) {
      resetProfileState();
      return;
    }

    setState((previous) => ({ ...previous, isLoading: true }));

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (!isMountedRef.current) return;

      if (sessionError || !session?.user) {
        handleSignedOut();
        return;
      }

      setUserId(session.user.id);

      const loadProfile = async (id: string) => {
        try {
          const { data: profile, error } = await supabase
            .from("profiles")
            .select(
              "subscription_tier, monthly_connections, monthly_event_joins, subscription_expires, full_name, email",
            )
            .eq("id", id)
            .maybeSingle();

          if (!isMountedRef.current) return;

          if (error) {
            if (isAuthorizationError(error)) {
              console.warn("subscription:profile-unauthorized", error);
              handleSignedOut();
              return;
            }

            console.error("subscription:profile", error);
            resetProfileState();
            return;
          }

          if (!profile) {
            try {
              const { data: inserted, error: insertError } = await supabase
                .from("profiles")
                .insert([{ id }])
                .select(
                  "subscription_tier, monthly_connections, monthly_event_joins, subscription_expires, full_name, email",
                )
                .maybeSingle();

              if (!isMountedRef.current) return;

              if (insertError) {
                if (isAuthorizationError(insertError)) {
                  console.warn("subscription:create-profile-unauthorized", insertError);
                  handleSignedOut();
                  return;
                }

                console.error("subscription:create-profile", insertError);
                toast({
                  title: "Unable to prepare profile",
                  description:
                    "We couldn't create your profile record. Please contact support if this continues.",
                  variant: "destructive",
                });
                resetProfileState();
                return;
              }

              handleProfileLoaded(inserted);
              return;
            } catch (insertException) {
              console.error("subscription:create-profile-exception", insertException);
              toast({
                title: "Unable to prepare profile",
                description:
                  "We couldn't create your profile record. Please contact support if this continues.",
                variant: "destructive",
              });
              resetProfileState();
              return;
            }
          }

          handleProfileLoaded(profile);
        } catch (profileException) {
          console.error("subscription:profile-exception", profileException);
          resetProfileState();
        }
      };

      await loadProfile(session.user.id);
    } catch (sessionException) {
      console.error("subscription:session", sessionException);
      if (!isMountedRef.current) return;
      resetProfileState();
    }
  }, [
    handleProfileLoaded,
    handleSignedOut,
    isAuthorizationError,
    isSupabaseConfigured,
    resetProfileState,
    toast,
  ]);

  useEffect(() => {
    fetchProfile();

    if (!isSupabaseConfigured) {
      return undefined;
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (!isMountedRef.current) return;

      if (session?.user) {
        setUserId(session.user.id);
        fetchProfile();
      } else {
        handleSignedOut();
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [fetchProfile, handleSignedOut, isSupabaseConfigured, resetProfileState]);

  const openUpgrade = useCallback((prompt: UpgradePrompt) => {
    setUpgradePrompt(prompt);
  }, []);

  const closeUpgrade = useCallback(() => {
    setUpgradePrompt(null);
  }, []);

  const recordUsage = useCallback(
    async (action: UsageAction) => {
      if (!isSupabaseConfigured) {
        toast({
          title: "Live usage tracking unavailable",
          description:
            "Connective is running in preview mode. Usage limits will reset when backend setup is complete.",
        });
        return true;
      }

      if (!userId) {
        toast({
          title: "Please sign in",
          description: "Create an account or sign in to continue.",
          variant: "destructive",
        });
        return false;
      }

      const tier = state.tier;
      const limits = limitByTier[tier];
      const usage =
        action === "connection" ? state.monthlyConnections : state.monthlyEventJoins;
      const limit = action === "connection" ? limits.connection : limits.event;

      if (Number.isFinite(limit) && usage >= limit) {
        if (tier === "basic" && action === "connection") {
          openUpgrade({
            message: "Connect more friends with a paid plan",
            highlightTier: "standard",
          });
        } else if (tier === "standard" && action === "connection") {
          openUpgrade({
            message: "Upgrade to Premium for unlimited connections",
            highlightTier: "pro",
          });
        } else if (tier === "basic" && action === "event") {
          openUpgrade({
            message: "Join or host more events with a paid plan",
            highlightTier: "standard",
          });
        } else {
          openUpgrade({
            message: "Upgrade to keep your momentum going",
            highlightTier: "pro",
          });
        }
        return false;
      }

      const column =
        action === "connection" ? "monthly_connections" : "monthly_event_joins";
      const currentCount = usage ?? 0;

      const { data, error } = await supabase
        .from("profiles")
        .update({
          [column]: currentCount + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select(
          "subscription_tier, monthly_connections, monthly_event_joins, subscription_expires, full_name, email",
        )
        .maybeSingle();

      if (error) {
        console.error("subscription:update-usage", error);
        toast({
          title: "Unable to update usage",
          description: "Something went wrong while saving your progress.",
          variant: "destructive",
        });
        return false;
      }

      setState((previous) => ({
        ...previous,
        ...normalizeProfileUsage(data ?? undefined),
      }));

      return true;
    },
    [isSupabaseConfigured, openUpgrade, state, toast, userId],
  );

  const attemptConnection = useCallback(
    () => recordUsage("connection"),
    [recordUsage],
  );

  const attemptEventJoin = useCallback(() => recordUsage("event"), [recordUsage]);

  const requireProFeature = useCallback(() => {
    if (state.tier !== "pro") {
      openUpgrade({
        message: "This feature is only available to Premium users",
        highlightTier: "pro",
      });
      return false;
    }

    return true;
  }, [openUpgrade, state.tier]);

  const handleUpgradeNavigate = useCallback(() => {
    closeUpgrade();
    navigate("/profile?billing=plans");
  }, [closeUpgrade, navigate]);

  const contextValue = useMemo<SubscriptionContextValue>(
    () => ({
      userId,
      fullName: state.fullName,
      email: state.email,
      tier: state.tier,
      monthlyConnections: state.monthlyConnections,
      monthlyEventJoins: state.monthlyEventJoins,
      subscriptionExpires: state.subscriptionExpires,
      isLoading: state.isLoading,
      attemptConnection,
      attemptEventJoin,
      refresh: fetchProfile,
      openUpgrade,
      requireProFeature,
    }),
    [
      attemptConnection,
      attemptEventJoin,
      fetchProfile,
      openUpgrade,
      requireProFeature,
      userId,
      state.fullName,
      state.email,
      state.monthlyConnections,
      state.monthlyEventJoins,
      state.subscriptionExpires,
      state.tier,
      state.isLoading,
    ],
  );

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
      <SubscriptionUpgradeDialog
        prompt={upgradePrompt}
        onClose={closeUpgrade}
        onUpgrade={handleUpgradeNavigate}
      />
    </SubscriptionContext.Provider>
  );
};

type UpgradeDialogProps = {
  prompt: UpgradePrompt | null;
  onClose: () => void;
  onUpgrade: () => void;
};

const SubscriptionUpgradeDialog = ({
  prompt,
  onClose,
  onUpgrade,
}: UpgradeDialogProps) => {
  const open = Boolean(prompt);
  const title = prompt?.title ?? "Upgrade to keep the momentum going";
  const message =
    prompt?.message ??
    "Unlock richer connection features and more flexibility with our paid plans.";

  const highlight = prompt?.highlightTier;

  const highlightCopy = highlight === "pro"
    ? {
        heading: "Pro unlocks full access",
        description:
          "Unlimited connections, AI-powered suggestions, priority visibility, and advanced analytics across the app.",
      }
    : {
        heading: "Standard scales your reach",
        description:
          "Connect up to 10 new friends every month and join unlimited events with concierge support when you need it.",
      };

  return (
    <Dialog open={open} onOpenChange={(value) => (value ? undefined : onClose())}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm text-muted-foreground">
          {highlight && (
            <div className="rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4 text-left">
              <p className="text-sm font-semibold text-primary">{highlightCopy.heading}</p>
              <p className="mt-1 text-xs text-primary/80">{highlightCopy.description}</p>
            </div>
          )}
          <p>
            Basic members can make one new friend connection and join one event per month. Standard
            raises the cap to 10 monthly introductions with unlimited events, while Pro removes all
            limits and unlocks premium-only experiences.
          </p>
        </div>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
            Maybe later
          </Button>
          <Button onClick={onUpgrade} className="w-full sm:w-auto">
            View plans
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }

  return context;
};

