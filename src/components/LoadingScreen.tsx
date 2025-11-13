import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "@/components/Logo";

interface LoadingScreenProps {
  show: boolean;
}

export const LoadingScreen = ({ show }: LoadingScreenProps) => {
  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          role="status"
          aria-live="polite"
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-hidden bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <motion.div
            className="relative"
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{
              scale: [0.95, 1.05, 0.98, 1],
              opacity: 1,
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              repeatType: "mirror",
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <Logo size="lg" showGlow tagline="Building Connections" taglineClassName="tracking-[0.35em] text-muted-foreground" />
          </motion.div>

          <motion.div
            className="mt-10 h-1.5 w-48 overflow-hidden rounded-full bg-muted/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <motion.span
              className="block h-full w-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400"
              initial={{ x: "-100%" }}
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.3, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          <motion.p
            className="mt-8 text-sm font-medium text-muted-foreground"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4, ease: "easeOut" }}
          >
            Preparing your connective experience...
          </motion.p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default LoadingScreen;
