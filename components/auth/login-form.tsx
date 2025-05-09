"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Trophy } from "lucide-react"
import { useAuth } from "./auth-provider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [activeTab, setActiveTab] = useState("player")
  const router = useRouter()
  const { login, isLoading, error } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const success = await login(email, password, activeTab)

    if (success) {
      // Redirect based on role
      if (activeTab === "admin") {
        router.push("/admin/dashboard")
      } else if (activeTab === "captain") {
        router.push("/captain/dashboard")
      } else {
        router.push("/player/dashboard")
      }
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-2 text-center">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl">Acceso a la Plataforma</CardTitle>
        <CardDescription>Inicia sesión para acceder a tu cuenta</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="player" className="w-full mb-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="player">Jugador</TabsTrigger>
            <TabsTrigger value="captain">Capitán</TabsTrigger>
            <TabsTrigger value="admin">Organizador</TabsTrigger>
          </TabsList>
        </Tabs>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
