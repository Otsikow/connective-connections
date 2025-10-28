import { MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackButtonProps extends Omit<ButtonProps, "onClick"> {
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

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    const hasHistory = typeof window !== "undefined" && window.history.length > 1;

    if (hasHistory) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size ?? (children ? "default" : "icon")}
      className={cn("rounded-full", className)}
      onClick={handleClick}
      aria-label={ariaLabel ?? (typeof children === "string" ? children : "Go back")}
      {...props}
    >
      <ArrowLeft className={cn(children ? "h-4 w-4" : "h-5 w-5", iconClassName)} />
      {children}
    </Button>
  );
};

export default BackButton;
