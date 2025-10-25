import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Plus, 
  Send, 
  Smile, 
  Mic, 
  Volume2, 
  Calendar,
  Shield,
  Clock,
  X,
  Image as ImageIcon,
  MapPin
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

const Messages = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    {
      id: 4,
      sender: "You",
      content: "That sounds great! I love trying new coffee spots. What time works for you?",
      time: "10:05 AM",
      isMine: true,
    },
    {
      id: 5,
      sender: "Alex Doe",
      content: "How about 2 PM at the cafe on Main Street? They have amazing pastries too!",
      time: "10:07 AM",
      isMine: false,
    },
  ];

  // AI-generated icebreaker suggestions
  const icebreakerSuggestions = [
    "Ask about their hobbies",
    "What's your favorite coffee spot?",
    "Any weekend plans?",
    "Love your interest in hiking! 🏔️",
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle sending message
      setMessage("");
    }
  };

  const handleIcebreakerClick = (suggestion: string) => {
    setMessage(suggestion);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4 flex items-center gap-3 shadow-sm">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 hover:bg-muted rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        
        <Avatar className="w-11 h-11 ring-2 ring-[#E8B956]">
          <AvatarImage src="/placeholder.svg" alt="Alex Doe" />
          <AvatarFallback className="bg-[#FF8663] text-white">AD</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold truncate">Alex Doe</h1>
            {/* Trust Badge */}
            <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200 gap-1 px-2 py-0">
              <Shield className="w-3 h-3" />
              Verified
            </Badge>
          </div>
          {/* Availability */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Usually replies in ~15 min</span>
            <span className="w-2 h-2 bg-green-500 rounded-full ml-1"></span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 hover:bg-muted rounded-full transition-colors">
              <div className="w-5 h-5 flex items-center justify-center font-bold">⋮</div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>View Profile</DropdownMenuItem>
            <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
            <DropdownMenuItem className="text-red-600">Block User</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="space-y-4 max-w-4xl mx-auto">
          {/* Match notification */}
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <div className="bg-gradient-to-r from-[#FF8663] to-[#E8B956] rounded-full p-3 mb-3">
              <span className="text-2xl">🎉</span>
            </div>
            <p className="text-sm font-medium mb-1">You matched with Alex Doe!</p>
            <p className="text-xs text-muted-foreground">
              Start a conversation and plan your first meetup
            </p>
          </div>

          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.isMine ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              <div className={`flex gap-3 max-w-[75%] ${msg.isMine ? "flex-row-reverse" : ""}`}>
                {!msg.isMine && (
                  <Avatar className="w-9 h-9 flex-shrink-0">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-[#FF8663] text-white text-sm">AD</AvatarFallback>
                  </Avatar>
                )}
                <div className={msg.isMine ? "items-end" : "items-start"}>
                  <div
                    className={`px-4 py-3 rounded-2xl ${
                      msg.isMine
                        ? "bg-[#E8B956] text-charcoal rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                  <p className={`text-xs text-muted-foreground mt-1 px-1 ${msg.isMine ? "text-right" : ""}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* AI Icebreaker Suggestions */}
      <div className="px-4 py-3 border-t border-border bg-card/50">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-muted-foreground">✨ Suggested:</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {icebreakerSuggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleIcebreakerClick(suggestion)}
              className="px-4 py-2 bg-gradient-to-r from-[#FF8663]/10 to-[#E8B956]/10 border border-[#E8B956]/30 rounded-full text-sm whitespace-nowrap hover:from-[#FF8663]/20 hover:to-[#E8B956]/20 transition-all hover:scale-105 font-medium"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-card border-t border-border px-4 py-4">
        <div className="flex items-end gap-3 max-w-4xl mx-auto">
          {/* Plus Menu */}
          <DropdownMenu open={showMenu} onOpenChange={setShowMenu}>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-10 w-10 rounded-full hover:bg-muted flex-shrink-0"
              >
                <Plus className={`w-5 h-5 transition-transform ${showMenu ? 'rotate-45' : ''}`} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-56">
              <DropdownMenuItem className="gap-3 py-3">
                <Smile className="w-5 h-5 text-[#FF8663]" />
                <span>Send Emoji</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-3">
                <ImageIcon className="w-5 h-5 text-[#E8B956]" />
                <span>Share Photo</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-3">
                <Mic className="w-5 h-5 text-blue-500" />
                <span>Voice Message</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-3">
                <Volume2 className="w-5 h-5 text-purple-500" />
                <span>Text-to-Speech</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-3">
                <Calendar className="w-5 h-5 text-green-500" />
                <span>Schedule Meetup</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-3 py-3">
                <MapPin className="w-5 h-5 text-red-500" />
                <span>Share Location</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Message Input */}
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              className="rounded-full bg-muted border-border pr-12 py-6 text-sm"
            />
            <button 
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-background rounded-full transition-colors"
              onClick={() => {/* Emoji picker */}}
            >
              <Smile className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Send Button */}
          <Button 
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="h-12 w-12 rounded-full bg-[#E8B956] hover:bg-[#d9a840] p-0 flex-shrink-0 disabled:opacity-50"
          >
            <Send className="w-5 h-5 text-charcoal" />
          </Button>
        </div>

        {/* Safety reminder */}
        <p className="text-xs text-muted-foreground text-center mt-3">
          💡 Remember to meet in public places for your first meetup
        </p>
      </div>
    </div>
  );
};

export default Messages;
