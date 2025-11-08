import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Check,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Upload,
  Plus,
  Tag,
  ShieldCheck,
  Loader2,
  Sparkles,
  Wand2,
  Palette,
  Megaphone,
  NotebookPen,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  COVER_STYLE_CONFIG,
  CoverStyle,
  generateEventCoverImage,
} from "@/lib/cover-generator";
import { motion } from "framer-motion";
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

type EventFormat = "in-person" | "virtual" | "hybrid";

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
  const [eventFormat, setEventFormat] = useState<EventFormat>("in-person");
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
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-8 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mx-auto flex w-full max-w-6xl flex-col gap-12"
      >
        <BackButton
          fallbackPath="/host-dashboard"
          className="w-fit gap-2 rounded-full bg-white/10 px-4 py-2 text-slate-200 shadow-sm backdrop-blur transition-colors"
        >
          Back
        </BackButton>

        <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div className="space-y-6">
            <Card className="border border-dashed border-primary/20 bg-card/80">
              <CardHeader>
                <CardTitle className="text-lg">Experience essentials</CardTitle>
                <CardDescription>
                  Name your gathering and outline the core details guests will see first.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Event title</Label>
                  <Input
                    id="title"
                    placeholder="Add an event title"
                    value={formData.title}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, title: event.target.value }))
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    Keep it short, descriptive, and clear so guests immediately understand the vibe.
                  </p>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, category: value }))
                      }
                    >
                      <SelectTrigger id="category" className="bg-background">
                        <SelectValue placeholder="Choose a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacity">Guest capacity</Label>
                    <Input
                      id="capacity"
                      type="number"
                      min="1"
                      value={formData.capacity}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, capacity: event.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Experience description</Label>
                  <Textarea
                    id="description"
                    placeholder="Tell guests about the transformation, flow, and special touches they can expect."
                    value={formData.description}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, description: event.target.value }))
                    }
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    Share the energy, outcomes, and any signature details. Aim for 2–3 short paragraphs.
                  </p>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="tag-input" className="flex items-center gap-2">
                    Discovery tags
                    <Badge variant="outline" className="text-[10px] uppercase">
                      optional
                    </Badge>
                  </Label>
                  <div className="flex flex-wrap items-center gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="group"
                        aria-label={`Remove tag ${tag}`}
                      >
                        <Badge
                          variant="secondary"
                          className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs capitalize group-hover:bg-destructive/10 group-hover:text-destructive"
                        >
                          <Tag className="h-3 w-3" />
                          {tag}
                        </Badge>
                      </button>
                    ))}
                    <Input
                      id="tag-input"
                      placeholder="Press enter to add"
                      value={tagInput}
                      onChange={(event) => setTagInput(event.target.value)}
                      onKeyDown={handleTagKeyDown}
                      className="w-full min-w-[12rem] flex-1 bg-background sm:w-60"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Add keywords like “immersive”, “mindful”, or “chef-led” to boost search and influence the cover art.
                  </p>
                </div>
              </CardContent>
            </Card>
             <Card className="border border-dashed border-primary/20 bg-card/80">
              <CardHeader>
                <CardTitle className="text-lg">Format & location</CardTitle>
                <CardDescription>
                  Tell guests how they&apos;ll join and where they need to be.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Experience format</Label>
                  <RadioGroup
                    value={eventFormat}
                    onValueChange={(value) => setEventFormat(value as EventFormat)}
                    className="grid gap-3 sm:grid-cols-3"
                  >
                    {[
                      { id: "in-person", label: "In person", description: "Guests meet at your venue" },
                      { id: "virtual", label: "Virtual", description: "Hosted entirely online" },
                      { id: "hybrid", label: "Hybrid", description: "Offer both options" },
                    ].map((option) => (
                      <label
                        key={option.id}
                        htmlFor={`format-${option.id}`}
                        className={cn(
                          "flex h-full cursor-pointer flex-col gap-2 rounded-2xl border bg-background/80 p-4 text-left transition-all",
                          eventFormat === option.id
                            ? "border-primary shadow-[0_0_0_1px_rgba(99,102,241,0.35)]"
                            : "border-border/60 hover:border-primary/40"
                        )}
                      >
                        <RadioGroupItem id={`format-${option.id}`} value={option.id} className="sr-only" />
                        <p className="text-sm font-semibold">{option.label}</p>
                        <p className="text-xs text-muted-foreground">{option.description}</p>
                      </label>
                    ))}
                  </RadioGroup>
                </div>

                {eventFormat !== "virtual" && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="venueName">Venue name</Label>
                      <Input
                        id="venueName"
                        placeholder="Loft, studio, or gathering space"
                        value={formData.venueName}
                        onChange={(event) =>
                          setFormData((prev) => ({ ...prev, venueName: event.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Street address</Label>
                      <Input
                        id="address"
                        placeholder="123 Connection Ave"
                        value={formData.address}
                        onChange={(event) =>
                          setFormData((prev) => ({ ...prev, address: event.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City or neighbourhood</Label>
                      <Input
                        id="city"
                        placeholder="Brooklyn, NY"
                        value={formData.city}
                        onChange={(event) =>
                          setFormData((prev) => ({ ...prev, city: event.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select
                        value={formData.timezone}
                        onValueChange={(value) =>
                          setFormData((prev) => ({ ...prev, timezone: value }))
                        }
                      >
                        <SelectTrigger id="timezone" className="bg-background">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timezoneOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}

                {eventFormat !== "in-person" && (
                  <div className="space-y-2">
                    <Label htmlFor="streamingLink">Streaming link</Label>
                    <Input
                      id="streamingLink"
                      placeholder="https://"
                      value={formData.streamingLink}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, streamingLink: event.target.value }))
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Share the access link you&apos;ll confirm in reminder emails.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="border border-dashed border-primary/20 bg-card/80">
              <CardHeader>
                <CardTitle className="text-lg">Schedule & investment</CardTitle>
                <CardDescription>
                  Lock in the timing and let guests know how to secure their spot.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start gap-2 bg-background",
                            !eventDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="h-4 w-4" />
                          {formattedDate}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={eventDate}
                          onSelect={setEventDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="start-time">Start time</Label>
                    <Input
                      id="start-time"
                      type="time"
                      value={formData.startTime}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, startTime: event.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-time">End time</Label>
                    <Input
                      id="end-time"
                      type="time"
                      value={formData.endTime}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, endTime: event.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="basePrice">Ticket price</Label>
                    <Input
                      id="basePrice"
                      type="number"
                      min="0"
                      value={formData.basePrice}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, basePrice: event.target.value }))
                      }
                      disabled={!isPaidEvent}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-background/80 p-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Paid experience</p>
                      <p className="text-xs text-muted-foreground">
                        Toggle off if you&apos;re hosting this one for free.
                      </p>
                    </div>
                    <Switch checked={isPaidEvent} onCheckedChange={setIsPaidEvent} />
                  </div>
                  <div className="flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-background/80 p-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">Collect a deposit</p>
                      <p className="text-xs text-muted-foreground">
                        Secure commitment and reduce no-shows.
                      </p>
                    </div>
                    <Switch
                      checked={requireDeposit}
                      onCheckedChange={setRequireDeposit}
                      disabled={!isPaidEvent}
                    />
                  </div>
                </div>

                {isPaidEvent && requireDeposit && (
                  <div className="space-y-2">
                    <Label htmlFor="deposit">Deposit amount</Label>
                    <Input
                      id="deposit"
                      type="number"
                      min="0"
                      value={formData.deposit}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, deposit: event.target.value }))
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Guests pay this upfront and settle the remainder before the event begins.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="border border-dashed border-primary/20 bg-card/80">
              <CardHeader>
                <CardTitle className="text-lg">Experience flow</CardTitle>
                <CardDescription>
                  Map the journey from arrivals to farewells so guests know what to expect.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {agendaItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <p className="text-sm font-semibold">Segment {index + 1}</p>
                        {agendaItems.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveAgendaItem(item.id)}
                            className="h-8 text-xs text-muted-foreground hover:text-destructive"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <div className="grid gap-4 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <Label htmlFor={`agenda-title-${item.id}`}>Title</Label>
                            <Input
                              id={`agenda-title-${item.id}`}
                              placeholder="Warm welcome, signature tasting, closing ritual"
                              value={item.title}
                              onChange={(event) =>
                                handleAgendaChange(item.id, "title", event.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`agenda-description-${item.id}`}>Description</Label>
                            <Textarea
                              id={`agenda-description-${item.id}`}
                              value={item.description}
                              onChange={(event) =>
                                handleAgendaChange(item.id, "description", event.target.value)
                              }
                              rows={3}
                            />
                          </div>
                        </div>
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`agenda-start-${item.id}`}>Start</Label>
                            <Input
                              id={`agenda-start-${item.id}`}
                              type="time"
                              value={item.startTime}
                              onChange={(event) =>
                                handleAgendaChange(item.id, "startTime", event.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`agenda-end-${item.id}`}>End</Label>
                            <Input
                              id={`agenda-end-${item.id}`}
                              type="time"
                              value={item.endTime}
                              onChange={(event) =>
                                handleAgendaChange(item.id, "endTime", event.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddAgendaItem}
                  className="w-full gap-2 border-dashed"
                >
                  <Plus className="h-4 w-4" /> Add another segment
                </Button>
              </CardContent>
            </Card>
            <Card className="border border-dashed border-primary/20 bg-card/80">
              <CardHeader>
                <CardTitle className="text-lg">Ticketing</CardTitle>
                <CardDescription>
                  Craft tiers that reflect the value of your experience.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!isPaidEvent && (
                  <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 p-4 text-sm text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200">
                    Guests will be able to RSVP for free. Turn on paid ticketing above to customise tiers.
                  </div>
                )}
                {isPaidEvent && (
                  <div className="space-y-4">
                    {ticketTiers.map((tier, index) => (
                      <div
                        key={tier.id}
                        className="rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <p className="text-sm font-semibold">Tier {index + 1}</p>
                          {ticketTiers.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveTicket(tier.id)}
                              className="h-8 text-xs text-muted-foreground hover:text-destructive"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor={`tier-name-${tier.id}`}>Name</Label>
                            <Input
                              id={`tier-name-${tier.id}`}
                              placeholder="General Admission"
                              value={tier.name}
                              onChange={(event) =>
                                handleTicketChange(tier.id, "name", event.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`tier-price-${tier.id}`}>Price</Label>
                            <Input
                              id={`tier-price-${tier.id}`}
                              type="number"
                              min="0"
                              value={tier.price}
                              onChange={(event) =>
                                handleTicketChange(tier.id, "price", event.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`tier-quantity-${tier.id}`}>Quantity</Label>
                            <Input
                              id={`tier-quantity-${tier.id}`}
                              type="number"
                              min="1"
                              value={tier.quantity}
                              onChange={(event) =>
                                handleTicketChange(tier.id, "quantity", event.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`tier-perks-${tier.id}`}>Perks</Label>
                            <Textarea
                              id={`tier-perks-${tier.id}`}
                              rows={3}
                              value={tier.perks}
                              onChange={(event) =>
                                handleTicketChange(tier.id, "perks", event.target.value)
                              }
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {isPaidEvent && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddTicketTier}
                    className="w-full gap-2 border-dashed"
                  >
                    <Plus className="h-4 w-4" /> Add ticket tier
                  </Button>
                )}
              </CardContent>
            </Card>
            <Card className="border border-dashed border-primary/20 bg-card/80">
              <CardHeader>
                <CardTitle className="text-lg">Host touchpoints</CardTitle>
                <CardDescription>
                  Make it easy for guests to reach you and keep your checklist handy.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="hostEmail">Contact email</Label>
                    <Input
                      id="hostEmail"
                      type="email"
                      placeholder="you@example.com"
                      value={formData.hostEmail}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, hostEmail: event.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hostPhone">Phone number</Label>
                    <Input
                      id="hostPhone"
                      placeholder="Optional backup contact"
                      value={formData.hostPhone}
                      onChange={(event) =>
                        setFormData((prev) => ({ ...prev, hostPhone: event.target.value }))
                      }
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checklistNotes">Arrival checklist</Label>
                  <Textarea
                    id="checklistNotes"
                    value={formData.checklistNotes}
                    onChange={(event) =>
                      setFormData((prev) => ({ ...prev, checklistNotes: event.target.value }))
                    }
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    We&apos;ll surface this in reminders so every guest feels confident and prepared.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Ready to share? You can publish now or save a draft and return anytime.
                </p>
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={isSavingDraft}
                  >
                    {isSavingDraft ? "Saving…" : "Save draft"}
                  </Button>
                  <Button type="button" onClick={handlePublish} disabled={isPublishing} className="gap-2">
                    {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    {isPublishing ? "Publishing" : "Publish experience"}
                  </Button>
                </div>
              </CardFooter>
            </Card>
        </div>
          <div className="space-y-6">
            <Card className="border border-dashed border-primary/30 bg-card/70">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Launch readiness</CardTitle>
                <CardDescription>Complete the steps below for the best guest conversion.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span>{readinessScore}% ready</span>
                    <span className="text-muted-foreground">{readinessChecklist.filter((item) => item.complete).length}/{readinessChecklist.length} done</span>
                  </div>
                  <Progress value={readinessScore} className="h-2" />
                </div>
                <ul className="space-y-3 text-sm">
                  {readinessChecklist.map((item) => (
                    <li key={item.label} className="flex items-start gap-3">
                      <div
                        className={cn(
                          "mt-0.5 h-2.5 w-2.5 rounded-full",
                          item.complete ? "bg-primary" : "bg-muted"
                        )}
                      />
                      <span className={cn(item.complete ? "text-foreground" : "text-muted-foreground")}>{item.label}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border border-border/60 bg-background/90 shadow-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-base font-semibold">Guest preview</CardTitle>
                <CardDescription>Here&apos;s how your experience is shaping up.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">{formData.title || "Add an event title"}</h2>
                  <p className="text-sm text-muted-foreground">
                    {formData.description
                      ? formData.description
                      : "Your description will appear here once you add it above."}
                  </p>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {formData.startTime} – {formData.endTime} {formData.timezone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {eventFormat === "virtual"
                        ? "Hosted online"
                        : [formData.venueName, formData.city].filter(Boolean).join(" • ") || "Add your venue details"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{formData.capacity} guests</span>
                  </div>
                  {isPaidEvent ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>
                        {primaryTicket
                          ? `${primaryTicket.price} per guest`
                          : `${formData.basePrice} per guest`}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Sparkles className="h-4 w-4" />
                      <span>Complimentary experience</span>
                    </div>
                  )}
                </div>
                {isPaidEvent && (
                  <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-xs text-primary">
                    Estimated revenue if you sell out: ${totalEstimatedRevenue.toLocaleString()}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border border-dashed border-primary/30 bg-card/70">
              <CardHeader>
                <CardTitle className="text-base font-semibold">Need inspiration?</CardTitle>
                <CardDescription>These quick wins help new hosts stand out.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Offer a sensory welcome ritual that sets the tone.</li>
                  <li>• Share a follow-up resource within 24 hours to keep momentum.</li>
                  <li>• Add a surprise moment to create a memorable story.</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </main>
  );
};


interface SnapshotItemProps {
  label: string;
  value: string;
}

const SnapshotItem = ({ label, value }: SnapshotItemProps) => {
  return (
    <div className="rounded-2xl border border-dashed border-[#e7d4bc] bg-white/70 p-4 transition-colors dark:border-white/10 dark:bg-slate-900/60">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#b58a57] transition-colors dark:text-amber-200">{label}</p>
      <p className="mt-1 text-sm text-[#604527] transition-colors dark:text-slate-300">{value}</p>
    </div>
  );
};

export default CreateEvent;
