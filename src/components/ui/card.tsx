import * as React from "react";
import { animate, motion, useMotionValue, useSpring } from "framer-motion";

import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  animated?: boolean;
  hoverScale?: boolean;
}

const baseCardClasses =
  "relative w-full overflow-hidden rounded-[26px] border border-transparent bg-card/90 text-card-foreground shadow-[0_26px_60px_-32px_rgba(190,150,80,0.6)] transition-all duration-500 supports-[backdrop-filter]:backdrop-blur-xl sm:rounded-[32px] card-glow-border";

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, animated = true, hoverScale = true, ...props }, ref) => {
    if (!animated) {
      return (
        <div
          ref={ref}
          className={cn(baseCardClasses, className)}
          {...props}
        />
      );
    }

    const { onPointerMove, onPointerLeave, ...restProps } = props;

    const cardRef = React.useRef<HTMLDivElement | null>(null);
    const opacity = useMotionValue(0);
    const idleY = useMotionValue(20);
    const tiltX = useSpring(0, { stiffness: 220, damping: 28 });
    const tiltY = useSpring(0, { stiffness: 220, damping: 28 });
    const hoverScaleValue = useSpring(1, { stiffness: 220, damping: 28 });

    const setParallax = (x: number, y: number) => {
      if (!cardRef.current) return;

      cardRef.current.style.setProperty("--card-parallax-x", `${x}%`);
      cardRef.current.style.setProperty("--card-parallax-y", `${y}%`);
    };

    React.useEffect(() => {
      const fadeIn = animate(opacity, 1, {
        duration: 0.35,
        ease: [0.4, 0, 0.2, 1],
      });

      const settle = animate(idleY, 0, {
        duration: 0.35,
        ease: [0.4, 0, 0.2, 1],
      });

      let floatControls: ReturnType<typeof animate> | undefined;

      settle.then(() => {
        floatControls = animate(idleY, [0, -6, 0, 0], {
          duration: 4.5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
          times: [0, 0.088, 0.177, 1],
        });
      });

      return () => {
        fadeIn.stop();
        settle.stop();
        floatControls?.stop();
      };
    }, [idleY, opacity]);

    const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
      if (!cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const relativeX = (event.clientX - rect.left) / rect.width - 0.5;
      const relativeY = (event.clientY - rect.top) / rect.height - 0.5;
      const maxTilt = 4;

      tiltX.set(-relativeY * maxTilt * 2);
      tiltY.set(relativeX * maxTilt * 2);
      setParallax(50 + relativeX * 6, 50 + relativeY * 6);

      if (hoverScale) {
        hoverScaleValue.set(1.03);
      }

      onPointerMove?.(event);
    };

    const handlePointerLeave = (event: React.PointerEvent<HTMLDivElement>) => {
      tiltX.set(0);
      tiltY.set(0);
      setParallax(50, 50);

      if (hoverScale) {
        hoverScaleValue.set(1);
      }

      onPointerLeave?.(event);
    };

    const composedStyle = {
      opacity,
      rotateX: tiltX,
      rotateY: tiltY,
      scale: hoverScale ? hoverScaleValue : 1,
      y: idleY,
      perspective: 1200,
      transformStyle: "preserve-3d",
    };

    return (
      <motion.div
        ref={(node) => {
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }
          cardRef.current = node;
        }}
        className={cn(baseCardClasses, "interactive-card", className)}
        style={composedStyle}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        {...(restProps as any)}
      />
    );
  },
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-2.5 p-6 sm:p-8", className)}
      {...props}
    />
  ),
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-2xl font-semibold leading-tight text-foreground/95 sm:text-[1.75rem]", className)}
      {...props}
    />
  ),
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-base text-muted-foreground/90", className)} {...props} />
  ),
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0 sm:p-8", className)} {...props} />
  ),
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0 sm:p-8", className)}
      {...props}
    />
  ),
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
