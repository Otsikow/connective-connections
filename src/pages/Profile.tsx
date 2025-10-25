import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Settings, 
  MapPin, 
  Calendar, 
  Star, 
  Users, 
  Calendar as CalendarIcon,
  Award,
  Shield,
  Bell,
  CreditCard,
  Crown,
  MessageCircle,
  Heart,
  Clock,
  CheckCircle,
  XCircle,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("friends");

  // Mock data
  const profile = {
    name: "Jane Doe",
    location: "San Francisco, CA",
    joinedDate: "November 2025",
    trustScore: 85,
    bio: "Love exploring new coffee shops and hiking trails. Always up for a good book discussion or planning the next adventure. New to the city and excited to meet genuine people!",
    interests: ["Hiking", "Photography", "Coffee", "Reading", "Travel"],
    isPremium: false
  };

  const friends = [
    { id: 1, name: "Alex Chen", avatar: "/placeholder.svg", lastSeen: "2 hours ago", mutualFriends: 3 },
    { id: 2, name: "Sarah Johnson", avatar: "/placeholder.svg", lastSeen: "1 day ago", mutualFriends: 5 },
    { id: 3, name: "Mike Rodriguez", avatar: "/placeholder.svg", lastSeen: "3 days ago", mutualFriends: 2 },
    { id: 4, name: "Emma Wilson", avatar: "/placeholder.svg", lastSeen: "1 week ago", mutualFriends: 4 },
  ];

  const events = {
    attending: [
      { id: 1, title: "Coffee & Books Meetup", date: "Dec 15, 2024", time: "2:00 PM", location: "Blue Bottle Coffee" },
      { id: 2, title: "Hiking Adventure", date: "Dec 20, 2024", time: "8:00 AM", location: "Golden Gate Park" },
    ],
    past: [
      { id: 3, title: "Photography Workshop", date: "Dec 8, 2024", time: "10:00 AM", location: "SF MOMA" },
      { id: 4, title: "Book Club Discussion", date: "Dec 1, 2024", time: "7:00 PM", location: "City Lights Bookstore" },
    ],
    hosted: [
      { id: 5, title: "Newcomers Welcome Party", date: "Dec 12, 2024", time: "6:00 PM", location: "My Apartment" },
    ]
  };

  const badges = [
    { id: 1, name: "First Connection", description: "Made your first friend", icon: "🤝", earned: true, date: "Dec 1, 2024" },
    { id: 2, name: "Event Attendee", description: "Attended 5 events", icon: "🎉", earned: true, date: "Dec 5, 2024" },
    { id: 3, name: "Community Builder", description: "Hosted 3 events", icon: "🏗️", earned: true, date: "Dec 10, 2024" },
    { id: 4, name: "Social Butterfly", description: "Made 10 friends", icon: "🦋", earned: false, progress: 7 },
    { id: 5, name: "Event Master", description: "Attended 20 events", icon: "🎯", earned: false, progress: 8 },
    { id: 6, name: "Trust Champion", description: "Reach 100 trust score", icon: "⭐", earned: false, progress: 85 },
  ];

  const settings = {
    privacy: {
      profileVisibility: "public",
      showLocation: true,
      showInterests: true,
      showEvents: true
    },
    notifications: {
      newMatches: true,
      eventReminders: true,
      messages: true,
      eventUpdates: false
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">Profile</h1>
        <button className="p-2 hover:bg-muted rounded-full">
          <Settings className="w-6 h-6" />
        </button>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <Avatar className="w-32 h-32 mb-4">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            {profile.isPremium && (
              <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full p-1">
                <Crown className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          <h2 className="text-2xl font-bold mb-2">{profile.name}</h2>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <MapPin size={16} />
            <span>{profile.location}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground mb-4">
            <Calendar size={16} />
            <span>Joined {profile.joinedDate}</span>
          </div>
          
          {/* Trust Score Badge */}
          <div className="flex items-center gap-2 px-4 py-2 bg-[#E8B956]/10 rounded-full mb-4">
            <Star className="w-5 h-5 text-[#E8B956]" fill="#E8B956" />
            <span className="font-semibold">Trust Score: {profile.trustScore}</span>
          </div>
        </div>

        {/* Bio */}
        <Card className="border-border">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-3">About Me</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              {profile.bio}
            </p>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Premium Upgrade Card */}
        {!profile.isPremium && (
          <Card className="border-2 border-gradient-to-r from-yellow-400 to-yellow-600 bg-gradient-to-r from-yellow-50 to-orange-50">
            <CardContent className="p-6 text-center">
              <Crown className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">Upgrade to Premium</h3>
              <p className="text-muted-foreground mb-4">
                Unlock exclusive features, priority matching, and advanced filters
              </p>
              <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                Upgrade Now - $9.99/month
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="friends" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Friends</span>
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Events</span>
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              <span className="hidden sm:inline">Badges</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Friends Tab */}
          <TabsContent value="friends" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Friends ({friends.length})</h3>
              <Button size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Friends
              </Button>
            </div>
            <div className="space-y-3">
              {friends.map((friend) => (
                <Card key={friend.id} className="border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={friend.avatar} />
                        <AvatarFallback>{friend.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{friend.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {friend.mutualFriends} mutual friends • {friend.lastSeen}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Heart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <div className="space-y-6">
              {/* Attending Events */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Attending ({events.attending.length})
                </h3>
                <div className="space-y-3">
                  {events.attending.map((event) => (
                    <Card key={event.id} className="border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">{event.date} at {event.time}</p>
                            <p className="text-sm text-muted-foreground">{event.location}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            <Calendar className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Past Events */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Past Events ({events.past.length})
                </h3>
                <div className="space-y-3">
                  {events.past.map((event) => (
                    <Card key={event.id} className="border-border opacity-75">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">{event.date} at {event.time}</p>
                            <p className="text-sm text-muted-foreground">{event.location}</p>
                          </div>
                          <Button size="sm" variant="outline" disabled>
                            <XCircle className="w-4 h-4 mr-2" />
                            Completed
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Hosted Events */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Hosted Events ({events.hosted.length})
                </h3>
                <div className="space-y-3">
                  {events.hosted.map((event) => (
                    <Card key={event.id} className="border-border">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold">{event.title}</h4>
                            <p className="text-sm text-muted-foreground">{event.date} at {event.time}</p>
                            <p className="text-sm text-muted-foreground">{event.location}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            <Settings className="w-4 h-4 mr-2" />
                            Manage
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Achievements</h3>
              <Badge variant="outline">
                {badges.filter(b => b.earned).length} / {badges.length} earned
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {badges.map((badge) => (
                <Card key={badge.id} className={`border-border ${badge.earned ? 'bg-green-50 border-green-200' : 'opacity-60'}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{badge.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold flex items-center gap-2">
                          {badge.name}
                          {badge.earned && <CheckCircle className="w-4 h-4 text-green-600" />}
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">{badge.description}</p>
                        {badge.earned ? (
                          <p className="text-xs text-green-600">Earned on {badge.date}</p>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span>Progress</span>
                              <span>{badge.progress}/100</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full" 
                                style={{ width: `${badge.progress}%` }}
                              ></div>
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

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="space-y-6">
              {/* Privacy Settings */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Privacy Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Profile Visibility</p>
                      <p className="text-sm text-muted-foreground">Who can see your profile</p>
                    </div>
                    <Badge variant="outline">{settings.privacy.profileVisibility}</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Location</p>
                      <p className="text-sm text-muted-foreground">Display your city in profile</p>
                    </div>
                    <Switch checked={settings.privacy.showLocation} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Interests</p>
                      <p className="text-sm text-muted-foreground">Display your interests</p>
                    </div>
                    <Switch checked={settings.privacy.showInterests} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Events</p>
                      <p className="text-sm text-muted-foreground">Display your event activity</p>
                    </div>
                    <Switch checked={settings.privacy.showEvents} />
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Matches</p>
                      <p className="text-sm text-muted-foreground">Get notified when someone likes you</p>
                    </div>
                    <Switch checked={settings.notifications.newMatches} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Event Reminders</p>
                      <p className="text-sm text-muted-foreground">Reminders for upcoming events</p>
                    </div>
                    <Switch checked={settings.notifications.eventReminders} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Messages</p>
                      <p className="text-sm text-muted-foreground">New message notifications</p>
                    </div>
                    <Switch checked={settings.notifications.messages} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Event Updates</p>
                      <p className="text-sm text-muted-foreground">Updates about events you're attending</p>
                    </div>
                    <Switch checked={settings.notifications.eventUpdates} />
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Management */}
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Subscription
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Current Plan</p>
                      <p className="text-sm text-muted-foreground">
                        {profile.isPremium ? 'Premium' : 'Free Plan'}
                      </p>
                    </div>
                    <Badge variant={profile.isPremium ? "default" : "outline"}>
                      {profile.isPremium ? 'Active' : 'Free'}
                    </Badge>
                  </div>
                  {profile.isPremium ? (
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full">
                        Manage Subscription
                      </Button>
                      <Button variant="outline" className="w-full">
                        Billing History
                      </Button>
                    </div>
                  ) : (
                    <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade to Premium
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
