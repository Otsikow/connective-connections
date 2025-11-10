import { Link } from "react-router-dom";
import {
  CalendarCheck,
  Home,
  MessageSquare,
  Sparkles,
  Users,
  MapPin,
  Mail,
  ShieldCheck,
  User,
  ClipboardPen,
  Building2,
  Headphones,
  LucideIcon,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
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
    title: "Platform",
    links: [
      {
        label: "Home",
        to: "/home",
        icon: Home,
        description: "Personalized concierge and upcoming spotlights.",
      },
      {
        label: "Events",
        to: "/events",
        icon: CalendarCheck,
        description: "Curated gatherings and immersive experiences.",
      },
      {
        label: "Matches",
        to: "/matches",
        icon: Users,
        description: "Thoughtful introductions powered by our matching engine.",
      },
      {
        label: "Friend Finder",
        to: "/friend-finder",
        icon: Sparkles,
        description: "Find kindred spirits around shared passions.",
      },
      {
        label: "Community",
        to: "/community",
        icon: MessageSquare,
        description: "Member forums, micro-communities, and conversations.",
      },
    ],
  },
  {
    title: "Members",
    links: [
      {
        label: "Profile",
        to: "/profile",
        icon: User,
        description: "Showcase your story, preferences, and impact.",
      },
      {
        label: "Dashboard",
        to: "/dashboard",
        icon: ClipboardPen,
        description: "Insights, membership status, and premium upgrades.",
      },
      {
        label: "Host Hub",
        to: "/host-dashboard",
        icon: Building2,
        description: "Tools for approved hosts and experience designers.",
      },
      {
        label: "Create an Event",
        to: "/host/create-event",
        icon: Sparkles,
        description: "Submit a new gathering for the curation team.",
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
        icon: Mail,
        description: "Connect with our communications team.",
        external: true,
      },
    ],
  },
];

const socialLinks: ExternalFooterLink[] = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/",
    icon: Linkedin,
    external: true,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/",
    icon: Instagram,
    external: true,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/",
    icon: Youtube,
    external: true,
  },
  {
    label: "X",
    href: "https://x.com/",
    icon: Twitter,
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
    icon: Mail,
    label: "hello@connective.app",
    href: "mailto:hello@connective.app",
  },
  {
    icon: ShieldCheck,
    label: "Enterprise-grade encryption keeps every introduction private.",
  },
];

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
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
            <FooterLegalLink to="/privacy" label="Privacy" />
            <FooterLegalLink to="/terms" label="Terms" />
            <FooterLegalLink to="/accessibility" label="Accessibility" />
            <FooterLegalLink to="/cookies" label="Cookies" />
          </div>
        </div>
      </div>
    </footer>
  );
};

interface FooterLegalLinkProps {
  to: string;
  label: string;
}

const FooterLegalLink = ({ to, label }: FooterLegalLinkProps) => {
  const isInternal = to.startsWith("/");
  const classes = cn("transition-colors hover:text-foreground");

  if (isInternal) {
    return (
      <Link to={to} className={classes}>
        {label}
      </Link>
    );
  }

  return (
    <a href={to} className={classes} target="_blank" rel="noreferrer">
      {label}
    </a>
  );
};

export default Footer;
