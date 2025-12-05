import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const OBSERVER_OPTIONS: IntersectionObserverInit = {
  root: null,
  rootMargin: "0px 0px -20% 0px",
  threshold: 0,
};

export const useScrollReveal = () => {
  const location = useLocation();

  useEffect(() => {
    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("section")
    );

    if (sections.length === 0) return;

    sections.forEach((section) => {
      section.classList.add("section-reveal");
      Array.from(section.children).forEach((child) => {
        const childElement = child as HTMLElement;
        childElement.style.transitionDelay = "";
      });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const section = entry.target as HTMLElement;
          section.classList.add("section-reveal-visible");

          Array.from(section.children).forEach((child, index) => {
            const childElement = child as HTMLElement;
            childElement.style.transitionDelay = `${index * 80}ms`;
          });

          observer.unobserve(section);
        }
      });
    }, OBSERVER_OPTIONS);

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [location.pathname]);
};
