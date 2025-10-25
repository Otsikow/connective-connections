import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { MapPin, ArrowRight } from "lucide-react";
import { EventItem, EventInterest, EventPriceTier, formatPriceUSD, sampleEvents } from "@/lib/events";

const interests: EventInterest[] = ["Tech", "Fitness", "Music", "Art", "Outdoors", "Food", "Networking"];
const priceTiers: EventPriceTier[] = ["Free", "Standard", "Premium"];

function EventCard({ event, onJoin }: { event: EventItem; onJoin: (id: string) => void }) {
  const navigate = useNavigate();
  return (
    <Card className="overflow-hidden border-border">
      <div className="h-40 w-full bg-muted relative">
        <img src={event.bannerUrl} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold leading-tight">{event.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <MapPin className="w-4 h-4" />
              <span>{event.location.city ?? event.location.address}</span>
              <span>· {event.distanceKm.toFixed(1)} km</span>
              <span>· {event.startTime}</span>
            </div>
          </div>
          <Avatar className="w-10 h-10">
            <AvatarImage src={event.host.avatarUrl} />
            <AvatarFallback>{event.host.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="text-sm">
            <span className="font-semibold">{formatPriceUSD(event.fee)}</span>
            {event.deposit ? <span className="text-muted-foreground"> · ${event.deposit} deposit</span> : null}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full" onClick={() => navigate(`/events/${event.id}`)}>
              Details
            </Button>
            <Button className="rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal" onClick={() => onJoin(event.id)}>
              Join
            </Button>
          </div>
        </div>
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

  const filteredEvents = useMemo(() => {
    return sampleEvents.filter((evt) => {
      // Date filter by same day as selectedDate
      const matchesDate = selectedDate
        ? evt.date === selectedDate.toISOString().slice(0, 10)
        : true;
      const matchesInterest = interest === "all" ? true : evt.interest === (interest as EventInterest);
      const matchesDistance = evt.distanceKm <= maxDistance;
      const matchesPrice = price === "all" ? true : evt.priceTier === (price as EventPriceTier);
      return matchesDate && matchesInterest && matchesDistance && matchesPrice;
    });
  }, [selectedDate, interest, maxDistance, price]);

  const handleJoin = (id: string) => {
    navigate(`/events/${id}`);
  };

  return (
    <div className="min-h-screen bg-background px-6 py-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-card border border-border rounded-lg p-4">
            <h2 className="text-base font-semibold mb-3">Date</h2>
            <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="rounded-md" />
            <Separator className="my-4" />

            <h2 className="text-base font-semibold mb-2">Interest</h2>
            <Select value={interest} onValueChange={setInterest}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select interest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {interests.map((i) => (
                  <SelectItem value={i} key={i}>
                    {i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <h2 className="text-base font-semibold mt-4 mb-2">Distance (km)</h2>
            <div className="px-1">
              <Slider value={[maxDistance]} min={1} max={50} step={1} onValueChange={(v) => setMaxDistance(v[0])} />
              <div className="text-sm text-muted-foreground mt-1">Up to {maxDistance} km</div>
            </div>

            <h2 className="text-base font-semibold mt-4 mb-2">Price</h2>
            <Select value={price} onValueChange={setPrice}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {priceTiers.map((p) => (
                  <SelectItem value={p} key={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="mt-4 flex justify-end">
              <Button variant="outline" className="rounded-full" onClick={() => { setSelectedDate(new Date()); setInterest("all"); setMaxDistance(25); setPrice("all"); }}>
                Reset Filters
              </Button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold">Events</h1>
            <Button variant="ghost" className="gap-2" onClick={() => navigate("/home")}>Home <ArrowRight className="w-4 h-4" /></Button>
          </div>
          <div className="space-y-4">
            {filteredEvents.length === 0 ? (
              <div className="text-muted-foreground text-sm">No events match your filters.</div>
            ) : (
              filteredEvents.map((evt) => <EventCard key={evt.id} event={evt} onJoin={handleJoin} />)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
