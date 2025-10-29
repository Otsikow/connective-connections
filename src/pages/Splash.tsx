import { useNavigate } from "react-router-dom";
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

const experienceCards = [
  {
    icon: Clock,
    title: "Intimate salons",
    description:
      "Weekly gatherings curated for candid conversation and co-creation with founders, creatives, and investors.",
    detail: "Hosted in penthouses, ateliers, and private clubs across 12 global cities.",
  },
  {
    icon: Map,
    title: "Signature retreats",
    description:
      "Immersive weekends designed for restoration, collaboration, and unlocking your next chapter together.",
    detail: "From Napa estates to coastal hideaways, every itinerary is handcrafted.",
  },
  {
    icon: Users2,
    title: "Priority introductions",
    description:
      "Curated matches backed by neuroscience ensure every connection has the potential to become transformational.",
    detail: "Receive warm intros, mastermind circles, and follow-up playbooks each month.",
  },
];

const journeyHighlights = [
  {
    icon: Sparkles,
    title: "Membership concierge",
    description:
      "A dedicated team architecting your first 90 days with white-glove onboarding and bespoke pathways.",
  },
  {
    icon: Brain,
    title: "Neuroscience-backed matching",
    description:
      "Proprietary chemistry scores align energy, intention, and ambition for every member introduction.",
  },
  {
    icon: Compass,
    title: "Intention frameworks",
    description:
      "Curated prompts, ritualized check-ins, and thematic salons keep every interaction purposeful.",
  },
  {
    icon: MessageCircle,
    title: "Integrated follow-ups",
    description:
      "Momentum continues with guided recaps, warm referrals, and digital salons between in-person gatherings.",
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
  usePageTitle("Connective Connections | Exclusive Membership");

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0f172a] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
        <div className="absolute left-[-10%] top-[-15%] h-[28rem] w-[28rem] rounded-full bg-[#f59e0b]/20 blur-[120px]" />
        <div className="absolute right-[-15%] top-[20%] h-[32rem] w-[32rem] rounded-full bg-[#6366f1]/20 blur-[130px]" />
        <div className="absolute bottom-[-20%] right-[-5%] h-[30rem] w-[30rem] rounded-full bg-[#a855f7]/20 blur-[140px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-4xl flex-col px-6 pb-24 pt-16 sm:px-10 lg:px-0">
        <header className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#fbbf24]/40 bg-[#f59e0b]/10 px-4 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-[#fde68a]">
            Connective Connections
          </span>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.5em] text-gray-400">
            Exclusive Experiential Membership
          </p>
          <h1 className="mt-6 text-balance text-4xl font-semibold leading-tight text-white sm:text-5xl">
            The future of connection is curated.
          </h1>
          <p className="mt-6 max-w-2xl text-pretty text-lg text-gray-300 sm:text-xl">
            Backed by neuroscience and crafted by world-class hosts, Connective orchestrates immersive experiences
            where ambitious humans build relationships that accelerate their impact.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => navigate("/signup")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#fcd34d] via-[#fbbf24] to-[#f59e0b] px-8 py-3 text-sm font-semibold text-[#0f172a] shadow-[0_12px_30px_-12px_rgba(250,204,21,0.6)] transition hover:scale-[1.02]"
            >
              <Sparkles className="h-4 w-4" /> Request an invite
            </button>
            <button
              onClick={() => navigate("/events")}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-700/70 bg-[#1e293b]/70 px-8 py-3 text-sm font-semibold text-gray-200 transition hover:border-gray-600"
            >
              <CalendarDays className="h-4 w-4" /> Explore upcoming salons
            </button>
          </div>
        </header>

        <section className="mt-16">
          <div className="relative overflow-hidden rounded-[2rem] border border-gray-800/60 bg-gradient-to-br from-[#1e293b]/80 via-[#0f172a] to-[#0f172a]">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#f59e0b]/10 via-transparent to-transparent" />
            <img
              src={experienceImage}
              alt="Members connecting"
              className="h-[340px] w-full object-cover opacity-70"
            />
            <div className="absolute inset-0 flex flex-col justify-between p-8 sm:p-10">
              <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-gray-300">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f59e0b]/20 text-[#fde68a]">
                  <Star className="h-4 w-4" />
                </span>
                Connection begins here
              </div>
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.4em] text-gray-400">Immersive storytelling</p>
                <button
                  onClick={() => navigate("/home")}
                  className="inline-flex items-center gap-2 rounded-full border border-[#fcd34d]/40 bg-[#fbbf24]/10 px-6 py-2 text-sm font-semibold text-[#fde68a] transition hover:bg-[#fbbf24]/20"
                >
                  <Play className="h-4 w-4" /> Watch story
                </button>
                <h2 className="text-3xl font-semibold text-white sm:text-4xl">
                  Step inside a world designed for meaningful chemistry.
                </h2>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20 space-y-8">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#fde68a]">Crafted experiences</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold text-white sm:text-4xl">
              Curated experiences crafted for depth.
            </h2>
            <p className="mt-4 text-pretty text-base text-gray-300">
              Every gathering is intentionally designed to foster vulnerability, brilliance, and long-term collaboration.
            </p>
          </div>
          <div className="grid gap-6">
            {experienceCards.map((card) => (
              <div
                key={card.title}
                className="rounded-3xl border border-gray-800/70 bg-[#1e293b]/80 p-8 shadow-[0_25px_60px_-40px_rgba(15,23,42,0.8)]"
              >
                <div className="flex items-start gap-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fbbf24]/15 text-[#fde68a]">
                    <card.icon className="h-6 w-6" />
                  </div>
                  <div className="space-y-3 text-left">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                      <p className="mt-3 text-sm text-gray-300">{card.description}</p>
                    </div>
                    <p className="text-xs uppercase tracking-[0.35em] text-gray-500">{card.detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24 space-y-12">
          <div className="space-y-6 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-gray-800/60 bg-[#1e293b]/80 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-gray-400">
              Your journey
            </span>
            <h2 className="text-balance text-3xl font-semibold text-white sm:text-4xl">
              Your curated journey is guided by experts.
            </h2>
            <p className="mx-auto max-w-2xl text-pretty text-base text-gray-300">
              We combine human insight with proprietary intelligence so every step feels intentional, elevated, and
              uniquely yours.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {journeyStats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-gray-800/60 bg-[#1e293b]/80 p-6 text-left">
                <p className="text-4xl font-semibold text-white">{stat.value}</p>
                <p className="mt-3 text-sm text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {journeyHighlights.map((highlight) => (
              <div
                key={highlight.title}
                className="flex h-full flex-col gap-4 rounded-3xl border border-gray-800/60 bg-[#1e293b]/80 p-6 text-left"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fbbf24]/15 text-[#fde68a]">
                  <highlight.icon className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">{highlight.title}</h3>
                  <p className="text-sm text-gray-300">{highlight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24 space-y-10">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#fde68a]">Member stories</p>
            <h2 className="mt-4 text-balance text-3xl font-semibold text-white sm:text-4xl">What members say.</h2>
            <p className="mt-4 text-pretty text-base text-gray-300">
              Intentionality meets momentum. Hear how Connective members translate chemistry into lasting impact.
            </p>
          </div>
          <div className="grid gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-3xl border border-slate-800/60 bg-slate-900/80 p-8 text-left shadow-[0_25px_60px_-40px_rgba(15,23,42,0.9)]"
              >
                <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
                  <ShieldCheck className="h-4 w-4 text-amber-200" /> Verified member
                </div>
                <p className="mt-6 text-lg text-white">
                  “{testimonial.quote}”
                </p>
                <p className="mt-6 text-sm font-semibold text-slate-400">
                  {testimonial.name} · {testimonial.title}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-24">
          <div className="overflow-hidden rounded-[2rem] border border-[#fbbf24]/40 bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#0f172a] p-[1px]">
            <div className="flex h-full w-full flex-col gap-10 rounded-[calc(theme(borderRadius.4xl)-1px)] bg-[#0f172a]/95 p-10">
              <div className="space-y-4">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#fbbf24]/30 bg-[#fbbf24]/10 px-4 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.4em] text-[#fde68a]">
                  Membership benefits
                </span>
                <h2 className="text-balance text-3xl font-semibold text-white sm:text-4xl">
                  Membership benefits designed to elevate every interaction.
                </h2>
                <p className="max-w-2xl text-pretty text-base text-gray-300">
                  From curated introductions to immersive residencies, every benefit is engineered so your circle, influence,
                  and wellbeing expand in tandem.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {membershipBenefits.map((benefit) => (
                  <div key={benefit} className="flex items-start gap-4 text-left">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fbbf24]/15 text-[#fde68a]">
                      <UserCheck className="h-5 w-5" />
                    </div>
                    <p className="text-sm text-gray-300">{benefit}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => navigate("/signup")}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#fcd34d] via-[#fbbf24] to-[#f59e0b] px-8 py-3 text-sm font-semibold text-[#0f172a] shadow-[0_12px_30px_-12px_rgba(250,204,21,0.6)] transition hover:scale-[1.02]"
                >
                  <ArrowRight className="h-4 w-4" /> Start your application
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-700/70 bg-[#1e293b]/80 px-8 py-3 text-sm font-semibold text-gray-200 transition hover:border-gray-600"
                >
                  <HeartHandshake className="h-4 w-4" /> Already a member?
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Splash;
