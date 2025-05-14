"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmptyState } from "@/components/ui/empty-state"
import { ClubIcon as Football, Filter, Calendar } from "lucide-react"
import { getEnrichedMatches } from "@/lib/data-service"
import { format, parseISO } from "date-fns"
import { es } from "date-fns/locale"

export default function MatchesView() {
  const [activeTab, setActiveTab] = useState("all")
  const [phaseFilter, setPhaseFilter] = useState("all")
  const [groupFilter, setGroupFilter] = useState("all")
  const [matches, setMatches] = useState<any[]>([])
  const [groupedMatches, setGroupedMatches] = useState<Record<string, any[]>>({})

  useEffect(() => {
    // Load matches data
    loadMatches()
  }, [])

  useEffect(() => {
    // Group matches by date when matches or filters change
    groupMatchesByDate()
  }, [matches, activeTab, phaseFilter, groupFilter])

  const loadMatches = () => {
    const enrichedMatches = getEnrichedMatches()
    setMatches(enrichedMatches)
  }

  const groupMatchesByDate = () => {
    const filtered = matches.filter((match) => {
      if (activeTab === "upcoming" && match.status !== "upcoming") return false
      if (activeTab === "completed" && match.status !== "completed") return false
      if (phaseFilter !== "all" && match.phase !== phaseFilter) return false
      if (groupFilter !== "all" && match.group !== groupFilter) return false
      return true
    })

    // Group by date
    const grouped: Record<string, any[]> = {}
    filtered.forEach((match) => {
      if (!match.date) return

      // Format date for display
      let displayDate
      try {
        // Try to parse ISO date
        const parsedDate = parseISO(match.date)
        displayDate = format(parsedDate, "EEEE d 'de' MMMM", { locale: es })
        // Capitalize first letter
        displayDate = displayDate.charAt(0).toUpperCase() + displayDate.slice(1)
      } catch (e) {
        // If not ISO format, use as is
        displayDate = match.date
      }

      if (!grouped[displayDate]) {
        grouped[displayDate] = []
      }
      grouped[displayDate].push(match)
    })

    setGroupedMatches(grouped)
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="upcoming">Próximos</TabsTrigger>
            <TabsTrigger value="completed">Completados</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4" />
            <Select defaultValue="all" onValueChange={setPhaseFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por fase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Fases</SelectItem>
                <SelectItem value="group">Fase de Grupos</SelectItem>
                <SelectItem value="quarter">Cuartos de Final</SelectItem>
                <SelectItem value="semi">Semifinales</SelectItem>
                <SelectItem value="final">Final</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Calendar className="w-4 h-4" />
            <Select defaultValue="all" onValueChange={setGroupFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Filtrar por grupo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Grupos</SelectItem>
                <SelectItem value="A">Grupo A</SelectItem>
                <SelectItem value="B">Grupo B</SelectItem>
                <SelectItem value="C">Grupo C</SelectItem>
                <SelectItem value="D">Grupo D</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {Object.keys(groupedMatches).length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <EmptyState
              icon={Football}
              title="No hay partidos"
              description={
                activeTab === "all"
                  ? "No hay partidos que coincidan con los filtros seleccionados."
                  : activeTab === "upcoming"
                    ? "No hay próximos partidos programados."
                    : "No hay partidos completados todavía."
              }
            />
          </CardContent>
        </Card>
      ) : (
        Object.entries(groupedMatches).map(([date, dateMatches]) => (
          <Card key={date} className="overflow-hidden">
            <CardHeader className="pb-2 sm:pb-4 bg-black text-white">
              <CardTitle className="text-base sm:text-xl">{date}</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {dateMatches.map((match) => (
                  <Link key={match.id} href={`/matches/${match.id}`}>
                    <div className="p-3 sm:p-4 transition-colors hover:bg-muted">
                      <div className="text-xs text-muted-foreground mb-1 sm:mb-2 flex items-center flex-wrap gap-1">
                        <span>{match.time}</span>
                        <span>•</span>
                        {match.group && (
                          <>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100">
                              Grupo {match.group}
                            </span>
                            <span>•</span>
                          </>
                        )}
                        {match.phase && match.phase !== "group" && (
                          <>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100">
                              {match.phase === "quarter" && "Cuartos de Final"}
                              {match.phase === "semi" && "Semifinal"}
                              {match.phase === "final" && "Final"}
                              {match.phase === "thirdplace" && "Tercer Puesto"}
                            </span>
                            <span>•</span>
                          </>
                        )}
                        <span>{match.stadium}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        {/* Equipo Local */}
                        <div className="flex items-center gap-2 sm:gap-3 w-[35%]">
                          <div className="min-w-8 h-8 sm:min-w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            {match.homeTeam?.logo ? (
                              <Image
                                src={match.homeTeam.logo || "/placeholder.svg?height=40&width=40"}
                                width={40}
                                height={40}
                                alt={match.homeTeam?.name || "Local"}
                                className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                              />
                            ) : (
                              <span className="text-xs font-bold">{match.homeTeam?.name?.substring(0, 2) || "L"}</span>
                            )}
                          </div>
                          <span className="text-sm font-medium sm:text-base truncate">
                            {match.homeTeam?.name || "Equipo Local"}
                          </span>
                        </div>

                        {/* Marcador */}
                        <div className="flex-shrink-0 w-[20%] flex justify-center">
                          {match.status === "completed" ? (
                            <div className="flex items-center gap-2 px-2 py-1 sm:px-3 text-base sm:text-lg font-bold bg-muted rounded-md">
                              <span>{match.homeScore || 0}</span>
                              <span>-</span>
                              <span>{match.awayScore || 0}</span>
                            </div>
                          ) : (
                            <div className="text-sm font-bold">VS</div>
                          )}
                        </div>

                        {/* Equipo Visitante */}
                        <div className="flex items-center gap-2 sm:gap-3 w-[35%] justify-end">
                          <span className="text-sm font-medium sm:text-base truncate text-right">
                            {match.awayTeam?.name || "Equipo Visitante"}
                          </span>
                          <div className="min-w-8 h-8 sm:min-w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                            {match.awayTeam?.logo ? (
                              <Image
                                src={match.awayTeam.logo || "/placeholder.svg?height=40&width=40"}
                                width={40}
                                height={40}
                                alt={match.awayTeam?.name || "Visitante"}
                                className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                              />
                            ) : (
                              <span className="text-xs font-bold">{match.awayTeam?.name?.substring(0, 2) || "V"}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
