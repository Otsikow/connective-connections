import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import onboarding1 from "@/assets/onboarding-1.png";
import onboarding2 from "@/assets/onboarding-2.png";
import onboarding3 from "@/assets/onboarding-3.png";

const slides = [
  {
    image: onboarding1,
    title: "Find genuine friends nearby",
    description: "Connect with real people in your area who share your interests and values. Build authentic friendships that matter.",
  },
  {
    image: onboarding2,
    title: "Join groups that match your vibe",
    description: "Discover communities and groups that align with your passions. Find your tribe and make lasting connections.",
  },
  {
    image: onboarding3,
    title: "Attend events safely & easily",
    description: "Join verified events with confidence. Meet new friends in person through safe, organized gatherings in your area.",
  },
];

const Onboarding = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

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

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-8">
      <div className="w-full max-w-md flex flex-col items-center animate-fade-in">
        <div className="w-full bg-card rounded-3xl shadow-lg p-8 mb-8">
          <img
            src={slides[currentSlide].image}
            alt={slides[currentSlide].title}
            className="w-full h-auto mb-6 rounded-2xl"
          />
          <h1 className="text-2xl font-bold text-foreground mb-4 text-center">
            {slides[currentSlide].title}
          </h1>
          <p className="text-muted-foreground text-center leading-relaxed">
            {slides[currentSlide].description}
          </p>
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
