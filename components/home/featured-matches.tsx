"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight } from "lucide-react"

// Mock data
const upcomingMatches = [
  {
    id: 1,
    date: "June 10, 2023 • 18:00",
    homeTeam: { id: 1, name: "Team Alpha", logo: "/placeholder.svg?height=40&width=40" },
    awayTeam: { id: 2, name: "Team Beta", logo: "/placeholder.svg?height=40&width=40" },
    group: "A",
    stadium: "Main Stadium",
  },
  {
    id: 2,
    date: "June 12, 2023 • 20:00",
    homeTeam: { id: 3, name: "Team Gamma", logo: "/placeholder.svg?height=40&width=40" },
    awayTeam: { id: 4, name: "Team Delta", logo: "/placeholder.svg?height=40&width=40" },
    group: "B",
    stadium: "City Arena",
  },
]

const recentMatches = [
  {
    id: 3,
    date: "June 5, 2023 • 18:00",
    homeTeam: { id: 5, name: "Team Epsilon", logo: "/placeholder.svg?height=40&width=40", score: 2 },
    awayTeam: { id: 6, name: "Team Zeta", logo: "/placeholder.svg?height=40&width=40", score: 1 },
    group: "A",
    stadium: "Main Stadium",
  },
  {
    id: 4,
    date: "June 3, 2023 • 20:00",
    homeTeam: { id: 7, name: "Team Eta", logo: "/placeholder.svg?height=40&width=40", score: 0 },
    awayTeam: { id: 8, name: "Team Theta", logo: "/placeholder.svg?height=40&width=40", score: 0 },
    group: "B",
    stadium: "City Arena",
  },
]

export default function FeaturedMatches() {
  const [activeTab, setActiveTab] = useState("upcoming")

  return (
    <Card className="match-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Matches</CardTitle>
          <Button variant="ghost" size="sm" className="gap-1" asChild>
            <Link href="/matches">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingMatches.map((match) => (
              <Link key={match.id} href={`/matches/${match.id}`}>
                <div className="p-4 transition-colors rounded-lg hover:bg-muted">
                  <div className="text-xs text-muted-foreground mb-2">
                    {match.date} • Group {match.group} • {match.stadium}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image
                        src={match.homeTeam.logo || "/placeholder.svg"}
                        width={40}
                        height={40}
                        alt={match.homeTeam.name}
                        className="team-logo"
                      />
                      <span className="font-medium">{match.homeTeam.name}</span>
                    </div>
                    <div className="text-sm font-bold">VS</div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{match.awayTeam.name}</span>
                      <Image
                        src={match.awayTeam.logo || "/placeholder.svg"}
                        width={40}
                        height={40}
                        alt={match.awayTeam.name}
                        className="team-logo"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </TabsContent>
          <TabsContent value="recent" className="space-y-4">
            {recentMatches.map((match) => (
              <Link key={match.id} href={`/matches/${match.id}`}>
                <div className="p-4 transition-colors rounded-lg hover:bg-muted">
                  <div className="text-xs text-muted-foreground mb-2">
                    {match.date} • Group {match.group} • {match.stadium}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image
                        src={match.homeTeam.logo || "/placeholder.svg"}
                        width={40}
                        height={40}
                        alt={match.homeTeam.name}
                        className="team-logo"
                      />
                      <span className="font-medium">{match.homeTeam.name}</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 text-lg font-bold bg-muted rounded-md">
                      <span>{match.homeTeam.score}</span>
                      <span>-</span>
                      <span>{match.awayTeam.score}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{match.awayTeam.name}</span>
                      <Image
                        src={match.awayTeam.logo || "/placeholder.svg"}
                        width={40}
                        height={40}
                        alt={match.awayTeam.name}
                        className="team-logo"
                      />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
