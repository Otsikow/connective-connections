import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { usePageTitle } from "@/hooks/usePageTitle";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  ClipboardCheck,
  Eye,
  FlagTriangleRight,
  MailWarning,
  MessageCircleWarning,
  ShieldCheck,
  ShieldHalf,
  UserMinus,
} from "lucide-react";

interface FlaggedUser {
  username: string;
  reason: string;
  severity: number;
  risk: "Low" | "Medium" | "High" | "Critical";
  action: string;
}

interface TimelineEntry {
  username: string;
  message: string;
  toxicity: number;
  sentiment: string;
  timestamp: string;
  flagged?: boolean;
}

const riskStyles: Record<FlaggedUser["risk"], string> = {
  Low: "bg-emerald-500/10 text-emerald-200 border-emerald-500/30",
  Medium: "bg-amber-500/10 text-amber-200 border-amber-500/30",
  High: "bg-orange-500/10 text-orange-200 border-orange-500/30",
  Critical: "bg-red-500/10 text-red-200 border-red-500/30",
};

const ModerationPanel = () => {
  usePageTitle("AI User Moderation Panel");

  const flaggedUsers: FlaggedUser[] = [
    {
      username: "@aurora",
      reason: "Escalating hostility detected in group thread",
      severity: 82,
      risk: "High",
      action: "Send warning message",
    },
    {
      username: "@signalwave",
      reason: "Possible coordinated spam with identical links",
      severity: 74,
      risk: "Medium",
      action: "Temporary suspension",
    },
    {
      username: "@echo-harbor",
      reason: "Repeatedly sharing misleading event details",
      severity: 91,
      risk: "Critical",
      action: "Force ID verification",
    },
    {
      username: "@lumen",
      reason: "Tone shifted negative across multiple DMs",
      severity: 63,
      risk: "Medium",
      action: "Send warning message",
    },
  ];

  const timeline: TimelineEntry[] = [
    {
      username: "@aurora",
      message: "Your take is nonsense and you keep spamming everyone",
      toxicity: 88,
      sentiment: "Highly Negative",
      timestamp: "Today · 2:45 PM",
      flagged: true,
    },
    {
      username: "@signalwave",
      message: "Join my event for a prize: https://bit.ly/xyz",
      toxicity: 72,
      sentiment: "Negative",
      timestamp: "Today · 1:20 PM",
      flagged: true,
    },
    {
      username: "@lumen",
      message: "I’m not sure we should attend—feels sketchy",
      toxicity: 41,
      sentiment: "Cautious",
      timestamp: "Yesterday · 10:12 PM",
    },
    {
      username: "@echo-harbor",
      message: "Event moved again, message me directly for the real link",
      toxicity: 67,
      sentiment: "Negative",
      timestamp: "Yesterday · 5:02 PM",
      flagged: true,
    },
  ];

  const healthScores = useMemo(
    () => [
      { label: "Friendliness score", value: 72, tone: "positive" as const },
      { label: "Engagement score", value: 84, tone: "positive" as const },
      { label: "Risk score", value: 38, tone: "warning" as const },
      { label: "Spam score", value: 22, tone: "warning" as const },
    ],
    [],
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">AI User Moderation</p>
          <h1 className="text-3xl font-bold tracking-tight">User Safety Command Center</h1>
          <p className="text-sm text-muted-foreground">
            Monitor risk, review AI calls, and keep conversations healthy with guided actions.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <ShieldCheck className="h-4 w-4" />
            Policy settings
          </Button>
          <Button size="sm" className="gap-2">
            <ClipboardCheck className="h-4 w-4" />
            Export report
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Flagged Users</CardTitle>
              <CardDescription>AI-prioritized review queue with severity scoring.</CardDescription>
            </div>
            <Badge variant="outline" className="gap-1 rounded-full border-primary/40 text-primary">
              <AlertTriangle className="h-3.5 w-3.5" />
              4 open cases
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-xl border border-border/50 bg-muted/30">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Reason flagged</TableHead>
                    <TableHead className="w-[140px]">Severity</TableHead>
                    <TableHead className="w-[120px]">Risk</TableHead>
                    <TableHead className="w-[160px]">AI recommended action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flaggedUsers.map((user) => (
                    <TableRow key={user.username}>
                      <TableCell className="font-semibold">{user.username}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{user.reason}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Progress value={user.severity} className="h-2" />
                          <span className="text-xs font-semibold text-muted-foreground">
                            {user.severity}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn("w-fit", riskStyles[user.risk])}>
                          {user.risk}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MessageCircleWarning className="h-4 w-4 text-primary" />
                          <span className="text-sm font-medium">{user.action}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Recommended Actions</CardTitle>
            <CardDescription>Pick a path and the AI will automate the workflow.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              {[
                { label: "Send warning message", icon: MailWarning },
                { label: "Temporary suspension", icon: ShieldHalf },
                { label: "Permanent ban", icon: UserMinus },
                { label: "Force ID verification", icon: ShieldCheck },
                { label: "Mark as safe", icon: CheckCircle2 },
              ].map((action) => (
                <Button key={action.label} variant="outline" className="justify-start gap-3">
                  <action.icon className="h-4 w-4 text-primary" />
                  <div className="flex flex-col text-left">
                    <span className="text-sm font-semibold">{action.label}</span>
                    <span className="text-xs text-muted-foreground">
                      AI drafts the message, logs the decision, and updates the audit trail.
                    </span>
                  </div>
                </Button>
              ))}
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-semibold">Moderator notes</p>
              <Textarea
                placeholder="Add context for appeal reviewers or future moderators"
                className="min-h-[100px] resize-none"
              />
              <Button size="sm" className="gap-2">
                <FlagTriangleRight className="h-4 w-4" />
                Save note to case file
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>User Behaviour Timeline</CardTitle>
                <CardDescription>Messages inspected by the AI with toxicity scores.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-2">
                <Eye className="h-4 w-4" />
                View full log
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[320px] pr-4">
              <div className="space-y-3">
                {timeline.map((entry, index) => (
                  <div
                    key={`${entry.username}-${index}`}
                    className={cn(
                      "rounded-xl border border-border/50 bg-card/60 p-4 shadow-sm",
                      entry.flagged && "border-primary/50 bg-primary/5",
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="rounded-full">
                          {entry.username}
                        </Badge>
                        {entry.flagged && (
                          <Badge variant="outline" className="gap-1 rounded-full border-primary/40 text-primary">
                            <AlertTriangle className="h-3.5 w-3.5" />
                            Flagged
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-foreground/90">“{entry.message}”</p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs font-medium text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-primary" /> AI sentiment: {entry.sentiment}
                      </div>
                      <Separator orientation="vertical" className="h-4" />
                      <div className="flex items-center gap-2">
                        <ShieldHalf className="h-4 w-4 text-amber-400" /> Toxicity score
                        <span className="font-semibold text-foreground">{entry.toxicity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Social Health Score</CardTitle>
            <CardDescription>How the AI perceives the overall community pulse.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {healthScores.map((metric) => (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>{metric.label}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "rounded-full",
                      metric.tone === "positive"
                        ? "border-emerald-400/40 text-emerald-200"
                        : "border-amber-400/40 text-amber-200",
                    )}
                  >
                    {metric.value}
                  </Badge>
                </div>
                <Progress value={metric.value} className="h-2" />
              </div>
            ))}
            <Separator />
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2 text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                AI is automatically soft-warming risky users before escalation.
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4 text-primary" />
                Appeals and overrides are logged to the audit trail.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Admin Tools</CardTitle>
          <CardDescription>Approve AI actions, override decisions, and keep records tidy.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <div className="space-y-3 rounded-xl border border-border/50 bg-card/60 p-4">
            <Badge variant="outline" className="w-fit gap-1 rounded-full border-emerald-500/40 text-emerald-200">
              <CheckCircle2 className="h-4 w-4" /> Approve AI actions
            </Badge>
            <p className="text-sm text-muted-foreground">
              Review the AI’s queue, one-tap approve safe calls, and let automation handle the notifications.
            </p>
            <Button size="sm" className="w-full gap-2">
              <ShieldCheck className="h-4 w-4" /> Approve selected
            </Button>
          </div>

          <div className="space-y-3 rounded-xl border border-border/50 bg-card/60 p-4">
            <Badge variant="outline" className="w-fit gap-1 rounded-full border-amber-500/40 text-amber-200">
              <AlertTriangle className="h-4 w-4" /> Override decisions
            </Badge>
            <p className="text-sm text-muted-foreground">
              Swap an AI action, add context, and re-run the recommendation to keep the user record consistent.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                Retry AI call
              </Button>
              <Button size="sm" className="flex-1">
                Override & notify
              </Button>
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-border/50 bg-card/60 p-4">
            <Badge variant="outline" className="w-fit gap-1 rounded-full border-primary/50 text-primary">
              <FlagTriangleRight className="h-4 w-4" /> Notes & appeals
            </Badge>
            <p className="text-sm text-muted-foreground">
              Attach moderator notes, view user appeal history, and hand off cases across the team.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1">
                View appeal history
              </Button>
              <Button size="sm" className="flex-1">
                Add user note
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModerationPanel;
