import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, Sparkles } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  getSupabaseRedirectUrl,
  isSupabaseConfigured,
  supabase,
} from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";
import BackButton from "@/components/BackButton";
import { hasCompletedOnboarding } from "@/lib/onboarding";
import { activateDemoSession } from "@/lib/demoSession";

const featureHighlights = [
  "Curated in-person events",
  "AI-powered match suggestions",
  "Private messaging and group chats",
];

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  usePageTitle("Sign In to Connective Connections");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isLikelyPhone = (value: string) => {
    const trimmed = value.trim();
    return trimmed.length > 0 && !trimmed.includes("@") && /^\+?[\d\s().-]+$/.test(trimmed);
  };

  const identifierLabel = useMemo(() => {
    if (!identifier) return "Email or phone";
    return isLikelyPhone(identifier) ? "Phone" : "Email";
  }, [identifier]);

  const locationState = location.state as { next?: string } | null;
  const nextPath =
    typeof locationState?.next === "string" && locationState.next.length > 0
      ? locationState.next
      : "/home";

  const resolvedNextPath = hasCompletedOnboarding() ? nextPath : "/onboarding";

  const startDemoSignIn = () => {
    const session = activateDemoSession(identifier);
    toast({
      title: "Preview access enabled",
      description: `You are browsing as ${session?.email ?? "a demo user"}.`,
    });
    navigate(resolvedNextPath);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!identifier || !password) {
      toast({
        title: "Missing information",
        description: "Please enter your email or phone plus your password to continue.",
      });
      return;
    }

    if (!isSupabaseConfigured) {
      toast({
        title: "Sign-in unavailable",
        description:
          "Live authentication is disabled in this preview build. Use the guided demo to explore the app.",
      });
      startDemoSignIn();
      return;
    }

    const credentials = isLikelyPhone(identifier)
      ? { phone: identifier.trim(), password }
      : { email: identifier.trim(), password };

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword(credentials);

    if (error) {
      const normalizedMessage = error.message?.toLowerCase() ?? "";
      const isPhoneBlocked =
        normalizedMessage.includes("phone") ||
        normalizedMessage.includes("sms") ||
        normalizedMessage.includes("otp");

      // Determine if this is a configuration/availability issue vs. a credential issue
      const isServiceUnavailable =
        isPhoneBlocked ||
        normalizedMessage.includes("service") ||
        normalizedMessage.includes("unavailable") ||
        normalizedMessage.includes("disabled");

      toast({
        title: "Unable to sign in",
        description: isPhoneBlocked
          ? "Phone sign-ins are disabled in this preview. Please use email or try the demo."
          : error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });

      // Only auto-activate demo for service availability issues, NOT credential errors
      if (isServiceUnavailable && isPhoneBlocked) {
        console.log("Phone authentication unavailable, demo mode available as fallback");
      }
    } else {
      toast({
        title: "Welcome back!",
        description: "You are now signed in to Connective.",
      });
      navigate(resolvedNextPath);
    }

    setIsLoading(false);
  };

  const handleOAuth = async () => {
    if (!isSupabaseConfigured) {
      toast({
        title: "Live sign-in unavailable",
        description:
          "Google sign-in is disabled in this preview build. Please use email and password instead.",
      });
      return;
    }

    try {
      const redirectUrl = `${getSupabaseRedirectUrl("/auth/callback")}?next=${encodeURIComponent(resolvedNextPath)}`;
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            prompt: "select_account",
          },
        },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Please try again later.";
      toast({ title: "OAuth error", description: message });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f2ea] via-white to-[#f6e7d1] transition-[background] duration-500 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col-reverse gap-12 px-4 py-10 md:flex-row md:items-center md:gap-16 md:px-12">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1"
        >
          <div className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-sm shadow-sm backdrop-blur dark:bg-white/10">
            <Sparkles className="mr-2 h-4 w-4 text-[hsl(var(--highlight-text))]" />
            <span className="text-slate-900 dark:text-slate-100">
              Reconnect with your people
            </span>
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
            Welcome back to Connective
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground dark:text-slate-300">
            Continue the conversations, RSVP to new events, and keep building
            meaningful relationships designed for real life.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6">
            {featureHighlights.map((feature) => (
              <div
                key={feature}
                className="flex cursor-pointer items-start gap-3 rounded-2xl border border-black/5 bg-white/80 p-4 shadow-sm backdrop-blur transition-all hover:border-black/10 hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:hover:border-white/20"
                onClick={() => navigate("/signup")}
              >
                <div className="mt-1 h-2 w-2 rounded-full bg-[hsl(var(--highlight-text))]" />
                <p className="text-base text-slate-700 dark:text-slate-200">
                  {feature}
                </p>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex-1"
        >
          <div className="mx-auto w-full max-w-md rounded-3xl border border-black/5 bg-white/90 p-8 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-900/80">
            <div className="flex items-center gap-2 text-sm text-muted-foreground dark:text-slate-400">
              <BackButton
                fallbackPath="/"
                size="sm"
                className="gap-1 rounded-full px-3"
              >
                Back
              </BackButton>
            </div>

            <div className="mt-4">
              <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                Sign in to your account
              </h2>
              <p className="mt-1 text-sm text-muted-foreground dark:text-slate-400">
                New to Connective?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-[hsl(var(--highlight-text))] hover:underline"
                >
                  Create an account
                </Link>
              </p>
            </div>

            <div className="mt-6 grid gap-3">
              <Button
                variant="outline"
                className="h-12 gap-2 rounded-xl border-black/10 bg-white/90 text-slate-900 transition dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                onClick={handleOAuth}
              >
                <FcGoogle className="h-5 w-5" /> Continue with Google
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="h-12 gap-2 rounded-xl border border-black/5 bg-white/80 text-slate-900 shadow-sm transition hover:border-black/10 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-slate-100"
                onClick={startDemoSignIn}
              >
                Explore with demo access
              </Button>
            </div>

            <div className="my-6">
              <Separator className="bg-black/5 dark:bg-white/10" />
              <p className="mt-2 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground dark:text-slate-500">
                or sign in with email
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label
                  htmlFor="identifier"
                  className="text-sm font-medium text-slate-900 dark:text-slate-200"
                >
                  {identifierLabel}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-slate-400" />
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="you@example.com or +1 (555) 000-0000"
                    value={identifier}
                    onChange={(event) => setIdentifier(event.target.value)}
                    className="h-12 rounded-xl border-black/10 bg-white/60 pl-10 dark:border-white/10 dark:bg-white/10"
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-900 dark:text-slate-200"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground dark:text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-12 rounded-xl border-black/10 bg-white/60 pl-10 pr-12 dark:border-white/10 dark:bg-white/10"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted dark:text-slate-400 dark:hover:bg-white/10"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-[hsl(var(--highlight-text))] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default Login;
