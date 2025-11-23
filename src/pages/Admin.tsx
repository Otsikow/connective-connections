import { useState } from "react";

export function useAdminPagination<T>(data: T[], pageSize = 10) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);
  const paginated = data.slice((page - 1) * pageSize, page * pageSize);

  const next = () => setPage((p) => Math.min(p + 1, totalPages));
  const prev = () => setPage((p) => Math.max(p - 1, 1));
  const goTo = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));

  return { page, totalPages, paginated, next, prev, goTo };
}

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface AdminSectionProps {
  title: string;
  icon?: React.ReactNode;
  description?: string;
  children: React.ReactNode;
}

const AdminSection = ({ title, icon, description, children }: AdminSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon} {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default AdminSection;
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";
import { AdminAlert, AlertSeverity } from "../Admin";

interface Props {
  alerts: AdminAlert[];
}

const severityClass = (s: AlertSeverity = "Medium") =>
  s === "High"
    ? "text-red-600 bg-red-100 dark:bg-red-900/30"
    : s === "Low"
    ? "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30"
    : "text-amber-600 bg-amber-100 dark:bg-amber-900/30";

const AdminSafetyAlerts = ({ alerts }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-500" />
          Safety Alerts
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {alerts.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No live alerts yet. New admin behaviour events will appear here.
          </p>
        )}

        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="rounded-lg border p-4 bg-card hover:bg-muted/30 transition"
          >
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-6 h-6 text-primary" />
              <div className="flex-1">
                <p className="font-semibold">{alert.action}</p>
                <p className="text-sm text-muted-foreground">
                  {typeof alert.metadata?.reason === "string"
                    ? alert.metadata.reason
                    : "Tracked via admin audit log"}
                </p>

                <p className="text-xs text-muted-foreground mt-1">
                  {alert.created_at
                    ? new Date(alert.created_at).toLocaleString()
                    : "Timestamp unavailable"}
                </p>
              </div>

              <span
                className={`px-2 py-1 rounded text-xs font-medium ${severityClass(
                  alert.severity
                )}`}
              >
                {alert.severity ?? "Medium"}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AdminSafetyAlerts;
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2, Hammer, ShieldCheck } from "lucide-react";

interface Metrics {
  totalActions: number;
  targetedActions: number;
  last24h: number;
}

interface Props {
  metrics: Metrics;
}

const AdminModerationActions = ({ metrics }: Props) => {
  const cards = [
    {
      label: "Audit log entries",
      value: metrics.totalActions,
      icon: ShieldCheck,
      description: "Live from Supabase",
    },
    {
      label: "Targeted actions",
      value: metrics.targetedActions,
      icon: Hammer,
      description: "Actions tied to specific users",
    },
    {
      label: "Last 24 hours",
      value: metrics.last24h,
      icon: CheckCircle2,
      description: "New moderation events today",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          Moderation Overview
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-lg border p-4 bg-card hover:bg-muted/20 transition"
          >
            <div className="flex items-center gap-2 mb-2">
              <c.icon className="w-5 h-5 text-primary" />
              <p className="font-medium">{c.label}</p>
            </div>

            <p className="text-3xl font-bold">{c.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{c.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AdminModerationActions;

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Activity, Gauge, TrendingDown, TrendingUp } from "lucide-react";

const AdminAISummary = () => {
  const metrics = [
    {
      title: "User activity rise",
      value: "+14%",
      description: "Driven by AI onboarding nudges.",
      icon: Activity,
      color: "text-emerald-500",
    },
    {
      title: "Event turnout prediction",
      value: "82%",
      description: "Strong user engagement forecast.",
      icon: Gauge,
      color: "text-indigo-500",
    },
    {
      title: "Communities trending up",
      value: "6",
      description: "AI-driven engagement improvements.",
      icon: TrendingUp,
      color: "text-blue-500",
    },
    {
      title: "Churn risk",
      value: "3.1%",
      description: "Down after AI retention interventions.",
      icon: TrendingDown,
      color: "text-amber-500",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Prediction Summary</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <div
            key={m.title}
            className="rounded-lg border p-4 bg-card hover:bg-muted/20 transition"
          >
            <div className="flex items-center gap-2 mb-2">
              <m.icon className={`w-5 h-5 ${m.color}`} />
              <p className="font-medium">{m.title}</p>
            </div>

            <p className={`text-3xl font-bold ${m.color}`}>{m.value}</p>

            <p className="text-xs text-muted-foreground mt-1">
              {m.description}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AdminAISummary;

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const AdminPerformanceMonitor = () => {
  const stats = [
    { label: "AI moderation accuracy", value: 92, color: "text-emerald-500", goal: "95% target" },
    { label: "False positives", value: 6, color: "text-amber-500", goal: "Dropping weekly" },
    { label: "Pending reviews", value: 14, color: "text-blue-500", goal: "Goal < 10" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Performance Monitor</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="flex justify-between">
              <p className="font-medium">{s.label}</p>
              <p className={`font-semibold ${s.color}`}>{s.value}%</p>
            </div>

            <Progress value={s.value} className="h-2" />

            <p className="text-xs text-muted-foreground mt-1">{s.goal}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AdminPerformanceMonitor;

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bell, Mail, MessageSquare, Users } from "lucide-react";

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
        <CardTitle>Communications Pulse</CardTitle>
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

export default AdminCommunicationsPulse;
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ban, Bot, IdCard, ShieldCheck } from "lucide-react";

const AdminSafetyFeatures = () => {
  const features = [
    {
      title: "Harassment & threat detection",
      description: "AI scans conversations for threats, harassment, manipulation and auto-warns.",
      badge: "Auto-warn",
      icon: ShieldCheck,
      color: "text-emerald-600",
    },
    {
      title: "Suspicious account flagging",
      description: "AI detects abnormal behaviour and temporarily restricts accounts.",
      badge: "Risk scoring",
      icon: Ban,
      color: "text-red-600",
    },
    {
      title: "Bot / spam filtering",
      description: "Real-time ML-based blocking of spam, bots, and scams.",
      badge: "Active filter",
      icon: Bot,
      color: "text-blue-600",
    },
    {
      title: "AI ID verification",
      description: "Automatic document & ID verification for safer meetups.",
      badge: "Auto-verify",
      icon: IdCard,
      color: "text-amber-600",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Safety & Behaviour Systems</CardTitle>
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

            <p className="text-sm text-muted-foreground">{f.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AdminSafetyFeatures;

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, CheckCircle2, FileText, Headset, Reply, Sparkles, Tag, UploadCloud } from "lucide-react";

const AdminSupportCenter = () => {
  const tools = [
    {
      title: "AI answers support tickets",
      description: "Instant on-brand replies to user issues.",
      badge: "Instant replies",
      icon: Bot,
    },
    {
      title: "AI troubleshooting guides",
      description: "Step-by-step auto-generated fixes.",
      badge: "Auto-fix",
      icon: Sparkles,
    },
    {
      title: "AI reply suggestions",
      description: "Admins approve in one click.",
      badge: "1-tap approval",
      icon: Reply,
    },
    {
      title: "Auto triage",
      description: "Billing, login, and behaviour tickets routed automatically.",
      badge: "Smart triage",
      icon: Tag,
    },
    {
      title: "AI macros",
      description: "Saved responses improved by the AI automatically.",
      badge: "Macros",
      icon: FileText,
    },
  ];

  const adminActions = [
    {
      title: "Approve / reject AI replies",
      description: "Human-in-the-loop quality reviews.",
      badge: "Quality gate",
      icon: CheckCircle2,
    },
    {
      title: "Upload new FAQ content",
      description: "Refresh AI knowledge instantly.",
      badge: "Knowledge update",
      icon: UploadCloud,
    },
  ];

  return (
    <Card className="border-amber-300/40 bg-amber-50/40 dark:bg-amber-900/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-100">
          <Headset className="w-5 h-5" />
          AI Support Centre
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-6 md:grid-cols-2">
        {/* Tools */}
        <div className="space-y-4">
          <p className="text-sm font-semibold">Tools</p>

          {tools.map((t) => (
            <div key={t.title} className="rounded-xl border p-4 bg-white dark:bg-amber-900/40">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-amber-200/40 dark:bg-amber-800/50">
                  <t.icon className="w-5 h-5 text-amber-800 dark:text-amber-100" />
                </div>

                <div>
                  <p className="font-semibold">{t.title}</p>
                  <p className="text-sm text-muted-foreground">{t.description}</p>
                </div>
              </div>

              <Badge className="mt-3 bg-amber-100 text-amber-800">{t.badge}</Badge>
            </div>
          ))}
        </div>

        {/* Admin Actions */}
        <div className="space-y-4">
          <p className="text-sm font-semibold">Admin Actions</p>

          {adminActions.map((a) => (
            <div key={a.title} className="rounded-xl border p-4 bg-amber-50 dark:bg-amber-900/30">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 flex items-center justify-center rounded-full bg-amber-200/40 dark:bg-amber-800/50">
                  <a.icon className="w-5 h-5 text-amber-800 dark:text-amber-100" />
                </div>

                <div>
                  <p className="font-semibold">{a.title}</p>
                  <p className="text-sm text-muted-foreground">{a.description}</p>
                </div>
              </div>

              <Badge variant="outline" className="mt-3 border-amber-400 text-amber-700">
                {a.badge}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AdminSupportCenter;
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

interface Props {
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
}: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5" />
          Bulk Email Sender
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <Label>Subject</Label>
          <Input
            placeholder="Email subject"
            value={emailSubject}
            onChange={(e) => setEmailSubject(e.target.value)}
          />
        </div>

        <div>
          <Label>Message</Label>
          <Textarea
            placeholder="Write the email..."
            rows={6}
            value={emailMessage}
            onChange={(e) => setEmailMessage(e.target.value)}
          />
        </div>

        <Button
          className="w-full"
          disabled={sendingEmail}
          onClick={handleSendBulkEmail}
        >
          {sendingEmail ? "Sending…" : `Send to ${totalUsers} users`}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AdminBulkEmail;

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Profile } from "../types/Profile";
import { useAdminPagination } from "./useAdminPagination";

interface Props {
  profiles: Profile[];
  fetchUserEmail: (id: string, index: number) => void;
  handleRoleChange: (id: string, role: string, action: "assign" | "revoke") => void;
}

const AdminUserManagement = ({
  profiles,
  fetchUserEmail,
  handleRoleChange,
}: Props) => {
  const { paginated, page, totalPages, next, prev } =
    useAdminPagination(profiles, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="rounded-md border overflow-x-auto">
          <Table className="min-w-[850px]">
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

        {/* Pagination */}
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

export default AdminUserManagement;

