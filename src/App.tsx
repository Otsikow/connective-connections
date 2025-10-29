import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { PageTransition } from "@/components/PageTransition";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TooltipProvider } from "@/components/ui/tooltip";

// Pages
import Splash from "./pages/Splash";
import Onboarding from "./pages/Onboarding";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProfileSetup from "./pages/ProfileSetup";
import Home from "./pages/Home";
import Matches from "./pages/Matches";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";
import Community from "./pages/Community";
import Events from "./pages/Events";
import EventDetail from "./pages/EventDetail";
import CreateEvent from "./pages/CreateEvent";
import Admin from "./pages/Admin";
import HostDashboard from "./pages/HostDashboard";
import HostEvent from "./pages/HostEvent";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import AuthCallback from "./pages/AuthCallback";

const queryClient = new QueryClient();

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
          path="/onboarding"
          element={
            <PageTransition>
              <Onboarding />
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
          path="/events/:id"
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
          path="/messages"
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
          path="/host/create-event"
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

const AppContent = () => {
  const location = useLocation();
  const showThemeToggle = location.pathname === "/";

  return (
    <>
      {showThemeToggle && <ThemeToggle />}
      <AnimatedRoutes />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
