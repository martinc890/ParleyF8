"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Mail, User, Ticket } from "lucide-react"
import DashboardLayout from "@/app/dashboard-layout"

export default function CaptainInvitationsPage() {
  const { toast } = useToast()
  const [playerEmail, setPlayerEmail] = useState("")
  const [fanEmail, setFanEmail] = useState("")
  const [invitations, setInvitations] = useState<
    {
      id: string
      email: string
      type: "player" | "fan"
      status: "pending" | "accepted" | "rejected"
      date: string
    }[]
  >([
    {
      id: "1",
      email: "jugador1@example.com",
      type: "player",
      status: "accepted",
      date: "2023-05-15",
    },
    {
      id: "2",
      email: "jugador2@example.com",
      type: "player",
      status: "pending",
      date: "2023-05-20",
    },
    {
      id: "3",
      email: "fan1@example.com",
      type: "fan",
      status: "pending",
      date: "2023-05-22",
    },
  ])

  const handleInvitePlayer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!playerEmail) return

    // En una implementación real, esto enviaría la invitación a través de una API
    const newInvitation = {
      id: Date.now().toString(),
      email: playerEmail,
      type: "player" as const,
      status: "pending" as const,
      date: new Date().toISOString().split("T")[0],
    }

    setInvitations([...invitations, newInvitation])
    setPlayerEmail("")

    toast({
      title: "Invitación enviada",
      description: `Se ha enviado una invitación a ${playerEmail}`,
    })
  }

  const handleInviteFan = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fanEmail) return

    // En una implementación real, esto enviaría la invitación a través de una API
    const newInvitation = {
      id: Date.now().toString(),
      email: fanEmail,
      type: "fan" as const,
      status: "pending" as const,
      date: new Date().toISOString().split("T")[0],
    }

    setInvitations([...invitations, newInvitation])
    setFanEmail("")

    toast({
      title: "Invitación enviada",
      description: `Se ha enviado una invitación a ${fanEmail}`,
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Gestión de Invitaciones</h1>
            <p className="text-muted-foreground">Invita a jugadores y simpatizantes a tu equipo</p>
          </div>
        </div>

        <Tabs defaultValue="players">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="players">Jugadores</TabsTrigger>
            <TabsTrigger value="fans">Simpatizantes</TabsTrigger>
          </TabsList>

          <TabsContent value="players">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Invitar Jugador</CardTitle>
                  <CardDescription>Envía una invitación a un jugador para unirse a tu equipo</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleInvitePlayer}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="player-email">Email del Jugador</Label>
                        <Input
                          id="player-email"
                          type="email"
                          placeholder="jugador@example.com"
                          value={playerEmail}
                          onChange={(e) => setPlayerEmail(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        <Mail className="mr-2 h-4 w-4" />
                        Enviar Invitación
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Invitaciones a Jugadores</CardTitle>
                  <CardDescription>Historial de invitaciones enviadas a jugadores</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {invitations
                      .filter((inv) => inv.type === "player")
                      .map((invitation) => (
                        <div key={invitation.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center">
                            <User className="h-5 w-5 mr-2 text-gray-500" />
                            <div>
                              <p className="font-medium">{invitation.email}</p>
                              <p className="text-xs text-gray-500">Enviada el {invitation.date}</p>
                            </div>
                          </div>
                          <div>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                invitation.status === "accepted"
                                  ? "bg-green-100 text-green-800"
                                  : invitation.status === "rejected"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {invitation.status === "accepted"
                                ? "Aceptada"
                                : invitation.status === "rejected"
                                  ? "Rechazada"
                                  : "Pendiente"}
                            </span>
                          </div>
                        </div>
                      ))}

                    {invitations.filter((inv) => inv.type === "player").length === 0 && (
                      <p className="text-center text-gray-500 py-4">No hay invitaciones enviadas</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="fans">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Invitar Simpatizante</CardTitle>
                  <CardDescription>Envía una invitación a un simpatizante para acceder al predio</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleInviteFan}>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="fan-email">Email del Simpatizante</Label>
                        <Input
                          id="fan-email"
                          type="email"
                          placeholder="fan@example.com"
                          value={fanEmail}
                          onChange={(e) => setFanEmail(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        <Ticket className="mr-2 h-4 w-4" />
                        Enviar Invitación
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Invitaciones a Simpatizantes</CardTitle>
                  <CardDescription>Historial de invitaciones enviadas a simpatizantes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {invitations
                      .filter((inv) => inv.type === "fan")
                      .map((invitation) => (
                        <div key={invitation.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center">
                            <Ticket className="h-5 w-5 mr-2 text-gray-500" />
                            <div>
                              <p className="font-medium">{invitation.email}</p>
                              <p className="text-xs text-gray-500">Enviada el {invitation.date}</p>
                            </div>
                          </div>
                          <div>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                invitation.status === "accepted"
                                  ? "bg-green-100 text-green-800"
                                  : invitation.status === "rejected"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {invitation.status === "accepted"
                                ? "Aceptada"
                                : invitation.status === "rejected"
                                  ? "Rechazada"
                                  : "Pendiente"}
                            </span>
                          </div>
                        </div>
                      ))}

                    {invitations.filter((inv) => inv.type === "fan").length === 0 && (
                      <p className="text-center text-gray-500 py-4">No hay invitaciones enviadas</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
