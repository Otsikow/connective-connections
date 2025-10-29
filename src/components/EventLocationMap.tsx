import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

interface EventLocationMapProps {
  location: string;
  title?: string;
  className?: string;
}

export const EventLocationMap = ({ location, title = "Event location", className }: EventLocationMapProps) => {
  const encodedLocation = encodeURIComponent(location);
  const mapEmbedUrl = `https://www.google.com/maps?q=${encodedLocation}&output=embed`;
  const mapDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedLocation}`;

  return (
    <Card className={cn("overflow-hidden border-border/60 shadow-sm", className)}>
      <CardHeader className="space-y-2">
        <CardTitle className="flex items-center gap-2 text-xl font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MapPin className="h-5 w-5" />
          </span>
          {title}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Find the exact spot for this experience and plan your route with Google Maps.
        </CardDescription>
        <p className="text-sm font-medium text-foreground">{location}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="overflow-hidden rounded-xl border border-border/60 bg-muted/20">
          <AspectRatio ratio={16 / 9}>
            <iframe
              key={mapEmbedUrl}
              src={mapEmbedUrl}
              title={`Map for ${location}`}
              loading="lazy"
              allowFullScreen
              className="h-full w-full"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </AspectRatio>
        </div>
        <Button asChild variant="outline" className="w-full rounded-full">
          <a href={mapDirectionsUrl} target="_blank" rel="noopener noreferrer">
            Open in Google Maps
          </a>
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventLocationMap;
