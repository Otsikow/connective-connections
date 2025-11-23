import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BrainCircuit } from "lucide-react"

const AdminAISummary = () => {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="w-5 h-5" />
          AI oversight
        </CardTitle>
        <Badge variant="secondary">Realtime</Badge>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1 rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Safety model uptime</div>
          <div className="text-xl font-semibold">99.9%</div>
          <p className="text-xs text-muted-foreground">Regional redundancy enabled.</p>
        </div>
        <div className="space-y-1 rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Escalations handled</div>
          <div className="text-xl font-semibold">42</div>
          <p className="text-xs text-muted-foreground">Past 7 days of AI to human handoffs.</p>
        </div>
        <div className="space-y-1 rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">Model drift</div>
          <div className="text-xl font-semibold text-emerald-600">Stable</div>
          <p className="text-xs text-muted-foreground">No remediation required.</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default AdminAISummary
