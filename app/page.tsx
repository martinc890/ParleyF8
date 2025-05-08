import { Suspense } from "react"
import Image from "next/image"
import PublicLayout from "@/components/layouts/public-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import HomeClientWrapper from "./home-client-wrapper"

function HomeLoading() {
  return (
    <PublicLayout>
      <div className="container px-4 py-4 mx-auto space-y-6 md:py-8 md:space-y-12">
        {/* Hero Section - Optimizado para móvil */}
        <div className="relative overflow-hidden rounded-xl border bg-black">
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40 z-10" />
          <div className="h-[200px] sm:h-[250px] md:h-[400px] bg-black" />
          <div className="absolute inset-0 z-20 flex flex-col justify-center p-4 sm:p-8">
            <div className="space-y-2 sm:space-y-4 max-w-2xl transition-all duration-700 delay-300">
              <div className="flex items-center gap-3 mb-2 sm:gap-4 sm:mb-4">
                <div className="w-12 h-12 sm:w-20 sm:h-20 overflow-hidden">
                  <Image
                    src="/images/parley-logo.png"
                    width={80}
                    height={80}
                    alt="PARLEY"
                    className="w-full h-full object-contain"
                  />
                </div>
                <h1 className="text-xl font-bold text-white sm:text-3xl md:text-5xl">PARLEY</h1>
              </div>
              <h2 className="text-lg font-bold text-white sm:text-2xl md:text-3xl">Torneo de Fútbol 2023</h2>
              <p className="text-sm text-white/90 sm:text-base md:text-lg">
                Bienvenido a la aplicación oficial del torneo. Consulta partidos, equipos y eventos.
              </p>
              <div className="flex flex-wrap gap-2 pt-2 sm:gap-4 sm:pt-4">
                <Button size="sm" asChild className="bg-white text-black hover:bg-gray-200 sm:size-lg">
                  <Link href="/matches">Ver Partidos</Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white sm:size-lg"
                  asChild
                >
                  <Link href="/teams">Explorar Equipos</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Sections - Loading placeholders */}
        <div className="grid gap-4 sm:gap-8 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-base sm:text-lg">Próximos Partidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 flex items-center justify-center">
                <p className="text-muted-foreground">Cargando partidos...</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-base sm:text-lg">Clasificación de Grupos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-40 flex items-center justify-center">
                <p className="text-muted-foreground">Cargando grupos...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PublicLayout>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<HomeLoading />}>
      <HomeClientWrapper />
    </Suspense>
  )
}
