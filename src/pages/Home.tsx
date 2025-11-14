import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  ArrowRight,
  MessageCircle,
  MapPin,
  PlayCircle,
  Send,
  Sparkles,
  Star,
  Calendar,
  Users,
} from "lucide-react";
import BackButton from "@/components/BackButton";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useSubscription } from "@/hooks/useSubscription";
import { generateAvatarUrl } from "@/lib/avatar";

type Feature = {
  value: string;
  title: string;
  description: string;
  highlight: string;
  accent: string;
  cta: { label: string; path: string; requiresSubscription?: boolean; requiresAuth?: boolean };
  secondaryCta?: { label: string; path: string };
  spotlight: { avatar: string; name: string; tagline: string };
};

const deriveInitials = (fullName?: string | null, email?: string | null) => {
  const normalizedName = fullName?.trim();
  if (normalizedName) {
    const parts = normalizedName.split(/\s+/).filter(Boolean);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    const first = parts[0]?.charAt(0) ?? "";
    const last = parts[parts.length - 1]?.charAt(0) ?? "";
    const combined = `${first}${last}`;
    if (combined.trim()) {
      return combined.toUpperCase();
    }
  }

  const identifier = email?.split("@")[0]?.trim();
  if (identifier) {
    const segments = identifier.split(/[._-]+/).filter(Boolean);
    if (segments.length === 1) {
      const segment = segments[0];
      if (segment.length >= 2) {
        return segment.slice(0, 2).toUpperCase();
      }
      return segment.charAt(0).toUpperCase();
    }
    const first = segments[0]?.charAt(0) ?? "";
    const last = segments[segments.length - 1]?.charAt(0) ?? "";
    const combined = `${first}${last}`;
    if (combined.trim()) {
      return combined.toUpperCase();
    }
  }

  return "U";
};

const Home = () => {
  const navigate = useNavigate();
  usePageTitle("Member Home");
  const [activeFeature, setActiveFeature] = useState("friends");
  const [showSubscribePrompt, setShowSubscribePrompt] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const { userId, fullName, email, tier } = useSubscription();
  const isSubscribed = tier !== "basic";

  const userInitials = useMemo(() => deriveInitials(fullName, email), [fullName, email]);
  const avatarAltText = fullName ? `${fullName}'s profile avatar` : "User profile avatar";
  const userAvatarSeed = fullName ?? email ?? userId ?? "connective-member";
  const userAvatarUrl = generateAvatarUrl(userAvatarSeed);

  const features: Feature[] = useMemo(
    () => [
      {
        value: "friends",
        title: "Find your kind of people",
        description:
          "Tell us what lights you up and our matcher introduces you to people already on your wavelength.",
        highlight: "12 new connections matched for you this week.",
        accent: "bg-emerald-500/15 text-emerald-500",
        cta: { label: "Browse matches", path: "/friend-finder", requiresAuth: true },
        secondaryCta: { label: "Build profile", path: "/profile" },
        spotlight: {
          avatar: generateAvatarUrl("Jordan hiking spotlight"),
          name: "Jordan",
          tagline: "Met three new hiking buddies",
        },
      },
      {
        value: "events",
        title: "Discover local experiences",
        description:
          "Curated gatherings, classes, and adventures hosted by our community. Save your spot before they fill up!",
        highlight: "Over 120 experiences this month in your area.",
        accent: "bg-indigo-500/15 text-indigo-500",
        cta: { label: "View events", path: "/events", requiresAuth: true },
        secondaryCta: { label: "Host an event", path: "/host/create-event" },
        spotlight: {
          avatar: generateAvatarUrl("Lucia poetry spotlight"),
          name: "Lucia",
          tagline: "Hosts a monthly poetry circle",
        },
      },
      {
        value: "join",
        title: "Join meaningful groups",
        description:
          "Micro-communities designed around interests, identities, and vibes. Join the conversation instantly.",
        highlight: "4 new communities recommended for you today.",
        accent: "bg-amber-500/15 text-amber-500",
        cta: {
          label: "Explore communities",
          path: "/community",
          requiresSubscription: true,
          requiresAuth: true,
        },
        secondaryCta: { label: "Preview groups", path: "/community" },
        spotlight: {
          avatar: generateAvatarUrl("Priya storytellers spotlight"),
          name: "Priya",
          tagline: "Joined the storytellers collective",
        },
      },
      {
        value: "chat",
        title: "Chat without awkward starts",
        description:
          "Guided prompts and conversation starters keep the energy natural. Go from hey to hangout in minutes.",
        highlight: "Instant translation in 28 languages with Pro.",
        accent: "bg-rose-500/15 text-rose-500",
        cta: {
          label: "Open messages",
          path: "/messages",
          requiresSubscription: true,
          requiresAuth: true,
        },
        secondaryCta: { label: "See how it works", path: "/splash" },
        spotlight: {
          avatar: generateAvatarUrl("Miguel chats spotlight"),
          name: "Miguel",
          tagline: "Had 5 new chats last weekend",
        },
      },
    ],
    []
  );

  const upcomingEvents = [
    {
      id: "1",
      title: "Sunrise Social Hike",
      date: "Sat, Apr 20",
      location: "Ridgeview Trail",
      attendees: 18,
      tags: ["Outdoors", "Mindfulness"],
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "Friends hiking together along a mountain ridge at sunrise.",
    },
    {
      id: "2",
      title: "Indie Coffee Crawl",
      date: "Sun, Apr 28",
      location: "Downtown",
      attendees: 32,
      tags: ["Food", "Creative"],
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "People enjoying coffee tasting flights at a cozy cafe.",
    },
    {
      id: "3",
      title: "After-hours Museum Mixer",
      date: "Thu, May 2",
      location: "Art Haus",
      attendees: 24,
      tags: ["Culture", "Nightlife"],
      image:
        "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "Guests mingling inside a modern art museum during the evening.",
    },
  ];

  const communityStories = [
    {
      name: "The Gathering Table",
      description:
        "Weekly supper club for locals who love experimenting in the kitchen.",
      members: "1.1k members",
    },
    {
      name: "Rooftop Runners",
      description:
        "Sunset runs followed by restorative yoga led by coaches.",
      members: "2.4k members",
    },
    {
      name: "Side Quest Gamers",
      description:
        "Co-op campaigns, tabletop nights, and IRL tournaments.",
      members: "3.0k members",
    },
  ];

  const testimonials = [
    {
      quote:
        "The way Connective curates introductions feels like someone finally listened to what I was actually looking for.",
      author: "Serena",
      role: "Member since 2023",
    },
    {
      quote:
        "Hosting workshops has never been easier. Every event is filled with people who genuinely want to be there.",
      author: "Malik",
      role: "Event host",
    },
  ];

  const selectedFeature =
    features.find((feature) => feature.value === activeFeature) ?? features[0];

  const handleNavigate = (
    path: string,
    options?: { requiresSubscription?: boolean; requiresAuth?: boolean },
  ) => {
    const requiresSubscription = options?.requiresSubscription;
    const requiresAuth = options?.requiresAuth;

    if (requiresAuth && !userId) {
      setPendingPath(path);
      setShowAuthPrompt(true);
      return;
    }

    if (requiresSubscription && !isSubscribed) {
      setShowSubscribePrompt(true);
      return;
    }
    navigate(path);
  };

  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_top,_#f6f9ff,_#fffdf6_55%,_#fff8ed)] pb-32 text-slate-800 dark:bg-gradient-to-b dark:from-slate-950 dark:via-slate-950/90 dark:to-slate-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(120%_60%_at_50%_-20%,rgba(244,244,255,0.8),rgba(244,244,255,0)),radial-gradient(80%_50%_at_0%_0%,rgba(255,240,220,0.7),rgba(255,240,220,0))] dark:hidden" />
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/40 bg-white/85 backdrop-blur-xl shadow-[0_1px_0_rgba(15,23,42,0.08)] transition-all dark:border-slate-800/60 dark:bg-slate-950/70 dark:shadow-none">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <BackButton fallbackPath="/" className="hidden sm:inline-flex" />
            <div className="flex items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fce9c8] via-[#f8d7bd] to-[#f5cde2] shadow-sm">
                <Sparkles className="h-5 w-5 text-[#c27b1b]" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Welcome to</p>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Connective</h1>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => navigate("/login")}>
              Log in
            </Button>
            <Button
              className="rounded-full bg-[#f7c145] px-4 text-sm font-semibold text-black shadow-sm hover:bg-[#f3b52a]"
              onClick={() => navigate("/signup")}
            >
              Join now
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar
                  className="h-10 w-10 cursor-pointer ring-2 ring-[#f7c145]/80 ring-offset-2 ring-offset-white transition-shadow hover:shadow-lg dark:ring-[#f4c96c]/90 dark:ring-offset-slate-950"
                  onClick={() => navigate("/profile")}
                >
                  <AvatarImage src={userAvatarUrl} alt={avatarAltText} />
                  <AvatarFallback className="bg-gradient-to-br from-[#f7c145] via-[#f3b52a] to-[#e89c1f] text-sm font-bold uppercase text-white shadow-sm dark:from-slate-700 dark:via-slate-700 dark:to-slate-600 dark:text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="bottom" align="center">
                View Profile
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </header>

      {/* Feature tabs */}
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pt-10 sm:px-6 lg:pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-4xl border border-white/70 bg-white/95 p-8 shadow-[0_25px_70px_-30px_rgba(148,163,184,0.55)] backdrop-blur-sm transition dark:border-slate-800/70 dark:bg-slate-950/80">
          <div className="pointer-events-none absolute -right-12 top-[-120px] h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(253,236,200,0.55),_rgba(255,255,255,0))]" />
          <div className="pointer-events-none absolute -left-10 bottom-[-160px] h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(214,231,255,0.45),_rgba(255,255,255,0))]" />
          <div className="relative z-10 space-y-6">
            <Badge className="rounded-full bg-gradient-to-r from-[#fbe7c0] via-[#ffe6d5] to-[#f5f0ff] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#b27a1d] shadow-sm">
              Experience connections differently
            </Badge>
            <h2 className="text-3xl font-bold text-slate-900 sm:text-5xl dark:text-white">
              Built to help you find genuine friends first—and share the experiences and conversations that last.
            </h2>
            <p className="max-w-2xl text-base text-slate-600 sm:text-lg dark:text-slate-200">
              Connective helps you find people you vibe with, join curated events, and chat with natural prompts.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="rounded-full bg-[#f7c145] text-black shadow-sm hover:bg-[#f3b52a]"
                onClick={() => handleNavigate("/signup")}
              >
                Get started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full border-slate-200 bg-white/80 text-slate-700 hover:bg-white"
                onClick={() => handleNavigate("/splash")}
              >
                <PlayCircle className="mr-2 h-5 w-5" /> Watch walkthrough
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className={cn(
                  "rounded-full border border-[#f7c145]/40 bg-white/85 text-slate-700 shadow-sm hover:bg-[#fff4d6]",
                  "dark:border-[#f7c145]/40 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-900",
                )}
                onClick={() => handleNavigate("/community", { requiresAuth: true })}
              >
                <Users className="mr-2 h-5 w-5" /> Explore community
              </Button>
            </div>
          </div>
        </section>

        {/* Feature journeys */}
        <section>
          <h3 className="mb-3 text-2xl font-bold text-slate-900 dark:text-white">Choose your next move</h3>
          <Tabs value={activeFeature} onValueChange={setActiveFeature} className="w-full">
            <TabsList className="grid w-full grid-cols-4 rounded-full bg-white/80 p-1 shadow-inner backdrop-blur dark:bg-slate-900/50">
              {features.map((feature) => (
                <TabsTrigger
                  key={feature.value}
                  value={feature.value}
                  className="rounded-full text-slate-500 transition data-[state=active]:bg-[#fef7e6] data-[state=active]:text-slate-900 data-[state=active]:shadow-sm dark:text-slate-300 dark:data-[state=active]:bg-slate-800 dark:data-[state=active]:text-white"
                >
                  {feature.title.split(" ")[0]}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={selectedFeature.value} className="mt-6">
              <Card
                role="button"
                tabIndex={0}
                className="border border-white/70 bg-white/95 p-6 shadow-[0_20px_45px_-25px_rgba(148,163,184,0.6)] transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f7c145] focus-visible:ring-offset-2 dark:border-slate-800/70 dark:bg-slate-950/80 hover:-translate-y-0.5 hover:shadow-[0_30px_60px_-32px_rgba(148,163,184,0.7)] cursor-pointer"
                onClick={() =>
                  handleNavigate(selectedFeature.cta.path, {
                    requiresSubscription: selectedFeature.cta.requiresSubscription,
                    requiresAuth: selectedFeature.cta.requiresAuth,
                  })
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleNavigate(selectedFeature.cta.path, {
                      requiresSubscription: selectedFeature.cta.requiresSubscription,
                      requiresAuth: selectedFeature.cta.requiresAuth,
                    });
                  }
                }}
              >
                <CardHeader>
                  <Badge className={`w-fit rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${selectedFeature.accent}`}>
                    {selectedFeature.highlight}
                  </Badge>
                  <CardTitle>{selectedFeature.title}</CardTitle>
                  <CardDescription>{selectedFeature.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <Button
                    className="rounded-full bg-[#f7c145] text-black shadow-sm hover:bg-[#f3b52a]"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleNavigate(selectedFeature.cta.path, {
                        requiresSubscription: selectedFeature.cta.requiresSubscription,
                        requiresAuth: selectedFeature.cta.requiresAuth,
                      });
                    }}
                  >
                    {selectedFeature.cta.label}
                  </Button>
                  <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white/80 px-4 py-3 text-left shadow-sm transition dark:border-slate-800/70 dark:bg-slate-900/70">
                    <Avatar className="h-12 w-12 ring-2 ring-white/80 dark:ring-slate-950/80">
                      <AvatarImage
                        src={selectedFeature.spotlight.avatar}
                        alt={`${selectedFeature.spotlight.name} spotlight profile`}
                      />
                      <AvatarFallback>{selectedFeature.spotlight.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-0.5">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {selectedFeature.spotlight.name}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {selectedFeature.spotlight.tagline}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Featured experiences + communities */}
        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="border border-white/70 bg-white/95 p-6 shadow-[0_25px_60px_-30px_rgba(148,163,184,0.5)] dark:border-slate-800/70 dark:bg-slate-950/80">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Featured Experiences</CardTitle>
              <CardDescription>Events hosted by trusted members near you</CardDescription>
            </CardHeader>
            <CardContent>
              <Carousel>
                <CarouselContent>
                  {upcomingEvents.map((event) => (
                    <CarouselItem key={event.id} className="md:basis-1/2">
                      <div
                        className="overflow-hidden rounded-3xl border border-white/70 bg-white/95 shadow-[0_15px_35px_-20px_rgba(148,163,184,0.5)] backdrop-blur-sm dark:border-slate-800/70 dark:bg-slate-900 cursor-pointer hover:border-primary/80"
                        onClick={() =>
                          handleNavigate(`/events/${event.id}`, { requiresAuth: true })
                        }
                      >
                        <div className="relative h-48 w-full overflow-hidden">
                          <img
                            src={event.image}
                            alt={event.imageAlt}
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                            {event.tags.map((tag) => (
                              <Badge
                                key={`${event.id}-${tag}`}
                                className="rounded-full bg-white/85 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur dark:bg-slate-900/70 dark:text-slate-100"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-4 px-5 pb-5 pt-6">
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold leading-tight">{event.title}</h3>
                            <div className="space-y-1 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{event.date}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-300">
                            <span>{event.attendees}+ attending</span>
                            <Button
                              size="sm"
                              className="rounded-full bg-[#f7c145] px-5 text-black shadow-sm hover:bg-[#f3b52a]"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNavigate(`/events/${event.id}`, { requiresAuth: true })
                              }}
                            >
                              Join Event
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="mt-5 flex items-center justify-end gap-2">
                  <CarouselPrevious
                    variant="ghost"
                    className="!static h-10 w-10 rounded-full border border-border bg-background/80 text-foreground shadow-sm backdrop-blur hover:bg-background"
                  />
                  <CarouselNext
                    variant="ghost"
                    className="!static h-10 w-10 rounded-full border border-border bg-background/80 text-foreground shadow-sm backdrop-blur hover:bg-background"
                  />
                </div>
              </Carousel>
            </CardContent>
          </Card>

          <Card className="border border-white/70 bg-white/95 p-6 shadow-[0_25px_60px_-30px_rgba(148,163,184,0.5)] dark:border-slate-800/70 dark:bg-slate-950/80">
            <CardHeader>
              <CardTitle className="text-slate-900 dark:text-white">Communities You Should See</CardTitle>
              <CardDescription>Preview and join local groups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {communityStories.map((c) => (
                <div key={c.name} className="rounded-xl border border-slate-100 bg-white/80 p-4 shadow-sm transition hover:border-[#f7c145]/50 hover:shadow-[0_15px_30px_-25px_rgba(247,193,69,0.7)] dark:border-slate-800 dark:bg-slate-900/70">
                  <p className="font-semibold text-slate-900 dark:text-white">{c.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-300">{c.description}</p>
                  <Badge className="mt-2 rounded-full bg-[#fef7e6] px-3 py-1 text-xs text-slate-600 shadow-sm dark:bg-slate-800 dark:text-slate-200">
                    {c.members}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Testimonials */}
        <section className="grid gap-6 lg:grid-cols-2">
          {testimonials.map((t) => (
            <Card
              key={t.author}
              className="border border-white/70 bg-white/95 p-6 shadow-[0_20px_50px_-28px_rgba(148,163,184,0.6)] transition hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(148,163,184,0.65)] dark:border-slate-800/70 dark:bg-slate-950/80"
            >
              <CardContent className="space-y-4">
                <p className="text-lg font-medium text-slate-800 dark:text-slate-100">“{t.quote}”</p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={generateAvatarUrl(`${t.author} testimonial`)} alt={`${t.author} testimonial avatar`} />
                    <AvatarFallback>{t.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{t.author}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-300">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>

      {/* Pro Dialog */}
      <Dialog open={showSubscribePrompt} onOpenChange={setShowSubscribePrompt}>
        <DialogContent>
          <DialogHeader>
            <Badge className="w-fit rounded-full bg-[#fef3d5] text-[#a0772d]">Pro Exclusive</Badge>
            <DialogTitle>Upgrade to unlock this experience</DialogTitle>
            <DialogDescription>
              Messaging, premium communities, and hosted events are part of Connective Pro. Subscribe to access them.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button
              className="rounded-full bg-[#f7c145] text-black shadow-sm hover:bg-[#f3b52a]"
              onClick={() => handleNavigate("/profile", { requiresAuth: true })}
            >
              Subscribe now
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => setShowSubscribePrompt(false)}>
              Maybe later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showAuthPrompt}
        onOpenChange={(open) => {
          setShowAuthPrompt(open);
          if (!open) {
            setPendingPath(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in to continue</DialogTitle>
            <DialogDescription>
              Create a free account or log in to join events, start chats, and make new connections.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3 sm:justify-between">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => {
                setShowAuthPrompt(false);
                setPendingPath(null);
              }}
            >
              Keep exploring
            </Button>
            <div className="flex flex-1 justify-end gap-3">
              <Button
                variant="ghost"
                className="rounded-full"
                onClick={() => {
                  setShowAuthPrompt(false);
                  if (pendingPath) {
                    navigate("/login", { state: { next: pendingPath } });
                  } else {
                    navigate("/login");
                  }
                  setPendingPath(null);
                }}
              >
                Sign in
              </Button>
              <Button
                className="rounded-full bg-[#f7c145] text-black shadow-sm hover:bg-[#f3b52a]"
                onClick={() => {
                  setShowAuthPrompt(false);
                  if (pendingPath) {
                    navigate("/signup", { state: { next: pendingPath } });
                  } else {
                    navigate("/signup");
                  }
                  setPendingPath(null);
                }}
              >
                Create account
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating CTA */}
      <Button
        className="fixed bottom-[6.5rem] right-4 z-40 flex items-center gap-2 rounded-full bg-[#f7c145] px-5 py-3 text-sm font-semibold text-black shadow-lg hover:bg-[#f3b52a] md:bottom-20"
        onClick={() => handleNavigate("/host/create-event", { requiresAuth: true })}
      >
        <Send className="h-4 w-4" /> Host an experience
      </Button>
    </div>
  );
};

export default Home;
