import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isVerified: boolean;
  isOnline: boolean;
}

const chats: Chat[] = [
  {
    id: "1",
    name: "Alex Doe",
    avatar: "/placeholder.svg",
    lastMessage: "How about 2 PM at the cafe on Main Street?",
    time: "10:07 AM",
    unread: 2,
    isVerified: true,
    isOnline: true,
  },
  {
    id: "2",
    name: "Sarah M.",
    avatar: "/placeholder.svg",
    lastMessage: "That sounds great! I'd love to join.",
    time: "Yesterday",
    unread: 0,
    isVerified: true,
    isOnline: false,
  },
  {
    id: "3",
    name: "Mike R.",
    avatar: "/placeholder.svg",
    lastMessage: "Let's plan that game night!",
    time: "2 days ago",
    unread: 1,
    isVerified: false,
    isOnline: true,
  },
];

const ChatList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="pl-10 rounded-full bg-muted border-border"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="divide-y divide-border">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-6">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-xl font-bold mb-2">No conversations yet</h2>
            <p className="text-muted-foreground mb-6">
              Start matching with people to begin chatting!
            </p>
            <button
              onClick={() => navigate("/matches")}
              className="px-6 py-3 bg-[#E8B956] hover:bg-[#d9a840] text-charcoal rounded-full font-semibold transition-colors"
            >
              Find Friends
            </button>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => navigate(`/messages/${chat.id}`)}
              className="w-full px-4 py-4 flex items-center gap-3 hover:bg-muted/50 transition-colors"
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <Avatar className="w-14 h-14">
                  <AvatarImage src={chat.avatar} alt={chat.name} />
                  <AvatarFallback className="bg-[#FF8663] text-white">
                    {chat.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {chat.isOnline && (
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></span>
                )}
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold truncate">{chat.name}</h3>
                  {chat.isVerified && (
                    <Shield className="w-4 h-4 text-green-600 flex-shrink-0" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {chat.lastMessage}
                </p>
              </div>

              {/* Time and Badge */}
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {chat.time}
                </span>
                {chat.unread > 0 && (
                  <Badge className="bg-[#FF8663] hover:bg-[#FF8663] text-white rounded-full min-w-[20px] h-5 flex items-center justify-center px-2">
                    {chat.unread}
                  </Badge>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
