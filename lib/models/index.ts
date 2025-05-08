// Modelos para MongoDB

export interface TeamModel {
  _id?: string
  name: string
  logo?: string
  group: string
  players: string[] // Referencias a IDs de jugadores
  stats: {
    played: number
    won: number
    drawn: number
    lost: number
    goalsFor: number
    goalsAgainst: number
    points: number
  }
  createdAt?: Date
  updatedAt?: Date
}

export interface PlayerModel {
  _id?: string
  firstName: string
  lastName: string
  number: number
  position: string
  teamId: string // Referencia al ID del equipo
  isStarter: boolean
  stats: {
    goals: number
    assists: number
    yellowCards: number
    redCards: number
  }
  createdAt?: Date
  updatedAt?: Date
}

export interface MatchModel {
  _id?: string
  date: string
  time: string
  homeTeamId: string // Referencia al ID del equipo local
  awayTeamId: string // Referencia al ID del equipo visitante
  homeScore: number | null
  awayScore: number | null
  group?: string
  stadium: string
  phase: "group" | "quarter" | "semi" | "final"
  status: "upcoming" | "live" | "completed"
  events: MatchEventModel[] // Eventos del partido (goles, tarjetas)
  createdAt?: Date
  updatedAt?: Date
}

export interface MatchEventModel {
  _id?: string
  matchId: string // Referencia al ID del partido
  type: "goal" | "yellowCard" | "redCard"
  minute: number
  teamId: string // Referencia al ID del equipo
  playerId: string // Referencia al ID del jugador
  assistPlayerId?: string // Referencia al ID del jugador que asistió (solo para goles)
  createdAt?: Date
  updatedAt?: Date
}

export interface EventModel {
  _id?: string
  title: string
  date: string
  time: string
  location: string
  address: string
  type: "party" | "fan" | "concert" | "ceremony"
  description: string
  image?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface MediaModel {
  _id?: string
  type: "image" | "video"
  url: string
  thumbnail?: string
  title: string
  date: string
  matchId?: string // Referencia al ID del partido
  matchday: string
  createdAt?: Date
  updatedAt?: Date
}
