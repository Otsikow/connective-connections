import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserRound } from "lucide-react"
import { Profile } from "../types/Profile"

interface AdminUserManagementProps {
  profiles: Profile[]
  fetchUserEmail: (profileId?: string) => void
  handleRoleChange: (profileId?: string, role?: string) => void
}

const AdminUserManagement = ({ profiles, fetchUserEmail, handleRoleChange }: AdminUserManagementProps) => {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <UserRound className="w-5 h-5" />
          User management
        </CardTitle>
        <Button variant="outline" size="sm" onClick={() => fetchUserEmail()}>
          Refresh emails
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles.map((profile) => (
                <TableRow key={profile.id}>
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
    </Card>
  )
}

export default AdminUserManagement
