import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  MessageCircle,
  Share2,
  AlertCircle,
  Shield,
  Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Mock event data - in production, fetch from API based on eventId
const mockEventDetail = {
  id: "1",
  title: "Morning Yoga & Meditation Session",
  description: `Join us for a rejuvenating morning yoga and meditation session in the heart of Central Park. This 90-minute class is designed for all skill levels, from complete beginners to experienced practitioners.

What to expect:
• 60 minutes of guided Vinyasa yoga flow
• 20 minutes of guided meditation
• 10 minutes for questions and community connection

Please bring your own yoga mat and water bottle. We'll provide additional props like blocks and straps if needed.

This is more than just a yoga class - it's an opportunity to connect with like-minded individuals who value wellness and mindfulness. After class, we often grab coffee together at the nearby cafe!`,
  bannerImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200&h=600&fit=crop",
  hostName: "Sarah Johnson",
  hostAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
  hostBio: "Certified yoga instructor with 10+ years of experience. Passionate about helping others find peace through movement.",
  date: "Nov 15, 2025",
  time: "7:00 AM - 8:30 AM",
  location: "Central Park, Sheep Meadow, New York, NY 10024",
  coordinates: { lat: 40.7711, lng: -73.9758 },
  fee: 15,
  deposit: 5,
  isFree: false,
  category: "Wellness",
  participantsCount: 12,
  maxParticipants: 20,
  participants: [
    { id: "1", name: "John Doe", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" },
    { id: "2", name: "Jane Smith", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" },
    { id: "3", name: "Bob Wilson", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob" },
    { id: "4", name: "Alice Brown", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" },
    { id: "5", name: "Charlie Davis", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie" },
    { id: "6", name: "Diana Miller", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana" },
    { id: "7", name: "Ethan Taylor", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan" },
    { id: "8", name: "Fiona Garcia", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fiona" },
  ],
  rules: [
    "Please arrive 10 minutes early to set up your space",
    "Silence your phone during the session",
    "Respect others' personal space and boundaries",
    "No photography during class without permission",
    "If you need to leave early, please inform the instructor beforehand",
  ],
  refundPolicy: `Full refund available if canceled 24 hours before the event. Cancellations within 24 hours will receive a 50% refund. No refunds for no-shows.

The deposit is fully refundable upon attendance. If you don't show up without prior notice, the deposit will be forfeited.

In case of severe weather or emergencies, the event may be rescheduled or canceled with full refunds issued.`,
};

const EventDetail = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [hasJoined, setHasJoined] = useState(false);

  // In production, fetch event details based on eventId
  const event = mockEventDetail;

  const handleJoin = () => {
    setHasJoined(true);
    toast({
      title: "Successfully joined!",
      description: "You've been added to the event. Check your messages for the group chat.",
    });
  };

  const handleChatWithAttendees = () => {
    if (!hasJoined) {
      toast({
        title: "Join the event first",
        description: "You need to join the event to access the group chat.",
        variant: "destructive",
      });
      return;
    }
    // Navigate to group chat
    navigate(`/messages/event/${eventId}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `Check out this event: ${event.title}`,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Event link copied to clipboard.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Banner */}
      <div className="relative h-80 overflow-hidden">
        <img
          src={event.bannerImage}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Back Button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 left-4"
          onClick={() => navigate("/events")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        {/* Share Button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 right-4"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4" />
        </Button>

        {/* Title and Category */}
        <div className="absolute bottom-4 left-4 right-4">
          <Badge className="mb-2">{event.category}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            {event.title}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details Card */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">{event.date}</p>
                    <p className="text-sm text-muted-foreground">{event.time}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-1" />
                  <div className="flex-1">
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">
                      {event.isFree ? "Free" : `$${event.fee}`}
                    </p>
                    {event.deposit && (
                      <p className="text-sm text-muted-foreground">
                        ${event.deposit} refundable deposit required
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium">
                      {event.participantsCount} / {event.maxParticipants} attendees
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {event.maxParticipants - event.participantsCount} spots left
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>About this event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-muted-foreground">
                  {event.description}
                </p>
              </CardContent>
            </Card>

            {/* Location Map */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                  {/* Google Maps Embed */}
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    src={`https://www.google.com/maps/embed/v1/place?key=YOUR_API_KEY&q=${event.coordinates.lat},${event.coordinates.lng}`}
                    title="Event Location"
                  ></iframe>
                  {/* Fallback: Show static image if API key not configured */}
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 mx-auto mb-2" />
                      <p className="text-sm">{event.location}</p>
                      <p className="text-xs mt-1">
                        <a 
                          href={`https://www.google.com/maps/search/?api=1&query=${event.coordinates.lat},${event.coordinates.lng}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          Open in Google Maps
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Rules */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Event Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {event.rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-muted-foreground">{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Refund Policy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Refund Policy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-line text-muted-foreground">
                  {event.refundPolicy}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Host Card */}
            <Card>
              <CardHeader>
                <CardTitle>Hosted by</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={event.hostAvatar} alt={event.hostName} />
                    <AvatarFallback>{event.hostName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{event.hostName}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {event.hostBio}
                    </p>
                    <Button variant="outline" size="sm" className="mt-3 w-full">
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Participants */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Attendees ({event.participantsCount})</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {event.participants.map((participant) => (
                    <Dialog key={participant.id}>
                      <DialogTrigger asChild>
                        <Avatar className="h-10 w-10 cursor-pointer hover:ring-2 ring-primary transition-all">
                          <AvatarImage src={participant.avatar} alt={participant.name} />
                          <AvatarFallback>{participant.name[0]}</AvatarFallback>
                        </Avatar>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{participant.name}</DialogTitle>
                          <DialogDescription>Event attendee</DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center gap-3 py-4">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={participant.avatar} alt={participant.name} />
                            <AvatarFallback>{participant.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{participant.name}</p>
                            <p className="text-sm text-muted-foreground">Attending this event</p>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full">
                          View Profile
                        </Button>
                      </DialogContent>
                    </Dialog>
                  ))}
                  {event.participantsCount > event.participants.length && (
                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                      +{event.participantsCount - event.participants.length}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3 sticky top-4">
              {!hasJoined ? (
                <Button size="lg" className="w-full" onClick={handleJoin}>
                  Join Event - {event.isFree ? "Free" : `$${event.fee}`}
                </Button>
              ) : (
                <div className="space-y-2">
                  <Button size="lg" className="w-full" disabled>
                    <Clock className="h-4 w-4 mr-2" />
                    Joined
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full"
                    onClick={handleChatWithAttendees}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat with Attendees
                  </Button>
                </div>
              )}
              
              {hasJoined && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-full text-destructive">
                      Cancel Registration
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cancel Registration</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to cancel your registration for this event?
                      </DialogDescription>
                    </DialogHeader>
                    <div className="bg-muted p-4 rounded-lg mb-4">
                      <p className="text-sm">
                        <strong>Refund Policy:</strong> Cancellations made 24 hours before
                        the event will receive a full refund.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        Keep Registration
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => {
                          setHasJoined(false);
                          toast({
                            title: "Registration canceled",
                            description: "Your registration has been canceled.",
                          });
                        }}
                      >
                        Cancel Registration
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
