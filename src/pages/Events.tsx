import { useState } from "react";
import { EventCard, Event } from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Calendar as CalendarIcon,
  Grid3x3,
  List,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

// Mock data - replace with actual data from API
const mockEvents: Event[] = [
  {
    id: "1",
    title: "Morning Yoga & Meditation Session",
    description: "Join us for a relaxing morning yoga session followed by guided meditation.",
    bannerImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=400&fit=crop",
    hostName: "Sarah Johnson",
    hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    date: "Nov 15, 2025",
    time: "7:00 AM",
    location: "Central Park, New York",
    fee: 15,
    deposit: 5,
    isFree: false,
    category: "Wellness",
    distance: "2.3 mi",
    participantsCount: 12,
    maxParticipants: 20,
  },
  {
    id: "2",
    title: "Tech Startup Networking Mixer",
    description: "Connect with fellow entrepreneurs and tech enthusiasts at our monthly networking event.",
    bannerImage: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop",
    hostName: "Mike Chen",
    hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    date: "Nov 18, 2025",
    time: "6:00 PM",
    location: "Innovation Hub, San Francisco",
    fee: 0,
    isFree: true,
    category: "Networking",
    distance: "5.1 mi",
    participantsCount: 45,
    maxParticipants: 100,
  },
  {
    id: "3",
    title: "Photography Walk: Golden Hour",
    description: "Explore the city during golden hour and improve your photography skills.",
    bannerImage: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=400&fit=crop",
    hostName: "Emma Davis",
    hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emma",
    date: "Nov 20, 2025",
    time: "5:30 PM",
    location: "Brooklyn Bridge, Brooklyn",
    fee: 25,
    deposit: 10,
    isFree: false,
    category: "Arts & Culture",
    distance: "3.7 mi",
    participantsCount: 8,
    maxParticipants: 15,
  },
  {
    id: "4",
    title: "Board Game Night: Strategy Edition",
    description: "Love strategy games? Join us for an evening of board games and fun!",
    bannerImage: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&h=400&fit=crop",
    hostName: "Alex Rivera",
    hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    date: "Nov 22, 2025",
    time: "7:00 PM",
    location: "Game Cafe, Austin",
    fee: 10,
    isFree: false,
    category: "Social",
    distance: "1.2 mi",
    participantsCount: 16,
    maxParticipants: 24,
  },
  {
    id: "5",
    title: "Hiking Adventure: Mountain Trail",
    description: "Challenging hike with breathtaking views. All fitness levels welcome!",
    bannerImage: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&h=400&fit=crop",
    hostName: "Chris Thompson",
    hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chris",
    date: "Nov 25, 2025",
    time: "8:00 AM",
    location: "Rocky Mountain Trail, Colorado",
    fee: 0,
    isFree: true,
    category: "Outdoors",
    distance: "15.8 mi",
    participantsCount: 20,
    maxParticipants: 30,
  },
  {
    id: "6",
    title: "Wine Tasting & Food Pairing",
    description: "Learn about wine selection and food pairing from expert sommeliers.",
    bannerImage: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800&h=400&fit=crop",
    hostName: "Sophie Laurent",
    hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie",
    date: "Nov 27, 2025",
    time: "6:30 PM",
    location: "Vintage Wine Bar, Napa Valley",
    fee: 75,
    deposit: 25,
    isFree: false,
    category: "Food & Drink",
    distance: "8.4 mi",
    participantsCount: 18,
    maxParticipants: 25,
  },
];

const categories = [
  "All",
  "Wellness",
  "Networking",
  "Arts & Culture",
  "Social",
  "Outdoors",
  "Food & Drink",
  "Sports",
  "Learning",
];

const Events = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [priceRange, setPriceRange] = useState<"all" | "free" | "paid">("all");
  const [maxDistance, setMaxDistance] = useState([20]);
  const [maxPrice, setMaxPrice] = useState([100]);

  // Filter events based on current filters
  const filteredEvents = mockEvents.filter((event) => {
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedCategory !== "All" && event.category !== selectedCategory) {
      return false;
    }
    if (priceRange === "free" && !event.isFree) {
      return false;
    }
    if (priceRange === "paid" && event.isFree) {
      return false;
    }
    if (!event.isFree && event.fee > maxPrice[0]) {
      return false;
    }
    if (event.distance) {
      const distance = parseFloat(event.distance);
      if (distance > maxDistance[0]) {
        return false;
      }
    }
    return true;
  });

  const clearFilters = () => {
    setSelectedDate(undefined);
    setSelectedCategory("All");
    setPriceRange("all");
    setMaxDistance([20]);
    setMaxPrice([100]);
    setSearchQuery("");
  };

  const activeFiltersCount = [
    selectedDate,
    selectedCategory !== "All",
    priceRange !== "all",
    maxDistance[0] < 20,
    maxPrice[0] < 100,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">Events</h1>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="border-b bg-muted/30">
          <div className="container mx-auto px-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Date Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Interest/Category Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Interest</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Distance Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Distance: Up to {maxDistance[0]} mi
                </label>
                <Slider
                  value={maxDistance}
                  onValueChange={setMaxDistance}
                  max={50}
                  step={1}
                  className="mt-2"
                />
              </div>

              {/* Price Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Price</label>
                <Tabs value={priceRange} onValueChange={(v) => setPriceRange(v as any)}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="free">Free</TabsTrigger>
                    <TabsTrigger value="paid">Paid</TabsTrigger>
                  </TabsList>
                </Tabs>
                {priceRange !== "free" && (
                  <div className="mt-2">
                    <label className="text-xs text-muted-foreground">
                      Max: ${maxPrice[0]}
                    </label>
                    <Slider
                      value={maxPrice}
                      onValueChange={setMaxPrice}
                      max={200}
                      step={5}
                      className="mt-1"
                    />
                  </div>
                )}
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="mt-3 gap-2"
              >
                <X className="h-3 w-3" />
                Clear all filters
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Events Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredEvents.length} event{filteredEvents.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No events found matching your criteria.</p>
            <Button variant="link" onClick={clearFilters} className="mt-2">
              Clear filters
            </Button>
          </div>
        ) : (
          <div
            className={cn(
              "grid gap-6",
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            )}
          >
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
