import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Mail, Users, Search } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

const emailSchema = z.object({
  subject: z.string().trim().min(1, 'Subject is required').max(150, 'Subject is too long (max 150 characters)'),
  content: z.string().trim().min(1, 'Content is required').max(4000, 'Content is too long (max 4000 characters)'),
})

type EmailFormValues = z.infer<typeof emailSchema>

interface UserEmail {
  id: string
  email: string
  full_name?: string
}

interface UserEmailsResponse {
  users: UserEmail[]
  total: number
  limit: number
  offset: number
}

const UserManagement = () => {
  const [users, setUsers] = useState<UserEmail[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(0)
  const [limit] = useState(20)
  const [emailDialogOpen, setEmailDialogOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserEmail | null>(null)
  const [pendingEmail, setPendingEmail] = useState<EmailFormValues | null>(null)

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      subject: '',
      content: '',
    },
  })

  // Fetch user emails from secure server-side function
  const fetchUserEmails = async (offset: number = 0) => {
    setLoading(true)
    setError(null)

    try {
      // Get the current user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        throw new Error('Not authenticated')
      }

      // Call the secure server-side function
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-user-emails?limit=${limit}&offset=${offset}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to fetch user emails')
      }

      const data: UserEmailsResponse = await response.json()
      setUsers(data.users)
      setTotal(data.total)
      setCurrentPage(Math.floor(offset / limit))
    } catch (err) {
      console.error('Error fetching user emails:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch user emails')
    } finally {
      setLoading(false)
    }
  }

  // Send bulk email using secure server-side function
  const sendBulkEmail = async (subject: string, content: string) => {
    const sanitizedSubject = subject.trim()
    const sanitizedContent = content.trim()

    setLoading(true)
    setError(null)

    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError || !session) {
        throw new Error('Not authenticated')
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-bulk-email`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subject: sanitizedSubject,
            content: sanitizedContent,
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to send bulk email')
      }

      const result = await response.json()
      alert(`Bulk email sent successfully! ${result.successful} emails sent, ${result.failed} failed.`)
    } catch (err) {
      console.error('Error sending bulk email:', err)
      setError(err instanceof Error ? err.message : 'Failed to send bulk email')
    } finally {
      setLoading(false)
    }
  }

  const openEmailDialog = (user?: UserEmail) => {
    setSelectedUser(user ?? null)
    setPendingEmail(null)
    setConfirmDialogOpen(false)
    emailForm.reset({ subject: '', content: '' })
    setEmailDialogOpen(true)
  }

  const handleEmailSubmit = (values: EmailFormValues) => {
    const sanitizedValues = {
      subject: values.subject.trim(),
      content: values.content.trim(),
    }

    setPendingEmail(sanitizedValues)
    setConfirmDialogOpen(true)
  }

  const handleConfirmSend = async () => {
    if (!pendingEmail) return

    await sendBulkEmail(pendingEmail.subject, pendingEmail.content)
    setConfirmDialogOpen(false)
    setEmailDialogOpen(false)
    setSelectedUser(null)
    setPendingEmail(null)
    emailForm.reset({ subject: '', content: '' })
  }

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  useEffect(() => {
    fetchUserEmails()
  }, [])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search users by email or name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              {total} Total Users
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {filteredUsers.length} Filtered
            </Badge>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive text-sm">{error}</p>
            </div>
          )}

          {/* User Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        {user.full_name || 'No name'}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEmailDialog(user)}
                        >
                          <Mail className="w-4 h-4 mr-1" />
                          Send Email
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Page {currentPage + 1} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchUserEmails((currentPage - 1) * limit)}
                  disabled={currentPage === 0 || loading}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchUserEmails((currentPage + 1) * limit)}
                  disabled={currentPage >= totalPages - 1 || loading}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {/* Bulk Actions */}
          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-2">Bulk Actions</h3>
            <Button
              onClick={() => openEmailDialog()}
              disabled={loading}
              className="w-full"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Email to All Users
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={emailDialogOpen}
        onOpenChange={(open) => {
          setEmailDialogOpen(open)
          if (!open) {
            setSelectedUser(null)
            setPendingEmail(null)
            setConfirmDialogOpen(false)
            emailForm.reset({ subject: '', content: '' })
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser ? 'Send Email to User' : 'Send Bulk Email'}
            </DialogTitle>
            <DialogDescription>
              {selectedUser
                ? `Send an email to ${selectedUser.full_name || 'this user'} (${selectedUser.email}).`
                : 'Send an email to all users. Subject limited to 150 characters and content to 4000 characters.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(handleEmailSubmit)} className="space-y-4">
              <FormField
                control={emailForm.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Announcement" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={emailForm.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share updates, reminders, or announcements with your users."
                        className="min-h-[160px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEmailDialogOpen(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  Review & Send
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm email send</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedUser
                ? `Send this email to ${selectedUser.email}?`
                : 'Send this email to all users?'}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {pendingEmail && (
            <div className="space-y-3 rounded-md border p-3 text-sm">
              <div>
                <p className="font-semibold">Subject</p>
                <p className="text-muted-foreground break-words">{pendingEmail.subject}</p>
              </div>
              <div>
                <p className="font-semibold">Message</p>
                <p className="text-muted-foreground whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
                  {pendingEmail.content}
                </p>
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSend} disabled={loading} className="gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Send Email
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default UserManagement