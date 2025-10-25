import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";
import BackButton from "@/components/BackButton";

const profiles = [
  {
    name: "Jane D.",
    tags: ["Bookworm", "Hiking Enthusiast", "Dog Lover", "New in Town"],
    image: "/images/avatars/avatar-1.svg",
  },
  {
    name: "Sarah M.",
    tags: ["Coffee Addict", "Yoga Lover", "Plant Parent", "Art Enthusiast"],
    image: "/images/avatars/avatar-2.svg",
  },
];

const Matches = () => {
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
      <BackButton className="mb-6" />

      <div className="max-w-md mx-auto">
        <Card className="border-border overflow-hidden shadow-lg animate-fade-in">
          <img
            src={currentProfile.image}
            alt={currentProfile.name}
            className="w-full h-96 object-cover"
          />
          <CardContent className="p-6 text-center">
            <h2 className="text-3xl font-bold mb-4">{currentProfile.name}</h2>
            <div className="flex flex-wrap gap-2 justify-center mb-6">
              {currentProfile.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-[#FFF7ED] text-foreground rounded-full text-sm"
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
