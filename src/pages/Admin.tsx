// src/pages/Admin.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/usePageTitle";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import {
  Shield,
  Mail,
  Users,
  Settings,
  Send,
  ShieldCheck,
  Bot,
  Ban,
  IdCard,
  AlertTriangle,
  Activity,
  Gauge,
  TrendingDown,
  TrendingUp,
  ListChecks,
  Bell,
  Power,
  Settings2,
  CheckCircle2,
} from "lucide-react";
import BackButton from "@/components/BackButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Profile {
  id: string;
  full_name: string | null;
  created_at: string | null;
  email?: string | null;
  roles: string[];
  loading?: boolean;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  usePageTitle("Admin Command Center");

  const [isAdmin, setIsAdmin] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [autoModerationEnabled, setAutoModerationEnabled] = useState(true);
  const [strictnessLevel, setStrictnessLevel] = useState(68);

  const safetyFeatures = [
    {
      title: "Harassment & threat detection",
      description:
        "Automatically scans messages for harassment, threats, or inappropriate content and issues AI-crafted warnings before it escalates.",
      badge: "Auto-warn live",
      icon: ShieldCheck,
    },
    {
      title: "Suspicious account flagging",
      description:
        "Surfaces risky behavior patterns, flags suspect accounts, and queues them for instant follow-up or automated suspension.",
      badge: "Risk scoring on",
      icon: Ban,
    },
    {
      title: "Bot, spam, and scam detection",
      description:
        "Filters bots and spammers in real time so community spaces stay clean without hands-on moderation.",
      badge: "Active filter",
      icon: Bot,
    },
    {
      title: "ID & profile verification",
      description:
        "Auto-verifies ID documents and profile photos to keep hosts and attendees safe with minimal manual review.",
      badge: "Auto-verify",
      icon: IdCard,
    },
  ];

  const safetyAlerts = {
    flaggedChats: { today: 18, week: 94, month: 376, change: "+12% vs yesterday" },
    flaggedAccounts: { value: 7, note: "AI paused 3 high-risk profiles" },
    urgent: [
      {
        title: "Escalated conversation flagged",
        description: "Group chat in Community Leads shows repeated harassment triggers.",
        severity: "High",
      },
      {
        title: "Multiple reports on @nightowl",
        description: "4 independent reports in the last hour for spam links.",
        severity: "Medium",
      },
    ],
  };

  const predictionSummary = [
    {
      title: "User activity trends",
      value: "+14%",
      description: "Engagement lifted after AI onboarding nudges.",
      icon: Activity,
      accent: "text-emerald-500",
    },
    {
      title: "Event success predictions",
      value: "82%",
      description: "Upcoming host events predicted to fill based on past conversion.",
      icon: Gauge,
      accent: "text-indigo-500",
    },
    {
      title: "Communities growing",
      value: "6",
      description: "Tech, Wellness, and City Nightlife trending upward.",
      icon: TrendingUp,
      accent: "text-blue-500",
    },
    {
      title: "Expected churn rate",
      value: "3.1%",
      description: "Down 0.7% after proactive outreach sequences.",
      icon: TrendingDown,
      accent: "text-amber-500",
    },
  ];

  const moderationActions = [
    { label: "Auto-warnings sent", value: 42, delta: "+9% vs avg" },
    { label: "Auto-suspensions", value: 6, delta: "2 pending reviews" },
    { label: "AI-resolved issues", value: 31, delta: "78% resolved without human" },
  ];

  const performanceMetrics = [
    {
      title: "Accuracy of AI moderation",
      value: 92,
      goal: "Goal: 95%+",
      accent: "[&>*]:bg-emerald-500",
    },
    {
      title: "False positives detected",
      value: 6,
      goal: "Trending down this week",
      accent: "[&>*]:bg-amber-500",
    },
    {
      title: "Pending human reviews",
      value: 14,
      goal: "Goal: under 10",
      accent: "[&>*]:bg-blue-500",
    },
  ];

  const communitySignals = {
    growing: [
      { name: "Tech Makers", change: "+18% active", detail: "New AI mentorship series" },
      { name: "Wellness Weekly", change: "+11% joins", detail: "Meditation collabs performing" },
    ],
    declining: [
      { name: "Weekend Adventurers", change: "-6% check-ins", detail: "Drop after weather alerts" },
      { name: "City Nightlife", change: "-4% RSVPs", detail: "AI suggests spotlighting hosts" },
    ],
  };

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }

        const { data: isAdmin, error: roleError } = await supabase
          .rpc("has_role", {
            _user_id: user.id,
            _role: "admin",
          });

        if (roleError) {
          console.error("Error checking admin role:", roleError);
          setError("Failed to verify admin status");
          setLoading(false);
          return;
        }

        if (!isAdmin) {
          setError("Access denied: admin only");
          setLoading(false);
          return;
        }

        setIsAdmin(true);
        await loadProfiles();
      } catch (err) {
        console.error("Error verifying admin:", err);
        setError("Failed to verify admin");
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
  }, []);

  const loadProfiles = async () => {
    try {
      setLoading(true);
      const { data, error: profilesError } = await supabase
        .from("profiles")
        .select("id, full_name, created_at, email, user_roles(role)")
        .order("created_at", { ascending: false });

      if (profilesError) {
        throw profilesError;
      }

      setProfiles(
        (data ?? []).map((profile) => ({
          id: profile.id,
          full_name: profile.full_name,
          created_at: profile.created_at ?? null,
          // @ts-ignore
          roles: profile.user_roles.map((r) => r.role) ?? [],
          email: profile.email || null,
        }))
      );
    } catch (err) {
      console.error("Error loading profiles:", err);
      toast({
        title: "Error",
        description: "Failed to load profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (
    userId: string,
    role: string,
    action: "assign" | "revoke"
  ) => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Not logged in");

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-user-role`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ userId, role, action }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update role");

      toast({
        title: "Success",
        description: data.message || `Role ${action === "assign" ? "assigned" : "revoked"}.`,
      });

      await loadProfiles();
    } catch (err: unknown) {
      console.error("Role change error:", err);
      const description =
        err instanceof Error ? err.message : "Failed to update role";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    }
  };

  const fetchUserEmail = async (userId: string, index: number) => {
    try {
      setProfiles((prev) =>
        prev.map((p, i) => (i === index ? { ...p, loading: true } : p))
      );
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Not logged in");

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-user-email?userId=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load email");

      setProfiles((prev) =>
        prev.map((p, i) =>
          i === index ? { ...p, email: data.email, loading: false } : p
        )
      );
    } catch (err) {
      console.error("Error fetching email:", err);
      setProfiles((prev) =>
        prev.map((p, i) =>
          i === index
            ? { ...p, email: "Error loading email", loading: false }
            : p
        )
      );
    }
  };

  const handleSendBulkEmail = async () => {
    if (!emailSubject.trim() || !emailMessage.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide both subject and message",
        variant: "destructive",
      });
      return;
    }

    try {
      setSendingEmail(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) throw new Error("Not logged in");

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-bulk-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            subject: emailSubject,
            message: emailMessage,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send email");

      toast({ title: "Success", description: data.message || "Emails sent!" });
      setEmailSubject("");
      setEmailMessage("");
    } catch (err: unknown) {
      console.error("Bulk email error:", err);
      const description =
        err instanceof Error ? err.message : "Failed to send emails";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Shield className="w-8 h-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Verifying admin access…</p>
      </div>
    );

  if (error || !isAdmin)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {error || "You do not have admin privileges."}
            </p>
            <Button onClick={() => navigate("/home")} className="w-full">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-card border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <BackButton fallbackPath="/home" />
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5" /> Admin Dashboard
        </h1>
        <Badge variant="secondary">Admin Access</Badge>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <AlertTriangle className="w-5 h-5 text-amber-500" /> AI Safety Alerts
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Flagged chats, suspicious accounts, and urgent risks surfaced by moderation AI.
                </p>
              </div>
              <Badge variant="outline" className="bg-amber-50/10 text-amber-500 border-amber-500/30">
                Live
              </Badge>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border border-border/60 bg-muted/40 p-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Flagged chats</span>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Bell className="h-3.5 w-3.5" /> Today
                    </Badge>
                  </div>
                  <p className="mt-3 text-3xl font-bold">{safetyAlerts.flaggedChats.today}</p>
                  <p className="text-xs text-muted-foreground">{safetyAlerts.flaggedChats.change}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="rounded-md bg-background/60 p-2">
                      <p className="text-foreground/80 font-medium">This week</p>
                      <p className="text-lg font-semibold text-foreground">{safetyAlerts.flaggedChats.week}</p>
                    </div>
                    <div className="rounded-md bg-background/60 p-2">
                      <p className="text-foreground/80 font-medium">This month</p>
                      <p className="text-lg font-semibold text-foreground">{safetyAlerts.flaggedChats.month}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-border/60 bg-muted/40 p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Users className="h-4 w-4" /> Flagged accounts
                  </div>
                  <p className="mt-3 text-3xl font-bold text-foreground">{safetyAlerts.flaggedAccounts.value}</p>
                  <p className="text-xs text-muted-foreground">{safetyAlerts.flaggedAccounts.note}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>All urgent profiles require approval before reinstatement.</span>
                  </div>
                </div>

                <div className="rounded-lg border border-border/60 bg-primary/5 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary">
                      <Shield className="h-4 w-4" />
                      <p className="font-semibold">Protection status</p>
                    </div>
                    <Badge variant="outline" className="border-primary/40 text-primary">
                      Auto-moderation
                    </Badge>
                  </div>
                  <p className="mt-3 text-lg font-semibold text-foreground">Coverage is stable</p>
                  <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <ListChecks className="h-4 w-4 text-primary" /> 98% of live rooms actively monitored
                    </p>
                    <p className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary" /> Safety actions synced with host dashboards
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border/70 bg-background/60 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" /> Urgent alerts
                </div>
                <div className="space-y-3">
                  {safetyAlerts.urgent.map((alert) => (
                    <div
                      key={alert.title}
                      className="flex flex-col gap-1 rounded-md border border-border/60 bg-muted/30 p-3"
                    >
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-foreground">{alert.title}</p>
                        <Badge
                          variant="outline"
                          className={
                            alert.severity === "High"
                              ? "border-amber-500/40 text-amber-500"
                              : "border-blue-500/40 text-blue-500"
                          }
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings2 className="h-5 w-5" /> AI Moderation Actions
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Fast snapshot of automated responses and queue health.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {moderationActions.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-md border border-border/70 bg-background/60 p-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.delta}</p>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{item.value}</p>
                </div>
              ))}

              <div className="rounded-md border border-primary/30 bg-primary/5 p-3 text-sm">
                <p className="flex items-center gap-2 text-primary font-semibold">
                  <CheckCircle2 className="h-4 w-4" /> AI-resolved issues are auto-notified to hosts
                </p>
                <p className="mt-1 text-muted-foreground">
                  Confirmation receipts are sent to reporters when actions are taken.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Activity className="h-5 w-5 text-primary" /> AI Prediction Summary
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Forward-looking signals on usage, events, and community health.
                </p>
              </div>
              <Badge variant="secondary" className="flex items-center gap-2">
                <Gauge className="h-4 w-4" /> Updated 3m ago
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {predictionSummary.map(({ title, value, description, icon: Icon, accent }) => (
                  <div
                    key={title}
                    className="rounded-lg border border-border/60 bg-muted/30 p-4 flex items-start gap-3"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-background/70 ${accent}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">{title}</p>
                      <p className="text-2xl font-bold text-foreground">{value}</p>
                      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-lg border border-border/70 bg-background/60 p-4">
                <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500" /> Community signals
                </p>
                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Growing</p>
                    {communitySignals.growing.map((signal) => (
                      <div
                        key={signal.name}
                        className="rounded-md border border-border/60 bg-muted/30 p-3"
                      >
                        <p className="font-semibold text-foreground">{signal.name}</p>
                        <p className="text-sm text-emerald-500">{signal.change}</p>
                        <p className="text-xs text-muted-foreground">{signal.detail}</p>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Declining</p>
                    {communitySignals.declining.map((signal) => (
                      <div
                        key={signal.name}
                        className="rounded-md border border-border/60 bg-muted/30 p-3"
                      >
                        <p className="font-semibold text-foreground">{signal.name}</p>
                        <p className="text-sm text-amber-500">{signal.change}</p>
                        <p className="text-xs text-muted-foreground">{signal.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Settings className="h-5 w-5" /> Admin Actions
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Control AI responses, review escalations, and tweak guardrails.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Button variant="default" className="justify-between">
                  View All Alerts
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="justify-between">
                  Approve / Reject AI Actions
                  <ListChecks className="h-4 w-4" />
                </Button>
              </div>

              <div className="rounded-md border border-border/70 bg-muted/30 p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-foreground">AI strictness level</p>
                  <Badge variant="secondary">{strictnessLevel}%</Badge>
                </div>
                <Slider
                  value={[strictnessLevel]}
                  max={100}
                  step={1}
                  onValueChange={(value) => setStrictnessLevel(value[0])}
                />
                <p className="text-xs text-muted-foreground">
                  Higher strictness adds more proactive interventions before human review.
                </p>
              </div>

              <div className="flex items-center justify-between rounded-md border border-border/70 bg-background/60 p-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">AI auto-moderation</p>
                  <p className="text-xs text-muted-foreground">Switch on/off without impacting logs.</p>
                </div>
                <Switch
                  checked={autoModerationEnabled}
                  onCheckedChange={setAutoModerationEnabled}
                  aria-label="Toggle AI auto-moderation"
                />
              </div>

              <div className="rounded-md border border-primary/30 bg-primary/5 p-3 flex items-start gap-3">
                <Power className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-semibold text-primary">Safeguards stay in place</p>
                  <p className="text-xs text-primary/80">
                    Even when paused, recent alerts remain queued for review and export.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Gauge className="h-5 w-5" /> AI Performance Monitor
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Track the quality of automated decisions before they hit human review.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {performanceMetrics.map((metric) => (
                <div key={metric.title} className="space-y-2 rounded-md border border-border/70 bg-muted/30 p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-foreground">{metric.title}</p>
                      <p className="text-xs text-muted-foreground">{metric.goal}</p>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{metric.value}</p>
                  </div>
                  <Progress value={metric.value} className={`h-2 ${metric.accent}`} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Mail className="h-5 w-5" /> Communications pulse
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                What admins and reporters are seeing from AI interventions.
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-md border border-border/70 bg-background/60 p-3">
                <p className="text-sm font-semibold text-foreground">Auto follow-ups</p>
                <p className="text-xs text-muted-foreground">Sent after AI warnings to confirm compliance.</p>
                <p className="mt-2 text-2xl font-bold text-foreground">58</p>
              </div>
              <div className="rounded-md border border-border/70 bg-background/60 p-3">
                <p className="text-sm font-semibold text-foreground">Reporter updates</p>
                <p className="text-xs text-muted-foreground">Status updates delivered to reporters this week.</p>
                <p className="mt-2 text-2xl font-bold text-foreground">34</p>
              </div>
              <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
                <p className="text-sm font-semibold text-primary">AI handoff confidence</p>
                <p className="text-xs text-primary/80">Moderation AI predicts 76% of new alerts can be auto-closed.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex flex-col gap-1">
              <span className="flex items-center gap-2 text-primary">
                <ShieldCheck className="w-5 h-5" /> AI-powered safety & behaviour monitoring
              </span>
              <p className="text-sm font-normal text-muted-foreground">
                Automated guardrails that scan conversations, flag risks, and protect the community so you don't have to manually police behaviour.
              </p>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {safetyFeatures.map(({ title, description, badge, icon: Icon }) => (
                <div
                  key={title}
                  className="rounded-xl border border-primary/20 bg-background/60 p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </span>
                      <p className="font-semibold leading-tight">{title}</p>
                    </div>
                    <Badge variant="outline" className="border-primary/40 text-primary">
                      {badge}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary">
              Admin impact: dashboard stays clean, high-risk accounts are auto-suspended, and users get friendly AI nudges before issues reach your inbox.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" /> Send Bulk Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email subject"
              />
            </div>
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                placeholder="Email message"
                rows={6}
              />
            </div>
            <Button
              onClick={handleSendBulkEmail}
              disabled={sendingEmail}
              className="w-full"
            >
              {sendingEmail
                ? "Sending..."
                : `Send to ${profiles.length || 0} users`}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" /> User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table className="min-w-[700px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((profile, index) => {
                    const isProfileAdmin = profile.roles.includes("admin");
                    return (
                      <TableRow key={profile.id}>
                        <TableCell>{profile.full_name || "N/A"}</TableCell>
                        <TableCell>
                          <Badge variant={isProfileAdmin ? "default" : "secondary"}>
                            {isProfileAdmin ? "ADMIN" : "USER"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {profile.email ? (
                            profile.email
                          ) : profile.loading ? (
                            <span className="text-muted-foreground">Loading…</span>
                          ) : (
                            <Button
                              variant="link"
                              size="sm"
                              onClick={() => fetchUserEmail(profile.id, index)}
                            >
                              Load Email
                            </Button>
                          )}
                        </TableCell>
                        <TableCell>
                          {profile.created_at
                            ? new Date(profile.created_at).toLocaleDateString()
                            : "Unknown"}
                        </TableCell>
                        <TableCell className="text-right">
                          {isProfileAdmin ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleRoleChange(profile.id, "admin", "revoke")
                              }
                            >
                              Revoke Admin
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleRoleChange(profile.id, "admin", "assign")
                              }
                            >
                              Make Admin
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
