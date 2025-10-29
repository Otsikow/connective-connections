import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/BackButton";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with Back Arrow */}
      <div className="px-4 sm:px-6 py-4">
        <BackButton
          fallbackPath="/"
        />
      </div>

      {/* Welcome Section */}
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="mb-4 text-3xl sm:text-4xl lg:text-5xl font-bold">
            Welcome to Connective
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 px-4">
            Real Friends. Real Connection.
          </p>
          <Button
            onClick={() => navigate("/signup")}
            className="bg-[#E8B956] hover:bg-[#d9a840] text-black rounded-full px-8 h-12 text-base sm:text-lg font-semibold transition-all"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
