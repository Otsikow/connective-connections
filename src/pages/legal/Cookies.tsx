import { Fragment } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { LegalLayout } from "./LegalLayout";

const sections = [
  {
    title: "How cookies work on Connective",
    paragraphs: [
      "Cookies and similar technologies help us deliver a smooth, secure experience. We use a minimal, privacy-conscious stack and never deploy third-party advertising cookies.",
    ],
  },
  {
    title: "Types of cookies we use",
    paragraphs: [
      "We categorise cookies so you can decide what suits your preferences. Essential cookies are required for the platform to function and cannot be disabled.",
    ],
    listTitle: "Categories",
    listItems: [
      "Essential: required for authentication, security, and reservation flows.",
      "Performance: anonymous analytics that help us improve event discovery and product health.",
      "Experience: remembers your language, theme preference, and concierge interactions.",
    ],
  },
  {
    title: "Managing your preferences",
    paragraphs: [
      "You can update cookie settings directly from your browser, adjust preferences from the profile dashboard, or reach out to our concierge team for assistance.",
      "Deleting cookies may impact personalised recommendations or require you to re-authenticate.",
    ],
  },
];

const Cookies = () => {
  usePageTitle("Cookie Policy");

  return (
    <LegalLayout
      title="Cookie Policy"
      description="Understand how and why Connective uses cookies, pixels, and similar technologies to elevate your experience."
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
        <h2 className="text-lg font-semibold text-foreground">Questions about cookies?</h2>
        <p className="mt-3">
          Contact <a className="underline" href="mailto:privacy@connective.app">privacy@connective.app</a> for detailed configuration support.
        </p>
      </section>
    </LegalLayout>
  );
};

export default Cookies;
