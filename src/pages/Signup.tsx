import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  Mail,
  Phone as PhoneIcon,
  Image as ImageIcon,
  Apple,
} from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

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
    OUTPUT_SIZE
  );
  return canvas.toDataURL("image/jpeg", 0.9);
}

function StepHeader({ step }: { step: number }) {
  const widthPercent = Math.round(((step - 1) / TOTAL_STEPS) * 100);
  return (
    <div className="mb-6">
      <p className="text-sm text-muted-foreground mb-2">
        Step {step} of {TOTAL_STEPS}
      </p>
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
          : "bg-card border-border text-muted-foreground hover:bg-muted"
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
  const [showPassword, setShowPassword] = useState(false);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [data, setData] = useState({
    email: "",
    phone: "",
    password: "",
    consentOver18: false,
    agreedToTerms: false,
    name: "",
    age: "",
    gender: "",
    location: "",
    interests: [] as string[],
    photoDataUrl: "",
    bio: "",
  });

  const canContinue =
    data.consentOver18 &&
    data.agreedToTerms &&
    ((authTab === "email" && data.email) ||
      (authTab === "phone" && data.phone));

  const handleSendCode = async () => {
    if (!canContinue) return;
    setIsSendingCode(true);
    try {
      if (authTab === "email") {
        await supabase.auth.signInWithOtp({
          email: data.email,
          options: { emailRedirectTo: window.location.origin },
        });
        toast({
          title: "Email sent",
          description: "Check your inbox for a verification link.",
        });
      } else {
        await supabase.auth.signInWithOtp({ phone: data.phone });
        toast({
          title: "SMS sent",
          description: "Check your phone for the verification code.",
        });
      }
      setStep(2);
    } catch {
      toast({
        title: "Error",
        description: "Failed to send verification. Try again.",
      });
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleOAuth = async (provider: "google" | "apple") => {
    try {
      await supabase.auth.signInWithOAuth({ provider });
      navigate("/profile-setup");
    } catch {
      toast({
        title: "OAuth Error",
        description: "Please try again later.",
      });
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const cropped = await autoSquareCropToDataUrl(file);
      setData((prev) => ({ ...prev, photoDataUrl: cropped }));
    } catch {
      toast({
        title: "Photo upload failed",
        description: "Try a different image.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  function next() {
    setStep((s) => Math.min(TOTAL_STEPS, s + 1));
  }
  function back() {
    setStep((s) => Math.max(1, s - 1));
  }

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => (step === 1 ? navigate(-1) : back())}
          className="mb-6 p-2 hover:bg-muted rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
        <p className="text-center text-muted-foreground mb-6">
          Join Connective and start making real connections
        </p>

        <StepHeader step={step} />

        {step === 1 && (
          <>
            <Tabs
              value={authTab}
              onValueChange={(v) => setAuthTab(v as typeof authTab)}
            >
              <TabsList className="grid grid-cols-2 w-full mb-4">
                <TabsTrigger value="email">
                  <Mail size={16} className="mr-2" /> Email
                </TabsTrigger>
                <TabsTrigger value="phone">
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
                  onChange={(e) =>
                    setData({ ...data, email: e.target.value })
                  }
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
                  onChange={(e) =>
                    setData({ ...data, phone: e.target.value })
                  }
                  className="h-12 rounded-xl"
                />
              </TabsContent>
            </Tabs>

            <div className="mt-4 space-y-4">
              <Label htmlFor="password">Create Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                  className="h-12 pr-10 rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="terms"
                  checked={data.agreedToTerms}
                  onCheckedChange={(v) =>
                    setData({ ...data, agreedToTerms: Boolean(v) })
                  }
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <a href="#" className="underline text-[#E8B956]">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="#" className="underline text-[#E8B956]">
                    Privacy Policy
                  </a>
                  .
                </Label>
              </div>

              <Button
                onClick={handleSendCode}
                disabled={!canContinue || isSendingCode}
                className="w-full h-12 rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal"
              >
                Continue
              </Button>
            </div>

            <div className="mt-6 space-y-3">
              <Button
                variant="outline"
                className="w-full h-12 rounded-full"
                onClick={() => handleOAuth("google")}
              >
                <FcGoogle className="w-5 h-5 mr-2" />
                Continue with Google
              </Button>
              <Button
                variant="outline"
                className="w-full h-12 rounded-full"
                onClick={() => handleOAuth("apple")}
              >
                <Apple className="w-5 h-5 mr-2" />
                Continue with Apple
              </Button>
            </div>
          </>
        )}

        {step > 1 && (
          <div className="space-y-6 mt-8">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              placeholder="Enter your full name"
              className="h-12 rounded-xl"
            />

            <Label htmlFor="bio">About You</Label>
            <Textarea
              id="bio"
              value={data.bio}
              onChange={(e) => setData({ ...data, bio: e.target.value })}
              placeholder="Tell people about your interests..."
              className="rounded-xl"
            />

            <Label>Profile Photo</Label>
            <div className="flex items-center gap-3">
              {data.photoDataUrl && (
                <img
                  src={data.photoDataUrl}
                  alt="preview"
                  className="w-20 h-20 rounded-full object-cover"
                />
              )}
              <Button
                type="button"
                onClick={() =>
                  document.getElementById("photo-upload")?.click()
                }
                variant="outline"
                className="rounded-full"
                disabled={isUploading}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                {isUploading ? "Uploading..." : "Upload Photo"}
              </Button>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>

            <Button
              onClick={next}
              className="w-full h-12 rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal mt-8"
            >
              Continue
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;
