import { Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";

type ThemeToggleProps = {
  className?: string;
  variant?: "default" | "compact";
};

export function ThemeToggle({
  className,
  variant = "default"
}: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  // Compact variant - just icon toggle
  if (variant === "compact") {
    return (
      <motion.button
        onClick={toggleTheme}
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-all duration-300 hover:shadow-lg",
          className
        )}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={isDark ? "moon" : "sun"}
            initial={{ scale: 0, rotate: -90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 90, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            {isDark ? (
              <Moon className="h-5 w-5 text-primary" />
            ) : (
              <Sun className="h-5 w-5 text-amber-500" />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.button>
    );
  }

  // Default variant - full toggle with slider
  return (
    <motion.button
      onClick={toggleTheme}
      className={cn(
        "relative flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm shadow-md transition-all duration-300 hover:shadow-lg",
        "dark:shadow-[0_4px_20px_rgba(0,0,0,0.3)]",
        "light:shadow-[0_4px_12px_rgba(0,0,0,0.08)]",
        className
      )}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative flex items-center gap-2">
        {/* Sun icon */}
        <motion.div
          animate={{
            scale: isDark ? 0.7 : 1,
            opacity: isDark ? 0.4 : 1,
          }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <Sun className={cn(
            "h-4 w-4 transition-colors",
            isDark ? "text-muted-foreground" : "text-amber-500"
          )} />
        </motion.div>

        {/* Toggle track */}
        <div className={cn(
          "relative h-6 w-11 rounded-full transition-colors duration-300",
          isDark ? "bg-muted" : "bg-amber-100 dark:bg-muted"
        )}>
          {/* Toggle knob */}
          <motion.div
            className={cn(
              "absolute top-0.5 left-0.5 flex h-5 w-5 items-center justify-center rounded-full shadow-md",
              "bg-gradient-to-br from-primary to-accent"
            )}
            animate={{ x: isDark ? 20 : 0 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30
            }}
          >
            {/* Animated inner glow */}
            <motion.div
              className="h-2 w-2 rounded-full bg-white/50"
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </div>

        {/* Moon icon */}
        <motion.div
          animate={{
            scale: isDark ? 1 : 0.7,
            opacity: isDark ? 1 : 0.4,
          }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          <Moon className={cn(
            "h-4 w-4 transition-colors",
            isDark ? "text-primary" : "text-muted-foreground"
          )} />
        </motion.div>
      </div>
    </motion.button>
  );
}