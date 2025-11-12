import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Calendar, MessageSquare, User, Users } from "lucide-react";
import { triggerHaptic } from "@/lib/haptics";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: "Home", path: "/home" },
  { icon: Users, label: "Friend Finder", path: "/friend-finder" },
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
    triggerHaptic('selection');
    navigate(path);
  };

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 bottom-0 z-50 px-3 pt-2"
      style={{
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)",
      }}
    >
      <div className="mx-auto w-full max-w-4xl rounded-[30px] border border-border/40 bg-card/95 p-1.5 shadow-[0_30px_60px_-35px_rgba(188,150,82,0.6)] backdrop-blur-xl supports-[backdrop-filter]:bg-card/85">
        <div className="flex w-full items-stretch gap-1 overflow-x-auto px-0.5 py-0.5 scrollbar-none sm:gap-1.5 sm:px-1">
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
                className={`relative flex min-w-[60px] flex-1 flex-col items-center justify-center gap-1 rounded-[22px] px-2 py-1.5 text-[11px] font-semibold uppercase leading-tight tracking-[0.08em] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--primary))] focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:min-w-[72px] sm:px-3 sm:text-[12px] md:text-xs ${
                  isActive
                    ? "bg-card/80 text-foreground shadow-[0_24px_55px_-32px_rgba(188,150,82,0.6)]"
                    : "text-foreground/60 hover:text-foreground"
                }`}
                whileTap={{ scale: 0.94 }}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <motion.div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border border-transparent shadow-[0_18px_40px_-25px_rgba(188,150,80,0.7)] transition-colors ${
                    isActive
                      ? "bg-[linear-gradient(140deg,hsl(var(--primary)),hsl(var(--accent)))] text-primary-foreground"
                      : "bg-card/70 text-foreground/70"
                  }`}
                  animate={{ y: isActive ? -2 : 0 }}
                  transition={{ type: "spring", stiffness: 320, damping: 24 }}
                >
                  <Icon size={22} strokeWidth={isActive ? 2.4 : 2} />
                </motion.div>
                <span className="text-center leading-tight sm:leading-snug">
                  {label}
                </span>
                {isActive && (
                  <motion.div
                    className="absolute bottom-1.5 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[hsl(var(--primary))]"
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
      </div>
    </nav>
  );
};
