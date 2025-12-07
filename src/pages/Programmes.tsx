import { useNavigate } from "react-router-dom";
import { MapPin, GraduationCap, ExternalLink, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackButton";
import { usePageTitle } from "@/hooks/usePageTitle";
import { universities } from "@/data/programmes";

const Programmes = () => {
  const navigate = useNavigate();
  usePageTitle("University Programmes");

  const handleCardClick = (universityId: string) => {
    navigate(`/programmes/${universityId}`);
  };

  const handleExploreProfile = (
    event: React.MouseEvent,
    universityId: string
  ) => {
    event.stopPropagation();
    navigate(`/programmes/${universityId}`);
  };

  const handleVisitWebsite = (event: React.MouseEvent, website: string) => {
    event.stopPropagation();
    window.open(website, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="px-4 py-4 flex items-center gap-3">
          <BackButton fallbackPath="/home" />
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Explore
            </p>
            <h1 className="text-lg font-semibold leading-tight">
              University Programmes
            </h1>
          </div>
        </div>
      </div>

      <div className="px-4 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Featured Universities</h2>
          <p className="text-muted-foreground mt-1">
            Discover programmes from top institutions worldwide
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {universities.map((university) => (
            <Card
              key={university.id}
              className="group overflow-hidden border border-border/60 bg-card cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
              onClick={() => handleCardClick(university.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardClick(university.id);
                }
              }}
              aria-label={`View ${university.name} programmes`}
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img
                  src={university.image}
                  alt={`${university.name} campus`}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <CardContent className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted border border-border">
                    <Building2 className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg leading-tight truncate">
                      {university.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-1">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">
                        {university.city}, {university.country}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {university.description}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      <GraduationCap className="h-3.5 w-3.5" />
                      Programmes
                    </div>
                    <p className="text-lg font-semibold">
                      {university.programmes.length}
                    </p>
                  </div>
                  <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wide mb-1">
                      <MapPin className="h-3.5 w-3.5" />
                      Location
                    </div>
                    <p className="text-lg font-semibold">{university.country}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="default"
                    className="flex-1"
                    onClick={(e) => handleExploreProfile(e, university.id)}
                  >
                    Explore profile
                  </Button>
                  {university.website && (
                    <Button
                      variant="outline"
                      className="gap-2"
                      onClick={(e) => handleVisitWebsite(e, university.website)}
                    >
                      Visit website
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Programmes;
