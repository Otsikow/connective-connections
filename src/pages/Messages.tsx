import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Plus, Send } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { sampleEvents } from "@/lib/events";

const Messages = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("");

  const groupId = searchParams.get("group");
  const groupEvent = useMemo(() => sampleEvents.find((e) => e.id === groupId), [groupId]);

  const defaultMessages = [
    { id: 1, sender: "Alex Doe", content: "Hey! How's it going? 👋", time: "10:00 AM", isMine: false },
    { id: 2, sender: "You", content: "I'm doing great, thanks!", time: "10:01 AM", isMine: true },
    { id: 3, sender: "Alex Doe", content: "Want to grab coffee later?", time: "10:02 AM", isMine: false },
  ];

  const groupMessages = groupEvent
    ? [
        { id: 1, sender: groupEvent.host.name, content: `Welcome to ${groupEvent.title} group chat!`, time: "9:00 AM", isMine: false },
        { id: 2, sender: "You", content: "Hi everyone! Excited to join 👋", time: "9:01 AM", isMine: true },
        { id: 3, sender: groupEvent.participants[0]?.name || "Member", content: "See you all there!", time: "9:05 AM", isMine: false },
      ]
    : [];

  const messages = groupEvent ? groupMessages : defaultMessages;

  const quickReplies = groupEvent
    ? ["Where's the meetup point?", "Any parking tips?", "Can I bring a friend?"]
    : ["Sounds good! ☕", "What time were you thinking?"];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        {groupEvent ? (
          <>
            <div className="flex items-center gap-3 flex-1">
              <div className="flex -space-x-3">
                {[groupEvent.host, ...groupEvent.participants].slice(0, 4).map((p, idx) => (
                  <Avatar key={idx} className="w-8 h-8 ring-2 ring-background">
                    <AvatarImage src={(p as any).avatarUrl} />
                    <AvatarFallback>{(p as any).name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <div>
                <h1 className="text-base font-semibold leading-tight">{groupEvent.title}</h1>
                <p className="text-xs text-muted-foreground">Event group chat · {groupEvent.participants.length + 1} members</p>
              </div>
            </div>
            <button className="p-2 hover:bg-muted rounded-full">
              <div className="w-6 h-6 flex items-center justify-center">⋮</div>
            </button>
          </>
        ) : (
          <>
            <Avatar className="w-10 h-10">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <h1 className="text-lg font-semibold flex-1">Alex Doe</h1>
            <button className="p-2 hover:bg-muted rounded-full">
              <div className="w-6 h-6 flex items-center justify-center">⋮</div>
            </button>
          </>
        )}
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

      {/* Quick Replies */}
      <div className="px-6 py-3 flex gap-2 overflow-x-auto">
        {quickReplies.map((reply, index) => (
          <button
            key={index}
            className="px-4 py-2 bg-card border border-border rounded-full text-sm whitespace-nowrap hover:bg-muted transition-colors"
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="bg-card border-t border-border px-6 py-4 flex items-center gap-3">
        <button className="p-2 hover:bg-muted rounded-full">
          <Plus className="w-6 h-6" />
        </button>
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
