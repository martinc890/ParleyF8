"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Trophy, Users, ImageIcon, Music, Calendar } from "lucide-react"
import { getAllTeams, getAllMatches, getAllEvents, getAllMedia } from "@/lib/data-service"
import DashboardLayout from "@/app/dashboard-layout"

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
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Bienvenido a tu panel de administración del torneo</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Partidos</CardTitle>
              <Trophy className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.matches}</div>
              <Button variant="link" className="p-0 h-auto" asChild>
                <Link href="/admin/matches">Gestionar Partidos</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Total Equipos</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.teams}</div>
              <Button variant="link" className="p-0 h-auto" asChild>
                <Link href="/admin/teams">Gestionar Equipos</Link>
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
                <Link href="/admin/media">Gestionar Media</Link>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">Eventos</CardTitle>
              <Music className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.events}</div>
              <Button variant="link" className="p-0 h-auto" asChild>
                <Link href="/admin/events">Gestionar Eventos</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Tareas comunes de gestión</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start bg-black text-white hover:bg-gray-800" asChild>
                <Link href="/admin/matches/new">
                  <Trophy className="mr-2 h-4 w-4" />
                  Añadir Nuevo Partido
                </Link>
              </Button>
              <Button className="w-full justify-start bg-black text-white hover:bg-gray-800" asChild>
                <Link href="/admin/teams/new">
                  <Users className="mr-2 h-4 w-4" />
                  Añadir Nuevo Equipo
                </Link>
              </Button>
              <Button className="w-full justify-start bg-black text-white hover:bg-gray-800" asChild>
                <Link href="/admin/events/new">
                  <Music className="mr-2 h-4 w-4" />
                  Añadir Nuevo Evento
                </Link>
              </Button>
              <Button className="w-full justify-start bg-black text-white hover:bg-gray-800" asChild>
                <Link href="/admin/media/new">
                  <ImageIcon className="mr-2 h-4 w-4" />
                  Añadir Nuevo Media
                </Link>
              </Button>
              <Button className="w-full justify-start bg-black text-white hover:bg-gray-800" asChild>
                <Link href="/admin/calendar">
                  <Calendar className="mr-2 h-4 w-4" />
                  Gestionar Calendario
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Primeros Pasos</CardTitle>
              <CardDescription>Pasos para configurar tu torneo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Crear Equipos</h3>
                    <p className="text-sm text-muted-foreground">
                      Comienza creando los equipos que participarán en el torneo. Cada equipo debe tener un nombre, logo
                      y asignación de grupo.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Añadir Jugadores</h3>
                    <p className="text-sm text-muted-foreground">
                      Añade jugadores a cada equipo. Para este torneo de 8 jugadores, cada equipo puede tener hasta 8
                      titulares y 7 suplentes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Programar Partidos</h3>
                    <p className="text-sm text-muted-foreground">
                      Crea y programa partidos para la fase de grupos y playoffs. Asigna equipos, fechas, horarios y
                      sedes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white">
                    <span className="text-sm font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="font-medium">Añadir Eventos y Media</h3>
                    <p className="text-sm text-muted-foreground">
                      Crea eventos y sube contenido multimedia para mejorar la experiencia del torneo para los
                      aficionados.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
