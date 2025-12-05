import { useState, useCallback, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  Handshake,
  Heart,
  Lock,
  Lightbulb,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Unlock,
  Users,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SwipeCard } from "@/components/SwipeCard";
import BackButton from "@/components/BackButton";
import { RatingStars } from "@/components/RatingStars";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { usePageTitle } from "@/hooks/usePageTitle";
import { Badge } from "@/components/ui/badge";
import {
  fetchConnectionFeedback,
  submitConnectionFeedback,
} from "@/api/connection-feedback";

interface Profile {
  id: string;
  name: string;
  age: number;
  photo: string;
  interests: string[];
  bio: string;
  trustBadge?: boolean;
  availability?: string;
  distance?: string;
  gallery?: string[];
  verified?: boolean;
}

const profiles: Profile[] = [
  {
    id: "1",
    name: "Sarah M.",
    age: 28,
    photo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80",
    ],
    interests: ["Coffee Addict", "Yoga Lover", "Plant Parent", "Art Enthusiast"],
    bio: "Love exploring new coffee shops and finding hidden gems in the city. Always up for a good conversation over a cup of coffee!",
    verified: true,
    availability: "Available now",
    distance: "2 miles away",
  },
  {
    id: "2",
    name: "Alex K.",
    age: 31,
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
    ],
    interests: ["Bookworm", "Hiking Enthusiast", "Dog Lover", "New in Town"],
    bio: "Recently moved to the city and looking to make new friends. Love outdoor activities and discovering local bookstores.",
    verified: false,
    availability: "Evenings",
    distance: "1.5 miles away",
  },
  {
    id: "3",
    name: "Priya S.",
    age: 27,
    photo:
      "https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1500522144261-ea64433bbe27?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    ],
    interests: ["Food Truck Explorer", "Live Music", "Pop Culture", "Skating"],
    bio: "Marketing professional who loves discovering new live music venues and foodie spots. Always ready for a trivia night!",
    verified: true,
    availability: "Weeknights",
    distance: "0.8 miles away",
  },
];

interface MatchSuggestion {
  id: string;
  name: string;
  compatibility: number;
  sharedVibe: string;
  meetingPreference: string;
  distance: string;
  reasoning: string;
  sharedInterests: string[];
  conversationStarters: string[];
}

const aiSuggestions: MatchSuggestion[] = [
  {
    id: "ms-1",
    name: "Jordan — Product mentor",
    compatibility: 94,
    sharedVibe: "Curious builder energy with calm communication style",
    meetingPreference: "Weeknight coffee within 2 miles",
    distance: "1.2 miles away",
    reasoning:
      "Matches your love of founder stories and reflective journaling, while bringing accountability for the next career move.",
    sharedInterests: ["Indie hacking", "Third places", "Mindful productivity"],
    conversationStarters: [
      "Swap the one ritual you both use before deep work sessions.",
      "Compare favorite hidden coffee bars that let you stay in flow for hours.",
      "Ask about the most surprising lesson from their last product experiment.",
    ],
  },
  {
    id: "ms-2",
    name: "Mina — Community architect",
    compatibility: 91,
    sharedVibe: "Warm host who loves pairing people with similar creative sparks",
    meetingPreference: "Saturday brunch or gallery stroll",
    distance: "0.7 miles away",
    reasoning:
      "Similar values around intentional gatherings and slow friendships. You're both searching for co-creators for passion projects.",
    sharedInterests: ["Analog photography", "Pop-up dinners", "Creative accountability"],
    conversationStarters: [
      "Compare the best pop-up events you've attended and what made them special.",
      "Share a photo prompt for the week and plan to swap results.",
      "Brainstorm a two-person micro-gathering that blends your interests.",
    ],
  },
  {
    id: "ms-3",
    name: "Arjun — Strategy nerd",
    compatibility: 88,
    sharedVibe: "Brainy but playful; loves structured debates and late-night walks",
    meetingPreference: "Evening tea + strategy games",
    distance: "2.4 miles away",
    reasoning:
      "Your personality map shows overlapping curiosity across systems thinking, urban adventures, and playful competition.",
    sharedInterests: ["Systems thinking", "Board games", "Urban hikes"],
    conversationStarters: [
      "Trade your current life experiment and set a check-in for next week.",
      "Ask which board game best mirrors how they approach work decisions.",
      "Plan a walkable route that ends at a tea spot with outdoor seating.",
    ],
  },
];

interface BlindCompatibilityMatch {
  id: string;
  name: string;
  age: number;
  distance: string;
  compatibility: number;
  photo: string;
  values: string[];
  interests: string[];
  lifestyle: string;
  behaviorSignals: string[];
}

const blindCompatibilityMatches: BlindCompatibilityMatch[] = [
  {
    id: "blind-1",
    name: "Jules — Intentional community builder",
    age: 30,
    distance: "1.1 miles away",
    compatibility: 96,
    photo:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=900&q=80&sat=5",
    values: ["Reciprocity first", "Shows up consistently", "Prefers small groups"],
    interests: ["Slow dinners", "Story-forward meetups", "Sunrise walks"],
    lifestyle: "Weeknight meetups, early mornings, car-free city explorer",
    behaviorSignals: [
      "Replies within a day and confirms plans",
      "Hosts two intros per month to stitch the community",
      "Shares concise recaps after events to keep momentum",
    ],
  },
  {
    id: "blind-2",
    name: "Emi — Rituals over hype",
    age: 28,
    distance: "0.8 miles away",
    compatibility: 93,
    photo:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80&sat=10",
    values: ["Boundaries respected", "Gentle leadership", "Follow-through"],
    interests: ["Analog photography", "Tea sessions", "Film club"],
    lifestyle: "Flexible schedule, bikes everywhere, prefers cozy venues",
    behaviorSignals: [
      "Logs post-event feedback within 24 hours",
      "Keeps groups under six to protect vibe",
      "Matches weekly energy check-ins with their friends",
    ],
  },
  {
    id: "blind-3",
    name: "Theo — Curious collaborator",
    age: 33,
    distance: "2.0 miles away",
    compatibility: 91,
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80&sat=12",
    values: ["Shared accountability", "Warm candor", "Playful learning"],
    interests: ["Indie game jams", "Urban hikes", "Skill swaps"],
    lifestyle: "Weekend mornings, hybrid-friendly, public transit lover",
    behaviorSignals: [
      "Introduces people with context instead of cold DMs",
      "Shows up early and leaves thoughtful reviews",
      "Sends co-working prompts that respect focus time",
    ],
  },
];

interface ConnectionFeedback {
  id: string;
  name: string;
  avatar: string;
  metAt: string;
  communityAverage: number;
  communityCount: number;
  yourRating?: number;
  yourComment?: string;
  submitted?: boolean;
  isSubmitting?: boolean;
}

const connectionFeedbackSeeds: ConnectionFeedback[] = [
  {
    id: "cf-1",
    name: "Sarah M.",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
    metAt: "You matched after the Rooftop Social",
    communityAverage: 4.9,
    communityCount: 56,
  },
  {
    id: "cf-2",
    name: "Alex K.",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    metAt: "Introduced during Coffee Crawl",
    communityAverage: 4.7,
    communityCount: 42,
  },
];

const Matches = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [connectionFeedback, setConnectionFeedback] = useState(connectionFeedbackSeeds);
  const [blindAcceptances, setBlindAcceptances] = useState<Record<
    string,
    { you: boolean; them: boolean; revealed: boolean }
  >>(() =>
    blindCompatibilityMatches.reduce(
      (acc, match) => {
        acc[match.id] = { you: false, them: false, revealed: false };
        return acc;
      },
      {} as Record<string, { you: boolean; them: boolean; revealed: boolean }>,
    ),
  );
  const { attemptConnection } = useSubscription();
  const { toast } = useToast();
  usePageTitle("Your Matches");

  const updateBlindAcceptance = useCallback(
    (id: string, changes: Partial<{ you: boolean; them: boolean }>) => {
      setBlindAcceptances((prev) => {
        const current =
          prev[id] ?? ({ you: false, them: false, revealed: false } as const);
        const next = { ...current, ...changes };
        return {
          ...prev,
          [id]: { ...next, revealed: next.you && next.them },
        };
      });
    },
    [],
  );

  const handleBlindAccept = useCallback(
    (id: string) => {
      updateBlindAcceptance(id, { you: true });

      // Simulate the other person opting in once they see alignment
      setTimeout(() => {
        updateBlindAcceptance(id, { them: true });
      }, 900);
    },
    [updateBlindAcceptance],
  );

  useEffect(() => {
    const loadExistingFeedback = async () => {
      try {
        const existing = await fetchConnectionFeedback();
        if (existing.length === 0) return;

        setConnectionFeedback((prev) => {
          const updated = prev.map((cf) => {
            const record = existing.find(
              (item) => item.connection_identifier === cf.id,
            );
            if (!record) return cf;

            return {
              ...cf,
              submitted: true,
              yourRating: record.rating,
              yourComment: record.comment ?? undefined,
            };
          });

          const knownIds = new Set(prev.map((item) => item.id));
          const additional = existing
            .filter((item) => !knownIds.has(item.connection_identifier))
            .map((item) => ({
              id: item.connection_identifier,
              name: item.connection_name,
              avatar: "/placeholder.svg",
              metAt: item.met_context ?? "Connected through Connective",
              communityAverage: 4.8,
              communityCount: 24,
              yourRating: item.rating,
              yourComment: item.comment ?? undefined,
              submitted: true,
              isSubmitting: false,
            }));

          return additional.length > 0 ? [...updated, ...additional] : updated;
        });
      } catch (error) {
        console.error("Unable to load connection feedback", error);
      }
    };

    void loadExistingFeedback();
  }, []);

  const handleLike = useCallback(async () => {
    const canProceed = await attemptConnection();
    if (!canProceed) return;
    const newLiked = [...likedProfiles, profiles[currentIndex].id];
    setLikedProfiles(newLiked);
    setShowMatchModal(true);
    setTimeout(() => {
      setShowMatchModal(false);
      if (currentIndex < profiles.length - 1) setCurrentIndex(currentIndex + 1);
    }, 2000);
  }, [currentIndex, likedProfiles, attemptConnection]);

  const handlePass = useCallback(() => {
    if (currentIndex < profiles.length - 1) setCurrentIndex(currentIndex + 1);
  }, [currentIndex]);

  const handleSwipe = useCallback((direction: "left" | "right") => {
    if (direction === "right") handleLike();
    else handlePass();
  }, [handleLike, handlePass]);

  const currentProfile = profiles[currentIndex];
  const remainingCount = useMemo(
    () => profiles.length - currentIndex - 1,
    [currentIndex]
  );

  // Feedback handlers
  const handleRatingChange = (id: string, rating: number) =>
    setConnectionFeedback((prev) =>
      prev.map((cf) => (cf.id === id ? { ...cf, yourRating: rating } : cf))
    );

  const handleCommentChange = (id: string, comment: string) =>
    setConnectionFeedback((prev) =>
      prev.map((cf) => (cf.id === id ? { ...cf, yourComment: comment } : cf))
    );

  const handleSubmitFeedback = async (id: string) => {
    const feedback = connectionFeedback.find((cf) => cf.id === id);
    if (!feedback?.yourRating) {
      toast({
        title: "Add a rating",
        description: "Please rate your connection before submitting.",
        variant: "destructive",
      });
      return;
    }

    const trimmedComment =
      feedback.yourComment?.trim() === ""
        ? undefined
        : feedback.yourComment?.trim();

    setConnectionFeedback((prev) =>
      prev.map((cf) =>
        cf.id === id ? { ...cf, isSubmitting: true } : cf,
      ),
    );

    try {
      await submitConnectionFeedback({
        connectionIdentifier: feedback.id,
        connectionName: feedback.name,
        metContext: feedback.metAt,
        rating: feedback.yourRating,
        comment: trimmedComment ?? null,
      });

      setConnectionFeedback((prev) =>
        prev.map((cf) =>
          cf.id === id
            ? {
                ...cf,
                submitted: true,
                isSubmitting: false,
                yourComment: trimmedComment,
              }
            : cf,
        ),
      );

      toast({
        title: "Feedback submitted",
        description: "Thank you for helping improve our community!",
      });
    } catch (error) {
      console.error("Unable to submit connection feedback", error);
      setConnectionFeedback((prev) =>
        prev.map((cf) =>
          cf.id === id ? { ...cf, isSubmitting: false } : cf,
        ),
      );
      toast({
        title: "Could not submit feedback",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-muted rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="ml-1">
          <h1 className="text-xl font-semibold leading-tight">Friend Matches</h1>
          <p className="text-sm text-muted-foreground">
            Track introductions, coordinate meetups, and reflect on how each
            connection went.
          </p>
        </div>
      </div>

      <Tabs defaultValue="discover" className="px-6 py-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="feedback">Connection Feedback</TabsTrigger>
        </TabsList>

        {/* Discover Tab */}
        <TabsContent value="discover" className="mt-6 space-y-6">
          <Card className="border-border/60 bg-gradient-to-br from-background via-background to-muted/40 shadow-sm">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="w-4 h-4" />
                <span>Blind Compatibility Mode</span>
              </div>
              <CardTitle>Lead with values, reveal photos later</CardTitle>
              <CardDescription>
                Profiles stay blurred until you both accept the match. We rank by
                compatibility, shared traits, and behavior signals so you focus
                on alignment first.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {blindCompatibilityMatches.map((match) => {
                const acceptance = blindAcceptances[match.id];
                const isAwaiting = acceptance?.you && !acceptance.them;
                const isRevealed = acceptance?.revealed;
                return (
                  <div
                    key={match.id}
                    className="grid gap-4 rounded-2xl border border-border/60 bg-card/70 p-4 md:grid-cols-[auto,1fr] md:items-center"
                  >
                    <div className="relative h-28 w-28 overflow-hidden rounded-2xl bg-muted">
                      <img
                        src={match.photo}
                        alt={match.name}
                        className={`h-full w-full rounded-2xl object-cover transition-[filter,transform] duration-700 ease-out ${isRevealed ? "blur-0 scale-100" : "blur-xl scale-105"}`}
                      />
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-background/40 via-transparent to-background/80" />
                      <div className="absolute inset-0 flex flex-col justify-between p-3">
                        <Badge className="w-fit gap-1 bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--accent)))] text-[hsl(var(--primary-foreground))]">
                          <Users className="h-3.5 w-3.5" />
                          {match.compatibility}% match
                        </Badge>
                        <div className="flex items-center gap-2 text-xs font-semibold text-white drop-shadow">
                          {isRevealed ? <Unlock className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          {isRevealed ? "Photos unlocked" : "Blurred until mutual yes"}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground">
                            {match.distance}
                          </p>
                          <h3 className="text-lg font-semibold leading-tight">
                            {match.name} · {match.age}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Lifestyle: {match.lifestyle}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <div className={`flex items-center gap-1 rounded-full px-3 py-1 ${acceptance?.you ? "bg-[hsl(var(--accent))]/15 text-[hsl(var(--highlight-text))]" : "bg-muted"}`}>
                            <Handshake className="h-3.5 w-3.5" /> You said yes
                          </div>
                          <div className={`flex items-center gap-1 rounded-full px-3 py-1 ${acceptance?.them ? "bg-[hsl(var(--primary))]/15 text-[hsl(var(--primary-foreground))]" : "bg-muted"}`}>
                            <Check className="h-3.5 w-3.5" /> They accepted
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-3 md:grid-cols-3">
                        <div className="space-y-2">
                          <p className="text-xs font-semibold uppercase text-muted-foreground">
                            Values alignment
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {match.values.map((value) => (
                              <Badge
                                key={value}
                                variant="secondary"
                                className="rounded-full bg-muted text-foreground"
                              >
                                {value}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-semibold uppercase text-muted-foreground">
                            Shared interests
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {match.interests.map((interest) => (
                              <Badge
                                key={interest}
                                variant="outline"
                                className="rounded-full"
                              >
                                {interest}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-semibold uppercase text-muted-foreground">
                            Behavior signals
                          </p>
                          <ul className="space-y-1.5 text-sm text-muted-foreground">
                            {match.behaviorSignals.map((signal) => (
                              <li key={signal} className="flex items-start gap-2">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent))]" />
                                <span>{signal}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="rounded-xl bg-muted/50 p-3 text-sm text-muted-foreground">
                        {isRevealed
                          ? "Mutual acceptance confirmed. Photos fade in now so you can plan the first hello with context."
                          : "We’re prioritizing compatibility, shared rhythms, and reliability cues so you can decide before seeing photos."}
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div className="text-xs text-muted-foreground">
                          {isRevealed
                            ? "You both opted into this intro. Start with the values you share, then plan the meet."
                            : isAwaiting
                              ? "You accepted. We’ll reveal once they confirm the alignment feels right, too."
                              : "Photos unlock only after both people agree the values and interests fit."}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            className="rounded-full"
                            variant={isRevealed ? "default" : "secondary"}
                            onClick={() => handleBlindAccept(match.id)}
                            disabled={acceptance?.you}
                          >
                            {isRevealed ? (
                              <>
                                <Eye className="h-4 w-4" /> View now
                              </>
                            ) : isAwaiting ? (
                              <>
                                <Lock className="h-4 w-4" /> Waiting on them
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-4 w-4" /> Accept by compatibility
                              </>
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="rounded-full"
                          >
                            <MessageSquare className="h-4 w-4" />
                            Start with interests
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <Card className="border-border/60 shadow-sm">
            <CardHeader className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                <span>AI Matchmaking</span>
              </div>
              <CardTitle>Curated people who actually fit</CardTitle>
              <CardDescription>
                We read your interests, vibe, and meeting preferences to surface
                people nearby who feel like an instant friend. Each suggestion
                includes why it clicks and how to start the conversation.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              {aiSuggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="rounded-xl border border-border/60 bg-card p-4 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                        {suggestion.distance}
                      </p>
                      <p className="font-semibold leading-tight">
                        {suggestion.name}
                      </p>
                    </div>
                    <Badge className="gap-1"> 
                      <Users className="w-3.5 h-3.5" />
                      {suggestion.compatibility}%
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2 text-primary font-medium">
                      <Lightbulb className="w-4 h-4 mt-0.5" />
                      <span>{suggestion.sharedVibe}</span>
                    </div>
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <Check className="w-4 h-4 mt-0.5" />
                      <span>{suggestion.reasoning}</span>
                    </div>
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MessageSquare className="w-4 h-4 mt-0.5" />
                      <span>{suggestion.meetingPreference}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {suggestion.sharedInterests.map((interest) => (
                      <span
                        key={interest}
                        className="rounded-full bg-muted px-3 py-1 text-[11px] uppercase tracking-wide"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-2 rounded-lg bg-muted/60 p-3">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Conversation starters
                    </p>
                    <ul className="space-y-1.5 text-sm text-muted-foreground">
                      {suggestion.conversationStarters.map((starter) => (
                        <li key={starter} className="flex gap-2">
                          <Sparkles className="w-3.5 h-3.5 mt-0.5 text-primary" />
                          <span>{starter}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {currentIndex < profiles.length ? (
            <Card className="overflow-hidden border-border shadow-xl transition-all">
              <div className="h-80 bg-muted relative">
                <Avatar className="w-28 h-28 absolute left-6 -bottom-14 sm:-bottom-16 md:bottom-6 ring-4 ring-card shadow-lg">
                  <AvatarImage src={currentProfile.photo} />
                  <AvatarFallback>{currentProfile.name[0]}</AvatarFallback>
                </Avatar>
              </div>

              <CardContent className="p-6 pt-20 md:pt-12">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold">{currentProfile.name}</h2>
                  <span className="text-lg text-muted-foreground">
                    • {currentProfile.age}
                  </span>
                  {currentProfile.verified && (
                    <Badge className="gap-1 bg-emerald-600 text-white border-emerald-700">
                      <ShieldCheck className="w-3.5 h-3.5" /> Verified
                    </Badge>
                  )}
                </div>

                {currentProfile.availability && (
                  <p className="text-sm font-medium text-slate-600 mb-4 dark:text-slate-200">
                    {currentProfile.availability}
                  </p>
                )}

                <div className="flex flex-wrap gap-2 mb-6">
                  {currentProfile.interests.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-[#FFF7ED] text-foreground rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 items-center">
                  <Button
                    onClick={handleLike}
                    className="flex-1 h-14 gap-2 text-[hsl(var(--primary-foreground))]"
                  >
                    <Sparkles className="w-5 h-5" /> Let's grab coffee!
                  </Button>
                  <Button
                    onClick={handlePass}
                    variant="outline"
                    className="h-14 w-14 rounded-full border-2"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-4">
                  <Check className="w-4 h-4" /> {remainingCount} more profiles
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="text-center p-8">
              <CardContent className="space-y-4">
                <p className="text-lg font-semibold">
                  That's everyone for now!
                </p>
                <p className="text-muted-foreground">
                  Check back later for new matches
                </p>
                <Button onClick={() => navigate("/home")}>Return Home</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="mt-6 space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Help us improve connections by sharing your experience.
          </p>

          {connectionFeedback.map((cf) => (
            <Card key={cf.id}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={cf.avatar} />
                    <AvatarFallback>{cf.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-base">{cf.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {cf.metAt}
                    </CardDescription>
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                      <span>Community: {cf.communityAverage.toFixed(1)}</span>
                      <span>({cf.communityCount} ratings)</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {!cf.submitted ? (
                  <>
                    <div className="space-y-2">
                      <Label>Your rating</Label>
                      <RatingStars
                        rating={cf.yourRating || 0}
                        onChange={(r) => handleRatingChange(cf.id, r)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Comment (optional)</Label>
                      <Textarea
                        placeholder="What was your experience like?"
                        value={cf.yourComment || ""}
                        onChange={(e) =>
                          handleCommentChange(cf.id, e.target.value)
                        }
                        className="resize-none"
                        rows={3}
                      />
                    </div>
                    <Button
                      onClick={() => void handleSubmitFeedback(cf.id)}
                      disabled={!cf.yourRating || cf.isSubmitting}
                      className="w-full"
                    >
                      {cf.isSubmitting ? "Submitting..." : "Submit Feedback"}
                    </Button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Feedback submitted
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        Thank you!
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <RatingStars rating={cf.yourRating || 0} />
                      <span className="text-sm text-muted-foreground">
                        {cf.yourRating?.toFixed(1)} / 5
                      </span>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-3">
                      <p className="text-sm text-muted-foreground">
                        {cf.yourComment?.trim()
                          ? cf.yourComment
                          : "Shared a rating without additional comments."}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {showMatchModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-background rounded-3xl p-8 max-w-sm mx-4 text-center space-y-4">
          <div className="w-20 h-20 bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--accent)))] rounded-full mx-auto flex items-center justify-center">
              <Heart className="w-10 h-10 text-white fill-white" />
            </div>
            <h2 className="text-2xl font-bold">It's a Match!</h2>
            <p className="text-muted-foreground">
              You and {currentProfile?.name} liked each other
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Matches;
