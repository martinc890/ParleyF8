"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Music, Trophy, Users, Clock, ExternalLink } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { EmptyState } from "@/components/ui/empty-state"
import { getAllEvents } from "@/lib/data-service"

export default function EventsList() {
  const [activeTab, setActiveTab] = useState("all")
  const [events, setEvents] = useState<any[]>([])
  const [selectedEvent, setSelectedEvent] = useState<null | any>(null)

  useEffect(() => {
    // Load events data
    const eventItems = getAllEvents()
    setEvents(eventItems)
  }, [])

  const filteredEvents = events.filter((event) => {
    if (activeTab === "parties" && event.type !== "party") return false
    if (activeTab === "fan" && event.type !== "fan") return false
    if (activeTab === "other" && !["concert", "ceremony"].includes(event.type)) return false
    return true
  })

  // Group events by month
  const eventsByMonth = filteredEvents.reduce(
    (acc, event) => {
      const month = new Date(event.date).toLocaleString("default", { month: "long" })
      if (!acc[month]) {
        acc[month] = []
      }
      acc[month].push(event)
      return acc
    },
    {} as Record<string, any[]>,
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Events</TabsTrigger>
              <TabsTrigger value="parties">Parties</TabsTrigger>
              <TabsTrigger value="fan">Fan Events</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>

            {filteredEvents.length === 0 ? (
              <EmptyState
                icon={Music}
                title="No events scheduled"
                description="Events will appear here once they are added to the calendar."
              />
            ) : (
              <div className="space-y-8">
                {Object.entries(eventsByMonth).map(([month, monthEvents]) => (
                  <div key={month} className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      <h2 className="text-xl font-semibold">{month}</h2>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      {monthEvents.map((event) => (
                        <div
                          key={event.id}
                          className="p-4 transition-colors border rounded-lg cursor-pointer hover:bg-muted"
                          onClick={() => setSelectedEvent(event)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-medium">{event.title}</h3>
                              <div className="flex flex-wrap gap-2 mt-2">
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Calendar className="w-4 h-4" />
                                  <span>{event.date}</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <Clock className="w-4 h-4" />
                                  <span>{event.time}</span>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                  <MapPin className="w-4 h-4" />
                                  <span>{event.location}</span>
                                </div>
                              </div>
                              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                            </div>
                            <Badge variant="outline" className="flex items-center gap-1">
                              {event.type === "party" && <Music className="w-3 h-3" />}
                              {event.type === "fan" && <Users className="w-3 h-3" />}
                              {event.type === "concert" && <Music className="w-3 h-3" />}
                              {event.type === "ceremony" && <Trophy className="w-3 h-3" />}
                              {event.type === "party" && "Party"}
                              {event.type === "fan" && "Fan Event"}
                              {event.type === "concert" && "Concert"}
                              {event.type === "ceremony" && "Ceremony"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.title}</DialogTitle>
            <DialogDescription>
              {selectedEvent?.date} • {selectedEvent?.time}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="overflow-hidden rounded-lg aspect-video">
              <img
                src={selectedEvent?.image || "/placeholder.svg"}
                alt={selectedEvent?.title || "Event"}
                className="object-cover w-full h-full"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>
                  {selectedEvent?.location} - {selectedEvent?.address}
                </span>
              </div>

              <Badge variant="outline" className="flex items-center gap-1 w-fit">
                {selectedEvent?.type === "party" && <Music className="w-3 h-3" />}
                {selectedEvent?.type === "fan" && <Users className="w-3 h-3" />}
                {selectedEvent?.type === "concert" && <Music className="w-3 h-3" />}
                {selectedEvent?.type === "ceremony" && <Trophy className="w-3 h-3" />}
                {selectedEvent?.type === "party" && "Party"}
                {selectedEvent?.type === "fan" && "Fan Event"}
                {selectedEvent?.type === "concert" && "Concert"}
                {selectedEvent?.type === "ceremony" && "Ceremony"}
              </Badge>

              <div className="pt-2">
                <h4 className="text-sm font-medium">Description</h4>
                <p className="mt-1 text-sm text-muted-foreground">{selectedEvent?.description}</p>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`https://maps.google.com/?q=${selectedEvent?.address}`} target="_blank">
                    <MapPin className="w-4 h-4 mr-2" />
                    Directions
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href={`/events/${selectedEvent?.id}`}>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Event Page
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
