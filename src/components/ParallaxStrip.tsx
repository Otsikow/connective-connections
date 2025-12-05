import { useEffect, useRef } from "react";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

export const ParallaxStrip = () => {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const updatePosition = () => {
      const el = stripRef.current;
      if (!el) return;

      const scrollY = window.scrollY;
      const parallaxOffset = scrollY * -0.12; // 12% slower than scroll
      const drift = Math.sin(scrollY * 0.01) * 3; // 2–4px vertical wobble

      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const distanceFromCenter = Math.abs(rect.top + rect.height / 2 - viewport / 2);
      const fade = 1 - clamp(distanceFromCenter / (viewport * 0.85), 0, 1);
      const opacity = 0.35 + fade * 0.4; // fades in/out at edges

      el.style.opacity = opacity.toFixed(3);
      el.style.transform = `translate3d(0, ${parallaxOffset + drift}px, 0)`;
    };

    const onScroll = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updatePosition);
    };

    updatePosition();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      ref={stripRef}
      className="pointer-events-none absolute inset-x-[-12%] top-8 -z-10 h-[420px]"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, hsla(43,95%,64%,0.42) 0, hsla(43,95%,64%,0.42) 130px, hsla(33,92%,70%,0.35) 130px, hsla(33,92%,70%,0.35) 200px, hsla(210,83%,65%,0.3) 200px, hsla(210,83%,65%,0.3) 260px, hsla(160,63%,55%,0.32) 260px, hsla(160,63%,55%,0.32) 330px)",
        filter: "saturate(105%)",
        mixBlendMode: "multiply",
        transform: "translate3d(0, 0, 0)",
        willChange: "transform, opacity",
        maskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%)",
        boxShadow: "0 40px 120px -60px rgba(0,0,0,0.25)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.6) 60%, rgba(255,255,255,0.35) 100%)",
          mixBlendMode: "soft-light",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 50% at 50% 50%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 65%)",
        }}
      />
    </div>
  );
};

export default ParallaxStrip;
