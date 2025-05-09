"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmptyState } from "@/components/ui/empty-state"
import { Users } from "lucide-react"
import { getTeamsByGroup } from "@/lib/data-service"

export default function GroupsView() {
  const [activeTab, setActiveTab] = useState("groupA")
  const [groupA, setGroupA] = useState<any[]>([])
  const [groupB, setGroupB] = useState<any[]>([])

  useEffect(() => {
    // Load teams data
    loadTeams()
  }, [])

  const loadTeams = () => {
    const teamsA = getTeamsByGroup("A")
    const teamsB = getTeamsByGroup("B")
    setGroupA(teamsA)
    setGroupB(teamsB)
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="groupA" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="groupA">Grupo A</TabsTrigger>
          <TabsTrigger value="groupB">Grupo B</TabsTrigger>
        </TabsList>

        <TabsContent value="groupA" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Grupo A Standings</CardTitle>
            </CardHeader>
            <CardContent>
              {groupA.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No teams in Group A"
                  description="Teams will appear here once they are added to Group A."
                />
              ) : (
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="pb-2 text-left font-medium">Equipo</th>
                          <th className="pb-2 text-center font-medium">PJ</th>
                          <th className="pb-2 text-center font-medium">G</th>
                          <th className="pb-2 text-center font-medium">E</th>
                          <th className="pb-2 text-center font-medium">P</th>
                          <th className="pb-2 text-center font-medium">GD</th>
                          <th className="pb-2 text-center font-medium">Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupA.map((team, index) => (
                          <tr key={team.id} className={`${index < 2 ? "bg-primary/5" : ""}`}>
                            <td className="py-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium w-4">{index + 1}</span>
                                <Image
                                  src={team.logo || "/placeholder.svg?height=24&width=24"}
                                  width={24}
                                  height={24}
                                  alt={team.name}
                                />
                                <span className="whitespace-nowrap">{team.name}</span>
                              </div>
                            </td>
                            <td className="py-2 text-center">{team.stats.played}</td>
                            <td className="py-2 text-center">{team.stats.won}</td>
                            <td className="py-2 text-center">{team.stats.drawn}</td>
                            <td className="py-2 text-center">{team.stats.lost}</td>
                            <td className="py-2 text-center">{team.stats.goalsFor - team.stats.goalsAgainst}</td>
                            <td className="py-2 text-center font-bold">{team.stats.points}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="groupB" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Grupo B Standings</CardTitle>
            </CardHeader>
            <CardContent>
              {groupB.length === 0 ? (
                <EmptyState
                  icon={Users}
                  title="No teams in Group B"
                  description="Teams will appear here once they are added to Group B."
                />
              ) : (
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="pb-2 text-left font-medium">Equipo</th>
                          <th className="pb-2 text-center font-medium">PJ</th>
                          <th className="pb-2 text-center font-medium">G</th>
                          <th className="pb-2 text-center font-medium">E</th>
                          <th className="pb-2 text-center font-medium">P</th>
                          <th className="pb-2 text-center font-medium">GD</th>
                          <th className="pb-2 text-center font-medium">Pts</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupB.map((team, index) => (
                          <tr key={team.id} className={`${index < 2 ? "bg-primary/5" : ""}`}>
                            <td className="py-2">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-medium w-4">{index + 1}</span>
                                <Image
                                  src={team.logo || "/placeholder.svg?height=24&width=24"}
                                  width={24}
                                  height={24}
                                  alt={team.name}
                                />
                                <span className="whitespace-nowrap">{team.name}</span>
                              </div>
                            </td>
                            <td className="py-2 text-center">{team.stats.played}</td>
                            <td className="py-2 text-center">{team.stats.won}</td>
                            <td className="py-2 text-center">{team.stats.drawn}</td>
                            <td className="py-2 text-center">{team.stats.lost}</td>
                            <td className="py-2 text-center">{team.stats.goalsFor - team.stats.goalsAgainst}</td>
                            <td className="py-2 text-center font-bold">{team.stats.points}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
