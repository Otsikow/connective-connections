import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SubscriptionProvider } from "@/hooks/useSubscription";
import { BottomNav } from "@/components/BottomNav";
import { Footer } from "@/components/Footer";

// Pages
import Splash from "./pages/Splash";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

import ProfileSetup from "./pages/ProfileSetup";
import Home from "./pages/Home";
import Matches from "./pages/Matches";
import FriendFinder from "./pages/FriendFinder";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Community from "./pages/Community";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import CreateEvent from "./pages/CreateEvent";
import Admin from "./pages/Admin";
import HostDashboard from "./pages/HostDashboard";
import HostEvent from "./pages/HostEvent";
import HostCreateExperience from "./pages/HostCreateExperience";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";
import Privacy from "./pages/legal/Privacy";
import Terms from "./pages/legal/Terms";
import Accessibility from "./pages/legal/Accessibility";
import Cookies from "./pages/legal/Cookies";

const queryClient = new QueryClient();

/**
 * Handles animated page transitions
 */
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Splash />
            </PageTransition>
          }
        />
        <Route
          path="/signup"
          element={
            <PageTransition>
              <Signup />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />
        <Route
          path="/profile-setup"
          element={
            <PageTransition>
              <ProfileSetup />
            </PageTransition>
          }
        />
        <Route
          path="/auth/callback"
          element={
            <PageTransition>
              <AuthCallback />
            </PageTransition>
          }
        />
        <Route
          path="/home"
          element={
            <PageTransition>
              <Home />
            </PageTransition>
          }
        />
        <Route
          path="/events"
          element={
            <PageTransition>
              <Events />
            </PageTransition>
          }
        />
        <Route
          path="/events/:eventId"
          element={
            <PageTransition>
              <EventDetail />
            </PageTransition>
          }
        />
        <Route
          path="/host/create-event"
          element={
            <PageTransition>
              <CreateEvent />
            </PageTransition>
          }
        />
        <Route
          path="/matches"
          element={
            <PageTransition>
              <Matches />
            </PageTransition>
          }
        />
        <Route
          path="/friend-finder"
          element={
            <PageTransition>
              <FriendFinder />
            </PageTransition>
          }
        />
        {/* Keep legacy messages route for bottom nav compatibility */}
        <Route
          path="/messages"
          element={
            <PageTransition>
              <Messages />
            </PageTransition>
          }
        />
        {/* Dynamic chat route per match */}
        <Route
          path="/messages/:id"
          element={
            <PageTransition>
              <Messages />
            </PageTransition>
          }
        />
        <Route
          path="/community"
          element={
            <PageTransition>
              <Community />
            </PageTransition>
          }
        />
        <Route
          path="/profile"
          element={
            <PageTransition>
              <Profile />
            </PageTransition>
          }
        />
        <Route
          path="/admin"
          element={
            <PageTransition>
              <Admin />
            </PageTransition>
          }
        />
        <Route
          path="/host-dashboard"
          element={
            <PageTransition>
              <HostDashboard />
            </PageTransition>
          }
        />
        <Route
          path="/host/create-experience"
          element={
            <PageTransition>
              <HostCreateExperience />
            </PageTransition>
          }
        />
        <Route
          path="/host/event"
          element={
            <PageTransition>
              <HostEvent />
            </PageTransition>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PageTransition>
              <Dashboard />
            </PageTransition>
          }
        />
        <Route
          path="/privacy"
          element={
            <PageTransition>
              <Privacy />
            </PageTransition>
          }
        />
        <Route
          path="/terms"
          element={
            <PageTransition>
              <Terms />
            </PageTransition>
          }
        />
        <Route
          path="/accessibility"
          element={
            <PageTransition>
              <Accessibility />
            </PageTransition>
          }
        />
        <Route
          path="/cookies"
          element={
            <PageTransition>
              <Cookies />
            </PageTransition>
          }
        />
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFound />
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

/**
 * Core app layout with theme toggle and bottom navigation
 */
const AppContent = () => {
  const location = useLocation();
  const showThemeToggle = location.pathname === "/";

  return (
    <div
      className="relative flex min-h-screen flex-col"
      style={{ "--bottom-nav-height": "5.75rem" }}
    >
      {showThemeToggle && <ThemeToggle />}
      <main
        className="flex-1"
        style={{
          paddingBottom:
            "calc(var(--bottom-nav-height, 5.75rem) + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <AnimatedRoutes />
        <Footer />
      </main>
      <BottomNav currentPath={location.pathname} />
    </div>
  );
};

/**
 * Root App component
 */
const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
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
