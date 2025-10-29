import { motion } from "framer-motion";
import { useTheme } from "./ThemeProvider";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Sparkles, Palette, Zap } from "lucide-react";

export function DarkModeShowcase() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const features = [
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Smooth Animations",
      description: "Delightful transitions powered by Framer Motion",
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: "Professional Palette",
      description: "Carefully crafted colors for optimal readability",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "High Performance",
      description: "Optimized with CSS variables and minimal re-renders",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Professional Dark Mode
          </h2>
          <p className="text-muted-foreground">
            Currently in <Badge variant={isDark ? "default" : "secondary"}>{isDark ? "Dark" : "Light"}</Badge> mode
          </p>
        </div>
      </motion.div>

      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="border-border hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-primary/10 text-primary">
                    {feature.icon}
                  </div>
                  <span className="text-lg">{feature.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Color Palette Preview */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-border overflow-hidden">
          <CardHeader>
            <CardTitle>Theme Colors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-primary shadow-md flex items-center justify-center">
                  <span className="text-primary-foreground font-semibold text-sm">Primary</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-secondary shadow-md flex items-center justify-center">
                  <span className="text-secondary-foreground font-semibold text-sm">Secondary</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-accent shadow-md flex items-center justify-center">
                  <span className="text-accent-foreground font-semibold text-sm">Accent</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-20 rounded-lg bg-muted shadow-md flex items-center justify-center">
                  <span className="text-muted-foreground font-semibold text-sm">Muted</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
