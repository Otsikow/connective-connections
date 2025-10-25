import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { SwipeCard } from "@/components/SwipeCard";

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
}

const profiles: Profile[] = [
  {
    id: "1",
    name: "Sarah M.",
    age: 28,
    photo: "/placeholder.svg",
    interests: ["Coffee Addict", "Yoga Lover", "Plant Parent", "Art Enthusiast"],
    bio: "Love exploring new coffee shops and finding hidden gems in the city. Always up for a good conversation over a cup of coffee!",
    trustBadge: true,
    availability: "Available now",
    distance: "2 miles away"
  },
  {
    id: "2",
    name: "Alex K.",
    age: 31,
    photo: "/placeholder.svg",
    interests: ["Bookworm", "Hiking Enthusiast", "Dog Lover", "New in Town"],
    bio: "Recently moved to the city and looking to make new friends. Love outdoor activities and discovering local bookstores.",
    trustBadge: false,
    availability: "Usually available evenings",
    distance: "1.5 miles away"
  },
  {
    id: "3",
    name: "Jordan L.",
    age: 26,
    photo: "/placeholder.svg",
    interests: ["Foodie", "Photography", "Travel", "Music"],
    bio: "Passionate about food photography and trying new restaurants. Always looking for someone to share a meal with!",
    trustBadge: true,
    availability: "Weekends",
    distance: "3 miles away"
  },
  {
    id: "4",
    name: "Casey R.",
    age: 29,
    photo: "/placeholder.svg",
    interests: ["Fitness", "Cooking", "Gardening", "Volunteering"],
    bio: "Fitness enthusiast who loves cooking healthy meals and tending to my garden. Looking for like-minded friends!",
    trustBadge: false,
    availability: "Mornings",
    distance: "4 miles away"
  }
];

const Matches = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
  const [showMatchModal, setShowMatchModal] = useState(false);

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'right') {
      const currentProfile = profiles[currentIndex];
      setLikedProfiles(prev => [...prev, currentProfile.id]);
      
      // Check if it's a mutual match (simplified for demo)
      if (Math.random() > 0.7) {
        setShowMatchModal(true);
      }
    }
    
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleConnect = () => {
    handleSwipe('right');
  };

  const handleSkip = () => {
    handleSwipe('left');
  };

  const handleStartChat = () => {
    setShowMatchModal(false);
    navigate('/messages');
  };

  const currentProfile = profiles[currentIndex];
  const isLastProfile = currentIndex >= profiles.length - 1;

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 p-2 hover:bg-muted rounded-full transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="max-w-md mx-auto">
        {/* Card Stack Container */}
        <div className="relative h-[600px] mb-6">
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
          <div className="text-center text-muted-foreground">
            <p className="text-lg mb-2">No more profiles to show</p>
            <p className="text-sm">Check back later for new matches!</p>
          </div>
        ) : (
          <div className="text-center text-muted-foreground text-sm">
            Swipe right to connect, left to skip
          </div>
        )}

        {/* Match Modal */}
        {showMatchModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl p-8 text-center max-w-sm w-full">
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
