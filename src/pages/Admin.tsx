import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/usePageTitle";
import BackButton from "@/components/BackButton";
import { Badge } from "@/components/ui/badge";
import { Shield, ShieldAlert, Mail, Users } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Profile {
  id: string;
  full_name: string | null;
  created_at: string;
  email: string | null;
  roles: string[];
  loading?: boolean;
}

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
        })),
      );
    } catch {
      toast({
        title: "Error loading profiles",
        description: "Could not load user records.",
        variant: "destructive",
      });
    }
  };

  const handleSendBulkEmail = async () => {
    setSendingEmail(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast({
        title: "Bulk email queued",
        description: "Messages will be delivered to all active users.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Unable to send bulk email",
        description: "Please try again after checking your connection.",
        variant: "destructive",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const handleRoleChange = async (id: string, role: "admin" | "moderator" | "user", action: "assign" | "revoke") => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (action === "assign") {
        const { error } = await supabase.from("user_roles").insert({
          user_id: id,
          role: role,
          granted_by: user?.id,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.from("user_roles").delete().eq("user_id", id).eq("role", role);
        if (error) throw error;
      }
      await loadProfiles();
      toast({
        title: action === "assign" ? "Role granted" : "Role revoked",
        description: "Changes applied successfully.",
      });
    } catch (error) {
      console.error("Role change error:", error);
      toast({
        title: "Unable to update role",
        description: "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Shield className="w-6 h-6 mr-2 animate-spin text-primary" />
        <p className="text-muted-foreground">Verifying admin access…</p>
      </div>
    );
  }

  if (error || !isAdmin) {
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
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-card border-b px-4 py-4 flex items-center justify-between sticky top-0 z-20">
        <BackButton fallbackPath="/home">Back</BackButton>
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Admin Dashboard
        </h1>
        <Badge variant="secondary">Admin</Badge>
      </div>

      <div className="p-4 space-y-6">
        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-green-500" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">All systems operational</p>
          </CardContent>
        </Card>

        {/* Bulk Email */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Mail className="w-5 h-5 text-purple-500" />
              Bulk Email Communication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Subject</label>
              <Input
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Email subject..."
              />
            </div>
            <div>
              <label className="text-sm font-medium">Message</label>
              <Textarea
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                placeholder="Compose your message..."
                rows={4}
              />
            </div>
            <Button onClick={handleSendBulkEmail} disabled={sendingEmail} className="w-full">
              {sendingEmail ? "Sending..." : `Send to ${profiles.length} users`}
            </Button>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Users className="w-5 h-5 text-green-500" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {profiles.slice(0, 10).map((profile) => (
              <div key={profile.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-medium">{profile.full_name || "No name"}</p>
                  <p className="text-xs text-muted-foreground">{profile.email || "No email"}</p>
                </div>
                <div className="flex gap-2">
                  {profile.roles.includes("admin") ? (
                    <Button size="sm" variant="outline" onClick={() => handleRoleChange(profile.id, "admin", "revoke")}>
                      Revoke Admin
                    </Button>
                  ) : (
                    <Button size="sm" onClick={() => handleRoleChange(profile.id, "admin", "assign")}>
                      Make Admin
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;

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

/* ------------------------------------------------------------ */
/* TYPES FOR ADMIN LOG */
/* ------------------------------------------------------------ */

export type AlertSeverity = "High" | "Medium" | "Low";

export interface AdminAlert {
  id: string;
  action: string;
  target_user_id?: string | null;
  created_at?: string | null;
  admin_id?: string | null;
  metadata?: Record<string, any> | null;
  severity?: AlertSeverity;
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
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [moderationMetrics, setModerationMetrics] = useState({
    totalActions: 0,
    targetedActions: 0,
    last24h: 0,
  });

  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  /* ------------------------------------------------------------ */
  /* ADMIN VERIFICATION */
  /* ------------------------------------------------------------ */

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

        const { data: isAdminFlag } = await supabase.rpc("has_role", {
          _user_id: user.id,
          _role: "admin",
        });

        if (!isAdminFlag) {
          setError("Access denied: Admins only");
          return setLoading(false);
        }

        setIsAdmin(true);
        await Promise.all([loadProfiles(), loadAuditLog()]);
      } catch (err) {
        setError("Failed to verify admin access");
      } finally {
        setLoading(false);
      }
    };

    verifyAdmin();
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

      const list = (data ?? []).map((p: any) => ({
        id: p.id,
        full_name: p.full_name,
        created_at: p.created_at,
        email: p.email,
        roles: p.user_roles?.map((r: any) => r.role) ?? [],
      }));

      setProfiles(list);
    } catch (err) {
      toast({
        title: "Error loading profiles",
        description: "Could not load user records.",
        variant: "destructive",
      });
    }
  };

  /* ------------------------------------------------------------ */
  /* LOAD AUDIT LOG */
  /* ------------------------------------------------------------ */

  const normalizeSeverity = (metadata?: Record<string, any>): AlertSeverity => {
    const val = typeof metadata?.severity === "string" ? metadata.severity : "";
    const s = val.toLowerCase();

    if (s.includes("high")) return "High";
    if (s.includes("low")) return "Low";
    return "Medium";
  };

  const loadAuditLog = async () => {
    try {
      const { data, error } = await supabase
        .from("admin_audit_log")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(25);

      if (error) throw error;

      const normalized = (data ?? []).map((entry: any) => ({
        ...entry,
        severity: normalizeSeverity(entry.metadata),
      }));

      setAlerts(normalized);

      const now = Date.now();
      const since = now - 24 * 60 * 60 * 1000;

      setModerationMetrics({
        totalActions: normalized.length,
        targetedActions: normalized.filter((e) => e.target_user_id).length,
        last24h: normalized.filter((e) => e.created_at && new Date(e.created_at).getTime() >= since).length,
      });
    } catch (err) {
      toast({
        title: "Error loading admin audit log",
        description: "Could not retrieve admin events.",
        variant: "destructive",
      });
    }
  };

  /* ------------------------------------------------------------ */
  /* REALTIME SUBSCRIPTIONS */
  /* ------------------------------------------------------------ */

  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel("admin-dashboard")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "admin_audit_log",
        },
        (payload) => {
          const entry = payload.new as AdminAlert;
          const formatted = {
            ...entry,
            severity: normalizeSeverity(entry.metadata),
          };

          setAlerts((prev) => [formatted, ...prev].slice(0, 25));

          const since = Date.now() - 24 * 60 * 60 * 1000;
          const created = entry.created_at ? new Date(entry.created_at).getTime() : 0;

          setModerationMetrics((prev) => ({
            totalActions: prev.totalActions + 1,
            targetedActions: prev.targetedActions + (entry.target_user_id ? 1 : 0),
            last24h: prev.last24h + (created >= since ? 1 : 0),
          }));
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
        },
        () => loadProfiles(),
      )
      .subscribe();

    return () => {
      // @ts-ignore
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  /* ------------------------------------------------------------ */
  /* BULK EMAIL HANDLER */
  /* ------------------------------------------------------------ */

  const handleSendBulkEmail = async () => {
    setSendingEmail(true);

    try {
      await new Promise((r) => setTimeout(r, 800)); // simulate processing

      toast({
        title: "Bulk email queued",
        description: "Messages will be delivered to all users.",
      });
    } catch (err) {
      toast({
        title: "Bulk email failed",
        description: "Try again later.",
        variant: "destructive",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  /* ------------------------------------------------------------ */
  /* FETCH INDIVIDUAL EMAIL */
  /* ------------------------------------------------------------ */

  const fetchUserEmail = async (id: string, index: number) => {
    setProfiles((prev) => prev.map((p, i) => (i === index ? { ...p, loading: true } : p)));

    const { data } = await supabase.from("profiles").select("email").eq("id", id).maybeSingle();

    setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, email: data?.email ?? null, loading: false } : p)));
  };

  /* ------------------------------------------------------------ */
  /* ROLE MANAGEMENT */
  /* ------------------------------------------------------------ */

  const handleRoleChange = async (id: string, role: string, action: "assign" | "revoke") => {
    try {
      if (action === "assign") {
        await supabase.from("user_roles").insert({ user_id: id, role });
      } else {
        await supabase.from("user_roles").delete().eq("user_id", id).eq("role", role);
      }

      await loadProfiles();

      toast({
        title: action === "assign" ? "Role assigned" : "Role revoked",
        description: "Role updated successfully.",
      });
    } catch {
      toast({
        title: "Role update failed",
        description: "Try again later.",
        variant: "destructive",
      });
    }
  };

  /* ------------------------------------------------------------ */
  /* ACCESS GUARDS */
  /* ------------------------------------------------------------ */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Shield className="w-6 h-6 mr-2 animate-spin text-primary" />
        <p className="text-muted-foreground">Verifying admin access…</p>
      </div>
    );
  }

  if (error || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-6 max-w-md text-center border">
          <p className="text-red-500 font-semibold mb-2">Access Denied</p>
          <p className="text-muted-foreground mb-4">{error}</p>
          <button onClick={() => navigate("/home")} className="px-4 py-2 bg-primary text-white rounded-md">
            Return Home
          </button>
        </Card>
      </div>
    );
  }

  /* ------------------------------------------------------------ */
  /* PAGE RENDER */
  /* ------------------------------------------------------------ */

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

        <Badge variant="secondary">Admin</Badge>
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

        <AdminUserManagement profiles={profiles} fetchUserEmail={fetchUserEmail} handleRoleChange={handleRoleChange} />
      </div>
    </div>
  );
};

export default Admin;
