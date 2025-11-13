import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Shield, Clock, Phone, Video, Lock, Smile } from "lucide-react";
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

const Messages = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { "*": conversationPath = "" } = useParams();
  const [encryptedMessages, setEncryptedMessages] = useState<EncryptedMessage[]>([]);
  const [displayMessages, setDisplayMessages] = useState<Message[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  usePageTitle("Messages");

  const { encrypt, decrypt, isReady: isEncryptionReady, error: encryptionError } =
    useEndToEndEncryption(conversationPath);
  const { tier, requireProFeature } = useSubscription();
  const isProMember = tier === "pro";

  // Determine conversation type
  const { type: pathType, identifier: pathIdentifier } = useMemo(() => {
    if (!conversationPath) return { type: null, identifier: null };
    const segments = conversationPath.split("/").filter(Boolean);
    const [first, second] = segments;
    if (first === "group" || first === "community") return { type: first, identifier: second ?? null };
    return { type: "direct", identifier: first ?? null };
  }, [conversationPath]);

  const queryGroupId = searchParams.get("group") ?? undefined;
  const queryCommunityId = searchParams.get("community") ?? undefined;
  const queryDirectId = searchParams.get("user") ?? undefined;

  const resolvedGroupId = pathType === "group" ? pathIdentifier : queryGroupId;
  const resolvedCommunityId = pathType === "community" ? pathIdentifier : queryCommunityId;
  const resolvedDirectId = pathType === "direct" ? pathIdentifier : queryDirectId;

  const groupEvent = useMemo(() => sampleEvents.find((e) => e.id === resolvedGroupId), [resolvedGroupId]);
  const communityGroup = useMemo(
    () => communityGroups.find((g) => g.id === resolvedCommunityId),
    [resolvedCommunityId]
  );

  const directConversationId = resolvedDirectId ?? "alex-doe";
  const directContactName = useMemo(() => formatContactName(directConversationId), [directConversationId]);
  const directContactInitials = useMemo(() => getInitials(directContactName), [directContactName]);

  const baseMessages: Message[] = useMemo(() => {
    if (groupEvent) {
      return [
        { id: 1, sender: groupEvent.host.name, content: `Welcome to ${groupEvent.title}!`, time: "9:00 AM", isMine: false },
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
      { id: 1, sender: directContactName, content: "Hey! How's it going? 👋", time: "10:00 AM", isMine: false },
      { id: 2, sender: "You", content: "Doing great, thanks! ☕", time: "10:01 AM", isMine: true },
      { id: 3, sender: directContactName, content: "Want to grab coffee later?", time: "10:02 AM", isMine: false },
    ];
  }, [groupEvent, communityGroup, directContactName]);

  // Encrypt/decrypt
  useEffect(() => {
    if (!isEncryptionReady) return;
    (async () => {
      const encrypted = await Promise.all(
        baseMessages.map(async (msg) => ({
          ...msg,
          encryptedContent: await encrypt(msg.content),
        }))
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
        }))
      );
      setDisplayMessages(decrypted);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    })();
  }, [decrypt, encryptedMessages, isEncryptionReady]);

  const quickReplies = groupEvent
    ? ["Where’s the meetup?", "Any parking tips?", "Can I bring a friend?"]
    : communityGroup
    ? communityGroup.chatQuickReplies
    : ["Sounds good! ☕", "What time were you thinking?"];

  const dynamicSuggestions = useMemo(() => {
    const lastIncoming = [...displayMessages].reverse().find((msg) => !msg.isMine);
    if (!lastIncoming) return quickReplies;
    if (lastIncoming.content.toLowerCase().includes("coffee"))
      return ["That sounds great! What time works best?", "Do you have a favorite spot?"];
    if (lastIncoming.content.includes("?")) return ["Here's what works for me...", "Great question!"];
    return quickReplies;
  }, [displayMessages, quickReplies]);

  const handleSendMessage = async (text: string) => {
    if (!isEncryptionReady || encryptionError) return;
    const encryptedContent = await encrypt(text);
    const timestamp = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setEncryptedMessages((prev) => [
      ...prev,
      { id: prev.length + 1, sender: "You", encryptedContent, time: timestamp, isMine: true },
    ]);
  };

  const handleCall = () => console.log("Initiate voice call...");
  const handleVideoCall = () => console.log("Initiate video call...");

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <BackButton fallbackPath="/home" className="rounded-full" />
        <Avatar className="w-10 h-10">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>{directContactInitials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-lg font-semibold truncate">{directContactName}</h1>
            <Badge className="bg-green-500 text-white gap-1 text-xs">
              <Shield className="w-3 h-3" /> Verified
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-400"}`} />
            <span>Available now</span>
            <Clock className="w-3 h-3 hidden sm:inline" />
            <span className="hidden sm:inline">Usually responds within 5 min</span>
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
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div className="flex justify-center">
          {encryptionError ? (
            <span className="text-sm text-destructive text-center">
              Secure messaging unavailable
            </span>
          ) : isEncryptionReady ? (
            <Badge variant="outline" className="gap-1 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" /> End-to-end encrypted
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
                {!msg.isMine && <p className="text-xs text-muted-foreground mb-1">{msg.sender}</p>}
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

      {/* Input field with quick replies */}
      <MessageInput
        onSendMessage={handleSendMessage}
        onSelectIcebreaker={(txt) => requireProFeature() && handleSendMessage(txt)}
        suggestions={dynamicSuggestions}
        isDisabled={!isEncryptionReady || Boolean(encryptionError)}
        isPremiumFeatureLocked={!isProMember}
        onRequestPremiumFeature={requireProFeature}
      />
      <div className="px-4 py-2 flex gap-2 overflow-x-auto">
        {quickReplies.map((r, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(r)}
            className="px-4 py-2 bg-card border border-border rounded-full text-sm whitespace-nowrap hover:bg-muted transition-colors"
          >
            {r}
          </button>
        ))}
        <button className="px-4 py-2 bg-[#FFF7ED] text-foreground rounded-full text-sm whitespace-nowrap border border-border flex items-center gap-2">
          <Smile className="w-4 h-4" /> Share a fun fact
        </button>
      </div>
    </div>
  );
};

export default Messages;
