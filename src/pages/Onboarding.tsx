import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { triggerHaptic } from "@/lib/haptics";
import { ArrowLeft } from "lucide-react";

import onboarding1 from "@/assets/onboarding-1.png";
import onboarding2 from "@/assets/onboarding-2.png";
import onboarding3 from "@/assets/onboarding-3.png";

const slides = [
  {
    image: onboarding1,
    title: "Find genuine friends nearby.",
  },
  {
    image: onboarding2,
    title: "Join groups that match your vibe.",
  },
  {
    image: onboarding3,
    title: "Attend events safely & easily.",
  },
];

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), 1500);
    return () => clearTimeout(t);
  }, []);

  const handleNext = () => {
    triggerHaptic("light");
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      triggerHaptic("success");
      navigate("/signup");
    }
  };

  const handleSkip = () => {
    triggerHaptic("light");
    navigate("/signup");
  };

  if (showSplash) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <motion.div
          className="flex flex-col items-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div
            className="w-20 h-20 rounded-2xl bg-[#E8B956] mb-6 shadow-md flex items-center justify-center text-charcoal text-2xl font-bold"
            animate={{
              rotate: [0, -10, 10, -10, 0],
              scale: [1, 1.05, 1.05, 1.05, 1],
            }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            C
          </motion.div>
          <motion.h1
            className="text-3xl font-extrabold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            Connective
          </motion.h1>
          <motion.p
            className="mt-2 text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            Real Friends. Real Connection.
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-8">
      {/* Back Button */}
      <div className="absolute top-6 left-6">
        <button
          onClick={() => {
            triggerHaptic("light");
            navigate(-1);
          }}
          className="p-2 hover:bg-muted rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      <motion.div
        className="w-full max-w-md flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="w-full bg-card rounded-3xl shadow-lg p-8 mb-8"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
          >
            <motion.img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-full h-auto mb-6 rounded-2xl"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
            />
            <motion.h1
              className="text-2xl font-bold text-foreground mb-2 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              {slides[currentSlide].title}
            </motion.h1>
          </motion.div>
        </AnimatePresence>

        <Button
          onClick={handleNext}
          className="w-full max-w-md h-14 text-lg font-semibold rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal shadow-md"
        >
          {currentSlide === slides.length - 1 ? "Get Started" : "Continue"}
        </Button>

        {currentSlide === slides.length - 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Button
              onClick={handleSkip}
              variant="ghost"
              className="mt-4 text-foreground"
            >
              Skip
            </Button>
          </motion.div>
        )}

        <div className="flex gap-2 mt-6">
          {slides.map((_, index) => (
            <motion.div
              key={index}
              className={`h-2 rounded-full ${
                index === currentSlide ? "bg-[#E8B956]" : "bg-muted"
              }`}
              animate={{
                width: index === currentSlide ? 32 : 8,
              }}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
