"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { User, AuthState } from "@/lib/auth-types"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isAdmin: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  })

  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if user is stored in localStorage
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        const user = JSON.parse(storedUser) as User
        setAuthState({
          user,
          isLoading: false,
          error: null,
        })
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          error: null,
        })
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error)
      setAuthState({
        user: null,
        isLoading: false,
        error: "Error loading user data",
      })
    }
  }, [])

  // Protect admin routes
  useEffect(() => {
    if (!authState.isLoading && pathname?.startsWith("/admin")) {
      if (!authState.user) {
        router.push("/login")
      } else if (authState.user.role !== "admin") {
        router.push("/")
      }
    }
  }, [authState.isLoading, authState.user, pathname, router])

  const login = async (email: string, password: string) => {
    setAuthState({
      ...authState,
      isLoading: true,
      error: null,
    })

    try {
      // Solo permitir login para el admin
      if (email === "martincarbajal890@gmail.com" && password === "password") {
        const user: User = {
          id: "1",
          email: "martincarbajal890@gmail.com",
          name: "Admin User",
          role: "admin",
        }

        localStorage.setItem("user", JSON.stringify(user))

        setAuthState({
          user,
          isLoading: false,
          error: null,
        })

        router.push("/admin/dashboard")
      } else {
        setAuthState({
          user: null,
          isLoading: false,
          error: "Credenciales inválidas. Solo el administrador puede iniciar sesión.",
        })
      }
    } catch (error) {
      setAuthState({
        user: null,
        isLoading: false,
        error: "Ocurrió un error durante el inicio de sesión",
      })
    }
  }

  const logout = () => {
    try {
      localStorage.removeItem("user")
      setAuthState({
        user: null,
        isLoading: false,
        error: null,
      })
      router.push("/")
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  const isAdmin = () => {
    return authState.user?.role === "admin"
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        isAdmin,
      }}
    >
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
