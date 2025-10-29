import { ChangeEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Filter, MapPin, Search, Users } from "lucide-react";
import BackButton from "@/components/BackButton";

import {
  featuredEvent,
  upcomingEvents,
  events as allEvents,
} from "@/data/events";

const formatEventDateTime = (isoDate: string) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(isoDate));

const categorySummaries = (() => {
  const counts = new Map<string, number>();

  allEvents.forEach((event) => {
    counts.set(event.category, (counts.get(event.category) ?? 0) + 1);
  });

  return Array.from(counts.entries()).map(([label, count]) => ({
    label,
    count,
  }));
})();

const Events = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEvents = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    if (!normalizedSearchTerm) {
      return upcomingEvents;
    }

    return upcomingEvents.filter((event) => {
      const searchableContent = [
        event.title,
        event.location,
        event.category,
        formatEventDateTime(event.startDateTime),
        event.tags.join(" "),
      ]
        .join(" ")
        .toLowerCase();

      return searchableContent.includes(normalizedSearchTerm);
    });
  }, [searchTerm, upcomingEvents]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
        <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-br from-primary/5 via-background to-background">
          <BackButton
            fallbackPath="/home"
            size="icon"
            className="absolute left-4 top-4 z-10 bg-background/80 border border-border/60 text-foreground shadow-sm backdrop-blur-sm hover:bg-muted"
            ariaLabel="Go back"
          />
        <div className="absolute inset-y-0 -right-32 hidden md:block opacity-20 pointer-events-none">
          <div className="h-full w-72 rounded-full bg-primary blur-3xl" />
        </div>
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              <Badge className="w-fit rounded-full bg-primary/10 px-4 py-1 text-sm font-semibold text-primary">
                Discover experiences
              </Badge>
              <h1 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                Find events curated for real, lasting friendships.
              </h1>
              <p className="text-base text-muted-foreground sm:text-lg">
                Explore gatherings hosted by community builders, tastemakers, and leaders near you. Search by vibe, interest, or neighborhood to discover your next great connection.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <form
                  className="relative flex-1"
                  role="search"
                  onSubmit={(event) => event.preventDefault()}
                >
                  <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    placeholder="Search for coffee, yoga, tech…"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    aria-label="Search experiences"
                  />
                </form>
                <Button variant="outline" className="gap-2 rounded-full">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </div>
              <div className="flex flex-wrap gap-3">
                {categorySummaries.map((category) => (
                  <Badge
                    key={category.label}
                    variant="secondary"
                    className="rounded-full border border-primary/10 bg-primary/5 text-primary"
                  >
                    {category.label}
                    <span className="ml-2 rounded-full bg-primary/10 px-2 text-xs font-medium">
                      {category.count}
                    </span>
                  </Badge>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="border-border/60 shadow-lg shadow-primary/10">
                <CardHeader className="space-y-2 pb-4">
                  <Badge className="w-fit rounded-full bg-amber-500/10 text-amber-600">
                    Featured
                  </Badge>
                  <CardTitle className="text-2xl font-semibold">
                    {featuredEvent.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed text-muted-foreground">
                    {featuredEvent.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      {formatEventDateTime(featuredEvent.startDateTime)}
                    </span>
                    <span className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      {featuredEvent.location}
                    </span>
                    <span className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-primary" />
                      {featuredEvent.attendees} attending
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 border border-primary/20">
                      <AvatarImage
                        src={featuredEvent.host?.avatar}
                        alt={featuredEvent.host?.name}
                      />
                      <AvatarFallback>
                        {featuredEvent.host?.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-semibold">
                        Hosted by {featuredEvent.host?.name}
                      </p>
                      {featuredEvent.host && (
                        <p className="text-xs text-muted-foreground">
                          {featuredEvent.host.role}
                          {featuredEvent.host.experiencesHosted
                            ? ` • ${featuredEvent.host.experiencesHosted} hosted experiences`
                            : ""}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {featuredEvent.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="rounded-full">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    className="w-full rounded-full bg-primary text-white hover:bg-primary/80"
                    onClick={() => navigate(`/events/${featuredEvent.id}`)}
                  >
                    View experience details
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl px-4 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Upcoming experiences</h2>
            <p className="text-sm text-muted-foreground">
              Curated around your interests and favorite hosts.
            </p>
          </div>
          <Button
            variant="ghost"
            className="gap-2 text-primary hover:bg-primary/10"
            onClick={() => navigate("/host/create-event")}
          >
            Interested in hosting?
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredEvents.length === 0 ? (
            <Card className="md:col-span-2 xl:col-span-3 border-dashed border-border/70">
              <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-foreground">No experiences match your search</h3>
                  <p className="text-sm text-muted-foreground">
                    Try a different keyword or adjust your filters to discover more curated connections.
                  </p>
                </div>
                <Button variant="secondary" className="rounded-full" onClick={handleClearSearch}>
                  Clear search
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <Card
                  className="group h-full border-border/60 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                <div className="h-40 overflow-hidden rounded-t-xl bg-muted">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <CardContent className="space-y-4 p-5">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h3 className="text-lg font-semibold text-foreground">
                        {event.title}
                      </h3>
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        {formatEventDateTime(event.startDateTime)}
                      </p>
                      <p className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        {event.location}
                      </p>
                    </div>
                    <Badge variant="outline" className="rounded-full text-xs">
                      {event.attendees} going
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="rounded-full">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    className="w-full rounded-full"
                    variant="secondary"
                    onClick={(buttonEvent) => {
                      buttonEvent.stopPropagation();
                      navigate(`/events/${event.id}`);
                    }}
                  >
                    View details
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
            ))
          )}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6">
        <Card className="border-border/50 bg-gradient-to-r from-primary/10 via-primary/5 to-background">
          <CardContent className="flex flex-col gap-6 p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-2">
              <h3 className="text-xl font-semibold">Bring your idea to life as a host</h3>
              <p className="text-sm text-muted-foreground">
                Share your expertise or passion with the community. We’ll guide you through crafting a standout listing, managing guests, and keeping your events thriving.
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

export default Events;
