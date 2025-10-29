import { useMemo, useState } from "react";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface RatingStarsProps {
  rating: number;
  max?: number;
  onChange?: (rating: number) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  readOnly?: boolean;
  label?: string;
}

const sizeMap: Record<NonNullable<RatingStarsProps["size"]>, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
};

export const RatingStars = ({
  rating,
  max = 5,
  onChange,
  className,
  size = "md",
  readOnly = false,
  label,
}: RatingStarsProps) => {
  const isInteractive = Boolean(onChange) && !readOnly;
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  const displayValue = useMemo(
    () => (hoveredRating !== null ? hoveredRating : rating),
    [hoveredRating, rating],
  );

  return (
    <div
      className={cn(
        "flex items-center gap-1",
        isInteractive && "cursor-pointer",
        className,
      )}
      role={isInteractive ? "slider" : "img"}
      aria-label={label ?? "Rating"}
      aria-valuemin={isInteractive ? 1 : undefined}
      aria-valuemax={isInteractive ? max : undefined}
      aria-valuenow={isInteractive ? Math.round(rating) : undefined}
    >
      {Array.from({ length: max }, (_, index) => {
        const value = index + 1;
        const isFilled = value <= displayValue;

        return (
          <button
            key={value}
            type="button"
            className={cn(
              "transition-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
              isInteractive ? "rounded-full" : "cursor-default",
            )}
            onClick={isInteractive ? () => onChange?.(value) : undefined}
            onMouseEnter={isInteractive ? () => setHoveredRating(value) : undefined}
            onMouseLeave={isInteractive ? () => setHoveredRating(null) : undefined}
            aria-label={isInteractive ? `Rate ${value} out of ${max}` : undefined}
            tabIndex={isInteractive ? 0 : -1}
          >
            <Star
              className={cn(
                "transition-colors",
                sizeMap[size],
                isFilled ? "fill-primary text-primary" : "text-muted-foreground",
              )}
            />
          </button>
        );
      })}
    </div>
  );
};

export default RatingStars;
