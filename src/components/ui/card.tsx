import * as React from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  animated?: boolean;
  hoverScale?: boolean;
  highlighted?: boolean;
}

const baseCardClasses =
  "relative w-full overflow-hidden rounded-[26px] border border-transparent bg-card/90 text-card-foreground shadow-[0_26px_60px_-32px_rgba(190,150,80,0.6)] transition-all duration-500 supports-[backdrop-filter]:backdrop-blur-xl sm:rounded-[32px] card-glow-border";

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({
    className,
    animated = true,
    hoverScale = true,
    highlighted = false,
    ...props
  }, ref) => {
    const mergedClasses = cn(
      baseCardClasses,
      "stagger-card",
      highlighted && "premium-ambient",
      className,
    );

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

    return (
      <motion.div
        ref={ref}
        data-stagger-card="true"
        className={mergedClasses}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        whileHover={hoverScale ? { scale: 1.01, y: -2 } : undefined}
        {...(props as any)}
      />
    );
  }
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
