import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { motion } from "framer-motion";
import {
  Calendar as CalendarIcon,
  ArrowLeft,
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

  const [isPublishing, setIsPublishing] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [eventDate, setEventDate] = useState<Date | undefined>();
  const [eventFormat, setEventFormat] = useState<"in-person" | "virtual" | "hybrid">("in-person");
  const [requireDeposit, setRequireDeposit] = useState(true);
  const [isPaidEvent, setIsPaidEvent] = useState(true);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState("");

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
    checklistNotes: "Please arrive 10 minutes early to check in and settle in before we kick off!",
  });

  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([
    {
      id: createId(),
      title: "Welcome & Introductions",
      description: "Warm welcome, intention setting, and guided icebreaker to connect guests.",
      startTime: "18:00",
      endTime: "18:30",
    },
    {
      id: createId(),
      title: "Signature Experience",
      description: "Main activity hosted by you – workshop, tasting, or curated gathering.",
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
  }, [eventDate, formData.description, formData.hostEmail, formData.startTime, formData.title]);

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

    const reader = new FileReader();
    reader.onload = (e) => setCoverPreview(String(e.target?.result ?? null));
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const missing: string[] = [];
    if (!formData.title.trim()) missing.push("Event title");
    if (!eventDate) missing.push("Event date");
    if (!formData.startTime.trim()) missing.push("Start time");
    if (!formData.description.trim()) missing.push("Description");
    if (!formData.hostEmail.trim()) missing.push("Host contact email");
    if (eventFormat !== "virtual" && !formData.city.trim()) missing.push("City or neighborhood");
    if (eventFormat !== "in-person" && !formData.streamingLink.trim()) missing.push("Streaming link");

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
      complete: agendaItems.every((item) => item.title.trim() && item.description.trim()),
    },
    {
      label: "Ticketing set",
      complete: !isPaidEvent || ticketTiers.every((tier) => tier.name.trim() && tier.price.trim()),
    },
    {
      label: "Contact details added",
      complete: Boolean(formData.hostEmail.trim()),
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <button
              onClick={() => navigate(-1)}
              className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-sm transition-colors hover:bg-muted"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <h1 className="text-3xl font-bold tracking-tight">Create a Hosted Experience</h1>
            <p className="mt-2 max-w-2xl text-muted-foreground">
              Craft a memorable gathering, add your signature touches, and publish it for the right guests. We'll guide you through the essentials.
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

        <div className="grid gap-6 lg:grid-cols-[2fr,1.2fr]">
          <div className="space-y-6">
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-xl">Event essentials</CardTitle>
                <CardDescription>
                  Start with the foundational details that guests see first.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Event title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Sunset Sound Bath & Mindful Mixer"
                      value={formData.title}
                      onChange={(event) => setFormData({ ...formData, title: event.target.value })}
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe the vibe, what guests can expect, and what makes your event special."
                      value={formData.description}
                      onChange={(event) => setFormData({ ...formData, description: event.target.value })}
                      rows={5}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Tip: Lead with the outcome guests will feel, then outline the experience.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(event) => setFormData({ ...formData, category: event.target.value })}
                      className="h-12 w-full rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="" disabled>
                        Choose a category
                      </option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <Label>Experience tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs"
                        >
                          <Tag className="h-3 w-3" /> {tag}
                          <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            className="rounded-full p-0.5 transition-colors hover:bg-background"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                    <Input
                      value={tagInput}
                      onChange={(event) => setTagInput(event.target.value)}
                      onKeyDown={handleTagKeyDown}
                      placeholder="Add a tag and press Enter (e.g. women-led, limited seats)"
                      className="h-12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Cover image</Label>
                    <div className="flex flex-col gap-3 rounded-xl border border-dashed border-border/60 bg-muted/20 p-5 text-sm">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-inner">
                          <Upload className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">Upload a hero image</p>
                          <p className="text-xs text-muted-foreground">
                            High-resolution landscape photos perform best (1200×800px)
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between gap-3">
                        <Input type="file" accept="image/*" onChange={handleCoverUpload} className="h-12" />
                        {coverPreview && (
                          <img
                            src={coverPreview}
                            alt="Event preview"
                            className="h-16 w-24 rounded-lg object-cover shadow-sm"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-xl">Schedule & format</CardTitle>
                <CardDescription>Lock in when and how guests will join you.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "h-12 justify-start gap-2 text-left font-normal",
                            !eventDate && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="h-4 w-4" />
                          {formattedDate}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={eventDate} onSelect={setEventDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <select
                      id="timezone"
                      value={formData.timezone}
                      onChange={(event) => setFormData({ ...formData, timezone: event.target.value })}
                      className="h-12 w-full rounded-md border border-input bg-transparent px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {timezoneOptions.map((zone) => (
                        <option key={zone} value={zone}>
                          {zone}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start time *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(event) => setFormData({ ...formData, startTime: event.target.value })}
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">Wrap time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(event) => setFormData({ ...formData, endTime: event.target.value })}
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Format</Label>
                  <RadioGroup
                    value={eventFormat}
                    onValueChange={(value: "in-person" | "virtual" | "hybrid") => setEventFormat(value)}
                    className="grid gap-3 md:grid-cols-3"
                  >
                    {[
                      { value: "in-person", label: "In person", icon: MapPin },
                      { value: "virtual", label: "Virtual", icon: Globe },
                      { value: "hybrid", label: "Hybrid", icon: Users },
                    ].map((option) => (
                      <div key={option.value} className="relative">
                        <RadioGroupItem value={option.value} id={option.value} className="peer sr-only" />
                        <Label
                          htmlFor={option.value}
                          className="flex h-full cursor-pointer flex-col items-start gap-2 rounded-xl border border-border px-4 py-4 transition-all peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                        >
                          <option.icon className="h-5 w-5 text-primary" />
                          <span className="text-sm font-semibold">{option.label}</span>
                          <span className="text-xs text-muted-foreground">
                            {option.value === "in-person" && "Host guests at a physical location"}
                            {option.value === "virtual" && "Share a live streaming link with attendees"}
                            {option.value === "hybrid" && "Offer both in-person seats and virtual access"}
                          </span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {eventFormat !== "virtual" && (
                    <div className="space-y-2">
                      <Label htmlFor="city">City / Neighborhood *</Label>
                      <Input
                        id="city"
                        placeholder="e.g., Santa Monica, CA"
                        value={formData.city}
                        onChange={(event) => setFormData({ ...formData, city: event.target.value })}
                        className="h-12"
                      />
                    </div>
                  )}

                  {eventFormat !== "virtual" && (
                    <div className="space-y-2">
                      <Label htmlFor="venueName">Venue name</Label>
                      <Input
                        id="venueName"
                        placeholder="Your space or partner venue"
                        value={formData.venueName}
                        onChange={(event) => setFormData({ ...formData, venueName: event.target.value })}
                        className="h-12"
                      />
                    </div>
                  )}

                  {eventFormat !== "virtual" && (
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        placeholder="Street, Suite, Zip (hidden until guests book)"
                        value={formData.address}
                        onChange={(event) => setFormData({ ...formData, address: event.target.value })}
                        className="h-12"
                      />
                    </div>
                  )}

                  {eventFormat !== "in-person" && (
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="streamingLink">Streaming link *</Label>
                      <Input
                        id="streamingLink"
                        placeholder="e.g., Zoom, Google Meet, or custom portal"
                        value={formData.streamingLink}
                        onChange={(event) => setFormData({ ...formData, streamingLink: event.target.value })}
                        className="h-12"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-xl">Experience flow</CardTitle>
                <CardDescription>
                  Outline the touchpoints guests will move through. We'll share it on the event page.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {agendaItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    className="rounded-xl border border-border/60 bg-muted/10 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-semibold text-muted-foreground">
                        Segment {index + 1}
                      </p>
                      {agendaItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveAgendaItem(item.id)}
                          className="text-xs text-muted-foreground transition-colors hover:text-destructive"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <div className="mt-3 grid gap-3 md:grid-cols-[1fr,1fr]">
                      <div className="space-y-2">
                        <Label className="text-xs uppercase tracking-wide">Title</Label>
                        <Input
                          value={item.title}
                          onChange={(event) => handleAgendaChange(item.id, "title", event.target.value)}
                          placeholder="e.g., Welcome ritual"
                          className="h-11"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-wide">Start</Label>
                          <Input
                            type="time"
                            value={item.startTime}
                            onChange={(event) => handleAgendaChange(item.id, "startTime", event.target.value)}
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs uppercase tracking-wide">End</Label>
                          <Input
                            type="time"
                            value={item.endTime}
                            onChange={(event) => handleAgendaChange(item.id, "endTime", event.target.value)}
                            className="h-11"
                          />
                        </div>
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-xs uppercase tracking-wide">What happens</Label>
                        <Textarea
                          value={item.description}
                          onChange={(event) => handleAgendaChange(item.id, "description", event.target.value)}
                          placeholder="Share the guest experience for this block."
                          rows={3}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
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

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-xl">Ticketing & finances</CardTitle>
                <CardDescription>Decide how guests secure their spot.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/10 p-4">
                  <div>
                    <p className="font-semibold">Paid event</p>
                    <p className="text-sm text-muted-foreground">
                      Turn off to make this gathering free to attend.
                    </p>
                  </div>
                  <Switch checked={isPaidEvent} onCheckedChange={setIsPaidEvent} />
                </div>

                {isPaidEvent && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="basePrice">Base ticket price ($)</Label>
                      <Input
                        id="basePrice"
                        type="number"
                        min="0"
                        value={formData.basePrice}
                        onChange={(event) => setFormData({ ...formData, basePrice: event.target.value })}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Capacity *</Label>
                      <Input
                        id="capacity"
                        type="number"
                        min="1"
                        value={formData.capacity}
                        onChange={(event) => setFormData({ ...formData, capacity: event.target.value })}
                        className="h-12"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/10 p-4">
                  <div>
                    <p className="font-semibold">Collect deposit</p>
                    <p className="text-sm text-muted-foreground">
                      Secure commitment and reduce no-shows with a partial deposit.
                    </p>
                  </div>
                  <Switch checked={requireDeposit} onCheckedChange={setRequireDeposit} />
                </div>

                {requireDeposit && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="deposit">Deposit amount ($)</Label>
                      <Input
                        id="deposit"
                        type="number"
                        min="0"
                        value={formData.deposit}
                        onChange={(event) => setFormData({ ...formData, deposit: event.target.value })}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hostEmail">Host contact email *</Label>
                      <Input
                        id="hostEmail"
                        type="email"
                        placeholder="you@yourcollective.com"
                        value={formData.hostEmail}
                        onChange={(event) => setFormData({ ...formData, hostEmail: event.target.value })}
                        className="h-12"
                      />
                    </div>
                  </div>
                )}

                {!requireDeposit && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="hostEmail">Host contact email *</Label>
                      <Input
                        id="hostEmail"
                        type="email"
                        placeholder="you@yourcollective.com"
                        value={formData.hostEmail}
                        onChange={(event) => setFormData({ ...formData, hostEmail: event.target.value })}
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hostPhone">Contact phone</Label>
                      <Input
                        id="hostPhone"
                        type="tel"
                        placeholder="Optional for urgent guest updates"
                        value={formData.hostPhone}
                        onChange={(event) => setFormData({ ...formData, hostPhone: event.target.value })}
                        className="h-12"
                      />
                    </div>
                  </div>
                )}

                {isPaidEvent && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        Ticket tiers
                      </h3>
                      <Button type="button" variant="outline" size="sm" onClick={handleAddTicketTier} className="gap-2">
                        <Plus className="h-4 w-4" /> Add tier
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {ticketTiers.map((tier) => (
                        <div key={tier.id} className="rounded-xl border border-border/60 bg-muted/10 p-4">
                          <div className="grid gap-3 md:grid-cols-2">
                            <div className="space-y-2">
                              <Label className="text-xs uppercase tracking-wide">Tier name</Label>
                              <Input
                                value={tier.name}
                                onChange={(event) => handleTicketChange(tier.id, "name", event.target.value)}
                                className="h-11"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wide">Price ($)</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={tier.price}
                                  onChange={(event) => handleTicketChange(tier.id, "price", event.target.value)}
                                  className="h-11"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs uppercase tracking-wide">Quantity</Label>
                                <Input
                                  type="number"
                                  min="0"
                                  value={tier.quantity}
                                  onChange={(event) => handleTicketChange(tier.id, "quantity", event.target.value)}
                                  className="h-11"
                                />
                              </div>
                            </div>
                            <div className="md:col-span-2">
                              <Label className="text-xs uppercase tracking-wide">Perks</Label>
                              <Textarea
                                value={tier.perks}
                                onChange={(event) => handleTicketChange(tier.id, "perks", event.target.value)}
                                rows={2}
                              />
                            </div>
                          </div>
                          {ticketTiers.length > 1 && (
                            <div className="mt-3 flex justify-end">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveTicket(tier.id)}
                                className="text-muted-foreground hover:text-destructive"
                              >
                                Remove tier
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-xl">Host notes</CardTitle>
                <CardDescription>
                  Set expectations or share anything guests should prepare before arrival.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={formData.checklistNotes}
                  onChange={(event) => setFormData({ ...formData, checklistNotes: event.target.value })}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  We'll include this in booking confirmations so everyone shows up ready.
                </p>
              </CardContent>
            </Card>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                disabled={isSavingDraft}
                className="h-12 sm:min-w-[160px]"
              >
                {isSavingDraft ? "Saving..." : "Save draft"}
              </Button>
              <Button
                type="button"
                onClick={handlePublish}
                disabled={isPublishing}
                className="h-12 bg-primary text-primary-foreground hover:bg-primary/90 sm:min-w-[180px]"
              >
                {isPublishing ? "Publishing..." : "Publish event"}
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-xl">Live preview</CardTitle>
                <CardDescription>
                  This is what guests will see on your event page.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="overflow-hidden rounded-2xl border border-border/50 bg-muted/10">
                  <div className="relative h-48 w-full bg-gradient-to-br from-primary/40 to-primary">
                    {coverPreview ? (
                      <img src={coverPreview} alt="Preview" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-white/90">
                        <Upload className="h-6 w-6" />
                        <span className="text-sm font-medium">Your cover photo appears here</span>
                      </div>
                    )}
                    <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-background/80 px-3 py-1 text-xs font-medium">
                      <CalendarIcon className="h-3 w-3" />
                      {eventDate ? format(eventDate, "MMM d") : "TBD"}
                    </div>
                  </div>
                  <div className="space-y-3 p-5">
                    <div className="flex flex-wrap gap-2">
                      {formData.category && <Badge variant="secondary">{formData.category}</Badge>}
                      <Badge variant="outline" className="border-primary/40 text-primary">
                        {eventFormat === "in-person" && "In person"}
                        {eventFormat === "virtual" && "Virtual"}
                        {eventFormat === "hybrid" && "Hybrid"}
                      </Badge>
                    </div>
                    <h2 className="text-xl font-semibold">
                      {formData.title || "Name your hosted experience"}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-4">
                      {formData.description ||
                        "Paint a picture of the energy guests can expect and the transformation they'll leave with."}
                    </p>
                    <Separator />
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span>
                          {eventDate ? formattedDate : "Date coming soon"}
                          <br />
                          {formData.startTime ? `Starts ${formData.startTime}` : "Timing TBC"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>
                          {eventFormat === "virtual"
                            ? "Hosted online"
                            : formData.city || "Where will guests meet?"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span>{formData.capacity ? `${formData.capacity} seats` : "Set capacity"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-primary" />
                        <span>
                          {isPaidEvent
                            ? primaryTicket
                              ? `$${primaryTicket.price} per guest`
                              : formData.basePrice
                              ? `$${formData.basePrice}`
                              : "Price TBD"
                            : "Complimentary"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-muted/10 p-4">
                  <p className="text-sm font-semibold">What guests will experience</p>
                  <div className="mt-3 space-y-3 text-sm">
                    {agendaItems.map((item) => (
                      <div key={item.id} className="flex gap-3 rounded-lg bg-background/80 p-3">
                        <div className="flex h-10 w-10 flex-col items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {item.startTime ? item.startTime : "TBC"}
                        </div>
                        <div>
                          <p className="font-medium">{item.title || "Add a title"}</p>
                          <p className="text-muted-foreground">
                            {item.description || "Share a short description of this moment."}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-xl">Launch checklist</CardTitle>
                <CardDescription>You're {readinessScore}% ready to publish.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={readinessScore} className="h-2" />
                <div className="space-y-3">
                  {readinessChecklist.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/10 p-3"
                    >
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full",
                          item.complete ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                        )}
                      >
                        <Check className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        {!item.complete && (
                          <p className="text-xs text-muted-foreground">
                            {item.label === "Contact details added"
                              ? "Add an email so guests can reach you with questions."
                              : "Complete this section to build trust and clarity."}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-2 text-sm text-muted-foreground">
                <p>
                  {isPaidEvent
                    ? `Projected revenue: ~$${totalEstimatedRevenue.toLocaleString()} if all tiers sell out.`
                    : "Free experiences build loyalty — highlight what guests gain."}
                </p>
                {requireDeposit && (
                  <p>Deposits are charged upfront. Remaining balance is processed 24h before the event.</p>
                )}
              </CardFooter>
            </Card>

            <Card className="border-border/60 bg-primary/5">
              <CardContent className="space-y-3">
                <h3 className="text-lg font-semibold">Need a second set of eyes?</h3>
                <p className="text-sm text-muted-foreground">
                  Tap into the Connective host community for feedback on your listing and pricing.
                </p>
                <Button variant="secondary" className="gap-2">
                  <Users className="h-4 w-4" /> Share with community
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
