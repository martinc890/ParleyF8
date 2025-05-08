"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Search, MoreHorizontal, Pencil, Trash, Trophy } from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { EmptyState } from "@/components/ui/empty-state"
import { getAllMatches, deleteMatch, getTeamById } from "@/lib/data-service"
import { useToast } from "@/components/ui/use-toast"

export default function AdminMatches() {
  const [matches, setMatches] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    // Load matches data
    loadMatches()
  }, [])

  const loadMatches = () => {
    const allMatches = getAllMatches()
    setMatches(allMatches)
  }

  const handleDeleteMatch = (id: string) => {
    if (confirm("Are you sure you want to delete this match? This action cannot be undone.")) {
      deleteMatch(id)
      loadMatches()
      toast({
        title: "Match deleted",
        description: "The match has been deleted successfully.",
      })
    }
  }

  const getTeamName = (teamId: string) => {
    const team = getTeamById(teamId)
    return team ? team.name : "Unknown Team"
  }

  const filteredMatches = matches.filter((match) => {
    // Filter by tab
    if (activeTab === "upcoming" && match.status !== "upcoming") return false
    if (activeTab === "completed" && match.status !== "completed") return false

    // Filter by search query
    const homeTeamName = getTeamName(match.homeTeamId)
    const awayTeamName = getTeamName(match.awayTeamId)
    const matchText = `${homeTeamName} vs ${awayTeamName} ${match.stadium}`.toLowerCase()

    if (searchQuery && !matchText.includes(searchQuery.toLowerCase())) return false

    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Matches</h1>
          <p className="text-muted-foreground">Manage all tournament matches</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/admin/matches/new">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Match
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <CardTitle>All Matches</CardTitle>
              <CardDescription>View and manage all tournament matches</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search matches..."
                  className="pl-8 w-[200px] md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Matches</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              {matches.length === 0 ? (
                <EmptyState
                  icon={Trophy}
                  title="No matches added yet"
                  description="Add your first match to get started with the tournament."
                  action={
                    <Button asChild>
                      <Link href="/admin/matches/new">
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Add Match
                      </Link>
                    </Button>
                  }
                />
              ) : filteredMatches.length === 0 ? (
                <EmptyState
                  icon={Search}
                  title="No matches found"
                  description="No matches match your search criteria."
                  action={
                    <Button variant="outline" onClick={() => setSearchQuery("")}>
                      Clear Search
                    </Button>
                  }
                />
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Date</TableHead>
                      <TableHead>Match</TableHead>
                      <TableHead>Stadium</TableHead>
                      <TableHead>Phase</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMatches.map((match) => (
                      <TableRow key={match.id}>
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span>{match.date}</span>
                            <span className="text-xs text-muted-foreground">{match.time}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getTeamName(match.homeTeamId)} vs {getTeamName(match.awayTeamId)}
                        </TableCell>
                        <TableCell>{match.stadium}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {match.phase === "group" && "Group Stage"}
                            {match.phase === "quarter" && "Quarter Final"}
                            {match.phase === "semi" && "Semi Final"}
                            {match.phase === "final" && "Final"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={match.status === "completed" ? "secondary" : "default"}>
                            {match.status === "upcoming" && "Upcoming"}
                            {match.status === "live" && "Live"}
                            {match.status === "completed" && "Completed"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/matches/${match.id}`}>
                                  <Pencil className="w-4 h-4 mr-2" />
                                  Edit Match
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/matches/${match.id}/score`}>
                                  <Trophy className="w-4 h-4 mr-2" />
                                  Update Score
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteMatch(match.id)}
                              >
                                <Trash className="w-4 h-4 mr-2" />
                                Delete Match
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
            <TabsContent value="upcoming" className="mt-4">
              {/* Similar content as "all" tab but filtered for upcoming matches */}
              {/* This will be populated with the same structure as above */}
            </TabsContent>
            <TabsContent value="completed" className="mt-4">
              {/* Similar content as "all" tab but filtered for completed matches */}
              {/* This will be populated with the same structure as above */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
