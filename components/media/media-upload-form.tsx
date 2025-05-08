"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { createMedia } from "@/lib/mongodb-service"
import type { MediaModel } from "@/lib/models"

interface MediaUploadFormProps {
  matchId?: string
  onSuccess?: () => void
}

export default function MediaUploadForm({ matchId, onSuccess }: MediaUploadFormProps) {
  const [activeTab, setActiveTab] = useState("image")
  const [title, setTitle] = useState("")
  const [date, setDate] = useState("")
  const [matchday, setMatchday] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [videoThumbnail, setVideoThumbnail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()

  const handleSubmitImage = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)

      const mediaItem: MediaModel = {
        type: "image",
        url: imageUrl,
        title,
        date,
        matchId,
        matchday,
      }

      await createMedia(mediaItem)

      toast({
        title: "Imagen subida",
        description: "La imagen ha sido subida correctamente",
      })

      // Limpiar formulario
      setTitle("")
      setImageUrl("")

      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al subir la imagen",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitVideo = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setIsSubmitting(true)

      const mediaItem: MediaModel = {
        type: "video",
        url: videoUrl,
        thumbnail: videoThumbnail,
        title,
        date,
        matchId,
        matchday,
      }

      await createMedia(mediaItem)

      toast({
        title: "Video subido",
        description: "El video ha sido subido correctamente",
      })

      // Limpiar formulario
      setTitle("")
      setVideoUrl("")
      setVideoThumbnail("")

      if (onSuccess) onSuccess()
    } catch (error) {
      console.error("Error uploading video:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al subir el video",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subir Media</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="image" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="image">Imagen</TabsTrigger>
            <TabsTrigger value="video">Video</TabsTrigger>
          </TabsList>

          <TabsContent value="image">
            <form onSubmit={handleSubmitImage} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-title">Título</Label>
                <Input
                  id="image-title"
                  placeholder="Título de la imagen"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="image-date">Fecha</Label>
                  <Input id="image-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image-matchday">Jornada</Label>
                  <Input
                    id="image-matchday"
                    placeholder="Ej: Jornada 1, Final, etc."
                    value={matchday}
                    onChange={(e) => setMatchday(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image-url">URL de la Imagen</Label>
                <Input
                  id="image-url"
                  placeholder="https://ejemplo.com/imagen.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Ingresa la URL de la imagen. Puedes usar servicios como Imgur o Cloudinary para alojar tus imágenes.
                </p>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Subiendo..." : "Subir Imagen"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="video">
            <form onSubmit={handleSubmitVideo} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="video-title">Título</Label>
                <Input
                  id="video-title"
                  placeholder="Título del video"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="video-date">Fecha</Label>
                  <Input id="video-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="video-matchday">Jornada</Label>
                  <Input
                    id="video-matchday"
                    placeholder="Ej: Jornada 1, Final, etc."
                    value={matchday}
                    onChange={(e) => setMatchday(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="video-url">URL del Video</Label>
                <Input
                  id="video-url"
                  placeholder="https://ejemplo.com/video.mp4 o ID de YouTube"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Puedes ingresar una URL directa al video o un ID de YouTube.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="video-thumbnail">URL de la Miniatura (Thumbnail)</Label>
                <Input
                  id="video-thumbnail"
                  placeholder="https://ejemplo.com/thumbnail.jpg"
                  value={videoThumbnail}
                  onChange={(e) => setVideoThumbnail(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">Ingresa la URL de la imagen de miniatura para el video.</p>
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Subiendo..." : "Subir Video"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
