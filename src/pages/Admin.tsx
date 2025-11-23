import { useState } from "react";

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
// src/pages/Admin/components/AdminSection.tsx

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
// src/pages/Admin/Admin.tsx

import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/usePageTitle";

// Layout + UI
import BackButton from "@/components/BackButton";
import { Badge } from "@/components/ui/badge";
import {
  LucideIcon,
  Shield,
  ShieldAlert,
  MessageCircleWarning,
  UserPlus,
  Users,
  Hammer,
  CheckCircle2,
  Activity,
  Gauge,
  TrendingUp,
  TrendingDown,
  Bell,
  Mail,
  MessageSquare,
} from "lucide-react";

// Hooks & Types
import { Profile } from "./types/Profile";

// Sections
import AdminSafetyAlerts from "./components/AdminSafetyAlerts";
import AdminModerationActions from "./components/AdminModerationActions";
import AdminAISummary from "./components/AdminAISummary";
import AdminPerformanceMonitor from "./components/AdminPerformanceMonitor";
import AdminCommunicationsPulse from "./components/AdminCommunicationsPulse";
import AdminSafetyFeatures from "./components/AdminSafetyFeatures";
import AdminSupportCenter from "./components/AdminSupportCenter";
import AdminBulkEmail from "./components/AdminBulkEmail";
import AdminUserManagement from "./components/AdminUserManagement";

type Severity = "Low" | "Medium" | "High";

interface SafetyAlert {
  title: string;
  description: string;
  severity: Severity;
  icon: LucideIcon;
}

interface ModerationAction {
  label: string;
  value: number;
  delta: string;
  icon: LucideIcon;
}

interface AIMetric {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  accent: string;
}

interface PerformanceStat {
  title: string;
  value: number;
  goal: string;
  color: string;
}

interface CommunicationStat {
  label: string;
  value: number;
  trend: string;
  icon: LucideIcon;
}

interface SafetyFeatureStat {
  name: string;
  status: string;
  detail: string;
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
  const [alerts, setAlerts] = useState<SafetyAlert[]>([]);
  const [moderationActions, setModerationActions] = useState<ModerationAction[]>([]);
  const [aiMetrics, setAiMetrics] = useState<AIMetric[]>([]);
  const [performanceStats, setPerformanceStats] = useState<PerformanceStat[]>([]);
  const [communicationStats, setCommunicationStats] = useState<CommunicationStat[]>([]);
  const [safetyFeatureStats, setSafetyFeatureStats] = useState<SafetyFeatureStat[]>([]);

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
  }, [loadProfiles]);

  /* ------------------------------------------------------------ */
  /* LOAD USER PROFILES */
  /* ------------------------------------------------------------ */

  const loadProfiles = useCallback(async () => {
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
  }, [toast]);

  const loadDashboardData = useCallback(async () => {
    try {
      const [profilesResponse, groupsResponse, membershipsResponse, rolesResponse] =
        await Promise.all([
          supabase
            .from("profiles")
            .select(
              "id, full_name, email, created_at, monthly_connections, monthly_event_joins, subscription_tier",
              { count: "exact" },
            ),
          supabase
            .from("groups")
            .select("id, created_at, is_premium, next_meeting", { count: "exact" }),
          supabase.from("group_members").select("*", { count: "exact", head: true }),
          supabase.from("user_roles").select("role"),
        ]);

      const profileRows = profilesResponse.data ?? [];
      const groupRows = groupsResponse.data ?? [];

      const adminCount = rolesResponse.data?.filter((r) => r.role === "admin").length ?? 0;
      const moderatorCount =
        rolesResponse.data?.filter((r) => r.role === "moderator").length ?? 0;

      const totalProfiles = profilesResponse.count ?? profileRows.length;
      const totalGroups = groupsResponse.count ?? groupRows.length;
      const totalMemberships = membershipsResponse.count ?? 0;

      const sortedProfiles = [...profileRows].sort((a, b) =>
        (b.created_at ?? "").localeCompare(a.created_at ?? ""),
      );

      const sortedGroups = [...groupRows].sort((a, b) =>
        (b.created_at ?? "").localeCompare(a.created_at ?? ""),
      );

      const newProfilesLastWeek = sortedProfiles.filter((profile) => {
        if (!profile.created_at) return false;
        const createdAt = new Date(profile.created_at);
        const diff = Date.now() - createdAt.getTime();
        return diff <= 7 * 24 * 60 * 60 * 1000;
      }).length;

      const alertsFromProfiles: SafetyAlert[] = sortedProfiles.slice(0, 2).map((profile) => ({
        title: profile.full_name ? `New profile: ${profile.full_name}` : "New profile created",
        description: profile.email
          ? `Signed up with ${profile.email}`
          : "Recently created account",
        severity: "Medium",
        icon: UserPlus,
      }));

      const topGroup = sortedGroups.at(0);
      const alertsFromGroups: SafetyAlert[] = topGroup
        ? [
            {
              title: "Community created",
              description: topGroup.next_meeting
                ? `Upcoming meetup on ${new Date(topGroup.next_meeting).toLocaleDateString()}`
                : "New group awaiting first event",
              severity: topGroup.is_premium ? "High" : "Medium",
              icon: Users,
            },
          ]
        : [];

      const combinedAlerts = [...alertsFromProfiles, ...alertsFromGroups];

      setAlerts(
        combinedAlerts.length
          ? combinedAlerts
          : [
              {
                title: "No recent alerts",
                description: "Live monitoring is active. New activity will appear here.",
                severity: "Low",
                icon: MessageCircleWarning,
              },
            ],
      );

      const groupMembershipRatio = totalGroups
        ? Math.round((totalMemberships / totalGroups) * 10) / 10
        : 0;

      setModerationActions([
        {
          label: "Active profiles",
          value: totalProfiles,
          delta: `${newProfilesLastWeek} joined this week`,
          icon: ShieldCheck,
        },
        {
          label: "Groups monitored",
          value: totalGroups,
          delta: `${totalMemberships} memberships (${groupMembershipRatio} avg)`,
          icon: Hammer,
        },
        {
          label: "Admin coverage",
          value: adminCount + moderatorCount,
          delta: `${adminCount} admins / ${moderatorCount} mods`,
          icon: CheckCircle2,
        },
      ]);

      const totalConnections = profileRows.reduce(
        (sum, profile) => sum + (profile.monthly_connections ?? 0),
        0,
      );

      const totalEventJoins = profileRows.reduce(
        (sum, profile) => sum + (profile.monthly_event_joins ?? 0),
        0,
      );

      const avgConnections = totalProfiles ? Math.round(totalConnections / totalProfiles) : 0;
      const avgEventJoins = totalProfiles ? Math.round(totalEventJoins / totalProfiles) : 0;
      const premiumGroups = groupRows.filter((group) => group.is_premium).length;

      setAiMetrics([
        {
          title: "User activity rise",
          value: `${avgConnections}%`,
          description: "Avg. monthly connections across profiles",
          icon: Activity,
          accent: "text-emerald-500",
        },
        {
          title: "Event success forecast",
          value: `${avgEventJoins}%`,
          description: "Avg. monthly event joins",
          icon: Gauge,
          accent: "text-indigo-500",
        },
        {
          title: "Premium communities",
          value: `${premiumGroups}/${totalGroups || 1}`,
          description: "Groups running premium experiences",
          icon: TrendingUp,
          accent: "text-blue-500",
        },
        {
          title: "Churn prediction",
          value: `${Math.max(2, 10 - avgConnections)}%`,
          description: "Lower is better. Based on recent activity.",
          icon: TrendingDown,
          accent: "text-amber-500",
        },
      ]);

      const engagementScore = Math.min(100, Math.max(5, avgConnections));
      const retentionScore = Math.min(100, Math.max(5, avgEventJoins));
      const coverageScore = totalGroups
        ? Math.min(100, Math.round((premiumGroups / totalGroups) * 100))
        : 0;

      setPerformanceStats([
        {
          title: "Engagement strength",
          value: engagementScore,
          goal: "Target > 50%",
          color: "text-emerald-500",
        },
        {
          title: "Retention outlook",
          value: retentionScore,
          goal: "Goal steady growth",
          color: "text-amber-500",
        },
        {
          title: "Premium coverage",
          value: coverageScore,
          goal: `${premiumGroups} premium / ${totalGroups || 0} groups`,
          color: "text-blue-500",
        },
      ]);

      setCommunicationStats([
        {
          label: "Groups created",
          value: totalGroups,
          trend: `${sortedGroups.slice(0, 3).filter((group) => !!group.next_meeting).length} upcoming events`,
          icon: Bell,
        },
        {
          label: "Active memberships",
          value: totalMemberships,
          trend: groupMembershipRatio ? `${groupMembershipRatio} per group` : "No memberships yet",
          icon: Users,
        },
        {
          label: "Premium signals",
          value: premiumGroups,
          trend: premiumGroups ? "Upgrade momentum" : "Awaiting first premium group",
          icon: Mail,
        },
        {
          label: "Engaged profiles",
          value: totalProfiles,
          trend: `${avgConnections} avg connections`,
          icon: MessageSquare,
        },
      ]);

      setSafetyFeatureStats([
        {
          name: "Live profile monitoring",
          status: `${totalProfiles} profiles tracked`,
          detail: `${newProfilesLastWeek} new in the last 7 days`,
        },
        {
          name: "Community coverage",
          status: `${totalGroups} groups monitored`,
          detail: `${premiumGroups} premium, ${totalMemberships} memberships`,
        },
        {
          name: "Admin oversight",
          status: `${adminCount + moderatorCount} staff accounts`,
          detail: `${adminCount} admins and ${moderatorCount} moderators`,
        },
      ]);
    } catch (err) {
      console.error("admin-dashboard:load-data", err);
      toast({
        title: "Error loading admin data",
        description: "Supabase data could not be refreshed.",
        variant: "destructive",
      });
    }
  }, [toast]);


  useEffect(() => {
    if (!isAdmin) return;

    loadDashboardData();

    const channel = supabase
      .channel("admin-dashboard")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        () => {
          loadDashboardData();
          loadProfiles();
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "groups" },
        loadDashboardData,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "group_members" },
        loadDashboardData,
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_roles" },
        loadDashboardData,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, loadDashboardData, loadProfiles]);



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
        <AdminSafetyAlerts alerts={alerts} />

        {/* 2. Moderation Summary */}
        <AdminModerationActions actions={moderationActions} />

        {/* 3. AI Prediction Summary */}
        <AdminAISummary metrics={aiMetrics} />

        {/* 4. AI Performance Monitor */}
        <AdminPerformanceMonitor stats={performanceStats} />

        {/* 5. Communications Pulse */}
        <AdminCommunicationsPulse stats={communicationStats} />

        {/* 6. Safety Features */}
        <AdminSafetyFeatures featureStats={safetyFeatureStats} />

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

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldAlert } from "lucide-react";

const AdminSafetyAlerts = ({ alerts }: { alerts: SafetyAlert[] }) => {
  const severityColor = (s: Severity) => {
    if (s === "High") return "text-red-600 bg-red-100 dark:bg-red-900/30";
    if (s === "Low") return "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30";
    return "text-amber-600 bg-amber-100 dark:bg-amber-900/30";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-red-500" />
          Safety Alerts
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {!alerts.length && (
          <p className="text-sm text-muted-foreground">No live alerts yet.</p>
        )}

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

export default AdminSafetyAlerts;
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

const AdminModerationActions = ({ actions }: { actions: ModerationAction[] }) => {
  const hasData = actions.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          Moderation Activity
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-3">
        {!hasData && <p className="text-sm text-muted-foreground">No moderation stats yet.</p>}

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

export default AdminModerationActions;

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const AdminAISummary = ({ metrics }: { metrics: AIMetric[] }) => {
  const hasData = metrics.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          AI Prediction Summary
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {!hasData && <p className="text-sm text-muted-foreground">No AI metrics available.</p>}

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

export default AdminAISummary;
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const AdminPerformanceMonitor = ({ stats }: { stats: PerformanceStat[] }) => {
  const hasData = stats.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          AI Performance Monitor
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {!hasData && <p className="text-sm text-muted-foreground">No performance data yet.</p>}

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

export default AdminPerformanceMonitor;

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const AdminCommunicationsPulse = ({ stats }: { stats: CommunicationStat[] }) => {
  const hasData = stats.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Communications Pulse
        </CardTitle>
      </CardHeader>

      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {!hasData && (
          <p className="text-sm text-muted-foreground">No communications activity yet.</p>
        )}

        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border p-4 bg-card hover:bg-muted/20 transition"
          >
            <div className="flex items-center gap-2 mb-1">
              <s.icon className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium">{s.label}</p>
                <p className="text-xs text-muted-foreground">{s.trend}</p>
              </div>
            </div>

            <p className="text-3xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default AdminCommunicationsPulse;

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Bot, Ban, IdCard } from "lucide-react";

const AdminSafetyFeatures = ({ featureStats }: { featureStats: SafetyFeatureStat[] }) => {
  const features = featureStats.length
    ? featureStats.map((feature, index) => ({
        title: feature.name,
        description: feature.detail,
        badge: feature.status,
        icon: [ShieldCheck, Ban, Bot, IdCard][index % 4],
        color: ["text-emerald-600", "text-red-600", "text-blue-600", "text-amber-600"][
          index % 4
        ],
      }))
    : [
        {
          title: "Safety systems online",
          description: "Monitoring live signals",
          badge: "Ready",
          icon: ShieldCheck,
          color: "text-emerald-600",
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

export default AdminSafetyFeatures;

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Bot,
  Sparkles,
  Reply,
  Tag,
  FileText,
  CheckCircle2,
  UploadCloud,
  Headset,
} from "lucide-react";

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

export default AdminSupportCenter;
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

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

export default AdminBulkEmail;

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { useAdminPagination } from "../hooks/useAdminPagination";

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

export default AdminUserManagement;





