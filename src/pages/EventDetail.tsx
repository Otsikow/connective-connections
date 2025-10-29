import { FormEvent, useMemo, useState } from "react";
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
import { Calendar, CalendarPlus, MapPin, Star, Users } from "lucide-react";
import BackButton from "@/components/BackButton";
import {
  getEventById,
  upcomingEvents,
  EventData,
  EventReview,
} from "@/data/events";
import { useSubscription } from "@/hooks/useSubscription";
import { useToast } from "@/hooks/use-toast";
import EventLocationMap from "@/components/EventLocationMap";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RatingStars } from "@/components/RatingStars";

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

const formatReviewDate = (isoDate: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(isoDate));

const calculateBaseAverage = (reviews: EventReview[]) => {
  if (reviews.length === 0) {
    return 0;
  }

  return (
    reviews.reduce((sum, review) => sum + review.rating, 0) /
    reviews.length
  );
};

const currentReviewer = {
  name: "You",
  avatar: "/placeholder.svg",
};

const EventDetail = () => {
  const navigate = useNavigate();
  const { eventId } = useParams<{ eventId: string }>();
  const { attemptEventJoin } = useSubscription();
  const { toast } = useToast();

  const event = eventId ? getEventById(eventId) : undefined;
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

  const [reviews, setReviews] = useState<EventReview[]>(event.reviews ?? []);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  const baseReviewLength = event.reviews?.length ?? 0;
  const baseReviewCount = event.rating?.count ?? baseReviewLength;
  const baseAverage = event.rating?.average ?? calculateBaseAverage(event.reviews ?? []);

  const ratingSummary = useMemo(() => {
    const additionalReviews = reviews.slice(baseReviewLength);
    const additionalRatingsTotal = additionalReviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );
    const totalReviews = baseReviewCount + additionalReviews.length;
    const combinedAverage =
      totalReviews > 0
        ? (baseAverage * baseReviewCount + additionalRatingsTotal) / totalReviews
        : 0;
    const highlightLabel =
      baseReviewCount > reviews.length
        ? `Highlights from ${reviews.length} of ${totalReviews} reviews`
        : `${totalReviews} community reviews`;

    return {
      average: combinedAverage,
      totalReviews,
      highlightLabel,
    };
  }, [baseAverage, baseReviewCount, baseReviewLength, reviews]);

  const handleJoinExperience = async () => {
    const allowed = await attemptEventJoin();
    if (!allowed) {
      return;
    }

    toast({
      title: "You're in!",
      description: "We saved your spot. Check your inbox for event details.",
    });
  };

  const handleReviewSubmit = (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();

    const trimmedComment = newComment.trim();

    const newReview: EventReview = {
      id: `${event.id}-new-${Date.now()}`,
      reviewerName: currentReviewer.name,
      reviewerAvatar: currentReviewer.avatar,
      rating: newRating,
      comment:
        trimmedComment.length > 0
          ? trimmedComment
          : "Shared a rating without additional comments.",
      createdAt: new Date().toISOString(),
    };

    setReviews((previous) => [newReview, ...previous]);
    setNewRating(5);
    setNewComment("");

    toast({
      title: "Thanks for sharing!",
      description: "Your feedback helps the community pick the right experiences.",
    });
  };

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
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <Star className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">
                        Community rating
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <RatingStars
                          rating={ratingSummary.average}
                          readOnly
                          size="sm"
                          className="pointer-events-none"
                          label="Community rating"
                        />
                        <span>
                          {ratingSummary.average.toFixed(1)} ({ratingSummary.totalReviews} reviews)
                        </span>
                      </div>
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
                  <Button
                    size="lg"
                    className="rounded-full bg-primary text-white hover:bg-primary/80 dark:text-black"
                    onClick={handleJoinExperience}
                  >
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
            <EventLocationMap
              location={event.location}
              title="See where we'll meet"
            />
            <Card className="border-border/60 shadow-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-xl font-semibold">
                  Community reviews
                </CardTitle>
                <CardDescription>{ratingSummary.highlightLabel}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col gap-4 rounded-2xl border border-primary/20 bg-primary/5 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <p className="text-4xl font-bold text-foreground">
                        {ratingSummary.average.toFixed(1)}
                      </p>
                      <RatingStars
                        rating={ratingSummary.average}
                        readOnly
                        size="lg"
                        className="pointer-events-none"
                        label="Average community rating"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Based on feedback from {ratingSummary.totalReviews} attendees
                    </p>
                  </div>
                  <div className="rounded-xl border border-primary/30 bg-background/80 p-4 text-sm text-muted-foreground shadow-sm">
                    <p className="font-medium text-foreground">Share your experience</p>
                    <p>Help others decide if this gathering is right for them.</p>
                  </div>
                </div>
                <form
                  className="space-y-4 rounded-2xl border border-border/60 bg-muted/10 p-4"
                  onSubmit={handleReviewSubmit}
                >
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">Your rating</p>
                    <RatingStars
                      rating={newRating}
                      onChange={setNewRating}
                      size="lg"
                      label="Your rating for this experience"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="event-review-comment">Quick thoughts (optional)</Label>
                    <Textarea
                      id="event-review-comment"
                      placeholder="What made this gathering memorable?"
                      value={newComment}
                      onChange={(event) => setNewComment(event.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                    <p>Reviews display your first name so hosts can continue the connection.</p>
                    <Button type="submit" className="rounded-full self-start sm:self-auto">
                      Submit review
                    </Button>
                  </div>
                </form>
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
                      Be the first to share how this event felt. Your insights will guide fellow members.
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div
                        key={review.id}
                        className="rounded-2xl border border-border/60 bg-background p-4 shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-10 w-10 border border-primary/20">
                            <AvatarImage src={review.reviewerAvatar} alt={review.reviewerName} />
                            <AvatarFallback>
                              {review.reviewerName
                                .split(" ")
                                .map((segment) => segment.charAt(0))
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-sm font-semibold text-foreground">
                                {review.reviewerName}
                              </p>
                              <span className="text-xs text-muted-foreground">
                                {formatReviewDate(review.createdAt)}
                              </span>
                            </div>
                            <RatingStars
                              rating={review.rating}
                              readOnly
                              size="sm"
                              className="pointer-events-none"
                              label={`Rating from ${review.reviewerName}`}
                            />
                            <p className="text-sm text-muted-foreground">{review.comment}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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
                {recommendedEvents.map((relatedEvent) => {
                  const relatedAverage =
                    relatedEvent.rating?.average ??
                    calculateBaseAverage(relatedEvent.reviews ?? []);
                  const relatedCount =
                    relatedEvent.rating?.count ??
                    relatedEvent.reviews?.length ??
                    0;

                  return (
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
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <RatingStars
                            rating={relatedAverage}
                            readOnly
                            size="sm"
                            className="pointer-events-none"
                            label={`Rating for ${relatedEvent.title}`}
                          />
                          <span>
                            {relatedAverage.toFixed(1)} ({relatedCount} reviews)
                          </span>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-full px-3 text-xs text-primary hover:bg-primary/10"
                          onClick={() => navigate(`/events/${relatedEvent.slug}`)}
                        >
                          View details
                        </Button>
                      </div>
                    </div>
                  );
                })}
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
                className="rounded-full bg-primary text-white hover:bg-primary/80 dark:text-black"
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
