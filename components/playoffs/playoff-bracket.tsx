"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Info } from "lucide-react"
import { Trophy } from "lucide-react"
import { getMatchesByPhase } from "@/lib/data-service"

export default function PlayoffBracket() {
  const [quarterFinals, setQuarterFinals] = useState<any[]>([])
  const [semiFinals, setSemiFinals] = useState<any[]>([])
  const [final, setFinal] = useState<any[]>([])
  const [selectedMatch, setSelectedMatch] = useState<null | number>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      // Load playoff matches
      const quarterMatches = getMatchesByPhase("quarter") || []
      const semiMatches = getMatchesByPhase("semi") || []
      const finalMatches = getMatchesByPhase("final") || []

      // Si no hay partidos de playoffs, crear placeholders
      if (quarterMatches.length === 0 && semiMatches.length === 0 && finalMatches.length === 0) {
        // Crear partidos de cuartos de final
        const placeholderQuarters = [
          createPlaceholderMatch(1, "Ganador Grupo A", "Segundo Grupo B"),
          createPlaceholderMatch(2, "Ganador Grupo B", "Segundo Grupo A"),
          createPlaceholderMatch(3, "Ganador Grupo C", "Segundo Grupo D"),
          createPlaceholderMatch(4, "Ganador Grupo D", "Segundo Grupo C"),
        ]

        // Crear partidos de semifinales
        const placeholderSemis = [
          createPlaceholderMatch(5, "Ganador QF1", "Ganador QF2"),
          createPlaceholderMatch(6, "Ganador QF3", "Ganador QF4"),
        ]

        // Crear partido final
        const placeholderFinal = [createPlaceholderMatch(7, "Ganador SF1", "Ganador SF2")]

        setQuarterFinals(placeholderQuarters)
        setSemiFinals(placeholderSemis)
        setFinal(placeholderFinal)
      } else {
        // Usar los partidos reales si existen
        setQuarterFinals(
          quarterMatches.length > 0
            ? quarterMatches.map(enrichMatch)
            : [
                createPlaceholderMatch(1, "Ganador Grupo A", "Segundo Grupo B"),
                createPlaceholderMatch(2, "Ganador Grupo B", "Segundo Grupo A"),
                createPlaceholderMatch(3, "Ganador Grupo C", "Segundo Grupo D"),
                createPlaceholderMatch(4, "Ganador Grupo D", "Segundo Grupo C"),
              ],
        )

        setSemiFinals(
          semiMatches.length > 0
            ? semiMatches.map(enrichMatch)
            : [
                createPlaceholderMatch(5, "Ganador QF1", "Ganador QF2"),
                createPlaceholderMatch(6, "Ganador QF3", "Ganador QF4"),
              ],
        )

        setFinal(
          finalMatches.length > 0
            ? finalMatches.map(enrichMatch)
            : [createPlaceholderMatch(7, "Ganador SF1", "Ganador SF2")],
        )
      }

      setLoading(false)
    } catch (error) {
      console.error("Error loading playoff data:", error)
      // Establecer placeholders en caso de error
      const placeholderQuarters = [
        createPlaceholderMatch(1, "Ganador Grupo A", "Segundo Grupo B"),
        createPlaceholderMatch(2, "Ganador Grupo B", "Segundo Grupo A"),
        createPlaceholderMatch(3, "Ganador Grupo C", "Segundo Grupo D"),
        createPlaceholderMatch(4, "Ganador Grupo D", "Segundo Grupo C"),
      ]

      const placeholderSemis = [
        createPlaceholderMatch(5, "Ganador QF1", "Ganador QF2"),
        createPlaceholderMatch(6, "Ganador QF3", "Ganador QF4"),
      ]

      const placeholderFinal = [createPlaceholderMatch(7, "Ganador SF1", "Ganador SF2")]

      setQuarterFinals(placeholderQuarters)
      setSemiFinals(placeholderSemis)
      setFinal(placeholderFinal)
      setLoading(false)
    }
  }, [])

  // Función para crear un partido placeholder
  function createPlaceholderMatch(id: number, homeTeamName: string, awayTeamName: string) {
    return {
      id,
      homeTeam: {
        name: homeTeamName,
        logo: "/placeholder.svg?height=24&width=24",
        score: 0,
      },
      awayTeam: {
        name: awayTeamName,
        logo: "/placeholder.svg?height=24&width=24",
        score: 0,
      },
      completed: false,
      date: "Por definir",
      time: "Por definir",
    }
  }

  // Función para enriquecer un partido con datos faltantes
  function enrichMatch(match: any) {
    return {
      ...match,
      homeTeam: {
        name: match.homeTeam?.name || "Por definir",
        logo: match.homeTeam?.logo || "/placeholder.svg?height=24&width=24",
        score: match.homeTeam?.score || 0,
      },
      awayTeam: {
        name: match.awayTeam?.name || "Por definir",
        logo: match.awayTeam?.logo || "/placeholder.svg?height=24&width=24",
        score: match.awayTeam?.score || 0,
      },
      completed: match.completed || false,
      date: match.date || "Fecha por definir",
      time: match.time || "Hora por definir",
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Trophy className="w-8 h-8 animate-pulse text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Bracket de Playoffs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="min-w-[900px] p-4">
              <div className="grid grid-cols-3 gap-4">
                {/* Quarter Finals */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-center mb-6">Cuartos de Final</h3>
                  {quarterFinals.map((match) => (
                    <div
                      key={match.id}
                      className={`p-4 border rounded-lg transition-colors ${
                        selectedMatch === match.id ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedMatch(match.id)}
                    >
                      <div className="text-xs text-muted-foreground mb-2">
                        {match.date} • {match.time}
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Image
                              src={match.homeTeam.logo || "/placeholder.svg?height=24&width=24"}
                              width={24}
                              height={24}
                              alt={match.homeTeam.name}
                              className="team-logo"
                            />
                            <span className="font-medium">{match.homeTeam.name}</span>
                          </div>
                          {match.completed && <span className="font-bold">{match.homeTeam.score}</span>}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Image
                              src={match.awayTeam.logo || "/placeholder.svg?height=24&width=24"}
                              width={24}
                              height={24}
                              alt={match.awayTeam.name}
                              className="team-logo"
                            />
                            <span className="font-medium">{match.awayTeam.name}</span>
                          </div>
                          {match.completed && <span className="font-bold">{match.awayTeam.score}</span>}
                        </div>
                      </div>
                      {match.completed && (
                        <div className="mt-2 text-right">
                          <Badge variant="outline" className="text-xs">
                            {match.homeTeam.score > match.awayTeam.score
                              ? match.homeTeam.name + " avanza"
                              : match.awayTeam.name + " avanza"}
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Semi Finals */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-center mb-6">Semifinales</h3>
                  <div className="flex flex-col justify-center h-full gap-24">
                    {semiFinals.map((match) => (
                      <div
                        key={match.id}
                        className={`p-4 border rounded-lg transition-colors ${
                          selectedMatch === match.id ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedMatch(match.id)}
                      >
                        <div className="text-xs text-muted-foreground mb-2">
                          {match.date} • {match.time}
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Image
                                src={match.homeTeam.logo || "/placeholder.svg?height=24&width=24"}
                                width={24}
                                height={24}
                                alt={match.homeTeam.name}
                                className="team-logo"
                              />
                              <span className="font-medium">{match.homeTeam.name}</span>
                            </div>
                            {match.completed && <span className="font-bold">{match.homeTeam.score}</span>}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Image
                                src={match.awayTeam.logo || "/placeholder.svg?height=24&width=24"}
                                width={24}
                                height={24}
                                alt={match.awayTeam.name}
                                className="team-logo"
                              />
                              <span className="font-medium">{match.awayTeam.name}</span>
                            </div>
                            {match.completed && <span className="font-bold">{match.awayTeam.score}</span>}
                          </div>
                        </div>
                        {match.completed && (
                          <div className="mt-2 text-right">
                            <Badge variant="outline" className="text-xs">
                              {match.homeTeam.score > match.awayTeam.score
                                ? match.homeTeam.name + " avanza"
                                : match.awayTeam.name + " avanza"}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-center mb-6">Final</h3>
                  <div className="flex justify-center items-center h-[200px]">
                    {final.map((match) => (
                      <div
                        key={match.id}
                        className={`p-4 border rounded-lg transition-colors ${
                          selectedMatch === match.id ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedMatch(match.id)}
                      >
                        <div className="text-xs text-muted-foreground mb-2">
                          {match.date} • {match.time}
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Image
                                src={match.homeTeam.logo || "/placeholder.svg?height=24&width=24"}
                                width={24}
                                height={24}
                                alt={match.homeTeam.name}
                                className="team-logo"
                              />
                              <span className="font-medium">{match.homeTeam.name}</span>
                            </div>
                            {match.completed && <span className="font-bold">{match.homeTeam.score}</span>}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Image
                                src={match.awayTeam.logo || "/placeholder.svg?height=24&width=24"}
                                width={24}
                                height={24}
                                alt={match.awayTeam.name}
                                className="team-logo"
                              />
                              <span className="font-medium">{match.awayTeam.name}</span>
                            </div>
                            {match.completed && <span className="font-bold">{match.awayTeam.score}</span>}
                          </div>
                        </div>
                        {!match.completed && (
                          <div className="mt-2 text-center">
                            <Badge variant="outline" className="text-xs">
                              Próximamente
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Connecting lines for the bracket */}
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                {/* Add SVG or CSS for bracket lines if needed */}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedMatch && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Detalles del Partido</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/matches/${selectedMatch}`}>
                <Info className="w-4 h-4 mr-2" />
                Ver Detalles Completos
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="p-4">
              {(() => {
                const match = [...quarterFinals, ...semiFinals, ...final].find((m) => m.id === selectedMatch)
                if (!match) return null

                return (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {match.homeTeam.name} vs {match.awayTeam.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {match.date} • {match.time}
                        </p>
                      </div>
                      <Badge variant={match.completed ? "secondary" : "default"}>
                        {match.completed ? "Completado" : "Próximamente"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-muted/30 rounded-lg">
                      <div className="flex flex-col items-center text-center">
                        <Image
                          src={match.homeTeam.logo || "/placeholder.svg?height=60&width=60"}
                          width={60}
                          height={60}
                          alt={match.homeTeam.name}
                          className="team-logo"
                        />
                        <h2 className="mt-2 text-lg font-bold">{match.homeTeam.name}</h2>
                      </div>

                      {match.completed ? (
                        <div className="flex items-center gap-4 px-6 py-3 text-3xl font-bold bg-muted rounded-xl">
                          <span>{match.homeTeam.score}</span>
                          <span className="text-muted-foreground">-</span>
                          <span>{match.awayTeam.score}</span>
                        </div>
                      ) : (
                        <div className="px-4 py-2 text-lg font-bold">VS</div>
                      )}

                      <div className="flex flex-col items-center text-center">
                        <Image
                          src={match.awayTeam.logo || "/placeholder.svg?height=60&width=60"}
                          width={60}
                          height={60}
                          alt={match.awayTeam.name}
                          className="team-logo"
                        />
                        <h2 className="mt-2 text-lg font-bold">{match.awayTeam.name}</h2>
                      </div>
                    </div>

                    {match.completed ? (
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Resumen del Partido</h4>
                        <p className="text-sm text-muted-foreground">
                          {match.homeTeam.score > match.awayTeam.score
                            ? `${match.homeTeam.name} venció a ${match.awayTeam.name} y avanzó a la siguiente ronda.`
                            : `${match.awayTeam.name} venció a ${match.homeTeam.name} y avanzó a la siguiente ronda.`}
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Información</h4>
                        <p className="text-sm text-muted-foreground">
                          Este partido aún no se ha jugado. Consulta más adelante para ver los resultados.
                        </p>
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
