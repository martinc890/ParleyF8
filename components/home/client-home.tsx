"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import PublicLayout from "@/components/layouts/public-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Users, ImageIcon, ClubIcon as Football } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { getUpcomingMatches, getTeamById } from "@/lib/data-service"
import SyncGuide from "@/components/home/sync-guide"

export default function ClientHome() {
  const [upcomingMatches, setUpcomingMatches] = useState<any[]>([])

  useEffect(() => {
    // Cargar partidos próximos
    const matches = getUpcomingMatches()

    // Enriquecer los partidos con información de equipos
    const enrichedMatches = matches.map((match) => {
      const homeTeam = getTeamById(match.homeTeamId)
      const awayTeam = getTeamById(match.awayTeamId)

      return {
        ...match,
        homeTeam,
        awayTeam,
      }
    })

    setUpcomingMatches(enrichedMatches)
  }, [])

  return (
    <PublicLayout>
      <div className="container px-4 py-4 mx-auto space-y-6 md:py-8 md:space-y-12">
        {/* Hero Section - Optimizado para móvil */}
        <div className="relative overflow-hidden rounded-xl border bg-black">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10" />
          <div className="h-[200px] sm:h-[250px] md:h-[400px] bg-black" />
          <div className="absolute inset-0 z-20 flex flex-col justify-center p-4 sm:p-8">
            <div className="space-y-2 sm:space-y-4 max-w-2xl transition-all duration-700 delay-300">
              <div className="flex items-center gap-3 mb-2 sm:gap-4 sm:mb-4">
                <div className="w-12 h-12 sm:w-20 sm:h-20 overflow-hidden">
                  <Image
                    src="/images/parley-logo.png"
                    width={80}
                    height={80}
                    alt="PARLEY"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h1 className="text-xl font-bold text-white sm:text-3xl md:text-5xl">PARLEY</h1>
              </div>
              <h2 className="text-lg font-bold text-white sm:text-2xl md:text-3xl">Torneo de Fútbol 2023</h2>
              <p className="text-sm text-white/90 sm:text-base md:text-lg">
                Bienvenido a la aplicación oficial del torneo. Consulta partidos, equipos y eventos.
              </p>
              <div className="flex flex-wrap gap-2 pt-2 sm:gap-4 sm:pt-4">
                <Button size="sm" asChild className="bg-white text-black hover:bg-gray-200 sm:size-lg">
                  <Link href="/matches">Ver Partidos</Link>
                </Button>
                {/* Botón "Explorar Equipos" eliminado */}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Sections - Optimizado para móvil */}
        <div className="grid gap-4 sm:gap-8 md:grid-cols-2">
          {/* Upcoming Matches */}
          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-base sm:text-lg">Próximos Partidos</CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingMatches.length === 0 ? (
                <EmptyState
                  icon={Football}
                  title="No hay próximos partidos"
                  description="Los partidos aparecerán aquí una vez que sean programados."
                  action={
                    <Button variant="outline" size="sm" asChild className="mt-2">
                      <Link href="/matches">Ver Todos los Partidos</Link>
                    </Button>
                  }
                />
              ) : (
                <div className="space-y-3">
                  {upcomingMatches.slice(0, 3).map((match) => (
                    <Link key={match.id} href={`/matches/${match.id}`}>
                      <div className="p-3 transition-colors rounded-lg hover:bg-muted sm:p-4">
                        <div className="text-xs text-muted-foreground mb-1 sm:mb-2">
                          {match.date} • {match.time} • {match.stadium}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              {match.homeTeam?.logo ? (
                                <Image
                                  src={match.homeTeam.logo || "/placeholder.svg"}
                                  width={32}
                                  height={32}
                                  alt={match.homeTeam.name || "Local"}
                                  className="w-4 h-4 sm:w-6 sm:h-6 object-contain"
                                />
                              ) : (
                                <span className="text-xs font-bold">
                                  {match.homeTeam?.name?.substring(0, 2) || "L"}
                                </span>
                              )}
                            </div>
                            <span className="text-sm font-medium sm:text-base">
                              {match.homeTeam?.name || "Equipo Local"}
                            </span>
                          </div>
                          <div className="text-xs font-bold sm:text-sm">VS</div>
                          <div className="flex items-center gap-2 sm:gap-3">
                            <span className="text-sm font-medium sm:text-base">
                              {match.awayTeam?.name || "Equipo Visitante"}
                            </span>
                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              {match.awayTeam?.logo ? (
                                <Image
                                  src={match.awayTeam.logo || "/placeholder.svg"}
                                  width={32}
                                  height={32}
                                  alt={match.awayTeam.name || "Visitante"}
                                  className="w-4 h-4 sm:w-6 sm:h-6 object-contain"
                                />
                              ) : (
                                <span className="text-xs font-bold">
                                  {match.awayTeam?.name?.substring(0, 2) || "V"}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                  {upcomingMatches.length > 3 && (
                    <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                      <Link href="/matches">Ver todos los partidos</Link>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Group Standings */}
          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-base sm:text-lg">Clasificación de Grupos</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={Users}
                title="No hay grupos disponibles"
                description="La clasificación de grupos aparecerá aquí una vez que se añadan equipos."
                action={
                  <Button variant="outline" size="sm" asChild className="mt-2">
                    <Link href="/groups">Ver Grupos</Link>
                  </Button>
                }
              />
            </CardContent>
          </Card>
        </div>

        {/* Media Gallery - Optimizado para móvil */}
        <Card>
          <CardHeader className="pb-2 sm:pb-3">
            <CardTitle className="text-base sm:text-lg">Galería de Medios</CardTitle>
          </CardHeader>
          <CardContent>
            <EmptyState
              icon={ImageIcon}
              title="No hay medios disponibles"
              description="Las fotos y videos aparecerán aquí una vez que sean añadidos."
              action={
                <Button variant="outline" size="sm" asChild className="mt-2">
                  <Link href="/media">Ver Galería</Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      </div>
      <SyncGuide />
    </PublicLayout>
  )
}
