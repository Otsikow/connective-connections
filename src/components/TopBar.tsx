import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useSubscription } from "@/hooks/useSubscription";

export const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, isLoading } = useSubscription();

  const shouldShowAuthButtons = !userId;

  return (
    <div className="sticky top-0 z-[60] border-b border-white/5 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/80 transition hover:text-foreground"
        >
          <Logo size="sm" tagline="By Connective" taglineClassName="hidden sm:inline-flex text-xs tracking-[0.3em]" />
        </Link>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <Skeleton className="h-10 w-28 rounded-full" />
          ) : shouldShowAuthButtons ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
                aria-current={location.pathname === "/login" ? "page" : undefined}
              >
                Sign In
              </Button>
              <Button
                size="sm"
                onClick={() => navigate("/signup")}
                aria-current={location.pathname === "/signup" ? "page" : undefined}
              >
                Join Now
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(location.pathname === "/profile" ? "/home" : "/profile")}
            >
              {location.pathname === "/profile" ? "Home" : "Profile"}
            </Button>
          )}

          <ThemeToggle className="relative z-10" />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
