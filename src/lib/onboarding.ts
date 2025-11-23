const ONBOARDING_STORAGE_KEY = "connective:onboarding-complete";

export const hasCompletedOnboarding = () => {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(ONBOARDING_STORAGE_KEY) === "true";
};

export const markOnboardingComplete = () => {
  if (typeof window === "undefined") return;
  localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
};

export const resetOnboardingProgress = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ONBOARDING_STORAGE_KEY);
};
