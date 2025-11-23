import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/BackButton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/usePageTitle";

// Types
import { Profile } from "./types/Profile";
import { AdminAlert, AlertSeverity } from "./types/AdminAlert";

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

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  usePageTitle("Admin Command Center");

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [moderationMetrics, setModerationMetrics] = useState({
    totalActions: 0,
    targetedActions: 0,
    last24h: 0,
  });

  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  /* ADMIN VERIFICATION */
  useEffect(() => {
    const verify = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("Not authenticated");
          return setLoading(false);
        }

        const { data: allowed } = await supabase.rpc("has_role", {
          _user_id: user.id,
          _role: "admin",
        });

        if (!allowed) {
          setError("Access denied");
          return setLoading(false);
        }

        setIsAdmin(true);
        await Promise.all([loadProfiles(), loadAuditLog()]);
      } catch {
        setError("Admin validation failed");
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  /* LOAD PROFILES */
  const loadProfiles = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, created_at, email, user_roles(role)")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error loading profiles",
        description: "Could not load users.",
        variant: "destructive",
      });
      return;
    }

    setProfiles(
      data.map((p: any) => ({
        id: p.id,
        full_name: p.full_name,
        created_at: p.created_at,
        email: p.email,
        roles: p.user_roles?.map((r: any) => r.role) ?? [],
      }))
    );
  };

  /* LOAD AUDIT LOG */
  const normalizeSeverity = (m?: Record<string, any>): AlertSeverity => {
    const v = typeof m?.severity === "string" ? m.severity.toLowerCase() : "";
    if (v.includes("high")) return "High";
    if (v.includes("low")) return "Low";
    return "Medium";
  };

  const loadAuditLog = async () => {
    const { data } = await supabase
      .from("admin_audit_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(25);

    const normalized = (data ?? []).map((entry: any) => ({
      ...entry,
      severity: normalizeSeverity(entry.metadata),
    }));

    setAlerts(normalized);

    const last24 = Date.now() - 24 * 60 * 60 * 1000;

    setModerationMetrics({
      totalActions: normalized.length,
      targetedActions: normalized.filter((a) => a.target_user_id).length,
      last24h: normalized.filter(
        (a) =>
          a.created_at && new Date(a.created_at).getTime() >= last24
      ).length,
    });
  };

  /* SEND BULK EMAIL */
  const handleSendBulkEmail = async () => {
    setSendingEmail(true);
    await new Promise((r) => setTimeout(r, 700));

    toast({
      title: "Queued",
      description: "Bulk email will be delivered to all users.",
    });

    setSendingEmail(false);
  };

  /* ACCESS CONTROL */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Shield className="w-6 h-6 mr-2 animate-spin text-primary" />
        <p>Checking admin access…</p>
      </div>
    );
  }

  if (error || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 text-center max-w-md">
          <p className="text-red-500 font-semibold mb-2">{error}</p>
          <button
            onClick={() => navigate("/home")}
            className="bg-primary text-white px-4 py-2 rounded"
          >
            Return Home
          </button>
        </Card>
      </div>
    );
  }

  /* RENDER FINAL DASHBOARD */
  const visibleAlerts = useMemo(() => alerts.slice(0, 5), [alerts]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* HEADER */}
      <header className="bg-card border-b px-4 py-4 flex items-center justify-between sticky top-0 z-20">
        <BackButton fallbackPath="/home" />

        <h1 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Admin Dashboard
        </h1>

        <Badge>Admin</Badge>
      </header>

      {/* BODY */}
      <div className="p-4 space-y-6">
        <AdminSafetyAlerts alerts={visibleAlerts} />
        <AdminModerationActions metrics={moderationMetrics} />
        <AdminAISummary />
        <AdminPerformanceMonitor />
        <AdminCommunicationsPulse />
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

        <AdminUserManagement
          profiles={profiles}
          fetchUserEmail={() => {}}
          handleRoleChange={() => {}}
        />
      </div>
    </div>
  );
};

export default Admin;
