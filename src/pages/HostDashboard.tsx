import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Sparkles, CheckCircle, ArrowLeft } from "lucide-react";

const interestOptions = [
  "Food & Cooking",
  "Music & Art",
  "Networking",
  "Fitness & Wellness",
  "Travel & Culture",
  "Tech & Innovation",
  "Outdoor Adventures",
  "Faith & Inspiration",
  "Sports & Recreation",
  "Film & Media",
  "Literature & Writing",
  "Gaming & Esports",
  "Science & Research",
  "Entrepreneurship",
  "Finance & Investing",
  "Volunteering & Causes",
  "Parenting & Family",
  "Sustainability & Environment",
];

const Onboarding = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleNext = () => {
    if (step < totalSteps) setStep(step + 1);
    else navigate("/dashboard");
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Card className="w-full max-w-lg border-border/50 shadow-lg">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-3">
            <Users className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Welcome to Connective
          </CardTitle>
          <CardDescription>
            Let’s personalize your experience in just a few quick steps.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 p-6">
          <Progress value={progress} className="h-2 bg-muted" />

          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold">Tell us about yourself</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="city">City / Location</Label>
                  <Input
                    id="city"
                    placeholder="Where are you based?"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold">Select your interests</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Choose what you love. This helps us suggest better events.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {interestOptions.map((interest) => (
                  <Badge
                    key={interest}
                    variant={
                      selectedInterests.includes(interest)
                        ? "default"
                        : "outline"
                    }
                    onClick={() => handleInterestToggle(interest)}
                    className={`cursor-pointer px-3 py-2 text-center transition-all ${
                      selectedInterests.includes(interest)
                        ? "bg-primary text-white shadow-md"
                        : "hover:bg-muted"
                    }`}
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 text-center"
            >
              <div className="flex justify-center">
                <CheckCircle className="h-16 w-16 text-green-500 mb-3" />
              </div>
              <h3 className="text-lg font-semibold">
                You're all set, {fullName || "Friend"}!
              </h3>
              <p className="text-muted-foreground text-sm">
                You’re ready to explore events, meet people, and grow your
                network.
              </p>
            </motion.div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-4">
            {step > 1 ? (
              <Button
                variant="outline"
                onClick={handleBack}
                className="gap-2 rounded-full"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
            ) : (
              <div />
            )}

            <Button
              className="rounded-full gap-2 bg-primary text-white hover:bg-primary/80"
              onClick={handleNext}
            >
              {step === totalSteps ? (
                <>
                  <Sparkles className="h-4 w-4" /> Finish
                </>
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Onboarding;
