import type { Team, Player, Match, Event, Media, CalendarItem } from "./types"
import { initializeMockData } from "./mock-data"

// Inicializar los datos como arrays vacíos
let teams: Team[] = []
let players: Player[] = []
let matches: Match[] = []
let events: Event[] = []
let media: Media[] = []
let calendar: CalendarItem[] = []

// Helper to safely check if we're in a browser environment
const isBrowser = typeof window !== "undefined"

// Función para inicializar datos
function initializeData() {
  // Intentar cargar datos desde localStorage
  loadDataFromLocalStorage()

  // Si no hay datos, crear datos mock
  if (teams.length === 0 || players.length === 0 || matches.length === 0) {
    const mockData = initializeMockData()
    teams = mockData.teams
    players = mockData.players
    matches = mockData.matches
    saveDataToLocalStorage()
  }

  // Si no hay datos, crear arrays vacíos
  if (!events) events = []
  if (!media) media = []
  if (!calendar) calendar = []
}

// Funciones para equipos
export function getAllTeams(): Team[] {
  if (!teams || teams.length === 0) initializeData()
  return teams
}

export function getTeamById(id: string): Team | undefined {
  if (!teams || teams.length === 0) initializeData()
  return teams.find((team) => team.id === id)
}

export function getTeamsByGroup(group: string): Team[] {
  if (!teams || teams.length === 0) initializeData()
  return teams.filter((team) => team.group === group)
}

export function addTeam(team: Team): void {
  if (!teams) initializeData()
  teams.push(team)
  saveDataToLocalStorage()
}

export function updateTeam(updatedTeam: Team): void {
  if (!teams) initializeData()
  teams = teams.map((team) => (team.id === updatedTeam.id ? updatedTeam : team))
  saveDataToLocalStorage()
}

export function deleteTeam(id: string): void {
  if (!teams) initializeData()
  teams = teams.filter((team) => team.id !== id)
  saveDataToLocalStorage()
}

// Funciones para jugadores
export function getAllPlayers(): Player[] {
  if (!players || players.length === 0) initializeData()
  return players
}

export function getPlayerById(id: string): Player | undefined {
  if (!players || players.length === 0) initializeData()
  return players.find((player) => player.id === id)
}

export function getPlayersByTeam(teamId: string): Player[] {
  if (!players || players.length === 0) initializeData()
  return players.filter((player) => player.teamId === teamId)
}

export function addPlayer(player: Player): void {
  if (!players) initializeData()
  players.push(player)
  saveDataToLocalStorage()
}

export function updatePlayer(updatedPlayer: Player): void {
  if (!players) initializeData()
  players = players.map((player) => (player.id === updatedPlayer.id ? updatedPlayer : player))
  saveDataToLocalStorage()
}

export function deletePlayer(id: string): void {
  if (!players) initializeData()
  players = players.filter((player) => player.id !== id)
  saveDataToLocalStorage()
}

// Funciones para partidos
export function getAllMatches(): Match[] {
  if (!matches || matches.length === 0) initializeData()
  return matches
}

export function getMatchById(id: string): Match | undefined {
  if (!matches || matches.length === 0) initializeData()
  return matches.find((match) => match.id === id)
}

export function getMatchesByPhase(phase: string): Match[] {
  if (!matches || matches.length === 0) initializeData()
  return matches.filter((match) => match.phase === phase)
}

export function getUpcomingMatches(): Match[] {
  if (!matches || matches.length === 0) initializeData()
  return matches.filter((match) => match.status === "upcoming")
}

export function getCompletedMatches(): Match[] {
  if (!matches || matches.length === 0) initializeData()
  return matches.filter((match) => match.status === "completed")
}

export function addMatch(match: Match): void {
  if (!matches) initializeData()
  matches.push(match)
  saveDataToLocalStorage()
}

export function updateMatch(updatedMatch: Match): void {
  if (!matches) initializeData()
  matches = matches.map((match) => (match.id === updatedMatch.id ? updatedMatch : match))
  saveDataToLocalStorage()
}

export function deleteMatch(id: string): void {
  if (!matches) initializeData()
  matches = matches.filter((match) => match.id !== id)
  saveDataToLocalStorage()
}

// Funciones para eventos
export function getAllEvents(): Event[] {
  if (!events) initializeData()
  return events
}

export function getEventById(id: string): Event | undefined {
  if (!events) initializeData()
  return events.find((event) => event.id === id)
}

export function addEvent(event: Event): void {
  if (!events) initializeData()
  events.push(event)
  saveDataToLocalStorage()
}

export function updateEvent(updatedEvent: Event): void {
  if (!events) initializeData()
  events = events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
  saveDataToLocalStorage()
}

export function deleteEvent(id: string): void {
  if (!events) initializeData()
  events = events.filter((event) => event.id !== id)
  saveDataToLocalStorage()
}

// Funciones para media
export function getAllMedia(): Media[] {
  if (!media) initializeData()
  return media
}

export function getMediaById(id: string): Media | undefined {
  if (!media) initializeData()
  return media.find((item) => item.id === id)
}

export function getMediaByMatch(matchId: string): Media[] {
  if (!media) initializeData()
  return media.filter((item) => item.matchId === matchId)
}

export function addMedia(mediaItem: Media): void {
  if (!media) initializeData()
  media.push(mediaItem)
  saveDataToLocalStorage()
}

export function updateMedia(updatedMedia: Media): void {
  if (!media) initializeData()
  media = media.map((item) => (item.id === updatedMedia.id ? updatedMedia : item))
  saveDataToLocalStorage()
}

export function deleteMedia(id: string): void {
  if (!media) initializeData()
  media = media.filter((item) => item.id !== id)
  saveDataToLocalStorage()
}

// Funciones para el calendario
export function getAllCalendarItems(): CalendarItem[] {
  if (!calendar) initializeData()
  return calendar
}

export function getCalendarItemsByDate(date: string): CalendarItem[] {
  if (!calendar) initializeData()
  return calendar.filter((item) => item.date === date)
}

export function addCalendarItem(item: CalendarItem): void {
  if (!calendar) initializeData()
  calendar.push(item)
  saveDataToLocalStorage()
}

export function updateCalendarItem(updatedItem: CalendarItem): void {
  if (!calendar) initializeData()
  calendar = calendar.map((item) => (item.id === updatedItem.id ? updatedItem : item))
  saveDataToLocalStorage()
}

export function deleteCalendarItem(id: string): void {
  if (!calendar) initializeData()
  calendar = calendar.filter((item) => item.id !== id)
  saveDataToLocalStorage()
}

// Función para obtener partidos enriquecidos con información de equipos
export function getEnrichedMatches(): any[] {
  if (!matches || !teams) initializeData()

  return matches.map((match) => {
    const homeTeam = getTeamById(match.homeTeamId)
    const awayTeam = getTeamById(match.awayTeamId)

    return {
      ...match,
      homeTeam,
      awayTeam,
      homeScore: match.score?.home || 0,
      awayScore: match.score?.away || 0,
    }
  })
}

// Función para obtener un partido enriquecido con toda la información
export function getEnrichedMatch(id: string): any {
  const match = getMatchById(id)
  if (!match) return null

  const homeTeam = getTeamById(match.homeTeamId)
  const awayTeam = getTeamById(match.awayTeamId)

  // Obtener jugadores de ambos equipos
  const homePlayers = getPlayersByTeam(match.homeTeamId)
  const awayPlayers = getPlayersByTeam(match.awayTeamId)

  // Separar titulares y suplentes (asumiendo que los primeros 8 son titulares)
  const homeStartingXI = homePlayers.slice(0, 8)
  const homeSubstitutes = homePlayers.slice(8)

  const awayStartingXI = awayPlayers.slice(0, 8)
  const awaySubstitutes = awayPlayers.slice(8)

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
    match.events.forEach((event) => {
      if (event.type === "yellowCard") {
        if (event.teamId === match.homeTeamId) {
          stats.yellowCards.home++
        } else {
          stats.yellowCards.away++
        }
      } else if (event.type === "redCard") {
        if (event.teamId === match.homeTeamId) {
          stats.redCards.home++
        } else {
          stats.redCards.away++
        }
      }
    })
  }

  return {
    ...match,
    homeTeam,
    awayTeam,
    homeStartingXI,
    homeSubstitutes,
    awayStartingXI,
    awaySubstitutes,
    stats,
  }
}

// Función para obtener los próximos partidos de un equipo
export function getUpcomingMatchesByTeam(teamId: string): Match[] {
  if (!matches || matches.length === 0) initializeData()
  return matches.filter(
    (match) => (match.homeTeamId === teamId || match.awayTeamId === teamId) && match.status === "upcoming",
  )
}

// Función para obtener los partidos pasados de un equipo
export function getPastMatchesByTeam(teamId: string): Match[] {
  if (!matches || matches.length === 0) initializeData()
  return matches.filter(
    (match) => (match.homeTeamId === teamId || match.awayTeamId === teamId) && match.status === "completed",
  )
}

// Función para guardar todos los datos en localStorage
export function saveDataToLocalStorage(): void {
  if (!isBrowser) return

  try {
    localStorage.setItem("football_teams", JSON.stringify(teams))
    localStorage.setItem("football_players", JSON.stringify(players))
    localStorage.setItem("football_matches", JSON.stringify(matches))
    localStorage.setItem("football_events", JSON.stringify(events))
    localStorage.setItem("football_media", JSON.stringify(media))
    localStorage.setItem("football_calendar", JSON.stringify(calendar))
  } catch (error) {
    console.error("Error saving data to localStorage:", error)
  }
}

// Función para cargar todos los datos desde localStorage
export function loadDataFromLocalStorage(): void {
  if (!isBrowser) return

  try {
    const storedTeams = localStorage.getItem("football_teams")
    const storedPlayers = localStorage.getItem("football_players")
    const storedMatches = localStorage.getItem("football_matches")
    const storedEvents = localStorage.getItem("football_events")
    const storedMedia = localStorage.getItem("football_media")
    const storedCalendar = localStorage.getItem("football_calendar")

    // Si hay datos almacenados, los cargamos
    if (storedTeams) teams = JSON.parse(storedTeams)
    if (storedPlayers) players = JSON.parse(storedPlayers)
    if (storedMatches) matches = JSON.parse(storedMatches)
    if (storedEvents) events = JSON.parse(storedEvents)
    if (storedMedia) media = JSON.parse(storedMedia)
    if (storedCalendar) calendar = JSON.parse(storedCalendar)
  } catch (error) {
    console.error("Error loading data from localStorage:", error)
    // En caso de error, inicializamos arrays vacíos
    teams = []
    players = []
    matches = []
    events = []
    media = []
    calendar = []
  }
}

// Función para exportar todos los datos como JSON
export function exportAllData(): string {
  const allData = {
    teams,
    players,
    matches,
    events,
    media,
    calendar,
  }
  return JSON.stringify(allData, null, 2)
}

// Función para importar todos los datos desde JSON
export function importAllData(jsonData: string): boolean {
  try {
    const parsedData = JSON.parse(jsonData)

    if (parsedData.teams) teams = parsedData.teams
    if (parsedData.players) players = parsedData.players
    if (parsedData.matches) matches = parsedData.matches
    if (parsedData.events) events = parsedData.events
    if (parsedData.media) media = parsedData.media
    if (parsedData.calendar) calendar = parsedData.calendar

    saveDataToLocalStorage()
    return true
  } catch (error) {
    console.error("Error importing data:", error)
    return false
  }
}

// Función para limpiar todos los datos
export function clearAllData(): void {
  teams = []
  players = []
  matches = []
  events = []
  media = []
  calendar = []

  if (isBrowser) {
    try {
      localStorage.removeItem("football_teams")
      localStorage.removeItem("football_players")
      localStorage.removeItem("football_matches")
      localStorage.removeItem("football_events")
      localStorage.removeItem("football_media")
      localStorage.removeItem("football_calendar")
    } catch (error) {
      console.error("Error clearing data from localStorage:", error)
    }
  }
}

// Inicializar datos
if (isBrowser) {
  initializeData()
}

// Exportar funciones adicionales para compatibilidad con la versión anterior
export const getTeams = getAllTeams
export const getPlayers = getAllPlayers
export const getMatches = getAllMatches
export const getEvents = getAllEvents
export const getMedia = getAllMedia
export const getTopScorers = () => {
  return getAllPlayers()
    .sort((a, b) => (b.stats?.goals || 0) - (a.stats?.goals || 0))
    .slice(0, 10)
}
export const getTopAssists = () => {
  return getAllPlayers()
    .sort((a, b) => (b.stats?.assists || 0) - (a.stats?.assists || 0))
    .slice(0, 10)
}
export const getCalendarItems = getAllCalendarItems
