import { motion } from "framer-motion";
import { triggerHaptic } from "@/lib/haptics";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  icon: React.ReactNode;
  label?: string;
  onClick: () => void;
  className?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
}

const positionClasses = {
  "bottom-right": "bottom-24 right-6",
  "bottom-left": "bottom-24 left-6",
  "top-right": "top-6 right-6",
  "top-left": "top-6 left-6",
};

export const FloatingActionButton = ({
  icon,
  label,
  onClick,
  className,
  position = "bottom-right",
}: FloatingActionButtonProps) => {
  const handleClick = () => {
    triggerHaptic("medium");
    onClick();
  };

  return (
    <motion.button
      onClick={handleClick}
      className={cn(
        "fixed z-40 flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--accent)))] px-4 py-3 font-medium text-[hsl(var(--primary-foreground))] shadow-[0_24px_60px_-32px_hsl(var(--accent)_/_0.55)] transition-shadow hover:shadow-[0_28px_70px_-30px_hsl(var(--accent)_/_0.65)]",
        positionClasses[position],
        className
      )}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 17,
      }}
    >
      <motion.div
        animate={{
          rotate: [0, 10, -10, 10, 0],
        }}
        transition={{
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: 3,
        }}
      >
        {icon}
      </motion.div>
      {label && <span className="text-sm">{label}</span>}
    </motion.button>
  );
};
