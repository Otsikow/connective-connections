import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { triggerHaptic } from "@/lib/haptics";
const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-base font-semibold tracking-tight ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0", {
  variants: {
    variant: {
      default: "border border-transparent bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--accent)))] text-primary-foreground shadow-[0_24px_60px_-30px_rgba(190,150,80,0.85)] hover:shadow-[0_28px_70px_-28px_rgba(190,150,80,0.92)]",
      destructive: "bg-destructive text-destructive-foreground shadow-[0_20px_48px_-28px_rgba(220,38,38,0.65)] hover:bg-destructive/90",
      outline: "border border-border/60 bg-card/80 text-foreground/85 hover:border-border hover:bg-card shadow-[0_24px_60px_-32px_rgba(120,105,90,0.35)]",
      secondary: "bg-[hsl(var(--ink))] text-white shadow-[0_30px_60px_-28px_rgba(15,15,15,0.75)] hover:brightness-[0.95]",
      ghost: "bg-transparent text-foreground/80 hover:bg-foreground/10 hover:text-foreground",
      link: "text-primary underline-offset-4 hover:underline"
    },
    size: {
      default: "h-12 px-6",
      sm: "h-10 px-5",
      lg: "h-14 px-9",
      icon: "h-12 w-12"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  enableHaptic?: boolean;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      enableHaptic = true,
      onClick,
      children,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (enableHaptic && !props.disabled) {
        triggerHaptic(variant === "destructive" ? "warning" : "light");
      }
      onClick?.(e);
    };

    const classes = cn(
      buttonVariants({
        variant,
        size,
        className,
      }),
    );

    if (asChild) {
      const Comp = Slot;
      return (
        <Comp className={classes} ref={ref} onClick={handleClick} {...props}>
          {children}
        </Comp>
      );
    }

    return (
      <motion.button
        ref={ref}
        type={type}
        className={classes}
        whileHover={props.disabled ? undefined : { scale: 1.02, translateY: -1 }}
        whileTap={props.disabled ? undefined : { scale: 0.97 }}
        onClick={handleClick}
        {...props}
      >
        {children}
      </motion.button>
    );
  },
);
Button.displayName = "Button";
export { Button, buttonVariants };
