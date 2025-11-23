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

/* ------------------------------------------------------------ */
/* MAIN COMPONENT */
/* ------------------------------------------------------------ */

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

  /* ------------------------------------------------------------ */
  /* SAFETY & AI FEATURES (STATIC CONFIGURATIONS) */
  /* ------------------------------------------------------------ */

  const safetyFeatures = [
    {
      title: "Harassment & threat detection",
      description:
        "Automatically scans messages for harassment or threats and issues AI-crafted warnings.",
      badge: "Auto-warn",
      icon: ShieldCheck,
    },
    {
      title: "Suspicious account flagging",
      description:
        "Surfaces risky behaviour patterns and queues flagged accounts for review.",
      badge: "Risk scoring",
      icon: Ban,
    },
    {
      title: "Bot, spam, and scam detection",
      description:
        "Stops bots and spam accounts in real time to keep the community clean.",
      badge: "Active filter",
      icon: Bot,
    },
    {
      title: "ID & profile verification",
      description:
        "AI verifies IDs and profile photos to ensure safe event participation.",
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
        description: "Repeated harassment triggers in a Community Leads group chat.",
        severity: "High",
      },
      {
        title: "Multiple spam reports on @nightowl",
        description: "Four independent spam reports in the last hour.",
        severity: "Medium",
      },
    ],
  };

  const moderationActions = [
    { label: "Auto-warnings sent", value: 42, delta: "+9% vs avg" },
    { label: "Auto-suspensions", value: 6, delta: "2 pending reviews" },
    { label: "AI-resolved issues", value: 31, delta: "78% resolved automatically" },
  ];

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
      description: "Upcoming events predicted to fill based on conversions.",
      icon: Gauge,
      accent: "text-indigo-500",
    },
    {
      title: "Communities growing",
      value: "6",
      description: "Tech, Wellness, and Nightlife trending upward.",
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
      { name: "Wellness Weekly", change: "+11% joins", detail: "Meditation workshops" },
    ],
    declining: [
      { name: "Weekend Adventurers", change: "-6% check-ins", detail: "Weather-related dip" },
      { name: "City Nightlife", change: "-4% RSVPs", detail: "AI suggests spotlighting top hosts" },
    ],
  };

  /* ------------------------------------------------------------ */
  /* AUTH & PROFILE LOADING */
  /* ------------------------------------------------------------ */

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          setError("Not authenticated");
          return setLoading(false);
        }

        const { data: isAdminValue, error: roleError } = await supabase.rpc("has_role", {
          _user_id: user.id,
          _role: "admin",
        });

        if (roleError) {
          setError("Failed verifying role");
          return setLoading(false);
        }

        if (!isAdminValue) {
          setError("Access denied: Admin only");
          return setLoading(false);
        }

        setIsAdmin(true);
        await loadProfiles();
      } catch (e) {
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
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, created_at, email, user_roles(role)")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setProfiles(
        (data ?? []).map((p: any) => ({
          id: p.id,
          full_name: p.full_name,
          created_at: p.created_at,
          email: p.email ?? null,
          roles: p.user_roles?.map((r: any) => r.role) ?? [],
        }))
      );
    } catch {
      toast({
        title: "Error",
        description: "Failed to load profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------ */
  /* ROLE MANAGEMENT */
  /* ------------------------------------------------------------ */

  const handleRoleChange = async (userId: string, role: string, action: "assign" | "revoke") => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
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
      if (!res.ok) throw new Error(data.error);

      toast({ title: "Success", description: data.message });
      await loadProfiles();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update role",
        variant: "destructive",
      });
    }
  };

  /* ------------------------------------------------------------ */
  /* FETCH EMAIL ON DEMAND */
  /* ------------------------------------------------------------ */

  const fetchUserEmail = async (userId: string, index: number) => {
    try {
      setProfiles(prev =>
        prev.map((p, i) => (i === index ? { ...p, loading: true } : p))
      );

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not logged in");

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-user-email?userId=${userId}`,
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setProfiles(prev =>
        prev.map((p, i) => (i === index ? { ...p, email: data.email, loading: false } : p))
      );
    } catch {
      setProfiles(prev =>
        prev.map((p, i) =>
          i === index ? { ...p, email: "Error loading email", loading: false } : p
        )
      );
    }
  };

  /* ------------------------------------------------------------ */
  /* BULK EMAIL */
  /* ------------------------------------------------------------ */

  const handleSendBulkEmail = async () => {
    if (!emailSubject.trim() || !emailMessage.trim()) {
      return toast({
        title: "Error",
        description: "Subject and message are required",
        variant: "destructive",
      });
    }

    try {
      setSendingEmail(true);
      const { data: { session } } = await supabase.auth.getSession();
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
      if (!res.ok) throw new Error(data.error);

      toast({ title: "Success", description: data.message });
      setEmailSubject("");
      setEmailMessage("");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to send emails",
        variant: "destructive",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  /* ------------------------------------------------------------ */
  /* AUTH + ACCESS BLOCKERS */
  /* ------------------------------------------------------------ */

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Shield className="w-6 h-6 animate-spin mr-2" />
        <p>Verifying admin access…</p>
      </div>
    );

  if (error || !isAdmin)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-destructive">
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{error || "You do not have admin privileges."}</p>
            <Button onClick={() => navigate("/home")} className="w-full">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );

  /* ------------------------------------------------------------ */
  /* MAIN ADMIN DASHBOARD */
  /* ------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* TOP BAR */}
      <div className="bg-card border-b px-4 py-4 flex items-center justify-between sticky top-0 z-10">
        <BackButton fallbackPath="/home" />
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5" /> Admin Dashboard
        </h1>
        <Badge variant="secondary">Admin Access</Badge>
      </div>

      <div className="p-4 space-y-6">
        {/* ----------------------------------------------------------------------- */}
        {/* AI SAFETY ALERTS SECTION */}
        {/* ----------------------------------------------------------------------- */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                AI Safety Alerts
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                System-detected risks requiring attention.
              </p>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="grid gap-4 md:grid-cols-3">
                {/* Flagged Chats */}
                <div className="rounded-lg border p-4 bg-muted/40">
                  <div className="flex justify-between text-sm">
                    <span>Flagged chats</span>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Bell className="h-3 w-3" /> Today
                    </Badge>
                  </div>
                  <p className="mt-3 text-3xl font-bold">
                    {safetyAlerts.flaggedChats.today}
                  </p>
                  <p className="text-xs">{safetyAlerts.flaggedChats.change}</p>
                  <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                    <div className="rounded-md bg-background/60 p-2">
                      <p>This week</p>
                      <p className="font-bold text-lg">
                        {safetyAlerts.flaggedChats.week}
                      </p>
                    </div>
                    <div className="rounded-md bg-background/60 p-2">
                      <p>This month</p>
                      <p className="font-bold text-lg">
                        {safetyAlerts.flaggedChats.month}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Flagged accounts */}
                <div className="rounded-lg border p-4 bg-muted/40">
                  <p className="flex items-center gap-2">
                    <Users className="h-4 w-4" /> Flagged accounts
                  </p>
                  <p className="mt-3 text-3xl font-bold">
                    {safetyAlerts.flaggedAccounts.value}
                  </p>
                  <p className="text-xs">{safetyAlerts.flaggedAccounts.note}</p>
                </div>

                {/* Protection Status */}
                <div className="rounded-lg border p-4 bg-primary/5">
                  <p className="flex items-center gap-2 text-primary">
                    <Shield className="h-4 w-4" />
                    Protection status
                  </p>
                  <p className="mt-3 text-lg font-semibold">Coverage stable</p>
                  <div className="space-y-1 text-xs">
                    <p className="flex items-center gap-2">
                      <ListChecks className="h-4 w-4 text-primary" /> 98% live rooms monitored
                    </p>
                    <p className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary" /> Safety actions synced with hosts
                    </p>
                  </div>
                </div>
              </div>

              {/* Urgent Alerts */}
              <div className="rounded-lg border p-4 bg-background/60">
                <p className="text-sm font-semibold flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" /> Urgent Alerts
                </p>
                <div className="space-y-3">
                  {safetyAlerts.urgent.map(alert => (
                    <div
                      key={alert.title}
                      className="rounded-md border p-3 bg-muted/30"
                    >
                      <div className="flex justify-between">
                        <p className="font-semibold">{alert.title}</p>
                        <Badge
                          variant="outline"
                          className={
                            alert.severity === "High"
                              ? "text-amber-500 border-amber-500/30"
                              : "text-blue-500 border-blue-500/30"
                          }
                        >
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {alert.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Moderation actions summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings2 className="h-5 w-5" /> AI Moderation Actions
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {moderationActions.map(item => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-md border p-3"
                >
                  <div>
                    <p className="font-semibold text-sm">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.delta}</p>
                  </div>
                  <p className="text-2xl font-bold">{item.value}</p>
                </div>
              ))}

              <div className="rounded-md border bg-primary/5 p-3 text-sm text-primary">
                <CheckCircle2 className="h-4 w-4 inline-block mr-1" />
                AI-resolved issues synced with host dashboards
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* AI PREDICTION SUMMARY */}
        {/* ----------------------------------------------------------------------- */}

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> AI Prediction Summary
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                {predictionSummary.map(summary => (
                  <div
                    key={summary.title}
                    className="flex items-start gap-3 rounded-lg border p-4 bg-muted/30"
                  >
                    <div
                      className={`rounded-full h-10 w-10 flex items-center justify-center bg-background/70 ${summary.accent}`}
                    >
                      <summary.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold">{summary.title}</p>
                      <p className="text-2xl font-bold">{summary.value}</p>
                      <p className="text-sm text-muted-foreground">{summary.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Community Signals */}
              <div className="rounded-lg border p-4 bg-background/60">
                <p className="flex items-center gap-2 text-sm font-semibold">
                  <TrendingUp className="h-4 w-4 text-emerald-500" /> Community signals
                </p>

                <div className="grid sm:grid-cols-2 gap-4 mt-3">
                  {/* Growing */}
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      Growing
                    </p>
                    {communitySignals.growing.map(c => (
                      <div key={c.name} className="border rounded-md p-3 bg-muted/30">
                        <p className="font-semibold">{c.name}</p>
                        <p className="text-sm text-emerald-500">{c.change}</p>
                        <p className="text-xs text-muted-foreground">{c.detail}</p>
                      </div>
                    ))}
                  </div>

                  {/* Declining */}
                  <div className="space-y-2">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      Declining
                    </p>
                    {communitySignals.declining.map(c => (
                      <div key={c.name} className="border rounded-md p-3 bg-muted/30">
                        <p className="font-semibold">{c.name}</p>
                        <p className="text-sm text-amber-500">{c.change}</p>
                        <p className="text-xs text-muted-foreground">{c.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ADMIN ACTIONS */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" /> Admin Actions
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <Button variant="default" className="justify-between">
                View All Alerts <Bell className="h-4 w-4" />
              </Button>

              <Button variant="outline" className="justify-between">
                Approve / Reject AI Actions <ListChecks className="h-4 w-4" />
              </Button>

              {/* AI Strictness */}
              <div className="rounded-md border p-3">
                <div className="flex justify-between">
                  <p className="font-semibold text-sm">AI strictness level</p>
                  <Badge variant="secondary">{strictnessLevel}%</Badge>
                </div>

                <Slider
                  value={[strictnessLevel]}
                  max={100}
                  step={1}
                  onValueChange={([v]) => setStrictnessLevel(v)}
                  className="mt-2"
                />

                <p className="text-xs text-muted-foreground mt-1">
                  More strictness = more proactive interventions.
                </p>
              </div>

              {/* Auto-moderation toggle */}
              <div className="flex justify-between items-center rounded-md border p-3">
                <div>
                  <p className="font-semibold text-sm">AI Auto-moderation</p>
                  <p className="text-xs text-muted-foreground">
                    Toggle without clearing logs.
                  </p>
                </div>
                <Switch
                  checked={autoModerationEnabled}
                  onCheckedChange={setAutoModerationEnabled}
                />
              </div>

              <div className="rounded-md border bg-primary/5 p-3 text-primary">
                <Power className="h-4 w-4 inline-block mr-1" />
                Safeguards remain active even if paused.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* PERFORMANCE MONITOR */}
        {/* ----------------------------------------------------------------------- */}

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5" /> AI Performance Monitor
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              {performanceMetrics.map(metric => (
                <div key={metric.title} className="space-y-2 border p-3 rounded-md">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-semibold text-sm">{metric.title}</p>
                      <p className="text-xs text-muted-foreground">{metric.goal}</p>
                    </div>
                    <p className="text-2xl font-bold">{metric.value}</p>
                  </div>
                  <Progress value={metric.value} className={`h-2 ${metric.accent}`} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* COMMUNICATIONS */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" /> Communications Pulse
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="border rounded-md p-3">
                <p className="font-semibold text-sm">Auto follow-ups</p>
                <p className="text-xs text-muted-foreground">
                  Sent after AI warnings to confirm compliance.
                </p>
                <p className="text-2xl font-bold mt-2">58</p>
              </div>

              <div className="border rounded-md p-3">
                <p className="font-semibold text-sm">Reporter updates</p>
                <p className="text-xs text-muted-foreground">
                  Status updates sent this week.
                </p>
                <p className="text-2xl font-bold mt-2">34</p>
              </div>

              <div className="rounded-md border bg-primary/5 p-3 text-primary text-sm">
                AI predicts 76% of new alerts can be auto-closed.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ----------------------------------------------------------------------- */}
        {/* SAFETY FEATURE GRID */}
        {/* ----------------------------------------------------------------------- */}

        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              AI-powered safety & behaviour monitoring
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              {safetyFeatures.map(f => (
                <div key={f.title} className="border p-4 rounded-xl bg-background/60">
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                        <f.icon className="h-5 w-5" />
                      </span>
                      <p className="font-semibold">{f.title}</p>
                    </div>
                    <Badge variant="outline" className="text-primary border-primary/40">
                      {f.badge}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ----------------------------------------------------------------------- */}
        {/* BULK EMAIL */}
        {/* ----------------------------------------------------------------------- */}

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
                onChange={e => setEmailSubject(e.target.value)}
                placeholder="Email subject"
              />
            </div>

            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={6}
                value={emailMessage}
                onChange={e => setEmailMessage(e.target.value)}
                placeholder="Email message"
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

        {/* ----------------------------------------------------------------------- */}
        {/* USER MANAGEMENT */}
        {/* ----------------------------------------------------------------------- */}

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
                            <span className="text-muted-foreground">
                              Loading…
                            </span>
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
