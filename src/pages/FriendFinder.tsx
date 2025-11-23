import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Bot,
  CalendarCheck,
  MapPin,
  MessageCircle,
  Sparkles,
  Users,
} from "lucide-react";
import BackButton from "@/components/BackButton";
import { usePageTitle } from "@/hooks/usePageTitle";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useSubscription } from "@/hooks/useSubscription";
import { cn } from "@/lib/utils";

interface FriendProfile {
  id: string;
  name: string;
  age: number;
  location: string;
  photo: string;
  compatibility: number;
  sharedInterests: string[];
  vibe: "energizing" | "grounding" | "creative" | "balanced";
  availability: "weeknights" | "weekends" | "mornings" | "flexible";
  introduction: string;
  highlights: string[];
  socialFormats: ("In-person" | "Digital" | "Hybrid")[];
  mutualConnections: number;
  badges: string[];
}

const friendProfiles: FriendProfile[] = [
  {
    id: "noah",
    name: "Noah Alvarez",
    age: 29,
    location: "Capitol Hill • 1.2 mi",
    photo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    compatibility: 92,
    sharedInterests: [
      "Sunrise hikes",
      "Coffee tasting",
      "Film photography",
      "Community volunteering",
    ],
    vibe: "energizing",
    availability: "weekends",
    introduction:
      "Hosts a Saturday sunrise hike and brunch club for new arrivals in the city.",
    highlights: ["Introduced 3 hiking buddies this month", "Leads weekend adventures"],
    socialFormats: ["In-person", "Hybrid"],
    mutualConnections: 4,
    badges: ["Trail leader", "Verified"],
  },
  {
    id: "amira",
    name: "Amira Chen",
    age: 32,
    location: "Ballard • 3.4 mi",
    photo:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=900&q=80",
    compatibility: 88,
    sharedInterests: [
      "Supper clubs",
      "Live music",
      "Storytelling nights",
      "Zero-proof mixology",
    ],
    vibe: "creative",
    availability: "weeknights",
    introduction:
      "Curates an invite-only dinner party for creatives looking to collaborate.",
    highlights: ["Hosts monthly supper club", "Audio producer by day"],
    socialFormats: ["In-person"],
    mutualConnections: 2,
    badges: ["Community host"],
  },
  {
    id: "darius",
    name: "Darius Kaur",
    age: 34,
    location: "South Lake • 0.9 mi",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
    compatibility: 85,
    sharedInterests: [
      "Startup roundtables",
      "Language exchange",
      "Sunday soccer",
      "Board game strategy",
    ],
    vibe: "balanced",
    availability: "flexible",
    introduction:
      "Runs a Sunday co-working and accountability group for multilingual founders.",
    highlights: ["Shares weekly accountability prompts", "Goal-focused"],
    socialFormats: ["Hybrid", "Digital"],
    mutualConnections: 3,
    badges: ["Accountability partner"],
  },
  {
    id: "lucia",
    name: "Lucia Romero",
    age: 27,
    location: "Fremont • 2.1 mi",
    photo:
      "https://images.unsplash.com/photo-1542596768-5d1d21f1cf98?auto=format&fit=crop&w=900&q=80",
    compatibility: 90,
    sharedInterests: [
      "Indie film club",
      "Rooftop yoga",
      "Gallery hopping",
      "Plant swaps",
    ],
    vibe: "grounding",
    availability: "weeknights",
    introduction:
      "Looking for a co-host to expand her mindful movement and film nights.",
    highlights: ["Mindful energy", "Great with small group facilitation"],
    socialFormats: ["In-person"],
    mutualConnections: 1,
    badges: ["Mindful guide", "Rising leader"],
  },
  {
    id: "marco",
    name: "Marco Silva",
    age: 31,
    location: "Queen Anne • 1.8 mi",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=900&q=80",
    compatibility: 82,
    sharedInterests: [
      "Urban gardening",
      "Cycling meetups",
      "Local podcasts",
      "Pop-up markets",
    ],
    vibe: "energizing",
    availability: "mornings",
    introduction:
      "Produces a neighborhood podcast and searches for collaborators for the next season.",
    highlights: ["Seeking co-host", "Organizes monthly skill swaps"],
    socialFormats: ["Hybrid"],
    mutualConnections: 5,
    badges: ["Connector"],
  },
  {
    id: "harper",
    name: "Harper Lin",
    age: 28,
    location: "Greenwood • 2.6 mi",
    photo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80&sat=-15&exp=10",
    compatibility: 87,
    sharedInterests: [
      "Farmers markets",
      "Sustainable fashion",
      "Ceramic classes",
      "Community gardens",
    ],
    vibe: "grounding",
    availability: "weeknights",
    introduction:
      "Hosts a rotating clothes swap and eco-crafting circle with friends from different neighborhoods.",
    highlights: ["Runs a monthly upcycling challenge", "Loves mindful mornings"],
    socialFormats: ["In-person"],
    mutualConnections: 2,
    badges: ["Eco leader"],
  },
  {
    id: "zeke",
    name: "Zeke Montoya",
    age: 30,
    location: "Capitol Hill • 1.0 mi",
    photo:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=900&q=80&sat=10",
    compatibility: 91,
    sharedInterests: [
      "Indie game jams",
      "Retro arcades",
      "Urban cycling",
      "Live coding nights",
    ],
    vibe: "energizing",
    availability: "weekends",
    introduction:
      "Organizes a Saturday night pop-up arcade and invites new people to showcase their mini games.",
    highlights: ["Hosts micro-hackathons", "Brings projector for outdoor play"],
    socialFormats: ["Hybrid", "In-person"],
    mutualConnections: 6,
    badges: ["Event starter"],
  },
  {
    id: "selene",
    name: "Selene Park",
    age: 33,
    location: "Westlake • 1.7 mi",
    photo:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80&sat=5",
    compatibility: 89,
    sharedInterests: [
      "Poetry slams",
      "Sunrise runs",
      "Tea ceremonies",
      "Minimalist design",
    ],
    vibe: "grounding",
    availability: "mornings",
    introduction:
      "Invites runners to cool-down tea rituals after exploring new lakefront routes at dawn.",
    highlights: ["Shares weekly route maps", "Brings hand-blended teas"],
    socialFormats: ["In-person"],
    mutualConnections: 3,
    badges: ["Calm energy"],
  },
  {
    id: "jamal",
    name: "Jamal Rivers",
    age: 35,
    location: "Pioneer Square • 0.6 mi",
    photo:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=900&q=80&sat=15",
    compatibility: 86,
    sharedInterests: [
      "Street photography",
      "Jazz vinyl",
      "Night markets",
      "Community storytelling",
    ],
    vibe: "creative",
    availability: "flexible",
    introduction:
      "Leads twilight photo walks through historic districts and pairs them with listening sessions afterward.",
    highlights: ["Prints zines for the group", "Captures candid portraits"],
    socialFormats: ["Hybrid"],
    mutualConnections: 4,
    badges: ["Story keeper"],
  },
  {
    id: "talia",
    name: "Talia Mendes",
    age: 26,
    location: "University District • 4.0 mi",
    photo:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80&sat=12",
    compatibility: 83,
    sharedInterests: [
      "Bookbinding",
      "Indie films",
      "Language exchange",
      "Weekend brunches",
    ],
    vibe: "creative",
    availability: "weekends",
    introduction:
      "Runs a bilingual film club with post-screening discussions and invites guests to share favorite poems.",
    highlights: ["Brings handmade notebooks", "Helps newcomers feel at home"],
    socialFormats: ["In-person", "Hybrid"],
    mutualConnections: 2,
    badges: ["Culture curator"],
  },
  {
    id: "mia",
    name: "Mia Duarte",
    age: 29,
    location: "SoDo • 3.1 mi",
    photo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80&sat=-10",
    compatibility: 84,
    sharedInterests: [
      "Indoor climbing",
      "Vegan baking",
      "Community theater",
      "Dog park meetups",
    ],
    vibe: "energizing",
    availability: "flexible",
    introduction:
      "Pairs climbing sessions with post-climb recipe swaps and invites folks to bring their pups.",
    highlights: ["Organizes friendly belay rotations", "Shares plant-based treats"],
    socialFormats: ["In-person"],
    mutualConnections: 1,
    badges: ["Uplifter"],
  },
  {
    id: "ivy",
    name: "Ivy Sinclair",
    age: 27,
    location: "Wallingford • 3.3 mi",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=900&q=80&sat=18",
    compatibility: 82,
    sharedInterests: [
      "Vintage markets",
      "Letterpress",
      "Cozy game nights",
      "Stationery swaps",
    ],
    vibe: "creative",
    availability: "weeknights",
    introduction:
      "Curates small letterpress workshops and invites guests to design postcards for their pen pals.",
    highlights: ["Hosts cozy board-game salons", "Brings limited-edition inks"],
    socialFormats: ["In-person", "Hybrid"],
    mutualConnections: 2,
    badges: ["Design eye"],
  },
  {
    id: "amir",
    name: "Amir Haddad",
    age: 34,
    location: "South Lake • 1.5 mi",
    photo:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=900&q=80&sat=14",
    compatibility: 93,
    sharedInterests: [
      "Tech salons",
      "Host-led dinners",
      "Chess meetups",
      "VR demos",
    ],
    vibe: "energizing",
    availability: "flexible",
    introduction:
      "Runs a monthly chess and cuisine night where each course sparks a debate about future tech.",
    highlights: ["Brings VR headset for demos", "Pairs people by interests"],
    socialFormats: ["Hybrid"],
    mutualConnections: 8,
    badges: ["Matchmaker"],
  },
  {
    id: "sana",
    name: "Sana Rahman",
    age: 30,
    location: "Ballard • 3.6 mi",
    photo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80&sat=6",
    compatibility: 85,
    sharedInterests: [
      "Run clubs",
      "Cold plunges",
      "Guided journaling",
      "Sound baths",
    ],
    vibe: "grounding",
    availability: "mornings",
    introduction:
      "Hosts sunrise run-and-reflect sessions that end with a calm journaling circle by the water.",
    highlights: ["Shares weekly prompts", "Keeps the pace inclusive"],
    socialFormats: ["In-person"],
    mutualConnections: 3,
    badges: ["Mindful guide"],
  },
  {
    id: "leo",
    name: "Leo Andrade",
    age: 32,
    location: "First Hill • 0.9 mi",
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80&sat=16",
    compatibility: 81,
    sharedInterests: [
      "Pick-up soccer",
      "Street tacos",
      "Documentaries",
      "Public speaking clubs",
    ],
    vibe: "balanced",
    availability: "weekends",
    introduction:
      "Leads a bilingual soccer-and-tacos meetup that rotates neighborhood pitches every Sunday.",
    highlights: ["Encourages new players", "Shares documentary recs"],
    socialFormats: ["In-person"],
    mutualConnections: 4,
    badges: ["Team builder"],
  },
  {
    id: "yara",
    name: "Yara El-Sayed",
    age: 29,
    location: "Columbia City • 4.2 mi",
    photo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80&sat=9",
    compatibility: 88,
    sharedInterests: [
      "Spoken word",
      "Open mics",
      "Community organizing",
      "Meditation",
    ],
    vibe: "creative",
    availability: "flexible",
    introduction:
      "Creates pop-up open mic nights with guided icebreakers so newcomers feel confident to share.",
    highlights: ["Provides gentle coaching", "Records high-quality audio"],
    socialFormats: ["Hybrid", "In-person"],
    mutualConnections: 6,
    badges: ["Amplifier"],
  },
  {
    id: "devon",
    name: "Devon Brooks",
    age: 33,
    location: "Madison Valley • 2.9 mi",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80&sat=11",
    compatibility: 92,
    sharedInterests: [
      "Board-game strategy",
      "Escape rooms",
      "Mystery novels",
      "Dumpling crawls",
    ],
    vibe: "energizing",
    availability: "weeknights",
    introduction:
      "Hosts a rotating mystery night that combines puzzle-solving with neighborhood dumpling tastings.",
    highlights: ["Creates custom riddles", "Pairs first-timers thoughtfully"],
    socialFormats: ["In-person"],
    mutualConnections: 3,
    badges: ["Puzzle master"],
  },
  {
    id: "callie",
    name: "Callie Nguyen",
    age: 25,
    location: "Central District • 1.4 mi",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80&sat=13",
    compatibility: 80,
    sharedInterests: [
      "Karaoke nights",
      "Stationery swaps",
      "Bubble tea crawls",
      "Digital art jams",
    ],
    vibe: "creative",
    availability: "flexible",
    introduction:
      "Organizes upbeat karaoke circles with illustrated lyric cards and dessert stops afterward.",
    highlights: ["Cheerleader energy", "Loves pairing people for duets"],
    socialFormats: ["Hybrid", "In-person"],
    mutualConnections: 1,
    badges: ["Joy bringer"],
  },
  {
    id: "rafe",
    name: "Rafe Coleman",
    age: 37,
    location: "Magnolia • 5.0 mi",
    photo:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=900&q=80&sat=4",
    compatibility: 85,
    sharedInterests: [
      "Sailing lessons",
      "Film scores",
      "Marathon training",
      "Mentorship",
    ],
    vibe: "balanced",
    availability: "mornings",
    introduction:
      "Invites small groups for dawn harbor runs followed by a beginner-friendly sailing primer.",
    highlights: ["Shares tempo playlists", "Offers gentle coaching"],
    socialFormats: ["In-person"],
    mutualConnections: 5,
    badges: ["Guide"],
  },
  {
    id: "brielle",
    name: "Brielle Foster",
    age: 28,
    location: "Georgetown • 4.4 mi",
    photo:
      "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?auto=format&fit=crop&w=900&q=80&sat=17",
    compatibility: 83,
    sharedInterests: [
      "Maker fairs",
      "Robotics club",
      "Live jazz",
      "Bikepacking",
    ],
    vibe: "energizing",
    availability: "weekends",
    introduction:
      "Pairs hands-on maker nights with live music intermissions to help people mingle naturally.",
    highlights: ["Brings soldering kits", "Has backup bikes to share"],
    socialFormats: ["Hybrid", "In-person"],
    mutualConnections: 2,
    badges: ["Builder"],
  },
];

const quickFilters = [
  "Accountability partners",
  "Outdoor adventures",
  "Creative collabs",
  "Skill swapping",
  "New to town",
];

const vibeOptions: Array<{ value: FriendProfile["vibe"] | "all"; label: string }> = [
  { value: "all", label: "All vibes" },
  { value: "balanced", label: "Balanced energy" },
  { value: "energizing", label: "High-energy" },
  { value: "grounding", label: "Grounding" },
  { value: "creative", label: "Creative spark" },
];

const availabilityOptions: Array<{
  value: FriendProfile["availability"] | "any";
  label: string;
}> = [
  { value: "any", label: "Anytime" },
  { value: "weeknights", label: "Weeknights" },
  { value: "weekends", label: "Weekends" },
  { value: "mornings", label: "Early mornings" },
  { value: "flexible", label: "Flexible schedule" },
];

const FriendFinder = () => {
  const navigate = useNavigate();
  usePageTitle("Friend Finder");
  const { toast } = useToast();
  const { userId, tier, requireProFeature } = useSubscription();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [selectedVibe, setSelectedVibe] = useState<FriendProfile["vibe"] | "all">(
    "all",
  );
  const [selectedAvailability, setSelectedAvailability] = useState<
    FriendProfile["availability"] | "any"
  >("any");
  const [onlyInPerson, setOnlyInPerson] = useState(false);
  const [activeProfileIndex, setActiveProfileIndex] = useState(0);

  const availableInterests = useMemo(
    () =>
      Array.from(
        new Set(friendProfiles.flatMap((profile) => profile.sharedInterests)),
      ).sort(),
    [],
  );

  const filteredProfiles = useMemo(() => {
    return friendProfiles.filter((profile) => {
      const matchesSearch = searchTerm
        ? profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          profile.sharedInterests.some((interest) =>
            interest.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : true;

      const matchesFilter =
        selectedFilters.length === 0 ||
        selectedFilters.some((filter) =>
          profile.highlights.some((highlight) =>
            highlight.toLowerCase().includes(filter.toLowerCase()),
          ),
        ) ||
        selectedFilters.some((filter) =>
          profile.sharedInterests.some((interest) =>
            interest.toLowerCase().includes(filter.toLowerCase()),
          ),
        );

      const matchesVibe =
        selectedVibe === "all" || profile.vibe === selectedVibe;

      const matchesAvailability =
        selectedAvailability === "any" ||
        profile.availability === selectedAvailability;

      const matchesFormat = onlyInPerson
        ? profile.socialFormats.includes("In-person")
        : true;

      return (
        matchesSearch &&
        matchesFilter &&
        matchesVibe &&
        matchesAvailability &&
        matchesFormat
      );
    });
  }, [searchTerm, selectedFilters, selectedVibe, selectedAvailability, onlyInPerson]);

  useEffect(() => {
    setActiveProfileIndex(0);
  }, [filteredProfiles]);

  const toggleFilter = (value: string) => {
    setSelectedFilters((prev) =>
      prev.includes(value)
        ? prev.filter((filter) => filter !== value)
        : [...prev, value],
    );
  };

  const activeProfile = filteredProfiles[activeProfileIndex];
  const isFirstProfile = activeProfileIndex === 0;
  const isLastProfile =
    filteredProfiles.length === 0 ||
    activeProfileIndex === filteredProfiles.length - 1;
  const hasMultipleProfiles = filteredProfiles.length > 1;

  const handleNextProfile = () => {
    setActiveProfileIndex((prev) => {
      if (filteredProfiles.length === 0 || prev >= filteredProfiles.length - 1) {
        return prev;
      }

      return prev + 1;
    });
  };

  const handlePreviousProfile = () => {
    setActiveProfileIndex((prev) => {
      if (filteredProfiles.length === 0 || prev <= 0) {
        return prev;
      }

      return prev - 1;
    });
  };

  const handleCardAdvance = () => {
    if (!hasMultipleProfiles || isLastProfile) return;
    handleNextProfile();
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardAdvance();
    }
  };

  const isProMember = tier === "pro";
  const isChatLocked = !userId || !isProMember;
  const primaryChatLabel = !userId
    ? "Sign in to chat"
    : isProMember
      ? "Start an intro chat"
      : "Unlock premium chat";
  const cardChatLabel = !userId
    ? "Sign in to chat"
    : isProMember
      ? "Message now"
      : "Message (Premium)";

  const ensureChatAccess = useCallback(
    (destination: string) => {
      if (!userId) {
        toast({
          title: "Sign in to start chatting",
          description: "Create a free account or sign in to message members.",
          action: (
            <ToastAction
              altText="Sign in"
              onClick={() => navigate("/login", { state: { next: destination } })}
            >
              Sign in
            </ToastAction>
          ),
        });
        return false;
      }

      if (!isProMember) {
        return requireProFeature();
      }

      return true;
    },
    [isProMember, navigate, requireProFeature, toast, userId],
  );

  const handleOpenMessages = useCallback(() => {
    const destination = "/messages";
    if (!ensureChatAccess(destination)) return;
    navigate(destination);
  }, [ensureChatAccess, navigate]);

  const handleStartChat = useCallback(
    (profileId: string) => {
      const destination = `/messages/${profileId}`;
      if (!ensureChatAccess(destination)) return;
      navigate(destination);
    },
    [ensureChatAccess, navigate],
  );

  const handleOpenConcierge = useCallback(() => {
    navigate("/concierge");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="px-4 py-4 flex items-center gap-3">
          <BackButton fallbackPath="/home" />
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Friend Finder
            </p>
            <h1 className="text-lg font-semibold leading-tight">
              Curated matches ready to meet
            </h1>
          </div>
        </div>
      </div>

      <div className="space-y-8 px-4 py-6">
        <Card className="border border-border/60 bg-card/80 backdrop-blur">
          <CardHeader className="space-y-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-[hsl(var(--highlight-text))]" />
              This week’s tailored intros
            </CardTitle>
            <CardDescription>
              These members mirror your interests and rhythm. Start a chat or
              save them to Matches Pro to unlock extended insights.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>5 new high-compatibility matches</span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4" />
              <span>3 openings for weekend plans</span>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-muted-foreground">
              Need a deeper dive?
              <Button
                variant="link"
                className="px-1 text-[hsl(var(--highlight-text))]"
                onClick={() => navigate("/matches")}
              >
                Open Matches workspace
              </Button>
            </div>
            <Button
              variant={isChatLocked ? "outline" : "default"}
              size="lg"
              className={cn(
                "flex w-full items-center justify-center gap-2 font-semibold transition-colors sm:w-auto",
                isChatLocked && "text-muted-foreground"
              )}
              onClick={handleOpenMessages}
            >
              <MessageCircle className="h-4 w-4" />
              {primaryChatLabel}
            </Button>
          </CardFooter>
        </Card>

        <Card className="relative overflow-hidden border border-border/60 bg-gradient-to-br from-primary/10 via-card to-background shadow-sm">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_0,rgba(255,255,255,0.08),transparent_30%)]" />
          <CardHeader className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="mt-1 rounded-full bg-primary/15 p-2 text-primary shadow-inner">
                <Bot className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-base">Concierge for curated intros</CardTitle>
                <CardDescription>
                  Let the Friendship Concierge handle invites, timing, and nudges
                  so your matches turn into real plans faster.
                </CardDescription>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-background/80 px-3 py-1">Plan-ready suggestions</span>
                  <span className="rounded-full bg-background/80 px-3 py-1">Coordinated meetups</span>
                  <span className="rounded-full bg-background/80 px-3 py-1">Smart follow-ups</span>
                </div>
              </div>
            </div>
            <Button
              size="lg"
              className="w-full gap-2 text-base font-semibold sm:w-auto"
              onClick={handleOpenConcierge}
            >
              <Bot className="h-4 w-4" />
              Open Concierge
            </Button>
          </CardHeader>
        </Card>

        <Card className="border border-border/60">
          <CardHeader className="space-y-4">
            <div className="space-y-2">
              <CardTitle className="text-base">Refine your matches</CardTitle>
              <CardDescription>
                Fine-tune by vibe, availability, and preferred formats to see
                who fits your flow.
              </CardDescription>
            </div>
            <div className="space-y-3">
              <Label htmlFor="friend-search" className="text-xs uppercase tracking-wide">
                Search interests or names
              </Label>
              <Input
                id="friend-search"
                placeholder="Try ‘coffee’, ‘trail’, or ‘board games’"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase text-muted-foreground">
                Quick filters
              </p>
              <div className="flex flex-wrap gap-2">
                {quickFilters.map((filter) => {
                  const isActive = selectedFilters.includes(filter);
                  return (
                    <Button
                      key={filter}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      className={cn("rounded-full", !isActive && "border-border/60")}
                      onClick={() => toggleFilter(filter)}
                    >
                      {filter}
                    </Button>
                  );
                })}
              </div>
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide">Preferred vibe</Label>
                <div className="flex flex-wrap gap-2">
                  {vibeOptions.map((option) => {
                    const isActive = selectedVibe === option.value;
                    return (
                      <Button
                        key={option.value}
                        size="sm"
                        variant={isActive ? "default" : "outline"}
                        className={cn("rounded-full text-xs", !isActive && "border-border/60")}
                        onClick={() => setSelectedVibe(option.value)}
                      >
                        {option.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wide">Availability</Label>
                <div className="flex flex-wrap gap-2">
                  {availabilityOptions.map((option) => {
                    const isActive = selectedAvailability === option.value;
                    return (
                      <Button
                        key={option.value}
                        size="sm"
                        variant={isActive ? "default" : "outline"}
                        className={cn("rounded-full text-xs", !isActive && "border-border/60")}
                        onClick={() => setSelectedAvailability(option.value)}
                      >
                        {option.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3 rounded-2xl border border-dashed border-border/60 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      In-person ready
                    </p>
                    <p className="text-sm font-medium">
                      Show members open to meeting locally
                    </p>
                  </div>
                  <Switch
                    checked={onlyInPerson}
                    onCheckedChange={setOnlyInPerson}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Perfect for planning hikes, cafés, or co-working sessions this
                  week.
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wide">
                Explore by shared interests
              </Label>
              <div className="flex flex-wrap gap-2">
                {availableInterests.map((interest) => {
                  const isActive = selectedFilters.includes(interest);
                  return (
                  <Badge
                    key={interest}
                    className={cn(
                      "cursor-pointer rounded-full px-3 py-1 text-xs transition-colors",
                      isActive
                        ? "bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--accent)))] text-[hsl(var(--primary-foreground))]"
                        : "bg-muted text-muted-foreground"
                    )}
                    onClick={() => toggleFilter(interest)}
                  >
                      {interest}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Swipe through curated introductions
              </p>
              <h2 className="text-2xl font-semibold">Matches picked for you</h2>
              <p className="text-sm text-muted-foreground">
                Profiles blend shared interests, mutual connections, and your
                preferred vibe for quick chemistry checks.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-full border-border/60 text-xs font-medium text-muted-foreground hover:bg-muted lg:w-auto"
              onClick={() => navigate("/matches")}
            >
              View full matcher workspace
            </Button>
          </div>

          <div className="space-y-4">
            {activeProfile ? (
              <>
                <Card
                  key={activeProfile.id}
                  className="group overflow-hidden border border-border/60 bg-card/70 backdrop-blur-sm transition-all duration-200 hover:-translate-y-1 hover:border-[hsl(var(--accent))]/70"
                >
                  <button
                    type="button"
                    onClick={handleCardAdvance}
                    onKeyDown={handleCardKeyDown}
                    aria-label={
                      !isLastProfile && hasMultipleProfiles
                        ? "Reveal the next introduction"
                        : "Profile preview"
                    }
                    aria-disabled={isLastProfile || !hasMultipleProfiles}
                    disabled={isLastProfile || !hasMultipleProfiles}
                    className={cn(
                      "relative aspect-[4/5] w-full overflow-hidden text-left transition-transform duration-300 focus:outline-none",
                      !isLastProfile && hasMultipleProfiles
                        ? "cursor-pointer focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        : "cursor-default"
                    )}
                  >
                    <img
                      src={activeProfile.photo}
                      alt={activeProfile.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                      <Badge className="rounded-full bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--accent)))] text-[hsl(var(--primary-foreground))] shadow-sm">
                        {activeProfile.compatibility}% match
                      </Badge>
                      {activeProfile.badges.map((badge) => (
                        <Badge
                          key={badge}
                          variant="secondary"
                          className="rounded-full bg-background/70 text-foreground backdrop-blur"
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
                      <div className="flex items-end justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-semibold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.45)]">
                            {activeProfile.name}
                          </h3>
                          <p className="text-sm text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.45)]">
                            {activeProfile.age} · {activeProfile.location}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 rounded-full bg-black/40 px-3 py-1 text-xs text-white shadow">
                          <MapPin className="h-3.5 w-3.5" />
                          Nearby
                        </div>
                      </div>
                    </div>
                  </button>

                  <CardContent className="space-y-4 p-5">
                    <p className="text-sm text-muted-foreground">
                      {activeProfile.introduction}
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">
                          Highlights
                        </p>
                        <ul className="space-y-2 text-sm text-foreground">
                          {activeProfile.highlights.map((highlight) => (
                            <li key={highlight} className="flex items-start gap-2">
                              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[hsl(var(--highlight-text))]" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">
                          Shared interests
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {activeProfile.sharedInterests.map((interest) => (
                            <Badge
                              key={interest}
                              variant="secondary"
                              className="rounded-full bg-muted text-foreground"
                            >
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">
                          Availability
                        </p>
                        <p className="text-sm font-medium text-foreground">
                          {activeProfile.availability === "flexible"
                            ? "Flexible schedule"
                            : activeProfile.availability === "mornings"
                              ? "Early mornings"
                              : activeProfile.availability === "weekends"
                                ? "Weekends"
                                : "Weeknights"}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase text-muted-foreground">
                          Preferred formats
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {activeProfile.socialFormats.map((format) => (
                            <Badge
                              key={format}
                              variant="secondary"
                              className="rounded-full bg-[hsl(var(--accent))]/15 text-[hsl(var(--highlight-text))]"
                            >
                              {format}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {activeProfile.mutualConnections} mutual introductions
                        </p>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex flex-col gap-3 border-t border-border/60 bg-muted/40 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <Button
                      variant={isChatLocked ? "outline" : "default"}
                      className={cn(
                        "flex w-full items-center justify-center gap-2 font-semibold transition-colors",
                        isChatLocked && "text-muted-foreground"
                      )}
                      onClick={() => handleStartChat(activeProfile.id)}
                    >
                      <MessageCircle className="h-4 w-4" />
                      {cardChatLabel}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full rounded-full border-border/70"
                      onClick={() => navigate(`/profile?focus=${activeProfile.id}`)}
                    >
                      View full profile
                    </Button>
                  </CardFooter>
                </Card>

                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                  <Button
                    variant="outline"
                    className="w-full rounded-full border-border/70 sm:w-auto"
                    onClick={handlePreviousProfile}
                    disabled={isFirstProfile}
                  >
                    Previous introduction
                  </Button>
                  <div className="text-xs uppercase tracking-[0.32em] text-muted-foreground">
                    {activeProfileIndex + 1} of {filteredProfiles.length}
                  </div>
                  <Button
                    className="w-full sm:w-auto"
                    onClick={handleNextProfile}
                    disabled={isLastProfile}
                  >
                    Next introduction
                  </Button>
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  {isLastProfile
                    ? "You're viewing the final introduction for now."
                    : "Click the photo or use Next to reveal another profile."}
                </p>
              </>
            ) : (
              <Card className="border border-dashed border-border/60">
                <CardContent className="py-10 text-center text-sm text-muted-foreground">
                  We couldn’t find an exact match. Relax filters or explore the
                  Matches workspace for more intros.
                </CardContent>
              </Card>
            )}
          </div>

        </div>

        <Card className="border border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Upcoming vibes to join</CardTitle>
            <CardDescription>
              Reserve your spot and we’ll introduce you before the event so the
              first hello feels easy.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: "Golden Hour Hikers",
                description: "Sunday 7am • Discovery Park",
                tags: ["Outdoors", "Mindful"],
              },
              {
                title: "Story-forward supper club",
                description: "Wed 6pm • Capitol Hill loft",
                tags: ["Creative", "Intimate"],
              },
              {
                title: "Cozy cowork & accountability",
                description: "Fri 9am • Communal space",
                tags: ["Productive", "Hybrid"],
              },
            ].map((event) => (
              <Card
                key={event.title}
                className="border border-border/40 bg-muted/40"
              >
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold">{event.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.description}
                      </p>
                    </div>
                    <Badge className="rounded-full bg-[hsl(var(--accent))]/15 text-[hsl(var(--highlight-text))]">
                      Limited spots
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {event.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="rounded-full"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start px-0 text-xs text-muted-foreground"
                    onClick={() => navigate("/events")}
                  >
                    View event details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FriendFinder;
