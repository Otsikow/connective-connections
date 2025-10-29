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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-200 text-slate-900">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-24 top-32 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-200/70 via-sky-100 to-transparent blur-3xl" />
        <div className="absolute right-24 top-16 h-80 w-80 rounded-full bg-gradient-to-br from-amber-200/80 via-orange-100 to-transparent blur-3xl" />
        <div className="absolute bottom-[-6rem] right-[-4rem] h-[22rem] w-[22rem] rounded-full bg-gradient-to-br from-rose-200/60 via-pink-100 to-transparent blur-3xl" />
      </div>

      {/* Content wrapper */}
      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-20 pt-10 sm:px-10 lg:px-16">
        {/* Header */}
        <header className="flex items-center justify-between">
          <Logo
            size="md"
            tagline="WHERE THE RIGHT PEOPLE MEET"
            taglineClassName="text-[0.6rem] tracking-[0.5em] text-slate-500"
            className="scale-[0.92] sm:scale-100"
          />
          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 lg:flex">
            <button
              className="transition hover:text-slate-900"
              onClick={() => navigate("/events")}
            >
              Events
            </button>
            <button
              className="transition hover:text-slate-900"
              onClick={() => navigate("/community")}
            >
              Community
            </button>
            <button
              className="transition hover:text-slate-900"
              onClick={() => navigate("/matches")}
            >
              Matching
            </button>
            <button
              className="transition hover:text-slate-900"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-yellow-300 px-5 py-2 text-slate-900 shadow-lg shadow-amber-300/60 transition hover:shadow-xl hover:shadow-amber-300"
            >
              Join Connective
              <ArrowRight className="h-4 w-4" />
            </button>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="grid flex-1 gap-16 pt-20 lg:grid-cols-[minmax(0,1fr)_480px] lg:pt-28">
          <section className="max-w-2xl space-y-10">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                <Crown className="h-3.5 w-3.5" /> Pro perks unlocked
              </span>
              <h1 className="text-4xl font-bold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Elevate your connections experience with curated communities and unforgettable events.
              </h1>
              <p className="text-lg text-slate-600 sm:text-xl">
                Connective is the members-only platform designed to help leaders, creators, and connectors build meaningful relationships in real life. Discover experiences tailored to your ambitions and passions.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <button
                onClick={() => navigate("/signup")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-200 transition hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-300"
              >
                Start your membership
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => navigate("/host-dashboard")}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-8 py-3 text-base font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-100"
              >
                Host an experience
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {heroHighlights.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-lg shadow-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <p className="text-base font-semibold text-slate-900">
                      {item.title}
                    </p>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Sidebar */}
          <aside className="relative">
            <div className="absolute inset-0 rounded-3xl bg-white/80 shadow-2xl shadow-slate-200" />
            <div className="relative space-y-6 rounded-3xl border border-slate-100 bg-white/90 p-8 shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-indigo-500">
                      Pro perks
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                      Unlock the full experience
                    </h2>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 text-white shadow-lg shadow-indigo-200">
                    <Crown className="h-6 w-6" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[eventsImage, connectionsImage, groupsImage].map((image, index) => (
                    <div
                      key={index}
                      className={`overflow-hidden rounded-2xl border border-slate-100 ${
                        index === 0 ? "col-span-2" : ""
                      }`}
                    >
                      <img
                        src={image}
                        alt="Connective experience"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {premiumHighlights.map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-slate-900">
                        {item.title}
                      </p>
                      <p className="text-sm text-slate-600">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </main>

        {/* Safety section */}
        <section className="mt-24">
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-amber-50 p-6 text-sm text-slate-600">
            <p className="font-semibold text-slate-900">
              Trust & safety comes first
            </p>
            <p className="mt-2 flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-indigo-500">
              <ShieldCheck className="h-4 w-4" /> Verified hosts • Moderated communities
            </p>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mt-24 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-xl shadow-slate-200">
            <h3 className="text-2xl font-semibold text-slate-900">
              Why leaders choose Connective
            </h3>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6">
                <CalendarDays className="h-6 w-6 text-indigo-500" />
                <h4 className="mt-4 text-lg font-semibold text-slate-900">
                  Curated calendar
                </h4>
                <p className="mt-2 text-sm text-slate-600">
                  Attend premium salons, masterminds, and adventures
                  tailored to your ambitions.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6">
                <MessageCircle className="h-6 w-6 text-indigo-500" />
                <h4 className="mt-4 text-lg font-semibold text-slate-900">
                  Real relationships
                </h4>
                <p className="mt-2 text-sm text-slate-600">
                  Spark deeper conversations with immersive prompts and shared passions.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6">
                <HeartHandshake className="h-6 w-6 text-indigo-500" />
                <h4 className="mt-4 text-lg font-semibold text-slate-900">
                  Global host network
                </h4>
                <p className="mt-2 text-sm text-slate-600">
                  Access vetted hosts and members across hubs worldwide.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-6">
                <Sparkles className="h-6 w-6 text-indigo-500" />
                <h4 className="mt-4 text-lg font-semibold text-slate-900">
                  Moments that stay with you
                </h4>
                <p className="mt-2 text-sm text-slate-600">
                  From rooftop tastings to retreats, every event builds lasting memories.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-200"
              >
                <p className="text-sm uppercase tracking-[0.3em] text-indigo-500">
                  Member story
                </p>
                <p className="mt-4 text-lg font-semibold text-slate-900">
                  “{testimonial.quote}”
                </p>
                <p className="mt-6 text-sm font-medium text-slate-600">
                  {testimonial.name} · {testimonial.title}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mt-20 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500 p-[1px] shadow-2xl shadow-slate-300">
          <div className="flex h-full w-full flex-col items-start gap-8 rounded-[calc(theme(borderRadius.3xl)-1px)] bg-white/95 p-10 text-left sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl space-y-4">
              <p className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-500">
                <Users className="h-3.5 w-3.5" /> Ready to unlock your next chapter?
              </p>
              <h3 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                Join the most intentional community of leaders, innovators, and connectors.
              </h3>
              <p className="text-base text-slate-600">
                Claim your invite today and get instant access to exclusive introductions, curated events, and a network that accelerates your growth.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => navigate("/signup")}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-indigo-300 transition hover:scale-105 hover:bg-indigo-500"
              >
                Become a member
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center justify-center rounded-full border border-indigo-200 px-6 py-3 text-base font-semibold text-indigo-600 transition hover:border-indigo-400 hover:bg-indigo-50"
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
