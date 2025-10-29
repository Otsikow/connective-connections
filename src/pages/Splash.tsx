import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Users } from "lucide-react";

const Splash = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to onboarding after 2.5 seconds
    const timer = setTimeout(() => {
      navigate("/signup");
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8B956] via-[#d9a840] to-[#c99530] flex flex-col items-center justify-center px-6">
      <div className="animate-fade-in">
        {/* App Logo */}
        <div className="flex items-center justify-center mb-6">
          <div className="bg-white rounded-full p-8 shadow-2xl">
            <Users className="w-20 h-20 text-[#E8B956]" />
          </div>
        </div>
        
        {/* App Name */}
        <h1 className="text-5xl font-bold text-white text-center mb-4 tracking-tight">
          Connective
        </h1>
        
        {/* Tagline */}
        <p className="text-xl text-white/90 text-center font-medium tracking-wide">
          Real Friends. Real Connection.
        </p>

        {/* Loading indicator */}
        <div className="flex justify-center mt-12">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Splash;
