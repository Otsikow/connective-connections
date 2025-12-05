import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Calendar, Home, MessageSquare, User, Users } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Users, label: "Friends", path: "/friend-finder" },
  { icon: Calendar, label: "Events", path: "/events" },
  { icon: MessageSquare, label: "Messages", path: "/messages" },
  { icon: User, label: "Profile", path: "/profile" },
];

interface BottomNavProps {
  currentPath?: string;
}

export const BottomNav = ({ currentPath }: BottomNavProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = currentPath || location.pathname;

  const handleNavClick = (path: string) => {
    triggerHaptic("selection");
    navigate(path);
  };

  const navStyles: CSSProperties = {
    paddingBottom: "env(safe-area-inset-bottom, 0px)",
    height: "var(--nav-height, 72px)",
  };

  return (
    <nav
      aria-label="Primary navigation"
      className="nav-connective fixed inset-x-0 bottom-0 z-50"
      style={navStyles}
    >
      {/* Gradient border top */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[rgba(255,138,60,0.3)] to-transparent" />
      
      <div className="flex h-full w-full items-center justify-center gap-1 bg-[#0C0C0C]/95 px-2 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0C0C0C]/85 sm:gap-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive =
            activePath === path || activePath.startsWith(`${path}/`);

          return (
            <motion.button
              key={path}
              type="button"
              onClick={() => handleNavClick(path)}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex min-w-[56px] flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl px-2 py-2 text-[10px] font-semibold uppercase tracking-[0.06em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF8A3C] focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505] sm:min-w-[64px] sm:px-3 sm:text-[11px] ${
                isActive
                  ? "text-white"
                  : "text-[#7B7B7B] hover:text-[#BDBDBD]"
              }`}
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <motion.div
                className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-br from-[#FF8A3C] to-[#D96B26] text-white shadow-lg shadow-[rgba(255,138,60,0.4)]"
                    : "bg-[rgba(255,255,255,0.04)] text-[#7B7B7B] hover:bg-[rgba(255,255,255,0.08)]"
                }`}
                animate={{ 
                  y: isActive ? -4 : 0,
                  scale: isActive ? 1.05 : 1
                }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
              </motion.div>
              
              <span className="text-center leading-tight">
                {label}
              </span>
              
              {/* Active indicator bar with spring physics */}
              {isActive && (
                <motion.div
                  className="nav-indicator absolute -bottom-0.5 left-1/2 h-[3px] w-8 -translate-x-1/2 rounded-t-full bg-gradient-to-r from-[#FF8A3C] to-[#FFB377]"
                  layoutId="navActiveIndicator"
                  initial={{ opacity: 0, scaleX: 0.5 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  exit={{ opacity: 0, scaleX: 0.5 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 500, 
                    damping: 30,
                    mass: 0.8
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
      
      {/* Ambient glow effect */}
      <div className="pointer-events-none absolute inset-x-0 -top-8 h-8 bg-gradient-to-t from-[rgba(255,138,60,0.08)] to-transparent" />
    </nav>
  );
};
