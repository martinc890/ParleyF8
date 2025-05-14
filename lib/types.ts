export interface Team {
  id: string
  name: string
  logo?: string
  group?: string
  players: string[]
  stats?: {
    played: number
    won: number
    drawn: number
    lost: number
    goalsFor: number
    goalsAgainst: number
    points: number
  }
}

export interface Player {
  id: string
  firstName: string
  lastName: string
  name: string
  number: number
  teamId: string
  position: string
  photo?: string
  stats?: {
    goals: number
    assists: number
    yellowCards: number
    redCards: number
  }
}

export interface Match {
  id: string
  homeTeamId: string
  awayTeamId: string
  date: string
  time: string
  venue: string
  phase: string
  group?: string
  status: string
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
  type: string
  minute: number
  playerId: string
  assistPlayerId?: string
  teamId: string
}

export interface PlayerStats {
  id: string
  playerId: string
  goals: number
  assists: number
  yellowCards: number
  redCards: number
}
