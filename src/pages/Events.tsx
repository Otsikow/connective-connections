import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Home as HomeIcon, MessageSquare, Search, User, Calendar as CalendarIcon, MapPin, Users, DollarSign, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const Events = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<"calendar" | "list">("list");
  const [filters, setFilters] = useState({
    interest: "",
    distance: "",
    price: "",
    search: ""
  });

  const events = [
    {
      id: 1,
      title: "Coffee & Chat",
      host: { name: "Sarah Johnson", avatar: "/placeholder.svg" },
      date: new Date(2024, 10, 25, 10, 0),
      location: "The Grind Café, Downtown",
      price: "Free",
      deposit: 0,
      image: "/placeholder.svg",
      interest: "Social",
      participants: 12,
      maxParticipants: 20,
      description: "Join us for a casual coffee meetup and meaningful conversations."
    },
    {
      id: 2,
      title: "Book Club Discussion",
      host: { name: "Mike Chen", avatar: "/placeholder.svg" },
      date: new Date(2024, 10, 26, 15, 0),
      location: "Central Library, Meeting Room 2",
      price: "Free",
      deposit: 0,
      image: "/placeholder.svg",
      interest: "Literature",
      participants: 8,
      maxParticipants: 15,
      description: "Discussing 'The Seven Husbands of Evelyn Hugo' by Taylor Jenkins Reid."
    },
    {
      id: 3,
      title: "Photography Workshop",
      host: { name: "Emma Wilson", avatar: "/placeholder.svg" },
      date: new Date(2024, 10, 28, 14, 0),
      location: "Riverside Park",
      price: "$25",
      deposit: 10,
      image: "/placeholder.svg",
      interest: "Photography",
      participants: 6,
      maxParticipants: 12,
      description: "Learn portrait photography techniques in a beautiful outdoor setting."
    },
    {
      id: 4,
      title: "Cooking Class: Italian Cuisine",
      host: { name: "Chef Marco", avatar: "/placeholder.svg" },
      date: new Date(2024, 11, 2, 18, 0),
      location: "Culinary Studio, 123 Main St",
      price: "$45",
      deposit: 20,
      image: "/placeholder.svg",
      interest: "Cooking",
      participants: 10,
      maxParticipants: 16,
      description: "Master the art of authentic Italian pasta and sauces."
    },
    {
      id: 5,
      title: "Hiking Adventure",
      host: { name: "Alex Thompson", avatar: "/placeholder.svg" },
      date: new Date(2024, 11, 5, 8, 0),
      location: "Mountain Trail Head",
      price: "Free",
      deposit: 0,
      image: "/placeholder.svg",
      interest: "Outdoor",
      participants: 15,
      maxParticipants: 25,
      description: "Moderate 5-mile hike with stunning mountain views."
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                         event.description.toLowerCase().includes(filters.search.toLowerCase());
    const matchesInterest = !filters.interest || event.interest === filters.interest;
    const matchesPrice = !filters.price || 
      (filters.price === "free" && event.price === "Free") ||
      (filters.price === "premium" && event.price !== "Free");
    
    return matchesSearch && matchesInterest && matchesPrice;
  });

  const interests = ["All", "Social", "Literature", "Photography", "Cooking", "Outdoor", "Music", "Art", "Sports"];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Events</h1>
        <Avatar className="w-10 h-10 cursor-pointer" onClick={() => navigate("/profile")}>
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Search events..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2">
            <Select value={filters.interest} onValueChange={(value) => setFilters(prev => ({ ...prev, interest: value }))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Interest" />
              </SelectTrigger>
              <SelectContent>
                {interests.map(interest => (
                  <SelectItem key={interest} value={interest === "All" ? "" : interest}>
                    {interest}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.distance} onValueChange={(value) => setFilters(prev => ({ ...prev, distance: value }))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Distance" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any</SelectItem>
                <SelectItem value="1">1 mile</SelectItem>
                <SelectItem value="5">5 miles</SelectItem>
                <SelectItem value="10">10 miles</SelectItem>
                <SelectItem value="25">25 miles</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.price} onValueChange={(value) => setFilters(prev => ({ ...prev, price: value }))}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Any</SelectItem>
                <SelectItem value="free">Free</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* View Toggle */}
        <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "calendar" | "list")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="border-border overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/events/${event.id}`)}>
                <div className="h-48 bg-muted relative">
                  <div className="absolute top-3 right-3">
                    <Badge variant={event.price === "Free" ? "secondary" : "default"}>
                      {event.price}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <CalendarIcon size={16} />
                        <span>{format(event.date, "MMM d, h:mm a")}</span>
                        <MapPin size={16} />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={event.host.avatar} />
                      <AvatarFallback>{event.host.name[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users size={16} />
                        <span>{event.participants}/{event.maxParticipants}</span>
                      </div>
                      <Badge variant="outline">{event.interest}</Badge>
                    </div>
                    {event.deposit > 0 && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <DollarSign size={16} />
                        <span>${event.deposit} deposit</span>
                      </div>
                    )}
                  </div>

                  <Button className="w-full rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal">
                    Join Event
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="calendar">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-1/3">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>
              <div className="lg:w-2/3">
                <h3 className="text-lg font-semibold mb-4">
                  Events on {selectedDate ? format(selectedDate, "MMMM d, yyyy") : "Select a date"}
                </h3>
                <div className="space-y-3">
                  {filteredEvents
                    .filter(event => 
                      selectedDate && 
                      event.date.toDateString() === selectedDate.toDateString()
                    )
                    .map((event) => (
                      <Card key={event.id} className="border-border cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/events/${event.id}`)}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-16 bg-muted rounded-lg flex-shrink-0"></div>
                            <div className="flex-1">
                              <h4 className="font-semibold">{event.title}</h4>
                              <p className="text-sm text-muted-foreground">{format(event.date, "h:mm a")} • {event.location}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="outline" className="text-xs">{event.interest}</Badge>
                                <Badge variant={event.price === "Free" ? "secondary" : "default"} className="text-xs">
                                  {event.price}
                                </Badge>
                              </div>
                            </div>
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={event.host.avatar} />
                              <AvatarFallback>{event.host.name[0]}</AvatarFallback>
                            </Avatar>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  {selectedDate && filteredEvents.filter(event => 
                    event.date.toDateString() === selectedDate.toDateString()
                  ).length === 0 && (
                    <p className="text-muted-foreground text-center py-8">No events on this date</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-3 flex items-center justify-around">
        <button className="flex flex-col items-center gap-1 text-muted-foreground" onClick={() => navigate("/home")}>
          <HomeIcon size={24} />
          <span className="text-xs">Home</span>
        </button>
        <button className="flex flex-col items-center gap-1 text-[#E8B956]">
          <CalendarIcon size={24} />
          <span className="text-xs font-medium">Events</span>
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
    </div>
  );
};

export default Events;
