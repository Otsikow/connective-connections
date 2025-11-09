import { type MouseEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import {
  type LucideIcon,
  Camera,
  Upload,
  X,
  Check,
  User,
  MapPin,
  Heart,
  Calendar,
  Coffee,
  Users,
  ShieldCheck,
  IdCard,
  Mail
} from "lucide-react";
import { toast } from "sonner";
import BackButton from "@/components/BackButton";
import { usePageTitle } from "@/hooks/usePageTitle";

const INTEREST_OPTIONS = [
  "Sports",
  "Music",
  "Art",
  "Books",
  "Movies",
  "Gaming",
  "Cooking",
  "Travel",
  "Fitness",
  "Photography",
  "Hiking",
  "Dancing",
  "Yoga",
  "Technology",
  "Fashion",
  "Food",
  "Coffee",
  "Wine",
  "Beer",
  "Pets",
  "Nature",
  "Beach"
];

const LOOKING_FOR_OPTIONS = [
  { value: "1-to-1", label: "1-to-1 Coffee Chat", icon: Coffee },
  { value: "activity-buddy", label: "Activity Buddy", icon: User },
  { value: "group-hangout", label: "Group Hangout", icon: Users }
];

const AVAILABILITY_OPTIONS = [
  { value: "weekday-mornings", label: "Weekday Mornings" },
  { value: "weekday-afternoons", label: "Weekday Afternoons" },
  { value: "weekday-evenings", label: "Weekday Evenings" },
  { value: "weekend-mornings", label: "Weekend Mornings" },
  { value: "weekend-afternoons", label: "Weekend Afternoons" },
  { value: "weekend-evenings", label: "Weekend Evenings" }
];

type StepConfig = {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  content: () => JSX.Element;
  validate?: () => boolean;
};

type StepHeaderProps = {
  icon: LucideIcon;
  title: string;
  description: string;
};

const StepHeader = ({ icon: Icon, title, description }: StepHeaderProps) => (
  <div className="space-y-2 text-center">
    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#E8B956]/20">
      <Icon className="h-8 w-8 text-[#E8B956]" />
    </div>
    <h2 className="text-2xl font-bold">{title}</h2>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

type StepTimelineProps = {
  steps: StepConfig[];
  currentStepIndex: number;
};

const StepTimeline = ({ steps, currentStepIndex }: StepTimelineProps) => (
  <ol className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
    {steps.map((step, index) => {
      const isActive = index === currentStepIndex;
      const isComplete = index < currentStepIndex;
      return (
        <li key={step.id}>
          <div
            className={`rounded-2xl border px-4 py-3 transition-all ${
              isActive
                ? "border-[#E8B956] bg-[#E8B956]/10"
                : isComplete
                  ? "border-green-500/60 bg-green-500/10"
                  : "border-border"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold ${
                  isActive
                    ? "border-[#E8B956] bg-[#E8B956]/20 text-[#E8B956]"
                    : isComplete
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-border text-muted-foreground"
                }`}
              >
                {isComplete ? <Check className="h-5 w-5" /> : index + 1}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">{step.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {isComplete ? "Completed" : isActive ? "In progress" : "Up next"}
                </p>
              </div>
            </div>
          </div>
        </li>
      );
    })}
  </ol>
);

const ProfileSetup = () => {
  const navigate = useNavigate();
  usePageTitle("Complete Your Profile");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [basicInfo, setBasicInfo] = useState({
    name: "",
    age: "",
    gender: "",
    location: ""
  });
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [idPhoto, setIdPhoto] = useState<string | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<string | null>(null);
  const [emailVerified, setEmailVerified] = useState(false);

  const handlePhotoUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "id" | "selfie"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (type === "profile") setProfilePhoto(result);
        else if (type === "id") setIdPhoto(result);
        else if (type === "selfie") setSelfiePhoto(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else if (selectedInterests.length < 10) {
      setSelectedInterests([...selectedInterests, interest]);
    } else {
      toast.error("You can select up to 10 interests");
    }
  };

  const toggleAvailability = (time: string) => {
    if (availability.includes(time)) {
      setAvailability(availability.filter(a => a !== time));
    } else {
      setAvailability([...availability, time]);
    }
  };

  const toggleLookingFor = (option: string) => {
    if (lookingFor.includes(option)) {
      setLookingFor(lookingFor.filter(l => l !== option));
    } else {
      setLookingFor([...lookingFor, option]);
    }
  };

  const sendVerificationEmail = () => {
    toast.success("Verification email sent! Check your inbox.");
    setTimeout(() => {
      setEmailVerified(true);
    }, 2000);
  };

  const steps: StepConfig[] = [
    {
      id: "photo",
      title: "Add Your Photo",
      description: "Let others see the real you with a friendly, well-lit photo.",
      icon: Camera,
      validate: () => {
        if (!profilePhoto) {
          toast.error("Please upload a profile photo");
          return false;
        }
        return true;
      },
      content: () => (
        <div className="space-y-6">
          <div className="flex flex-col items-center">
            {profilePhoto ? (
              <div className="relative">
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="h-64 w-64 rounded-3xl object-cover shadow-lg"
                />
                <button
                  onClick={() => setProfilePhoto(null)}
                  className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white shadow hover:bg-red-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex h-64 w-64 flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed border-border bg-card text-center transition-colors hover:border-[#E8B956]"
              >
                <Upload className="h-12 w-12 text-muted-foreground" />
                <div className="px-4">
                  <p className="font-semibold">Upload Photo</p>
                  <p className="mt-1 text-sm text-muted-foreground">JPG, PNG (max 5MB)</p>
                </div>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={e => handlePhotoUpload(e, "profile")}
              className="hidden"
            />
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Pro tip:</strong> Photos with a smile and good lighting get 3x more connections!
            </p>
          </div>
        </div>
      )
    },
    {
      id: "basic-info",
      title: "Basic Information",
      description: "Share the essentials so we can personalise your experience.",
      icon: User,
      validate: () => {
        if (!basicInfo.name || !basicInfo.age || !basicInfo.gender || !basicInfo.location) {
          toast.error("Please fill in all basic information");
          return false;
        }
        return true;
      },
      content: () => (
        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your full name"
                value={basicInfo.name}
                onChange={e => setBasicInfo({ ...basicInfo, name: e.target.value })}
                className="h-14 rounded-2xl"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={basicInfo.age}
                  onChange={e => setBasicInfo({ ...basicInfo, age: e.target.value })}
                  className="h-14 rounded-2xl"
                />
              </div>
              <div>
                <Label>Gender</Label>
                <RadioGroup
                  value={basicInfo.gender}
                  onValueChange={value => setBasicInfo({ ...basicInfo, gender: value })}
                  className="mt-2 flex gap-2"
                >
                  <div className="flex-1">
                    <RadioGroupItem value="male" id="male" className="peer sr-only" />
                    <Label
                      htmlFor="male"
                      className="flex h-14 items-center justify-center rounded-2xl border-2 border-border transition-all peer-data-[state=checked]:border-[#E8B956] peer-data-[state=checked]:bg-[#E8B956]/10"
                    >
                      Male
                    </Label>
                  </div>
                  <div className="flex-1">
                    <RadioGroupItem value="female" id="female" className="peer sr-only" />
                    <Label
                      htmlFor="female"
                      className="flex h-14 items-center justify-center rounded-2xl border-2 border-border transition-all peer-data-[state=checked]:border-[#E8B956] peer-data-[state=checked]:bg-[#E8B956]/10"
                    >
                      Female
                    </Label>
                  </div>
                  <div className="flex-1">
                    <RadioGroupItem value="non-binary" id="non-binary" className="peer sr-only" />
                    <Label
                      htmlFor="non-binary"
                      className="flex h-14 items-center justify-center rounded-2xl border-2 border-border transition-all peer-data-[state=checked]:border-[#E8B956] peer-data-[state=checked]:bg-[#E8B956]/10"
                    >
                      Non-binary
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div>
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <Input
                id="location"
                placeholder="City, State"
                value={basicInfo.location}
                onChange={e => setBasicInfo({ ...basicInfo, location: e.target.value })}
                className="h-14 rounded-2xl"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">
              We use your details to surface the most relevant experiences near you.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "interests",
      title: "Your Interests",
      description: "Pick a few favourites so we know what sparks your curiosity (3–10).",
      icon: Heart,
      validate: () => {
        if (selectedInterests.length < 3) {
          toast.error("Please select at least 3 interests");
          return false;
        }
        return true;
      },
      content: () => (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map(interest => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <Badge
                  key={interest}
                  variant={isSelected ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 text-sm transition-colors ${
                    isSelected ? "bg-[#E8B956] text-black hover:bg-[#d9a840]" : "hover:border-[#E8B956]"
                  }`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                  {isSelected && <Check className="ml-1 h-4 w-4" />}
                </Badge>
              );
            })}
          </div>

          <div className="rounded-2xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">
              <strong>{selectedInterests.length}</strong> of 10 interests selected
            </p>
          </div>
        </div>
      )
    },
    {
      id: "availability",
      title: "Your Availability",
      description: "Tell us when you’re usually free to meet up or explore.",
      icon: Calendar,
      validate: () => {
        if (availability.length === 0) {
          toast.error("Please select at least one availability slot");
          return false;
        }
        return true;
      },
      content: () => (
        <div className="space-y-3">
          {AVAILABILITY_OPTIONS.map(option => {
            const isSelected = availability.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => toggleAvailability(option.value)}
                className={`flex h-14 w-full items-center justify-between rounded-2xl border-2 px-6 transition-all ${
                  isSelected ? "border-[#E8B956] bg-[#E8B956]/10" : "border-border hover:border-[#E8B956]/50"
                }`}
              >
                <span className="font-medium">{option.label}</span>
                {isSelected && <Check className="h-5 w-5 text-[#E8B956]" />}
              </button>
            );
          })}
        </div>
      )
    },
    {
      id: "looking-for",
      title: "What Are You Looking For?",
      description: "Share your vibe and what you hope to find in the community.",
      icon: Users,
      validate: () => {
        if (lookingFor.length === 0) {
          toast.error("Please select what you're looking for");
          return false;
        }
        if (!bio || bio.length < 20) {
          toast.error("Please write a bio (at least 20 characters)");
          return false;
        }
        return true;
      },
      content: () => (
        <div className="space-y-6">
          <div className="space-y-3">
            {LOOKING_FOR_OPTIONS.map(option => {
              const isSelected = lookingFor.includes(option.value);
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => toggleLookingFor(option.value)}
                  className={`flex h-16 w-full items-center gap-4 rounded-2xl border-2 px-6 transition-all ${
                    isSelected ? "border-[#E8B956] bg-[#E8B956]/10" : "border-border hover:border-[#E8B956]/50"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="flex-1 text-left font-medium">{option.label}</span>
                  {isSelected && <Check className="h-5 w-5 text-[#E8B956]" />}
                </button>
              );
            })}
          </div>

          <div>
            <Label htmlFor="bio">Tell us about yourself</Label>
            <Textarea
              id="bio"
              placeholder="Share a bit about yourself, your hobbies, what you're looking for in a friend... (minimum 20 characters)"
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="min-h-32 rounded-2xl resize-none"
              maxLength={500}
            />
            <p className="mt-2 text-right text-xs text-muted-foreground">{bio.length}/500 characters</p>
          </div>
        </div>
      )
    },
    {
      id: "verification",
      title: "Verify Your Account",
      description: "Help us keep Connective safe and trustworthy for everyone.",
      icon: ShieldCheck,
      content: () => (
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E8B956]/20">
                <Mail className="h-6 w-6 text-[#E8B956]" />
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-semibold">Email Verification</h3>
                <p className="mb-3 text-sm text-muted-foreground">Verify your email address to get started.</p>
                {emailVerified ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="h-5 w-5" />
                    <span className="font-medium">Verified</span>
                  </div>
                ) : (
                  <Button onClick={sendVerificationEmail} variant="outline" size="sm" className="rounded-full">
                    Send Verification Email
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E8B956]/20">
                <IdCard className="h-6 w-6 text-[#E8B956]" />
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="font-semibold">ID Verification</h3>
                  <Badge variant="secondary" className="text-xs">
                    Optional
                  </Badge>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">
                  Upload a photo of your government ID for added trust.
                </p>
                {idPhoto ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="h-5 w-5" />
                    <span className="font-medium">ID Uploaded</span>
                  </div>
                ) : (
                  <Button
                    onClick={() => document.getElementById("id-upload")?.click()}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                  >
                    Upload ID
                  </Button>
                )}
                <input
                  id="id-upload"
                  type="file"
                  accept="image/*"
                  onChange={e => handlePhotoUpload(e, "id")}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E8B956]/20">
                <Camera className="h-6 w-6 text-[#E8B956]" />
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="font-semibold">Selfie Verification</h3>
                  <Badge variant="secondary" className="text-xs">
                    Optional
                  </Badge>
                </div>
                <p className="mb-3 text-sm text-muted-foreground">Take a quick selfie to verify your identity.</p>
                {selfiePhoto ? (
                  <div className="flex items-center gap-2 text-green-600">
                    <Check className="h-5 w-5" />
                    <span className="font-medium">Selfie Taken</span>
                  </div>
                ) : (
                  <Button
                    onClick={() => document.getElementById("selfie-upload")?.click()}
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                  >
                    Take Selfie
                  </Button>
                )}
                <input
                  id="selfie-upload"
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={e => handlePhotoUpload(e, "selfie")}
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950/20 dark:text-blue-100">
            <strong>Privacy Note:</strong> Your verification data is encrypted and only used to ensure a safe community. It will never be shared publicly.
          </div>
        </div>
      )
    }
  ];

  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex];
  const progressPercentage = ((currentStepIndex + 1) / totalSteps) * 100;

  const goToPreviousStep = () => setCurrentStepIndex(step => Math.max(0, step - 1));

  const handleBackNavigation = () => {
    if (currentStepIndex === 0) {
      navigate("/signup");
    } else {
      goToPreviousStep();
    }
  };

  const handleBackButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
    if (currentStepIndex > 0) {
      event.preventDefault();
      goToPreviousStep();
    }
  };

  const handleNext = () => {
    if (currentStep.validate && !currentStep.validate()) {
      return;
    }

    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(step => Math.min(totalSteps - 1, step + 1));
    } else {
      toast.success("Profile setup complete!");
      navigate("/home");
    }
  };

  const handleSkip = () => {
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(step => Math.min(totalSteps - 1, step + 1));
    }
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-6 flex items-center justify-between">
          <BackButton
            fallbackPath="/signup"
            ariaLabel="Go back"
            onClick={handleBackButtonClick}
          />
          <span className="text-sm font-medium text-muted-foreground">
            Step {currentStepIndex + 1} of {totalSteps}
          </span>
        </div>

        <div className="mb-8">
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <StepTimeline steps={steps} currentStepIndex={currentStepIndex} />

        <div key={currentStep.id} className="space-y-8 animate-fade-in">
          <StepHeader
            icon={currentStep.icon}
            title={currentStep.title}
            description={currentStep.description}
          />
          {currentStep.content()}
        </div>

        <div className="mt-10 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Button
            variant="outline"
            onClick={handleBackNavigation}
            className="h-12 rounded-full sm:px-8"
          >
            {currentStepIndex === 0 ? "Back to sign up" : "Back"}
          </Button>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {currentStepIndex < totalSteps - 1 && (
              <Button
                onClick={handleSkip}
                variant="ghost"
                className="h-12 rounded-full text-muted-foreground sm:px-6"
              >
                Skip for now
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="h-12 rounded-full bg-[#E8B956] text-black shadow-md hover:bg-[#d9a840] sm:px-10"
            >
              {currentStepIndex === totalSteps - 1 ? "Complete Setup" : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
