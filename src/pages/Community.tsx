import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Plus } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Community = () => {
  const navigate = useNavigate();

  // Simple premium flag. Replace with real auth/plan check when available.
  const isPremiumUser = useMemo(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("isPremium") === "true";
  }, []);

  const groups = [
    {
      name: "Downtown Book Club",
      category: "Book Club",
      description:
        "Weekly reads and lively discussions. All genres welcome.",
      members: "324 members",
      image: "/placeholder.svg",
    },
    {
      name: "Saturday Hiking Crew",
      category: "Hiking Team",
      description:
        "Trail adventures every weekend. Beginners to experts.",
      members: "1.1k members",
      image: "/placeholder.svg",
    },
    {
      name: "Spanish–English Intercambio",
      category: "Language Swap",
      description:
        "Practice Spanish and English in casual meetups.",
      members: "780 members",
      image: "/placeholder.svg",
    },
    {
      name: "Sci‑Fi Readers United",
      category: "Book Club",
      description:
        "From Asimov to Le Guin. Monthly picks and meetups.",
      members: "512 members",
      image: "/placeholder.svg",
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold">Community</h1>
        {isPremiumUser ? (
          <Button
            variant="default"
            className="h-9 rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal"
            onClick={() => navigate("/messages")}
          >
            <Plus className="w-4 h-4 mr-1.5" /> Create a Group
          </Button>
        ) : (
          <div className="w-9" />
        )}
      </div>

      {/* Groups */}
      <div className="px-6 py-6 space-y-4">
        {groups.map((group, index) => (
          <Card key={index} className="border-border overflow-hidden">
            <div className="h-40 bg-muted">
              <img
                src={group.image}
                alt={group.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <h3 className="font-semibold text-lg leading-tight">{group.name}</h3>
                  <p className="text-xs text-muted-foreground">{group.category} • {group.members}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{group.description}</p>
              <Button
                className="w-full h-11 rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal"
                onClick={() => navigate("/messages")}
              >
                Join Chat
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Community;
