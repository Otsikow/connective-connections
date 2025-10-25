import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  className?: string;
  fallbackPath?: string;
  onBack?: () => void;
  "aria-label"?: string;
}

export function BackButton({ className, fallbackPath = "/", onBack, "aria-label": ariaLabel }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onBack) {
      onBack();
      return;
    }

    // If browser history exists, go back; otherwise navigate to fallback
    if (typeof window !== "undefined" && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn("p-2 hover:bg-muted rounded-full transition-colors", className)}
      aria-label={ariaLabel || "Go back"}
    >
      <ArrowLeft className="w-6 h-6" />
    </button>
  );
}

export default BackButton;
