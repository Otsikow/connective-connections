import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    location: "",
  });

  // Onboarding consent gating
  const [consentOver18, setConsentOver18] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const canContinueFromAuth = consentOver18 && agreedToTerms;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canContinueFromAuth) return;
    // Navigate to home after signup
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="max-w-md mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 p-2 hover:bg-muted rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <h1 className="text-2xl font-bold text-center mb-2">Let's Get Started</h1>
        
        <div className="mb-6">
          <p className="text-sm text-muted-foreground mb-2">Step 1 of 4: Profile Basics</p>
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-[#E8B956] w-1/4 transition-all duration-300"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="fullName" className="text-foreground mb-2 block">Full Name</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="h-14 rounded-2xl bg-card border-border"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-foreground mb-2 block">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="h-14 rounded-2xl bg-card border-border"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-foreground mb-2 block">Create Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="h-14 rounded-2xl bg-card border-border pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-foreground mb-2 block">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="h-14 rounded-2xl bg-card border-border pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dateOfBirth" className="text-foreground mb-2 block">Date of Birth</Label>
              <Input
                id="dateOfBirth"
                type="text"
                placeholder="MM/DD/YYYY"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                className="h-14 rounded-2xl bg-card border-border"
              />
            </div>
            <div>
              <Label htmlFor="location" className="text-foreground mb-2 block">Location</Label>
              <Input
                id="location"
                type="text"
                placeholder="City, State"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="h-14 rounded-2xl bg-card border-border"
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Checkbox
                id="over18"
                checked={consentOver18}
                onCheckedChange={(checked) => setConsentOver18(checked === true)}
              />
              <Label htmlFor="over18" className="text-sm text-foreground">
                I am 18 years or older
              </Label>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="agree"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
              />
              <Label htmlFor="agree" className="text-sm text-foreground">
                I agree to the <a href="#" className="text-[#E8B956] underline">Terms of Service</a> and {" "}
                <a href="#" className="text-[#E8B956] underline">Privacy Policy</a>.
              </Label>
            </div>
          </div>

          <Button
            type="submit"
            disabled={!canContinueFromAuth}
            className="w-full h-14 text-lg font-semibold rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal shadow-md disabled:opacity-60 disabled:hover:bg-[#E8B956]"
          >
            Continue
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
