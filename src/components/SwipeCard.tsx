import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, X, Coffee, Shield, Clock } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

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

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (direction: "left" | "right") => void;
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
      triggerHaptic(dragOffset.x > 0 ? "success" : "warning");
      onSwipe(dragOffset.x > 0 ? "right" : "left");
    } else {
      triggerHaptic("light");
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
    <motion.div
      ref={cardRef}
      className={`absolute inset-0 flex items-stretch justify-center px-2 sm:px-4 swipe-card ${
        isActive ? "cursor-grab active:cursor-grabbing" : "pointer-events-none"
      }`}
      style={{
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${rotation}deg)`,
        opacity,
        zIndex: isActive ? 10 : 1,
      }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: isActive ? 1 : 0.3,
        transition: { type: "spring", stiffness: 260, damping: 20 },
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <Card
        animated={false}
        className="relative h-full w-full max-w-[420px] flex flex-col border-border/60 overflow-hidden shadow-[0px_20px_40px_-20px_rgba(15,23,42,0.45)] bg-card/95 backdrop-blur-sm"
      >
        {/* Photo Section */}
        <div className="relative flex-shrink-0 aspect-[4/5] sm:aspect-[3/4] overflow-hidden">
          <img
            src={profile.photo}
            alt={`${profile.name}'s profile photo`}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-black/60" />

          {/* Status Badges */}
          {(profile.availability || profile.trustBadge) && (
            <div className="absolute inset-x-0 bottom-0 flex items-end gap-2 px-4 pb-4">
              {profile.availability && (
                <Badge variant="secondary" className="gap-1">
                  <Clock className="w-3 h-3" />
                  {profile.availability}
                </Badge>
              )}
              {profile.trustBadge && (
                <Badge className="ml-auto bg-green-500 text-white gap-1 trust-badge">
                  <Shield className="w-3 h-3" />
                  Verified
                </Badge>
              )}
            </div>
          )}

          {/* Swipe Indicators */}
          <div className="absolute inset-0 pointer-events-none">
            {dragOffset.x > 50 && (
              <motion.div
                className="absolute top-1/2 left-8 transform -translate-y-1/2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <div className="w-16 h-16 rounded-full bg-green-500/80 flex items-center justify-center shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
              </motion.div>
            )}
            {dragOffset.x < -50 && (
              <motion.div
                className="absolute top-1/2 right-8 transform -translate-y-1/2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <div className="w-16 h-16 rounded-full bg-red-500/80 flex items-center justify-center shadow-lg">
                  <X className="w-8 h-8 text-white" />
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <CardContent className="flex-1 px-5 sm:px-7 py-6 sm:py-7 text-center flex flex-col gap-6 overflow-y-auto sm:overflow-visible">
          <div className="space-y-4">
            {/* Name and Age */}
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                {profile.name}
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm sm:text-base text-muted-foreground">
                <span className="font-medium text-foreground/80">{profile.age} years old</span>
                {profile.distance && <span className="flex items-center gap-1">• {profile.distance} away</span>}
                {profile.availability && (
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#E8B956]" />
                    {profile.availability}
                  </span>
                )}
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-xl mx-auto">
              {profile.bio}
            </p>
          </div>

          {profile.gallery && profile.gallery.length > 0 && (
            <div className="space-y-3 text-left w-full">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Photo Highlights
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {profile.gallery.slice(0, 3).map((image, index) => (
                  <div
                    key={index}
                    className="relative aspect-square rounded-xl overflow-hidden border border-white/10 shadow-sm"
                  >
                    <img src={image} alt={`${profile.name} gallery ${index + 1}`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interests */}
          <div className="flex-1 w-full">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground mb-3">
              Interests
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {profile.interests.map((interest, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="px-3 py-1 text-xs bg-muted/60 hover:bg-muted text-foreground border border-border/50"
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={onConnect}
            className="w-full h-12 sm:h-14 rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal font-semibold gap-2 text-base sm:text-lg shadow-lg shadow-[#E8B956]/40"
          >
            <Coffee className="w-4 h-4 sm:w-5 sm:h-5" />
            Let's grab coffee!
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
