import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Sparkles } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Separator } from "@/components/ui/separator";

const featureHighlights = [
  "Curated in-person events",
  "AI-powered match suggestions",
  "Private messaging and group chats",
];

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both your email and password to continue.",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast({
        title: "Unable to sign in",
        description: error.message ?? "Check your credentials and try again.",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You are now signed in to Connective.",
      });
      navigate("/home");
    }

    setIsLoading(false);
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    try {
      await supabase.auth.signInWithOAuth({ provider });
      navigate("/home");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Please try again later.";
      toast({ title: "OAuth error", description: message });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f2ea] via-white to-[#f6e7d1]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col-reverse gap-12 px-4 py-10 md:flex-row md:items-center md:gap-16 md:px-12">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1"
        >
          <div className="inline-flex items-center rounded-full bg-white/80 px-3 py-1 text-sm shadow-sm">
            <Sparkles className="mr-2 h-4 w-4 text-[#E8B956]" />
            Reconnect with your people
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Welcome back to Connective
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Continue the conversations, RSVP to new events, and keep building
            meaningful relationships designed for real life.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6">
            {featureHighlights.map((feature) => (
              <div
                key={feature}
                className="flex items-start gap-3 rounded-2xl border border-black/5 bg-white/80 p-4 shadow-sm backdrop-blur"
              >
                <div className="mt-1 h-2 w-2 rounded-full bg-[#E8B956]" />
                <p className="text-base text-slate-700">{feature}</p>
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
          <div className="mx-auto w-full max-w-md rounded-3xl border border-black/5 bg-white/90 p-8 shadow-xl backdrop-blur">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-1 rounded-full px-3 py-1 transition-colors hover:bg-muted"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            </div>

            <div className="mt-4">
              <h2 className="text-2xl font-semibold">Sign in to your account</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                New to Connective? {" "}
                <Link to="/signup" className="font-medium text-[#E8B956] hover:underline">
                  Create an account
                </Link>
              </p>
            </div>

            <div className="mt-6 grid gap-3">
              <Button
                variant="outline"
                className="h-12 gap-2 rounded-xl border-black/10"
                onClick={() => handleOAuth("google")}
              >
                <FcGoogle className="h-5 w-5" /> Continue with Google
              </Button>
              <Button
                variant="outline"
                className="h-12 gap-2 rounded-xl border-black/10"
                onClick={() => handleOAuth("apple")}
              >
                <FaApple className="h-5 w-5" /> Continue with Apple
              </Button>
            </div>

            <div className="my-6">
              <Separator className="bg-black/5" />
              <p className="mt-2 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
                or sign in with email
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="h-12 rounded-xl border-black/10 pl-10"
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-12 rounded-xl border-black/10 pl-10 pr-12"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="text-muted-foreground">
                  <input type="checkbox" className="mr-2" /> Keep me signed in
                </label>
                <Link to="/forgot-password" className="font-medium text-[#E8B956] hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button
                type="submit"
                className="h-12 w-full rounded-xl bg-[#E8B956] text-base font-semibold text-black hover:bg-[#d8a74c]"
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
