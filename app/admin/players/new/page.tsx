"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { teamService, playerService } from "@/lib/supabase-service"
import { userService } from "@/lib/user-service"
import { useToast } from "@/components/ui/use-toast"
import { BackButton } from "@/components/ui/back-button"
import type { Team } from "@/lib/types"

export default function NewPlayer() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [number, setNumber] = useState("")
  const [position, setPosition] = useState("")
  const [teamId, setTeamId] = useState("")
  const [teams, setTeams] = useState<Team[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const teamsData = await teamService.getAll()
        setTeams(teamsData)
      } catch (error) {
        console.error("Error loading teams:", error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los equipos",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadTeams()
  }, [toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!firstName || !lastName || !email || !number || !position || !teamId) {
        toast({
          title: "Error",
          description: "Por favor completa todos los campos obligatorios.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Verificar que el número sea válido
      const playerNumber = Number.parseInt(number)
      if (isNaN(playerNumber) || playerNumber <= 0) {
        toast({
          title: "Error",
          description: "El número de jugador debe ser un número positivo.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Crear jugador
      const newPlayer = await playerService.create({
        first_name: firstName,
        last_name: lastName,
        number: playerNumber,
        position,
        team_id: teamId,
        email,
      })

      if (!newPlayer) {
        throw new Error("Error al crear el jugador")
      }

      // Crear cuenta de usuario para el jugador
      const playerUser = await userService.createPlayerUser(email, firstName, lastName, teamId)

      if (playerUser) {
        toast({
          title: "Jugador creado",
          description: `Se ha creado la cuenta para ${firstName} ${lastName} con la contraseña: ${playerUser.password}`,
        })
      } else {
        toast({
          title: "Advertencia",
          description: "El jugador se creó correctamente, pero hubo un problema al crear su cuenta de usuario.",
          variant: "default",
        })
      }

      router.push("/admin/players")
    } catch (error: any) {
      console.error("Error creating player:", error)
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al crear el jugador.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BackButton href="/admin/players" />
        <h1 className="text-3xl font-bold tracking-tight">Agregar Nuevo Jugador</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Información Personal</CardTitle>
              <CardDescription>Ingresa la información básica del jugador</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre *</Label>
                  <Input
                    id="firstName"
                    placeholder="Nombre"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido *</Label>
                  <Input
                    id="lastName"
                    placeholder="Apellido"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Se creará una cuenta para el jugador con una contraseña generada automáticamente.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Información Deportiva</CardTitle>
              <CardDescription>Ingresa la información deportiva del jugador</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number">Número *</Label>
                  <Input
                    id="number"
                    type="number"
                    placeholder="Número de camiseta"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Posición *</Label>
                  <Select value={position} onValueChange={setPosition} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una posición" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="goalkeeper">Portero</SelectItem>
                      <SelectItem value="defender">Defensa</SelectItem>
                      <SelectItem value="midfielder">Mediocampista</SelectItem>
                      <SelectItem value="forward">Delantero</SelectItem>
                      <SelectItem value="coach">Entrenador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamId">Equipo *</Label>
                <Select value={teamId} onValueChange={setTeamId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un equipo" />
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
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href="/admin/players">Cancelar</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Guardar Jugador
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
