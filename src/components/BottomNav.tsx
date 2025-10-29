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
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-3 flex items-center justify-around z-50">
      {navItems.map(({ icon: Icon, label, path }) => {
        const isActive = activePath === path;
        
        return (
          <motion.button
            key={path}
            onClick={() => handleNavClick(path)}
            className={`flex flex-col items-center gap-1 relative ${
              isActive ? "text-[#E8B956]" : "text-muted-foreground"
            }`}
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <motion.div
              animate={{
                y: isActive ? -2 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Icon size={24} />
            </motion.div>
            <span className={`text-xs ${isActive ? "font-medium" : ""}`}>
              {label}
            </span>
            {isActive && (
              <motion.div
                className="absolute -bottom-3 left-1/2 w-1 h-1 rounded-full bg-[#E8B956]"
                layoutId="activeIndicator"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </nav>
  );
};
