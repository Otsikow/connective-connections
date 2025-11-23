import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Activity } from "lucide-react"

const AdminPerformanceMonitor = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Performance monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2 rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">API latency</div>
          <div className="text-2xl font-semibold">184ms</div>
          <Progress value={78} className="h-2" />
          <p className="text-xs text-muted-foreground">Within target SLO.</p>
        </div>
        <div className="space-y-2 rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Error budget</div>
          <div className="text-2xl font-semibold">92%</div>
          <Progress value={92} className="h-2" />
          <p className="text-xs text-muted-foreground">Remaining for current window.</p>
        </div>
        <div className="space-y-2 rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Queue depth</div>
          <div className="text-2xl font-semibold">7</div>
          <Progress value={35} className="h-2" />
          <p className="text-xs text-muted-foreground">Background jobs processing normally.</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default AdminPerformanceMonitor
