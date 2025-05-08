"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { ToastAction } from "@/components/ui/toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Save, Download, Upload } from "lucide-react"

// Importamos los datos iniciales
import teamsData from "@/data/teams.json"
import matchesData from "@/data/matches.json"
import eventsData from "@/data/events.json"
import mediaData from "@/data/media.json"

export default function DataEditorPage() {
  const [teams, setTeams] = useState<string>(JSON.stringify(teamsData, null, 2))
  const [matches, setMatches] = useState<string>(JSON.stringify(matchesData, null, 2))
  const [events, setEvents] = useState<string>(JSON.stringify(eventsData, null, 2))
  const [media, setMedia] = useState<string>(JSON.stringify(mediaData, null, 2))
  const [activeTab, setActiveTab] = useState<string>("teams")
  const [error, setError] = useState<string | null>(null)

  // Función para validar JSON
  const validateJson = (json: string): boolean => {
    try {
      JSON.parse(json)
      setError(null)
      return true
    } catch (e) {
      if (e instanceof Error) {
        setError(`JSON inválido: ${e.message}`)
      } else {
        setError("JSON inválido")
      }
      return false
    }
  }

  // Función para guardar los datos
  // En una aplicación real, esto enviaría los datos a una API
  const saveData = (type: string) => {
    let dataToSave: string

    switch (type) {
      case "teams":
        dataToSave = teams
        break
      case "matches":
        dataToSave = matches
        break
      case "events":
        dataToSave = events
        break
      case "media":
        dataToSave = media
        break
      default:
        return
    }

    if (!validateJson(dataToSave)) {
      return
    }

    // En una aplicación real, aquí enviaríamos los datos a una API
    // Por ahora, solo mostramos un mensaje de éxito
    toast({
      title: "Datos guardados",
      description: `Los datos de ${type} se han guardado correctamente.`,
      action: <ToastAction altText="Ok">Ok</ToastAction>,
    })

    // Simulamos la actualización de los datos en la aplicación
    // En una aplicación real, esto requeriría un reinicio o revalidación
    console.log(`Datos de ${type} guardados:`, JSON.parse(dataToSave))
  }

  // Función para exportar los datos como archivo JSON
  const exportData = (type: string) => {
    let dataToExport: string
    let fileName: string

    switch (type) {
      case "teams":
        dataToExport = teams
        fileName = "teams.json"
        break
      case "matches":
        dataToExport = matches
        fileName = "matches.json"
        break
      case "events":
        dataToExport = events
        fileName = "events.json"
        break
      case "media":
        dataToExport = media
        fileName = "media.json"
        break
      default:
        return
    }

    if (!validateJson(dataToExport)) {
      return
    }

    const blob = new Blob([dataToExport], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = fileName
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  // Función para importar datos desde un archivo
  const importData = (type: string) => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "application/json"

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        const content = event.target?.result as string

        try {
          // Validamos que sea un JSON válido
          JSON.parse(content)

          // Actualizamos el estado correspondiente
          switch (type) {
            case "teams":
              setTeams(content)
              break
            case "matches":
              setMatches(content)
              break
            case "events":
              setEvents(content)
              break
            case "media":
              setMedia(content)
              break
          }

          toast({
            title: "Datos importados",
            description: `Los datos de ${type} se han importado correctamente.`,
          })
        } catch (e) {
          setError("El archivo no contiene un JSON válido")
        }
      }

      reader.readAsText(file)
    }

    input.click()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editor de Datos</h1>
          <p className="text-muted-foreground">
            Edita los datos del torneo en formato JSON. Los cambios se aplicarán después de guardar y reiniciar la
            aplicación.
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Datos del Torneo</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="teams" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="teams">Equipos</TabsTrigger>
              <TabsTrigger value="matches">Partidos</TabsTrigger>
              <TabsTrigger value="events">Eventos</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
            </TabsList>

            <TabsContent value="teams" className="mt-4 space-y-4">
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => importData("teams")}>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar
                </Button>
                <Button variant="outline" onClick={() => exportData("teams")}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
                <Button onClick={() => saveData("teams")}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar
                </Button>
              </div>
              <Textarea value={teams} onChange={(e) => setTeams(e.target.value)} className="font-mono h-[500px]" />
            </TabsContent>

            <TabsContent value="matches" className="mt-4 space-y-4">
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => importData("matches")}>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar
                </Button>
                <Button variant="outline" onClick={() => exportData("matches")}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
                <Button onClick={() => saveData("matches")}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar
                </Button>
              </div>
              <Textarea value={matches} onChange={(e) => setMatches(e.target.value)} className="font-mono h-[500px]" />
            </TabsContent>

            <TabsContent value="events" className="mt-4 space-y-4">
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => importData("events")}>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar
                </Button>
                <Button variant="outline" onClick={() => exportData("events")}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
                <Button onClick={() => saveData("events")}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar
                </Button>
              </div>
              <Textarea value={events} onChange={(e) => setEvents(e.target.value)} className="font-mono h-[500px]" />
            </TabsContent>

            <TabsContent value="media" className="mt-4 space-y-4">
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => importData("media")}>
                  <Upload className="mr-2 h-4 w-4" />
                  Importar
                </Button>
                <Button variant="outline" onClick={() => exportData("media")}>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
                <Button onClick={() => saveData("media")}>
                  <Save className="mr-2 h-4 w-4" />
                  Guardar
                </Button>
              </div>
              <Textarea value={media} onChange={(e) => setMedia(e.target.value)} className="font-mono h-[500px]" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instrucciones</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">Cómo editar los datos:</h3>
              <ol className="ml-6 list-decimal space-y-2 mt-2">
                <li>Selecciona la pestaña del tipo de datos que quieres editar.</li>
                <li>Modifica el JSON directamente en el editor.</li>
                <li>Haz clic en "Guardar" para aplicar los cambios.</li>
                <li>Para que los cambios se reflejen en la aplicación, necesitarás hacer un nuevo deploy en Vercel.</li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-medium">Formato de los datos:</h3>
              <ul className="ml-6 list-disc space-y-2 mt-2">
                <li>
                  <strong>Equipos:</strong> Incluye información sobre los equipos, jugadores y estadísticas.
                </li>
                <li>
                  <strong>Partidos:</strong> Contiene detalles de los partidos, resultados y estado.
                </li>
                <li>
                  <strong>Eventos:</strong> Información sobre eventos relacionados con el torneo.
                </li>
                <li>
                  <strong>Media:</strong> Fotos y videos del torneo.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium">Flujo de trabajo recomendado:</h3>
              <ol className="ml-6 list-decimal space-y-2 mt-2">
                <li>Exporta los datos actuales.</li>
                <li>Edítalos en tu editor de texto preferido.</li>
                <li>Importa los datos actualizados.</li>
                <li>Verifica que el JSON sea válido.</li>
                <li>Guarda los cambios.</li>
                <li>Haz commit de los archivos JSON en GitHub.</li>
                <li>Despliega nuevamente la aplicación en Vercel.</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
