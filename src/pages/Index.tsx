import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="px-6 py-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-muted rounded-full">
          <ArrowLeft className="w-6 h-6" />
        </button>
      </div>
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">Welcome to Connective</h1>
          <p className="text-xl text-muted-foreground mb-8">Find genuine friends and meaningful connections</p>
          <Button onClick={() => navigate("/onboarding")} className="bg-[#E8B956] hover:bg-[#d9a840] text-charcoal">
            Get Started
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
