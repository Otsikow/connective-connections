import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  X,
  Coffee,
  Shield,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
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
  onAttemptConnect: () => Promise<boolean>;
  isActive: boolean;
}

export const SwipeCard = ({
  profile,
  onSwipe,
  onConnect,
  onAttemptConnect,
  isActive,
}: SwipeCardProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [swipeProgress, setSwipeProgress] = useState(0);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const photoSources = useMemo(() => {
    const sources = [profile.photo, ...(profile.gallery ?? [])].filter(
      (src): src is string => Boolean(src),
    );
    const uniqueSources = Array.from(new Set(sources));
    return uniqueSources.length > 0 ? uniqueSources : ["/placeholder.svg"];
  }, [profile.gallery, profile.photo]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const motionOpacity = useTransform(x, (value) =>
    Math.max(0.35, 1 - Math.abs(value) / 320),
  );
  const rotate = useTransform(x, (value) => {
    const clamped = Math.max(-16, Math.min(16, value * 0.06));
    return clamped;
  });
  const focusOpacity = useMotionValue(isActive ? 1 : 0.55);
  const combinedOpacity = useTransform([motionOpacity, focusOpacity], ([base, focus]) => base * focus);

  useMotionValueEvent(x, "change", (latest) => {
    setSwipeProgress(latest);
  });

  useEffect(() => {
    const animation = animate(focusOpacity, isActive ? 1 : 0.55, {
      duration: 0.28,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => {
      animation.stop();
    };
  }, [focusOpacity, isActive]);

  useEffect(() => {
    x.set(0);
    y.set(0);
    setSwipeProgress(0);
    setIsAnimatingOut(false);
    setIsDragging(false);
    setActivePhotoIndex(0);
  }, [profile.id, x, y]);

  const handleStart = (clientX: number, clientY: number) => {
    if (!isActive || isAnimatingOut) return;
    x.stop();
    y.stop();
    setIsDragging(true);
    setStartPos({ x: clientX, y: clientY });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging || !isActive || isAnimatingOut) return;
    const deltaX = clientX - startPos.x;
    const deltaY = clientY - startPos.y;
    x.set(deltaX);
    y.set(deltaY);
  };

  const handleEnd = async () => {
    if (!isDragging || !isActive) return;
    setIsDragging(false);

    const threshold = 100;
    const currentX = x.get();
    const currentY = y.get();

    if (Math.abs(currentX) > threshold) {
      const direction = currentX > 0 ? "right" : "left";
      if (direction === "right") {
        const allowed = await onAttemptConnect();
        if (allowed) {
          triggerHaptic("success");
          await animateOffscreen("right", currentY);
          onSwipe("right");
        } else {
          triggerHaptic("warning");
          await animateBackToCenter();
        }
      } else {
        triggerHaptic("warning");
        await animateOffscreen("left", currentY);
        onSwipe("left");
      }
    } else {
      triggerHaptic("light");
      await animateBackToCenter();
    }
  };

  const animateBackToCenter = async () => {
    setIsAnimatingOut(false);
    const springConfig = { type: "spring", stiffness: 320, damping: 26 } as const;
    await Promise.all([
      animate(x, 0, springConfig).finished,
      animate(y, 0, springConfig).finished,
    ]);
    setSwipeProgress(0);
  };

  const animateOffscreen = async (
    direction: "left" | "right",
    currentY: number,
  ) => {
    setIsAnimatingOut(true);
    const exitX = direction === "right" ? 620 : -620;
    const exitSpring = { type: "spring", stiffness: 210, damping: 28 } as const;

    await Promise.all([
      animate(x, exitX, exitSpring).finished,
      animate(y, currentY * 0.25, exitSpring).finished,
    ]);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX, e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    void handleEnd();
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
    void handleEnd();
  };

  const showLike = swipeProgress > 50;
  const showPass = swipeProgress < -50;
  const isInteractable = isActive && !isAnimatingOut;

  const navigatePhotos = (direction: "prev" | "next") => {
    if (photoSources.length <= 1) return;

    setActivePhotoIndex((prev) => {
      const nextIndex =
        direction === "next"
          ? (prev + 1) % photoSources.length
          : (prev - 1 + photoSources.length) % photoSources.length;
      return nextIndex;
    });
  };

  return (
    <motion.div
      ref={cardRef}
      className={`absolute inset-0 flex items-stretch justify-center px-2 sm:px-4 swipe-card ${
        isInteractable
          ? "cursor-grab active:cursor-grabbing"
          : "pointer-events-none"
      }`}
      style={{
        x,
        y,
        rotate,
        opacity: combinedOpacity,
        zIndex: isActive ? 10 : 1,
      }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{
        scale: isActive ? 1 : 0.96,
        filter: isActive ? "blur(0px)" : "blur(1px)",
        transition: { type: "spring", stiffness: 260, damping: 20 },
      }}
      whileTap={isInteractable ? { scale: 0.98 } : undefined}
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
          <AnimatePresence mode="wait" initial={false}>
            <motion.img
              key={photoSources[activePhotoIndex]}
              src={photoSources[activePhotoIndex]}
              alt={`${profile.name}'s profile photo ${activePhotoIndex + 1}`}
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ x: 40, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 24 }}
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/5 to-black/60" />

          {photoSources.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between px-3">
              <button
                type="button"
                onClick={() => navigatePhotos("prev")}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => navigatePhotos("next")}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition hover:bg-black/60"
                aria-label="Next photo"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}

          {photoSources.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {photoSources.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setActivePhotoIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    activePhotoIndex === index
                      ? "w-6 bg-white"
                      : "w-2 bg-white/60 hover:bg-white"
                  }`}
                  aria-label={`View photo ${index + 1}`}
                />
              ))}
            </div>
          )}

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
            {showLike && (
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
            {showPass && (
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
                    <Clock className="w-3.5 h-3.5 text-[hsl(var(--highlight-text))]" />
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

          {photoSources.length > 1 && (
            <div className="space-y-3 text-left w-full">
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Photo Highlights
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {photoSources.slice(1, 4).map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActivePhotoIndex(index + 1)}
                    className="relative aspect-square rounded-xl overflow-hidden border border-white/10 shadow-sm focus:outline-none focus:ring-2 focus:ring-white/70"
                  >
                    <img src={image} alt={`${profile.name} gallery ${index + 1}`} className="h-full w-full object-cover" />
                  </button>
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
            className="w-full sm:h-14 gap-2 text-base sm:text-lg"
          >
            <Coffee className="w-4 h-4 sm:w-5 sm:h-5" />
            Let's grab coffee!
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
