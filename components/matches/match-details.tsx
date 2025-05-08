"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  User,
  Goal,
  AlertTriangle,
  Share2,
  Play,
} from "lucide-react"

// Mock data for a specific match
const matchData = {
  id: 1,
  date: "June 10, 2023",
  time: "18:00",
  homeTeam: {
    id: 1,
    name: "Team Alpha",
    logo: "/placeholder.svg?height=80&width=80",
    score: 2,
    players: [
      { id: 1, name: "John Doe", number: 1, position: "GK" },
      { id: 2, name: "James Smith", number: 2, position: "DF" },
      { id: 3, name: "Robert Johnson", number: 4, position: "DF" },
      { id: 4, name: "Michael Williams", number: 5, position: "DF" },
      { id: 5, name: "David Brown", number: 3, position: "DF" },
      { id: 6, name: "Richard Jones", number: 6, position: "MF" },
      { id: 7, name: "Joseph Davis", number: 8, position: "MF" },
      { id: 8, name: "Thomas Miller", number: 10, position: "MF" },
      { id: 9, name: "Charles Wilson", number: 7, position: "FW" },
      { id: 10, name: "Daniel Moore", number: 9, position: "FW" },
      { id: 11, name: "Matthew Taylor", number: 11, position: "FW" },
    ],
    substitutes: [
      { id: 12, name: "Anthony Anderson", number: 12, position: "GK" },
      { id: 13, name: "Steven Thomas", number: 13, position: "DF" },
      { id: 14, name: "Mark Jackson", number: 14, position: "MF" },
      { id: 15, name: "Paul White", number: 15, position: "FW" },
    ],
  },
  awayTeam: {
    id: 2,
    name: "Team Beta",
    logo: "/placeholder.svg?height=80&width=80",
    score: 1,
    players: [
      { id: 16, name: "Kevin Harris", number: 1, position: "GK" },
      { id: 17, name: "Brian Martin", number: 2, position: "DF" },
      { id: 18, name: "George Thompson", number: 4, position: "DF" },
      { id: 19, name: "Edward Garcia", number: 5, position: "DF" },
      { id: 20, name: "Ronald Martinez", number: 3, position: "DF" },
      { id: 21, name: "Anthony Robinson", number: 6, position: "MF" },
      { id: 22, name: "Donald Clark", number: 8, position: "MF" },
      { id: 23, name: "Steven Rodriguez", number: 10, position: "MF" },
      { id: 24, name: "Charles Lewis", number: 7, position: "FW" },
      { id: 25, name: "Kenneth Lee", number: 9, position: "FW" },
      { id: 26, name: "Jason Walker", number: 11, position: "FW" },
    ],
    substitutes: [
      { id: 27, name: "Jeffrey Hall", number: 12, position: "GK" },
      { id: 28, name: "Ryan Allen", number: 13, position: "DF" },
      { id: 29, name: "Jacob Young", number: 14, position: "MF" },
      { id: 30, name: "Gary King", number: 15, position: "FW" },
    ],
  },
  group: "A",
  stadium: "Main Stadium",
  phase: "group",
  status: "completed",
  events: [
    { id: 1, type: "goal", team: "home", player: "Daniel Moore", minute: 23, assist: "Thomas Miller" },
    { id: 2, type: "goal", team: "away", player: "Kenneth Lee", minute: 41, assist: "Steven Rodriguez" },
    { id: 3, type: "yellow", team: "away", player: "Brian Martin", minute: 56 },
    { id: 4, type: "goal", team: "home", player: "Charles Wilson", minute: 67, assist: "Joseph Davis" },
    { id: 5, type: "red", team: "away", player: "Anthony Robinson", minute: 78 },
  ],
  stats: {
    possession: { home: 58, away: 42 },
    shots: { home: 14, away: 9 },
    shotsOnTarget: { home: 6, away: 3 },
    corners: { home: 7, away: 4 },
    fouls: { home: 10, away: 14 },
    yellowCards: { home: 1, away: 2 },
    redCards: { home: 0, away: 1 },
  },
  media: [
    { id: 1, type: "image", url: "/placeholder.svg?height=300&width=500", caption: "Match action shot" },
    { id: 2, type: "image", url: "/placeholder.svg?height=300&width=500", caption: "Goal celebration" },
    { id: 3, type: "image", url: "/placeholder.svg?height=300&width=500", caption: "Team huddle" },
    { id: 4, type: "video", thumbnail: "/placeholder.svg?height=300&width=500", caption: "Match highlights" },
  ],
}

export default function MatchDetails({ matchId }: { matchId: string }) {
  const [activeTab, setActiveTab] = useState("lineups")
  const [selectedMedia, setSelectedMedia] = useState<null | (typeof matchData.media)[0]>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/matches">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Match Details</h1>
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="p-4 border-b bg-muted/30">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {matchData.date}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {matchData.time}
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {matchData.stadium}
                </Badge>
                {matchData.group && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Group {matchData.group}
                  </Badge>
                )}
                {matchData.phase === "quarter" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    Quarter Final
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" className="gap-1">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex flex-col items-center text-center">
                <Image
                  src={matchData.homeTeam.logo || "/placeholder.svg"}
                  width={80}
                  height={80}
                  alt={matchData.homeTeam.name}
                  className="team-logo"
                />
                <h2 className="mt-2 text-xl font-bold">{matchData.homeTeam.name}</h2>
              </div>

              <div className="flex items-center gap-4 px-6 py-3 text-4xl font-bold bg-muted rounded-xl">
                <span>{matchData.homeTeam.score}</span>
                <span className="text-muted-foreground">-</span>
                <span>{matchData.awayTeam.score}</span>
              </div>

              <div className="flex flex-col items-center text-center">
                <Image
                  src={matchData.awayTeam.logo || "/placeholder.svg"}
                  width={80}
                  height={80}
                  alt={matchData.awayTeam.name}
                  className="team-logo"
                />
                <h2 className="mt-2 text-xl font-bold">{matchData.awayTeam.name}</h2>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="lineups" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="lineups">Lineups</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>

        <TabsContent value="lineups" className="mt-6">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-xl font-semibold">{matchData.homeTeam.name}</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="mb-2 text-sm font-medium text-muted-foreground">Starting XI</h4>
                  <div className="space-y-2">
                    {matchData.homeTeam.players.map((player) => (
                      <div key={player.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                        <div className="flex items-center justify-center w-8 h-8 text-xs font-medium bg-primary/10 text-primary rounded-full">
                          {player.number}
                        </div>
                        <div>
                          <div className="font-medium">{player.name}</div>
                          <div className="text-xs text-muted-foreground">{player.position}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium text-muted-foreground">Substitutes</h4>
                  <div className="space-y-2">
                    {matchData.homeTeam.substitutes.map((player) => (
                      <div key={player.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                        <div className="flex items-center justify-center w-8 h-8 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                          {player.number}
                        </div>
                        <div>
                          <div className="font-medium">{player.name}</div>
                          <div className="text-xs text-muted-foreground">{player.position}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-xl font-semibold">{matchData.awayTeam.name}</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="mb-2 text-sm font-medium text-muted-foreground">Starting XI</h4>
                  <div className="space-y-2">
                    {matchData.awayTeam.players.map((player) => (
                      <div key={player.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                        <div className="flex items-center justify-center w-8 h-8 text-xs font-medium bg-primary/10 text-primary rounded-full">
                          {player.number}
                        </div>
                        <div>
                          <div className="font-medium">{player.name}</div>
                          <div className="text-xs text-muted-foreground">{player.position}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-2 text-sm font-medium text-muted-foreground">Substitutes</h4>
                  <div className="space-y-2">
                    {matchData.awayTeam.substitutes.map((player) => (
                      <div key={player.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted">
                        <div className="flex items-center justify-center w-8 h-8 text-xs font-medium bg-muted text-muted-foreground rounded-full">
                          {player.number}
                        </div>
                        <div>
                          <div className="font-medium">{player.name}</div>
                          <div className="text-xs text-muted-foreground">{player.position}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <div className="relative pl-8 border-l-2 border-dashed border-muted-foreground/30">
            {matchData.events.map((event) => (
              <div key={event.id} className="relative mb-8">
                <div className="absolute -left-[41px] flex items-center justify-center w-10 h-10 rounded-full bg-background border-2 border-muted">
                  {event.type === "goal" && <Goal className="w-5 h-5 text-primary" />}
                  {event.type === "yellow" && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                  {event.type === "red" && <AlertTriangle className="w-5 h-5 text-red-500" />}
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline">{event.minute}'</Badge>
                  <span className="font-medium">
                    {event.team === "home" ? matchData.homeTeam.name : matchData.awayTeam.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span>{event.player}</span>
                  {event.assist && (
                    <>
                      <span className="text-sm text-muted-foreground">Assist:</span>
                      <span>{event.assist}</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{matchData.stats.possession.home}%</span>
                    <span className="font-medium">Possession</span>
                    <span>{matchData.stats.possession.away}%</span>
                  </div>
                  <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                    <div className="bg-primary" style={{ width: `${matchData.stats.possession.home}%` }} />
                    <div className="bg-primary/50" style={{ width: `${matchData.stats.possession.away}%` }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{matchData.stats.shots.home}</span>
                    <span className="font-medium">Shots</span>
                    <span>{matchData.stats.shots.away}</span>
                  </div>
                  <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="bg-primary"
                      style={{
                        width: `${(matchData.stats.shots.home / (matchData.stats.shots.home + matchData.stats.shots.away)) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-primary/50"
                      style={{
                        width: `${(matchData.stats.shots.away / (matchData.stats.shots.home + matchData.stats.shots.away)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{matchData.stats.shotsOnTarget.home}</span>
                    <span className="font-medium">Shots on Target</span>
                    <span>{matchData.stats.shotsOnTarget.away}</span>
                  </div>
                  <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="bg-primary"
                      style={{
                        width: `${(matchData.stats.shotsOnTarget.home / (matchData.stats.shotsOnTarget.home + matchData.stats.shotsOnTarget.away)) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-primary/50"
                      style={{
                        width: `${(matchData.stats.shotsOnTarget.away / (matchData.stats.shotsOnTarget.home + matchData.stats.shotsOnTarget.away)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{matchData.stats.corners.home}</span>
                    <span className="font-medium">Corners</span>
                    <span>{matchData.stats.corners.away}</span>
                  </div>
                  <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="bg-primary"
                      style={{
                        width: `${(matchData.stats.corners.home / (matchData.stats.corners.home + matchData.stats.corners.away)) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-primary/50"
                      style={{
                        width: `${(matchData.stats.corners.away / (matchData.stats.corners.home + matchData.stats.corners.away)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{matchData.stats.fouls.home}</span>
                    <span className="font-medium">Fouls</span>
                    <span>{matchData.stats.fouls.away}</span>
                  </div>
                  <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="bg-primary"
                      style={{
                        width: `${(matchData.stats.fouls.home / (matchData.stats.fouls.home + matchData.stats.fouls.away)) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-primary/50"
                      style={{
                        width: `${(matchData.stats.fouls.away / (matchData.stats.fouls.home + matchData.stats.fouls.away)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{matchData.stats.yellowCards.home}</span>
                    <span className="font-medium">Yellow Cards</span>
                    <span>{matchData.stats.yellowCards.away}</span>
                  </div>
                  <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="bg-yellow-500"
                      style={{
                        width: `${(matchData.stats.yellowCards.home / (matchData.stats.yellowCards.home + matchData.stats.yellowCards.away || 1)) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-yellow-500/50"
                      style={{
                        width: `${(matchData.stats.yellowCards.away / (matchData.stats.yellowCards.home + matchData.stats.yellowCards.away || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>{matchData.stats.redCards.home}</span>
                    <span className="font-medium">Red Cards</span>
                    <span>{matchData.stats.redCards.away}</span>
                  </div>
                  <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="bg-red-500"
                      style={{
                        width: `${(matchData.stats.redCards.home / (matchData.stats.redCards.home + matchData.stats.redCards.away || 1)) * 100}%`,
                      }}
                    />
                    <div
                      className="bg-red-500/50"
                      style={{
                        width: `${(matchData.stats.redCards.away / (matchData.stats.redCards.home + matchData.stats.redCards.away || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="mt-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {matchData.media.map((item) => (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-lg cursor-pointer group"
                onClick={() => setSelectedMedia(item)}
              >
                <div className="absolute inset-0 transition-opacity bg-black/30 group-hover:bg-black/50" />
                <Image
                  src={item.type === "video" ? item.thumbnail : item.url}
                  width={500}
                  height={300}
                  alt={item.caption}
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
                  <div className="text-sm font-medium line-clamp-1">{item.caption}</div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
