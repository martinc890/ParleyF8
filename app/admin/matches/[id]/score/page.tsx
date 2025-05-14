"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Save, Plus, Trash, Goal, AlertTriangle } from "lucide-react"
import { BackButton } from "@/components/ui/back-button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  getMatchById,
  getPlayersByTeam,
  updateMatch,
  createMatchEvent,
  updateStatsAfterMatch,
} from "@/lib/supabase-service"
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { formatFullName } from "@/lib/utils"
import type { Player } from "@/lib/types"

export default function UpdateMatchScore({ params }: { params: { id: string } }) {
  const [match, setMatch] = useState<any>(null)
  const [homeScore, setHomeScore] = useState(0)
  const [awayScore, setAwayScore] = useState(0)
  const [status, setStatus] = useState("upcoming")
  const [homePlayers, setHomePlayers] = useState<Player[]>([])
  const [awayPlayers, setAwayPlayers] = useState<Player[]>([])
  const [homeLineup, setHomeLineup] = useState<string[]>([])
  const [awayLineup, setAwayLineup] = useState<string[]>([])
  const [events, setEvents] = useState<any[]>([])
  const [newEvent, setNewEvent] = useState({
    type: "goal",
    minute: "",
    playerId: "",
    assistPlayerId: "",
    teamId: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const loadMatchData = async () => {
      try {
        // Cargar datos del partido
        const matchData = await getMatchById(params.id)
        if (!matchData) {
          toast({
            title: "Error",
            description: "No se pudo encontrar el partido.",
            variant: "destructive",
          })
          router.push("/admin/matches")
          return
        }

        setMatch(matchData)
        setHomeScore(matchData.score?.home || 0)
        setAwayScore(matchData.score?.away || 0)
        setStatus(matchData.status)

        // Cargar jugadores de ambos equipos
        const homeTeamPlayers = await getPlayersByTeam(matchData.homeTeamId)
        const awayTeamPlayers = await getPlayersByTeam(matchData.awayTeamId)

        setHomePlayers(homeTeamPlayers)
        setAwayPlayers(awayTeamPlayers)

        // Si hay eventos, cargarlos
        if (matchData.events) {
          setEvents(matchData.events)
        }

        // Inicializar alineaciones vacías
        setHomeLineup([])
        setAwayLineup([])

        // Inicializar nuevo evento
        setNewEvent({
          ...newEvent,
          teamId: matchData.homeTeamId,
        })
      } catch (error) {
        console.error("Error loading match data:", error)
        toast({
          title: "Error",
          description: "Ocurrió un error al cargar los datos del partido.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadMatchData()
  }, [params.id, router, toast])

  const handleAddEvent = () => {
    // Validar datos del evento
    if (!newEvent.minute || !newEvent.playerId || !newEvent.teamId) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos obligatorios del evento.",
        variant: "destructive",
      })
      return
    }

    // Agregar evento a la lista
    const eventToAdd = {
      ...newEvent,
      id: `temp-${Date.now()}`,
      minute: Number.parseInt(newEvent.minute),
    }

    setEvents([...events, eventToAdd])

    // Resetear formulario de nuevo evento
    setNewEvent({
      type: "goal",
      minute: "",
      playerId: "",
      assistPlayerId: "",
      teamId: newEvent.teamId,
    })
  }

  const handleRemoveEvent = (index: number) => {
    const updatedEvents = [...events]
    updatedEvents.splice(index, 1)
    setEvents(updatedEvents)
  }

  const handleToggleLineup = (playerId: string, isHome: boolean) => {
    if (isHome) {
      if (homeLineup.includes(playerId)) {
        setHomeLineup(homeLineup.filter((id) => id !== playerId))
      } else {
        setHomeLineup([...homeLineup, playerId])
      }
    } else {
      if (awayLineup.includes(playerId)) {
        setAwayLineup(awayLineup.filter((id) => id !== playerId))
      } else {
        setAwayLineup([...awayLineup, playerId])
      }
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      // Actualizar partido
      const updatedMatch = await updateMatch(params.id, {
        score: {
          home: homeScore,
          away: awayScore,
        },
        status,
      })

      if (!updatedMatch) {
        throw new Error("No se pudo actualizar el partido")
      }

      // Guardar eventos
      for (const event of events) {
        if (event.id.startsWith("temp-")) {
          // Es un evento nuevo, crearlo
          await createMatchEvent({
            matchId: params.id,
            type: event.type,
            minute: event.minute,
            playerId: event.playerId,
            assistPlayerId: event.assistPlayerId,
            teamId: event.teamId,
          })
        }
      }

      // Si el partido está completado, actualizar estadísticas
      if (status === "completed") {
        await updateStatsAfterMatch(params.id)
      }

      toast({
        title: "Partido actualizado",
        description: "La información del partido ha sido actualizada correctamente.",
      })

      router.push("/admin/matches")
    } catch (error) {
      console.error("Error saving match data:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar los datos del partido.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="space-y-4">
        <BackButton href="/admin/matches" />
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <AlertTriangle className="w-10 h-10 text-destructive mb-4" />
              <h2 className="text-xl font-bold mb-2">Partido no encontrado</h2>
              <p className="text-muted-foreground mb-4">No se pudo encontrar el partido solicitado.</p>
              <Button asChild>
                <a href="/admin/matches">Volver a Partidos</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BackButton href="/admin/matches" />
        <h1 className="text-3xl font-bold tracking-tight">Actualizar Resultado</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles del Partido</CardTitle>
          <CardDescription>
            {match.date} - {match.time} - {match.venue}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-6 bg-muted/30 rounded-lg mb-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 relative">
                <Image
                  src={match.homeTeam?.logo || "/placeholder.svg?height=64&width=64"}
                  alt={match.homeTeam?.name || "Equipo Local"}
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="mt-2 text-lg font-bold">{match.homeTeam?.name || "Equipo Local"}</h2>
            </div>

            <div className="flex items-center gap-4">
              <Input
                type="number"
                min="0"
                className="w-16 text-center text-xl font-bold"
                value={homeScore}
                onChange={(e) => setHomeScore(Number.parseInt(e.target.value) || 0)}
              />
              <span className="text-xl">-</span>
              <Input
                type="number"
                min="0"
                className="w-16 text-center text-xl font-bold"
                value={awayScore}
                onChange={(e) => setAwayScore(Number.parseInt(e.target.value) || 0)}
              />
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 relative">
                <Image
                  src={match.awayTeam?.logo || "/placeholder.svg?height=64&width=64"}
                  alt={match.awayTeam?.name || "Equipo Visitante"}
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="mt-2 text-lg font-bold">{match.awayTeam?.name || "Equipo Visitante"}</h2>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status">Estado del Partido</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcoming">Próximamente</SelectItem>
                  <SelectItem value="live">En Vivo</SelectItem>
                  <SelectItem value="completed">Completado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="events">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="events">Eventos</TabsTrigger>
          <TabsTrigger value="lineups">Alineaciones</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Eventos del Partido</CardTitle>
              <CardDescription>Registra goles, tarjetas y sustituciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventType">Tipo de Evento</Label>
                    <Select value={newEvent.type} onValueChange={(value) => setNewEvent({ ...newEvent, type: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo de evento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="goal">Gol</SelectItem>
                        <SelectItem value="yellowCard">Tarjeta Amarilla</SelectItem>
                        <SelectItem value="redCard">Tarjeta Roja</SelectItem>
                        <SelectItem value="substitution">Sustitución</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventMinute">Minuto</Label>
                    <Input
                      id="eventMinute"
                      type="number"
                      min="1"
                      max="120"
                      placeholder="Minuto del evento"
                      value={newEvent.minute}
                      onChange={(e) => setNewEvent({ ...newEvent, minute: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventTeam">Equipo</Label>
                    <Select
                      value={newEvent.teamId}
                      onValueChange={(value) => setNewEvent({ ...newEvent, teamId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el equipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={match.homeTeamId}>{match.homeTeam?.name || "Equipo Local"}</SelectItem>
                        <SelectItem value={match.awayTeamId}>{match.awayTeam?.name || "Equipo Visitante"}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eventPlayer">Jugador</Label>
                    <Select
                      value={newEvent.playerId}
                      onValueChange={(value) => setNewEvent({ ...newEvent, playerId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el jugador" />
                      </SelectTrigger>
                      <SelectContent>
                        {(newEvent.teamId === match.homeTeamId ? homePlayers : awayPlayers).map((player) => (
                          <SelectItem key={player.id} value={player.id}>
                            {player.number} - {formatFullName(player.firstName, player.lastName)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {(newEvent.type === "goal" || newEvent.type === "substitution") && (
                  <div className="space-y-2">
                    <Label htmlFor="eventAssistPlayer">
                      {newEvent.type === "goal" ? "Asistencia" : "Jugador que sale"}
                    </Label>
                    <Select
                      value={newEvent.assistPlayerId}
                      onValueChange={(value) => setNewEvent({ ...newEvent, assistPlayerId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={`Selecciona el ${newEvent.type === "goal" ? "asistente" : "jugador que sale"}`}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Ninguno</SelectItem>
                        {(newEvent.teamId === match.homeTeamId ? homePlayers : awayPlayers).map((player) => (
                          <SelectItem key={player.id} value={player.id}>
                            {player.number} - {formatFullName(player.firstName, player.lastName)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button onClick={handleAddEvent} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Evento
                </Button>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Eventos Registrados</h3>
                  {events.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No hay eventos registrados para este partido.</p>
                  ) : (
                    <div className="space-y-2">
                      {events.map((event, index) => {
                        const isHomeTeam = event.teamId === match.homeTeamId
                        const players = isHomeTeam ? homePlayers : awayPlayers
                        const player = players.find((p) => p.id === event.playerId)
                        const assistPlayer = players.find((p) => p.id === event.assistPlayerId)

                        return (
                          <div key={index} className="flex items-center justify-between p-2 rounded-md bg-muted/50">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{event.minute}'</Badge>
                              {event.type === "goal" && <Goal className="w-4 h-4 text-green-500" />}
                              {event.type === "yellowCard" && <div className="w-3 h-4 bg-yellow-400 rounded-sm"></div>}
                              {event.type === "redCard" && <div className="w-3 h-4 bg-red-500 rounded-sm"></div>}
                              <span className="font-medium">
                                {player ? formatFullName(player.firstName, player.lastName) : "Jugador"}
                              </span>
                              {event.type === "goal" && event.assistPlayerId && (
                                <span className="text-sm text-muted-foreground">
                                  (Asistencia:{" "}
                                  {assistPlayer
                                    ? formatFullName(assistPlayer.firstName, assistPlayer.lastName)
                                    : "Jugador"}
                                  )
                                </span>
                              )}
                              {event.type === "substitution" && event.assistPlayerId && (
                                <span className="text-sm text-muted-foreground">
                                  (Sale:{" "}
                                  {assistPlayer
                                    ? formatFullName(assistPlayer.firstName, assistPlayer.lastName)
                                    : "Jugador"}
                                  )
                                </span>
                              )}
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => handleRemoveEvent(index)}>
                              <Trash className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lineups" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Alineación {match.homeTeam?.name || "Equipo Local"}</CardTitle>
                <CardDescription>Selecciona los jugadores titulares</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {homePlayers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No hay jugadores registrados para este equipo.</p>
                  ) : (
                    homePlayers.map((player) => (
                      <div key={player.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`home-player-${player.id}`}
                          checked={homeLineup.includes(player.id)}
                          onCheckedChange={() => handleToggleLineup(player.id, true)}
                        />
                        <Label
                          htmlFor={`home-player-${player.id}`}
                          className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          <Badge variant="outline">{player.number}</Badge>
                          {formatFullName(player.firstName, player.lastName)}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Alineación {match.awayTeam?.name || "Equipo Visitante"}</CardTitle>
                <CardDescription>Selecciona los jugadores titulares</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {awayPlayers.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No hay jugadores registrados para este equipo.</p>
                  ) : (
                    awayPlayers.map((player) => (
                      <div key={player.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`away-player-${player.id}`}
                          checked={awayLineup.includes(player.id)}
                          onCheckedChange={() => handleToggleLineup(player.id, false)}
                        />
                        <Label
                          htmlFor={`away-player-${player.id}`}
                          className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          <Badge variant="outline">{player.number}</Badge>
                          {formatFullName(player.firstName, player.lastName)}
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Estadísticas del Partido</CardTitle>
              <CardDescription>Registra las estadísticas generales del partido</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label className="text-right">Equipo Local</Label>
                  <div className="text-center font-medium">Posesión (%)</div>
                  <Label>Equipo Visitante</Label>
                </div>

                <div className="grid grid-cols-3 items-center gap-4">
                  <Input type="number" min="0" max="100" className="text-right" placeholder="50" />
                  <div className="text-center text-sm text-muted-foreground">Posesión</div>
                  <Input type="number" min="0" max="100" placeholder="50" />
                </div>

                <div className="grid grid-cols-3 items-center gap-4">
                  <Input type="number" min="0" className="text-right" placeholder="0" />
                  <div className="text-center text-sm text-muted-foreground">Tiros</div>
                  <Input type="number" min="0" placeholder="0" />
                </div>

                <div className="grid grid-cols-3 items-center gap-4">
                  <Input type="number" min="0" className="text-right" placeholder="0" />
                  <div className="text-center text-sm text-muted-foreground">Tiros a Puerta</div>
                  <Input type="number" min="0" placeholder="0" />
                </div>

                <div className="grid grid-cols-3 items-center gap-4">
                  <Input type="number" min="0" className="text-right" placeholder="0" />
                  <div className="text-center text-sm text-muted-foreground">Corners</div>
                  <Input type="number" min="0" placeholder="0" />
                </div>

                <div className="grid grid-cols-3 items-center gap-4">
                  <Input type="number" min="0" className="text-right" placeholder="0" />
                  <div className="text-center text-sm text-muted-foreground">Faltas</div>
                  <Input type="number" min="0" placeholder="0" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button variant="outline" asChild>
          <a href="/admin/matches">Cancelar</a>
        </Button>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Guardando..." : "Guardar Cambios"}
        </Button>
      </div>
    </div>
  )
}
