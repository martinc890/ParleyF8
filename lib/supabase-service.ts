import { getSupabase } from "./supabase-client"
import type { Team, Player, Match, MatchEvent, PlayerStats } from "./types"
import { generatePassword } from "./utils"

// Función para manejar errores de Supabase
const handleError = (error: any, operation: string) => {
  console.error(`Error en ${operation}:`, error)
  throw new Error(`Error en ${operation}: ${error.message || "Desconocido"}`)
}

// ==================== FUNCIONES PARA EQUIPOS ====================

// Obtener todos los equipos
export async function getAllTeams(): Promise<Team[]> {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("teams").select("*").order("name")

    if (error) throw error
    return data || []
  } catch (error) {
    handleError(error, "obtener equipos")
    return []
  }
}

// Obtener un equipo por ID
export async function getTeamById(id: string): Promise<Team | null> {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("teams").select("*").eq("id", id).single()

    if (error) throw error
    return data
  } catch (error) {
    handleError(error, `obtener equipo ${id}`)
    return null
  }
}

// Crear un nuevo equipo
export async function createTeam(team: Omit<Team, "id">): Promise<Team | null> {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("teams").insert([team]).select().single()

    if (error) throw error
    return data
  } catch (error) {
    handleError(error, "crear equipo")
    return null
  }
}

// Actualizar un equipo
export async function updateTeam(id: string, team: Partial<Team>): Promise<Team | null> {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("teams").update(team).eq("id", id).select().single()

    if (error) throw error
    return data
  } catch (error) {
    handleError(error, `actualizar equipo ${id}`)
    return null
  }
}

// Eliminar un equipo
export async function deleteTeam(id: string): Promise<boolean> {
  try {
    const supabase = getSupabase()
    const { error } = await supabase.from("teams").delete().eq("id", id)

    if (error) throw error
    return true
  } catch (error) {
    handleError(error, `eliminar equipo ${id}`)
    return false
  }
}

// ==================== FUNCIONES PARA JUGADORES ====================

// Obtener todos los jugadores
export async function getAllPlayers(): Promise<Player[]> {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("players").select("*, teams(name)").order("last_name")

    if (error) throw error
    return data || []
  } catch (error) {
    handleError(error, "obtener jugadores")
    return []
  }
}

// Obtener jugadores por equipo
export async function getPlayersByTeam(teamId: string): Promise<Player[]> {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("players").select("*").eq("team_id", teamId).order("number")

    if (error) throw error
    return data || []
  } catch (error) {
    handleError(error, `obtener jugadores del equipo ${teamId}`)
    return []
  }
}

// Obtener un jugador por ID
export async function getPlayerById(id: string): Promise<Player | null> {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("players").select("*, teams(name)").eq("id", id).single()

    if (error) throw error
    return data
  } catch (error) {
    handleError(error, `obtener jugador ${id}`)
    return null
  }
}

// Crear un nuevo jugador
export async function createPlayer(player: Omit<Player, "id">): Promise<Player | null> {
  try {
    const supabase = getSupabase()

    // Verificar que el número no esté duplicado en el equipo
    const { data: existingPlayers } = await supabase
      .from("players")
      .select("number")
      .eq("team_id", player.team_id)
      .eq("number", player.number)

    if (existingPlayers && existingPlayers.length > 0) {
      throw new Error(`El número ${player.number} ya está asignado a otro jugador en este equipo`)
    }

    const { data, error } = await supabase.from("players").insert([player]).select().single()

    if (error) throw error
    return data
  } catch (error) {
    handleError(error, "crear jugador")
    return null
  }
}

// Actualizar un jugador
export async function updatePlayer(id: string, player: Partial<Player>): Promise<Player | null> {
  try {
    const supabase = getSupabase()

    // Si se está actualizando el número, verificar que no esté duplicado
    if (player.number !== undefined) {
      const { data: currentPlayer } = await supabase.from("players").select("team_id").eq("id", id).single()

      const teamId = player.team_id || (currentPlayer?.team_id as string)

      const { data: existingPlayers } = await supabase
        .from("players")
        .select("id, number")
        .eq("team_id", teamId)
        .eq("number", player.number)
        .neq("id", id)

      if (existingPlayers && existingPlayers.length > 0) {
        throw new Error(`El número ${player.number} ya está asignado a otro jugador en este equipo`)
      }
    }

    const { data, error } = await supabase.from("players").update(player).eq("id", id).select().single()

    if (error) throw error
    return data
  } catch (error) {
    handleError(error, `actualizar jugador ${id}`)
    return null
  }
}

// Eliminar un jugador
export async function deletePlayer(id: string): Promise<boolean> {
  try {
    const supabase = getSupabase()
    const { error } = await supabase.from("players").delete().eq("id", id)

    if (error) throw error
    return true
  } catch (error) {
    handleError(error, `eliminar jugador ${id}`)
    return false
  }
}

// ==================== FUNCIONES PARA PARTIDOS ====================

// Obtener todos los partidos
export async function getAllMatches(): Promise<Match[]> {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("matches")
      .select(`
        *,
        home_team:home_team_id(id, name, logo_url),
        away_team:away_team_id(id, name, logo_url)
      `)
      .order("date")

    if (error) throw error
    return data || []
  } catch (error) {
    handleError(error, "obtener partidos")
    return []
  }
}

// Obtener partidos por grupo
export async function getMatchesByGroup(group: string): Promise<Match[]> {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("matches")
      .select(`
        *,
        home_team:home_team_id(id, name, logo_url),
        away_team:away_team_id(id, name, logo_url)
      `)
      .eq("group", group)
      .order("date")

    if (error) throw error
    return data || []
  } catch (error) {
    handleError(error, `obtener partidos del grupo ${group}`)
    return []
  }
}

// Obtener partidos de playoffs
export async function getPlayoffMatches(): Promise<Match[]> {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("matches")
      .select(`
        *,
        home_team:home_team_id(id, name, logo_url),
        away_team:away_team_id(id, name, logo_url)
      `)
      .is("group", null)
      .order("date")

    if (error) throw error
    return data || []
  } catch (error) {
    handleError(error, "obtener partidos de playoffs")
    return []
  }
}

// Obtener un partido por ID
export async function getMatchById(id: string): Promise<Match | null> {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("matches")
      .select(`
        *,
        home_team:home_team_id(id, name, logo_url),
        away_team:away_team_id(id, name, logo_url)
      `)
      .eq("id", id)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    handleError(error, `obtener partido ${id}`)
    return null
  }
}

// Crear un nuevo partido
export async function createMatch(match: Omit<Match, "id">): Promise<Match | null> {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("matches").insert([match]).select().single()

    if (error) throw error
    return data
  } catch (error) {
    handleError(error, "crear partido")
    return null
  }
}

// Actualizar un partido
export async function updateMatch(id: string, match: Partial<Match>): Promise<Match | null> {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("matches").update(match).eq("id", id).select().single()

    if (error) throw error

    // Si se actualizó el resultado, actualizar las estadísticas del equipo
    if (match.home_score !== undefined || match.away_score !== undefined) {
      await updateStatsAfterMatch(id)
    }

    return data
  } catch (error) {
    handleError(error, `actualizar partido ${id}`)
    return null
  }
}

// Eliminar un partido
export async function deleteMatch(id: string): Promise<boolean> {
  try {
    const supabase = getSupabase()
    const { error } = await supabase.from("matches").delete().eq("id", id)

    if (error) throw error
    return true
  } catch (error) {
    handleError(error, `eliminar partido ${id}`)
    return false
  }
}

// ==================== FUNCIONES PARA EVENTOS DE PARTIDO ====================

// Obtener eventos por partido
export async function getMatchEventsByMatch(matchId: string): Promise<MatchEvent[]> {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("match_events")
      .select(`
        *,
        player:player_id(id, first_name, last_name, number),
        assist_player:assist_player_id(id, first_name, last_name, number)
      `)
      .eq("match_id", matchId)
      .order("minute")

    if (error) throw error
    return data || []
  } catch (error) {
    handleError(error, `obtener eventos del partido ${matchId}`)
    return []
  }
}

// Crear un nuevo evento
export async function createMatchEvent(event: Omit<MatchEvent, "id">): Promise<MatchEvent | null> {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase.from("match_events").insert([event]).select().single()

    if (error) throw error

    // Si es un gol, actualizar las estadísticas del jugador
    if (event.type === "goal") {
      await updatePlayerStats(event.player_id, "goals")

      // Si hay asistencia, actualizar las estadísticas del asistente
      if (event.assist_player_id) {
        await updatePlayerStats(event.assist_player_id, "assists")
      }
    }

    return data
  } catch (error) {
    handleError(error, "crear evento de partido")
    return null
  }
}

// Eliminar un evento
export async function deleteMatchEvent(id: string): Promise<boolean> {
  try {
    const supabase = getSupabase()

    // Obtener el evento antes de eliminarlo para actualizar estadísticas
    const { data: event } = await supabase.from("match_events").select("*").eq("id", id).single()

    const { error } = await supabase.from("match_events").delete().eq("id", id)

    if (error) throw error

    // Si era un gol, actualizar las estadísticas del jugador
    if (event && event.type === "goal") {
      await updatePlayerStats(event.player_id, "goals", -1)

      // Si había asistencia, actualizar las estadísticas del asistente
      if (event.assist_player_id) {
        await updatePlayerStats(event.assist_player_id, "assists", -1)
      }
    }

    return true
  } catch (error) {
    handleError(error, `eliminar evento de partido ${id}`)
    return false
  }
}

// ==================== FUNCIONES PARA ESTADÍSTICAS ====================

// Función para actualizar las estadísticas de un jugador
export async function updatePlayerStats(playerId: string, stat: "goals" | "assists", increment = 1): Promise<void> {
  try {
    const supabase = getSupabase()

    // Verificar si el jugador ya tiene estadísticas
    const { data: existingStats } = await supabase.from("player_stats").select("*").eq("player_id", playerId).single()

    if (existingStats) {
      // Actualizar estadísticas existentes
      await supabase
        .from("player_stats")
        .update({
          [stat]: existingStats[stat] + increment,
        })
        .eq("player_id", playerId)
    } else {
      // Crear nuevas estadísticas
      await supabase.from("player_stats").insert([
        {
          player_id: playerId,
          goals: stat === "goals" ? increment : 0,
          assists: stat === "assists" ? increment : 0,
        },
      ])
    }
  } catch (error) {
    console.error(`Error al actualizar estadísticas del jugador ${playerId}:`, error)
  }
}

// Función para actualizar las estadísticas de los equipos después de un partido
export async function updateStatsAfterMatch(matchId: string): Promise<void> {
  try {
    const supabase = getSupabase()

    // Obtener información del partido
    const { data: match } = await supabase.from("matches").select("*").eq("id", matchId).single()

    if (!match || match.status !== "completed" || match.home_score === null || match.away_score === null) {
      return
    }

    // Determinar el resultado
    let homePoints = 0
    let awayPoints = 0

    if (match.home_score > match.away_score) {
      homePoints = 3
    } else if (match.home_score < match.away_score) {
      awayPoints = 3
    } else {
      homePoints = 1
      awayPoints = 1
    }

    // Actualizar estadísticas del equipo local
    await updateSingleTeamStats(match.home_team_id, {
      played: 1,
      won: homePoints === 3 ? 1 : 0,
      drawn: homePoints === 1 ? 1 : 0,
      lost: homePoints === 0 ? 1 : 0,
      goals_for: match.home_score,
      goals_against: match.away_score,
      points: homePoints,
    })

    // Actualizar estadísticas del equipo visitante
    await updateSingleTeamStats(match.away_team_id, {
      played: 1,
      won: awayPoints === 3 ? 1 : 0,
      drawn: awayPoints === 1 ? 1 : 0,
      lost: awayPoints === 0 ? 1 : 0,
      goals_for: match.away_score,
      goals_against: match.home_score,
      points: awayPoints,
    })

    // Actualizar posiciones de grupo
    if (match.group) {
      await updateGroupPositions(match.group)
    }
  } catch (error) {
    console.error(`Error al actualizar estadísticas de equipos para el partido ${matchId}:`, error)
  }
}

// Función para actualizar las estadísticas de un solo equipo
export async function updateSingleTeamStats(
  teamId: string,
  stats: {
    played: number
    won: number
    drawn: number
    lost: number
    goals_for: number
    goals_against: number
    points: number
  },
): Promise<void> {
  try {
    const supabase = getSupabase()

    // Verificar si el equipo ya tiene estadísticas
    const { data: team } = await supabase
      .from("teams")
      .select("played, won, drawn, lost, goals_for, goals_against, points")
      .eq("id", teamId)
      .single()

    if (team) {
      // Actualizar estadísticas existentes
      await supabase
        .from("teams")
        .update({
          played: (team.played || 0) + stats.played,
          won: (team.won || 0) + stats.won,
          drawn: (team.drawn || 0) + stats.drawn,
          lost: (team.lost || 0) + stats.lost,
          goals_for: (team.goals_for || 0) + stats.goals_for,
          goals_against: (team.goals_against || 0) + stats.goals_against,
          points: (team.points || 0) + stats.points,
        })
        .eq("id", teamId)
    }
  } catch (error) {
    console.error(`Error al actualizar estadísticas del equipo ${teamId}:`, error)
  }
}

// Función para actualizar las posiciones de los equipos en un grupo
export async function updateGroupPositions(group: string): Promise<void> {
  try {
    const supabase = getSupabase()

    // Obtener todos los equipos del grupo
    const { data: teams } = await supabase
      .from("teams")
      .select("*")
      .eq("group", group)
      .order("points", { ascending: false })
      .order("goals_for", { ascending: false })
      .order("goals_against", { ascending: true })

    if (!teams || teams.length === 0) {
      return
    }

    // Actualizar la posición de cada equipo
    for (let i = 0; i < teams.length; i++) {
      await supabase
        .from("teams")
        .update({ position: i + 1 })
        .eq("id", teams[i].id)
    }
  } catch (error) {
    console.error(`Error al actualizar posiciones del grupo ${group}:`, error)
  }
}

// Obtener los mejores goleadores
export async function getTopScorers(limit = 10): Promise<PlayerStats[]> {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("player_stats")
      .select(`
        *,
        player:player_id(id, first_name, last_name, number, team_id),
        player.teams:team_id(id, name)
      `)
      .order("goals", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    handleError(error, "obtener mejores goleadores")
    return []
  }
}

// Obtener los mejores asistentes
export async function getTopAssists(limit = 10): Promise<PlayerStats[]> {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from("player_stats")
      .select(`
        *,
        player:player_id(id, first_name, last_name, number, team_id),
        player.teams:team_id(id, name)
      `)
      .order("assists", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  } catch (error) {
    handleError(error, "obtener mejores asistentes")
    return []
  }
}

// ==================== FUNCIONES PARA INVITACIONES ====================

// Invitar a un capitán
export async function inviteCaptain(email: string, teamId: string): Promise<boolean> {
  try {
    const supabase = getSupabase()

    // Generar contraseña aleatoria
    const password = generatePassword()

    // Crear usuario en Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError

    // Crear rol de capitán
    const { error: roleError } = await supabase.from("user_roles").insert([
      {
        user_id: authData.user?.id,
        role: "captain",
        team_id: teamId,
      },
    ])

    if (roleError) throw roleError

    // Aquí se podría enviar un correo con las credenciales
    console.log(`Capitán creado: ${email}, Contraseña: ${password}`)

    return true
  } catch (error) {
    handleError(error, `invitar capitán ${email}`)
    return false
  }
}

// Invitar a un jugador
export async function invitePlayer(email: string, teamId: string): Promise<boolean> {
  try {
    const supabase = getSupabase()

    // Generar contraseña aleatoria
    const password = generatePassword()

    // Crear usuario en Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError

    // Crear rol de jugador
    const { error: roleError } = await supabase.from("user_roles").insert([
      {
        user_id: authData.user?.id,
        role: "player",
        team_id: teamId,
      },
    ])

    if (roleError) throw roleError

    // Aquí se podría enviar un correo con las credenciales
    console.log(`Jugador creado: ${email}, Contraseña: ${password}`)

    return true
  } catch (error) {
    handleError(error, `invitar jugador ${email}`)
    return false
  }
}

// ==================== FUNCIONES DE MIGRACIÓN ====================

// Función para migrar datos desde localStorage a Supabase
export async function migrateDataToSupabase(): Promise<boolean> {
  if (typeof window === "undefined") return false

  try {
    const supabase = getSupabase()

    // Obtener datos de localStorage
    const teamsData = JSON.parse(localStorage.getItem("football_teams") || "[]")
    const playersData = JSON.parse(localStorage.getItem("football_players") || "[]")
    const matchesData = JSON.parse(localStorage.getItem("football_matches") || "[]")

    // Migrar equipos
    for (const team of teamsData) {
      await supabase.from("teams").insert({
        id: team.id,
        name: team.name,
        logo_url: team.logo,
        group: team.group,
      })
    }

    // Migrar jugadores
    for (const player of playersData) {
      await supabase.from("players").insert({
        id: player.id,
        first_name: player.name.split(" ")[0],
        last_name: player.name.split(" ").slice(1).join(" "),
        number: player.number,
        position: player.position,
        team_id: player.teamId,
        photo_url: player.photo,
      })
    }

    // Migrar partidos
    for (const match of matchesData) {
      await supabase.from("matches").insert({
        id: match.id,
        home_team_id: match.homeTeamId,
        away_team_id: match.awayTeamId,
        date: match.date,
        time: match.time,
        venue: match.venue,
        status: match.status,
        phase: match.phase,
        group: match.group,
        home_score: match.score?.home || 0,
        away_score: match.score?.away || 0,
      })
    }

    return true
  } catch (error) {
    console.error("Error al migrar datos a Supabase:", error)
    return false
  }
}

// Exportar servicios como objeto
export const teamService = {
  getAll: getAllTeams,
  getById: getTeamById,
  create: createTeam,
  update: updateTeam,
  delete: deleteTeam,
}

export const playerService = {
  getAll: getAllPlayers,
  getByTeam: getPlayersByTeam,
  getById: getPlayerById,
  create: createPlayer,
  update: updatePlayer,
  delete: deletePlayer,
}

export const matchService = {
  getAll: getAllMatches,
  getByGroup: getMatchesByGroup,
  getPlayoffs: getPlayoffMatches,
  getById: getMatchById,
  create: createMatch,
  update: updateMatch,
  delete: deleteMatch,
}

export const matchEventService = {
  getByMatch: getMatchEventsByMatch,
  create: createMatchEvent,
  delete: deleteMatchEvent,
}

export const playerStatsService = {
  getTopScorers,
  getTopAssists,
}

export const invitationService = {
  inviteCaptain,
  invitePlayer,
}

export const migrationService = {
  migrateDataToSupabase,
}

// Exportar todos los servicios
export const supabaseService = {
  teams: teamService,
  players: playerService,
  matches: matchService,
  matchEvents: matchEventService,
  playerStats: playerStatsService,
  invitations: invitationService,
  migration: migrationService,
}

export default supabaseService
