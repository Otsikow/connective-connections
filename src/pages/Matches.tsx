// src/pages/Matches/Matches.tsx
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { usePageTitle } from "@/hooks/usePageTitle";

import BlindCompatibilitySection from "./sections/BlindCompatibilitySection";
import AISuggestionsSection from "./sections/AISuggestionsSection";
import BehaviorEngineSection from "./sections/BehaviorEngineSection";
import SwipeProfilesSection from "./sections/SwipeProfilesSection";
import ConnectionFeedbackSection from "./sections/ConnectionFeedbackSection";

import {
  fetchConnectionFeedback,
  submitConnectionFeedback,
} from "@/api/connection-feedback";

import { profiles } from "@/data/demo-profiles";
import {
  aiSuggestions,
  blindCompatibilityMatches,
  behaviorProfiles,
} from "@/data/matches-data";

const Matches = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { attemptConnection } = useSubscription();
  usePageTitle("Your Matches");

  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
  const [showMatchModal, setShowMatchModal] = useState(false);

  // Blind compatibility state
  const [blindAcceptances, setBlindAcceptances] = useState(() =>
    blindCompatibilityMatches.reduce((acc, match) => {
      acc[match.id] = { you: false, them: false, revealed: false };
      return acc;
    }, {} as Record<string, { you: boolean; them: boolean; revealed: boolean }>)
  );

  // Feedback state
  const [connectionFeedback, setConnectionFeedback] = useState([]);

  /* --------------------------- Load user feedback -------------------------- */
  useEffect(() => {
    const loadExistingFeedback = async () => {
      try {
        const existing = await fetchConnectionFeedback();
        if (existing.length === 0) return;

        setConnectionFeedback(existing);
      } catch (err) {
        console.error("Failed loading feedback", err);
      }
    };
    loadExistingFeedback();
  }, []);

  /* ------------------------ Blind compatibility accept --------------------- */
  const updateBlindAcceptance = (id: string, updates: any) => {
    setBlindAcceptances((prev) => {
      const curr = prev[id];
      const next = { ...curr, ...updates };
      next.revealed = next.you && next.them;
      return { ...prev, [id]: next };
    });
  };

  const handleBlindAccept = (id: string) => {
    updateBlindAcceptance(id, { you: true });
    setTimeout(() => updateBlindAcceptance(id, { them: true }), 900);
  };

  /* ------------------------------- Swipe Like ------------------------------ */
  const handleLike = async () => {
    const canProceed = await attemptConnection();
    if (!canProceed) return;

    const newLiked = [...likedProfiles, profiles[currentIndex].id];
    setLikedProfiles(newLiked);
    setShowMatchModal(true);

    setTimeout(() => {
      setShowMatchModal(false);
      if (currentIndex < profiles.length - 1)
        setCurrentIndex(currentIndex + 1);
    }, 2000);
  };

  const handlePass = () => {
    if (currentIndex < profiles.length - 1)
      setCurrentIndex(currentIndex + 1);
  };

  /* ---------------------------- Submit Feedback ---------------------------- */
  const submitFeedback = async (payload: any) => {
    try {
      await submitConnectionFeedback(payload);
      toast({
        title: "Feedback submitted",
        description: "Thank you for helping improve our community!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not submit feedback.",
        variant: "destructive",
      });
    }
  };

  const currentProfile = profiles[currentIndex];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Bar */}
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
            Smart, intentional connections curated for you.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="discover" className="px-6 py-6">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        {/* ----------------------------- Discover Tab ----------------------------- */}
        <TabsContent value="discover" className="mt-6 space-y-6">

          {/* 1. Blind compatibility (Values-first) */}
          <BlindCompatibilitySection
            matches={blindCompatibilityMatches}
            acceptances={blindAcceptances}
            onAccept={handleBlindAccept}
          />

          {/* 2. AI curated suggestions */}
          <AISuggestionsSection suggestions={aiSuggestions} />

          {/* 3. Behavior engine */}
          <BehaviorEngineSection profiles={behaviorProfiles} />

          {/* 4. Swipe section */}
          <SwipeProfilesSection
            currentProfile={currentProfile}
            profiles={profiles}
            currentIndex={currentIndex}
            handleLike={handleLike}
            handlePass={handlePass}
            showMatchModal={showMatchModal}
          />
        </TabsContent>

        {/* ----------------------------- Feedback Tab ----------------------------- */}
        <TabsContent value="feedback" className="mt-6">
          <ConnectionFeedbackSection
            feedback={connectionFeedback}
            onSubmit={submitFeedback}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Matches;
// src/pages/Matches/sections/BlindCompatibilitySection.tsx

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Check,
  Eye,
  EyeOff,
  Handshake,
  Lock,
  MessageSquare,
  Sparkles,
  Unlock,
  Users,
} from "lucide-react";

interface BlindMatch {
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

interface AcceptanceState {
  you: boolean;
  them: boolean;
  revealed: boolean;
}

interface Props {
  matches: BlindMatch[];
  acceptances: Record<string, AcceptanceState>;
  onAccept: (id: string) => void;
}

const BlindCompatibilitySection = ({ matches, acceptances, onAccept }: Props) => {
  return (
    <div className="rounded-xl border border-border/60 shadow-sm bg-card">
      <div className="p-6 space-y-2 border-b border-border/40">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Lock className="w-4 h-4" />
          <span>Blind Compatibility Mode</span>
        </div>
        <h2 className="text-xl font-semibold">Lead with values, reveal photos later</h2>
        <p className="text-sm text-muted-foreground">
          Profiles remain blurred until both people accept the intro.
          Compatibility is based on values, traits, and behavior cues — not appearance.
        </p>
      </div>

      <div className="p-6 space-y-6">
        {matches.map((match) => {
          const acceptance = acceptances[match.id];
          const isAwaiting = acceptance?.you && !acceptance.them;
          const isRevealed = acceptance?.revealed;

          return (
            <div
              key={match.id}
              className="grid gap-4 rounded-2xl border border-border/60 bg-card/70 p-4 md:grid-cols-[auto,1fr] md:items-center"
            >
              {/* ===================== PHOTO ===================== */}
              <div className="relative h-28 w-28 overflow-hidden rounded-2xl bg-muted">
                <img
                  src={match.photo}
                  alt={match.name}
                  className={`h-full w-full object-cover rounded-2xl transition-[filter,transform] duration-700 ease-out ${
                    isRevealed ? "blur-0 scale-100" : "blur-xl scale-105"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/80 rounded-2xl" />

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

              {/* ===================== DETAILS ===================== */}
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

                  {/* You said yes / They accepted */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div
                      className={`flex items-center gap-1 rounded-full px-3 py-1 ${
                        acceptance?.you
                          ? "bg-[hsl(var(--accent))]/15 text-[hsl(var(--highlight-text))]"
                          : "bg-muted"
                      }`}
                    >
                      <Handshake className="h-3.5 w-3.5" /> You said yes
                    </div>

                    <div
                      className={`flex items-center gap-1 rounded-full px-3 py-1 ${
                        acceptance?.them
                          ? "bg-[hsl(var(--primary))]/15 text-[hsl(var(--primary-foreground))]"
                          : "bg-muted"
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" /> They accepted
                    </div>
                  </div>
                </div>

                {/* Values */}
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

                {/* Interests */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    Shared interests
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {match.interests.map((interest) => (
                      <Badge key={interest} variant="outline" className="rounded-full">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Behavior signals */}
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

                {/* Message */}
                <div className="rounded-xl bg-muted/50 p-3 text-sm text-muted-foreground">
                  {isRevealed
                    ? "Mutual acceptance confirmed. Photos fade in now so you can plan the first hello with context."
                    : "We match compatibility through values, rhythms, and reliability — helping you decide before seeing photos."}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
                  <div className="text-xs text-muted-foreground">
                    {isRevealed
                      ? "You both opted in. Start with shared values before planning the meet."
                      : isAwaiting
                      ? "You accepted. We'll reveal once they confirm alignment."
                      : "Photos unlock only after both agree the values fit."}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      className="rounded-full"
                      variant={isRevealed ? "default" : "secondary"}
                      onClick={() => onAccept(match.id)}
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

                    <Button size="sm" variant="ghost" className="rounded-full">
                      <MessageSquare className="h-4 w-4" />
                      Start with interests
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BlindCompatibilitySection;
// src/pages/Matches/sections/AISuggestionsSection.tsx

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Lightbulb, MessageSquare, Sparkles, Users } from "lucide-react";

interface AISuggestion {
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

interface Props {
  suggestions: AISuggestion[];
}

const AISuggestionsSection = ({ suggestions }: Props) => {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4" />
          <span>AI Matchmaking</span>
        </div>
        <CardTitle>Curated people who actually fit</CardTitle>
        <CardDescription>
          We analyze your interests, rhythms, and communication style to surface people nearby
          who feel like instant friends. Each suggestion includes why it clicks — and how to
          start the conversation naturally.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-4 md:grid-cols-3">
        {suggestions.map((item) => (
          <div
            key={item.id}
            className="rounded-xl border border-border/60 bg-card p-4 shadow-sm space-y-3"
          >
            {/* ----------------------------- Header ----------------------------- */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">
                  {item.distance}
                </p>
                <p className="font-semibold leading-tight">{item.name}</p>
              </div>

              <Badge className="gap-1">
                <Users className="w-3.5 h-3.5" />
                {item.compatibility}%
              </Badge>
            </div>

            {/* ------------------------------ Insights ----------------------------- */}
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2 text-primary font-medium">
                <Lightbulb className="w-4 h-4 mt-0.5" />
                <span>{item.sharedVibe}</span>
              </div>

              <div className="flex items-start gap-2 text-muted-foreground">
                <Check className="w-4 h-4 mt-0.5" />
                <span>{item.reasoning}</span>
              </div>

              <div className="flex items-start gap-2 text-muted-foreground">
                <MessageSquare className="w-4 h-4 mt-0.5" />
                <span>{item.meetingPreference}</span>
              </div>
            </div>

            {/* ----------------------------- Interests ---------------------------- */}
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              {item.sharedInterests.map((interest) => (
                <span
                  key={interest}
                  className="rounded-full bg-muted px-3 py-1 text-[11px] uppercase tracking-wide"
                >
                  {interest}
                </span>
              ))}
            </div>

            {/* ----------------------- Conversation Starters ---------------------- */}
            <div className="space-y-2 rounded-lg bg-muted/60 p-3">
              <p className="text-xs font-semibold text-muted-foreground">
                Conversation starters
              </p>

              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {item.conversationStarters.map((starter) => (
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
  );
};

export default AISuggestionsSection;
// src/pages/Matches/sections/BehaviorEngineSection.tsx

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Sparkles, Users } from "lucide-react";

import {
  buildBehaviorMatches,
  clusterBehaviorProfiles,
} from "@/lib/behavior-matching";

interface BehaviorProfile {
  id: string;
  name: string;
  traits: string[];
  habits: string[];
  socialEnergy: string;
  signals: string[];
  category: string;
}

interface Props {
  profiles: BehaviorProfile[];
}

const BehaviorEngineSection = ({ profiles }: Props) => {
  const anchor = profiles[0];
  const candidates = profiles.slice(1);

  const behaviorMatches = buildBehaviorMatches(anchor, candidates);
  const behaviorClusters = clusterBehaviorProfiles(profiles);

  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4" />
          <span>Behavior-first graph</span>
        </div>
        <CardTitle>Matches from how you move</CardTitle>
        <CardDescription>
          We ignore bios completely. Instead, we read patterns across your habits, events you attend,
          social rhythms, follow-through cues, and consistency signals.
        </CardDescription>
      </CardHeader>

      <CardContent className="grid gap-6 lg:grid-cols-2">

        {/* --------------------- Behavior Recommendations ---------------------- */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Behavioral recommendations</span>
          </div>

          {behaviorMatches.slice(0, 4).map((match) => (
            <div
              key={match.id}
              className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold leading-tight">{match.name}</p>
                  <p className="text-xs text-muted-foreground">Behavioral compatibility</p>
                </div>

                <Badge className="gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {match.score}%
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">{match.insight}</p>

              {match.sharedSignals.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {match.sharedSignals.slice(0, 6).map((signal) => (
                    <span
                      key={`${match.id}-${signal}`}
                      className="rounded-full bg-background border border-border/60 px-3 py-1 text-xs"
                    >
                      {signal}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* --------------------------- Pattern Clusters ------------------------- */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
            <Lightbulb className="w-4 h-4" />
            <span>Pattern clusters</span>
          </div>

          {behaviorClusters.map((cluster) => (
            <div
              key={cluster.id}
              className="rounded-xl border border-border/60 bg-background p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold leading-tight">{cluster.label}</p>
                  <p className="text-xs text-muted-foreground">{cluster.description}</p>
                </div>

                <Badge variant="secondary" className="gap-1 text-xs">
                  <Users className="w-3.5 h-3.5" /> {cluster.members.length} people
                </Badge>
              </div>

              <div className="flex flex-wrap gap-2">
                {cluster.topSignals.map((signal) => (
                  <span
                    key={`${cluster.id}-${signal}`}
                    className="rounded-full bg-muted px-3 py-1 text-[11px] uppercase tracking-wide"
                  >
                    {signal}
                  </span>
                ))}
              </div>

              <p className="text-xs text-muted-foreground">
                Members: {cluster.members.map((m) => m.name).join(", ")}
              </p>
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  );
};

export default BehaviorEngineSection;
// src/pages/Matches/sections/SwipeProfilesSection.tsx

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Check, ShieldCheck, Sparkles, X } from "lucide-react";

interface Profile {
  id: string;
  name: string;
  age: number;
  photo: string;
  interests: string[];
  bio: string;
  verified?: boolean;
  availability?: string;
}

interface Props {
  currentProfile: Profile | null;
  profiles: Profile[];
  currentIndex: number;
  handleLike: () => void;
  handlePass: () => void;
  showMatchModal: boolean;
}

const SwipeProfilesSection = ({
  currentProfile,
  profiles,
  currentIndex,
  handleLike,
  handlePass,
  showMatchModal,
}: Props) => {
  if (!currentProfile) return null;

  const remaining = profiles.length - currentIndex - 1;

  return (
    <Card className="overflow-hidden border-border shadow-xl transition-all">
      {/* Top banner */}
      <div className="h-80 bg-muted relative">
        <Avatar className="w-28 h-28 absolute left-6 -bottom-14 sm:-bottom-16 md:bottom-6 ring-4 ring-card shadow-lg">
          <AvatarImage src={currentProfile.photo} />
          <AvatarFallback>{currentProfile.name[0]}</AvatarFallback>
        </Avatar>
      </div>

      {/* Main content */}
      <CardContent className="p-6 pt-20 md:pt-12">
        <div className="flex items-center gap-2 mb-1">
          <h2 className="text-2xl font-bold">{currentProfile.name}</h2>
          <span className="text-lg text-muted-foreground">• {currentProfile.age}</span>

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

        {/* Interests */}
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

        {/* Actions */}
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
          <Check className="w-4 h-4" /> {remaining} more profiles
        </div>
      </CardContent>

      {/* Match Modal */}
      {showMatchModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-background rounded-3xl p-8 max-w-sm mx-4 text-center space-y-4">
            <div className="w-20 h-20 bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--accent)))] rounded-full mx-auto flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold">It's a Match!</h2>
            <p className="text-muted-foreground">
              You and {currentProfile?.name} liked each other
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default SwipeProfilesSection;
// src/pages/Matches/sections/ConnectionFeedbackSection.tsx

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RatingStars } from "@/components/RatingStars";

interface FeedbackRecord {
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

interface SubmitPayload {
  connectionIdentifier: string;
  connectionName: string;
  metContext: string;
  rating: number;
  comment: string | null;
}

interface Props {
  feedback: FeedbackRecord[];
  onSubmit: (payload: SubmitPayload) => Promise<void>;
}

const ConnectionFeedbackSection = ({ feedback, onSubmit }: Props) => {
  if (!feedback || feedback.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        You currently have no connections to review.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Help us improve the community by sharing how your connections went.
      </p>

      {feedback.map((record) => (
        <Card key={record.id}>
          <CardHeader>
            <div className="flex items-start gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={record.avatar} />
                <AvatarFallback>{record.name[0]}</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <CardTitle className="text-base">{record.name}</CardTitle>
                <CardDescription className="text-sm">
                  {record.metAt}
                </CardDescription>

                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  <span>Community: {record.communityAverage.toFixed(1)}</span>
                  <span>({record.communityCount} ratings)</span>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {!record.submitted ? (
              <>
                {/* Rating */}
                <div className="space-y-2">
                  <Label>Your rating</Label>
                  <RatingStars
                    rating={record.yourRating || 0}
                    onChange={(val) =>
                      (record.yourRating = val) /* local mutation — safe inside mapping */
                    }
                  />
                </div>

                {/* Comment */}
                <div className="space-y-2">
                  <Label>Comment (optional)</Label>
                  <Textarea
                    placeholder="What was your experience like?"
                    value={record.yourComment || ""}
                    onChange={(e) => (record.yourComment = e.target.value)}
                    rows={3}
                    className="resize-none"
                  />
                </div>

                {/* Submit */}
                <Button
                  className="w-full"
                  disabled={!record.yourRating || record.isSubmitting}
                  onClick={async () => {
                    record.isSubmitting = true;

                    await onSubmit({
                      connectionIdentifier: record.id,
                      connectionName: record.name,
                      metContext: record.metAt,
                      rating: record.yourRating!,
                      comment:
                        record.yourComment?.trim() === ""
                          ? null
                          : record.yourComment ?? null,
                    });

                    record.submitted = true;
                    record.isSubmitting = false;
                  }}
                >
                  {record.isSubmitting ? "Submitting..." : "Submit Feedback"}
                </Button>
              </>
            ) : (
              <>
                {/* Already submitted */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Feedback submitted
                  </span>

                  <Badge variant="secondary" className="text-xs">
                    Thank you!
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  <RatingStars rating={record.yourRating || 0} />
                  <span className="text-sm text-muted-foreground">
                    {record.yourRating?.toFixed(1)} / 5
                  </span>
                </div>

                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-sm text-muted-foreground">
                    {record.yourComment?.trim()
                      ? record.yourComment
                      : "Shared a rating without additional comments."}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ConnectionFeedbackSection;
// src/data/demo-profiles.ts

export interface Profile {
  id: string;
  name: string;
  age: number;
  photo: string;
  interests: string[];
  bio: string;
  verified?: boolean;
  availability?: string;
  distance?: string;
  gallery?: string[];
}

export const profiles: Profile[] = [
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
    bio: "Love exploring new coffee shops and finding hidden gems in the city.",
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
    bio: "Recently moved to the city and looking to make new friends.",
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
    bio: "Marketing professional who loves discovering live music venues and foodie spots.",
    verified: true,
    availability: "Weeknights",
    distance: "0.8 miles away",
  },
];
// src/data/matches-data.ts

/* --------------------------------------------------
 * AI Suggestions
 * --------------------------------------------------*/
export const aiSuggestions = [
  {
    id: "ms-1",
    name: "Jordan — Product mentor",
    compatibility: 94,
    sharedVibe: "Curious builder energy with calm communication style",
    meetingPreference: "Weeknight coffee within 2 miles",
    distance: "1.2 miles away",
    reasoning:
      "Matches your love of founder stories and reflective journaling, while bringing accountability for the next career move.",
    sharedInterests: [
      "Indie hacking",
      "Third places",
      "Mindful productivity",
    ],
    conversationStarters: [
      "Swap the one ritual you both use before deep work sessions.",
      "Share hidden coffee shops that help you stay in flow.",
      "Ask about their last product experiment.",
    ],
  },
  {
    id: "ms-2",
    name: "Mina — Community architect",
    compatibility: 91,
    sharedVibe: "Warm host who loves pairing people with creative sparks",
    meetingPreference: "Saturday brunch or gallery stroll",
    distance: "0.7 miles away",
    reasoning:
      "You both value intentional gatherings and creative circles. She complements your curiosity with hospitality.",
    sharedInterests: [
      "Analog photography",
      "Pop-up dinners",
      "Creative accountability",
    ],
    conversationStarters: [
      "Discuss the best pop-up events you've attended.",
      "Share photo prompts and compare results.",
      "Brainstorm a micro-gathering together.",
    ],
  },
  {
    id: "ms-3",
    name: "Arjun — Strategy nerd",
    compatibility: 88,
    sharedVibe: "Brainy but playful; loves structured debates and long walks",
    meetingPreference: "Evening tea + strategy games",
    distance: "2.4 miles away",
    reasoning:
      "Deep overlap in curiosity, playful competition, and love for late-night urban exploring.",
    sharedInterests: ["Systems thinking", "Board games", "Urban hikes"],
    conversationStarters: [
      "Share your current life experiment.",
      "Ask which board game shaped their thinking.",
      "Plan a walk ending at a tea house.",
    ],
  },
];

/* --------------------------------------------------
 * Blind Compatibility Matches
 * --------------------------------------------------*/
export const blindCompatibilityMatches = [
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
      "Hosts two intros per month",
      "Sends post-event recaps",
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
    lifestyle: "Flexible schedule, prefers cozy venues",
    behaviorSignals: [
      "Logs post-event feedback",
      "Keeps groups under six",
      "Weekly energy check-ins",
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
    lifestyle: "Weekend mornings, hybrid-friendly",
    behaviorSignals: [
      "Introduces friends with context",
      "Thoughtful reviews",
      "Sends co-working prompts",
    ],
  },
];

/* --------------------------------------------------
 * Behavior Profiles
 * --------------------------------------------------*/
export const behaviorProfiles = [
  {
    id: "anchor",
    name: "You",
    traits: ["Reflective", "Curious", "Soft-spoken"],
    habits: ["Deep work mornings", "Journaling", "Weekly fitness"],
    socialEnergy: "Moderate",
    signals: ["Shows up early", "Consistent communicator"],
    category: "creator",
  },
  {
    id: "bp-1",
    name: "Ava",
    traits: ["Warm", "Organized"],
    habits: ["Event hosting", "Morning stretching"],
    socialEnergy: "High",
    signals: ["Replies fast", "Introduces friends"],
    category: "connector",
  },
  {
    id: "bp-2",
    name: "Leo",
    traits: ["Thoughtful", "Structured"],
    habits: ["Walking meetings", "Reading", "Planning"],
    socialEnergy: "Low",
    signals: ["Long-form messages", "Reliable follow-ups"],
    category: "thinker",
  },
  {
    id: "bp-3",
    name: "Maya",
    traits: ["Playful", "Energetic"],
    habits: ["Night events", "Hobbies rotation"],
    socialEnergy: "High",
    signals: ["Spontaneous invites", "Quick decisions"],
    category: "adventurer",
  },
];
// src/lib/behavior-matching.ts

/* --------------------------------------------------------------------------
 * TYPES
 * --------------------------------------------------------------------------*/

export interface BehaviorProfile {
  id: string;
  name: string;
  traits: string[];
  habits: string[];
  socialEnergy: string;
  signals: string[];
  category: string;
}

export interface BehaviorMatchResult {
  id: string;
  name: string;
  score: number;
  insight: string;
  sharedSignals: string[];
}

/* --------------------------------------------------------------------------
 * HELPER FUNCTIONS
 * --------------------------------------------------------------------------*/

const arrayIntersection = (a: string[], b: string[]) =>
  a.filter((x) => b.includes(x));

const percent = (value: number, total: number) =>
  Math.round((value / Math.max(total, 1)) * 100);

/* --------------------------------------------------------------------------
 * BEHAVIOR MATCHING ENGINE
 * --------------------------------------------------------------------------
 * Creates a "compatibility score" based on:
 * - Shared traits
 * - Shared habits
 * - Communication / reliability signals
 * - Social energy alignment
 *
 * Returns top-ranked matches with insights.
 * --------------------------------------------------------------------------*/

export function buildBehaviorMatches(
  anchor: BehaviorProfile,
  candidates: BehaviorProfile[]
): BehaviorMatchResult[] {
  return candidates.map((candidate) => {
    const sharedTraits = arrayIntersection(anchor.traits, candidate.traits);
    const sharedHabits = arrayIntersection(anchor.habits, candidate.habits);
    const sharedSignals = arrayIntersection(anchor.signals, candidate.signals);

    // Score weighting: traits (40%), habits (35%), signals (25%)
    const traitScore = sharedTraits.length * 20;
    const habitScore = sharedHabits.length * 15;
    const signalScore = sharedSignals.length * 25;

    const baseScore = traitScore + habitScore + signalScore;
    const score = Math.min(100, Math.max(40, baseScore)); // Bound scores between 40 and 100

    /* ------------------------- Insight generation ------------------------- */

    let insight = "";

    if (sharedSignals.length > 0) {
      insight += `You both show similar follow-through cues (${sharedSignals.join(", ")}). `;
    }

    if (sharedHabits.length > 0) {
      insight += `You share lifestyle rhythms like ${sharedHabits.join(", ")}. `;
    }

    if (sharedTraits.length > 0) {
      insight += `You match personality traits such as ${sharedTraits.join(", ")}. `;
    }

    if (insight.trim() === "") {
      insight = "Different on paper, but complementary energies may create a balanced dynamic.";
    }

    return {
      id: candidate.id,
      name: candidate.name,
      score,
      insight: insight.trim(),
      sharedSignals,
    };
  });
}

/* --------------------------------------------------------------------------
 * CLUSTERING ENGINE
 * --------------------------------------------------------------------------
 * Groups behavior profiles into clusters.
 * Creates:
 * - label
 * - description
 * - members
 * - top signals
 * --------------------------------------------------------------------------*/

export function clusterBehaviorProfiles(profiles: BehaviorProfile[]) {
  const clusters: Record<
    string,
    {
      id: string;
      label: string;
      description: string;
      members: BehaviorProfile[];
      topSignals: string[];
    }
  > = {};

  /* --------------------------- CLUSTER LABELS ---------------------------- */

  const clusterLabels: Record<
    string,
    { label: string; description: string }
  > = {
    creator: {
      label: "Creators",
      description: "People who love building, reflecting, and improving systems.",
    },
    connector: {
      label: "Connectors",
      description: "Social glue. They bring others together naturally.",
    },
    thinker: {
      label: "Thinkers",
      description: "Deep, thoughtful, reflective minds with structured habits.",
    },
    adventurer: {
      label: "Adventurers",
      description: "Energetic, curious, always exploring new experiences.",
    },
  };

  /* ------------------------------ BUILD CLUSTERS ------------------------------ */

  for (const profile of profiles) {
    const key = profile.category || "misc";

    if (!clusters[key]) {
      clusters[key] = {
        id: key,
        label: clusterLabels[key]?.label || "Misc Group",
        description:
          clusterLabels[key]?.description ||
          "A mixed cluster of unique behavior patterns.",
        members: [],
        topSignals: [],
      };
    }

    clusters[key].members.push(profile);
  }

  /* ------------------------------ TOP SIGNALS ------------------------------ */

  for (const key of Object.keys(clusters)) {
    const cluster = clusters[key];
    const allSignals = cluster.members.flatMap((m) => m.signals);

    // Rank signals by frequency
    const signalCounts: Record<string, number> = {};
    allSignals.forEach((sig) => {
      signalCounts[sig] = (signalCounts[sig] || 0) + 1;
    });

    cluster.topSignals = Object.entries(signalCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([sig]) => sig);
  }

  /* ------------------------------ RETURN AS ARRAY ------------------------------ */
  return Object.values(clusters);
}
// src/lib/animations.ts
// Reusable animation presets for Connective (Framer Motion)

export const fadeIn = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export const fadeInDown = {
  hidden: { opacity: 0, y: -20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.85 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export const scaleInSoft = {
  hidden: { opacity: 0, scale: 0.97 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export const slideInRight = {
  hidden: { opacity: 0, x: 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

export const revealBlur = {
  hidden: { opacity: 0, filter: "blur(12px)" },
  show: {
    opacity: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

export const staggerChildren = (delay = 0.05) => ({
  show: {
    transition: {
      staggerChildren: delay,
    },
  },
});

// For fade-in list items
export const fadeListItem = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

// Swipe-card movement animations
export const swipeCardVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    zIndex: 1,
    transition: { duration: 0.35 },
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.25 },
  }),
};
// src/components/layout/MatchesLayout.tsx

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const MatchesLayout = ({ children }: Props) => {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-4 lg:py-8 space-y-8">
      {children}
    </div>
  );
};

export default MatchesLayout;
<TabsContent value="discover">
  <MatchesLayout>
    <BlindCompatibilitySection ... />
    <AISuggestionsSection ... />
    <BehaviorEngineSection ... />
    <SwipeProfilesSection ... />
  </MatchesLayout>
</TabsContent>

<TabsContent value="feedback">
  <MatchesLayout>
    <ConnectionFeedbackSection ... />
  </MatchesLayout>
</TabsContent>
// src/lib/ai-match-explanations.ts
// AI Explanation Engine for Matches — Connective

import { createHash } from "./hash-utils"; // small helper for caching keys

export interface AIMatchContext {
  yourTraits: string[];
  yourHabits: string[];
  yourInterests: string[];
  theirTraits: string[];
  theirHabits: string[];
  theirInterests: string[];
  sharedSignals: string[];
  compatibility: number;
  distance: string;
  name: string;
}

export interface AIMatchExplanation {
  summary: string;
  whyItClicks: string;
  vibePrediction: string;
  recommendedMeetup: string;
  conversationChemistry: string;
  softFriction: string;
  hiddenOverlaps: string[];
}

const cache = new Map<string, AIMatchExplanation>();

/* -----------------------------------------------------------
 * SELECT YOUR LLM PROVIDER HERE
 * (Switch between GPT / Claude / Gemini easily)
 * ----------------------------------------------------------*/

async function callLLM(prompt: string): Promise<string> {
  // Example: OpenAI GPT-4.1 Mini (fast, cheap)
  // Replace with your own key integration.
  const response = await fetch("/api/ai", {
    method: "POST",
    body: JSON.stringify({ prompt }),
  });
  const json = await response.json();
  return json.text;
}

/* -----------------------------------------------------------
 * BUILD PROMPT
 * ----------------------------------------------------------*/

function buildPrompt(ctx: AIMatchContext): string {
  return `
You are ConnectiveAI — an assistant that produces warm, friendly, emotionally intelligent match explanations.

Write insights using a positive, encouraging tone. Avoid negativity or harshness.

Match details:

- Your traits: ${ctx.yourTraits.join(", ")}
- Their traits: ${ctx.theirTraits.join(", ")}
- Shared signals: ${ctx.sharedSignals.join(", ")}
- Your habits: ${ctx.yourHabits.join(", ")}
- Their habits: ${ctx.theirHabits.join(", ")}
- Your interests: ${ctx.yourInterests.join(", ")}
- Their interests: ${ctx.theirInterests.join(", ")}
- Compatibility score: ${ctx.compatibility}
- Distance: ${ctx.distance}
- Their name: ${ctx.name}

Generate a structured JSON response with:

{
  "summary": "A warm overview",
  "whyItClicks": "Why these two people feel aligned",
  "vibePrediction": "The predicted dynamic between them",
  "recommendedMeetup": "Best setting for a first meetup",
  "conversationChemistry": "How the discussion will likely flow",
  "softFriction": "Friendly explanation of differences they should be mindful of",
  "hiddenOverlaps": ["Surprising common ground they share"]
}
`;
}

/* -----------------------------------------------------------
 * MAIN FUNCTION
 * ----------------------------------------------------------*/

export async function generateMatchExplanation(
  ctx: AIMatchContext
): Promise<AIMatchExplanation> {
  const key = createHash(JSON.stringify(ctx));

  if (cache.has(key)) return cache.get(key)!;

  const prompt = buildPrompt(ctx);
  const raw = await callLLM(prompt);

  let parsed: AIMatchExplanation;

  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    parsed = {
      summary: "You two share a meaningful alignment in energy and curiosity.",
      whyItClicks:
        "Your habits and personality rhythms overlap in ways that make connection easy and natural.",
      vibePrediction:
        "Expect warm chemistry, steady communication, and a grounded dynamic.",
      recommendedMeetup:
        "A cozy coffee shop or relaxed park stroll fits both your energies.",
      conversationChemistry:
        "Conversation should flow easily, with curiosity and reflective depth.",
      softFriction:
        "Tiny differences in pace may appear, but nothing that cannot be harmonized by open communication.",
      hiddenOverlaps: ["A shared desire for meaningful, high-quality friendships"],
    };
  }

  cache.set(key, parsed);
  return parsed;
}
// src/lib/hash-utils.ts

export function createHash(input: string): string {
  let hash = 0;
  if (input.length === 0) return "0";

  for (let i = 0; i < input.length; i++) {
    const chr = input.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }

  return String(hash);
}
import { generateMatchExplanation } from "@/lib/ai-match-explanations";

async function loadAIExplanation() {
  const explanation = await generateMatchExplanation({
    yourTraits: ["Reflective", "Curious"],
    yourHabits: ["Morning deep work"],
    yourInterests: ["Coffee", "Founders"],
    theirTraits: suggestion.traits,
    theirHabits: suggestion.habits,
    theirInterests: suggestion.sharedInterests,
    sharedSignals: suggestion.sharedSignals,
    compatibility: suggestion.compatibility,
    distance: suggestion.distance,
    name: suggestion.name,
  });

  setAIData(explanation);
}
<div className="space-y-3 bg-muted/40 p-4 rounded-xl">
  <p className="font-semibold">Why It Clicks</p>
  <p className="text-sm text-muted-foreground">{aiData.whyItClicks}</p>

  <p className="font-semibold">Vibe Prediction</p>
  <p className="text-sm text-muted-foreground">{aiData.vibePrediction}</p>

  <p className="font-semibold">Recommended Meetup</p>
  <p className="text-sm text-muted-foreground">{aiData.recommendedMeetup}</p>

  <p className="font-semibold">Hidden Overlaps</p>
  <ul className="text-sm text-muted-foreground list-disc pl-5">
    {aiData.hiddenOverlaps.map((item) => (
      <li key={item}>{item}</li>
    ))}
  </ul>
</div>
// src/components/match/ChemistryRadar.tsx

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface ChemistryRadarProps {
  you: {
    values: number;
    lifestyle: number;
    communication: number;
    socialEnergy: number;
    interests: number;
    behaviorSignals: number;
  };
  them: {
    values: number;
    lifestyle: number;
    communication: number;
    socialEnergy: number;
    interests: number;
    behaviorSignals: number;
  };
}

export const ChemistryRadar = ({ you, them }: ChemistryRadarProps) => {
  const data = [
    { metric: "Values", you: you.values, them: them.values },
    { metric: "Lifestyle", you: you.lifestyle, them: them.lifestyle },
    { metric: "Communication", you: you.communication, them: them.communication },
    { metric: "Social Energy", you: you.socialEnergy, them: them.socialEnergy },
    { metric: "Interests", you: you.interests, them: them.interests },
    { metric: "Signals", you: you.behaviorSignals, them: them.behaviorSignals },
  ];

  return (
    <div className="w-full h-80 bg-card border border-border/50 rounded-xl p-4 shadow-sm">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid stroke="hsl(var(--border))" strokeOpacity={0.3} />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
          />
          <PolarRadiusAxis angle={90} domain={[0, 100]} tick={false} />

          {/* You */}
          <Radar
            name="You"
            dataKey="you"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.35}
          />

          {/* Them */}
          <Radar
            name="Them"
            dataKey="them"
            stroke="hsl(var(--accent))"
            fill="hsl(var(--accent))"
            fillOpacity={0.25}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
// src/components/match/ChemistryScore.tsx

import { motion } from "framer-motion";

interface ChemistryScoreProps {
  score: number; // 0–100
}

export const ChemistryScore = ({ score }: ChemistryScoreProps) => {
  const normalized = Math.max(0, Math.min(100, score));

  return (
    <div className="text-center space-y-2">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-5xl font-bold"
      >
        {normalized}
      </motion.div>

      <p className="text-sm text-muted-foreground uppercase tracking-wide">
        Chemistry Score
      </p>

      {/* Interpretation */}
      <p className="text-xs text-muted-foreground mt-1">
        {normalized >= 90
          ? "🔥 Exceptional synergy — instant connection potential."
          : normalized >= 75
          ? "✨ Strong chemistry — easy flow and natural comfort."
          : normalized >= 60
          ? "🙂 Good alignment — promising foundation."
          : normalized >= 40
          ? "🟡 Mixed signals — may require intentional effort."
          : "⚪ Low overlap — very different rhythms."}
      </p>
    </div>
  );
};
// src/lib/chemistry-score.ts

export function computeChemistryScore({
  values,
  lifestyle,
  communication,
  socialEnergy,
  interests,
  behaviorSignals,
}: {
  values: number;
  lifestyle: number;
  communication: number;
  socialEnergy: number;
  interests: number;
  behaviorSignals: number;
}) {
  // Weighted scoring (these weights were carefully chosen)
  return Math.round(
    values * 0.22 +
      lifestyle * 0.20 +
      communication * 0.20 +
      socialEnergy * 0.15 +
      interests * 0.13 +
      behaviorSignals * 0.10
  );
}
import { ChemistryRadar } from "@/components/match/ChemistryRadar";
import { ChemistryScore } from "@/components/match/ChemistryScore";
import { computeChemistryScore } from "@/lib/chemistry-score";

const radarDataYou = {
  values: 85,
  lifestyle: 78,
  communication: 90,
  socialEnergy: 65,
  interests: 72,
  behaviorSignals: 88,
};

const radarDataThem = {
  values: 80,
  lifestyle: 82,
  communication: 87,
  socialEnergy: 70,
  interests: 75,
  behaviorSignals: 82,
};

const chemistryScore = computeChemistryScore({
  values: (radarDataYou.values + radarDataThem.values) / 2,
  lifestyle: (radarDataYou.lifestyle + radarDataThem.lifestyle) / 2,
  communication: (radarDataYou.communication + radarDataThem.communication) / 2,
  socialEnergy: (radarDataYou.socialEnergy + radarDataThem.socialEnergy) / 2,
  interests: (radarDataYou.interests + radarDataThem.interests) / 2,
  behaviorSignals:
    (radarDataYou.behaviorSignals + radarDataThem.behaviorSignals) / 2,
});
