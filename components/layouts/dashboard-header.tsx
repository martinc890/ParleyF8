"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"
import { Home, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import Image from "next/image"

export function DashboardHeader() {
  const { user, logout, isAdmin, isCaptain, isPlayer } = useAuth()
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const getDashboardLink = () => {
    if (isAdmin()) return "/admin/dashboard"
    if (isCaptain()) return "/captain/dashboard"
    if (isPlayer()) return "/player/dashboard"
    return "/"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href={getDashboardLink()} className="flex items-center space-x-2">
            <Image src="/images/parley-logo.png" alt="Parley Logo" width={32} height={32} />
            <span className="hidden font-bold sm:inline-block">PARLEY</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Inicio
              </Link>
            </Button>
            {isAdmin() && (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/dashboard">Dashboard</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/teams">Equipos</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/matches">Partidos</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/events">Eventos</Link>
                </Button>
              </>
            )}
            {isCaptain() && (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/captain/dashboard">Dashboard</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/captain/team">Mi Equipo</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/captain/invitations">Invitaciones</Link>
                </Button>
              </>
            )}
            {isPlayer() && (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/player/dashboard">Dashboard</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/player/card">Mi Carnet</Link>
                </Button>
              </>
            )}
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </nav>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t p-4">
          <nav className="flex flex-col space-y-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/" onClick={toggleMenu}>
                <Home className="h-4 w-4 mr-2" />
                Inicio
              </Link>
            </Button>
            {isAdmin() && (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/dashboard" onClick={toggleMenu}>
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/teams" onClick={toggleMenu}>
                    Equipos
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/matches" onClick={toggleMenu}>
                    Partidos
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/admin/events" onClick={toggleMenu}>
                    Eventos
                  </Link>
                </Button>
              </>
            )}
            {isCaptain() && (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/captain/dashboard" onClick={toggleMenu}>
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/captain/team" onClick={toggleMenu}>
                    Mi Equipo
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/captain/invitations" onClick={toggleMenu}>
                    Invitaciones
                  </Link>
                </Button>
              </>
            )}
            {isPlayer() && (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/player/dashboard" onClick={toggleMenu}>
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/player/card" onClick={toggleMenu}>
                    Mi Carnet
                  </Link>
                </Button>
              </>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                logout()
                toggleMenu()
              }}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
