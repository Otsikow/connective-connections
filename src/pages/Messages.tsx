import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MoreVertical, Shield, Clock, Phone, Video } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MessageInput } from "@/components/MessageInput";
import { sampleEvents } from "@/lib/events";

interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
  isMine: boolean;
  type?: "text" | "image" | "voice" | "location";
}

const Messages = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const groupId = searchParams.get("group");
  const groupEvent = useMemo(() => sampleEvents.find((e) => e.id === groupId), [groupId]);

  // Default 1-on-1 chat messages
  const defaultMessages: Message[] = [
    { id: 1, sender: "Alex Doe", content: "Hey! How's it going? 👋", time: "10:00 AM", isMine: false },
    { id: 2, sender: "You", content: "I'm doing great, thanks for asking!", time: "10:01 AM", isMine: true },
    { id: 3, sender: "Alex Doe", content: "Want to grab coffee later?", time: "10:02 AM", isMine: false },
  ];

  // Group event messages
  const groupMessages: Message[] = groupEvent
    ? [
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
      ]
    : [];

  useEffect(() => {
    setMessages(groupEvent ? groupMessages : defaultMessages);
  }, [groupEvent]);

  const quickReplies = groupEvent
    ? ["Where's the meetup point?", "Any parking tips?", "Can I bring a friend?"]
    : ["Sounds good! ☕", "What time were you thinking?"];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (message: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      sender: "You",
      content: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isMine: true,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const handleSelectIcebreaker = (text: string) => handleSendMessage(text);

  const handleCall = () => {
    console.log("Initiate voice call...");
  };

  const handleVideoCall = () => {
    console.log("Initiate video call...");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>

        {groupEvent ? (
          <>
            <div className="flex items-center gap-3 flex-1">
              <div className="flex -space-x-3">
                {[groupEvent.host, ...groupEvent.participants].slice(0, 4).map((p, idx) => (
                  <Avatar key={idx} className="w-8 h-8 ring-2 ring-background">
                    <AvatarImage src={(p as any).avatarUrl || "/placeholder.svg"} />
                    <AvatarFallback>{(p as any).name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div>
                <h1 className="text-base font-semibold leading-tight">{groupEvent.title}</h1>
                <p className="text-xs text-muted-foreground">
                  Event group chat · {groupEvent.participants.length + 1} members
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
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-semibold truncate">Alex Doe</h1>
                <Badge className="bg-green-500 text-white gap-1 text-xs">
                  <Shield className="w-3 h-3" />
                  Verified
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className={`w-2 h-2 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-400"}`} />
                <span>Available now</span>
                <Clock className="w-3 h-3" />
                <span>Usually responds within 5 minutes</span>
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
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}>
            <div className={`flex gap-3 max-w-[80%] ${msg.isMine ? "flex-row-reverse" : ""}`}>
              {!msg.isMine && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              )}
              <div>
                {!msg.isMine && (
                  <p className="text-xs text-muted-foreground mb-1">{msg.sender}</p>
                )}
                <div
                  className={`px-4 py-3 rounded-2xl ${
                    msg.isMine
                      ? "bg-[#E8B956] text-charcoal rounded-br-sm"
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
        quickReplies={quickReplies}
      />
    </div>
  );
};

export default Messages;
