import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type AccentColor = "emerald" | "sky" | "violet" | "amber" | "rose";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultAccent?: AccentColor;
  storageKey?: string;
  accentStorageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  accentColor: AccentColor;
  setAccentColor: (color: AccentColor) => void;
};

// HSL values for each accent color (hue saturation lightness without the hsl wrapper)
const ACCENT_COLOR_VALUES: Record<AccentColor, { primary: string; accent: string; ring: string }> = {
  emerald: {
    primary: "160 84% 39%",
    accent: "160 84% 39%",
    ring: "160 84% 39%",
  },
  sky: {
    primary: "199 89% 48%",
    accent: "199 89% 48%",
    ring: "199 89% 48%",
  },
  violet: {
    primary: "263 70% 50%",
    accent: "263 70% 50%",
    ring: "263 70% 50%",
  },
  amber: {
    primary: "28 100% 63%",
    accent: "28 100% 56%",
    ring: "28 100% 63%",
  },
  rose: {
    primary: "350 89% 60%",
    accent: "350 89% 60%",
    ring: "350 89% 60%",
  },
};

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
  toggleTheme: () => null,
  accentColor: "amber",
  setAccentColor: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  defaultAccent = "amber",
  storageKey = "connective-theme",
  accentStorageKey = "connective-accent-color",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return defaultTheme;
    }

    const storedTheme = window.localStorage.getItem(storageKey) as Theme | null;
    if (storedTheme) {
      return storedTheme;
    }

    const prefersDark = window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false;
    return prefersDark ? "dark" : "light";
  });

  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    if (typeof window === "undefined") {
      return defaultAccent;
    }

    const storedAccent = window.localStorage.getItem(accentStorageKey) as AccentColor | null;
    if (storedAccent && Object.keys(ACCENT_COLOR_VALUES).includes(storedAccent)) {
      return storedAccent;
    }

    return defaultAccent;
  });

  // Apply theme class
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    root.style.colorScheme = theme;
  }, [theme]);

  // Apply accent color CSS variables
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const root = window.document.documentElement;
    const colorValues = ACCENT_COLOR_VALUES[accentColor];

    root.style.setProperty("--primary", colorValues.primary);
    root.style.setProperty("--accent", colorValues.accent);
    root.style.setProperty("--ring", colorValues.ring);
  }, [accentColor]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, newTheme);
      }
      setTheme(newTheme);
    },
    toggleTheme: () => {
      const newTheme = theme === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        window.localStorage.setItem(storageKey, newTheme);
      }
      setTheme(newTheme);
    },
    accentColor,
    setAccentColor: (color: AccentColor) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(accentStorageKey, color);
      }
      setAccentColorState(color);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

export type { AccentColor };
