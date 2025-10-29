import { useNavigate } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  ArrowRight,
  Calendar,
  Crown,
  HeartHandshake,
  MessageCircle,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Logo } from "@/components/Logo";

const premiumHighlights = [
  {
    icon: Sparkles,
    title: "Intelligent matching",
    description:
      "Meet the people you will genuinely vibe with using AI-assisted chemistry scores.",
  },
  {
    icon: HeartHandshake,
    title: "Community-first events",
    description:
      "Unlock curated gatherings hosted weekly across 25+ cities worldwide.",
  },
  {
    icon: MessageCircle,
    title: "Deeper conversations",
    description:
      "Break the ice with guided prompts and shared interests that get past small talk fast.",
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
  usePageTitle("Welcome to Connective Connections");

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#f8f1e7] via-[#fcf5ec] to-[#f2e3d0] text-slate-900 transition-colors duration-500 dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 dark:text-slate-100">
      {/* Background Gradient Orbs */}
      <div className="absolute inset-0 -z-10 opacity-40 transition-opacity duration-500 dark:opacity-70">
        <div className="absolute inset-y-0 left-1/2 h-[140%] w-[120%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(232,185,86,0.35),_transparent_65%)] blur-3xl dark:bg-[radial-gradient(circle_at_center,_rgba(232,185,86,0.45),_transparent_65%)]" />
        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(243,208,120,0.35)_0%,_transparent_70%)] blur-3xl dark:bg-[radial-gradient(circle,_rgba(89,55,209,0.55)_0%,_transparent_70%)]" />
        <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-[radial-gradient(circle,_rgba(255,163,102,0.3)_0%,_transparent_70%)] blur-3xl dark:bg-[radial-gradient(circle,_rgba(255,163,102,0.4)_0%,_transparent_70%)]" />
      </div>

      {/* Content Wrapper */}
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-16 pt-8 sm:px-10 lg:px-16">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Logo
            size="md"
            tagline="WHERE THE RIGHT PEOPLE MEET"
            taglineClassName="text-[0.6rem] tracking-[0.5em] text-slate-200/80"
            className="scale-[0.92] sm:scale-100"
          />
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 transition-colors dark:text-slate-300 lg:flex">
            <button
              className="transition hover:text-slate-900 dark:hover:text-white"
              onClick={() => navigate("/events")}
            >
              Events
            </button>
            <button
              className="transition hover:text-slate-900 dark:hover:text-white"
              onClick={() => navigate("/community")}
            >
              Community
            </button>
            <button
              className="transition hover:text-slate-900 dark:hover:text-white"
              onClick={() => navigate("/matches")}
            >
              Matching
            </button>
            <button
              className="transition hover:text-slate-900 dark:hover:text-white"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-200 px-5 py-2 text-slate-900 shadow-lg shadow-amber-500/30 transition hover:shadow-xl hover:shadow-amber-400/50 dark:from-amber-400 dark:via-orange-400 dark:to-yellow-300 dark:shadow-amber-500/40"
            >
              Join Connective
              <ArrowRight className="h-4 w-4" />
            </button>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="grid flex-1 gap-16 pt-20 transition-colors lg:grid-cols-[minmax(0,1fr)_420px] lg:pt-28">
          <section className="max-w-2xl space-y-10">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 transition-colors dark:bg-white/10 dark:text-amber-200/90">
                <Crown className="h-3.5 w-3.5" /> Pro perks unlocked
              </span>
              <h1 className="text-4xl font-bold leading-tight text-slate-900 transition-colors sm:text-5xl lg:text-6xl dark:text-white">
                Elevate your connections experience with curated communities and
                unforgettable events.
              </h1>
              <p className="text-lg text-slate-700 transition-colors sm:text-xl dark:text-slate-300">
                Connective is the members-only platform designed to help
                leaders, creators, and connectors build meaningful relationships
                in real life. Discover experiences tailored to your ambitions
                and passions.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => navigate("/signup")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-200 px-8 py-3 text-base font-semibold text-slate-900 shadow-lg shadow-amber-500/30 transition hover:scale-[1.02] hover:shadow-xl hover:shadow-amber-400/50 dark:from-amber-400 dark:via-orange-400 dark:to-yellow-300 dark:shadow-amber-500/40"
              >
                Start your membership
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => navigate("/host-dashboard")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-900/20 px-8 py-3 text-base font-semibold text-slate-900 transition hover:border-slate-900 hover:bg-slate-900/5 dark:border-white/20 dark:text-white dark:hover:border-white dark:hover:bg-white/5"
              >
                Host an experience
              </button>
            </div>

            {/* Stats */}
            <div className="grid gap-6 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-slate-900/10 bg-white/80 p-6 text-center shadow-lg shadow-amber-200/20 backdrop-blur transition-colors dark:border-white/10 dark:bg-white/5 dark:shadow-black/20"
                >
                  <p className="text-3xl font-bold text-slate-900 transition-colors sm:text-4xl dark:text-white">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500 transition-colors dark:text-slate-300/80">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Premium Highlights Sidebar */}
          <aside className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/60 via-white/40 to-transparent blur-2xl transition-colors dark:from-white/20 dark:via-white/10" />
            <div className="relative space-y-6 rounded-3xl border border-slate-900/10 bg-white/80 p-8 shadow-2xl shadow-amber-200/20 backdrop-blur-xl transition-colors dark:border-white/15 dark:bg-slate-900/60 dark:shadow-black/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-amber-600 transition-colors dark:text-amber-200/90">
                    Pro perks
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900 transition-colors dark:text-white">
                    Unlock the full experience
                  </h2>
                </div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-200 text-slate-900 shadow-lg shadow-amber-500/30 transition-colors dark:from-amber-400 dark:via-orange-400 dark:to-yellow-300 dark:shadow-amber-500/40">
                  <Crown className="h-7 w-7" />
                </div>
              </div>

              <div className="space-y-5">
                {premiumHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-4 rounded-2xl border border-slate-900/10 bg-white/70 p-4 transition-colors dark:border-white/10 dark:bg-white/5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-300/30 text-amber-500 transition-colors dark:bg-amber-300/20 dark:text-amber-200">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-slate-900 transition-colors dark:text-white">
                        {item.title}
                      </p>
                      <p className="text-sm text-slate-600 transition-colors dark:text-slate-300">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-slate-900/10 bg-gradient-to-br from-amber-300/20 via-orange-300/10 to-transparent p-6 text-sm text-slate-700 transition-colors dark:border-white/10 dark:text-slate-200">
                <p className="font-semibold text-slate-900 transition-colors dark:text-white">
                  Trust & safety comes first
                </p>
                <p className="mt-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-amber-600 transition-colors dark:text-amber-200/80">
                  <ShieldCheck className="h-4 w-4" /> Verified hosts • Moderated
                  communities
                </p>
              </div>
            </div>
          </aside>
        </main>

        {/* Why Leaders Choose Section */}
        <section className="mt-24 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-3xl border border-slate-900/10 bg-white/80 p-8 shadow-2xl shadow-amber-200/20 backdrop-blur transition-colors dark:border-white/10 dark:bg-white/5 dark:shadow-black/30">
            <h3 className="text-2xl font-semibold text-slate-900 transition-colors dark:text-white">
              Why leaders choose Connective
            </h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-900/10 bg-white/70 p-6 transition-colors dark:border-white/10 dark:bg-slate-900/60">
                <Calendar className="h-6 w-6 text-amber-500 transition-colors dark:text-amber-200" />
                <h4 className="mt-4 text-lg font-semibold text-slate-900 transition-colors dark:text-white">
                  Curated calendar
                </h4>
                <p className="mt-2 text-sm text-slate-600 transition-colors dark:text-slate-300">
                  Attend premium salons, masterminds, and city adventures
                  tailored to your ambitions every week.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-900/10 bg-white/70 p-6 transition-colors dark:border-white/10 dark:bg-slate-900/60">
                <MessageCircle className="h-6 w-6 text-amber-500 transition-colors dark:text-amber-200" />
                <h4 className="mt-4 text-lg font-semibold text-slate-900 transition-colors dark:text-white">
                  Real relationships
                </h4>
                <p className="mt-2 text-sm text-slate-600 transition-colors dark:text-slate-300">
                  Spark deeper conversations before you even arrive with
                  immersive prompts and shared passions.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-900/10 bg-white/70 p-6 transition-colors dark:border-white/10 dark:bg-slate-900/60">
                <HeartHandshake className="h-6 w-6 text-amber-500 transition-colors dark:text-amber-200" />
                <h4 className="mt-4 text-lg font-semibold text-slate-900 transition-colors dark:text-white">
                  Global host network
                </h4>
                <p className="mt-2 text-sm text-slate-600 transition-colors dark:text-slate-300">
                  Access vetted hosts and members across innovation hubs spanning
                  the US, Europe, and Asia.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-900/10 bg-white/70 p-6 transition-colors dark:border-white/10 dark:bg-slate-900/60">
                <Sparkles className="h-6 w-6 text-amber-500 transition-colors dark:text-amber-200" />
                <h4 className="mt-4 text-lg font-semibold text-slate-900 transition-colors dark:text-white">
                  Moments that stay with you
                </h4>
                <p className="mt-2 text-sm text-slate-600 transition-colors dark:text-slate-300">
                  From rooftop tastings to immersive retreats, every event is
                  designed to create lasting memories.
                </p>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="space-y-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-3xl border border-slate-900/10 bg-white/75 p-6 shadow-xl shadow-amber-200/20 backdrop-blur transition-colors dark:border-white/10 dark:bg-white/5 dark:shadow-black/20"
              >
                <p className="text-sm uppercase tracking-[0.3em] text-amber-600 transition-colors dark:text-amber-200/80">
                  Member story
                </p>
                <p className="mt-4 text-lg font-semibold text-slate-900 transition-colors dark:text-white">
                  “{testimonial.quote}”
                </p>
                <p className="mt-6 text-sm font-medium text-amber-600 transition-colors dark:text-amber-100">
                  {testimonial.name} · {testimonial.title}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="mt-20 rounded-3xl border border-slate-900/10 bg-gradient-to-r from-amber-200/40 via-orange-200/20 to-yellow-200/30 p-10 text-slate-900 shadow-2xl shadow-amber-200/30 backdrop-blur transition-colors dark:border-white/10 dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-900 dark:text-slate-100 dark:shadow-black/40">
          <div className="flex flex-col items-start gap-6 text-left sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-700 transition-colors dark:text-amber-200/80">
                Ready to unlock your next chapter?
              </p>
              <h3 className="text-3xl font-semibold text-slate-900 transition-colors sm:text-4xl dark:text-white">
                Join the most intentional community of leaders, innovators, and
                connectors.
              </h3>
              <p className="text-base text-slate-700 transition-colors dark:text-slate-200">
                Claim your invite today and get instant access to
