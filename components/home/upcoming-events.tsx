import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Calendar, MapPin, Music } from "lucide-react"

// Mock data
const events = [
  {
    id: 1,
    title: "Opening Party",
    date: "June 1, 2023",
    time: "20:00",
    location: "City Club",
    type: "party",
    description: "Join us for the tournament opening celebration with live music and special guests.",
  },
  {
    id: 2,
    title: "Fan Zone Opening",
    date: "June 5, 2023",
    time: "16:00",
    location: "Main Square",
    type: "fan",
    description: "The official fan zone opens with activities, games, and food stalls for all supporters.",
  },
  {
    id: 3,
    title: "Mid-Tournament Concert",
    date: "June 15, 2023",
    time: "21:00",
    location: "City Arena",
    type: "concert",
    description: "Special concert featuring local bands and international artists to celebrate the tournament.",
  },
]

export default function UpcomingEvents() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Upcoming Events</CardTitle>
          <Button variant="ghost" size="sm" className="gap-1" asChild>
            <Link href="/events">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <div className="p-4 transition-colors border rounded-lg hover:bg-muted">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{event.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {event.date} • {event.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{event.description}</p>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Music className="w-3 h-3" />
                    {event.type === "party" && "Party"}
                    {event.type === "fan" && "Fan Event"}
                    {event.type === "concert" && "Concert"}
                  </Badge>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
