import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Carousel, CarouselItem, CarouselContent, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Sparkles, PlayCircle, Users, Send, MapPin, Clock, CalendarCheck2, Wand2 } from "lucide-react";
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
  const {
    userId,
    fullName,
    email,
    tier
  } = useSubscription();
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
  const features = [{
    value: "friends",
    title: "Find your kind of people",
    desc: "Tell us what lights you up and we introduce you to people already on your wavelength.",
    highlight: "12 new connections matched for you this week.",
    badge: "bg-emerald-500/15 text-emerald-600",
    cta: {
      path: "/friend-finder",
      requiresAuth: true
    },
    spotlight: {
      avatar: generateAvatarUrl("Jordan spotlight"),
      name: "Jordan",
      tagline: "Met three new hiking buddies"
    }
  }, {
    value: "events",
    title: "Discover local experiences",
    desc: "Curated gatherings, classes, and adventures hosted by members.",
    highlight: "120 local experiences this month.",
    badge: "bg-blue-500/15 text-blue-600",
    cta: {
      path: "/events",
      requiresAuth: true
    },
    spotlight: {
      avatar: generateAvatarUrl("Lucia spotlight"),
      name: "Lucia",
      tagline: "Hosts a monthly poetry circle"
    }
  }, {
    value: "groups",
    title: "Join meaningful groups",
    desc: "Micro-communities built around interests and vibes.",
    highlight: "4 new communities recommended today.",
    badge: "bg-amber-500/15 text-amber-600",
    cta: {
      path: "/community",
      requiresAuth: true,
      requiresSubscription: true
    },
    spotlight: {
      avatar: generateAvatarUrl("Priya spotlight"),
      name: "Priya",
      tagline: "Joined the storytellers collective"
    }
  }, {
    value: "chat",
    title: "Chat without awkward starts",
    desc: "Guided prompts keep conversations natural and fun.",
    highlight: "Instant translation in 28 languages with Pro.",
    badge: "bg-rose-500/15 text-rose-600",
    cta: {
      path: "/messages",
      requiresAuth: true,
      requiresSubscription: true
    },
    spotlight: {
      avatar: generateAvatarUrl("Miguel spotlight"),
      name: "Miguel",
      tagline: "Had 5 new chats last weekend"
    }
  }];
  const selected = features.find(f => f.value === activeFeature)!;

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
  const events = [{
    id: "1",
    title: "Sunrise Social Hike",
    date: "Sat, Apr 20",
    location: "Ridgeview Trail",
    attendees: 18,
    tags: ["Outdoors", "Mindfulness"],
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&w=1200&q=80"
  }, {
    id: "2",
    title: "Indie Coffee Crawl",
    date: "Sun, Apr 28",
    location: "Downtown",
    attendees: 32,
    tags: ["Food", "Creative"],
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&w=1200&q=80"
  }];
  const communities = [{
    name: "The Gathering Table",
    members: "1.1k members"
  }, {
    name: "Rooftop Runners",
    members: "2.4k members"
  }, {
    name: "Side Quest Gamers",
    members: "3.0k members"
  }];
  const testimonials = [{
    author: "Serena",
    quote: "Someone finally listened to what I was looking for."
  }, {
    author: "Malik",
    quote: "Hosting workshops has never been easier."
  }];
  const meetupPlans = [{
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
  }, {
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
  }, {
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
  }];
  const [activeMeetup, setActiveMeetup] = useState(meetupPlans[0]);

  // ------------------------ //
  //     RENDER
  // ------------------------ //
  return <div className="min-h-screen bg-white pb-28 dark:bg-slate-950">

      <div className="mx-auto w-full max-w-5xl space-y-10 px-4 py-8">

        

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
            <Button variant="ghost" onClick={() => handleNavigate("/community", {
            requiresAuth: true
          })}>
              <Users className="h-4 w-4 mr-2" /> Explore community
            </Button>
          </div>
        </section>

        {/* FEATURES */}
        <section>
          <Tabs value={activeFeature} onValueChange={setActiveFeature}>
            <TabsList className="grid grid-cols-4 mb-4 rounded-full bg-slate-100 p-1 dark:bg-slate-800">
              {features.map(f => <TabsTrigger key={f.value} value={f.value} className="rounded-full text-sm data-[state=active]:bg-white data-[state=active]:text-black">
                  {f.title.split(" ")[0]}
                </TabsTrigger>)}
            </TabsList>

            <TabsContent value={selected.value}>
              <Card className="cursor-pointer" onClick={() => handleNavigate(selected.cta.path, {
              requiresAuth: selected.cta.requiresAuth,
              requiresSubscription: selected.cta.requiresSubscription
            })}>
                <CardHeader>
                  <Badge className={cn("rounded-full px-3 py-1", selected.badge)}>
                    {selected.highlight}
                  </Badge>
                  <CardTitle>{selected.title}</CardTitle>
                  <CardDescription>{selected.desc}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <Button className="bg-[#f7c145] text-black" onClick={e => {
                  e.stopPropagation();
                  handleNavigate(selected.cta.path, {
                    requiresAuth: selected.cta.requiresAuth,
                    requiresSubscription: selected.cta.requiresSubscription
                  });
                }}>
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

        {/* AI LOCAL MEETUP PLANNER */}
        <section>
          <Card className="overflow-hidden border-2 border-[#f7c145]/50 bg-gradient-to-br from-white to-amber-50 dark:from-slate-900 dark:to-slate-900/40">
            <div className="flex items-center justify-between gap-3 border-b px-6 py-4 dark:border-slate-800">
              <div>
                <Badge className="rounded-full bg-[#f7c145] text-black">New</Badge>
                <CardTitle className="mt-2 text-2xl">AI Local Meetup Planner</CardTitle>
                <CardDescription>Move from chat → confirmed plans without the back-and-forth.</CardDescription>
              </div>
              <div className="hidden items-center gap-2 rounded-full bg-black px-3 py-1 text-sm font-semibold text-white shadow-sm dark:bg-white dark:text-black md:flex">
                <Sparkles className="h-4 w-4" /> Instant plan cards
              </div>
            </div>

            <CardContent className="grid gap-6 px-6 py-6 lg:grid-cols-[1.2fr_1fr]">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {meetupPlans.map(plan => (
                    <Button
                      key={plan.id}
                      variant={activeMeetup.id === plan.id ? "default" : "outline"}
                      className={cn(
                        "rounded-full border-amber-200 text-sm",
                        activeMeetup.id === plan.id
                          ? "bg-[#f7c145] text-black hover:bg-[#f5b92a]"
                          : "bg-white/70 dark:bg-slate-900"
                      )}
                      onClick={() => setActiveMeetup(plan)}
                    >
                      {plan.label}
                    </Button>
                  ))}
                </div>

                <div className="rounded-2xl border bg-white/80 p-4 shadow-sm ring-1 ring-amber-100 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80 dark:ring-amber-200/20">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-300">Suggested duo</p>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">{activeMeetup.duo}</p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{activeMeetup.vibe}</p>
                    </div>
                    <Button
                      className="bg-black text-white hover:bg-slate-800 dark:bg-white dark:text-black"
                      onClick={() => handleNavigate("/messages", { requiresAuth: true })}
                    >
                      Send plan to chat
                    </Button>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                        <Wand2 className="h-4 w-4 text-amber-500" /> 3 meetup ideas
                      </div>
                      <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                        {activeMeetup.ideas.map(idea => (
                          <li key={idea} className="rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2 dark:border-amber-200/30 dark:bg-amber-50/5">
                            {idea}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
                        <MapPin className="h-4 w-4 text-amber-500" /> Local venues
                      </div>
                      <div className="space-y-2">
                        {activeMeetup.venues.map(venue => (
                          <div key={venue.name} className="rounded-lg border border-slate-200/80 bg-white px-3 py-2 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <p className="font-medium text-slate-900 dark:text-white">{venue.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{venue.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl border-2 border-amber-200 bg-white p-5 shadow-lg shadow-amber-100/60 dark:border-amber-200/50 dark:bg-slate-900">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-amber-600 dark:text-amber-300">Meetup Plan Card</p>
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">Ready to confirm</Badge>
                  </div>
                  <p className="mt-1 text-lg font-bold text-slate-900 dark:text-white">{activeMeetup.anchorTime}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">AI found overlapping availability</p>

                  <div className="mt-4 space-y-3 text-sm">
                    {activeMeetup.windows.map(slot => (
                      <div key={slot} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200">
                        <Clock className="h-4 w-4 text-amber-500" /> {slot}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200">
                    <CalendarCheck2 className="h-4 w-4 text-amber-500" />
                    Auto-syncs to both calendars once they confirm in chat.
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button className="bg-[#f7c145] text-black" onClick={() => handleNavigate("/events", { requiresAuth: true })}>
                      Confirm plan
                    </Button>
                    <Button variant="outline" onClick={() => handleNavigate("/messages", { requiresAuth: true })}>
                      Share to thread
                    </Button>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                  <p className="font-semibold text-slate-900 dark:text-white">How it reduces friction</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    <li>Pairs mutual interests from both profiles.</li>
                    <li>Filters venues by distance, vibe, and accessibility.</li>
                    <li>Locks only times that overlap for both calendars.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
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
                  {events.map(ev => <CarouselItem key={ev.id} className="md:basis-1/2">
                      <div className="rounded-xl border shadow-sm overflow-hidden cursor-pointer" onClick={() => handleNavigate(`/events/${ev.id}`, {
                    requiresAuth: true
                  })}>
                        <img src={ev.image} className="h-44 w-full object-cover" alt="" />
                        <div className="p-4 space-y-2">
                          <h3 className="font-semibold">{ev.title}</h3>
                          <p className="text-sm text-slate-500">{ev.date}</p>
                          <p className="text-sm text-slate-500">{ev.location}</p>

                          <div className="flex justify-between items-center">
                            <span className="text-sm">{ev.attendees}+ going</span>
                            <Button size="sm" className="bg-[#f7c145] text-black" onClick={e => {
                          e.stopPropagation();
                          handleNavigate(`/events/${ev.id}`, {
                            requiresAuth: true
                          });
                        }}>
                              Join
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>)}
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
              {communities.map(c => <div key={c.name} className="rounded-xl border p-4 hover:border-[#f7c145] cursor-pointer">
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-sm text-slate-500">{c.members}</p>
                </div>)}
            </CardContent>
          </Card>
        </section>

        {/* TESTIMONIALS */}
        <section className="grid gap-6 md:grid-cols-2">
          {testimonials.map(t => <Card key={t.author} className="shadow-sm">
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
            </Card>)}
        </section>
      </div>

      {/* Floating CTA */}
      <Button className="fixed right-4 rounded-full bg-[#f7c145] text-black shadow-lg bottom-[calc(env(safe-area-inset-bottom,0px)+5.5rem)] sm:right-6 sm:bottom-[calc(env(safe-area-inset-bottom,0px)+5.75rem)]" onClick={() => handleNavigate("/host/create-event", {
        requiresAuth: true
      })}>
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
            <Button className="bg-[#f7c145] text-black" onClick={() => handleNavigate("/profile", {
            requiresAuth: true
          })}>
              Subscribe
            </Button>
            <Button variant="outline" onClick={() => setShowSubPrompt(false)}>
              Not now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* AUTH DIALOG */}
      <Dialog open={showAuthPrompt} onOpenChange={o => {
      setShowAuthPrompt(o);
      if (!o) setPendingPath(null);
    }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sign in to continue</DialogTitle>
            <DialogDescription>
              Log in or create a free account to continue.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button asChild variant="ghost">
              <Link to="/login" state={{
              next: pendingPath ?? undefined
            }} onClick={() => setShowAuthPrompt(false)}>
                Sign in
              </Link>
            </Button>
            <Button className="bg-[#f7c145] text-black" onClick={() => {
            setShowAuthPrompt(false);
            navigate("/signup", {
              state: {
                next: pendingPath ?? undefined
              }
            });
          }}>
              Create account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>;
};
export default Home;