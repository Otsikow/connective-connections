import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface Event {
  id: string;
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
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => navigate(`/events/${event.id}`)}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.bannerImage}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-3 right-3 bg-white/90 text-black hover:bg-white">
          {event.category}
        </Badge>
      </div>
      
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-lg line-clamp-2">{event.title}</h3>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{event.date} · {event.time}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span className="line-clamp-1">{event.location}</span>
          {event.distance && <span className="text-xs">({event.distance})</span>}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{event.participantsCount}/{event.maxParticipants} attendees</span>
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={event.hostAvatar} alt={event.hostName} />
              <AvatarFallback>{event.hostName[0]}</AvatarFallback>
            </Avatar>
            <div className="text-sm">
              <p className="font-medium">{event.hostName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-right">
              {event.isFree ? (
                <p className="font-semibold text-green-600">Free</p>
              ) : (
                <>
                  <p className="font-semibold">${event.fee}</p>
                  {event.deposit && (
                    <p className="text-xs text-muted-foreground">
                      ${event.deposit} deposit
                    </p>
                  )}
                </>
              )}
            </div>
            <Button size="sm" onClick={handleJoinClick}>
              Join
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
