import { useMemo, useState } from "react";
import {
  AlertCircle,
  Bell,
  CheckCircle2,
  Clock3,
  MapPin,
  Moon,
  ShieldCheck,
  ShieldPlus,
  Siren,
  Sparkles,
  Sun,
  Sunrise,
  Users,
  Wifi,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { usePageTitle } from "@/hooks/usePageTitle";

const timeWeights: Record<string, number> = {
  Morning: 12,
  Afternoon: 18,
  Evening: 38,
  Night: 58,
};

const venueWeights: Record<string, number> = {
  "Café": 18,
  "Public park": 28,
  "Members-only club": 12,
  "Private residence": 52,
};

const distanceWeights: Record<string, number> = {
  "< 2 km": 10,
  "2–8 km": 18,
  "8–20 km": 26,
  "> 20 km": 34,
};

const riskColor = (score: number) => {
  if (score >= 75) return "text-red-500";
  if (score >= 45) return "text-amber-500";
  return "text-emerald-500";
};

const AISafetyLayer = () => {
  usePageTitle("AI Safety Layer");

  const [trustedAlerts, setTrustedAlerts] = useState({
    proximity: true,
    lateCheckIn: true,
    safetyEscalation: false,
  });

  const scenarioRisks = useMemo(
    () => [
      {
        name: "Morning café", 
        timeOfDay: "Morning",
        venue: "Café",
        distance: "< 2 km",
      },
      {
        name: "Evening park meetup",
        timeOfDay: "Evening",
        venue: "Public park",
        distance: "2–8 km",
      },
      {
        name: "Night house session",
        timeOfDay: "Night",
        venue: "Private residence",
        distance: "8–20 km",
      },
    ],
    [],
  );

  const computedScenarios = useMemo(
    () =>
      scenarioRisks.map((scenario) => {
        const timeScore = timeWeights[scenario.timeOfDay];
        const venueScore = venueWeights[scenario.venue];
        const distanceScore = distanceWeights[scenario.distance];
        const total = Math.min(100, Math.round(timeScore * 0.35 + venueScore * 0.45 + distanceScore * 0.2));
        return { ...scenario, timeScore, venueScore, distanceScore, total };
      }),
    [scenarioRisks],
  );

  const suspiciousSignals = [
    {
      title: "Rapid venue changes",
      detail: "AI flags users who switch meetup spots multiple times or push late-night pivots.",
      severity: "High",
    },
    {
      title: "Off-platform redirections",
      detail: "Detects repeated attempts to move chats to unknown links or encrypted channels.",
      severity: "Medium",
    },
    {
      title: "Aggressive pacing",
      detail: "Identifies users pressing for immediate meetups without mutual context or verification.",
      severity: "Medium",
    },
    {
      title: "Location spoofing",
      detail: "Alerts hosts when a user's check-in radius jumps unexpectedly or conflicts with device signals.",
      severity: "High",
    },
  ];

  const safetyGuidelines = [
    "Prefer well-lit, public venues for first-time meetups and confirm venue staff presence.",
    "Avoid sharing personal contact details until both sides have verified profiles and mutual history.",
    "Share ETA with a trusted contact, and schedule an automatic check-in 10 minutes after arrival.",
    "Use in-app messaging for any pivots; decline links that have not been scanned or reputation-checked.",
    "Confirm transit options before leaving and set a daylight fallback plan if delays occur.",
  ];

  const checkIns = [
    {
      label: "Pre-leaving",
      detail: "AI confirms venue route, transit time, and opens a quick-report button.",
      status: "Scheduled",
    },
    {
      label: "Arrival",
      detail: "Location ping verifies proximity and shares safety status with trusted contacts.",
      status: "Live",
    },
    {
      label: "30-min pulse",
      detail: "Soft prompt for how things feel; escalates if no response within 2 minutes.",
      status: "Pending",
    },
    {
      label: "Wrap-up",
      detail: "Closes the loop with sentiment score, venue feedback, and follow-up recommendations.",
      status: "Queued",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">Trust & Safety Layer</p>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            AI Safety & Trust Console
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Score event locations, monitor behavior shifts, and keep members connected with fast check-ins and
            trusted-contact alerts.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 text-xs font-medium text-muted-foreground">
          <Badge variant="secondary" className="gap-2">
            <ShieldPlus className="h-4 w-4 text-primary" />
            Live AI guardrails
          </Badge>
          <div className="flex items-center gap-2 rounded-full bg-foreground/[0.03] px-3 py-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Safety insights refresh every 90s
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-foreground/10">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Location trust</CardTitle>
              <CardDescription>AI considers lighting, crowd signals, and staff presence.</CardDescription>
            </div>
            <Badge variant="outline" className="gap-1 text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
              Stable
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="h-10 w-10 rounded-full bg-emerald-50 p-2 text-emerald-600" />
              <div>
                <p className="text-2xl font-semibold text-foreground">9.1 / 10</p>
                <p className="text-sm text-muted-foreground">Verified venues with staffed hours</p>
              </div>
            </div>
            <Progress value={91} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Local incidents, lighting, crowd density, and venue reputation contribute to the score.
            </p>
          </CardContent>
        </Card>

        <Card className="border-foreground/10">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg">User trust</CardTitle>
              <CardDescription>Behavioral fingerprints with de-escalation suggestions.</CardDescription>
            </div>
            <Badge variant="outline" className="gap-1 text-amber-600">
              <AlertCircle className="h-4 w-4" />
              Watching
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Users className="h-10 w-10 rounded-full bg-amber-50 p-2 text-amber-600" />
              <div>
                <p className="text-2xl font-semibold text-foreground">3 flags</p>
                <p className="text-sm text-muted-foreground">Context-aware nudges before any escalation</p>
              </div>
            </div>
            <Progress value={35} className="h-2" />
            <p className="text-xs text-muted-foreground">
              AI blends historical tone, pacing, and verification signals to predict risky interactions.
            </p>
          </CardContent>
        </Card>

        <Card className="border-foreground/10">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div>
              <CardTitle className="text-lg">Emergency channel</CardTitle>
              <CardDescription>Fast pathways to contacts, hosts, and local responders.</CardDescription>
            </div>
            <Badge variant="outline" className="gap-1 text-sky-600">
              <Wifi className="h-4 w-4" />
              Network clear
            </Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <Siren className="h-10 w-10 rounded-full bg-sky-50 p-2 text-sky-600" />
              <div>
                <p className="text-2xl font-semibold text-foreground">90 sec</p>
                <p className="text-sm text-muted-foreground">Average escalation routing</p>
              </div>
            </div>
            <Progress value={78} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Secure channel routes include silent alerts, location handoff, and host paging.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-foreground/10 shadow-sm">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl">Location risk scoring</CardTitle>
            <CardDescription>Dynamic risk factoring time of day, venue type, and distance.</CardDescription>
          </div>
          <Badge variant="secondary" className="gap-2">
            <Clock3 className="h-4 w-4" />
            Real-time signals
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            {computedScenarios.map((scenario) => (
              <div key={scenario.name} className="rounded-xl border border-foreground/5 bg-foreground/[0.02] p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{scenario.name}</p>
                    <p className="text-xs text-muted-foreground">AI blends nearby reports and transit signal.</p>
                  </div>
                  <div className="text-right text-sm font-semibold text-foreground">
                    <span className={riskColor(scenario.total)}>{scenario.total}/100</span>
                    <p className="text-[11px] text-muted-foreground">Composite risk</p>
                  </div>
                </div>
                <Separator className="my-3" />
                <div className="flex flex-col gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-foreground">
                      <Sunrise className="h-4 w-4" />
                      <span>{scenario.timeOfDay}</span>
                    </div>
                    <span className="font-semibold text-foreground">{scenario.timeScore}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{scenario.venue}</span>
                    </div>
                    <span className="font-semibold text-foreground">{scenario.venueScore}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-foreground">
                      <Moon className="h-4 w-4" />
                      <span>{scenario.distance}</span>
                    </div>
                    <span className="font-semibold text-foreground">{scenario.distanceScore}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Weights update per city and ingest venue policies, lighting, crowd signals, weather, and past incident
            patterns. The AI flags scenarios over 70/100 for host review and pre-meet nudges.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-foreground/10 shadow-sm">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl">Suspicious behavior detection</CardTitle>
              <CardDescription>Adaptive scoring with human-in-the-loop escalation.</CardDescription>
            </div>
            <Badge variant="secondary" className="gap-2">
              <AlertCircle className="h-4 w-4" />
              12 active watch events
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {suspiciousSignals.map((signal) => (
                <div key={signal.title} className="rounded-lg border border-foreground/5 bg-foreground/[0.02] p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{signal.title}</p>
                      <p className="text-xs text-muted-foreground">{signal.detail}</p>
                    </div>
                    <Badge variant="outline" className={signal.severity === "High" ? "border-red-200 text-red-600" : "border-amber-200 text-amber-600"}>
                      {signal.severity}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              AI applies safety floor policies: warn → pause → escalate with human review prompts.
            </div>
          </CardContent>
        </Card>

        <Card className="border-foreground/10 shadow-sm">
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl">Emergency check-ins</CardTitle>
              <CardDescription>Lightweight prompts that keep trusted parties in the loop.</CardDescription>
            </div>
            <Badge variant="secondary" className="gap-2">
              <Bell className="h-4 w-4" />
              Smart reminders on
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {checkIns.map((item) => (
                <div key={item.label} className="flex items-start justify-between gap-3 rounded-lg border border-foreground/5 bg-foreground/[0.02] p-3">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.detail}</p>
                  </div>
                  <Badge variant="outline" className="text-foreground">
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="default" className="gap-2">
                <Siren className="h-4 w-4" />
                Trigger silent alert
              </Button>
              <Button variant="secondary" className="gap-2">
                <ShieldCheck className="h-4 w-4" />
                Share live status
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-foreground/10 shadow-sm">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl">Safe meetup guidelines</CardTitle>
            <CardDescription>Personalized guardrails that adjust to risk signals.</CardDescription>
          </div>
          <Badge variant="secondary" className="gap-2">
            <ShieldPlus className="h-4 w-4" />
            AI recommendations
          </Badge>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-3">
            {safetyGuidelines.map((guideline) => (
              <div key={guideline} className="flex items-start gap-3 rounded-lg border border-foreground/5 bg-foreground/[0.02] p-3">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-600" />
                <p className="text-sm text-foreground">{guideline}</p>
              </div>
            ))}
          </div>
          <div className="space-y-3 rounded-xl border border-foreground/5 bg-foreground/[0.02] p-4">
            <p className="text-sm font-semibold text-foreground">Trusted-contact alerts</p>
            <p className="text-xs text-muted-foreground">
              Share status with selected contacts based on proximity, timing, or escalation signals. Alerts include
              live location, venue details, and silent acknowledgement buttons.
            </p>
            <div className="space-y-3 text-sm">
              {[
                { key: "proximity", label: "Ping if I leave the venue radius", description: "Sends check-in if location drifts beyond 300m." },
                { key: "lateCheckIn", label: "Alert if I miss a check-in", description: "Notifies trusted contact after 3 minutes without response." },
                { key: "safetyEscalation", label: "Share if AI flags risky behavior", description: "Pushes context when a conversation crosses safety thresholds." },
              ].map((item) => (
                <div key={item.key} className="flex items-start justify-between gap-3 rounded-lg border border-foreground/5 p-3">
                  <div>
                    <p className="font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch
                    checked={trustedAlerts[item.key as keyof typeof trustedAlerts]}
                    onCheckedChange={(checked) =>
                      setTrustedAlerts((prev) => ({ ...prev, [item.key]: checked }))
                    }
                    aria-label={item.label}
                  />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AISafetyLayer;
