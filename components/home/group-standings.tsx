import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight } from "lucide-react"

// Mock data
const groupA = [
  {
    id: 1,
    name: "Team Alpha",
    logo: "/placeholder.svg?height=24&width=24",
    played: 2,
    won: 2,
    drawn: 0,
    lost: 0,
    gf: 5,
    ga: 1,
    points: 6,
  },
  {
    id: 2,
    name: "Team Beta",
    logo: "/placeholder.svg?height=24&width=24",
    played: 2,
    won: 1,
    drawn: 0,
    lost: 1,
    gf: 3,
    ga: 2,
    points: 3,
  },
  {
    id: 3,
    name: "Team Gamma",
    logo: "/placeholder.svg?height=24&width=24",
    played: 2,
    won: 0,
    drawn: 1,
    lost: 1,
    gf: 1,
    ga: 3,
    points: 1,
  },
  {
    id: 4,
    name: "Team Delta",
    logo: "/placeholder.svg?height=24&width=24",
    played: 2,
    won: 0,
    drawn: 1,
    lost: 1,
    gf: 0,
    ga: 3,
    points: 1,
  },
]

const groupB = [
  {
    id: 5,
    name: "Team Epsilon",
    logo: "/placeholder.svg?height=24&width=24",
    played: 2,
    won: 1,
    drawn: 1,
    lost: 0,
    gf: 3,
    ga: 1,
    points: 4,
  },
  {
    id: 6,
    name: "Team Zeta",
    logo: "/placeholder.svg?height=24&width=24",
    played: 2,
    won: 1,
    drawn: 0,
    lost: 1,
    gf: 2,
    ga: 2,
    points: 3,
  },
  {
    id: 7,
    name: "Team Eta",
    logo: "/placeholder.svg?height=24&width=24",
    played: 2,
    won: 0,
    drawn: 2,
    lost: 0,
    gf: 1,
    ga: 1,
    points: 2,
  },
  {
    id: 8,
    name: "Team Theta",
    logo: "/placeholder.svg?height=24&width=24",
    played: 2,
    won: 0,
    drawn: 1,
    lost: 1,
    gf: 0,
    ga: 2,
    points: 1,
  },
]

export default function GroupStandings() {
  return (
    <Card className="match-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>Group Standings</CardTitle>
          <Button variant="ghost" size="sm" className="gap-1" asChild>
            <Link href="/groups">
              View all <ChevronRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="groupA">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="groupA">Group A</TabsTrigger>
            <TabsTrigger value="groupB">Group B</TabsTrigger>
          </TabsList>
          <TabsContent value="groupA">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 text-left font-medium">Team</th>
                    <th className="pb-2 text-center font-medium">P</th>
                    <th className="pb-2 text-center font-medium">W</th>
                    <th className="pb-2 text-center font-medium">D</th>
                    <th className="pb-2 text-center font-medium">L</th>
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
                          <Image src={team.logo || "/placeholder.svg"} width={24} height={24} alt={team.name} />
                          <span>{team.name}</span>
                        </div>
                      </td>
                      <td className="py-2 text-center">{team.played}</td>
                      <td className="py-2 text-center">{team.won}</td>
                      <td className="py-2 text-center">{team.drawn}</td>
                      <td className="py-2 text-center">{team.lost}</td>
                      <td className="py-2 text-center">{team.gf - team.ga}</td>
                      <td className="py-2 text-center font-bold">{team.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
          <TabsContent value="groupB">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 text-left font-medium">Team</th>
                    <th className="pb-2 text-center font-medium">P</th>
                    <th className="pb-2 text-center font-medium">W</th>
                    <th className="pb-2 text-center font-medium">D</th>
                    <th className="pb-2 text-center font-medium">L</th>
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
                          <Image src={team.logo || "/placeholder.svg"} width={24} height={24} alt={team.name} />
                          <span>{team.name}</span>
                        </div>
                      </td>
                      <td className="py-2 text-center">{team.played}</td>
                      <td className="py-2 text-center">{team.won}</td>
                      <td className="py-2 text-center">{team.drawn}</td>
                      <td className="py-2 text-center">{team.lost}</td>
                      <td className="py-2 text-center">{team.gf - team.ga}</td>
                      <td className="py-2 text-center font-bold">{team.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
