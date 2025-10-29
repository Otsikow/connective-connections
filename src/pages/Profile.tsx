import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
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

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"friends" | "events" | "badges" | "settings">("friends");

  const [profile, setProfile] = useState<ProfileInfo>({
    name: "Jane Doe",
    location: "San Francisco, CA",
    joinedDate: "November 2025",
    trustScore: 85,
    bio: "Love exploring new coffee shops and hiking trails. Always up for a good book discussion or planning the next adventure. New to the city and excited to meet genuine people!",
    interests: ["Hiking", "Photography", "Coffee", "Reading", "Travel"],
    isPremium: false,
  });

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
        description: "Bring your laptop, grab a latte, and co-work with other builders and technologists in the city.",
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
        description: "A friendly morning hike with stops for photos and a picnic. All experience levels welcome.",
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
        description: "Discussed 'Tomorrow, and Tomorrow, and Tomorrow' with fellow readers and planned next month's pick.",
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
        description: "Explored hidden gems around SOMA with a group of photographers from beginner to pro.",
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
        description: "Hosted an intimate brunch to introduce new friends and plan upcoming adventures together.",
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

  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const billingStatus = params.get("billing");

    if (!billingStatus) return;

    switch (billingStatus) {
      case "success":
        setProfile((prev) => ({ ...prev, isPremium: true }));
        toast({
          title: "Welcome to Premium!",
          description: "Your payment was successful and premium access is unlocked.",
        });
        break;
      case "updated":
        setProfile((prev) => ({ ...prev, isPremium: true }));
        toast({
          title: "Billing updated",
          description: "Your subscription details were updated successfully.",
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

  const [friendDialogOpen, setFriendDialogOpen] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState<number | null>(null);
  const selectedFriend = useMemo(
    () => friends.find((friend) => friend.id === selectedFriendId) ?? null,
    [friends, selectedFriendId]
  );

  const [eventSheetOpen, setEventSheetOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<{ event: EventItem; category: EventCategory } | null>(null);

  const [addFriendDialogOpen, setAddFriendDialogOpen] = useState(false);
  const [newFriendEmail, setNewFriendEmail] = useState("");

  const earnedBadges = useMemo(() => badges.filter((badge) => badge.earned).length, [badges]);

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
        if (error) {
          if (url) {
            window.location.href = url;
            return;
          }
          throw new Error(error.message);
        }
        return;
      }

      if (url) {
        window.location.href = url;
        return;
      }

      throw new Error("Stripe did not return a checkout redirect URL");
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
            : "An unexpected error occurred while opening the customer portal.",
        variant: "destructive",
      });
    } finally {
      setIsPortalLoading(false);
    }
  };

  const handleAddFriend = () => {
    setAddFriendDialogOpen(true);
  };

  const handleSubmitFriendInvite = () => {
    if (!newFriendEmail.trim()) {
      toast({
        title: "Missing email",
        description: "Enter an email so we know who to invite.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Invitation sent",
      description: `We let ${newFriendEmail} know you'd like to connect.`,
    });
    setNewFriendEmail("");
    setAddFriendDialogOpen(false);
  };

  const handleToggleFavorite = (friendId: number) => {
    let toggledFavorite: boolean | null = null;

    setFriends((prev) =>
      prev.map((friend) => {
        if (friend.id === friendId) {
          toggledFavorite = !friend.isFavorite;
          return { ...friend, isFavorite: toggledFavorite };
        }
        return friend;
      })
    );

    const friend = friends.find((item) => item.id === friendId);
    if (!friend || toggledFavorite === null) return;

    toast({
      title: toggledFavorite ? "Added to favorites" : "Removed from favorites",
      description: `${friend.name} has been ${toggledFavorite ? "added to" : "removed from"} your favorites list.`,
    });
  };

  const handleStartChat = (friendId: number) => {
    const friend = friends.find((item) => item.id === friendId);
    if (!friend) return;

    toast({
      title: "Chat opened",
      description: `Starting a conversation with ${friend.name}.`,
    });
    navigate("/messages", { state: { userId: friendId } });
  };

  const handleViewFriend = (friendId: number) => {
    setSelectedFriendId(friendId);
    setFriendDialogOpen(true);
  };

  const handleScheduleHangout = (friend?: Friend | null) => {
    if (!friend) return;

    toast({
      title: "Hangout requested",
      description: `We'll let ${friend.name} know you'd like to plan something.`,
    });
  };

  const handleEventSelection = (event: EventItem, category: EventCategory) => {
    setSelectedEvent({ event, category });
    setEventSheetOpen(true);
  };

  const handleOpenEventPage = () => {
    if (!selectedEvent) return;
    navigate(`/events/${selectedEvent.event.id}`);
    toast({
      title: "Opening event",
      description: "Taking you to the full event details page.",
    });
    setEventSheetOpen(false);
  };

  const handleToggleSaveEvent = (eventId: number, category: EventCategory) => {
    setEvents((prev) => {
      const updatedCategory = prev[category].map((event) =>
        event.id === eventId ? { ...event, isSaved: !event.isSaved } : event
      );

      return { ...prev, [category]: updatedCategory };
    });

    setSelectedEvent((prev) => {
      if (!prev || prev.event.id !== eventId || prev.category !== category) return prev;
      return { ...prev, event: { ...prev.event, isSaved: !prev.event.isSaved } };
    });

    const event = events[category].find((item) => item.id === eventId);
    if (!event) return;

    const isSaved = !event.isSaved;
    toast({
      title: isSaved ? "Saved to calendar" : "Removed from saved",
      description: `${event.title} ${isSaved ? "is now saved" : "was removed"} from your personal list.`,
    });
  };

  const handleMessageHost = (event: EventItem) => {
    toast({
      title: "Message sent",
      description: `We'll open a chat with ${event.host} so you can ask a question.`,
    });
    navigate("/messages");
  };

  const handlePrivacyToggle = (key: keyof SettingsState["privacy"], value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: value,
      },
    }));

    toast({
      title: "Privacy updated",
      description: `${key.replace(/([A-Z])/g, " $1")} is now ${value ? "enabled" : "disabled"}.`,
    });
  };

  const handleNotificationsToggle = (
    key: keyof SettingsState["notifications"],
    value: boolean
  ) => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: value,
      },
    }));

    toast({
      title: "Notification preferences saved",
      description: `${key.replace(/([A-Z])/g, " $1")} notifications are ${value ? "on" : "off"}.`,
    });
  };

  const handleVisibilityChange = (value: SettingsState["privacy"]["profileVisibility"]) => {
    setSettings((prev) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        profileVisibility: value,
      },
    }));

    const visibilityLabels: Record<SettingsState["privacy"]["profileVisibility"], string> = {
      public: "Public",
      connections: "Connections only",
      private: "Private",
    };

    toast({
      title: "Visibility updated",
      description: `Your profile is now ${visibilityLabels[value].toLowerCase()}.`,
    });
  };

  const privacyLabels: Record<SettingsState["privacy"]["profileVisibility"], string> = {
    public: "Public",
    connections: "Connections",
    private: "Private",
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <BackButton
          fallbackPath="/home"
          size="icon"
          className="h-10 w-10"
        />
        <h1 className="text-lg font-semibold">Profile</h1>
        <div className="w-10" />
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 py-6 space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-2">
            <Avatar className="w-32 h-32 ring-4 ring-amber-400/30">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-black shadow-lg">
              <Star className="w-3.5 h-3.5" />
              <span>{profile.trustScore}</span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold mb-2">{profile.name}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <MapPin size={14} className="flex-shrink-0" />
            <span className="truncate">{profile.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar size={14} className="flex-shrink-0" />
            <span>Joined {profile.joinedDate}</span>
          </div>
        </div>

        {/* About Me */}
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground leading-relaxed mb-4">{profile.bio}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {profile.interests.map((interest, i) => (
                <Badge key={i} variant="secondary" className="text-sm">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Premium CTA */}
        {!profile.isPremium && (
          <Card className="border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
            <CardContent className="p-6 text-center">
              <Crown className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 flex justify-center items-center gap-1">
                Upgrade to Premium <Sparkles className="w-4 h-4 text-amber-500" />
              </h3>
              <p className="text-muted-foreground mb-4">
                Unlock unlimited matches, event access, and exclusive badges.
              </p>
              <Button
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white"
                onClick={handleStartPremiumCheckout}
                disabled={isCheckoutLoading}
              >
                {isCheckoutLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Redirecting…
                  </span>
                ) : (
                  "Upgrade Now"
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {profile.isPremium && (
          <Card className="border border-emerald-500/40 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-2 flex justify-center items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" /> Premium Active
              </h3>
              <p className="text-muted-foreground mb-4">
                You're enjoying the full Connective experience. Manage your plan any time.
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleManageSubscription}
                disabled={isPortalLoading}
              >
                {isPortalLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Opening portal…
                  </span>
                ) : (
                  "Manage subscription"
                )}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="friends" className="text-xs sm:text-sm">
              <Users className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Friends</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="text-xs sm:text-sm">
              <Calendar className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Events</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="text-xs sm:text-sm">
              <Award className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Badges</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm">
              <Settings className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Friends */}
          <TabsContent value="friends" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Friends ({friends.length})</h3>
              <Button size="sm" variant="outline" onClick={handleAddFriend}>
                <Plus className="w-4 h-4 mr-2" /> Add Friend
              </Button>
            </div>
            {friends.map((friend) => (
              <Card key={friend.id}>
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={friend.avatar} />
                      <AvatarFallback>{friend.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{friend.name}</h4>
                        {friend.isCloseFriend && <Badge variant="secondary">Close friend</Badge>}
                        {friend.isFavorite && <Heart className="w-4 h-4 text-rose-500" fill="#f43f5e" />}
                      </div>
                      <p className="text-sm text-muted-foreground flex flex-wrap items-center gap-1">
                        <span>{friend.mutualFriends} mutual friends</span>
                        <span className="text-muted-foreground/60">•</span>
                        <span>Last seen {friend.lastSeen}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStartChat(friend.id)}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={friend.isFavorite ? "default" : "outline"}
                      onClick={() => handleToggleFavorite(friend.id)}
                      className={friend.isFavorite ? "bg-rose-500 hover:bg-rose-600" : ""}
                    >
                      <Heart
                        className="w-4 h-4"
                        {...(friend.isFavorite
                          ? { fill: "currentColor", color: "#fff" }
                          : {})}
                      />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="hidden sm:inline-flex"
                      onClick={() => handleViewFriend(friend.id)}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <div className="sm:hidden text-center">
              <Button variant="ghost" className="text-sm text-muted-foreground" onClick={() => setFriendDialogOpen(true)}>
                <Eye className="w-4 h-4 mr-2" /> Quick friend actions
              </Button>
            </div>
          </TabsContent>

          {/* Events */}
          <TabsContent value="events" className="space-y-6">
            {Object.entries(events).map(([key, list]) => (
              <div key={key}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 capitalize">
                  {key === "attending" && <Clock className="w-5 h-5" />}
                  {key === "past" && <CheckCircle className="w-5 h-5" />}
                  {key === "hosted" && <Crown className="w-5 h-5" />}
                  {key} ({list.length})
                </h3>
                {list.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {event.date} at {event.time} • {event.location}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Hosted by {event.host}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant={event.isSaved ? "default" : "outline"}
                          onClick={() => handleToggleSaveEvent(event.id, key as EventCategory)}
                          className={event.isSaved ? "bg-sky-500 hover:bg-sky-600" : ""}
                        >
                          <Bookmark className="w-4 h-4 mr-1" />
                          {event.isSaved ? "Saved" : "Save"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEventSelection(event, key as EventCategory)}
                        >
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </TabsContent>

          {/* Badges */}
          <TabsContent value="badges" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Achievements</h3>
              <Badge variant="outline">
                {earnedBadges} / {badges.length} earned
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {badges.map((badge) => (
                <Card key={badge.id} className={badge.earned ? "bg-green-50 border-green-200" : "opacity-70"}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{badge.icon}</div>
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          {badge.name}
                          {badge.earned && <CheckCircle className="w-4 h-4 text-green-600" />}
                        </h4>
                        <p className="text-sm text-muted-foreground">{badge.description}</p>
                        {!badge.earned && (
                          <div className="mt-3 space-y-1">
                            <Progress value={badge.progress} className="h-2" />
                            <p className="text-xs text-muted-foreground">
                              {badge.progress}% complete
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Privacy
                </CardTitle>
                <CardDescription>Control your profile visibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Profile Visibility</Label>
                  <div className="flex flex-wrap items-center gap-3">
                    {(
                      ["public", "connections", "private"] as SettingsState["privacy"]["profileVisibility"][]
                    ).map((option) => (
                      <Button
                        key={option}
                        variant={settings.privacy.profileVisibility === option ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleVisibilityChange(option)}
                      >
                        {privacyLabels[option]}
                      </Button>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label>Show Location</Label>
                  <Switch
                    checked={settings.privacy.showLocation}
                    onCheckedChange={(value) => handlePrivacyToggle("showLocation", value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Show Interests</Label>
                  <Switch
                    checked={settings.privacy.showInterests}
                    onCheckedChange={(value) => handlePrivacyToggle("showInterests", value)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Show Events</Label>
                  <Switch
                    checked={settings.privacy.showEvents}
                    onCheckedChange={(value) => handlePrivacyToggle("showEvents", value)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" /> Notifications
                </CardTitle>
                <CardDescription>Manage how you stay updated</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
                    <Switch
                      checked={value}
                      onCheckedChange={(checked) =>
                        handleNotificationsToggle(key as keyof SettingsState["notifications"], checked)
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" /> Subscription
                </CardTitle>
                <CardDescription>Manage your premium plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Current Plan</p>
                    <p className="text-sm text-muted-foreground">
                      {profile.isPremium ? "Premium" : "Free Plan"}
                    </p>
                  </div>
                  <Badge variant={profile.isPremium ? "default" : "outline"}>
                    {profile.isPremium ? "Active" : "Free"}
                  </Badge>
                </div>
                <Button
                  className="w-full"
                  onClick={
                    profile.isPremium
                      ? handleManageSubscription
                      : handleStartPremiumCheckout
                  }
                  disabled={
                    profile.isPremium ? isPortalLoading : isCheckoutLoading
                  }
                >
                  {profile.isPremium ? (
                    isPortalLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Opening portal…
                      </span>
                    ) : (
                      "Manage Subscription"
                    )
                  ) : isCheckoutLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Redirecting…
                    </span>
                  ) : (
                    "Upgrade to Premium"
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={addFriendDialogOpen} onOpenChange={setAddFriendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send an invite</DialogTitle>
            <DialogDescription>
              Invite someone to join Connective or search for an existing member.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="friend-email">Email address</Label>
              <Input
                id="friend-email"
                type="email"
                placeholder="friend@example.com"
                value={newFriendEmail}
                onChange={(event) => setNewFriendEmail(event.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              We'll send a personal invite letting them know you'd like to connect.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddFriendDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitFriendInvite}>
              <Send className="w-4 h-4 mr-2" /> Send invite
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={friendDialogOpen && Boolean(selectedFriend)} onOpenChange={setFriendDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          {selectedFriend ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedFriend.name}
                  {selectedFriend.isFavorite && (
                    <Heart className="w-4 h-4 text-rose-500" fill="#f43f5e" />
                  )}
                </DialogTitle>
                <DialogDescription>
                  {selectedFriend.mutualFriends} mutual friends • Last seen {selectedFriend.lastSeen}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col items-center gap-4 py-4">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={selectedFriend.avatar} />
                  <AvatarFallback>
                    {selectedFriend.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="grid w-full grid-cols-1 gap-2">
                  <Button onClick={() => handleStartChat(selectedFriend.id)}>
                    <MessageCircle className="w-4 h-4 mr-2" /> Start chat
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleScheduleHangout(selectedFriend)}
                  >
                    <Calendar className="w-4 h-4 mr-2" /> Schedule a hangout
                  </Button>
                  <Button
                    variant={selectedFriend.isFavorite ? "default" : "outline"}
                    onClick={() => handleToggleFavorite(selectedFriend.id)}
                    className={selectedFriend.isFavorite ? "bg-rose-500 hover:bg-rose-600" : ""}
                  >
                    <Heart
                      className="w-4 h-4 mr-2"
                      {...(selectedFriend.isFavorite
                        ? { fill: "currentColor", color: "#fff" }
                        : {})}
                    />
                    {selectedFriend.isFavorite ? "Remove favorite" : "Add to favorites"}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Select a friend to view quick actions.
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Sheet open={eventSheetOpen && Boolean(selectedEvent)} onOpenChange={setEventSheetOpen}>
        <SheetContent className="flex flex-col gap-4">
          {selectedEvent ? (
            <>
              <SheetHeader>
                <SheetTitle>{selectedEvent.event.title}</SheetTitle>
                <SheetDescription>
                  {selectedEvent.event.date} at {selectedEvent.event.time} • {selectedEvent.event.location}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">Hosted by {selectedEvent.event.host}</p>
                <p>{selectedEvent.event.description}</p>
                <p className="text-muted-foreground">
                  {selectedEvent.event.attendees} people are part of this event.
                </p>
              </div>

              <SheetFooter className="flex flex-col gap-2">
                <Button onClick={handleOpenEventPage}>
                  <Eye className="w-4 h-4 mr-2" /> View full details
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleToggleSaveEvent(selectedEvent.event.id, selectedEvent.category)}
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  {selectedEvent.event.isSaved ? "Remove from saved" : "Save for later"}
                </Button>
                <Button variant="outline" onClick={() => handleMessageHost(selectedEvent.event)}>
                  <UserPlus className="w-4 h-4 mr-2" /> Message host
                </Button>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Profile;
