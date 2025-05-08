import type { Team, Player, Match, Event, Media, CalendarItem } from "./types"

// Importar el servicio configurado (MongoDB o localStorage)
import dbService from "./db-config"

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

  // Si no hay datos, crear arrays vacíos
  if (!teams) teams = []
  if (!players) players = []
  if (!matches) matches = []
  if (!events) events = []
  if (!media) media = []
  if (!calendar) calendar = []
}

// Funciones para equipos
export function getAllTeams(): Team[] {
  if (!teams) initializeData()
  return teams
}

export function getTeamById(id: string): Team | undefined {
  if (!teams) initializeData()
  return teams.find((team) => team.id === id)
}

export function getTeamsByGroup(group: string): Team[] {
  if (!teams) initializeData()
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
  if (!players) initializeData()
  return players
}

export function getPlayerById(id: string): Player | undefined {
  if (!players) initializeData()
  return players.find((player) => player.id === id)
}

export function getPlayersByTeam(teamId: string): Player[] {
  if (!players) initializeData()
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
  if (!matches) initializeData()
  return matches
}

export function getMatchById(id: string): Match | undefined {
  if (!matches) initializeData()
  return matches.find((match) => match.id === id)
}

export function getMatchesByPhase(phase: string): Match[] {
  if (!matches) initializeData()
  return matches.filter((match) => match.phase === phase)
}

export function getUpcomingMatches(): Match[] {
  if (!matches) initializeData()
  return matches.filter((match) => match.status === "upcoming")
}

export function getCompletedMatches(): Match[] {
  if (!matches) initializeData()
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
    }
  })
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

// Exportar todas las funciones del servicio
export const {
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
  //deletePlayer,

  // Partidos
  getMatches,
  //getMatchById,
  //getMatchesByPhase,
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
} = dbService

export default dbService
