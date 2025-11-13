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
  HeartHandshake,
  CalendarCheck,
  Smile,
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
    ? "linear-gradient(rgba(11, 14, 23, 0.92) 0%, rgba(11, 14, 23, 0.75) 40%, rgba(11, 14, 23, 0.92) 100%)"
    : "linear-gradient(rgba(255, 255, 255, 0.94) 0%, rgba(248, 250, 252, 0.82) 40%, rgba(241, 245, 249, 0.94) 100%)";
  const friendFinderOverlay = isDark
    ? "linear-gradient(0deg, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.1) 100%)"
    : "linear-gradient(0deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0.25) 100%)";
  const secondaryTextClass = isDark ? "text-slate-400" : "text-slate-600";
  const surfaceClass = isDark
    ? "rounded-xl border border-white/10 bg-white/5"
    : "rounded-xl border border-slate-200 bg-white shadow-sm";
  const overlayTextClass = isDark ? "text-white" : "text-slate-900";
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
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#F8D57E]/20 px-4 py-1 text-sm font-semibold text-[#F8D57E] shadow-sm">
              <HeartHandshake className="h-4 w-4" />
              Made for building real friendships
            </div>
            <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">
              Find friends who feel like your people.
            </h1>
            <p className={cn("text-base sm:text-lg font-medium", secondaryTextClass)}>
              Connective introduces you to nearby people ready for meaningful, lasting friendship—then gives you the tools and meetups to make it real.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[auto_auto] justify-center">
            <Button
              onClick={() => navigate("/signup")}
              className="w-full sm:w-auto bg-[#F8D57E] hover:bg-[#e8c56e] text-slate-950 font-bold shadow-[0_0_10px_rgba(248,213,126,0.4),0_0_20px_rgba(248,213,126,0.3),0_0_30px_rgba(248,213,126,0.2)] hover:scale-105 transition-transform"
            >
              Start meeting friends
            </Button>
            <Button
              onClick={() => navigate("/friend-finder")}
              variant="outline"
              className={outlineButtonClass}
            >
              See how matching works
            </Button>
          </div>
          <div
            className={cn(
              "mx-auto flex flex-col gap-4 rounded-2xl px-6 py-5 sm:flex-row sm:items-center sm:gap-8",
              isDark ? "bg-white/5 border border-white/10" : "bg-white/80 border border-white shadow-lg",
            )}
          >
            <div className="flex items-center gap-3">
              <Smile className="h-8 w-8 text-[#F8D57E]" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-[#F8D57E]">Friendship outcomes</p>
                <p className="text-lg font-bold">92% of members meet someone they hang out with monthly</p>
              </div>
            </div>
            <div className={cn("text-sm", secondaryTextClass)}>
              Every connection is vetted, safe, and designed to move offline fast.
            </div>
          </div>
        </div>
      </div>

      {/* Friend Finder Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold">We help you make friends that last</h2>
          <p className={cn("text-base max-w-2xl mx-auto", secondaryTextClass)}>
            Share who you are, get introduced to people close by, and join small-group hangouts that make it easy to turn a hello into a genuine friendship.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className={cn("p-6 text-left space-y-3", surfaceClass)}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F8D57E]/20 text-[#F8D57E]">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold">Tell us about your vibe</h3>
            <p className={secondaryTextClass}>
              Build a rich profile with interests, social energy, and the kind of friendships you are looking for.
            </p>
          </div>
          <div className={cn("p-6 text-left space-y-3", surfaceClass)}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F8D57E]/20 text-[#F8D57E]">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold">Match with nearby friends</h3>
            <p className={secondaryTextClass}>
              Our matcher introduces you to people who share your interests, availability, and friendship goals.
            </p>
          </div>
          <div className={cn("p-6 text-left space-y-3", surfaceClass)}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F8D57E]/20 text-[#F8D57E]">
              <CalendarCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold">Meet up with confidence</h3>
            <p className={secondaryTextClass}>
              Join small hangouts or one-on-one meetups with icebreakers, safety tools, and check-ins built in.
            </p>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            className={cn(
              "relative rounded-xl overflow-hidden aspect-[3/4] bg-cover bg-center border",
              isDark ? "border-white/10" : "border-slate-200",
            )}
            style={{ backgroundImage: `${friendFinderOverlay}, url(${coffeeLover})` }}
          >
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className={cn("text-lg font-semibold", overlayTextClass)}>
                Brew up a coffee buddy date ☕
              </p>
              <p className={cn("text-sm", overlayTextClass)}>14 locals matched for café hangs this week.</p>
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
              <p className={cn("text-lg font-semibold", overlayTextClass)}>
                Find your next book club 📚
              </p>
              <p className={cn("text-sm", overlayTextClass)}>Join 6 members discussing fresh reads nearby.</p>
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
              <p className={cn("text-lg font-semibold", overlayTextClass)}>
                Link up with a workout partner 🏃
              </p>
              <p className={cn("text-sm", overlayTextClass)}>Plan a weekend trail run or gym session together.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center mt-10">
          <Button
            onClick={() => navigate("/friend-finder")}
            className="bg-[#F8D57E] hover:bg-[#e8c56e] text-slate-950 font-bold shadow-[0_0_10px_rgba(248,213,126,0.4)] hover:scale-105 transition-transform"
          >
            Try Friend Finder
          </Button>
          <Button onClick={() => navigate("/events")} variant="outline" className={outlineButtonClass}>
            Browse local hangouts
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-12 text-center sm:grid-cols-3">
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 rounded-full flex items-center justify-center border border-[#F8D57E] shadow-[0_0_8px_rgba(248,213,126,0.2)]">
              <ShieldCheck className="text-[#F8D57E] h-6 w-6" />
            </div>
            <p className={cn("text-sm font-medium", secondaryTextClass)}>Verified members & hosts</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 rounded-full flex items-center justify-center border border-[#F8D57E] shadow-[0_0_8px_rgba(248,213,126,0.2)]">
              <MapPin className="text-[#F8D57E] h-6 w-6" />
            </div>
            <p className={cn("text-sm font-medium", secondaryTextClass)}>Matches within 15 minutes of you</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 rounded-full flex items-center justify-center border border-[#F8D57E] shadow-[0_0_8px_rgba(248,213,126,0.2)]">
              <CheckCircle2 className="text-[#F8D57E] h-6 w-6" />
            </div>
            <p className={cn("text-sm font-medium", secondaryTextClass)}>Guided intros that feel natural</p>
          </div>
        </div>
      </div>

      {/* Feature Grid Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className={cn("flex flex-col gap-4 p-6", surfaceClass)}>
            <Sparkles className="text-[#F8D57E] h-8 w-8" />
            <h3 className="text-xl font-bold">Personal intros</h3>
            <p className={secondaryTextClass}>
              Get curated introductions that highlight why you and your match will click before you even say hello.
            </p>
          </div>
          <div className={cn("flex flex-col gap-4 p-6", surfaceClass)}>
            <MessageCircle className="text-[#F8D57E] h-8 w-8" />
            <h3 className="text-xl font-bold">Guided conversations</h3>
            <p className={secondaryTextClass}>
              Icebreakers, shared prompts, and follow-up reminders keep chats easy and pressure-free.
            </p>
          </div>
          <div className={cn("flex flex-col gap-4 p-6", surfaceClass)}>
            <UserCheck className="text-[#F8D57E] h-8 w-8" />
            <h3 className="text-xl font-bold">Real-life hangouts</h3>
            <p className={secondaryTextClass}>
              Join small gatherings designed for conversation, not crowds. Spots are limited so you can actually connect.
            </p>
          </div>
          <div className={cn("flex flex-col gap-4 p-6", surfaceClass)}>
            <Users className="text-[#F8D57E] h-8 w-8" />
            <h3 className="text-xl font-bold">Build your circle</h3>
            <p className={secondaryTextClass}>
              Save new friends to your circle, set shared goals, and plan your next meetup together.
            </p>
          </div>
        </div>
      </div>

      {/* Trust & Safety Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Friendship is better when you feel safe</h2>
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
            <h3 className="text-lg font-bold mt-2">Concierge onboarding</h3>
            <p className={cn("text-sm", secondaryTextClass)}>
              A real human helps you set goals for the friendships you want and guides your first steps.
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
            <h3 className="text-lg font-bold mt-2">Verified hosts</h3>
            <p className={cn("text-sm", secondaryTextClass)}>
              Every hangout leader is vetted and receives safety training to keep the vibe welcoming.
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
            <h3 className="text-lg font-bold mt-2">Guided conversations</h3>
            <p className={cn("text-sm", secondaryTextClass)}>
              Tools and prompts help break the ice and nurture friendships beyond the first meetup.
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Experiences Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Upcoming friend-making hangouts</h2>
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
              <p className={cn("text-sm", secondaryTextClass)}>
                Meet three curated matches for a relaxed Saturday stroll between cafés.
              </p>
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
              <p className={cn("text-sm", secondaryTextClass)}>
                Pair up with another solo member to cook, taste, and plan your next dinner together.
              </p>
            </div>
            <Button variant="secondary" className="w-full">
              View Details
            </Button>
          </div>
        </div>
      </div>

      {/* Member Stories Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Member friendship stories</h2>
        <div className="flex flex-col gap-8">
          <div className={cn("p-6 text-center", surfaceClass)}>
            <img src={memberSarah} alt="Portrait of Sarah" className="mx-auto h-16 w-16 rounded-full object-cover mb-4" />
            <p className={cn("italic", secondaryTextClass)}>
              "I joined hoping to find one person to explore the city with. Now I have a group chat with four new friends and weekly plans."
            </p>
            <p className="mt-4 font-bold">- Sarah L.</p>
          </div>
          <div className={cn("p-6 text-center", surfaceClass)}>
            <img src={memberDavid} alt="Portrait of David" className="mx-auto h-16 w-16 rounded-full object-cover mb-4" />
            <p className={cn("italic", secondaryTextClass)}>
              "The introductions feel intentional. My first match is now my go-to climbing partner and we host monthly meetups together."
            </p>
            <p className="mt-4 font-bold">- David Chen</p>
          </div>
        </div>
      </div>

      {/* Join Section */}
      <div className="px-4 pt-24 pb-16 text-center" style={{ background: joinSectionBackground }}>
        <div className="max-w-lg mx-auto space-y-6">
          <h2 className="text-3xl font-bold leading-tight">
            Join the friend-making app built for adults who want more real-life connection.
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
