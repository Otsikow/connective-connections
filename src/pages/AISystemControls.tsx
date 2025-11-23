import { useMemo, useState } from "react";
import {
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  Activity,
  AlertTriangle,
  Bot,
  Brain,
  Database,
  Globe2,
  KeyRound,
  Layers,
  Lock,
  ShieldCheck,
  SignalHigh,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";

const AISystemControls = () => {
  usePageTitle("AI System Controls");

  const [selectedStrictness, setSelectedStrictness] = useState("Moderate");
  const [autoActions, setAutoActions] = useState({
    warnings: true,
    muting: true,
    suspending: false,
  });
  const [loggingRetention, setLoggingRetention] = useState(60);
  const [loggingDetail, setLoggingDetail] = useState("Structured summaries");
  const [modelProvider, setModelProvider] = useState("OpenAI");
  const [rateLimit, setRateLimit] = useState(120);
  const [apiKeyRotation, setApiKeyRotation] = useState("Every 30 days");
  const [safetyRegion, setSafetyRegion] = useState("EU rules");

  const strictnessLevels = useMemo(
    () => [
      {
        name: "Basic",
        description: "Light-touch guardrails for casual spaces where interventions should feel invisible.",
        badge: "Most flexible",
        icon: Sparkles,
        risk: "Lower oversight, suitable for warm communities",
      },
      {
        name: "Moderate",
        description: "Balanced protections with context-aware interventions and human-friendly explanations.",
        badge: "Recommended",
        icon: ShieldCheck,
        risk: "Keeps tone healthy without over-correction",
      },
      {
        name: "Strict",
        description: "Real-time filtering for sensitive spaces, with aggressive pattern detection and escalation cues.",
        badge: "High guardrails",
        icon: Lock,
        risk: "Best for events with heightened compliance needs",
      },
      {
        name: "Ultra Safe",
        description: "Maximum safety posture with multi-signal scanning, auto-lockdowns, and human review prompts.",
        badge: "Zero tolerance",
        icon: AlertTriangle,
        risk: "For crisis, youth, or regulated environments",
      },
    ],
    [],
  );

  const autoActionToggles = [
    {
      key: "warnings" as const,
      label: "Auto-warnings",
      description: "Send gentle guidance before behavior escalates.",
      icon: Activity,
    },
    {
      key: "muting" as const,
      label: "Auto-muting",
      description: "Temporarily silence users who ignore warnings.",
      icon: Bot,
    },
    {
      key: "suspending" as const,
      label: "Auto-suspension",
      description: "Immediate lockouts for severe or repeated violations.",
      icon: Lock,
    },
  ];

  const loggingLevels = [
    "Metadata only",
    "Structured summaries",
    "Full transcripts",
  ];

  const modelProviders = [
    {
      name: "OpenAI",
      subtitle: "Reasoning-first with safety shields enabled.",
      icon: Brain,
      status: "Live",
    },
    {
      name: "Gemini",
      subtitle: "Multi-modal context with enterprise safety filters.",
      icon: Layers,
      status: "Available",
    },
  ];

  const safetyRegions = [
    {
      name: "UK rules",
      detail: "Age-gating and harmful content blocks aligned to Ofcom guidance.",
    },
    {
      name: "EU rules",
      detail: "DSA-informed prompts, opt-outs, and transparent logging.",
    },
    {
      name: "US rules",
      detail: "Crisis content pathways and CCPA-friendly data retention windows.",
    },
    {
      name: "Africa rules",
      detail: "Regional harm lexicons with community-led escalation templates.",
    },
  ];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-12">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/70">
            Safety & Reliability
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            AI System Controls
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground">
            Tune how the AI mediates interactions, logs activity, and adapts to regional safety
            expectations. Changes apply instantly to live experiences.
          </p>
        </div>
        <div className="flex flex-col items-end gap-3 text-sm text-muted-foreground">
          <Badge variant="outline" className="gap-2 border-primary/50 text-foreground">
            <SignalHigh className="h-4 w-4 text-primary" />
            Real-time protections enabled
          </Badge>
          <div className="flex items-center gap-2 rounded-full bg-foreground/[0.03] px-4 py-2 text-xs font-medium">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
            Policy changes propagate in under 90 seconds
          </div>
        </div>
      </div>

      <Card className="border-foreground/10 shadow-sm">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-xl">AI Strictness Levels</CardTitle>
            <CardDescription>
              Choose the guardrail intensity for conversational and event automation.
            </CardDescription>
          </div>
          <Badge variant="secondary" className="gap-2">
            <ShieldCheck className="h-4 w-4" />
            Active: {selectedStrictness}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {strictnessLevels.map((level) => {
              const Icon = level.icon;
              const isSelected = selectedStrictness === level.name;
              return (
                <button
                  key={level.name}
                  onClick={() => setSelectedStrictness(level.name)}
                  className={`group relative flex h-full flex-col items-start gap-3 rounded-xl border p-4 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-primary/60 bg-primary/5 shadow-[0_12px_45px_-28px_rgba(190,150,80,0.85)]"
                      : "border-foreground/10 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-foreground/[0.02]"
                  }`}
                  aria-pressed={isSelected}
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                        isSelected ? "border-primary/60 bg-primary/10" : "border-foreground/10"
                      }`}>
                        <Icon className={`h-5 w-5 ${isSelected ? "text-primary" : "text-foreground"}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold leading-tight">{level.name}</p>
                        <p className="text-xs text-muted-foreground">{level.risk}</p>
                      </div>
                    </div>
                    <Badge variant={isSelected ? "default" : "outline"}>{level.badge}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{level.description}</p>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-foreground/10 shadow-sm">
          <CardHeader>
            <CardTitle>Auto-Actions</CardTitle>
            <CardDescription>
              Configure what happens when the AI detects unsafe or off-policy behavior.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {autoActionToggles.map((action) => {
              const Icon = action.icon;
              return (
                <div
                  key={action.key}
                  className="flex items-center justify-between gap-4 rounded-lg border border-foreground/8 bg-foreground/[0.015] px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={autoActions[action.key]}
                    onCheckedChange={(checked) =>
                      setAutoActions((prev) => ({ ...prev, [action.key]: checked }))
                    }
                  />
                </div>
              );
            })}
            <div className="rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-primary">
              Tip: Auto-warnings pair best with Moderate or Strict levels to reduce manual reviews by ~32%.
            </div>
          </CardContent>
        </Card>

        <Card className="border-foreground/10 shadow-sm">
          <CardHeader>
            <CardTitle>AI Logging</CardTitle>
            <CardDescription>
              Control retention and fidelity for AI system messages and intervention logs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm font-semibold">
                <span>Retention window</span>
                <span>{loggingRetention} days</span>
              </div>
              <Slider
                className="mt-3"
                value={[loggingRetention]}
                min={7}
                max={180}
                step={1}
                onValueChange={([value]) => setLoggingRetention(value)}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                Shorter retention improves privacy; longer windows help with safety audits.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {loggingLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => setLoggingDetail(level)}
                  className={`rounded-lg border px-3 py-3 text-left text-sm transition ${
                    loggingDetail === level
                      ? "border-primary/60 bg-primary/5"
                      : "border-foreground/10 hover:border-primary/30"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{level}</span>
                    {loggingDetail === level && <Badge variant="secondary">Selected</Badge>}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {level === "Metadata only" && "Store timestamps, roles, and redaction markers without content."}
                    {level === "Structured summaries" && "Capture synthesized context plus redacted highlights for audits."}
                    {level === "Full transcripts" && "Retain full messages with masked PII and policy annotations."}
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-foreground/10 shadow-sm">
          <CardHeader>
            <CardTitle>Model Settings</CardTitle>
            <CardDescription>
              Switch providers, tune rate limits, and rotate credentials without downtime.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {modelProviders.map((provider) => {
                const Icon = provider.icon;
                const active = modelProvider === provider.name;
                return (
                  <button
                    key={provider.name}
                    onClick={() => setModelProvider(provider.name)}
                    className={`flex items-center gap-3 rounded-lg border p-3 text-left transition ${
                      active
                        ? "border-primary/60 bg-primary/5 shadow-[0_10px_34px_-28px_rgba(190,150,80,0.85)]"
                        : "border-foreground/10 hover:border-primary/30"
                    }`}
                    aria-pressed={active}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/[0.04]">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{provider.name}</p>
                      <p className="text-xs text-muted-foreground">{provider.subtitle}</p>
                    </div>
                    <Badge variant={active ? "default" : "secondary"}>{provider.status}</Badge>
                  </button>
                );
              })}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-foreground/8 bg-foreground/[0.015] p-4">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary" />
                    Requests per minute
                  </div>
                  <span>{rateLimit} rpm</span>
                </div>
                <Slider
                  className="mt-3"
                  value={[rateLimit]}
                  min={60}
                  max={360}
                  step={10}
                  onValueChange={([value]) => setRateLimit(value)}
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Set burst protection to avoid throttling during event spikes.
                </p>
              </div>
              <div className="rounded-lg border border-foreground/8 bg-foreground/[0.015] p-4">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-primary" />
                    API key rotation
                  </div>
                  <Badge variant="outline">{apiKeyRotation}</Badge>
                </div>
                <div className="mt-3 grid gap-2 text-sm">
                  {["Every 30 days", "Every 90 days", "Manual"].map((option) => (
                    <Button
                      key={option}
                      variant={apiKeyRotation === option ? "secondary" : "ghost"}
                      size="sm"
                      className="justify-start"
                      onClick={() => setApiKeyRotation(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Rotate keys without downtime; live traffic auto-fails over.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-foreground/10 shadow-sm">
          <CardHeader>
            <CardTitle>AI Safety Regions</CardTitle>
            <CardDescription>
              Align safety models and content standards to local regulations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {safetyRegions.map((region) => (
                <button
                  key={region.name}
                  onClick={() => setSafetyRegion(region.name)}
                  className={`rounded-lg border p-3 text-left transition ${
                    safetyRegion === region.name
                      ? "border-primary/60 bg-primary/5"
                      : "border-foreground/10 hover:border-primary/30"
                  }`}
                  aria-pressed={safetyRegion === region.name}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Globe2 className="h-4 w-4 text-primary" />
                      <p className="text-sm font-semibold">{region.name}</p>
                    </div>
                    {safetyRegion === region.name && <Badge variant="secondary">Active</Badge>}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{region.detail}</p>
                </button>
              ))}
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-foreground/8 bg-foreground/[0.015] p-3 text-xs text-muted-foreground">
              <Database className="mt-0.5 h-4 w-4 text-primary" />
              <p>
                Each region applies tailored prompts, risk lexicons, and logging defaults. Switching regions keeps existing audit
                trails intact.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-dashed border-foreground/15">
        <CardContent className="flex flex-wrap items-center justify-between gap-4 py-6">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Lock className="h-4 w-4 text-primary" />
            <div>
              <p className="font-semibold text-foreground">Live safety posture</p>
              <p className="text-xs">{selectedStrictness} · {modelProvider} · {safetyRegion}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="gap-2">
              <Brain className="h-4 w-4" />
              Adaptive routing on
            </Badge>
            <Badge variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Rate limit {rateLimit} rpm
            </Badge>
            <Badge variant="outline" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Auto-actions {autoActions.warnings || autoActions.muting || autoActions.suspending ? "engaged" : "off"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AISystemControls;
