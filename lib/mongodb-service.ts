// Este archivo será el punto de conexión con MongoDB
// Cuando implementes MongoDB, solo necesitarás modificar este archivo

import type { TeamModel, PlayerModel, MatchModel, MatchEventModel, EventModel, MediaModel } from "./models"

// Simulación de base de datos en memoria para desarrollo
let teams: TeamModel[] = []
let players: PlayerModel[] = []
let matches: MatchModel[] = []
let events: EventModel[] = []
let media: MediaModel[] = []

// Función para inicializar datos desde localStorage (solo para desarrollo)
const initializeFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    try {
      const storedTeams = localStorage.getItem("football_teams")
      const storedPlayers = localStorage.getItem("football_players")
      const storedMatches = localStorage.getItem("football_matches")
      const storedEvents = localStorage.getItem("football_events")
      const storedMedia = localStorage.getItem("football_media")

      if (storedTeams) teams = JSON.parse(storedTeams)
      if (storedPlayers) players = JSON.parse(storedPlayers)
      if (storedMatches) matches = JSON.parse(storedMatches)
      if (storedEvents) events = JSON.parse(storedEvents)
      if (storedMedia) media = JSON.parse(storedMedia)
    } catch (error) {
      console.error("Error loading data from localStorage:", error)
    }
  }
}

// Guardar en localStorage (solo para desarrollo)
const saveToLocalStorage = () => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("football_teams", JSON.stringify(teams))
      localStorage.setItem("football_players", JSON.stringify(players))
      localStorage.setItem("football_matches", JSON.stringify(matches))
      localStorage.setItem("football_events", JSON.stringify(events))
      localStorage.setItem("football_media", JSON.stringify(media))
    } catch (error) {
      console.error("Error saving data to localStorage:", error)
    }
  }
}

// Inicializar datos
if (typeof window !== "undefined") {
  initializeFromLocalStorage()
}

// ==================== EQUIPOS ====================

export const getTeams = async (): Promise<TeamModel[]> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  return teams
}

export const getTeamById = async (id: string): Promise<TeamModel | null> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  const team = teams.find((t) => t._id === id)
  return team || null
}

export const createTeam = async (team: TeamModel): Promise<TeamModel> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  const newTeam = {
    ...team,
    _id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  teams.push(newTeam)
  saveToLocalStorage()
  return newTeam
}

export const updateTeam = async (id: string, team: Partial<TeamModel>): Promise<TeamModel | null> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  const index = teams.findIndex((t) => t._id === id)
  if (index === -1) return null

  teams[index] = {
    ...teams[index],
    ...team,
    updatedAt: new Date(),
  }
  saveToLocalStorage()
  return teams[index]
}

export const deleteTeam = async (id: string): Promise<boolean> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  const initialLength = teams.length
  teams = teams.filter((t) => t._id !== id)
  saveToLocalStorage()
  return teams.length < initialLength
}

// ==================== JUGADORES ====================

export const getPlayers = async (): Promise<PlayerModel[]> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  return players
}

export const getPlayerById = async (id: string): Promise<PlayerModel | null> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  const player = players.find((p) => p._id === id)
  return player || null
}

export const getPlayersByTeam = async (teamId: string): Promise<PlayerModel[]> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  return players.filter((p) => p.teamId === teamId)
}

export const createPlayer = async (player: PlayerModel): Promise<PlayerModel> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  const newPlayer = {
    ...player,
    _id: Date.now().toString(),
    stats: player.stats || {
      goals: 0,
      assists: 0,
      yellowCards: 0,
      redCards: 0,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  players.push(newPlayer)

  // Actualizar el equipo para incluir al jugador
  const teamIndex = teams.findIndex((t) => t._id === player.teamId)
  if (teamIndex !== -1) {
    teams[teamIndex].players.push(newPlayer._id)
  }

  saveToLocalStorage()
  return newPlayer
}

export const updatePlayer = async (id: string, player: Partial<PlayerModel>): Promise<PlayerModel | null> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  const index = players.findIndex((p) => p._id === id)
  if (index === -1) return null

  players[index] = {
    ...players[index],
    ...player,
    updatedAt: new Date(),
  }
  saveToLocalStorage()
  return players[index]
}

export const deletePlayer = async (id: string): Promise<boolean> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  const initialLength = players.length
  const player = players.find((p) => p._id === id)

  if (player) {
    // Eliminar al jugador del equipo
    const teamIndex = teams.findIndex((t) => t._id === player.teamId)
    if (teamIndex !== -1) {
      teams[teamIndex].players = teams[teamIndex].players.filter((pId) => pId !== id)
    }
  }

  players = players.filter((p) => p._id !== id)
  saveToLocalStorage()
  return players.length < initialLength
}

// ==================== PARTIDOS ====================

export const getMatches = async (): Promise<MatchModel[]> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  return matches
}

export const getMatchById = async (id: string): Promise<MatchModel | null> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  const match = matches.find((m) => m._id === id)
  return match || null
}

export const getMatchesByPhase = async (phase: string): Promise<MatchModel[]> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  return matches.filter((m) => m.phase === phase)
}

export const getUpcomingMatches = async (): Promise<MatchModel[]> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  return matches.filter((m) => m.status === "upcoming")
}

export const getCompletedMatches = async (): Promise<MatchModel[]> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  return matches.filter((m) => m.status === "completed")
}

export const createMatch = async (match: MatchModel): Promise<MatchModel> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  const newMatch = {
    ...match,
    _id: Date.now().toString(),
    events: match.events || [],
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  matches.push(newMatch)
  saveToLocalStorage()
  return newMatch
}

export const updateMatch = async (id: string, match: Partial<MatchModel>): Promise<MatchModel | null> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  const index = matches.findIndex((m) => m._id === id)
  if (index === -1) return null

  matches[index] = {
    ...matches[index],
    ...match,
    updatedAt: new Date(),
  }
  saveToLocalStorage()
  return matches[index]
}

export const deleteMatch = async (id: string): Promise<boolean> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  const initialLength = matches.length
  matches = matches.filter((m) => m._id !== id)
  saveToLocalStorage()
  return matches.length < initialLength
}

// ==================== EVENTOS DE PARTIDO ====================

export const addMatchEvent = async (matchId: string, event: MatchEventModel): Promise<MatchModel | null> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  const matchIndex = matches.findIndex((m) => m._id === matchId)
  if (matchIndex === -1) return null

  const newEvent = {
    ...event,
    _id: Date.now().toString(),
    matchId,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  matches[matchIndex].events.push(newEvent)

  // Actualizar estadísticas del jugador
  const playerIndex = players.findIndex((p) => p._id === event.playerId)
  if (playerIndex !== -1) {
    if (event.type === "goal") {
      players[playerIndex].stats.goals += 1

      // Actualizar asistencia si existe
      if (event.assistPlayerId) {
        const assistPlayerIndex = players.findIndex((p) => p._id === event.assistPlayerId)
        if (assistPlayerIndex !== -1) {
          players[assistPlayerIndex].stats.assists += 1
        }
      }
    } else if (event.type === "yellowCard") {
      players[playerIndex].stats.yellowCards += 1
    } else if (event.type === "redCard") {
      players[playerIndex].stats.redCards += 1
    }
  }

  saveToLocalStorage()
  return matches[matchIndex]
}

export const removeMatchEvent = async (matchId: string, eventId: string): Promise<MatchModel | null> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  const matchIndex = matches.findIndex((m) => m._id === matchId)
  if (matchIndex === -1) return null

  const event = matches[matchIndex].events.find((e) => e._id === eventId)
  if (event) {
    // Revertir estadísticas del jugador
    const playerIndex = players.findIndex((p) => p._id === event.playerId)
    if (playerIndex !== -1) {
      if (event.type === "goal") {
        players[playerIndex].stats.goals = Math.max(0, players[playerIndex].stats.goals - 1)

        // Revertir asistencia si existe
        if (event.assistPlayerId) {
          const assistPlayerIndex = players.findIndex((p) => p._id === event.assistPlayerId)
          if (assistPlayerIndex !== -1) {
            players[assistPlayerIndex].stats.assists = Math.max(0, players[assistPlayerIndex].stats.assists - 1)
          }
        }
      } else if (event.type === "yellowCard") {
        players[playerIndex].stats.yellowCards = Math.max(0, players[playerIndex].stats.yellowCards - 1)
      } else if (event.type === "redCard") {
        players[playerIndex].stats.redCards = Math.max(0, players[playerIndex].stats.redCards - 1)
      }
    }
  }

  matches[matchIndex].events = matches[matchIndex].events.filter((e) => e._id !== eventId)
  saveToLocalStorage()
  return matches[matchIndex]
}

// ==================== EVENTOS (NO DE PARTIDO) ====================

export const getEvents = async (): Promise<EventModel[]> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  return events
}

export const getEventById = async (id: string): Promise<EventModel | null> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  const event = events.find((e) => e._id === id)
  return event || null
}

export const createEvent = async (event: EventModel): Promise<EventModel> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  const newEvent = {
    ...event,
    _id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  events.push(newEvent)
  saveToLocalStorage()
  return newEvent
}

export const updateEvent = async (id: string, event: Partial<EventModel>): Promise<EventModel | null> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  const index = events.findIndex((e) => e._id === id)
  if (index === -1) return null

  events[index] = {
    ...events[index],
    ...event,
    updatedAt: new Date(),
  }
  saveToLocalStorage()
  return events[index]
}

export const deleteEvent = async (id: string): Promise<boolean> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  const initialLength = events.length
  events = events.filter((e) => e._id !== id)
  saveToLocalStorage()
  return events.length < initialLength
}

// ==================== MEDIA ====================

export const getMedia = async (): Promise<MediaModel[]> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  return media
}

export const getMediaById = async (id: string): Promise<MediaModel | null> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  const mediaItem = media.find((m) => m._id === id)
  return mediaItem || null
}

export const getMediaByMatch = async (matchId: string): Promise<MediaModel[]> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  return media.filter((m) => m.matchId === matchId)
}

export const createMedia = async (mediaItem: MediaModel): Promise<MediaModel> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  const newMedia = {
    ...mediaItem,
    _id: Date.now().toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  media.push(newMedia)
  saveToLocalStorage()
  return newMedia
}

export const updateMedia = async (id: string, mediaItem: Partial<MediaModel>): Promise<MediaModel | null> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  const index = media.findIndex((m) => m._id === id)
  if (index === -1) return null

  media[index] = {
    ...media[index],
    ...mediaItem,
    updatedAt: new Date(),
  }
  saveToLocalStorage()
  return media[index]
}

export const deleteMedia = async (id: string): Promise<boolean> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  const initialLength = media.length
  media = media.filter((m) => m._id !== id)
  saveToLocalStorage()
  return media.length < initialLength
}

// ==================== ESTADÍSTICAS ====================

export const getTopScorers = async (limit = 10): Promise<PlayerModel[]> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  return [...players].sort((a, b) => (b.stats?.goals || 0) - (a.stats?.goals || 0)).slice(0, limit)
}

export const getTopAssists = async (limit = 10): Promise<PlayerModel[]> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  return [...players].sort((a, b) => (b.stats?.assists || 0) - (a.stats?.assists || 0)).slice(0, limit)
}

// ==================== CALENDARIO ====================

export const getCalendarItems = async (): Promise<(MatchModel | EventModel)[]> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  // Combinar partidos y eventos en un solo array para el calendario
  const matchItems = matches.map((match) => ({
    ...match,
    itemType: "match",
  }))

  const eventItems = events.map((event) => ({
    ...event,
    itemType: "event",
  }))

  return [...matchItems, ...eventItems].sort((a, b) => {
    // Ordenar por fecha y hora
    const dateA = new Date(`${a.date}T${a.time}`)
    const dateB = new Date(`${b.date}T${b.time}`)
    return dateA.getTime() - dateB.getTime()
  })
}

// ==================== UTILIDADES ====================

export const getEnrichedMatch = async (matchId: string): Promise<any> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  const match = await getMatchById(matchId)
  if (!match) return null

  const homeTeam = await getTeamById(match.homeTeamId)
  const awayTeam = await getTeamById(match.awayTeamId)

  // Obtener jugadores de ambos equipos
  const homePlayers = await getPlayersByTeam(match.homeTeamId)
  const awayPlayers = await getPlayersByTeam(match.awayTeamId)

  // Obtener media relacionada con el partido
  const matchMedia = await getMediaByMatch(matchId)

  return {
    ...match,
    homeTeam,
    awayTeam,
    homePlayers,
    awayPlayers,
    media: matchMedia,
  }
}

export const getEnrichedMatches = async (): Promise<any[]> => {
  // Cuando implementes MongoDB, reemplaza esto con una llamada a la API
  const allMatches = await getMatches()
  const allTeams = await getTeams()

  return allMatches.map((match) => {
    const homeTeam = allTeams.find((team) => team._id === match.homeTeamId)
    const awayTeam = allTeams.find((team) => team._id === match.awayTeamId)

    return {
      ...match,
      homeTeam,
      awayTeam,
    }
  })
}

// Exportar todas las funciones
export default {
  // Equipos
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam,

  // Jugadores
  getPlayers,
  getPlayerById,
  getPlayersByTeam,
  createPlayer,
  updatePlayer,
  deletePlayer,

  // Partidos
  getMatches,
  getMatchById,
  getMatchesByPhase,
  getUpcomingMatches,
  getCompletedMatches,
  createMatch,
  updateMatch,
  deleteMatch,

  // Eventos de partido
  addMatchEvent,
  removeMatchEvent,

  // Eventos (no de partido)
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,

  // Media
  getMedia,
  getMediaById,
  getMediaByMatch,
  createMedia,
  updateMedia,
  deleteMedia,

  // Estadísticas
  getTopScorers,
  getTopAssists,

  // Calendario
  getCalendarItems,

  // Utilidades
  getEnrichedMatch,
  getEnrichedMatches,
}
