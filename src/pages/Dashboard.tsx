import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  CalendarCheck,
  Plus,
  Sparkles,
  TrendingUp,
  Users,
  MessageSquare,
  Clock,
  MapPin,
  Star,
  Gift,
  Crown,
  Flame,
  ArrowRight,
  Medal,
  Target,
  ShieldCheck,
  AlertTriangle,
  Lightbulb,
  Users2,
  Wand2,
  type LucideIcon,
} from "lucide-react";
import BackButton from "@/components/BackButton";
import { useSubscription } from "@/hooks/useSubscription";
import { usePageTitle } from "@/hooks/usePageTitle";
import { generateAvatarUrl } from "@/lib/avatar";
import PartnerIntelligenceAssistant from "@/components/PartnerIntelligenceAssistant";

const Dashboard = () => {
  const navigate = useNavigate();
  const { tier, openUpgrade } = useSubscription();
  usePageTitle("Connection Intelligence Dashboard");
  const isProMember = tier === "pro";

  const handleProUpsell = () => {
    openUpgrade({
      message: "This feature is only available to Premium users",
      highlightTier: "pro",
    });
  };

  const analyticsLocked = !isProMember;

  const statCards = [
    {
      title: "New Members",
      value: "248",
      change: "+18.4%",
      helper: "vs. last month",
      icon: Users,
      trend: "positive" as const,
    },
    {
      title: "Event RSVPs",
      value: "1,245",
      change: "+9.1%",
      helper: "confirmed guests",
      icon: CalendarCheck,
      trend: "positive" as const,
    },
    {
      title: "Meaningful Matches",
      value: "312",
      change: "+4.6%",
      helper: "last 30 days",
      icon: Sparkles,
      trend: "positive" as const,
    },
    {
      title: "Feedback Score",
      value: "4.8/5",
      change: "96%",
      helper: "attendees satisfied",
      icon: Star,
      trend: "neutral" as const,
    },
  ];

  const engagementChartData = useMemo(
    () => [
      { month: "Apr", attendees: 620, matches: 205 },
      { month: "May", attendees: 680, matches: 224 },
      { month: "Jun", attendees: 710, matches: 238 },
      { month: "Jul", attendees: 765, matches: 252 },
      { month: "Aug", attendees: 820, matches: 268 },
      { month: "Sep", attendees: 854, matches: 276 },
    ],
    [],
  );

  const engagementChartConfig = useMemo<ChartConfig>(
    () => ({
      attendees: {
        label: "Event Attendance",
        color: "hsl(var(--chart-1))",
      },
      matches: {
        label: "Matches Made",
        color: "hsl(var(--chart-2))",
      },
    }),
    [],
  );

  const upcomingEvents = [
    {
      name: "Founder Coffee & Co-Work",
      date: "Thu, Oct 12",
      time: "09:00 AM",
      location: "Studio Collective",
      rsvpProgress: 78,
      capacity: "42 / 54",
    },
    {
      name: "Evening Makers Lab",
      date: "Fri, Oct 20",
      time: "06:30 PM",
      location: "Innovation Hub",
      rsvpProgress: 63,
      capacity: "57 / 90",
    },
    {
      name: "Weekend Hike & Brunch",
      date: "Sat, Oct 28",
      time: "07:00 AM",
      location: "Trailhead Park",
      rsvpProgress: 91,
      capacity: "28 / 30",
    },
  ];

  const vipMembers = [
    {
      name: "Jessica Kim",
      avatar: generateAvatarUrl("Jessica Kim dashboard"),
      interest: "Creative Tech",
      engagement: "12 events",
    },
    {
      name: "Omar Singh",
      avatar: generateAvatarUrl("Omar Singh dashboard"),
      interest: "Wellness & Mindfulness",
      engagement: "9 events",
    },
    {
      name: "Lina Torres",
      avatar: generateAvatarUrl("Lina Torres dashboard"),
      interest: "Community Building",
      engagement: "Top host mentor",
    },
  ];

  const insights = [
    {
      label: "Match quality is up 12% after introducing curated prompts.",
    },
    {
      label: "Thursday evening gatherings have the highest retention.",
    },
    {
      label: "Members engaging in 3+ events convert to hosts 3.2x faster.",
    },
  ];

  const loyaltySnapshot = {
    currentTier: "Trailblazer",
    points: 1420,
    nextTier: "Luminary",
    nextTierPoints: 1500,
    renewsOn: "Nov 30",
    streakMonths: 4,
  };

  const pointsToNextTier = Math.max(loyaltySnapshot.nextTierPoints - loyaltySnapshot.points, 0);

  const loyaltyBenefits: {
    title: string;
    description: string;
    icon: LucideIcon;
  }[] = [
    {
      title: "Concierge planning",
      description: "Quarterly strategy session to co-design signature experiences.",
      icon: Crown,
    },
    {
      title: "Guest passes",
      description: "Bring two complimentary guests to curated salons each month.",
      icon: Gift,
    },
    {
      title: "Spotlight feature",
      description: "Personalized feature in the community digest to grow your circle.",
      icon: Medal,
    },
  ];

  const loyaltyBoosts = [
    {
      title: "Host an intimate mastermind",
      points: "+180 pts",
      helper: "Drives repeat engagement for founders in your cohort.",
    },
    {
      title: "Refer a culture builder",
      points: "+90 pts",
      helper: "Earn bonuses when your referral attends their first salon.",
    },
    {
      title: "Share a 24-hour recap",
      points: "+40 pts",
      helper: "Keeps momentum high with quick reflection prompts.",
    },
  ];

  const eventPredictions = [
    {
      name: "Design Sprint Weekend",
      timing: "Fri, Oct 20 • 6:30 PM",
      location: "Innovation Hub",
      successProbability: 82,
      expectedAttendance: 78,
      recommended: ["Product leads", "UX mentors"],
      tip: "Send a build-a-thon prompt 48 hours before to lock in team pairings.",
    },
    {
      name: "Creators Circle Salon",
      timing: "Thu, Oct 26 • 7:00 PM",
      location: "Studio Collective",
      successProbability: 76,
      expectedAttendance: 64,
      recommended: ["Community builders", "Storytellers"],
      tip: "Highlight past speaker clips—boosts RSVP confidence for new guests.",
    },
    {
      name: "Wellness Sunrise Hike",
      timing: "Sat, Oct 28 • 7:00 AM",
      location: "Trailhead Park",
      successProbability: 91,
      expectedAttendance: 32,
      recommended: ["Wellness cohort", "First-time joiners"],
      tip: "Auto-send gear checklist + rideshare matches tonight to reduce day-of drops.",
    },
  ];

  const venuePerformance = [
    {
      name: "Studio Collective",
      bestFor: "Workshops & salons",
      safetyScore: 9.4,
      lift: "+12% repeat attendance",
      suggestion: "Hold creative labs here twice monthly; pairs well with maker circles.",
    },
    {
      name: "Innovation Hub",
      bestFor: "Founder roundtables",
      safetyScore: 9.1,
      lift: "+18% RSVP-to-show",
      suggestion: "Book the atrium for demo nights with capped invite lists.",
    },
    {
      name: "Trailhead Park",
      bestFor: "Outdoor wellness",
      safetyScore: 8.7,
      lift: "+22% new member discovery",
      suggestion: "Sunrise start times keep the vibe calm and introspective.",
    },
  ];

  const groupDynamics = [
    {
      segment: "Design Sprint Weekend crews",
      compatibility: "High alignment across product + research tracks",
      watchouts: "Two overlapping mentor requests—assign co-leads to prevent bottlenecks.",
      vibe: "Maker-forward, balanced mix of introverts/extroverts",
    },
    {
      segment: "Creators Circle Salon",
      compatibility: "Strong creative chemistry; repeat attendees mentoring new voices",
      watchouts: "One guest prefers small groups—add a quiet breakout circle.",
      vibe: "Reflective with high storytelling energy",
    },
    {
      segment: "Wellness Sunrise Hike",
      compatibility: "Shared wellness interests; 6 first-timers matched with trail guides",
      watchouts: "Early start drop-off risk—send accountability buddy pairs.",
      vibe: "Grounded and restorative",
    },
  ];

  const adminActions = [
    {
      title: "Add AI suggestions to events",
      description: "Insert turnout boosts and pacing tips directly into the event brief.",
      cta: "Push suggestions",
    },
    {
      title: "Auto-invite users to events",
      description: "Target members with matching interests and proximity for higher show rates.",
      cta: "Review invites",
    },
    {
      title: "Approve AI-created meetup ideas",
      description: "Curate three fresh formats sourced from member sentiment and gaps.",
      cta: "Approve ideas",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/40">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-10">
        <div className="flowmaster-section flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <BackButton
              fallbackPath="/host-dashboard"
              className="border border-border/60 text-muted-foreground hover:bg-muted"
            />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Host Dashboard</p>
              <h1 className="flowmaster-hero-title mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
                Build meaningful experiences
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground sm:text-base">
                Monitor event momentum, understand how your community is engaging, and take action with confidence.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => navigate("/events")}
            >
              View events
            </Button>
            <Button className="gap-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4" />
              New experience
            </Button>
          </div>
        </div>

        <div className="flowmaster-divider" />

        <section className="flowmaster-section">
          <PartnerIntelligenceAssistant />
        </section>

        <section className="flowmaster-section grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title} className="border-border/60">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardDescription>{stat.title}</CardDescription>
                  <CardTitle className="mt-2 text-3xl font-semibold">{stat.value}</CardTitle>
                </div>
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center gap-2 text-sm">
                  <Badge
                    variant={stat.trend === "positive" ? "outline" : "secondary"}
                    className={
                      stat.trend === "positive"
                        ? "border-emerald-300 bg-emerald-100/70 text-emerald-600"
                        : "border-border/70 text-muted-foreground"
                    }
                  >
                    {stat.change}
                  </Badge>
                  <span className="text-muted-foreground">{stat.helper}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="flowmaster-section grid gap-6 xl:grid-cols-3">
          <Card className="border-border/60 xl:col-span-2">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-2xl">Engagement momentum</CardTitle>
                  <CardDescription>
                    Attendance and quality matches from April through September.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="rounded-full border-primary/40 text-primary">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +12.7%
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={engagementChartConfig} className="h-[320px]">
                <AreaChart data={engagementChartData}>
                  <defs>
                    <linearGradient id="attendees" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.38} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="matches" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.08} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.3} />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <ChartTooltip cursor={{ stroke: "hsl(var(--border))" }} content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="attendees"
                    stroke="hsl(var(--chart-1))"
                    fill="url(#attendees)"
                    strokeWidth={2.5}
                    activeDot={{ r: 6 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="matches"
                    stroke="hsl(var(--chart-2))"
                    fill="url(#matches)"
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <div>Peak attendance occurred during July's "Creators Circle" series.</div>
              <Button variant="ghost" className="h-9 gap-2 rounded-full px-4" onClick={() => navigate("/events")}
              >
                Explore event insights
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Action center</CardTitle>
              <CardDescription>Next steps to keep momentum high.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-start gap-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4">
                <div className="rounded-full bg-primary p-2 text-primary-foreground">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Send welcome notes to 12 new members.</p>
                  <p className="text-xs text-muted-foreground">
                    Personalized outreach drives 2.4x repeat attendance.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-muted p-2 text-muted-foreground">
                  <CalendarCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Finalize venue for "Design Sprint Weekend".</p>
                  <p className="text-xs text-muted-foreground">80% of RSVPs confirmed; lock logistics by Oct 18.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-muted p-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Invite community mentors to lead breakout circles.</p>
                  <p className="text-xs text-muted-foreground">Target at least 6 hosts to cover each interest track.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-muted p-2 text-muted-foreground">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Refresh experience prompts with new AI icebreakers.</p>
                  <p className="text-xs text-muted-foreground">Keep things fresh—next update recommended weekly.</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="ml-auto rounded-full" onClick={() => navigate("/messages")}>
                Mark steps complete
              </Button>
            </CardFooter>
          </Card>
        </section>

        <section className="flowmaster-section grid gap-6 xl:grid-cols-3">
          <Card className="border-border/60 xl:col-span-2">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-2xl">AI event insights & predictions</CardTitle>
                  <CardDescription>
                    Forecast turnout, nudge the right members, and keep momentum high.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="rounded-full border-primary/40 text-primary">
                  <Sparkles className="mr-1 h-3.5 w-3.5" /> Live predictions
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {eventPredictions.map((event) => (
                <div
                  key={event.name}
                  className="space-y-3 rounded-2xl border border-border/60 bg-muted/40 p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold">{event.name}</p>
                      <p className="text-xs text-muted-foreground">{event.timing}</p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {event.location}
                      </div>
                    </div>
                    <Badge className="w-fit rounded-full bg-primary/10 text-primary">
                      <Target className="mr-1 h-3.5 w-3.5" /> {event.successProbability}% success odds
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-2 text-primary">
                        <Target className="h-4 w-4" /> Success probability
                      </span>
                      <span className="font-semibold text-primary">{event.successProbability}%</span>
                    </div>
                    <Progress value={event.successProbability} className="h-2" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl bg-background/70 p-3">
                      <p className="text-xs text-muted-foreground">Expected attendance</p>
                      <p className="mt-1 flex items-center gap-2 text-sm font-semibold">
                        <Users2 className="h-4 w-4 text-primary" />
                        {event.expectedAttendance} guests
                      </p>
                    </div>
                    <div className="rounded-xl bg-background/70 p-3">
                      <p className="text-xs text-muted-foreground">People recommended to join</p>
                      <div className="mt-1 flex flex-wrap gap-2 text-xs font-medium text-primary">
                        {event.recommended.map((person) => (
                          <span key={person} className="rounded-full bg-primary/10 px-2 py-1">
                            {person}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-xl bg-background/70 p-3">
                      <p className="text-xs text-muted-foreground">AI tip to improve turnout</p>
                      <p className="mt-1 flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
                        <Lightbulb className="mt-0.5 h-4 w-4 text-primary" />
                        {event.tip}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Locations performance</CardTitle>
                <CardDescription>Best-performing venues with safety signals.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {venuePerformance.map((venue) => (
                  <div
                    key={venue.name}
                    className="space-y-2 rounded-2xl border border-border/60 bg-muted/50 p-4"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold">{venue.name}</p>
                        <p className="text-xs text-muted-foreground">Best for: {venue.bestFor}</p>
                        <p className="mt-1 text-xs font-medium text-primary">{venue.lift}</p>
                      </div>
                      <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        {venue.safetyScore} safety
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed text-muted-foreground">{venue.suggestion}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Group dynamics AI analysis</CardTitle>
                <CardDescription>Compatibility, friction risks, and vibe checks.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {groupDynamics.map((group) => (
                  <div
                    key={group.segment}
                    className="space-y-2 rounded-2xl border border-border/60 bg-muted/50 p-4"
                  >
                    <p className="text-sm font-semibold">{group.segment}</p>
                    <p className="text-xs text-muted-foreground">{group.compatibility}</p>
                    <div className="flex items-start gap-2 text-xs text-amber-700">
                      <AlertTriangle className="mt-0.5 h-4 w-4" />
                      <span>{group.watchouts}</span>
                    </div>
                    <p className="text-xs font-medium text-primary">Vibe: {group.vibe}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl">Admin tools</CardTitle>
                <CardDescription>Let AI handle outreach and idea curation.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {adminActions.map((action) => (
                  <div
                    key={action.title}
                    className="flex flex-col gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{action.title}</p>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                      <Wand2 className="h-4 w-4 text-primary" />
                    </div>
                    <Button
                      variant="ghost"
                      className="w-fit rounded-full px-3"
                      onClick={() => navigate("/host-dashboard")}
                    >
                      {action.cta}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="flowmaster-section grid gap-6 lg:grid-cols-3">
          <Card className="border-border/60 lg:col-span-2">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <CardTitle className="text-2xl">Subscriber loyalty rewards</CardTitle>
                  <CardDescription>
                    Keep your most invested members engaged with experiential perks.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="rounded-full border-primary/40 text-primary">
                  <Flame className="mr-1 h-3.5 w-3.5" /> {loyaltySnapshot.streakMonths}-month streak
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4 rounded-2xl border border-primary/30 bg-primary/5 p-5">
                  <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                    <Badge className="rounded-full bg-primary text-primary-foreground">
                      {loyaltySnapshot.currentTier} tier
                    </Badge>
                    <span>Renews {loyaltySnapshot.renewsOn}</span>
                  </div>
                  <div>
                    <p className="text-4xl font-bold text-primary">
                      {loyaltySnapshot.points.toLocaleString()} pts
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {pointsToNextTier} pts to {loyaltySnapshot.nextTier}
                    </p>
                  </div>
                  <Progress
                    value={(loyaltySnapshot.points / loyaltySnapshot.nextTierPoints) * 100}
                    className="h-2"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span>{loyaltySnapshot.nextTierPoints} pts</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {loyaltyBenefits.map((benefit) => (
                    <div
                      key={benefit.title}
                      className="flex items-start gap-3 rounded-xl bg-muted/60 p-4"
                    >
                      <div className="rounded-full bg-primary/10 p-2 text-primary">
                        <benefit.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{benefit.title}</p>
                        <p className="text-xs text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between gap-4">
              <p className="text-xs text-muted-foreground">
                Reward drops every month your streak stays active—keep momentum with surprise experiences.
              </p>
              <Button
                className="gap-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => navigate("/profile")}
              >
                Redeem a reward
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Bonus point boosts</CardTitle>
              <CardDescription>Unlock accelerated rewards with these actions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-2xl bg-muted/70 p-4">
                <div>
                  <p className="text-sm font-semibold">Engagement streak</p>
                  <p className="text-xs text-muted-foreground">
                    Complete any 2 actions this week for a 1.3x multiplier.
                  </p>
                </div>
                <div className="rounded-full bg-primary/10 p-3 text-primary">
                  <Gift className="h-5 w-5" />
                </div>
              </div>
              {loyaltyBoosts.map((boost) => (
                <div key={boost.title} className="flex items-start gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{boost.title}</p>
                      <span className="text-xs font-semibold text-primary">{boost.points}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{boost.helper}</p>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="ml-auto rounded-full" onClick={() => navigate("/community")}>
                View loyalty playbook
              </Button>
            </CardFooter>
          </Card>
        </section>

        <section className="flowmaster-section grid gap-6 lg:grid-cols-3">
          <Card className="border-border/60 lg:col-span-2">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl">Upcoming gatherings</CardTitle>
              <CardDescription>Stay ahead of logistics across your next experiences.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[32%]">Experience</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="w-[18%]">Capacity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingEvents.map((event) => (
                    <TableRow key={event.name} className="border-border/60">
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          {event.name}
                          <span className="text-xs text-muted-foreground">
                            {event.rsvpProgress}% RSVP momentum
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{event.date}</TableCell>
                      <TableCell className="text-muted-foreground">{event.time}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" /> {event.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Progress value={event.rsvpProgress} className="h-2" />
                          <span className="text-xs text-muted-foreground">{event.capacity} confirmed</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="justify-between text-sm text-muted-foreground">
              <span>Tip: share event teasers 5 days prior to boost show rates.</span>
              <Button variant="ghost" className="rounded-full" onClick={() => navigate("/events")}
              >
                Manage calendar
              </Button>
            </CardFooter>
          </Card>

          <div className="space-y-6">
            <Card className="border-border/60">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">Community champions</CardTitle>
                <CardDescription>
                  Spotlight the members driving momentum.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                {vipMembers.map((member) => (
                  <div key={member.name} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-11 w-11">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.interest}</p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary">
                      {member.engagement}
                    </Badge>
                  </div>
                ))}
              </CardContent>
              <CardFooter>
                <Button variant="ghost" className="ml-auto rounded-full" onClick={() => navigate("/community")}
                >
                  Send appreciation notes
                </Button>
              </CardFooter>
            </Card>

            <Card
              className={`border-border/60 ${analyticsLocked ? "relative overflow-hidden" : ""}`}
            >
              <CardHeader className={`pb-4 ${analyticsLocked ? "opacity-60" : ""}`}>
                <CardTitle className="text-2xl">Insights to act on</CardTitle>
                <CardDescription>Curated takeaways tailored for your hosts.</CardDescription>
              </CardHeader>
              <CardContent
                className={`space-y-4 ${analyticsLocked ? "pointer-events-none opacity-50" : ""}`}
              >
                {insights.map((insight, index) => (
                  <div key={insight.label} className="flex gap-3 rounded-xl bg-muted/60 p-4">
                    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-relaxed">{insight.label}</p>
                      <p className="text-xs text-muted-foreground">Updated {index + 1} day{index === 0 ? "" : "s"} ago</p>
                    </div>
                  </div>
                ))}
              </CardContent>
              <CardFooter className={analyticsLocked ? "pointer-events-none opacity-50" : ""}>
                <Button
                  variant="ghost"
                  className="ml-auto rounded-full"
                  onClick={() => (analyticsLocked ? handleProUpsell() : navigate("/matches"))}
                >
                  Review full report
                </Button>
              </CardFooter>
              {analyticsLocked && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-[inherit] bg-background/85 px-6 text-center backdrop-blur-sm">
                  <p className="text-sm font-semibold">Pro analytics locked</p>
                  <p className="text-xs text-muted-foreground">
                    Unlock AI-powered suggestions, priority visibility, and engagement analytics with Pro.
                  </p>
                  <Button className="rounded-full" onClick={handleProUpsell}>
                    Upgrade to Pro
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
