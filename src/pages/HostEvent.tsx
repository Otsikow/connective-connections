import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Calendar, CheckCircle2, Compass, MapPin, Sparkles, Users } from "lucide-react";
import BackButton from "@/components/BackButton";
import { usePageTitle } from "@/hooks/usePageTitle";

const vibeTags = [
  "Cozy", "High-Energy", "Thoughtful", "Hands-on", "Outdoors", "Wellness",
  "Networking", "Creative", "Growth", "Just for fun",
];

const HostEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  usePageTitle("Host Experience Blueprint");

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    category: "Social Mixer",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    capacity: 20,
    isFree: false,
    price: "35",
    supplies: "",
    highlights: "",
    agenda: "",
    vibeSelections: [] as string[],
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleToggleVibe = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      vibeSelections: prev.vibeSelections.includes(tag)
        ? prev.vibeSelections.filter((item) => item !== tag)
        : [...prev.vibeSelections, tag],
    }));
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    } else {
      navigate(-1);
    }
  };

  const handlePublish = () => {
    toast({
      title: "Event draft saved",
      description: "We’ll walk you through the final details once you submit.",
    });
    navigate("/host-dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 px-4 py-8 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto flex w-full max-w-4xl flex-col gap-6"
      >
        <div className="flex items-center justify-between">
          <BackButton
            fallbackPath="/host-dashboard"
            className="gap-2 text-muted-foreground"
            onClick={(event) => {
              if (step > 1) {
                event.preventDefault();
                handleBack();
              }
            }}
          >
            Back
          </BackButton>
          <Badge className="rounded-full bg-primary/10 text-primary">
            Host flow
          </Badge>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardHeader className="space-y-3">
            <CardTitle className="text-2xl font-bold">
              Craft your next gathering
            </CardTitle>
            <CardDescription>
              Share what makes your experience special. We’ll handle the logistics so you can focus on welcoming incredible people.
            </CardDescription>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Step {step} of {totalSteps}</span>
              <span>
                {[
                  "Experience basics",
                  "Logistics",
                  "Design the vibe",
                  "Review & publish",
                ][step - 1]}
              </span>
            </div>
          </CardHeader>

          <CardContent className="space-y-10">
            {step === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6"
              >
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="name">Event title</Label>
                    <Input
                      id="name"
                      placeholder="What should guests call this experience?"
                      value={formData.name}
                      onChange={(event) => handleInputChange("name", event.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input
                      id="tagline"
                      placeholder="One line that sets the tone"
                      value={formData.tagline}
                      onChange={(event) => handleInputChange("tagline", event.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="e.g. Social Mixer, Workshop"
                      value={formData.category}
                      onChange={(event) => handleInputChange("category", event.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity">Ideal group size</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min={4}
                      max={80}
                      value={formData.capacity}
                      onChange={(event) => handleInputChange("capacity", Number(event.target.value))}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Experience description</Label>
                  <Textarea
                    id="description"
                    placeholder="Share what guests can expect, from the welcome moment to the goodbye."
                    value={formData.description}
                    onChange={(event) => handleInputChange("description", event.target.value)}
                    rows={5}
                  />
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(event) => handleInputChange("date", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Neighborhood or venue</Label>
                    <Input
                      id="location"
                      placeholder="Where will everyone meet?"
                      value={formData.location}
                      onChange={(event) => handleInputChange("location", event.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="grid gap-2">
                    <Label htmlFor="startTime">Start time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(event) => handleInputChange("startTime", event.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="endTime">End time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(event) => handleInputChange("endTime", event.target.value)}
                    />
                  </div>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/40 p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold">Charge for this experience</p>
                      <p className="text-xs text-muted-foreground">
                        Earn for your time and prep. You control pricing and visibility.
                      </p>
                    </div>
                    <Switch
                      checked={!formData.isFree}
                      onCheckedChange={(checked) => handleInputChange("isFree", !checked)}
                    />
                  </div>
                  {!formData.isFree && (
                    <div className="mt-4 grid max-w-xs gap-2">
                      <Label htmlFor="price">Price per guest (USD)</Label>
                      <Input
                        id="price"
                        type="number"
                        min={0}
                        value={formData.price}
                        onChange={(event) => handleInputChange("price", event.target.value)}
                      />
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="supplies">Anything guests should bring?</Label>
                  <Textarea
                    id="supplies"
                    placeholder="List any materials, attire, or contributions that will make the gathering shine."
                    value={formData.supplies}
                    onChange={(event) => handleInputChange("supplies", event.target.value)}
                    rows={4}
                  />
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid gap-6"
              >
                <div className="grid gap-2">
                  <Label htmlFor="highlights">Experience highlights</Label>
                  <Textarea
                    id="highlights"
                    placeholder="Describe the moments guests will talk about afterwards."
                    value={formData.highlights}
                    onChange={(event) => handleInputChange("highlights", event.target.value)}
                    rows={4}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="agenda">Timeline</Label>
                  <Textarea
                    id="agenda"
                    placeholder="Break down the flow — arrivals, activities, transitions, and wrap-up."
                    value={formData.agenda}
                    onChange={(event) => handleInputChange("agenda", event.target.value)}
                    rows={4}
                  />
                </div>
                <div className="space-y-3">
                  <p className="text-sm font-semibold">Choose the vibe</p>
                  <div className="flex flex-wrap gap-2">
                    {vibeTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={
                          formData.vibeSelections.includes(tag) ? "default" : "outline"
                        }
                        className={`cursor-pointer rounded-full px-3 py-1 transition-colors ${
                          formData.vibeSelections.includes(tag)
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => handleToggleVibe(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">Preview your listing</h3>
                  <p className="text-sm text-muted-foreground">
                    This is what your guests will see on Connective.
                  </p>
                </div>
                <Card className="border-border/60 bg-card/80 shadow-sm">
                  <CardContent className="space-y-4 p-6">
                    <div className="space-y-1">
                      <h4 className="text-2xl font-semibold">{formData.name || "Your event title"}</h4>
                      <p className="text-muted-foreground">
                        {formData.tagline || "A short description that captures the energy."}
                      </p>
                    </div>
                    <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        {formData.date ? new Date(formData.date).toLocaleDateString() : "Date TBD"}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        {formData.location || "Location coming soon"}
                      </span>
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        Ideal for {formData.capacity} guests
                      </span>
                      <span className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-primary" />
                        {formData.category}
                      </span>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div>
                        <p className="font-semibold">What to expect</p>
                        <p className="text-muted-foreground">
                          {formData.description || "Describe the flow, format, and what makes this gathering unique."}
                        </p>
                      </div>
                      {formData.highlights && (
                        <div>
                          <p className="font-semibold">Highlights</p>
                          <p className="text-muted-foreground whitespace-pre-line">
                            {formData.highlights}
                          </p>
                        </div>
                      )}
                      {formData.agenda && (
                        <div>
                          <p className="font-semibold">Timeline</p>
                          <p className="text-muted-foreground whitespace-pre-line">
                            {formData.agenda}
                          </p>
                        </div>
                      )}
                      {formData.supplies && (
                        <div>
                          <p className="font-semibold">Guests should bring</p>
                          <p className="text-muted-foreground whitespace-pre-line">
                            {formData.supplies}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.vibeSelections.length > 0 ? (
                        formData.vibeSelections.map((tag) => (
                          <Badge key={tag} variant="secondary" className="rounded-full">
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <Badge variant="outline" className="rounded-full">
                          Pick vibe tags to help guests understand the experience
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                    <div className="space-y-1 text-sm">
                      <p className="font-semibold">Next up: finalize visibility</p>
                      <p className="text-muted-foreground">
                        After publishing, our host success team will review your listing to help it shine and match you with the right attendees.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </CardContent>

          <div className="flex items-center justify-between border-t border-border/60 bg-muted/40 px-6 py-4">
            <BackButton
              variant="ghost"
              className="text-muted-foreground"
              disabled={step === 1}
              onClick={(event) => {
                if (step > 1) {
                  event.preventDefault();
                  handleBack();
                }
              }}
            />
            {step < totalSteps ? (
              <Button className="rounded-full" onClick={handleNext}>
                Continue
              </Button>
            ) : (
              <Button className="gap-2 rounded-full" onClick={handlePublish}>
                Submit for review
                <Compass className="h-4 w-4" />
              </Button>
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default HostEvent;
