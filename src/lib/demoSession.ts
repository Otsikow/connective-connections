const DEMO_SESSION_KEY = "connective:demo-session";

type DemoSession = {
  id: string;
  email: string;
  fullName: string;
};

const safeRead = (): DemoSession | null => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(DEMO_SESSION_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.id === "string" && typeof parsed.email === "string") {
      return {
        id: parsed.id,
        email: parsed.email,
        fullName: typeof parsed.fullName === "string" ? parsed.fullName : "Connective Preview User",
      } satisfies DemoSession;
    }
  } catch (error) {
    console.warn("demo-session:parse-error", error);
  }
  return null;
};

export const activateDemoSession = (identifier?: string) => {
  if (typeof window === "undefined") return null;
  const normalizedEmail =
    identifier && identifier.includes("@")
      ? identifier.trim().toLowerCase()
      : "preview@connective.social";
  const session: DemoSession = {
    id: "demo-user",
    email: normalizedEmail,
    fullName: "Connective Preview User",
  };
  localStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session));
  return session;
};

export const clearDemoSession = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DEMO_SESSION_KEY);
};

export const getDemoSession = () => safeRead();

export const isDemoSessionActive = () => Boolean(safeRead());
