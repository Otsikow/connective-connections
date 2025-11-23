import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/BackButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  Activity,
  Ban,
  Bell,
  Bot,
  CheckCircle2,
  FileText,
  Gauge,
  Hammer,
  Headset,
  IdCard,
  Mail,
  MessageCircleWarning,
  MessageSquare,
  Reply,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Tag,
  TrendingDown,
  TrendingUp,
  UploadCloud,
  UserX,
  Users,
  Send,
} from "lucide-react";

import { Profile } from "./types/Profile";

export function useAdminPagination<T>(data: T[], pageSize = 10) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);

  const paginated = data.slice((page - 1) * pageSize, page * pageSize);

  const next = () => setPage((p) => Math.min(p + 1, totalPages));
  const prev = () => setPage((p) => Math.max(p - 1, 1));
  const goTo = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));

  return {
    page,
    totalPages,
    paginated,
    next,
    prev,
    goTo,
  };
}

/* ------------------------------------------------------------ */
/* MAIN ADMIN PAGE */
/* ------------------------------------------------------------ */

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  usePageTitle("Admin Command Center");

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [profiles, setProfiles] = useState<Profile[]>([]);

  /* ------------------------------------------------------------ */
  /* ADMIN VERIFICATION */
  /* ------------------------------------------------------------ */

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setError("Not authenticated");
          return setLoading(false);
        }

        const { data: isAdminValue } = await supabase.rpc("has_role", {
          _user_id: user.id,
          _role: "admin",
        });

        if (!isAdminValue) {
          setError("Access denied: Admin only");
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

    verifyAdmin();
  }, []);

  /* ------------------------------------------------------------ */
  /* LOAD USER PROFILES */
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
        title: "Error loading profiles",
        description: "Could not load user records.",
        variant: "destructive",
      });
    }
  };


  /* ------------------------------------------------------------ */
  /* ACCESS GUARDS */
  /* ------------------------------------------------------------ */

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Shield className="w-6 h-6 mr-2 animate-spin text-primary" />
        <p className="text-muted-foreground">Verifying admin access…</p>
      </div>
    );

  if (error || !isAdmin)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="border rounded-lg p-6 max-w-md text-center">
          <p className="text-red-500 font-semibold mb-2">Access Denied</p>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button
            onClick={() => navigate("/home")}
            className="px-4 py-2 bg-primary text-white rounded-md"
          >
            Return Home
          </button>
        </div>
      </div>
    );


  /* ------------------------------------------------------------ */
  /* PAGE RENDER */
  /* ------------------------------------------------------------ */

  return (
    <div className="min-h-screen bg-background pb-20">

      {/* TOP HEADER */}
      <div className="bg-card border-b px-4 py-4 flex items-center justify-between sticky top-0 z-20">
        <BackButton fallbackPath="/home" />

        <h1 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Admin Dashboard
        </h1>

        <Badge variant="secondary">Admin</Badge>
      </div>

      {/* MAIN CONTENT */}
      <div className="p-4 space-y-6">

        {/* 1. Safety Alerts */}
        <AdminSafetyAlerts />

        {/* 2. Moderation Summary */}
        <AdminModerationActions />

        {/* 3. AI Prediction Summary */}
        <AdminAISummary />

        {/* 4. AI Performance Monitor */}
        <AdminPerformanceMonitor />

        {/* 5. Communications Pulse */}
        <AdminCommunicationsPulse />

        {/* 6. Safety Features */}
        <AdminSafetyFeatures />

        {/* 7. AI Support Center */}
        <AdminSupportCenter />

        {/* 8. Bulk Email */}
        <AdminBulkEmail
          profiles={profiles}
        />

        {/* 9. User Management (Paginated) */}
        <AdminUserManagement
          profiles={profiles}
          onRefresh={loadProfiles}
        />

      </div>
    </div>
  );
};

export default Admin;


const AdminSafetyAlerts = () => {
  const alerts = [
    {
      title: "Escalated conversation flagged",
      description: "AI detected repeated harassment patterns in a group chat.",
      severity: "High",
      icon: MessageCircleWarning,
    },
    {
      title: "Suspicious account behaviour",
      description: "Multiple users reported @nightowl for spam-like actions.",
      severity: "Medium",
      icon: UserX,
    },
    {
      title: "Potentially harmful event description",
      description: "AI detected misleading or unsafe elements in a new event.",
      severity: "Medium",
      icon: ShieldAlert,
    },
  ];

  const severityColor = (s: string) =>
    s === "High"
      ? "text-red-600 bg-red-100 dark:bg-red-900/30"
      : "text-amber-600 bg-amber-100 dark:bg-amber-900/30";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-500" />
          Safety Alerts
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {alerts.map((alert, i) => (
          <div
            key={i}
            className="rounded-lg border p-4 bg-card hover:bg-muted/30 transition"
          >
            <div className="flex items-start gap-3">
              <alert.icon className="w-6 h-6 text-primary" />
              <div className="flex-1">
                <p className="font-semibold">{alert.title}</p>
                <p className="text-sm text-muted-foreground">
                  {alert.description}
                </p>
              </div>

              <span
                className={`px-2 py-1 rounded text-xs font-medium ${severityColor(
                  alert.severity
                )}`}
              >
                {alert.severity}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};


const AdminModerationActions = () => {
  const actions = [
    {
      label: "Auto-warnings sent",
      value: 42,
      delta: "+9% this week",
      icon: ShieldCheck,
    },
    {
      label: "Auto-suspensions",
      value: 6,
      delta: "2 pending reviews",
      icon: Hammer,
    },
    {
      label: "AI-resolved issues",
      value: 31,
      delta: "78% automated",
      icon: CheckCircle2,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          Moderation Activity
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-3">
        {actions.map((a) => (
          <div
            key={a.label}
            className="rounded-lg border p-4 bg-card hover:bg-muted/20 transition"
          >
            <div className="flex items-center gap-2 mb-2">
              <a.icon className="w-5 h-5 text-primary" />
              <p className="font-medium">{a.label}</p>
            </div>

            <p className="text-3xl font-bold">{a.value}</p>
            <p className="text-xs mt-1 text-muted-foreground">{a.delta}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};



const AdminAISummary = () => {
  const metrics = [
    {
      title: "User activity rise",
      value: "+14%",
      description: "Driven by AI onboarding nudges.",
      icon: Activity,
      accent: "text-emerald-500",
    },
    {
      title: "Event success prediction",
      value: "82%",
      description: "Strong turnout forecast.",
      icon: Gauge,
      accent: "text-indigo-500",
    },
    {
      title: "Communities trending up",
      value: "6",
      description: "AI engagement boosts working.",
      icon: TrendingUp,
      accent: "text-blue-500",
    },
    {
      title: "Churn prediction",
      value: "3.1%",
      description: "Down by 0.7% after interventions.",
      icon: TrendingDown,
      accent: "text-amber-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          AI Prediction Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div
            key={m.title}
            className="rounded-lg border p-4 bg-card hover:bg-muted/20 transition"
          >
            <div className="flex items-center gap-2 mb-2">
              <m.icon className={`w-5 h-5 ${m.accent}`} />
              <p className="font-medium">{m.title}</p>
            </div>

            <p className={`text-3xl font-bold ${m.accent}`}>{m.value}</p>
            <p className="text-xs mt-1 text-muted-foreground">
              {m.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};


const AdminPerformanceMonitor = () => {
  const stats = [
    {
      title: "AI moderation accuracy",
      value: 92,
      goal: "95% goal",
      color: "text-emerald-500",
    },
    {
      title: "False positives",
      value: 6,
      goal: "Dropping weekly",
      color: "text-amber-500",
    },
    {
      title: "Pending human reviews",
      value: 14,
      goal: "Goal < 10",
      color: "text-blue-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          AI Performance Monitor
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {stats.map((s) => (
          <div key={s.title} className="space-y-2">
            <div className="flex justify-between">
              <p className="font-medium">{s.title}</p>
              <p className={`font-semibold ${s.color}`}>{s.value}%</p>
            </div>

            <Progress value={s.value} className="h-2" />
            <p className="text-xs text-muted-foreground">{s.goal}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};



const AdminCommunicationsPulse = () => {
  const stats = [
    {
      label: "Messages sent today",
      value: 482,
      icon: MessageSquare,
      color: "text-blue-500",
    },
    {
      label: "Email campaigns this week",
      value: 6,
      icon: Mail,
      color: "text-amber-500",
    },
    {
      label: "New user reports",
      value: 14,
      icon: Bell,
      color: "text-red-500",
    },
    {
      label: "Active communities",
      value: 23,
      icon: Users,
      color: "text-emerald-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Communications Pulse
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border p-4 bg-card hover:bg-muted/20 transition"
          >
            <div className="flex items-center gap-2 mb-1">
              <s.icon className={`w-5 h-5 ${s.color}`} />
              <p className="font-medium">{s.label}</p>
            </div>

            <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};



const AdminSafetyFeatures = () => {
  const features = [
    {
      title: "Harassment & threat detection",
      description:
        "AI scans conversations for harassment, threats, manipulation and sends auto-warnings.",
      badge: "Auto-warn",
      icon: ShieldCheck,
      color: "text-emerald-600",
    },
    {
      title: "Suspicious account flagging",
      description:
        "AI detects risky behaviour patterns and temporarily restricts accounts.",
      badge: "Risk scoring",
      icon: Ban,
      color: "text-red-600",
    },
    {
      title: "Bot, spam & scam filtering",
      description:
        "Real-time spam/bot blocking based on behavioural patterns.",
      badge: "Active filter",
      icon: Bot,
      color: "text-blue-600",
    },
    {
      title: "AI-assisted ID verification",
      description:
        "Automatic ID checks to improve safety for meetups and events.",
      badge: "Auto-verify",
      icon: IdCard,
      color: "text-amber-600",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          AI Safety & Behaviour Systems
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-2">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-xl border p-4 bg-card hover:bg-muted/20 transition"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <f.icon className={`w-7 h-7 ${f.color}`} />
                <p className="font-semibold">{f.title}</p>
              </div>
              <Badge variant="secondary">{f.badge}</Badge>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {f.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};



const AdminSupportCenter = () => {
  const tools = [
    {
      title: "AI answers support tickets",
      description:
        "Instant, on-brand responses to inbound questions—no need for manual typing.",
      badge: "Instant replies",
      icon: Bot,
    },
    {
      title: "AI troubleshooting drafts",
      description:
        "Creates step-by-step fixes and actionable guidance for users.",
      badge: "Auto-fix",
      icon: Sparkles,
    },
    {
      title: "AI reply suggestions",
      description:
        "Admins can approve automated replies in one click.",
      badge: "1-tap approval",
      icon: Reply,
    },
    {
      title: "Auto triage (billing, login, behaviour)",
      description:
        "Routes every ticket into the correct workflow automatically.",
      badge: "Smart triage",
      icon: Tag,
    },
    {
      title: "AI macros + saved replies",
      description:
        "Pre-written admin responses the AI can adapt on the fly.",
      badge: "Macros",
      icon: FileText,
    },
  ];

  const adminActions = [
    {
      title: "Approve / Reject AI replies",
      description:
        "Human-in-the-loop protection ensures quality control for all AI outputs.",
      badge: "Quality gate",
      icon: CheckCircle2,
    },
    {
      title: "Upload new FAQ content",
      description:
        "Updating policy docs or help pages trains the AI instantly.",
      badge: "Knowledge update",
      icon: UploadCloud,
    },
  ];

  return (
    <Card className="border-amber-300/40 bg-amber-50/40 dark:bg-amber-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-700 dark:text-amber-200">
          <Headset className="w-5 h-5" />
          AI Automated Support Centre
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-6 md:grid-cols-2">
        {/* Tools */}
        <div className="space-y-4">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-200">
            Tools
          </p>

          {tools.map((t) => (
            <div
              key={t.title}
              className="rounded-xl border border-amber-200/60 p-4 bg-white dark:bg-amber-900/30"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-200/40 dark:bg-amber-800/50">
                  <t.icon className="w-5 h-5 text-amber-800 dark:text-amber-100" />
                </span>

                <div>
                  <p className="font-semibold">{t.title}</p>
                  <p className="text-sm text-muted-foreground">{t.description}</p>
                </div>
              </div>

              <Badge className="mt-3 bg-amber-100 text-amber-800 dark:bg-amber-700/40 dark:text-amber-100">
                {t.badge}
              </Badge>
            </div>
          ))}
        </div>

        {/* Admin Actions */}
        <div className="space-y-4">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-200">
            Admin Actions
          </p>

          {adminActions.map((a) => (
            <div
              key={a.title}
              className="rounded-xl border border-amber-200/60 p-4 bg-amber-50 dark:bg-amber-900/20"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-200/40 dark:bg-amber-800/50">
                  <a.icon className="w-5 h-5 text-amber-800 dark:text-amber-100" />
                </span>

                <div>
                  <p className="font-semibold">{a.title}</p>
                  <p className="text-sm text-muted-foreground">{a.description}</p>
                </div>
              </div>

              <Badge variant="outline" className="mt-3 border-amber-400 text-amber-700 dark:text-amber-200">
                {a.badge}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};


interface AdminBulkEmailProps {
  emailSubject: string;
  emailMessage: string;
  setEmailSubject: (v: string) => void;
  setEmailMessage: (v: string) => void;
  handleSendBulkEmail: () => void;
  sendingEmail: boolean;
  totalUsers: number;
}

const AdminBulkEmail = ({
  emailSubject,
  emailMessage,
  setEmailSubject,
  setEmailMessage,
  handleSendBulkEmail,
  sendingEmail,
  totalUsers,
}: AdminBulkEmailProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5" /> Bulk Email Sender
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="Email subject"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            placeholder="Write your message here…"
            rows={6}
            value={emailMessage}
            onChange={(e) => setEmailMessage(e.target.value)}
          />
        </div>

        <Button
          className="w-full"
          onClick={handleSendBulkEmail}
          disabled={sendingEmail}
        >
          {sendingEmail ? "Sending…" : `Send to ${totalUsers} users`}
        </Button>
      </CardContent>
    </Card>
  );
};



interface Profile {
  id: string;
  full_name: string | null;
  created_at: string | null;
  email?: string | null;
  roles: string[];
  loading?: boolean;
}

interface AdminUserManagementProps {
  profiles: Profile[];
  fetchUserEmail: (id: string, index: number) => void;
  handleRoleChange: (id: string, role: string, action: "assign" | "revoke") => void;
}

const AdminUserManagement = ({
  profiles,
  fetchUserEmail,
  handleRoleChange,
}: AdminUserManagementProps) => {
  const { paginated, page, totalPages, next, prev } =
    useAdminPagination(profiles, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">User Management</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-md border overflow-x-auto">
          <Table className="min-w-[780px]">
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
              {paginated.map((profile, index) => {
                const isAdmin = profile.roles.includes("admin");

                return (
                  <TableRow key={profile.id}>
                    <TableCell>{profile.full_name ?? "N/A"}</TableCell>

                    <TableCell>
                      <Badge variant={isAdmin ? "default" : "secondary"}>
                        {isAdmin ? "ADMIN" : "USER"}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {profile.email ? (
                        profile.email
                      ) : profile.loading ? (
                        <span className="text-muted-foreground">Loading…</span>
                      ) : (
                        <Button
                          size="sm"
                          variant="link"
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
                      {isAdmin ? (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleRoleChange(profile.id, "admin", "revoke")
                          }
                        >
                          Revoke Admin
                        </Button>
                      ) : (
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
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" disabled={page === 1} onClick={prev}>
            Previous
          </Button>

          <p className="text-sm text-muted-foreground">
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </p>

          <Button variant="outline" disabled={page === totalPages} onClick={next}>
            Next
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};






