import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send } from "lucide-react"
import { Dispatch, SetStateAction } from "react"

interface AdminBulkEmailProps {
  emailSubject: string
  emailMessage: string
  setEmailSubject: Dispatch<SetStateAction<string>>
  setEmailMessage: Dispatch<SetStateAction<string>>
  handleSendBulkEmail: () => void
  sendingEmail: boolean
  totalUsers: number
}

const AdminBulkEmail = ({
  emailSubject,
  emailMessage,
  setEmailSubject,
  setEmailMessage,
  handleSendBulkEmail,
  sendingEmail,
  totalUsers,
}: AdminBulkEmailProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Send className="w-5 h-5" />
          Bulk email
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">
          Send an announcement to all users. Emails are queued through the secure server-side function.
        </div>
        <Input
          placeholder="Subject"
          value={emailSubject}
          onChange={(e) => setEmailSubject(e.target.value)}
        />
        <Textarea
          placeholder="Message body"
          value={emailMessage}
          onChange={(e) => setEmailMessage(e.target.value)}
          rows={4}
        />
        <div className="text-xs text-muted-foreground">Delivering to {totalUsers} users.</div>
      </CardContent>
      <CardFooter className="justify-end">
        <Button onClick={handleSendBulkEmail} disabled={sendingEmail}>
          {sendingEmail && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Send announcement
        </Button>
      </CardFooter>
    </Card>
  )
}

export default AdminBulkEmail
