import { useNavigate } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  Star,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Users,
  MessageCircle,
  Sparkles,
  UserCheck,
  HeadphonesIcon,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBackground from "@/assets/hero-background.jpg";
import coffeeLover from "@/assets/coffee-lover.jpg";
import bookChat from "@/assets/book-chat.jpg";
import fitnessPartner from "@/assets/fitness-partner.jpg";
import coffeeCrawl from "@/assets/coffee-crawl.jpg";
import cookingClass from "@/assets/cooking-class.jpg";
import memberSarah from "@/assets/member-sarah.jpg";
import memberDavid from "@/assets/member-david.jpg";
import { useTheme } from "@/components/ThemeProvider";
import { cn } from "@/lib/utils";

const Index = () => {
  const navigate = useNavigate();
  usePageTitle("Connective - Curated Communities & Events");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const heroOverlayGradient = isDark
    ? "linear-gradient(rgba(11, 14, 23, 0.9) 0%, rgba(11, 14, 23, 0.6) 50%, rgba(11, 14, 23, 1) 100%)"
    : "linear-gradient(rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.8) 50%, rgba(241, 245, 249, 0.95) 100%)";
  const friendFinderOverlay = isDark
    ? "linear-gradient(0deg, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.1) 100%)"
    : "linear-gradient(0deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.25) 100%)";
  const secondaryTextClass = isDark ? "text-slate-400" : "text-slate-600";
  const surfaceClass = isDark
    ? "rounded-xl border border-white/10 bg-white/5"
    : "rounded-xl border border-slate-200 bg-white shadow-sm";
  const overlayTextClass = isDark ? "text-white" : "text-slate-900";
  const brandTitleClass = cn(
    "text-4xl font-extrabold",
    isDark
      ? "text-[hsl(var(--primary))] drop-shadow-[0_0_10px_rgba(248,213,126,0.6)]"
      : "text-[hsl(var(--primary-foreground))]",
  );
  const outlineButtonClass = cn(
    "w-full sm:w-auto",
    isDark
      ? "border-slate-600 text-white hover:bg-white/10"
      : "border-slate-300 text-slate-900 hover:bg-slate-100",
  );
  const joinOutlineButtonClass = cn(
    "w-full",
    isDark
      ? "border-slate-600 text-white hover:bg-white/10"
      : "border-slate-300 text-slate-900 hover:bg-slate-100",
  );
  const joinSectionBackground = isDark
    ? "linear-gradient(to top, rgba(125, 92, 255, 0.2), rgb(11, 14, 23))"
    : "linear-gradient(to top, rgba(125, 92, 255, 0.15), rgb(248, 250, 252))";

  return (
    <div
      className={cn(
        "relative w-full min-h-screen bg-gradient-to-b transition-colors duration-300",
        isDark
          ? "from-slate-950 via-slate-950 to-black text-white"
          : "from-white via-slate-50 to-slate-100 text-slate-900",
      )}
    >
      {/* Hero Section */}
      <div
        className="relative min-h-screen flex items-center justify-center p-4 text-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `${heroOverlayGradient}, url(${heroBackground})` }}
      >
        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className={brandTitleClass}>
            Connective
          </h1>
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">
              Elevate your connections experience with curated communities and unforgettable events.
            </h2>
            <p className={cn("text-base sm:text-lg font-medium", secondaryTextClass)}>
              Where real friendships and meaningful experiences begin.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={() => navigate("/signup")}
              className="w-full sm:w-auto bg-[#F8D57E] hover:bg-[#e8c56e] text-slate-950 font-bold shadow-[0_0_10px_rgba(248,213,126,0.4),0_0_20px_rgba(248,213,126,0.3),0_0_30px_rgba(248,213,126,0.2)] hover:scale-105 transition-transform"
            >
              Start your membership
            </Button>
            <Button
              onClick={() => navigate("/host-dashboard")}
              variant="outline"
              className={outlineButtonClass}
            >
              Host an experience
            </Button>
          </div>
        </div>
      </div>

      {/* Friend Finder Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold">Find Real Friends Near You</h2>
          <p className={cn("text-base max-w-xl mx-auto", secondaryTextClass)}>
            Discover people who share your energy, interests, and location. Connect effortlessly for real-life meetups.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            className={cn(
              "relative rounded-xl overflow-hidden aspect-[3/4] bg-cover bg-center border",
              isDark ? "border-white/10" : "border-slate-200",
            )}
            style={{ backgroundImage: `${friendFinderOverlay}, url(${coffeeLover})` }}
          >
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className={cn("text-lg font-bold", overlayTextClass)}>
                Meet Coffee Lovers in Your City ☕
              </p>
            </div>
          </div>
          <div
            className={cn(
              "relative rounded-xl overflow-hidden aspect-[3/4] bg-cover bg-center border",
              isDark ? "border-white/10" : "border-slate-200",
            )}
            style={{ backgroundImage: `${friendFinderOverlay}, url(${bookChat})` }}
          >
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className={cn("text-lg font-bold", overlayTextClass)}>
                Join a Book Chat in Your Neighborhood 📚
              </p>
            </div>
          </div>
          <div
            className={cn(
              "relative rounded-xl overflow-hidden aspect-[3/4] bg-cover bg-center border",
              isDark ? "border-white/10" : "border-slate-200",
            )}
            style={{ backgroundImage: `${friendFinderOverlay}, url(${fitnessPartner})` }}
          >
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className={cn("text-lg font-bold", overlayTextClass)}>
                Find a Fitness Partner This Weekend 🏃
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button
            onClick={() => navigate("/friend-finder")}
            className="bg-[#F8D57E] hover:bg-[#e8c56e] text-slate-950 font-bold shadow-[0_0_10px_rgba(248,213,126,0.4)] hover:scale-105 transition-transform"
          >
            Try Friend Finder
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-12 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 rounded-full flex items-center justify-center border border-[#F8D57E] shadow-[0_0_8px_rgba(248,213,126,0.2)]">
              <ShieldCheck className="text-[#F8D57E] h-6 w-6" />
            </div>
            <p className={cn("text-sm font-medium", secondaryTextClass)}>Verified</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 rounded-full flex items-center justify-center border border-[#F8D57E] shadow-[0_0_8px_rgba(248,213,126,0.2)]">
              <MapPin className="text-[#F8D57E] h-6 w-6" />
            </div>
            <p className={cn("text-sm font-medium", secondaryTextClass)}>Nearby</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 rounded-full flex items-center justify-center border border-[#F8D57E] shadow-[0_0_8px_rgba(248,213,126,0.2)]">
              <CheckCircle2 className="text-[#F8D57E] h-6 w-6" />
            </div>
            <p className={cn("text-sm font-medium", secondaryTextClass)}>Safe Connections</p>
          </div>
        </div>
      </div>

      {/* Feature Grid Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className={cn("flex flex-col gap-4 p-6", surfaceClass)}>
            <Sparkles className="text-[#F8D57E] h-8 w-8" />
            <h3 className="text-xl font-bold">World-Class Events</h3>
            <p className={secondaryTextClass}>
              Access exclusive gatherings curated by experts and community leaders.
            </p>
          </div>
          <div className={cn("flex flex-col gap-4 p-6", surfaceClass)}>
            <Users className="text-[#F8D57E] h-8 w-8" />
            <h3 className="text-xl font-bold">Find Your Circle</h3>
            <p className={secondaryTextClass}>
              Connect with like-minded people in communities based on shared interests.
            </p>
          </div>
          <div className={cn("flex flex-col gap-4 p-6", surfaceClass)}>
            <MessageCircle className="text-[#F8D57E] h-8 w-8" />
            <h3 className="text-xl font-bold">Always-On Chats</h3>
            <p className={secondaryTextClass}>
              Stay connected with your groups and friends through private chats.
            </p>
          </div>
          <div className={cn("flex flex-col gap-4 p-6", surfaceClass)}>
            <UserCheck className="text-[#F8D57E] h-8 w-8" />
            <h3 className="text-xl font-bold">Launch Private Groups</h3>
            <p className={secondaryTextClass}>Create your own space for your passions, projects, or friends.</p>
          </div>
        </div>
      </div>

      {/* Trust & Safety Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Your Trust and Safety is Our Priority</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
          <div className="flex flex-col items-center gap-3">
            <div
              className={cn(
                "h-16 w-16 rounded-full flex items-center justify-center border-2",
                isDark ? "border-[#F8D57E]/50 bg-[#F8D57E]/10" : "border-[#F8D57E]/40 bg-[#F8D57E]/20",
              )}
            >
              <HeadphonesIcon className="text-[#F8D57E] h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold mt-2">Concierge Onboarding</h3>
            <p className={cn("text-sm", secondaryTextClass)}>
              A personalized setup experience to ensure you feel welcome and ready.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div
              className={cn(
                "h-16 w-16 rounded-full flex items-center justify-center border-2",
                isDark ? "border-[#F8D57E]/50 bg-[#F8D57E]/10" : "border-[#F8D57E]/40 bg-[#F8D57E]/20",
              )}
            >
              <ShieldCheck className="text-[#F8D57E] h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold mt-2">Verified Hosts</h3>
            <p className={cn("text-sm", secondaryTextClass)}>
              All event hosts are vetted to guarantee high-quality, safe experiences.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div
              className={cn(
                "h-16 w-16 rounded-full flex items-center justify-center border-2",
                isDark ? "border-[#F8D57E]/50 bg-[#F8D57E]/10" : "border-[#F8D57E]/40 bg-[#F8D57E]/20",
              )}
            >
              <MessageSquare className="text-[#F8D57E] h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold mt-2">Guided Conversations</h3>
            <p className={cn("text-sm", secondaryTextClass)}>
              Tools and prompts to help break the ice and foster deeper connections.
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Experiences Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Upcoming Experiences</h2>
        <div className="flex flex-col gap-6">
          <div className={cn("flex flex-col gap-4 p-4", surfaceClass)}>
            <img src={coffeeCrawl} alt="Barista making latte art" className="h-40 w-full rounded-lg object-cover" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Neighborhood Coffee Crawl ☕</h3>
              <div className={cn("flex items-center gap-2 text-sm", secondaryTextClass)}>
                <Star className="text-[#F8D57E] h-4 w-4 fill-current" />
                <span>4.9 (120 reviews)</span>
                <span className="mx-1">·</span>
                <span>Downtown</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#F8D57E]/20 px-3 py-1 text-xs font-medium text-[#F8D57E]">Social</span>
                <span className="rounded-full bg-[#F8D57E]/20 px-3 py-1 text-xs font-medium text-[#F8D57E]">Food & Drink</span>
              </div>
            </div>
            <Button variant="secondary" className="w-full">
              View Details
            </Button>
          </div>

          <div className={cn("flex flex-col gap-4 p-4", surfaceClass)}>
            <img src={cookingClass} alt="Chef plating pasta dish" className="h-40 w-full rounded-lg object-cover" />
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Cooking Class: Italian Cuisine 🍝</h3>
              <div className={cn("flex items-center gap-2 text-sm", secondaryTextClass)}>
                <Star className="text-[#F8D57E] h-4 w-4 fill-current" />
                <span>5.0 (98 reviews)</span>
                <span className="mx-1">·</span>
                <span>North End</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#F8D57E]/20 px-3 py-1 text-xs font-medium text-[#F8D57E]">Workshop</span>
                <span className="rounded-full bg-[#F8D57E]/20 px-3 py-1 text-xs font-medium text-[#F8D57E]">Food & Drink</span>
              </div>
            </div>
            <Button variant="secondary" className="w-full">
              View Details
            </Button>
          </div>
        </div>
      </div>

      {/* Member Stories Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Member Stories</h2>
        <div className="flex flex-col gap-8">
          <div className={cn("p-6 text-center", surfaceClass)}>
            <img src={memberSarah} alt="Portrait of Sarah" className="mx-auto h-16 w-16 rounded-full object-cover mb-4" />
            <p className={cn("italic", secondaryTextClass)}>
              "I've met some of my closest friends through Connective. The events are always top-notch and attract the most interesting people."
            </p>
            <p className="mt-4 font-bold">- Sarah L.</p>
          </div>
          <div className={cn("p-6 text-center", surfaceClass)}>
            <img src={memberDavid} alt="Portrait of David" className="mx-auto h-16 w-16 rounded-full object-cover mb-4" />
            <p className={cn("italic", secondaryTextClass)}>
              "As a busy professional, it's hard to make meaningful connections. This app changed everything. It's more than just networking; it's about real friendship."
            </p>
            <p className="mt-4 font-bold">- David Chen</p>
          </div>
        </div>
      </div>

      {/* Join Section */}
      <div className="px-4 pt-24 pb-16 text-center" style={{ background: joinSectionBackground }}>
        <div className="max-w-lg mx-auto space-y-6">
          <h2 className="text-3xl font-bold leading-tight">
            Join the most intentional community of leaders, innovators, and connectors.
          </h2>
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => navigate("/signup")}
              className="w-full bg-[#F8D57E] hover:bg-[#e8c56e] text-slate-950 font-bold shadow-[0_0_10px_rgba(248,213,126,0.4)] hover:scale-105 transition-transform"
            >
              Become a member
            </Button>
            <Button
              onClick={() => navigate("/login")}
              variant="outline"
              className={joinOutlineButtonClass}
            >
              I already have an account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
