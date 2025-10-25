import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import {
  Home as HomeIcon,
  MessageSquare,
  Search,
  User,
  Calendar as CalendarIcon,
  MapPin,
  Users,
  DollarSign,
  ArrowRight,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import { EventItem, EventInterest, EventPriceTier, formatPriceUSD, sampleEvents } from "@/lib/events";

const interests: EventInterest[] = ["Tech", "Fitness", "Music", "Art", "Outdoors", "Food", "Networking"];
const priceTiers: EventPriceTier[] = ["Free", "Standard", "Premium"];

function EventCard({ event, onJoin }: { event: EventItem; onJoin: (id: string) => void }) {
  const navigate = useNavigate();
  return (
    <Card
      className="border-border overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/events/${event.id}`)}
    >
      <div className="h-40 w-full bg-muted relative">
        <img src={event.bannerUrl} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute top-3 right-3">
          <Badge variant={event.fee === 0 ? "secondary" : "default"}>{event.fee === 0 ? "Free" : formatPriceUSD(event.fee)}</Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <CalendarIcon size={16} />
              <span>{format(new Date(event.date), "MMM d, h:mm a")}</span>
              <MapPin size={16} />
              <span>{event.location.city ?? event.location.address}</span>
            </div>
          </div>
          <Avatar className="w-10 h-10">
            <AvatarImage src={event.host.avatarUrl} />
            <AvatarFallback>{event.host.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{event.participants.length}</span>
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

        <Button
          className="w-full rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal"
          onClick={(e) => {
            e.stopPropagation();
            onJoin(event.id);
          }}
        >
          Join Event
        </Button>
      </CardContent>
    </Card>
  );
}

const Events = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [interest, setInterest] = useState<string>("all");
  const [maxDistance, setMaxDistance] = useState<number>(25);
  const [price, setPrice] = useState<string>("all");
  const [search, setSearch] = useState<string>("");
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

  const filteredEvents = useMemo(() => {
    return sampleEvents.filter((evt) => {
      const matchesDate = selectedDate ? evt.date === selectedDate.toISOString().slice(0, 10) : true;
      const matchesInterest = interest === "all" ? true : evt.interest === (interest as EventInterest);
      const matchesDistance = evt.distanceKm <= maxDistance;
      const matchesPrice = price === "all" ? true : evt.priceTier === (price as EventPriceTier);
      const matchesSearch = evt.title.toLowerCase().includes(search.toLowerCase());
      return matchesDate && matchesInterest && matchesDistance && matchesPrice && matchesSearch;
    });
  }, [selectedDate, interest, maxDistance, price, search]);

  const handleJoin = (id: string) => {
    navigate(`/events/${id}`);
  };

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
        {/* Search + Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
            <Input
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <Select value={interest} onValueChange={setInterest}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Interest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {interests.map((i) => (
                  <SelectItem key={i} value={i}>
                    {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={price} onValueChange={setPrice}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {priceTiers.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="hidden lg:flex items-center gap-2 px-2">
              <span className="text-sm font-semibold">Distance</span>
              <Slider value={[maxDistance]} min={1} max={50} step={1} onValueChange={(v) => setMaxDistance(v[0])} />
              <span className="text-sm text-muted-foreground">Up to {maxDistance} km</span>
            </div>

            <Button
              variant="outline"
              className="ml-auto flex items-center gap-2 rounded-full"
              onClick={() => {
                setSelectedDate(new Date());
                setInterest("all");
                setMaxDistance(25);
                setPrice("all");
                setSearch("");
              }}
            >
              <Filter size={16} />
              Reset
            </Button>
          </div>
        </div>

        {/* Tabs for List / Calendar View */}
        <Tabs value={viewMode} onValueChange={(val) => setViewMode(val as "list" | "calendar")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4 mt-4">
            {filteredEvents.length === 0 ? (
              <div className="text-muted-foreground text-sm text-center py-8">No events match your filters.</div>
            ) : (
              filteredEvents.map((evt) => <EventCard key={evt.id} event={evt} onJoin={handleJoin} />)
            )}
          </TabsContent>

          <TabsContent value="calendar" className="mt-4">
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
                    .filter(
                      (evt) =>
                        selectedDate && new Date(evt.date).toDateString() === selectedDate.toDateString()
                    )
                    .map((evt) => (
                      <EventCard key={evt.id} event={evt} onJoin={handleJoin} />
                    ))}
                  {selectedDate &&
                    filteredEvents.filter(
                      (evt) => new Date(evt.date).toDateString() === selectedDate.toDateString()
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
