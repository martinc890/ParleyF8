"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { addTeam } from "@/lib/data-service"
import { useToast } from "@/components/ui/use-toast"

export default function NewTeam() {
  const [name, setName] = useState("")
  const [group, setGroup] = useState("")
  const [logo, setLogo] = useState("/placeholder.svg?height=40&width=40")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create new team
      const newTeam = {
        id: Date.now().toString(),
        name,
        logo: logo || "/placeholder.svg?height=40&width=40",
        group,
        players: [],
        stats: {
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          points: 0,
        },
      }

      addTeam(newTeam)

      toast({
        title: "Equipo creado",
        description: "El equipo ha sido creado exitosamente.",
      })

      router.push("/admin/teams")
    } catch (error) {
      console.error("Error creating team:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al crear el equipo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/teams">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Agregar Nuevo Equipo</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Equipo</CardTitle>
              <CardDescription>Ingresa la información básica del equipo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Equipo</Label>
                <Input
                  id="name"
                  placeholder="Ingresa el nombre del equipo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="group">Grupo</Label>
                <Select value={group} onValueChange={setGroup} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">Grupo A</SelectItem>
                    <SelectItem value="B">Grupo B</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">URL del Logo (opcional)</Label>
                <Input
                  id="logo"
                  placeholder="Ingresa la URL del logo"
                  value={logo}
                  onChange={(e) => setLogo(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Ingresa una URL para la imagen del logo del equipo. Deja el valor predeterminado para usar un logo
                  genérico.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href="/admin/teams">Cancelar</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Guardando..." : "Guardar Equipo"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
