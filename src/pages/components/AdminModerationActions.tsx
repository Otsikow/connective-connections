import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ShieldCheck } from "lucide-react"

interface AdminModerationActionsProps {
  metrics: {
    totalActions: number
    targetedActions: number
    last24h: number
  }
}

const AdminModerationActions = ({ metrics }: AdminModerationActionsProps) => {
  const targetedRate = metrics.totalActions
    ? Math.round((metrics.targetedActions / metrics.totalActions) * 100)
    : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5" />
          Moderation actions
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2 rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Total actions</div>
          <div className="text-2xl font-semibold">{metrics.totalActions}</div>
          <p className="text-xs text-muted-foreground">Includes automated and manual reviews.</p>
        </div>

        <div className="space-y-2 rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Targeted actions</div>
          <div className="text-2xl font-semibold">{metrics.targetedActions}</div>
          <Progress value={targetedRate} className="h-2" />
          <p className="text-xs text-muted-foreground">{targetedRate}% involved user-specific interventions.</p>
        </div>

        <div className="space-y-2 rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Last 24 hours</div>
          <div className="text-2xl font-semibold">{metrics.last24h}</div>
          <p className="text-xs text-muted-foreground">Recent actions help keep the community safe.</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default AdminModerationActions
