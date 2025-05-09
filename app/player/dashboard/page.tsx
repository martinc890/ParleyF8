"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Trophy, Users, User, QrCode } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import DashboardLayout from "@/app/dashboard-layout"
import { getTeamById, getUpcomingMatchesByTeam, getPastMatchesByTeam } from "@/lib/data-service"
import Image from "next/image"

export default function PlayerDashboard() {
  const { user } = useAuth()
  const [team, setTeam] = useState<any>(null)
  const [upcomingMatches, setUpcomingMatches] = useState<any[]>([])
  const [pastMatches, setPastMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.teamId) {
      try {
        // Obtener datos del equipo
        const teamData = getTeamById(user.teamId)
        setTeam(
          teamData || {
            id: user.teamId,
            name: "Equipo no encontrado",
            logo: "/placeholder.svg?height=64&width=64",
            group: "N/A",
            stats: { played: 0, won: 0, points: 0 },
          },
        )

        // Obtener próximos partidos
        const upcoming = getUpcomingMatchesByTeam(user.teamId) || []
        // Asegurarse de que cada partido tenga la estructura correcta
        const safeUpcoming = upcoming.map((match) => ({
          ...match,
          homeTeam: {
            ...match.homeTeam,
            logo: match.homeTeam?.logo || "/placeholder.svg?height=32&width=32",
            name: match.homeTeam?.name || "Equipo Local",
          },
          awayTeam: {
            ...match.awayTeam,
            logo: match.awayTeam?.logo || "/placeholder.svg?height=32&width=32",
            name: match.awayTeam?.name || "Equipo Visitante",
          },
        }))
        setUpcomingMatches(safeUpcoming.slice(0, 3))

        // Obtener partidos pasados
        const past = getPastMatchesByTeam(user.teamId) || []
        // Asegurarse de que cada partido tenga la estructura correcta
        const safePast = past.map((match) => ({
          ...match,
          homeTeam: {
            ...match.homeTeam,
            logo: match.homeTeam?.logo || "/placeholder.svg?height=32&width=32",
            name: match.homeTeam?.name || "Equipo Local",
            score: match.homeTeam?.score || 0,
          },
          awayTeam: {
            ...match.awayTeam,
            logo: match.awayTeam?.logo || "/placeholder.svg?height=32&width=32",
            name: match.awayTeam?.name || "Equipo Visitante",
            score: match.awayTeam?.score || 0,
          },
        }))
        setPastMatches(safePast.slice(0, 3))
      } catch (error) {
        console.error("Error loading player dashboard data:", error)
        // Establecer valores por defecto en caso de error
        setTeam({
          id: user.teamId,
          name: "Error al cargar equipo",
          logo: "/placeholder.svg?height=64&width=64",
          group: "N/A",
          stats: { played: 0, won: 0, points: 0 },
        })
        setUpcomingMatches([])
        setPastMatches([])
      } finally {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [user])

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    )
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[60vh]">
            <p>Cargando datos del jugador...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bienvenido, {user.name}</h1>
            <p className="text-muted-foreground">{team ? `Jugador de ${team.name}` : "Jugador sin equipo asignado"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Columna 1: Información del jugador */}
          <div className="space-y-6">
            {/* Carnet Digital */}
            <Link href="/player/card" className="block">
              <Card className="bg-gradient-to-br from-black to-gray-800 text-white hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <QrCode className="mr-2 h-5 w-5" />
                    Carnet Activo
                  </CardTitle>
                  <CardDescription className="text-gray-300">Tu identificación digital para el torneo</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-700 rounded-full mr-4 flex items-center justify-center">
                      {user.photo ? (
                        <img
                          src={user.photo || "/placeholder.svg?height=48&width=48"}
                          alt={user.name}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-300">#{user.id.slice(0, 8)}</p>
                    </div>
                    <Badge className="ml-auto" variant="outline">
                      Activo
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {/* Información del Equipo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Mi Equipo
                </CardTitle>
              </CardHeader>
              <CardContent>
                {team ? (
                  <div className="flex items-center">
                    <div className="w-16 h-16 mr-4 flex items-center justify-center">
                      <Image
                        src={team.logo || "/placeholder.svg?height=64&width=64"}
                        alt={team.name}
                        width={64}
                        height={64}
                        className="rounded"
                      />
                    </div>
                    <div>
                      <p className="font-medium text-lg">{team.name}</p>
                      <p className="text-sm text-muted-foreground">Grupo {team.group}</p>
                      <div className="flex items-center mt-1">
                        <Badge variant="outline" className="mr-2">
                          PJ: {team.stats?.played || 0}
                        </Badge>
                        <Badge variant="outline" className="mr-2">
                          PG: {team.stats?.won || 0}
                        </Badge>
                        <Badge variant="outline">Pts: {team.stats?.points || 0}</Badge>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No tienes un equipo asignado</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Estadísticas Personales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="mr-2 h-5 w-5" />
                  Mis Estadísticas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold">5</p>
                    <p className="text-sm text-muted-foreground">Goles</p>
                  </div>
                  <div className="bg-muted p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold">3</p>
                    <p className="text-sm text-muted-foreground">Asistencias</p>
                  </div>
                  <div className="bg-muted p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold">1</p>
                    <p className="text-sm text-muted-foreground">Tarjetas Amarillas</p>
                  </div>
                  <div className="bg-muted p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Tarjetas Rojas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna 2: Próximos partidos */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Próximos Partidos
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingMatches.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingMatches.map((match) => (
                      <div key={match.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <p className="text-sm text-muted-foreground">
                            {match.date} • {match.time}
                          </p>
                          <Badge>{match.phase || "Grupo " + match.group}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 mr-2">
                              <Image
                                src={match.homeTeam?.logo || "/placeholder.svg?height=32&width=32"}
                                alt={match.homeTeam?.name || "Local"}
                                width={32}
                                height={32}
                              />
                            </div>
                            <span className="font-medium">{match.homeTeam?.name || "Equipo Local"}</span>
                          </div>
                          <span className="text-sm">vs</span>
                          <div className="flex items-center">
                            <span className="font-medium">{match.awayTeam?.name || "Equipo Visitante"}</span>
                            <div className="w-8 h-8 ml-2">
                              <Image
                                src={match.awayTeam?.logo || "/placeholder.svg?height=32&width=32"}
                                alt={match.awayTeam?.name || "Visitante"}
                                width={32}
                                height={32}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{match.venue || "Sede por confirmar"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No hay próximos partidos programados</p>
                  </div>
                )}

                <div className="mt-4">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/matches">Ver todos los partidos</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Anuncios y Noticias */}
            <Card>
              <CardHeader>
                <CardTitle>Anuncios y Noticias</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <p className="font-medium mb-1">Nuevo sistema de carnet digital</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Ahora puedes acceder a tu carnet digital desde la app. Muéstralo en la entrada del predio.
                    </p>
                    <p className="text-xs text-muted-foreground">Publicado: 15/05/2023</p>
                  </div>
                  <div className="border rounded-lg p-4">
                    <p className="font-medium mb-1">Cambio de horario en partidos nocturnos</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      Los partidos nocturnos ahora comenzarán a las 20:00 en lugar de las 21:00.
                    </p>
                    <p className="text-xs text-muted-foreground">Publicado: 10/05/2023</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Columna 3: Resultados recientes */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="mr-2 h-5 w-5" />
                  Resultados Recientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {pastMatches.length > 0 ? (
                  <div className="space-y-4">
                    {pastMatches.map((match) => (
                      <Link href={`/matches/${match.id}`} key={match.id} className="block">
                        <div className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-sm text-muted-foreground">{match.date}</p>
                            <Badge variant="outline">{match.phase || "Grupo " + match.group}</Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="w-8 h-8 mr-2">
                                <Image
                                  src={match.homeTeam?.logo || "/placeholder.svg?height=32&width=32"}
                                  alt={match.homeTeam?.name || "Local"}
                                  width={32}
                                  height={32}
                                />
                              </div>
                              <div>
                                <span className="font-medium">{match.homeTeam?.name || "Equipo Local"}</span>
                                <span
                                  className={`ml-2 font-bold ${
                                    match.homeTeam?.score > match.awayTeam?.score
                                      ? "text-green-600 dark:text-green-500"
                                      : ""
                                  }`}
                                >
                                  {match.homeTeam?.score || 0}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div>
                                <span
                                  className={`mr-2 font-bold ${
                                    match.awayTeam?.score > match.homeTeam?.score
                                      ? "text-green-600 dark:text-green-500"
                                      : ""
                                  }`}
                                >
                                  {match.awayTeam?.score || 0}
                                </span>
                                <span className="font-medium">{match.awayTeam?.name || "Equipo Visitante"}</span>
                              </div>
                              <div className="w-8 h-8 ml-2">
                                <Image
                                  src={match.awayTeam?.logo || "/placeholder.svg?height=32&width=32"}
                                  alt={match.awayTeam?.name || "Visitante"}
                                  width={32}
                                  height={32}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 text-xs text-muted-foreground">
                            {match.homeTeam?.score > match.awayTeam?.score
                              ? `Victoria para ${match.homeTeam?.name || "Local"}`
                              : match.homeTeam?.score < match.awayTeam?.score
                                ? `Victoria para ${match.awayTeam?.name || "Visitante"}`
                                : "Empate"}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No hay resultados recientes</p>
                  </div>
                )}

                <div className="mt-4">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/matches">Ver todos los resultados</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
