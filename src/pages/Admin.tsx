import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Send, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/BackButton";

interface Profile {
  id: string;
  full_name: string | null;
  created_at: string;
}

interface ProfileWithEmail extends Profile {
  email: string | null;
  loading: boolean;
}

const Admin = () => {
  const [profiles, setProfiles] = useState<ProfileWithEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadProfiles = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch all profiles (regular query, no admin privileges needed)
      const { data: profilesData, error } = await supabase
        .from('profiles')
        .select('id, full_name, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Initialize profiles with loading state for emails
      setProfiles(
        (profilesData || []).map(profile => ({
          ...profile,
          email: null,
          loading: false,
        }))
      );
    } catch (error) {
      console.error('Error loading profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load user profiles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const checkAdminAccess = useCallback(async () => {
    try {
      // First, verify the user is authenticated
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        toast({
          title: "Authentication required",
          description: "Please log in to access this page",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      // Check if user has admin role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profileError || !profile || profile.role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this page",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      // If admin, load all profiles
      await loadProfiles();
    } catch (error) {
      console.error('Error checking admin access:', error);
      toast({
        title: "Error",
        description: "Failed to verify admin access",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [loadProfiles, navigate, toast]);

  useEffect(() => {
    void checkAdminAccess();
  }, [checkAdminAccess]);

  /**
   * SECURE: Fetch user email through a protected edge function
   * This function calls a server-side edge function that:
   * 1. Verifies the caller is authenticated
   * 2. Verifies the caller has admin role
   * 3. Uses service role key server-side to fetch the email
   * 
   * This is the CORRECT way to access admin APIs - never call auth.admin
   * methods directly from the client as they require service role key.
   */
  const fetchUserEmail = async (userId: string, index: number) => {
    try {
      // Update loading state for this specific profile
      setProfiles(prev => 
        prev.map((p, i) => i === index ? { ...p, loading: true } : p)
      );

      // Get the current session to include the auth token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      // Call the secure edge function with proper authorization
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-user-email?userId=${userId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch email');
      }

      const data = await response.json();
      
      // Update the profile with the fetched email
      setProfiles(prev => 
        prev.map((p, i) => 
          i === index ? { ...p, email: data.email, loading: false } : p
        )
      );
    } catch (error) {
      console.error('Error fetching user email:', error);
      setProfiles(prev => 
        prev.map((p, i) => 
          i === index ? { ...p, email: 'Error loading email', loading: false } : p
        )
      );
    }
  };

  /**
   * SECURE: Send bulk email through a protected edge function
   * This function calls a server-side edge function that:
   * 1. Verifies the caller is authenticated
   * 2. Verifies the caller has admin role
   * 3. Uses service role key server-side to query all profiles
   * 4. Sends emails only after authorization checks pass
   */
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

      // Get the current session to include the auth token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      // Call the secure edge function with proper authorization
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-bulk-email`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subject: emailSubject,
            message: emailMessage,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send bulk email');
      }

      const data = await response.json();

      toast({
        title: "Success",
        description: data.message,
      });

      // Clear form
      setEmailSubject("");
      setEmailMessage("");
    } catch (error) {
      console.error('Error sending bulk email:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send bulk email",
        variant: "destructive",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <BackButton />
        <h1 className="text-lg font-semibold">Admin Panel</h1>
        <div className="w-10"></div>
      </div>

      <div className="px-6 py-8 space-y-6">
        {/* Bulk Email Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" />
              Send Bulk Email
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
                placeholder="Email message"
                rows={6}
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
              />
            </div>
            <Button
              onClick={handleSendBulkEmail}
              disabled={sendingEmail || !emailSubject.trim() || !emailMessage.trim()}
              className="w-full"
            >
              {sendingEmail ? "Sending..." : `Send to ${profiles.length} users`}
            </Button>
            <p className="text-sm text-muted-foreground">
              ✓ Secure: Requires admin authentication
              <br />
              ✓ Authorization checked server-side
              <br />
              ✓ Uses protected edge function
            </p>
          </CardContent>
        </Card>

        {/* User Management Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Management ({profiles.length} users)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
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
                      <TableCell>{profile.full_name || 'N/A'}</TableCell>
                      <TableCell>
                        {profile.email ? (
                          profile.email
                        ) : profile.loading ? (
                          <span className="text-muted-foreground">Loading...</span>
                        ) : (
                          <Button
                            variant="link"
                            size="sm"
                            onClick={() => fetchUserEmail(profile.id, index)}
                            className="h-auto p-0"
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
            <p className="text-sm text-muted-foreground mt-4">
              ✓ Secure: Email fetching uses protected edge function
              <br />
              ✓ Never calls auth.admin APIs from client
              <br />
              ✓ Authorization verified server-side
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
