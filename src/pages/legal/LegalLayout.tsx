import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface LegalLayoutProps {
  title: string;
  description: string;
  lastUpdated: string;
  children: ReactNode;
}

export const LegalLayout = ({ title, description, lastUpdated, children }: LegalLayoutProps) => {
  return (
    <div className="relative bg-background">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(248,231,200,0.45),_rgba(255,255,255,0))] dark:bg-[radial-gradient(circle_at_top,_rgba(40,40,40,0.65),_rgba(10,10,10,0))]" />
      <div className="mx-auto max-w-4xl px-6 py-16 lg:px-8">
        <Link
          to="/home"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <div className="mt-10 space-y-6">
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">{title}</h1>
            <p className="text-base text-muted-foreground sm:text-lg">{description}</p>
          </div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground/70">Last updated {lastUpdated}</p>
        </div>
        <div className="mt-12 space-y-10 text-sm leading-relaxed text-muted-foreground sm:text-base">{children}</div>
      </div>
    </div>
  );
};

export default LegalLayout;
