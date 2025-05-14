"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search, MoreHorizontal, Pencil, Trash, Users } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { getAllPlayers, getAllTeams, deletePlayer } from "@/lib/supabase-service"
import { useToast } from "@/components/ui/use-toast"
import { translatePosition } from "@/lib/utils"
import type { Player, Team } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminPlayers() {
  const [players, setPlayers] = useState<Player[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [activeTeam, setActiveTeam] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Cargar equipos y jugadores
    const loadData = async () => {
      try {
        const teamsData = await getAllTeams()
        setTeams(teamsData)

        const playersData = await getAllPlayers()
        setPlayers(playersData)
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos de jugadores.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [toast])

  const handleDeletePlayer = async (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este jugador? Esta acción no se puede deshacer.")) {
      try {
        const success = await deletePlayer(id)

        if (success) {
          setPlayers(players.filter((player) => player.id !== id))
          toast({
            title: "Jugador eliminado",
            description: "El jugador ha sido eliminado correctamente.",
          })
        } else {
          throw new Error("No se pudo eliminar el jugador")
        }
      } catch (error) {
        console.error("Error deleting player:", error)
        toast({
          title: "Error",
          description: "Ocurrió un error al eliminar el jugador.",
          variant: "destructive",
        })
      }
    }
  }

  const filteredPlayers = players.filter((player) => {
    // Filtrar por equipo
    if (activeTeam !== "all" && player.teamId !== activeTeam) return false

    // Filtrar por búsqueda
    const fullName = `${player.firstName} ${player.lastName}`.toLowerCase()
    if (searchQuery && !fullName.includes(searchQuery.toLowerCase())) return false

    return true
  })

  const getTeamName = (teamId: string) => {
    const team = teams.find((t) => t.id === teamId)
    return team ? team.name : "Equipo no asignado"
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jugadores</h1>
          <p className="text-muted-foreground">Administra los jugadores del torneo</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/admin/players/new">
              <PlusCircle className="w-4 h-4 mr-2" />
              Agregar Jugador
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <CardTitle>Todos los Jugadores</CardTitle>
              <CardDescription>Visualiza y administra todos los jugadores del torneo</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar jugadores..."
                  className="pl-8 w-[200px] md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Select value={activeTeam} onValueChange={setActiveTeam}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar por equipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los equipos</SelectItem>
                {teams.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    {team.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {players.length === 0 ? (
            <EmptyState
              icon={Users}
              title="No hay jugadores registrados"
              description="Agrega jugadores para comenzar a gestionar el torneo."
              action={
                <Button asChild>
                  <Link href="/admin/players/new">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Agregar Jugador
                  </Link>
                </Button>
              }
            />
          ) : filteredPlayers.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No se encontraron jugadores"
              description="No hay jugadores que coincidan con tu búsqueda."
              action={
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("")
                    setActiveTeam("all")
                  }}
                >
                  Limpiar Filtros
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">Número</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Posición</TableHead>
                  <TableHead>Equipo</TableHead>
                  <TableHead>Estadísticas</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlayers.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">
                      <Badge variant="outline">{player.number}</Badge>
                    </TableCell>
                    <TableCell>
                      {player.firstName} {player.lastName}
                    </TableCell>
                    <TableCell>{translatePosition(player.position)}</TableCell>
                    <TableCell>{getTeamName(player.teamId)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                          {player.stats?.goals || 0} G
                        </Badge>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
                          {player.stats?.assists || 0} A
                        </Badge>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                          {player.stats?.yellowCards || 0} TA
                        </Badge>
                        <Badge variant="secondary" className="bg-red-100 text-red-800 hover:bg-red-100">
                          {player.stats?.redCards || 0} TR
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/players/${player.id}`}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Editar Jugador
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeletePlayer(player.id)}>
                            <Trash className="w-4 h-4 mr-2" />
                            Eliminar Jugador
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
