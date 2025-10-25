import { useState, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, CalendarClock, MapPin, Users, MessageSquare, Shield, RefreshCw } from "lucide-react";
import { EventItem, formatPriceUSD, sampleEvents } from "@/lib/events";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

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
  const [activeTab, setActiveTab] = useState("description");

  // Get event data
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

  const handleJoinEvent = () => {
    toast({ description: `You're in for ${event.title}!` });
  };

  const handleChatWithAttendees = () => {
    const ref = searchParams.get("ref") || "detail";
    navigate(`/messages?group=${event.id}&ref=${ref}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold flex-1">Event Details</h1>
        <Avatar className="w-10 h-10 cursor-pointer" onClick={() => navigate("/profile")}>
          <AvatarImage src={event.host.avatarUrl} />
          <AvatarFallback>{event.host.name[0]}</AvatarFallback>
        </Avatar>
      </div>

      <div className="px-6 py-6 space-y-6 max-w-4xl mx-auto">
        {/* Event Banner */}
        <div className="h-64 bg-muted rounded-lg relative overflow-hidden">
          <img
            src={event.bannerUrl}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4">
            <Badge variant={event.fee === 0 ? "secondary" : "default"} className="text-sm">
              {event.fee === 0 ? "Free" : formatPriceUSD(event.fee)}
            </Badge>
          </div>
        </div>

        {/* Event Info */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold">{event.title}</h2>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <CalendarClock className="w-4 h-4" /> {format(new Date(event.date), "EEEE, MMMM d, yyyy 'at' h:mm a")}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-4 h-4" /> {event.location.address}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users className="w-4 h-4" /> {event.participants.length} attending
            </span>
          </div>
        </div>

        {/* Host Info */}
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Avatar className="w-12 h-12">
              <AvatarImage src={event.host.avatarUrl} />
              <AvatarFallback>{event.host.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold">Hosted by {event.host.name}</h3>
              <div className="text-sm text-muted-foreground">Event host</div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="attendees">Attendees</TabsTrigger>
          </TabsList>

          {/* Description Tab */}
          <TabsContent value="description" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>About this event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{event.description}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield size={20} /> Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  {event.rules.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw size={20} /> Refund Policy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{event.refundPolicy}</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Location Tab */}
          <TabsContent value="location">
            <Card>
              <CardHeader>
                <CardTitle>Location & Map</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-1">Event Location</h4>
                  <p className="text-muted-foreground">{event.location.address}</p>
                </div>
                <MapEmbed lat={event.location.lat} lng={event.location.lng} title={event.title} />
                <Button variant="outline" className="w-full">
                  <MapPin size={16} className="mr-2" /> Get Directions
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attendees Tab */}
          <TabsContent value="attendees">
            <Card>
              <CardHeader>
                <CardTitle>Attendees ({event.participants.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {event.participants.map((p, index) => (
                    <div key={index} className="flex flex-col items-center text-center">
                      <Avatar className="w-12 h-12 mb-2">
                        <AvatarImage src={p.avatarUrl} />
                        <AvatarFallback>{p.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{p.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        {/* Action Buttons */}
        <div className="space-y-3 pb-6">
          <Button
            className="w-full rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal h-12 text-lg font-semibold"
            onClick={handleJoinEvent}
          >
            Join Event
          </Button>

          <Button
            variant="outline"
            className="w-full rounded-full h-12"
            onClick={handleChatWithAttendees}
          >
            <MessageSquare size={20} className="mr-2" /> Chat with Attendees
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
