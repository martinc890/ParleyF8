"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, MoreHorizontal, Pencil, Trash, User } from "lucide-react"
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
import { getAllPlayers, deletePlayer, getTeamById } from "@/lib/data-service"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminPlayers() {
  const [players, setPlayers] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [teamFilter, setTeamFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    // Load players data
    loadPlayers()
  }, [])

  const loadPlayers = () => {
    const allPlayers = getAllPlayers()
    setPlayers(allPlayers)
  }

  const handleDeletePlayer = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este jugador? Esta acción no se puede deshacer.")) {
      deletePlayer(id)
      loadPlayers()
      toast({
        title: "Jugador eliminado",
        description: "El jugador ha sido eliminado exitosamente.",
      })
    }
  }

  const getTeamName = (teamId: string) => {
    const team = getTeamById(teamId)
    return team ? team.name : "Equipo desconocido"
  }

  const filteredPlayers = players.filter((player) => {
    // Filtrar por búsqueda
    if (searchQuery && !player.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Filtrar por equipo
    if (teamFilter !== "all" && player.teamId !== teamFilter) {
      return false
    }

    return true
  })

  // Obtener equipos únicos para el filtro
  const teams = [...new Set(players.map((player) => player.teamId))].map((teamId) => ({
    id: teamId,
    name: getTeamName(teamId as string),
  }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Jugadores</h1>
          <p className="text-muted-foreground">Administra todos los jugadores del torneo</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <CardTitle>Todos los Jugadores</CardTitle>
              <CardDescription>Ver y administrar todos los jugadores del torneo</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar jugadores..."
                  className="pl-8 w-full sm:w-[200px] md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={teamFilter} onValueChange={setTeamFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filtrar por equipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los equipos</SelectItem>
                  {teams.map((team) => (
                    <SelectItem key={team.id} value={team.id as string}>
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {players.length === 0 ? (
            <EmptyState
              icon={User}
              title="No hay jugadores"
              description="Agrega jugadores a los equipos para verlos aquí."
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
                    setTeamFilter("all")
                  }}
                >
                  Limpiar filtros
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Posición</TableHead>
                  <TableHead>Equipo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlayers.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">{player.number}</TableCell>
                    <TableCell>{player.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{player.position}</Badge>
                    </TableCell>
                    <TableCell>{getTeamName(player.teamId)}</TableCell>
                    <TableCell>
                      <Badge variant={player.isStarter ? "default" : "secondary"}>
                        {player.isStarter ? "Titular" : "Suplente"}
                      </Badge>
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
                            <Link href={`/admin/teams/${player.teamId}/players`}>
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
