export interface TeamModel {
  _id: string
  name: string
  logo?: string
  group?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface PlayerModel {
  _id: string
  firstName: string
  lastName: string
  number: number
  teamId: string
  position?: string
  stats?: {
    goals?: number
    assists?: number
    yellowCards?: number
    redCards?: number
    minutesPlayed?: number
  }
  createdAt?: Date
  updatedAt?: Date
}

export interface MatchModel {
  _id: string
  homeTeamId: string
  awayTeamId: string
  date: Date
  location?: string
  status: "scheduled" | "in_progress" | "completed" | "cancelled"
  homeScore?: number
  awayScore?: number
  events?: MatchEventModel[]
  group?: string
  round?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface MatchEventModel {
  type: "goal" | "yellow_card" | "red_card" | "substitution"
  minute: number
  playerId: string
  teamId: string
  assistPlayerId?: string
  description?: string
}

export interface EventModel {
  _id: string
  title: string
  description?: string
  date: Date
  location?: string
  type: "tournament" | "social" | "meeting" | "other"
  createdAt?: Date
  updatedAt?: Date
}

export interface MediaModel {
  _id: string
  title: string
  description?: string
  type: "image" | "video"
  url: string
  thumbnailUrl?: string
  matchId?: string
  teamId?: string
  playerId?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface UserModel {
  _id: string
  email: string
  password: string // Hashed password
  firstName: string
  lastName: string
  role: "admin" | "captain" | "player" | "public"
  teamId?: string
  isActive: boolean
  lastLogin?: Date
  createdAt?: Date
  updatedAt?: Date
}
