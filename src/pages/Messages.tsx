import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Plus, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Messages = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

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
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <Avatar className="w-10 h-10">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
        <h1 className="text-lg font-semibold flex-1">Alex Doe</h1>
        <button className="p-2 hover:bg-muted rounded-full">
          <div className="w-6 h-6 flex items-center justify-center">⋮</div>
        </button>
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
