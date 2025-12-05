import { cn } from "@/lib/utils";
import logo from "@/assets/connective-logo.png";

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
      {/* Brand wordmark glow — warm-orange subtle glow behind letters */}
      {showGlow && (
        <div 
          className="pointer-events-none absolute -inset-x-8 -inset-y-6 -z-10 rounded-[3rem] opacity-80"
          style={{
            background: "radial-gradient(ellipse at center, rgba(255,150,70,0.35) 0%, rgba(255,138,60,0.15) 40%, transparent 70%)",
            filter: "blur(24px)",
            boxShadow: "0 4px 18px rgba(255,150,70,0.25)",
          }}
        />
      )}
      <div className="relative inline-flex items-center">
        <img
          src={logo}
          alt="Connective"
          className={cn(
            "w-auto object-contain transition-transform duration-300 hover:scale-105",
            sizeMap[size]
          )}
          style={{
            filter: showGlow ? "drop-shadow(0 4px 18px rgba(255,150,70,0.25))" : undefined,
          }}
        />
      </div>
      {tagline && (
        <span
          className={cn(
            "mt-2 inline-flex items-center gap-2 text-[0.7rem] font-medium uppercase tracking-[0.3em] text-[#7B7B7B] transition-colors hover:text-[#BDBDBD] sm:font-semibold sm:tracking-[0.45em]",
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
