"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, PlusCircle, Trash, Save } from "lucide-react"
import Link from "next/link"
import { getTeamById, updateTeam, getPlayersByTeam, addPlayer, deletePlayer } from "@/lib/data-service"
import { useToast } from "@/components/ui/use-toast"
import { EmptyState } from "@/components/ui/empty-state"

export default function TeamPlayersPage({ params }: { params: { id: string } }) {
  const [team, setTeam] = useState<any>(null)
  const [players, setPlayers] = useState<any[]>([])
  const [newPlayer, setNewPlayer] = useState({
    name: "",
    number: "",
    position: "",
    isStarter: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Load team and players data
    loadTeamData()
  }, [params.id])

  const loadTeamData = () => {
    const teamData = getTeamById(params.id)
    if (!teamData) {
      router.push("/admin/teams")
      return
    }
    setTeam(teamData)

    const teamPlayers = getPlayersByTeam(params.id)
    setPlayers(teamPlayers)
  }

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate number of players
      const starters = players.filter((p) => p.isStarter).length
      const substitutes = players.filter((p) => !p.isStarter).length

      if (newPlayer.isStarter && starters >= 8) {
        toast({
          title: "Error",
          description: "No se pueden agregar más de 8 titulares.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      if (!newPlayer.isStarter && substitutes >= 7) {
        toast({
          title: "Error",
          description: "No se pueden agregar más de 7 suplentes.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Create new player
      const player = {
        id: Date.now().toString(),
        name: newPlayer.name,
        number: Number.parseInt(newPlayer.number),
        position: newPlayer.position,
        teamId: params.id,
        isStarter: newPlayer.isStarter,
      }

      addPlayer(player)

      // Update team's players array
      if (team) {
        const updatedTeam = {
          ...team,
          players: [...team.players, player.id],
        }
        updateTeam(updatedTeam)
      }

      // Reset form
      setNewPlayer({
        name: "",
        number: "",
        position: "",
        isStarter: true,
      })

      // Reload data
      loadTeamData()

      toast({
        title: "Jugador agregado",
        description: "El jugador ha sido agregado exitosamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al agregar el jugador.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeletePlayer = (playerId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este jugador? Esta acción no se puede deshacer.")) {
      try {
        deletePlayer(playerId)

        // Update team's players array
        if (team) {
          const updatedTeam = {
            ...team,
            players: team.players.filter((id: string) => id !== playerId),
          }
          updateTeam(updatedTeam)
        }

        // Reload data
        loadTeamData()

        toast({
          title: "Jugador eliminado",
          description: "El jugador ha sido eliminado exitosamente.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Ocurrió un error al eliminar el jugador.",
          variant: "destructive",
        })
      }
    }
  }

  if (!team) {
    return <div>Cargando...</div>
  }

  const starters = players.filter((p) => p.isStarter)
  const substitutes = players.filter((p) => !p.isStarter)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/teams">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Jugadores de {team.name}</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Agregar Jugador</CardTitle>
            <CardDescription>Agrega jugadores al equipo. Máximo 8 titulares y 7 suplentes.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddPlayer} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Jugador</Label>
                <Input
                  id="name"
                  placeholder="Nombre completo"
                  value={newPlayer.name}
                  onChange={(e) => setNewPlayer({ ...newPlayer, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    type="number"
                    placeholder="Número"
                    value={newPlayer.number}
                    onChange={(e) => setNewPlayer({ ...newPlayer, number: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Posición</Label>
                  <Select
                    value={newPlayer.position}
                    onValueChange={(value) => setNewPlayer({ ...newPlayer, position: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar posición" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GK">Portero (GK)</SelectItem>
                      <SelectItem value="DF">Defensa (DF)</SelectItem>
                      <SelectItem value="MF">Mediocampista (MF)</SelectItem>
                      <SelectItem value="FW">Delantero (FW)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="isStarter">Tipo de Jugador</Label>
                <Select
                  value={newPlayer.isStarter ? "starter" : "substitute"}
                  onValueChange={(value) => setNewPlayer({ ...newPlayer, isStarter: value === "starter" })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">Titular ({starters.length}/8)</SelectItem>
                    <SelectItem value="substitute">Suplente ({substitutes.length}/7)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                <PlusCircle className="w-4 h-4 mr-2" />
                {isSubmitting ? "Agregando..." : "Agregar Jugador"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Titulares ({starters.length}/8)</CardTitle>
              <CardDescription>Jugadores titulares del equipo</CardDescription>
            </CardHeader>
            <CardContent>
              {starters.length === 0 ? (
                <EmptyState
                  icon={PlusCircle}
                  title="No hay titulares"
                  description="Agrega jugadores titulares al equipo."
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Posición</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {starters.map((player) => (
                      <TableRow key={player.id}>
                        <TableCell className="font-medium">{player.number}</TableCell>
                        <TableCell>{player.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{player.position}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePlayer(player.id)}
                            className="text-destructive"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Suplentes ({substitutes.length}/7)</CardTitle>
              <CardDescription>Jugadores suplentes del equipo</CardDescription>
            </CardHeader>
            <CardContent>
              {substitutes.length === 0 ? (
                <EmptyState
                  icon={PlusCircle}
                  title="No hay suplentes"
                  description="Agrega jugadores suplentes al equipo."
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Posición</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {substitutes.map((player) => (
                      <TableRow key={player.id}>
                        <TableCell className="font-medium">{player.number}</TableCell>
                        <TableCell>{player.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{player.position}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePlayer(player.id)}
                            className="text-destructive"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <Button asChild>
          <Link href="/admin/teams">
            <Save className="w-4 h-4 mr-2" />
            Guardar y Volver
          </Link>
        </Button>
      </div>
    </div>
  )
}
