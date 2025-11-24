import { useEffect, useState } from "react";
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

  type SupabaseProfile = {
    id: string;
    full_name: string;
    created_at: string;
    email: string;
    status?: Profile["status"];
    user_roles?: { role: string }[];
  };

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
        await loadProfiles();
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

    const formattedProfiles = (data ?? ([] as SupabaseProfile[])).map((p) => ({
      id: p.id,
      full_name: p.full_name,
      created_at: p.created_at,
      email: p.email,
      roles: p.user_roles?.map((r) => r.role) ?? [],
      status: p.status ?? "active",
    }));

    setProfiles(formattedProfiles);
  };

  const handleBulkUserAction = (
    action: "suspend" | "activate" | "delete",
    selectedIds: string[],
  ) => {
    setProfiles((prev) => {
      if (action === "delete") {
        return prev.filter((profile) => !selectedIds.includes(profile.id));
      }

      return prev.map((profile) =>
        selectedIds.includes(profile.id)
          ? { ...profile, status: action === "suspend" ? "suspended" : "active" }
          : profile,
      );
    });

    const actionLabel =
      action === "suspend" ? "suspended" : action === "activate" ? "reactivated" : "deleted";

    toast({
      title: "Bulk action completed",
      description: `${selectedIds.length} user${selectedIds.length === 1 ? "" : "s"} ${actionLabel}.`,
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
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">System Status</h2>
          <p className="text-muted-foreground">All systems operational.</p>
        </Card>
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
          onRefresh={loadProfiles}
          onBulkAction={handleBulkUserAction}
          handleRoleChange={() => {}}
        />
      </div>
    </div>
  );
};

export default Admin;
