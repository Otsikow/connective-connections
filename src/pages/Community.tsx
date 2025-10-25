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
  Crown,
  Loader2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CreateGroupDialog } from "@/components/CreateGroupDialog";
import { useToast } from "@/hooks/use-toast";

interface Group {
  id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  image_url: string | null;
  next_meeting: string | null;
  is_premium: boolean;
  created_at: string;
  member_count?: number;
}

const Community = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Mock user premium status - in real app, fetch from user profile
  const isPremiumUser = true;

  // Fetch groups from Supabase
  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      
      let query = supabase
        .from("groups")
        .select("*")
        .order("created_at", { ascending: false });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Fetch member counts for each group
      const groupsWithCounts = await Promise.all(
        (data || []).map(async (group) => {
          const { count } = await supabase
            .from("group_members")
            .select("*", { count: "exact", head: true })
            .eq("group_id", group.id);
          
          return {
            ...group,
            member_count: count || 0
          };
        })
      );

      setGroups(groupsWithCounts);
    } catch (error: any) {
      console.error("Error fetching groups:", error);
      toast({
        title: "Error",
        description: "Failed to load groups. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  // Filter groups based on search and category
  const filteredGroups = groups.filter((group) => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || group.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "TBA";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  const GroupCard = ({ group }: { group: Group }) => (
    <Card className="border-border overflow-hidden hover:shadow-lg transition-shadow">
      <div 
        className="h-48 relative bg-cover bg-center"
        style={{
          backgroundImage: group.image_url 
            ? `url(${group.image_url})` 
            : "linear-gradient(to bottom right, rgb(59, 130, 246), rgb(147, 51, 234))"
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-4 right-4">
          {group.is_premium && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
              <Crown className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold mb-1">{group.name}</h3>
          <p className="text-sm opacity-90">{group.category}</p>
        </div>
      </div>
      
      <CardContent className="p-6">
        <p className="text-muted-foreground mb-4 overflow-hidden" style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical'
        }}>{group.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="w-4 h-4 mr-2" />
            <span>{group.member_count || 0} members</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{group.location}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            <span>Next meeting: {formatDate(group.next_meeting)}</span>
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
      <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Community Groups</h1>
        <div className="flex items-center gap-3">
          {isPremiumUser && (
            <Button 
              size="sm" 
              className="bg-[#E8B956] hover:bg-[#d9a840] text-charcoal rounded-full"
              onClick={() => setIsCreateDialogOpen(true)}
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

      <div className="px-6 py-6">
        {/* Search and Filter Section */}
        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-full bg-background focus:outline-none focus:ring-2 focus:ring-[#E8B956] focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            {["All", "Books & Literature", "Outdoor & Adventure", "Language & Culture", "Business & Networking", "Arts & Photography", "Food & Cooking"].map((category) => (
              <Badge 
                key={category} 
                variant={category === selectedCategory ? "default" : "outline"}
                className="whitespace-nowrap cursor-pointer hover:bg-[#E8B956] hover:text-charcoal"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Groups Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Local Groups</h2>
            <span className="text-sm text-muted-foreground">{filteredGroups.length} groups found</span>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-[#E8B956]" />
            </div>
          ) : filteredGroups.length === 0 ? (
            <Card className="p-12 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No groups found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedCategory !== "All" 
                  ? "Try adjusting your search or filters"
                  : "Be the first to create a group!"}
              </p>
              {isPremiumUser && (
                <Button 
                  className="bg-[#E8B956] hover:bg-[#d9a840] text-charcoal rounded-full"
                  onClick={() => setIsCreateDialogOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Group
                </Button>
              )}
            </Card>
          ) : (
            <div className="grid gap-6">
              {filteredGroups.map((group) => (
                <GroupCard key={group.id} group={group} />
              ))}
            </div>
          )}
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

      {/* Create Group Dialog */}
      <CreateGroupDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onGroupCreated={fetchGroups}
      />

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-3 flex items-center justify-around">
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