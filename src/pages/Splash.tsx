import { useNavigate } from "react-router-dom";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  ArrowRight,
  CalendarDays,
  Crown,
  HeartHandshake,
  MessageCircle,
  MessagesSquare,
  ShieldCheck,
  Sparkles,
  Users,
  UserPlus,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import eventsImage from "@/assets/onboarding-1.png";
import connectionsImage from "@/assets/onboarding-2.png";
import groupsImage from "@/assets/onboarding-3.png";

const heroHighlights = [
  {
    icon: CalendarDays,
    title: "World-class events",
    description:
      "Join salons, retreats, and masterminds hosted by tastemakers in every major innovation hub.",
  },
  {
    icon: Users,
    title: "Find your circle",
    description:
      "Discover people who match your energy with chemistry scores and curated introductions.",
  },
  {
    icon: MessagesSquare,
    title: "Always-on chats",
    description:
      "Drop into themed channels and keep the momentum going long after the event ends.",
  },
  {
    icon: UserPlus,
    title: "Launch private groups",
    description:
      "Spin up your own mastermind or interest club with moderation tools built for leaders.",
  },
];

const premiumHighlights = [
  {
    icon: Sparkles,
    title: "Concierge onboarding",
    description:
      "Get a tailored welcome plan and handpicked member intros from our community team.",
  },
  {
    icon: HeartHandshake,
    title: "Verified hosts",
    description:
      "Every experience is led by trusted facilitators who champion safe, inclusive spaces.",
  },
  {
    icon: MessageCircle,
    title: "Guided conversations",
    description:
      "Arrive prepared with prompts, conversation starters, and curated follow-up connections.",
  },
];

const capabilityCards = [
  {
    title: "Signature events calendar",
    description:
      "Reserve your spot at invite-only gatherings designed to stretch your thinking and grow your network.",
    icon: CalendarDays,
    image: eventsImage,
    badge: "Events",
  },
  {
    title: "Find friends with intent",
    description:
      "Match with founders, creatives, and operators who mirror your pace and passions.",
    icon: Users,
    image: connectionsImage,
    badge: "Connections",
  },
  {
    title: "Meaningful chats",
    description:
      "Drop into moderated channels that keep ideas flowing between IRL meetups.",
    icon: MessagesSquare,
    image: connectionsImage,
    badge: "Chats",
  },
  {
    title: "Create your own groups",
    description:
      "Build private spaces, set the vibe, and invite collaborators to grow alongside you.",
    icon: UserPlus,
    image: groupsImage,
    badge: "Groups",
  },
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
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Background gradients */}
      <div className="absolute inset-0 -z-10 opacity-70">
        <div className="absolute inset-y-0 left-1/2 h-[140%] w-[120%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,_rgba(232,185,86,0.45),_transparent_65%)] blur-3xl" />
        <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(89,55,209,0.55)_0%,_transparent_70%)] blur-3xl" />
        <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-[radial-gradient(circle,_rgba(255,163,102,0.4)_0%,_transparent_70%)] blur-3xl" />
      </div>

      {/* Content wrapper */}
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-16 pt-8 sm:px-10 lg:px-16">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Logo
            size="md"
            tagline="WHERE THE RIGHT PEOPLE MEET"
            taglineClassName="text-[0.6rem] tracking-[0.5em] text-slate-200/80"
            className="scale-[0.92] sm:scale-100"
          />
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-300 lg:flex">
            <button
              className="transition hover:text-white"
              onClick={() => navigate("/events")}
            >
              Events
            </button>
            <button
              className="transition hover:text-white"
              onClick={() => navigate("/community")}
            >
              Community
            </button>
            <button
              className="transition hover:text-white"
              onClick={() => navigate("/matches")}
            >
              Matching
            </button>
            <button
              className="transition hover:text-white"
              onClick={() => navigate("/login")}
            >
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

        {/* Main Hero */}
        <main className="grid flex-1 gap-16 pt-20 lg:grid-cols-[minmax(0,1fr)_480px] lg:pt-28">
          <section className="max-w-2xl space-y-10">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-200/90">
                <Crown className="h-3.5 w-3.5" /> Pro perks unlocked
              </span>
              <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                Elevate your connections experience with curated communities,
                unforgettable events, and friends who get you.
              </h1>
              <p className="text-lg text-slate-300 sm:text-xl">
                Connective is the members-only platform designed to help leaders, creators, and connectors build meaningful
                relationships in real life. Discover experiences tailored to your ambitions, then keep the momentum going with
                dynamic chats and private groups.
              </p>
            </div>

            {/* CTA buttons */}
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

            <div className="grid gap-4 sm:grid-cols-2">
              {heroHighlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/10 backdrop-blur"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300/20 text-amber-200">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <p className="text-base font-semibold text-white">{item.title}</p>
                  </div>
                  <p className="mt-3 text-sm text-slate-300">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Visualized experience highlights */}
          <section className="relative">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-transparent blur-2xl" />
            <div className="relative grid gap-5 rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 sm:col-span-2">
                <img
                  src={eventsImage}
                  alt="Members gathered at an immersive Connective rooftop event"
                  className="h-64 w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute inset-x-6 bottom-6 space-y-2 text-left">
                  <span className="inline-flex items-center rounded-full bg-amber-400/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-900">
                    Events
                  </span>
                  <p className="text-xl font-semibold text-white">Immersive rooftop salons every week</p>
                  <p className="text-sm text-slate-200">
                    Secure your spot at curated gatherings that pair bold ideas with unforgettable venues.
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 p-6">
                <img
                  src={connectionsImage}
                  alt="Two new friends connecting through the Connective app"
                  className="absolute inset-0 h-full w-full object-cover opacity-50 transition duration-700 group-hover:scale-110 group-hover:opacity-60"
                />
                <div className="relative space-y-3">
                  <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-200/90">
                    Find friends
                  </span>
                  <p className="text-lg font-semibold text-white">Chemistry scores that match your vibe</p>
                  <p className="text-sm text-slate-200">
                    Swipe less, connect faster with intros curated around what matters to you.
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 p-6">
                <img
                  src={connectionsImage}
                  alt="Connective members chatting in a group thread"
                  className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-700 group-hover:scale-110 group-hover:opacity-55"
                />
                <div className="relative space-y-3">
                  <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-200/90">
                    Chats
                  </span>
                  <p className="text-lg font-semibold text-white">Keep the conversation flowing</p>
                  <p className="text-sm text-slate-200">
                    Drop into curated channels for travel hacks, deal flow, wellness rituals, and more.
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/60 p-6 sm:col-span-2">
                <img
                  src={groupsImage}
                  alt="A host facilitating a private Connective mastermind"
                  className="absolute inset-0 h-full w-full object-cover opacity-50 transition duration-700 group-hover:scale-110 group-hover:opacity-60"
                />
                <div className="relative space-y-3">
                  <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-200/90">
                    Groups
                  </span>
                  <p className="text-lg font-semibold text-white">Launch a space that feels like yours</p>
                  <p className="text-sm text-slate-200">
                    Host masterminds, creator labs, or neighborhood crews with tools that make moderating effortless.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <section className="mt-24 space-y-12">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {capabilityCards.map((card) => (
              <div
                key={card.title}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-700 group-hover:scale-110 group-hover:opacity-55"
                />
                <div className="relative flex h-full flex-col justify-between gap-6">
                  <span className="inline-flex w-fit items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-amber-200/90">
                    {card.badge}
                  </span>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300/20 text-amber-200">
                        <card.icon className="h-5 w-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{card.title}</h3>
                    </div>
                    <p className="text-sm text-slate-200">{card.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.4fr_minmax(0,1fr)]">
            <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-amber-200/80">Membership designed for momentum</p>
                <h2 className="mt-3 text-3xl font-semibold text-white">Everything you need to build deeper connections</h2>
                <p className="mt-3 text-sm text-slate-200">
                  From the first hello to your next big collaboration, Connective gives you the structure, support, and
                  storytelling to grow relationships that matter.
                </p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {premiumHighlights.map((item) => (
                  <div key={item.title} className="rounded-2xl border border-white/10 bg-slate-950/60 p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-300/20 text-amber-200">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-base font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm text-slate-300">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between gap-6 rounded-3xl border border-white/10 bg-gradient-to-br from-amber-400/20 via-orange-400/10 to-yellow-300/20 p-8 text-slate-900 shadow-2xl shadow-amber-200/20">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-900/70">Built with trust</p>
                <h3 className="mt-3 text-2xl font-semibold text-slate-900">Safety and belonging on every level</h3>
                <p className="mt-3 text-sm text-slate-800">
                  Verified hosts, moderation tools, and real human support ensure that every introduction feels intentional and
                  safe.
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-5 py-4 text-slate-900 shadow-lg shadow-amber-200/40">
                <ShieldCheck className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.3em]">Verified &amp; curated</p>
                  <p className="text-xs text-slate-700">Background checks • Code of conduct • Dedicated community team</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials + Why Choose */}
        <section className="mt-24 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur">
            <h3 className="text-2xl font-semibold text-white">
              Why leaders choose Connective
            </h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
                <CalendarDays className="h-6 w-6 text-amber-200" />
                <h4 className="mt-4 text-lg font-semibold text-white">Curated event programming</h4>
                <p className="mt-2 text-sm text-slate-300">
                  From supper clubs to venture salons, every experience is intentionally crafted to spark meaningful collisions.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
                <Users className="h-6 w-6 text-amber-200" />
                <h4 className="mt-4 text-lg font-semibold text-white">Find aligned friends faster</h4>
                <p className="mt-2 text-sm text-slate-300">
                  Priority introductions and shared affinities help you build a circle that feels like home.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
                <MessagesSquare className="h-6 w-6 text-amber-200" />
                <h4 className="mt-4 text-lg font-semibold text-white">Chats with real momentum</h4>
                <p className="mt-2 text-sm text-slate-300">
                  Curated channels and guided prompts keep conversations rich long after the night ends.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-6">
                <UserPlus className="h-6 w-6 text-amber-200" />
                <h4 className="mt-4 text-lg font-semibold text-white">Create bespoke groups</h4>
                <p className="mt-2 text-sm text-slate-300">
                  Launch masterminds, studios, or neighborhood collectives with tools built for intentional hosts.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20 backdrop-blur"
              >
                <p className="text-sm uppercase tracking-[0.3em] text-amber-200/80">
                  Member story
                </p>
                <p className="mt-4 text-lg font-semibold text-white">
                  “{testimonial.quote}”
                </p>
                <p className="mt-6 text-sm font-medium text-amber-100">
                  {testimonial.name} · {testimonial.title}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-20 rounded-3xl border border-white/10 bg-gradient-to-r from-amber-400/20 via-orange-400/10 to-yellow-300/20 p-10 text-slate-900 shadow-2xl shadow-amber-300/20 backdrop-blur">
          <div className="flex flex-col items-start gap-6 text-left sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <div className="max-w-2xl space-y-3">
              <p className="text-xs uppercase tracking-[0.4em] text-slate-900/70">
                Ready to unlock your next chapter?
              </p>
              <h3 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                Join the most intentional community of leaders, innovators, and connectors.
              </h3>
              <p className="text-base text-slate-800">
                Claim your invite today and get instant access to exclusive introductions, curated events, and a network that accelerates your growth.
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
