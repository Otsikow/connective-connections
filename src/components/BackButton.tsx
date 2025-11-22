import { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackButtonProps extends ButtonProps {
  fallbackPath?: string;
  iconClassName?: string;
  ariaLabel?: string;
}

const BackButton = ({
  fallbackPath = "/",
  iconClassName,
  className,
  children,
  onClick,
  size,
  variant = "ghost",
  ariaLabel,
  ...props
}: BackButtonProps) => {
  const navigate = useNavigate();
  const content = children ?? "Back";
  const computedAriaLabel =
    ariaLabel ?? (typeof content === "string" ? content : "Go back");

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    // Try to go back in history, with fallback to specified path
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size ?? "sm"}
      className={cn("mt-4 gap-2 rounded-full px-4", className)}
      onClick={handleClick}
      aria-label={computedAriaLabel}
      {...props}
    >
      <ArrowLeft aria-hidden="true" className={cn("h-4 w-4", iconClassName)} />
      {content}
    </Button>
  );
};

export default BackButton;
