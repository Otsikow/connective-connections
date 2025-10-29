import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  tagline?: string;
  taglineClassName?: string;
  showGlow?: boolean;
}

const sizeMap: Record<NonNullable<LogoProps["size"]>, string> = {
  sm: "text-[1.75rem]",
  md: "text-[2.25rem]",
  lg: "text-[2.75rem]",
};

export const Logo = ({
  className,
  size = "md",
  tagline,
  taglineClassName,
  showGlow = true,
}: LogoProps) => {
  return (
    <div className={cn("relative inline-flex flex-col items-start", className)}>
      {showGlow && (
        <div className="pointer-events-none absolute -inset-x-6 -inset-y-4 -z-10 rounded-[2.75rem] bg-gradient-to-r from-amber-400/40 via-yellow-400/25 to-orange-400/35 blur-3xl" />
      )}
      <div className="relative inline-flex items-center rounded-[2.5rem] bg-gradient-to-r from-slate-950/85 via-slate-900/60 to-slate-950/85 px-6 py-3 shadow-[0_22px_55px_rgba(17,24,39,0.55)] ring-1 ring-white/10">
        <span
          className={cn(
            "inline-block bg-gradient-to-b from-[#FFF9C4] via-[#F6C445] to-[#D98F17] bg-clip-text font-black tracking-tight text-transparent drop-shadow-[0_9px_28px_rgba(229,180,74,0.55)]",
            sizeMap[size],
          )}
          style={{
            textShadow:
              "0 12px 28px rgba(229, 180, 74, 0.35), 0 0 14px rgba(255, 239, 186, 0.65), 0 0 2px rgba(255, 255, 255, 0.75)",
          }}
        >
          Connective
        </span>
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
