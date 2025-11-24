import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { cn } from "@/lib/utils";
export const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    userId,
    isLoading,
    signOut,
  } = useSubscription();
  const shouldShowAuthButtons = !userId || isLoading;
  const navButtonClass =
    "relative overflow-hidden rounded-full border border-foreground/10 bg-foreground/[0.04] px-5 text-sm font-semibold text-foreground/90 shadow-[0_16px_38px_-28px_rgba(15,15,15,0.45)] transition-colors duration-300 hover:border-foreground/20 hover:bg-foreground/[0.08] focus-visible:ring-2 focus-visible:ring-offset-1 dark:border-white/10 dark:bg-white/[0.06] dark:text-foreground dark:hover:bg-white/[0.14]";
  return <div className="sticky top-0 z-[60] border-b border-black/5 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/65 dark:border-white/5">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-foreground/80 transition hover:text-foreground">
          <Logo size="sm" tagline="By Connective" taglineClassName="hidden sm:inline-flex text-xs tracking-[0.3em]" />
        </Link>

        <div className="flex items-center gap-3">
          {shouldShowAuthButtons ? (
            <>
              <Button
                variant="outline"
                size="sm"
                className={cn(navButtonClass, "font-semibold")}
                onClick={() => navigate("/login")}
                aria-current={location.pathname === "/login" ? "page" : undefined}
              >
                Sign In
              </Button>
              <Button
                size="sm"
                className={cn(
                  "shadow-[0_20px_48px_-28px_rgba(190,150,80,0.85)] hover:shadow-[0_22px_60px_-30px_rgba(190,150,80,0.95)]",
                  "text-primary-foreground"
                )}
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
              className={cn(navButtonClass, "font-semibold")}
              onClick={signOut}
            >
              Sign Out
            </Button>
          )}

          <ThemeToggle className="relative z-10" />
        </div>
      </div>
    </div>;
};
export default TopBar;