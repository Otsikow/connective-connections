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
  type LucideIcon,
} from "lucide-react";
import BackButton from "@/components/BackButton";
import { useSubscription } from "@/hooks/useSubscription";

const Dashboard = () => {
  const navigate = useNavigate();
  const { tier, openUpgrade } = useSubscription();
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
      avatar: "/placeholder.svg",
      interest: "Creative Tech",
      engagement: "12 events",
    },
    {
      name: "Omar Singh",
      avatar: "/placeholder.svg",
      interest: "Wellness & Mindfulness",
      engagement: "9 events",
    },
    {
      name: "Lina Torres",
      avatar: "/placeholder.svg",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/40">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <BackButton
              fallbackPath="/host-dashboard"
              className="border border-border/60 text-muted-foreground hover:bg-muted"
            />
            <div>
              <p className="text-sm font-medium text-muted-foreground">Host Dashboard</p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
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

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
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

        <section className="grid gap-6 xl:grid-cols-3">
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

        <section className="grid gap-6 lg:grid-cols-3">
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

        <section className="grid gap-6 lg:grid-cols-3">
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
