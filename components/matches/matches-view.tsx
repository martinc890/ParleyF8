"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmptyState } from "@/components/ui/empty-state"
import { ClubIcon as Football, Filter } from "lucide-react"
import { getEnrichedMatches } from "@/lib/data-service"

export default function MatchesView() {
  const [activeTab, setActiveTab] = useState("all")
  const [phaseFilter, setPhaseFilter] = useState("all")
  const [matches, setMatches] = useState<any[]>([])

  useEffect(() => {
    // Load matches data
    loadMatches()
  }, [])

  const loadMatches = () => {
    const enrichedMatches = getEnrichedMatches()
    setMatches(enrichedMatches)
  }

  const filteredMatches = matches.filter((match) => {
    if (activeTab === "upcoming" && match.status !== "upcoming") return false
    if (activeTab === "completed" && match.status !== "completed") return false
    if (phaseFilter !== "all" && match.phase !== phaseFilter) return false
    return true
  })

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

        <div className="flex items-center gap-2">
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
      </div>

      <Card>
        <CardHeader className="pb-2 sm:pb-4">
          <CardTitle className="text-base sm:text-xl">Partidos del Torneo</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredMatches.length === 0 ? (
            <EmptyState
              icon={Football}
              title="No hay partidos"
              description={
                activeTab === "all"
                  ? "No hay partidos en el torneo todavía."
                  : activeTab === "upcoming"
                    ? "No hay próximos partidos programados."
                    : "No hay partidos completados todavía."
              }
            />
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {filteredMatches.map((match) => (
                <Link key={match.id} href={`/matches/${match.id}`}>
                  <div className="p-3 sm:p-4 transition-colors rounded-lg hover:bg-muted">
                    <div className="text-xs text-muted-foreground mb-1 sm:mb-2">
                      {match.date} • {match.time}
                      {match.group && ` • Grupo ${match.group}`} • {match.stadium}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {match.homeTeam?.logo ? (
                            <Image
                              src={match.homeTeam.logo || "/placeholder.svg"}
                              width={40}
                              height={40}
                              alt={match.homeTeam?.name || "Local"}
                              className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                            />
                          ) : (
                            <span className="text-xs font-bold">{match.homeTeam?.name?.substring(0, 2) || "L"}</span>
                          )}
                        </div>
                        <span className="text-sm font-medium sm:text-base truncate max-w-[80px] sm:max-w-[120px] md:max-w-none">
                          {match.homeTeam?.name || "Equipo Local"}
                        </span>
                      </div>
                      {match.status === "completed" ? (
                        <div className="flex items-center gap-2 px-2 py-1 sm:px-3 text-base sm:text-lg font-bold bg-muted rounded-md">
                          <span>{match.homeScore || 0}</span>
                          <span>-</span>
                          <span>{match.awayScore || 0}</span>
                        </div>
                      ) : (
                        <div className="text-sm font-bold">VS</div>
                      )}
                      <div className="flex items-center gap-2 sm:gap-3">
                        <span className="text-sm font-medium sm:text-base truncate max-w-[80px] sm:max-w-[120px] md:max-w-none">
                          {match.awayTeam?.name || "Equipo Visitante"}
                        </span>
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {match.awayTeam?.logo ? (
                            <Image
                              src={match.awayTeam.logo || "/placeholder.svg"}
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
          )}
        </CardContent>
      </Card>
    </div>
  )
}
