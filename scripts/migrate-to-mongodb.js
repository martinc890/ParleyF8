// Este script migra los datos de localStorage a MongoDB
// Ejecutar con: node -r dotenv/config scripts/migrate-to-mongodb.js

import clientPromise from "../lib/mongodb"

async function migrateData() {
  try {
    console.log("Iniciando migración de datos a MongoDB...")

    const client = await clientPromise
    const db = client.db("torneo2025")

    // Verificar si hay colecciones existentes y eliminarlas si es necesario
    const collections = await db.listCollections().toArray()
    const collectionNames = collections.map((c) => c.name)

    const collectionsToMigrate = ["teams", "players", "matches", "events", "media"]

    for (const collection of collectionsToMigrate) {
      if (collectionNames.includes(collection)) {
        console.log(`Eliminando colección existente: ${collection}`)
        await db.collection(collection).drop()
      }
    }

    // Obtener datos de localStorage (esto solo funcionará en un entorno de navegador)
    // Para un script de Node.js, deberías leer los datos de archivos JSON
    let teams = []
    let players = []
    let matches = []
    let events = []
    let media = []

    // Leer datos de archivos JSON
    try {
      const fs = require("fs")
      const path = require("path")

      const teamsPath = path.join(__dirname, "../data/teams.json")
      const playersPath = path.join(__dirname, "../data/players.json")
      const matchesPath = path.join(__dirname, "../data/matches.json")
      const eventsPath = path.join(__dirname, "../data/events.json")
      const mediaPath = path.join(__dirname, "../data/media.json")

      if (fs.existsSync(teamsPath)) {
        teams = JSON.parse(fs.readFileSync(teamsPath, "utf8"))
        console.log(`Leídos ${teams.length} equipos de teams.json`)
      }

      if (fs.existsSync(playersPath)) {
        players = JSON.parse(fs.readFileSync(playersPath, "utf8"))
        console.log(`Leídos ${players.length} jugadores de players.json`)
      }

      if (fs.existsSync(matchesPath)) {
        matches = JSON.parse(fs.readFileSync(matchesPath, "utf8"))
        console.log(`Leídos ${matches.length} partidos de matches.json`)
      }

      if (fs.existsSync(eventsPath)) {
        events = JSON.parse(fs.readFileSync(eventsPath, "utf8"))
        console.log(`Leídos ${events.length} eventos de events.json`)
      }

      if (fs.existsSync(mediaPath)) {
        media = JSON.parse(fs.readFileSync(mediaPath, "utf8"))
        console.log(`Leídos ${media.length} elementos de media de media.json`)
      }
    } catch (error) {
      console.error("Error al leer archivos JSON:", error)
    }

    // Migrar equipos
    if (teams.length > 0) {
      console.log(`Migrando ${teams.length} equipos...`)
      const now = new Date()
      const teamsWithTimestamps = teams.map((team) => ({
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
      }))
      await db.collection("teams").insertMany(teamsWithTimestamps)
      console.log("Equipos migrados con éxito")
    }

    // Migrar jugadores
    if (players.length > 0) {
      console.log(`Migrando ${players.length} jugadores...`)
      const now = new Date()
      const playersWithTimestamps = players.map((player) => ({
        ...player,
        stats: player.stats || {
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0,
        },
        createdAt: now,
        updatedAt: now,
      }))
      await db.collection("players").insertMany(playersWithTimestamps)
      console.log("Jugadores migrados con éxito")
    }

    // Migrar partidos
    if (matches.length > 0) {
      console.log(`Migrando ${matches.length} partidos...`)
      const now = new Date()
      const matchesWithTimestamps = matches.map((match) => ({
        ...match,
        events: match.events || [],
        createdAt: now,
        updatedAt: now,
      }))
      await db.collection("matches").insertMany(matchesWithTimestamps)
      console.log("Partidos migrados con éxito")
    }

    // Migrar eventos
    if (events.length > 0) {
      console.log(`Migrando ${events.length} eventos...`)
      const now = new Date()
      const eventsWithTimestamps = events.map((event) => ({
        ...event,
        createdAt: now,
        updatedAt: now,
      }))
      await db.collection("events").insertMany(eventsWithTimestamps)
      console.log("Eventos migrados con éxito")
    }

    // Migrar media
    if (media.length > 0) {
      console.log(`Migrando ${media.length} elementos de media...`)
      const now = new Date()
      const mediaWithTimestamps = media.map((item) => ({
        ...item,
        createdAt: now,
        updatedAt: now,
      }))
      await db.collection("media").insertMany(mediaWithTimestamps)
      console.log("Media migrada con éxito")
    }

    console.log("Migración completada con éxito")
  } catch (error) {
    console.error("Error durante la migración:", error)
  }
}

// Ejecutar la migración
migrateData()
