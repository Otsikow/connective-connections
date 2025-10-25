import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Check, Heart, ShieldCheck, Sparkles, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type Profile = {
  id: string;
  name: string;
  age: number;
  interests: string[];
  image: string;
  verified?: boolean;
  availability?: string;
};

const profiles: Profile[] = [
  {
    id: "jane",
    name: "Jane D.",
    age: 27,
    interests: ["Bookworm", "Hiking", "Dog lover", "New in town"],
    image: "/placeholder.svg",
    verified: true,
    availability: "Free this weekend",
  },
  {
    id: "sarah",
    name: "Sarah M.",
    age: 29,
    interests: ["Coffee", "Yoga", "Plants", "Art"],
    image: "/placeholder.svg",
    verified: true,
    availability: "After 6pm on weekdays",
  },
  {
    id: "mia",
    name: "Mia R.",
    age: 25,
    interests: ["Bouldering", "Indie films", "Poetry"],
    image: "/placeholder.svg",
    verified: false,
    availability: "Mornings",
  },
];

const Matches = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const currentProfile = profiles[currentIndex];

  const remainingCount = useMemo(() => profiles.length - currentIndex - 1, [currentIndex]);

  const goNext = () => {
    if (currentIndex < profiles.length - 1) setCurrentIndex((idx) => idx + 1);
  };

  const handleSkip = () => {
    goNext();
  };

  const handleConnect = () => {
    if (!currentProfile) return;
    const nextLiked = [...likedIds, currentProfile.id];
    setLikedIds(nextLiked);

    // Simulate instant mutual like for demo; navigate to chat
    navigate(`/messages/${currentProfile.id}`);
    goNext();
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-background px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 p-2 hover:bg-muted rounded-full transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="max-w-md mx-auto">
        <div className="relative h-[520px]">
          {profiles.slice(currentIndex, currentIndex + 3).map((profile, idx) => {
            const isTop = idx === 0;
            const translate = idx * 12;
            const scale = 1 - idx * 0.03;
            return (
              <Card
                key={profile.id}
                className="absolute inset-0 border-border overflow-hidden shadow-xl transition-all"
                style={{
                  transform: `translateY(${translate}px) scale(${scale})`,
                  zIndex: 10 - idx,
                }}
              >
                <div className="h-80 bg-muted relative">
                  <Avatar className="w-28 h-28 absolute -bottom-14 left-6 ring-4 ring-card">
                    <AvatarImage src={profile.image} />
                    <AvatarFallback>{profile.name[0]}</AvatarFallback>
                  </Avatar>
                </div>

                <CardContent className="p-6 pt-20">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                    <span className="text-lg text-muted-foreground">• {profile.age}</span>
                    {profile.verified && (
                      <Badge className="gap-1 bg-emerald-600 text-white border-emerald-700">
                        <ShieldCheck className="w-3.5 h-3.5" /> Verified
                      </Badge>
                    )}
                  </div>
                  {profile.availability && (
                    <p className="text-sm text-muted-foreground mb-4">{profile.availability}</p>
                  )}

                  <div className="flex flex-wrap gap-2 mb-6">
                    {profile.interests.map((tag) => (
                      <span key={tag} className="px-3 py-1 bg-[#FFF7ED] text-foreground rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {isTop && (
                    <div className="flex gap-4 items-center">
                      <Button
                        onClick={handleConnect}
                        className="flex-1 h-14 rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal font-semibold gap-2"
                      >
                        <Sparkles className="w-5 h-5" /> Let's grab coffee!
                      </Button>
                      <Button onClick={handleSkip} variant="outline" className="h-14 w-14 rounded-full border-2">
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                  )}

                  {!isTop && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Check className="w-4 h-4" /> {remainingCount} more profiles
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 text-center">
          <button className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Report or block this profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Matches;
