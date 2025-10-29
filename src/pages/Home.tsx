import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Home as HomeIcon,
  MessageSquare,
  Search,
  User,
  Plus,
  Calendar as CalendarIcon,
  MapPin,
  Users,
  Crown,
  Sparkles,
  X,
} from "lucide-react";
import BackButton from "@/components/BackButton";

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showPremiumReminder, setShowPremiumReminder] = useState(true);

  const premiumBenefits = [
    {
      title: "Priority matching",
      description: "Be featured to the most compatible connections first.",
    },
    {
      title: "Unlimited introductions",
      description: "Start as many conversations as you like every day.",
    },
    {
      title: "Exclusive experiences",
      description: "Unlock premium-only events and curated community drops.",
    },
  ];

  const matches = [
    { name: "Jessica", age: 28, interests: "Hiking, Painting", avatar: "/placeholder.svg", distance: "2 miles away" },
    { name: "Alex", age: 26, interests: "Music, Traveling", avatar: "/placeholder.svg", distance: "1.5 miles away" },
    { name: "Sarah", age: 30, interests: "Yoga, Photography", avatar: "/placeholder.svg", distance: "3 miles away" },
    { name: "Michael", age: 29, interests: "Gaming, Cooking", avatar: "/placeholder.svg", distance: "2.5 miles away" },
    { name: "Emma", age: 27, interests: "Reading, Dancing", avatar: "/placeholder.svg", distance: "4 miles away" },
  ];

  const events = [
    {
      id: "1",
      title: "Coffee & Chat",
      date: "Sat, Nov 25",
      time: "10:00 AM",
      location: "The Grind Café",
      attendees: 12,
      image: "/event-placeholder.svg",
    },
    {
      id: "2",
      title: "Book Club",
      date: "Sun, Nov 26",
      time: "3:00 PM",
      location: "Central Library",
      attendees: 8,
      image: "/event-placeholder.svg",
    },
    {
      id: "3",
      title: "Sunrise Hike",
      date: "Mon, Nov 27",
      time: "6:00 AM",
      location: "Ridge Trailhead",
      attendees: 15,
      image: "/placeholder.svg",
    },
    {
      id: "4",
      title: "Art Workshop",
      date: "Tue, Nov 28",
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
      image: "/community-placeholder.svg",
    },
    {
      name: "Local Foodies",
      description: "Exploring the best eats in town.",
      members: "2.5k members",
      image: "/community-placeholder.svg",
    },
    {
      name: "Creative Writers Circle",
      description: "Share your stories and get feedback.",
      members: "850 members",
      image: "/community-placeholder.svg",
    },
    {
      name: "City Runners",
      description: "Weekly 5k and training tips.",
      members: "3.1k members",
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
    <div className="min-h-screen bg-background pb-24 sm:pb-28">
      {/* Header + Search */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <BackButton fallbackPath="/" size="icon" className="h-10 w-10" />
          <h1 className="text-xl font-bold">Connective</h1>
          <Avatar
            className="w-10 h-10 cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search interests, events, or people…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-full bg-muted border-0"
          />
        </div>
      </div>

      {/* Premium Subscription Banner */}
      {showPremiumReminder && (
        <div className="px-4 sm:px-6 pt-4">
          <Card className="relative overflow-hidden border-none bg-gradient-to-r from-[#3b1d59] via-[#5b2c83] to-[#8c4fcf] text-white shadow-lg">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.2),_transparent_55%)]" />
            <CardContent className="relative p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-white/20 text-white border-white/30 px-3 py-1 text-xs uppercase tracking-wide">
                      Premium Perks
                    </Badge>
                    <Crown className="h-5 w-5 text-amber-200" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold">Elevate your connections experience</h2>
                    <p className="text-sm sm:text-base text-white/80 mt-1">
                      Subscribe to unlock the full suite of features designed to help you find meaningful relationships faster.
                    </p>
                  </div>
                  <ul className="grid gap-2 sm:grid-cols-3">
                    {premiumBenefits.map((benefit) => (
                      <li key={benefit.title} className="flex items-start gap-2 text-sm text-white/80">
                        <Sparkles className="mt-1 h-4 w-4 flex-shrink-0 text-amber-200" />
                        <span>
                          <span className="font-semibold text-white">{benefit.title}:</span> {benefit.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex w-full flex-col gap-3 sm:w-auto sm:items-end">
                  <Button
                    size="lg"
                    className="bg-white text-[#3b1d59] hover:bg-white/90 rounded-full px-6"
                    onClick={() => navigate("/profile")}
                  >
                    Explore Premium
                  </Button>
                  <button
                    type="button"
                    className="inline-flex items-center gap-1 text-xs text-white/70 hover:text-white sm:text-sm"
                    onClick={() => setShowPremiumReminder(false)}
                  >
                    <X className="h-3.5 w-3.5" /> Dismiss reminder
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tabs Section */}
      <Tabs defaultValue="matches" className="w-full px-4 sm:px-6 py-6 space-y-6">
        <TabsList className="w-full grid grid-cols-3 h-11 bg-muted rounded-full">
          <TabsTrigger
            value="matches"
            className="rounded-full data-[state=active]:bg-[#E8B956] data-[state=active]:text-charcoal"
          >
            Matches
          </TabsTrigger>
          <TabsTrigger
            value="groups"
            className="rounded-full data-[state=active]:bg-[#E8B956] data-[state=active]:text-charcoal"
          >
            Groups
          </TabsTrigger>
          <TabsTrigger
            value="events"
            className="rounded-full data-[state=active]:bg-[#E8B956] data-[state=active]:text-charcoal"
          >
            Events
          </TabsTrigger>
        </TabsList>

        {/* Matches Tab */}
        <TabsContent value="matches" className="mt-4 space-y-8">
          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">
              New people near you
            </h2>
            <Carousel className="w-full">
              <CarouselContent>
                {matches.map((match, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-2/3 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <Card
                      className="border-border cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigate("/matches")}
                    >
                      <CardContent className="p-4 flex flex-col items-center text-center">
                        <Avatar className="w-20 h-20 mb-3">
                          <AvatarImage src={match.avatar} />
                          <AvatarFallback>{match.name[0]}</AvatarFallback>
                        </Avatar>
                        <h3 className="font-semibold text-base mb-1">
                          {match.name}, {match.age}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-1">
                          {match.distance}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {match.interests}
                        </p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </section>
        </TabsContent>

        {/* Groups Tab */}
        <TabsContent value="groups" className="mt-6 space-y-6">
          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-3">
              Communities you might like
            </h2>
            <Carousel className="w-full">
              <CarouselContent>
                {communities.map((community, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-3/4 sm:basis-1/2 md:basis-1/3"
                  >
                    <Card className="border-border">
                      <CardContent className="p-4 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-muted flex-shrink-0 overflow-hidden ring-2 ring-[#E8B956]/10">
                          <img
                            src={community.image}
                            alt={community.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">
                            {community.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-1">
                            {community.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {community.members}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          className="rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal flex-shrink-0"
                        >
                          Join
                        </Button>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </section>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="mt-6 space-y-6">
          <section>
            <h2 className="text-xl sm:text-2xl font-bold mb-3">
              Upcoming Events
            </h2>
            <Carousel className="w-full">
              <CarouselContent>
                {events.map((event, index) => (
                  <CarouselItem
                    key={index}
                    className="basis-[85%] sm:basis-2/3 md:basis-1/2"
                  >
                    <Card className="border-border overflow-hidden hover:shadow-lg transition-all duration-200">
                      <div className="h-40 bg-muted flex items-center justify-center relative overflow-hidden">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2">
                          {event.title}
                        </h3>
                        <div className="flex items-center text-sm text-muted-foreground mb-2">
                          <CalendarIcon size={16} className="mr-2" />
                          <span>
                            {event.date} • {event.time}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-4">
                          <MapPin size={16} className="mr-2" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {event.attendees} attending
                          </span>
                          <Button className="rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal">
                            Join Event
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </section>
        </TabsContent>
      </Tabs>

      {/* Floating Host Event Button */}
      <Button
        className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal shadow-lg flex items-center gap-2 h-12 sm:h-auto px-4 sm:px-6 text-sm sm:text-base"
        onClick={() => navigate("/host/create-event")}
      >
        <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="hidden xs:inline">Host Event</span>
        <span className="xs:hidden">Host</span>
      </Button>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 sm:px-6 py-3 flex items-center justify-around z-10">
        <button className="flex flex-col items-center gap-1 text-[#E8B956]">
          <HomeIcon size={24} />
          <span className="text-xs font-medium">Home</span>
        </button>
        <button
          className="flex flex-col items-center gap-1 text-muted-foreground"
          onClick={() => navigate("/events")}
        >
          <CalendarIcon size={24} />
          <span className="text-xs">Events</span>
        </button>
        <button
          className="flex flex-col items-center gap-1 text-muted-foreground"
          onClick={() => navigate("/messages")}
        >
          <MessageSquare size={24} />
          <span className="text-xs">Messages</span>
        </button>
        <button
          className="flex flex-col items-center gap-1 text-muted-foreground"
          onClick={() => navigate("/community")}
        >
          <Users size={24} />
          <span className="text-xs">Community</span>
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

export default Home;
