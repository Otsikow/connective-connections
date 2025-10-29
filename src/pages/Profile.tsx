import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import {
  Settings,
  MapPin,
  Calendar,
  Star,
  Users,
  Award,
  Shield,
  ShieldCheck,
  Bell,
  CreditCard,
  Crown,
  MessageCircle,
  Heart,
  Clock,
  CheckCircle,
  Plus,
  Sparkles,
  ChevronRight,
  Eye,
  Send,
  UserPlus,
  Bookmark,
  Loader2,
} from "lucide-react";
import BackButton from "@/components/BackButton";
import {
  createStripeBillingPortalSession,
  createStripeCheckoutSession,
  getStripe,
  hasStripeConfig,
  STRIPE_PREMIUM_PRICE_ID,
} from "@/integrations/stripe";

// ==== Type Definitions ====
type Friend = {
  id: number;
  name: string;
  avatar: string;
  lastSeen: string;
  mutualFriends: number;
  isFavorite: boolean;
  isCloseFriend?: boolean;
};

type EventCategory = "attending" | "past" | "hosted";

type EventItem = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  host: string;
  description: string;
  attendees: number;
  isSaved?: boolean;
};

type BadgeItem = {
  id: number;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  progress?: number;
};

type ProfileInfo = {
  name: string;
  location: string;
  joinedDate: string;
  trustScore: number;
  bio: string;
  interests: string[];
  isPremium: boolean;
};

type SettingsState = {
  privacy: {
    profileVisibility: "public" | "connections" | "private";
    showLocation: boolean;
    showInterests: boolean;
    showEvents: boolean;
  };
  notifications: {
    newMatches: boolean;
    eventReminders: boolean;
    messages: boolean;
    eventUpdates: boolean;
  };
};

// ==== Component ====
const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<
    "friends" | "events" | "badges" | "settings"
  >("friends");

  const [profile, setProfile] = useState<ProfileInfo>({
    name: "Jane Doe",
    location: "San Francisco, CA",
    joinedDate: "November 2025",
    trustScore: 85,
    bio: "Love exploring new coffee shops and hiking trails. Always up for a good book discussion or planning the next adventure. New to the city and excited to meet genuine people!",
    interests: ["Hiking", "Photography", "Coffee", "Reading", "Travel"],
    isPremium: false,
  });

  const [editProfileDraft, setEditProfileDraft] = useState<ProfileInfo>(profile);
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: 1,
      name: "Alex Chen",
      avatar: "/placeholder.svg",
      lastSeen: "2 hours ago",
      mutualFriends: 3,
      isFavorite: true,
      isCloseFriend: true,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      avatar: "/placeholder.svg",
      lastSeen: "1 day ago",
      mutualFriends: 5,
      isFavorite: false,
    },
    {
      id: 3,
      name: "Mike Rodriguez",
      avatar: "/placeholder.svg",
      lastSeen: "3 days ago",
      mutualFriends: 2,
      isFavorite: false,
    },
    {
      id: 4,
      name: "Emma Wilson",
      avatar: "/placeholder.svg",
      lastSeen: "1 week ago",
      mutualFriends: 4,
      isFavorite: true,
    },
  ]);

  const [events, setEvents] = useState<Record<EventCategory, EventItem[]>>({
    attending: [
      {
        id: 1,
        title: "Coffee & Coding Meetup",
        date: "Nov 2, 2025",
        time: "2:00 PM",
        location: "Blue Bottle Coffee",
        host: "Alex Chen",
        description:
          "Bring your laptop, grab a latte, and co-work with other builders and technologists in the city.",
        attendees: 18,
        isSaved: true,
      },
      {
        id: 2,
        title: "Weekend Hiking Adventure",
        date: "Nov 5, 2025",
        time: "8:00 AM",
        location: "Golden Gate Park",
        host: "Outdoor Collective",
        description:
          "A friendly morning hike with stops for photos and a picnic. All experience levels welcome.",
        attendees: 32,
      },
    ],
    past: [
      {
        id: 3,
        title: "Book Club Discussion",
        date: "Oct 20, 2025",
        time: "7:00 PM",
        location: "City Lights Bookstore",
        host: "Jane Doe",
        description:
          "Discussed 'Tomorrow, and Tomorrow, and Tomorrow' with fellow readers and planned next month's pick.",
        attendees: 14,
        isSaved: false,
      },
      {
        id: 4,
        title: "Photography Walk",
        date: "Oct 15, 2025",
        time: "10:00 AM",
        location: "SF MOMA",
        host: "Capture SF",
        description:
          "Explored hidden gems around SOMA with a group of photographers from beginner to pro.",
        attendees: 22,
      },
    ],
    hosted: [
      {
        id: 5,
        title: "Brunch & Connect",
        date: "Oct 28, 2025",
        time: "10:00 AM",
        location: "Jane's Loft",
        host: "Jane Doe",
        description:
          "Hosted an intimate brunch to introduce new friends and plan upcoming adventures together.",
        attendees: 8,
        isSaved: true,
      },
    ],
  });

  const [badges] = useState<BadgeItem[]>([
    { id: 1, name: "First Connection", description: "Made your first friend", icon: "🤝", earned: true },
    { id: 2, name: "Event Attendee", description: "Attended 5 events", icon: "🎉", earned: true },
    { id: 3, name: "Community Builder", description: "Hosted 3 events", icon: "🏗️", earned: true },
    { id: 4, name: "Trusted Member", description: "Achieved 80+ trust score", icon: "⭐", earned: true },
    { id: 5, name: "Social Butterfly", description: "Made 10 connections", icon: "🦋", earned: false, progress: 70 },
    { id: 6, name: "Event Master", description: "Attended 20 events", icon: "🎯", earned: false, progress: 40 },
  ]);

  const [settings, setSettings] = useState<SettingsState>({
    privacy: {
      profileVisibility: "public",
      showLocation: true,
      showInterests: true,
      showEvents: true,
    },
    notifications: {
      newMatches: true,
      eventReminders: true,
      messages: true,
      eventUpdates: false,
    },
  });

  // Stripe checkout + billing
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: "", email: "" });
  const [selectedEventCategory, setSelectedEventCategory] =
    useState<EventCategory>("attending");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const billingStatus = params.get("billing");

    if (!billingStatus) return;

    switch (billingStatus) {
      case "success":
      case "updated":
        setProfile((prev) => ({ ...prev, isPremium: true }));
        toast({
          title: billingStatus === "success" ? "Welcome to Premium!" : "Billing updated",
          description:
            billingStatus === "success"
              ? "Your payment was successful and premium access is unlocked."
              : "Your subscription details were updated successfully.",
        });
        break;
      case "cancel":
        toast({
          title: "Checkout canceled",
          description: "No charges were made. You can try upgrading again when ready.",
          variant: "destructive",
        });
        break;
      default:
        break;
    }

    navigate("/profile", { replace: true });
  }, [location.search, navigate, toast]);

  // Security settings
  const [isMfaEnabled, setIsMfaEnabled] = useState(false);
  const [loginAlertsEnabled, setLoginAlertsEnabled] = useState(false);

  useEffect(() => {
    if (isEditProfileOpen) {
      setEditProfileDraft(profile);
    }
  }, [isEditProfileOpen, profile]);

  const connectionSummary = useMemo(
    () => ({
      favorites: friends.filter((friend) => friend.isFavorite).length,
      closeFriends: friends.filter((friend) => friend.isCloseFriend).length,
      totalConnections: friends.length,
      savedEvents: Object.values(events)
        .flat()
        .filter((event) => event.isSaved).length,
    }),
    [events, friends],
  );

  const premiumCtaCopy = useMemo(() => {
    if (profile.isPremium) {
      return {
        title: "You're enjoying Premium",
        description:
          "Access concierge planning, deeper insights, and priority invites to flagship gatherings.",
      };
    }

    return {
      title: "Unlock premium community perks",
      description:
        "Boost discovery with weekly spotlights, advanced filters, and priority access to curated salons.",
    };
  }, [profile.isPremium]);

  const handleToggleFavorite = (friendId: number) => {
    setFriends((prev) =>
      prev.map((friend) =>
        friend.id === friendId
          ? { ...friend, isFavorite: !friend.isFavorite }
          : friend,
      ),
    );

    const updatedFriend = friends.find((friend) => friend.id === friendId);
    if (updatedFriend) {
      toast({
        title: updatedFriend.isFavorite
          ? "Removed from favorites"
          : "Added to favorites",
        description: `${updatedFriend.name} ${
          updatedFriend.isFavorite ? "won't" : "will"
        } appear in your quick connections feed.`,
      });
    }
  };

  const handleToggleCloseFriend = (friendId: number) => {
    setFriends((prev) =>
      prev.map((friend) =>
        friend.id === friendId
          ? { ...friend, isCloseFriend: !friend.isCloseFriend }
          : friend,
      ),
    );

    const updatedFriend = friends.find((friend) => friend.id === friendId);
    if (updatedFriend) {
      toast({
        title: updatedFriend.isCloseFriend
          ? "Close friend removed"
          : "Close friend added",
        description: `${updatedFriend.name} ${
          updatedFriend.isCloseFriend ? "won't" : "will"
        } receive your early invites.`,
      });
    }
  };

  const handleToggleSaveEvent = (category: EventCategory, eventId: number) => {
    setEvents((prev) => ({
      ...prev,
      [category]: prev[category].map((event) =>
        event.id === eventId ? { ...event, isSaved: !event.isSaved } : event,
      ),
    }));

    const updatedEvent = events[category].find((event) => event.id === eventId);
    if (updatedEvent) {
      toast({
        title: updatedEvent.isSaved ? "Event unsaved" : "Event saved",
        description: `${updatedEvent.title} ${
          updatedEvent.isSaved ? "removed from" : "added to"
        } your follow-up list.`,
      });
    }
  };

  const handlePrivacyToggle = (
    key: keyof SettingsState["privacy"],
    value: boolean,
  ) => {
    setSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }));

    toast({
      title: "Privacy preference updated",
      description: `${key.replace(/([A-Z])/g, " $1").toLowerCase()} visibility ${
        value ? "enabled" : "disabled"
      }.`,
    });
  };

  const handleNotificationsToggle = (
    key: keyof SettingsState["notifications"],
    value: boolean,
  ) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));

    toast({
      title: "Notification updated",
      description: `${key.replace(/([A-Z])/g, " $1").toLowerCase()} alerts ${
        value ? "on" : "off"
      }.`,
    });
  };

  const handleProfileVisibilityChange = (
    visibility: SettingsState["privacy"]["profileVisibility"],
  ) => {
    setSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        profileVisibility: visibility,
      },
    }));

    toast({
      title: "Visibility updated",
      description: `Your profile is now ${visibility}.`,
    });
  };

  const handleProfileSave = () => {
    setProfile(editProfileDraft);
    setIsEditProfileOpen(false);
    toast({
      title: "Profile updated",
      description: "Your profile details were saved successfully.",
    });
  };

  const handleInviteSubmit = () => {
    if (!inviteForm.name || !inviteForm.email) {
      toast({
        title: "Add the basics",
        description: "Please include both a name and email before sending.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Invitation sent",
      description: `${inviteForm.name} will receive your invite shortly.`,
    });
    setInviteForm({ name: "", email: "" });
    setIsInviteDialogOpen(false);
  };

  const handleMfaToggle = (enabled: boolean) => {
    setIsMfaEnabled(enabled);
    toast({
      title: enabled
        ? "Multi-factor authentication enabled"
        : "Multi-factor authentication disabled",
      description: enabled
        ? "We'll guide you through connecting an authenticator app or SMS verification."
        : "Turn this back on anytime to keep your account extra secure.",
    });
  };

  const handleLoginAlertsToggle = (enabled: boolean) => {
    setLoginAlertsEnabled(enabled);
    toast({
      title: enabled ? "Login alerts enabled" : "Login alerts disabled",
      description: enabled
        ? "We'll notify you whenever a new device signs in."
        : "You won't receive notifications for new device sign-ins.",
    });
  };

  // Stripe payment functions
  const handleStartPremiumCheckout = async () => {
    if (!hasStripeConfig() || !STRIPE_PREMIUM_PRICE_ID) {
      toast({
        title: "Stripe not configured",
        description:
          "Add your Stripe publishable key, function URL, and price ID to enable checkout.",
        variant: "destructive",
      });
      return;
    }

    if (isCheckoutLoading) return;
    setIsCheckoutLoading(true);

    try {
      const { sessionId, url } = await createStripeCheckoutSession({
        priceId: STRIPE_PREMIUM_PRICE_ID,
        metadata: { plan: "premium" },
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
    <div className="min-h-screen bg-muted/10 pb-20">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-8 pt-10 lg:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <BackButton
              fallbackPath="/dashboard"
              ariaLabel="Go back to dashboard"
              className="h-11 w-11"
            />
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Profile
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
                Your community presence
              </h1>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5" />
              Trust score {profile.trustScore}%
            </Badge>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11"
              onClick={() => setIsEditProfileOpen(true)}
              aria-label="Edit profile"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-11 w-11"
              onClick={() => setIsInviteDialogOpen(true)}
              aria-label="Invite a friend"
            >
              <UserPlus className="h-5 w-5" />
            </Button>
            <Button
              variant="default"
              size="lg"
              className="inline-flex items-center gap-2"
              onClick={() => setActiveTab("events")}
            >
              Explore events
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Card className="overflow-hidden border-none bg-gradient-to-br from-background via-background to-muted shadow-xl">
          <CardContent className="p-0">
            <div className="flex flex-col gap-8 p-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
                <div className="relative">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                    <AvatarImage src="/placeholder.svg" alt={profile.name} />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  {profile.isPremium && (
                    <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-500 to-amber-600 text-white">
                      <Crown className="mr-1 h-3 w-3" /> Premium
                    </Badge>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-semibold text-foreground md:text-3xl">
                        {profile.name}
                      </h2>
                      <Badge variant="secondary" className="inline-flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {profile.location}
                      </Badge>
                    </div>
                    <p className="mt-2 max-w-2xl text-sm text-muted-foreground md:text-base">
                      {profile.bio}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Joined {profile.joinedDate}
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4" /> {badges.filter((badge) => badge.earned).length} badges earned
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" /> {friends.length} connections
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                      <span>Trust & safety</span>
                      <span>{profile.trustScore}%</span>
                    </div>
                    <Progress value={profile.trustScore} className="h-2 bg-muted" />
                    <p className="text-xs text-muted-foreground">
                      Consistently showing up, verifying details, and collecting positive feedback grows your trust score.
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full max-w-sm space-y-5 rounded-xl border border-border bg-background/70 p-6 backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {premiumCtaCopy.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {premiumCtaCopy.description}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-muted-foreground" /> {connectionSummary.favorites} favorites
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" /> {connectionSummary.closeFriends} close friends
                  </div>
                  <div className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-muted-foreground" /> {connectionSummary.savedEvents} saved events
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500" /> Host rating 4.9
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <Badge key={interest} variant="outline" className="rounded-full border-dashed">
                      {interest}
                    </Badge>
                  ))}
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    className="flex-1"
                    variant={profile.isPremium ? "outline" : "default"}
                    onClick={
                      profile.isPremium
                        ? handleManageSubscription
                        : handleStartPremiumCheckout
                    }
                    disabled={isCheckoutLoading || isPortalLoading}
                  >
                    {(isCheckoutLoading || isPortalLoading) && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {profile.isPremium ? "Manage membership" : "Upgrade to Premium"}
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setActiveTab("friends")}
                  >
                    View connections
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs
          value={activeTab}
          onValueChange={(value) =>
            setActiveTab(value as "friends" | "events" | "badges" | "settings")
          }
          className="space-y-8"
        >
          <TabsList className="grid w-full grid-cols-2 gap-2 rounded-lg bg-muted/50 p-1 sm:grid-cols-4">
            <TabsTrigger value="friends" className="gap-2">
              <Users className="h-4 w-4" /> Connections
            </TabsTrigger>
            <TabsTrigger value="events" className="gap-2">
              <Calendar className="h-4 w-4" /> Events
            </TabsTrigger>
            <TabsTrigger value="badges" className="gap-2">
              <Award className="h-4 w-4" /> Badges
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="h-4 w-4" /> Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="friends" className="space-y-6">
            <div className="flex flex-col gap-4 rounded-xl border border-dashed border-primary/20 bg-primary/5 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-foreground">Nurture your inner circle</h3>
                <p className="text-sm text-muted-foreground">
                  Curate favorites to surface them for spontaneous plans and share your availability for quick meetups.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={() => setIsInviteDialogOpen(true)}
                >
                  <Send className="h-4 w-4" /> Send invite
                </Button>
                <Button variant="secondary" className="gap-2">
                  <MessageCircle className="h-4 w-4" /> Share availability
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {friends.map((friend) => (
                <Card key={friend.id} className="flex h-full flex-col">
                  <CardHeader className="flex flex-row items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={friend.avatar} alt={friend.name} />
                      <AvatarFallback>
                        {friend.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <CardTitle className="flex items-center gap-2 text-base">
                        {friend.name}
                        {friend.isCloseFriend && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> Close friend
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="flex flex-wrap items-center gap-3 text-xs">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {friend.lastSeen}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Users className="h-3 w-3" /> {friend.mutualFriends} mutual
                        </span>
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleToggleFavorite(friend.id)}
                      aria-label="Toggle favorite"
                    >
                      <Heart
                        className={`h-5 w-5 ${friend.isFavorite ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`}
                      />
                    </Button>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-4">
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <Badge variant="outline" className="border-dashed">
                        Shared cafés
                      </Badge>
                      <Badge variant="outline" className="border-dashed">
                        Weekend planner
                      </Badge>
                    </div>
                    <div className="mt-auto flex flex-wrap items-center gap-3">
                      <Button className="flex-1" variant="secondary">
                        <MessageCircle className="mr-2 h-4 w-4" /> Message
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => handleToggleCloseFriend(friend.id)}
                      >
                        {friend.isCloseFriend ? "Remove close friend" : "Add close friend"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Keep your calendar vibrant</h3>
                <p className="text-sm text-muted-foreground">
                  Save the gatherings that energize you and follow up with hosts directly.
                </p>
              </div>
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-2">
                  {(
                    [
                      { value: "attending", label: "Upcoming" },
                      { value: "past", label: "Past" },
                      { value: "hosted", label: "Hosted" },
                    ] satisfies { value: EventCategory; label: string }[]
                  ).map((category) => (
                    <Button
                      key={category.value}
                    variant={
                      selectedEventCategory === category.value ? "default" : "outline"
                    }
                    size="sm"
                    className="rounded-full"
                    onClick={() => setSelectedEventCategory(category.value)}
                    >
                      {category.label}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="secondary"
                  className="gap-2"
                  onClick={() => navigate("/create-event")}
                >
                  <Plus className="h-4 w-4" /> Plan new experience
                </Button>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              {events[selectedEventCategory].map((event) => (
                <Card key={event.id} className="flex h-full flex-col border-border/60">
                  <CardHeader className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="rounded-full bg-primary/10 p-2 text-primary">
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{event.title}</CardTitle>
                          <CardDescription className="text-xs">
                            Hosted by {event.host}
                          </CardDescription>
                        </div>
                      </div>
                      {event.isSaved && (
                        <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                          <Bookmark className="h-3 w-3" /> Saved
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {event.date} · {event.time}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {event.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3 w-3" /> {event.attendees} attending
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col gap-4">
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    <div className="mt-auto flex flex-wrap gap-3">
                      <Button variant="outline" className="flex-1"
                        onClick={() => handleToggleSaveEvent(selectedEventCategory, event.id)}
                      >
                        <Bookmark className="mr-2 h-4 w-4" />
                        {event.isSaved ? "Saved" : "Save for follow-up"}
                      </Button>
                      <Button
                        className="flex-1"
                        variant="secondary"
                        onClick={() => navigate(`/events/${event.id}`)}
                      >
                        View details
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-semibold text-foreground">Celebrate your milestones</h3>
              <p className="text-sm text-muted-foreground">
                Earn badges as you engage, host experiences, and strengthen community trust.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {badges.map((badge) => (
                <Card
                  key={badge.id}
                  className={`relative overflow-hidden border ${
                    badge.earned ? "border-primary/60 bg-primary/5" : "border-border"
                  }`}
                >
                  {badge.earned && (
                    <span className="absolute right-4 top-4 inline-flex items-center gap-1 text-xs font-medium text-primary">
                      <ShieldCheck className="h-3 w-3" /> Earned
                    </span>
                  )}
                  <CardHeader className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{badge.icon}</span>
                        <div>
                          <CardTitle className="text-base">{badge.name}</CardTitle>
                          <CardDescription>{badge.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  {!badge.earned && (
                    <CardContent className="space-y-3">
                      <Progress value={badge.progress ?? 0} className="h-2" />
                      <p className="text-xs text-muted-foreground">
                        {badge.progress}% of the way there. Attend more gatherings and connect to unlock this badge.
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5" />
                    <div>
                      <CardTitle>Privacy</CardTitle>
                      <CardDescription>Control how you show up across the community.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Profile visibility</Label>
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          { value: "public", label: "Public" },
                          { value: "connections", label: "Connections" },
                          { value: "private", label: "Private" },
                        ] satisfies {
                          value: SettingsState["privacy"]["profileVisibility"];
                          label: string;
                        }[]
                      ).map((option) => (
                        <Button
                          key={option.value}
                          variant={
                            settings.privacy.profileVisibility === option.value
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className="rounded-full"
                          onClick={() => handleProfileVisibilityChange(option.value)}
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Show location</p>
                        <p className="text-xs text-muted-foreground">Allow trusted members to see your general city.</p>
                      </div>
                      <Switch
                        checked={settings.privacy.showLocation}
                        onCheckedChange={(value) => handlePrivacyToggle("showLocation", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Share interests</p>
                        <p className="text-xs text-muted-foreground">Highlight up to ten interests on your profile.</p>
                      </div>
                      <Switch
                        checked={settings.privacy.showInterests}
                        onCheckedChange={(value) => handlePrivacyToggle("showInterests", value)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Display events</p>
                        <p className="text-xs text-muted-foreground">Let others see your hosted and attending events.</p>
                      </div>
                      <Switch
                        checked={settings.privacy.showEvents}
                        onCheckedChange={(value) => handlePrivacyToggle("showEvents", value)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5" />
                    <div>
                      <CardTitle>Notifications</CardTitle>
                      <CardDescription>Stay in the loop without the overwhelm.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">New matches</p>
                      <p className="text-xs text-muted-foreground">Get notified when someone new is recommended.</p>
                    </div>
                    <Switch
                      checked={settings.notifications.newMatches}
                      onCheckedChange={(value) =>
                        handleNotificationsToggle("newMatches", value)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Event reminders</p>
                      <p className="text-xs text-muted-foreground">Receive a reminder 24 hours before each RSVP.</p>
                    </div>
                    <Switch
                      checked={settings.notifications.eventReminders}
                      onCheckedChange={(value) =>
                        handleNotificationsToggle("eventReminders", value)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Messages</p>
                      <p className="text-xs text-muted-foreground">Notify me about unread direct messages.</p>
                    </div>
                    <Switch
                      checked={settings.notifications.messages}
                      onCheckedChange={(value) =>
                        handleNotificationsToggle("messages", value)
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Event updates</p>
                      <p className="text-xs text-muted-foreground">Only the essentials when a host changes plans.</p>
                    </div>
                    <Switch
                      checked={settings.notifications.eventUpdates}
                      onCheckedChange={(value) =>
                        handleNotificationsToggle("eventUpdates", value)
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5" />
                    <div>
                      <CardTitle>Security</CardTitle>
                      <CardDescription>Keep your account protected across devices.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Multi-factor authentication</p>
                      <p className="text-xs text-muted-foreground">Add an authenticator app or SMS verification.</p>
                    </div>
                    <Switch
                      checked={isMfaEnabled}
                      onCheckedChange={handleMfaToggle}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Login alerts</p>
                      <p className="text-xs text-muted-foreground">Know instantly when a new device signs in.</p>
                    </div>
                    <Switch
                      checked={loginAlertsEnabled}
                      onCheckedChange={handleLoginAlertsToggle}
                    />
                  </div>
                  <Button variant="outline" className="gap-2">
                    <Eye className="h-4 w-4" /> View trusted devices
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5" />
                    <div>
                      <CardTitle>Membership</CardTitle>
                      <CardDescription>Manage billing, invoices, and loyalty status.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg border border-dashed border-primary/40 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">
                          {profile.isPremium ? "Premium" : "Community"} plan
                        </p>
                        <p className="text-xs text-muted-foreground">Renews every month · Cancel anytime</p>
                      </div>
                      <Badge className="bg-primary/10 text-primary">
                        <Sparkles className="mr-1 h-3 w-3" /> Active
                      </Badge>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      className="flex-1"
                      variant="default"
                      onClick={
                        profile.isPremium
                          ? handleManageSubscription
                          : handleStartPremiumCheckout
                      }
                      disabled={isCheckoutLoading || isPortalLoading}
                    >
                      {(isCheckoutLoading || isPortalLoading) && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      {profile.isPremium ? "Open billing portal" : "Upgrade now"}
                    </Button>
                    <Button variant="outline" className="flex-1">
                      Download invoices
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Premium unlocks concierge planning, advanced filters, and the ability to co-host signature salons with our team.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Sheet open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Fine-tune how your profile appears across the community.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editProfileDraft.name}
                onChange={(event) =>
                  setEditProfileDraft((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={editProfileDraft.location}
                onChange={(event) =>
                  setEditProfileDraft((prev) => ({
                    ...prev,
                    location: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                rows={5}
                value={editProfileDraft.bio}
                onChange={(event) =>
                  setEditProfileDraft((prev) => ({
                    ...prev,
                    bio: event.target.value,
                  }))
                }
              />
              <p className="text-xs text-muted-foreground">
                Lead with what energizes you and the experiences you love curating.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Interests</Label>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest) => {
                  const active = editProfileDraft.interests.includes(interest);
                  return (
                    <Button
                      key={interest}
                      variant={active ? "default" : "outline"}
                      size="sm"
                      className="rounded-full"
                      onClick={() =>
                        setEditProfileDraft((prev) => ({
                          ...prev,
                          interests: active
                            ? prev.interests.filter((item) => item !== interest)
                            : [...prev.interests, interest],
                        }))
                      }
                    >
                      {interest}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
          <SheetFooter className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsEditProfileOpen(false)}
            >
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleProfileSave}>
              Save changes
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite a friend</DialogTitle>
            <DialogDescription>
              Share a warm introduction—your note will include your profile and favorite highlights.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invite-name">Name</Label>
              <Input
                id="invite-name"
                placeholder="Alex Chen"
                value={inviteForm.name}
                onChange={(event) =>
                  setInviteForm((prev) => ({ ...prev, name: event.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="alex@example.com"
                value={inviteForm.email}
                onChange={(event) =>
                  setInviteForm((prev) => ({ ...prev, email: event.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setIsInviteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleInviteSubmit}>
              Send invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
