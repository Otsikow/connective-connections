import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
  Plus,
  Search,
  User,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import BackButton from "@/components/BackButton";

const Home = () => {
  const navigate = useNavigate();

  const matches = [
    { name: "Jessica", interests: "Hiking, Painting", avatar: "/placeholder.svg" },
    { name: "Alex", interests: "Music, Traveling", avatar: "/placeholder.svg" },
    { name: "Maya", interests: "Yoga, Coffee", avatar: "/placeholder.svg" },
    { name: "Sam", interests: "Running, Tech", avatar: "/placeholder.svg" },
    { name: "Leo", interests: "Photography, Art", avatar: "/placeholder.svg" },
    { name: "Nora", interests: "Cooking, Books", avatar: "/placeholder.svg" },
  ];

  const events = [
    {
      id: "1",
      title: "Coffee & Chat",
      date: "Sat, Nov 25, 10:00 AM",
      location: "The Grind Café",
      image: "/event-placeholder.svg",
    },
    {
      id: "2",
      title: "Book Club",
      date: "Sun, Nov 26, 3:00 PM",
      location: "Central Library",
      image: "/event-placeholder.svg",
    },
    {
      id: "3",
      title: "Sunrise Hike",
      date: "Mon, Nov 27, 6:00 AM",
      location: "Ridge Trailhead",
      image: "/placeholder.svg",
    },
    {
      id: "4",
      title: "Art Walk",
      date: "Tue, Nov 28, 5:30 PM",
      location: "Downtown",
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
  ];

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-28">
      {/* Header + Search */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between mb-3">
          <BackButton
            fallbackPath="/"
            size="icon"
            className="h-10 w-10"
          />
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
            className="pl-10 rounded-full"
          />
        </div>
      </div>

      {/* Tabs Section */}
      <div className="px-4 sm:px-6 py-6 space-y-8">
        <Tabs defaultValue="matches" className="w-full">
          <TabsList className="w-full grid grid-cols-3 h-auto">
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="groups">Groups</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          {/* Matches Tab */}
          <TabsContent value="matches" className="mt-6 space-y-6">
            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-3">New people near you</h2>
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
                          <h3 className="font-semibold">{match.name}</h3>
                          <p className="text-xs text-muted-foreground">
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
                          <button className="w-10 h-10 rounded-full bg-[#E8B956] hover:bg-[#d9a840] flex items-center justify-center flex-shrink-0 transition-colors">
                            <span className="text-xl text-charcoal font-bold">
                              +
                            </span>
                          </button>
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
              <h2 className="text-xl sm:text-2xl font-bold mb-3">Upcoming events</h2>
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
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-lg mb-2">
                            {event.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-1">
                            {event.date}
                          </p>
                          <p className="text-sm text-muted-foreground mb-4">
                            {event.location}
                          </p>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <Button
                              variant="outline"
                              className="w-full sm:flex-1 rounded-full border-[#E8B956]/60 text-[#8c6a17] hover:bg-[#E8B956]/10 hover:text-[#8c6a17]"
                              onClick={() => navigate(`/events/${event.id}`)}
                            >
                              View Details
                            </Button>
                            <Button className="w-full sm:flex-1 rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal font-semibold">
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
      </div>

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
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-2 sm:px-6 py-3 flex items-center justify-around">
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
          <Search size={24} />
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
