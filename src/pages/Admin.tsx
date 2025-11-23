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
