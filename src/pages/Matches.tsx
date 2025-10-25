import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, X, Coffee } from "lucide-react";
import { useNavigate } from "react-router-dom";

const profiles = [
  {
    id: 1,
    name: "Jane D.",
    age: 28,
    interests: ["Bookworm", "Hiking Enthusiast", "Dog Lover", "New in Town"],
    image: "/placeholder.svg",
    bio: "Looking for friends to explore hiking trails with!",
  },
  {
    id: 2,
    name: "Sarah M.",
    age: 25,
    interests: ["Coffee Addict", "Yoga Lover", "Plant Parent", "Art Enthusiast"],
    image: "/placeholder.svg",
    bio: "Love meeting new people and trying new cafes!",
  },
  {
    id: 3,
    name: "Mike R.",
    age: 32,
    interests: ["Board Games", "Tech Enthusiast", "Food Explorer", "Marathon Runner"],
    image: "/placeholder.svg",
    bio: "Always up for game nights and good conversations!",
  },
];

const Matches = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cards, setCards] = useState(profiles);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
  };

  const handleDragMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    
    const deltaX = clientX - dragStart.x;
    const deltaY = clientY - dragStart.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    setIsDragging(false);
    
    // Swipe threshold
    if (Math.abs(dragOffset.x) > 100) {
      if (dragOffset.x > 0) {
        handleLike();
      } else {
        handlePass();
      }
    }
    
    setDragOffset({ x: 0, y: 0 });
  };

  const handleLike = () => {
    // Show match animation/notification
    const matchedProfile = currentProfile;
    
    if (currentIndex < cards.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
    } else {
      // Show "no more profiles" message
      setCards([]);
    }
    
    // Simulate both users liking each other (50% chance for demo)
    if (Math.random() > 0.5) {
      setTimeout(() => {
        // Show match notification and navigate to chat
        const confirmed = window.confirm(
          `🎉 It's a match with ${matchedProfile.name}! Start chatting now?`
        );
        if (confirmed) {
          navigate(`/messages/${matchedProfile.id}`);
        }
      }, 500);
    }
  };

  const handlePass = () => {
    if (currentIndex < cards.length - 1) {
      setTimeout(() => setCurrentIndex(currentIndex + 1), 300);
    } else {
      setCards([]);
    }
  };

  const currentProfile = cards[currentIndex];

  const getRotation = () => {
    return dragOffset.x * 0.1;
  };

  const getOpacity = () => {
    return 1 - Math.abs(dragOffset.x) / 500;
  };

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-background px-6 py-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 p-2 hover:bg-muted rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="max-w-md mx-auto flex flex-col items-center justify-center h-96">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold mb-2">No more profiles!</h2>
          <p className="text-muted-foreground text-center mb-6">
            Check back later for more potential friends
          </p>
          <Button
            onClick={() => navigate("/home")}
            className="bg-[#E8B956] hover:bg-[#d9a840] text-charcoal"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 p-2 hover:bg-muted rounded-full transition-colors"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Discover Friends</h1>
        
        <div className="relative h-[600px]">
          {/* Stack of cards - show next card behind */}
          {cards.slice(currentIndex, currentIndex + 2).map((profile, index) => {
            const isTopCard = index === 0;
            
            return (
              <Card
                key={profile.id}
                ref={isTopCard ? cardRef : null}
                className={`absolute inset-0 border-border overflow-hidden shadow-lg transition-all ${
                  isTopCard ? 'z-10' : 'z-0 scale-95 opacity-50'
                }`}
                style={
                  isTopCard
                    ? {
                        transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${getRotation()}deg)`,
                        opacity: getOpacity(),
                        transition: isDragging ? 'none' : 'transform 0.3s ease, opacity 0.3s ease',
                      }
                    : {}
                }
                onMouseDown={(e) => isTopCard && handleDragStart(e.clientX, e.clientY)}
                onMouseMove={(e) => isTopCard && handleDragMove(e.clientX, e.clientY)}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
                onTouchStart={(e) => isTopCard && handleDragStart(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchMove={(e) => isTopCard && handleDragMove(e.touches[0].clientX, e.touches[0].clientY)}
                onTouchEnd={handleDragEnd}
              >
                {/* Profile Image */}
                <div className="h-80 bg-gradient-to-br from-[#FF8663] to-[#E8B956] relative overflow-hidden">
                  <img 
                    src={profile.image} 
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Swipe indicators */}
                  {isTopCard && isDragging && (
                    <>
                      <div
                        className="absolute top-8 left-8 bg-green-500 text-white px-6 py-3 rounded-lg font-bold text-xl transform rotate-[-20deg] border-4 border-green-500"
                        style={{ opacity: Math.max(0, dragOffset.x / 200) }}
                      >
                        LIKE
                      </div>
                      <div
                        className="absolute top-8 right-8 bg-red-500 text-white px-6 py-3 rounded-lg font-bold text-xl transform rotate-[20deg] border-4 border-red-500"
                        style={{ opacity: Math.max(0, -dragOffset.x / 200) }}
                      >
                        PASS
                      </div>
                    </>
                  )}
                </div>

                <CardContent className="p-6">
                  {/* Name and Age */}
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-3xl font-bold">{profile.name}</h2>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {profile.age}
                    </Badge>
                  </div>

                  {/* Bio */}
                  <p className="text-muted-foreground mb-4">{profile.bio}</p>

                  {/* Interests */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {profile.interests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-4 py-2 bg-[#FFF7ED] text-foreground rounded-full text-sm font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={handleLike}
                    className="w-full h-14 rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal font-semibold text-lg gap-2 mb-4"
                  >
                    <Coffee className="w-5 h-5" />
                    Let's grab coffee!
                  </Button>

                  {/* Action Buttons */}
                  <div className="flex gap-4 justify-center">
                    <Button
                      onClick={handlePass}
                      variant="outline"
                      size="lg"
                      className="h-16 w-16 rounded-full border-2 border-red-400 hover:bg-red-50 hover:border-red-500"
                    >
                      <X className="w-7 h-7 text-red-500" />
                    </Button>
                    <Button
                      onClick={handleLike}
                      variant="outline"
                      size="lg"
                      className="h-16 w-16 rounded-full border-2 border-green-400 hover:bg-green-50 hover:border-green-500"
                    >
                      <Heart className="w-7 h-7 text-green-500" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Instructions */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Swipe right to like, left to pass • Tap buttons to choose
        </p>
        
        <button 
          className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-4 text-center w-full"
          onClick={() => {/* Report functionality */}}
        >
          Report or block this profile
        </button>
      </div>
    </div>
  );
};

export default Matches;
