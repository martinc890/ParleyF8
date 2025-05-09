export type UserRole = "admin" | "captain" | "player"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  teamId?: string
  photo?: string
}
