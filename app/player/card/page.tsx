"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/components/auth/auth-provider"
import { QrCode, User, Calendar, Mail, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import DashboardLayout from "@/app/dashboard-layout"
import { getPlayerById, getTeamById } from "@/lib/supabase-service"
import type { Player, Team } from "@/lib/types"
import { BackButton } from "@/components/ui/back-button"
import { Logo } from "@/components/ui/logo"

export default function PlayerCardPage() {
  const { user } = useAuth()
  const [qrValue, setQrValue] = useState("")
  const [isFlipped, setIsFlipped] = useState(false)
  const [player, setPlayer] = useState<Player | null>(null)
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPlayerData = async () => {
      if (!user) return

      try {
        // Generar un valor único para el QR
        setQrValue(`PARLEY-${user.id}-${Date.now()}`)

        // Obtener datos del jugador
        const playerData = await getPlayerById(user.id)
        if (playerData) {
          setPlayer(playerData)

          // Obtener datos del equipo
          if (playerData.teamId) {
            const teamData = await getTeamById(playerData.teamId)
            if (teamData) {
              setTeam(teamData)
            }
          }
        }
      } catch (error) {
        console.error("Error loading player data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadPlayerData()
  }, [user])

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  if (!user || loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center mb-4">
          <div className="flex items-center gap-2">
            <BackButton href="/player/dashboard" />
            <h1 className="text-2xl font-bold tracking-tight">Mi Carnet Digital</h1>
          </div>
          <Button onClick={handleFlip} size="sm">
            {isFlipped ? "Ver Frente" : "Ver Dorso"}
          </Button>
        </div>

        <div className="flex justify-center">
          <div
            className={`w-full max-w-md h-[500px] relative transition-all duration-700 transform-gpu ${
              isFlipped ? "rotate-y-180" : ""
            }`}
            style={{
              perspective: "1000px",
              transformStyle: "preserve-3d",
            }}
          >
            {/* Frente del carnet */}
            <div
              className={`absolute w-full h-full backface-hidden ${
                isFlipped ? "opacity-0" : "opacity-100"
              } transition-opacity duration-700`}
            >
              <Card className="w-full h-full overflow-hidden rounded-xl shadow-xl border-2 border-black">
                <div className="relative w-full h-full bg-gradient-to-br from-black to-gray-800 text-white p-4 flex flex-col">
                  <div className="absolute top-3 right-3">
                    <Logo size="sm" withText={false} asLink={false} />
                  </div>

                  <div className="flex flex-col items-center flex-grow">
                    <div className="w-24 h-24 bg-gray-700 rounded-full mb-3 flex items-center justify-center border-2 border-white mt-6">
                      {player?.photo ? (
                        <img
                          src={player.photo || "/placeholder.svg"}
                          alt={player.firstName}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-white" />
                      )}
                    </div>

                    <h2 className="text-xl font-bold text-center">
                      {player ? `${player.firstName} ${player.lastName}` : user.name}
                    </h2>
                    <p className="text-gray-300 mb-1 text-sm">{player?.position || "Jugador"}</p>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="bg-white text-black text-lg font-bold w-7 h-7 rounded-full flex items-center justify-center">
                        {player?.number || ""}
                      </span>
                      <span className="text-sm">{team?.name || "Equipo Parley"}</span>
                    </div>

                    <div className="w-full space-y-1 mt-1">
                      <div className="flex items-center">
                        <Mail className="w-3 h-3 mr-2 text-gray-300" />
                        <span className="text-xs">{user.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-2 text-gray-300" />
                        <span className="text-xs">Temporada 2023</span>
                      </div>
                    </div>

                    <div className="mt-3 bg-white p-2 rounded-lg">
                      {/* Aquí iría el componente QR real */}
                      <div className="w-28 h-28 bg-gray-100 flex items-center justify-center">
                        <QrCode className="w-20 h-20 text-black" />
                      </div>
                    </div>

                    <p className="text-xs text-center text-gray-300 mt-2">
                      Este código QR es tu pase de acceso al predio y estacionamiento.
                      <br />
                      Válido para la temporada 2023.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Dorso del carnet */}
            <div
              className={`absolute w-full h-full backface-hidden rotate-y-180 ${
                isFlipped ? "opacity-100" : "opacity-0"
              } transition-opacity duration-700`}
            >
              <Card className="w-full h-full overflow-hidden rounded-xl shadow-xl border-2 border-black">
                <div className="relative w-full h-full bg-gradient-to-br from-gray-800 to-black text-white p-4">
                  <div className="absolute top-3 left-3">
                    <Logo size="sm" withText={false} asLink={false} />
                  </div>

                  <h3 className="text-lg font-bold text-center mt-8 mb-4">Información del Jugador</h3>

                  <div className="space-y-3">
                    <div className="bg-gray-700 p-2 rounded-lg">
                      <h4 className="text-xs font-semibold mb-1">Estadísticas</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-gray-800 p-2 rounded">
                          <p className="text-xs text-gray-400">Goles</p>
                          <p className="text-base font-bold">{player?.stats?.goals || 0}</p>
                        </div>
                        <div className="bg-gray-800 p-2 rounded">
                          <p className="text-xs text-gray-400">Asistencias</p>
                          <p className="text-base font-bold">{player?.stats?.assists || 0}</p>
                        </div>
                        <div className="bg-gray-800 p-2 rounded">
                          <p className="text-xs text-gray-400">T. Amarillas</p>
                          <p className="text-base font-bold">{player?.stats?.yellowCards || 0}</p>
                        </div>
                        <div className="bg-gray-800 p-2 rounded">
                          <p className="text-xs text-gray-400">T. Rojas</p>
                          <p className="text-base font-bold">{player?.stats?.redCards || 0}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-700 p-2 rounded-lg">
                      <h4 className="text-xs font-semibold mb-1">Información de Contacto</h4>
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Mail className="w-3 h-3 mr-2 text-gray-300" />
                          <span className="text-xs">{user.email}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-700 p-2 rounded-lg">
                      <h4 className="text-xs font-semibold mb-1">Información Adicional</h4>
                      <div className="space-y-1">
                        <div className="flex items-start">
                          <Info className="w-3 h-3 mr-2 text-gray-300 mt-0.5" />
                          <span className="text-xs">DNI: {player?.dni || "No disponible"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-center">
                    <p className="text-xs text-gray-300">
                      Este carnet es personal e intransferible.
                      <br />
                      En caso de pérdida, comunícate con la administración.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
