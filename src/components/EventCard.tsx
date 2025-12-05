import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { generateAvatarUrl } from "@/lib/avatar";

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

  // Generate mock attendee avatars for floating display
  const floatingAttendees = Array.from({ length: Math.min(4, event.participantsCount) }, (_, i) => ({
    id: `attendee-${i}`,
    name: `Attendee ${i + 1}`,
    avatar: generateAvatarUrl(`${event.id}-attendee-${i}`),
  }));

  return (
    <Card
      className="event-card-parallax card-premium card-glow-hover cursor-pointer overflow-hidden"
      onClick={() => navigate(`/events/${event.slug ?? event.id}`)}
    >
      {/* Layered Parallax Background */}
      <div className="relative h-44 overflow-hidden sm:h-48">
        {/* Background layer with blur */}
        <div 
          className="parallax-bg"
          style={{ backgroundImage: `url(${event.bannerImage})` }}
        />
        {/* Dark overlay */}
        <div className="parallax-overlay" />
        
        {/* Foreground image */}
        <img
          src={event.bannerImage}
          alt={event.title}
          className="parallax-media relative z-[2] h-full w-full object-cover transition-transform duration-400"
        />
        
        {/* Category Badge */}
        <Badge className="absolute top-3 right-3 z-[3] rounded-full border-none bg-gradient-to-r from-[#FF8A3C] to-[#FFB377] px-3 py-1 text-xs font-semibold text-white shadow-lg shadow-[rgba(255,138,60,0.3)]">
          {event.category}
        </Badge>
        
        {/* Floating Attendee Avatars */}
        <div className="floating-avatars absolute bottom-3 left-3 z-[3]">
          {floatingAttendees.map((attendee, index) => (
            <Avatar 
              key={attendee.id} 
              className="avatar-float h-8 w-8 border-2 border-[#111111] shadow-lg"
              style={{ zIndex: floatingAttendees.length - index }}
            >
              <AvatarImage src={attendee.avatar} alt={attendee.name} />
              <AvatarFallback className="bg-gradient-to-br from-[#FF8A3C] to-[#D96B26] text-xs text-white">
                {attendee.name[0]}
              </AvatarFallback>
            </Avatar>
          ))}
          {event.participantsCount > 4 && (
            <span className="ml-2 rounded-full bg-[rgba(255,255,255,0.15)] px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
              +{event.participantsCount - 4}
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="parallax-content space-y-3 p-5 sm:p-6">
        <h3 className="heading-brand text-lg font-semibold leading-tight text-foreground sm:text-xl">
          {event.title}
        </h3>

        <div className="flex flex-wrap items-center gap-2 text-sm text-[#BDBDBD]">
          <Calendar className="h-4 w-4 text-[#FF8A3C]" />
          <span>{event.date} · {event.time}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-[#BDBDBD]">
          <MapPin className="h-4 w-4 text-[#5CB8FF]" />
          <span className="line-clamp-1">{event.location}</span>
          {event.distance && (
            <span className="rounded-full bg-[rgba(255,255,255,0.06)] px-2 py-0.5 text-xs">
              {event.distance}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-[#BDBDBD]">
          <Users className="h-4 w-4 text-[#FFB377]" />
          <span>{event.participantsCount}/{event.maxParticipants} attendees</span>
        </div>

        <div className="flex flex-col gap-4 pt-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="profile-hover-glow h-10 w-10 ring-2 ring-[rgba(255,255,255,0.06)]">
              <AvatarImage src={event.hostAvatar} alt={event.hostName} />
              <AvatarFallback className="bg-gradient-to-br from-[#FF8A3C] to-[#D96B26] text-white">
                {event.hostName?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="text-sm leading-tight">
              <p className="font-medium text-foreground">{event.hostName}</p>
              <p className="text-xs text-[#7B7B7B]">Host</p>
            </div>
          </div>

          <div className="flex w-full flex-col items-start gap-3 sm:w-auto sm:items-end">
            <div className="space-y-1 text-left text-sm sm:text-right">
              {event.isFree ? (
                <p className="text-gradient-brand font-bold">Free</p>
              ) : (
                <>
                  <p className="text-gradient-brand font-bold">${event.fee}</p>
                  {event.deposit && (
                    <p className="text-xs text-[#7B7B7B]">
                      ${event.deposit} deposit
                    </p>
                  )}
                </>
              )}
            </div>
            <Button 
              size="sm" 
              className="btn-magnetic-glow w-full bg-gradient-to-r from-[#FF8A3C] to-[#FFB377] font-semibold text-white shadow-lg shadow-[rgba(255,138,60,0.25)] transition-all hover:shadow-[rgba(255,138,60,0.4)] sm:w-auto" 
              onClick={handleJoinClick}
            >
              Join
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
