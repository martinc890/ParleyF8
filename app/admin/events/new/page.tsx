"use client"

import type React from "react"

import { useState } from "react"
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
import { addEvent } from "@/lib/data-service"
import { useToast } from "@/components/ui/use-toast"

export default function NewEvent() {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [location, setLocation] = useState("")
  const [address, setAddress] = useState("")
  const [type, setType] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("/placeholder.svg?height=300&width=500")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create new event
      const newEvent = {
        id: Date.now().toString(),
        title,
        date,
        time,
        location,
        address,
        type,
        description,
        image: image || "/placeholder.svg?height=300&width=500",
      }

      addEvent(newEvent)

      toast({
        title: "Evento creado",
        description: "El evento ha sido creado exitosamente.",
      })

      router.push("/admin/events")
    } catch (error) {
      console.error("Error creating event:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al crear el evento.",
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
          <Link href="/admin/events">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Agregar Nuevo Evento</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalles del Evento</CardTitle>
              <CardDescription>Ingresa la información básica del evento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título del Evento</Label>
                <Input
                  id="title"
                  placeholder="Ingresa el título del evento"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

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
                  <Label htmlFor="type">Tipo de Evento</Label>
                  <Select value={type} onValueChange={setType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="party">Fiesta</SelectItem>
                      <SelectItem value="fan">Evento para Fans</SelectItem>
                      <SelectItem value="concert">Concierto</SelectItem>
                      <SelectItem value="ceremony">Ceremonia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Lugar
                  </Label>
                  <Input
                    id="location"
                    placeholder="Nombre del lugar"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    placeholder="Dirección completa"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Ingresa una descripción detallada del evento"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">URL de la Imagen (opcional)</Label>
                <Input
                  id="image"
                  placeholder="Ingresa la URL de la imagen"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Ingresa una URL para la imagen del evento. Deja el valor predeterminado para usar una imagen genérica.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
            <Button variant="outline" asChild>
              <Link href="/admin/events">Cancelar</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              <Save className="w-4 h-4 mr-2" />
              {isSubmitting ? "Guardando..." : "Guardar Evento"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
