export interface Profile {
  id: string
  full_name: string
  created_at: string
  email: string
  roles: string[]
  status?: "active" | "suspended"
}
