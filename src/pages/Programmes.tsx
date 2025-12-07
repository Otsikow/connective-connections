import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, GraduationCap, ExternalLink, Building2, Plus, Clock, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import BackButton from "@/components/BackButton";
import { usePageTitle } from "@/hooks/usePageTitle";
import { universities } from "@/data/programmes";
import { CreateProgrammeDialog } from "@/components/CreateProgrammeDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Programme = Tables<"programmes">;

const Programmes = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  usePageTitle("University Programmes");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userProgrammes, setUserProgrammes] = useState<Programme[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const fetchUserProgrammes = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id ?? null);

      // Fetch all published programmes plus user's own programmes
      const { data, error } = await supabase
        .from("programmes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUserProgrammes(data ?? []);
    } catch (error) {
      console.error("Error fetching programmes:", error);
      // Don't show error toast for non-authenticated users
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchUserProgrammes();
  }, [fetchUserProgrammes]);

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

  const handleCreateClick = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to create a programme.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    setIsDialogOpen(true);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Bachelor":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Master":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "PhD":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "Certificate":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "Diploma":
        return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b border-border">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
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
          <Button 
            onClick={handleCreateClick}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Programme
          </Button>
        </div>
      </div>

      <div className="px-4 py-6 space-y-10">
        {/* User Created Programmes Section */}
        {(userProgrammes.length > 0 || isLoading) && (
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Your Programmes</h2>
              <p className="text-muted-foreground mt-1">
                Programmes you have created
              </p>
            </div>

            {isLoading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="overflow-hidden border border-border/60">
                    <Skeleton className="aspect-[16/9] w-full" />
                    <CardContent className="p-5 space-y-4">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : userProgrammes.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {userProgrammes.map((programme) => (
                  <Card
                    key={programme.id}
                    className="group overflow-hidden border border-border/60 bg-card transition-all duration-200 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      {programme.image_url ? (
                        <img
                          src={programme.image_url}
                          alt={programme.name}
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.nextElementSibling?.classList.remove("hidden");
                          }}
                        />
                      ) : null}
                      <div className={`h-full w-full bg-gradient-to-br from-primary/20 to-accent/10 flex items-center justify-center ${programme.image_url ? "hidden" : ""}`}>
                        <GraduationCap className="h-16 w-16 text-primary/30" />
                      </div>
                      {!programme.is_published && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="secondary" className="bg-yellow-500/90 text-yellow-900">
                            Draft
                          </Badge>
                        </div>
                      )}
                      {programme.creator_id === userId && (
                        <div className="absolute top-3 left-3">
                          <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
                            Your Programme
                          </Badge>
                        </div>
                      )}
                    </div>

                    <CardContent className="p-5 space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg leading-tight truncate">
                            {programme.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${getTypeColor(programme.type)}`}
                            >
                              {programme.type}
                            </Badge>
                            {programme.duration && (
                              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {programme.duration}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {programme.description && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {programme.description}
                        </p>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            toast({
                              title: "Coming soon",
                              description: "Programme details page is coming soon.",
                            });
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : null}
          </section>
        )}

        {/* Featured Universities Section */}
        <section>
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
        </section>
      </div>

      {/* Create Programme Dialog */}
      <CreateProgrammeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onProgrammeCreated={() => void fetchUserProgrammes()}
      />
    </div>
  );
};

export default Programmes;
