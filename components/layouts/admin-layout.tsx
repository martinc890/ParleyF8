"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth/auth-provider"
import {
  LayoutDashboard,
  Users,
  Calendar,
  ImageIcon,
  Music,
  Settings,
  LogOut,
  User,
  Database,
  ClubIcon as Football,
} from "lucide-react"

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Partidos", href: "/admin/matches", icon: Football },
    { name: "Equipos", href: "/admin/teams", icon: Users },
    { name: "Jugadores", href: "/admin/players", icon: User },
    { name: "Galería", href: "/admin/media", icon: ImageIcon },
    { name: "Eventos", href: "/admin/events", icon: Music },
    { name: "Calendario", href: "/admin/calendar", icon: Calendar },
    { name: "Editor de Datos", href: "/admin/data-editor", icon: Database },
    { name: "Configuración", href: "/admin/settings", icon: Settings },
  ]

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 border-r bg-black">
        <div className="flex items-center gap-2 px-4 py-6">
          <div className="w-8 h-8 overflow-hidden">
            <Image
              src="/images/parley-logo.png"
              width={32}
              height={32}
              alt="PARLEY"
              className="w-full h-full object-contain"
            />
          </div>
          <span className="font-bold text-white">PARLEY Admin</span>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
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
        </nav>

        <div className="p-4 border-t border-gray-800">
          <Button variant="outline" className="w-full" onClick={logout}>
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-40 flex items-center justify-between w-full h-16 px-4 border-b bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
          <div className="md:hidden flex items-center gap-2">
            <div className="w-8 h-8 overflow-hidden">
              <Image
                src="/images/parley-logo.png"
                width={32}
                height={32}
                alt="PARLEY"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-bold text-white">PARLEY Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button variant="outline" size="sm" asChild>
              <Link href="/">Ver Sitio Público</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </header>

        {/* Mobile navigation */}
        <div className="md:hidden flex overflow-x-auto border-b bg-black">
          <div className="flex px-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center justify-center px-4 py-2 text-xs font-medium ${
                  pathname === item.href ? "text-white border-b-2 border-white" : "text-gray-400"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <main className="flex-1 p-4 md:p-6">{children}</main>

        <footer className="py-4 border-t bg-black">
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
                <span className="text-sm font-medium text-white">PARLEY - Panel de Administración 2023</span>
              </div>
              <div className="text-sm text-gray-400">
                &copy; {new Date().getFullYear()} Todos los derechos reservados.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
