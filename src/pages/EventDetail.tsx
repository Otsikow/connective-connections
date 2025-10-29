import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, CalendarPlus, MapPin, Users } from "lucide-react";
import BackButton from "@/components/BackButton";
import { getEventById, upcomingEvents, EventData } from "@/data/events";

const formatEventDateRange = (startIso: string, endIso: string) => {
  const start = new Date(startIso);
  const end = new Date(endIso);

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
  });

  const timeFormatter = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  const isSameDay =
    start.getFullYear() === end.getFullYear() &&
    start.getMonth() === end.getMonth() &&
    start.getDate() === end.getDate();

  if (isSameDay) {
    return `${dateFormatter.format(start)} • ${timeFormatter.format(
      start
    )} – ${timeFormatter.format(end)}`;
  }

  return `${dateFormatter.format(start)} ${timeFormatter.format(
    start
  )} – ${dateFormatter.format(end)} ${timeFormatter.format(end)}`;
};

const formatEventDateTime = (isoDate: string) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(isoDate));

const toGoogleCalendarDate = (isoDate: string) =>
  new Date(isoDate)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");

const getGoogleCalendarUrl = (event: EventData) => {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toGoogleCalendarDate(event.startDateTime)}/${toGoogleCalendarDate(
      event.endDateTime
    )}`,
    details: event.description,
    location: event.location,
    sf: "true",
    output: "xml",
  });

  return `https://www.google.com/calendar/render?${params.toString()}`;
};

const EventDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const event = id ? getEventById(id) : undefined;
  const recommendedEvents = upcomingEvents
    .filter((upcomingEvent) => upcomingEvent.id !== event?.id)
    .slice(0, 3);

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-6 px-4 text-center">
          <BackButton
            fallbackPath="/events"
            variant="secondary"
            className="rounded-full"
          />
          <Card className="border-border/60 shadow-sm">
            <CardContent className="space-y-4 p-8">
              <CardTitle className="text-2xl font-semibold">
                Event not found
              </CardTitle>
              <CardDescription className="text-base text-muted-foreground">
                The experience you&apos;re looking for may have been moved or is no longer available.
              </CardDescription>
              <Button
                className="rounded-full"
                onClick={() => navigate("/events")}
              >
                Browse all events
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const googleCalendarUrl = getGoogleCalendarUrl(event);
  const hostInitials = event.host?.name
    ? event.host.name
        .split(" ")
        .map((segment) => segment.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "CC";

  return (
    <div className="min-h-screen bg-background pb-20">
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-primary/5 via-background to-background">
        <BackButton
          fallbackPath="/events"
          size="icon"
          className="absolute left-4 top-4 z-10 bg-background/80 border border-border/60 text-foreground shadow-sm backdrop-blur-sm hover:bg-muted"
          ariaLabel="Go back"
        />
        <div className="absolute inset-y-0 -right-32 hidden md:block opacity-20 pointer-events-none">
          <div className="h-full w-72 rounded-full bg-primary blur-3xl" />
        </div>
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.35fr_1fr] lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="overflow-hidden rounded-2xl border border-border/60 shadow-lg shadow-primary/10">
              <img
                src={event.image}
                alt={event.title}
                className="h-72 w-full object-cover sm:h-96"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="rounded-full">
                  {tag}
                </Badge>
              ))}
            </div>
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="space-y-2">
                <Badge className="w-fit rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                  {event.category}
                </Badge>
                <CardTitle className="text-3xl font-bold leading-tight">
                  {event.title}
                </CardTitle>
                <CardDescription className="text-base text-muted-foreground">
                  {event.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 text-sm text-muted-foreground">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        When
                      </p>
                      <p>{formatEventDateRange(event.startDateTime, event.endDateTime)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        Where
                      </p>
                      <p>{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        Attendees
                      </p>
                      <p>{event.attendees} community members joined</p>
                    </div>
                  </div>
                  {event.host && (
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10 border border-primary/20">
                        <AvatarImage src={event.host.avatar} alt={event.host.name} />
                        <AvatarFallback>{hostInitials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">
                          Host
                        </p>
                        <p>{event.host.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.host.role}
                          {event.host.experiencesHosted
                            ? ` • ${event.host.experiencesHosted} hosted experiences`
                            : null}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button size="lg" className="rounded-full bg-primary text-white hover:bg-primary/80">
                    Join the experience
                  </Button>
                  <Button asChild variant="outline" size="lg" className="rounded-full">
                    <a
                      href={googleCalendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <CalendarPlus className="mr-2 h-5 w-5" />
                      Add to Google Calendar
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-6"
          >
            <Card className="border-border/60 bg-primary/5 shadow-sm">
              <CardHeader className="space-y-2">
                <CardTitle className="text-xl font-semibold text-primary">
                  Why you&apos;ll love this
                </CardTitle>
                <CardDescription>
                  Crafted to spark meaningful connections with thoughtful facilitation and welcoming hosts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Expect a curated group of attendees, guided introductions, and intentional moments designed to foster genuine friendships.
                </p>
                <ul className="list-inside list-disc space-y-2">
                  <li>Expertly hosted to make everyone feel welcome</li>
                  <li>Opportunities to connect one-on-one and in small groups</li>
                  <li>Follow-up prompts to keep the conversation going</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  Related experiences
                </CardTitle>
                <CardDescription>
                  Discover more gatherings you might enjoy.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recommendedEvents.map((relatedEvent) => (
                  <div
                    key={relatedEvent.id}
                    className="flex items-start gap-4 rounded-xl border border-border/40 p-4 transition-colors hover:border-primary/40"
                  >
                    <div className="h-20 w-24 overflow-hidden rounded-lg bg-muted">
                      <img
                        src={relatedEvent.image}
                        alt={relatedEvent.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-base font-semibold text-foreground">
                          {relatedEvent.title}
                        </h3>
                        <Badge variant="outline" className="rounded-full text-xs">
                          {relatedEvent.category}
                        </Badge>
                      </div>
                      <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        {formatEventDateTime(relatedEvent.startDateTime)}
                      </p>
                      <p className="flex items-center gap-2 text-xs text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        {relatedEvent.location}
                      </p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-full px-3 text-xs text-primary hover:bg-primary/10"
                        onClick={() => navigate(`/events/${relatedEvent.id}`)}
                      >
                        View details
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
        <Card className="border-border/50 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
          <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-2">
              <h3 className="text-xl font-semibold">Bring your idea to life as a host</h3>
              <p className="text-sm text-muted-foreground">
                Share your expertise or passion with the community. We&apos;ll guide you through crafting a standout listing, managing guests, and keeping your events thriving.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                className="rounded-full bg-primary text-white hover:bg-primary/80"
                onClick={() => navigate("/host/create-event")}
              >
                Start a new event
              </Button>
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => navigate("/host-dashboard")}
              >
                View host dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default EventDetail;
