// src/pages/Admin.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/usePageTitle";

import {
  Card,
  CardContent,
  CardDescription,
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

  // AI Content Audit icons
  MessageCircleWarning,
  ShieldAlert,
  ImageOff,
  FileWarning,
  Sparkles,
  ClipboardList,
  Eye,
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


/* ------------------------------------------------------------ */
/* TYPES */
/* ------------------------------------------------------------ */

interface Profile {
  id: string;
  full_name: string | null;
  created_at: string | null;
  email?: string | null;
  roles: string[];
  loading?: boolean;
}


/* ------------------------------------------------------------ */
/* MAIN ADMIN COMPONENT */
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
  /* STATIC AI DATA — MERGED FROM BOTH VERSIONS (C OPTION) */
  /* ------------------------------------------------------------ */

  const safetyFeatures = [
    {
      title: "Harassment & threat detection",
      description:
        "Automatically scans all messages for harassment, threats, or manipulation, and issues AI-guided warnings.",
      badge: "Auto-warn",
      icon: ShieldCheck,
    },
    {
      title: "Suspicious account flagging",
      description:
        "Detects risky behaviour patterns and temporarily restricts accounts until reviewed.",
      badge: "Risk scoring",
      icon: Ban,
    },
    {
      title: "Bot, spam, and scam detection",
      description:
        "Blocks bots and spam attempts in real time using behavioural AI.",
      badge: "Active filter",
      icon: Bot,
    },
    {
      title: "ID & profile verification",
      description:
        "AI-assisted ID verification to protect hosts and attendees.",
      badge: "Auto-verify",
      icon: IdCard,
    },
  ];

  const flaggedMessageSignals = [
    "Toxic language",
    "Harassment",
    "Manipulation",
    "Romance/sexual content (restricted)",
    "Hate speech / discrimination",
    "Spam / bot behaviour",
  ];

  const flaggedEventSignals = [
    "Dangerous activities",
    "Misleading event descriptions",
    "Extremism / ideological misuse",
    "Fraudulent or deceptive events",
  ];

  const flaggedImageSignals = [
    "NSFW or borderline unsafe",
    "AI/fake-face detection",
    "ID mismatch detection",
    "Suspicious pattern anomalies",
  ];

  const aiTools = [
    "View full conversation context",
    "Auto-highlight unsafe phrases",
    "AI rewrite suggestions for safer content",
  ];


  const safetyAlerts = {
    flaggedChats: { today: 18, week: 94, month: 376, change: "+12% vs yesterday" },
    flaggedAccounts: { value: 7, note: "AI paused 3 high-risk profiles" },
    urgent: [
      {
        title: "Escalated conversation flagged",
        description: "Repeated harassment triggers in a Community group.",
        severity: "High",
      },
      {
        title: "Multiple spam reports on @nightowl",
        description: "Four independent reports within one hour.",
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
      description: "Engagement increased after AI onboarding nudges.",
      icon: Activity,
      accent: "text-emerald-500",
    },
    {
      title: "Event success predictions",
      value: "82%",
      description: "AI forecasts strong turnout for upcoming events.",
      icon: Gauge,
      accent: "text-indigo-500",
    },
    {
      title: "Communities growing",
      value: "6",
      description: "Wellness, Tech Makers, and Nightlife communities are rising.",
      icon: TrendingUp,
      accent: "text-blue-500",
    },
    {
      title: "Expected churn rate",
      value: "3.1%",
      description: "Reduced by 0.7% thanks to proactive interventions.",
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
      goal: "Dropping week-on-week",
      accent: "[&>*]:bg-amber-500",
    },
    {
      title: "Pending human reviews",
      value: 14,
      goal: "Goal: < 10",
      accent: "[&>*]:bg-blue-500",
    },
  ];

  const communitySignals = {
    growing: [
      { name: "Tech Makers", change: "+18% active", detail: "AI mentorship sessions trending up." },
      { name: "Wellness Weekly", change: "+11% joins", detail: "Meditation and breathwork events." },
    ],
    declining: [
      { name: "Weekend Adventurers", change: "-6% check-ins", detail: "Weather impact detected." },
      { name: "City Nightlife", change: "-4% RSVPs", detail: "AI recommends host spotlight boosts." },
    ],
  };


  /* ------------------------------------------------------------ */
  /* VERIFY ADMIN ACCESS */
  /* ------------------------------------------------------------ */

  useEffect(() => {
    const verify = async () => {
      try {
        const { data: { user }, error: userErr } = await supabase.auth.getUser();
        if (userErr || !user) {
          setError("Not authenticated");
          return setLoading(false);
        }

        const { data: isAdminValue, error: roleErr } = await supabase.rpc("has_role", {
          _user_id: user.id,
          _role: "admin",
        });

        if (roleErr) {
          setError("Failed verifying role");
          return setLoading(false);
        }
        if (!isAdminValue) {
          setError("Access denied: Admins only");
          return setLoading(false);
        }

        setIsAdmin(true);
        await loadProfiles();
      } catch {
        setError("Failed to verify admin");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);


  /* ------------------------------------------------------------ */
  /* LOAD PROFILES */
  /* ------------------------------------------------------------ */

  const loadProfiles = async () => {
    try {
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
        description: "Failed to load user profiles",
        variant: "destructive",
      });
    }
  };


  /* ------------------------------------------------------------ */
  /* ROLE MANAGEMENT */
  /* ------------------------------------------------------------ */

  const handleRoleChange = async (userId: string, role: string, action: "assign" | "revoke") => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

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

      const result = await res.json();
      if (!res.ok) throw new Error(result.error);

      toast({ title: "Success", description: result.message });
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
  /* ON-DEMAND EMAIL FETCH */
  /* ------------------------------------------------------------ */

  const fetchUserEmail = async (userId: string, index: number) => {
    try {
      setProfiles(prev =>
        prev.map((p, i) => (i === index ? { ...p, loading: true } : p))
      );

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-user-email?userId=${userId}`,
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setProfiles(prev =>
        prev.map((p, i) =>
          i === index ? { ...p, email: data.email, loading: false } : p
        )
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
  /* BULK EMAIL SENDER */
  /* ------------------------------------------------------------ */

  const handleSendBulkEmail = async () => {
    if (!emailSubject.trim() || !emailMessage.trim()) {
      return toast({
        title: "Error",
        description: "Subject and message are required.",
        variant: "destructive",
      });
    }

    try {
      setSendingEmail(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

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
  /* RENDER - LOADING / ERROR / ACCESS DENIED */
  /* ------------------------------------------------------------ */

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Shield className="h-12 w-12 text-primary mx-auto animate-pulse" />
          <p className="text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (error || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-destructive" />
              <CardTitle>Access Denied</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              {error || "This page is restricted to administrators only."}
            </p>
            <Button onClick={() => navigate("/dashboard")} className="w-full">
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }


  /* ------------------------------------------------------------ */
  /* MAIN ADMIN DASHBOARD */
  /* ------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-background">
      <BackButton />
      
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Admin Command Center</h1>
              <p className="text-muted-foreground">AI-powered safety & growth management</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Safety Alerts Overview */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">Safety Alerts</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Flagged Chats Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{safetyAlerts.flaggedChats.today}</div>
                <p className="text-xs text-muted-foreground mt-1">{safetyAlerts.flaggedChats.change}</p>
                <div className="text-xs text-muted-foreground mt-2">
                  Week: {safetyAlerts.flaggedChats.week} | Month: {safetyAlerts.flaggedChats.month}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Flagged Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-500">{safetyAlerts.flaggedAccounts.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{safetyAlerts.flaggedAccounts.note}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">AI Moderation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={autoModerationEnabled}
                    onCheckedChange={setAutoModerationEnabled}
                  />
                  <span className="text-sm font-medium">
                    {autoModerationEnabled ? "Active" : "Paused"}
                  </span>
                </div>
                <div className="mt-3">
                  <Label className="text-xs text-muted-foreground mb-2 block">
                    Strictness: {strictnessLevel}%
                  </Label>
                  <Slider
                    value={[strictnessLevel]}
                    onValueChange={(v) => setStrictnessLevel(v[0])}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Urgent Alerts */}
          <div className="space-y-3">
            {safetyAlerts.urgent.map((alert, i) => (
              <Card key={i} className="border-destructive/50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold">{alert.title}</h3>
                        <Badge variant={alert.severity === "High" ? "destructive" : "secondary"}>
                          {alert.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Safety Features */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">Active Safety Features</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {safetyFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <Card key={i}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{feature.title}</CardTitle>
                          <Badge variant="secondary" className="mt-1">{feature.badge}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* AI Content Audit Signals */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Eye className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">AI Content Audit Signals</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageCircleWarning className="h-5 w-5 text-amber-500" />
                  <CardTitle className="text-base">Flagged Messages</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {flaggedMessageSignals.map((signal, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {signal}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FileWarning className="h-5 w-5 text-amber-500" />
                  <CardTitle className="text-base">Flagged Events</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {flaggedEventSignals.map((signal, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {signal}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ImageOff className="h-5 w-5 text-amber-500" />
                  <CardTitle className="text-base">Flagged Images</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {flaggedImageSignals.map((signal, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {signal}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Moderation Actions */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Settings2 className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">Automated Moderation Actions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {moderationActions.map((action, i) => (
              <Card key={i}>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold text-primary mb-1">{action.value}</div>
                  <div className="text-sm font-medium mb-1">{action.label}</div>
                  <div className="text-xs text-muted-foreground">{action.delta}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Growth Analytics Predictions */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">AI Growth Predictions</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {predictionSummary.map((pred, i) => {
              const Icon = pred.icon;
              return (
                <Card key={i}>
                  <CardContent className="pt-6">
                    <Icon className={`h-8 w-8 ${pred.accent} mb-3`} />
                    <div className="text-2xl font-bold mb-1">{pred.value}</div>
                    <div className="text-sm font-medium mb-1">{pred.title}</div>
                    <div className="text-xs text-muted-foreground">{pred.description}</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Performance Metrics */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Gauge className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">AI Performance Metrics</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {performanceMetrics.map((metric, i) => (
              <Card key={i}>
                <CardContent className="pt-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.title}</span>
                    <span className="text-2xl font-bold">{metric.value}{typeof metric.value === 'number' ? '%' : ''}</span>
                  </div>
                  <Progress value={typeof metric.value === 'number' ? metric.value : 0} className={metric.accent} />
                  <p className="text-xs text-muted-foreground">{metric.goal}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Community Signals */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">Community Growth Signals</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-500" />
                  <CardTitle className="text-base">Growing Communities</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {communitySignals.growing.map((comm, i) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">{comm.name}</span>
                        <Badge className="bg-emerald-500/10 text-emerald-500">{comm.change}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{comm.detail}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-amber-500" />
                  <CardTitle className="text-base">Needs Attention</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {communitySignals.declining.map((comm, i) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-sm">{comm.name}</span>
                        <Badge variant="secondary">{comm.change}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{comm.detail}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* User Management */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Users className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">User Management</h2>
          </div>
          
          <Card>
            <CardHeader>
              <CardDescription>
                Total Users: <span className="font-semibold text-foreground">{profiles.length}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Roles</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.map((profile, index) => (
                      <TableRow key={profile.id}>
                        <TableCell className="font-medium">
                          {profile.full_name || "—"}
                        </TableCell>
                        <TableCell>
                          {profile.email ? (
                            <span className="text-sm">{profile.email}</span>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => fetchUserEmail(profile.id, index)}
                              disabled={profile.loading}
                            >
                              {profile.loading ? "Loading..." : "Load Email"}
                            </Button>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {profile.created_at
                            ? new Date(profile.created_at).toLocaleDateString()
                            : "—"}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {profile.roles.map((role) => (
                              <Badge key={role} variant="secondary">
                                {role}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {!profile.roles.includes("admin") && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleRoleChange(profile.id, "admin", "assign")
                                }
                              >
                                Make Admin
                              </Button>
                            )}
                            {profile.roles.includes("admin") && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  handleRoleChange(profile.id, "admin", "revoke")
                                }
                              >
                                Remove Admin
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Bulk Email */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Mail className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-semibold">Bulk Email Communication</h2>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Send Email to All Users</CardTitle>
              <CardDescription>
                This will send an email to all {profiles.length} registered users.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-subject">Subject</Label>
                <Input
                  id="email-subject"
                  placeholder="Enter email subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-message">Message</Label>
                <Textarea
                  id="email-message"
                  placeholder="Enter your message"
                  rows={6}
                  value={emailMessage}
                  onChange={(e) => setEmailMessage(e.target.value)}
                />
              </div>
              <Button
                onClick={handleSendBulkEmail}
                disabled={sendingEmail}
                className="w-full"
              >
                {sendingEmail ? (
                  <>
                    <Settings className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send to All Users
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </section>

      </div>
    </div>
  );
};

export default Admin;