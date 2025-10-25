import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, MessageSquare, Search, User, Users, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Community = () => {
  const navigate = useNavigate();
  const [isPremium] = useState(true); // Set to true to show Create Group button

  const groups = [
    {
      id: 1,
      name: "Downtown Book Club",
      category: "Book Club",
      description: "Monthly discussions on contemporary fiction. Currently reading 'The Midnight Library'. Join us for coffee and conversation!",
      members: 124,
      image: "/placeholder.svg",
      meetingTime: "Every 2nd Saturday, 3:00 PM",
    },
    {
      id: 2,
      name: "Summit Seekers Hiking",
      category: "Hiking Team",
      description: "Weekend warriors exploring local trails. All fitness levels welcome. We provide carpools and gear advice for beginners.",
      members: 89,
      image: "/placeholder.svg",
      meetingTime: "Sundays, 7:00 AM",
    },
    {
      id: 3,
      name: "Spanish Language Exchange",
      category: "Language Swap",
      description: "Practice español in a friendly environment. Native speakers and learners meet for conversational practice over tapas.",
      members: 156,
      image: "/placeholder.svg",
      meetingTime: "Wednesdays, 6:30 PM",
    },
    {
      id: 4,
      name: "French Conversation Circle",
      category: "Language Swap",
      description: "Bonjour! Improve your French through casual conversation. All levels welcome, from beginners to advanced speakers.",
      members: 92,
      image: "/placeholder.svg",
      meetingTime: "Thursdays, 7:00 PM",
    },
    {
      id: 5,
      name: "Mystery & Thriller Readers",
      category: "Book Club",
      description: "For fans of suspense, crime novels, and psychological thrillers. Share theories and recommendations with fellow sleuths.",
      members: 78,
      image: "/placeholder.svg",
      meetingTime: "Every 3rd Sunday, 4:00 PM",
    },
    {
      id: 6,
      name: "Sunrise Trail Runners",
      category: "Hiking Team",
      description: "Early morning trail running group. We focus on building endurance and exploring scenic routes. Coffee stop included!",
      members: 65,
      image: "/placeholder.svg",
      meetingTime: "Tuesdays & Saturdays, 6:00 AM",
    },
    {
      id: 7,
      name: "Italian Culture & Conversation",
      category: "Language Swap",
      description: "Parliamo italiano! Learn Italian while discovering Italian culture, cuisine, and traditions. Beginner-friendly sessions.",
      members: 103,
      image: "/placeholder.svg",
      meetingTime: "Mondays, 7:30 PM",
    },
    {
      id: 8,
      name: "Women's Mountain Hiking",
      category: "Hiking Team",
      description: "Empowering women through mountain adventures. Build confidence, fitness, and lasting friendships on challenging trails.",
      members: 141,
      image: "/placeholder.svg",
      meetingTime: "1st & 3rd Sunday, 8:00 AM",
    },
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Book Club":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300";
      case "Hiking Team":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "Language Swap":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="text-[#E8B956]" size={24} />
          <h1 className="text-xl font-bold">Community Groups</h1>
        </div>
        <Avatar className="w-10 h-10 cursor-pointer" onClick={() => navigate("/profile")}>
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Create Group Button for Premium Users */}
        {isPremium && (
          <Button 
            className="w-full rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal font-semibold h-12 flex items-center justify-center gap-2"
          >
            <Crown size={20} />
            Create a Group
          </Button>
        )}

        {/* Filter/Info Section */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {groups.length} local groups near you
          </p>
        </div>

        {/* Groups List */}
        <div className="space-y-4">
          {groups.map((group) => (
            <Card key={group.id} className="border-border overflow-hidden">
              {/* Image Header */}
              <div className="h-48 bg-gradient-to-br from-[#E8B956]/20 to-[#E8B956]/5 relative flex items-center justify-center">
                <Users size={64} className="text-[#E8B956]/30" />
              </div>
              
              <CardContent className="p-4 space-y-3">
                {/* Group Name and Category */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-lg leading-tight">{group.name}</h3>
                    <Badge className={getCategoryColor(group.category)} variant="secondary">
                      {group.category}
                    </Badge>
                  </div>
                  
                  {/* Members Count */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users size={16} />
                    <span>{group.members} members</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {group.description}
                </p>

                {/* Meeting Time */}
                <div className="text-sm font-medium text-foreground">
                  📅 {group.meetingTime}
                </div>

                {/* Join Chat Button */}
                <Button 
                  className="w-full rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal font-semibold"
                >
                  <MessageSquare size={18} className="mr-2" />
                  Join Chat
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-3 flex items-center justify-around">
        <button 
          className="flex flex-col items-center gap-1 text-muted-foreground"
          onClick={() => navigate("/home")}
        >
          <Home size={24} />
          <span className="text-xs">Home</span>
        </button>
        <button 
          className="flex flex-col items-center gap-1 text-muted-foreground" 
          onClick={() => navigate("/messages")}
        >
          <MessageSquare size={24} />
          <span className="text-xs">Messages</span>
        </button>
        <button 
          className="flex flex-col items-center gap-1 text-[#E8B956]"
        >
          <Users size={24} />
          <span className="text-xs font-medium">Community</span>
        </button>
        <button 
          className="flex flex-col items-center gap-1 text-muted-foreground" 
          onClick={() => navigate("/matches")}
        >
          <Search size={24} />
          <span className="text-xs">Search</span>
        </button>
        <button 
          className="flex flex-col items-center gap-1 text-muted-foreground" 
          onClick={() => navigate("/profile")}
        >
          <User size={24} />
          <span className="text-xs">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default Community;
