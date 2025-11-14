import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTheme } from "./ThemeProvider";
type ThemeToggleProps = {
  className?: string;
};
export function ThemeToggle({
  className
}: ThemeToggleProps) {
  const {
    theme,
    toggleTheme
  } = useTheme();
  const isDark = theme === "dark";
  return <motion.button onClick={toggleTheme} className={cn("relative flex items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm shadow-lg transition-all duration-300 hover:shadow-xl", className)} whileHover={{
    scale: 1.05
  }} whileTap={{
    scale: 0.95
  }} aria-label="Toggle theme">
      <motion.div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10" animate={{
      x: isDark ? "100%" : "-100%"
    }} transition={{
      duration: 0.5,
      ease: "easeInOut"
    }} />

      <div className="relative flex items-center gap-2">
        <motion.div animate={{
        scale: isDark ? 0.5 : 1,
        opacity: isDark ? 0.3 : 1,
        rotate: isDark ? 180 : 0
      }} transition={{
        duration: 0.3,
        ease: "easeInOut"
      }}>
          <Sun className="h-5 w-5 text-secondary" />
        </motion.div>

        <div className="relative h-6 w-12 rounded-full bg-muted">
          <motion.div className="absolute top-0.5 left-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-md" animate={{
          x: isDark ? 22 : 0
        }} transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}>
            <motion.div className="h-2.5 w-2.5 rounded-full bg-white/40" animate={{
            scale: [1, 1.2, 1]
          }} transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }} />
          </motion.div>
        </div>

        <motion.div animate={{
        scale: isDark ? 1 : 0.5,
        opacity: isDark ? 1 : 0.3,
        rotate: isDark ? 0 : -180
      }} transition={{
        duration: 0.3,
        ease: "easeInOut"
      }}>
          <Moon className="h-5 w-5 text-primary" />
        </motion.div>
      </div>

      
    </motion.button>;
}