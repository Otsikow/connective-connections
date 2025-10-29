import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  CalendarDays,
  ChatCircle,
  Home as HomeIcon,
  MapPin,
  MessageSquare,
  PlayCircle,
  Send,
  Sparkles,
  Star,
  User,
  Users,
} from "lucide-react";
import BackButton from "@/components/BackButton";
import { usePageTitle } from "@/hooks/usePageTitle";

type Feature = {
  value: string;
  title: string;
  description: string;
  highlight: string;
  accent: string;
  cta: { label: string; path: string; requiresSubscription?: boolean };
  secondaryCta?: { label: string; path: string };
  spotlight: { avatar: string; name: string; tagline: string };
};

const Home = () => {
  const navigate = useNavigate();
  usePageTitle("Member Home");
  const [activeFeature, setActiveFeature] = useState("friends");
  const [showSubscribePrompt, setShowSubscribePrompt] = useState(false);
  const isSubscribed = false;

  const features: Feature[] = useMemo(
    () => [
      {
        value: "friends",
        title: "Find your kind of people",
        description:
          "Tell us what lights you up and our matcher introduces you to people already on your wavelength.",
        highlight: "12 new connections matched for you this week.",
        accent: "bg-emerald-500/15 text-emerald-500",
        cta: { label: "Browse matches", path: "/matches" },
        secondaryCta: { label: "Build profile", path: "/profile" },
        spotlight: {
          avatar: "/placeholder.svg",
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
        cta: { label: "View events", path: "/events" },
        secondaryCta: { label: "Host an event", path: "/host/create-event" },
        spotlight: {
          avatar: "/placeholder.svg",
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
        },
        secondaryCta: { label: "Preview groups", path: "/community" },
        spotlight: {
          avatar: "/placeholder.svg",
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
        },
        secondaryCta: { label: "See how it works", path: "/splash" },
        spotlight: {
          avatar: "/placeholder.svg",
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
    },
    {
      id: "2",
      title: "Indie Coffee Crawl",
      date: "Sun, Apr 28",
      location: "Downtown",
      attendees: 32,
      tags: ["Food", "Creative"],
    },
    {
      id: "3",
      title: "After-hours Museum Mixer",
      date: "Thu, May 2",
      location: "Art Haus",
      attendees: 24,
      tags: ["Culture", "Nightlife"],
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

  const handleNavigate = (path: string, requiresSubscription?: boolean) => {
    if (requiresSubscription && !isSubscribed) {
      setShowSubscribePrompt(true);
      return;
    }
    navigate(path);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-muted/30 pb-32">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border/60 backdrop-blur bg-background/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <BackButton fallbackPath="/" className="hidden sm:inline-flex" />
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8B956]/20">
                <Sparkles className="h-5 w-5 text-[#E8B956]" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Welcome to</p>
                <h1 className="text-xl font-bold tracking-tight">Connective</h1>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => navigate("/login")}>
              Log in
            </Button>
            <Button
              className="rounded-full bg-[#E8B956] px-4 text-sm font-semibold text-black hover:bg-[#d9a840]"
              onClick={() => navigate("/signup")}
            >
              Join now
            </Button>
            <Avatar className="h-10 w-10 cursor-pointer" onClick={() => navigate("/profile")}>
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      {/* Feature tabs */}
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pt-10 sm:px-6 lg:pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-4xl border border-border/70 bg-card/90 p-8 shadow-xl sm:p-12">
          <div className="relative z-10 space-y-6">
            <Badge className="rounded-full bg-[#E8B956]/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#b3852f]">
              Experience connections differently
            </Badge>
            <h2 className="text-3xl font-bold sm:text-5xl">
              A social universe built for discovering friends, experiences, and conversations that stick.
            </h2>
            <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
              Connective helps you find people you vibe with, join curated events, and chat with natural prompts.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                size="lg"
                className="rounded-full bg-[#E8B956] text-black hover:bg-[#d9a840]"
                onClick={() => handleNavigate("/signup")}
              >
                Get started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full"
                onClick={() => handleNavigate("/splash")}
              >
                <PlayCircle className="mr-2 h-5 w-5" /> Watch walkthrough
              </Button>
            </div>
          </div>
        </section>

        {/* Feature journeys */}
        <section>
          <h3 className="text-2xl font-bold mb-3">Choose your next move</h3>
          <Tabs value={activeFeature} onValueChange={setActiveFeature} className="w-full">
            <TabsList className="grid w-full grid-cols-4 rounded-full bg-muted/60 p-1">
              {features.map((feature) => (
                <TabsTrigger
                  key={feature.value}
                  value={feature.value}
                  className="rounded-full data-[state=active]:bg-background data-[state=active]:text-foreground"
                >
                  {feature.title.split(" ")[0]}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={selectedFeature.value} className="mt-6">
              <Card className="border-border bg-background/80 p-6">
                <CardHeader>
                  <Badge className={`w-fit px-3 py-1 text-xs font-semibold ${selectedFeature.accent}`}>
                    {selectedFeature.highlight}
                  </Badge>
                  <CardTitle>{selectedFeature.title}</CardTitle>
                  <CardDescription>{selectedFeature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="rounded-full bg-[#E8B956] text-black hover:bg-[#d9a840]"
                    onClick={() => handleNavigate(selectedFeature.cta.path, selectedFeature.cta.requiresSubscription)}
                  >
                    {selectedFeature.cta.label}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        {/* Featured experiences + communities */}
        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="p-6">
            <CardHeader>
              <CardTitle>Featured Experiences</CardTitle>
              <CardDescription>Events hosted by trusted members near you</CardDescription>
            </CardHeader>
            <CardContent>
              <Carousel>
                <CarouselContent>
                  {upcomingEvents.map((event) => (
                    <CarouselItem key={event.id} className="md:basis-1/2">
                      <div className="p-5 rounded-3xl border bg-background/70">
                        <h3 className="font-semibold">{event.title}</h3>
                        <p className="text-sm text-muted-foreground">{event.date} • {event.location}</p>
                        <Button
                          className="mt-4 rounded-full bg-[#E8B956] text-black hover:bg-[#d9a840]"
                          onClick={() => handleNavigate(`/events/${event.id}`)}
                        >
                          Join Event
                        </Button>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-end gap-2 mt-4">
                  <CarouselPrevious className="relative" />
                  <CarouselNext className="relative" />
                </div>
              </Carousel>
            </CardContent>
          </Card>

          <Card className="p-6">
            <CardHeader>
              <CardTitle>Communities You Should See</CardTitle>
              <CardDescription>Preview and join local groups</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {communityStories.map((c) => (
                <div key={c.name} className="rounded-xl border p-4">
                  <p className="font-semibold">{c.name}</p>
                  <p className="text-sm text-muted-foreground">{c.description}</p>
                  <Badge className="mt-2 rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
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
            <Card key={t.author} className="p-6">
              <CardContent className="space-y-4">
                <p className="text-lg font-medium">“{t.quote}”</p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{t.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{t.author}</p>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/90 px-3 py-3 backdrop-blur">
        <div className="mx-auto grid w-full max-w-5xl grid-cols-5 text-center text-xs font-medium text-muted-foreground">
          <button className="flex flex-col items-center text-[#E8B956]">
            <HomeIcon className="h-5 w-5" /> Home
          </button>
          <button onClick={() => handleNavigate("/events")}>
            <CalendarDays className="h-5 w-5" /> Events
          </button>
          <button onClick={() => handleNavigate("/matches")}>
            <Users className="h-5 w-5" /> Friends
          </button>
          <button onClick={() => handleNavigate("/messages", true)}>
            <MessageSquare className="h-5 w-5" /> Chat
          </button>
          <button onClick={() => handleNavigate("/profile")}>
            <User className="h-5 w-5" /> Profile
          </button>
        </div>
      </nav>

      {/* Pro Dialog */}
      <Dialog open={showSubscribePrompt} onOpenChange={setShowSubscribePrompt}>
        <DialogContent>
          <DialogHeader>
            <Badge className="w-fit rounded-full bg-[#E8B956]/20 text-[#a0772d]">Pro Exclusive</Badge>
            <DialogTitle>Upgrade to unlock this experience</DialogTitle>
            <DialogDescription>
              Messaging, premium communities, and hosted events are part of Connective Pro. Subscribe to access them.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button className="rounded-full bg-[#E8B956] text-black" onClick={() => handleNavigate("/profile")}>
              Subscribe now
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => setShowSubscribePrompt(false)}>
              Maybe later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating CTA */}
      <Button
        className="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full bg-[#E8B956] px-5 py-3 text-sm font-semibold text-black shadow-lg hover:bg-[#d9a840]"
        onClick={() => handleNavigate("/host/create-event")}
      >
        <Send className="h-4 w-4" /> Host an experience
      </Button>
    </div>
  );
};

export default Home;
