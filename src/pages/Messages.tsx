import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Calendar, Mic, Plus, Send, ShieldCheck, Smile, Volume2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const Messages = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [message, setMessage] = useState("");
  const profile = useMemo(
    () =>
      ({
        id: id ?? "alex",
        name: id ? id.charAt(0).toUpperCase() + id.slice(1) : "Alex Doe",
        avatar: "/placeholder.svg",
        verified: true,
        availability: "Usually free on weekends",
      } as const),
    [id],
  );

  const messages = [
    {
      id: 1,
      sender: "Alex Doe",
      content: "Hey! How's it going? 👋",
      time: "10:00 AM",
      isMine: false,
    },
    {
      id: 2,
      sender: "You",
      content: "I'm doing great, thanks for asking! Just enjoying a quiet morning. How about you?",
      time: "10:01 AM",
      isMine: true,
    },
    {
      id: 3,
      sender: "Alex Doe",
      content: "Same here! I was thinking of grabbing coffee later, are you free?",
      time: "10:02 AM",
      isMine: false,
    },
  ];

  const quickReplies = ["Sounds good! ☕", "What time were you thinking?"];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with trust badge and availability */}
      <div className="bg-card border-b border-border px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <Avatar className="w-10 h-10">
          <AvatarImage src={profile.avatar} />
          <AvatarFallback>{profile.name.split(" ")[0][0]}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold truncate">{profile.name}</h1>
            {profile.verified && (
              <Badge className="gap-1 bg-emerald-600 text-white border-emerald-700">
                <ShieldCheck className="w-3.5 h-3.5" /> Trusted
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{profile.availability}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-muted rounded-full">
              <div className="w-6 h-6 flex items-center justify-center">⋮</div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Conversation</DropdownMenuLabel>
            <DropdownMenuItem>View profile</DropdownMenuItem>
            <DropdownMenuItem>Report</DropdownMenuItem>
            <DropdownMenuItem>Block</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Clear chat</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMine ? "justify-end" : "justify-start"}`}>
            <div className={`flex gap-3 max-w-[80%] ${msg.isMine ? "flex-row-reverse" : ""}`}>
              {!msg.isMine && (
                <Avatar className="w-10 h-10 flex-shrink-0">
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
                  <p>{msg.content}</p>
                </div>
                <p className={`text-xs text-muted-foreground mt-1 ${msg.isMine ? "text-right" : ""}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Replies + AI icebreakers */}
      <div className="px-6 py-3 flex gap-2 overflow-x-auto">
        {quickReplies.map((reply, index) => (
          <button
            key={index}
            className="px-4 py-2 bg-card border border-border rounded-full text-sm whitespace-nowrap hover:bg-muted transition-colors"
          >
            {reply}
          </button>
        ))}
        <button className="px-4 py-2 bg-[#FFF7ED] text-foreground rounded-full text-sm whitespace-nowrap border border-border flex items-center gap-2">
          <Smile className="w-4 h-4" /> Ask about their hobbies
        </button>
        <button className="px-4 py-2 bg-[#FFF7ED] text-foreground rounded-full text-sm whitespace-nowrap border border-border flex items-center gap-2">
          <Smile className="w-4 h-4" /> Share a fun fact
        </button>
      </div>

      {/* Input with plus-menu */}
      <div className="bg-card border-t border-border px-6 py-4 flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-muted rounded-full">
              <Plus className="w-6 h-6" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem className="gap-2">
              <Smile className="w-4 h-4" /> Emoji
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Mic className="w-4 h-4" /> Voice
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Volume2 className="w-4 h-4" /> TTS
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2">
              <Calendar className="w-4 h-4" /> Schedule meetup
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 rounded-full bg-background border-border"
        />
        <Button className="w-12 h-12 rounded-full bg-[#E8B956] hover:bg-[#d9a840] p-0">
          <Send className="w-5 h-5 text-charcoal" />
        </Button>
      </div>
    </div>
  );
};

export default Messages;
