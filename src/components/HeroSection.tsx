import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
const HeroSection = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [heroVideoSrc, setHeroVideoSrc] = useState("/videos/hero-video.mp4");
  const [videoLoaded, setVideoLoaded] = useState(false);
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(() => {
        // Autoplay may be blocked, video will still be visible
      });
    }
  }, []);
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let isCancelled = false;
    const loadHeroVideo = async () => {
      const {
        data,
        error
      } = await supabase.storage.from("videos").list("hero", {
        limit: 1,
        sortBy: {
          column: "created_at",
          order: "desc"
        }
      });
      if (error) {
        console.error("hero-video:list-error", error.message);
        return;
      }
      if (!data || data.length === 0) return;
      const latestVideo = data.find(item => /\.(mp4|mov|webm)$/i.test(item.name)) ?? data[0];
      const {
        data: publicUrlData,
        error: publicUrlError
      } = supabase.storage.from("videos").getPublicUrl(`hero/${latestVideo.name}`);
      if (publicUrlError) {
        console.error("hero-video:url-error", publicUrlError.message);
        return;
      }
      if (!isCancelled && publicUrlData?.publicUrl) {
        setHeroVideoSrc(publicUrlData.publicUrl);
      }
    };
    loadHeroVideo();
    return () => {
      isCancelled = true;
    };
  }, []);
  return <section className="relative w-full min-h-[70vh] h-[80vh] md:h-[90vh] lg:h-screen overflow-hidden">
      {/* Background Video Layer */}
      <div className="absolute inset-0 z-0">
        <motion.video ref={videoRef} key={heroVideoSrc} initial={{
        opacity: 0
      }} animate={{
        opacity: videoLoaded ? 1 : 0
      }} transition={{
        duration: 1.2,
        ease: "easeOut"
      }} onLoadedData={() => setVideoLoaded(true)} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src={heroVideoSrc} type="video/mp4" />
        </motion.video>

        {/* Dark Overlay Gradient - stronger on mobile for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/45 via-background/35 to-background/70
                     md:from-background/25 md:via-background/20 md:to-background/55" aria-hidden="true" />
        
        {/* Additional radial gradient for better text contrast */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.4)_100%)]
                     md:bg-[radial-gradient(ellipse_at_center,transparent_0%,hsl(var(--background)/0.3)_100%)]" aria-hidden="true" />
      </div>

      {/* Foreground Content Layer */}
      <div className="relative z-10 h-full flex flex-col justify-center items-center px-4 sm:px-6 md:px-12 lg:px-20">
        <div className="max-w-4xl mx-auto text-center pt-[8vh] md:pt-[5vh]">
          
          {/* Headline */}
          <motion.h1 initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.7,
          delay: 0.3,
          ease: "easeOut"
        }} className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight
                       text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]
                       [text-shadow:0_2px_12px_rgba(0,0,0,0.6),0_4px_24px_rgba(0,0,0,0.4)]">Find Genuine Friends.
Live Your Best Life.<br className="hidden sm:block" />
            <span className="text-primary drop-shadow-[0_2px_20px_rgba(255,138,60,0.5)]">
              {" "}Live Your Best Life.
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.5,
          ease: "easeOut"
        }} className="mt-4 sm:mt-6 md:mt-8 text-base sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto
                       font-medium leading-relaxed
                       drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]
                       [text-shadow:0_1px_8px_rgba(0,0,0,0.5)]">Find Genuine Friends.
Live Your Best Life.</motion.p>

          {/* CTA Buttons */}
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.7,
          ease: "easeOut"
        }} className="mt-8 sm:mt-10 md:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-5 justify-center items-center flex-wrap">
            <Button size="lg" onClick={() => navigate("/signup")} className="w-full sm:w-auto min-w-[200px] h-12 text-base font-semibold sm:h-14 sm:text-lg
                         bg-primary hover:bg-primary/90 text-primary-foreground
                         shadow-[0_8px_32px_rgba(255,138,60,0.4)] hover:shadow-[0_12px_40px_rgba(255,138,60,0.5)]
                         transition-all duration-300 hover:scale-105">
              Join Connective
            </Button>

            <Button size="lg" variant="outline" onClick={() => navigate("/events")} className="w-full sm:w-auto min-w-[200px] h-12 text-base font-semibold sm:h-14 sm:text-lg
                         bg-white/10 backdrop-blur-md border-white/30 text-white
                         hover:bg-white/20 hover:border-white/50
                         shadow-[0_4px_24px_rgba(0,0,0,0.3)]
                         transition-all duration-300 hover:scale-105">
              Explore Activities
            </Button>

            <Button size="lg" variant="outline" onClick={() => navigate("/host/create-experience")} className="w-full sm:w-auto min-w-[200px] h-12 text-base font-semibold sm:h-14 sm:text-lg
                         border-primary bg-primary/10 text-white hover:bg-primary/20 hover:border-primary/80
                         shadow-[0_4px_24px_rgba(0,0,0,0.3)] transition-all duration-300 hover:scale-105">
              Host an experience
            </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} transition={{
          duration: 0.8,
          delay: 1.0
        }} className="mt-8 sm:mt-12 md:mt-16 flex flex-wrap justify-center gap-4 sm:gap-6 md:gap-10 text-white/80">
            <div className="flex items-center gap-2 rounded-full bg-black/25 px-4 py-2 backdrop-blur-sm shadow-sm">
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg">50K+</span>
              <span className="text-xs sm:text-sm md:text-base">Active Members</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-black/25 px-4 py-2 backdrop-blur-sm shadow-sm">
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg">1.2K+</span>
              <span className="text-xs sm:text-sm md:text-base">Monthly Events</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-black/25 px-4 py-2 backdrop-blur-sm shadow-sm">
              <span className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-lg">4.9★</span>
              <span className="text-xs sm:text-sm md:text-base">User Rating</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Fade to Content */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" aria-hidden="true" />
    </section>;
};
export default HeroSection;