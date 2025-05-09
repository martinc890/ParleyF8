"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth/auth-provider"
import { getAllPlayers, getTeamById } from "@/lib/data-service"
import type { Team, Player } from "@/lib/types"
import { User, Edit, Trash, UserPlus } from "lucide-react"
import Link from "next/link"
import DashboardLayout from "@/app/dashboard-layout"

export default function CaptainTeamPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [team, setTeam] = useState<Team | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    position: "",
  })

  useEffect(() => {
    if (user?.teamId) {
      // En una implementación real, estas serían llamadas a la API
      const teamData = getTeamById(user.teamId)
      if (teamData) {
        setTeam(teamData)
      }

      const allPlayers = getAllPlayers()
      setPlayers(allPlayers.filter((player) => player.teamId === user.teamId))
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleEditPlayer = (player: Player) => {
    setEditingPlayer(player)
    setFormData({
      name: player.name,
      number: player.number.toString(),
      position: player.position,
    })
  }

  const handleSavePlayer = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingPlayer) {
      // Actualizar jugador existente
      const updatedPlayers = players.map((p) =>
        p.id === editingPlayer.id
          ? {
              ...p,
              name: formData.name,
              number: Number.parseInt(formData.number),
              position: formData.position,
            }
          : p,
      )
      setPlayers(updatedPlayers)

      toast({
        title: "Jugador actualizado",
        description: `Se ha actualizado la información de ${formData.name}`,
      })
    } else {
      // Crear nuevo jugador
      const newPlayer: Player = {
        id: `player-${Date.now()}`,
        name: formData.name,
        number: Number.parseInt(formData.number),
        position: formData.position,
        teamId: user?.teamId || "",
        stats: {
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0,
        },
      }

      setPlayers([...players, newPlayer])

      toast({
        title: "Jugador añadido",
        description: `Se ha añadido a ${formData.name} al equipo`,
      })
    }

    // Resetear formulario
    setEditingPlayer(null)
    setFormData({
      name: "",
      number: "",
      position: "",
    })
  }

  const handleDeletePlayer = (playerId: string) => {
    const updatedPlayers = players.filter((p) => p.id !== playerId)
    setPlayers(updatedPlayers)

    toast({
      title: "Jugador eliminado",
      description: "Se ha eliminado al jugador del equipo",
    })
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Equipo</h1>
            <p className="text-muted-foreground">Administra los jugadores de tu equipo</p>
          </div>
          <Button asChild>
            <Link href="/captain/invitations">
              <UserPlus className="mr-2 h-4 w-4" />
              Invitar Jugadores
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="players">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="players">Jugadores</TabsTrigger>
            <TabsTrigger value="add">Añadir/Editar Jugador</TabsTrigger>
          </TabsList>

          <TabsContent value="players">
            <Card>
              <CardHeader>
                <CardTitle>Jugadores del Equipo</CardTitle>
                <CardDescription>
                  {team?.name || "Tu equipo"} - {players.length} jugadores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {players.length > 0 ? (
                    players.map((player) => (
                      <div key={player.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            {player.photo ? (
                              <img
                                src={player.photo || "/placeholder.svg"}
                                alt={player.name}
                                className="w-full h-full rounded-full object-cover"
                              />
                            ) : (
                              <User className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{player.name}</p>
                            <p className="text-xs text-gray-500">
                              #{player.number} - {player.position}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="icon" onClick={() => handleEditPlayer(player)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleDeletePlayer(player.id)}>
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 py-4">No hay jugadores en el equipo</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>{editingPlayer ? "Editar Jugador" : "Añadir Jugador"}</CardTitle>
                <CardDescription>
                  {editingPlayer
                    ? `Editando información de ${editingPlayer.name}`
                    : "Completa el formulario para añadir un nuevo jugador"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSavePlayer} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nombre Completo</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="number">Número</Label>
                      <Input
                        id="number"
                        name="number"
                        type="number"
                        min="1"
                        max="99"
                        value={formData.number}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="position">Posición</Label>
                      <Input
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    {editingPlayer && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setEditingPlayer(null)
                          setFormData({
                            name: "",
                            number: "",
                            position: "",
                          })
                        }}
                      >
                        Cancelar
                      </Button>
                    )}
                    <Button type="submit">{editingPlayer ? "Actualizar" : "Añadir"}</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
