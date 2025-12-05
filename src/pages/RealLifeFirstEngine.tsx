import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarClock,
  HandHeart,
  MapPin,
  MessagesSquare,
  PartyPopper,
  Sparkles,
  Timer,
  Users,
} from "lucide-react";
import BackButton from "@/components/BackButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { usePageTitle } from "@/hooks/usePageTitle";
import { cn } from "@/lib/utils";

const recommendedEvents = [
  {
    title: "Sunrise Run Club",
    time: "Tomorrow · 7:10 AM",
    location: "Riverside Park trailhead",
    matches: ["Amira", "Dev"],
    vibe: "Light pace · 30 mins · coffee after",
  },
  {
    title: "Board Game Micro-Table",
    time: "Fri · 7:30 PM",
    location: "The Cozy Meeple",
    matches: ["Lena", "Priya", "Max"],
    vibe: "3 players ready · chill co-op picks",
  },
  {
    title: "Sunday Slow Brunch",
    time: "Sun · 11:45 AM",
    location: "Harbor Market Hall",
    matches: ["Jordan", "Yusuf"],
    vibe: "Shared pescatarian menu · quiet corner",
  },
];

const readinessPairs = [
  {
    pair: "Maya ↔ Jordan",
    score: 88,
    signals: "4 replies · shared gym slot · saved venue",
    action: "Book Movement Lab for Sat 10 AM",
  },
  {
    pair: "Elena ↔ Priya",
    score: 74,
    signals: "Swapped playlists · 2 calendar overlaps",
    action: "Offer café crawl invite for Thu 6 PM",
  },
  {
    pair: "Samir ↔ June",
    score: 62,
    signals: "Checked transit · nudged to confirm",
    action: "Send time poll with 3 options",
  },
];

const venueOptions = [
  {
    name: "River & Rye Café",
    distance: "0.4 mi",
    qualities: "Quiet tables · outlets · staff knows us",
    bestFor: "1:1 intros, first meetings",
  },
  {
    name: "Movement Lab",
    distance: "1.1 mi",
    qualities: "Beginner-friendly trainers on Sat",
    bestFor: "Workout buddies",
  },
  {
    name: "Library Green",
    distance: "7 min walk",
    qualities: "Open lawn · shade · family friendly",
    bestFor: "Picnics and casual circles",
  },
];

const microGroups = [
  {
    name: "Gentle Socials (6 people)",
    cadence: "Wed evenings · rotating cafés",
    fit: "Introvert-friendly · host-provided prompts",
    next: "Open seat tonight at 6:30 PM",
  },
  {
    name: "Makers & Builders Pod",
    cadence: "Sundays · 10:30 AM",
    fit: "Side projects, co-working accountability",
    next: "2 spots for this weekend",
  },
  {
    name: "Trail Walk & Stretch",
    cadence: "Sat mornings",
    fit: "Low-impact, strollers welcome",
    next: "Auto-pairing you with two nearby members",
  },
];

const meetupTimes = [
  { window: "Today", detail: "3:30–5:15 PM", reason: "3 matches active now" },
  { window: "Tomorrow", detail: "7:00–8:30 AM", reason: "Best overlap for early risers" },
  { window: "Weekend", detail: "10:00 AM–1:00 PM", reason: "Venues with availability held" },
];

const actionableQueue = [
  {
    label: "Hold venues",
    detail: "Blocking River & Rye until 2:45 PM for coffee meetup",
    type: "logistics",
  },
  {
    label: "Send intros",
    detail: "Drafting warm introductions for Maya + Jordan + Dev",
    type: "connection",
  },
  {
    label: "Poll times",
    detail: "3-slot time poll queued for Elena ↔ Priya",
    type: "readiness",
  },
];

const RealLifeFirstEngine = () => {
  usePageTitle("Real-Life First AI Engine");

  const averageReadiness = useMemo(
    () => Math.round(readinessPairs.reduce((sum, r) => sum + r.score, 0) / readinessPairs.length),
    [],
  );

  return (
    <div className="space-y-6 pb-16">
      <BackButton fallbackPath="/home">Home</BackButton>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Real-life first</p>
          <h1 className="text-3xl font-semibold leading-tight">AI engine that moves people offline</h1>
          <p className="max-w-2xl text-muted-foreground">
            Prioritises nearby matches, shared availability, and safe venues to get users into real meetups faster.
          </p>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-emerald-100 text-emerald-700" variant="secondary">
              Live meetup recommendations
            </Badge>
            <Badge className="bg-blue-100 text-blue-700" variant="secondary">
              Offline-first scoring
            </Badge>
            <Badge variant="outline" className="border-primary/40 text-primary">
              Logistics handled
            </Badge>
          </div>
        </div>
        <Sparkles className="hidden h-12 w-12 text-primary md:block" />
      </div>

      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
        <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarClock className="h-5 w-5 text-primary" />
              Offline priority snapshot
            </CardTitle>
            <CardDescription>Everything needed to push members toward real-life meetups.</CardDescription>
          </div>
          <Button asChild>
            <Link to="/events" className="inline-flex items-center gap-2">
              View all events
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {[{
            label: "Avg readiness score",
            value: `${averageReadiness}%`,
            helper: "Based on replies, saved venues, and time overlap",
          }, {
            label: "Meetups ready to confirm",
            value: "7",
            helper: "Invite draft + venue + shared time windows",
          }, {
            label: "Backups prepared",
            value: "4",
            helper: "Weather-safe or quieter venue swaps",
          }].map(stat => (
            <div key={stat.label} className="rounded-xl border border-border/80 bg-card/70 p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-3xl font-semibold">{stat.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stat.helper}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card className="border-emerald-200/60 dark:border-emerald-800/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <HandHeart className="h-5 w-5 text-emerald-500" />
              Connection readiness scores
            </CardTitle>
            <CardDescription>
              Signals show when pairs are ready for an in-person meetup based on engagement momentum.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {readinessPairs.map(item => (
              <div key={item.pair} className="space-y-2 rounded-lg border border-border/70 bg-card/70 p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold">{item.pair}</p>
                    <p className="text-xs text-muted-foreground">{item.signals}</p>
                  </div>
                  <Badge variant="outline" className="border-emerald-400/60 text-emerald-600">
                    {item.score}% ready
                  </Badge>
                </div>
                <Progress value={item.score} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Engagement + availability + logistics</span>
                  <span className="font-semibold text-foreground">Next: {item.action}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-blue-200/60 dark:border-blue-900/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Timer className="h-5 w-5 text-blue-500" />
              Best meetup times
            </CardTitle>
            <CardDescription>Windows with the highest overlap of availability and travel ease.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {meetupTimes.map(slot => (
              <div key={slot.window} className="rounded-lg border border-border/70 bg-card/80 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{slot.window}</p>
                    <p className="text-xs text-muted-foreground">{slot.reason}</p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-100">
                    {slot.detail}
                  </Badge>
                </div>
              </div>
            ))}
            <Separator className="my-2" />
            <p className="text-xs text-muted-foreground">
              AI aligns time zones, commute times, and venue hours before suggesting meetups.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <PartyPopper className="h-5 w-5 text-primary" />
              Ready-to-join experiences
            </CardTitle>
            <CardDescription>Events that already have enough momentum to move offline.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {recommendedEvents.map(event => (
              <div key={event.title} className="rounded-xl border border-border/70 bg-card/70 p-4 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold">{event.title}</p>
                  <Badge variant="outline">{event.matches.length} aligned</Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{event.time}</p>
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{event.location}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{event.vibe}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                  {event.matches.map(name => (
                    <Badge key={name} variant="secondary" className="bg-emerald-100 text-emerald-700">
                      {name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-amber-200/60 dark:border-amber-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-amber-500" />
                Nearby venues that say yes to meetups
              </CardTitle>
              <CardDescription>Reserved spots and trusted hosts so members can just show up.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {venueOptions.map(venue => (
                <div key={venue.name} className="rounded-lg border border-border/70 bg-card/80 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{venue.name}</p>
                    <Badge variant="outline" className="border-emerald-300/60 text-emerald-600">
                      {venue.distance}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{venue.qualities}</p>
                  <p className="text-xs font-semibold text-muted-foreground">Best for: {venue.bestFor}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-purple-200/60 dark:border-purple-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessagesSquare className="h-5 w-5 text-purple-500" />
                Micro-groups ready to join
              </CardTitle>
              <CardDescription>Small circles curated by availability, vibe, and pace preference.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {microGroups.map(group => (
                <div key={group.name} className="rounded-lg border border-border/70 bg-card/80 p-3">
                  <p className="text-sm font-semibold">{group.name}</p>
                  <p className="text-xs text-muted-foreground">{group.cadence}</p>
                  <p className="text-xs text-muted-foreground">{group.fit}</p>
                  <p className="text-xs font-semibold text-foreground">{group.next}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-border/70">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            AI action queue
          </CardTitle>
          <CardDescription>Automations that convert online intent into offline plans.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          {actionableQueue.map(item => (
            <div
              key={item.label}
              className={cn(
                "rounded-xl border border-border/70 bg-card/70 p-4 shadow-sm",
                item.type === "readiness" && "border-blue-300/50",
                item.type === "connection" && "border-emerald-300/60",
                item.type === "logistics" && "border-amber-300/60",
              )}
            >
              <p className="text-sm font-semibold">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.detail}</p>
              <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-primary">
                <ArrowRight className="h-4 w-4" />
                Auto-send once both sides confirm
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default RealLifeFirstEngine;
