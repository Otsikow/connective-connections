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

    const cards = Array.from(
      document.querySelectorAll<HTMLElement>('[data-stagger-card="true"]')
    );

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

    const cardObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const card = entry.target as HTMLElement;
          const index = Number(card.dataset.staggerIndex ?? 0);
          card.style.setProperty("--stagger-delay", `${index * 40}ms`);
          card.classList.add("stagger-card-visible");
          cardObserver.unobserve(card);
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );

    cards.forEach((card, index) => {
      card.dataset.staggerIndex = `${index}`;
      cardObserver.observe(card);
    });

    return () => {
      observer.disconnect();
      cardObserver.disconnect();
    };
  }, [location.pathname]);
};
