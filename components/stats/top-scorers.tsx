"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Trophy, Award } from "lucide-react"
import { getTopScorers, getTopAssists } from "@/lib/mongodb-service"
import type { PlayerModel } from "@/lib/models"
import { getTeamById } from "@/lib/mongodb-service"

export default function TopScorers() {
  const [topScorers, setTopScorers] = useState<PlayerModel[]>([])
  const [topAssists, setTopAssists] = useState<PlayerModel[]>([])
  const [teamsMap, setTeamsMap] = useState<Record<string, any>>({})
  const [activeTab, setActiveTab] = useState("goals")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)

        // Cargar goleadores y asistidores
        const scorers = await getTopScorers(10)
        const assists = await getTopAssists(10)

        setTopScorers(scorers)
        setTopAssists(assists)

        // Cargar equipos para todos los jugadores
        const uniqueTeamIds = new Set([...scorers.map((p) => p.teamId), ...assists.map((p) => p.teamId)])

        const teamsData: Record<string, any> = {}

        for (const teamId of uniqueTeamIds) {
          const team = await getTeamById(teamId)
          if (team) {
            teamsData[teamId] = team
          }
        }

        setTeamsMap(teamsData)
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas de Jugadores</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="goals" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="goals">Goleadores</TabsTrigger>
            <TabsTrigger value="assists">Asistidores</TabsTrigger>
          </TabsList>

          <TabsContent value="goals">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <p>Cargando goleadores...</p>
              </div>
            ) : topScorers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Trophy className="w-12 h-12 text-muted-foreground mb-2" />
                <p className="text-lg font-medium">No hay goleadores todavía</p>
                <p className="text-sm text-muted-foreground">
                  Los goleadores aparecerán aquí una vez que se registren goles en los partidos.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Pos</TableHead>
                    <TableHead>Jugador</TableHead>
                    <TableHead>Equipo</TableHead>
                    <TableHead className="text-center">Goles</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topScorers.map((player, index) => (
                    <TableRow key={player._id}>
                      <TableCell className="font-medium">
                        {index === 0 ? (
                          <Badge className="bg-yellow-500 text-black">1°</Badge>
                        ) : index === 1 ? (
                          <Badge className="bg-gray-300 text-black">2°</Badge>
                        ) : index === 2 ? (
                          <Badge className="bg-amber-700 text-white">3°</Badge>
                        ) : (
                          <span>{index + 1}°</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {player.firstName} {player.lastName}
                          </span>
                          <span className="text-xs text-muted-foreground">#{player.number}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {teamsMap[player.teamId] && (
                            <Image
                              src={teamsMap[player.teamId].logo || "/placeholder.svg?height=24&width=24"}
                              width={24}
                              height={24}
                              alt={teamsMap[player.teamId].name}
                              className="rounded-full"
                            />
                          )}
                          <span>{teamsMap[player.teamId]?.name || "Equipo desconocido"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-bold">{player.stats?.goals || 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>

          <TabsContent value="assists">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <p>Cargando asistidores...</p>
              </div>
            ) : topAssists.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Award className="w-12 h-12 text-muted-foreground mb-2" />
                <p className="text-lg font-medium">No hay asistidores todavía</p>
                <p className="text-sm text-muted-foreground">
                  Los asistidores aparecerán aquí una vez que se registren asistencias en los partidos.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Pos</TableHead>
                    <TableHead>Jugador</TableHead>
                    <TableHead>Equipo</TableHead>
                    <TableHead className="text-center">Asist.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topAssists.map((player, index) => (
                    <TableRow key={player._id}>
                      <TableCell className="font-medium">
                        {index === 0 ? (
                          <Badge className="bg-yellow-500 text-black">1°</Badge>
                        ) : index === 1 ? (
                          <Badge className="bg-gray-300 text-black">2°</Badge>
                        ) : index === 2 ? (
                          <Badge className="bg-amber-700 text-white">3°</Badge>
                        ) : (
                          <span>{index + 1}°</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">
                            {player.firstName} {player.lastName}
                          </span>
                          <span className="text-xs text-muted-foreground">#{player.number}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {teamsMap[player.teamId] && (
                            <Image
                              src={teamsMap[player.teamId].logo || "/placeholder.svg?height=24&width=24"}
                              width={24}
                              height={24}
                              alt={teamsMap[player.teamId].name}
                              className="rounded-full"
                            />
                          )}
                          <span>{teamsMap[player.teamId]?.name || "Equipo desconocido"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-bold">{player.stats?.assists || 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
