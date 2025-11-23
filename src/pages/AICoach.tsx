import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  ArrowRight,
  Brain,
  HandHeart,
  Image as ImageIcon,
  MessageSquare,
  Mic,
  Sparkles,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const coachingTracks = [
  {
    title: "Conversation Openers",
    description: "Warm, specific starters you can drop into DMs or in-person intros.",
    icon: MessageSquare,
    accent: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  },
  {
    title: "Profile Glow-ups",
    description: "Bios that sound confident, friendly, and true to you—without cringe.",
    icon: Wand2,
    accent: "bg-indigo-500/10 text-indigo-700 dark:text-indigo-300",
  },
  {
    title: "Photo Insights",
    description: "Instant read on what your photos signal and how to balance your vibe.",
    icon: ImageIcon,
    accent: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  },
  {
    title: "Shy-to-Ready Drills",
    description: "Mini scripts to break the ice even when you feel awkward.",
    icon: HandHeart,
    accent: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
  },
  {
    title: "After-Meetup Debriefs",
    description: "Reflect fast, plan the next step, and deepen new friendships.",
    icon: Brain,
    accent: "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300",
  },
];

const photoInsights = [
  {
    label: "Outdoor photo",
    signal: "Adventurous and relaxed",
    tweak: "Add a smile or eye contact to feel more welcoming.",
    confidence: 78,
  },
  {
    label: "Group shot",
    signal: "Social and collaborative",
    tweak: "Make sure you’re centered so people know who to message.",
    confidence: 65,
  },
  {
    label: "Hobby close-up",
    signal: "Curious and detail-oriented",
    tweak: "Pair it with a casual portrait to balance warmth.",
    confidence: 82,
  },
];

const icebreakerIdeas = [
  "Name one thing you’re learning this month and ask them theirs.",
  "If you could design a perfect Sunday here, what’s on it?",
  "I’m new to this group—what do you wish you knew on day one?",
  "What’s a low-pressure hangout you’d recommend this week?",
];

const AICoach = () => {
  usePageTitle("AI Confidence Coach");

  const [scenario, setScenario] = useState("coffee meetup with another member");
  const [conversationStarter, setConversationStarter] = useState(
    "Hey! I’m grabbing a cold brew before the talk—what’s your go-to order?",
  );
  const [followUp, setFollowUp] = useState(
    "If they mention something they like, ask how they got into it and invite them to try a local spot together.",
  );

  const [bioInput, setBioInput] = useState(
    "Design nerd, runner, and low-pressure hangout enthusiast.",
  );
  const [bioSuggestions, setBioSuggestions] = useState<string[]>([
    "Weekend trail runner who makes a mean cold brew. Down to explore bookstores or farmer’s markets.",
    "UX designer who loves swapping playlists and discovering cozy coffee shops.",
    "Here to meet curious people who enjoy honest conversations and spontaneous plans.",
  ]);

  const [meetupNotes, setMeetupNotes] = useState(
    "We bonded over hiking and both want to try a sunrise trail soon.",
  );
  const [debriefSteps, setDebriefSteps] = useState<string[]>([
    "Send a thank-you note tonight mentioning the hiking idea.",
    "Share a link to the trail map and propose two time options.",
    "Add a small personal detail you remember to show you were listening.",
  ]);

  const groundedIcebreakers = useMemo(() => icebreakerIdeas.slice(0, 3), []);

  const handleGenerateStarter = () => {
    const trimmed = scenario.trim();
    const topic = trimmed || "meeting someone new";
    setConversationStarter(
      `I’m here for ${topic}. What made you check this out? I’m looking for new people to enjoy it with.`,
    );
    setFollowUp(
      "Ask for their favorite moment or tip, then suggest a quick, low-pressure way to continue the chat (coffee after, swap playlists, etc.).",
    );
  };

  const handleRefreshBios = () => {
    const base = bioInput.trim() || "Friendly human who loves thoughtful conversations.";
    setBioSuggestions([
      `${base} Always down to share recommendations and plan something chill this week.`,
      "Quick intros welcome—tell me your favorite local spot and I’ll tell you mine.",
      "Looking to meet people who value kindness, curiosity, and low-pressure hangs.",
    ]);
  };

  const handleDebrief = () => {
    const highlight = meetupNotes.trim() || "We had a great first chat.";
    setDebriefSteps([
      `${highlight} Send a short note tonight thanking them for the convo.`,
      "Reference one detail they shared to prove you were listening.",
      "Offer a next step with two time options so it’s easy to say yes.",
    ]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fff7e6] via-white to-white pb-24 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border bg-white/90 p-8 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,203,112,0.25),transparent_30%),radial-gradient(circle_at_80%_0%,rgba(124,94,255,0.2),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(34,211,238,0.16),transparent_32%)]" />
          <div className="relative grid gap-6 lg:grid-cols-2 lg:items-center">
            <div className="space-y-4">
              <Badge className="rounded-full bg-primary/10 text-primary">
                New • Social skills coach
              </Badge>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white sm:text-4xl">
                AI Confidence & Social Skills Coach
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Personalized coaching that helps you start conversations, polish your profile, and follow up with confidence.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button className="bg-[#f7c145] text-black" onClick={handleGenerateStarter}>
                  Try a starter
                </Button>
                <Button
                  variant="outline"
                  className="border-slate-300 bg-white/70 text-slate-900 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-white"
                  onClick={handleRefreshBios}
                >
                  Refresh my bio ideas
                </Button>
              </div>
            </div>
            <Card className="relative border border-white/60 bg-white/80 shadow-lg dark:border-white/10 dark:bg-white/5">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-3 text-primary">
                    <Mic className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                      Live coaching mood
                    </p>
                    <p className="text-base font-bold text-slate-900 dark:text-white">
                      Friendly + Supportive
                    </p>
                  </div>
                </div>
                <Separator className="bg-slate-200 dark:bg-white/10" />
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    Confidence loops
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Conversation", "Profile", "Photos", "Follow-up"].map((item) => (
                      <Badge key={item} className="rounded-full bg-slate-100 text-slate-700 dark:bg-white/10 dark:text-white">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-primary/15 via-amber-200/20 to-white p-4 text-sm text-slate-800 shadow-inner dark:from-primary/10 dark:via-amber-200/10 dark:to-white/5 dark:text-white">
                  "You don’t have to be perfect—just present and curious. I’ll tee up the next line so you can stay in the moment."
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coachingTracks.map((track) => {
            const Icon = track.icon;
            return (
              <Card
                key={track.title}
                className="border border-slate-200/80 bg-white/90 shadow-sm backdrop-blur transition hover:shadow-lg dark:border-white/5 dark:bg-white/5"
              >
                <CardHeader className="space-y-3">
                  <div
                    className={cn(
                      "inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
                      track.accent,
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {track.title}
                  </div>
                  <CardDescription className="text-slate-600 dark:text-slate-300">
                    {track.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Card className="border-slate-200/80 bg-white/90 shadow-sm dark:border-white/5 dark:bg-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-5 w-5 text-primary" />
                Conversation starter lab
              </CardTitle>
              <CardDescription>
                Describe the situation and get a gentle opener with a suggested follow-up.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200" htmlFor="scenario">
                What’s happening?
              </label>
              <Input
                id="scenario"
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                placeholder="Example: waiting in line at a pop-up art show"
                className="bg-white/80 dark:bg-white/10"
              />
              <Button className="bg-[#f7c145] text-black" onClick={handleGenerateStarter}>
                Generate a friendly opener
              </Button>
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 text-sm shadow-inner dark:border-white/10 dark:bg-white/5">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Opener</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-white">{conversationStarter}</p>
                <Separator className="my-3 bg-slate-200 dark:bg-white/10" />
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Follow-up</p>
                <p className="mt-1 text-slate-700 dark:text-slate-200">{followUp}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white/90 shadow-sm dark:border-white/5 dark:bg-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Wand2 className="h-5 w-5 text-primary" />
                Profile bio glow-up
              </CardTitle>
              <CardDescription>
                Paste your current bio to get three friendly, confident alternatives.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                className="min-h-[120px] bg-white/80 dark:bg-white/10"
                placeholder="Drop your current bio here"
              />
              <Button
                variant="outline"
                className="border-slate-300 bg-white/80 text-slate-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
                onClick={handleRefreshBios}
              >
                Suggest better bios
              </Button>
              <div className="space-y-3">
                {bioSuggestions.map((idea, idx) => (
                  <div
                    key={idea}
                    className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 text-sm shadow-inner dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      Option {idx + 1}
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </div>
                    <p className="text-slate-800 dark:text-slate-100">{idea}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <Card className="border-slate-200/80 bg-white/90 shadow-sm dark:border-white/5 dark:bg-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <ImageIcon className="h-5 w-5 text-primary" />
                Photo signals & tweaks
              </CardTitle>
              <CardDescription>
                Quick reads on what your photos convey and how to optimize them.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {photoInsights.map((photo) => (
                <div
                  key={photo.label}
                  className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 shadow-inner dark:border-white/10 dark:bg-white/5"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{photo.label}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Signals {photo.signal}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-400" />
                  </div>
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">{photo.tweak}</p>
                  <div className="mt-3 space-y-1">
                    <p className="text-xs font-semibold text-slate-500">Warmth score</p>
                    <Progress value={photo.confidence} className="h-2" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white/90 shadow-sm dark:border-white/5 dark:bg-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <HandHeart className="h-5 w-5 text-primary" />
                Shy-to-ready prompts
              </CardTitle>
              <CardDescription>
                Low-pressure lines you can keep in your back pocket.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {groundedIcebreakers.map((line) => (
                  <div
                    key={line}
                    className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3 text-sm shadow-inner dark:border-white/10 dark:bg-white/5"
                  >
                    <p className="text-slate-800 dark:text-slate-100">“{line}”</p>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-slate-800 shadow-inner dark:border-primary/30 dark:bg-primary/10 dark:text-white">
                Tip: pair each icebreaker with a genuine observation ("cool shoes" / "love that tote") to sound natural.
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="border-slate-200/80 bg-white/90 shadow-sm dark:border-white/5 dark:bg-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Brain className="h-5 w-5 text-primary" />
                After-meetup debrief
              </CardTitle>
              <CardDescription>
                Capture the vibe and instantly get a plan to deepen the friendship.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={meetupNotes}
                onChange={(e) => setMeetupNotes(e.target.value)}
                className="min-h-[120px] bg-white/80 dark:bg-white/10"
                placeholder="What happened? What did you learn about them?"
              />
              <Button className="bg-[#f7c145] text-black" onClick={handleDebrief}>
                Suggest next steps
              </Button>
              <div className="space-y-3">
                {debriefSteps.map((step, idx) => (
                  <div
                    key={step}
                    className="flex items-start gap-3 rounded-xl border border-slate-200/70 bg-slate-50/70 p-3 text-sm shadow-inner dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-primary" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Step {idx + 1}</p>
                      <p className="text-slate-700 dark:text-slate-200">{step}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white/90 shadow-sm dark:border-white/5 dark:bg-white/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-5 w-5 text-primary" />
                Social momentum
              </CardTitle>
              <CardDescription>
                Quick metrics to keep you consistent without pressure.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Conversations started", value: 3, target: 5 },
                { label: "New follow-ups sent", value: 2, target: 4 },
                { label: "Profile tweaks done", value: 1, target: 2 },
              ].map((metric) => {
                const percentage = Math.min(100, Math.round((metric.value / metric.target) * 100));
                return (
                  <div
                    key={metric.label}
                    className="space-y-2 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 shadow-inner dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="flex items-center justify-between text-sm font-semibold text-slate-800 dark:text-white">
                      <span>{metric.label}</span>
                      <span>
                        {metric.value} / {metric.target}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-slate-800 shadow-inner dark:border-primary/30 dark:bg-primary/10 dark:text-white">
                Micro-wins keep people coming back. Aim for two small actions per week to build trust and momentum.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AICoach;
