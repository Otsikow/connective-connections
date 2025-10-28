import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SwipeCard } from "@/components/SwipeCard";
import BackButton from "@/components/BackButton";

interface Profile {
  id: string;
  name: string;
  age: number;
  photo: string;
  interests: string[];
  bio: string;
  trustBadge?: boolean;
  availability?: string;
  distance?: string;
  gallery?: string[];
}

const profiles: Profile[] = [
  {
    id: "1",
    name: "Sarah M.",
    age: 28,
    photo:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1470707592410-7d79450eaf42?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80",
    ],
    interests: ["Coffee Addict", "Yoga Lover", "Plant Parent", "Art Enthusiast"],
    bio: "Love exploring new coffee shops and finding hidden gems in the city. Always up for a good conversation over a cup of coffee!",
    trustBadge: true,
    availability: "Available now",
    distance: "2 miles away",
  },
  {
    id: "2",
    name: "Alex K.",
    age: 31,
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1456327102063-fb5054efe647?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1519340333755-56e9c77f5a47?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=400&q=80",
    ],
    interests: ["Bookworm", "Hiking Enthusiast", "Dog Lover", "New in Town"],
    bio: "Recently moved to the city and looking to make new friends. Love outdoor activities and discovering local bookstores.",
    trustBadge: false,
    availability: "Usually available evenings",
    distance: "1.5 miles away",
  },
  {
    id: "3",
    name: "Jordan L.",
    age: 26,
    photo:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1506086679525-9fdbfc0b81e5?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80",
    ],
    interests: ["Foodie", "Photography", "Travel", "Music"],
    bio: "Passionate about food photography and trying new restaurants. Always looking for someone to share a meal with!",
    trustBadge: true,
    availability: "Weekends",
    distance: "3 miles away",
  },
  {
    id: "4",
    name: "Casey R.",
    age: 29,
    photo:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=400&q=80",
    ],
    interests: ["Fitness", "Cooking", "Gardening", "Volunteering"],
    bio: "Fitness enthusiast who loves cooking healthy meals and tending to my garden. Looking for like-minded friends!",
    trustBadge: false,
    availability: "Mornings",
    distance: "4 miles away",
  },
];

const Matches = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
  const [showMatchModal, setShowMatchModal] = useState(false);

  const handleSwipe = (direction: "left" | "right") => {
    if (direction === "right") {
      const currentProfile = profiles[currentIndex];
      setLikedProfiles((prev) => [...prev, currentProfile.id]);

      // Simulated mutual match (randomized for demo)
      if (Math.random() > 0.7) {
        setShowMatchModal(true);
      }
    }

    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleConnect = () => handleSwipe("right");
  const handleSkip = () => handleSwipe("left");

  const handleStartChat = () => {
    setShowMatchModal(false);
    navigate("/messages");
  };

  const currentProfile = profiles[currentIndex];
  const isLastProfile = currentIndex >= profiles.length - 1;

  return (
    <div className="min-h-screen bg-background px-4 sm:px-6 py-8">
      {/* Back Arrow */}
      <BackButton
        fallbackPath="/home"
        size="icon"
        className="mb-6 h-10 w-10"
      />

      <div className="max-w-md mx-auto">
        {/* Card Stack Container */}
        <div
          className="relative mb-6"
          style={{ minHeight: "clamp(540px, 75vh, 680px)" }}
        >
          {profiles.slice(currentIndex, currentIndex + 3).map((profile, index) => (
            <SwipeCard
              key={profile.id}
              profile={profile}
              onSwipe={handleSwipe}
              onConnect={handleConnect}
              isActive={index === 0}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mb-4">
          <Button
            onClick={handleSkip}
            variant="outline"
            className="h-14 w-14 rounded-full border-2 hover:bg-red-50 hover:border-red-300"
          >
            <X className="w-6 h-6 text-red-500" />
          </Button>

          <Button
            onClick={handleConnect}
            className="h-14 w-14 rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal"
          >
            <Heart className="w-6 h-6" />
          </Button>
        </div>

        {/* Status Message */}
        {isLastProfile ? (
          <div className="text-center text-muted-foreground px-4">
            <p className="text-base sm:text-lg mb-2">No more profiles to show</p>
            <p className="text-xs sm:text-sm">Check back later for new matches!</p>
          </div>
        ) : (
          <div className="text-center text-muted-foreground text-xs sm:text-sm px-4">
            Swipe right to connect, left to skip
          </div>
        )}

        {/* Match Modal */}
        {showMatchModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl p-6 sm:p-8 text-center max-w-sm w-full shadow-xl">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2">It's a Match!</h2>
              <p className="text-muted-foreground mb-6">
                You and {currentProfile.name} both liked each other. Start a conversation!
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowMatchModal(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Keep Swiping
                </Button>
                <Button
                  onClick={handleStartChat}
                  className="flex-1 bg-[#E8B956] hover:bg-[#d9a840] text-charcoal"
                >
                  Start Chat
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
