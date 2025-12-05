import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { cn } from "@/lib/utils";

export const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { userId, isLoading, signOut } = useSubscription();
  const shouldShowAuthButtons = !userId || isLoading;

  const navButtonClass =
    "relative overflow-hidden rounded-full border border-border bg-card/50 px-5 text-sm font-semibold text-foreground/90 shadow-[var(--shadow-soft)] transition-colors duration-300 hover:border-border hover:bg-card/80 focus-visible:ring-2 focus-visible:ring-offset-1";

  return (
    <header className="sticky top-0 z-[60] border-b border-border/50 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/65">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        
        {/* Logo */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/80 transition hover:text-foreground"
        >
          <Logo
            size="sm"
            tagline="By Connective"
            taglineClassName="hidden sm:inline-flex text-xs tracking-[0.3em]"
          />
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3">
          {shouldShowAuthButtons ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className={cn(navButtonClass)}
                onClick={() => navigate("/login")}
                aria-current={location.pathname === "/login" ? "page" : undefined}
              >
                Sign In
              </Button>

              <Button
                size="sm"
                className="rounded-full bg-gradient-to-r from-[#FF8A3C] to-[#FFB377] px-5 font-semibold text-white shadow-lg shadow-[rgba(255,138,60,0.3)] transition-all hover:shadow-[rgba(255,138,60,0.5)]"
                onClick={() => navigate("/signup")}
                aria-current={location.pathname === "/signup" ? "page" : undefined}
              >
                Join Now
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className={cn(navButtonClass)}
              onClick={signOut}
            >
              Sign Out
            </Button>
          )}

          {/* Theme Switch */}
          <ThemeToggle className="relative z-10" />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
