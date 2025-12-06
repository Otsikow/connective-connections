import { useMemo, useState } from "react";
import {
  BadgeCheck,
  CalendarClock,
  CloudSun,
  Compass,
  HandHeart,
  MapPin,
  RefreshCw,
  Sparkles,
  Timer,
  Wallet,
} from "lucide-react";
import BackButton from "@/components/BackButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { usePageTitle } from "@/hooks/usePageTitle";
import { cn } from "@/lib/utils";

interface PersonAvailability {
  name: string;
  city: string;
  radiusMiles: number;
  budgetPerPerson: string;
  interests: string[];
  slots: { day: string; window: string; confidence: number }[];
  personality: string;
}

interface PlaceResult {
  id: string;
  name: string;
  type: string;
  address: string;
  priceLevel: "$" | "$$" | "$$$";
  travelTime: string;
  distance: string;
  rating: number;
  reason: string[];
  weatherFit: "ideal" | "backup";
}

const participants: PersonAvailability[] = [
  {
    name: "Nina",
    city: "Melbourne",
    radiusMiles: 3,
    budgetPerPerson: "$25–40",
    interests: ["Spicy food", "waterfront walks", "indie cafes"],
    slots: [
      { day: "Friday", window: "5:30–8:00 PM", confidence: 0.82 },
      { day: "Saturday", window: "8:00–10:00 AM", confidence: 0.71 },
      { day: "Saturday", window: "6:00–8:30 PM", confidence: 0.67 },
    ],
    personality: "Planner who likes a clear plan and simple backup",
  },
  {
    name: "Leo",
    city: "Melbourne",
    radiusMiles: 2,
    budgetPerPerson: "$20–35",
    interests: ["Peri-peri", "sunrise runs", "casual wine"],
    slots: [
      { day: "Friday", window: "6:00–9:00 PM", confidence: 0.76 },
      { day: "Saturday", window: "7:30–10:00 AM", confidence: 0.88 },
      { day: "Sunday", window: "2:00–5:00 PM", confidence: 0.6 },
    ],
    personality: "Spontaneous but prefers one message confirmations",
  },
];

const pastMeetups = [
  {
    title: "Ramen crawl",
    vibe: "High-energy, lots of walking",
    success: 86,
    note: "Preferred sharing plates and short waits",
  },
  {
    title: "Morning bay run",
    vibe: "Chill, enjoyed sunrise start",
    success: 72,
    note: "Asked for a coffee stop at finish",
  },
  {
    title: "Board games + snacks",
    vibe: "Cozy indoor",
    success: 63,
    note: "Wanted more daylight and quicker setup",
  },
];

const weatherByDay = {
  Friday: { summary: "Clear and 68°F", risk: "Low rain", suggestion: "Outdoor seating OK" },
  Saturday: { summary: "Cloudy, 55°F", risk: "40% drizzle", suggestion: "Prefer indoor or sheltered walk" },
  Sunday: { summary: "Windy, 61°F", risk: "Gusts by afternoon", suggestion: "Pick indoor spot" },
};

const googlePlaceResults: PlaceResult[] = [
  {
    id: "nandos-central",
    name: "Nando’s Waterfront",
    type: "Casual dining",
    address: "7 South Wharf Promenade",
    priceLevel: "$$",
    travelTime: "12 min",
    distance: "1.2 mi",
    rating: 4.4,
    reason: ["Both love peri-peri", "Fits $20–40 budget"],
    weatherFit: "ideal",
  },
  {
    id: "albert-walk",
    name: "Albert Park Lake loop",
    type: "Morning walk",
    address: "Aughtie Dr, Albert Park",
    priceLevel: "$",
    travelTime: "9 min",
    distance: "1.0 mi",
    rating: 4.7,
    reason: ["Matches morning run energy", "Easy coffee stop nearby"],
    weatherFit: "ideal",
  },
  {
    id: "copper-lane",
    name: "Copper Lane Café",
    type: "Coffee + light bites",
    address: "12 Coventry St",
    priceLevel: "$$",
    travelTime: "6 min",
    distance: "0.8 mi",
    rating: 4.6,
    reason: ["Indoor seating if drizzle hits", "Quiet corner for first meets"],
    weatherFit: "backup",
  },
];

const sharedInterests = ["Food explorers", "Sunrise movement", "Low-key conversation", "Short travel window"];

const buildMutualWindows = (people: PersonAvailability[]) => {
  const grouped = new Map<string, { day: string; windows: string[]; score: number }>();

  people.forEach(person => {
    person.slots.forEach(slot => {
      const key = `${slot.day}-${slot.window}`;
      const existing = grouped.get(key);
      if (existing) {
        existing.score += slot.confidence;
        existing.windows.push(`${person.name}: ${slot.window}`);
      } else {
        grouped.set(key, {
          day: slot.day,
          windows: [`${person.name}: ${slot.window}`],
          score: slot.confidence,
        });
      }
    });
  });

  return Array.from(grouped.values())
    .map(entry => ({ ...entry, likelihood: Math.min(entry.score / people.length, 1) }))
    .sort((a, b) => b.likelihood - a.likelihood)
    .slice(0, 4);
};

const explainPlace = (place: PlaceResult) => {
  const bullets = [
    `${place.priceLevel} • ${place.type}`,
    `${place.distance} • ${place.travelTime} travel`,
    `Rated ${place.rating.toFixed(1)} with availability via Google Places`,
  ];
  return bullets;
};

const AIAutoMeetups = () => {
  usePageTitle("AI Auto-Suggested Meetups");
  const [useBackups, setUseBackups] = useState(true);

  const mutualWindows = useMemo(() => buildMutualWindows(participants), []);

  const primaryPlan = {
    headline: "You both love food — Nando’s Waterfront at 6:00 PM Friday.",
    context:
      "Pulling from mutual Friday availability, peri-peri interest, and <$40 budget, this keeps travel under 15 minutes.",
    backup: "If traffic spikes, I’ll flip to Copper Lane Café and keep your same table hold.",
  };

  const morningPlan = {
    headline: "Morning walk at Albert Park, Saturday 8:00 AM.",
    context:
      "Matches Leo’s sunrise run habit and Nina’s morning window. Adds a coffee finish at Copper Lane if drizzle starts.",
    backup: "Will send a 30-minute weather check and auto-pick indoor coffee if rain probability >50%.",
  };

  return (
    <div className="space-y-6 pb-10">
      <BackButton />
      <div className="flex flex-col gap-2">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
          <Sparkles className="h-4 w-4" />
          Prompt 3 · Time + Venue Engine
        </div>
        <h1 className="text-3xl font-semibold leading-tight text-foreground md:text-4xl">
          AI Auto-Suggested Meetups
        </h1>
        <p className="max-w-3xl text-base text-foreground/80 md:text-lg">
          An AI layer that blends mutual availability, shared interests, budgets, distance, weather, past meetups, and
          personality matching to output exact meetup plans. Google Places API keeps venues real and bookable.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <Card className="border-primary/20 bg-card/60 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <CalendarClock className="h-5 w-5 text-primary" />
              Mutual availability + constraints
            </CardTitle>
            <CardDescription>
              Ranked by likelihood after blending confidences, travel radius, and day-part preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              {mutualWindows.map(window => (
                <div key={`${window.day}-${window.windows.join("-")}`} className="rounded-xl border border-border/60 bg-muted/50 p-4">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm text-foreground/70">{window.day}</p>
                      <p className="text-lg font-semibold text-foreground">{window.windows[0].split(": ")[1]}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.1em] text-foreground/60">Confidence</p>
                      <p className="text-lg font-semibold text-primary">{Math.round(window.likelihood * 100)}%</p>
                    </div>
                  </div>
                  <Progress value={window.likelihood * 100} className="mt-3" />
                  <p className="mt-2 text-sm text-foreground/70">
                    {window.windows.join(" · ")} • Weather: {weatherByDay[window.day as keyof typeof weatherByDay]?.summary ?? "Check"}
                  </p>
                </div>
              ))}
            </div>

            <Separator className="bg-border/60" />

            <div className="grid gap-4 md:grid-cols-2">
              {participants.map(person => (
                <div key={person.name} className="rounded-xl border border-border/50 bg-background/40 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.1em] text-foreground/60">{person.city}</p>
                      <h3 className="text-lg font-semibold text-foreground">{person.name}</h3>
                    </div>
                    <Badge variant="secondary" className="gap-2">
                      <Compass className="h-4 w-4" /> {person.radiusMiles} mi radius
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-foreground/70">Budget {person.budgetPerPerson}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {person.interests.map(interest => (
                      <Badge key={interest} variant="outline" className="border-primary/30 bg-primary/5 text-primary">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 space-y-2">
                    {person.slots.map(slot => (
                      <div key={`${slot.day}-${slot.window}`} className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/50 px-3 py-2">
                        <span className="text-sm font-medium">{slot.day}</span>
                        <span className="text-sm text-foreground/70">{slot.window}</span>
                        <span className="text-sm font-semibold text-primary">{Math.round(slot.confidence * 100)}%</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 text-sm text-foreground/70">{person.personality}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/60 backdrop-blur">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-xl">
              <HandHeart className="h-5 w-5 text-primary" />
              Personality + vibe fit
            </CardTitle>
            <CardDescription>
              Pulls in past meetup feedback to avoid repeated friction and keep the vibe balanced.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {pastMeetups.map(meetup => (
                <div key={meetup.title} className="rounded-xl border border-border/50 bg-background/50 p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-semibold text-foreground">{meetup.title}</h4>
                    <Badge variant="secondary" className="gap-1">
                      <Timer className="h-4 w-4" /> {meetup.success}%
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground/70">{meetup.vibe}</p>
                  <p className="text-sm text-foreground/70">{meetup.note}</p>
                </div>
              ))}
            </div>

            <Separator className="bg-border/60" />

            <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
              <p className="text-sm font-semibold text-foreground">Shared interest fingerprint</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {sharedInterests.map(item => (
                  <Badge key={item} variant="outline" className="border-primary/30 bg-background/60 text-primary">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.6fr,1fr]">
        <Card className="border-primary/30 bg-card/70 shadow-lg shadow-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              <MapPin className="h-5 w-5 text-primary" />
              Google Places venue picks
            </CardTitle>
            <CardDescription>
              Live Places data would refresh availability, travel time, and bookable slots. Here are sample ranked results.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-border/50 bg-muted/40 px-3 py-2">
              <div className="flex items-center gap-2 text-sm text-foreground/80">
                <BadgeCheck className="h-4 w-4 text-primary" /> Verified via Places API
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground/80">
                <Switch checked={useBackups} onCheckedChange={setUseBackups} id="backup-toggle" />
                <label htmlFor="backup-toggle" className="cursor-pointer select-none text-sm">
                  Keep weather-aware backups
                </label>
              </div>
            </div>

            <div className="space-y-3">
              {googlePlaceResults
                .filter(place => (useBackups ? true : place.weatherFit === "ideal"))
                .map(place => (
                  <div
                    key={place.id}
                    className={cn(
                      "rounded-xl border p-4 transition hover:border-primary/60",
                      place.weatherFit === "ideal"
                        ? "border-primary/30 bg-gradient-to-r from-primary/10 via-background/40 to-background/60"
                        : "border-border/60 bg-background/40"
                    )}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm uppercase tracking-[0.12em] text-foreground/60">{place.type}</p>
                        <h3 className="text-lg font-semibold text-foreground">{place.name}</h3>
                        <p className="text-sm text-foreground/70">{place.address}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary">
                          {place.priceLevel} budget
                        </Badge>
                        <Badge variant="secondary" className="gap-1">
                          <CloudSun className="h-4 w-4" /> {place.weatherFit === "ideal" ? "Ideal" : "Backup"}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-sm text-foreground/70">
                      {explainPlace(place).map(item => (
                        <span key={item} className="rounded-full bg-muted/60 px-3 py-1">
                          {item}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {place.reason.map(reason => (
                        <Badge key={reason} variant="secondary" className="bg-muted/70 text-foreground">
                          {reason}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              <RefreshCw className="h-5 w-5 text-primary" />
              Real-time automations
            </CardTitle>
            <CardDescription>
              Weather, budget, and distance guardrails keep suggestions actionable without extra back-and-forth.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-xl border border-border/50 bg-background/50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <CloudSun className="h-4 w-4 text-primary" /> Weather watch
              </div>
              <p className="mt-1 text-sm text-foreground/70">
                30-minute pre-meet check pulls live forecast and auto-flips to indoor backup if rain probability exceeds 50%.
              </p>
            </div>
            <div className="rounded-xl border border-border/50 bg-background/50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Wallet className="h-4 w-4 text-primary" /> Budget + distance
              </div>
              <p className="mt-1 text-sm text-foreground/70">
                Filters venue list to $20–40 per person and under 15 minutes travel for both sides; re-ranks when surge pricing hits.
              </p>
            </div>
            <div className="rounded-xl border border-border/50 bg-background/50 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles className="h-4 w-4 text-primary" /> One-message summaries
              </div>
              <p className="mt-1 text-sm text-foreground/70">
                Sends a single carousel into chat with time + venue + map link + dietary note pulled from past meetups.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-primary/30 bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-primary" />
              Suggested meetup plans
            </CardTitle>
            <CardDescription>
              Ready-to-send outputs that map to availability, personality, and Places-backed venues.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[primaryPlan, morningPlan].map(plan => (
              <div key={plan.headline} className="rounded-xl border border-border/60 bg-gradient-to-r from-background/70 to-card/70 p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">Proposed</p>
                <h3 className="mt-1 text-lg font-semibold text-foreground">{plan.headline}</h3>
                <p className="mt-2 text-sm text-foreground/75">{plan.context}</p>
                <p className="mt-3 text-sm text-foreground/70">{plan.backup}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge variant="secondary" className="gap-1">
                    <CalendarClock className="h-4 w-4" /> Time locked
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <MapPin className="h-4 w-4" /> Venue held
                  </Badge>
                  <Badge variant="secondary" className="gap-1">
                    <HandHeart className="h-4 w-4" /> Personality matched
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-primary/30 bg-card/70">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Compass className="h-5 w-5 text-primary" />
              Weather-aware timeline
            </CardTitle>
            <CardDescription>
              Blends Places slots with forecast so the AI can pre-commit to indoor or outdoor flows.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(weatherByDay).map(([day, forecast]) => (
              <div key={day} className="rounded-xl border border-border/50 bg-background/50 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.12em] text-foreground/60">{day}</p>
                    <p className="text-base font-semibold text-foreground">{forecast.summary}</p>
                  </div>
                  <Badge variant="secondary" className="gap-1">
                    <CloudSun className="h-4 w-4" /> {forecast.risk}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-foreground/70">{forecast.suggestion}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/30 bg-card/80">
        <CardContent className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.12em] text-primary">Ready to send</p>
            <h3 className="text-xl font-semibold text-foreground">Push the best time + venue into chat</h3>
            <p className="text-sm text-foreground/70">
              AI drafts the message, attaches the Places map link, and pings both people 30 minutes before with weather status.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-primary/40 text-primary">
              Preview carousel
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              Send meetup plan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIAutoMeetups;
