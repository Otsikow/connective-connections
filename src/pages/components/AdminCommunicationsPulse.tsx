import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MessageSquare } from "lucide-react"

const AdminCommunicationsPulse = () => {
  const channels = [
    { name: "SMS", status: "Operational", volume: "1.2k today" },
    { name: "Email", status: "Operational", volume: "3.4k today" },
    { name: "Push", status: "Degraded", volume: "Investigating" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Communications pulse
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        {channels.map((channel) => (
          <div key={channel.name} className="rounded-lg border p-4 space-y-2">
            <div className="flex items-center justify-between">
              <p className="font-medium">{channel.name}</p>
              <Badge
                variant={channel.status === "Operational" ? "secondary" : "outline"}
                className={channel.status === "Operational" ? "text-emerald-600" : "text-amber-600"}
              >
                {channel.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{channel.volume}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default AdminCommunicationsPulse
