"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getTopScorers, getTopAssists } from "@/lib/data-service"
import type { Player } from "@/lib/types"

export default function TopScorers() {
  const [scorers, setScorers] = useState<Player[]>([])
  const [assisters, setAssisters] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // En una implementación real, estas serían llamadas a la API
    const fetchData = async () => {
      try {
        const topScorers = getTopScorers()
        const topAssists = getTopAssists()

        setScorers(topScorers)
        setAssisters(topAssists)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching stats:", error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas de Jugadores</CardTitle>
        <CardDescription>Goleadores y asistidores del torneo</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="goals">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="goals">Goleadores</TabsTrigger>
            <TabsTrigger value="assists">Asistencias</TabsTrigger>
          </TabsList>
          <TabsContent value="goals" className="pt-4">
            {loading ? (
              <p className="text-center py-4">Cargando estadísticas...</p>
            ) : scorers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Pos</th>
                      <th className="text-left py-2 font-medium">Jugador</th>
                      <th className="text-left py-2 font-medium">Equipo</th>
                      <th className="text-right py-2 font-medium">Goles</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scorers.map((player, index) => (
                      <tr key={player.id} className="border-b">
                        <td className="py-2">{index + 1}</td>
                        <td className="py-2">{player.name}</td>
                        <td className="py-2">{player.teamId}</td>
                        <td className="py-2 text-right">{player.stats.goals}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-4">No hay datos disponibles</p>
            )}
          </TabsContent>
          <TabsContent value="assists" className="pt-4">
            {loading ? (
              <p className="text-center py-4">Cargando estadísticas...</p>
            ) : assisters.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">Pos</th>
                      <th className="text-left py-2 font-medium">Jugador</th>
                      <th className="text-left py-2 font-medium">Equipo</th>
                      <th className="text-right py-2 font-medium">Asistencias</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assisters.map((player, index) => (
                      <tr key={player.id} className="border-b">
                        <td className="py-2">{index + 1}</td>
                        <td className="py-2">{player.name}</td>
                        <td className="py-2">{player.teamId}</td>
                        <td className="py-2 text-right">{player.stats.assists}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-4">No hay datos disponibles</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
