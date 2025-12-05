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
    "relative overflow-hidden rounded-full border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.04)] px-5 text-sm font-semibold text-[#BDBDBD] shadow-card transition-all duration-300 hover:border-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.08)] hover:text-white focus-visible:ring-2 focus-visible:ring-[#FF8A3C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]";
  
  return (
    <header className="nav-connective sticky top-0 z-[60] border-b border-[rgba(255,255,255,0.06)] bg-[#0C0C0C]/90 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0C0C0C]/80">
      {/* Subtle gradient line at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,138,60,0.2)] to-transparent" />
      
      <div className="mx-auto flex h-[72px] w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#BDBDBD] transition-colors hover:text-white"
        >
          <Logo 
            size="sm" 
            tagline="By Connective" 
            taglineClassName="hidden sm:inline-flex text-xs tracking-[0.3em] text-[#7B7B7B]" 
          />
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
                className="btn-magnetic-glow rounded-full bg-gradient-to-r from-[#FF8A3C] to-[#FFB377] px-5 font-semibold text-white shadow-lg shadow-[rgba(255,138,60,0.3)] transition-all hover:shadow-[rgba(255,138,60,0.5)]"
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
    </header>
  );
};

export default TopBar;