import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  animated?: boolean;
  hoverScale?: boolean;
}

const baseCardClasses =
  "relative w-full overflow-hidden rounded-[22px] border border-[rgba(255,255,255,0.06)] bg-[#0d0d0d] bg-[radial-gradient(circle_at_20%_18%,#141414_0%,#0d0d0d_55%,#080808_100%)] text-card-foreground shadow-[0_8px_40px_rgba(0,0,0,0.6)] transition-all duration-500 supports-[backdrop-filter]:backdrop-blur-xl card-glow-border focus-visible:outline-none focus-visible:shadow-[inset_0_0_0_1px_rgba(255,140,50,0.35),0_0_0_12px_rgba(255,140,50,0.12)]";

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

    return (
      <motion.div
        ref={ref}
        className={cn(
          baseCardClasses,
          "hover:[&>*]:brightness-105 hover:[&_img]:brightness-110",
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        whileHover={
          hoverScale
            ? {
                y: -6,
                rotateX: -2.5,
                rotateY: 2.5,
                scale: 1.03,
                transition: { duration: 0.35 },
              }
            : undefined
        }
        whileTap={{ scale: 0.995 }}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-2.5 p-6 sm:p-8", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-tight text-foreground/95 sm:text-[1.75rem]",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-base text-muted-foreground/90", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0 sm:p-8", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex items-center p-6 pt-0 sm:p-8", className)} {...props} />
));
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
