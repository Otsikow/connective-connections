import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShieldPlus } from "lucide-react"

const safetyFeatures = [
  { name: "Real-time content scanning", status: "Active", detail: "Applies to chat and profiles." },
  { name: "Abuse heuristics", status: "Learning", detail: "Continuously tuned by moderation feedback." },
  { name: "Anomaly detection", status: "Active", detail: "Flags unusual growth or spam patterns." },
]

const AdminSafetyFeatures = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldPlus className="w-5 h-5" />
          Safety features
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {safetyFeatures.map((feature) => (
          <div key={feature.name} className="flex items-start justify-between rounded-lg border p-4">
            <div className="space-y-1">
              <p className="font-medium">{feature.name}</p>
              <p className="text-sm text-muted-foreground">{feature.detail}</p>
            </div>
            <Badge variant="secondary">{feature.status}</Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default AdminSafetyFeatures
