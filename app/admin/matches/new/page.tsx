"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, Clock, MapPin, Save } from "lucide-react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { addMatch, getAllTeams } from "@/lib/data-service"
import { useToast } from "@/components/ui/use-toast"
import { EmptyState } from "@/components/ui/empty-state"
import { PlusCircle } from "lucide-react"

export default function NewMatch() {
  const [homeTeam, setHomeTeam] = useState("")
  const [awayTeam, setAwayTeam] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [stadium, setStadium] = useState("")
  const [phase, setPhase] = useState("")
  const [group, setGroup] = useState("")
  const [notes, setNotes] = useState("")
  const [teams, setTeams] = useState<any[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    // Load teams data
    const allTeams = getAllTeams()
    setTeams(allTeams)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create new match
      const newMatch = {
        id: Date.now().toString(),
        date,
        time,
        homeTeamId: homeTeam,
        awayTeamId: awayTeam,
        homeScore: null,
        awayScore: null,
        group: phase === "group" ? group : undefined,
        stadium,
        phase,
        status: "upcoming",
        notes,
      }

      addMatch(newMatch)

      toast({
        title: "Partido creado",
        description: "El partido ha sido creado exitosamente.",
      })

      router.push("/admin/matches")
    } catch (error) {
      console.error("Error creating match:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al crear el partido.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (teams.length < 2) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/matches">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Agregar Nuevo Partido</h1>
        </div>

        <Card>
          <CardContent className="pt-6">
            <EmptyState
              icon={PlusCircle}
              title="Se necesitan al menos dos equipos"
              description="Debes crear al menos dos equipos antes de poder crear un partido."
              action={
                <Button asChild>
                  <Link href="/admin/teams/new">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Crear Equipo
                  </Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/matches">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Agregar Nuevo Partido</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Partido</CardTitle>
              <CardDescription>Ingresa la información básica del partido</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="home-team">Equipo Local</Label>
                  <Select value={homeTeam} onValueChange={setHomeTeam} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona equipo local" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="away-team">Equipo Visitante</Label>
                  <Select value={awayTeam} onValueChange={setAwayTeam} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona equipo visitante" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team.id} value={team.id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="date" className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Fecha
                  </Label>
                  <Input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time" className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Hora
                  </Label>
                  <Input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stadium" className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Estadio
                  </Label>
                  <Input
                    id="stadium"
                    placeholder="Ingresa el nombre del estadio"
                    value={stadium}
                    onChange={(e) => setStadium(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phase">Fase del Torneo</Label>
                  <Select value={phase} onValueChange={setPhase} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona fase" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="group">Fase de Grupos</SelectItem>
                      <SelectItem value="quarter">Cuartos de Final</SelectItem>
                      <SelectItem value="semi">Semifinales</SelectItem>
                      <SelectItem value="final">Final</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {phase === "group" && (
                  <div className="space-y-2">
                    <Label htmlFor="group">Grupo</Label>
                    <Select value={group} onValueChange={setGroup} required={phase === "group"}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona grupo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">Grupo A</SelectItem>
                        <SelectItem value="B">Grupo B</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notas Adicionales</Label>
                <Textarea
                  id="notes"
                  placeholder="Ingresa cualquier información adicional sobre el partido"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href="/admin/matches">Cancelar</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Guardando..." : "Guardar Partido"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
