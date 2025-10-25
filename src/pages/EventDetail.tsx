import { useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, MapPin, CalendarClock, Users, MessageSquare } from "lucide-react";
import { EventItem, formatPriceUSD, sampleEvents } from "@/lib/events";
import { toast } from "@/components/ui/use-toast";

const MapEmbed = ({ lat, lng, title }: { lat: number; lng: number; title: string }) => {
  const src = `https://www.google.com/maps?q=${lat},${lng}&z=14&output=embed`;
  return (
    <div className="w-full h-64 rounded-lg overflow-hidden border border-border">
      <iframe title={`Map: ${title}`} src={src} className="w-full h-full" loading="lazy" />
    </div>
  );
};

const EventDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const event: EventItem | undefined = useMemo(() => sampleEvents.find((e) => e.id === id), [id]);

  if (!event) {
    return (
      <div className="min-h-screen bg-background px-6 py-8">
        <button onClick={() => navigate(-1)} className="mb-6 p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="max-w-3xl mx-auto text-center text-muted-foreground">Event not found.</div>
      </div>
    );
  }

  const handleJoin = () => {
    toast({ description: `You're in for ${event.title}!` });
  };

  const handleChat = () => {
    const ref = searchParams.get("ref") || "detail";
    navigate(`/messages?group=${event.id}&ref=${ref}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-64 w-full bg-muted">
        <img src={event.bannerUrl} alt={event.title} className="absolute inset-0 w-full h-full object-cover" />
      </div>

      <div className="px-6 py-6 max-w-4xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-4 p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold leading-tight">{event.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-2">
              <span className="inline-flex items-center gap-1"><CalendarClock className="w-4 h-4" /> {event.date} · {event.startTime}</span>
              <span className="inline-flex items-center gap-1"><MapPin className="w-4 h-4" /> {event.location.address}</span>
              <span>{event.distanceKm.toFixed(1)} km away</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={event.host.avatarUrl} />
              <AvatarFallback>{event.host.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm text-muted-foreground">Hosted by</div>
              <div className="font-medium">{event.host.name}</div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Button className="rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal" onClick={handleJoin}>
            Join Event
          </Button>
          <Button variant="outline" className="rounded-full gap-2" onClick={handleChat}>
            <MessageSquare className="w-4 h-4" /> Chat with attendees
          </Button>
          <div className="ml-auto text-sm">
            <span className="font-semibold">{formatPriceUSD(event.fee)}</span>
            {event.deposit ? <span className="text-muted-foreground"> · ${event.deposit} deposit</span> : null}
          </div>
        </div>

        <Separator className="my-6" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <section>
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-sm text-muted-foreground leading-6">{event.description}</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">Location</h2>
              <MapEmbed lat={event.location.lat} lng={event.location.lng} title={event.title} />
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">Rules</h2>
              <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                {event.rules.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">Refund policy</h2>
              <p className="text-sm text-muted-foreground">{event.refundPolicy}</p>
            </section>
          </div>

          <div className="lg:col-span-1">
            <Card className="border-border">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3 flex items-center gap-2"><Users className="w-4 h-4" /> Participants</h3>
                <div className="flex -space-x-3 mb-2">
                  {event.participants.slice(0, 6).map((p) => (
                    <Avatar key={p.id} className="w-9 h-9 ring-2 ring-background">
                      <AvatarImage src={p.avatarUrl} />
                      <AvatarFallback>{p.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground mb-4">{event.participants.length} attending</div>
                <Button variant="secondary" className="w-full rounded-full" onClick={handleChat}>
                  Open group chat
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
