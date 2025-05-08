"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trash } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { addMatchEvent, removeMatchEvent, getPlayersByTeam, getMatchById, updateMatch } from "@/lib/mongodb-service"
import type { PlayerModel, MatchModel, MatchEventModel } from "@/lib/models"

interface MatchEventsFormProps {
  matchId: string
  onUpdate?: () => void
}

export default function MatchEventsForm({ matchId, onUpdate }: MatchEventsFormProps) {
  const [match, setMatch] = useState<MatchModel | null>(null)
  const [homePlayers, setHomePlayers] = useState<PlayerModel[]>([])
  const [awayPlayers, setAwayPlayers] = useState<PlayerModel[]>([])
  const [activeTab, setActiveTab] = useState("goals")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Form states
  const [goalTeam, setGoalTeam] = useState<"home" | "away">("home")
  const [goalPlayer, setGoalPlayer] = useState("")
  const [assistPlayer, setAssistPlayer] = useState("")
  const [goalMinute, setGoalMinute] = useState("")

  const [cardTeam, setCardTeam] = useState<"home" | "away">("home")
  const [cardPlayer, setCardPlayer] = useState("")
  const [cardType, setCardType] = useState<"yellowCard" | "redCard">("yellowCard")
  const [cardMinute, setCardMinute] = useState("")

  const { toast } = useToast()

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)

        // Cargar partido
        const matchData = await getMatchById(matchId)
        if (!matchData) {
          toast({
            title: "Error",
            description: "No se pudo cargar el partido",
            variant: "destructive",
          })
          return
        }

        setMatch(matchData)

        // Cargar jugadores de ambos equipos
        const homeTeamPlayers = await getPlayersByTeam(matchData.homeTeamId)
        const awayTeamPlayers = await getPlayersByTeam(matchData.awayTeamId)

        setHomePlayers(homeTeamPlayers)
        setAwayPlayers(awayTeamPlayers)

        // Establecer valores iniciales para los formularios
        if (homeTeamPlayers.length > 0) {
          setGoalPlayer(homeTeamPlayers[0]._id || "")
          setCardPlayer(homeTeamPlayers[0]._id || "")
        }
      } catch (error) {
        console.error("Error loading match data:", error)
        toast({
          title: "Error",
          description: "Ocurrió un error al cargar los datos del partido",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [matchId, toast])

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!match) return

    try {
      setIsSaving(true)

      const event: MatchEventModel = {
        matchId,
        type: "goal",
        minute: Number.parseInt(goalMinute),
        teamId: goalTeam === "home" ? match.homeTeamId : match.awayTeamId,
        playerId: goalPlayer,
        assistPlayerId: assistPlayer || undefined,
      }

      await addMatchEvent(matchId, event)

      // Actualizar el marcador del partido
      const updatedMatch = { ...match }
      if (goalTeam === "home") {
        updatedMatch.homeScore = (updatedMatch.homeScore || 0) + 1
      } else {
        updatedMatch.awayScore = (updatedMatch.awayScore || 0) + 1
      }

      await updateMatch(matchId, updatedMatch)

      toast({
        title: "Gol registrado",
        description: "El gol ha sido registrado correctamente",
      })

      // Limpiar formulario
      setGoalMinute("")
      setAssistPlayer("")

      // Recargar datos
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error("Error adding goal:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al registrar el gol",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!match) return

    try {
      setIsSaving(true)

      const event: MatchEventModel = {
        matchId,
        type: cardType,
        minute: Number.parseInt(cardMinute),
        teamId: cardTeam === "home" ? match.homeTeamId : match.awayTeamId,
        playerId: cardPlayer,
      }

      await addMatchEvent(matchId, event)

      toast({
        title: "Tarjeta registrada",
        description: `La tarjeta ${cardType === "yellowCard" ? "amarilla" : "roja"} ha sido registrada correctamente`,
      })

      // Limpiar formulario
      setCardMinute("")

      // Recargar datos
      if (onUpdate) onUpdate()
    } catch (error) {
      console.error("Error adding card:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al registrar la tarjeta",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleRemoveEvent = async (eventId: string) => {
    if (!match) return

    if (confirm("¿Estás seguro de que deseas eliminar este evento?")) {
      try {
        await removeMatchEvent(matchId, eventId)

        toast({
          title: "Evento eliminado",
          description: "El evento ha sido eliminado correctamente",
        })

        // Recargar datos
        if (onUpdate) onUpdate()
      } catch (error) {
        console.error("Error removing event:", error)
        toast({
          title: "Error",
          description: "Ocurrió un error al eliminar el evento",
          variant: "destructive",
        })
      }
    }
  }

  if (isLoading) {
    return <div className="p-4 text-center">Cargando datos del partido...</div>
  }

  if (!match) {
    return <div className="p-4 text-center">No se pudo cargar el partido</div>
  }

  const currentPlayers = goalTeam === "home" ? homePlayers : awayPlayers
  const currentCardPlayers = cardTeam === "home" ? homePlayers : awayPlayers

  return (
    <Card>
      <CardHeader>
        <CardTitle>Eventos del Partido</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="goals" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="goals">Goles</TabsTrigger>
            <TabsTrigger value="cards">Tarjetas</TabsTrigger>
          </TabsList>

          <TabsContent value="goals" className="space-y-4">
            <form onSubmit={handleAddGoal} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="goal-team">Equipo</Label>
                  <Select value={goalTeam} onValueChange={(value: "home" | "away") => setGoalTeam(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar equipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">{match.homeTeam?.name || "Equipo Local"}</SelectItem>
                      <SelectItem value="away">{match.awayTeam?.name || "Equipo Visitante"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal-minute">Minuto</Label>
                  <Input
                    id="goal-minute"
                    type="number"
                    min="1"
                    max="120"
                    placeholder="Minuto del gol"
                    value={goalMinute}
                    onChange={(e) => setGoalMinute(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goal-player">Jugador que anotó</Label>
                <Select value={goalPlayer} onValueChange={setGoalPlayer} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar jugador" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentPlayers.map((player) => (
                      <SelectItem key={player._id} value={player._id || ""}>
                        {player.number} - {player.firstName} {player.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assist-player">Asistencia (opcional)</Label>
                <Select value={assistPlayer} onValueChange={setAssistPlayer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar jugador (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="no-assist">Sin asistencia</SelectItem>
                    {currentPlayers.map((player) => (
                      <SelectItem key={player._id} value={player._id || ""}>
                        {player.number} - {player.firstName} {player.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={isSaving} className="w-full">
                {isSaving ? "Guardando..." : "Registrar Gol"}
              </Button>
            </form>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Goles Registrados</h3>
              {match.events.filter((e) => e.type === "goal").length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">No hay goles registrados</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Minuto</TableHead>
                      <TableHead>Equipo</TableHead>
                      <TableHead>Jugador</TableHead>
                      <TableHead>Asistencia</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {match.events
                      .filter((e) => e.type === "goal")
                      .sort((a, b) => a.minute - b.minute)
                      .map((event) => {
                        const player = [...homePlayers, ...awayPlayers].find((p) => p._id === event.playerId)
                        const assistPlayer = event.assistPlayerId
                          ? [...homePlayers, ...awayPlayers].find((p) => p._id === event.assistPlayerId)
                          : null
                        const isHomeTeam = event.teamId === match.homeTeamId

                        return (
                          <TableRow key={event._id}>
                            <TableCell>{event.minute}'</TableCell>
                            <TableCell>{isHomeTeam ? match.homeTeam?.name : match.awayTeam?.name}</TableCell>
                            <TableCell>
                              {player ? `${player.firstName} ${player.lastName}` : "Jugador desconocido"}
                            </TableCell>
                            <TableCell>
                              {assistPlayer ? `${assistPlayer.firstName} ${assistPlayer.lastName}` : "-"}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => handleRemoveEvent(event._id || "")}>
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          <TabsContent value="cards" className="space-y-4">
            <form onSubmit={handleAddCard} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="card-team">Equipo</Label>
                  <Select value={cardTeam} onValueChange={(value: "home" | "away") => setCardTeam(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar equipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">{match.homeTeam?.name || "Equipo Local"}</SelectItem>
                      <SelectItem value="away">{match.awayTeam?.name || "Equipo Visitante"}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="card-type">Tipo de Tarjeta</Label>
                  <Select value={cardType} onValueChange={(value: "yellowCard" | "redCard") => setCardType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yellowCard">Amarilla</SelectItem>
                      <SelectItem value="redCard">Roja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="card-minute">Minuto</Label>
                  <Input
                    id="card-minute"
                    type="number"
                    min="1"
                    max="120"
                    placeholder="Minuto de la tarjeta"
                    value={cardMinute}
                    onChange={(e) => setCardMinute(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="card-player">Jugador</Label>
                <Select value={cardPlayer} onValueChange={setCardPlayer} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar jugador" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentCardPlayers.map((player) => (
                      <SelectItem key={player._id} value={player._id || ""}>
                        {player.number} - {player.firstName} {player.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={isSaving} className="w-full">
                {isSaving ? "Guardando..." : "Registrar Tarjeta"}
              </Button>
            </form>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Tarjetas Registradas</h3>
              {match.events.filter((e) => e.type === "yellowCard" || e.type === "redCard").length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">No hay tarjetas registradas</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Minuto</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Equipo</TableHead>
                      <TableHead>Jugador</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {match.events
                      .filter((e) => e.type === "yellowCard" || e.type === "redCard")
                      .sort((a, b) => a.minute - b.minute)
                      .map((event) => {
                        const player = [...homePlayers, ...awayPlayers].find((p) => p._id === event.playerId)
                        const isHomeTeam = event.teamId === match.homeTeamId

                        return (
                          <TableRow key={event._id}>
                            <TableCell>{event.minute}'</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  event.type === "yellowCard" ? "bg-yellow-500 text-black" : "bg-red-500 text-white"
                                }
                              >
                                {event.type === "yellowCard" ? "Amarilla" : "Roja"}
                              </Badge>
                            </TableCell>
                            <TableCell>{isHomeTeam ? match.homeTeam?.name : match.awayTeam?.name}</TableCell>
                            <TableCell>
                              {player ? `${player.firstName} ${player.lastName}` : "Jugador desconocido"}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="icon" onClick={() => handleRemoveEvent(event._id || "")}>
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
