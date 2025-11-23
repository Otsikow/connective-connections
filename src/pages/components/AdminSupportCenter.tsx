import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LifeBuoy } from "lucide-react"

const AdminSupportCenter = () => {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <LifeBuoy className="w-5 h-5" />
          Support center
        </CardTitle>
        <Button variant="outline" size="sm">Open ticket</Button>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="font-medium">Runbook</p>
          <p className="text-sm text-muted-foreground">Playbooks for incidents and escalations.</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="font-medium">Pager rotation</p>
          <p className="text-sm text-muted-foreground">Coverage confirmed for this week.</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="font-medium">Knowledge base</p>
          <p className="text-sm text-muted-foreground">Latest policies and FAQs for agents.</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default AdminSupportCenter
