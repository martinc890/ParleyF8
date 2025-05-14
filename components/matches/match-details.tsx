"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  User,
  Goal,
  AlertTriangle,
  Share2,
  Play,
  RefreshCw,
} from "lucide-react"
import { getEnrichedMatch } from "@/lib/supabase-service"
import { formatFullName } from "@/lib/utils"

export default function MatchDetails({ matchId }: { matchId: string }) {
  const [activeTab, setActiveTab] = useState("lineups")
  const [selectedMedia, setSelectedMedia] = useState<null | any>(null)
  const [matchData, setMatchData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Cargar datos del partido desde Supabase
    const fetchMatchData = async () => {
      try {
        const match = await getEnrichedMatch(matchId)
        if (match) {
          setMatchData(match)
        }
      } catch (error) {
        console.error("Error fetching match data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMatchData()
  }, [matchId])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <RefreshCw className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!matchData) {
    return (
      <div className="flex flex-col items-center justify-center p-12">
        <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold mb-2">Partido no encontrado</h2>
        <p className="text-muted-foreground mb-4">No se pudo encontrar información para este partido.</p>
        <Button asChild>
          <Link href="/matches">Volver a Partidos</Link>
        </Button>
      </div>
    )
  }

  // Función para renderizar eventos de jugador
  const renderPlayerEvents = (playerId: string) => {
    if (!matchData.events || matchData.events.length === 0) return null

    const playerEvents = matchData.events.filter(
      (event: any) => event.player_id === playerId || event.assist_player_id === playerId,
    )

    if (playerEvents.length === 0) return null

    return (
      <div className="flex items-center gap-1 ml-2">
        {playerEvents.map((event: any, index: number) => {
          if (event.type === "goal" && event.player_id === playerId) {
            return <Goal key={index} className="w-3 h-3 text-primary" />
          } else if (event.type === "goal" && event.assist_player_id === playerId) {
            return <Goal key={index} className="w-3 h-3 text-gray-400" />
          } else if (event.type === "yellowCard" && event.player_id === playerId) {
            return <div key={index} className="w-3 h-4 bg-yellow-400 rounded-sm" />
          } else if (event.type === "redCard" && event.player_id === playerId) {
            return <div key={index} className="w-3 h-4 bg-red-500 rounded-sm" />
          } else if (event.type === "substitution" && event.player_id === playerId) {
            return <ArrowLeft key={index} className="w-3 h-3 text-green-500 rotate-90" />
          } else if (event.type === "substitution" && event.assist_player_id === playerId) {
            return <ArrowLeft key={index} className="w-3 h-3 text-red-500 -rotate-90" />
          }
          return null
        })}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/matches">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Detalles del Partido</h1>
      </div>

      <Card className="overflow-hidden bg-card">
        <CardContent className="p-0">
          <div className="p-4 border-b bg-muted/30">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {matchData.date}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {matchData.time}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {matchData.venue}
                </Badge>
                {matchData.group && (
                  <Badge variant="secondary" className="flex items-center gap-1 bg-black text-white">
                    <Users className="w-3 h-3" />
                    Grupo {matchData.group}
                  </Badge>
                )}
                {matchData.phase === "quarterfinal" && (
                  <Badge variant="secondary" className="flex items-center gap-1 bg-black text-white">
                    <Trophy className="w-3 h-3" />
                    Cuartos de Final
                  </Badge>
                )}
                {matchData.phase === "semifinal" && (
                  <Badge variant="secondary" className="flex items-center gap-1 bg-black text-white">
                    <Trophy className="w-3 h-3" />
                    Semifinal
                  </Badge>
                )}
                {matchData.phase === "final" && (
                  <Badge variant="secondary" className="flex items-center gap-1 bg-black text-white">
                    <Trophy className="w-3 h-3" />
                    Final
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" className="gap-1">
                <Share2 className="w-4 h-4" />
                Compartir
              </Button>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex flex-col items-center text-center">
                <Image
                  src={matchData.homeTeam?.logo || "/images/parley-logo.png"}
                  width={80}
                  height={80}
                  alt={matchData.homeTeam?.name || "Local"}
                  className="object-contain w-20 h-20"
                />
                <h2 className="mt-2 text-xl font-bold">{matchData.homeTeam?.name || "Equipo Local"}</h2>
              </div>

              <div className="flex items-center gap-4 px-6 py-3 text-4xl font-bold bg-black text-white rounded-xl">
                <span>{matchData.score?.home || 0}</span>
                <span className="text-gray-400">-</span>
                <span>{matchData.score?.away || 0}</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <Image
                  src={matchData.awayTeam?.logo || "/images/parley-logo.png"}
                  width={80}
                  height={80}
                  alt={matchData.awayTeam?.name || "Visitante"}
                  className="object-contain w-20 h-20"
                />
                <h2 className="mt-2 text-xl font-bold">{matchData.awayTeam?.name || "Equipo Visitante"}</h2>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="lineups" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="lineups">Alineaciones</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        <TabsContent value="lineups" className="mt-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-xl font-semibold">{matchData.homeTeam?.name || "Equipo Local"}</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="mb-2 text-sm font-medium text-muted-foreground">Titulares</h4>
                  <div className="space-y-2">
                    {matchData.homeStartingXI?.map((player: any) => (
                      <div key={player.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                        <div className="flex items-center justify-center w-8 h-8 text-xs font-medium bg-black text-white rounded-full">
                          {player.number}
                        </div>
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium">{formatFullName(player.firstName, player.lastName)}</div>
                            <div className="text-xs text-muted-foreground">{player.position}</div>
                          </div>
                          {renderPlayerEvents(player.id)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium text-muted-foreground">Suplentes</h4>
                  <div className="space-y-2">
                    {matchData.homeSubstitutes?.map((player: any) => (
                      <div key={player.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                        <div className="flex items-center justify-center w-8 h-8 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
                          {player.number}
                        </div>
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium">{formatFullName(player.firstName, player.lastName)}</div>
                            <div className="text-xs text-muted-foreground">{player.position}</div>
                          </div>
                          {renderPlayerEvents(player.id)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-semibold">{matchData.awayTeam?.name || "Equipo Visitante"}</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="mb-2 text-sm font-medium text-muted-foreground">Titulares</h4>
                  <div className="space-y-2">
                    {matchData.awayStartingXI?.map((player: any) => (
                      <div key={player.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                        <div className="flex items-center justify-center w-8 h-8 text-xs font-medium bg-black text-white rounded-full">
                          {player.number}
                        </div>
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium">{formatFullName(player.firstName, player.lastName)}</div>
                            <div className="text-xs text-muted-foreground">{player.position}</div>
                          </div>
                          {renderPlayerEvents(player.id)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium text-muted-foreground">Suplentes</h4>
                  <div className="space-y-2">
                    {matchData.awaySubstitutes?.map((player: any) => (
                      <div key={player.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                        <div className="flex items-center justify-center w-8 h-8 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
                          {player.number}
                        </div>
                        <div className="flex items-center">
                          <div>
                            <div className="font-medium">{formatFullName(player.firstName, player.lastName)}</div>
                            <div className="text-xs text-muted-foreground">{player.position}</div>
                          </div>
                          {renderPlayerEvents(player.id)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <div className="relative pl-8 border-l-2 border-dashed border-muted-foreground/30">
            {matchData.events && matchData.events.length > 0 ? (
              matchData.events.map((event: any) => {
                const isHomeTeam = event.team_id === matchData.homeTeamId
                const team = isHomeTeam ? matchData.homeTeam : matchData.awayTeam
                const player = event.player
                const assistPlayer = event.assist_player

                return (
                  <div key={event.id} className="relative mb-8">
                    <div className="absolute -left-[41px] flex items-center justify-center w-10 h-10 rounded-full bg-background border-2 border-muted">
                      {event.type === "goal" && <Goal className="w-5 h-5 text-primary" />}
                      {event.type === "yellowCard" && <div className="w-5 h-7 bg-yellow-400 rounded-sm" />}
                      {event.type === "redCard" && <div className="w-5 h-7 bg-red-500 rounded-sm" />}
                      {event.type === "substitution" && <RefreshCw className="w-5 h-5 text-green-500" />}
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline">{event.minute}'</Badge>
                      <span className="font-medium">
                        {team?.name || (isHomeTeam ? "Equipo Local" : "Equipo Visitante")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>{player ? formatFullName(player.first_name, player.last_name) : "Jugador"}</span>
                      {event.type === "goal" && event.assist_player_id && (
                        <>
                          <span className="text-sm text-muted-foreground">Asistencia:</span>
                          <span>
                            {assistPlayer ? formatFullName(assistPlayer.first_name, assistPlayer.last_name) : "Jugador"}
                          </span>
                        </>
                      )}
                      {event.type === "substitution" && event.assist_player_id && (
                        <>
                          <span className="text-sm text-muted-foreground">Sale:</span>
                          <span>
                            {assistPlayer ? formatFullName(assistPlayer.first_name, assistPlayer.last_name) : "Jugador"}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                {matchData.status === "upcoming"
                  ? "El partido aún no ha comenzado."
                  : "No hay eventos registrados para este partido."}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{matchData.stats?.possession?.home || 50}%</span>
                    <span className="font-medium">Posesión</span>
                    <span>{matchData.stats?.possession?.away || 50}%</span>
                  </div>
                  <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                    <div className="bg-black" style={{ width: `${matchData.stats?.possession?.home || 50}%` }} />
                    <div className="bg-gray-500" style={{ width: `${matchData.stats?.possession?.away || 50}%` }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{matchData.stats?.shots?.home || 0}</span>
                    <span className="font-medium">Tiros</span>
                    <span>{matchData.stats?.shots?.away || 0}</span>
                  </div>
                  <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="bg-black"
                      style={{
                        width: `${((matchData.stats?.shots?.home || 0) / ((matchData.stats?.shots?.home || 0) + (matchData.stats?.shots?.away || 0) || 1)) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-gray-500"
                      style={{
                        width: `${((matchData.stats?.shots?.away || 0) / ((matchData.stats?.shots?.home || 0) + (matchData.stats?.shots?.away || 0) || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{matchData.stats?.shotsOnTarget?.home || 0}</span>
                    <span className="font-medium">Tiros a Puerta</span>
                    <span>{matchData.stats?.shotsOnTarget?.away || 0}</span>
                  </div>
                  <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="bg-black"
                      style={{
                        width: `${((matchData.stats?.shotsOnTarget?.home || 0) / ((matchData.stats?.shotsOnTarget?.home || 0) + (matchData.stats?.shotsOnTarget?.away || 0) || 1)) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-gray-500"
                      style={{
                        width: `${((matchData.stats?.shotsOnTarget?.away || 0) / ((matchData.stats?.shotsOnTarget?.home || 0) + (matchData.stats?.shotsOnTarget?.away || 0) || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{matchData.stats?.corners?.home || 0}</span>
                    <span className="font-medium">Córners</span>
                    <span>{matchData.stats?.corners?.away || 0}</span>
                  </div>
                  <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="bg-black"
                      style={{
                        width: `${((matchData.stats?.corners?.home || 0) / ((matchData.stats?.corners?.home || 0) + (matchData.stats?.corners?.away || 0) || 1)) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-gray-500"
                      style={{
                        width: `${((matchData.stats?.corners?.away || 0) / ((matchData.stats?.corners?.home || 0) + (matchData.stats?.corners?.away || 0) || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{matchData.stats?.fouls?.home || 0}</span>
                    <span className="font-medium">Faltas</span>
                    <span>{matchData.stats?.fouls?.away || 0}</span>
                  </div>
                  <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="bg-black"
                      style={{
                        width: `${((matchData.stats?.fouls?.home || 0) / ((matchData.stats?.fouls?.home || 0) + (matchData.stats?.fouls?.away || 0) || 1)) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-gray-500"
                      style={{
                        width: `${((matchData.stats?.fouls?.away || 0) / ((matchData.stats?.fouls?.home || 0) + (matchData.stats?.fouls?.away || 0) || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{matchData.stats?.yellowCards?.home || 0}</span>
                    <span className="font-medium">Tarjetas Amarillas</span>
                    <span>{matchData.stats?.yellowCards?.away || 0}</span>
                  </div>
                  <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="bg-yellow-400"
                      style={{
                        width: `${((matchData.stats?.yellowCards?.home || 0) / ((matchData.stats?.yellowCards?.home || 0) + (matchData.stats?.yellowCards?.away || 0) || 1)) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-yellow-400/50"
                      style={{
                        width: `${((matchData.stats?.yellowCards?.away || 0) / ((matchData.stats?.yellowCards?.home || 0) + (matchData.stats?.yellowCards?.away || 0) || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{matchData.stats?.redCards?.home || 0}</span>
                    <span className="font-medium">Tarjetas Rojas</span>
                    <span>{matchData.stats?.redCards?.away || 0}</span>
                  </div>
                  <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="bg-red-500"
                      style={{
                        width: `${((matchData.stats?.redCards?.home || 0) / ((matchData.stats?.redCards?.home || 0) + (matchData.stats?.redCards?.away || 0) || 1)) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-red-500/50"
                      style={{
                        width: `${((matchData.stats?.redCards?.away || 0) / ((matchData.stats?.redCards?.home || 0) + (matchData.stats?.redCards?.away || 0) || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="mt-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {matchData.media && matchData.media.length > 0 ? (
              matchData.media.map((item: any) => (
                <div
                  key={item.id}
                  className="relative overflow-hidden rounded-lg cursor-pointer group"
                  onClick={() => setSelectedMedia(item)}
                >
                  <div className="absolute inset-0 transition-opacity bg-black/30 group-hover:bg-black/50" />
                  <Image
                    src={item.type === "video" ? item.thumbnail : item.url}
                    width={500}
                    height={300}
                    alt={item.caption || "Media"}
                    className="object-cover w-full aspect-video"
                  />
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full">
                        <Play className="w-5 h-5 text-black fill-black" />
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
                    <div className="text-sm font-medium line-clamp-1">{item.caption || "Sin título"}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-muted-foreground">
                No hay contenido multimedia disponible para este partido.
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
