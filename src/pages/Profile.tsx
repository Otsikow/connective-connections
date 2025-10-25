import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Settings as SettingsIcon,
  MapPin,
  Calendar,
  Star,
  Users,
  Bell,
  Shield,
  Crown,
} from "lucide-react";
import BackButton from "@/components/BackButton";

const Profile = () => {
  const navigate = useNavigate();

  const badges = ["First Connection", "Event Attendee", "Community Builder"];

  const friends = [
    { name: "Jane D.", subtitle: "3 mutual interests", image: "/images/avatars/avatar-1.svg" },
    { name: "Sarah M.", subtitle: "Met at Coffee Club", image: "/images/avatars/avatar-2.svg" },
    { name: "Alex P.", subtitle: "Hiking group", image: "/images/avatars/avatar-3.svg" },
  ];

  const eventsAttending = [
    { title: "City Sunset Hike", date: "Nov 28, 6:00 PM", location: "Twin Peaks" },
    { title: "Latte Art Workshop", date: "Dec 2, 10:00 AM", location: "Downtown Cafe" },
  ];

  const eventsPast = [
    { title: "Book Club Night", date: "Nov 10, 7:00 PM", location: "Mission Library" },
  ];

  const eventsHosted = [
    { title: "Weekend Trail Run", date: "Oct 19, 8:00 AM", location: "Presidio" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <BackButton />
        <h1 className="text-lg font-semibold">Profile</h1>
        <button className="p-2 hover:bg-muted rounded-full">
          <SettingsIcon className="w-6 h-6" />
        </button>
      </div>

      <div className="px-6 py-8 space-y-6">
        {/* Profile Header with trust badge */}
        <div className="flex flex-col items-center text-center">
          <div className="relative mb-2">
            <Avatar className="w-32 h-32">
              <AvatarImage src="/images/avatars/avatar-1.svg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 flex items-center gap-1 rounded-full bg-[#E8B956] px-2 py-1 text-xs font-bold text-black shadow">
              <Star className="w-3.5 h-3.5" />
              <span>85</span>
            </div>
          </div>
          <h2 className="text-2xl font-bold mb-2">Jane Doe</h2>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <MapPin size={16} />
            <span>San Francisco, CA</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar size={16} />
            <span>Joined November 2025</span>
          </div>
        </div>

        {/* Bio */}
        <Card className="border-border">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-3">About Me</h3>
            <p className="text-muted-foreground leading-relaxed">
              Love exploring new coffee shops and hiking trails. Always up for a good book discussion
              or planning the next adventure. New to the city and excited to meet genuine people!
            </p>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="friends" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="friends" className="gap-2">
              <Users className="w-4 h-4" /> Friends
            </TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Friends */}
          <TabsContent value="friends">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Matches</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {friends.map((f, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={f.image} />
                        <AvatarFallback>{f.name.split(" ")[0][0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{f.name}</p>
                        <p className="text-sm text-muted-foreground">{f.subtitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="rounded-full">
                        Message
                      </Button>
                      <Button size="sm" variant="outline" className="rounded-full">
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Events */}
          <TabsContent value="events">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Events</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="attending" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="attending">Attending</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                    <TabsTrigger value="hosted">Hosted</TabsTrigger>
                  </TabsList>

                  <TabsContent value="attending" className="space-y-3">
                    {eventsAttending.map((e, idx) => (
                      <Card key={idx} className="border-border">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium">{e.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {e.date} • {e.location}
                            </p>
                          </div>
                          <Button size="sm" variant="outline" className="rounded-full">
                            View
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="past" className="space-y-3">
                    {eventsPast.map((e, idx) => (
                      <Card key={idx} className="border-border">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium">{e.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {e.date} • {e.location}
                            </p>
                          </div>
                          <Button size="sm" variant="outline" className="rounded-full">
                            Details
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="hosted" className="space-y-3">
                    {eventsHosted.map((e, idx) => (
                      <Card key={idx} className="border-border">
                        <CardContent className="p-4 flex items-center justify-between">
                          <div>
                            <p className="font-medium">{e.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {e.date} • {e.location}
                            </p>
                          </div>
                          <Button size="sm" className="rounded-full">
                            Manage
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Badges */}
          <TabsContent value="badges">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Badges</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-3">
                {badges.map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 px-4 py-2 bg-[#E8B956]/10 rounded-full"
                  >
                    <Star size={16} className="text-[#E8B956]" />
                    <span className="text-sm font-medium">{badge}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Hide profile from search</p>
                    <p className="text-sm text-muted-foreground">
                      Your profile won’t appear in discovery
                    </p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Share location with matches</p>
                    <p className="text-sm text-muted-foreground">Approximate city-level only</p>
                  </div>
                  <Switch />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-4 h-4" /> Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="msg-notifs" className="font-medium">
                    Message notifications
                  </Label>
                  <Switch id="msg-notifs" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="event-reminders" className="font-medium">
                    Event reminders
                  </Label>
                  <Switch id="event-reminders" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-updates" className="font-medium">
                    Email updates
                  </Label>
                  <Switch id="email-updates" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">Subscription</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Current plan: Free</p>
                  <p className="text-sm text-muted-foreground">
                    Upgrade for unlimited events and boosts
                  </p>
                </div>
                <Button className="rounded-full">Manage</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Premium CTA */}
        <Card className="border-border bg-gradient-to-r from-[#FFF7ED] to-background">
          <CardContent className="p-6 flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-[#E8B956]/20">
                <Crown className="w-5 h-5 text-[#E8B956]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Upgrade to Premium</h3>
                <p className="text-sm text-muted-foreground">
                  Unlock unlimited matches, priority boosts, and exclusive events.
                </p>
              </div>
            </div>
            <Button className="rounded-full">Go Premium</Button>
          </CardContent>
        </Card>

        {/* Footer Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button className="h-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Edit Profile
          </Button>
          <Button
            variant="outline"
            className="h-12 rounded-full"
            onClick={() => navigate("/host")}
          >
            <Shield className="mr-2 h-4 w-4" /> Host Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
