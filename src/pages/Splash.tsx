import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  Crown,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const premiumHighlights = [
  {
    icon: Sparkles,
    title: "Intelligent matching",
    description: "Meet the people you will genuinely vibe with using AI-assisted chemistry scores.",
  },
  {
    icon: HeartHandshake,
    title: "Community-first events",
    description: "Unlock curated gatherings hosted weekly across 25+ cities worldwide.",
  },
  {
    icon: MessageCircle,
    title: "Deeper conversations",
    description: "Break the ice with guided prompts and shared interests that get past small talk fast.",
  },
];

const stats = [
  { label: "Members worldwide", value: "120K+" },
  { label: "Meaningful connections", value: "2.4M" },
  { label: "Average meetup rating", value: "4.9/5" },
];

const testimonials = [
  {
    name: "Daniela P.",
    title: "Product Designer, NYC",
    quote:
      "I met my closest circle through Connective. The community is electric and the events are unmatched.",
  },
  {
    name: "Ravi N.",
    title: "Startup Founder, SF",
    quote:
      "Priority introductions paired me with collaborators that helped me triple my customer base in 60 days.",
  },
];

const Splash = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 -z-10 opacity-70">
        <div className="absolute inset-y-0 left-1/2 h-[140%] w-[120%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(232,185,86,0.45),_transparent_65%)] blur-3xl" />
        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(89,55,209,0.55)_0%,_transparent_70%)] blur-3xl" />
        <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-[radial-gradient(circle,_rgba(255,163,102,0.4)_0%,_transparent_70%)] blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-16 pt-8 sm:px-10 lg:px-16">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-lg font-semibold">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white text-slate-900 shadow-lg shadow-yellow-400/30 ring-1 ring-white/30">
              <img src="/pwa-icon.svg" alt="Connective logo" className="h-12 w-12 object-contain" loading="lazy" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Connective</p>
              <p className="text-base font-medium text-slate-200">Where the right people meet</p>
            </div>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 lg:flex">
            <button className="transition hover:text-white" onClick={() => navigate("/events")}>
              Events
            </button>
            <button className="transition hover:text-white" onClick={() => navigate("/community")}>
              Community
            </button>
            <button className="transition hover:text-white" onClick={() => navigate("/matches")}>
              Matching
            </button>
            <button className="transition hover:text-white" onClick={() => navigate("/login")}>
              Sign in
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 px-5 py-2 text-slate-900 shadow-lg shadow-amber-500/40 transition hover:shadow-xl hover:shadow-amber-400/50"
            >
              Join Connective
              <ArrowRight className="h-4 w-4" />
            </button>
          </nav>
        </header>

        <main className="grid flex-1 gap-16 pt-20 lg:grid-cols-[minmax(0,1fr)_420px] lg:pt-28">
          <section className="max-w-2xl space-y-10">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/90">
                <Crown className="h-3.5 w-3.5" /> Pro perks unlocked
              </span>
              <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                Elevate your connections experience with curated communities and unforgettable events.
              </h1>
              <p className="text-lg text-slate-300 sm:text-xl">
                Connective is the members-only platform designed to help leaders, creators, and connectors build
                meaningful relationships in real life. Discover experiences tailored to your ambitions and passions.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => navigate("/signup")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 px-8 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-amber-500/40 transition hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-400/50"
              >
                Start your membership
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => navigate("/host-dashboard")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-8 py-3 text-base font-semibold text-white transition hover:border-white hover:bg-white/5"
              >
                Host an experience
              </button>
            </div>
            <div className="grid gap-6 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center shadow-lg shadow-black/20 backdrop-blur"
                >
                  <p className="text-3xl font-bold text-white sm:text-4xl">{stat.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-300/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          <aside className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-transparent blur-2xl" />
            <div className="relative space-y-6 rounded-3xl border border-white/15 bg-slate-900/60 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-amber-200/90">Pro perks</p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">Unlock the full experience</h2>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 text-slate-900 shadow-lg shadow-amber-500/40">
                  <Crown className="h-7 w-7" />
                </div>
              </div>
              <div className="space-y-5">
                {premiumHighlights.map((item) => (
                  <div key={item.title} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-300/20 text-amber-200">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white">{item.title}</p>
                      <p className="text-sm text-slate-300">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-amber-400/20 via-orange-400/10 to-transparent p-6 text-sm text-slate-200">
                <p className="font-semibold text-white">Trust & safety comes first</p>
                <p className="mt-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-amber-200/80">
                  <ShieldCheck className="h-4 w-4" /> Verified hosts • Moderated communities
                </p>
              </div>
            </div>
          </aside>
        </main>

        <section className="mt-24 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur">
            <h3 className="text-2xl font-semibold text-white">Why leaders choose Connective</h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
                <Calendar className="h-6 w-6 text-amber-200" />
                <h4 className="mt-4 text-lg font-semibold text-white">Curated calendar</h4>
                <p className="mt-2 text-sm text-slate-300">
                  Attend premium salons, masterminds, and city adventures tailored to your ambitions every week.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
                <MessageCircle className="h-6 w-6 text-amber-200" />
                <h4 className="mt-4 text-lg font-semibold text-white">Real relationships</h4>
                <p className="mt-2 text-sm text-slate-300">
                  Spark deeper conversations before you even arrive with immersive prompts and shared passions.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
                <HeartHandshake className="h-6 w-6 text-amber-200" />
                <h4 className="mt-4 text-lg font-semibold text-white">Global host network</h4>
                <p className="mt-2 text-sm text-slate-300">
                  Access vetted hosts and members across innovation hubs spanning the US, Europe, and Asia.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
                <Sparkles className="h-6 w-6 text-amber-200" />
                <h4 className="mt-4 text-lg font-semibold text-white">Moments that stay with you</h4>
                <p className="mt-2 text-sm text-slate-300">
                  From rooftop tastings to immersive retreats, every event is designed to create lasting memories.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20 backdrop-blur">
                <p className="text-sm uppercase tracking-[0.3em] text-amber-200/80">Member story</p>
                <p className="mt-4 text-lg font-semibold text-white">“{testimonial.quote}”</p>
                <p className="mt-6 text-sm font-medium text-amber-100">
                  {testimonial.name} · {testimonial.title}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 rounded-3xl border border-white/10 bg-gradient-to-r from-amber-400/20 via-orange-400/10 to-yellow-300/20 p-10 text-slate-900 shadow-2xl shadow-amber-300/20 backdrop-blur">
          <div className="flex flex-col items-start gap-6 text-left sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-900/70">Ready to unlock your next chapter?</p>
              <h3 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                Join the most intentional community of leaders, innovators, and connectors.
              </h3>
              <p className="text-base text-slate-800">
                Claim your invite today and get instant access to exclusive introductions, curated events, and a network
                that accelerates your growth.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/signup")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-base font-semibold text-amber-200 shadow-lg shadow-slate-900/30 transition hover:scale-105"
              >
                Become a member
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center justify-center rounded-full border border-slate-900/40 px-6 py-3 text-base font-semibold text-slate-900 transition hover:border-slate-900"
              >
                I already have an account
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Splash;
