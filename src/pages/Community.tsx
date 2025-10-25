import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Home as HomeIcon, 
  MessageSquare, 
  Search, 
  User, 
  Plus,
  Users,
  MapPin,
  Calendar,
  Crown
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Community = () => {
  const navigate = useNavigate();

  // Mock data for groups
  const groups = [
    {
      id: 1,
      name: "Book Club Enthusiasts",
      description: "Join us for monthly book discussions, author meetups, and literary adventures. We read everything from classics to contemporary fiction.",
      image: "/placeholder.svg",
      members: 156,
      location: "Downtown Library",
      category: "Books & Literature",
      nextMeeting: "Dec 15, 2024",
      isPremium: false
    },
    {
      id: 2,
      name: "Mountain Hiking Team",
      description: "Explore local trails, national parks, and challenging peaks. All skill levels welcome! We organize weekly hikes and camping trips.",
      image: "/placeholder.svg",
      members: 89,
      location: "Various Trails",
      category: "Outdoor & Adventure",
      nextMeeting: "Dec 8, 2024",
      isPremium: false
    },
    {
      id: 3,
      name: "Spanish Language Exchange",
      description: "Practice Spanish with native speakers and fellow learners. We meet weekly for conversations, games, and cultural activities.",
      image: "/placeholder.svg",
      members: 234,
      location: "Community Center",
      category: "Language & Culture",
      nextMeeting: "Dec 12, 2024",
      isPremium: false
    },
    {
      id: 4,
      name: "Tech Startup Founders",
      description: "Exclusive networking group for startup founders and entrepreneurs. Share experiences, get advice, and build valuable connections.",
      image: "/placeholder.svg",
      members: 67,
      location: "Co-working Space",
      category: "Business & Networking",
      nextMeeting: "Dec 20, 2024",
      isPremium: true
    },
    {
      id: 5,
      name: "Photography Walkers",
      description: "Capture the beauty of our city through photography. We explore different neighborhoods, parks, and landmarks every weekend.",
      image: "/placeholder.svg",
      members: 123,
      location: "City Center",
      category: "Arts & Photography",
      nextMeeting: "Dec 14, 2024",
      isPremium: false
    },
    {
      id: 6,
      name: "Cooking Masters Club",
      description: "Learn new recipes, cooking techniques, and culinary skills. We host cooking classes, potlucks, and restaurant visits.",
      image: "/placeholder.svg",
      members: 178,
      location: "Culinary School",
      category: "Food & Cooking",
      nextMeeting: "Dec 18, 2024",
      isPremium: false
    }
  ];

  // Mock user premium status
  const isPremiumUser = true;

  const GroupCard = ({ group }: { group: typeof groups[0] }) => (
    <Card className="border-border overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-40 sm:h-48 bg-gradient-to-br from-blue-500 to-purple-600 relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-4 right-4">
          {group.isPremium && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h3 className="text-lg sm:text-xl font-bold mb-1 line-clamp-2">{group.name}</h3>
          <p className="text-xs sm:text-sm opacity-90">{group.category}</p>
        </div>
      </div>
      
      <CardContent className="p-4 sm:p-6">
        <p className="text-muted-foreground mb-4 overflow-hidden" style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical'
        }}>{group.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="w-4 h-4 mr-2" />
            <span>{group.members} members</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{group.location}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Next meeting: {group.nextMeeting}</span>
          </div>
        </div>
        
        <Button 
          className="w-full rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal font-medium"
          onClick={() => {
            // Handle join chat functionality
            console.log(`Joining chat for ${group.name}`);
          }}
        >
          Join Chat
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Community Groups</h1>
        <div className="flex items-center gap-3">
          {isPremiumUser && (
            <Button 
              size="sm" 
              className="bg-[#E8B956] hover:bg-[#d9a840] text-charcoal rounded-full"
              onClick={() => {
                // Handle create group functionality
                console.log("Create new group");
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          )}
          <Avatar className="w-10 h-10 cursor-pointer" onClick={() => navigate("/profile")}>
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6">
        {/* Search and Filter Section */}
        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search groups..."
              className="w-full pl-10 pr-4 py-3 border border-border rounded-full bg-background focus:outline-none focus:ring-2 focus:ring-[#E8B956] focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {["All", "Books & Literature", "Outdoor & Adventure", "Language & Culture", "Business & Networking", "Arts & Photography", "Food & Cooking"].map((category) => (
              <Badge 
                key={category} 
                variant={category === "All" ? "default" : "outline"}
                className="whitespace-nowrap cursor-pointer hover:bg-[#E8B956] hover:text-charcoal"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Groups Grid */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <h2 className="text-xl sm:text-2xl font-bold">Local Groups</h2>
            <span className="text-sm text-muted-foreground">{groups.length} groups found</span>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            {groups.map((group) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </div>

        {/* Premium CTA */}
        {!isPremiumUser && (
          <Card className="mt-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-6 text-center">
              <Crown className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
              <h3 className="text-xl font-bold mb-2">Unlock Premium Features</h3>
              <p className="text-muted-foreground mb-4">
                Create your own groups, access exclusive communities, and unlock advanced features.
              </p>
              <Button className="bg-[#E8B956] hover:bg-[#d9a840] text-charcoal rounded-full">
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 sm:px-6 py-3 flex items-center justify-around">
        <button className="flex flex-col items-center gap-1 text-muted-foreground" onClick={() => navigate("/home")}>
          <HomeIcon size={24} />
          <span className="text-xs">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-muted-foreground" onClick={() => navigate("/messages")}>
          <MessageSquare size={24} />
          <span className="text-xs">Messages</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#E8B956]">
          <Search size={24} />
          <span className="text-xs font-medium">Community</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-muted-foreground" onClick={() => navigate("/matches")}>
          <Search size={24} />
          <span className="text-xs">Search</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-muted-foreground" onClick={() => navigate("/profile")}>
          <User size={24} />
          <span className="text-xs">Profile</span>
        </button>
      </nav>
    </div>
  );
};

export default Community;