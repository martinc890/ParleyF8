"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Info } from "lucide-react"
import { EmptyState } from "@/components/ui/empty-state"
import { Trophy } from "lucide-react"
import { getMatchesByPhase } from "@/lib/data-service"

export default function PlayoffBracket() {
  const [quarterFinals, setQuarterFinals] = useState<any[]>([])
  const [semiFinals, setSemiFinals] = useState<any[]>([])
  const [final, setFinal] = useState<any[]>([])
  const [selectedMatch, setSelectedMatch] = useState<null | number>(null)

  useEffect(() => {
    // Load playoff matches
    const quarterMatches = getMatchesByPhase("quarter")
    const semiMatches = getMatchesByPhase("semi")
    const finalMatches = getMatchesByPhase("final")

    setQuarterFinals(quarterMatches)
    setSemiFinals(semiMatches)
    setFinal(finalMatches)
  }, [])

  const hasPlayoffMatches = quarterFinals.length > 0 || semiFinals.length > 0 || final.length > 0

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Playoff Bracket</CardTitle>
        </CardHeader>
        <CardContent>
          {!hasPlayoffMatches ? (
            <EmptyState
              icon={Trophy}
              title="No playoff matches yet"
              description="The playoff bracket will be available once the group stage is completed and playoff matches are scheduled."
            />
          ) : (
            <div className="overflow-x-auto">
              <div className="min-w-[900px] p-4">
                <div className="grid grid-cols-3 gap-4">
                  {/* Quarter Finals */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-center mb-6">Quarter Finals</h3>
                    {quarterFinals.map((match) => (
                      <div
                        key={match.id}
                        className={`p-4 border rounded-lg transition-colors ${
                          selectedMatch === match.id ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedMatch(match.id)}
                      >
                        <div className="text-xs text-muted-foreground mb-2">
                          {match.date} • {match.time}
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Image
                                src={match.homeTeam.logo || "/placeholder.svg"}
                                width={24}
                                height={24}
                                alt={match.homeTeam.name}
                                className="team-logo"
                              />
                              <span className="font-medium">{match.homeTeam.name}</span>
                            </div>
                            {match.completed && <span className="font-bold">{match.homeTeam.score}</span>}
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Image
                                src={match.awayTeam.logo || "/placeholder.svg"}
                                width={24}
                                height={24}
                                alt={match.awayTeam.name}
                                className="team-logo"
                              />
                              <span className="font-medium">{match.awayTeam.name}</span>
                            </div>
                            {match.completed && <span className="font-bold">{match.awayTeam.score}</span>}
                          </div>
                        </div>
                        {match.completed && (
                          <div className="mt-2 text-right">
                            <Badge variant="outline" className="text-xs">
                              {match.homeTeam.score > match.awayTeam.score
                                ? match.homeTeam.name + " advances"
                                : match.awayTeam.name + " advances"}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Semi Finals */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-center mb-6">Semi Finals</h3>
                    <div className="flex flex-col justify-center h-full gap-24">
                      {semiFinals.map((match) => (
                        <div
                          key={match.id}
                          className={`p-4 border rounded-lg transition-colors ${
                            selectedMatch === match.id ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedMatch(match.id)}
                        >
                          <div className="text-xs text-muted-foreground mb-2">
                            {match.date} • {match.time}
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Image
                                  src={match.homeTeam.logo || "/placeholder.svg"}
                                  width={24}
                                  height={24}
                                  alt={match.homeTeam.name}
                                  className="team-logo"
                                />
                                <span className="font-medium">{match.homeTeam.name}</span>
                              </div>
                              {match.completed && <span className="font-bold">{match.homeTeam.score}</span>}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Image
                                  src={match.awayTeam.logo || "/placeholder.svg"}
                                  width={24}
                                  height={24}
                                  alt={match.awayTeam.name}
                                  className="team-logo"
                                />
                                <span className="font-medium">{match.awayTeam.name}</span>
                              </div>
                              {match.completed && <span className="font-bold">{match.awayTeam.score}</span>}
                            </div>
                          </div>
                          {match.completed && (
                            <div className="mt-2 text-right">
                              <Badge variant="outline" className="text-xs">
                                {match.homeTeam.score > match.awayTeam.score
                                  ? match.homeTeam.name + " advances"
                                  : match.awayTeam.name + " advances"}
                              </Badge>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Final */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-center mb-6">Final</h3>
                    <div className="flex justify-center items-center h-[200px]">
                      {final.map((match) => (
                        <div
                          key={match.id}
                          className={`p-4 border rounded-lg transition-colors ${
                            selectedMatch === match.id ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                          }`}
                          onClick={() => setSelectedMatch(match.id)}
                        >
                          <div className="text-xs text-muted-foreground mb-2">
                            {match.date} • {match.time}
                          </div>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Image
                                  src={match.homeTeam.logo || "/placeholder.svg"}
                                  width={24}
                                  height={24}
                                  alt={match.homeTeam.name}
                                  className="team-logo"
                                />
                                <span className="font-medium">{match.homeTeam.name}</span>
                              </div>
                              {match.completed && <span className="font-bold">{match.homeTeam.score}</span>}
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Image
                                  src={match.awayTeam.logo || "/placeholder.svg"}
                                  width={24}
                                  height={24}
                                  alt={match.awayTeam.name}
                                  className="team-logo"
                                />
                                <span className="font-medium">{match.awayTeam.name}</span>
                              </div>
                              {match.completed && <span className="font-bold">{match.awayTeam.score}</span>}
                            </div>
                          </div>
                          {!match.completed && (
                            <div className="mt-2 text-center">
                              <Badge variant="outline" className="text-xs">
                                Upcoming
                              </Badge>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Connecting lines for the bracket */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  {/* Add SVG or CSS for bracket lines if needed */}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedMatch && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Match Details</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/matches/${selectedMatch}`}>
                <Info className="w-4 h-4 mr-2" />
                Full Details
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="p-4">
              {/* Find the selected match from all matches */}
              {(() => {
                const match = [...quarterFinals, ...semiFinals, ...final].find((m) => m.id === selectedMatch)
                if (!match) return null

                return (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold">
                          {match.homeTeam.name} vs {match.awayTeam.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {match.date} • {match.time}
                        </p>
                      </div>
                      <Badge variant={match.completed ? "secondary" : "default"}>
                        {match.completed ? "Completed" : "Upcoming"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-6 bg-muted/30 rounded-lg">
                      <div className="flex flex-col items-center text-center">
                        <Image
                          src={match.homeTeam.logo || "/placeholder.svg"}
                          width={60}
                          height={60}
                          alt={match.homeTeam.name}
                          className="team-logo"
                        />
                        <h2 className="mt-2 text-lg font-bold">{match.homeTeam.name}</h2>
                      </div>

                      {match.completed ? (
                        <div className="flex items-center gap-4 px-6 py-3 text-3xl font-bold bg-muted rounded-xl">
                          <span>{match.homeTeam.score}</span>
                          <span className="text-muted-foreground">-</span>
                          <span>{match.awayTeam.score}</span>
                        </div>
                      ) : (
                        <div className="px-4 py-2 text-lg font-bold">VS</div>
                      )}

                      <div className="flex flex-col items-center text-center">
                        <Image
                          src={match.awayTeam.logo || "/placeholder.svg"}
                          width={60}
                          height={60}
                          alt={match.awayTeam.name}
                          className="team-logo"
                        />
                        <h2 className="mt-2 text-lg font-bold">{match.awayTeam.name}</h2>
                      </div>
                    </div>

                    {match.completed && (
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-medium mb-2">Match Summary</h4>
                        <p className="text-sm text-muted-foreground">
                          {match.homeTeam.score > match.awayTeam.score
                            ? `${match.homeTeam.name} defeated ${match.awayTeam.name} and advanced to the next round.`
                            : `${match.awayTeam.name} defeated ${match.homeTeam.name} and advanced to the next round.`}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
