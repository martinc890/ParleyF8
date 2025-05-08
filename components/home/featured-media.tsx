"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight, Play } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Mock data
const mediaItems = [
  {
    id: 1,
    type: "image",
    thumbnail: "/placeholder.svg?height=200&width=300",
    title: "Opening Ceremony Highlights",
    date: "June 1, 2023",
  },
  {
    id: 2,
    type: "video",
    thumbnail: "/placeholder.svg?height=200&width=300",
    title: "Team Alpha vs Team Beta - Match Highlights",
    date: "June 5, 2023",
  },
  {
    id: 3,
    type: "image",
    thumbnail: "/placeholder.svg?height=200&width=300",
    title: "Team Gamma Training Session",
    date: "June 7, 2023",
  },
  {
    id: 4,
    type: "video",
    thumbnail: "/placeholder.svg?height=200&width=300",
    title: "Team Epsilon vs Team Zeta - Goals Compilation",
    date: "June 8, 2023",
  },
]

export default function FeaturedMedia() {
  const [selectedMedia, setSelectedMedia] = useState<null | (typeof mediaItems)[0]>(null)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Media Gallery</CardTitle>
          <Button variant="ghost" size="sm" className="gap-1" asChild>
            <Link href="/media">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-lg cursor-pointer group"
              onClick={() => setSelectedMedia(item)}
            >
              <div className="absolute inset-0 transition-opacity bg-black/30 group-hover:bg-black/50" />
              <Image
                src={item.thumbnail || "/placeholder.svg"}
                width={300}
                height={200}
                alt={item.title}
                className="object-cover w-full aspect-video"
              />
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex items-center justify-center w-10 h-10 bg-white rounded-full">
                    <Play className="w-5 h-5 text-primary fill-primary" />
                  </div>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
                <div className="text-xs opacity-80">{item.date}</div>
                <div className="text-sm font-medium line-clamp-1">{item.title}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <Dialog open={!!selectedMedia} onOpenChange={(open) => !open && setSelectedMedia(null)}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{selectedMedia?.title}</DialogTitle>
            <DialogDescription>{selectedMedia?.date}</DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {selectedMedia?.type === "image" ? (
              <Image
                src={selectedMedia.thumbnail || "/placeholder.svg"}
                width={800}
                height={450}
                alt={selectedMedia.title}
                className="object-cover w-full rounded-lg aspect-video"
              />
            ) : (
              <div className="relative bg-black rounded-lg aspect-video">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Play className="w-16 h-16 text-white opacity-70" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-white">Video would play here</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
