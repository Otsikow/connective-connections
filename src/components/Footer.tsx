import { Link } from "react-router-dom";
import {
  Accessibility,
  ArrowUpRight,
  BookOpen,
  Building2,
  CalendarCheck,
  CalendarPlus,
  Clock3,
  Cookie,
  Facebook,
  Globe,
  Handshake,
  Headphones,
  Home,
  Instagram,
  LifeBuoy,
  Linkedin,
  LucideIcon,
  Mail,
  MapPin,
  Megaphone,
  MessageCircle,
  MessageSquare,
  Phone,
  Shield,
  ShieldCheck,
  Sparkles,
  Stars,
  Tiktok,
  Twitter,
  User,
  Users,
  Youtube,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

interface BaseFooterLink {
  label: string;
  icon: LucideIcon;
  description?: string;
}

interface InternalFooterLink extends BaseFooterLink {
  to: string;
  external?: false;
}

interface ExternalFooterLink extends BaseFooterLink {
  href: string;
  external: true;
}

type FooterLink = InternalFooterLink | ExternalFooterLink;

const navSections: { title: string; links: FooterLink[] }[] = [
  {
    title: "Discover",
    links: [
      {
        label: "Home",
        to: "/home",
        icon: Home,
        description: "Personal concierge with curated spotlights and highlights.",
      },
      {
        label: "Events",
        to: "/events",
        icon: CalendarCheck,
        description: "Attend salon dinners, immersive retreats, and pop-up gatherings.",
      },
      {
        label: "Community",
        to: "/community",
        icon: MessageSquare,
        description: "Join conversations, masterminds, and private cohorts.",
      },
      {
        label: "Friend Finder",
        to: "/friend-finder",
        icon: Sparkles,
        description: "Meet members nearby who share your passions and ambitions.",
      },
      {
        label: "Stories",
        href: "https://stories.connective.app",
        icon: BookOpen,
        description: "Spotlights on members and hosts shaping the Connective world.",
        external: true,
      },
    ],
  },
  {
    title: "Membership",
    links: [
      {
        label: "Matches",
        to: "/matches",
        icon: Users,
        description: "Thoughtful introductions crafted by our relationship engine.",
      },
      {
        label: "Messages",
        to: "/messages",
        icon: MessageCircle,
        description: "Stay in touch with your circle and coordinate next meetups.",
      },
      {
        label: "Profile",
        to: "/profile",
        icon: User,
        description: "Showcase your story, preferences, and impact.",
      },
      {
        label: "Dashboard",
        to: "/dashboard",
        icon: Stars,
        description: "Track invitations, membership status, and unlock upgrades.",
      },
      {
        label: "Member Guidelines",
        href: "https://connective.app/guidelines",
        icon: Shield,
        description: "Our code of belonging for an inclusive, respectful community.",
        external: true,
      },
    ],
  },
  {
    title: "Hosts & Partners",
    links: [
      {
        label: "Host Dashboard",
        to: "/host-dashboard",
        icon: Building2,
        description: "Tools for approved hosts and experience designers.",
      },
      {
        label: "Create an Experience",
        to: "/host/create-experience",
        icon: Sparkles,
        description: "Design bespoke journeys in collaboration with our team.",
      },
      {
        label: "Create an Event",
        to: "/host/create-event",
        icon: CalendarPlus,
        description: "Submit a new gathering for the curation committee.",
      },
      {
        label: "Partnerships",
        href: "mailto:partnerships@connective.app",
        icon: Handshake,
        description: "Co-create experiences with brands and cultural institutions.",
        external: true,
      },
    ],
  },
  {
    title: "Support",
    links: [
      {
        label: "Member Concierge",
        href: "mailto:concierge@connective.app",
        icon: Headphones,
        description: "24/7 assistance for itinerary or membership needs.",
        external: true,
      },
      {
        label: "Security Center",
        href: "https://trust.connective.app",
        icon: ShieldCheck,
        description: "View our privacy commitments and compliance badges.",
        external: true,
      },
      {
        label: "Press Inquiries",
        href: "mailto:press@connective.app",
        icon: Megaphone,
        description: "Connect with our communications team.",
        external: true,
      },
      {
        label: "Help Center",
        href: "https://help.connective.app",
        icon: LifeBuoy,
        description: "Guides, FAQs, and tips for making the most of Connective.",
        external: true,
      },
    ],
  },
];

const socialLinks: ExternalFooterLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/connective",
    icon: Linkedin,
    external: true,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/connective",
    icon: Instagram,
    external: true,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@connective",
    icon: Youtube,
    external: true,
  },
  {
    label: "X",
    href: "https://x.com/connective",
    icon: Twitter,
    external: true,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/connective",
    icon: Facebook,
    external: true,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@connective",
    icon: Tiktok,
    external: true,
  },
  {
    label: "Website",
    href: "https://connective.app",
    icon: Globe,
    external: true,
  },
];

const contactDetails: (
  | { icon: LucideIcon; label: string; href?: string }
  | { icon: LucideIcon; label: string; href: string }
)[] = [
  {
    icon: MapPin,
    label: "Operating globally with hubs in New York, London, and Singapore.",
  },
  {
    icon: Phone,
    label: "+1 (844) 555-0199",
    href: "tel:+18445550199",
  },
  {
    icon: Mail,
    label: "hello@connective.app",
    href: "mailto:hello@connective.app",
  },
  {
    icon: Clock3,
    label: "Member services available Monday to Saturday, 8am – 10pm local time.",
  },
  {
    icon: ShieldCheck,
    label: "Enterprise-grade encryption keeps every introduction private.",
  },
];

const legalLinks: { to: string; label: string; icon: LucideIcon }[] = [
  { to: "/privacy", label: "Privacy", icon: Shield },
  { to: "/terms", label: "Terms", icon: BookOpen },
  { to: "/accessibility", label: "Accessibility", icon: Accessibility },
  { to: "/cookies", label: "Cookies", icon: Cookie },
];

export const Footer = () => {
  return (
    <footer className="relative isolate overflow-hidden border-t border-border/60 bg-gradient-to-b from-background via-background/95 to-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-amber-300/15 via-transparent to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-32 top-1/3 h-64 w-64 rounded-full bg-amber-400/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-12 h-72 w-72 rounded-full bg-amber-300/10 blur-3xl"
      />
      <div className="relative mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
        <div className="mb-16 rounded-3xl border border-white/10 bg-card/70 p-8 shadow-[0_25px_60px_-35px_rgba(251,191,36,0.55)] backdrop-blur">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <span className="text-xs font-semibold uppercase tracking-[0.35em] text-muted-foreground/80">
                Join the community
              </span>
              <h2 className="max-w-xl text-2xl font-semibold text-foreground sm:text-3xl">
                Hospitality reimagined for leaders, creators, and innovators who value meaningful connection.
              </h2>
              <p className="max-w-xl text-sm text-muted-foreground">
                Apply to the private membership or collaborate with our team to craft unforgettable experiences for your
                community.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background shadow-lg shadow-amber-500/30 transition hover:-translate-y-0.5 hover:bg-foreground/90"
              >
                Become a member
              </Link>
              <a
                href="mailto:partnerships@connective.app"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border/80 px-5 py-3 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:border-foreground/80 hover:text-foreground"
              >
                Partner with us
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.75fr_1fr_1fr_1fr]">
          <div className="space-y-8">
            <Logo size="sm" tagline="Where meaningful connections begin" showGlow={false} />
            <p className="max-w-md text-sm text-muted-foreground">
              Connective curates transformative encounters for leaders, creators, and innovators who crave deeper community. We bring
              together the right people, in the right rooms, for moments that matter.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-card text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-amber-300/60 hover:text-amber-300 hover:shadow-[0_12px_35px_-12px_rgba(229,180,74,0.65)]"
                  aria-label={label}
                >
                  <Icon className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
                </a>
              ))}
            </div>
          </div>

          {navSections.map((section) => (
            <div key={section.title} className="space-y-5">
              <h3 className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground/80">
                {section.title}
              </h3>
              <ul className="space-y-4">
                {section.links.map((link) => {
                  const Icon = link.icon;
                  const content = (
                    <div className="group flex items-start gap-3 rounded-xl border border-transparent p-3 transition-all duration-200 hover:border-white/10 hover:bg-card/40">
                      <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-amber-200/25 via-amber-100/20 to-amber-300/30 text-amber-600 shadow-inner group-hover:from-amber-200/50 group-hover:to-amber-300/60">
                        <Icon className="h-4 w-4" strokeWidth={2} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">{link.label}</p>
                        {link.description && (
                          <p className="text-xs leading-relaxed text-muted-foreground/80">{link.description}</p>
                        )}
                      </div>
                    </div>
                  );

                  return (
                    <li key={link.label}>
                      {"to" in link ? (
                        <Link to={link.to} className="block">
                          {content}
                        </Link>
                      ) : (
                        <a href={link.href} target="_blank" rel="noreferrer" className="block">
                          {content}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-8 border-t border-dashed border-border pt-8 md:grid-cols-[1.5fr_1fr]">
          <div className="space-y-4">
            <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground/80">Our promise</h4>
            <p className="max-w-3xl text-sm text-muted-foreground">
              Every Connective moment is crafted with cultural sensitivity, accessibility in mind, and a relentless focus on creating
              belonging. We believe hospitality should feel effortless, elegant, and deeply human.
            </p>
          </div>
          <div className="space-y-4 rounded-2xl border border-white/10 bg-card/60 p-6 shadow-[0_20px_50px_-25px_rgba(17,24,39,0.55)]">
            <h4 className="text-sm font-semibold uppercase tracking-[0.3em] text-muted-foreground/70">Get in touch</h4>
            <ul className="space-y-3">
              {contactDetails.map(({ icon: Icon, label, href }) => (
                <li key={label}>
                  {href ? (
                    <a
                      href={href}
                      className="group flex items-start gap-3 text-sm text-muted-foreground transition-colors duration-200 hover:text-foreground"
                    >
                      <Icon className="mt-0.5 h-4 w-4 text-amber-500/80 transition-colors duration-200 group-hover:text-amber-400" />
                      <span>{label}</span>
                    </a>
                  ) : (
                    <div className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Icon className="mt-0.5 h-4 w-4 text-amber-500/80" />
                      <span>{label}</span>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Connective Connections. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {legalLinks.map((link) => (
              <FooterLegalLink key={link.label} {...link} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

interface FooterLegalLinkProps {
  to: string;
  label: string;
  icon: LucideIcon;
}

const FooterLegalLink = ({ to, label, icon: Icon }: FooterLegalLinkProps) => {
  const isInternal = to.startsWith("/");
  const classes = cn(
    "inline-flex items-center gap-1.5 text-xs font-medium transition-colors hover:text-foreground"
  );
  const content = (
    <>
      <Icon className="h-3.5 w-3.5" />
      <span>{label}</span>
    </>
  );

  if (isInternal) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <a href={to} className={classes} target="_blank" rel="noreferrer">
      {content}
    </a>
  );
};

export default Footer;
