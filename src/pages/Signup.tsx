import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Mail,
  Phone as PhoneIcon,
  Eye,
  EyeOff,
  Image as ImageIcon,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useToast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  getSupabaseRedirectUrl,
  isSupabaseConfigured,
  supabase,
} from "@/integrations/supabase/client";
import BackButton from "@/components/BackButton";
import { cn } from "@/lib/utils";
import { resetOnboardingProgress } from "@/lib/onboarding";

const SIGNUP_STEPS = [
  {
    title: "Stay connected",
    description: "Choose the best way for us to reach you and get started in seconds.",
  },
  {
    title: "Secure your account",
    description: "Tell us who you are and create a strong password you'll remember.",
  },
  {
    title: "Personalize your profile",
    description: "Add a friendly touch so people know they've found the right you.",
  },
];

async function autoSquareCropToDataUrl(file: File): Promise<string> {
  const fileDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const imageEl = new Image();
    imageEl.onload = () => resolve(imageEl);
    imageEl.onerror = () => reject(new Error("Image failed to load"));
    imageEl.src = fileDataUrl;
  });

  const dimension = Math.min(img.naturalWidth, img.naturalHeight);
  const offsetX = (img.naturalWidth - dimension) / 2;
  const offsetY = (img.naturalHeight - dimension) / 2;

  const canvas = document.createElement("canvas");
  const OUTPUT_SIZE = 640;
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, offsetX, offsetY, dimension, dimension, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
  return canvas.toDataURL("image/jpeg", 0.9);
}

function StepHeader({ step }: { step: number }) {
  const stepIndex = Math.max(0, Math.min(SIGNUP_STEPS.length - 1, step - 1));
  const widthPercent = Math.round((step / SIGNUP_STEPS.length) * 100);

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-muted-foreground">
          Step {step} of {SIGNUP_STEPS.length}
        </p>
        <span className="text-sm font-semibold text-[hsl(var(--highlight-text))]">
          {SIGNUP_STEPS[stepIndex].title}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--accent)))] transition-all duration-300"
          style={{ width: `${Math.max(6, widthPercent)}%` }}
        />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        {SIGNUP_STEPS[stepIndex].description}
      </p>
    </div>
  );
}

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  usePageTitle("Create Your Connective Account");
  const [step, setStep] = useState(1);
  const [authTab, setAuthTab] = useState<"email" | "phone">("email");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [data, setData] = useState({
    email: "",
    phone: "",
    password: "",
    agreedToTerms: false,
    name: "",
    bio: "",
    photoDataUrl: "",
  });

  const locationState = location.state as { next?: string } | null;
  const nextPath =
    typeof locationState?.next === "string" && locationState.next.length > 0
      ? locationState.next
      : "/onboarding";

  const contactValue = authTab === "email" ? data.email.trim() : data.phone.trim();
  const passwordIsStrong = data.password.length >= 8;
  const canContinue =
    step === 1
      ? Boolean(contactValue)
      : step === 2
      ? Boolean(data.name.trim()) && passwordIsStrong
      : data.agreedToTerms;

  const goToNextStep = () => setStep((s) => Math.min(SIGNUP_STEPS.length, s + 1));
  const goToPreviousStep = () => setStep((s) => Math.max(1, s - 1));

  const handleCreateAccount = async () => {
    if (!data.agreedToTerms) {
      toast({
        title: "Agree to continue",
        description: "Please accept the terms to create your account.",
      });
      return;
    }

    if (!contactValue) {
      setStep(1);
      toast({ title: "Contact required", description: "Let us know how to reach you to continue." });
      return;
    }

    if (!data.name.trim() || !passwordIsStrong) {
      setStep(2);
      toast({ title: "Almost there", description: "Add your name and a strong password to continue." });
      return;
    }

    resetOnboardingProgress();

    if (!isSupabaseConfigured) {
      toast({
        title: "Account created",
        description: "We saved your details. Let's personalize things together.",
      });
      navigate(nextPath);
      return;
    }

    setIsSubmitting(true);
    try {
      const profileMetadata = {
        full_name: data.name.trim(),
        bio: data.bio.trim(),
        photoDataUrl: data.photoDataUrl || null,
      };

      if (authTab === "email") {
        const { data: signUpData, error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/profile-setup`,
            data: profileMetadata,
          },
        });

        if (error) throw error;

        toast({
          title: "Check your inbox",
          description:
            "We sent a confirmation link. Verify your email, then log in with your new password.",
        });

        navigate(nextPath);
      } else {
        const { data: signUpData, error } = await supabase.auth.signUp({
          phone: data.phone,
          password: data.password,
          options: {
            data: profileMetadata,
          },
        });

        if (error) throw error;

        toast({
          title: "Verify your phone",
          description: "Enter the code we just texted you, then sign in with your password.",
        });

        navigate(nextPath);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Signup failed",
        description: "We couldn't create your account just yet. Try again in a moment.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOAuth = async () => {
    if (!isSupabaseConfigured) {
      toast({
        title: "Live sign-up unavailable",
        description:
          "Google sign-up is disabled in this preview build. Please create an account with email instead.",
      });
      return;
    }

    try {
      const redirectUrl = `${getSupabaseRedirectUrl("/auth/callback")}?next=${encodeURIComponent(
        "/onboarding",
      )}`;
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          queryParams: { prompt: "select_account" },
        },
      });
    } catch (error) {
      const description =
        error instanceof Error ? error.message : "Please try again later.";
      toast({ title: "OAuth Error", description });
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const cropped = await autoSquareCropToDataUrl(file);
      setData((prev) => ({ ...prev, photoDataUrl: cropped }));
      toast({ title: "Photo updated", description: "Looking great!" });
    } catch (error) {
      console.error(error);
      toast({ title: "Photo upload failed", description: "Try a different image." });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 px-4 sm:px-6 py-10 flex items-center justify-center">
      <div className="w-full max-w-xl">
        <BackButton
          fallbackPath="/"
          className="mb-6"
          onClick={(event) => {
            if (step > 1) {
              event.preventDefault();
              goToPreviousStep();
            }
          }}
        />

        <motion.div
          className="bg-card border border-border/50 rounded-3xl shadow-lg p-6 sm:p-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Your Connective Account</h1>
            <p className="text-muted-foreground">
              Join a community built on meaningful, real-world connections.
            </p>
          </div>

          <StepHeader step={step} />

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <Tabs value={authTab} onValueChange={(v) => setAuthTab(v as typeof authTab)}>
                  <TabsList className="grid grid-cols-2 w-full mb-6 rounded-full bg-muted/60 p-1">
                    <TabsTrigger value="email" className="rounded-full">
                      <Mail size={16} className="mr-2" /> Email
                    </TabsTrigger>
                    <TabsTrigger value="phone" className="rounded-full">
                      <PhoneIcon size={16} className="mr-2" /> Phone
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="email" className="space-y-3">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={data.email}
                      onChange={(e) => setData({ ...data, email: e.target.value })}
                      className="h-12 rounded-xl"
                    />
                  </TabsContent>

                  <TabsContent value="phone" className="space-y-3">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 555 123 4567"
                      value={data.phone}
                      onChange={(e) => setData({ ...data, phone: e.target.value })}
                      className="h-12 rounded-xl"
                    />
                  </TabsContent>
                </Tabs>

                <Button
                  onClick={goToNextStep}
                  disabled={!canContinue}
                  className="w-full"
                >
                  Continue
                </Button>

                <div className="space-y-3 pt-2">
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-full"
                    onClick={handleOAuth}
                  >
                    <FcGoogle className="w-5 h-5 mr-2" />
                    Continue with Google
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="password">Create Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="At least 8 characters"
                      value={data.password}
                      onChange={(e) => setData({ ...data, password: e.target.value })}
                      className="h-12 pr-12 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p
                    className={cn(
                      "text-sm",
                      passwordIsStrong ? "text-emerald-600" : "text-muted-foreground"
                    )}
                  >
                    {passwordIsStrong
                      ? "Strong password"
                      : "Use at least 8 characters for a secure password."}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <Button variant="outline" className="flex-1 h-12 rounded-full" onClick={goToPreviousStep}>
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={goToNextStep}
                    disabled={!canContinue}
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-6"
              >
                <div className="space-y-3">
                  <Label htmlFor="bio">Short Bio</Label>
                  <Textarea
                    id="bio"
                    value={data.bio}
                    onChange={(e) => setData({ ...data, bio: e.target.value })}
                    placeholder="Share a few interests or what you're looking for..."
                    className="rounded-xl"
                    rows={4}
                  />
                </div>

                <div className="space-y-3">
                  <Label>Profile Photo</Label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {data.photoDataUrl ? (
                      <img
                        src={data.photoDataUrl}
                        alt="Preview"
                        className="w-24 h-24 rounded-full object-cover shadow-md"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                    <div className="space-y-2">
                      <Button
                        type="button"
                        onClick={() => document.getElementById("photo-upload")?.click()}
                        variant="outline"
                        className="rounded-full"
                        disabled={isUploading}
                      >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        {isUploading
                          ? "Uploading..."
                          : data.photoDataUrl
                          ? "Change photo"
                          : "Upload photo"}
                      </Button>
                      <p className="text-xs text-muted-foreground">
                        Square photos look best. We'll crop it for you automatically.
                      </p>
                    </div>
                  </div>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>

                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={data.agreedToTerms}
                    onCheckedChange={(v) => setData({ ...data, agreedToTerms: Boolean(v) })}
                  />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-[hsl(var(--highlight-text))] font-medium underline-offset-4 hover:underline"
                    >
                      Terms
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-[hsl(var(--highlight-text))] font-medium underline-offset-4 hover:underline"
                    >
                      Privacy Policy
                    </a>
                    .
                  </Label>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Button variant="outline" className="h-12 rounded-full" onClick={goToPreviousStep}>
                    Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleCreateAccount}
                    disabled={!canContinue || isSubmitting}
                  >
                    {isSubmitting ? "Creating account..." : "Create account"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-center text-sm text-muted-foreground mt-10">
            Already have an account?{" "}
            <button
              onClick={() =>
                navigate("/login", {
                  state: { next: nextPath },
                })
              }
              className="text-[hsl(var(--highlight-text))] font-medium hover:underline"
            >
              Log in
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;
