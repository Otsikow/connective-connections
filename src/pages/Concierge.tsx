import { useMemo, useState } from "react";
import {
  CalendarCheck2,
  Check,
  Coffee,
  MessageSquare,
  Send,
  Sparkles,
  Timer,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BackButton from "@/components/BackButton";
import { Separator } from "@/components/ui/separator";
import { usePageTitle } from "@/hooks/usePageTitle";
import { cn } from "@/lib/utils";

interface ConciergeMessage {
  id: string;
  sender: "user" | "concierge" | "system";
  text: string;
  meta?: string;
}

const starterMessages: ConciergeMessage[] = [
  {
    id: "welcome",
    sender: "concierge",
    text: "I’m your Friendship Concierge. Tell me who you want to meet and I’ll handle matches, invites, and logistics.",
    meta: "Available now • Response in under 1 minute",
  },
  {
    id: "intent-1",
    sender: "user",
    text: "I want someone to go to church with",
  },
  {
    id: "reply-1",
    sender: "concierge",
    text:
      "I’ll pair you with two members who already attend St. Brigid on Sundays. I can set a meetup at 9:30 AM near the side entrance and confirm introductions over coffee after service.",
    meta: "Matches reserved • Need your confirmation to send invites",
  },
];

const quickPrompts = [
  "I want a new friend for gym",
  "Connect me with 2 people for coffee today",
  "Help me meet people in Manchester",
  "Help me build friendships as an introvert",
  "Plan a board game night this weekend",
];

const recommendedPairs = [
  {
    name: "Maya Patel",
    focus: "Strength training buddy",
    proximity: "0.6 mi away",
    note: "Prefers mornings; brings structured plan",
  },
  {
    name: "Jordan Rivers",
    focus: "Weekend socials and chill hangs",
    proximity: "1.1 mi away",
    note: "Open to small groups; calm energy",
  },
  {
    name: "Elena Ruiz",
    focus: "Coffee + creative sessions",
    proximity: "Downtown · 15 min tram",
    note: "Hosts a rotating café crawl",
  },
];

const meetupOptions = [
  { title: "Coffee today", detail: "3:30–5:00 PM · River & Rye Café", type: "invite" },
  { title: "Saturday gym intro", detail: "10:00 AM · Movement Lab", type: "plan" },
  { title: "Sunday community", detail: "9:30 AM · St. Brigid side entrance", type: "invite" },
];

const followUps = [
  {
    title: "Send intros",
    detail: "Warm intros drafted for Maya + Jordan",
    status: "queued",
  },
  {
    title: "Book venue",
    detail: "Holding a quiet corner at River & Rye until 2:45 PM",
    status: "active",
  },
  {
    title: "Confirm availability",
    detail: "Checking 6 candidate matches for tonight",
    status: "active",
  },
];

const avatarUrl = (seed: string) =>
  `https://api.dicebear.com/7.x/shapes/svg?seed=${encodeURIComponent(seed)}&backgroundColor=0f172a`;

const buildConciergeResponse = (prompt: string) => {
  const lowered = prompt.toLowerCase();
  const actionable = [] as string[];

  if (lowered.includes("gym")) {
    actionable.push("Pairing you with two gym partners who share your schedule.");
  }
  if (lowered.includes("coffee")) {
    actionable.push("I’ll hold a table at River & Rye and send intros in one message.");
  }
  if (lowered.includes("church")) {
    actionable.push("Coordinating a pre-service meetup and shared seats so you’re not arriving alone.");
  }
  if (lowered.includes("introvert")) {
    actionable.push("I’ll set up small-group options with gentle starts and optional prompts.");
  }
  if (lowered.includes("manchester")) {
    actionable.push("Prioritising members within 20 minutes of the Northern Quarter.");
  }

  if (!actionable.length) {
    actionable.push("Mapping people nearby who match your vibe and availability.");
    actionable.push("Drafting invites and reserving a spot so you can just show up.");
  }

  return `Here’s what I’ll do next: ${actionable.join(" ")} Want me to send the invites now?`;
};

const Concierge = () => {
  usePageTitle("AI Friendship Concierge");
  const [messages, setMessages] = useState<ConciergeMessage[]>(starterMessages);
  const [input, setInput] = useState("");

  const stats = useMemo(
    () => ({
      matches: 12 + messages.filter(m => m.sender === "user").length,
      invites: 6,
      followUps: 4,
    }),
    [messages]
  );

  const handleSend = (text?: string) => {
    const value = (text ?? input).trim();
    if (!value) return;

    const userMessage: ConciergeMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: value,
    };

    const conciergeMessage: ConciergeMessage = {
      id: `concierge-${Date.now()}`,
      sender: "concierge",
      text: buildConciergeResponse(value),
      meta: "Drafted invites · ready to send",
    };

    setMessages(prev => [...prev, userMessage, conciergeMessage]);
    setInput("");
  };

  return (
    <div className="space-y-6 pb-16">
      <BackButton fallbackPath="/home">Home</BackButton>

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">AI Concierge</p>
          <h1 className="mt-1 text-3xl font-semibold leading-tight">Friendship concierge that handles everything</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Tell the concierge what you want and it handles matching, logistics, invites, and follow-ups—so you can focus on showing up.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge className="bg-primary/10 text-primary" variant="secondary">Live support</Badge>
            <Badge variant="outline" className="border-emerald-500/50 text-emerald-600">Introductions booked</Badge>
            <Badge variant="outline" className="border-amber-500/50 text-amber-600">Logistics handled</Badge>
          </div>
        </div>
        <Sparkles className="hidden h-12 w-12 text-primary md:block" />
      </div>

      <Card className="bg-gradient-to-br from-primary/5 via-background to-background border-primary/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="h-5 w-5 text-primary" />
            Concierge snapshot
          </CardTitle>
          <CardDescription>Matches, invites, and follow-ups queued right now.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {[{ label: "New matches", value: `${stats.matches}` }, { label: "Invites drafted", value: `${stats.invites}` }, { label: "Follow-ups", value: `${stats.followUps}` }].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-border/70 bg-card/70 p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-1 text-3xl font-semibold">{value}</p>
              <p className="text-xs text-muted-foreground">Tracked automatically after every request.</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                <MessageSquare className="h-5 w-5 text-primary" />
                Chat with your concierge
              </CardTitle>
              <CardDescription>Drop any request. We respond with people, places, and invites.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="gap-1 border-border/70">
                <Timer className="h-3.5 w-3.5" />
                Under 1 min response
              </Badge>
              <Badge variant="outline" className="gap-1 border-border/70">
                <Users className="h-3.5 w-3.5" />
                Human verified matches
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
              {quickPrompts.map(prompt => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="group flex items-center justify-between rounded-xl border border-border/70 bg-card/70 px-3 py-2 text-left text-sm transition hover:border-primary/40 hover:bg-primary/5"
                >
                  <span>{prompt}</span>
                  <Send className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
                </button>
              ))}
            </div>

            <div className="space-y-3 rounded-2xl border border-border/70 bg-card/80 p-4 shadow-inner">
              {messages.map(message => (
                <div key={message.id} className={cn("flex gap-3", message.sender === "user" ? "justify-end" : "justify-start")}
                >
                  {message.sender !== "user" && (
                    <Avatar className="h-9 w-9 border border-primary/30">
                      <AvatarImage src={avatarUrl("concierge")} alt="Concierge" />
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-[520px] rounded-2xl border px-4 py-3 shadow-sm",
                      message.sender === "user"
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "bg-card/80 border-border/70"
                    )}
                  >
                    <p className="leading-relaxed">{message.text}</p>
                    {message.meta && (
                      <p className="mt-1 text-xs text-muted-foreground/80">{message.meta}</p>
                    )}
                  </div>
                  {message.sender === "user" && (
                    <Avatar className="h-9 w-9 border border-border/70 bg-primary/10 text-primary">
                      <AvatarFallback>Me</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
              <label className="text-sm font-medium text-muted-foreground" htmlFor="concierge-input">
                Describe who you want to meet or what you want to organise
              </label>
              <textarea
                id="concierge-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-border/70 bg-background px-3 py-2 text-sm shadow-inner focus:border-primary/50 focus:outline-none"
                placeholder="Example: Connect me with two people for a coffee today near the waterfront"
              />
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">We’ll automatically draft invites, propose venues, and confirm times.</p>
                <Button onClick={() => handleSend()} className="gap-2">
                  <Send className="h-4 w-4" />
                  Send request
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CalendarCheck2 className="h-5 w-5 text-primary" />
                Active plan
              </CardTitle>
              <CardDescription>Concierge handles invites, timing, and nudges.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm">
                <p className="font-semibold">Coffee pairing today · River & Rye Café</p>
                <p className="text-muted-foreground">3:30–5:00 PM · table on hold · invites pending confirmation</p>
              </div>
              <div className="grid gap-2">
                {meetupOptions.map(option => (
                  <div key={option.title} className="flex items-start gap-3 rounded-xl border border-border/70 bg-card/70 p-3">
                    <div className="mt-0.5 rounded-full bg-primary/10 p-2 text-primary">
                      {option.type === "invite" ? <Send className="h-4 w-4" /> : <CalendarCheck2 className="h-4 w-4" />}
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="font-semibold">{option.title}</p>
                      <p className="text-muted-foreground">{option.detail}</p>
                    </div>
                    <Button size="sm" variant="outline" className="border-primary/40 text-primary">
                      Approve
                    </Button>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Recommended matches</p>
                {recommendedPairs.map(person => (
                  <div key={person.name} className="flex items-start gap-3 rounded-xl border border-border/70 bg-card/70 p-3">
                    <Avatar className="h-10 w-10 border border-border/70">
                      <AvatarImage src={avatarUrl(person.name)} alt={person.name} />
                      <AvatarFallback>{person.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <p className="font-semibold">{person.name}</p>
                      <p className="text-muted-foreground">{person.focus}</p>
                      <p className="text-xs text-muted-foreground/80">{person.proximity} · {person.note}</p>
                    </div>
                    <Button size="sm" className="ml-auto">Invite</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Coffee className="h-5 w-5 text-primary" />
                Follow-ups
              </CardTitle>
              <CardDescription>We keep nudging until everyone is confirmed.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {followUps.map(item => (
                <div key={item.title} className="flex items-start gap-3 rounded-xl border border-border/70 bg-card/70 p-3">
                  <div className="rounded-full border border-primary/30 bg-primary/10 p-2 text-primary">
                    {item.status === "active" ? <Timer className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-muted-foreground">{item.detail}</p>
                  </div>
                  <Badge variant="outline" className={cn("ml-auto text-xs", item.status === "active" ? "border-amber-500/50 text-amber-600" : "border-emerald-500/50 text-emerald-600")}
                  >
                    {item.status === "active" ? "In progress" : "Done"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Concierge;
