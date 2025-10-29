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
        spotlight: { avatar: "/placeholder.svg", name: "Jordan", tagline: "Met three new hiking buddies" },
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
        spotlight: { avatar: "/placeholder.svg", name: "Lucia", tagline: "Hosts a monthly poetry circle" },
      },
      {
        value: "join",
        title: "Join meaningful groups",
        description:
          "Micro-communities designed around interests, identities, and vibes. Join the conversation instantly.",
        highlight: "4 new communities recommended for you today.",
        accent: "bg-amber-500/15 text-amber-500",
        cta: { label: "Explore communities", path: "/community", requiresSubscription: true },
        secondaryCta: { label: "Preview groups", path: "/community" },
        spotlight: { avatar: "/placeholder.svg", name: "Priya", tagline: "Joined the storytellers collective" },
      },
      {
        value: "chat",
        title: "Chat without awkward starts",
        description:
          "Guided prompts and conversation starters keep the energy natural. Go from hey to hangout in minutes.",
        highlight: "Instant translation in 28 languages with Pro.",
        accent: "bg-rose-500/15 text-rose-500",
        cta: { label: "Open messages", path: "/messages", requiresSubscription: true },
        secondaryCta: { label: "See how it works", path: "/splash" },
        spotlight: { avatar: "/placeholder.svg", name: "Miguel", tagline: "Had 5 new chats last weekend" },
      },
    ],
    [],
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
      description: "Weekly supper club for locals who love experimenting in the kitchen.",
      members: "1.1k members",
    },
    {
      name: "Rooftop Runners",
      description: "Sunset runs followed by restorative yoga led by coaches.",
      members: "2.4k members",
    },
    {
      name: "Side Quest Gamers",
      description: "Co-op campaigns, tabletop nights, and IRL tournaments.",
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

  const selectedFeature = features.find((feature) => feature.value === activeFeature) ?? features[0];

  const handleNavigate = (path: string, requiresSubscription?: boolean) => {
    if (requiresSubscription && !isSubscribed) {
      setShowSubscribePrompt(true);
      return;
    }

    navigate(path);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background via-background to-muted/30 pb-32">
      <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(circle_at_top,_rgba(232,185,86,0.25),_transparent_55%)]" />

      <header className="sticky top-0 z-30 border-b border-border/60 backdrop-blur bg-background/80">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <BackButton fallbackPath="/" size="icon" className="hidden h-10 w-10 sm:flex" />
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
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex" onClick={() => navigate("/login")}>Log in</Button>
            <Button
              className="rounded-full bg-[#E8B956] px-4 text-sm font-semibold text-black hover:bg-[#d9a840]"
              onClick={() => navigate("/signup")}
            >
              Join now
            </Button>
            <Avatar className="h-10 w-10 cursor-pointer" onClick={() => navigate("/profile")}>
              <AvatarImage src="/placeholder.svg" alt="Your avatar" />
              <AvatarFallback>YO</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 pt-10 sm:px-6 lg:pt-16">
        <section className="relative overflow-hidden rounded-4xl border border-border/70 bg-card/90 p-8 shadow-xl sm:p-12">
          <div className="absolute right-0 top-0 h-full w-1/2 bg-[radial-gradient(circle_at_top,_rgba(232,185,86,0.18),_transparent_60%)]" />
          <div className="relative z-10 grid gap-12 lg:grid-cols-[1fr_340px] lg:items-center">
            <div className="space-y-6">
              <Badge className="rounded-full bg-[#E8B956]/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#b3852f]">
                Experience connections differently
              </Badge>
              <h2 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
                A social universe built for discovering friends, experiences, and conversations that stick.
              </h2>
              <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
                Connective helps you find people you vibe with, join curated events around town, and keep the chat alive with
                guided prompts and media-rich messaging.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  size="lg"
                  className="rounded-full bg-[#E8B956] px-6 text-base font-semibold text-black hover:bg-[#d9a840]"
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
                  <PlayCircle className="mr-2 h-5 w-5" /> Watch the walkthrough
                </Button>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Members", value: "58k" },
                  { label: "Cities", value: "42" },
                  { label: "Events this week", value: "210" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-border bg-background/70 p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">{stat.label}</p>
                    <p className="mt-1 text-2xl font-semibold">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative hidden h-full min-h-[340px] rounded-3xl bg-gradient-to-br from-[#E8B956]/20 via-transparent to-transparent p-1 lg:block">
              <div className="h-full w-full rounded-[22px] border border-border/70 bg-background/80 p-6 backdrop-blur">
                <p className="text-sm font-medium text-muted-foreground">Live now</p>
                <div className="mt-4 space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base font-semibold">{event.title}</h3>
                          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                            <CalendarDays className="h-4 w-4" /> {event.date}
                          </p>
                          <p className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" /> {event.location}
                          </p>
                        </div>
                        <Badge className="rounded-full bg-[#E8B956]/20 text-[#E8B956]">{event.attendees} attending</Badge>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {event.tags.map((tag) => (
                          <span key={tag} className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-2xl font-bold tracking-tight">Choose your next move</h3>
              <p className="text-sm text-muted-foreground">
                Interactive journeys showcase the core ways Connective helps you meet, mingle, and make plans.
              </p>
            </div>
            <Button
              variant="ghost"
              className="self-start rounded-full text-sm"
              onClick={() => handleNavigate("/dashboard")}
            >
              Explore dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <Tabs value={activeFeature} onValueChange={setActiveFeature} className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-full bg-muted/60 p-1 sm:grid-cols-4">
              {features.map((feature) => (
                <TabsTrigger
                  key={feature.value}
                  value={feature.value}
                  className="rounded-full data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow"
                >
                  {feature.title.split(" ")[0]}
                </TabsTrigger>
              ))}
            </TabsList>
            <TabsContent value={selectedFeature.value} className="mt-6">
              <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                <Card className="border-border/70 bg-background/80 p-6 backdrop-blur">
                  <CardHeader className="space-y-4">
                    <Badge className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${selectedFeature.accent}`}>
                      {selectedFeature.highlight}
                    </Badge>
                    <CardTitle className="text-2xl font-semibold">{selectedFeature.title}</CardTitle>
                    <CardDescription className="text-base text-muted-foreground">
                      {selectedFeature.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Button
                        size="lg"
                        className="rounded-2xl bg-[#E8B956] text-black hover:bg-[#d9a840]"
                        onClick={() => handleNavigate(selectedFeature.cta.path, selectedFeature.cta.requiresSubscription)}
                      >
                        {selectedFeature.cta.label}
                      </Button>
                      {selectedFeature.secondaryCta && (
                        <Button
                          size="lg"
                          variant="outline"
                          className="rounded-2xl"
                          onClick={() => handleNavigate(selectedFeature.secondaryCta!.path)}
                        >
                          {selectedFeature.secondaryCta.label}
                        </Button>
                      )}
                    </div>
                    <div className="rounded-3xl border border-dashed border-border/70 bg-muted/40 p-5 text-sm text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <ChatCircle className="h-5 w-5 text-[#E8B956]" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">Smart suggestions</p>
                          <p>
                            Our AI wingman quietly suggests prompts, icebreakers, and event matches based on your vibe.
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-background/70 p-4 shadow-sm">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={selectedFeature.spotlight.avatar} alt={selectedFeature.spotlight.name} />
                        <AvatarFallback>{selectedFeature.spotlight.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold text-foreground">{selectedFeature.spotlight.name}</p>
                        <p className="text-xs text-muted-foreground">{selectedFeature.spotlight.tagline}</p>
                      </div>
                      <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
                        <Star className="h-4 w-4 text-[#E8B956]" /> Verified story
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-border/70 bg-background/70 p-6 backdrop-blur">
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-xl font-semibold">How it unfolds</CardTitle>
                    <CardDescription>Tap a step to explore the experience in seconds.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      {
                        title: "Set your intentions",
                        description: "Select interests, availability, and energy level so we can tailor every suggestion.",
                      },
                      {
                        title: "Preview curated matches",
                        description: "See friends, events, and communities that align with your goals.",
                      },
                      {
                        title: "Join or chat instantly",
                        description: "Swipe into a chat, RSVP to events, or request an introduction from a host.",
                      },
                    ].map((step, index) => (
                      <button
                        key={step.title}
                        className="group w-full rounded-2xl border border-border/70 bg-background/80 p-4 text-left transition hover:border-[#E8B956]/60 hover:shadow-md"
                        onClick={() => handleNavigate(selectedFeature.cta.path, selectedFeature.cta.requiresSubscription)}
                      >
                        <div className="flex items-start gap-4">
                          <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#E8B956]/20 text-sm font-semibold text-[#8a6623]">
                            {index + 1}
                          </span>
                          <div className="space-y-1">
                            <p className="font-semibold text-foreground">{step.title}</p>
                            <p className="text-sm text-muted-foreground">{step.description}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <Card className="border-border/60 bg-background/80 p-6 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Featured experiences</CardTitle>
              <CardDescription>
                Join events that balance good energy with safety-first planning and thoughtful hosts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Carousel className="w-full">
                <CarouselContent>
                  {upcomingEvents.map((event) => (
                    <CarouselItem key={event.id} className="md:basis-1/2">
                      <div className="flex h-full flex-col justify-between rounded-3xl border border-border/70 bg-background/70 p-5">
                        <div className="space-y-2">
                          <Badge className="w-fit rounded-full bg-[#E8B956]/20 text-[#E8B956]">Limited spots</Badge>
                          <h3 className="text-lg font-semibold">{event.title}</h3>
                          <p className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarDays className="h-4 w-4" /> {event.date}
                          </p>
                          <p className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" /> {event.location}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex -space-x-2">
                            {[1, 2, 3].map((index) => (
                              <Avatar key={index} className="h-10 w-10 border-2 border-background">
                                <AvatarImage src="/placeholder.svg" alt="Attendee" />
                                <AvatarFallback>CC</AvatarFallback>
                              </Avatar>
                            ))}
                          </div>
                          <Button
                            className="rounded-full bg-[#E8B956] text-sm font-semibold text-black hover:bg-[#d9a840]"
                            onClick={() => handleNavigate(`/events/${event.id}`)}
                          >
                            Join event
                          </Button>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="mt-4 flex justify-end gap-2">
                  <CarouselPrevious className="relative" />
                  <CarouselNext className="relative" />
                </div>
              </Carousel>
            </CardContent>
          </Card>

          <Card className="border-border/60 bg-background/80 p-6 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Communities you should see</CardTitle>
              <CardDescription>Preview the vibe, then join to unlock all channels and exclusive drops.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {communityStories.map((community) => (
                <div key={community.name} className="rounded-3xl border border-border/70 bg-background/70 p-5">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-lg font-semibold">{community.name}</p>
                      <p className="text-sm text-muted-foreground">{community.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="rounded-full bg-muted px-3 py-1 text-xs text-muted-foreground">
                        {community.members}
                      </Badge>
                      <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={() => handleNavigate("/community", true)}
                      >
                        Request access
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.author} className="border-border/60 bg-background/80 p-6 backdrop-blur">
              <CardContent className="space-y-6">
                <p className="text-lg font-medium text-foreground">“{testimonial.quote}”</p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder.svg" alt={testimonial.author} />
                    <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>

      <footer className="mt-16 border-t border-border/60 bg-background/80">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-foreground">Ready to unlock everything?</p>
            <p className="text-sm text-muted-foreground">
              Connective Pro gives you unlimited introductions, exclusive events, and premium conversation tools.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button
              className="rounded-full bg-[#E8B956] px-6 text-sm font-semibold text-black hover:bg-[#d9a840]"
              onClick={() => setShowSubscribePrompt(true)}
            >
              Compare plans
            </Button>
            <Button variant="ghost" className="rounded-full text-sm" onClick={() => handleNavigate("/login")}>
              Already a member?
            </Button>
          </div>
        </div>
      </footer>

      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/60 bg-card/90 px-3 py-3 backdrop-blur">
        <div className="mx-auto grid w-full max-w-5xl grid-cols-5 gap-2 text-center text-xs font-medium text-muted-foreground">
          <button className="flex flex-col items-center justify-center gap-1 rounded-2xl bg-[#E8B956]/15 py-2 text-[#a0772d]">
            <HomeIcon className="h-5 w-5" />
            Home
          </button>
          <button
            className="flex flex-col items-center justify-center gap-1 rounded-2xl py-2 hover:text-foreground"
            onClick={() => handleNavigate("/events")}
          >
            <CalendarDays className="h-5 w-5" />
            Events
          </button>
          <button
            className="flex flex-col items-center justify-center gap-1 rounded-2xl py-2 hover:text-foreground"
            onClick={() => handleNavigate("/matches")}
          >
            <Users className="h-5 w-5" />
            Friends
          </button>
          <button
            className="flex flex-col items-center justify-center gap-1 rounded-2xl py-2 hover:text-foreground"
            onClick={() => handleNavigate("/messages", true)}
          >
            <MessageSquare className="h-5 w-5" />
            Chat
          </button>
          <button
            className="flex flex-col items-center justify-center gap-1 rounded-2xl py-2 hover:text-foreground"
            onClick={() => handleNavigate("/profile")}
          >
            <User className="h-5 w-5" />
            Profile
          </button>
        </div>
      </nav>

      <Dialog open={showSubscribePrompt} onOpenChange={setShowSubscribePrompt}>
        <DialogContent>
          <DialogHeader className="space-y-3">
            <Badge className="w-fit rounded-full bg-[#E8B956]/20 text-xs font-semibold text-[#a0772d]">Pro Exclusive</Badge>
            <DialogTitle className="text-2xl font-semibold">Upgrade to unlock this experience</DialogTitle>
            <DialogDescription>
              Messaging, premium communities, and concierge-hosted events are part of Connective Pro. Subscribe to unlock
              unlimited access or explore the public spaces first.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-2xl border border-border/70 bg-muted/40 p-4 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-1 h-5 w-5 text-[#E8B956]" />
              <p>
                Already subscribed? Log in with the email tied to your membership and we’ll unlock these features instantly.
              </p>
            </div>
          </div>
          <DialogFooter className="gap-3">
            <Button className="rounded-full bg-[#E8B956] text-black hover:bg-[#d9a840]" onClick={() => handleNavigate("/profile")}>
              Subscribe now
            </Button>
            <Button variant="outline" className="rounded-full" onClick={() => setShowSubscribePrompt(false)}>
              Maybe later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Button
        className="fixed bottom-20 right-4 z-40 flex items-center gap-2 rounded-full bg-[#E8B956] px-5 py-3 text-sm font-semibold text-black shadow-lg hover:bg-[#d9a840] sm:right-6"
        onClick={() => handleNavigate("/host/create-event")}
      >
        <Send className="h-4 w-4" />
        Host an experience
      </Button>
    </div>
  );
};

export default Home;
