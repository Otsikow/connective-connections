import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MoreVertical, Shield, Clock, Phone, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { MessageInput } from "@/components/MessageInput";

interface Message {
  id: number;
  sender: string;
  content: string;
  time: string;
  isMine: boolean;
  type?: 'text' | 'image' | 'voice' | 'location';
}

const Messages = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "Sarah M.",
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
      sender: "Sarah M.",
      content: "Same here! I was thinking of grabbing coffee later, are you free?",
      time: "10:02 AM",
      isMine: false,
    },
    {
      id: 4,
      sender: "You",
      content: "That sounds perfect! I know a great little coffee shop downtown. What time were you thinking?",
      time: "10:03 AM",
      isMine: true,
    },
    {
      id: 5,
      sender: "Sarah M.",
      content: "How about 2 PM? I'm flexible though!",
      time: "10:04 AM",
      isMine: false,
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isOnline, setIsOnline] = useState(true);

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
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMine: true,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSelectIcebreaker = (icebreaker: string) => {
    handleSendMessage(icebreaker);
  };

  const handleCall = () => {
    // TODO: Implement voice call
    console.log("Voice call");
  };

  const handleVideoCall = () => {
    // TODO: Implement video call
    console.log("Video call");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 flex items-center gap-3">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-muted rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <Avatar className="w-10 h-10">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold truncate">Sarah M.</h1>
            <Badge className="bg-green-500 text-white gap-1 text-xs trust-badge">
              <Shield className="w-3 h-3" />
              Verified
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
            <span>Available now</span>
            <Clock className="w-3 h-3" />
            <span>Usually responds within 5 minutes</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCall}
            className="h-8 w-8 p-0 hover:bg-green-100"
          >
            <Phone className="w-4 h-4 text-green-600" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleVideoCall}
            className="h-8 w-8 p-0 hover:bg-blue-100"
          >
            <Video className="w-4 h-4 text-blue-600" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.isMine ? "justify-end" : "justify-start"} message-enter`}>
            <div className={`flex gap-3 max-w-[80%] ${msg.isMine ? "flex-row-reverse" : ""}`}>
              {!msg.isMine && (
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>SM</AvatarFallback>
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
                <p className={`text-xs text-muted-foreground mt-1 ${msg.isMine ? "text-right" : ""}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <MessageInput 
        onSendMessage={handleSendMessage}
        onSelectIcebreaker={handleSelectIcebreaker}
      />
    </div>
  );
};

export default Messages;
