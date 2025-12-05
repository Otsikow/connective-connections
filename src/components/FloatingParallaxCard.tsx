import { MouseEvent, ReactNode, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface FloatingParallaxCardProps {
  children: ReactNode;
  className?: string;
}

export function FloatingParallaxCard({ children, className }: FloatingParallaxCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef({ rotateX: 0, rotateY: 0, translateZ: 0 });
  const floatRef = useRef({ x: 0, y: 0 });
  const resetAnimation = useRef<number | null>(null);
  const idleAnimation = useRef<number | null>(null);

  const applyTransform = () => {
    const card = cardRef.current;
    if (!card) return;
    const { rotateX, rotateY, translateZ } = tiltRef.current;
    const { x, y } = floatRef.current;
    card.style.transform = `perspective(1000px) translate3d(${x}px, ${y}px, ${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  useEffect(() => {
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      floatRef.current = {
        x: Math.sin((elapsed / 6) * Math.PI * 2) * 1.5,
        y: Math.sin((elapsed / 4) * Math.PI * 2) * 6,
      };
      applyTransform();
      idleAnimation.current = requestAnimationFrame(animate);
    };

    idleAnimation.current = requestAnimationFrame(animate);

    return () => {
      if (idleAnimation.current) cancelAnimationFrame(idleAnimation.current);
      if (resetAnimation.current) cancelAnimationFrame(resetAnimation.current);
    };
  }, []);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    if (resetAnimation.current) {
      cancelAnimationFrame(resetAnimation.current);
      resetAnimation.current = null;
    }

    const rect = card.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const offsetY = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((offsetX - centerX) / centerX) * 6;
    const rotateX = -((offsetY - centerY) / centerY) * 6;

    tiltRef.current = { rotateX, rotateY, translateZ: 10 };
    applyTransform();
  };

  const handleMouseLeave = () => {
    const start = { ...tiltRef.current };
    const duration = 300;
    const startTime = performance.now();

    const animateBack = () => {
      const now = performance.now();
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      tiltRef.current = {
        rotateX: start.rotateX * (1 - eased),
        rotateY: start.rotateY * (1 - eased),
        translateZ: start.translateZ * (1 - eased),
      };
      applyTransform();

      if (progress < 1) {
        resetAnimation.current = requestAnimationFrame(animateBack);
      } else {
        resetAnimation.current = null;
      }
    };

    resetAnimation.current = requestAnimationFrame(animateBack);
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative rounded-3xl transition-transform duration-150 ease-out will-change-transform",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}
