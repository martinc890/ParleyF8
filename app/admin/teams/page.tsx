"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PlusCircle, Search, MoreHorizontal, Pencil, Trash, UserPlus } from "lucide-react"
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
import { getAllTeams, deleteTeam } from "@/lib/data-service"
import { useToast } from "@/components/ui/use-toast"

export default function AdminTeams() {
  const [teams, setTeams] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    // Load teams data
    loadTeams()
  }, [])

  const loadTeams = () => {
    const allTeams = getAllTeams()
    setTeams(allTeams)
  }

  const handleDeleteTeam = (id: string) => {
    if (confirm("Are you sure you want to delete this team? This action cannot be undone.")) {
      deleteTeam(id)
      loadTeams()
      toast({
        title: "Team deleted",
        description: "The team has been deleted successfully.",
      })
    }
  }

  const filteredTeams = teams.filter((team) => team.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Teams</h1>
          <p className="text-muted-foreground">Manage all teams in the tournament</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/admin/teams/new">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Team
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <CardTitle>All Teams</CardTitle>
              <CardDescription>View and manage all tournament teams</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search teams..."
                  className="pl-8 w-[200px] md:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {teams.length === 0 ? (
            <EmptyState
              icon={UserPlus}
              title="No teams added yet"
              description="Add your first team to get started with the tournament."
              action={
                <Button asChild>
                  <Link href="/admin/teams/new">
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Team
                  </Link>
                </Button>
              }
            />
          ) : filteredTeams.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No teams found"
              description="No teams match your search criteria."
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
                  <TableHead>Team Name</TableHead>
                  <TableHead>Group</TableHead>
                  <TableHead>Players</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeams.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell className="font-medium">{team.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">Group {team.group}</Badge>
                    </TableCell>
                    <TableCell>{team.players.length} players</TableCell>
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
                            <Link href={`/admin/teams/${team.id}`}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Edit Team
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/teams/${team.id}/players`}>
                              <UserPlus className="w-4 h-4 mr-2" />
                              Manage Players
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteTeam(team.id)}>
                            <Trash className="w-4 h-4 mr-2" />
                            Delete Team
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
