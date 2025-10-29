import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Shield, Clock, Phone, Video, Lock } from "lucide-react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { MessageInput } from "@/components/MessageInput";
import { sampleEvents, type EventItem } from "@/lib/events";
import { communityGroups } from "@/lib/community-groups";
import BackButton from "@/components/BackButton";
import { useEndToEndEncryption } from "@/hooks/useEndToEndEncryption";
import { useSubscription } from "@/hooks/useSubscription";
import { usePageTitle } from "@/hooks/usePageTitle";

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

const formatContactName = (identifier: string) => {
  if (!identifier) {
    return "Alex Doe";
  }

  return identifier
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
};

const getInitials = (name: string) => {
  const parts = name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase());

  if (!parts.length) {
    return "AD";
  }

  if (parts.length === 1) {
    return parts[0];
  }

  return `${parts[0]}${parts[parts.length - 1]}`;
};

const Messages = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { "*": conversationPath = "" } = useParams();
  const [encryptedMessages, setEncryptedMessages] = useState<EncryptedMessage[]>([]);
  const [displayMessages, setDisplayMessages] = useState<Message[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  usePageTitle("Messages");

  const { type: pathType, identifier: pathIdentifier } = useMemo<{
    type: "group" | "community" | "direct" | null;
    identifier: string | null;
  }>(() => {
    if (!conversationPath) {
      return { type: null, identifier: null };
    }

    const segments = conversationPath.split("/").filter(Boolean);

    if (!segments.length) {
      return { type: null, identifier: null };
    }

    const [first, second] = segments;

    if (first === "group" || first === "community") {
      return { type: first, identifier: second ?? null };
    }

    if (first === "direct") {
      return { type: "direct", identifier: second ?? null };
    }

    return { type: "direct", identifier: first ?? null };
  }, [conversationPath]);

  const queryGroupId = searchParams.get("group") ?? undefined;
  const queryCommunityId = searchParams.get("community") ?? undefined;
  const queryDirectId = searchParams.get("user") ?? undefined;

  const resolvedGroupId = pathType === "group" && pathIdentifier ? pathIdentifier : queryGroupId;
  const resolvedCommunityId =
    pathType === "community" && pathIdentifier ? pathIdentifier : queryCommunityId;
  const resolvedDirectId =
    pathType === "direct" && pathIdentifier ? pathIdentifier : (queryDirectId ?? undefined);

  const groupEvent = useMemo(
    () => sampleEvents.find((event) => event.id === resolvedGroupId),
    [resolvedGroupId],
  );
  const communityGroup = useMemo(
    () => communityGroups.find((group) => group.id === resolvedCommunityId),
    [resolvedCommunityId],
  );

  const directConversationId = resolvedDirectId ?? "alex-doe";
  const directContactName = useMemo(
    () => formatContactName(directConversationId),
    [directConversationId],
  );
  const directContactInitials = useMemo(() => getInitials(directContactName), [directContactName]);

  const conversationId = useMemo(() => {
    if (groupEvent) {
      return `group:${groupEvent.id}`;
    }
    if (communityGroup) {
      return `community:${communityGroup.id}`;
    }
    return `direct:${directConversationId}`;
  }, [communityGroup, directConversationId, groupEvent]);

  const { encrypt, decrypt, isReady: isEncryptionReady, error: encryptionError } =
    useEndToEndEncryption(conversationId);
  const { tier, requireProFeature } = useSubscription();
  const isProMember = tier === "pro";

  type ParticipantInfo = (EventItem["participants"][number] | EventItem["host"]) & { id?: string };

  const displayedParticipants = useMemo<ParticipantInfo[]>(() => {
    if (groupEvent) {
      return [groupEvent.host, ...groupEvent.participants];
    }
    if (communityGroup) {
      return [communityGroup.host, ...communityGroup.participants];
    }
    return [];
  }, [groupEvent, communityGroup]);

  // Default 1-on-1 chat messages
  const defaultMessages = useMemo<Message[]>(
    () => [
      {
        id: 1,
        sender: directContactName,
        content: "Hey! How's it going? 👋",
        time: "10:00 AM",
        isMine: false,
      },
      { id: 2, sender: "You", content: "I'm doing great, thanks for asking!", time: "10:01 AM", isMine: true },
      {
        id: 3,
        sender: directContactName,
        content: "Want to grab coffee later?",
        time: "10:02 AM",
        isMine: false,
      },
    ],
    [directContactName],
  );

  // Group event messages
  const groupMessages: Message[] = useMemo(() => {
    if (!groupEvent) {
      return [];
    }
    return [
      {
        id: 1,
        sender: groupEvent.host.name,
        content: `Welcome to ${groupEvent.title} group chat!`,
        time: "9:00 AM",
        isMine: false,
      },
      { id: 2, sender: "You", content: "Hi everyone! Excited to join 👋", time: "9:01 AM", isMine: true },
      {
        id: 3,
        sender: groupEvent.participants[0]?.name || "Member",
        content: "See you all there!",
        time: "9:05 AM",
        isMine: false,
      },
    ];
  }, [groupEvent]);

  const communityMessages: Message[] = useMemo(() => {
    if (!communityGroup) {
      return [];
    }

    return communityGroup.chatSampleConversation.map((message, index) => ({
      id: index + 1,
      sender: message.sender,
      content: message.content,
      time: message.time,
      isMine: message.isMine,
    }));
  }, [communityGroup]);

  const baseConversationMessages = useMemo(() => {
    if (groupEvent && groupMessages.length) {
      return groupMessages;
    }

    if (communityGroup && communityMessages.length) {
      return communityMessages;
    }

    return defaultMessages;
  }, [communityGroup, communityMessages, defaultMessages, groupEvent, groupMessages]);

  useEffect(() => {
    setEncryptedMessages([]);
    setDisplayMessages([]);
  }, [conversationId]);

  useEffect(() => {
    if (!isEncryptionReady) {
      return;
    }

    let cancelled = false;

    const secureInitialMessages = async () => {
      try {
        const secured = await Promise.all(
          baseConversationMessages.map(async (message) => {
            const { content, ...rest } = message;
            return {
              ...rest,
              encryptedContent: await encrypt(content),
            } satisfies EncryptedMessage;
          }),
        );

        if (!cancelled) {
          setEncryptedMessages(secured);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to secure conversation messages", error);
          setEncryptedMessages([]);
        }
      }
    };

    setEncryptedMessages([]);
    void secureInitialMessages();

    return () => {
      cancelled = true;
    };
  }, [baseConversationMessages, encrypt, isEncryptionReady]);

  useEffect(() => {
    if (!isEncryptionReady) {
      return;
    }

    if (!encryptedMessages.length) {
      setDisplayMessages([]);
      return;
    }

    let cancelled = false;

    const decryptMessages = async () => {
      try {
        const decrypted = await Promise.all(
          encryptedMessages.map(async (message) => {
            const { encryptedContent, ...rest } = message;
            return {
              ...rest,
              content: await decrypt(encryptedContent),
            } satisfies Message;
          }),
        );

        if (!cancelled) {
          setDisplayMessages(decrypted);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to decrypt messages", error);
        }
      }
    };

    void decryptMessages();

    return () => {
      cancelled = true;
    };
  }, [decrypt, encryptedMessages, isEncryptionReady]);

  const quickReplies = groupEvent
    ? ["Where's the meetup point?", "Any parking tips?", "Can I bring a friend?"]
    : communityGroup
    ? communityGroup.chatQuickReplies
    : ["Sounds good! ☕", "What time were you thinking?"];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayMessages]);

  const dynamicSuggestions = useMemo(() => {
    const suggestions: string[] = [];
    const baseSuggestions = groupEvent
      ? [
          `Ask if anyone wants to coordinate rides for ${groupEvent.title}`,
          `Share what you're most excited about for ${groupEvent.title}`,
          "Check if there are any last-minute updates for the event",
        ]
      : communityGroup
      ? communityGroup.chatSuggestions
      : [
          "Ask about their day to keep things friendly",
          "Suggest a time that works for you",
          "Share something personal to build rapport",
        ];

    const addUnique = (items: string[]) => {
      items.forEach((item) => {
        if (item && !suggestions.includes(item)) {
          suggestions.push(item);
        }
      });
    };

    const lastIncomingMessage = [...displayMessages].reverse().find((msg) => !msg.isMine);

    if (groupEvent) {
      addUnique([
        `Ask who else is bringing friends to ${groupEvent.title}`,
        `Coordinate arrival times for ${groupEvent.title}`,
      ]);
    }

    if (communityGroup) {
      addUnique(communityGroup.chatSuggestions);
    }

    if (lastIncomingMessage) {
      const content = lastIncomingMessage.content.toLowerCase();

      if (content.includes("coffee")) {
        if (communityGroup) {
          addUnique(["Count me in! Who else is coming?", "Love that idea—what should I bring?", "Let's make it happen!"]);
        } else {
          addUnique([
            "That sounds great! What time works best for you?",
            "Do you have a favorite coffee spot in mind?",
            "Should we invite anyone else to join us?",
          ]);
        }
      }

      if (content.includes("weekend")) {
        addUnique([
          "Any fun plans lined up for the weekend?",
          "Maybe we could plan something together this weekend!",
        ]);
      }

      if (content.includes("meet") || content.includes("hang")) {
        addUnique([
          "I'm free this evening—does that work for you?",
          "Want to pick a spot together?",
        ]);
      }

      if (content.includes("plan") || content.includes("schedule")) {
        addUnique([
          "Let's set a time that works for both of us.",
          "I can send over a quick calendar invite if that's easier.",
        ]);
      }

      if (lastIncomingMessage.content.includes("?")) {
        addUnique([
          "Here's what works best for me...",
          "Great question! Here's my thoughts...",
        ]);
      }
    }

    if (!suggestions.length) {
      addUnique(baseSuggestions);
    }

    addUnique(baseSuggestions);

    return suggestions.slice(0, 5);
  }, [displayMessages, groupEvent, communityGroup]);

  const handleSendMessage = async (message: string) => {
    if (!isEncryptionReady || encryptionError) {
      throw new Error(encryptionError ?? "Secure session is not ready");
    }

    const encryptedContent = await encrypt(message);
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setEncryptedMessages((prev) => {
      const nextId = prev.length ? prev[prev.length - 1].id + 1 : 1;
      return [
        ...prev,
        {
          id: nextId,
          sender: "You",
          encryptedContent,
          time: timestamp,
          isMine: true,
        },
      ];
    });
  };

  const handleSelectIcebreaker = (text: string) => {
    if (!requireProFeature()) {
      return;
    }

    void handleSendMessage(text);
  };

  const handleCall = () => {
    console.log("Initiate voice call...");
  };

  const handleVideoCall = () => {
    console.log("Initiate video call...");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-3 sm:px-4 py-3 flex items-center gap-2 sm:gap-3">
        <BackButton
          fallbackPath="/home"
          className="rounded-full"
          ariaLabel="Back to previous page"
        />

        {groupEvent ? (
          <>
            <div className="flex items-center gap-3 flex-1">
              <div className="flex -space-x-3">
                {displayedParticipants.slice(0, 4).map((participant, idx) => (
                  <Avatar key={participant.id ?? idx} className="w-8 h-8 ring-2 ring-background">
                    <AvatarImage src={participant.avatarUrl || "/placeholder.svg"} />
                    <AvatarFallback>
                      {participant.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-base font-semibold leading-tight truncate">
                  {groupEvent.title}
                </h1>
                <p className="text-xs text-muted-foreground truncate">
                  Event group chat · {groupEvent.participants.length + 1} members
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </>
        ) : communityGroup ? (
          <>
            <div className="flex items-center gap-3 flex-1">
              <div className="flex -space-x-3">
                {displayedParticipants.slice(0, 4).map((participant, idx) => (
                  <Avatar key={participant.id ?? idx} className="w-8 h-8 ring-2 ring-background">
                    <AvatarImage src={participant.avatarUrl || "/placeholder.svg"} />
                    <AvatarFallback>{participant.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-base font-semibold leading-tight truncate">{communityGroup.name}</h1>
                <p className="text-xs text-muted-foreground truncate">
                  Community chat · {communityGroup.members} members
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <>
            <Avatar className="w-10 h-10">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>{directContactInitials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-lg font-semibold truncate">{directContactName}</h1>
                <Badge className="bg-green-500 text-white gap-1 text-xs">
                  <Shield className="w-3 h-3" />
                  Verified
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground flex-wrap">
                <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-400"}`} />
                <span className="whitespace-nowrap">Available now</span>
                <Clock className="w-3 h-3 hidden sm:inline" />
                <span className="hidden sm:inline">Usually responds within 5 minutes</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="sm" onClick={handleCall} className="h-8 w-8 p-0 hover:bg-green-100">
                <Phone className="w-4 h-4 text-green-600" />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleVideoCall} className="h-8 w-8 p-0 hover:bg-blue-100">
                <Video className="w-4 h-4 text-blue-600" />
              </Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-4">
        <div className="flex justify-center">
          {encryptionError ? (
            <span className="text-sm text-destructive text-center">
              Secure messaging unavailable. Messages are hidden until encryption is restored.
            </span>
          ) : isEncryptionReady ? (
            <Badge variant="outline" className="gap-1 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              End-to-end encrypted
            </Badge>
          ) : (
            <span className="text-xs text-muted-foreground">Initializing secure session...</span>
          )}
        </div>

        {displayMessages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}>
            <div className={`flex gap-3 max-w-[80%] ${msg.isMine ? "flex-row-reverse" : ""}`}>
              {!msg.isMine && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>{directContactInitials}</AvatarFallback>
                </Avatar>
              )}
              <div>
                {!msg.isMine && (
                  <p className="text-xs text-muted-foreground mb-1">{msg.sender}</p>
                )}
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    msg.isMine
                      ? "bg-[#E8B956] text-black rounded-br-sm"
                      : "bg-[#FF8663] text-white rounded-bl-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
                <p
                  className={`text-xs text-muted-foreground mt-1 ${
                    msg.isMine ? "text-right" : ""
                  }`}
                >
                  {msg.time}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onSelectIcebreaker={handleSelectIcebreaker}
        suggestions={dynamicSuggestions}
        isDisabled={!isEncryptionReady || Boolean(encryptionError)}
        isPremiumFeatureLocked={!isProMember}
        onRequestPremiumFeature={requireProFeature}
      />
    </div>
  );
};

export default Messages;
