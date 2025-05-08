import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"
import type { TeamModel, PlayerModel, MatchModel, MatchEventModel, EventModel, MediaModel } from "./models"

// Nombre de la base de datos
const dbName = "torneo2025"

// Función para convertir _id de ObjectId a string en los resultados
const convertId = <T extends { _id?: ObjectId | string }>(doc: T): T => {
  if (doc && doc._id && typeof doc._id !== "string") {
    return { ...doc, _id: doc._id.toString() }
  }
  return doc
}

// Función para convertir _id de string a ObjectId para las consultas
const toObjectId = (id: string) => {
  try {
    return new ObjectId(id)
  } catch (error) {
    console.error("Error al convertir a ObjectId:", error)
    return id
  }
}

// ==================== EQUIPOS ====================

export const getTeams = async (): Promise<TeamModel[]> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const teams = await db.collection("teams").find({}).toArray()
    return teams.map((team) => convertId(team)) as TeamModel[]
  } catch (error) {
    console.error("Error al obtener equipos:", error)
    return []
  }
}

export const getTeamById = async (id: string): Promise<TeamModel | null> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const team = await db.collection("teams").findOne({ _id: toObjectId(id) })
    return team ? (convertId(team) as TeamModel) : null
  } catch (error) {
    console.error("Error al obtener equipo por ID:", error)
    return null
  }
}

export const createTeam = async (team: TeamModel): Promise<TeamModel> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const now = new Date()
    const newTeam = {
      ...team,
      players: team.players || [],
      stats: team.stats || {
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        points: 0,
      },
      createdAt: now,
      updatedAt: now,
    }
    const result = await db.collection("teams").insertOne(newTeam)
    return { ...newTeam, _id: result.insertedId.toString() } as TeamModel
  } catch (error) {
    console.error("Error al crear equipo:", error)
    throw error
  }
}

export const updateTeam = async (id: string, team: Partial<TeamModel>): Promise<TeamModel | null> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const now = new Date()
    const result = await db
      .collection("teams")
      .findOneAndUpdate({ _id: toObjectId(id) }, { $set: { ...team, updatedAt: now } }, { returnDocument: "after" })
    return result ? (convertId(result) as TeamModel) : null
  } catch (error) {
    console.error("Error al actualizar equipo:", error)
    return null
  }
}

export const deleteTeam = async (id: string): Promise<boolean> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const result = await db.collection("teams").deleteOne({ _id: toObjectId(id) })
    return result.deletedCount > 0
  } catch (error) {
    console.error("Error al eliminar equipo:", error)
    return false
  }
}

// ==================== JUGADORES ====================

export const getPlayers = async (): Promise<PlayerModel[]> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const players = await db.collection("players").find({}).toArray()
    return players.map((player) => convertId(player)) as PlayerModel[]
  } catch (error) {
    console.error("Error al obtener jugadores:", error)
    return []
  }
}

export const getPlayerById = async (id: string): Promise<PlayerModel | null> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const player = await db.collection("players").findOne({ _id: toObjectId(id) })
    return player ? (convertId(player) as PlayerModel) : null
  } catch (error) {
    console.error("Error al obtener jugador por ID:", error)
    return null
  }
}

export const getPlayersByTeam = async (teamId: string): Promise<PlayerModel[]> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const players = await db.collection("players").find({ teamId }).toArray()
    return players.map((player) => convertId(player)) as PlayerModel[]
  } catch (error) {
    console.error("Error al obtener jugadores por equipo:", error)
    return []
  }
}

export const createPlayer = async (player: PlayerModel): Promise<PlayerModel> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const now = new Date()
    const newPlayer = {
      ...player,
      stats: player.stats || {
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
      },
      createdAt: now,
      updatedAt: now,
    }
    const result = await db.collection("players").insertOne(newPlayer)

    // Actualizar el equipo para incluir al jugador
    await db
      .collection("teams")
      .updateOne({ _id: toObjectId(player.teamId) }, { $push: { players: result.insertedId.toString() } })

    return { ...newPlayer, _id: result.insertedId.toString() } as PlayerModel
  } catch (error) {
    console.error("Error al crear jugador:", error)
    throw error
  }
}

export const updatePlayer = async (id: string, player: Partial<PlayerModel>): Promise<PlayerModel | null> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const now = new Date()
    const result = await db
      .collection("players")
      .findOneAndUpdate({ _id: toObjectId(id) }, { $set: { ...player, updatedAt: now } }, { returnDocument: "after" })
    return result ? (convertId(result) as PlayerModel) : null
  } catch (error) {
    console.error("Error al actualizar jugador:", error)
    return null
  }
}

export const deletePlayer = async (id: string): Promise<boolean> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)

    // Obtener el jugador para saber a qué equipo pertenece
    const player = await db.collection("players").findOne({ _id: toObjectId(id) })

    if (player) {
      // Eliminar al jugador del equipo
      await db.collection("teams").updateOne({ _id: toObjectId(player.teamId) }, { $pull: { players: id } })
    }

    const result = await db.collection("players").deleteOne({ _id: toObjectId(id) })
    return result.deletedCount > 0
  } catch (error) {
    console.error("Error al eliminar jugador:", error)
    return false
  }
}

// ==================== PARTIDOS ====================

export const getMatches = async (): Promise<MatchModel[]> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const matches = await db.collection("matches").find({}).toArray()
    return matches.map((match) => convertId(match)) as MatchModel[]
  } catch (error) {
    console.error("Error al obtener partidos:", error)
    return []
  }
}

export const getMatchById = async (id: string): Promise<MatchModel | null> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const match = await db.collection("matches").findOne({ _id: toObjectId(id) })
    return match ? (convertId(match) as MatchModel) : null
  } catch (error) {
    console.error("Error al obtener partido por ID:", error)
    return null
  }
}

export const getMatchesByPhase = async (phase: string): Promise<MatchModel[]> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const matches = await db.collection("matches").find({ phase }).toArray()
    return matches.map((match) => convertId(match)) as MatchModel[]
  } catch (error) {
    console.error("Error al obtener partidos por fase:", error)
    return []
  }
}

export const getUpcomingMatches = async (): Promise<MatchModel[]> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const matches = await db.collection("matches").find({ status: "upcoming" }).toArray()
    return matches.map((match) => convertId(match)) as MatchModel[]
  } catch (error) {
    console.error("Error al obtener partidos próximos:", error)
    return []
  }
}

export const getCompletedMatches = async (): Promise<MatchModel[]> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const matches = await db.collection("matches").find({ status: "completed" }).toArray()
    return matches.map((match) => convertId(match)) as MatchModel[]
  } catch (error) {
    console.error("Error al obtener partidos completados:", error)
    return []
  }
}

export const createMatch = async (match: MatchModel): Promise<MatchModel> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const now = new Date()
    const newMatch = {
      ...match,
      events: match.events || [],
      createdAt: now,
      updatedAt: now,
    }
    const result = await db.collection("matches").insertOne(newMatch)
    return { ...newMatch, _id: result.insertedId.toString() } as MatchModel
  } catch (error) {
    console.error("Error al crear partido:", error)
    throw error
  }
}

export const updateMatch = async (id: string, match: Partial<MatchModel>): Promise<MatchModel | null> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const now = new Date()
    const result = await db
      .collection("matches")
      .findOneAndUpdate({ _id: toObjectId(id) }, { $set: { ...match, updatedAt: now } }, { returnDocument: "after" })
    return result ? (convertId(result) as MatchModel) : null
  } catch (error) {
    console.error("Error al actualizar partido:", error)
    return null
  }
}

export const deleteMatch = async (id: string): Promise<boolean> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const result = await db.collection("matches").deleteOne({ _id: toObjectId(id) })
    return result.deletedCount > 0
  } catch (error) {
    console.error("Error al eliminar partido:", error)
    return false
  }
}

// ==================== EVENTOS DE PARTIDO ====================

export const addMatchEvent = async (matchId: string, event: MatchEventModel): Promise<MatchModel | null> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const now = new Date()

    const newEvent = {
      ...event,
      _id: new ObjectId().toString(),
      matchId,
      createdAt: now,
      updatedAt: now,
    }

    // Añadir evento al partido
    const result = await db
      .collection("matches")
      .findOneAndUpdate({ _id: toObjectId(matchId) }, { $push: { events: newEvent } }, { returnDocument: "after" })

    // Actualizar estadísticas del jugador
    if (event.type === "goal") {
      await db.collection("players").updateOne({ _id: toObjectId(event.playerId) }, { $inc: { "stats.goals": 1 } })

      // Actualizar asistencia si existe
      if (event.assistPlayerId) {
        await db
          .collection("players")
          .updateOne({ _id: toObjectId(event.assistPlayerId) }, { $inc: { "stats.assists": 1 } })
      }
    } else if (event.type === "yellowCard") {
      await db
        .collection("players")
        .updateOne({ _id: toObjectId(event.playerId) }, { $inc: { "stats.yellowCards": 1 } })
    } else if (event.type === "redCard") {
      await db.collection("players").updateOne({ _id: toObjectId(event.playerId) }, { $inc: { "stats.redCards": 1 } })
    }

    return result ? (convertId(result) as MatchModel) : null
  } catch (error) {
    console.error("Error al añadir evento de partido:", error)
    return null
  }
}

export const removeMatchEvent = async (matchId: string, eventId: string): Promise<MatchModel | null> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)

    // Obtener el partido para encontrar el evento
    const match = await db.collection("matches").findOne({ _id: toObjectId(matchId) })
    if (!match) return null

    const event = match.events.find((e: any) => e._id.toString() === eventId)
    if (!event) return null

    // Revertir estadísticas del jugador
    if (event.type === "goal") {
      await db.collection("players").updateOne({ _id: toObjectId(event.playerId) }, { $inc: { "stats.goals": -1 } })

      // Revertir asistencia si existe
      if (event.assistPlayerId) {
        await db
          .collection("players")
          .updateOne({ _id: toObjectId(event.assistPlayerId) }, { $inc: { "stats.assists": -1 } })
      }
    } else if (event.type === "yellowCard") {
      await db
        .collection("players")
        .updateOne({ _id: toObjectId(event.playerId) }, { $inc: { "stats.yellowCards": -1 } })
    } else if (event.type === "redCard") {
      await db.collection("players").updateOne({ _id: toObjectId(event.playerId) }, { $inc: { "stats.redCards": -1 } })
    }

    // Eliminar evento del partido
    const result = await db
      .collection("matches")
      .findOneAndUpdate(
        { _id: toObjectId(matchId) },
        { $pull: { events: { _id: eventId } } },
        { returnDocument: "after" },
      )

    return result ? (convertId(result) as MatchModel) : null
  } catch (error) {
    console.error("Error al eliminar evento de partido:", error)
    return null
  }
}

// ==================== EVENTOS (NO DE PARTIDO) ====================

export const getEvents = async (): Promise<EventModel[]> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const events = await db.collection("events").find({}).toArray()
    return events.map((event) => convertId(event)) as EventModel[]
  } catch (error) {
    console.error("Error al obtener eventos:", error)
    return []
  }
}

export const getEventById = async (id: string): Promise<EventModel | null> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const event = await db.collection("events").findOne({ _id: toObjectId(id) })
    return event ? (convertId(event) as EventModel) : null
  } catch (error) {
    console.error("Error al obtener evento por ID:", error)
    return null
  }
}

export const createEvent = async (event: EventModel): Promise<EventModel> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const now = new Date()
    const newEvent = {
      ...event,
      createdAt: now,
      updatedAt: now,
    }
    const result = await db.collection("events").insertOne(newEvent)
    return { ...newEvent, _id: result.insertedId.toString() } as EventModel
  } catch (error) {
    console.error("Error al crear evento:", error)
    throw error
  }
}

export const updateEvent = async (id: string, event: Partial<EventModel>): Promise<EventModel | null> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const now = new Date()
    const result = await db
      .collection("events")
      .findOneAndUpdate({ _id: toObjectId(id) }, { $set: { ...event, updatedAt: now } }, { returnDocument: "after" })
    return result ? (convertId(result) as EventModel) : null
  } catch (error) {
    console.error("Error al actualizar evento:", error)
    return null
  }
}

export const deleteEvent = async (id: string): Promise<boolean> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const result = await db.collection("events").deleteOne({ _id: toObjectId(id) })
    return result.deletedCount > 0
  } catch (error) {
    console.error("Error al eliminar evento:", error)
    return false
  }
}

// ==================== MEDIA ====================

export const getMedia = async (): Promise<MediaModel[]> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const media = await db.collection("media").find({}).toArray()
    return media.map((item) => convertId(item)) as MediaModel[]
  } catch (error) {
    console.error("Error al obtener media:", error)
    return []
  }
}

export const getMediaById = async (id: string): Promise<MediaModel | null> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const media = await db.collection("media").findOne({ _id: toObjectId(id) })
    return media ? (convertId(media) as MediaModel) : null
  } catch (error) {
    console.error("Error al obtener media por ID:", error)
    return null
  }
}

export const getMediaByMatch = async (matchId: string): Promise<MediaModel[]> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const media = await db.collection("media").find({ matchId }).toArray()
    return media.map((item) => convertId(item)) as MediaModel[]
  } catch (error) {
    console.error("Error al obtener media por partido:", error)
    return []
  }
}

export const createMedia = async (mediaItem: MediaModel): Promise<MediaModel> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const now = new Date()
    const newMedia = {
      ...mediaItem,
      createdAt: now,
      updatedAt: now,
    }
    const result = await db.collection("media").insertOne(newMedia)
    return { ...newMedia, _id: result.insertedId.toString() } as MediaModel
  } catch (error) {
    console.error("Error al crear media:", error)
    throw error
  }
}

export const updateMedia = async (id: string, mediaItem: Partial<MediaModel>): Promise<MediaModel | null> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const now = new Date()
    const result = await db
      .collection("media")
      .findOneAndUpdate(
        { _id: toObjectId(id) },
        { $set: { ...mediaItem, updatedAt: now } },
        { returnDocument: "after" },
      )
    return result ? (convertId(result) as MediaModel) : null
  } catch (error) {
    console.error("Error al actualizar media:", error)
    return null
  }
}

export const deleteMedia = async (id: string): Promise<boolean> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const result = await db.collection("media").deleteOne({ _id: toObjectId(id) })
    return result.deletedCount > 0
  } catch (error) {
    console.error("Error al eliminar media:", error)
    return false
  }
}

// ==================== ESTADÍSTICAS ====================

export const getTopScorers = async (limit = 10): Promise<PlayerModel[]> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const players = await db.collection("players").find({}).sort({ "stats.goals": -1 }).limit(limit).toArray()
    return players.map((player) => convertId(player)) as PlayerModel[]
  } catch (error) {
    console.error("Error al obtener goleadores:", error)
    return []
  }
}

export const getTopAssists = async (limit = 10): Promise<PlayerModel[]> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)
    const players = await db.collection("players").find({}).sort({ "stats.assists": -1 }).limit(limit).toArray()
    return players.map((player) => convertId(player)) as PlayerModel[]
  } catch (error) {
    console.error("Error al obtener asistidores:", error)
    return []
  }
}

// ==================== CALENDARIO ====================

export const getCalendarItems = async (): Promise<(MatchModel | EventModel)[]> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)

    // Obtener partidos
    const matches = await db.collection("matches").find({}).toArray()
    const matchItems = matches.map((match) => ({
      ...convertId(match),
      itemType: "match",
    }))

    // Obtener eventos
    const events = await db.collection("events").find({}).toArray()
    const eventItems = events.map((event) => ({
      ...convertId(event),
      itemType: "event",
    }))

    // Combinar y ordenar por fecha y hora
    return [...matchItems, ...eventItems].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`)
      const dateB = new Date(`${b.date}T${b.time}`)
      return dateA.getTime() - dateB.getTime()
    })
  } catch (error) {
    console.error("Error al obtener elementos del calendario:", error)
    return []
  }
}

// ==================== UTILIDADES ====================

export const getEnrichedMatch = async (matchId: string): Promise<any> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)

    // Obtener partido
    const match = await db.collection("matches").findOne({ _id: toObjectId(matchId) })
    if (!match) return null

    // Obtener equipos
    const homeTeam = await db.collection("teams").findOne({ _id: toObjectId(match.homeTeamId) })
    const awayTeam = await db.collection("teams").findOne({ _id: toObjectId(match.awayTeamId) })

    // Obtener jugadores
    const homePlayers = await db.collection("players").find({ teamId: match.homeTeamId }).toArray()
    const awayPlayers = await db.collection("players").find({ teamId: match.awayTeamId }).toArray()

    // Obtener media
    const matchMedia = await db.collection("media").find({ matchId }).toArray()

    return {
      ...convertId(match),
      homeTeam: homeTeam ? convertId(homeTeam) : null,
      awayTeam: awayTeam ? convertId(awayTeam) : null,
      homePlayers: homePlayers.map((player) => convertId(player)),
      awayPlayers: awayPlayers.map((player) => convertId(player)),
      media: matchMedia.map((item) => convertId(item)),
    }
  } catch (error) {
    console.error("Error al obtener partido enriquecido:", error)
    return null
  }
}

export const getEnrichedMatches = async (): Promise<any[]> => {
  try {
    const client = await clientPromise
    const db = client.db(dbName)

    // Obtener partidos
    const matches = await db.collection("matches").find({}).toArray()

    // Obtener todos los equipos para evitar múltiples consultas
    const teams = await db.collection("teams").find({}).toArray()
    const teamsMap = teams.reduce(
      (map, team) => {
        map[team._id.toString()] = convertId(team)
        return map
      },
      {} as Record<string, any>,
    )

    // Enriquecer partidos con información de equipos
    return matches.map((match) => {
      const homeTeam = teamsMap[match.homeTeamId]
      const awayTeam = teamsMap[match.awayTeamId]

      return {
        ...convertId(match),
        homeTeam,
        awayTeam,
      }
    })
  } catch (error) {
    console.error("Error al obtener partidos enriquecidos:", error)
    return []
  }
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
