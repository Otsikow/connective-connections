export type AlertSeverity = "Low" | "Medium" | "High"

export interface AdminAlert {
  id?: string
  action?: string
  target_user_id?: string
  created_at?: string
  severity: AlertSeverity
  metadata?: Record<string, any>
  description?: string
}
