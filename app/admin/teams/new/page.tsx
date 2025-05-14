"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, Loader2 } from "lucide-react"
import Link from "next/link"
import { teamService } from "@/lib/supabase-service"
import { userService } from "@/lib/user-service"
import { useToast } from "@/components/ui/use-toast"
import { BackButton } from "@/components/ui/back-button"

export default function NewTeam() {
  const [name, setName] = useState("")
  const [group, setGroup] = useState("")
  const [logo, setLogo] = useState("/placeholder.svg?height=40&width=40")
  const [captainEmail, setCaptainEmail] = useState("")
  const [captainFirstName, setCaptainFirstName] = useState("")
  const [captainLastName, setCaptainLastName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!name || !group) {
        toast({
          title: "Error",
          description: "Por favor completa todos los campos obligatorios.",
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }

      // Crear nuevo equipo
      const newTeam = await teamService.create({
        name,
        logo: logo || "/placeholder.svg?height=40&width=40",
        group,
      })

      if (!newTeam) {
        throw new Error("Error al crear el equipo")
      }

      // Si se proporcionó información del capitán, crear su cuenta
      if (captainEmail && captainFirstName && captainLastName) {
        const captainUser = await userService.createCaptainUser(
          captainEmail,
          captainFirstName,
          captainLastName,
          newTeam.id,
        )

        if (captainUser) {
          toast({
            title: "Capitán creado",
            description: `Se ha creado la cuenta para ${captainFirstName} ${captainLastName} con la contraseña: ${captainUser.password}`,
          })
        } else {
          toast({
            title: "Advertencia",
            description: "El equipo se creó correctamente, pero hubo un problema al crear la cuenta del capitán.",
            variant: "default",
          })
        }
      }

      toast({
        title: "Equipo creado",
        description: "El equipo ha sido creado exitosamente.",
      })

      router.push("/admin/teams")
    } catch (error: any) {
      console.error("Error creating team:", error)
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al crear el equipo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <BackButton href="/admin/teams" />
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
                <Label htmlFor="name">Nombre del Equipo *</Label>
                <Input
                  id="name"
                  placeholder="Ingresa el nombre del equipo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="group">Grupo *</Label>
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

          <Card>
            <CardHeader>
              <CardTitle>Capitán del Equipo</CardTitle>
              <CardDescription>Asigna un capitán para este equipo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="captainEmail">Email del Capitán *</Label>
                <Input
                  id="captainEmail"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={captainEmail}
                  onChange={(e) => setCaptainEmail(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="captainFirstName">Nombre del Capitán *</Label>
                <Input
                  id="captainFirstName"
                  placeholder="Nombre"
                  value={captainFirstName}
                  onChange={(e) => setCaptainFirstName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="captainLastName">Apellido del Capitán *</Label>
                <Input
                  id="captainLastName"
                  placeholder="Apellido"
                  value={captainLastName}
                  onChange={(e) => setCaptainLastName(e.target.value)}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Se creará una cuenta para el capitán con una contraseña generada automáticamente.
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href="/admin/teams">Cancelar</Link>
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
                  Guardar Equipo
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
