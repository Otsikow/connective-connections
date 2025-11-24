import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { UserRound } from "lucide-react"
import { Profile } from "../types/Profile"

type BulkAction = "suspend" | "activate" | "delete"

interface AdminUserManagementProps {
  profiles: Profile[]
  onRefresh: () => void
  onBulkAction: (action: BulkAction, profileIds: string[]) => void
  handleRoleChange: (profileId?: string, role?: string) => void
}

const AdminUserManagement = ({ profiles, onRefresh, onBulkAction, handleRoleChange }: AdminUserManagementProps) => {
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([])
  const [pendingAction, setPendingAction] = useState<BulkAction | null>(null)

  const allSelected = selectedUserIds.length === profiles.length && profiles.length > 0
  const partiallySelected = selectedUserIds.length > 0 && selectedUserIds.length < profiles.length

  const statusStyles: Record<NonNullable<Profile["status"]>, string> = useMemo(
    () => ({
      active: "bg-emerald-50 text-emerald-700 border-emerald-200",
      suspended: "bg-amber-50 text-amber-700 border-amber-200",
    }),
    [],
  )

  const toggleSelection = (profileId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(profileId) ? prev.filter((id) => id !== profileId) : [...prev, profileId],
    )
  }

  const toggleSelectAll = (checked: boolean | "indeterminate") => {
    if (!checked) {
      setSelectedUserIds([])
      return
    }

    setSelectedUserIds(profiles.map((profile) => profile.id))
  }

  const openConfirmation = (action: BulkAction) => {
    if (selectedUserIds.length === 0) return
    setPendingAction(action)
  }

  const handleConfirmAction = () => {
    if (!pendingAction) return
    onBulkAction(pendingAction, selectedUserIds)
    setPendingAction(null)
    setSelectedUserIds([])
  }

  const actionLabels: Record<BulkAction, string> = {
    suspend: "Suspend",
    activate: "Activate",
    delete: "Delete",
  }

  const actionDescriptions: Record<BulkAction, string> = {
    suspend: "Suspended users will be prevented from accessing the platform until reactivated.",
    activate: "Activation will restore access for the selected users and clear any suspensions.",
    delete: "Deleting users removes their access and profile data. This action cannot be undone.",
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <UserRound className="w-5 h-5" />
            User management
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select users to perform bulk actions like suspension, activation, or deletion.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh}>
            Refresh list
          </Button>
          <Button variant="outline" size="sm" disabled={!selectedUserIds.length} onClick={() => openConfirmation("suspend")}>
            Suspend
          </Button>
          <Button variant="outline" size="sm" disabled={!selectedUserIds.length} onClick={() => openConfirmation("activate")}>
            Activate
          </Button>
          <Button variant="destructive" size="sm" disabled={!selectedUserIds.length} onClick={() => openConfirmation("delete")}>
            Delete
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={allSelected ? true : partiallySelected ? "indeterminate" : false}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all users"
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((profile) => (
                <TableRow key={profile.id} className={selectedUserIds.includes(profile.id) ? "bg-muted/40" : undefined}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUserIds.includes(profile.id)}
                      onCheckedChange={() => toggleSelection(profile.id)}
                      aria-label={`Select ${profile.full_name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{profile.full_name}</TableCell>
                  <TableCell className="text-muted-foreground">{profile.email}</TableCell>
                  <TableCell className="space-x-1">
                    {profile.roles.length === 0 && <Badge variant="outline">member</Badge>}
                    {profile.roles.map((role) => (
                      <Badge key={role} variant="outline">
                        {role}
                      </Badge>
                    ))}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusStyles[profile.status ?? "active"]}
                    >
                      {profile.status === "suspended" ? "Suspended" : "Active"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRoleChange(profile.id, "moderator")}
                    >
                      Promote
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRoleChange(profile.id, "member")}
                    >
                      Reset
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <AlertDialog open={!!pendingAction} onOpenChange={(open) => !open && setPendingAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Confirm {pendingAction ? actionLabels[pendingAction].toLowerCase() : "action"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingAction ? actionDescriptions[pendingAction] : ""}
              <br />
              You are about to apply this to <strong>{selectedUserIds.length}</strong> user
              {selectedUserIds.length === 1 ? "" : "s"}. Proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAction}
              className={pendingAction === "delete" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : undefined}
            >
              {pendingAction ? actionLabels[pendingAction] : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}

export default AdminUserManagement
