import { supabase } from "./supabase-client"
import type { Team, Player, Match, Media, Event, PlayerInvitation, Notification, User, MatchEvent } from "./types"
import { generatePassword, generateQRCode } from "./utils"

// ==================== FUNCIONES PARA EQUIPOS ====================

export async function getAllTeams(): Promise<Team[]> {
  const { data, error } = await supabase.from("teams").select("*").order("name")

  if (error) {
    console.error("Error fetching teams:", error)
    return []
  }

  return data.map((team) => ({
    id: team.id,
    name: team.name,
    logo: team.logo,
    group: team.group_name,
    isLocked: team.is_locked,
    createdAt: team.created_at,
    updatedAt: team.updated_at,
  }))
}

export async function getTeamById(id: string): Promise<Team | null> {
  const { data, error } = await supabase.from("teams").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching team:", error)
    return null
  }

  return {
    id: data.id,
    name: data.name,
    logo: data.logo,
    group: data.group_name,
    isLocked: data.is_locked,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function getTeamsByGroup(group: string): Promise<Team[]> {
  const { data, error } = await supabase.from("teams").select("*, team_stats(*)").eq("group_name", group).order("name")

  if (error) {
    console.error("Error fetching teams by group:", error)
    return []
  }

  return data.map((team) => ({
    id: team.id,
    name: team.name,
    logo: team.logo,
    group: team.group_name,
    isLocked: team.is_locked,
    stats: team.team_stats
      ? {
          played: team.team_stats.played,
          won: team.team_stats.won,
          drawn: team.team_stats.drawn,
          lost: team.team_stats.lost,
          goalsFor: team.team_stats.goals_for,
          goalsAgainst: team.team_stats.goals_against,
          points: team.team_stats.points,
          position: team.team_stats.position,
        }
      : undefined,
    createdAt: team.created_at,
    updatedAt: team.updated_at,
  }))
}

export async function createTeam(team: Omit<Team, "id" | "createdAt" | "updatedAt">): Promise<Team | null> {
  const { data, error } = await supabase
    .from("teams")
    .insert({
      name: team.name,
      logo: team.logo,
      group_name: team.group,
      is_locked: team.isLocked || false,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating team:", error)
    return null
  }

  // Crear estadísticas iniciales para el equipo
  await supabase.from("team_stats").insert({
    team_id: data.id,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goals_for: 0,
    goals_against: 0,
    points: 0,
  })

  return {
    id: data.id,
    name: data.name,
    logo: data.logo,
    group: data.group_name,
    isLocked: data.is_locked,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function updateTeam(id: string, team: Partial<Team>): Promise<Team | null> {
  const { data, error } = await supabase
    .from("teams")
    .update({
      name: team.name,
      logo: team.logo,
      group_name: team.group,
      is_locked: team.isLocked,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating team:", error)
    return null
  }

  return {
    id: data.id,
    name: data.name,
    logo: data.logo,
    group: data.group_name,
    isLocked: data.is_locked,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function deleteTeam(id: string): Promise<boolean> {
  const { error } = await supabase.from("teams").delete().eq("id", id)

  if (error) {
    console.error("Error deleting team:", error)
    return false
  }

  return true
}

export async function lockTeam(id: string, locked: boolean): Promise<boolean> {
  const { error } = await supabase
    .from("teams")
    .update({ is_locked: locked, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    console.error("Error locking/unlocking team:", error)
    return false
  }

  return true
}

// ==================== FUNCIONES PARA JUGADORES ====================

export async function getAllPlayers(): Promise<Player[]> {
  const { data, error } = await supabase
    .from("players")
    .select(`
      *,
      teams:team_id (id, name),
      player_stats:player_stats (goals, assists, yellow_cards, red_cards, matches_played, minutes_played)
    `)
    .order("last_name")

  if (error) {
    console.error("Error fetching players:", error)
    return []
  }

  return data.map((player) => ({
    id: player.id,
    firstName: player.first_name,
    lastName: player.last_name,
    email: player.email,
    dni: player.dni,
    birthDate: player.birth_date,
    number: player.number,
    position: player.position,
    teamId: player.team_id,
    isActive: player.is_active,
    isStarter: player.is_starter,
    photo: player.photo,
    qrCode: player.qr_code,
    team: player.teams
      ? {
          id: player.teams.id,
          name: player.teams.name,
        }
      : undefined,
    stats: player.player_stats
      ? {
          goals: player.player_stats.goals,
          assists: player.player_stats.assists,
          yellowCards: player.player_stats.yellow_cards,
          redCards: player.player_stats.red_cards,
          matchesPlayed: player.player_stats.matches_played,
          minutesPlayed: player.player_stats.minutes_played,
        }
      : undefined,
    createdAt: player.created_at,
    updatedAt: player.updated_at,
  }))
}

export async function getPlayersByTeam(teamId: string): Promise<Player[]> {
  const { data, error } = await supabase
    .from("players")
    .select(`
      *,
      player_stats:player_stats (goals, assists, yellow_cards, red_cards, matches_played, minutes_played)
    `)
    .eq("team_id", teamId)
    .order("number")

  if (error) {
    console.error("Error fetching players by team:", error)
    return []
  }

  return data.map((player) => ({
    id: player.id,
    firstName: player.first_name,
    lastName: player.last_name,
    email: player.email,
    dni: player.dni,
    birthDate: player.birth_date,
    number: player.number,
    position: player.position,
    teamId: player.team_id,
    isActive: player.is_active,
    isStarter: player.is_starter,
    photo: player.photo,
    qrCode: player.qr_code,
    stats: player.player_stats
      ? {
          goals: player.player_stats.goals,
          assists: player.player_stats.assists,
          yellowCards: player.player_stats.yellow_cards,
          redCards: player.player_stats.red_cards,
          matchesPlayed: player.player_stats.matches_played,
          minutesPlayed: player.player_stats.minutes_played,
        }
      : undefined,
    createdAt: player.created_at,
    updatedAt: player.updated_at,
  }))
}

export async function getPlayerById(id: string): Promise<Player | null> {
  const { data, error } = await supabase
    .from("players")
    .select(`
      *,
      teams:team_id (id, name),
      player_stats:player_stats (goals, assists, yellow_cards, red_cards, matches_played, minutes_played)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching player:", error)
    return null
  }

  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    dni: data.dni,
    birthDate: data.birth_date,
    number: data.number,
    position: data.position,
    teamId: data.team_id,
    isActive: data.is_active,
    isStarter: data.is_starter,
    photo: data.photo,
    qrCode: data.qr_code,
    team: data.teams
      ? {
          id: data.teams.id,
          name: data.teams.name,
        }
      : undefined,
    stats: data.player_stats
      ? {
          goals: data.player_stats.goals,
          assists: data.player_stats.assists,
          yellowCards: data.player_stats.yellow_cards,
          redCards: data.player_stats.red_cards,
          matchesPlayed: data.player_stats.matches_played,
          minutesPlayed: data.player_stats.minutes_played,
        }
      : undefined,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function createPlayer(player: Omit<Player, "id" | "createdAt" | "updatedAt">): Promise<Player | null> {
  // Generar QR para el carnet si no existe
  const qrCode = player.qrCode || (await generateQRCode(`player-${Date.now()}`))

  const { data, error } = await supabase
    .from("players")
    .insert({
      first_name: player.firstName,
      last_name: player.lastName,
      email: player.email,
      dni: player.dni,
      birth_date: player.birthDate,
      number: player.number,
      position: player.position,
      team_id: player.teamId,
      is_active: player.isActive !== undefined ? player.isActive : true,
      is_starter: player.isStarter !== undefined ? player.isStarter : false,
      photo: player.photo,
      qr_code: qrCode,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating player:", error)
    return null
  }

  // Crear estadísticas iniciales para el jugador
  await supabase.from("player_stats").insert({
    player_id: data.id,
    goals: 0,
    assists: 0,
    yellow_cards: 0,
    red_cards: 0,
    matches_played: 0,
    minutes_played: 0,
  })

  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    dni: data.dni,
    birthDate: data.birth_date,
    number: data.number,
    position: data.position,
    teamId: data.team_id,
    isActive: data.is_active,
    isStarter: data.is_starter,
    photo: data.photo,
    qrCode: data.qr_code,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function updatePlayer(id: string, player: Partial<Player>): Promise<Player | null> {
  const { data, error } = await supabase
    .from("players")
    .update({
      first_name: player.firstName,
      last_name: player.lastName,
      email: player.email,
      dni: player.dni,
      birth_date: player.birthDate,
      number: player.number,
      position: player.position,
      team_id: player.teamId,
      is_active: player.isActive,
      is_starter: player.isStarter,
      photo: player.photo,
      qr_code: player.qrCode,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating player:", error)
    return null
  }

  return {
    id: data.id,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    dni: data.dni,
    birthDate: data.birth_date,
    number: data.number,
    position: data.position,
    teamId: data.team_id,
    isActive: data.is_active,
    isStarter: data.is_starter,
    photo: data.photo,
    qrCode: data.qr_code,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function deletePlayer(id: string): Promise<boolean> {
  const { error } = await supabase.from("players").delete().eq("id", id)

  if (error) {
    console.error("Error deleting player:", error)
    return false
  }

  return true
}

export async function updatePlayerQR(id: string, qrCode: string): Promise<boolean> {
  const { error } = await supabase
    .from("players")
    .update({ qr_code: qrCode, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    console.error("Error updating player QR:", error)
    return false
  }

  return true
}

// ==================== FUNCIONES PARA PARTIDOS ====================

export async function getAllMatches(): Promise<Match[]> {
  const { data, error } = await supabase
    .from("matches")
    .select(`
      *,
      home_team:home_team_id (id, name, logo),
      away_team:away_team_id (id, name, logo)
    `)
    .order("date")

  if (error) {
    console.error("Error fetching matches:", error)
    return []
  }

  return data.map((match) => ({
    id: match.id,
    homeTeamId: match.home_team_id,
    awayTeamId: match.away_team_id,
    homeTeam: match.home_team
      ? {
          id: match.home_team.id,
          name: match.home_team.name,
          logo: match.home_team.logo,
        }
      : undefined,
    awayTeam: match.away_team
      ? {
          id: match.away_team.id,
          name: match.away_team.name,
          logo: match.away_team.logo,
        }
      : undefined,
    date: match.date,
    time: match.time,
    venue: match.venue,
    status: match.status,
    phase: match.phase,
    group: match.group_name,
    score: {
      home: match.home_score,
      away: match.away_score,
    },
    createdAt: match.created_at,
    updatedAt: match.updated_at,
  }))
}

export async function getMatchesByPhase(phase: string): Promise<Match[]> {
  const { data, error } = await supabase
    .from("matches")
    .select(`
      *,
      home_team:home_team_id (id, name, logo),
      away_team:away_team_id (id, name, logo)
    `)
    .eq("phase", phase)
    .order("date")

  if (error) {
    console.error("Error fetching matches by phase:", error)
    return []
  }

  return data.map((match) => ({
    id: match.id,
    homeTeamId: match.home_team_id,
    awayTeamId: match.away_team_id,
    homeTeam: match.home_team
      ? {
          id: match.home_team.id,
          name: match.home_team.name,
          logo: match.home_team.logo,
        }
      : undefined,
    awayTeam: match.away_team
      ? {
          id: match.away_team.id,
          name: match.away_team.name,
          logo: match.away_team.logo,
        }
      : undefined,
    date: match.date,
    time: match.time,
    venue: match.venue,
    status: match.status,
    phase: match.phase,
    group: match.group_name,
    score: {
      home: match.home_score,
      away: match.away_score,
    },
    createdAt: match.created_at,
    updatedAt: match.updated_at,
  }))
}

export async function getMatchesByStatus(status: string): Promise<Match[]> {
  const { data, error } = await supabase
    .from("matches")
    .select(`
      *,
      home_team:home_team_id (id, name, logo),
      away_team:away_team_id (id, name, logo)
    `)
    .eq("status", status)
    .order("date")

  if (error) {
    console.error("Error fetching matches by status:", error)
    return []
  }

  return data.map((match) => ({
    id: match.id,
    homeTeamId: match.home_team_id,
    awayTeamId: match.away_team_id,
    homeTeam: match.home_team
      ? {
          id: match.home_team.id,
          name: match.home_team.name,
          logo: match.home_team.logo,
        }
      : undefined,
    awayTeam: match.away_team
      ? {
          id: match.away_team.id,
          name: match.away_team.name,
          logo: match.away_team.logo,
        }
      : undefined,
    date: match.date,
    time: match.time,
    venue: match.venue,
    status: match.status,
    phase: match.phase,
    group: match.group_name,
    score: {
      home: match.home_score,
      away: match.away_score,
    },
    createdAt: match.created_at,
    updatedAt: match.updated_at,
  }))
}

export async function getMatchesByTeam(teamId: string): Promise<Match[]> {
  const { data, error } = await supabase
    .from("matches")
    .select(`
      *,
      home_team:home_team_id (id, name, logo),
      away_team:away_team_id (id, name, logo)
    `)
    .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
    .order("date")

  if (error) {
    console.error("Error fetching matches by team:", error)
    return []
  }

  return data.map((match) => ({
    id: match.id,
    homeTeamId: match.home_team_id,
    awayTeamId: match.away_team_id,
    homeTeam: match.home_team
      ? {
          id: match.home_team.id,
          name: match.home_team.name,
          logo: match.home_team.logo,
        }
      : undefined,
    awayTeam: match.away_team
      ? {
          id: match.away_team.id,
          name: match.away_team.name,
          logo: match.away_team.logo,
        }
      : undefined,
    date: match.date,
    time: match.time,
    venue: match.venue,
    status: match.status,
    phase: match.phase,
    group: match.group_name,
    score: {
      home: match.home_score,
      away: match.away_score,
    },
    createdAt: match.created_at,
    updatedAt: match.updated_at,
  }))
}

export async function getUpcomingMatchesByTeam(teamId: string): Promise<Match[]> {
  const { data, error } = await supabase
    .from("matches")
    .select(`
      *,
      home_team:home_team_id (id, name, logo),
      away_team:away_team_id (id, name, logo)
    `)
    .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
    .eq("status", "upcoming")
    .order("date")

  if (error) {
    console.error("Error fetching upcoming matches by team:", error)
    return []
  }

  return data.map((match) => ({
    id: match.id,
    homeTeamId: match.home_team_id,
    awayTeamId: match.away_team_id,
    homeTeam: match.home_team
      ? {
          id: match.home_team.id,
          name: match.home_team.name,
          logo: match.home_team.logo,
        }
      : undefined,
    awayTeam: match.away_team
      ? {
          id: match.away_team.id,
          name: match.away_team.name,
          logo: match.away_team.logo,
        }
      : undefined,
    date: match.date,
    time: match.time,
    venue: match.venue,
    status: match.status,
    phase: match.phase,
    group: match.group_name,
    score: {
      home: match.home_score,
      away: match.away_score,
    },
    createdAt: match.created_at,
    updatedAt: match.updated_at,
  }))
}

export async function getPastMatchesByTeam(teamId: string): Promise<Match[]> {
  const { data, error } = await supabase
    .from("matches")
    .select(`
      *,
      home_team:home_team_id (id, name, logo),
      away_team:away_team_id (id, name, logo)
    `)
    .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
    .eq("status", "completed")
    .order("date", { ascending: false })

  if (error) {
    console.error("Error fetching past matches by team:", error)
    return []
  }

  return data.map((match) => ({
    id: match.id,
    homeTeamId: match.home_team_id,
    awayTeamId: match.away_team_id,
    homeTeam: match.home_team
      ? {
          id: match.home_team.id,
          name: match.home_team.name,
          logo: match.home_team.logo,
        }
      : undefined,
    awayTeam: match.away_team
      ? {
          id: match.away_team.id,
          name: match.away_team.name,
          logo: match.away_team.logo,
        }
      : undefined,
    date: match.date,
    time: match.time,
    venue: match.venue,
    status: match.status,
    phase: match.phase,
    group: match.group_name,
    score: {
      home: match.home_score,
      away: match.away_score,
    },
    createdAt: match.created_at,
    updatedAt: match.updated_at,
  }))
}

export async function getMatchById(id: string): Promise<Match | null> {
  const { data, error } = await supabase
    .from("matches")
    .select(`
      *,
      home_team:home_team_id (id, name, logo),
      away_team:away_team_id (id, name, logo)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching match:", error)
    return null
  }

  return {
    id: data.id,
    homeTeamId: data.home_team_id,
    awayTeamId: data.away_team_id,
    homeTeam: data.home_team
      ? {
          id: data.home_team.id,
          name: data.home_team.name,
          logo: data.home_team.logo,
        }
      : undefined,
    awayTeam: data.away_team
      ? {
          id: data.away_team.id,
          name: data.away_team.name,
          logo: data.away_team.logo,
        }
      : undefined,
    date: data.date,
    time: data.time,
    venue: data.venue,
    status: data.status,
    phase: data.phase,
    group: data.group_name,
    score: {
      home: data.home_score,
      away: data.away_score,
    },
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function createMatch(match: Omit<Match, "id" | "createdAt" | "updatedAt">): Promise<Match | null> {
  const { data, error } = await supabase
    .from("matches")
    .insert({
      home_team_id: match.homeTeamId,
      away_team_id: match.awayTeamId,
      date: match.date,
      time: match.time,
      venue: match.venue,
      status: match.status,
      phase: match.phase,
      group_name: match.group,
      home_score: match.score?.home || 0,
      away_score: match.score?.away || 0,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating match:", error)
    return null
  }

  return {
    id: data.id,
    homeTeamId: data.home_team_id,
    awayTeamId: data.away_team_id,
    date: data.date,
    time: data.time,
    venue: data.venue,
    status: data.status,
    phase: data.phase,
    group: data.group_name,
    score: {
      home: data.home_score,
      away: data.away_score,
    },
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function updateMatch(id: string, match: Partial<Match>): Promise<Match | null> {
  const { data, error } = await supabase
    .from("matches")
    .update({
      home_team_id: match.homeTeamId,
      away_team_id: match.awayTeamId,
      date: match.date,
      time: match.time,
      venue: match.venue,
      status: match.status,
      phase: match.phase,
      group_name: match.group,
      home_score: match.score?.home,
      away_score: match.score?.away,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating match:", error)
    return null
  }

  return {
    id: data.id,
    homeTeamId: data.home_team_id,
    awayTeamId: data.away_team_id,
    date: data.date,
    time: data.time,
    venue: data.venue,
    status: data.status,
    phase: data.phase,
    group: data.group_name,
    score: {
      home: data.home_score,
      away: data.away_score,
    },
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function deleteMatch(id: string): Promise<boolean> {
  const { error } = await supabase.from("matches").delete().eq("id", id)

  if (error) {
    console.error("Error deleting match:", error)
    return false
  }

  return true
}

// Función para obtener un partido enriquecido con todos los datos relacionados
export async function getEnrichedMatch(id: string): Promise<any | null> {
  // Obtener el partido
  const match = await getMatchById(id)
  if (!match) return null

  // Obtener los eventos del partido
  const { data: eventsData, error: eventsError } = await supabase
    .from("match_events")
    .select(`
      *,
      player:player_id (id, first_name, last_name, number, position, team_id),
      assist_player:assist_player_id (id, first_name, last_name, number, position, team_id),
      team:team_id (id, name)
    `)
    .eq("match_id", id)
    .order("minute")

  if (eventsError) {
    console.error("Error fetching match events:", eventsError)
    return match
  }

  // Obtener los jugadores de ambos equipos
  const homePlayers = await getPlayersByTeam(match.homeTeamId)
  const awayPlayers = await getPlayersByTeam(match.awayTeamId)

  // Separar titulares y suplentes
  const homeStartingXI = homePlayers.filter((p) => p.isStarter)
  const homeSubstitutes = homePlayers.filter((p) => !p.isStarter)

  const awayStartingXI = awayPlayers.filter((p) => p.isStarter)
  const awaySubstitutes = awayPlayers.filter((p) => !p.isStarter)

  // Obtener los medios del partido
  const { data: mediaData, error: mediaError } = await supabase.from("media").select("*").eq("match_id", id)

  if (mediaError) {
    console.error("Error fetching match media:", mediaError)
  }

  // Calcular estadísticas del partido
  const stats = {
    possession: { home: 50, away: 50 },
    shots: { home: 0, away: 0 },
    shotsOnTarget: { home: 0, away: 0 },
    corners: { home: 0, away: 0 },
    fouls: { home: 0, away: 0 },
    yellowCards: { home: 0, away: 0 },
    redCards: { home: 0, away: 0 },
  }

  // Si el partido está completado, generar estadísticas realistas
  if (match.status === "completed") {
    // Posesión
    stats.possession.home = Math.floor(Math.random() * 30) + 35 // Entre 35% y 65%
    stats.possession.away = 100 - stats.possession.home

    // Tiros
    stats.shots.home = Math.floor(Math.random() * 15) + 5 // Entre 5 y 20
    stats.shots.away = Math.floor(Math.random() * 15) + 5 // Entre 5 y 20

    // Tiros a puerta (siempre menor o igual que los tiros totales)
    stats.shotsOnTarget.home = Math.floor(Math.random() * (stats.shots.home + 1))
    stats.shotsOnTarget.away = Math.floor(Math.random() * (stats.shots.away + 1))

    // Córners
    stats.corners.home = Math.floor(Math.random() * 10) + 1 // Entre 1 y 10
    stats.corners.away = Math.floor(Math.random() * 10) + 1 // Entre 1 y 10

    // Faltas
    stats.fouls.home = Math.floor(Math.random() * 15) + 5 // Entre 5 y 20
    stats.fouls.away = Math.floor(Math.random() * 15) + 5 // Entre 5 y 20

    // Contar tarjetas de los eventos del partido
    if (eventsData) {
      eventsData.forEach((event) => {
        if (event.type === "yellowCard") {
          if (event.team_id === match.homeTeamId) {
            stats.yellowCards.home++
          } else {
            stats.yellowCards.away++
          }
        } else if (event.type === "redCard") {
          if (event.team_id === match.homeTeamId) {
            stats.redCards.home++
          } else {
            stats.redCards.away++
          }
        }
      })
    }
  }

  // Construir el objeto enriquecido
  return {
    ...match,
    events: eventsData || [],
    homeStartingXI,
    homeSubstitutes,
    awayStartingXI,
    awaySubstitutes,
    media: mediaData || [],
    stats,
  }
}

// ==================== FUNCIONES PARA EVENTOS DE PARTIDO ====================

export async function createMatchEvent(event: Omit<MatchEvent, "id" | "createdAt">): Promise<MatchEvent | null> {
  const { data, error } = await supabase
    .from("match_events")
    .insert({
      match_id: event.matchId,
      player_id: event.playerId,
      assist_player_id: event.assistPlayerId,
      team_id: event.teamId,
      type: event.type,
      minute: event.minute,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating match event:", error)
    return null
  }

  // Actualizar estadísticas del jugador
  if (event.type === "goal") {
    await updatePlayerStats(event.playerId, { goals: 1 })
    if (event.assistPlayerId) {
      await updatePlayerStats(event.assistPlayerId, { assists: 1 })
    }
  } else if (event.type === "yellowCard") {
    await updatePlayerStats(event.playerId, { yellowCards: 1 })
  } else if (event.type === "redCard") {
    await updatePlayerStats(event.playerId, { redCards: 1 })
  }

  return {
    id: data.id,
    matchId: data.match_id,
    playerId: data.player_id,
    assistPlayerId: data.assist_player_id,
    teamId: data.team_id,
    type: data.type,
    minute: data.minute,
    createdAt: data.created_at,
  }
}

export async function deleteMatchEvent(id: string): Promise<boolean> {
  // Obtener el evento antes de eliminarlo para actualizar estadísticas
  const { data: event, error: fetchError } = await supabase.from("match_events").select("*").eq("id", id).single()

  if (fetchError) {
    console.error("Error fetching match event:", fetchError)
    return false
  }

  // Eliminar el evento
  const { error } = await supabase.from("match_events").delete().eq("id", id)

  if (error) {
    console.error("Error deleting match event:", error)
    return false
  }

  // Actualizar estadísticas del jugador
  if (event.type === "goal") {
    await updatePlayerStats(event.player_id, { goals: -1 })
    if (event.assist_player_id) {
      await updatePlayerStats(event.assist_player_id, { assists: -1 })
    }
  } else if (event.type === "yellowCard") {
    await updatePlayerStats(event.player_id, { yellowCards: -1 })
  } else if (event.type === "redCard") {
    await updatePlayerStats(event.player_id, { redCards: -1 })
  }

  return true
}

// ==================== FUNCIONES PARA ESTADÍSTICAS ====================

export async function updatePlayerStats(playerId: string, stats: Partial<PlayerStats>): Promise<boolean> {
  // Obtener estadísticas actuales
  const { data: currentStats, error: fetchError } = await supabase
    .from("player_stats")
    .select("*")
    .eq("player_id", playerId)
    .single()

  if (fetchError) {
    console.error("Error fetching player stats:", fetchError)
    return false
  }

  // Actualizar estadísticas
  const { error } = await supabase
    .from("player_stats")
    .update({
      goals: (currentStats.goals || 0) + (stats.goals || 0),
      assists: (currentStats.assists || 0) + (stats.assists || 0),
      yellow_cards: (currentStats.yellow_cards || 0) + (stats.yellowCards || 0),
      red_cards: (currentStats.red_cards || 0) + (stats.redCards || 0),
      matches_played: (currentStats.matches_played || 0) + (stats.matchesPlayed || 0),
      minutes_played: (currentStats.minutes_played || 0) + (stats.minutesPlayed || 0),
      updated_at: new Date().toISOString(),
    })
    .eq("player_id", playerId)

  if (error) {
    console.error("Error updating player stats:", error)
    return false
  }

  return true
}

export async function getTopScorers(limit = 10): Promise<Player[]> {
  const { data, error } = await supabase
    .from("player_stats")
    .select(`
      goals,
      player:player_id (
        id, first_name, last_name, number, position, team_id,
        team:teams (id, name, logo)
      )
    `)
    .order("goals", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching top scorers:", error)
    return []
  }

  return data.map((stat) => ({
    id: stat.player.id,
    firstName: stat.player.first_name,
    lastName: stat.player.last_name,
    name: `${stat.player.first_name} ${stat.player.last_name}`,
    number: stat.player.number,
    position: stat.player.position,
    teamId: stat.player.team_id,
    team: stat.player.team
      ? {
          id: stat.player.team.id,
          name: stat.player.team.name,
          logo: stat.player.team.logo,
        }
      : undefined,
    stats: {
      goals: stat.goals,
    },
  }))
}

export async function getTopAssists(limit = 10): Promise<Player[]> {
  const { data, error } = await supabase
    .from("player_stats")
    .select(`
      assists,
      player:player_id (
        id, first_name, last_name, number, position, team_id,
        team:teams (id, name, logo)
      )
    `)
    .order("assists", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching top assists:", error)
    return []
  }

  return data.map((stat) => ({
    id: stat.player.id,
    firstName: stat.player.first_name,
    lastName: stat.player.last_name,
    name: `${stat.player.first_name} ${stat.player.last_name}`,
    number: stat.player.number,
    position: stat.player.position,
    teamId: stat.player.team_id,
    team: stat.player.team
      ? {
          id: stat.player.team.id,
          name: stat.player.team.name,
          logo: stat.player.team.logo,
        }
      : undefined,
    stats: {
      assists: stat.assists,
    },
  }))
}

export async function updateTeamStats(teamId: string): Promise<boolean> {
  // Obtener todos los partidos completados del equipo
  const matches = await getPastMatchesByTeam(teamId)

  // Calcular estadísticas
  let played = 0
  let won = 0
  let drawn = 0
  let lost = 0
  let goalsFor = 0
  let goalsAgainst = 0

  matches.forEach((match) => {
    if (match.status === "completed") {
      played++

      if (match.homeTeamId === teamId) {
        goalsFor += match.score?.home || 0
        goalsAgainst += match.score?.away || 0

        if ((match.score?.home || 0) > (match.score?.away || 0)) {
          won++
        } else if ((match.score?.home || 0) < (match.score?.away || 0)) {
          lost++
        } else {
          drawn++
        }
      } else {
        goalsFor += match.score?.away || 0
        goalsAgainst += match.score?.home || 0

        if ((match.score?.away || 0) > (match.score?.home || 0)) {
          won++
        } else if ((match.score?.away || 0) < (match.score?.home || 0)) {
          lost++
        } else {
          drawn++
        }
      }
    }
  })

  // Calcular puntos (3 por victoria, 1 por empate)
  const points = won * 3 + drawn

  // Actualizar estadísticas del equipo
  const { error } = await supabase
    .from("team_stats")
    .update({
      played,
      won,
      drawn,
      lost,
      goals_for: goalsFor,
      goals_against: goalsAgainst,
      points,
      updated_at: new Date().toISOString(),
    })
    .eq("team_id", teamId)

  if (error) {
    console.error("Error updating team stats:", error)
    return false
  }

  return true
}

export async function updateGroupPositions(group: string): Promise<boolean> {
  // Obtener todos los equipos del grupo con sus estadísticas
  const teams = await getTeamsByGroup(group)

  // Ordenar por puntos, diferencia de goles, goles a favor
  const sortedTeams = teams.sort((a, b) => {
    if (!a.stats || !b.stats) return 0

    // Ordenar por puntos
    if (a.stats.points !== b.stats.points) {
      return b.stats.points - a.stats.points
    }

    // Ordenar por diferencia de goles
    const aDiff = a.stats.goalsFor - a.stats.goalsAgainst
    const bDiff = b.stats.goalsFor - b.stats.goalsAgainst
    if (aDiff !== bDiff) {
      return bDiff - aDiff
    }

    // Ordenar por goles a favor
    return b.stats.goalsFor - a.stats.goalsFor
  })

  // Actualizar posiciones
  for (let i = 0; i < sortedTeams.length; i++) {
    const { error } = await supabase
      .from("team_stats")
      .update({
        position: i + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("team_id", sortedTeams[i].id)

    if (error) {
      console.error("Error updating team position:", error)
      return false
    }
  }

  return true
}

// ==================== FUNCIONES PARA EVENTOS (NO DE PARTIDO) ====================

export async function getAllEvents(): Promise<Event[]> {
  const { data, error } = await supabase.from("events").select("*").order("date")

  if (error) {
    console.error("Error fetching events:", error)
    return []
  }

  return data.map((event) => ({
    id: event.id,
    title: event.title,
    description: event.description,
    date: event.date,
    time: event.time,
    location: event.location,
    image: event.image,
    createdAt: event.created_at,
    updatedAt: event.updated_at,
  }))
}

export async function getEventById(id: string): Promise<Event | null> {
  const { data, error } = await supabase.from("events").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching event:", error)
    return null
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    date: data.date,
    time: data.time,
    location: data.location,
    image: data.image,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function createEvent(event: Omit<Event, "id" | "createdAt" | "updatedAt">): Promise<Event | null> {
  const { data, error } = await supabase
    .from("events")
    .insert({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      image: event.image,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating event:", error)
    return null
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    date: data.date,
    time: data.time,
    location: data.location,
    image: data.image,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function updateEvent(id: string, event: Partial<Event>): Promise<Event | null> {
  const { data, error } = await supabase
    .from("events")
    .update({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      image: event.image,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating event:", error)
    return null
  }

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    date: data.date,
    time: data.time,
    location: data.location,
    image: data.image,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function deleteEvent(id: string): Promise<boolean> {
  const { error } = await supabase.from("events").delete().eq("id", id)

  if (error) {
    console.error("Error deleting event:", error)
    return false
  }

  return true
}

// ==================== FUNCIONES PARA MEDIOS ====================

export async function getAllMedia(): Promise<Media[]> {
  const { data, error } = await supabase
    .from("media")
    .select(`
      *,
      match:match_id (id, date, home_team_id, away_team_id),
      team:team_id (id, name)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching media:", error)
    return []
  }

  return data.map((media) => ({
    id: media.id,
    url: media.url,
    thumbnail: media.thumbnail,
    type: media.type,
    caption: media.caption,
    matchId: media.match_id,
    teamId: media.team_id,
    match: media.match
      ? {
          id: media.match.id,
          date: media.match.date,
          homeTeamId: media.match.home_team_id,
          awayTeamId: media.match.away_team_id,
        }
      : undefined,
    team: media.team
      ? {
          id: media.team.id,
          name: media.team.name,
        }
      : undefined,
    createdAt: media.created_at,
  }))
}

export async function getMediaByMatch(matchId: string): Promise<Media[]> {
  const { data, error } = await supabase
    .from("media")
    .select("*")
    .eq("match_id", matchId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching media by match:", error)
    return []
  }

  return data.map((media) => ({
    id: media.id,
    url: media.url,
    thumbnail: media.thumbnail,
    type: media.type,
    caption: media.caption,
    matchId: media.match_id,
    teamId: media.team_id,
    createdAt: media.created_at,
  }))
}

export async function createMedia(media: Omit<Media, "id" | "createdAt">): Promise<Media | null> {
  const { data, error } = await supabase
    .from("media")
    .insert({
      url: media.url,
      thumbnail: media.thumbnail,
      type: media.type,
      caption: media.caption,
      match_id: media.matchId,
      team_id: media.teamId,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating media:", error)
    return null
  }

  return {
    id: data.id,
    url: data.url,
    thumbnail: data.thumbnail,
    type: data.type,
    caption: data.caption,
    matchId: data.match_id,
    teamId: data.team_id,
    createdAt: data.created_at,
  }
}

export async function deleteMedia(id: string): Promise<boolean> {
  const { error } = await supabase.from("media").delete().eq("id", id)

  if (error) {
    console.error("Error deleting media:", error)
    return false
  }

  return true
}

// ==================== FUNCIONES PARA INVITACIONES ====================

export async function createInvitation(
  invitation: Omit<PlayerInvitation, "id" | "token" | "createdAt" | "updatedAt">,
): Promise<PlayerInvitation | null> {
  // Generar token único
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)

  // Calcular fecha de expiración (7 días)
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7)

  const { data, error } = await supabase
    .from("player_invitations")
    .insert({
      email: invitation.email,
      team_id: invitation.teamId,
      is_captain: invitation.isCaptain,
      status: invitation.status || "pending",
      token,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating invitation:", error)
    return null
  }

  // Enviar correo de invitación (esto se implementaría con una Edge Function)
  // await sendInvitationEmail(data.email, data.token, data.is_captain)

  return {
    id: data.id,
    email: data.email,
    teamId: data.team_id,
    isCaptain: data.is_captain,
    status: data.status,
    token: data.token,
    expiresAt: data.expires_at,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function getInvitationByToken(token: string): Promise<PlayerInvitation | null> {
  const { data, error } = await supabase.from("player_invitations").select("*").eq("token", token).single()

  if (error) {
    console.error("Error fetching invitation:", error)
    return null
  }

  return {
    id: data.id,
    email: data.email,
    teamId: data.team_id,
    isCaptain: data.is_captain,
    status: data.status,
    token: data.token,
    expiresAt: data.expires_at,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function updateInvitationStatus(id: string, status: string): Promise<boolean> {
  const { error } = await supabase
    .from("player_invitations")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating invitation status:", error)
    return false
  }

  return true
}

// ==================== FUNCIONES PARA NOTIFICACIONES ====================

export async function createNotification(
  notification: Omit<Notification, "id" | "isRead" | "createdAt">,
): Promise<Notification | null> {
  const { data, error } = await supabase
    .from("notifications")
    .insert({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      target_type: notification.targetType,
      target_id: notification.targetId,
      is_read: false,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating notification:", error)
    return null
  }

  return {
    id: data.id,
    title: data.title,
    message: data.message,
    type: data.type,
    targetType: data.target_type,
    targetId: data.target_id,
    isRead: data.is_read,
    createdAt: data.created_at,
  }
}

export async function getNotificationsForUser(userId: string, teamId: string): Promise<Notification[]> {
  // Obtener notificaciones para todos, para el equipo y para el jugador específico
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .or(
      `target_type.eq.all,and(target_type.eq.team,target_id.eq.${teamId}),and(target_type.eq.player,target_id.eq.${userId})`,
    )
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching notifications:", error)
    return []
  }

  return data.map((notification) => ({
    id: notification.id,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    targetType: notification.target_type,
    targetId: notification.target_id,
    isRead: notification.is_read,
    createdAt: notification.created_at,
  }))
}

export async function markNotificationAsRead(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("notifications")
    .update({
      is_read: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Error marking notification as read:", error)
    return false
  }

  return true
}

// ==================== FUNCIONES PARA USUARIOS ====================

export async function createUser(email: string, password: string, role: string, teamId?: string): Promise<User | null> {
  // Crear usuario en Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  })

  if (authError) {
    console.error("Error creating user in Auth:", authError)
    return null
  }

  // Crear perfil de usuario
  const { data, error } = await supabase
    .from("users")
    .insert({
      id: authData.user?.id,
      email,
      role,
      team_id: teamId,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating user profile:", error)
    return null
  }

  return {
    id: data.id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    role: data.role,
    teamId: data.team_id,
    lastLogin: data.last_login,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function getUserById(id: string): Promise<User | null> {
  const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching user:", error)
    return null
  }

  return {
    id: data.id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    role: data.role,
    teamId: data.team_id,
    lastLogin: data.last_login,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

export async function updateUserProfile(id: string, profile: Partial<User>): Promise<User | null> {
  const { data, error } = await supabase
    .from("users")
    .update({
      first_name: profile.firstName,
      last_name: profile.lastName,
      team_id: profile.teamId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Error updating user profile:", error)
    return null
  }

  return {
    id: data.id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    role: data.role,
    teamId: data.team_id,
    lastLogin: data.last_login,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

// ==================== FUNCIONES PARA INVITACIONES POR CORREO ====================

export async function inviteCaptain(email: string, teamId: string): Promise<boolean> {
  try {
    // Generar contraseña aleatoria
    const password = generatePassword()

    // Crear invitación
    const invitation = await createInvitation({
      email,
      teamId,
      isCaptain: true,
      status: "pending",
    })

    if (!invitation) {
      return false
    }

    // Crear usuario con rol de capitán
    const user = await createUser(email, password, "captain", teamId)

    if (!user) {
      return false
    }

    // Enviar correo con credenciales (esto se implementaría con una Edge Function)
    // await sendCaptainInvitationEmail(email, password, invitation.token)

    return true
  } catch (error) {
    console.error("Error inviting captain:", error)
    return false
  }
}

export async function invitePlayer(email: string, teamId: string): Promise<boolean> {
  try {
    // Generar contraseña aleatoria
    const password = generatePassword()

    // Crear invitación
    const invitation = await createInvitation({
      email,
      teamId,
      isCaptain: false,
      status: "pending",
    })

    if (!invitation) {
      return false
    }

    // Crear usuario con rol de jugador
    const user = await createUser(email, password, "player", teamId)

    if (!user) {
      return false
    }

    // Enviar correo con credenciales (esto se implementaría con una Edge Function)
    // await sendPlayerInvitationEmail(email, password, invitation.token)

    return true
  } catch (error) {
    console.error("Error inviting player:", error)
    return false
  }
}

// ==================== FUNCIONES DE UTILIDAD ====================

// Función para actualizar todas las estadísticas después de un partido
export async function updateStatsAfterMatch(matchId: string): Promise<boolean> {
  try {
    // Obtener el partido
    const match = await getMatchById(matchId)
    if (!match) return false

    // Solo actualizar si el partido está completado
    if (match.status !== "completed") return true

    // Actualizar estadísticas de los equipos
    await updateTeamStats(match.homeTeamId)
    await updateTeamStats(match.awayTeamId)

    // Actualizar posiciones en los grupos
    if (match.group) {
      await updateGroupPositions(match.group)
    }

    return true
  } catch (error) {
    console.error("Error updating stats after match:", error)
    return false
  }
}

// Función para migrar datos desde localStorage a Supabase
export async function migrateDataToSupabase() {
  if (typeof window === "undefined") return false

  try {
    // Obtener datos de localStorage
    const teamsData = JSON.parse(localStorage.getItem("football_teams") || "[]")
    const playersData = JSON.parse(localStorage.getItem("football_players") || "[]")
    const matchesData = JSON.parse(localStorage.getItem("football_matches") || "[]")
    const eventsData = JSON.parse(localStorage.getItem("football_events") || "[]")
    const mediaData = JSON.parse(localStorage.getItem("football_media") || "[]")

    // Migrar equipos
    for (const team of teamsData) {
      const { data, error } = await supabase.from("teams").insert({
        id: team.id,
        name: team.name,
        logo: team.logo,
        group_name: team.group,
      })

      if (error) console.error("Error migrating team:", error)
    }

    // Migrar jugadores
    for (const player of playersData) {
      const { data: playerData, error: playerError } = await supabase.from("players").insert({
        id: player.id,
        first_name: player.name.split(" ")[0],
        last_name: player.name.split(" ").slice(1).join(" "),
        number: player.number,
        position: player.position,
        team_id: player.teamId,
        photo: player.photo,
      })

      if (playerError) console.error("Error migrating player:", playerError)

      // Migrar estadísticas del jugador
      if (player.stats) {
        const { data: statsData, error: statsError } = await supabase.from("player_stats").insert({
          player_id: player.id,
          goals: player.stats.goals || 0,
          assists: player.stats.assists || 0,
          yellow_cards: player.stats.yellowCards || 0,
          red_cards: player.stats.redCards || 0,
          matches_played: player.stats.matchesPlayed || 0,
          minutes_played: player.stats.minutesPlayed || 0,
        })

        if (statsError) console.error("Error migrating player stats:", statsError)
      }
    }

    // Migrar partidos
    for (const match of matchesData) {
      const { data, error } = await supabase.from("matches").insert({
        id: match.id,
        home_team_id: match.homeTeamId,
        away_team_id: match.awayTeamId,
        date: match.date,
        time: match.time,
        venue: match.venue,
        status: match.status,
        phase: match.phase,
        group_name: match.group,
        home_score: match.score?.home || 0,
        away_score: match.score?.away || 0,
      })

      if (error) console.error("Error migrating match:", error)

      // Migrar eventos del partido
      if (match.events) {
        for (const event of match.events) {
          const { data: eventData, error: eventError } = await supabase.from("match_events").insert({
            match_id: match.id,
            player_id: event.playerId,
            assist_player_id: event.assistPlayerId,
            team_id: event.teamId,
            type: event.type,
            minute: event.minute,
          })

          if (eventError) console.error("Error migrating match event:", eventError)
        }
      }
    }

    // Migrar eventos
    for (const event of eventsData) {
      const { data, error } = await supabase.from("events").insert({
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        time: event.time,
        location: event.location,
        image: event.image,
      })

      if (error) console.error("Error migrating event:", error)
    }

    // Migrar medios
    for (const media of mediaData) {
      const { data, error } = await supabase.from("media").insert({
        id: media.id,
        url: media.url,
        thumbnail: media.thumbnail,
        type: media.type,
        caption: media.caption,
        match_id: media.matchId,
        team_id: media.teamId,
      })

      if (error) console.error("Error migrating media:", error)
    }

    return true
  } catch (error) {
    console.error("Error migrating data to Supabase:", error)
    return false
  }
}
