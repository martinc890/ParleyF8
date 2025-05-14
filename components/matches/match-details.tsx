"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BackButton } from "@/components/ui/back-button"
import { EmptyState } from "@/components/ui/empty-state"
import {
  ClipboardList,
  Clock,
  MapPin,
  Calendar,
  BarChart3,
  ImageIcon,
  Goal,
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpFromLine,
  HardDriveIcon as Boot,
} from "lucide-react"
import { getMatchById } from "@/lib/data-service"

export default function MatchDetails({ matchId }: { matchId: string }) {
  const [match, setMatch] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const loadMatch = async () => {
      try {
        const matchData = await getMatchById(matchId)
        setMatch(matchData)
      } catch (error) {
        console.error("Error loading match:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMatch()
  }, [matchId])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="space-y-4">
        <BackButton />
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              icon={ClipboardList}
              title="Partido no encontrado"
              description="No se pudo encontrar el partido solicitado."
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  const isCompleted = match.status === "completed"

  return (
    <div className="space-y-4">
      <BackButton />

      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                <Calendar className="w-4 h-4" />
                <span>{match.date}</span>
                <span>•</span>
                <Clock className="w-4 h-4" />
                <span>{match.time}</span>
                {match.venue && (
                  <>
                    <span>•</span>
                    <MapPin className="w-4 h-4" />
                    <span>{match.venue}</span>
                  </>
                )}
              </div>
              <CardTitle className="text-xl md:text-2xl">
                {match.homeTeam?.name || "Equipo Local"} vs {match.awayTeam?.name || "Equipo Visitante"}
              </CardTitle>
            </div>
            <Badge variant={isCompleted ? "secondary" : "default"} className="self-start md:self-auto">
              {isCompleted ? "Completado" : "Próximamente"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-6 bg-muted/30 rounded-lg mb-6">
            {/* Equipo Local */}
            <div className="flex flex-col items-center text-center w-[35%]">
              <div className="relative w-16 h-16 md:w-20 md:h-20">
                <Image
                  src={match.homeTeam?.logo || "/placeholder.svg?height=80&width=80"}
                  fill
                  alt={match.homeTeam?.name || "Equipo Local"}
                  className="object-contain"
                />
              </div>
              <h2 className="mt-2 text-base md:text-lg font-bold truncate max-w-full">
                {match.homeTeam?.name || "Equipo Local"}
              </h2>
              {match.homeTeam?.group && (
                <span className="text-xs text-muted-foreground">Grupo {match.homeTeam.group}</span>
              )}
            </div>

            {/* Marcador */}
            <div className="flex flex-col items-center w-[30%]">
              {isCompleted ? (
                <div className="flex items-center gap-4 px-6 py-3 text-3xl md:text-4xl font-bold bg-muted rounded-xl">
                  <span>{match.homeScore || 0}</span>
                  <span className="text-muted-foreground">-</span>
                  <span>{match.awayScore || 0}</span>
                </div>
              ) : (
                <div className="px-4 py-2 text-xl md:text-2xl font-bold">VS</div>
              )}
              {match.phase && match.phase !== "group" && (
                <Badge variant="outline" className="mt-2">
                  {match.phase === "quarter" && "Cuartos de Final"}
                  {match.phase === "semi" && "Semifinal"}
                  {match.phase === "final" && "Final"}
                  {match.phase === "thirdplace" && "Tercer Puesto"}
                </Badge>
              )}
            </div>

            {/* Equipo Visitante */}
            <div className="flex flex-col items-center text-center w-[35%]">
              <div className="relative w-16 h-16 md:w-20 md:h-20">
                <Image
                  src={match.awayTeam?.logo || "/placeholder.svg?height=80&width=80"}
                  fill
                  alt={match.awayTeam?.name || "Equipo Visitante"}
                  className="object-contain"
                />
              </div>
              <h2 className="mt-2 text-base md:text-lg font-bold truncate max-w-full">
                {match.awayTeam?.name || "Equipo Visitante"}
              </h2>
              {match.awayTeam?.group && (
                <span className="text-xs text-muted-foreground">Grupo {match.awayTeam.group}</span>
              )}
            </div>
          </div>

          <Tabs defaultValue="overview" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">Resumen</TabsTrigger>
              <TabsTrigger value="lineups">Alineaciones</TabsTrigger>
              <TabsTrigger value="stats">Estadísticas</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {isCompleted ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Eventos del Partido</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {match.events && match.events.length > 0 ? (
                          <div className="space-y-2">
                            {match.events.map((event: any, index: number) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <Badge variant="outline" className="w-10 text-center">
                                  {event.minute}'
                                </Badge>
                                {event.type === "goal" && <Goal className="w-4 h-4 text-green-500" />}
                                {event.type === "yellowCard" && (
                                  <div className="w-3 h-4 bg-yellow-400 rounded-sm"></div>
                                )}
                                {event.type === "redCard" && <div className="w-3 h-4 bg-red-500 rounded-sm"></div>}
                                {event.type === "substitution" && (
                                  <div className="flex flex-col">
                                    <ArrowUpFromLine className="w-3 h-3 text-green-500" />
                                    <ArrowDownToLine className="w-3 h-3 text-red-500" />
                                  </div>
                                )}
                                <span className="font-medium">
                                  {event.playerName || "Jugador"}
                                  {event.type === "goal" && event.assistPlayerName && (
                                    <span className="text-muted-foreground ml-1">
                                      (Asistencia: <Boot className="w-3 h-3 inline" /> {event.assistPlayerName})
                                    </span>
                                  )}
                                  {event.type === "substitution" && event.assistPlayerName && (
                                    <span className="text-muted-foreground ml-1">(Sale: {event.assistPlayerName})</span>
                                  )}
                                </span>
                                <Badge variant="secondary" className="ml-auto text-xs px-1.5 py-0 h-5 rounded-sm">
                                  {event.teamName || (event.isHomeTeam ? match.homeTeam?.name : match.awayTeam?.name)}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            No hay eventos registrados para este partido.
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Resumen</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-muted/30 p-2 rounded-lg">
                              <div className="text-2xl font-bold">{match.homeStats?.shots || 0}</div>
                              <div className="text-xs text-muted-foreground">Tiros</div>
                            </div>
                            <div className="bg-muted/30 p-2 rounded-lg">
                              <div className="text-2xl font-bold">{match.homeStats?.corners || 0}</div>
                              <div className="text-xs text-muted-foreground">Corners</div>
                            </div>
                            <div className="bg-muted/30 p-2 rounded-lg">
                              <div className="text-2xl font-bold">
                                {(match.homeStats?.yellowCards || 0) + (match.homeStats?.redCards || 0)}
                              </div>
                              <div className="text-xs text-muted-foreground">Tarjetas</div>
                            </div>
                          </div>

                          <div className="flex justify-center">
                            <div className="text-xs text-muted-foreground">Equipo Local</div>
                          </div>

                          <div className="border-t border-b py-4 flex justify-center">
                            <div className="text-sm">vs</div>
                          </div>

                          <div className="flex justify-center">
                            <div className="text-xs text-muted-foreground">Equipo Visitante</div>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-muted/30 p-2 rounded-lg">
                              <div className="text-2xl font-bold">{match.awayStats?.shots || 0}</div>
                              <div className="text-xs text-muted-foreground">Tiros</div>
                            </div>
                            <div className="bg-muted/30 p-2 rounded-lg">
                              <div className="text-2xl font-bold">{match.awayStats?.corners || 0}</div>
                              <div className="text-xs text-muted-foreground">Corners</div>
                            </div>
                            <div className="bg-muted/30 p-2 rounded-lg">
                              <div className="text-2xl font-bold">
                                {(match.awayStats?.yellowCards || 0) + (match.awayStats?.redCards || 0)}
                              </div>
                              <div className="text-xs text-muted-foreground">Tarjetas</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center space-y-4">
                      <Clock className="w-12 h-12 mx-auto text-muted-foreground" />
                      <h3 className="text-xl font-semibold">Partido Próximamente</h3>
                      <p className="text-muted-foreground">
                        Este partido aún no se ha jugado. Vuelve más tarde para ver los resultados y estadísticas.
                      </p>
                      <div className="flex justify-center gap-4 pt-4">
                        <Button variant="outline" size="sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          Añadir a Calendario
                        </Button>
                        <Button variant="outline" size="sm">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Recibir Notificaciones
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="lineups" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Equipo Local */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <div className="w-6 h-6 relative">
                        <Image
                          src={match.homeTeam?.logo || "/placeholder.svg?height=24&width=24"}
                          fill
                          alt={match.homeTeam?.name || "Equipo Local"}
                          className="object-contain"
                        />
                      </div>
                      {match.homeTeam?.name || "Equipo Local"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {match.homeLineup && match.homeLineup.length > 0 ? (
                      <div className="space-y-2">
                        {match.homeLineup.map((player: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium">
                                {player.number || "-"}
                              </div>
                              <span className="font-medium">{player.name}</span>
                              <div className="flex items-center gap-1">
                                {player.goals > 0 &&
                                  Array.from({ length: player.goals }).map((_, i) => (
                                    <Goal key={i} className="w-3 h-3 text-green-500" />
                                  ))}
                                {player.assists > 0 &&
                                  Array.from({ length: player.assists }).map((_, i) => (
                                    <Boot key={i} className="w-3 h-3 text-blue-500" />
                                  ))}
                                {player.yellowCards > 0 &&
                                  Array.from({ length: player.yellowCards }).map((_, i) => (
                                    <div key={i} className="w-2 h-3 bg-yellow-400 rounded-sm"></div>
                                  ))}
                                {player.redCards > 0 &&
                                  Array.from({ length: player.redCards }).map((_, i) => (
                                    <div key={i} className="w-2 h-3 bg-red-500 rounded-sm"></div>
                                  ))}
                                {player.substitutionOut && <ArrowDownToLine className="w-3 h-3 text-red-500" />}
                                {player.substitutionIn && <ArrowUpFromLine className="w-3 h-3 text-green-500" />}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">{player.position}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No hay información de alineación disponible.
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Equipo Visitante */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <div className="w-6 h-6 relative">
                        <Image
                          src={match.awayTeam?.logo || "/placeholder.svg?height=24&width=24"}
                          fill
                          alt={match.awayTeam?.name || "Equipo Visitante"}
                          className="object-contain"
                        />
                      </div>
                      {match.awayTeam?.name || "Equipo Visitante"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {match.awayLineup && match.awayLineup.length > 0 ? (
                      <div className="space-y-2">
                        {match.awayLineup.map((player: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50"
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium">
                                {player.number || "-"}
                              </div>
                              <span className="font-medium">{player.name}</span>
                              <div className="flex items-center gap-1">
                                {player.goals > 0 &&
                                  Array.from({ length: player.goals }).map((_, i) => (
                                    <Goal key={i} className="w-3 h-3 text-green-500" />
                                  ))}
                                {player.assists > 0 &&
                                  Array.from({ length: player.assists }).map((_, i) => (
                                    <Boot key={i} className="w-3 h-3 text-blue-500" />
                                  ))}
                                {player.yellowCards > 0 &&
                                  Array.from({ length: player.yellowCards }).map((_, i) => (
                                    <div key={i} className="w-2 h-3 bg-yellow-400 rounded-sm"></div>
                                  ))}
                                {player.redCards > 0 &&
                                  Array.from({ length: player.redCards }).map((_, i) => (
                                    <div key={i} className="w-2 h-3 bg-red-500 rounded-sm"></div>
                                  ))}
                                {player.substitutionOut && <ArrowDownToLine className="w-3 h-3 text-red-500" />}
                                {player.substitutionIn && <ArrowUpFromLine className="w-3 h-3 text-green-500" />}
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">{player.position}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No hay información de alineación disponible.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="stats" className="space-y-4">
              {isCompleted ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Estadísticas Detalladas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 items-center">
                        <div className="text-right font-medium">{match.homeStats?.shots || 0}</div>
                        <div className="text-center text-sm text-muted-foreground">Tiros</div>
                        <div className="text-left font-medium">{match.awayStats?.shots || 0}</div>
                      </div>
                      <div className="grid grid-cols-3 items-center">
                        <div className="text-right font-medium">{match.homeStats?.shotsOnTarget || 0}</div>
                        <div className="text-center text-sm text-muted-foreground">Tiros a Puerta</div>
                        <div className="text-left font-medium">{match.awayStats?.shotsOnTarget || 0}</div>
                      </div>
                      <div className="grid grid-cols-3 items-center">
                        <div className="text-right font-medium">{match.homeStats?.possession || 0}%</div>
                        <div className="text-center text-sm text-muted-foreground">Posesión</div>
                        <div className="text-left font-medium">{match.awayStats?.possession || 0}%</div>
                      </div>
                      <div className="grid grid-cols-3 items-center">
                        <div className="text-right font-medium">{match.homeStats?.passes || 0}</div>
                        <div className="text-center text-sm text-muted-foreground">Pases</div>
                        <div className="text-left font-medium">{match.awayStats?.passes || 0}</div>
                      </div>
                      <div className="grid grid-cols-3 items-center">
                        <div className="text-right font-medium">{match.homeStats?.passAccuracy || 0}%</div>
                        <div className="text-center text-sm text-muted-foreground">Precisión de Pases</div>
                        <div className="text-left font-medium">{match.awayStats?.passAccuracy || 0}%</div>
                      </div>
                      <div className="grid grid-cols-3 items-center">
                        <div className="text-right font-medium">{match.homeStats?.fouls || 0}</div>
                        <div className="text-center text-sm text-muted-foreground">Faltas</div>
                        <div className="text-left font-medium">{match.awayStats?.fouls || 0}</div>
                      </div>
                      <div className="grid grid-cols-3 items-center">
                        <div className="text-right font-medium">{match.homeStats?.yellowCards || 0}</div>
                        <div className="text-center text-sm text-muted-foreground">Tarjetas Amarillas</div>
                        <div className="text-left font-medium">{match.awayStats?.yellowCards || 0}</div>
                      </div>
                      <div className="grid grid-cols-3 items-center">
                        <div className="text-right font-medium">{match.homeStats?.redCards || 0}</div>
                        <div className="text-center text-sm text-muted-foreground">Tarjetas Rojas</div>
                        <div className="text-left font-medium">{match.awayStats?.redCards || 0}</div>
                      </div>
                      <div className="grid grid-cols-3 items-center">
                        <div className="text-right font-medium">{match.homeStats?.corners || 0}</div>
                        <div className="text-center text-sm text-muted-foreground">Corners</div>
                        <div className="text-left font-medium">{match.awayStats?.corners || 0}</div>
                      </div>
                      <div className="grid grid-cols-3 items-center">
                        <div className="text-right font-medium">{match.homeStats?.offsides || 0}</div>
                        <div className="text-center text-sm text-muted-foreground">Fuera de Juego</div>
                        <div className="text-left font-medium">{match.awayStats?.offsides || 0}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <EmptyState
                      icon={BarChart3}
                      title="Estadísticas no disponibles"
                      description="Las estadísticas estarán disponibles una vez que el partido haya finalizado."
                    />
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
              {match.media && match.media.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {match.media.map((item: any, index: number) => (
                    <div key={index} className="aspect-video relative rounded-lg overflow-hidden group">
                      <Image
                        src={item.thumbnail || item.url || "/placeholder.svg?height=180&width=320"}
                        alt={item.caption || `Media ${index + 1}`}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button variant="secondary" size="sm">
                          {item.type === "video" ? "Ver Video" : "Ver Imagen"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <EmptyState
                      icon={ImageIcon}
                      title="No hay contenido multimedia"
                      description="No hay fotos o videos disponibles para este partido."
                    />
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
