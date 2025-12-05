import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { triggerHaptic } from "@/lib/haptics";
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[16px] text-base font-semibold tracking-tight ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0 [&_svg]:animate-magnetic-icon [&_svg]:origin-center",
  {
  variants: {
    variant: {
      default:
        "border-none bg-[linear-gradient(135deg,#ff9d47,#ff6b00)] text-white shadow-[0_12px_30px_-12px_rgba(255,120,40,0.35),0_0_22px_rgba(255,120,40,0.32)] hover:shadow-[0_14px_36px_-12px_rgba(255,120,40,0.42),0_0_26px_rgba(255,120,40,0.4)]",
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
  magnetic?: boolean;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      enableHaptic = true,
      magnetic = true,
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

    const {
      disabled,
      onPointerMove,
      onPointerLeave,
      onMouseLeave,
      onMouseMove,
      ...restProps
    } = props;

    const buttonRef = React.useRef<HTMLButtonElement | null>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const scale = useMotionValue(1);
    const shadowStrength = useMotionValue(0);

    const dropShadow = useTransform(shadowStrength, (value) => {
      const opacity = 0.14 + value * 0.12;
      return `drop-shadow(0 14px 36px rgba(15,23,42,${opacity.toFixed(3)}))`;
    });

    const glowShadow = useTransform(shadowStrength, (value) => {
      const warmAura = 0.32 + value * 0.2;
      const bloom = 0.26 + value * 0.18;
      return `0 12px 28px rgba(255,120,40,${bloom.toFixed(3)}), 0 0 30px rgba(255,120,40,${warmAura.toFixed(3)})`;
    });

    const magneticTransition = React.useMemo(() => ({
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1] as const,
    }), []);

    const resetMagnetic = () => {
      animate(x, 0, { duration: 0.2 });
      animate(y, 0, { duration: 0.2 });
      animate(scale, 1, { duration: 0.2 });
      animate(shadowStrength, 0, { duration: 0.2 });
    };

    const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!magnetic || disabled || !buttonRef.current) {
        onPointerMove?.(event);
        onMouseMove?.(event);
        return;
      }

      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = event.clientX - centerX;
      const dy = event.clientY - centerY;
      const distance = Math.hypot(dx, dy);
      const influenceRadius = 100;

      if (distance > influenceRadius) {
        resetMagnetic();
        onPointerMove?.(event);
        onMouseMove?.(event);
        return;
      }

      const pullRatio = Math.max(0, 1 - distance / influenceRadius);
      const maxMove = 12;
      const translateX = distance === 0 ? 0 : (dx / distance) * (maxMove * pullRatio);
      const translateY = distance === 0 ? 0 : (dy / distance) * (maxMove * pullRatio);
      const targetScale = 1 + 0.05 * pullRatio;

      animate(x, translateX, { ...magneticTransition });
      animate(y, translateY, { ...magneticTransition });
      animate(scale, targetScale, { ...magneticTransition });
      animate(shadowStrength, pullRatio, { ...magneticTransition });

      onPointerMove?.(event);
      onMouseMove?.(event);
    };

    const handlePointerLeave = (event: React.PointerEvent<HTMLButtonElement>) => {
      resetMagnetic();
      onPointerLeave?.(event);
      onMouseLeave?.(event);
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
      if (!disabled) {
        const currentScale = scale.get();
        animate(scale, [currentScale * 0.98, currentScale * 1.02, currentScale], {
          duration: 0.42,
          times: [0, 0.55, 1],
          ease: [0.22, 1, 0.36, 1],
        });
      }

      restProps?.onPointerDown?.(event);
    };

    return (
      <motion.button
        ref={(node) => {
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            (ref as React.MutableRefObject<HTMLButtonElement | null>).current = node;
          }
          buttonRef.current = node;
        }}
        type={type}
        className={classes}
        disabled={disabled}
        style={{
          x,
          y,
          scale,
          filter: dropShadow,
          boxShadow: glowShadow,
          willChange: magnetic ? "transform" : undefined,
        }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        whileHover={magnetic || disabled ? undefined : { scale: 1.05, translateY: -1 }}
        onClick={handleClick}
        {...(restProps as any)}
      >
        {children}
      </motion.button>
    );
  },
);
Button.displayName = "Button";
export { Button, buttonVariants };
