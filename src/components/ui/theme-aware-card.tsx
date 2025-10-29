import { cn } from "@/lib/utils";
import { useTheme } from "@/components/ThemeProvider";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ThemeAwareCardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export function ThemeAwareCard({
  children,
  className,
  hoverable = false,
}: ThemeAwareCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      className={cn(
        "rounded-lg border bg-card text-card-foreground transition-all duration-300",
        isDark && "shadow-lg shadow-black/20",
        hoverable &&
          "cursor-pointer hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]",
        className
      )}
      whileHover={hoverable ? { y: -4 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}
