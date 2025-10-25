import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Image as ImageIcon, Mail, Phone as PhoneIcon } from "lucide-react";
import BackButton from "@/components/BackButton";
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
  const OUTPUT_SIZE = 640; // nice balance of quality and size
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
        <div className="h-full bg-[#E8B956] transition-all duration-300" style={{ width: `${Math.max(2, widthPercent)}%` }} />
      </div>
    </div>
  );
}

function Chip({ selected, children, onClick }: { selected: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium border transition-colors",
        selected ? "bg-[#E8B956]/20 border-[#E8B956] text-foreground" : "bg-card border-border text-muted-foreground hover:bg-muted",
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

  const canContinueFromAuth = (data.consentOver18 && data.agreedToTerms) && ((authTab === "email" && data.email) || (authTab === "phone" && data.phone));
  const canFinish = Boolean(data.name && data.age && data.gender && data.location && data.photoDataUrl && data.lookingFor);

  async function handleSendCode() {
    if (!canContinueFromAuth) return;
    setIsSendingCode(true);
    try {
      if (authTab === "email") {
        await supabase.auth.signInWithOtp({ email: data.email, options: { emailRedirectTo: window.location.origin } });
        toast({ title: "Email sent", description: "Check your inbox for a verification code or link." });
      } else {
        await supabase.auth.signInWithOtp({ phone: data.phone });
        toast({ title: "SMS sent", description: "Check your phone for the verification code." });
      }
      setStep(2);
    } catch (err) {
      toast({ title: "Could not send code", description: "Please try again or choose another method." });
    } finally {
      setIsSendingCode(false);
    }
  }

  async function handleOAuth(provider: "google" | "apple") {
    try {
      await supabase.auth.signInWithOAuth({ provider });
    } catch {
      toast({ title: "OAuth failed", description: "Please try a different method." });
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
      toast({ title: "Photo error", description: "Please choose a different image." });
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

  async function finish() {
    // At this stage we'd persist to backend; for now navigate to home.
    navigate("/home");
  }

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="max-w-md mx-auto">
        <BackButton onBack={() => (step === 1 ? navigate(-1) : back())} className="mb-6" />

        <h1 className="text-2xl font-bold text-center mb-2">Let's Get You Set Up</h1>

        <StepHeader step={step} />

        {step === 1 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border p-4 bg-card">
              <Tabs value={authTab} onValueChange={(v) => setAuthTab(v as typeof authTab)}>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="email" className="flex items-center gap-2"><Mail size={16} /> Email</TabsTrigger>
                  <TabsTrigger value="phone" className="flex items-center gap-2"><PhoneIcon size={16} /> Phone</TabsTrigger>
                </TabsList>
                <TabsContent value="email" className="mt-4 space-y-3">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} className="h-12 rounded-xl bg-background" />
                </TabsContent>
                <TabsContent value="phone" className="mt-4 space-y-3">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" placeholder="+1 555 123 4567" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} className="h-12 rounded-xl bg-background" />
                </TabsContent>
              </Tabs>
            </div>

            <div className="flex items-center gap-3">
              <Checkbox id="over18" checked={data.consentOver18} onCheckedChange={(v) => setData({ ...data, consentOver18: Boolean(v) })} />
              <Label htmlFor="over18" className="text-sm">I'm over 18 and agree to the <a href="#" className="underline">Terms</a>.</Label>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <Button disabled={!canContinueFromAuth || isSendingCode} onClick={handleSendCode} className="h-12 rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal">Continue</Button>
              <Button variant="outline" className="h-12 rounded-full" onClick={() => handleOAuth("google")}>Continue with Google</Button>
              <Button variant="outline" className="h-12 rounded-full" onClick={() => handleOAuth("apple")}>Continue with Apple</Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border p-6 bg-card flex flex-col items-center">
              {data.photoDataUrl ? (
                <>
                  <img src={data.photoDataUrl} alt="Profile" className="w-48 h-48 rounded-2xl object-cover mb-4" />
                  <div className="grid grid-cols-2 gap-3 w-full">
                    <Button variant="outline" className="rounded-full" onClick={() => setData({ ...data, photoDataUrl: undefined })}>Retake</Button>
                    <Button className="rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal" onClick={next}>Use photo</Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-48 h-48 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mb-4">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <Label htmlFor="photo" className="sr-only">Upload photo</Label>
                  <Input id="photo" type="file" accept="image/*" onChange={handlePhotoChange} className="cursor-pointer" disabled={isUploading} />
                  <p className="text-xs text-muted-foreground mt-2 text-center">We auto-crop your photo to a centered square for a clean look.</p>
                </>
              )}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" type="text" placeholder="Your name" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} className="h-12 rounded-xl bg-background" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" min={18} placeholder="18" value={data.age?.toString() ?? ""} onChange={(e) => setData({ ...data, age: Number(e.target.value) || undefined })} className="h-12 rounded-xl bg-background" />
              </div>
              <div>
                <Label>Gender</Label>
                <Select value={data.gender} onValueChange={(v) => setData({ ...data, gender: v })}>
                  <SelectTrigger className="h-12 rounded-xl bg-background">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="nonbinary">Non-binary</SelectItem>
                    <SelectItem value="prefer_not">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" type="text" placeholder="City, State" value={data.location} onChange={(e) => setData({ ...data, location: e.target.value })} className="h-12 rounded-xl bg-background" />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" className="rounded-full" onClick={back}>Back</Button>
              <Button className="rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal" onClick={next}>Continue</Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="font-semibold mb-2">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => {
                  const selected = data.interests.includes(interest);
                  return (
                    <Chip
                      key={interest}
                      selected={selected}
                      onClick={() =>
                        setData((prev) => ({
                          ...prev,
                          interests: selected
                            ? prev.interests.filter((i) => i !== interest)
                            : [...prev.interests, interest],
                        }))
                      }
                    >
                      {interest}
                    </Chip>
                  );
                })}
              </div>
            </div>

            <div>
              <h2 className="font-semibold mb-2">Availability</h2>
              <div className="grid grid-cols-2 gap-3">
                <Chip selected={data.availability.weekdayMornings} onClick={() => setData((p) => ({ ...p, availability: { ...p.availability, weekdayMornings: !p.availability.weekdayMornings } }))}>Weekday mornings</Chip>
                <Chip selected={data.availability.weekdayEvenings} onClick={() => setData((p) => ({ ...p, availability: { ...p.availability, weekdayEvenings: !p.availability.weekdayEvenings } }))}>Weekday evenings</Chip>
                <Chip selected={data.availability.weekendDays} onClick={() => setData((p) => ({ ...p, availability: { ...p.availability, weekendDays: !p.availability.weekendDays } }))}>Weekend days</Chip>
                <Chip selected={data.availability.weekendEvenings} onClick={() => setData((p) => ({ ...p, availability: { ...p.availability, weekendEvenings: !p.availability.weekendEvenings } }))}>Weekend evenings</Chip>
              </div>
            </div>

            <div>
              <h2 className="font-semibold mb-2">Looking for</h2>
              <ToggleGroup type="single" value={data.lookingFor} onValueChange={(v) => setData({ ...data, lookingFor: v as OnboardingData["lookingFor"] })} className="flex gap-2">
                <ToggleGroupItem value="coffee" className="rounded-full">1-to-1 coffee</ToggleGroupItem>
                <ToggleGroupItem value="activity" className="rounded-full">Activity buddy</ToggleGroupItem>
                <ToggleGroupItem value="group" className="rounded-full">Group hangout</ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div>
              <Label htmlFor="bio">Short bio</Label>
              <Textarea id="bio" placeholder="Share a few lines about you..." value={data.bio} onChange={(e) => setData({ ...data, bio: e.target.value })} className="min-h-28 rounded-xl bg-background" />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" className="rounded-full" onClick={back}>Back</Button>
              <Button className="rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal" onClick={next}>Continue</Button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border p-6 bg-card">
              <h2 className="font-semibold mb-3">Verification</h2>
              {authTab === "email" ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">We sent a code to {data.email || "your email"}. Enter it below.</p>
                  <Input inputMode="numeric" pattern="[0-9]*" maxLength={6} placeholder="6-digit code" value={data.verificationCode} onChange={(e) => setData({ ...data, verificationCode: e.target.value })} className="h-12 rounded-xl bg-background" />
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={async () => { if (!data.email) return; await supabase.auth.signInWithOtp({ email: data.email }); toast({ title: "Code re-sent" }); }}>Resend code</Button>
                    <Button className="bg-[#E8B956] hover:bg-[#d9a840] text-charcoal" onClick={finish} disabled={!canFinish}>Finish</Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Enter the code we sent via SMS to {data.phone || "your phone"}.</p>
                  <Input inputMode="numeric" pattern="[0-9]*" maxLength={6} placeholder="6-digit code" value={data.verificationCode} onChange={(e) => setData({ ...data, verificationCode: e.target.value })} className="h-12 rounded-xl bg-background" />
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={async () => { if (!data.phone) return; await supabase.auth.signInWithOtp({ phone: data.phone }); toast({ title: "Code re-sent" }); }}>Resend code</Button>
                    <Button className="bg-[#E8B956] hover:bg-[#d9a840] text-charcoal" onClick={finish} disabled={!canFinish}>Finish</Button>
                  </div>
                </div>
              )}
              <div className="mt-6 border-t border-border pt-4 space-y-3">
                <p className="text-sm text-muted-foreground">Optional: Upload ID or a selfie for extra trust (local only).</p>
                <Input type="file" accept="image/*" />
              </div>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" className="rounded-full" onClick={back}>Back</Button>
              <Button className="rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal" onClick={finish} disabled={!canFinish}>Finish</Button>
            </div>
          </div>
        )}

        <p className="text-xs text-center text-muted-foreground mt-6">
          By continuing, you agree to our <a href="#" className="text-[#E8B956] underline">Terms of Service</a> and <a href="#" className="text-[#E8B956] underline">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
};

export default Signup;
