"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { User, UserRole } from "@/lib/auth-types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role?: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  error: string | null
  isAdmin: () => boolean
  isCaptain: () => boolean
  isPlayer: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const router = useRouter()

  // Cargar usuario del localStorage al iniciar
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
      setIsInitialized(true)
    } catch (e) {
      console.error("Error accessing localStorage:", e)
      setIsInitialized(true)
    }
  }, [])

  const login = async (email: string, password: string, role = "admin"): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      // Simulación de login
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Validación simple
      if (email.length < 5 || !email.includes("@") || password.length < 4) {
        throw new Error("Credenciales inválidas")
      }

      // Crear usuario según el rol seleccionado
      let newUser: User

      if (role === "admin") {
        newUser = {
          id: "admin-1",
          name: "Administrador",
          email,
          role: "admin" as UserRole,
          teamId: null,
        }
      } else if (role === "captain") {
        newUser = {
          id: "captain-1",
          name: "Capitán Equipo A",
          email,
          role: "captain" as UserRole,
          teamId: "team-1",
        }
      } else {
        // Default to player
        newUser = {
          id: "player-1",
          name: "Jugador Ejemplo",
          email,
          role: "player" as UserRole,
          teamId: "team-1",
        }
      }

      // Guardar en localStorage
      try {
        localStorage.setItem("user", JSON.stringify(newUser))
      } catch (e) {
        console.error("Error saving to localStorage:", e)
      }

      setUser(newUser)
      setIsLoading(false)
      return true
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión")
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    try {
      localStorage.removeItem("user")
    } catch (e) {
      console.error("Error removing from localStorage:", e)
    }
    setUser(null)
    router.push("/")
  }

  const isAdmin = () => {
    return user?.role === "admin"
  }

  const isCaptain = () => {
    return user?.role === "captain"
  }

  const isPlayer = () => {
    return user?.role === "player"
  }

  if (!isInitialized) {
    return <div>Cargando...</div>
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, error, isAdmin, isCaptain, isPlayer }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
