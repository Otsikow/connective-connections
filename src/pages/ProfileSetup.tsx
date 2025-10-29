import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
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
  "Sports", "Music", "Art", "Books", "Movies", "Gaming", 
  "Cooking", "Travel", "Fitness", "Photography", "Hiking",
  "Dancing", "Yoga", "Technology", "Fashion", "Food",
  "Coffee", "Wine", "Beer", "Pets", "Nature", "Beach"
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

const ProfileSetup = () => {
  const navigate = useNavigate();
  usePageTitle("Complete Your Profile");
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Step 1: Photo
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  
  // Step 2: Basic Info
  const [basicInfo, setBasicInfo] = useState({
    name: "",
    age: "",
    gender: "",
    location: ""
  });
  
  // Step 3: Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  
  // Step 4: Availability
  const [availability, setAvailability] = useState<string[]>([]);
  
  // Step 5: Looking For & Bio
  const [lookingFor, setLookingFor] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  
  // Step 6: Verification
  const [verificationMethod, setVerificationMethod] = useState("");
  const [idPhoto, setIdPhoto] = useState<string | null>(null);
  const [selfiePhoto, setSelfiePhoto] = useState<string | null>(null);
  const [emailVerified, setEmailVerified] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "profile" | "id" | "selfie") => {
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

  const handleNext = () => {
    // Validation logic
    if (currentStep === 1 && !profilePhoto) {
      toast.error("Please upload a profile photo");
      return;
    }
    if (currentStep === 2) {
      if (!basicInfo.name || !basicInfo.age || !basicInfo.gender || !basicInfo.location) {
        toast.error("Please fill in all basic information");
        return;
      }
    }
    if (currentStep === 3 && selectedInterests.length < 3) {
      toast.error("Please select at least 3 interests");
      return;
    }
    if (currentStep === 4 && availability.length === 0) {
      toast.error("Please select at least one availability slot");
      return;
    }
    if (currentStep === 5) {
      if (lookingFor.length === 0) {
        toast.error("Please select what you're looking for");
        return;
      }
      if (!bio || bio.length < 20) {
        toast.error("Please write a bio (at least 20 characters)");
        return;
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete setup
      toast.success("Profile setup complete!");
      navigate("/home");
    }
  };

  const sendVerificationEmail = () => {
    // Simulate email verification
    toast.success("Verification email sent! Check your inbox.");
    setTimeout(() => {
      setEmailVerified(true);
    }, 2000);
  };

  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <BackButton
            fallbackPath="/signup"
            ariaLabel="Go back"
            onClick={(event) => {
              if (currentStep > 1) {
                event.preventDefault();
                setCurrentStep((step) => Math.max(1, step - 1));
              }
            }}
          />
          <span className="text-sm font-medium text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Step 1: Profile Photo */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8B956]/20 mb-4">
                <Camera className="w-8 h-8 text-[#E8B956]" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Add Your Photo</h2>
              <p className="text-muted-foreground">
                Let others see the real you! A clear face photo works best.
              </p>
            </div>

            <div className="flex flex-col items-center">
              {profilePhoto ? (
                <div className="relative">
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="w-64 h-64 rounded-3xl object-cover shadow-lg"
                  />
                  <button
                    onClick={() => setProfilePhoto(null)}
                    className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-64 h-64 rounded-3xl border-2 border-dashed border-border hover:border-[#E8B956] transition-colors flex flex-col items-center justify-center gap-4 bg-card"
                >
                  <Upload className="w-12 h-12 text-muted-foreground" />
                  <div className="text-center px-4">
                    <p className="font-semibold">Upload Photo</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      JPG, PNG (max 5MB)
                    </p>
                  </div>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handlePhotoUpload(e, "profile")}
                className="hidden"
              />
            </div>

            <div className="bg-card rounded-2xl p-4 border border-border">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Pro tip:</strong> Photos with a smile and good lighting get 3x more connections!
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Basic Info */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8B956]/20 mb-4">
                <User className="w-8 h-8 text-[#E8B956]" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
              <p className="text-muted-foreground">
                Help others get to know you better
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={basicInfo.name}
                  onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                  className="h-14 rounded-2xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    placeholder="25"
                    value={basicInfo.age}
                    onChange={(e) => setBasicInfo({ ...basicInfo, age: e.target.value })}
                    className="h-14 rounded-2xl"
                  />
                </div>
                <div>
                  <Label>Gender</Label>
                  <RadioGroup
                    value={basicInfo.gender}
                    onValueChange={(value) => setBasicInfo({ ...basicInfo, gender: value })}
                    className="flex gap-2 mt-2"
                  >
                    <div className="flex-1">
                      <RadioGroupItem value="male" id="male" className="peer sr-only" />
                      <Label
                        htmlFor="male"
                        className="flex h-14 items-center justify-center rounded-2xl border-2 border-border peer-data-[state=checked]:border-[#E8B956] peer-data-[state=checked]:bg-[#E8B956]/10 cursor-pointer transition-all"
                      >
                        Male
                      </Label>
                    </div>
                    <div className="flex-1">
                      <RadioGroupItem value="female" id="female" className="peer sr-only" />
                      <Label
                        htmlFor="female"
                        className="flex h-14 items-center justify-center rounded-2xl border-2 border-border peer-data-[state=checked]:border-[#E8B956] peer-data-[state=checked]:bg-[#E8B956]/10 cursor-pointer transition-all"
                      >
                        Female
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div>
                <Label htmlFor="location" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="City, State"
                  value={basicInfo.location}
                  onChange={(e) => setBasicInfo({ ...basicInfo, location: e.target.value })}
                  className="h-14 rounded-2xl"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Interests */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8B956]/20 mb-4">
                <Heart className="w-8 h-8 text-[#E8B956]" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your Interests</h2>
              <p className="text-muted-foreground">
                Select at least 3 (up to 10) interests
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {INTEREST_OPTIONS.map((interest) => {
                const isSelected = selectedInterests.includes(interest);
                return (
                  <Badge
                    key={interest}
                    variant={isSelected ? "default" : "outline"}
                    className={`cursor-pointer px-4 py-2 text-sm ${
                      isSelected
                        ? "bg-[#E8B956] text-black hover:bg-[#d9a840]"
                        : "hover:border-[#E8B956]"
                    }`}
                    onClick={() => toggleInterest(interest)}
                  >
                    {interest}
                    {isSelected && <Check className="w-4 h-4 ml-1" />}
                  </Badge>
                );
              })}
            </div>

            <div className="bg-card rounded-2xl p-4 border border-border">
              <p className="text-sm">
                <strong>{selectedInterests.length}</strong> of 10 interests selected
              </p>
            </div>
          </div>
        )}

        {/* Step 4: Availability */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8B956]/20 mb-4">
                <Calendar className="w-8 h-8 text-[#E8B956]" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your Availability</h2>
              <p className="text-muted-foreground">
                When are you usually free to hang out?
              </p>
            </div>

            <div className="space-y-3">
              {AVAILABILITY_OPTIONS.map((option) => {
                const isSelected = availability.includes(option.value);
                return (
                  <button
                    key={option.value}
                    onClick={() => toggleAvailability(option.value)}
                    className={`w-full h-14 rounded-2xl border-2 flex items-center justify-between px-6 transition-all ${
                      isSelected
                        ? "border-[#E8B956] bg-[#E8B956]/10"
                        : "border-border hover:border-[#E8B956]/50"
                    }`}
                  >
                    <span className="font-medium">{option.label}</span>
                    {isSelected && (
                      <Check className="w-5 h-5 text-[#E8B956]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Looking For & Bio */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8B956]/20 mb-4">
                <Users className="w-8 h-8 text-[#E8B956]" />
              </div>
              <h2 className="text-2xl font-bold mb-2">What Are You Looking For?</h2>
              <p className="text-muted-foreground">
                Select all that apply
              </p>
            </div>

            <div className="space-y-3">
              {LOOKING_FOR_OPTIONS.map((option) => {
                const isSelected = lookingFor.includes(option.value);
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => toggleLookingFor(option.value)}
                    className={`w-full h-16 rounded-2xl border-2 flex items-center gap-4 px-6 transition-all ${
                      isSelected
                        ? "border-[#E8B956] bg-[#E8B956]/10"
                        : "border-border hover:border-[#E8B956]/50"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="font-medium flex-1 text-left">{option.label}</span>
                    {isSelected && (
                      <Check className="w-5 h-5 text-[#E8B956]" />
                    )}
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
                onChange={(e) => setBio(e.target.value)}
                className="min-h-32 rounded-2xl resize-none"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground mt-2 text-right">
                {bio.length}/500 characters
              </p>
            </div>
          </div>
        )}

        {/* Step 6: Verification */}
        {currentStep === 6 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#E8B956]/20 mb-4">
                <ShieldCheck className="w-8 h-8 text-[#E8B956]" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Verify Your Account</h2>
              <p className="text-muted-foreground">
                Help us keep Connective safe and trustworthy
              </p>
            </div>

            <div className="space-y-4">
              {/* Email Verification */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#E8B956]/20 flex items-center justify-center">
                      <Mail className="w-6 h-6 text-[#E8B956]" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Email Verification</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Verify your email address to get started
                    </p>
                    {emailVerified ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <Check className="w-5 h-5" />
                        <span className="font-medium">Verified</span>
                      </div>
                    ) : (
                      <Button
                        onClick={sendVerificationEmail}
                        variant="outline"
                        size="sm"
                        className="rounded-full"
                      >
                        Send Verification Email
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* ID Verification (Optional) */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#E8B956]/20 flex items-center justify-center">
                      <IdCard className="w-6 h-6 text-[#E8B956]" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">ID Verification</h3>
                      <Badge variant="secondary" className="text-xs">Optional</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Upload a photo of your government ID for added trust
                    </p>
                    {idPhoto ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <Check className="w-5 h-5" />
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
                      onChange={(e) => handlePhotoUpload(e, "id")}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Selfie Verification (Optional) */}
              <div className="bg-card rounded-2xl p-6 border border-border">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-[#E8B956]/20 flex items-center justify-center">
                      <Camera className="w-6 h-6 text-[#E8B956]" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">Selfie Verification</h3>
                      <Badge variant="secondary" className="text-xs">Optional</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Take a quick selfie to verify your identity
                    </p>
                    {selfiePhoto ? (
                      <div className="flex items-center gap-2 text-green-600">
                        <Check className="w-5 h-5" />
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
                      onChange={(e) => handlePhotoUpload(e, "selfie")}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 rounded-2xl p-4 border border-blue-200 dark:border-blue-900">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Privacy Note:</strong> Your verification data is encrypted and only used to ensure a safe community. It will never be shared publicly.
              </p>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="mt-8 space-y-4">
          <Button
            onClick={handleNext}
            className="w-full h-14 text-lg font-semibold rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-black shadow-md"
          >
            {currentStep === totalSteps ? "Complete Setup" : "Continue"}
          </Button>

          {currentStep < totalSteps && (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              variant="ghost"
              className="w-full text-muted-foreground"
            >
              Skip for now
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;
