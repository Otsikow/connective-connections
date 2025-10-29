import { motion } from "framer-motion";
import {
  Calendar,
  CalendarClock,
  Lightbulb,
  MapPin,
  Megaphone,
  NotebookPen,
  Palette,
  PartyPopper,
  ShieldCheck,
  Sparkles,
  Stars,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

import BackButton from "@/components/BackButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

const checklist = [
  {
    title: "Define your experience",
    description: "Clarify the purpose, vibe, and guest capacity so attendees know exactly what to expect.",
    icon: Sparkles,
  },
  {
    title: "Design the flow",
    description: "Outline every moment from arrival to farewell, including transitions and special touches.",
    icon: Palette,
  },
  {
    title: "Prepare resources",
    description: "Gather supplies, confirm collaborators, and document contingencies to keep things smooth.",
    icon: NotebookPen,
  },
  {
    title: "Open the guest list",
    description: "Publish your experience, set expectations, and automate reminders for attendees.",
    icon: Megaphone,
  },
];

const planningTimeline = [
  {
    title: "Sketch the concept",
    description: "Define the theme, mission, and audience. Capture your differentiators and any requirements upfront.",
    time: "Day 1",
    icon: Lightbulb,
  },
  {
    title: "Craft the journey",
    description: "Storyboard arrivals, key moments, and closing rituals. Surface opportunities for interaction and delight.",
    time: "Day 2",
    icon: CalendarClock,
  },
  {
    title: "Logistics & partners",
    description: "Secure your venue, collaborators, and supplies. Confirm timing, roles, and safety details.",
    time: "Day 3",
    icon: Users,
  },
  {
    title: "Publish & promote",
    description: "Set your availability, launch invitations, and automate guest communications for a confident launch.",
    time: "Day 4",
    icon: Megaphone,
  },
];

const hospitalityTouches = [
  {
    title: "Personal welcomes",
    description: "Send a quick video or note confirming attendance and sharing what to bring.",
  },
  {
    title: "Atmosphere cues",
    description: "Use scent, lighting, and playlists to instantly set the tone as guests arrive.",
  },
  {
    title: "Signature moment",
    description: "Plan one surprise or ritual that guests will mention when they talk about your experience.",
  },
  {
    title: "Thoughtful follow-up",
    description: "Share a recap, next steps, or curated resources within 24 hours to keep momentum high.",
  },
];

const supportResources = [
  {
    title: "Host community",
    description: "Swap tactics, request feedback, and find collaborators in our private host forum.",
    action: "Visit community",
  },
  {
    title: "Checklist template",
    description: "Duplicate our notion template with pre-built sections for planning and guest management.",
    action: "Download template",
  },
  {
    title: "Launch review",
    description: "Book a 20-minute review with our team for final polish before you go live.",
    action: "Schedule review",
  },
];

const faqs = [
  {
    question: "How long does it take to publish?",
    answer:
      "Most hosts launch within four focused sessions. Our guided flow keeps you moving while surfacing the essentials.",
  },
  {
    question: "Can I host with a co-creator?",
    answer:
      "Absolutely. Invite collaborators to your workspace so you can assign tasks, share notes, and co-manage guests.",
  },
  {
    question: "What if I need to reschedule?",
    answer:
      "Update the event once and all guests receive an automated, personalized notification with options to confirm again.",
  },
];

const previewExperience = {
  title: "Creative Connection Lab",
  tagline: "A hands-on evening helping hosts polish their most magnetic experiences.",
  date: "Saturday, November 16",
  time: "6:00 PM – 9:00 PM",
  location: "The Atelier Loft · Brooklyn, NY",
  capacity: "Ideal for 12 curious guests",
  category: "Community experience",
  highlights: [
    "Clarify the transformation your guests will feel.",
    "Design an engaging, chapter-based flow with connection prompts.",
    "Capture hospitality touches that encourage effortless belonging.",
  ],
  flow: [
    "Warm arrivals with sensory cues and guided intros.",
    "Interactive workshop to prototype key guest moments.",
    "Collective reflection with call-to-action for next steps.",
  ],
  essentials: [
    "Ambient playlist & scent pairings",
    "Workshop materials for 12 guests",
    "Two co-hosts confirmed",
  ],
};

const HostCreateExperience = () => {
  return (
    <div className="min-h-screen bg-[#f8f1e7] px-4 py-8 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mx-auto flex w-full max-w-6xl flex-col gap-12"
      >
        <BackButton
          fallbackPath="/host-dashboard"
          className="w-fit gap-2 rounded-full bg-white/70 px-4 py-2 text-muted-foreground shadow-sm backdrop-blur"
        >
          Back
        </BackButton>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <div className="space-y-8">
            <div className="space-y-4">
              <Badge className="rounded-full bg-[#efe0cf] px-4 py-1 text-sm font-medium text-[#6d5433]">
                Host toolkit
              </Badge>
              <div className="space-y-4">
                <h1 className="text-3xl font-semibold text-[#2d2214] sm:text-4xl">
                  Create a Hosted Experience
                </h1>
                <p className="text-base leading-relaxed text-[#6d5433] sm:text-lg">
                  Craft a memorable gathering, add your signature touches, and publish it for the right guests. We&apos;ll
                  guide you through the essentials.
                </p>
              </div>
            </div>

            <div className="grid gap-4 rounded-3xl border border-dashed border-[#ddcdb8] bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-[#2d2214]">Quality host checklist</h2>
                  <p className="text-sm text-[#755a37]">Events that complete every step convert 3x more bookings.</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {checklist.map((item) => (
                  <div
                    key={item.title}
                    className="flex gap-3 rounded-2xl border border-[#efe0cf] bg-white/60 p-4"
                  >
                    <div className="mt-0.5">
                      <item.icon className="h-5 w-5 text-[#b58a57]" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-[#2d2214]">{item.title}</p>
                      <p className="text-sm text-[#755a37]">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-4 rounded-3xl border border-[#ddcdb8] bg-[#fdf8f2]/80 p-6 shadow-sm backdrop-blur">
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-wide text-[#b58a57]">Launch support</p>
              <h3 className="text-xl font-semibold text-[#2d2214]">Perfect your experience</h3>
              <p className="text-sm leading-relaxed text-[#755a37]">
                Get personal feedback, curated resources, and co-host connections tailored to the vibe you want to set.
              </p>
            </div>
            <div className="grid gap-3">
              {supportResources.map((resource) => (
                <div key={resource.title} className="rounded-2xl border border-[#efe0cf] bg-white/70 p-4">
                  <p className="text-sm font-semibold text-[#2d2214]">{resource.title}</p>
                  <p className="mt-1 text-sm text-[#755a37]">{resource.description}</p>
                  <Button variant="ghost" className="mt-3 h-auto px-0 text-sm font-semibold text-[#8f6636]">
                    {resource.action} →
                  </Button>
                </div>
              ))}
            </div>
              <div className="rounded-2xl bg-gradient-to-r from-[#f8e5cf] to-[#f6d7b8] p-5 text-[#2d2214]">
                <h4 className="text-sm font-semibold">Ready to publish?</h4>
                <p className="mt-1 text-sm text-[#604527]">Open the step-by-step builder and we&apos;ll save your progress automatically.</p>
                <Button asChild className="mt-4 w-full rounded-full bg-[#2d2214] text-white hover:bg-[#3c2e1b]">
                  <Link to="/host/create-event">Start building</Link>
                </Button>
              </div>
          </aside>
        </section>

        <section className="rounded-3xl border border-[#ddcdb8] bg-white/80 p-6 shadow-sm backdrop-blur sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Badge className="rounded-full bg-[#efe0cf] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[#6d5433]">
                Planning flow
              </Badge>
              <h2 className="text-2xl font-semibold text-[#2d2214]">Four focused sessions to launch</h2>
              <p className="text-sm text-[#755a37]">
                Follow this timeline to keep momentum. Each session has prompts and checklists embedded in the builder.
              </p>
            </div>
            <div className="flex items-center gap-4 rounded-full bg-[#2d2214] px-5 py-2 text-white">
              <Stars className="h-5 w-5" />
              <p className="text-sm font-medium">Hosts who plan weekly see 92% positive feedback</p>
            </div>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {planningTimeline.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.05 }}
                className="group relative overflow-hidden rounded-3xl border border-[#efe0cf] bg-white/70 p-5"
              >
                <div className="absolute inset-0 rounded-3xl border border-transparent transition group-hover:border-[#caa77d]" />
                <div className="relative space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f6e3ce] text-[#8f6636]">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div className="text-sm font-semibold uppercase tracking-wide text-[#b58a57]">{step.time}</div>
                  <h3 className="text-lg font-semibold text-[#2d2214]">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-[#755a37]">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[minmax(0,3fr)_2fr]">
          <div className="rounded-3xl border border-[#ddcdb8] bg-white/75 p-6 shadow-sm backdrop-blur sm:p-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <Badge className="rounded-full bg-[#efe0cf] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[#6d5433]">
                  Hospitality touches
                </Badge>
                <h2 className="mt-3 text-2xl font-semibold text-[#2d2214]">Moments that make guests feel cared for</h2>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-[#2d2214] px-4 py-2 text-xs font-medium uppercase tracking-wide text-[#f8f1e7]">
                <PartyPopper className="h-4 w-4" />
                <span>Delight index</span>
              </div>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {hospitalityTouches.map((item) => (
                <div key={item.title} className="rounded-2xl border border-[#efe0cf] bg-[#fdf8f2] p-5">
                  <h3 className="text-base font-semibold text-[#2d2214]">{item.title}</h3>
                  <p className="mt-2 text-sm text-[#755a37]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex h-full flex-col gap-6">
            <div className="rounded-3xl border border-[#ddcdb8] bg-gradient-to-br from-white/90 via-white/70 to-[#f5dfc5] p-6 shadow-sm backdrop-blur">
              <h3 className="text-lg font-semibold text-[#2d2214]">Experience snapshot</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#755a37]">
                Collect the essentials so your listing is rich with context before guests even ask.
              </p>
              <div className="mt-4 space-y-3 text-sm text-[#6d5433]">
                <SnapshotItem label="Core promise" value="What transformation or feeling will guests leave with?" />
                <SnapshotItem label="Guest journey" value="Outline three chapters or beats that anchor the experience." />
                <SnapshotItem label="Host signature" value="Add a tradition, story, or skill you uniquely bring." />
                <SnapshotItem label="Readiness check" value="List must-have supplies, partners, and timing cues." />
              </div>
            </div>
            <div className="rounded-3xl border border-[#ddcdb8] bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f6e3ce] text-[#8f6636]">
                  <Stars className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-[#2d2214]">Feedback loop</h3>
                  <p className="text-sm text-[#755a37]">
                    Share a draft with a mentor or past guest. Aim for three actionable suggestions before you go live.
                  </p>
                  <Button variant="ghost" className="h-auto px-0 text-sm font-semibold text-[#8f6636]">
                    Request feedback →
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-3xl border border-[#ddcdb8] bg-white/80 p-6 shadow-sm backdrop-blur sm:p-10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <Badge className="rounded-full bg-[#efe0cf] px-3 py-1 text-xs font-medium uppercase tracking-wide text-[#6d5433]">
                  FAQ
                </Badge>
                <h2 className="text-2xl font-semibold text-[#2d2214]">Answer guest questions before they ask</h2>
                <p className="text-sm text-[#755a37]">Use these prompts in your listing to set expectations and build trust right away.</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="rounded-full bg-[#2d2214] px-6 text-white hover:bg-[#3c2e1b]">Preview listing</Button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl overflow-hidden rounded-3xl border-0 p-0">
                  <DialogHeader className="space-y-1 bg-[#2d2214] px-6 py-6 text-left text-white sm:px-8">
                    <DialogTitle className="text-2xl font-semibold">{previewExperience.title}</DialogTitle>
                    <DialogDescription className="text-sm text-white/80">
                      {previewExperience.tagline}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-0 bg-white sm:grid-cols-[1.6fr_1fr]">
                    <div className="space-y-6 px-6 py-6 sm:px-8">
                      <div className="space-y-2">
                        <div className="flex flex-wrap gap-3 text-sm text-[#6d5433]">
                          <span className="flex items-center gap-2 rounded-full bg-[#f3e5d2] px-3 py-1 font-medium">
                            <Calendar className="h-4 w-4 text-[#8f6636]" /> {previewExperience.date}
                          </span>
                          <span className="flex items-center gap-2 rounded-full bg-[#f3e5d2] px-3 py-1 font-medium">
                            <CalendarClock className="h-4 w-4 text-[#8f6636]" /> {previewExperience.time}
                          </span>
                          <span className="flex items-center gap-2 rounded-full bg-[#f3e5d2] px-3 py-1 font-medium">
                            <MapPin className="h-4 w-4 text-[#8f6636]" /> {previewExperience.location}
                          </span>
                        </div>
                        <p className="text-sm text-[#6d5433]">{previewExperience.capacity}</p>
                      </div>
                      <div className="rounded-2xl border border-[#efe0cf] bg-[#fdf8f2] p-5 text-sm text-[#604527]">
                        <p className="font-semibold uppercase tracking-wide text-[#b58a57]">What guests will love</p>
                        <ul className="mt-3 space-y-2 list-disc pl-5">
                          {previewExperience.highlights.map((highlight) => (
                            <li key={highlight}>{highlight}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-4">
                        <p className="text-sm font-semibold uppercase tracking-wide text-[#b58a57]">Experience flow</p>
                        <div className="space-y-3">
                          {previewExperience.flow.map((step) => (
                            <div
                              key={step}
                              className="rounded-2xl border border-[#efe0cf] bg-white/80 px-4 py-3 text-sm text-[#604527]"
                            >
                              {step}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-6 border-t border-[#f0e2cf] bg-[#f9f2e8] px-6 py-6 sm:border-l sm:border-t-0 sm:px-6 sm:py-8">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#b58a57]">Category</p>
                        <p className="text-sm font-medium text-[#2d2214]">{previewExperience.category}</p>
                      </div>
                      <Separator className="bg-[#ead8c1]" />
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#b58a57]">Readiness checklist</p>
                        <ul className="space-y-2 text-sm text-[#604527]">
                          {previewExperience.essentials.map((essential) => (
                            <li key={essential} className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-[#c7924a]" />
                              <span>{essential}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Separator className="bg-[#ead8c1]" />
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#b58a57]">Next step</p>
                        <p className="text-sm text-[#604527]">
                          Capture these details in your listing draft so guests can envision the experience before booking.
                        </p>
                        <Button asChild className="mt-2 w-full rounded-full bg-[#2d2214] text-white hover:bg-[#3c2e1b]">
                          <Link to="/host/create-event">Open builder</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {faqs.map((faq) => (
              <div key={faq.question} className="flex flex-col gap-2 rounded-2xl border border-[#efe0cf] bg-white/70 p-5">
                <h3 className="text-base font-semibold text-[#2d2214]">{faq.question}</h3>
                <p className="text-sm text-[#755a37]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </motion.div>
    </div>
  );
};

interface SnapshotItemProps {
  label: string;
  value: string;
}

const SnapshotItem = ({ label, value }: SnapshotItemProps) => {
  return (
    <div className="rounded-2xl border border-dashed border-[#e7d4bc] bg-white/70 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#b58a57]">{label}</p>
      <p className="mt-1 text-sm text-[#604527]">{value}</p>
    </div>
  );
};

export default HostCreateExperience;
