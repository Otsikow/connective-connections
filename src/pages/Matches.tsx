import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Heart, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const profiles = [
  {
    name: "Jane D.",
    tags: ["Bookworm", "Hiking Enthusiast", "Dog Lover", "New in Town"],
    image: "/avatar-placeholder.svg",
  },
  {
    name: "Sarah M.",
    tags: ["Coffee Addict", "Yoga Lover", "Plant Parent", "Art Enthusiast"],
    image: "/avatar-placeholder.svg",
  },
];

const Matches = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSkip = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleConnect = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const currentProfile = profiles[currentIndex];

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 p-2 hover:bg-muted rounded-full transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="max-w-md mx-auto">
        <Card className="border-border overflow-hidden shadow-xl animate-fade-in">
          <div className="h-96 bg-gradient-to-br from-[#E8B956]/10 to-[#FF8663]/10 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <img 
                  src={currentProfile.image} 
                  alt={currentProfile.name}
                  className="w-48 h-48 rounded-full object-cover ring-4 ring-white/50 shadow-2xl"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
          <CardContent className="p-6 text-center">
            <h2 className="text-3xl font-bold mb-4">{currentProfile.name}</h2>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {currentProfile.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gradient-to-r from-[#E8B956]/20 to-[#FF8663]/20 text-foreground rounded-full text-sm font-medium border border-[#E8B956]/30"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex gap-4 justify-center mb-4">
              <Button
                onClick={handleConnect}
                className="flex-1 h-14 rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal font-semibold gap-2"
              >
                <Heart className="w-5 h-5" />
                Let's Connect
              </Button>
              <Button
                onClick={handleSkip}
                variant="outline"
                className="h-14 w-14 rounded-full border-2"
              >
                Skip
              </Button>
            </div>

            <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Report or block this profile
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Matches;
