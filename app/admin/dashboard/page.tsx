"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Trophy, Users, ImageIcon, Music, Calendar } from "lucide-react"
import { getAllTeams, getAllMatches, getAllEvents, getAllMedia } from "@/lib/data-service"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    teams: 0,
    matches: 0,
    events: 0,
    media: 0,
  })

  useEffect(() => {
    // Load stats
    const teams = getAllTeams()
    const matches = getAllMatches()
    const events = getAllEvents()
    const media = getAllMedia()

    setStats({
      teams: teams.length,
      matches: matches.length,
      events: events.length,
      media: media.length,
    })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your tournament admin dashboard</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Matches</CardTitle>
            <Trophy className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.matches}</div>
            <Button variant="link" className="p-0 h-auto" asChild>
              <Link href="/admin/matches">Manage Matches</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Teams</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.teams}</div>
            <Button variant="link" className="p-0 h-auto" asChild>
              <Link href="/admin/teams">Manage Teams</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Media Items</CardTitle>
            <ImageIcon className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.media}</div>
            <Button variant="link" className="p-0 h-auto" asChild>
              <Link href="/admin/media">Manage Media</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Events</CardTitle>
            <Music className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.events}</div>
            <Button variant="link" className="p-0 h-auto" asChild>
              <Link href="/admin/events">Manage Events</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common management tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start" asChild>
              <Link href="/admin/matches/new">
                <Trophy className="mr-2 h-4 w-4" />
                Add New Match
              </Link>
            </Button>
            <Button className="w-full justify-start" asChild>
              <Link href="/admin/teams/new">
                <Users className="mr-2 h-4 w-4" />
                Add New Team
              </Link>
            </Button>
            <Button className="w-full justify-start" asChild>
              <Link href="/admin/events/new">
                <Music className="mr-2 h-4 w-4" />
                Add New Event
              </Link>
            </Button>
            <Button className="w-full justify-start" asChild>
              <Link href="/admin/media/new">
                <ImageIcon className="mr-2 h-4 w-4" />
                Add New Media
              </Link>
            </Button>
            <Button className="w-full justify-start" asChild>
              <Link href="/admin/calendar">
                <Calendar className="mr-2 h-4 w-4" />
                Manage Calendar
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>Steps to set up your tournament</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <span className="text-sm font-bold text-primary">1</span>
                </div>
                <div>
                  <h3 className="font-medium">Create Teams</h3>
                  <p className="text-sm text-muted-foreground">
                    Start by creating the teams that will participate in the tournament. Each team should have a name,
                    logo, and group assignment.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <span className="text-sm font-bold text-primary">2</span>
                </div>
                <div>
                  <h3 className="font-medium">Add Players</h3>
                  <p className="text-sm text-muted-foreground">
                    Add players to each team. For this 8-a-side tournament, each team can have up to 8 starters and 7
                    substitutes.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <span className="text-sm font-bold text-primary">3</span>
                </div>
                <div>
                  <h3 className="font-medium">Schedule Matches</h3>
                  <p className="text-sm text-muted-foreground">
                    Create and schedule matches for the group stage and playoffs. Assign teams, dates, times, and
                    venues.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <span className="text-sm font-bold text-primary">4</span>
                </div>
                <div>
                  <h3 className="font-medium">Add Events & Media</h3>
                  <p className="text-sm text-muted-foreground">
                    Create events and upload media content to enhance the tournament experience for fans.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
