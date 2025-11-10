import { Fragment } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { LegalLayout } from "./LegalLayout";

const sections = [
  {
    title: "Our commitment",
    paragraphs: [
      "Connective experiences are designed so every member can participate fully and comfortably. We follow WCAG 2.2 AA guidelines and collaborate with accessibility partners to audit both our physical events and digital products.",
    ],
  },
  {
    title: "Digital accessibility",
    paragraphs: [
      "Our engineering and design teams bake accessibility into each release. From semantic HTML to closed captioning, we continuously test with assistive technologies to ensure a seamless experience.",
    ],
    listTitle: "Highlights",
    listItems: [
      "Keyboard- and screen-reader-friendly navigation across web and mobile.",
      "High-contrast themes with adjustable text sizing for improved readability.",
      "Video content with captions and transcripts for on-demand review.",
    ],
  },
  {
    title: "Event accessibility",
    paragraphs: [
      "From venue selection to programming, we prioritize inclusive hospitality. Each event listing notes accessibility features and concierge teams confirm requirements ahead of time.",
    ],
    listTitle: "Available accommodations",
    listItems: [
      "Step-free venue access and priority seating.",
      "ASL interpreters, live captioning, or translation as requested.",
      "Quiet zones, sensory considerations, and dietary coordination.",
    ],
  },
];

const Accessibility = () => {
  usePageTitle("Accessibility Statement");

  return (
    <LegalLayout
      title="Accessibility Statement"
      description="Connective is engineered to be inclusive. This statement outlines how we deliver accessible digital products and in-person experiences."
      lastUpdated="January 2025"
    >
      {sections.map((section) => (
        <section key={section.title} className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {section.listItems && section.listTitle && (
            <Fragment>
              <p className="font-medium text-foreground/80">{section.listTitle}</p>
              <ul className="list-disc space-y-2 pl-5">
                {section.listItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Fragment>
          )}
        </section>
      ))}
      <section className="rounded-2xl border border-white/10 bg-card/60 p-6 text-sm shadow-[0_20px_45px_-25px_rgba(17,24,39,0.55)]">
        <h2 className="text-lg font-semibold text-foreground">Request accommodations</h2>
        <p className="mt-3">
          Email <a className="underline" href="mailto:access@connective.app">access@connective.app</a> with your preferred accommodations or feedback. We respond within two business days.
        </p>
      </section>
    </LegalLayout>
  );
};

export default Accessibility;
