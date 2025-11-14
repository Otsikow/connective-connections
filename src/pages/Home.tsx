import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselItem, CarouselContent, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Sparkles,
  PlayCircle,
  Users,
  Calendar,
  MapPin,
  Send,
} from "lucide-react";

import BackButton from "@/components/BackButton";
import { useSubscription } from "@/hooks/useSubscription";
import { usePageTitle } from "@/hooks/usePageTitle";
import { generateAvatarUrl } from "@/lib/avatar";
import { cn } from "@/lib/utils";


// ------------------------ //
//     UTILITIES
// ------------------------ //
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


// ------------------------ //
//     MAIN COMPONENT
// ------------------------ //
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

  const userInitials = useMemo(() => deriveInitials(fullName, email), [fullName, email]);
  const userAvatarUrl = generateAvatarUrl(fullName ?? email ?? "connective-user");

  // ------------------------ //
  //     FEATURE DEFINITIONS
  // ------------------------ //
  const features = [
    {
      value: "friends",
      title: "Find your kind of people",
      desc:
        "Tell us what lights you up and we introduce you to people already on your wavelength.",
      highlight: "12 new connections matched for you this week.",
      badge: "bg-emerald-500/15 text-emerald-600",
      cta: { path: "/friend-finder", requiresAuth: true },
      spotlight: {
        avatar: generateAvatarUrl("Jordan spotlight"),
        name: "Jordan",
        tagline: "Met three new hiking buddies",
      },
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
        tagline: "Hosts a monthly poetry circle",
      },
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
        tagline: "Joined the storytellers collective",
      },
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
        tagline: "Had 5 new chats last weekend",
      },
    },
  ];

  const selected = features.find((f) => f.value === activeFeature)!;


  // ------------------------ //
  //     ACCESS HANDLER
  // ------------------------ //
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


  // ------------------------ //
  //     SIMPLE DATA
  // ------------------------ //
  const events = [
    {
      id: "1",
      title: "Sunrise Social Hike",
      date: "Sat, Apr 20",
      location: "Ridgeview Trail",
      attendees: 18,
      tags: ["Outdoors", "Mindfulness"],
      image:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&w=1200&q=80",
    },
    {
      id: "2",
      title: "Indie Coffee Crawl",
      date: "Sun, Apr 28",
      location: "Downtown",
      attendees: 32,
      tags: ["Food", "Creative"],
      image:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&w=1200&q=80",
    },
  ];

  const communities = [
    { name: "The Gathering Table", members: "1.1k members" },
    { name: "Rooftop Runners", members: "2.4k members" },
    { name: "Side Quest Gamers", members: "3.0k members" },
  ];

  const testimonials = [
    { author: "Serena", quote: "Someone finally listened to what I was looking for." },
    { author: "Malik", quote: "Hosting workshops has never been easier." },
  ];


  // ------------------------ //
  //     RENDER
  // ------------------------ //
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-28">

      {/* HEADER */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b bg-white p-4 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <BackButton fallbackPath="/" className="hidden sm:inline-flex" />
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fce8b8]">
              <Sparkles className="h-5 w-5 text-[#c27b1b]" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Welcome to</p>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">Connective</h1>
            </div>
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate("/login")}>Sign in</Button>
            <Button
              className="bg-[#f7c145] text-black"
              onClick={() => {
                setPendingPath(null);
                setShowAuthPrompt(true);
              }}
            >
              Join now
            </Button>
          </div>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Avatar className="h-10 w-10 cursor-pointer" onClick={() => navigate("/profile")}>
                <AvatarImage src={userAvatarUrl} />
                <AvatarFallback>{userInitials}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>View profile</TooltipContent>
          </Tooltip>
        )}
      </header>

      <div className="mx-auto w-full max-w-5xl px-4 py-8 space-y-10">

        {/* HERO */}
        <section className="rounded-3xl border bg-white p-6 shadow dark:bg-slate-900">
          <Badge className="rounded-full bg-[#fff4d1] text-[#a0772d] px-3 py-1">
            Experience connections differently
          </Badge>

          <h2 className="mt-4 text-3xl font-bold dark:text-white">
            Find genuine friends & real experiences—no pressure.
          </h2>

          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Connective helps you find people you vibe with, join curated events,
            and chat naturally.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="bg-[#f7c145] text-black" onClick={() => navigate("/signup")}>
              Get started
            </Button>
            <Button variant="outline" onClick={() => navigate("/splash")}>
              <PlayCircle className="h-4 w-4 mr-2" /> Watch demo
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleNavigate("/community", { requiresAuth: true })}
            >
              <Users className="h-4 w-4 mr-2" /> Explore community
            </Button>
          </div>
        </section>

        {/* FEATURES */}
        <section>
          <Tabs value={activeFeature} onValueChange={setActiveFeature}>
            <TabsList className="grid grid-cols-4 mb-4 rounded-full bg-slate-100 p-1 dark:bg-slate-800">
              {features.map((f) => (
                <TabsTrigger
                  key={f.value}
                  value={f.value}
                  className="rounded-full text-sm data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  {f.title.split(" ")[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selected.value}>
              <Card
                className="cursor-pointer"
                onClick={() =>
                  handleNavigate(selected.cta.path, {
                    requiresAuth: selected.cta.requiresAuth,
                    requiresSubscription: selected.cta.requiresSubscription,
                  })
                }
              >
                <CardHeader>
                  <Badge className={cn("rounded-full px-3 py-1", selected.badge)}>
                    {selected.highlight}
                  </Badge>
                  <CardTitle>{selected.title}</CardTitle>
                  <CardDescription>{selected.desc}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <Button
                    className="bg-[#f7c145] text-black"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigate(selected.cta.path, {
                        requiresAuth: selected.cta.requiresAuth,
                        requiresSubscription: selected.cta.requiresSubscription,
                      });
                    }}
                  >
                    Continue
                  </Button>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={selected.spotlight.avatar} />
                      <AvatarFallback>{selected.spotlight.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{selected.spotlight.name}</p>
                      <p className="text-xs text-slate-500">{selected.spotlight.tagline}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* EVENTS */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Featured Experiences</CardTitle>
              <CardDescription>Events near you</CardDescription>
            </CardHeader>
            <CardContent>
              <Carousel>
                <CarouselContent>
                  {events.map((ev) => (
                    <CarouselItem key={ev.id} className="md:basis-1/2">
                      <div
                        className="rounded-xl border shadow-sm overflow-hidden cursor-pointer"
                        onClick={() =>
                          handleNavigate(`/events/${ev.id}`, { requiresAuth: true })
                        }
                      >
                        <img src={ev.image} className="h-44 w-full object-cover" alt="" />
                        <div className="p-4 space-y-2">
                          <h3 className="font-semibold">{ev.title}</h3>
                          <p className="text-sm text-slate-500">{ev.date}</p>
                          <p className="text-sm text-slate-500">{ev.location}</p>

                          <div className="flex justify-between items-center">
                            <span className="text-sm">{ev.attendees}+ going</span>
                            <Button
                              size="sm"
                              className="bg-[#f7c145] text-black"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNavigate(`/events/${ev.id}`, { requiresAuth: true });
                              }}
                            >
                              Join
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <div className="flex justify-end gap-2 mt-4">
                  <CarouselPrevious className="h-8 w-8" />
                  <CarouselNext className="h-8 w-8" />
                </div>
              </Carousel>
            </CardContent>
          </Card>
        </section>

        {/* COMMUNITIES */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Communities You Should See</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {communities.map((c) => (
                <div
                  key={c.name}
                  className="rounded-xl border p-4 hover:border-[#f7c145] cursor-pointer"
                >
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-sm text-slate-500">{c.members}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* TESTIMONIALS */}
        <section className="grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <Card key={t.author} className="shadow-sm">
              <CardContent className="p-5">
                <p className="text-lg font-medium">“{t.quote}”</p>
                <div className="flex items-center gap-3 mt-4">
                  <Avatar>
                    <AvatarImage src={generateAvatarUrl(t.author)} />
                    <AvatarFallback>{t.author[0]}</AvatarFallback>
                  </Avatar>
                  <span className="font-semibold">{t.author}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </div>

      {/* Floating CTA */}
      <Button
        className="fixed bottom-20 right-4 rounded-full bg-[#f7c145] text-black shadow-lg"
        onClick={() => handleNavigate("/host/create-event", { requiresAuth: true })}
      >
        <Send className="h-4 w-4 mr-2" /> Host an experience
      </Button>

      {/* PRO DIALOG */}
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
        onOpenChange={(o) => {
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
                navigate("/signup", { state: { next: pendingPath ?? undefined } });
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
