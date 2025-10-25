import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calendar, MapPin, Users, DollarSign, MessageSquare, Clock, Shield, RefreshCw } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";

const EventDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("description");

  // Mock event data - in a real app, this would come from an API
  const event = {
    id: 1,
    title: "Coffee & Chat",
    host: { 
      name: "Sarah Johnson", 
      avatar: "/placeholder.svg",
      rating: 4.8,
      eventsHosted: 23
    },
    date: new Date(2024, 10, 25, 10, 0),
    location: "The Grind Café, Downtown",
    address: "123 Main Street, Downtown, City 12345",
    price: "Free",
    deposit: 0,
    image: "/placeholder.svg",
    interest: "Social",
    participants: 12,
    maxParticipants: 20,
    description: "Join us for a casual coffee meetup and meaningful conversations. This is a great opportunity to meet new people, share stories, and build connections in a relaxed environment. We'll have coffee, light snacks, and plenty of conversation starters to help break the ice.",
    rules: [
      "Be respectful and kind to all participants",
      "No political or controversial discussions",
      "Arrive on time - we start promptly at 10:00 AM",
      "Bring a positive attitude and open mind",
      "No smoking or alcohol on premises"
    ],
    refundPolicy: "Since this is a free event, no refunds are necessary. However, if you can't make it, please let us know at least 2 hours in advance so we can open up your spot to someone on the waitlist.",
    participantsList: [
      { name: "Alex M.", avatar: "/placeholder.svg" },
      { name: "Emma W.", avatar: "/placeholder.svg" },
      { name: "Mike C.", avatar: "/placeholder.svg" },
      { name: "Lisa K.", avatar: "/placeholder.svg" },
      { name: "David R.", avatar: "/placeholder.svg" },
      { name: "Sarah J.", avatar: "/placeholder.svg" },
      { name: "Tom B.", avatar: "/placeholder.svg" },
      { name: "Anna L.", avatar: "/placeholder.svg" },
      { name: "Chris P.", avatar: "/placeholder.svg" },
      { name: "Maria S.", avatar: "/placeholder.svg" },
      { name: "John D.", avatar: "/placeholder.svg" },
      { name: "Rachel G.", avatar: "/placeholder.svg" }
    ]
  };

  const handleJoinEvent = () => {
    // In a real app, this would make an API call to join the event
    console.log("Joining event:", event.id);
    // Navigate to confirmation or show success message
  };

  const handleChatWithAttendees = () => {
    // In a real app, this would navigate to the event group chat
    console.log("Opening group chat for event:", event.id);
    navigate("/messages");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-6 py-4 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/events")}>
          <ArrowLeft size={20} />
        </Button>
        <h1 className="text-xl font-bold flex-1">Event Details</h1>
        <Avatar className="w-10 h-10 cursor-pointer" onClick={() => navigate("/profile")}>
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Event Banner */}
        <div className="h-64 bg-muted rounded-lg relative overflow-hidden">
          <div className="absolute top-4 right-4">
            <Badge variant={event.price === "Free" ? "secondary" : "default"} className="text-sm">
              {event.price}
            </Badge>
          </div>
        </div>

        {/* Event Info */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>{format(event.date, "EEEE, MMMM d, yyyy 'at' h:mm a")}</span>
              </div>
              <Badge variant="outline">{event.interest}</Badge>
            </div>
          </div>

          <div className="flex items-center gap-4 text-muted-foreground">
            <div className="flex items-center gap-1">
              <MapPin size={16} />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={16} />
              <span>{event.participants}/{event.maxParticipants} participants</span>
            </div>
            {event.deposit > 0 && (
              <div className="flex items-center gap-1">
                <DollarSign size={16} />
                <span>${event.deposit} deposit</span>
              </div>
            )}
          </div>
        </div>

        {/* Host Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12">
                <AvatarImage src={event.host.avatar} />
                <AvatarFallback>{event.host.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">Hosted by {event.host.name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>⭐ {event.host.rating}</span>
                  <span>•</span>
                  <span>{event.host.eventsHosted} events hosted</span>
                </div>
              </div>
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
                  <Shield size={20} />
                  Event Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {event.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-muted-foreground">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw size={20} />
                  Refund Policy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">{event.refundPolicy}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="location">
            <Card>
              <CardHeader>
                <CardTitle>Location & Map</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-1">{event.location}</h4>
                  <p className="text-muted-foreground">{event.address}</p>
                </div>
                
                {/* Google Maps Embed Placeholder */}
                <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={48} className="mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Interactive Map</p>
                    <p className="text-sm text-muted-foreground">Google Maps integration would go here</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  <MapPin size={16} className="mr-2" />
                  Get Directions
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendees">
            <Card>
              <CardHeader>
                <CardTitle>Attendees ({event.participants})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {event.participantsList.map((participant, index) => (
                    <div key={index} className="flex flex-col items-center text-center">
                      <Avatar className="w-12 h-12 mb-2">
                        <AvatarImage src={participant.avatar} />
                        <AvatarFallback>{participant.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium">{participant.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

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
            <MessageSquare size={20} className="mr-2" />
            Chat with Attendees
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
