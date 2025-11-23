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
    title: "Eligibility and account security",
    paragraphs: [
      "You must be at least 18 years old and legally able to enter into this agreement. You are responsible for safeguarding your login credentials and devices used to access the platform.",
    ],
    listTitle: "You agree to",
    listItems: [
      "Use your legal name and accurate professional details when creating or updating your profile.",
      "Enable reasonable security controls on your devices and log out of shared computers.",
      "Inform us immediately at security@connective.app if you suspect unauthorised access or credential compromise.",
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
    title: "Events and guest conduct",
    paragraphs: [
      "Invitations are personal to you unless explicitly stated otherwise. You are responsible for the conduct of any guests you bring to Connective experiences.",
      "Hosts or venue partners may remove attendees who disrupt programming, compromise safety, or violate applicable laws or policies.",
    ],
  },
  {
    title: "Payments and billing",
    paragraphs: [
      "Premium plans renew automatically each billing cycle. Cancel anytime from your dashboard or by contacting billing@connective.app prior to renewal.",
      "All fees are non-refundable once the cycle has begun unless required by applicable law.",
    ],
    listTitle: "Billing expectations",
    listItems: [
      "Taxes and payment processing fees may apply based on your jurisdiction.",
      "We may suspend or limit access for invoices that remain unpaid after the due date.",
      "If we make a pricing change, we will provide reasonable notice before your next renewal.",
    ],
  },
  {
    title: "Content and intellectual property",
    paragraphs: [
      "Connective owns or licenses all platform content, branding, and underlying technology. Members retain ownership of content they submit but grant Connective a limited licence to display it for community purposes.",
      "Do not reproduce or distribute materials from Connective events or the platform without express permission from the rightful owner.",
    ],
  },
  {
    title: "Liability and disclaimers",
    paragraphs: [
      "We curate experiences with reputable partners and employ robust security measures. However, Connective is not responsible for personal arrangements or agreements made directly between members.",
      "To the fullest extent permitted by law, Connective's liability is limited to the fees paid during the previous twelve months. We provide the service on an \"as-is\" basis and disclaim warranties not expressly stated in these terms.",
    ],
  },
  {
    title: "Changes to these terms",
    paragraphs: [
      "We may update these terms to reflect product changes or legal requirements. If an update materially impacts your rights, we will notify you in advance through the app or by email.",
      "Continued use of the platform after the effective date of changes constitutes acceptance. If you do not agree, you may cancel your membership and discontinue use before the effective date.",
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
