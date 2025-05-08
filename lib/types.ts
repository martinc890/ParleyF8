export interface Team {
  id: string
  name: string
  logo?: string
  group: string
  players: Player[]
  stats: TeamStats
}

export interface Player {
  id: string
  name: string
  number: number
  position: string
  teamId: string
  isStarter: boolean
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

export interface Match {
  id: string
  date: string
  time: string
  homeTeamId: string
  awayTeamId: string
  homeScore: number | null
  awayScore: number | null
  group?: string
  stadium: string
  phase: "group" | "quarter" | "semi" | "final"
  status: "upcoming" | "live" | "completed"
  lineups?: {
    home: string[]
    away: string[]
  }
  stats?: MatchStats
  events?: MatchEvent[]
  mediaIds?: string[]
}

export interface MatchStats {
  possession: {
    home: number
    away: number
  }
  shots: {
    home: number
    away: number
  }
  shotsOnTarget: {
    home: number
    away: number
  }
  corners: {
    home: number
    away: number
  }
  fouls: {
    home: number
    away: number
  }
}

export interface MatchEvent {
  id: string
  matchId: string
  type: "goal" | "yellow" | "red" | "substitution"
  minute: number
  teamId: string
  playerId: string
  assistPlayerId?: string
}

export interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  address: string
  type: "party" | "fan" | "concert" | "ceremony"
  description: string
  image?: string
}

export interface Media {
  id: string
  type: "image" | "video"
  url: string
  thumbnail?: string
  title: string
  date: string
  matchId?: string
  matchday: string
}

export interface CalendarItem {
  id: string
  title: string
  date: string
  time: string
  type: "match" | "event"
  itemId: string // ID of the match or event
}
