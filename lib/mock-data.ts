import type { Team, Player, Match, MatchEvent } from "./types"

// Equipos
export const mockTeams: Team[] = [
  {
    id: "team1",
    name: "Skull Crushers",
    logo: "/images/parley-logo.png",
    group: "A",
    players: [
      "player1",
      "player2",
      "player3",
      "player4",
      "player5",
      "player6",
      "player7",
      "player8",
      "player9",
      "player10",
      "player11",
      "player12",
    ],
    stats: {
      played: 5,
      won: 3,
      drawn: 1,
      lost: 1,
      goalsFor: 12,
      goalsAgainst: 7,
      points: 10,
    },
  },
  {
    id: "team2",
    name: "Black Demons",
    logo: "/images/parley-logo.png",
    group: "A",
    players: [
      "player13",
      "player14",
      "player15",
      "player16",
      "player17",
      "player18",
      "player19",
      "player20",
      "player21",
      "player22",
      "player23",
      "player24",
    ],
    stats: {
      played: 5,
      won: 2,
      drawn: 2,
      lost: 1,
      goalsFor: 8,
      goalsAgainst: 6,
      points: 8,
    },
  },
  {
    id: "team3",
    name: "Death Squad",
    logo: "/images/parley-logo.png",
    group: "A",
    players: [
      "player25",
      "player26",
      "player27",
      "player28",
      "player29",
      "player30",
      "player31",
      "player32",
      "player33",
      "player34",
      "player35",
      "player36",
    ],
    stats: {
      played: 5,
      won: 2,
      drawn: 1,
      lost: 2,
      goalsFor: 7,
      goalsAgainst: 8,
      points: 7,
    },
  },
  {
    id: "team4",
    name: "Nightmare FC",
    logo: "/images/parley-logo.png",
    group: "A",
    players: [
      "player37",
      "player38",
      "player39",
      "player40",
      "player41",
      "player42",
      "player43",
      "player44",
      "player45",
      "player46",
      "player47",
      "player48",
    ],
    stats: {
      played: 5,
      won: 0,
      drawn: 2,
      lost: 3,
      goalsFor: 4,
      goalsAgainst: 10,
      points: 2,
    },
  },
  {
    id: "team5",
    name: "Shadow Warriors",
    logo: "/images/parley-logo.png",
    group: "B",
    players: [
      "player49",
      "player50",
      "player51",
      "player52",
      "player53",
      "player54",
      "player55",
      "player56",
      "player57",
      "player58",
      "player59",
      "player60",
    ],
    stats: {
      played: 5,
      won: 4,
      drawn: 0,
      lost: 1,
      goalsFor: 14,
      goalsAgainst: 5,
      points: 12,
    },
  },
  {
    id: "team6",
    name: "Dark Knights",
    logo: "/images/parley-logo.png",
    group: "B",
    players: [
      "player61",
      "player62",
      "player63",
      "player64",
      "player65",
      "player66",
      "player67",
      "player68",
      "player69",
      "player70",
      "player71",
      "player72",
    ],
    stats: {
      played: 5,
      won: 3,
      drawn: 1,
      lost: 1,
      goalsFor: 10,
      goalsAgainst: 6,
      points: 10,
    },
  },
  {
    id: "team7",
    name: "Grim Reapers",
    logo: "/images/parley-logo.png",
    group: "B",
    players: [
      "player73",
      "player74",
      "player75",
      "player76",
      "player77",
      "player78",
      "player79",
      "player80",
      "player81",
      "player82",
      "player83",
      "player84",
    ],
    stats: {
      played: 5,
      won: 1,
      drawn: 2,
      lost: 2,
      goalsFor: 7,
      goalsAgainst: 9,
      points: 5,
    },
  },
  {
    id: "team8",
    name: "Phantom Strikers",
    logo: "/images/parley-logo.png",
    group: "B",
    players: [
      "player85",
      "player86",
      "player87",
      "player88",
      "player89",
      "player90",
      "player91",
      "player92",
      "player93",
      "player94",
      "player95",
      "player96",
    ],
    stats: {
      played: 5,
      won: 0,
      drawn: 1,
      lost: 4,
      goalsFor: 3,
      goalsAgainst: 14,
      points: 1,
    },
  },
]

// Jugadores (8 por equipo + suplentes)
export const generateMockPlayers = (): Player[] => {
  const players: Player[] = []
  const positions = ["GK", "DF", "DF", "MF", "MF", "MF", "FW", "FW"]
  const names = [
    "Juan",
    "Carlos",
    "Miguel",
    "Pedro",
    "Luis",
    "Alejandro",
    "Fernando",
    "Roberto",
    "Diego",
    "Javier",
    "Andrés",
    "Martín",
    "Ricardo",
    "Eduardo",
    "Sergio",
    "Gabriel",
    "Raúl",
    "Francisco",
    "Jorge",
    "Alberto",
    "Héctor",
    "Óscar",
    "Enrique",
    "Mario",
  ]
  const surnames = [
    "García",
    "Rodríguez",
    "López",
    "Martínez",
    "González",
    "Pérez",
    "Sánchez",
    "Ramírez",
    "Torres",
    "Flores",
    "Rivera",
    "Gómez",
    "Díaz",
    "Reyes",
    "Morales",
    "Cruz",
    "Ortiz",
    "Ramos",
    "Romero",
    "Álvarez",
    "Ruiz",
    "Méndez",
    "Herrera",
    "Medina",
  ]

  mockTeams.forEach((team) => {
    // Titulares
    for (let i = 0; i < 8; i++) {
      const playerId = team.players[i]
      players.push({
        id: playerId,
        name: `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`,
        number: i + 1,
        position: positions[i],
        teamId: team.id,
        stats: {
          goals: Math.floor(Math.random() * (positions[i] === "FW" ? 10 : 3)),
          assists: Math.floor(Math.random() * (positions[i] === "MF" ? 8 : 3)),
          yellowCards: Math.floor(Math.random() * 3),
          redCards: Math.floor(Math.random() * 2),
        },
      })
    }

    // Suplentes
    for (let i = 8; i < team.players.length; i++) {
      const playerId = team.players[i]
      const randomPosition = positions[Math.floor(Math.random() * positions.length)]
      players.push({
        id: playerId,
        name: `${names[Math.floor(Math.random() * names.length)]} ${surnames[Math.floor(Math.random() * surnames.length)]}`,
        number: i + 1,
        position: randomPosition,
        teamId: team.id,
        stats: {
          goals: Math.floor(Math.random() * (randomPosition === "FW" ? 5 : 2)),
          assists: Math.floor(Math.random() * (randomPosition === "MF" ? 4 : 2)),
          yellowCards: Math.floor(Math.random() * 2),
          redCards: Math.floor(Math.random() * 1),
        },
      })
    }
  })

  return players
}

// Partidos pasados y futuros
export const generateMockMatches = (): Match[] => {
  const matches: Match[] = []
  const venues = ["Estadio Principal", "Campo Norte", "Campo Sur", "Cancha Central"]
  const currentDate = new Date()

  // Partidos de fase de grupos (pasados)
  mockTeams.forEach((homeTeam, homeIndex) => {
    mockTeams.forEach((awayTeam, awayIndex) => {
      if (homeTeam.id !== awayTeam.id && homeTeam.group === awayTeam.group) {
        // Fecha del partido (entre 1 y 30 días atrás)
        const matchDate = new Date(currentDate)
        matchDate.setDate(matchDate.getDate() - Math.floor(Math.random() * 30) - 1)

        const homeScore = Math.floor(Math.random() * 5)
        const awayScore = Math.floor(Math.random() * 5)

        const matchEvents: MatchEvent[] = []
        let eventId = 1

        // Generar eventos de goles
        for (let i = 0; i < homeScore; i++) {
          const minute = Math.floor(Math.random() * 80) + 1
          const scorerId = homeTeam.players[Math.floor(Math.random() * 8)] // Titular aleatorio
          const assistId = homeTeam.players[Math.floor(Math.random() * 8)] // Titular aleatorio

          matchEvents.push({
            id: `event${eventId++}`,
            matchId: `match${homeIndex}${awayIndex}`,
            type: "goal",
            minute: minute,
            playerId: scorerId,
            assistPlayerId: scorerId !== assistId ? assistId : undefined,
            teamId: homeTeam.id,
          })
        }

        for (let i = 0; i < awayScore; i++) {
          const minute = Math.floor(Math.random() * 80) + 1
          const scorerId = awayTeam.players[Math.floor(Math.random() * 8)] // Titular aleatorio
          const assistId = awayTeam.players[Math.floor(Math.random() * 8)] // Titular aleatorio

          matchEvents.push({
            id: `event${eventId++}`,
            matchId: `match${homeIndex}${awayIndex}`,
            type: "goal",
            minute: minute,
            playerId: scorerId,
            assistPlayerId: scorerId !== assistId ? assistId : undefined,
            teamId: awayTeam.id,
          })
        }

        // Generar tarjetas amarillas (entre 0 y 4 por equipo)
        const homeYellowCards = Math.floor(Math.random() * 5)
        const awayYellowCards = Math.floor(Math.random() * 5)

        for (let i = 0; i < homeYellowCards; i++) {
          const minute = Math.floor(Math.random() * 80) + 1
          const playerId = homeTeam.players[Math.floor(Math.random() * 8)] // Titular aleatorio

          matchEvents.push({
            id: `event${eventId++}`,
            matchId: `match${homeIndex}${awayIndex}`,
            type: "yellowCard",
            minute: minute,
            playerId: playerId,
            teamId: homeTeam.id,
          })
        }

        for (let i = 0; i < awayYellowCards; i++) {
          const minute = Math.floor(Math.random() * 80) + 1
          const playerId = awayTeam.players[Math.floor(Math.random() * 8)] // Titular aleatorio

          matchEvents.push({
            id: `event${eventId++}`,
            matchId: `match${homeIndex}${awayIndex}`,
            type: "yellowCard",
            minute: minute,
            playerId: playerId,
            teamId: awayTeam.id,
          })
        }

        // Generar tarjetas rojas (0 o 1 por equipo)
        if (Math.random() > 0.8) {
          const minute = Math.floor(Math.random() * 80) + 1
          const playerId = homeTeam.players[Math.floor(Math.random() * 8)] // Titular aleatorio

          matchEvents.push({
            id: `event${eventId++}`,
            matchId: `match${homeIndex}${awayIndex}`,
            type: "redCard",
            minute: minute,
            playerId: playerId,
            teamId: homeTeam.id,
          })
        }

        if (Math.random() > 0.8) {
          const minute = Math.floor(Math.random() * 80) + 1
          const playerId = awayTeam.players[Math.floor(Math.random() * 8)] // Titular aleatorio

          matchEvents.push({
            id: `event${eventId++}`,
            matchId: `match${homeIndex}${awayIndex}`,
            type: "redCard",
            minute: minute,
            playerId: playerId,
            teamId: awayTeam.id,
          })
        }

        // Generar sustituciones (entre 1 y 3 por equipo)
        const homeSubstitutions = Math.floor(Math.random() * 3) + 1
        const awaySubstitutions = Math.floor(Math.random() * 3) + 1

        for (let i = 0; i < homeSubstitutions; i++) {
          const minute = Math.floor(Math.random() * 70) + 10 // Entre el minuto 10 y 80
          const outPlayerId = homeTeam.players[Math.floor(Math.random() * 8)] // Titular que sale
          const inPlayerId = homeTeam.players[8 + i] // Suplente que entra

          matchEvents.push({
            id: `event${eventId++}`,
            matchId: `match${homeIndex}${awayIndex}`,
            type: "substitution",
            minute: minute,
            playerId: inPlayerId, // Jugador que entra
            assistPlayerId: outPlayerId, // Jugador que sale (usando assistPlayerId para el que sale)
            teamId: homeTeam.id,
          })
        }

        for (let i = 0; i < awaySubstitutions; i++) {
          const minute = Math.floor(Math.random() * 70) + 10 // Entre el minuto 10 y 80
          const outPlayerId = awayTeam.players[Math.floor(Math.random() * 8)] // Titular que sale
          const inPlayerId = awayTeam.players[8 + i] // Suplente que entra

          matchEvents.push({
            id: `event${eventId++}`,
            matchId: `match${homeIndex}${awayIndex}`,
            type: "substitution",
            minute: minute,
            playerId: inPlayerId, // Jugador que entra
            assistPlayerId: outPlayerId, // Jugador que sale (usando assistPlayerId para el que sale)
            teamId: awayTeam.id,
          })
        }

        // Ordenar eventos por minuto
        matchEvents.sort((a, b) => a.minute - b.minute)

        matches.push({
          id: `match${homeIndex}${awayIndex}`,
          homeTeamId: homeTeam.id,
          awayTeamId: awayTeam.id,
          date: `${matchDate.getDate()}/${matchDate.getMonth() + 1}/${matchDate.getFullYear()}`,
          time: `${Math.floor(Math.random() * 12) + 10}:00`,
          venue: venues[Math.floor(Math.random() * venues.length)],
          phase: "group",
          group: homeTeam.group,
          status: "completed",
          score: {
            home: homeScore,
            away: awayScore,
          },
          events: matchEvents,
          createdAt: new Date(),
          updatedAt: new Date(),
        })
      }
    })
  })

  // Partidos futuros (próximos 30 días)
  for (let i = 0; i < 10; i++) {
    const matchDate = new Date(currentDate)
    matchDate.setDate(matchDate.getDate() + Math.floor(Math.random() * 30) + 1)

    // Seleccionar equipos aleatorios
    const homeTeamIndex = Math.floor(Math.random() * mockTeams.length)
    let awayTeamIndex
    do {
      awayTeamIndex = Math.floor(Math.random() * mockTeams.length)
    } while (homeTeamIndex === awayTeamIndex)

    const homeTeam = mockTeams[homeTeamIndex]
    const awayTeam = mockTeams[awayTeamIndex]

    matches.push({
      id: `future_match${i}`,
      homeTeamId: homeTeam.id,
      awayTeamId: awayTeam.id,
      date: `${matchDate.getDate()}/${matchDate.getMonth() + 1}/${matchDate.getFullYear()}`,
      time: `${Math.floor(Math.random() * 12) + 10}:00`,
      venue: venues[Math.floor(Math.random() * venues.length)],
      phase: i < 6 ? "group" : i < 8 ? "quarterfinal" : i < 9 ? "semifinal" : "final",
      group: i < 6 ? (Math.random() > 0.5 ? "A" : "B") : undefined,
      status: "upcoming",
      events: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  return matches
}

// Función para inicializar todos los datos mock
export const initializeMockData = () => {
  const teams = mockTeams
  const players = generateMockPlayers()
  const matches = generateMockMatches()

  return {
    teams,
    players,
    matches,
  }
}
