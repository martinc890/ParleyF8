"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "@/components/mode-toggle"
import { Logo } from "@/components/ui/logo"
import { Menu, Home, Users, Trophy } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const { user, logout } = useAuth()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const closeSheet = () => {
    setIsOpen(false)
  }

  const navigation = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Partidos", href: "/matches", icon: Trophy },
    { name: "Grupos", href: "/groups", icon: Users },
    { name: "Playoffs", href: "/playoffs", icon: Trophy },
  ]

  if (!isMounted) {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Logo />
          </div>
          <div className="hidden md:flex items-center space-x-1 flex-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className="text-sm font-medium"
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                </Button>
              )
            })}
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <nav className="flex items-center space-x-1">
              <ModeToggle />
              {user ? (
                <Button variant="outline" size="sm" onClick={logout}>
                  Cerrar Sesión
                </Button>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">Iniciar Sesión</Link>
                </Button>
              )}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <div className="px-2 py-6">
                    <Logo className="mb-8" />
                    <div className="flex flex-col space-y-3">
                      {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                          <Button
                            key={item.name}
                            variant={isActive ? "secondary" : "ghost"}
                            className="justify-start"
                            onClick={closeSheet}
                            asChild
                          >
                            <Link href={item.href}>
                              <item.icon className="h-5 w-5 mr-2" />
                              {item.name}
                            </Link>
                          </Button>
                        )
                      })}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">{children}</main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 md:h-14">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Parley. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {user.role === "admin" && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/admin/dashboard">Panel Admin</Link>
                  </Button>
                )}
                {user.role === "captain" && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/captain/dashboard">Panel Capitán</Link>
                  </Button>
                )}
                {user.role === "player" && (
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/player/dashboard">Mi Perfil</Link>
                  </Button>
                )}
              </>
            ) : (
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">Iniciar Sesión</Link>
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
