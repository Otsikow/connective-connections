import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with Back Arrow */}
      <div className="px-6 py-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-muted rounded-full"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>

      {/* Welcome Section */}
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">Welcome to Connective</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Real Friends. Real Connection.
          </p>
          <Button
            onClick={() => navigate("/onboarding")}
            className="bg-[#E8B956] hover:bg-[#d9a840] text-charcoal rounded-full px-8"
          >
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
