import { Fragment } from "react";
import { usePageTitle } from "@/hooks/usePageTitle";
import { LegalLayout } from "./LegalLayout";

const sections = [
  {
    title: "Membership agreement",
    paragraphs: [
      "Connective Connections is an invite-only network. By activating your account you confirm that you meet our membership criteria and agree to uphold our community standards.",
      "Access may be paused or withdrawn if we identify behaviour that risks member safety or contradicts our values of generosity, respect, and confidentiality.",
    ],
  },
  {
    title: "Use of the platform",
    paragraphs: [
      "You may use Connective's digital products to discover events, manage your membership, and collaborate with other members. Automated scraping, resale of invitations, or sharing member data without consent is strictly prohibited.",
    ],
    listTitle: "When using Connective, you agree to",
    listItems: [
      "Provide accurate information and update changes within seven days.",
      "Respect intellectual property, confidentiality, and personal boundaries.",
      "Notify us immediately if you suspect unauthorised access to your account.",
    ],
  },
  {
    title: "Payments and billing",
    paragraphs: [
      "Premium plans renew automatically each billing cycle. Cancel anytime from your dashboard or by contacting billing@connective.app prior to renewal.",
      "All fees are non-refundable once the cycle has begun unless required by applicable law.",
    ],
  },
  {
    title: "Liability",
    paragraphs: [
      "We curate experiences with reputable partners and employ robust security measures. However, Connective is not responsible for personal arrangements or agreements made directly between members.",
      "To the fullest extent permitted by law, Connective's liability is limited to the fees paid during the previous twelve months.",
    ],
  },
];

const Terms = () => {
  usePageTitle("Terms of Service");

  return (
    <LegalLayout
      title="Terms of Service"
      description="These terms govern your membership, event participation, and use of Connective's digital platforms."
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
        <h2 className="text-lg font-semibold text-foreground">Need a human review?</h2>
        <p className="mt-3">
          Our concierge team can walk you through these terms. Email <a className="underline" href="mailto:legal@connective.app">legal@connective.app</a> for a personalised briefing.
        </p>
      </section>
    </LegalLayout>
  );
};

export default Terms;
