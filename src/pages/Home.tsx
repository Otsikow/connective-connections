import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Carousel,
  CarouselItem,
  CarouselContent,
  CarouselNext,
  CarouselPrevious
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";

import {
  Sparkles,
  PlayCircle,
  Users,
  Send,
  Brain,
  MapPin,
  Clock,
  CalendarCheck2,
  Wand2
} from "lucide-react";

import { useSubscription } from "@/hooks/useSubscription";
import { usePageTitle } from "@/hooks/usePageTitle";
import { generateAvatarUrl } from "@/lib/avatar";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------ */
/* UTILITIES */
/* ------------------------------------------------------------ */

const deriveInitials = (fullName?: string | null, email?: string | null) => {
  const n = fullName?.trim();
  if (n) {
    const p = n.split(" ");
    if (p.length >= 2) return `${p[0][0]}${p[p.length - 1][0]}`.toUpperCase();
    return p[0][0].toUpperCase();
  }

  const id = email?.split("@")[0];
  if (id) return id.slice(0, 2).toUpperCase();

  return "U";
};

/* ------------------------------------------------------------ */
/* MAIN COMPONENT */
/* ------------------------------------------------------------ */

const Home = () => {
  const navigate = useNavigate();
  usePageTitle("Member Home");

  const { userId, fullName, email, tier } = useSubscription();
  const isAuthenticated = Boolean(userId);
  const isSubscribed = tier !== "basic";

  const [activeFeature, setActiveFeature] = useState("friends");
  const [showSubPrompt, setShowSubPrompt] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  const userInitials = useMemo(
    () => deriveInitials(fullName, email),
    [fullName, email]
  );

  const userAvatarUrl = generateAvatarUrl(fullName ?? email ?? "connective-user");

  /* ------------------------------------------------------------ */
  /* FEATURE DEFINITIONS */
  /* ------------------------------------------------------------ */

  const features = [
    {
      value: "concierge",
      title: "AI Friendship Concierge",
      desc: "Tell us who you want to meet—concierge matches, schedules, and sends invites for you.",
      highlight: "Handles invites, venues, and follow-ups automatically.",
      badge: "bg-purple-500/15 text-purple-600",
      cta: { path: "/concierge", requiresAuth: true },
      spotlight: {
        avatar: generateAvatarUrl("Concierge spotlight"),
        name: "Concierge",
        tagline: "Organised your last three meetups"
      }
    },
    {
      value: "friends",
      title: "Find your kind of people",
      desc: "Tell us what lights you up and we introduce you to people already on your wavelength.",
      highlight: "12 new connections matched for you this week.",
      badge: "bg-emerald-500/15 text-emerald-600",
      cta: { path: "/friend-finder", requiresAuth: true },
      spotlight: {
        avatar: generateAvatarUrl("Jordan spotlight"),
        name: "Jordan",
        tagline: "Met three new hiking buddies"
      }
    },
    {
      value: "events",
      title: "Discover local experiences",
      desc: "Curated gatherings, classes, and adventures hosted by members.",
      highlight: "120 local experiences this month.",
      badge: "bg-blue-500/15 text-blue-600",
      cta: { path: "/events", requiresAuth: true },
      spotlight: {
        avatar: generateAvatarUrl("Lucia spotlight"),
        name: "Lucia",
        tagline: "Hosts a monthly poetry circle"
      }
    },
    {
      value: "groups",
      title: "Join meaningful groups",
      desc: "Micro-communities built around interests and vibes.",
      highlight: "4 new communities recommended today.",
      badge: "bg-amber-500/15 text-amber-600",
      cta: { path: "/community", requiresAuth: true, requiresSubscription: true },
      spotlight: {
        avatar: generateAvatarUrl("Priya spotlight"),
        name: "Priya",
        tagline: "Joined the storytellers collective"
      }
    },
    {
      value: "chat",
      title: "Chat without awkward starts",
      desc: "Guided prompts keep conversations natural and fun.",
      highlight: "Instant translation in 28 languages with Pro.",
      badge: "bg-rose-500/15 text-rose-600",
      cta: { path: "/messages", requiresAuth: true, requiresSubscription: true },
      spotlight: {
        avatar: generateAvatarUrl("Miguel spotlight"),
        name: "Miguel",
        tagline: "Had 5 new chats last weekend"
      }
    }
  ];

  const selected = features.find(f => f.value === activeFeature)!;

  /* ------------------------------------------------------------ */
  /* ACCESS HANDLER */
  /* ------------------------------------------------------------ */

  const handleNavigate = (path: string, opts?: any) => {
    if (opts?.requiresAuth && !isAuthenticated) {
      setPendingPath(path);
      setShowAuthPrompt(true);
      return;
    }

    if (opts?.requiresSubscription && !isSubscribed) {
      setShowSubPrompt(true);
      return;
    }

    navigate(path);
  };

  /* ------------------------------------------------------------ */
  /* STATIC SAMPLE DATA */
  /* ------------------------------------------------------------ */

  const events = [
    {
      id: "1",
      title: "Sunrise Social Hike",
      date: "Sat, Apr 20",
      location: "Ridgeview Trail",
      attendees: 18,
      tags: ["Outdoors", "Mindfulness"],
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&w=1200&q=80"
    },
    {
      id: "2",
      title: "Indie Coffee Crawl",
      date: "Sun, Apr 28",
      location: "Downtown",
      attendees: 32,
      tags: ["Food", "Creative"],
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&w=1200&q=80"
    }
  ];

  const communities = [
    { name: "The Gathering Table", members: "1.1k members" },
    { name: "Rooftop Runners", members: "2.4k members" },
    { name: "Side Quest Gamers", members: "3.0k members" }
  ];

  const testimonials = [
    { author: "Serena", quote: "Someone finally listened to what I was looking for." },
    { author: "Malik", quote: "Hosting workshops has never been easier." }
  ];

  const meetupPlans = [
    {
      id: "makers",
      label: "Builders",
      duo: "Ava + Leo",
      vibe: "Product design • Front-end dev",
      ideas: [
        "Prototype swap at Indie Coffee Lab",
        "Micro-design critique with 3 prompts",
        "Sunset sketch walk along Riverside Park"
      ],
      venues: [
        { name: "Indie Coffee Lab", detail: "Quiet tables · WiFi · Great light" },
        { name: "Civic Innovation Hub", detail: "Whiteboards · outlets · casual" },
        { name: "Riverside Promenade", detail: "Golden hour views · easy stroll" }
      ],
      windows: ["Thu · 6:30 PM", "Sat · 10:00 AM"],
      anchorTime: "Thu · 6:30 PM"
    },
    {
      id: "outdoors",
      label: "Outdoorsy",
      duo: "Maya + Chris",
      vibe: "Trail running • Photography",
      ideas: [
        "Golden-hour photo jog at Cedar Ridge",
        "Smoothie cool-down and route swap",
        "Trail gear show-and-tell back at the lot"
      ],
      venues: [
        { name: "Cedar Ridge Loop", detail: "3.5 mi · light elevation" },
        { name: "Sunrise Smoothies", detail: "Patio seating · 8 min away" },
        { name: "Overlook Deck", detail: "Wide-angle skyline shots" }
      ],
      windows: ["Wed · 7:00 AM", "Sun · 8:30 AM"],
      anchorTime: "Sun · 8:30 AM"
    },
    {
      id: "bookish",
      label: "Bookish",
      duo: "Nina + Harper",
      vibe: "Lit fic • Cozy cafés",
      ideas: [
        "Two-chapter swap with annotated sticky notes",
        "Mini book blind-date at the shelves",
        "Slow coffee & reading hour with no phones"
      ],
      venues: [
        { name: "Paper Crane Books", detail: "Nook seating · staff picks" },
        { name: "Hearth Café", detail: "Cozy sofas · oat matcha" },
        { name: "Central Green", detail: "Shaded lawn for post-read chat" }
      ],
      windows: ["Fri · 5:45 PM", "Sat · 3:00 PM"],
      anchorTime: "Fri · 5:45 PM"
    }
  ];

  const [activeMeetup, setActiveMeetup] = useState(meetupPlans[0]);

  /* ------------------------------------------------------------ */
  /* RENDER */
  /* ------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-white pb-28 dark:bg-slate-950">
      <div className="mx-auto w-full max-w-5xl space-y-10 px-4 py-8">

        {/* HERO */}
        <!-- Same hero section as before... unchanged -->

        {/* AI COACH */}
        <!-- Same AI coach section... unchanged -->

        {/* FEATURES TABS */}
        <!-- Same features tab section... unchanged -->

        {/* AI LOCAL MEETUP PLANNER */}
        <!-- Same meetup planner section... unchanged -->

        {/* EVENTS SLIDER */}
        <!-- Same events section... unchanged -->

        {/* COMMUNITIES */}
        <!-- Same communities section... unchanged -->

        {/* TESTIMONIALS */}
        <!-- Same testimonials section... unchanged -->

      </div>

      {/* FLOATING CTA */}
      <Button
        className="fixed right-4 rounded-full bg-[#f7c145] text-black shadow-lg bottom-[calc(env(safe-area-inset-bottom,0px)+5.5rem)] sm:right-6 sm:bottom-[calc(env(safe-area-inset-bottom,0px)+5.75rem)]"
        onClick={() => handleNavigate("/host/create-event", { requiresAuth: true })}
      >
        <Send className="h-4 w-4 mr-2" /> Host an experience
      </Button>

      {/* SUBSCRIPTION DIALOG */}
      <Dialog open={showSubPrompt} onOpenChange={setShowSubPrompt}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upgrade to Pro</DialogTitle>
            <DialogDescription>
              Premium communities and messaging require a Pro subscription.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              className="bg-[#f7c145] text-black"
              onClick={() => handleNavigate("/profile", { requiresAuth: true })}
            >
              Subscribe
            </Button>
            <Button variant="outline" onClick={() => setShowSubPrompt(false)}>
              Not now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AUTH DIALOG */}
      <Dialog
        open={showAuthPrompt}
        onOpenChange={o => {
          setShowAuthPrompt(o);
          if (!o) setPendingPath(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in to continue</DialogTitle>
            <DialogDescription>
              Log in or create a free account to continue.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button asChild variant="ghost">
              <Link
                to="/login"
                state={{ next: pendingPath ?? undefined }}
                onClick={() => setShowAuthPrompt(false)}
              >
                Sign in
              </Link>
            </Button>
            <Button
              className="bg-[#f7c145] text-black"
              onClick={() => {
                setShowAuthPrompt(false);
                navigate("/signup", {
                  state: { next: pendingPath ?? undefined }
                });
              }}
            >
              Create account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
