"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, Mail, Trophy, User } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { getAllPlayers, getAllMatches, getTeamById } from "@/lib/data-service"
import type { Team, Player, Match } from "@/lib/types"
import DashboardLayout from "@/app/dashboard-layout"

export default function CaptainDashboard() {
  const { user } = useAuth()
  const [team, setTeam] = useState<Team | null>(null)
  const [players, setPlayers] = useState<Player[]>([])
  const [upcomingMatches, setUpcomingMatches] = useState<Match[]>([])

  useEffect(() => {
    if (user?.teamId) {
      // En una implementación real, estas serían llamadas a la API
      const teamData = getTeamById(user.teamId)
      if (teamData) {
        setTeam(teamData)
      }

      const allPlayers = getAllPlayers()
      setPlayers(allPlayers.filter((player) => player.teamId === user.teamId))

      const allMatches = getAllMatches()
      setUpcomingMatches(
        allMatches
          .filter(
            (match) =>
              match.status === "upcoming" && (match.homeTeamId === user.teamId || match.awayTeamId === user.teamId),
          )
          .slice(0, 3),
      )
    }
  }, [user])

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard de Capitán</h1>
            <p className="text-muted-foreground">Bienvenido, {user.name}</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link href="/captain/team" className="block">
            <Card className="h-full transition-all hover:bg-gray-100 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Jugadores</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{players.length}</div>
                <p className="text-xs text-muted-foreground">Haz clic para gestionar tu equipo</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/captain/invitations" className="block">
            <Card className="h-full transition-all hover:bg-gray-100 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Invitaciones</CardTitle>
                <Mail className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">Haz clic para gestionar invitaciones</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/matches" className="block">
            <Card className="h-full transition-all hover:bg-gray-100 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Próximos Partidos</CardTitle>
                <Trophy className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingMatches.length}</div>
                <p className="text-xs text-muted-foreground">Haz clic para ver el calendario</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/player/card" className="block">
            <Card className="h-full transition-all hover:bg-gray-100 cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Mi Carnet</CardTitle>
                <User className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Activo</div>
                <p className="text-xs text-muted-foreground">Haz clic para ver tu carnet</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Próximos Partidos</CardTitle>
            <CardDescription>Calendario de partidos de tu equipo</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingMatches.length > 0 ? (
              <div className="space-y-4">
                {upcomingMatches.map((match) => (
                  <div key={match.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">
                        {match.homeTeamId === user.teamId ? "Local vs " : "Visitante vs "}
                        {match.homeTeamId === user.teamId ? match.awayTeamId : match.homeTeamId}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {match.date} - {match.time} - {match.venue}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/matches/${match.id}`}>Detalles</Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">No hay partidos programados</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
