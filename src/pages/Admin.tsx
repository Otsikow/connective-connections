// src/pages/Admin.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
import {
  ArrowLeft,
  Shield,
  Mail,
  Users,
  Settings,
  Send,
} from "lucide-react";
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
  created_at: string;
  email?: string | null;
  loading?: boolean;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isAdmin, setIsAdmin] = useState(false);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  // ✅ Verify current user is admin
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

        const role =
          user.user_metadata?.role ||
          user.app_metadata?.role ||
          (user.email?.endsWith("@admin.connective.com") ? "admin" : "user");

        if (role !== "admin") {
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

  // ✅ Load user profiles
  const loadProfiles = async () => {
    try {
      setLoading(true);
      // Note: profiles table doesn't exist yet - using placeholder data
      // TODO: Create profiles table in database
      setProfiles([]);
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

  // ✅ Securely fetch a user’s email through Edge Function
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

  // ✅ Send bulk email through Edge Function
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

  // 🌀 Loading screen
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Shield className="w-8 h-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Verifying admin access…</p>
      </div>
    );

  // 🚫 Access Denied
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

  // ✅ Main Admin Panel
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-muted rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold flex items-center gap-2">
          <Shield className="w-5 h-5" /> Admin Dashboard
        </h1>
        <Badge variant="secondary">Admin Access</Badge>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-4 h-4" /> Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{profiles.length}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Campaigns
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">—</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-4 h-4" /> System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-green-600 font-bold">Online</p>
            </CardContent>
          </Card>
        </div>

        {/* Bulk Email */}
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

        {/* User Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" /> User Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table className="min-w-[600px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Joined</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profiles.map((profile, index) => (
                    <TableRow key={profile.id}>
                      <TableCell>{profile.full_name || "N/A"}</TableCell>
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
                        {new Date(profile.created_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
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
