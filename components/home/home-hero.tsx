"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Trophy } from "lucide-react"

export default function HomeHero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className={`relative overflow-hidden rounded-xl ${isVisible ? "fade-in" : "opacity-0"}`}>
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/40 z-10" />
      <Image
        src="/placeholder.svg?height=500&width=1200"
        width={1200}
        height={500}
        alt="Football tournament"
        className="object-cover w-full h-[250px] sm:h-[300px] md:h-[400px]"
        priority
      />
      <div className="absolute inset-0 z-20 flex flex-col justify-center p-4 sm:p-6 md:p-8">
        <div
          className={`space-y-3 md:space-y-4 max-w-2xl transition-all duration-700 delay-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
        >
          <h1 className="text-2xl font-bold text-white sm:text-3xl md:text-5xl">Summer Football Tournament 2023</h1>
          <p className="text-sm text-white/90 sm:text-base md:text-lg">
            Join us for the most exciting football tournament of the year. 16 teams competing for the championship
            trophy.
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-4 pt-2">
            <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 text-xs sm:text-sm bg-white/20 backdrop-blur-sm rounded-full text-white">
              <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>June 1 - July 15, 2023</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 text-xs sm:text-sm bg-white/20 backdrop-blur-sm rounded-full text-white">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>City Stadium, Downtown</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 text-xs sm:text-sm bg-white/20 backdrop-blur-sm rounded-full text-white">
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>16 Teams</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-4 pt-3 sm:pt-4">
            <Button size="sm" className="text-xs sm:text-sm" asChild>
              <Link href="/matches">View Matches</Link>
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="text-xs sm:text-sm bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
              asChild
            >
              <Link href="/teams">Explore Teams</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
