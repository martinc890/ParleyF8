"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmptyState } from "@/components/ui/empty-state"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { getCalendarItems } from "@/lib/mongodb-service"

// Función para generar los días del calendario para un mes
const generateCalendarDays = (month: number, year: number) => {
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // Crear array para los días del mes
  const days = []

  // Agregar celdas vacías para los días antes del primer día del mes
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push({ day: null, date: null })
  }

  // Agregar días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    days.push({ day, date })
  }

  return days
}

export default function CalendarView() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [filter, setFilter] = useState("all")
  const [calendarItems, setCalendarItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const monthName = new Date(currentYear, currentMonth, 1).toLocaleString("default", { month: "long" })
  const calendarDays = generateCalendarDays(currentMonth, currentYear)

  useEffect(() => {
    const loadCalendarItems = async () => {
      try {
        setIsLoading(true)
        const items = await getCalendarItems()
        setCalendarItems(items)
      } catch (error) {
        console.error("Error loading calendar items:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCalendarItems()
  }, [])

  // Filtrar elementos del calendario según el mes actual y el filtro seleccionado
  const filteredItems = calendarItems.filter((item) => {
    // Verificar si la fecha corresponde al mes y año actual
    const itemDate = new Date(item.date)
    const isCurrentMonth = itemDate.getMonth() === currentMonth && itemDate.getFullYear() === currentYear

    if (!isCurrentMonth) return false

    // Aplicar filtro por tipo
    if (filter === "matches" && item.itemType !== "match") return false
    if (filter === "events" && item.itemType !== "event") return false

    return true
  })

  // Agrupar elementos por fecha
  const itemsByDate = filteredItems.reduce(
    (acc, item) => {
      if (!acc[item.date]) {
        acc[item.date] = []
      }
      acc[item.date].push(item)
      return acc
    },
    {} as Record<string, typeof filteredItems>,
  )

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={handlePrevMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-xl font-bold">
                {monthName} {currentYear}
              </div>
              <Button variant="outline" size="icon" onClick={handleNextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            <div>
              <Select defaultValue="all" onValueChange={setFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filtrar eventos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Eventos</SelectItem>
                  <SelectItem value="matches">Solo Partidos</SelectItem>
                  <SelectItem value="events">Solo Eventos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 mb-2 text-center">
            <div className="font-medium">Dom</div>
            <div className="font-medium">Lun</div>
            <div className="font-medium">Mar</div>
            <div className="font-medium">Mié</div>
            <div className="font-medium">Jue</div>
            <div className="font-medium">Vie</div>
            <div className="font-medium">Sáb</div>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`min-h-[120px] border rounded-md p-1 ${day.day ? "bg-card" : "bg-muted/20"} overflow-hidden`}
              >
                {day.day && (
                  <>
                    <div className="text-sm font-medium">{day.day}</div>
                    <div className="mt-1 space-y-1">
                      {itemsByDate[day.date]?.map((item, itemIndex) => (
                        <Link
                          key={`${item._id}-${itemIndex}`}
                          href={item.itemType === "match" ? `/matches/${item._id}` : `/events/${item._id}`}
                        >
                          <div className="p-1 text-xs truncate rounded hover:bg-muted">
                            <div className="flex items-center gap-1">
                              <div
                                className={`w-2 h-2 rounded-full ${item.itemType === "match" ? "bg-primary" : "bg-orange-500"}`}
                              />
                              <span>{item.time}</span>
                            </div>
                            <div className="truncate">
                              {item.itemType === "match"
                                ? `${item.homeTeam?.name || "Local"} vs ${item.awayTeam?.name || "Visitante"}`
                                : item.title}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {isLoading ? (
            <div className="mt-8 text-center py-8">
              <p>Cargando eventos del calendario...</p>
            </div>
          ) : (
            Object.keys(itemsByDate).length === 0 && (
              <div className="mt-8">
                <EmptyState
                  icon={Calendar}
                  title="No hay eventos en este mes"
                  description="Los partidos y eventos aparecerán aquí una vez que sean programados."
                />
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  )
}
