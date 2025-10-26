import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  category: string;
  attendees: number;
  image: string;
  description: string;
}

const Events = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const events: Event[] = [
    {
      id: "1",
      title: "Morning Yoga & Meditation",
      date: "Sat, Nov 15 • 7:00 AM",
      location: "Central Park, New York",
      category: "Wellness",
      attendees: 18,
      image:
        "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=1200&h=800&fit=crop",
      description:
        "Start your day with a calm, energizing yoga flow and guided meditation session led by Sarah Johnson.",
    },
    {
      id: "2",
      title: "Cooking Class: Italian Cuisine",
      date: "Sun, Nov 16 • 3:00 PM",
      location: "Downtown Toronto",
      category: "Food",
      attendees: 22,
      image:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=800&fit=crop",
      description:
        "Learn authentic Italian cooking techniques with Chef Marco. Includes a 3-course meal tasting.",
    },
    {
      id: "3",
      title: "Tech Networking Night",
      date: "Tue, Nov 18 • 6:30 PM",
      location: "London Tech Hub",
      category: "Networking",
      attendees: 40,
      image:
        "https://images.unsplash.com/photo-1551836022-4c4c79ecde51?w=1200&h=800&fit=crop",
      description:
        "Meet founders, investors, and developers at this monthly networking event for tech professionals.",
    },
    {
      id: "4",
      title: "Photography Walk: City Lights",
      date: "Fri, Nov 21 • 8:00 PM",
      location: "Berlin City Center",
      category: "Art",
      attendees: 15,
      image:
        "https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=1200&h=800&fit=crop",
      description:
        "Join a group of photographers to explore city nightlife scenes and capture stunning long-exposure shots.",
    },
  ];

  const categories = ["All", "Wellness", "Food", "Networking", "Art"];

  const filteredEvents = events.filter(
    (event) =>
      (filter === "All" || event.category === filter) &&
      event.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeInUp">
      {/* Header Section */}
      <Card className="border-border/50 shadow-sm">
        <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="h-6 w-6 text-primary" />
              Upcoming Events
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base mt-1">
              Discover, connect, and experience exciting community activities.
            </p>
          </div>

          <div className="relative w-full sm:w-[300px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={filter === cat ? "default" : "outline"}
            onClick={() => setFilter(cat)}
            className={`rounded-full text-sm px-4 py-2 ${
              filter === cat
                ? "bg-primary text-white"
                : "border-border hover:bg-muted/50"
            }`}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Events Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16 col-span-full text-muted-foreground">
            <p className="text-lg font-medium mb-2">No events found</p>
            <p className="text-sm">
              Try adjusting your search or filters to find more events.
            </p>
          </div>
        ) : (
          filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <div className="relative h-48 sm:h-56 bg-muted">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/80 text-primary shadow-sm">
                      {event.category}
                    </Badge>
                  </div>
                </div>

                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {event.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-primary" />
                      {event.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-primary" />
                      {event.location}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="w-4 h-4 text-primary" />
                      {event.attendees} joined
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="rounded-full text-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/events/${event.id}`);
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default Events;
