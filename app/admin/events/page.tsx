"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search, MoreHorizontal, Pencil, Trash, Calendar, MapPin, Music, Trophy } from "lucide-react"
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
import { getAllEvents, deleteEvent } from "@/lib/data-service"
import { useToast } from "@/components/ui/use-toast"

export default function AdminEvents() {
  const [events, setEvents] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    // Load events data
    loadEvents()
  }, [])

  const loadEvents = () => {
    const allEvents = getAllEvents()
    setEvents(allEvents)
  }

  const handleDeleteEvent = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.")) {
      deleteEvent(id)
      loadEvents()
      toast({
        title: "Evento eliminado",
        description: "El evento ha sido eliminado exitosamente.",
      })
    }
  }

  const filteredEvents = events.filter((event) => {
    if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    return true
  })

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "party":
        return <Music className="w-3 h-3" />
      case "fan":
        return <Music className="w-3 h-3" />
      case "concert":
        return <Music className="w-3 h-3" />
      case "ceremony":
        return <Trophy className="w-3 h-3" />
      default:
        return <Music className="w-3 h-3" />
    }
  }

  const getEventTypeName = (type: string) => {
    switch (type) {
      case "party":
        return "Fiesta"
      case "fan":
        return "Evento para Fans"
      case "concert":
        return "Concierto"
      case "ceremony":
        return "Ceremonia"
      default:
        return type
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Eventos</h1>
          <p className="text-muted-foreground">Administra todos los eventos del torneo</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/admin/events/new">
              <PlusCircle className="w-4 h-4 mr-2" />
              Agregar Evento
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <CardTitle>Todos los Eventos</CardTitle>
              <CardDescription>Ver y administrar todos los eventos del torneo</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar eventos..."
                  className="pl-8 w-[200px] md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <EmptyState
              icon={Music}
              title="No hay eventos"
              description="Agrega tu primer evento para comenzar."
              action={
                <Button asChild>
                  <Link href="/admin/events/new">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Agregar Evento
                  </Link>
                </Button>
              }
            />
          ) : filteredEvents.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No se encontraron eventos"
              description="No hay eventos que coincidan con tu búsqueda."
              action={
                <Button variant="outline" onClick={() => setSearchQuery("")}>
                  Limpiar Búsqueda
                </Button>
              }
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">Fecha y Hora</TableHead>
                  <TableHead>Nombre del Evento</TableHead>
                  <TableHead>Ubicación</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span>{event.date}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{event.time}</div>
                      </div>
                    </TableCell>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        {getEventTypeIcon(event.type)}
                        {getEventTypeName(event.type)}
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
                            <Link href={`/admin/events/${event.id}`}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Editar Evento
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteEvent(event.id)}>
                            <Trash className="w-4 h-4 mr-2" />
                            Eliminar Evento
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
