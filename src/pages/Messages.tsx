import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  MoreVertical,
  Shield,
  Clock,
  Phone,
  Video,
  Lock,
  Smile,
  Search,
  Filter,
  Sparkles,
  TrendingUp,
  Users,
  MapPin,
  MessageSquare,
  CalendarCheck,
  Target,
  PenSquare,
  HeartPulse,
  Brain,
  Coffee,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { MessageInput } from "@/components/MessageInput";
import { sampleEvents } from "@/lib/events";
import { communityGroups } from "@/lib/community-groups";
import BackButton from "@/components/BackButton";
import { useEndToEndEncryption } from "@/hooks/useEndToEndEncryption";
import { useSubscription } from "@/hooks/useSubscription";
import { usePageTitle } from "@/hooks/usePageTitle";
import { cn } from "@/lib/utils";
import { generateAvatarUrl } from "@/lib/avatar";
import { generateIcebreakerSuggestions } from "@/lib/icebreaker-engine";
import {
  DIRECT_ICEBREAKER_PROFILES,
  SELF_ICEBREAKER_PROFILE,
  buildGroupProfilesFromCommunity,
  buildGroupProfilesFromEvent,
} from "@/data/icebreaker-contexts";

interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
  isMine: boolean;
  type?: "text" | "image" | "voice" | "location";
}

interface EncryptedMessage extends Omit<Message, "content"> {
  encryptedContent: string;
}

type ConversationType = "direct" | "group" | "community";
type ConversationCategory = "inbox" | "requests" | "archived";
type ConversationFocus = "in-person" | "pro" | "community" | "follow-up";
type ConnectionHighlight = { key: string; icon: LucideIcon; text: string };

interface ConversationListItem {
  key: string;
  type: ConversationType;
  identifier: string;
  title: string;
  subtitle: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isPinned?: boolean;
  tags?: string[];
  status?: string;
  avatarUrl?: string;
  initials: string;
  responseTime?: string;
  engagementScore?: number;
  nextStep?: string;
  category: ConversationCategory;
  isOnline?: boolean;
  connectionDepth?: string;
  meetingTime?: string;
  locationLabel?: string;
  focus?: ConversationFocus[];
}

const focusFilters: Array<{
  label: string;
  value: ConversationFocus | "all";
  description: string;
}> = [
  { label: "All conversations", value: "all", description: "Everything in your network" },
  {
    label: "In-person plans",
    value: "in-person",
    description: "Chats with upcoming meetups",
  },
  { label: "Pro matches", value: "pro", description: "Connections using Pro features" },
  { label: "Communities", value: "community", description: "Group and club threads" },
  { label: "Follow-ups", value: "follow-up", description: "Needs a response today" },
];

const formatContactName = (identifier: string) => {
  if (!identifier) return "Alex Doe";
  return identifier
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
};

const getInitials = (name: string) => {
  const parts = name.split(/\s+/).filter(Boolean).map((part) => part.charAt(0).toUpperCase());
  if (!parts.length) return "AD";
  return parts.length === 1 ? parts[0] : `${parts[0]}${parts[parts.length - 1]}`;
};

const formatEventSchedule = (date: string, startTime: string) => {
  const eventDate = new Date(`${date}T${startTime}`);
  if (Number.isNaN(eventDate.getTime())) {
    return `${date} • ${startTime}`;
  }
  return `${eventDate.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  })} • ${startTime}`;
};

const Messages = () => {
  const navigate = useNavigate();
  const { id: pathId } = useParams<{ id?: string }>();
  const [searchParams] = useSearchParams();
  const [encryptedMessages, setEncryptedMessages] = useState<EncryptedMessage[]>([]);
  const [displayMessages, setDisplayMessages] = useState<Message[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFocus, setSelectedFocus] = useState<ConversationFocus | "all">("all");
  const [activeTab, setActiveTab] = useState<ConversationCategory>("inbox");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  usePageTitle("Messages");

  const queryGroupId = searchParams.get("group") ?? undefined;
  const queryCommunityId = searchParams.get("community") ?? undefined;
  const queryDirectId = searchParams.get("user") ?? undefined;

  const resolvedGroupId = queryGroupId;
  const resolvedCommunityId = queryCommunityId;
  const resolvedDirectId = pathId ?? queryDirectId ?? "alex-doe";

  const selectedConversationKey = resolvedGroupId
    ? `group:${resolvedGroupId}`
    : resolvedCommunityId
    ? `community:${resolvedCommunityId}`
    : `direct:${resolvedDirectId}`;

  const { encrypt, decrypt, isReady: isEncryptionReady, error: encryptionError } =
    useEndToEndEncryption(selectedConversationKey);
  const { tier, requireProFeature } = useSubscription();
  const isProMember = tier === "pro";

  const conversationDirectory = useMemo<ConversationListItem[]>(() => {
    const directConversations: ConversationListItem[] = [
      {
        key: "direct:alex-doe",
        type: "direct",
        identifier: "alex-doe",
        title: "Alex Doe",
        subtitle: "Met at Summit Social • Capitol Hill",
        lastMessage: "Looking forward to coffee at Beacon Café tomorrow morning!",
        timestamp: "2m ago",
        unreadCount: 0,
        isPinned: true,
        tags: ["Verified", "Pro"],
        status: "Available now",
        avatarUrl: generateAvatarUrl("Alex Doe messages"),
        initials: getInitials("Alex Doe"),
        responseTime: "Usually responds within 5 min",
        engagementScore: 92,
        nextStep: "Confirm meet-up agenda",
        category: "inbox",
        isOnline: true,
        connectionDepth: "Met 2 times",
        meetingTime: "Fri • 9:00 AM",
        locationLabel: "Beacon Café, Capitol Hill",
        focus: ["pro", "in-person"],
      },
      {
        key: "direct:casey-wells",
        type: "direct",
        identifier: "casey-wells",
        title: "Casey Wells",
        subtitle: "Introduced via Community Espresso Lab",
        lastMessage: "Thanks for connecting me with the ceramics studio—I'll follow up with them tonight!",
        timestamp: "12m ago",
        unreadCount: 2,
        tags: ["Follow-up"],
        status: "Waiting on your reply",
        avatarUrl: generateAvatarUrl("Casey Wells messages"),
        initials: getInitials("Casey Wells"),
        responseTime: "Responds within 1 hr",
        engagementScore: 78,
        nextStep: "Send availability for Saturday workshop",
        category: "inbox",
        isOnline: false,
        connectionDepth: "Introduced by Maya Patel",
        meetingTime: "Sat • 1:00 PM",
        locationLabel: "Makers Loft Studio",
        focus: ["follow-up", "in-person"],
      },
      {
        key: "direct:jamal-rivers",
        type: "direct",
        identifier: "jamal-rivers",
        title: "Jamal Rivers",
        subtitle: "Co-hosting the Rising Voices panel",
        lastMessage: "I shared the speaker brief. Let me know if you'd like edits before Friday.",
        timestamp: "45m ago",
        unreadCount: 0,
        tags: ["Partner"],
        status: "Review the shared doc",
        avatarUrl: generateAvatarUrl("Jamal Rivers messages"),
        initials: getInitials("Jamal Rivers"),
        responseTime: "Replies within 30 min",
        engagementScore: 84,
        nextStep: "Confirm panel run of show",
        category: "inbox",
        isOnline: true,
        connectionDepth: "Collaborating this month",
        meetingTime: "Fri • 5:30 PM",
        locationLabel: "Downtown Arts Center",
        focus: ["in-person"],
      },
      {
        key: "direct:olivia-tran",
        type: "direct",
        identifier: "olivia-tran",
        title: "Olivia Tran",
        subtitle: "Referred by Connective Pro concierge",
        lastMessage: "Hi! I'd love a quick intro call before Saturday's supper club.",
        timestamp: "1h ago",
        unreadCount: 1,
        tags: ["Request", "Pro"],
        status: "New request",
        avatarUrl: generateAvatarUrl("Olivia Tran messages"),
        initials: getInitials("Olivia Tran"),
        responseTime: "Prefers video intros",
        engagementScore: 69,
        nextStep: "Share voice introduction",
        category: "requests",
        isOnline: true,
        connectionDepth: "Mutual friend: Darius Kaur",
        focus: ["pro", "follow-up"],
      },
      {
        key: "direct:renee-soto",
        type: "direct",
        identifier: "renee-soto",
        title: "Renee Soto",
        subtitle: "Morning run club buddy",
        lastMessage: "Let's pause until spring—traveling for a few months!",
        timestamp: "2w ago",
        unreadCount: 0,
        tags: ["Archived"],
        status: "Took a break",
        avatarUrl: generateAvatarUrl("Renee Soto messages"),
        initials: getInitials("Renee Soto"),
        responseTime: "Replies within a day",
        engagementScore: 58,
        category: "archived",
        isOnline: false,
        connectionDepth: "Met 5 times",
        focus: [],
      },
    ];

    const groupChats: ConversationListItem[] = sampleEvents.slice(0, 3).map((event, index) => ({
      key: `group:${event.id}`,
      type: "group",
      identifier: event.id,
      title: event.title,
      subtitle: `Hosted by ${event.host.name}`,
      lastMessage: event.rules[0] ?? "New discussion thread just opened.",
      timestamp: index === 0 ? "Today" : index === 1 ? "Yesterday" : "2d ago",
      unreadCount: index === 0 ? 8 : index === 1 ? 3 : 1,
      tags: ["Experience", event.interest],
      status: `${event.participants.length}+ going`,
      avatarUrl: event.host.avatarUrl,
      initials: getInitials(event.title),
      responseTime: "Community replies within 10 min",
      engagementScore: 80 - index * 5,
      nextStep:
        index === 0 ? "Share pre-event checklist" : "Confirm headcount by Thursday",
      category: "inbox",
      isOnline: true,
      connectionDepth: `${event.participants.length} attendees`,
      meetingTime: formatEventSchedule(event.date, event.startTime),
      locationLabel: event.location.city ?? event.location.address,
      focus: ["in-person", "community"],
    }));

    const communityChats: ConversationListItem[] = communityGroups.slice(0, 3).map((group, index) => ({
      key: `community:${group.id}`,
      type: "community",
      identifier: group.id,
      title: group.name,
      subtitle: `${group.category} • ${group.members} members`,
      lastMessage: group.chatWelcome,
      timestamp: index === 0 ? "1h ago" : index === 1 ? "Yesterday" : "3d ago",
      unreadCount: index === 0 ? 5 : 0,
      tags: ["Community"],
      status: `Host: ${group.host.name}`,
      avatarUrl: group.image,
      initials: getInitials(group.name),
      responseTime: "Active thread this week",
      engagementScore: 70 + index * 6,
      nextStep:
        index === 0 ? "Share reading highlights" : index === 1 ? "Plan ride shares" : undefined,
      category: index === 2 ? "requests" : "inbox",
      isOnline: index === 0,
      connectionDepth: `${group.members} members`,
      meetingTime: group.meetingTime,
      locationLabel: undefined,
      focus: ["community"],
    }));

    return [...directConversations, ...groupChats, ...communityChats];
  }, []);

  const tabCounts = useMemo(
    () => ({
      inbox: conversationDirectory.filter((conv) => conv.category === "inbox").length,
      requests: conversationDirectory.filter((conv) => conv.category === "requests").length,
      archived: conversationDirectory.filter((conv) => conv.category === "archived").length,
    }),
    [conversationDirectory],
  );

  const conversationMetrics = useMemo(() => {
    const inbox = conversationDirectory.filter((conv) => conv.category === "inbox");
    const upcoming = inbox.filter((conv) => Boolean(conv.meetingTime)).length;
    const followUps = inbox.filter((conv) => conv.focus?.includes("follow-up")).length;
    const proConnections = inbox.filter((conv) => conv.focus?.includes("pro")).length;
    const avgEngagement =
      inbox.length > 0
        ? Math.round(
            inbox.reduce((acc, conv) => acc + (conv.engagementScore ?? 70), 0) /
              inbox.length,
          )
        : 0;

    return { upcoming, followUps, proConnections, avgEngagement };
  }, [conversationDirectory]);

  const upcomingHighlights = useMemo(
    () =>
      conversationDirectory
        .filter((conv) => conv.category === "inbox" && conv.meetingTime)
        .slice(0, 3),
    [conversationDirectory],
  );

  const selectedConversation = useMemo(
    () => conversationDirectory.find((item) => item.key === selectedConversationKey),
    [conversationDirectory, selectedConversationKey],
  );

  useEffect(() => {
    setIsOnline(selectedConversation?.isOnline ?? false);
    if (selectedConversation) {
      setActiveTab(selectedConversation.category);
    }
  }, [selectedConversation]);

  const groupEvent = useMemo(
    () => sampleEvents.find((event) => event.id === resolvedGroupId),
    [resolvedGroupId],
  );
  const communityGroup = useMemo(
    () => communityGroups.find((group) => group.id === resolvedCommunityId),
    [resolvedCommunityId],
  );

  const directConversationId = resolvedDirectId;
  const directContactName = useMemo(
    () => formatContactName(directConversationId),
    [directConversationId],
  );
  const directContactInitials = useMemo(
    () => getInitials(directContactName),
    [directContactName],
  );

  const baseMessages: Message[] = useMemo(() => {
    if (groupEvent) {
      return [
        {
          id: 1,
          sender: groupEvent.host.name,
          content: `Welcome to ${groupEvent.title}!`,
          time: "9:00 AM",
          isMine: false,
        },
        { id: 2, sender: "You", content: "Hi everyone! 👋", time: "9:01 AM", isMine: true },
      ];
    }
    if (communityGroup) {
      return communityGroup.chatSampleConversation.map((msg, index) => ({
        ...msg,
        id: index + 1,
      }));
    }
    return [
      {
        id: 1,
        sender: directContactName,
        content: "Hey! How's it going? 👋",
        time: "10:00 AM",
        isMine: false,
      },
      { id: 2, sender: "You", content: "Doing great, thanks! ☕", time: "10:01 AM", isMine: true },
      {
        id: 3,
        sender: directContactName,
        content: "Want to grab coffee later?",
        time: "10:02 AM",
        isMine: false,
      },
    ];
  }, [groupEvent, communityGroup, directContactName]);

  useEffect(() => {
    if (!isEncryptionReady) return;
    (async () => {
      const encrypted = await Promise.all(
        baseMessages.map(async (msg) => ({
          ...msg,
          encryptedContent: await encrypt(msg.content),
        })),
      );
      setEncryptedMessages(encrypted);
    })();
  }, [baseMessages, encrypt, isEncryptionReady]);

  useEffect(() => {
    if (!isEncryptionReady || !encryptedMessages.length) return;
    (async () => {
      const decrypted = await Promise.all(
        encryptedMessages.map(async (msg) => ({
          ...msg,
          content: await decrypt(msg.encryptedContent),
        })),
      );
      setDisplayMessages(decrypted);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    })();
  }, [decrypt, encryptedMessages, isEncryptionReady]);

  const quickReplies = useMemo(() => {
    if (groupEvent) {
      return ["Where’s the meetup?", "Any parking tips?", "Can I bring a friend?"];
    }
    if (communityGroup) {
      return communityGroup.chatQuickReplies;
    }
    if (selectedConversation?.focus?.includes("follow-up")) {
      return [
        "Thanks for the reminder—I'm in!",
        "I'll send availability tonight.",
        "Appreciate the intro. Let's confirm details.",
      ];
    }
    return [
      "Sounds good! ☕",
      "What time were you thinking?",
      "I'll send a quick calendar hold.",
    ];
  }, [groupEvent, communityGroup, selectedConversation]);

  const icebreakerParticipants = useMemo(() => {
    if (selectedConversation?.type === "direct") {
      const partnerProfile = DIRECT_ICEBREAKER_PROFILES[directConversationId];
      if (partnerProfile) {
        return [SELF_ICEBREAKER_PROFILE, partnerProfile];
      }
    }

    if (selectedConversation?.type === "group" && groupEvent) {
      return buildGroupProfilesFromEvent(groupEvent);
    }

    if (selectedConversation?.type === "community" && communityGroup) {
      return buildGroupProfilesFromCommunity(communityGroup);
    }

    return undefined;
  }, [communityGroup, directConversationId, groupEvent, selectedConversation?.type]);

  const dynamicSuggestions = useMemo(() => {
    const base = [...quickReplies];
    if (selectedConversation?.nextStep) {
      base.unshift(`Confirm next step: ${selectedConversation.nextStep}`);
    }

    const lastIncoming = [...displayMessages].reverse().find((msg) => !msg.isMine);
    if (!lastIncoming) return base.slice(0, 3);

    if (lastIncoming.content.toLowerCase().includes("coffee")) {
      return [
        "That sounds great! What time works best?",
        "Do you have a favorite spot?",
        ...(base.slice(0, 1) ?? []),
      ];
    }
    if (lastIncoming.content.includes("?")) {
      return ["Here's what works for me...", "Great question!", ...(base.slice(0, 1) ?? [])];
    }
    return base.slice(0, 3);
  }, [displayMessages, quickReplies, selectedConversation]);

  const aiIcebreakerSuggestions = useMemo(() => {
    if (!icebreakerParticipants) return [];
    const contextType: "direct" | "group" = selectedConversation?.type === "direct" ? "direct" : "group";

    return generateIcebreakerSuggestions(
      {
        type: contextType,
        participants: icebreakerParticipants,
        eventName: groupEvent?.title ?? communityGroup?.name,
        meetupPurpose: selectedConversation?.subtitle,
      },
      { limit: 3 },
    ).map((suggestion) => suggestion.text);
  }, [communityGroup, groupEvent, icebreakerParticipants, selectedConversation]);

  const combinedSuggestions = useMemo(() => {
    if (aiIcebreakerSuggestions.length) {
      return [...aiIcebreakerSuggestions, ...dynamicSuggestions].slice(0, 3);
    }
    return dynamicSuggestions;
  }, [aiIcebreakerSuggestions, dynamicSuggestions]);

  const handleSendMessage = async (text: string) => {
    if (!isEncryptionReady || encryptionError) return;
    const encryptedContent = await encrypt(text);
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setEncryptedMessages((prev) => [
      ...prev,
      { id: prev.length + 1, sender: "You", encryptedContent, time: timestamp, isMine: true },
    ]);
  };

  const handleCall = () => console.log("Initiate voice call...");
  const handleVideoCall = () => console.log("Initiate video call...");
  const handleStartNewMessage = () => navigate("/friend-finder");

  const filteredConversations = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return conversationDirectory.filter((conversation) => {
      if (selectedFocus !== "all" && !conversation.focus?.includes(selectedFocus)) {
        return false;
      }
      if (!term) {
        return true;
      }
      return (
        conversation.title.toLowerCase().includes(term) ||
        conversation.subtitle.toLowerCase().includes(term) ||
        conversation.tags?.some((tag) => tag.toLowerCase().includes(term)) ||
        conversation.lastMessage.toLowerCase().includes(term)
      );
    });
  }, [conversationDirectory, searchTerm, selectedFocus]);

  const renderTagBadge = (tag: string, key: string) => {
    const normalized = tag.toLowerCase();
    if (normalized === "verified") {
      return (
        <Badge key={key} className="gap-1 border-none bg-emerald-500/15 text-emerald-600">
          <Shield className="h-3 w-3" /> Verified
        </Badge>
      );
    }
    if (normalized === "pro") {
      return (
        <Badge key={key} className="gap-1 border-none bg-sky-500/15 text-sky-700">
          <Sparkles className="h-3 w-3" /> Pro
        </Badge>
      );
    }
    if (normalized === "community") {
      return (
        <Badge key={key} className="gap-1 border-none bg-purple-500/15 text-purple-700">
          <Users className="h-3 w-3" /> Community
        </Badge>
      );
    }
    if (normalized === "experience") {
      return (
        <Badge key={key} className="gap-1 border-none bg-orange-500/15 text-orange-600">
          <MessageSquare className="h-3 w-3" /> Experience
        </Badge>
      );
    }
    return (
      <Badge key={key} variant="outline" className="text-[11px]">
        {tag}
      </Badge>
    );
  };

  const handleSelectConversation = (conversation: ConversationListItem) => {
    setActiveTab(conversation.category);
    if (conversation.type === "group") {
      navigate(`/messages?group=${conversation.identifier}`);
      return;
    }
    if (conversation.type === "community") {
      navigate(`/messages?community=${conversation.identifier}`);
      return;
    }
    navigate(`/messages/${conversation.identifier}`);
  };

  const renderConversationItem = (conversation: ConversationListItem) => {
    const isActive = conversation.key === selectedConversationKey;
    return (
      <button
        key={conversation.key}
        onClick={() => handleSelectConversation(conversation)}
        className={cn(
          "w-full rounded-2xl border border-transparent bg-background/60 p-3 text-left transition-all hover:border-border hover:bg-background",
          isActive && "border-primary/40 bg-primary/5 shadow-sm",
        )}
      >
        <div className="flex items-start gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={conversation.avatarUrl} alt={conversation.title} />
            <AvatarFallback>{conversation.initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold">{conversation.title}</p>
                <p className="text-xs text-muted-foreground">{conversation.subtitle}</p>
              </div>
              <span className="text-xs text-muted-foreground">{conversation.timestamp}</span>
            </div>
            <p className="line-clamp-2 text-xs text-muted-foreground">
              {conversation.lastMessage}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              {conversation.tags?.map((tag) => renderTagBadge(tag, `${conversation.key}-${tag}`))}
              {conversation.responseTime && (
                <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" /> {conversation.responseTime}
                </span>
              )}
              {conversation.unreadCount ? (
                <span className="ml-auto rounded-full bg-primary/80 px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                  {conversation.unreadCount}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </button>
    );
  };

  const renderConversationList = (category: ConversationCategory) => {
    const pinned = filteredConversations.filter(
      (conversation) => conversation.category === category && conversation.isPinned,
    );
    const regular = filteredConversations.filter(
      (conversation) => conversation.category === category && !conversation.isPinned,
    );

    if (!pinned.length && !regular.length) {
      return (
        <div className="rounded-2xl border border-dashed border-border/80 bg-background/60 p-6 text-center text-sm text-muted-foreground">
          No conversations in this view yet. Start a new introduction to get things going.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {pinned.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Pinned</p>
            <div className="space-y-2">{pinned.map(renderConversationItem)}</div>
          </div>
        )}
        {regular.length > 0 && <div className="space-y-2">{regular.map(renderConversationItem)}</div>}
      </div>
    );
  };

  const conversationDetails = useMemo(() => {
    if (groupEvent) {
      return {
        title: groupEvent.title,
        subtitle: selectedConversation?.subtitle ?? `Hosted by ${groupEvent.host.name}`,
        avatarUrl: groupEvent.host.avatarUrl,
        initials: getInitials(groupEvent.title),
      };
    }
    if (communityGroup) {
      return {
        title: communityGroup.name,
        subtitle:
          selectedConversation?.subtitle ??
          `${communityGroup.category} • ${communityGroup.members} members`,
        avatarUrl: communityGroup.image,
        initials: getInitials(communityGroup.name),
      };
    }
    return {
      title: directContactName,
      subtitle: selectedConversation?.subtitle ?? "Direct connection",
      avatarUrl: selectedConversation?.avatarUrl,
      initials: directContactInitials,
    };
  }, [communityGroup, directContactInitials, directContactName, groupEvent, selectedConversation]);

  const headerBadges = useMemo(() => {
    if (selectedConversation?.tags?.length) {
      return selectedConversation.tags;
    }
    if (groupEvent) {
      return [groupEvent.interest];
    }
    if (communityGroup) {
      return [communityGroup.category];
    }
    return ["Connection"];
  }, [communityGroup, groupEvent, selectedConversation]);

  const connectionHighlights = useMemo<ConnectionHighlight[]>(() => {
    if (!selectedConversation) return [];
    const highlights: ConnectionHighlight[] = [];
    if (selectedConversation.connectionDepth) {
      highlights.push({ key: "depth", icon: Users, text: selectedConversation.connectionDepth });
    }
    if (selectedConversation.meetingTime) {
      highlights.push({ key: "time", icon: CalendarCheck, text: selectedConversation.meetingTime });
    }
    if (selectedConversation.locationLabel) {
      highlights.push({ key: "location", icon: MapPin, text: selectedConversation.locationLabel });
    }
    if (selectedConversation.nextStep) {
      highlights.push({ key: "next", icon: Target, text: selectedConversation.nextStep });
    }
    if (selectedConversation.responseTime && selectedConversation.type === "direct") {
      highlights.push({ key: "response", icon: Clock, text: selectedConversation.responseTime });
    }
    return highlights;
  }, [selectedConversation]);

  const moodCheckIn = useMemo(
    () => ({
      label: "Optimistic but a bit overloaded",
      confidence: 84,
      toneSummary: `Detected from your last few notes with ${conversationDetails.title}.`,
      emotions: [
        { name: "Calm", weight: 42, toneClass: "bg-emerald-500/15 text-emerald-700" },
        { name: "Excited", weight: 33, toneClass: "bg-amber-500/15 text-amber-700" },
        { name: "Stressed", weight: 25, toneClass: "bg-rose-500/15 text-rose-700" },
      ],
      supportiveNudge:
        "Affirm their pace, keep it light, and invite them to pick one simple next step together.",
      healthyMicroActions: [
        "Offer to choose the venue so they don't have to plan anything.",
        "Send a 10-second voice note to keep warmth high without pressure.",
        "Set a gentle check-in time tomorrow if they need space tonight.",
      ],
      motivation:
        "You've been steadily showing up for friends—this thread is right on track for a great meet-up.",
      recommendedEvents: [
        {
          name: "Slow Coffee & Journaling",
          mood: "Grounding",
          when: "Sat • 10:00 AM",
          place: "Beacon Café",
          benefit: "Low-key table with other reflective members; perfect for easing back in.",
          path: "/events?mood=grounding",
        },
        {
          name: "Sunset Breathwork Circle",
          mood: "Calming",
          when: "Today • 6:30 PM",
          place: "Waterfront Commons",
          benefit: "Guided session to reset after a full day; hosts handle intros.",
          path: "/events?mood=calm",
        },
      ],
    }),
    [conversationDetails.title],
  );

  return (
    <div className="min-h-screen bg-muted/40 py-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 lg:flex-row">
        <aside className="w-full space-y-4 lg:max-w-xs">
          <div className="rounded-3xl border border-border bg-card/80 p-4 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-2">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Inbox</p>
                <h2 className="text-xl font-semibold">Messages</h2>
              </div>
              <Button size="sm" className="gap-2" onClick={handleStartNewMessage}>
                <PenSquare className="h-4 w-4" /> New message
              </Button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search people, groups, or topics"
                className="h-10 rounded-full bg-background pl-10"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {focusFilters.map((filter) => (
                <Button
                  key={filter.value}
                  size="sm"
                  variant={selectedFocus === filter.value ? "default" : "outline"}
                  className={cn(
                    "h-8 rounded-full border-border bg-background text-xs text-muted-foreground hover:bg-muted",
                    selectedFocus === filter.value && "bg-primary text-primary-foreground hover:bg-primary",
                  )}
                  onClick={() => setSelectedFocus(filter.value)}
                >
                  {filter.value === "all" && <Filter className="mr-2 h-3.5 w-3.5" />} {filter.label}
                </Button>
              ))}
            </div>

            <Card className="mt-4 border border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <TrendingUp className="h-4 w-4 text-primary" /> Relationship momentum
                </CardTitle>
                <CardDescription className="text-xs">
                  You're building trust. Keep the streak going this week.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span>Active meetups</span>
                  <span className="font-semibold">{conversationMetrics.upcoming}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Follow-ups due</span>
                  <span className="font-semibold">{conversationMetrics.followUps}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pro connections</span>
                  <span className="font-semibold">{conversationMetrics.proConnections}</span>
                </div>
                <Separator className="my-2" />
                <div>
                  <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Avg. engagement</span>
                    <span>{conversationMetrics.avgEngagement}%</span>
                  </div>
                  <Progress value={conversationMetrics.avgEngagement} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4 border border-border bg-background/70">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <HeartPulse className="h-4 w-4 text-primary" /> AI mood & mental check-in
                </CardTitle>
                <CardDescription className="text-xs">
                  Reads the tone of this thread and keeps it supportive.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Dominant vibe</p>
                    <p className="font-semibold leading-tight">{moodCheckIn.label}</p>
                    <p className="text-xs text-muted-foreground">{moodCheckIn.toneSummary}</p>
                  </div>
                  <Badge variant="outline" className="rounded-full bg-emerald-50 text-[11px] text-emerald-700">
                    {moodCheckIn.confidence}% confident
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  {moodCheckIn.emotions.map((emotion) => (
                    <span
                      key={emotion.name}
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${emotion.toneClass}`}
                    >
                      <Brain className="h-3.5 w-3.5" /> {emotion.name} · {emotion.weight}%
                    </span>
                  ))}
                </div>

                <div className="rounded-2xl border border-border/60 bg-muted/40 p-3">
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <Shield className="h-3.5 w-3.5" /> Healthy interaction tips
                  </div>
                  <p className="mt-1 text-sm leading-snug text-foreground">{moodCheckIn.supportiveNudge}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-muted-foreground">
                    {moodCheckIn.healthyMicroActions.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-primary/5 p-3 text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Motivation</p>
                      <p className="font-medium leading-snug text-foreground">{moodCheckIn.motivation}</p>
                    </div>
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Tailored to keep the conversation positive and healthy.
                  </p>
                </div>

                <div>
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    <Coffee className="h-4 w-4 text-primary" /> Event matches for this mood
                  </div>
                  <div className="space-y-2">
                    {moodCheckIn.recommendedEvents.map((event) => (
                      <div
                        key={event.name}
                        className="flex items-start justify-between gap-3 rounded-2xl border border-border/70 bg-card/60 p-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{event.name}</span>
                            <Badge variant="secondary" className="text-[11px]">
                              {event.mood}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{event.when} • {event.place}</p>
                          <p className="text-xs text-foreground/80">{event.benefit}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 rounded-full border-primary/40 text-xs text-primary"
                          onClick={() => navigate(event.path)}
                        >
                          Join
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-4 border border-border bg-background/60">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <CalendarCheck className="h-4 w-4 text-primary" /> Upcoming meetups
                </CardTitle>
                <CardDescription className="text-xs">
                  Stay ahead of what's next in your calendar.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {upcomingHighlights.length ? (
                  upcomingHighlights.map((conversation) => (
                    <div
                      key={conversation.key}
                      className="rounded-2xl border border-border/70 bg-card/60 p-3 text-sm"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium">{conversation.title}</span>
                        <Badge variant="outline" className="text-xs">
                          {conversation.type === "group" ? "Group" : "Direct"}
                        </Badge>
                      </div>
                      {conversation.meetingTime && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <CalendarCheck className="h-3 w-3" /> {conversation.meetingTime}
                        </p>
                      )}
                      {conversation.locationLabel && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" /> {conversation.locationLabel}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No upcoming meetups yet. Confirm a plan to see it here.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="rounded-3xl border border-border bg-card/80 p-4 shadow-sm">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ConversationCategory)}>
              <TabsList className="grid h-10 w-full grid-cols-3">
                <TabsTrigger value="inbox">Inbox · {tabCounts.inbox}</TabsTrigger>
                <TabsTrigger value="requests">
                  Requests · {tabCounts.requests}
                </TabsTrigger>
                <TabsTrigger value="archived">Archived · {tabCounts.archived}</TabsTrigger>
              </TabsList>
              <TabsContent value="inbox">
                <ScrollArea className="h-[420px] pr-2">
                  <div className="space-y-4 pb-2">{renderConversationList("inbox")}</div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="requests">
                <ScrollArea className="h-[420px] pr-2">
                  <div className="space-y-4 pb-2">{renderConversationList("requests")}</div>
                </ScrollArea>
              </TabsContent>
              <TabsContent value="archived">
                <ScrollArea className="h-[420px] pr-2">
                  <div className="space-y-4 pb-2">{renderConversationList("archived")}</div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        </aside>

        <section className="flex min-h-[calc(100vh-160px)] flex-1 flex-col overflow-hidden rounded-3xl border border-border bg-card/90 shadow-sm">
          <div className="border-b border-border/80 px-4 py-3">
            <div className="flex items-center gap-3">
              <BackButton fallbackPath="/messages" className="rounded-full" />
              <Avatar className="h-10 w-10">
                <AvatarImage src={conversationDetails.avatarUrl} alt={conversationDetails.title} />
                <AvatarFallback>{conversationDetails.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-base font-semibold sm:text-lg">
                    {conversationDetails.title}
                  </h1>
                  {headerBadges.map((tag, index) => renderTagBadge(tag, `header-${index}-${tag}`))}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <div className={`h-2 w-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-400"}`} />
                  <span className="truncate">{selectedConversation?.status ?? conversationDetails.subtitle}</span>
                  {selectedConversation?.responseTime && (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {selectedConversation.responseTime}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCall}
                  className="h-8 w-8 p-0 hover:bg-emerald-100"
                >
                  <Phone className="h-4 w-4 text-emerald-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleVideoCall}
                  className="h-8 w-8 p-0 hover:bg-sky-100"
                >
                  <Video className="h-4 w-4 text-sky-600" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {connectionHighlights.length > 0 && (
            <div className="border-b border-border/80 bg-muted/50 px-4 py-3">
              <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <Sparkles className="h-4 w-4 text-primary" /> Connection insights
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                {connectionHighlights.map((highlight) => (
                  <span
                    key={highlight.key}
                    className="inline-flex items-center gap-2 rounded-full bg-background px-3 py-1 text-xs"
                  >
                    <highlight.icon className="h-3.5 w-3.5 text-primary" />
                    {highlight.text}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-1 flex-col">
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4">
              <div className="flex justify-center">
                {encryptionError ? (
                  <span className="text-sm text-destructive">Secure messaging unavailable</span>
                ) : isEncryptionReady ? (
                  <Badge variant="outline" className="gap-1 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" /> End-to-end encrypted
                  </Badge>
                ) : (
                  <span className="text-xs text-muted-foreground">Initializing secure session...</span>
                )}
              </div>

              {displayMessages.map((msg) => (
                <div key={msg.id} className={cn("flex", msg.isMine ? "justify-end" : "justify-start")}>
                  <div className={cn("flex max-w-[80%] gap-3", msg.isMine && "flex-row-reverse")}>
                    {!msg.isMine && (
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={conversationDetails.avatarUrl} alt={conversationDetails.title} />
                        <AvatarFallback>{conversationDetails.initials}</AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      {!msg.isMine && (
                        <p className="mb-1 text-xs text-muted-foreground">{msg.sender}</p>
                      )}
                      <div
                        className={cn(
                          "rounded-2xl px-4 py-3",
                          msg.isMine
                            ? "rounded-br-sm bg-[#E8B956] text-black"
                            : "rounded-bl-sm bg-[#FF8663] text-white",
                        )}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                      </div>
                      <p
                        className={cn(
                          "mt-1 text-xs text-muted-foreground",
                          msg.isMine && "text-right",
                        )}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

              <MessageInput
                className="border-t border-border/80 bg-card/95 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.18)] backdrop-blur supports-[backdrop-filter]:bg-card/80"
                onSendMessage={handleSendMessage}
                onSelectIcebreaker={(text) => {
                  if (requireProFeature()) {
                    void handleSendMessage(text);
                  }
                }}
                suggestions={combinedSuggestions}
                isDisabled={!isEncryptionReady || Boolean(encryptionError)}
                isPremiumFeatureLocked={!isProMember}
                onRequestPremiumFeature={requireProFeature}
              />

            <div className="border-t border-border/80 bg-card/90 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-card/80">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {quickReplies.map((reply, index) => (
                  <Button
                    key={`${reply}-${index}`}
                    type="button"
                    variant="outline"
                    size="sm"
                    className="rounded-full border-border bg-background text-xs"
                    onClick={() => void handleSendMessage(reply)}
                    disabled={!isEncryptionReady || Boolean(encryptionError)}
                  >
                    {reply}
                  </Button>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-full border-dashed border-primary/40 text-xs text-primary"
                  onClick={() => {
                    if (isProMember) {
                      void handleSendMessage("Fun fact: I once hosted a pop-up dinner for 20!");
                    } else {
                      requireProFeature();
                    }
                  }}
                >
                  <Smile className="h-4 w-4" /> Share a fun fact
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Messages;
