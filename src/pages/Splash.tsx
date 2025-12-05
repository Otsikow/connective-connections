import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  ArrowRight,
  Brain,
  CalendarDays,
  Clock,
  Compass,
  HeartHandshake,
  Map,
  MessageCircle,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Users2,
  UserCheck,
} from "lucide-react";
import experienceImage from "@/assets/onboarding-1.png";
import { Logo } from "@/components/Logo";
import { FloatingParallaxCard } from "@/components/FloatingParallaxCard";

const experienceCards = [
  {
    icon: Clock,
    title: "Intimate salons",
    description:
      "Weekly gatherings curated for candid conversation and co-creation with founders, creatives, and investors.",
    detail: "Hosted in penthouses, ateliers, and private clubs across 12 global cities.",
    cta: {
      label: "Explore salons",
      path: "/events",
    },
  },
  {
    icon: Map,
    title: "Signature retreats",
    description:
      "Immersive weekends designed for restoration, collaboration, and unlocking your next chapter together.",
    detail: "From Napa estates to coastal hideaways, every itinerary is handcrafted.",
    cta: {
      label: "Discover retreats",
      path: "/events",
    },
  },
  {
    icon: Users2,
    title: "Priority introductions",
    description:
      "Curated matches backed by neuroscience ensure every connection has the potential to become transformational.",
    detail: "Receive warm intros, mastermind circles, and follow-up playbooks each month.",
    cta: {
      label: "Start connecting",
      path: "/signup",
    },
  },
];

const journeyHighlights = [
  {
    icon: Sparkles,
    title: "Membership concierge",
    description:
      "A dedicated team architecting your first 90 days with white-glove onboarding and bespoke pathways.",
    image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    icon: Brain,
    title: "Neuroscience-backed matching",
    description:
      "Proprietary chemistry scores align energy, intention, and ambition for every member introduction.",
    image: "https://images.unsplash.com/photo-1554328222-26301362453d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    icon: Compass,
    title: "Intention frameworks",
    description:
      "Curated prompts, ritualized check-ins, and thematic salons keep every interaction purposeful.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    icon: MessageCircle,
    title: "Integrated follow-ups",
    description:
      "Momentum continues with guided recaps, warm referrals, and digital salons between in-person gatherings.",
    image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const journeyStats = [
  {
    value: "92%",
    label: "Report transformative collaborations within 60 days",
  },
  {
    value: "48hrs",
    label: "Average time to first curated introduction",
  },
  {
    value: "12",
    label: "Global cities with active Connective hosts",
  },
];

const testimonials = [
  {
    quote:
      "The intentionality is unmatched. Every dinner and retreat unlocked new collaborators and dear friends.",
    name: "Daniela P.",
    title: "Product Designer, NYC",
  },
  {
    quote:
      "Within weeks I had investors, co-builders, and accountability partners who genuinely understood my vision.",
    name: "Ravi N.",
    title: "Founder, SF",
  },
  {
    quote:
      "The neuroscience-led matching paired me with a mentor who helped me scale a global initiative in record time.",
    name: "Leah M.",
    title: "Social Impact Strategist, London",
  },
];

const membershipBenefits = [
  "Curated events in 12 cities with world-class hosts",
  "Monthly mastermind matches aligned to your goals",
  "Private digital salon access with guided prompts",
  "Concierge travel planning for retreats and residencies",
  "Trust & safety protocols led by our member council",
  "Impact reporting so every connection creates momentum",
];

const Splash = () => {
  const navigate = useNavigate();
  const { isLoading, userId } = useSubscription();
  usePageTitle("Connective Connections | Exclusive Membership");

  const showAuthButtons = !isLoading && !userId;

  return (
    <div className="flowmaster-hero relative min-h-screen overflow-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        <div className="absolute left-[-10%] top-[-15%] h-[28rem] w-[28rem] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute right-[-15%] top-[20%] h-[32rem] w-[32rem] rounded-full bg-secondary/20 blur-[130px]" />
        <div className="absolute bottom-[-20%] right-[-5%] h-[30rem] w-[30rem] rounded-full bg-accent/20 blur-[140px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col px-6 pb-24 pt-32 sm:px-10 lg:px-0">
        <header className="flex flex-col items-center text-center">
          <div className="absolute top-0 flex w-full items-center justify-between px-6 py-4 sm:px-10 lg:px-0">
            <Logo size="sm" tagline="By Connective" taglineClassName="hidden sm:inline-flex" />
            {showAuthButtons && (
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm font-semibold text-muted-foreground transition hover:text-foreground"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="rounded-full bg-muted px-4 py-2 text-sm font-semibold text-foreground shadow-lg transition hover:bg-muted/80"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-primary">
            Connective Connections
          </span>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.5em] text-muted-foreground">
            Exclusive Experiential Membership
          </p>
          <h1 className="flowmaster-hero-title mt-6 text-balance text-4xl font-semibold leading-tight sm:text-5xl">
            The future of connection is curated.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
            Backed by neuroscience and crafted by world-class hosts, Connective orchestrates immersive experiences
            where ambitious humans build relationships that accelerate their impact.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={() => navigate("/signup")}
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" /> Request an invite
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/events")}
              className="gap-2"
            >
              <CalendarDays className="h-4 w-4" /> Explore upcoming salons
            </Button>
          </div>
        </header>

        <div className="mt-12">
          <div className="flowmaster-divider" />
        </div>

        <section className="flowmaster-section mt-12">
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
            <img
              src={experienceImage}
              alt="Members connecting"
              className="h-[340px] w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 flex flex-col justify-between p-8 sm:p-10">
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 text-primary">
                  <Star className="h-4 w-4" />
                </span>
                Connection begins here
              </div>
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.4em] text-muted-foreground">Immersive storytelling</p>
                <Button
                  variant="outline"
                  onClick={() => navigate("/home")}
                  className="gap-2 w-fit"
                >
                  <Play className="h-4 w-4" /> Watch story
                </Button>
                <h2 className="text-3xl font-semibold text-foreground sm:text-4xl">
                  Step inside a world designed for meaningful chemistry.
                </h2>
              </div>
            </div>
          </div>
        </section>

        <section className="flowmaster-section mt-16 space-y-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-primary">Crafted experiences</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold text-foreground sm:text-4xl">
              Curated experiences crafted for depth.
            </h2>
            <p className="mt-4 text-pretty text-base text-muted-foreground">
              Every gathering is intentionally designed to foster vulnerability, brilliance, and long-term collaboration.
            </p>
          </div>
          <div className="grid gap-6">
            {experienceCards.map((card) => (
              <FloatingParallaxCard
                key={card.title}
                className="flex flex-col border border-border bg-card p-8 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-start gap-5">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                    <card.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-grow space-y-3 text-left">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{card.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
                    </div>
                    <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground/70">{card.detail}</p>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button
                    variant="ghost"
                    className="inline-flex items-center gap-2 rounded-full text-sm font-semibold text-primary hover:bg-primary/10 hover:text-primary"
                    onClick={() => navigate(card.cta.path)}
                  >
                    {card.cta.label} <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </FloatingParallaxCard>
            ))}
          </div>
        </section>

        <section className="flowmaster-section mt-16 space-y-12">
          <div className="space-y-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-muted-foreground">
              Your journey
            </span>
            <h2 className="text-balance text-3xl font-semibold text-foreground sm:text-4xl">
              Your curated journey is guided by experts.
            </h2>
            <p className="mx-auto max-w-2xl text-pretty text-base text-muted-foreground">
              We combine human insight with proprietary intelligence so every step feels intentional, elevated, and
              uniquely yours.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {journeyStats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-border bg-card p-6 text-left">
                <p className="text-4xl font-semibold text-foreground">{stat.value}</p>
                <p className="mt-3 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {journeyHighlights.map((highlight) => (
              <FloatingParallaxCard
                key={highlight.title}
                className="flex h-full flex-col overflow-hidden border border-border bg-card text-left"
              >
                <img
                  src={highlight.image}
                  alt={highlight.title}
                  className="h-40 w-full object-cover"
                  loading="lazy"
                />
                <div className="space-y-2 p-6">
                  <h3 className="text-lg font-semibold text-foreground">{highlight.title}</h3>
                  <p className="text-sm text-muted-foreground">{highlight.description}</p>
                </div>
              </FloatingParallaxCard>
            ))}
          </div>
        </section>

        <section className="flowmaster-section mt-16 space-y-10">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-primary">Member stories</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold text-foreground sm:text-4xl">What members say.</h2>
            <p className="mt-4 text-pretty text-base text-muted-foreground">
              Intentionality meets momentum. Hear how Connective members translate chemistry into lasting impact.
            </p>
          </div>
          <div className="grid gap-6">
            {testimonials.map((testimonial) => (
              <FloatingParallaxCard
                key={testimonial.name}
                className="border border-border bg-card p-8 text-left shadow-[var(--shadow-card)]"
              >
                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-primary" /> Verified member
                </div>
                <p className="mt-6 text-lg text-foreground">
                  “{testimonial.quote}”
                </p>
                <p className="mt-6 text-sm font-semibold text-muted-foreground">
                  {testimonial.name} · {testimonial.title}
                </p>
              </FloatingParallaxCard>
            ))}
          </div>
        </section>

        <section className="flowmaster-section mt-16">
          <div className="overflow-hidden rounded-[2rem] border border-primary/40 bg-card p-[1px]">
            <div className="flex h-full w-full flex-col gap-10 rounded-[calc(theme(borderRadius.4xl)-1px)] bg-background/95 p-10">
              <div className="space-y-4">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-primary">
                  Membership benefits
                </span>
                <h2 className="text-balance text-3xl font-semibold text-foreground sm:text-4xl">
                  Membership benefits designed to elevate every interaction.
                </h2>
                <p className="max-w-2xl text-pretty text-base text-muted-foreground">
                  From curated introductions to immersive residencies, every benefit is engineered so your circle, influence,
                  and wellbeing expand in tandem.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {membershipBenefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-4 text-left">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
                      <UserCheck className="h-5 w-5" />
                    </div>
                    <p className="text-sm text-muted-foreground">{benefit}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  onClick={() => navigate("/signup")}
                  className="gap-2"
                >
                  <ArrowRight className="h-4 w-4" /> Start your application
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/login")}
                  className="gap-2"
                >
                  <HeartHandshake className="h-4 w-4" /> Already a member?
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Splash;
