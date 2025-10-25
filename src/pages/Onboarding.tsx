import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      navigate("/signup");
    }
  };

  const handleSkip = () => {
    navigate("/signup");
  };

  if (showSplash) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <div className="flex flex-col items-center animate-fade-in">
          <div className="w-20 h-20 rounded-2xl bg-[#E8B956] mb-6 shadow-md flex items-center justify-center text-charcoal text-2xl font-bold">
            C
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Connective</h1>
          <p className="mt-2 text-muted-foreground">Real Friends. Real Connection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-8">
      <div className="absolute top-6 left-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>
      <div className="w-full max-w-md flex flex-col items-center animate-fade-in">
        <div className="w-full bg-card rounded-3xl shadow-lg p-8 mb-8">
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-auto mb-6 rounded-2xl"
          />
          <h1 className="text-2xl font-bold text-foreground mb-2 text-center">
            {slides[currentSlide].title}
          </h1>
        </div>

        <Button
          onClick={handleNext}
          className="w-full max-w-md h-14 text-lg font-semibold rounded-full bg-[#E8B956] hover:bg-[#d9a840] text-charcoal shadow-md transition-all"
        >
          Continue
        </Button>

        {currentSlide === slides.length - 1 && (
          <Button
            onClick={handleSkip}
            variant="ghost"
            className="mt-4 text-foreground"
          >
            Skip
          </Button>
        )}

        <div className="flex gap-2 mt-6">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide
                  ? "w-8 bg-[#E8B956]"
                  : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
