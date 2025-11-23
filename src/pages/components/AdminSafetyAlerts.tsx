import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ShieldAlert, CheckCircle2 } from "lucide-react"
import { AdminAlert, AlertSeverity } from "../types/AdminAlert"

interface AdminSafetyAlertsProps {
  alerts: AdminAlert[]
}

const severityStyle: Record<AlertSeverity, string> = {
  High: "bg-red-500/10 text-red-500 border-red-500/20",
  Medium: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
  Low: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
}

const AdminSafetyAlerts = ({ alerts }: AdminSafetyAlertsProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" />
          Safety alerts
        </CardTitle>
        <Badge variant="outline" className="text-xs">
          Last 25 actions
        </Badge>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <CheckCircle2 className="w-4 h-4" />
            No active safety alerts.
          </div>
        ) : (
          <ScrollArea className="max-h-64 pr-2">
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id ?? `${alert.action}-${alert.created_at}`}
                  className="flex items-start justify-between rounded-lg border p-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={severityStyle[alert.severity]}>
                        {alert.severity}
                      </Badge>
                      {alert.action && <span className="text-sm font-medium">{alert.action}</span>}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {alert.description || alert.metadata?.reason || "Policy check logged"}
                    </p>
                    {alert.target_user_id && (
                      <p className="text-xs text-muted-foreground">
                        Target user: {alert.target_user_id}
                      </p>
                    )}
                  </div>
                  {alert.created_at && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(alert.created_at).toLocaleString()}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}

export default AdminSafetyAlerts
