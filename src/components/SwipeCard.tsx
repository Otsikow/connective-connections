import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, X, Coffee, Shield, Clock } from "lucide-react";

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

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (direction: 'left' | 'right') => void;
  onConnect: () => void;
  isActive: boolean;
}

export const SwipeCard = ({ profile, onSwipe, onConnect, isActive }: SwipeCardProps) => {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleStart = (clientX: number, clientY: number) => {
    if (!isActive) return;
    setIsDragging(true);
    setStartPos({ x: clientX, y: clientY });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || !isActive) return;
    const deltaX = clientX - startPos.x;
    const deltaY = clientY - startPos.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleEnd = () => {
    if (!isDragging || !isActive) return;
    setIsDragging(false);
    
    const threshold = 100;
    if (Math.abs(dragOffset.x) > threshold) {
      onSwipe(dragOffset.x > 0 ? 'right' : 'left');
    }
    
    setDragOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  const rotation = dragOffset.x * 0.1;
  const opacity = Math.max(0.3, 1 - Math.abs(dragOffset.x) / 300);

  return (
    <div
      ref={cardRef}
      className={`absolute inset-0 transition-all duration-200 swipe-card ${
        isActive ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'
      }`}
      style={{
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
        opacity,
        zIndex: isActive ? 10 : 1,
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Card className="h-full border-border overflow-hidden shadow-2xl animate-fade-in">
        {/* Photo Section */}
        <div className="relative h-96 bg-gradient-to-br from-blue-400 to-purple-500">
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 rounded-full bg-white/20 backdrop-blur-sm border-4 border-white/30" />
          </div>
          
          {/* Trust Badge */}
          {profile.trustBadge && (
            <div className="absolute top-4 right-4">
              <Badge className="bg-green-500 text-white gap-1 trust-badge">
                <Shield className="w-3 h-3" />
                Verified
              </Badge>
            </div>
          )}

          {/* Availability */}
          {profile.availability && (
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="gap-1">
                <Clock className="w-3 h-3" />
                {profile.availability}
              </Badge>
            </div>
          )}

          {/* Swipe Indicators */}
          <div className="absolute inset-0 pointer-events-none">
            {dragOffset.x > 50 && (
              <div className="absolute top-1/2 left-8 transform -translate-y-1/2">
                <div className="w-16 h-16 rounded-full bg-green-500/80 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </div>
            )}
            {dragOffset.x < -50 && (
              <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
                <div className="w-16 h-16 rounded-full bg-red-500/80 flex items-center justify-center">
                  <X className="w-8 h-8 text-white" />
                </div>
              </div>
            )}
          </div>
        </div>

        <CardContent className="p-6 text-center">
          {/* Name and Age */}
          <div className="mb-4">
            <h2 className="text-3xl font-bold mb-1">{profile.name}</h2>
            <p className="text-lg text-muted-foreground">{profile.age} years old</p>
            {profile.distance && (
              <p className="text-sm text-muted-foreground">{profile.distance} away</p>
            )}
          </div>

          {/* Bio */}
          <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
            {profile.bio}
          </p>

          {/* Interests */}
          <div className="flex flex-wrap gap-2 justify-center mb-6">
            {profile.interests.map((interest, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="px-3 py-1 text-xs"
              >
                {interest}
              </Badge>
            ))}
          </div>

          {/* CTA Button */}
          <Button
            onClick={onConnect}
            className="w-full h-14 rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal font-semibold gap-2 text-lg"
          >
            <Coffee className="w-5 h-5" />
            Let's grab coffee!
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
