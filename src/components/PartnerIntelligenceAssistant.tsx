import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Sparkles } from "lucide-react";

const PartnerIntelligenceAssistant = () => {
  const suggestedPrompts = [
    {
      title: "Agent pipeline brief",
      description: "Summarize which agents have students at risk this week and where to focus follow-up.",
    },
    {
      title: "Admissions update draft",
      description: "Draft a partner update announcing new program intake dates and key deadlines.",
    },
    {
      title: "Document checklist",
      description: "List the critical documents agents should provide to move CAS cases forward.",
    },
  ];

  return (
    <Card className="border-border/60">
      <CardHeader>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge className="mb-2 rounded-full bg-primary/10 text-primary">Zoe</Badge>
            <CardTitle className="flex items-center gap-2 text-2xl">
              Partner Intelligence Assistant
              <Sparkles className="h-5 w-5 text-primary" />
            </CardTitle>
            <CardDescription className="mt-2">
              Tap into Zoe for quick answers on agent engagement, admissions blockers, and program updates.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase text-muted-foreground">Suggested Prompts</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {suggestedPrompts.map((prompt) => (
              <Card key={prompt.title} className="flex cursor-pointer flex-col justify-between bg-muted/50 p-4 transition-all hover:bg-muted">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-2 text-primary">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <p className="font-semibold">{prompt.title}</p>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{prompt.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartnerIntelligenceAssistant;
