import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/usePageTitle";
import BackButton from "@/components/BackButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Activity,
  AlertTriangle,
  Bell,
  CheckCircle2,
  Clock3,
  Gauge,
  Hammer,
  Mail,
  MessageCircleWarning,
  MessageSquare,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldPlus,
  Target,
  UserX,
  Users,
} from "lucide-react";

interface Profile {
  id: string;
  full_name: string | null;
  created_at: string | null;
  email?: string | null;
  roles: string[];
  loading?: boolean;
}

interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  channel: string;
  status: "approved" | "flagged" | "denied";
  timestamp: string;
}

function useAdminPagination<T>(data: T[], pageSize = 10) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const paginated = useMemo(
    () => data.slice((page - 1) * pageSize, page * pageSize),
    [data, page, pageSize]
  );

  const next = () => setPage((p) => Math.min(p + 1, totalPages));
  const prev = () => setPage((p) => Math.max(p - 1, 1));
  const goTo = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));

  return { page, totalPages, paginated, next, prev, goTo };
}

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
        {alerts.map((alert) => (
          <div
            key={alert.title}
            className="rounded-lg border p-4 bg-card hover:bg-muted/30 transition"
          >
            <div className="flex items-start gap-3">
              <alert.icon className="w-6 h-6 text-primary" />
              <div className="flex-1">
                <p className="font-semibold">{alert.title}</p>
                <p className="text-sm text-muted-foreground">{alert.description}</p>
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
      icon: Target,
      accent: "text-blue-500",
    },
    {
      title: "Churn prediction",
      value: "3.1%",
      description: "Down by 0.7% after interventions.",
      icon: ShieldPlus,
      accent: "text-amber-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">AI Prediction Summary</CardTitle>
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
            <p className="text-xs mt-1 text-muted-foreground">{m.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const AdminPerformanceMonitor = () => {
  const stats = [
    { title: "AI moderation accuracy", value: 92, goal: "95% goal", color: "text-emerald-500" },
    { title: "False positives", value: 6, goal: "Dropping weekly", color: "text-amber-500" },
    { title: "Pending human reviews", value: 14, goal: "Goal < 10", color: "text-blue-500" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">AI Performance Monitor</CardTitle>
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
    { label: "Messages sent today", value: 482, icon: MessageSquare, color: "text-blue-500" },
    { label: "Email campaigns this week", value: 6, icon: Mail, color: "text-amber-500" },
    { label: "New user reports", value: 14, icon: Bell, color: "text-red-500" },
    { label: "Active communities", value: 23, icon: Users, color: "text-emerald-500" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Communications Pulse</CardTitle>
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
      title: "Realtime context scanning",
      description: "AI monitors live chats for policy violations with human handoff triggers.",
      badge: "Live",
    },
    {
      title: "Event risk scoring",
      description: "Hosted events are scored for safety and community fit before publishing.",
      badge: "Beta",
    },
    {
      title: "Identity assurance",
      description: "Verified IDs and device fingerprints reduce repeat abuse and ban evasion.",
      badge: "Enhanced",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Safety Features</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-lg border p-4 bg-card hover:bg-muted/20 transition"
          >
            <p className="font-semibold">{feature.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{feature.description}</p>
            <Badge variant="outline" className="mt-3 border-amber-400 text-amber-700 dark:text-amber-200">
              {feature.badge}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const AdminSupportCenter = () => {
  const actions = [
    {
      title: "AI Support Desk",
      description: "Triage urgent user reports and escalate abuse cases to on-call moderators.",
      badge: "Rapid response",
    },
    {
      title: "Moderator hotline",
      description: "Connect with live moderators for sensitive content reviews and appeals.",
      badge: "24/7 coverage",
    },
    {
      title: "Playbooks",
      description: "Shared runbooks for de-escalation, user outreach, and incident resolution.",
      badge: "Standardized",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Support Center</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-3">
        {actions.map((action) => (
          <div
            key={action.title}
            className="rounded-lg border p-4 bg-card hover:bg-muted/20 transition"
          >
            <p className="font-semibold">{action.title}</p>
            <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
            <Badge variant="outline" className="mt-3 border-amber-400 text-amber-700 dark:text-amber-200">
              {action.badge}
            </Badge>
          </div>
        ))}
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
          <Mail className="w-5 h-5" /> Bulk Email Sender
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

        <Button className="w-full" onClick={handleSendBulkEmail} disabled={sendingEmail}>
          {sendingEmail ? "Sending…" : `Send to ${totalUsers} users`}
        </Button>
      </CardContent>
    </Card>
  );
};

interface AdminUserManagementProps {
  profiles: Profile[];
  handleRoleChange: (id: string, role: string, action: "assign" | "revoke") => void;
}

const AdminUserManagement = ({ profiles, handleRoleChange }: AdminUserManagementProps) => {
  const { paginated, page, totalPages, next, prev } = useAdminPagination(profiles, 10);

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
              {paginated.map((profile) => {
                const isAdmin = profile.roles.includes("admin");

                return (
                  <TableRow key={profile.id}>
                    <TableCell>{profile.full_name ?? "N/A"}</TableCell>

                    <TableCell>
                      <Badge variant={isAdmin ? "default" : "secondary"}>
                        {isAdmin ? "ADMIN" : "USER"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {profile.email ?? "Email hidden"}
                    </TableCell>

                    <TableCell>
                      {profile.created_at
                        ? new Date(profile.created_at).toLocaleDateString()
                        : "—"}
                    </TableCell>

                    <TableCell className="text-right space-x-2">
                      {isAdmin ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRoleChange(profile.id, "admin", "revoke")}
                        >
                          Revoke Admin
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRoleChange(profile.id, "admin", "assign")}
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

const AdminAuditLog = ({ entries }: { entries: AuditLogEntry[] }) => {
  const statusMap: Record<AuditLogEntry["status"], string> = {
    approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30",
    flagged: "bg-amber-100 text-amber-700 dark:bg-amber-900/30",
    denied: "bg-red-100 text-red-700 dark:bg-red-900/30",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" /> Compliance Audit Log
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-md border overflow-x-auto">
          <Table className="min-w-[820px]">
            <TableHeader>
              <TableRow>
                <TableHead>Actor</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="font-medium">{entry.actor}</TableCell>
                  <TableCell>{entry.action}</TableCell>
                  <TableCell className="text-muted-foreground">{entry.target}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{entry.channel}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${statusMap[entry.status]}`}>
                      {entry.status === "approved" && "Approved"}
                      {entry.status === "flagged" && "Flagged"}
                      {entry.status === "denied" && "Denied"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-xs text-muted-foreground">
          Log entries capture admin actions, delivery channel, and review outcomes for compliance audits.
        </p>
      </CardContent>
    </Card>
  );
};

const AdminActionTimeline = ({ entries }: { entries: AuditLogEntry[] }) => {
  const recent = [...entries]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 6);

  const iconForStatus: Record<AuditLogEntry["status"], JSX.Element> = {
    approved: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    flagged: <AlertTriangle className="w-4 h-4 text-amber-500" />,
    denied: <UserX className="w-4 h-4 text-red-500" />,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock3 className="w-5 h-5 text-primary" /> Recent Admin Actions
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative pl-4">
          <div className="absolute left-1 top-1 bottom-1 w-px bg-border" aria-hidden />
          <div className="space-y-4">
            {recent.map((entry) => (
              <div key={entry.id} className="flex gap-3 items-start">
                <div className="relative">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {iconForStatus[entry.status]}
                    <span>{entry.actor}</span>
                    <span className="text-muted-foreground">{entry.action}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Target: {entry.target} · Channel: {entry.channel}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(entry.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Timeline provides a fast readout of the last approvals, flags, and overrides for weekly compliance reviews.
        </p>
      </CardContent>
    </Card>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  usePageTitle("Admin Command Center");

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  const auditEntries: AuditLogEntry[] = [
    {
      id: "1",
      actor: "Alex Kim",
      action: "Approved safety override",
      target: "Event #842 (Harbor Walk)",
      channel: "Dashboard",
      status: "approved",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "2",
      actor: "Priya Das",
      action: "Flagged account",
      target: "@nightowl for spam",
      channel: "Policy service",
      status: "flagged",
      timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    },
    {
      id: "3",
      actor: "Jordan Lee",
      action: "Revoked admin access",
      target: "user-2034",
      channel: "Dashboard",
      status: "approved",
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    },
    {
      id: "4",
      actor: "Mina Park",
      action: "Denied event publishing",
      target: "Event #829",
      channel: "Policy service",
      status: "denied",
      timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
    },
    {
      id: "5",
      actor: "Samir Patel",
      action: "Approved bulk email",
      target: "Safety update to volunteers",
      channel: "Messaging",
      status: "approved",
      timestamp: new Date(Date.now() - 1000 * 60 * 320).toISOString(),
    },
    {
      id: "6",
      actor: "Alex Kim",
      action: "Escalated report",
      target: "Report #553 to Trust & Safety",
      channel: "Dashboard",
      status: "flagged",
      timestamp: new Date(Date.now() - 1000 * 60 * 410).toISOString(),
    },
  ];

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

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

  const handleRoleChange = async (id: string, role: string, action: "assign" | "revoke") => {
    try {
      const { error } = await supabase.rpc("set_user_role", {
        _user_id: id,
        _role: role,
        _action: action,
      });

      if (error) throw error;

      toast({
        title: `Role ${action === "assign" ? "assigned" : "revoked"}`,
        description: `Updated ${role} role for user ${id}.`,
      });

      await loadProfiles();
    } catch (err) {
      console.error(err);
      toast({
        title: "Role change failed",
        description: "Unable to update user role right now.",
        variant: "destructive",
      });
    }
  };

  const handleSendBulkEmail = async () => {
    setSendingEmail(true);
    try {
      // This would call a backend function to dispatch the campaign
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast({ title: "Campaign queued", description: "Bulk email scheduled to send." });
      setEmailSubject("");
      setEmailMessage("");
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to queue email",
        description: "Please retry or check service status.",
        variant: "destructive",
      });
    } finally {
      setSendingEmail(false);
    }
  };

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
          <button onClick={() => navigate("/home")} className="px-4 py-2 bg-primary text-white rounded-md">
            Return Home
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-card border-b px-4 py-4 flex items-center justify-between sticky top-0 z-20">
        <BackButton fallbackPath="/home" />

        <h1 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Admin Dashboard
        </h1>

        <Badge variant="secondary">Admin</Badge>
      </div>

      <div className="p-4 space-y-6">
        <AdminSafetyAlerts />
        <AdminModerationActions />
        <AdminAISummary />
        <AdminPerformanceMonitor />
        <AdminCommunicationsPulse />
        <div className="grid gap-6 lg:grid-cols-2">
          <AdminAuditLog entries={auditEntries} />
          <AdminActionTimeline entries={auditEntries} />
        </div>
        <AdminSafetyFeatures />
        <AdminSupportCenter />
        <AdminBulkEmail
          emailSubject={emailSubject}
          emailMessage={emailMessage}
          setEmailSubject={setEmailSubject}
          setEmailMessage={setEmailMessage}
          handleSendBulkEmail={handleSendBulkEmail}
          sendingEmail={sendingEmail}
          totalUsers={profiles.length}
        />
        <AdminUserManagement profiles={profiles} handleRoleChange={handleRoleChange} />
      </div>
    </div>
  );
};

export default Admin;
