import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home as HomeIcon, MessageSquare, Search, User, Plus, Calendar, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const matches = [
    { name: "Jessica", age: 28, interests: "Hiking, Painting", avatar: "/placeholder.svg", distance: "2 miles away" },
    { name: "Alex", age: 26, interests: "Music, Traveling", avatar: "/placeholder.svg", distance: "1.5 miles away" },
    { name: "Sarah", age: 30, interests: "Yoga, Photography", avatar: "/placeholder.svg", distance: "3 miles away" },
    { name: "Michael", age: 29, interests: "Gaming, Cooking", avatar: "/placeholder.svg", distance: "2.5 miles away" },
    { name: "Emma", age: 27, interests: "Reading, Dancing", avatar: "/placeholder.svg", distance: "4 miles away" },
  ];

  const events = [
    {
      title: "Coffee & Chat",
      date: "Sat, Nov 25",
      time: "10:00 AM",
      location: "The Grind Café",
      attendees: 12,
      image: "/placeholder.svg",
    },
    {
      title: "Book Club",
      date: "Sun, Nov 26",
      time: "3:00 PM",
      location: "Central Library",
      attendees: 8,
      image: "/placeholder.svg",
    },
    {
      title: "Hiking Adventure",
      date: "Sat, Dec 2",
      time: "8:00 AM",
      location: "Mountain Trail",
      attendees: 15,
      image: "/placeholder.svg",
    },
    {
      title: "Art Workshop",
      date: "Sun, Dec 3",
      time: "2:00 PM",
      location: "Community Center",
      attendees: 10,
      image: "/placeholder.svg",
    },
  ];

  const communities = [
    {
      name: "Board Game Enthusiasts",
      description: "From Catan to modern classics.",
      members: "1.2k members",
      image: "/placeholder.svg",
    },
    {
      name: "Local Foodies",
      description: "Exploring the best eats in town.",
      members: "2.5k members",
      image: "/placeholder.svg",
    },
    {
      name: "Creative Writers Circle",
      description: "Share your stories and get feedback.",
      members: "850 members",
      image: "/placeholder.svg",
    },
    {
      name: "Photography Club",
      description: "Capture moments and learn together.",
      members: "1.8k members",
      image: "/placeholder.svg",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Connective</h1>
          <Avatar className="w-10 h-10 cursor-pointer" onClick={() => navigate("/profile")}>
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>

        {/* Search Bar */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              type="text"
              placeholder="Search interests, events, or people…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full bg-muted border-0"
            />
          </div>
        </div>
      </div>

      {/* Segmented Tabs */}
      <Tabs defaultValue="matches" className="w-full">
        <div className="sticky top-[137px] z-10 bg-background border-b border-border px-6 py-3">
          <TabsList className="w-full grid grid-cols-3 h-11 bg-muted rounded-full">
            <TabsTrigger value="matches" className="rounded-full data-[state=active]:bg-[#E8B956] data-[state=active]:text-charcoal">
              Matches
            </TabsTrigger>
            <TabsTrigger value="groups" className="rounded-full data-[state=active]:bg-[#E8B956] data-[state=active]:text-charcoal">
              Groups
            </TabsTrigger>
            <TabsTrigger value="events" className="rounded-full data-[state=active]:bg-[#E8B956] data-[state=active]:text-charcoal">
              Events
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Matches Tab */}
        <TabsContent value="matches" className="px-6 py-6 space-y-8 mt-0">
          {/* New People Near You */}
          <section>
            <h2 className="text-xl font-bold mb-4">New people near you</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
              {matches.map((match, index) => (
                <Card 
                  key={index} 
                  className="border-border cursor-pointer hover:shadow-md transition-shadow flex-shrink-0 w-[160px]"
                  onClick={() => navigate("/matches")}
                >
                  <CardContent className="p-4 flex flex-col items-center text-center">
                    <Avatar className="w-20 h-20 mb-3">
                      <AvatarImage src={match.avatar} />
                      <AvatarFallback>{match.name[0]}</AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-base mb-1">{match.name}, {match.age}</h3>
                    <p className="text-xs text-muted-foreground mb-2">{match.distance}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{match.interests}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Upcoming Events Preview */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Upcoming events</h2>
              <Button variant="ghost" size="sm" className="text-[#E8B956]">See all</Button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
              {events.slice(0, 3).map((event, index) => (
                <Card key={index} className="border-border overflow-hidden flex-shrink-0 w-[280px]">
                  <div className="h-32 bg-gradient-to-br from-[#E8B956]/20 to-[#E8B956]/5 flex items-center justify-center">
                    <Calendar className="text-[#E8B956]" size={40} />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-base mb-2">{event.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-1">
                      <Calendar size={14} className="mr-2" />
                      <span>{event.date} • {event.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <MapPin size={14} className="mr-2" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{event.attendees} attending</span>
                      <Button size="sm" className="rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal">
                        Join
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Communities You Might Like */}
          <section>
            <h2 className="text-xl font-bold mb-4">Communities you might like</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
              {communities.map((community, index) => (
                <Card key={index} className="border-border flex-shrink-0 w-[260px]">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#E8B956]/30 to-[#E8B956]/10 flex items-center justify-center flex-shrink-0">
                        <Users className="text-[#E8B956]" size={24} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-1">{community.name}</h3>
                        <p className="text-xs text-muted-foreground">{community.members}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {community.description}
                    </p>
                    <Button size="sm" variant="outline" className="w-full rounded-full border-[#E8B956] text-[#E8B956] hover:bg-[#E8B956] hover:text-charcoal">
                      Join
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </TabsContent>

        {/* Groups Tab */}
        <TabsContent value="groups" className="px-6 py-6 space-y-6 mt-0">
          <section>
            <h2 className="text-xl font-bold mb-4">Recommended for you</h2>
            <div className="space-y-3">
              {communities.map((community, index) => (
                <Card key={index} className="border-border">
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#E8B956]/30 to-[#E8B956]/10 flex items-center justify-center flex-shrink-0">
                      <Users className="text-[#E8B956]" size={28} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1">{community.name}</h3>
                      <p className="text-sm text-muted-foreground mb-1">
                        {community.description}
                      </p>
                      <p className="text-xs text-muted-foreground">{community.members}</p>
                    </div>
                    <Button size="sm" className="rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal flex-shrink-0">
                      Join
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="px-6 py-6 space-y-6 mt-0">
          <section>
            <h2 className="text-xl font-bold mb-4">Curated nearby activities</h2>
            <div className="space-y-4">
              {events.map((event, index) => (
                <Card key={index} className="border-border overflow-hidden">
                  <div className="h-40 bg-gradient-to-br from-[#E8B956]/20 to-[#E8B956]/5 flex items-center justify-center">
                    <Calendar className="text-[#E8B956]" size={48} />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{event.title}</h3>
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar size={16} className="mr-2" />
                      <span>{event.date} • {event.time}</span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <MapPin size={16} className="mr-2" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{event.attendees} attending</span>
                      <Button className="rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal">
                        Join Event
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </TabsContent>
      </Tabs>

      {/* Floating Action Button - Host an Event */}
      <button
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-[#E8B956] hover:bg-[#d9a840] shadow-lg flex items-center justify-center transition-all hover:scale-110 z-20"
        aria-label="Host an Event"
      >
        <Plus className="text-charcoal" size={28} strokeWidth={2.5} />
      </button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-3 flex items-center justify-around z-10">
        <button className="flex flex-col items-center gap-1 text-[#E8B956]">
          <HomeIcon size={24} />
          <span className="text-xs font-medium">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-muted-foreground" onClick={() => navigate("/messages")}>
          <MessageSquare size={24} />
          <span className="text-xs">Messages</span>
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

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Home;
