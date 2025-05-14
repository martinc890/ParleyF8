"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle, Database, RefreshCw } from "lucide-react"
import { migrateDataToSupabase } from "@/lib/supabase-service"
import DashboardLayout from "@/app/dashboard-layout"

export default function MigratePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleMigrate = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      const success = await migrateDataToSupabase()

      if (success) {
        setResult({
          success: true,
          message: "Los datos se han migrado correctamente a Supabase.",
        })
      } else {
        setResult({
          success: false,
          message: "Ha ocurrido un error durante la migración. Por favor, revisa la consola para más detalles.",
        })
      }
    } catch (error) {
      console.error("Error during migration:", error)
      setResult({
        success: false,
        message: "Ha ocurrido un error durante la migración. Por favor, revisa la consola para más detalles.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Migración de Datos</h1>
          <p className="text-muted-foreground">Migra los datos de localStorage a Supabase</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Migración a Supabase</CardTitle>
            <CardDescription>
              Esta herramienta migrará todos los datos almacenados localmente (equipos, jugadores, partidos, etc.) a la
              base de datos de Supabase.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Importante</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Esta operación puede tardar varios minutos dependiendo de la cantidad de datos.</li>
                <li>No cierres ni recargues esta página durante el proceso de migración.</li>
                <li>
                  Se recomienda realizar esta operación una sola vez para evitar duplicados. Si necesitas volver a
                  migrar, primero limpia la base de datos.
                </li>
                <li>
                  Los datos migrados incluyen: equipos, jugadores, partidos, eventos de partidos, eventos y medios.
                </li>
              </ul>
            </div>

            {result && (
              <Alert variant={result.success ? "default" : "destructive"}>
                {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                <AlertTitle>{result.success ? "Éxito" : "Error"}</AlertTitle>
                <AlertDescription>{result.message}</AlertDescription>
              </Alert>
            )}

            <Button onClick={handleMigrate} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Migrando datos...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Iniciar Migración
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
