"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { User, UserRole } from "@/lib/auth-types"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: UserRole) => Promise<boolean>
  logout: () => void
  isAdmin: () => boolean
  isCaptain: () => boolean
  isPlayer: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("user")
      }
    }
  }, [])

  const login = async (email: string, password: string, role: UserRole): Promise<boolean> => {
    // In a real app, this would be an API call
    // For demo purposes, we'll just simulate a successful login
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      let mockUser: User

      if (role === "admin") {
        mockUser = {
          id: "admin-123",
          name: "Admin User",
          email,
          role: "admin",
        }
      } else if (role === "captain") {
        mockUser = {
          id: "captain-123",
          name: "Captain User",
          email,
          role: "captain",
          teamId: "team-1", // Asignamos el equipo 1 al capitán
        }
      } else {
        mockUser = {
          id: "player-123",
          name: "Player User",
          email,
          role: "player",
          teamId: "team-2", // Asignamos el equipo 2 al jugador
        }
      }

      setUser(mockUser)

      // Store user in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(mockUser))
      }

      // Redirect based on role
      if (role === "admin") {
        router.push("/admin/dashboard")
      } else if (role === "captain") {
        router.push("/captain/dashboard")
      } else {
        router.push("/player/dashboard")
      }

      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
    }
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

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isCaptain, isPlayer }}>
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
