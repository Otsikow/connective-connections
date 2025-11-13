import { cn } from "@/lib/utils";
import logoImage from "@/assets/connective-logo.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  tagline?: string;
  taglineClassName?: string;
  showGlow?: boolean;
}

const sizeMap: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "h-8",
  md: "h-10",
  lg: "h-14",
};

export const Logo = ({
  className,
  size = "md",
  tagline,
  taglineClassName,
  showGlow = false,
}: LogoProps) => {
  return (
    <div className={cn("relative inline-flex flex-col items-start", className)}>
      {showGlow && (
        <div className="pointer-events-none absolute -inset-x-6 -inset-y-4 -z-10 rounded-[2.75rem] bg-gradient-to-r from-amber-400/40 via-yellow-400/25 to-orange-400/35 blur-3xl" />
      )}
      <div className="relative inline-flex items-center">
        <img
          src={logoImage}
          alt="Connective"
          className={cn("object-contain", sizeMap[size])}
        />
      </div>
      {tagline && (
        <span
          className={cn(
            "mt-2 inline-flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.45em] text-amber-200/80",
            taglineClassName,
          )}
        >
          {tagline}
        </span>
      )}
    </div>
  );
};

export default Logo;
