import { useNavigate, useParams } from "react-router-dom";
import {
  MapPin,
  GraduationCap,
  ExternalLink,
  Building2,
  Clock,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import BackButton from "@/components/BackButton";
import { usePageTitle } from "@/hooks/usePageTitle";
import { getUniversityById, type Programme } from "@/data/programmes";

const ProgrammeDetail = () => {
  const navigate = useNavigate();
  const { universityId } = useParams<{ universityId: string }>();
  const university = universityId ? getUniversityById(universityId) : undefined;

  usePageTitle(university?.name ?? "University Details");

  if (!university) {
    return (
      <div className="min-h-screen bg-background pb-24">
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
          <div className="px-4 py-4 flex items-center gap-3">
            <BackButton fallbackPath="/programmes" />
            <h1 className="text-lg font-semibold leading-tight">
              University Not Found
            </h1>
          </div>
        </div>
        <div className="px-4 py-12 text-center">
          <p className="text-muted-foreground">
            The university you're looking for doesn't exist.
          </p>
          <Button className="mt-4" onClick={() => navigate("/programmes")}>
            Browse Programmes
          </Button>
        </div>
      </div>
    );
  }

  const handleProgrammeClick = (programmeId: string) => {
    navigate(`/programmes/${university.id}/${programmeId}`);
  };

  const getTypeColor = (type: Programme["type"]) => {
    switch (type) {
      case "Bachelor":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Master":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "PhD":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "Certificate":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="px-4 py-4 flex items-center gap-3">
          <BackButton fallbackPath="/programmes" />
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              University Profile
            </p>
            <h1 className="text-lg font-semibold leading-tight">
              {university.name}
            </h1>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src={university.image}
            alt={`${university.name} campus`}
            className="w-full h-48 md:h-64 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-end gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-card border border-border shadow-lg">
                <Building2 className="h-8 w-8 text-foreground" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white drop-shadow-lg">
                  {university.name}
                </h2>
                <div className="flex items-center gap-2 text-white/90 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {university.city}, {university.country}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border/60">
            <CardContent className="p-4 text-center">
              <GraduationCap className="h-6 w-6 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">{university.programmes.length}</p>
              <p className="text-xs text-muted-foreground">Programmes</p>
            </CardContent>
          </Card>
          <Card className="border-border/60">
            <CardContent className="p-4 text-center">
              <MapPin className="h-6 w-6 mx-auto text-primary mb-2" />
              <p className="text-2xl font-bold">{university.country}</p>
              <p className="text-xs text-muted-foreground">Location</p>
            </CardContent>
          </Card>
          <Card className="border-border/60 col-span-2">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">
                {university.description}
              </p>
              <Button
                variant="link"
                className="p-0 h-auto mt-2 gap-2"
                onClick={() =>
                  window.open(university.website, "_blank", "noopener,noreferrer")
                }
              >
                Visit official website
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Programmes List */}
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Available Programmes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {university.programmes.map((programme) => (
              <Card
                key={programme.id}
                className="border-border/40 bg-muted/30 cursor-pointer transition-all hover:bg-muted/50 hover:border-primary/30"
                onClick={() => handleProgrammeClick(programme.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleProgrammeClick(programme.id);
                  }
                }}
                aria-label={`View ${programme.name} programme`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h4 className="font-semibold">{programme.name}</h4>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getTypeColor(programme.type)}`}
                        >
                          {programme.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {programme.description}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-2">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{programme.duration}</span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="flex-shrink-0">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgrammeDetail;
