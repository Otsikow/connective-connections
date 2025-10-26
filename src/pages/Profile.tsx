import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Settings,
  MapPin,
  Calendar,
  Star,
  Users,
  Award,
  Shield,
  Bell,
  CreditCard,
  Crown,
  MessageCircle,
  Heart,
  Clock,
  CheckCircle,
  Plus,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("friends");

  // Profile mock data
  const profile = {
    name: "Jane Doe",
    location: "San Francisco, CA",
    joinedDate: "November 2025",
    trustScore: 85,
    bio: "Love exploring new coffee shops and hiking trails. Always up for a good book discussion or planning the next adventure. New to the city and excited to meet genuine people!",
    interests: ["Hiking", "Photography", "Coffee", "Reading", "Travel"],
    isPremium: false,
  };

  const friends = [
    { id: 1, name: "Alex Chen", avatar: "/placeholder.svg", lastSeen: "2 hours ago", mutualFriends: 3 },
    { id: 2, name: "Sarah Johnson", avatar: "/placeholder.svg", lastSeen: "1 day ago", mutualFriends: 5 },
    { id: 3, name: "Mike Rodriguez", avatar: "/placeholder.svg", lastSeen: "3 days ago", mutualFriends: 2 },
    { id: 4, name: "Emma Wilson", avatar: "/placeholder.svg", lastSeen: "1 week ago", mutualFriends: 4 },
  ];

  const events = {
    attending: [
      { id: 1, title: "Coffee & Coding Meetup", date: "Nov 2, 2025", time: "2:00 PM", location: "Blue Bottle Coffee" },
      { id: 2, title: "Weekend Hiking Adventure", date: "Nov 5, 2025", time: "8:00 AM", location: "Golden Gate Park" },
    ],
    past: [
      { id: 3, title: "Book Club Discussion", date: "Oct 20, 2025", time: "7:00 PM", location: "City Lights Bookstore" },
      { id: 4, title: "Photography Walk", date: "Oct 15, 2025", time: "10:00 AM", location: "SF MOMA" },
    ],
    hosted: [
      { id: 5, title: "Brunch & Connect", date: "Oct 28, 2025", time: "10:00 AM", location: "My Apartment" },
    ],
  };

  const badges = [
    { id: 1, name: "First Connection", description: "Made your first friend", icon: "🤝", earned: true },
    { id: 2, name: "Event Attendee", description: "Attended 5 events", icon: "🎉", earned: true },
    { id: 3, name: "Community Builder", description: "Hosted 3 events", icon: "🏗️", earned: true },
    { id: 4, name: "Trusted Member", description: "Achieved 80+ trust score", icon: "⭐", earned: true },
    { id: 5, name: "Social Butterfly", description: "Made 10 connections", icon: "🦋", earned: false, progress: 70 },
    { id: 6, name: "Event Master", description: "Attended 20 events", icon: "🎯", earned: false, progress: 40 },
  ];

  const settings = {
    privacy: {
      profileVisibility: "public",
      showLocation: true,
      showInterests: true,
      showEvents: true,
    },
    notifications: {
      newMatches: true,
      eventReminders: true,
      messages: true,
      eventUpdates: false,
    },
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">Profile</h1>
        <div className="w-10" />
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 py-6 space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-2">
            <Avatar className="w-32 h-32 ring-4 ring-amber-400/30">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 flex items-center gap-1 rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-black shadow-lg">
              <Star className="w-3.5 h-3.5" />
              <span>{profile.trustScore}</span>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold mb-2">{profile.name}</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <MapPin size={14} className="flex-shrink-0" />
            <span className="truncate">{profile.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar size={14} className="flex-shrink-0" />
            <span>Joined {profile.joinedDate}</span>
          </div>
        </div>

        {/* About Me */}
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground leading-relaxed mb-4">{profile.bio}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {profile.interests.map((interest, i) => (
                <Badge key={i} variant="secondary" className="text-sm">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Premium CTA */}
        {!profile.isPremium && (
          <Card className="border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
            <CardContent className="p-6 text-center">
              <Crown className="w-12 h-12 text-amber-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 flex justify-center items-center gap-1">
                Upgrade to Premium <Sparkles className="w-4 h-4 text-amber-500" />
              </h3>
              <p className="text-muted-foreground mb-4">
                Unlock unlimited matches, event access, and exclusive badges.
              </p>
              <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white">
                Upgrade Now
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="friends" className="text-xs sm:text-sm">
              <Users className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Friends</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="text-xs sm:text-sm">
              <Calendar className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Events</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="text-xs sm:text-sm">
              <Award className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Badges</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm">
              <Settings className="w-4 h-4 sm:mr-2" /> <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Friends */}
          <TabsContent value="friends" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Friends ({friends.length})</h3>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" /> Add Friend
              </Button>
            </div>
            {friends.map((friend) => (
              <Card key={friend.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={friend.avatar} />
                      <AvatarFallback>{friend.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-semibold">{friend.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {friend.mutualFriends} mutual friends • {friend.lastSeen}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Events */}
          <TabsContent value="events" className="space-y-6">
            {Object.entries(events).map(([key, list]) => (
              <div key={key}>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 capitalize">
                  {key === "attending" && <Clock className="w-5 h-5" />}
                  {key === "past" && <CheckCircle className="w-5 h-5" />}
                  {key === "hosted" && <Crown className="w-5 h-5" />}
                  {key} ({list.length})
                </h3>
                {list.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-4 flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {event.date} at {event.time} • {event.location}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">View</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </TabsContent>

          {/* Badges */}
          <TabsContent value="badges" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Achievements</h3>
              <Badge variant="outline">
                {badges.filter((b) => b.earned).length} / {badges.length} earned
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {badges.map((badge) => (
                <Card key={badge.id} className={badge.earned ? "bg-green-50 border-green-200" : "opacity-70"}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{badge.icon}</div>
                      <div>
                        <h4 className="font-semibold flex items-center gap-2">
                          {badge.name}
                          {badge.earned && <CheckCircle className="w-4 h-4 text-green-600" />}
                        </h4>
                        <p className="text-sm text-muted-foreground">{badge.description}</p>
                        {!badge.earned && (
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${badge.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Privacy
                </CardTitle>
                <CardDescription>Control your profile visibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Profile Visibility</Label>
                  <Badge variant="outline">{settings.privacy.profileVisibility}</Badge>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <Label>Show Location</Label>
                  <Switch checked={settings.privacy.showLocation} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Show Interests</Label>
                  <Switch checked={settings.privacy.showInterests} />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Show Events</Label>
                  <Switch checked={settings.privacy.showEvents} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" /> Notifications
                </CardTitle>
                <CardDescription>Manage how you stay updated</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
                    <Switch checked={value} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" /> Subscription
                </CardTitle>
                <CardDescription>Manage your premium plan</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Current Plan</p>
                    <p className="text-sm text-muted-foreground">
                      {profile.isPremium ? "Premium" : "Free Plan"}
                    </p>
                  </div>
                  <Badge variant={profile.isPremium ? "default" : "outline"}>
                    {profile.isPremium ? "Active" : "Free"}
                  </Badge>
                </div>
                <Button className="w-full">
                  {profile.isPremium ? "Manage Subscription" : "Upgrade to Premium"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
