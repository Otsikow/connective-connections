import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calendar, MessageSquare, Search, User } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Calendar, label: "Events", path: "/events" },
  { icon: MessageSquare, label: "Messages", path: "/messages" },
  { icon: Search, label: "Community", path: "/community" },
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
    triggerHaptic('selection');
    navigate(path);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 md:hidden"
    >
      <div className="mx-auto flex h-20 w-full max-w-md items-center justify-between px-2">
        {navItems.map(({ icon: Icon, label, path }) => {
          const isActive =
            activePath === path || activePath.startsWith(`${path}/`);

          return (
            <motion.button
              key={path}
              type="button"
              onClick={() => handleNavClick(path)}
              className={`relative flex h-full flex-1 flex-col items-center justify-center gap-1 rounded-lg px-2 text-xs font-medium transition-colors ${
                isActive ? "text-[#E8B956]" : "text-muted-foreground"
              }`}
              whileTap={{ scale: 0.94 }}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <motion.div
                className="flex h-9 w-9 items-center justify-center"
                animate={{ y: isActive ? -2 : 0 }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
              >
                <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
              </motion.div>
              <span className="leading-none">{label}</span>
              {isActive && (
                <motion.div
                  className="absolute bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#E8B956]"
                  layoutId="activeIndicator"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
