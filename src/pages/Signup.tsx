import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Eye, EyeOff, Mail, Phone, Apple } from "lucide-react";
import { FcGoogle } from "react-icons/fc";

const Signup = () => {
  const navigate = useNavigate();
  const [authMethod, setAuthMethod] = useState<"email" | "phone" | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }
    // Navigate to profile setup after signup
    navigate("/profile-setup");
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    // In production, this would handle OAuth flow
    navigate("/profile-setup");
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

        <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
        <p className="text-center text-muted-foreground mb-8">
          Join Connective and start making real connections
        </p>

        {/* Social Login Options */}
        <div className="space-y-3 mb-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialLogin("google")}
            className="w-full h-14 rounded-full border-2 hover:bg-muted"
          >
            <FcGoogle className="w-6 h-6 mr-3" />
            <span className="font-semibold">Continue with Google</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={() => handleSocialLogin("apple")}
            className="w-full h-14 rounded-full border-2 hover:bg-muted"
          >
            <Apple className="w-6 h-6 mr-3" />
            <span className="font-semibold">Continue with Apple</span>
          </Button>
        </div>

        {/* Divider */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-background text-muted-foreground">Or sign up with</span>
          </div>
        </div>

        {/* Auth Method Selection */}
        {!authMethod && (
          <div className="space-y-3 mb-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => setAuthMethod("email")}
              className="w-full h-14 rounded-full border-2 hover:bg-muted"
            >
              <Mail className="w-5 h-5 mr-3" />
              <span className="font-semibold">Sign up with Email</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => setAuthMethod("phone")}
              className="w-full h-14 rounded-full border-2 hover:bg-muted"
            >
              <Phone className="w-5 h-5 mr-3" />
              <span className="font-semibold">Sign up with Phone</span>
            </Button>
          </div>
        )}

        {/* Email/Phone Form */}
        {authMethod && (
          <form onSubmit={handleSubmit} className="space-y-6">
            {authMethod === "email" && (
              <div>
                <Label htmlFor="email" className="text-foreground mb-2 block">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="h-14 rounded-2xl bg-card border-border"
                  required
                />
              </div>
            )}

            {authMethod === "phone" && (
              <div>
                <Label htmlFor="phone" className="text-foreground mb-2 block">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="h-14 rounded-2xl bg-card border-border"
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="password" className="text-foreground mb-2 block">Create Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password (min. 8 characters)"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="h-14 rounded-2xl bg-card border-border pr-12"
                  required
                  minLength={8}
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

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-3 py-4">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
                className="mt-1"
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                I'm over 18 and agree to the{" "}
                <a href="#" className="text-[#E8B956] underline font-medium">Terms of Service</a> and{" "}
                <a href="#" className="text-[#E8B956] underline font-medium">Privacy Policy</a>.
              </Label>
            </div>

            <Button
              type="submit"
              disabled={!agreedToTerms}
              className="w-full h-14 text-lg font-semibold rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => setAuthMethod(null)}
              className="w-full text-muted-foreground"
            >
              Choose different method
            </Button>
          </form>
        )}

        {/* Login Link */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          Already have an account?{" "}
          <a href="#" className="text-[#E8B956] font-semibold underline">Log in</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
