import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  animated?: boolean;
  hoverScale?: boolean;
  highlighted?: boolean;
  idleFloat?: boolean;
}

const baseCardClasses =
  "relative w-full overflow-hidden rounded-[20px] border border-[rgba(255,255,255,0.06)] bg-[#111111] text-card-foreground shadow-[inset_0_0_0_1px_rgba(255,255,255,0.03),0_8px_38px_rgba(0,0,0,0.55)] transition-all duration-350 ease-spring supports-[backdrop-filter]:backdrop-blur-xl card-glow-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A3C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]";

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, animated = true, hoverScale = true, highlighted = false, idleFloat = false, ...props }, ref) => {
    
    const mergedClasses = cn(
      baseCardClasses,
      "stagger-card",
      highlighted && "premium-ambient",
      idleFloat && "card-idle-float",
      className
    );

    // Non-animated version
    if (!animated) {
      return (
        <div
          ref={ref}
          data-stagger-card="true"
          className={mergedClasses}
          {...props}
        />
      );
    }

    // Animated version with world-class hover effects
    return (
      <motion.div
        ref={ref}
        data-stagger-card="true"
        className={mergedClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
        whileHover={
          hoverScale
            ? {
                y: -6,
                rotateX: -3,
                rotateY: 3,
                scale: 1.02,
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06), 0 14px 48px rgba(0,0,0,0.65)",
                transition: { 
                  duration: 0.35,
                  ease: [0.34, 1.56, 0.64, 1]
                },
              }
            : undefined
        }
        whileTap={{ 
          scale: 0.97,
          transition: { duration: 0.1 }
        }}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-2.5 p-6 sm:p-8", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-2xl font-semibold leading-tight text-foreground/95 sm:text-[1.75rem]", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-base text-muted-foreground/90", className)} {...props} />
  )
);
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0 sm:p-8", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0 sm:p-8", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
