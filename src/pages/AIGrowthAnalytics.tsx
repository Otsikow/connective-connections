import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ArrowRight,
  BellRing,
  Brain,
  Flame,
  LineChart as LineChartIcon,
  Megaphone,
  MessageSquare,
  Radar,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import BackButton from "@/components/BackButton";
import { usePageTitle } from "@/hooks/usePageTitle";

const AIGrowthAnalytics = () => {
  usePageTitle("AI Growth & Engagement Analytics");

  const funnel = useMemo(
    () => [
      { label: "Matches", value: 1280, conversion: "100%", delta: "+6% MoM" },
      {
        label: "Conversations",
        value: 812,
        conversion: "63%",
        delta: "+11% after AI icebreakers",
      },
      {
        label: "Meetups",
        value: 276,
        conversion: "21%",
        delta: "+4% after auto-scheduling",
      },
    ],
    [],
  );

  const dropOffPoints = [
    {
      stage: "After first reply",
      rate: "22% drop",
      cause: "Messages stall after the opening line",
      fix: "Inject playful follow-up prompts within 45 minutes",
    },
    {
      stage: "Before scheduling",
      rate: "17% drop",
      cause: "Time-slot friction and venue uncertainty",
      fix: "Offer three AI-picked times and safe meetup spots",
    },
    {
      stage: "Pre-event",
      rate: "9% drop",
      cause: "Weather and transit worries",
      fix: "Send route tips and weather-ready backups",
    },
  ];

  const aiSuggestions = [
    {
      title: "Smart intros",
      impact: "+12% conversations",
      description:
        "Rewrite stale greetings into context-aware icebreakers that reflect shared interests and tone preferences.",
      icon: Sparkles,
    },
    {
      title: "Momentum rescues",
      impact: "+8% meetup intent",
      description:
        "Detect stalled threads and suggest two next steps: a low-commitment activity or a quick check-in message.",
      icon: Flame,
    },
    {
      title: "Confidence nudges",
      impact: "-15% last-minute cancels",
      description:
        "Send host-verified venue tips, safety badges, and transit estimates to ease pre-meet nerves.",
      icon: ShieldCheck,
    },
  ];

  const personalitySegments = [
    {
      name: "Explorers",
      focus: "Love events",
      share: "32% of actives",
      behavior: "Join 2.4 events/week, react to novel venues",
      action: "Priority: early RSVP invites and host-led adventures",
      tone: "Enthusiastic",
    },
    {
      name: "Builders",
      focus: "Love friendships",
      share: "28% of actives",
      behavior: "Prefer 1:1 chats, deep profiles, slower pacing",
      action: "Priority: longer prompts, shared-goal matching",
      tone: "Reassuring",
    },
    {
      name: "Silent Browsers",
      focus: "High churn risk",
      share: "19% of actives",
      behavior: "Scroll-heavy, low replies, passive bookmarking",
      action: "Priority: gentle check-ins and low-friction invites",
      tone: "Light-touch",
    },
    {
      name: "Super Connectors",
      focus: "Hosts and referrers",
      share: "9% of actives",
      behavior: "Spin up chats quickly, pull others into meetups",
      action: "Priority: referral boosts and spotlight moments",
      tone: "Celebratory",
    },
  ];

  const retentionSignals = [
    {
      title: "Users likely to stop",
      count: 112,
      detail: "Haven't replied in 5+ days or skipped 2 invites",
      CTA: "Review at-risk cohort",
    },
    {
      title: "Need nudges",
      count: 184,
      detail: "Opened push but didn't engage with new matches",
      CTA: "Send micro-ask nudges",
    },
    {
      title: "Personalised nudges",
      count: 76,
      detail: "AI drafted prompts tailored to tone and hobbies",
      CTA: "Preview scripts",
    },
  ];

  const recommendationStats = [
    {
      label: "Match accuracy",
      value: "89%",
      helper: "Users rated 'on target'",
    },
    {
      label: "Icebreaker usefulness",
      value: "78%",
      helper: "Led to 2+ replies",
    },
    {
      label: "Meetup conversion",
      value: "24%",
      helper: "Matches → confirmed meetup",
    },
  ];

  const adminActions = [
    {
      label: "Send group-level nudges",
      description: "Push tailored reminders by segment and city tier.",
      icon: Megaphone,
    },
    {
      label: "Trigger engagement campaigns",
      description: "Launch win-back flows for browsers and new pairs.",
      icon: Radar,
    },
    {
      label: "Auto-schedule push notifications",
      description: "Let AI pick time windows when both parties are active.",
      icon: BellRing,
    },
  ];

  const safetyTrend = useMemo(
    () => [
      { month: "Jan", reports: 18, resolved: 15, response: 42 },
      { month: "Feb", reports: 22, resolved: 20, response: 38 },
      { month: "Mar", reports: 24, resolved: 22, response: 36 },
      { month: "Apr", reports: 21, resolved: 20, response: 35 },
      { month: "May", reports: 19, resolved: 18, response: 34 },
      { month: "Jun", reports: 20, resolved: 19, response: 33 },
      { month: "Jul", reports: 23, resolved: 22, response: 32 },
      { month: "Aug", reports: 25, resolved: 24, response: 31 },
      { month: "Sep", reports: 21, resolved: 20, response: 30 },
      { month: "Oct", reports: 19, resolved: 18, response: 29 },
      { month: "Nov", reports: 18, resolved: 17, response: 29 },
      { month: "Dec", reports: 17, resolved: 16, response: 28 },
    ],
    [],
  );

  const growthTrend = useMemo(
    () => [
      { month: "Jan", newUsers: 320, actives: 210, pro: 62 },
      { month: "Feb", newUsers: 360, actives: 228, pro: 68 },
      { month: "Mar", newUsers: 420, actives: 250, pro: 74 },
      { month: "Apr", newUsers: 450, actives: 272, pro: 80 },
      { month: "May", newUsers: 488, actives: 295, pro: 86 },
      { month: "Jun", newUsers: 520, actives: 312, pro: 92 },
      { month: "Jul", newUsers: 540, actives: 330, pro: 98 },
      { month: "Aug", newUsers: 580, actives: 348, pro: 105 },
      { month: "Sep", newUsers: 600, actives: 360, pro: 112 },
      { month: "Oct", newUsers: 620, actives: 375, pro: 118 },
      { month: "Nov", newUsers: 640, actives: 388, pro: 124 },
      { month: "Dec", newUsers: 660, actives: 402, pro: 130 },
    ],
    [],
  );

  const engagementTrend = useMemo(
    () => [
      { week: "W1", events: 42, checkIns: 31, replies: 610 },
      { week: "W2", events: 44, checkIns: 33, replies: 640 },
      { week: "W3", events: 45, checkIns: 34, replies: 655 },
      { week: "W4", events: 47, checkIns: 36, replies: 670 },
      { week: "W5", events: 48, checkIns: 37, replies: 700 },
      { week: "W6", events: 50, checkIns: 39, replies: 725 },
      { week: "W7", events: 52, checkIns: 41, replies: 748 },
      { week: "W8", events: 54, checkIns: 42, replies: 760 },
    ],
    [],
  );

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 pb-16">
      <div className="flex items-center gap-3">
        <BackButton>Back</BackButton>
        <Badge className="bg-gradient-to-r from-primary to-primary/70 text-primary-foreground">
          Growth & Engagement
        </Badge>
      </div>

      <Card className="border-border/50 bg-gradient-to-br from-background via-background to-primary/5 shadow-xl">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold">AI Growth & Engagement Analytics</CardTitle>
            <CardDescription className="max-w-3xl text-base text-muted-foreground">
              Pulse across the friendship funnel, retention risks, and actionable AI suggestions that keep conversations moving
              toward real-life meetups.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-4 py-2 text-sm font-medium">
            <LineChartIcon className="h-4 w-4 text-primary" />
            Live signals refreshed 5 min ago
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          {funnel.map((stage) => (
            <div
              key={stage.label}
              className="rounded-xl border border-border/60 bg-foreground/[0.02] p-4 shadow-sm"
            >
              <div className="flex items-center justify-between text-sm font-semibold text-muted-foreground">
                <span>{stage.label}</span>
                <span className="text-primary">{stage.conversion}</span>
              </div>
              <div className="mt-2 text-2xl font-bold">{stage.value.toLocaleString()}</div>
              <p className="mt-1 text-xs text-muted-foreground">{stage.delta}</p>
              <Progress value={Number(stage.conversion.replace("%", ""))} className="mt-3" />
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <ShieldCheck className="h-4 w-4" />
              Safety health over time
            </div>
            <CardTitle className="text-xl">Response speed and resolution</CardTitle>
            <CardDescription>
              Track incident reports, resolution counts, and median response time as the community scales.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={safetyTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "currentColor" }} />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(value) => `${value}`}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "currentColor" }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => `${value}m`}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "currentColor" }}
                />
                <Tooltip
                  cursor={{ stroke: "var(--border)", strokeDasharray: "4 4" }}
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="reports"
                  stroke="hsl(var(--destructive))"
                  strokeWidth={2.5}
                  activeDot={{ r: 6 }}
                  name="Reports"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="resolved"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  strokeDasharray="4 4"
                  activeDot={{ r: 6 }}
                  name="Resolved"
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="response"
                  fill="hsl(var(--muted))"
                  fillOpacity={0.35}
                  stroke="hsl(var(--muted-foreground))"
                  name="Median response (min)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <LineChartIcon className="h-4 w-4" />
              Member growth velocity
            </div>
            <CardTitle className="text-xl">Acquisition to Pro upgrades</CardTitle>
            <CardDescription>
              Visualize new users, weekly actives, and Pro conversions month over month.
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={growthTrend} margin={{ top: 10, right: 6, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorNewUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="colorActives" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "currentColor" }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: "currentColor" }} />
                <Tooltip
                  cursor={{ stroke: "var(--border)", strokeDasharray: "4 4" }}
                  contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="newUsers"
                  name="New users"
                  stroke="hsl(var(--primary))"
                  fillOpacity={1}
                  fill="url(#colorNewUsers)"
                  strokeWidth={2.5}
                />
                <Area
                  type="monotone"
                  dataKey="actives"
                  name="Weekly actives"
                  stroke="hsl(var(--accent))"
                  fillOpacity={1}
                  fill="url(#colorActives)"
                  strokeWidth={2.5}
                />
                <Line type="monotone" dataKey="pro" name="Pro upgrades" stroke="hsl(var(--foreground))" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm font-semibold text-primary">
            <Megaphone className="h-4 w-4" />
            Community engagement momentum
          </div>
          <CardTitle className="text-xl">Event check-ins and conversation volume</CardTitle>
          <CardDescription>
            How weekly events, check-ins, and replies move together as the community grows.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={engagementTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="week" tickLine={false} axisLine={false} tick={{ fill: "currentColor" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fill: "currentColor" }} />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted) / 0.3)" }}
                contentStyle={{ borderRadius: 12, border: "1px solid hsl(var(--border))" }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend />
              <Bar dataKey="events" name="Events hosted" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
              <Bar dataKey="checkIns" name="Check-ins" fill="hsl(var(--accent))" radius={[6, 6, 0, 0]} />
              <Bar dataKey="replies" name="Replies" fill="hsl(var(--foreground))" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              Friendship Conversion Rate
            </div>
            <CardTitle className="text-xl">Matches → Conversations → Meetups</CardTitle>
            <CardDescription>
              AI keeps conversations flowing and reduces friction on scheduling so more matches become real connections.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-3">
              {funnel.map((stage, index) => (
                <div key={stage.label} className="rounded-lg border border-border/60 p-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="border-primary/40 text-primary">
                      Step {index + 1}
                    </Badge>
                    <span className="text-sm font-semibold text-muted-foreground">{stage.label}</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{stage.conversion}</span>
                    <span className="text-xs text-muted-foreground">{stage.delta}</span>
                  </div>
                  <Progress value={Number(stage.conversion.replace("%", ""))} className="mt-3" />
                </div>
              ))}
            </div>

            <Separator />

            <div className="grid gap-3 md:grid-cols-3">
              {dropOffPoints.map((drop) => (
                <div key={drop.stage} className="rounded-lg border border-amber-200/30 bg-amber-50/20 p-4 dark:border-amber-200/20 dark:bg-amber-950/20">
                  <div className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-200">
                    <Target className="h-4 w-4" />
                    {drop.stage}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{drop.cause}</p>
                  <p className="mt-3 text-sm font-semibold">{drop.rate}</p>
                  <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-700 dark:text-amber-200">
                    <Sparkles className="h-3 w-3" />
                    {drop.fix}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Brain className="h-4 w-4" />
              AI suggestions to fix it
            </div>
            <CardTitle className="text-xl">Playbooks to unlock engagement</CardTitle>
            <CardDescription>
              Tested prompts and automation that recover stalled threads and increase meetup intent.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiSuggestions.map((suggestion) => (
              <div key={suggestion.title} className="rounded-lg border border-border/60 p-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <suggestion.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{suggestion.title}</p>
                    <p className="text-xs text-primary">{suggestion.impact}</p>
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{suggestion.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Users className="h-4 w-4" />
              User Personality Segments (AI Classified)
            </div>
            <CardTitle className="text-xl">Who we serve and how they engage</CardTitle>
            <CardDescription>
              Segment-aware prompts keep the tone, cadence, and invites aligned to each persona.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {personalitySegments.map((segment) => (
              <div key={segment.name} className="flex flex-col gap-2 rounded-lg border border-border/60 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{segment.name}</p>
                  <Badge variant="outline">{segment.focus}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{segment.behavior}</p>
                <div className="text-sm font-semibold text-primary">{segment.share}</div>
                <p className="text-xs text-muted-foreground">{segment.action}</p>
                <div className="inline-flex items-center gap-1 text-xs font-semibold text-foreground/80">
                  <MessageSquare className="h-3.5 w-3.5 text-primary" />
                  {segment.tone} tone preferred
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Radar className="h-4 w-4" />
              AI Retention Prediction
            </div>
            <CardTitle className="text-xl">Keep members before they drift</CardTitle>
            <CardDescription>
              Early signals surface churn risk, nudge needs, and ready-to-send scripts.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {retentionSignals.map((signal) => (
              <div key={signal.title} className="flex items-start justify-between rounded-lg border border-border/60 p-3">
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{signal.title}</p>
                  <p className="text-xs text-muted-foreground">{signal.detail}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{signal.count}</div>
                  <Button variant="ghost" size="sm" className="mt-1 gap-1 text-primary">
                    {signal.CTA}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-3 text-sm text-primary">
              <ShieldCheck className="h-4 w-4" />
              AI throttles messages to avoid fatigue and caps nudges at 2/day per user.
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <LineChartIcon className="h-4 w-4" />
              AI Recommendation Stats
            </div>
            <CardTitle className="text-xl">Quality signals that compound</CardTitle>
            <CardDescription>
              Performance of match scoring, conversation starters, and meetup guidance.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {recommendationStats.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border/60 p-4">
                <p className="text-sm font-semibold text-muted-foreground">{stat.label}</p>
                <div className="mt-2 text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.helper}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/15 via-background to-background">
          <CardHeader>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              <Megaphone className="h-4 w-4" />
              Admin Actions
            </div>
            <CardTitle className="text-xl">Do something with the insights</CardTitle>
            <CardDescription>Operational levers ready to launch.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {adminActions.map((action) => (
              <div key={action.label} className="flex items-start gap-3 rounded-lg border border-border/60 bg-background/60 p-3">
                <div className="mt-1 rounded-full bg-primary/10 p-2 text-primary">
                  <action.icon className="h-4 w-4" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </div>
            ))}
            <Button className="w-full gap-2" size="lg">
              Launch AI engagement recipe
              <Sparkles className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIGrowthAnalytics;
