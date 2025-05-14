"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase-client"
import type { User } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAdmin: () => boolean
  isCaptain: () => boolean
  isPlayer: () => boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Verificar sesión al cargar
  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          // Obtener datos del usuario desde la tabla de perfiles
          const { data: profileData, error: profileError } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single()

          if (profileError) {
            console.error("Error fetching user profile:", profileError)
            await supabase.auth.signOut()
            setLoading(false)
            return
          }

          setUser({
            id: session.user.id,
            email: session.user.email || "",
            name: `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim(),
            role: profileData.role,
            teamId: profileData.team_id,
          })
        }
      } catch (error) {
        console.error("Error checking session:", error)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    // Suscribirse a cambios de autenticación
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        // Obtener datos del usuario desde la tabla de perfiles
        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (profileError) {
          console.error("Error fetching user profile:", profileError)
          await supabase.auth.signOut()
          return
        }

        const userData: User = {
          id: session.user.id,
          email: session.user.email || "",
          name: `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim(),
          role: profileData.role,
          teamId: profileData.team_id,
        }

        setUser(userData)

        // Redirigir según el rol
        if (userData.role === "admin") {
          router.push("/admin/dashboard")
        } else if (userData.role === "captain") {
          router.push("/captain/dashboard")
        } else {
          router.push("/player/dashboard")
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        router.push("/")
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast({
          title: "Error de inicio de sesión",
          description: error.message,
          variant: "destructive",
        })
        return false
      }

      if (data.user) {
        // Obtener datos del usuario desde la tabla de perfiles
        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single()

        if (profileError) {
          toast({
            title: "Error",
            description: "No se pudo obtener el perfil del usuario",
            variant: "destructive",
          })
          await supabase.auth.signOut()
          return false
        }

        const userData: User = {
          id: data.user.id,
          email: data.user.email || "",
          name: `${profileData.first_name || ""} ${profileData.last_name || ""}`.trim(),
          role: profileData.role,
          teamId: profileData.team_id,
        }

        setUser(userData)

        toast({
          title: "Inicio de sesión exitoso",
          description: `Bienvenido, ${userData.name}`,
        })

        // Redirigir según el rol
        if (userData.role === "admin") {
          router.push("/admin/dashboard")
        } else if (userData.role === "captain") {
          router.push("/captain/dashboard")
        } else {
          router.push("/player/dashboard")
        }

        return true
      }

      return false
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error durante el inicio de sesión",
        variant: "destructive",
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      router.push("/")
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      })
    } catch (error: any) {
      console.error("Logout error:", error)
      toast({
        title: "Error",
        description: error.message || "Ocurrió un error al cerrar sesión",
        variant: "destructive",
      })
    }
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
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isCaptain, isPlayer, loading }}>
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
