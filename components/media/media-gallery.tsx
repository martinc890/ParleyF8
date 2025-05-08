"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmptyState } from "@/components/ui/empty-state"
import { ImageIcon, Play } from "lucide-react"
import { getMedia } from "@/lib/mongodb-service"
import type { MediaModel } from "@/lib/models"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function MediaGallery() {
  const [activeTab, setActiveTab] = useState("all")
  const [matchdayFilter, setMatchdayFilter] = useState("all")
  const [media, setMedia] = useState<MediaModel[]>([])
  const [matchdays, setMatchdays] = useState<string[]>([])
  const [selectedMedia, setSelectedMedia] = useState<MediaModel | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadMedia = async () => {
      try {
        setIsLoading(true)
        const mediaItems = await getMedia()
        setMedia(mediaItems)

        // Extraer jornadas únicas
        const uniqueMatchdays = Array.from(new Set(mediaItems.map((item) => item.matchday)))
        setMatchdays(uniqueMatchdays)
      } catch (error) {
        console.error("Error loading media:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadMedia()
  }, [])

  const filteredMedia = media.filter((item) => {
    if (activeTab === "images" && item.type !== "image") return false
    if (activeTab === "videos" && item.type !== "video") return false
    if (matchdayFilter !== "all" && item.matchday !== matchdayFilter) return false
    return true
  })

  // Función para renderizar un video de YouTube
  const renderYouTubeVideo = (url: string) => {
    // Extraer el ID del video de YouTube
    let videoId = url

    // Si es una URL completa, extraer el ID
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const urlObj = new URL(url)
      if (url.includes("youtube.com")) {
        videoId = urlObj.searchParams.get("v") || ""
      } else if (url.includes("youtu.be")) {
        videoId = urlObj.pathname.substring(1)
      }
    }

    return (
      <iframe
        width="100%"
        height="450"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <CardTitle>Galería de Medios</CardTitle>
            <div className="flex items-center gap-2">
              <Select defaultValue="all" onValueChange={setMatchdayFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar por jornada" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Jornadas</SelectItem>
                  {matchdays.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">Todos</TabsTrigger>
              <TabsTrigger value="images">Imágenes</TabsTrigger>
              <TabsTrigger value="videos">Videos</TabsTrigger>
            </TabsList>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <p>Cargando medios...</p>
              </div>
            ) : filteredMedia.length === 0 ? (
              <EmptyState
                icon={ImageIcon}
                title="No hay medios disponibles"
                description="Las fotos y videos aparecerán aquí una vez que sean añadidos."
              />
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredMedia.map((item) => (
                  <div
                    key={item._id}
                    className="relative overflow-hidden rounded-lg cursor-pointer group"
                    onClick={() => setSelectedMedia(item)}
                  >
                    <div className="absolute inset-0 transition-opacity bg-black/30 group-hover:bg-black/50" />
                    <Image
                      src={
                        item.type === "video"
                          ? item.thumbnail || "/placeholder.svg?height=300&width=500"
                          : item.url || "/placeholder.svg?height=300&width=500"
                      }
                      width={500}
                      height={300}
                      alt={item.title}
                      className="object-cover w-full aspect-video"
                    />
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full">
                          <Play className="w-6 h-6 text-primary fill-primary" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
                      <div className="text-xs opacity-80">{new Date(item.date).toLocaleDateString()}</div>
                      <div className="text-sm font-medium line-clamp-1">{item.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>

      {/* Modal para ver media */}
      <Dialog open={!!selectedMedia} onOpenChange={(open) => !open && setSelectedMedia(null)}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{selectedMedia?.title}</DialogTitle>
            <DialogDescription>
              {new Date(selectedMedia?.date || "").toLocaleDateString()} • {selectedMedia?.matchday}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {selectedMedia?.type === "image" ? (
              <Image
                src={selectedMedia.url || "/placeholder.svg?height=450&width=800"}
                width={800}
                height={450}
                alt={selectedMedia.title}
                className="object-cover w-full rounded-lg aspect-video"
              />
            ) : (
              <div className="rounded-lg overflow-hidden">{renderYouTubeVideo(selectedMedia?.url || "")}</div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
