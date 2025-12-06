import { type CSSProperties, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SubscriptionProvider, useSubscription } from "@/hooks/useSubscription";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";
import { LoadingScreen } from "@/components/LoadingScreen";
import { TopBar } from "@/components/TopBar";

/* ----------------------------- Pages ----------------------------- */
import Splash from "./pages/Splash";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import ProfileSetup from "./pages/ProfileSetup";
import Home from "./pages/Home";
import Matches from "./pages/Matches";
import FriendFinder from "./pages/FriendFinder";
import Concierge from "./pages/Concierge";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Community from "./pages/Community";

import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import CreateEvent from "./pages/CreateEvent";

import Admin from "./pages/Admin";
import ModerationPanel from "./pages/ModerationPanel";

import HostDashboard from "./pages/HostDashboard";
import HostEvent from "./pages/HostEvent";
import HostCreateExperience from "./pages/HostCreateExperience";

import Dashboard from "./pages/Dashboard";
import UserAnalyticsDashboard from "./pages/UserAnalyticsDashboard";
import AIGrowthAnalytics from "./pages/AIGrowthAnalytics";
import AICoach from "./pages/AICoach";

import AIAutoMeetups from "./pages/AIAutoMeetups"; // <-- Correct final version

import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";

/* Legal Pages */
import Privacy from "./pages/legal/Privacy";
import Terms from "./pages/legal/Terms";
import Accessibility from "./pages/legal/Accessibility";
import Cookies from "./pages/legal/Cookies";

const queryClient = new QueryClient();

/* ------------------------------------------------------------ */
/* Animated Routes Component */
/* ------------------------------------------------------------ */
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        
        {/* Auth + Entry */}
        <Route path="/" element={<PageTransition><Splash /></PageTransition>} />
        <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/onboarding" element={<PageTransition><Onboarding /></PageTransition>} />
        <Route path="/profile-setup" element={<PageTransition><ProfileSetup /></PageTransition>} />
        <Route path="/auth/callback" element={<PageTransition><AuthCallback /></PageTransition>} />

        {/* Main */}
        <Route path="/home" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/concierge" element={<PageTransition><Concierge /></PageTransition>} />

        {/* Events */}
        <Route path="/events" element={<PageTransition><Events /></PageTransition>} />
        <Route path="/events/:eventId" element={<PageTransition><EventDetail /></PageTransition>} />
        <Route path="/host/create-event" element={<PageTransition><CreateEvent /></PageTransition>} />

        {/* Social */}
        <Route path="/matches" element={<PageTransition><Matches /></PageTransition>} />
        <Route path="/friend-finder" element={<PageTransition><FriendFinder /></PageTransition>} />

        {/* Messaging */}
        <Route path="/messages" element={<PageTransition><Messages /></PageTransition>} />
        <Route path="/messages/:id" element={<PageTransition><Messages /></PageTransition>} />

        {/* Community / Profile */}
        <Route path="/community" element={<PageTransition><Community /></PageTransition>} />
        <Route path="/profile" element={<PageTransition><Profile /></PageTransition>} />

        {/* Admin */}
        <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
        <Route path="/admin/moderation" element={<PageTransition><ModerationPanel /></PageTransition>} />

        {/* Host */}
        <Route path="/host-dashboard" element={<PageTransition><HostDashboard /></PageTransition>} />
        <Route path="/host/create-experience" element={<PageTransition><HostCreateExperience /></PageTransition>} />
        <Route path="/host/event" element={<PageTransition><HostEvent /></PageTransition>} />

        {/* User Dashboards */}
        <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
        <Route path="/analytics/users" element={<PageTransition><UserAnalyticsDashboard /></PageTransition>} />

        {/* AI */}
        <Route path="/ai-growth-analytics" element={<PageTransition><AIGrowthAnalytics /></PageTransition>} />
        <Route path="/ai-coach" element={<PageTransition><AICoach /></PageTransition>} />
        <Route path="/ai-auto-meetups" element={<PageTransition><AIAutoMeetups /></PageTransition>} />

        {/* Legal */}
        <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
        <Route path="/accessibility" element={<PageTransition><Accessibility /></PageTransition>} />
        <Route path="/cookies" element={<PageTransition><Cookies /></PageTransition>} />

        {/* 404 */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

/* ------------------------------------------------------------ */
/* AppContent Layout */
/* ------------------------------------------------------------ */
const AppContent = () => {
  const location = useLocation();
  const { isLoading: isSubscriptionLoading } = useSubscription();

  useScrollReveal();

  const showFooter = location.pathname === "/home";

  const [isBooting, setIsBooting] = useState(true);
  const [hasCompletedInitialLoad, setHasCompletedInitialLoad] = useState(false);

  /* Initial loading */
  useEffect(() => {
    const timer = window.setTimeout(() => setIsBooting(false), 500);
    return () => window.clearTimeout(timer);
  }, []);

  /* Scroll reset on route change */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  /* Radial highlight on clicks */
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const highlight = document.createElement("span");
      highlight.className = "click-radial-highlight";
      highlight.style.left = `${event.clientX}px`;
      highlight.style.top = `${event.clientY}px`;

      document.body.appendChild(highlight);
      highlight.addEventListener("animationend", () => highlight.remove());
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  /* Subscription fallback loader */
  useEffect(() => {
    if (hasCompletedInitialLoad) return;

    const fallback = window.setTimeout(() => setHasCompletedInitialLoad(true), 1500);

    if (!isSubscriptionLoading) {
      const fast = window.setTimeout(() => setHasCompletedInitialLoad(true), 200);
      return () => {
        clearTimeout(fallback);
        clearTimeout(fast);
      };
    }

    return () => clearTimeout(fallback);
  }, [hasCompletedInitialLoad, isSubscriptionLoading]);

  const showLoadingScreen = isBooting || !hasCompletedInitialLoad;

  const layoutStyles: CSSProperties = {
    "--bottom-nav-height": "5.75rem",
    "--top-bar-height": "4rem",
    backgroundImage: [
      "radial-gradient(circle at 20% 20%, hsl(var(--primary) / 0.08), transparent 32%)",
      "radial-gradient(circle at 80% 10%, hsl(var(--secondary) / 0.06), transparent 30%)",
      "radial-gradient(circle at 15% 75%, hsl(var(--accent) / 0.06), transparent 30%)",
      "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--background)) 100%)"
    ].join(","),
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground" style={layoutStyles}>
      <LoadingScreen show={showLoadingScreen} />
      <TopBar />

      <main
        className="flex-1 px-4 pt-6 sm:px-6 lg:px-8"
        style={{
          paddingTop: "calc(var(--top-bar-height) + 0.75rem)",
          paddingBottom: "calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <AnimatedRoutes />
        {showFooter && <Footer />}
      </main>

      <BottomNav currentPath={location.pathname} />
    </div>
  );
};

/* ------------------------------------------------------------ */
/* Root App Component */
/* ------------------------------------------------------------ */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <SubscriptionProvider>
            <AppContent />
          </SubscriptionProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
