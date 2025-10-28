import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Star,
  MessageCircle,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import BackButton from "@/components/BackButton";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  image_url: string | null;
  host_name: string;
  attendees_count?: number;
  rating?: number;
  category?: string;
}

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEvent = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error) {
      console.error("Error loading event details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchEvent();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <h2 className="text-xl font-semibold mb-2">Event not found</h2>
        <p className="text-sm mb-6">
          The event you’re looking for might have been removed or is unavailable.
        </p>
        <Button onClick={() => navigate("/events")} className="rounded-full">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-background text-foreground pb-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between">
        <BackButton
          fallbackPath="/events"
          size="sm"
          className="flex items-center gap-2 text-muted-foreground"
        >
          Back
        </BackButton>
        <h1 className="text-lg sm:text-xl font-bold">Event Details</h1>
        <div />
      </div>

      {/* Hero Image */}
      <div
        className="relative h-60 sm:h-80 bg-cover bg-center"
        style={{
          backgroundImage: event.image_url
            ? `url(${event.image_url})`
            : "linear-gradient(to bottom right, #6366f1, #8b5cf6)",
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">{event.title}</h2>
          {event.category && (
            <Badge variant="secondary" className="bg-white/20 text-white">
              {event.category}
            </Badge>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6 space-y-6">
        {/* Event Info */}
        <Card className="border-border shadow-sm">
          <CardContent className="p-6 space-y-4">
            <p className="text-muted-foreground leading-relaxed">
              {event.description}
            </p>
            <div className="grid sm:grid-cols-2 gap-4 mt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{new Date(event.date).toDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-primary" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4 text-primary" />
                <span>{event.attendees_count || 0} attending</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Host & Ratings */}
        <Card className="border-border shadow-sm">
          <CardContent className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Hosted by</p>
              <h3 className="text-lg font-semibold">{event.host_name}</h3>
            </div>
            <div className="flex items-center gap-1 text-yellow-500">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < (event.rating || 0)
                      ? "fill-yellow-400"
                      : "fill-muted text-muted"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1 bg-primary text-white rounded-full">
            Join Event
          </Button>
          <Button
            variant="outline"
            className="flex-1 rounded-full gap-2 border-border"
          >
            <MessageCircle className="h-4 w-4" />
            Message Host
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventDetail;
