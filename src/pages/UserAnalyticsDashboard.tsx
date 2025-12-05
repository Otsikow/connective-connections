import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ComposedChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePageTitle } from "@/hooks/usePageTitle";
import { generateAvatarUrl } from "@/lib/avatar";
import {
  Activity,
  ArrowRight,
  BarChart3,
  Bell,
  Flame,
  LineChart as LineChartIcon,
  Users,
} from "lucide-react";

const UserAnalyticsDashboard = () => {
  const navigate = useNavigate();
  usePageTitle("User Analytics Dashboard");

  const registrationTrend = useMemo(
    () => [
      { month: "Apr", registrations: 420, activations: 360 },
      { month: "May", registrations: 540, activations: 468 },
      { month: "Jun", registrations: 610, activations: 520 },
      { month: "Jul", registrations: 720, activations: 612 },
      { month: "Aug", registrations: 810, activations: 705 },
      { month: "Sep", registrations: 880, activations: 764 },
      { month: "Oct", registrations: 940, activations: 812 },
    ],
    [],
  );

  const registrationConfig = useMemo<ChartConfig>(
    () => ({
      registrations: {
        label: "New registrations",
        color: "hsl(var(--chart-1))",
      },
      activations: {
        label: "Activated accounts",
        color: "hsl(var(--chart-2))",
      },
    }),
    [],
  );

  const activeUsage = useMemo(
    () => [
      { week: "Week 1", dau: 1850, wau: 5230, retention: 0.62 },
      { week: "Week 2", dau: 1940, wau: 5450, retention: 0.64 },
      { week: "Week 3", dau: 2010, wau: 5665, retention: 0.66 },
      { week: "Week 4", dau: 2145, wau: 5890, retention: 0.68 },
    ],
    [],
  );

  const activeUsageConfig = useMemo<ChartConfig>(
    () => ({
      dau: {
        label: "Daily active users",
        color: "hsl(var(--chart-3))",
      },
      wau: {
        label: "Weekly active users",
        color: "hsl(var(--chart-4))",
      },
      retention: {
        label: "Week 4 retention",
        color: "hsl(var(--chart-5))",
      },
    }),
    [],
  );

  const subscriptionBreakdown = useMemo(
    () => [
      { name: "Free", value: 4200, fill: "hsl(var(--chart-1))" },
      { name: "Plus", value: 2350, fill: "hsl(var(--chart-2))" },
      { name: "Pro", value: 1180, fill: "hsl(var(--chart-3))" },
      { name: "Enterprise", value: 420, fill: "hsl(var(--chart-4))" },
    ],
    [],
  );

  const subscriptionConfig = useMemo<ChartConfig>(
    () => ({
      Free: { label: "Free", color: "hsl(var(--chart-1))" },
      Plus: { label: "Plus", color: "hsl(var(--chart-2))" },
      Pro: { label: "Pro", color: "hsl(var(--chart-3))" },
      Enterprise: { label: "Enterprise", color: "hsl(var(--chart-4))" },
    }),
    [],
  );

  const engagementMoments = useMemo(
    () => [
      { week: "Week 1", messages: 3250, replies: 2140, sessions: 4.2 },
      { week: "Week 2", messages: 3475, replies: 2290, sessions: 4.4 },
      { week: "Week 3", messages: 3610, replies: 2415, sessions: 4.6 },
      { week: "Week 4", messages: 3895, replies: 2580, sessions: 4.8 },
    ],
    [],
  );

  const engagementConfig = useMemo<ChartConfig>(
    () => ({
      messages: { label: "Messages sent", color: "hsl(var(--chart-1))" },
      replies: { label: "Replies", color: "hsl(var(--chart-2))" },
      sessions: { label: "Avg sessions", color: "hsl(var(--chart-3))" },
    }),
    [],
  );

  const engagementMix = useMemo(
    () => [
      { channel: "Community", threads: 1280, replies: 980, reactions: 720 },
      { channel: "Events", threads: 890, replies: 650, reactions: 420 },
      { channel: "Matches", threads: 1460, replies: 1110, reactions: 860 },
      { channel: "Concierge", threads: 620, replies: 510, reactions: 380 },
    ],
    [],
  );

  const engagementMixConfig = useMemo<ChartConfig>(
    () => ({
      threads: { label: "New threads", color: "hsl(var(--chart-1))" },
      replies: { label: "Replies", color: "hsl(var(--chart-2))" },
      reactions: { label: "Reactions", color: "hsl(var(--chart-4))" },
    }),
    [],
  );

  const topCommunities = [
    {
      name: "Product Creators",
      avatar: generateAvatarUrl("Product Creators"),
      activity: "+28% MoM",
      members: "1,420 active",
    },
    {
      name: "Designers Guild",
      avatar: generateAvatarUrl("Designers Guild"),
      activity: "+21% MoM",
      members: "1,180 active",
    },
    {
      name: "Wellness Collective",
      avatar: generateAvatarUrl("Wellness Collective"),
      activity: "+16% MoM",
      members: "940 active",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/40">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <Badge variant="outline" className="rounded-full border-primary/50 text-primary">
              <Users className="mr-2 h-4 w-4" /> User Intelligence
            </Badge>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">User analytics dashboard</h1>
              <p className="max-w-2xl text-muted-foreground">
                Track how people join, engage, and convert across the community lifecycle. Spot registration surges, monitor
                active cohorts, and keep subscriptions healthy with real-time signals.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="rounded-full" onClick={() => navigate("/dashboard")}>Back to host view</Button>
            <Button className="gap-2 rounded-full">
              Export report
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardDescription>New registrations</CardDescription>
              <CardTitle className="text-3xl font-semibold">940</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Oct month-to-date</span>
              <Badge variant="outline" className="border-emerald-300/60 bg-emerald-100/60 text-emerald-700">+14.8%</Badge>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardDescription>Daily active</CardDescription>
              <CardTitle className="text-3xl font-semibold">2.1k</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Rolling 7-day average</span>
              <Badge variant="outline" className="border-primary/50 text-primary">+6.2%</Badge>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardDescription>Paying subscribers</CardDescription>
              <CardTitle className="text-3xl font-semibold">3,950</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
              <span>62% paid penetration</span>
              <Badge variant="outline" className="border-blue-200 bg-blue-100 text-blue-700">+3.1% WoW</Badge>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-2">
              <CardDescription>Engagement rate</CardDescription>
              <CardTitle className="text-3xl font-semibold">74%</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Sessions with replies</span>
              <Badge variant="outline" className="border-amber-300 bg-amber-100 text-amber-700">Steady</Badge>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-3">
          <Card className="border-border/60 xl:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <div className="space-y-1">
                  <CardTitle className="text-2xl">Registration trends</CardTitle>
                  <CardDescription>New signups and activated accounts over the last seven months.</CardDescription>
                </div>
                <Badge variant="outline" className="rounded-full border-primary/40 text-primary">
                  <LineChartIcon className="mr-1 h-3.5 w-3.5" /> +18% activation lift
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={registrationConfig} className="h-[320px]">
                <AreaChart data={registrationTrend}>
                  <defs>
                    <linearGradient id="registrations" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.36} />
                      <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="activations" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} strokeOpacity={0.3} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <ChartTooltip cursor={{ stroke: "hsl(var(--border))" }} content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="registrations"
                    stroke="hsl(var(--chart-1))"
                    fill="url(#registrations)"
                    strokeWidth={2.5}
                    activeDot={{ r: 5 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="activations"
                    stroke="hsl(var(--chart-2))"
                    fill="url(#activations)"
                    strokeWidth={2.5}
                  />
                </AreaChart>
              </ChartContainer>
            </CardContent>
            <CardContent className="flex flex-col gap-3 border-t border-dashed border-border/70 bg-muted/40 py-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Activation nudges and onboarding tours are helping more people reach meaningful participation.
              </p>
              <Button variant="ghost" className="h-9 gap-2 rounded-full px-4" onClick={() => navigate("/onboarding")}>
                Improve onboarding
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Subscription status</CardTitle>
              <CardDescription>Live mix of free, paid, and enterprise accounts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ChartContainer config={subscriptionConfig} className="h-[260px]">
                <PieChart>
                  <Pie data={subscriptionBreakdown} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110}>
                    {subscriptionBreakdown.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                </PieChart>
              </ChartContainer>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">62% paid</span>
                  <Badge variant="outline" className="border-primary/40 text-primary">+210 net adds</Badge>
                </div>
                <p>Most upgrades happen within the first three sessions and after a successful match.</p>
                <div className="flex items-center gap-3 text-xs">
                  <Badge className="rounded-full bg-primary/15 text-primary">
                    <Flame className="mr-1 h-3.5 w-3.5" /> Renewal risk: 8%
                  </Badge>
                  <Badge variant="outline" className="rounded-full border-border/60">
                    <Bell className="mr-1 h-3.5 w-3.5 notification-micro-bounce" /> Dunning flows healthy
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="border-border/60 lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <div className="space-y-1">
                  <CardTitle className="text-2xl">Active user momentum</CardTitle>
                  <CardDescription>Daily and weekly actives with retention benchmarks.</CardDescription>
                </div>
                <Badge variant="outline" className="rounded-full border-primary/40 text-primary">
                  <Activity className="mr-1 h-3.5 w-3.5" /> +2.8% stickiness
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={activeUsageConfig} className="h-[300px]">
                <ComposedChart data={activeUsage}>
                  <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.25} />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis yAxisId="left" tickLine={false} axisLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tickFormatter={(value: number) => `${Math.round(value * 100)}%`}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                    domain={[0.5, 0.8]}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "hsl(var(--muted))" }} />
                  <Bar yAxisId="left" dataKey="wau" fill="hsl(var(--chart-4))" radius={[8, 8, 0, 0]} />
                  <Bar yAxisId="left" dataKey="dau" fill="hsl(var(--chart-3))" radius={[8, 8, 0, 0]} />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="retention"
                    stroke="hsl(var(--chart-5))"
                    strokeWidth={2.25}
                    dot={{ r: 3.5 }}
                  />
                </ComposedChart>
              </ChartContainer>
            </CardContent>
            <CardContent className="flex flex-wrap gap-3 border-t border-dashed border-border/70 bg-muted/40 py-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-[hsl(var(--chart-3))]" />
                DAU is pacing 36% of WAU, up from 32% last month.
              </div>
              <Separator orientation="vertical" className="hidden h-5 sm:block" />
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-[hsl(var(--chart-4))]" />
                68% of weekly users return within 48 hours.
              </div>
              <Separator orientation="vertical" className="hidden h-5 sm:block" />
              <div className="flex items-center gap-2">
                <span className="inline-flex h-2 w-2 rounded-full bg-[hsl(var(--chart-5))]" />
                Retention line tracks seven-day returning users.
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Engagement signals</CardTitle>
              <CardDescription>Conversations, replies, and session depth.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={engagementConfig} className="h-[260px]">
                <LineChart data={engagementMoments}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.25} />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis hide />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="messages" stroke="hsl(var(--chart-1))" strokeWidth={2.25} dot={false} />
                  <Line type="monotone" dataKey="replies" stroke="hsl(var(--chart-2))" strokeWidth={2.25} dot={false} />
                  <Line
                    type="monotone"
                    dataKey="sessions"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2.25}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
              <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>Reply quality</span>
                  <Badge variant="outline" className="border-emerald-200 bg-emerald-100 text-emerald-700">+9.4%</Badge>
                </div>
                <p>Guided prompts and pairing leads continue to lift sustained conversations.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Engagement mix</CardTitle>
              <CardDescription>Where conversations and reactions are happening.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={engagementMixConfig} className="h-[260px]">
                <BarChart data={engagementMix} stackOffset="expand">
                  <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.25} />
                  <XAxis dataKey="channel" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis hide />
                  <ChartTooltip content={<ChartTooltipContent />} cursor={{ fill: "hsl(var(--muted))" }} />
                  <Bar dataKey="threads" stackId="mix" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="replies" stackId="mix" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="reactions" stackId="mix" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ChartContainer>
              <p className="mt-4 text-sm text-muted-foreground">
                Community rooms and curated matches are driving the majority of conversations, with reactions picking up as
                weekly digests highlight trending threads.
              </p>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-3">
          <Card className="border-border/60 lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <div className="space-y-1">
                  <CardTitle className="text-2xl">Cohort health</CardTitle>
                  <CardDescription>Where members are finding value and what to amplify next.</CardDescription>
                </div>
                <Badge variant="outline" className="rounded-full border-primary/40 text-primary">
                  <BarChart3 className="mr-1 h-3.5 w-3.5" /> Watchlist cleared
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                {topCommunities.map((community) => (
                  <div key={community.name} className="rounded-xl border border-border/60 bg-muted/40 p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={community.avatar} alt={community.name} />
                        <AvatarFallback>{community.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-semibold">{community.name}</p>
                        <p className="text-xs text-muted-foreground">{community.members}</p>
                      </div>
                    </div>
                    <div className="mt-3 text-xs font-medium text-emerald-600">{community.activity}</div>
                  </div>
                ))}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Onboarding success</p>
                    <Badge variant="outline" className="border-emerald-200 bg-emerald-100 text-emerald-700">86%</Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Users completing all three first-week actions.</p>
                </div>
                <div className="rounded-xl border border-border/60 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Match-to-chat</p>
                    <Badge variant="outline" className="border-primary/40 text-primary">72%</Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">Matches that spark at least one conversation within 24 hours.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl">Next best actions</CardTitle>
              <CardDescription>Opportunities to keep momentum high.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {["Target high-intent signups with concierge intros", "Launch Pro trial for active Plus members", "Highlight renewed conversations in the weekly digest"].map((action) => (
                <div key={action} className="flex items-start gap-3 rounded-lg bg-muted/70 p-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
                  <p className="text-foreground/90">{action}</p>
                </div>
              ))}
              <Button variant="ghost" className="mt-2 w-full justify-center" onClick={() => navigate("/messages")}>
                Route to team
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default UserAnalyticsDashboard;
