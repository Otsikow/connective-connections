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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import heroBackground from "@/assets/hero-background.jpg";
import coffeeLover from "@/assets/coffee-lover.jpg";
import bookChat from "@/assets/book-chat.jpg";
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
    ? "linear-gradient(rgba(11,14,23,0.9) 0%, rgba(11,14,23,0.6) 50%, rgba(11,14,23,1) 100%)"
    : "linear-gradient(rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.8) 50%, rgba(241,245,249,0.95) 100%)";

  const friendFinderOverlay = isDark
    ? "linear-gradient(0deg, rgba(15,23,42,0.7) 0%, rgba(15,23,42,0.1) 100%)"
    : "linear-gradient(0deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.2) 100%)";

  const secondaryTextClass = isDark ? "text-slate-400" : "text-slate-600";
  const overlayTextClass = isDark ? "text-white" : "text-slate-900";

  const surfaceClass = isDark
    ? "rounded-xl border border-white/10 bg-white/5"
    : "rounded-xl border border-slate-200 bg-white shadow-sm";

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
    ? "linear-gradient(to top, rgba(125,92,255,0.2), rgb(11,14,23))"
    : "linear-gradient(to top, rgba(125,92,255,0.15), rgb(248,250,252))";

  const friendPreviewProfiles = [
    {
      id: "noah",
      name: "Noah Alvarez",
      age: 29,
      location: "Capitol Hill • 1.2 mi",
      image: coffeeLover,
      compatibility: "92% match",
      highlights: ["Sunrise hikes", "Weekend brunch club"],
    },
    {
      id: "amira",
      name: "Amira Chen",
      age: 32,
      location: "Ballard • 3.4 mi",
      image: memberSarah,
      compatibility: "88% match",
      highlights: ["Supper club host", "Storytelling nights"],
    },
    {
      id: "darius",
      name: "Darius Kaur",
      age: 34,
      location: "South Lake • 0.9 mi",
      image: memberDavid,
      compatibility: "85% match",
      highlights: ["Language exchange", "Sunday soccer"],
    },
    {
      id: "lucia",
      name: "Lucia Romero",
      age: 27,
      location: "Fremont • 2.1 mi",
      image: bookChat,
      compatibility: "90% match",
      highlights: ["Indie film club", "Plant swaps"],
    },
  ];

  return (
    <div
      className={cn(
        "relative w-full min-h-screen bg-gradient-to-b transition-colors duration-300",
        isDark
          ? "from-slate-950 via-slate-950 to-black text-white"
          : "from-white via-slate-50 to-slate-100 text-slate-900",
      )}
    >
      {/* ---------------------------------------------------------------- */}
      {/* HERO SECTION — C1 (Modern Hero First, Original Badge After) */}
      {/* ---------------------------------------------------------------- */}
      <div
        className="relative min-h-screen flex items-center justify-center p-4 text-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `${heroOverlayGradient}, url(${heroBackground})`,
        }}
      >
        <div className="max-w-4xl mx-auto space-y-10">

          {/* Modern Hero Headline */}
          <h1 className="text-3xl sm:text-5xl font-black leading-tight tracking-tight">
            Find your next favorite people and build memories together.
          </h1>

          <p className={cn("text-base sm:text-lg font-medium max-w-2xl mx-auto", secondaryTextClass)}>
            Friend Finder introduces you to nearby people who share your energy, interests, and pace —
            then gives you the tools and small-group meetups to make those friendships real.
          </p>

          {/* Original Small Badge AFTER Modern Headline */}
          <div className="inline-flex items-center gap-2 rounded-full bg-[#F8D57E]/20 px-4 py-1 text-sm font-semibold text-[#F8D57E] shadow-sm">
            <HeartHandshake className="h-4 w-4" />
            Made for building real friendships
          </div>

          {/* CTA Buttons */}
          <div className="grid gap-3 sm:grid-cols-[auto_auto] justify-center">
            <Button
              onClick={() => navigate("/friend-finder")}
              className="w-full sm:w-auto bg-[#F8D57E] hover:bg-[#e8c56e] text-slate-950 font-bold shadow-[0_0_12px_rgba(248,213,126,0.45)] hover:scale-105 transition-transform"
            >
              Find friends now
            </Button>

            <Button
              onClick={() => navigate("/signup")}
              variant="outline"
              className={outlineButtonClass}
            >
              Become a member
            </Button>
          </div>

          {/* Stats Row */}
          <div
            className={cn(
              "mx-auto flex flex-col gap-4 rounded-2xl px-6 py-5 sm:flex-row sm:items-center sm:gap-8",
              isDark ? "bg-white/5 border border-white/10" : "bg-white/80 border border-white shadow-lg",
            )}
          >
            <div className="flex items-center gap-3">
              <Smile className="h-8 w-8 text-[#F8D57E]" />
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-[#F8D57E]">
                  Friendship outcomes
                </p>
                <p className="text-lg font-bold">
                  92% of members meet someone they hang out with monthly
                </p>
              </div>
            </div>

            <p className={cn("text-sm", secondaryTextClass)}>
              Every introduction is vetted, safe, and designed to move offline naturally.
            </p>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* FRIEND PREVIEW SLIDER (from Option A) */}
      {/* ---------------------------------------------------------------- */}
      <div className="px-4 pt-16 pb-12 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="overflow-hidden">
          <div className="flex gap-4 overflow-x-auto pb-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {friendPreviewProfiles.map((profile) => (
              <div
                key={profile.id}
                className={cn(
                  "group relative flex w-64 shrink-0 flex-col overflow-hidden rounded-3xl border backdrop-blur transition-transform duration-200 hover:-translate-y-1",
                  isDark
                    ? "border-white/10 bg-white/5 shadow-[0_20px_40px_rgba(15,23,42,0.45)]"
                    : "border-slate-200 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.08)]",
                )}
              >
                <div className="relative h-72 w-full overflow-hidden">
                  <img
                    src={profile.image}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  <div className="absolute top-4 right-4">
                    <Badge className="rounded-full bg-[#F8D57E] text-slate-950 shadow">
                      {profile.compatibility}
                    </Badge>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-lg font-semibold text-white">
                      {profile.name} · {profile.age}
                    </h3>
                    <p className="text-sm text-white/80">{profile.location}</p>
                  </div>
                </div>

                <div className="space-y-3 p-4">
                  <p className={cn("text-sm", secondaryTextClass)}>Curated by Friend Finder</p>

                  <div className="flex flex-wrap gap-2">
                    {profile.highlights.map((highlight) => (
                      <Badge
                        key={highlight}
                        variant="secondary"
                        className="rounded-full bg-muted text-xs"
                      >
                        {highlight}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    onClick={() => navigate(`/friend-finder?focus=${profile.id}`)}
                    className="w-full rounded-full bg-[#F8D57E] text-slate-950 hover:bg-[#e8c56e]"
                  >
                    View profile preview
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* FRIEND FINDER STEPS (from Option B) */}
      {/* ---------------------------------------------------------------- */}
      <div className="px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold">We help you make friends that last</h2>
          <p className={cn("text-base max-w-2xl mx-auto", secondaryTextClass)}>
            Share who you are, get quality introductions, and join curated hangouts built for real
            connection.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Step 1 */}
          <div className={cn("p-6 text-left space-y-3", surfaceClass)}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F8D57E]/20 text-[#F8D57E]">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold">Tell us about your vibe</h3>
            <p className={secondaryTextClass}>
              Interests, social energy, pace — everything that makes a friendship click.
            </p>
          </div>

          {/* Step 2 */}
          <div className={cn("p-6 text-left space-y-3", surfaceClass)}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F8D57E]/20 text-[#F8D57E]">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold">Match with nearby friends</h3>
            <p className={secondaryTextClass}>
              Smart matching based on compatibility, interests, and shared rhythms.
            </p>
          </div>

          {/* Step 3 */}
          <div className={cn("p-6 text-left space-y-3", surfaceClass)}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F8D57E]/20 text-[#F8D57E]">
              <CalendarCheck className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold">Meet up with confidence</h3>
            <p className={secondaryTextClass}>
              Small hangouts designed to make “hello” feel easy, natural, and pressure-free.
            </p>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* FRIEND FINDER CARDS GRID */}
      {/* ---------------------------------------------------------------- */}
      <div className="px-4 pb-16 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* Coffee Lovers */}
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
              <p className={cn("text-sm", overlayTextClass)}>
                14 locals matched this week.
              </p>
            </div>
          </div>

          {/* Book Chat */}
          <div
            className={cn(
              "relative rounded-xl overflow-hidden aspect-[3/4] bg-cover bg-center border",
              isDark ? "border-white/10" : "border-slate-200",
            )}
            style={{ backgroundImage: `${friendFinderOverlay}, url(${bookChat})` }}
          >
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className={cn("text-lg font-semibold", overlayTextClass)}>
                Join a local book club 📚
              </p>
              <p className={cn("text-sm", overlayTextClass)}>
                6 people discussing new reads nearby.
              </p>
            </div>
          </div>

          {/* Fitness Partner */}
          <div
            className={cn(
              "relative rounded-xl overflow-hidden aspect-[3/4] bg-cover bg-center border",
              isDark ? "border-white/10" : "border-slate-200",
            )}
            style={{
              backgroundImage: `${friendFinderOverlay}, url(${coffeeLover})`,
            }}
          >
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className={cn("text-lg font-semibold", overlayTextClass)}>
                Link up with a workout buddy 🏃‍♂️
              </p>
              <p className={cn("text-sm", overlayTextClass)}>
                Plan runs, hikes, or gym sessions together.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* TRUST & SAFETY */}
      {/* ---------------------------------------------------------------- */}
      <div className="px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Friendship is better when you feel safe</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-12">
          {/* Concierge */}
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
              A real human guides your first steps.
            </p>
          </div>

          {/* Verified */}
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
              Hangouts led by vetted, welcoming hosts.
            </p>
          </div>

          {/* Guided Chat */}
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
              Icebreakers that make talking feel natural.
            </p>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* UPCOMING EXPERIENCES */}
      {/* ---------------------------------------------------------------- */}
      <div className="px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Upcoming friend-making hangouts</h2>

        <div className="flex flex-col gap-6">

          {/* Coffee Crawl */}
          <div className={cn("flex flex-col gap-4 p-4", surfaceClass)}>
            <img
              src={coffeeCrawl}
              className="h-40 w-full rounded-lg object-cover"
            />
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Neighborhood Coffee Crawl ☕</h3>
              <div className={cn("flex items-center gap-2 text-sm", secondaryTextClass)}>
                <Star className="text-[#F8D57E] h-4 w-4 fill-current" />
                <span>4.9 (120 reviews)</span>
                <span className="mx-1">·</span>
                <span>Downtown</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#F8D57E]/20 px-3 py-1 text-xs font-medium text-[#F8D57E]">
                  Social
                </span>
                <span className="rounded-full bg-[#F8D57E]/20 px-3 py-1 text-xs font-medium text-[#F8D57E]">
                  Food & Drink
                </span>
              </div>
              <p className={cn("text-sm", secondaryTextClass)}>
                A relaxed Saturday café stroll with curated matches.
              </p>
            </div>
            <Button variant="secondary" className="w-full">View Details</Button>
          </div>

          {/* Cooking Class */}
          <div className={cn("flex flex-col gap-4 p-4", surfaceClass)}>
            <img
              src={cookingClass}
              className="h-40 w-full rounded-lg object-cover"
            />
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Cooking Class: Italian Cuisine 🍝</h3>
              <div className={cn("flex items-center gap-2 text-sm", secondaryTextClass)}>
                <Star className="text-[#F8D57E] h-4 w-4 fill-current" />
                <span>5.0 (98 reviews)</span>
                <span className="mx-1">·</span>
                <span>North End</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-[#F8D57E]/20 px-3 py-1 text-xs font-medium text-[#F8D57E]">
                  Workshop
                </span>
                <span className="rounded-full bg-[#F8D57E]/20 px-3 py-1 text-xs font-medium text-[#F8D57E]">
                  Food & Drink
                </span>
              </div>
              <p className={cn("text-sm", secondaryTextClass)}>
                Cook, taste, and build a connection with another member.
              </p>
            </div>
            <Button variant="secondary" className="w-full">View Details</Button>
          </div>

        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* MEMBER STORIES */}
      {/* ---------------------------------------------------------------- */}
      <div className="px-4 py-16 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Member friendship stories</h2>

        <div className="flex flex-col gap-8">

          {/* Sarah */}
          <div className={cn("p-6 text-center", surfaceClass)}>
            <img
              src={memberSarah}
              className="mx-auto h-16 w-16 rounded-full object-cover mb-4"
            />
            <p className={cn("italic", secondaryTextClass)}>
              “I joined hoping to find one person to explore the city with.  
              Now I have a group chat, weekly plans, and four new friends.”
            </p>
            <p className="mt-4 font-bold">— Sarah L.</p>
          </div>

          {/* David */}
          <div className={cn("p-6 text-center", surfaceClass)}>
            <img
              src={memberDavid}
              className="mx-auto h-16 w-16 rounded-full object-cover mb-4"
            />
            <p className={cn("italic", secondaryTextClass)}>
              “The introductions feel intentional.  
              My first match is now my climbing partner —  
              we even host monthly meetups together.”
            </p>
            <p className="mt-4 font-bold">— David Chen</p>
          </div>

        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* JOIN SECTION */}
      {/* ---------------------------------------------------------------- */}
      <div
        className="px-4 pt-24 pb-16 text-center"
        style={{ background: joinSectionBackground }}
      >
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
