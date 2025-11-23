import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Compass, HandHeart, Sparkles, Users } from "lucide-react";
import BackButton from "@/components/BackButton";
import { markOnboardingComplete } from "@/lib/onboarding";

const steps = [
  {
    id: "intent",
    title: "Welcome to Connective",
    subtitle: "Tell us what you want to get out of the community.",
    prompt: "What brings you to Connective?",
    options: [
      "Meet people nearby",
      "Find curated events",
      "Grow my network",
      "Learn from hosts",
    ],
  },
  {
    id: "comfort",
    title: "Make it feel personal",
    subtitle: "We tailor intros based on how you like to show up.",
    prompt: "How do you prefer to connect?",
    options: [
      "One-on-one conversations",
      "Small group hangs",
      "Workshops and learning",
      "Anything social",
    ],
  },
  {
    id: "confidence",
    title: "Set your pace",
    subtitle: "We'll guide you through a few curated steps before you dive in.",
    prompt: "What do you want from your first 30 days?",
    options: [
      "Attend my first event",
      "Get matched with people like me",
      "Host or co-host something",
      "Explore before deciding",
    ],
  },
];

const icons = [Compass, Users, HandHeart];

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  usePageTitle("Welcome to Connective");

  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isFinishing, setIsFinishing] = useState(false);

  const progress = useMemo(
    () => Math.round(((currentStep + 1) / steps.length) * 100),
    [currentStep],
  );

  const selectOption = (stepId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [stepId]: value }));
  };

  const goToNext = () => {
    if (!answers[steps[currentStep].id]) {
      toast({
        title: "Pick an option",
        description: "Choose the answer that best fits so we can tailor your experience.",
      });
      return;
    }

    if (currentStep === steps.length - 1) {
      setIsFinishing(true);
      markOnboardingComplete();
      toast({
        title: "You're all set",
        description: "Let's personalize your profile next.",
      });
      navigate("/profile-setup", { replace: true });
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goToPrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/80 to-primary/5 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <BackButton fallbackPath="/" onClick={currentStep === 0 ? undefined : goToPrevious} />
          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
            <Sparkles className="h-4 w-4 text-[hsl(var(--highlight-text))]" />
            Guided onboarding
          </div>
        </div>

        <Card className="overflow-hidden border border-border/60 shadow-xl">
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 px-6 py-6 sm:px-10">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-[hsl(var(--highlight-text))]">Step {currentStep + 1} of {steps.length}</p>
                <h1 className="text-2xl font-bold sm:text-3xl">{steps[currentStep].title}</h1>
                <p className="text-muted-foreground max-w-2xl">{steps[currentStep].subtitle}</p>
              </div>
              <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-background/80 shadow-inner">
                {(() => {
                  const Icon = icons[currentStep] ?? CheckCircle2;
                  return <Icon className="h-6 w-6 text-[hsl(var(--highlight-text))]" />;
                })()}
              </div>
            </div>

            <div className="mt-4">
              <Progress value={progress} className="h-2 overflow-hidden rounded-full" />
            </div>
          </div>

          <CardContent className="p-6 sm:p-10">
            <div className="space-y-8">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Guided question</p>
                <h2 className="mt-2 text-xl font-semibold text-foreground">{steps[currentStep].prompt}</h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {steps[currentStep].options.map((option) => {
                  const isSelected = answers[steps[currentStep].id] === option;
                  return (
                    <button
                      key={option}
                      className={`group flex w-full items-center justify-between rounded-2xl border px-4 py-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                        isSelected
                          ? "border-[hsl(var(--highlight-text))] bg-[hsl(var(--highlight-text))]/10"
                          : "border-border bg-card"
                      }`}
                      onClick={() => selectOption(steps[currentStep].id, option)}
                    >
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground">{option}</p>
                        <p className="text-xs text-muted-foreground">
                          {isSelected ? "Added to your onboarding plan" : "Tap to select"}
                        </p>
                      </div>
                      {isSelected && <Badge className="bg-[hsl(var(--highlight-text))] text-black">Selected</Badge>}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-[hsl(var(--highlight-text))]" />
                  You'll answer {steps.length} quick questions to unlock your tailored start.
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={goToPrevious} disabled={currentStep === 0 || isFinishing}>
                    Previous
                  </Button>
                  <Button onClick={goToNext} disabled={isFinishing}>
                    {currentStep === steps.length - 1 ? "Continue to profile" : "Next"}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <AnimatePresence>
          {Object.keys(answers).length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="mt-6 rounded-2xl border border-border/60 bg-card/60 p-4 text-sm text-muted-foreground"
            >
              We'll use your choices to curate your matches, introductions, and event suggestions from day one.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Onboarding;
