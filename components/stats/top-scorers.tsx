"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getTopScorers, getTopAssists } from "@/lib/supabase-service"
import { formatFullName } from "@/lib/utils"
import Image from "next/image"

export default function TopScorers() {
  const [scorers, setScorers] = useState<any[]>([])
  const [assists, setAssists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const scorersData = await getTopScorers(10)
        const assistsData = await getTopAssists(10)

        setScorers(scorersData)
        setAssists(assistsData)
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas</CardTitle>
          <CardDescription>Cargando estadísticas...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas Individuales</CardTitle>
        <CardDescription>Goleadores y asistidores del torneo</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="scorers">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="scorers">Goleadores</TabsTrigger>
            <TabsTrigger value="assists">Asistidores</TabsTrigger>
          </TabsList>

          <TabsContent value="scorers" className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Pos</TableHead>
                  <TableHead>Jugador</TableHead>
                  <TableHead>Equipo</TableHead>
                  <TableHead className="text-right">Goles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {scorers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No hay datos disponibles
                    </TableCell>
                  </TableRow>
                ) : (
                  scorers.map((player, index) => (
                    <TableRow key={player.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{player.number}</Badge>
                          {formatFullName(player.firstName, player.lastName)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {player.team?.logo && (
                            <div className="w-6 h-6 relative">
                              <Image
                                src={player.team.logo || "/placeholder.svg"}
                                alt={player.team.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                          )}
                          <span>{player.team?.name || "Sin equipo"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold">{player.stats?.goals || 0}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="assists" className="pt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Pos</TableHead>
                  <TableHead>Jugador</TableHead>
                  <TableHead>Equipo</TableHead>
                  <TableHead className="text-right">Asistencias</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assists.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                      No hay datos disponibles
                    </TableCell>
                  </TableRow>
                ) : (
                  assists.map((player, index) => (
                    <TableRow key={player.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{player.number}</Badge>
                          {formatFullName(player.firstName, player.lastName)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {player.team?.logo && (
                            <div className="w-6 h-6 relative">
                              <Image
                                src={player.team.logo || "/placeholder.svg"}
                                alt={player.team.name}
                                fill
                                className="object-contain"
                              />
                            </div>
                          )}
                          <span>{player.team?.name || "Sin equipo"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-bold">{player.stats?.assists || 0}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
