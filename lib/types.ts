// Tipos para equipos
export interface Team {
  id: string
  name: string
  logo: string
  group: string
  players: string[] // IDs de jugadores
  stats: TeamStats
  createdAt?: Date
  updatedAt?: Date
}

export interface TeamStats {
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  points: number
}

// Tipos para jugadores
export interface Player {
  id: string
  name: string
  number: number
  position: string
  teamId: string
  photo?: string
  stats: PlayerStats
  createdAt?: Date
  updatedAt?: Date
}

export interface PlayerStats {
  goals: number
  assists: number
  yellowCards: number
  redCards: number
}

// Tipos para partidos
export interface Match {
  id: string
  homeTeamId: string
  awayTeamId: string
  date: string
  time: string
  venue: string
  phase: string // "group", "round16", "quarterfinal", "semifinal", "final"
  group?: string
  status: "upcoming" | "live" | "completed"
  score?: {
    home: number
    away: number
  }
  events: MatchEvent[]
  createdAt?: Date
  updatedAt?: Date
}

export interface MatchEvent {
  id: string
  matchId: string
  type: "goal" | "yellowCard" | "redCard" | "substitution"
  minute: number
  playerId: string
  assistPlayerId?: string // Para goles
  teamId: string
  createdAt?: Date
  updatedAt?: Date
}

// Tipos para eventos (no de partido)
export interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  type: "party" | "ceremony" | "meeting" | "other"
  image?: string
  createdAt?: Date
  updatedAt?: Date
}

// Tipos para media
export interface Media {
  id: string
  title: string
  description?: string
  type: "image" | "video"
  url: string
  thumbnail?: string
  matchId?: string
  teamId?: string
  playerId?: string
  eventId?: string
  createdAt?: Date
  updatedAt?: Date
}

// Tipos para calendario
export interface CalendarItem {
  id: string
  title: string
  date: string
  time: string
  type: "match" | "event"
  relatedId: string // ID del partido o evento
  createdAt?: Date
  updatedAt?: Date
}

// Tipos para invitaciones
export interface Invitation {
  id: string
  email: string
  type: "player" | "fan"
  teamId: string
  status: "pending" | "accepted" | "rejected"
  code: string
  expiresAt: Date
  createdAt?: Date
  updatedAt?: Date
}
