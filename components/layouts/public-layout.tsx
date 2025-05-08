"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"
import {
  Home,
  Calendar,
  Trophy,
  Users,
  ImageIcon,
  Music,
  Menu,
  X,
  LogIn,
  LogOut,
  ClubIcon as Football,
} from "lucide-react"

interface PublicLayoutProps {
  children: React.ReactNode
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout, isAdmin } = useAuth()

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  const navItems = [
    { name: "Inicio", href: "/", icon: Home },
    { name: "Partidos", href: "/matches", icon: Football },
    { name: "Grupos", href: "/groups", icon: Users },
    { name: "Playoffs", href: "/playoffs", icon: Trophy },
    { name: "Galería", href: "/media", icon: ImageIcon },
    { name: "Eventos", href: "/events", icon: Music },
    { name: "Calendario", href: "/calendar", icon: Calendar },
  ]

  // Reordenar los elementos para el menú móvil (poner Inicio en el medio)
  const mobileNavItems = [
    navItems[1], // Partidos
    navItems[2], // Grupos
    navItems[0], // Inicio (ahora en el medio)
    navItems[3], // Playoffs
    navItems[4], // Galería
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-black backdrop-blur supports-[backdrop-filter]:bg-black/80">
        <div className="container flex items-center justify-between h-16 px-4 mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 overflow-hidden">
              <Image
                src="/images/parley-logo.png"
                width={40}
                height={40}
                alt="PARLEY"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="hidden font-bold text-white sm:inline-block">PARLEY</span>
          </Link>

          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-colors hover:text-white ${
                    pathname === item.href ? "text-white" : "text-gray-400"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <ModeToggle />
              {isAdmin() ? (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/admin/dashboard">Admin</Link>
                  </Button>
                  <Button variant="outline" size="sm" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Salir
                  </Button>
                </>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">
                    <LogIn className="w-4 h-4 mr-2" />
                    Admin
                  </Link>
                </Button>
              )}
              <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-30 bg-black md:hidden pt-16 fade-in">
          <nav className="container flex flex-col gap-4 p-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                  pathname === item.href ? "bg-gray-800 text-white" : "hover:bg-gray-800 text-gray-300"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-800">
              {isAdmin() ? (
                <>
                  <Button className="w-full mb-2 bg-white text-black hover:bg-gray-200" asChild>
                    <Link href="/admin/dashboard">Panel de Administración</Link>
                  </Button>
                  <Button variant="outline" className="w-full" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </>
              ) : (
                <Button className="w-full bg-white text-black hover:bg-gray-200" asChild>
                  <Link href="/login">
                    <LogIn className="w-4 h-4 mr-2" />
                    Admin
                  </Link>
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="py-6 border-t bg-black">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 overflow-hidden">
                <Image
                  src="/images/parley-logo.png"
                  width={24}
                  height={24}
                  alt="PARLEY"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-sm font-medium text-white">PARLEY - Torneo de Fútbol 2023</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-white">
                Política de Privacidad
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-white">
                Términos de Servicio
              </Link>
              <Link href="/contact" className="text-sm text-gray-400 hover:text-white">
                Contacto
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Bottom navigation for mobile */}
      <div className="sticky bottom-0 z-40 md:hidden border-t bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
        <div className="grid grid-cols-5 h-16">
          {mobileNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 text-xs font-medium ${
                pathname === item.href ? "text-white" : "text-gray-400"
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
