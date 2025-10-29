import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
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

type SubscriptionTier = Tables<"profiles">["subscription_tier"];

type UsageAction = "connection" | "event";
type UpgradeReason = "connections" | "events";

type SubscriptionContextValue = {
  tier: SubscriptionTier;
  monthlyConnections: number;
  monthlyEventJoins: number;
  subscriptionExpires: Date | null;
  isLoading: boolean;
  attemptConnection: () => Promise<boolean>;
  attemptEventJoin: () => Promise<boolean>;
  refresh: () => Promise<void>;
  openUpgrade: (reason: UpgradeReason) => void;
};

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(
  undefined,
);

const limitByTier: Record<SubscriptionTier, { connection: number; event: number }> = {
  free: { connection: 1, event: 1 },
  mid: { connection: 10, event: Number.POSITIVE_INFINITY },
  premium: { connection: Number.POSITIVE_INFINITY, event: Number.POSITIVE_INFINITY },
};

const defaultProfileState = {
  tier: "free" as SubscriptionTier,
  monthlyConnections: 0,
  monthlyEventJoins: 0,
  subscriptionExpires: null as Date | null,
};

type ProfileUsage = Pick<
  Tables<"profiles">,
  "subscription_tier" | "monthly_connections" | "monthly_event_joins" | "subscription_expires"
>;

const normalizeProfileUsage = (profile?: ProfileUsage | null) => ({
  tier: profile?.subscription_tier ?? "free",
  monthlyConnections: profile?.monthly_connections ?? 0,
  monthlyEventJoins: profile?.monthly_event_joins ?? 0,
  subscriptionExpires: profile?.subscription_expires
    ? new Date(profile.subscription_expires)
    : null,
});

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [state, setState] = useState({
    ...defaultProfileState,
    isLoading: true,
  });
  const [upgradeModal, setUpgradeModal] = useState<{
    open: boolean;
    reason: UpgradeReason | null;
  }>({ open: false, reason: null });

  const fetchProfile = useCallback(async () => {
    setState((previous) => ({ ...previous, isLoading: true }));

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setUserId(null);
      setState((previous) => ({
        ...previous,
        ...defaultProfileState,
        isLoading: false,
      }));
      return;
    }

    setUserId(user.id);

    const { data: profile, error } = await supabase
      .from("profiles")
      .select(
        "subscription_tier, monthly_connections, monthly_event_joins, subscription_expires",
      )
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      console.error("subscription:profile", error);
      toast({
        title: "Unable to load subscription",
        description:
          "We couldn't fetch your subscription details. Try refreshing the page.",
        variant: "destructive",
      });
      setState({ ...defaultProfileState, isLoading: false });
      return;
    }

    if (!profile) {
      const { data: inserted, error: insertError } = await supabase
        .from("profiles")
        .insert({ id: user.id })
        .select(
          "subscription_tier, monthly_connections, monthly_event_joins, subscription_expires",
        )
        .maybeSingle();

      if (insertError) {
        console.error("subscription:create-profile", insertError);
        toast({
          title: "Unable to prepare profile",
          description:
            "We couldn't create your profile record. Please contact support if this continues.",
          variant: "destructive",
        });
        setState({ ...defaultProfileState, isLoading: false });
        return;
      }

      setState({
        ...normalizeProfileUsage(inserted),
        isLoading: false,
      });
      return;
    }

    setState({
      ...normalizeProfileUsage(profile),
      isLoading: false,
    });
  }, [toast]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const openUpgrade = useCallback((reason: UpgradeReason) => {
    setUpgradeModal({ open: true, reason });
  }, []);

  const closeUpgrade = useCallback(() => {
    setUpgradeModal({ open: false, reason: null });
  }, []);

  const recordUsage = useCallback(
    async (action: UsageAction) => {
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
        openUpgrade(action === "connection" ? "connections" : "events");
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
          "subscription_tier, monthly_connections, monthly_event_joins, subscription_expires",
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
    [openUpgrade, state, toast, userId],
  );

  const attemptConnection = useCallback(
    () => recordUsage("connection"),
    [recordUsage],
  );

  const attemptEventJoin = useCallback(() => recordUsage("event"), [recordUsage]);

  const handleUpgradeNavigate = useCallback(() => {
    closeUpgrade();
    navigate("/profile?billing=plans");
  }, [closeUpgrade, navigate]);

  const contextValue = useMemo<SubscriptionContextValue>(
    () => ({
      tier: state.tier,
      monthlyConnections: state.monthlyConnections,
      monthlyEventJoins: state.monthlyEventJoins,
      subscriptionExpires: state.subscriptionExpires,
      isLoading: state.isLoading,
      attemptConnection,
      attemptEventJoin,
      refresh: fetchProfile,
      openUpgrade,
    }),
    [
      attemptConnection,
      attemptEventJoin,
      fetchProfile,
      openUpgrade,
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
        open={upgradeModal.open}
        reason={upgradeModal.reason}
        onClose={closeUpgrade}
        onUpgrade={handleUpgradeNavigate}
      />
    </SubscriptionContext.Provider>
  );
};

type UpgradeDialogProps = {
  open: boolean;
  reason: UpgradeReason | null;
  onClose: () => void;
  onUpgrade: () => void;
};

const SubscriptionUpgradeDialog = ({
  open,
  reason,
  onClose,
  onUpgrade,
}: UpgradeDialogProps) => {
  const message =
    reason === "events"
      ? "Join unlimited events and unlock premium-only gatherings with our paid plans."
      : "Make more meaningful connections every month with our paid plans.";

  return (
    <Dialog open={open} onOpenChange={(value) => (value ? undefined : onClose())}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Upgrade to keep the momentum going</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            Mid-tier members can connect up to 10 new friends each month and join unlimited
            events. Premium members get concierge introductions, unlimited connections, and
            exclusive salons.
          </p>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
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

