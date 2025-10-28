import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="fixed top-6 right-6 z-50">
      <motion.button
        onClick={toggleTheme}
        className="relative flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle theme"
      >
        {/* Animated Background Gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10"
          animate={{
            x: isDark ? "100%" : "-100%",
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {/* Icons Container */}
        <div className="relative flex items-center gap-2">
          {/* Sun Icon */}
          <motion.div
            animate={{
              scale: isDark ? 0.5 : 1,
              opacity: isDark ? 0.3 : 1,
              rotate: isDark ? 180 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Sun className="w-5 h-5 text-secondary" />
          </motion.div>

          {/* Animated Toggle Track */}
          <div className="relative w-14 h-7 rounded-full bg-muted">
            <motion.div
              className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent shadow-md flex items-center justify-center"
              animate={{
                x: isDark ? 28 : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            >
              {/* Inner glow effect */}
              <motion.div
                className="w-3 h-3 rounded-full bg-white/40"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>

          {/* Moon Icon */}
          <motion.div
            animate={{
              scale: isDark ? 1 : 0.5,
              opacity: isDark ? 1 : 0.3,
              rotate: isDark ? 0 : -180,
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <Moon className="w-5 h-5 text-primary" />
          </motion.div>
        </div>

        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{
            x: "100%",
            transition: { duration: 0.6, ease: "easeInOut" },
          }}
        />
      </motion.button>
    </div>
  );
}
