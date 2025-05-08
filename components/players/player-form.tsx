"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { createPlayer } from "@/lib/mongodb-service"
import type { PlayerModel } from "@/lib/models"

interface PlayerFormProps {
  teamId: string
  onSuccess?: () => void
}

export default function PlayerForm({ teamId, onSuccess }: PlayerFormProps) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [number, setNumber] = useState("")
  const [position, setPosition] = useState("GK")
  const [isStarter, setIsStarter] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)

      const player: PlayerModel = {
        firstName,
        lastName,
        number: Number.parseInt(number),
        position,
        teamId,
        isStarter,
        stats: {
          goals: 0,
          assists: 0,
          yellowCards: 0,
          redCards: 0,
        },
      }

      await createPlayer(player)

      toast({
        title: "Jugador creado",
        description: "El jugador ha sido creado correctamente",
      })

      // Limpiar formulario
      setFirstName("")
      setLastName("")
      setNumber("")

      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Error creating player:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al crear el jugador",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agregar Jugador</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">Nombre</Label>
              <Input
                id="first-name"
                placeholder="Nombre del jugador"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="last-name">Apellido</Label>
              <Input
                id="last-name"
                placeholder="Apellido del jugador"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number">Número</Label>
              <Input
                id="number"
                type="number"
                min="1"
                max="99"
                placeholder="Número"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Posición</Label>
              <Select value={position} onValueChange={setPosition} required>
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

            <div className="space-y-2">
              <Label htmlFor="is-starter">Tipo de Jugador</Label>
              <Select
                value={isStarter ? "starter" : "substitute"}
                onValueChange={(value) => setIsStarter(value === "starter")}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="starter">Titular</SelectItem>
                  <SelectItem value="substitute">Suplente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Guardando..." : "Agregar Jugador"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
