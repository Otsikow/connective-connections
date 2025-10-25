import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ArrowLeft, Image as ImageIcon, Mail, Phone as PhoneIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

type Availability = {
  weekdayEvenings: boolean;
  weekendDays: boolean;
  weekendEvenings: boolean;
  weekdayMornings: boolean;
};

type OnboardingData = {
  email: string;
  phone: string;
  consentOver18: boolean;
  agreedToTerms: boolean;
  photoDataUrl?: string;
  name: string;
  age?: number;
  gender?: string;
  location: string;
  interests: string[];
  availability: Availability;
  lookingFor?: "coffee" | "activity" | "group";
  bio: string;
  verificationCode: string;
};

const INTEREST_OPTIONS = [
  "Hiking",
  "Coffee",
  "Photography",
  "Reading",
  "Music",
  "Fitness",
  "Tech",
  "Art",
  "Foodie",
  "Travel",
];

const TOTAL_STEPS = 5;

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
  ctx.drawImage(
    img,
    offsetX,
    offsetY,
    dimension,
    dimension,
    0,
    0,
    OUTPUT_SIZE,
    OUTPUT_SIZE,
  );
  return canvas.toDataURL("image/jpeg", 0.9);
}

function StepHeader({ step }: { step: number }) {
  const widthPercent = Math.round(((step - 1) / TOTAL_STEPS) * 100);
  const label = `Step ${step} of ${TOTAL_STEPS}`;
  return (
    <div className="mb-6">
      <p className="text-sm text-muted-foreground mb-2">{label}</p>
      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-[#E8B956] transition-all duration-300"
          style={{ width: `${Math.max(2, widthPercent)}%` }}
        />
      </div>
    </div>
  );
}

function Chip({
  selected,
  children,
  onClick,
}: {
  selected: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
        selected
          ? "bg-[#E8B956]/20 border-[#E8B956] text-foreground"
          : "bg-card border-border text-muted-foreground hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [authTab, setAuthTab] = useState<"email" | "phone">("email");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    email: "",
    phone: "",
    consentOver18: false,
    agreedToTerms: false,
    name: "",
    age: undefined,
    gender: undefined,
    location: "",
    interests: [],
    availability: {
      weekdayEvenings: false,
      weekendDays: false,
      weekendEvenings: false,
      weekdayMornings: false,
    },
    lookingFor: undefined,
    bio: "",
    verificationCode: "",
  });

  const canContinueFromAuth =
    data.consentOver18 &&
    data.agreedToTerms &&
    ((authTab === "email" && data.email) ||
      (authTab === "phone" && data.phone));

  const canFinish = Boolean(
    data.name &&
      data.age &&
      data.gender &&
      data.location &&
      data.photoDataUrl &&
      data.lookingFor,
  );

  async function handleSendCode() {
    if (!canContinueFromAuth) return;
    setIsSendingCode(true);
    try {
      if (authTab === "email") {
        await supabase.auth.signInWithOtp({
          email: data.email,
          options: { emailRedirectTo: window.location.origin },
        });
        toast({
          title: "Email sent",
          description: "Check your inbox for a verification code or link.",
        });
      } else {
        await supabase.auth.signInWithOtp({ phone: data.phone });
        toast({
          title: "SMS sent",
          description: "Check your phone for the verification code.",
        });
      }
      setStep(2);
    } catch (err) {
      toast({
        title: "Could not send code",
        description: "Please try again or choose another method.",
      });
    } finally {
      setIsSendingCode(false);
    }
  }

  async function handleOAuth(provider: "google" | "apple") {
    try {
      await supabase.auth.signInWithOAuth({ provider });
    } catch {
      toast({
        title: "OAuth failed",
        description: "Please try a different method.",
      });
    }
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const cropped = await autoSquareCropToDataUrl(file);
      setData((prev) => ({ ...prev, photoDataUrl: cropped }));
    } catch {
      toast({
        title: "Photo error",
        description: "Please choose a different image.",
      });
    } finally {
      setIsUploading(false);
    }
  }

  function next() {
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  }
  function back() {
    setStep((s) => Math.max(1, s - 1));
  }

  function finish() {
    navigate("/home");
  }

  return (
    <div className="min-h-screen bg-background px-4 sm:px-6 py-8">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => (step === 1 ? navigate(-1) : back())}
          className="mb-6 p-2 hover:bg-muted rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <h1 className="text-xl sm:text-2xl font-bold text-center mb-2">
          Let's Get You Set Up
        </h1>

        <StepHeader step={step} />

        {step === 1 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border p-4 bg-card">
              <Tabs
                value={authTab}
                onValueChange={(v) => setAuthTab(v as typeof authTab)}
              >
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger
                    value="email"
                    className="flex items-center gap-2"
                  >
                    <Mail size={16} /> Email
                  </TabsTrigger>
                  <TabsTrigger
                    value="phone"
                    className="flex items-center gap-2"
                  >
                    <PhoneIcon size={16} /> Phone
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="email" className="mt-4 space-y-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={data.email}
                    onChange={(e) =>
                      setData({ ...data, email: e.target.value })
                    }
                    className="h-12 rounded-xl bg-background"
                  />
                </TabsContent>
                <TabsContent value="phone" className="mt-4 space-y-3">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 555 123 4567"
                    value={data.phone}
                    onChange={(e) =>
                      setData({ ...data, phone: e.target.value })
                    }
                    className="h-12 rounded-xl bg-background"
                  />
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox
                id="over18"
                checked={data.consentOver18}
                onCheckedChange={(v) =>
                  setData({ ...data, consentOver18: Boolean(v) })
                }
              />
              <Label htmlFor="over18" className="text-sm">
                I'm over 18 and agree to the{" "}
                <a href="#" className="underline">
                  Terms
                </a>
                .
              </Label>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button
                disabled={!canContinueFromAuth || isSendingCode}
                onClick={handleSendCode}
                className="h-11 sm:h-12 rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal text-sm sm:text-base"
              >
                Continue
              </Button>
              <Button
                variant="outline"
                className="h-11 sm:h-12 rounded-full text-sm sm:text-base"
                onClick={() => handleOAuth("google")}
              >
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="h-11 sm:h-12 rounded-full text-sm sm:text-base"
                onClick={() => handleOAuth("apple")}
              >
                Continue with Apple
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-6">
              By continuing, you agree to our{" "}
              <a href="#" className="text-[#E8B956] underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-[#E8B956] underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        )}

        {/* Steps 2–5 omitted for brevity — same as your working version above */}

      </div>
    </div>
  );
};

export default Signup;
