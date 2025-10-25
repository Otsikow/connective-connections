import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Settings as SettingsIcon, 
  Star, 
  Users, 
  Calendar, 
  Award, 
  Crown,
  MapPin,
  Clock,
  Heart,
  Bell,
  Shield,
  CreditCard,
  ChevronRight,
  Trophy,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Profile = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [showLocation, setShowLocation] = useState(true);

  // Mock data for friends (matches)
  const friends = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/placeholder.svg",
      mutualFriends: 3,
      location: "San Francisco",
      trustScore: 92,
    },
    {
      id: 2,
      name: "Mike Chen",
      avatar: "/placeholder.svg",
      mutualFriends: 5,
      location: "Oakland",
      trustScore: 88,
    },
    {
      id: 3,
      name: "Emma Davis",
      avatar: "/placeholder.svg",
      mutualFriends: 2,
      location: "Berkeley",
      trustScore: 95,
    },
  ];

  // Mock data for events
  const attendingEvents = [
    {
      id: 1,
      title: "Coffee & Coding Meetup",
      date: "Nov 2, 2025",
      time: "2:00 PM",
      attendees: 12,
    },
    {
      id: 2,
      title: "Weekend Hiking Adventure",
      date: "Nov 5, 2025",
      time: "8:00 AM",
      attendees: 8,
    },
  ];

  const pastEvents = [
    {
      id: 3,
      title: "Book Club Discussion",
      date: "Oct 20, 2025",
      attendees: 15,
    },
    {
      id: 4,
      title: "Photography Walk",
      date: "Oct 15, 2025",
      attendees: 10,
    },
  ];

  const hostedEvents = [
    {
      id: 5,
      title: "Brunch & Connect",
      date: "Oct 28, 2025",
      attendees: 20,
      status: "Completed",
    },
  ];

  // Mock data for badges
  const badges = [
    {
      id: 1,
      name: "First Connection",
      description: "Made your first friend",
      icon: Users,
      color: "text-blue-500",
      unlocked: true,
    },
    {
      id: 2,
      name: "Event Attendee",
      description: "Attended 5 events",
      icon: Calendar,
      color: "text-green-500",
      unlocked: true,
    },
    {
      id: 3,
      name: "Community Builder",
      description: "Hosted 3 events",
      icon: Trophy,
      color: "text-purple-500",
      unlocked: true,
    },
    {
      id: 4,
      name: "Trusted Member",
      description: "Achieved 80+ trust score",
      icon: Shield,
      color: "text-amber-500",
      unlocked: true,
    },
    {
      id: 5,
      name: "Social Butterfly",
      description: "Make 10 connections",
      icon: Heart,
      color: "text-pink-500",
      unlocked: false,
    },
    {
      id: 6,
      name: "Event Master",
      description: "Attend 20 events",
      icon: Award,
      color: "text-indigo-500",
      unlocked: false,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">Profile</h1>
        <div className="w-10" /> {/* Spacer for alignment */}
      </div>

      {/* Profile Header Section */}
      <div className="px-6 py-8 space-y-6">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <Avatar className="w-32 h-32 mb-4 border-4 border-primary/20">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            {/* Trust Score Badge */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 to-amber-600 text-white px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
              <Star className="w-4 h-4" fill="white" />
              <span className="text-sm font-bold">85</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2 mt-4">Jane Doe</h2>
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <MapPin size={16} />
            <span>San Francisco, CA</span>
          </div>
        </div>

        {/* Bio */}
        <Card className="border-border">
          <CardContent className="p-6">
            <p className="text-muted-foreground leading-relaxed text-center">
              Love exploring new coffee shops and hiking trails. Always up for a good book discussion or planning the next adventure. New to the city and excited to meet genuine people! ✨
            </p>
          </CardContent>
        </Card>

        {/* Upgrade to Premium Card */}
        <Card className="border-2 border-amber-500/50 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                  Upgrade to Premium
                  <Sparkles className="w-4 h-4 text-amber-500" />
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Unlock unlimited matches, priority event access, and exclusive badges
                </p>
                <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white">
                  Upgrade Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs Section */}
        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="friends" className="text-xs sm:text-sm">
              <Users className="w-4 h-4 mr-1" />
              Friends
            </TabsTrigger>
            <TabsTrigger value="events" className="text-xs sm:text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              Events
            </TabsTrigger>
            <TabsTrigger value="badges" className="text-xs sm:text-sm">
              <Award className="w-4 h-4 mr-1" />
              Badges
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-xs sm:text-sm">
              <SettingsIcon className="w-4 h-4 mr-1" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Friends Tab */}
          <TabsContent value="friends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Your Connections</CardTitle>
                <CardDescription>People you've matched with</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {friends.map((friend) => (
                  <Card key={friend.id} className="border-border hover:border-primary/50 transition-colors cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={friend.avatar} />
                          <AvatarFallback>{friend.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{friend.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <MapPin size={14} />
                            <span>{friend.location}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users size={12} />
                              {friend.mutualFriends} mutual
                            </span>
                            <span className="flex items-center gap-1">
                              <Star size={12} className="text-amber-500" />
                              {friend.trustScore}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-4">
            {/* Attending Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-green-500" />
                  Attending
                </CardTitle>
                <CardDescription>Upcoming events you're going to</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {attendingEvents.map((event) => (
                  <Card key={event.id} className="border-border">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{event.title}</h3>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {event.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {event.time}
                          </span>
                        </div>
                        <Badge variant="secondary">
                          <Users size={12} className="mr-1" />
                          {event.attendees}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Past Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-500" />
                  Past Events
                </CardTitle>
                <CardDescription>Events you've attended</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {pastEvents.map((event) => (
                  <Card key={event.id} className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold mb-1">{event.title}</h3>
                          <span className="text-sm text-muted-foreground">{event.date}</span>
                        </div>
                        <Badge variant="outline">
                          <Users size={12} className="mr-1" />
                          {event.attendees}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Hosted Events */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-purple-500" />
                  Hosted by You
                </CardTitle>
                <CardDescription>Events you've organized</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {hostedEvents.map((event) => (
                  <Card key={event.id} className="border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold mb-1">{event.title}</h3>
                          <span className="text-sm text-muted-foreground">{event.date}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            <Users size={12} className="mr-1" />
                            {event.attendees}
                          </Badge>
                          <Badge className="bg-green-500">{event.status}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Achievements</CardTitle>
                <CardDescription>Your earned rewards and progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-3">
                  {badges.map((badge) => {
                    const IconComponent = badge.icon;
                    return (
                      <Card 
                        key={badge.id} 
                        className={`border-border ${!badge.unlocked && 'opacity-50'}`}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-full ${badge.unlocked ? 'bg-primary/10' : 'bg-muted'}`}>
                              <IconComponent className={`w-6 h-6 ${badge.unlocked ? badge.color : 'text-muted-foreground'}`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold">{badge.name}</h3>
                                {badge.unlocked && (
                                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{badge.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-4">
            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Privacy
                </CardTitle>
                <CardDescription>Control your profile visibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="public-profile">Public Profile</Label>
                    <p className="text-sm text-muted-foreground">Make your profile visible to everyone</p>
                  </div>
                  <Switch 
                    id="public-profile" 
                    checked={publicProfile}
                    onCheckedChange={setPublicProfile}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-location">Show Location</Label>
                    <p className="text-sm text-muted-foreground">Display your city on your profile</p>
                  </div>
                  <Switch 
                    id="show-location" 
                    checked={showLocation}
                    onCheckedChange={setShowLocation}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifications
                </CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about matches and events</p>
                  </div>
                  <Switch 
                    id="notifications" 
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-muted/50 -mx-2 px-2 rounded">
                  <div className="space-y-0.5">
                    <Label>Email Preferences</Label>
                    <p className="text-sm text-muted-foreground">Configure email notifications</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            {/* Subscription Management */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Subscription
                </CardTitle>
                <CardDescription>Manage your premium subscription</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Current Plan</span>
                    <Badge>Free</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upgrade to Premium for exclusive features
                  </p>
                </div>
                <Button className="w-full" variant="outline">
                  View Plans & Pricing
                </Button>
                <Separator />
                <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-muted/50 -mx-2 px-2 rounded">
                  <div className="space-y-0.5">
                    <Label>Billing History</Label>
                    <p className="text-sm text-muted-foreground">View past payments</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-muted/50 -mx-2 px-2 rounded">
                  <div className="space-y-0.5">
                    <Label>Payment Methods</Label>
                    <p className="text-sm text-muted-foreground">Manage saved cards</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>

            {/* Additional Settings Options */}
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-muted/50 -mx-2 px-2 rounded">
                  <Label>Edit Profile</Label>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-muted/50 -mx-2 px-2 rounded">
                  <Label>Account Settings</Label>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-muted/50 -mx-2 px-2 rounded">
                  <Label>Help & Support</Label>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2 cursor-pointer hover:bg-muted/50 -mx-2 px-2 rounded">
                  <Label className="text-destructive">Log Out</Label>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
