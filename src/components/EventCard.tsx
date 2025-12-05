import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface Event {
  id: string;
  slug?: string;
  title: string;
  description: string;
  bannerImage: string;
  hostName: string;
  hostAvatar: string;
  date: string;
  time: string;
  location: string;
  fee: number;
  deposit?: number;
  isFree: boolean;
  category: string;
  distance?: string;
  participantsCount: number;
  maxParticipants: number;
}

interface EventCardProps {
  event: Event;
}

export const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();

  const handleJoinClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Handle join logic
    console.log("Joining event:", event.id);
  };

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-lg"
      onClick={() => navigate(`/events/${event.slug ?? event.id}`)}
    >
      <div className="relative h-44 overflow-hidden sm:h-48">
        <img
          src={event.bannerImage}
          alt={event.title}
          className="parallax-media h-full w-full object-cover"
        />
        <Badge className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-black shadow-sm hover:bg-white">
          {event.category}
        </Badge>
      </div>

      <div className="space-y-3 p-4 sm:p-5">
        <h3 className="text-lg font-semibold leading-tight text-foreground sm:text-xl">
          {event.title}
        </h3>

        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{event.date} · {event.time}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{event.location}</span>
          {event.distance && <span className="text-xs">({event.distance})</span>}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{event.participantsCount}/{event.maxParticipants} attendees</span>
        </div>

        <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={event.hostAvatar} alt={event.hostName} />
              <AvatarFallback>{event.hostName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="text-sm leading-tight">
              <p className="font-medium text-foreground">{event.hostName}</p>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-3 sm:w-auto sm:items-end">
            <div className="space-y-1 text-left text-sm sm:text-right">
              {event.isFree ? (
                <p className="font-semibold text-emerald-500">Free</p>
              ) : (
                <>
                  <p className="font-semibold text-foreground">${event.fee}</p>
                  {event.deposit && (
                    <p className="text-xs text-muted-foreground">
                      ${event.deposit} deposit
                    </p>
                  )}
                </>
              )}
            </div>
            <Button size="sm" className="w-full sm:w-auto" onClick={handleJoinClick}>
              Join
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
