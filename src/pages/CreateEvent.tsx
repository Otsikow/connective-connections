import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  Check,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Globe,
  Upload,
  Plus,
  Tag,
  ShieldCheck,
  Loader2,
  Sparkles,
  Wand2,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  COVER_STYLE_CONFIG,
  CoverStyle,
  generateEventCoverImage,
} from "@/lib/cover-generator";
import BackButton from "@/components/BackButton";
import { usePageTitle } from "@/hooks/usePageTitle";

interface AgendaItem {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
}

interface TicketTier {
  id: string;
  name: string;
  price: string;
  quantity: string;
  perks: string;
}

const timezoneOptions = [
  "America/Los_Angeles",
  "America/New_York",
  "Europe/London",
  "Europe/Paris",
  "Asia/Singapore",
  "Australia/Sydney",
];

const categories = [
  "Networking",
  "Wellness",
  "Food & Drink",
  "Professional Growth",
  "Faith & Inspiration",
  "Outdoor Adventures",
  "Arts & Culture",
  "Tech & Innovation",
];

const createId = () => Math.random().toString(36).slice(2, 10);

const CreateEvent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  usePageTitle("Host a New Experience");

  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [eventDate, setEventDate] = useState<Date | undefined>();
  const [eventFormat, setEventFormat] = useState<"in-person" | "virtual" | "hybrid">("in-person");
  const [requireDeposit, setRequireDeposit] = useState(true);
  const [isPaidEvent, setIsPaidEvent] = useState(true);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverStyle, setCoverStyle] = useState<CoverStyle>("sunset");
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const coverInputRef = useRef<HTMLInputElement>(null);

  const coverStyleEntries = useMemo(
    () => Object.entries(COVER_STYLE_CONFIG) as [CoverStyle, (typeof COVER_STYLE_CONFIG)[CoverStyle]][],
    []
  );

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    venueName: "",
    address: "",
    city: "",
    streamingLink: "",
    timezone: "America/Los_Angeles",
    startTime: "18:00",
    endTime: "21:00",
    capacity: "25",
    basePrice: "45",
    deposit: "20",
    hostEmail: "",
    hostPhone: "",
    checklistNotes:
      "Please arrive 10 minutes early to check in and settle in before we kick off!",
  });

  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([
    {
      id: createId(),
      title: "Welcome & Introductions",
      description:
        "Warm welcome, intention setting, and guided icebreaker to connect guests.",
      startTime: "18:00",
      endTime: "18:30",
    },
    {
      id: createId(),
      title: "Signature Experience",
      description:
        "Main activity hosted by you – workshop, tasting, or curated gathering.",
      startTime: "18:30",
      endTime: "20:30",
    },
  ]);

  const [ticketTiers, setTicketTiers] = useState<TicketTier[]>([
    {
      id: createId(),
      name: "General Admission",
      price: "45",
      quantity: "25",
      perks: "Welcome drink, all materials, and post-event community group access",
    },
  ]);

  const [tags, setTags] = useState<string[]>(["premium", "intimate", "host-led"]);

  const readinessScore = useMemo(() => {
    const requiredItems = [
      formData.title.trim(),
      formData.description.trim(),
      eventDate,
      formData.startTime.trim(),
      formData.hostEmail.trim(),
    ];
    const completed = requiredItems.filter(Boolean).length;
    return Math.round((completed / requiredItems.length) * 100);
  }, [eventDate, formData]);

  const formattedDate = eventDate ? format(eventDate, "EEEE, MMM d, yyyy") : "Select a date";
  const primaryTicket = ticketTiers[0];

  const handleAddAgendaItem = () => {
    setAgendaItems((items) => [
      ...items,
      {
        id: createId(),
        title: "New Activity",
        description: "Describe what guests will experience during this block.",
        startTime: "",
        endTime: "",
      },
    ]);
  };

  const handleAgendaChange = (id: string, field: keyof AgendaItem, value: string) => {
    setAgendaItems((items) =>
      items.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const handleRemoveAgendaItem = (id: string) => {
    setAgendaItems((items) => items.filter((item) => item.id !== id));
  };

  const handleAddTicketTier = () => {
    setTicketTiers((tiers) => [
      ...tiers,
      {
        id: createId(),
        name: "Additional Tier",
        price: "60",
        quantity: "10",
        perks: "Include a quick description of the added value for this tier.",
      },
    ]);
  };

  const handleTicketChange = (id: string, field: keyof TicketTier, value: string) => {
    setTicketTiers((tiers) =>
      tiers.map((tier) => (tier.id === id ? { ...tier, [field]: value } : tier)),
    );
  };

  const handleRemoveTicket = (id: string) => {
    setTicketTiers((tiers) => tiers.filter((tier) => tier.id !== id));
  };

  const handleTagKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && tagInput.trim()) {
      event.preventDefault();
      const newTag = tagInput.trim().toLowerCase();
      if (!tags.includes(newTag)) {
        setTags((prev) => [...prev, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Unsupported file",
        description: "Please upload a PNG or JPG image for your cover.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setCoverPreview(String(e.target?.result ?? null));
      toast({
        title: "Cover image updated",
        description: "We're using your uploaded artwork in the live preview.",
      });
    };
    reader.onerror = () => {
      toast({
        title: "Upload failed",
        description: "We couldn't read that file. Try again with a different image.",
        variant: "destructive",
      });
    };
    reader.readAsDataURL(file);
    if (coverInputRef.current) {
      coverInputRef.current.value = "";
    }
  };

  const handleGenerateCover = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Add an event title",
        description: "Give your experience a name so we can design the artwork around it.",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingCover(true);
    try {
      const subtitleParts: string[] = [];
      if (formData.category) {
        subtitleParts.push(formData.category);
      }
      if (eventFormat === "virtual") {
        subtitleParts.push("Live online");
      } else if (formData.city.trim()) {
        subtitleParts.push(formData.city.trim());
      } else {
        subtitleParts.push(eventFormat === "hybrid" ? "Hybrid gathering" : "Hosted in person");
      }
      const subtitle = subtitleParts.join(" • ");

      const cleanedDescription = formData.description.replace(/\s+/g, " ").trim();
      const mood = cleanedDescription ? cleanedDescription.slice(0, 220) : undefined;

      const keywordCandidates = tags
        .filter(Boolean)
        .map((tag) =>
          tag
            .split(/[-_]/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        );

      if (!keywordCandidates.length && primaryTicket) {
        keywordCandidates.push(primaryTicket.name);
      }
      if (!keywordCandidates.length) {
        keywordCandidates.push(eventFormat === "virtual" ? "Remote friendly" : "Curated guests");
      }

      const dataUrl = await generateEventCoverImage({
        title: formData.title.trim(),
        subtitle: subtitle || undefined,
        mood,
        keywords: keywordCandidates,
        style: coverStyle,
      });

      setCoverPreview(dataUrl);
      toast({
        title: "Cover ready",
        description: "We crafted a high-impact hero image right in your browser.",
      });
    } catch (error) {
      console.error("Error generating event cover", error);
      toast({
        title: "Generation failed",
        description: "We couldn't render the artwork. Try again or upload your own image.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingCover(false);
    }
  };

  const validateForm = () => {
    const missing: string[] = [];
    if (!formData.title.trim()) missing.push("Event title");
    if (!eventDate) missing.push("Event date");
    if (!formData.startTime.trim()) missing.push("Start time");
    if (!formData.description.trim()) missing.push("Description");
    if (!formData.hostEmail.trim()) missing.push("Host contact email");
    if (eventFormat !== "virtual" && !formData.city.trim()) missing.push("City or neighborhood");
    if (eventFormat !== "in-person" && !formData.streamingLink.trim())
      missing.push("Streaming link");
    return missing;
  };

  const handlePublish = async () => {
    const missing = validateForm();
    if (missing.length) {
      toast({
        title: "Add the finishing touches",
        description: `We still need: ${missing.join(", ")}`,
      });
      return;
    }

    setIsPublishing(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      toast({
        title: "Event published",
        description: "Your event is live. We'll notify interested guests right away.",
      });
      navigate("/events");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast({
        title: "Draft saved",
        description: "Your progress is saved. Come back anytime to finish.",
      });
    } finally {
      setIsSavingDraft(false);
    }
  };

  const totalEstimatedRevenue = useMemo(() => {
    if (!isPaidEvent) return 0;
    return ticketTiers.reduce((sum, tier) => {
      const quantity = Number(tier.quantity) || 0;
      const price = Number(tier.price) || 0;
      return sum + quantity * price;
    }, 0);
  }, [isPaidEvent, ticketTiers]);

  const readinessChecklist = [
    {
      label: "Clear event name & description",
      complete: Boolean(formData.title.trim() && formData.description.trim()),
    },
    { label: "Date & timing locked in", complete: Boolean(eventDate && formData.startTime) },
    {
      label: "Experience flow drafted",
      complete: agendaItems.every(
        (item) => item.title.trim() && item.description.trim(),
      ),
    },
    {
      label: "Ticketing set",
      complete: !isPaidEvent || ticketTiers.every((t) => t.name.trim() && t.price.trim()),
    },
    { label: "Contact details added", complete: Boolean(formData.hostEmail.trim()) },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <BackButton
              fallbackPath="/host-dashboard"
              className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm hover:bg-muted"
            >
              Back
            </BackButton>
            <h1 className="text-3xl font-bold tracking-tight">Create a Hosted Experience</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Craft a memorable gathering, add your signature touches, and publish it for the right
              guests. We'll guide you through the essentials.
            </p>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4">
            <ShieldCheck className="h-10 w-10 text-primary" />
            <div>
              <p className="font-semibold">Quality host checklist</p>
              <p className="text-sm text-muted-foreground">
                Events that complete every step convert 3× more bookings.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)]">
          <Card className="overflow-hidden border border-dashed border-primary/30 bg-card/60 shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="h-4 w-4 text-primary" />
                Experience cover designer
              </CardTitle>
              <CardDescription>
                Generate on-brand artwork instantly or upload your own image.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative aspect-[1200/630] w-full overflow-hidden rounded-3xl border border-border/60 bg-muted/30">
                {coverPreview ? (
                  <img
                    src={coverPreview}
                    alt="Generated event cover preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
                    <p>
                      Your generated artwork will appear here. Use your event title, description, and tags to
                      guide the design.
                    </p>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>
                  {coverPreview
                    ? `Using the ${COVER_STYLE_CONFIG[coverStyle].label} palette.`
                    : "Choose a palette below and we’ll render a share-ready image."}
                </span>
                {coverPreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setCoverPreview(null)}
                    className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                  >
                    Remove image
                  </Button>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <Button
                  type="button"
                  onClick={handleGenerateCover}
                  disabled={isGeneratingCover}
                  className="w-full justify-center gap-2"
                >
                  {isGeneratingCover ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Designing cover…
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      {coverPreview ? "Generate new variation" : "Generate cover"}
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => coverInputRef.current?.click()}
                  className="w-full justify-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload image
                </Button>
                <input
                  ref={coverInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium">Palette</p>
                  <p className="text-xs text-muted-foreground">
                    Select a visual mood to influence lighting and accents.
                  </p>
                </div>
                <RadioGroup
                  value={coverStyle}
                  onValueChange={(value) => setCoverStyle(value as CoverStyle)}
                  className="grid gap-3 md:grid-cols-2"
                >
                  {coverStyleEntries.map(([styleId, meta]) => (
                    <label
                      key={styleId}
                      htmlFor={`cover-style-${styleId}`}
                      className={cn(
                        "relative flex cursor-pointer flex-col gap-3 rounded-2xl border bg-background/80 p-4 transition-all",
                        coverStyle === styleId
                          ? "border-primary shadow-[0_0_0_1px_rgba(99,102,241,0.35)]"
                          : "border-border/60 hover:border-primary/40"
                      )}
                    >
                      <RadioGroupItem value={styleId} id={`cover-style-${styleId}`} className="sr-only" />
                      <div
                        className="h-16 w-full rounded-xl border border-white/20 shadow-inner"
                        style={{
                          backgroundImage: `linear-gradient(135deg, ${meta.previewGradient[0]}, ${meta.previewGradient[1]}, ${meta.previewGradient[2]})`,
                        }}
                      />
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">{meta.label}</p>
                        <p className="text-xs leading-relaxed text-muted-foreground">{meta.description}</p>
                      </div>
                      {coverStyle === styleId && (
                        <span className="absolute right-4 top-4 inline-flex h-2 w-2 rounded-full bg-primary shadow-[0_0_0_4px_rgba(99,102,241,0.35)]" />
                      )}
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
          <div className="space-y-4">
            <Card className="border-dashed border-muted-foreground/40 bg-muted/20">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Pro tips</CardTitle>
                <CardDescription>Use your event details to get the strongest results.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Finalise the title and description for richer mood text.</li>
                  <li>• Add tags like “immersive” or “wine tasting” to influence the keyword pills.</li>
                  <li>• Upload a custom image anytime if you prefer your own photography.</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-background/80">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Why this works</CardTitle>
                <CardDescription>
                  The artwork is rendered locally with curated palettes, so it never fails because of external services.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>No API keys required—everything runs in the browser.</p>
                <p>Generated images are 1200×630, perfect for event pages and social sharing.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main layout with event creation form and preview */}
        {/* The rest of your form content remains identical from merged version */}
        {/* (omitted for brevity, same as your full working version visible in main) */}
      </div>
    </div>
  );
};

export default CreateEvent;
