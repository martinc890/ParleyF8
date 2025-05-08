"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, Save, Download, Upload, Trash, RefreshCw, Share2, QrCode } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import {
  saveDataToLocalStorage,
  loadDataFromLocalStorage,
  clearAllData,
  exportAllData,
  importAllData,
} from "@/lib/data-service"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")
  const [isResetting, setIsResetting] = useState(false)
  const [isClearing, setIsClearing] = useState(false)
  const [showQrCode, setShowQrCode] = useState(false)
  const [importText, setImportText] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const { toast } = useToast()

  // Configuración general
  const [tournamentName, setTournamentName] = useState("Football Tournament 2023")
  const [tournamentDescription, setTournamentDescription] = useState("Torneo oficial de fútbol")
  const [primaryColor, setPrimaryColor] = useState("#000000")
  const [enableDarkMode, setEnableDarkMode] = useState(true)

  // Load settings from localStorage when component mounts
  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem("tournament_settings")
      if (storedSettings) {
        const settings = JSON.parse(storedSettings)
        setTournamentName(settings.tournamentName || "Football Tournament 2023")
        setTournamentDescription(settings.tournamentDescription || "Torneo oficial de fútbol")
        setPrimaryColor(settings.primaryColor || "#000000")
        setEnableDarkMode(settings.enableDarkMode !== undefined ? settings.enableDarkMode : true)
      }
      setIsLoaded(true)
    } catch (error) {
      console.error("Error loading settings:", error)
      setIsLoaded(true)
    }
  }, [])

  // Función para limpiar todos los datos
  const handleClearAllData = () => {
    if (
      confirm(
        "¿Estás seguro de que deseas eliminar TODOS los datos? Esta acción no se puede deshacer y eliminará todos los equipos, jugadores, partidos, eventos y media.",
      )
    ) {
      setIsClearing(true)

      try {
        // Limpiar todos los datos
        clearAllData()

        toast({
          title: "Datos eliminados",
          description: "Todos los datos han sido eliminados correctamente.",
        })

        // Recargar la página para reflejar los cambios
        window.location.reload()
      } catch (error) {
        toast({
          title: "Error",
          description: "Ocurrió un error al eliminar los datos.",
          variant: "destructive",
        })
      } finally {
        setIsClearing(false)
      }
    }
  }

  // Configuración de datos
  const handleResetData = () => {
    if (confirm("¿Estás seguro de que deseas restablecer todos los datos? Esta acción no se puede deshacer.")) {
      setIsResetting(true)

      try {
        // Limpiar localStorage
        localStorage.removeItem("football_teams")
        localStorage.removeItem("football_players")
        localStorage.removeItem("football_matches")
        localStorage.removeItem("football_events")
        localStorage.removeItem("football_media")
        localStorage.removeItem("football_calendar")

        // Recargar datos iniciales
        loadDataFromLocalStorage()

        toast({
          title: "Datos restablecidos",
          description: "Todos los datos han sido restablecidos a los valores iniciales.",
        })

        // Recargar la página para reflejar los cambios
        window.location.reload()
      } catch (error) {
        toast({
          title: "Error",
          description: "Ocurrió un error al restablecer los datos.",
          variant: "destructive",
        })
      } finally {
        setIsResetting(false)
      }
    }
  }

  const handleExportData = () => {
    try {
      const jsonData = exportAllData()
      const blob = new Blob([jsonData], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "parley_tournament_data.json"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast({
        title: "Datos exportados",
        description: "Los datos han sido exportados correctamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al exportar los datos.",
        variant: "destructive",
      })
    }
  }

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const jsonData = event.target?.result as string
        const success = importAllData(jsonData)

        if (success) {
          toast({
            title: "Datos importados",
            description: "Los datos han sido importados correctamente.",
          })
          // Recargar la página para reflejar los cambios
          window.location.reload()
        } else {
          toast({
            title: "Error",
            description: "El archivo no contiene datos válidos.",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Ocurrió un error al importar los datos.",
          variant: "destructive",
        })
      }
    }

    reader.readAsText(file)
  }

  const handleImportFromText = () => {
    try {
      const success = importAllData(importText)

      if (success) {
        toast({
          title: "Datos importados",
          description: "Los datos han sido importados correctamente.",
        })
        setImportText("")
        // Recargar la página para reflejar los cambios
        window.location.reload()
      } else {
        toast({
          title: "Error",
          description: "El texto no contiene datos válidos.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al importar los datos.",
        variant: "destructive",
      })
    }
  }

  const handleShareData = () => {
    try {
      const jsonData = exportAllData()

      if (navigator.share) {
        navigator
          .share({
            title: "PARLEY - Datos del Torneo",
            text: "Aquí están los datos del torneo PARLEY",
            url: "data:application/json;base64," + btoa(jsonData),
          })
          .then(() => {
            toast({
              title: "Compartido",
              description: "Los datos han sido compartidos correctamente.",
            })
          })
          .catch((error) => {
            console.error("Error sharing:", error)
            // Fallback
            navigator.clipboard.writeText(jsonData)
            toast({
              title: "Datos copiados",
              description: "Los datos han sido copiados al portapapeles.",
            })
          })
      } else {
        // Fallback para navegadores que no soportan Web Share API
        navigator.clipboard.writeText(jsonData)
        toast({
          title: "Datos copiados",
          description: "Los datos han sido copiados al portapapeles.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al compartir los datos.",
        variant: "destructive",
      })
    }
  }

  const handleSaveSettings = () => {
    try {
      // Guardar configuración en localStorage
      localStorage.setItem(
        "tournament_settings",
        JSON.stringify({
          tournamentName,
          tournamentDescription,
          primaryColor,
          enableDarkMode,
        }),
      )

      toast({
        title: "Configuración guardada",
        description: "La configuración ha sido guardada correctamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar la configuración.",
        variant: "destructive",
      })
    }
  }

  if (!isLoaded) {
    return <div>Cargando configuración...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Configuración</h1>
          <p className="text-muted-foreground">Administra la configuración de la aplicación</p>
        </div>
        <Button onClick={handleSaveSettings} className="bg-white text-black hover:bg-gray-200">
          <Save className="w-4 h-4 mr-2" />
          Guardar Cambios
        </Button>
      </div>

      <Tabs defaultValue="general" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="data">Datos</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
              <CardDescription>Configura los ajustes generales de la aplicación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="tournament-name">Nombre del Torneo</Label>
                <Input
                  id="tournament-name"
                  value={tournamentName}
                  onChange={(e) => setTournamentName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tournament-description">Descripción</Label>
                <Textarea
                  id="tournament-description"
                  value={tournamentDescription}
                  onChange={(e) => setTournamentDescription(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="primary-color">Color Primario</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="primary-color"
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-12 h-10 p-1"
                  />
                  <Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1" />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="dark-mode" checked={enableDarkMode} onCheckedChange={setEnableDarkMode} />
                <Label htmlFor="dark-mode">Habilitar Modo Oscuro</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Configuración de la Aplicación</CardTitle>
              <CardDescription>Configura el comportamiento de la aplicación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <Select defaultValue="es">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar idioma" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Zona Horaria</Label>
                <Select defaultValue="america-mexico">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar zona horaria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="america-mexico">América/Ciudad de México</SelectItem>
                    <SelectItem value="america-new_york">América/Nueva York</SelectItem>
                    <SelectItem value="europe-madrid">Europa/Madrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Sincronización entre Dispositivos</CardTitle>
              <CardDescription>Transfiere datos entre dispositivos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-yellow-50 text-yellow-800 border-yellow-200">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Importante</AlertTitle>
                <AlertDescription>
                  Los datos se guardan localmente en este dispositivo. Para usar los mismos datos en otro dispositivo,
                  debes exportarlos aquí e importarlos en el otro dispositivo.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Exportar Datos</h3>
                  <p className="text-sm text-muted-foreground">
                    Exporta todos los datos para transferirlos a otro dispositivo o hacer una copia de seguridad.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button onClick={handleExportData} className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Descargar Datos (JSON)
                    </Button>
                    <Button onClick={handleShareData} className="w-full">
                      <Share2 className="w-4 h-4 mr-2" />
                      Compartir Datos
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Importar Datos</h3>
                  <p className="text-sm text-muted-foreground">
                    Importa datos desde un archivo JSON o texto copiado de otro dispositivo.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button onClick={() => document.getElementById("file-upload")?.click()} className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Importar desde Archivo
                    </Button>
                    <input id="file-upload" type="file" accept=".json" onChange={handleImportData} className="hidden" />
                    <Button onClick={() => setShowQrCode(true)} className="w-full">
                      <QrCode className="w-4 h-4 mr-2" />
                      Importar desde Texto
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gestión de Datos</CardTitle>
              <CardDescription>Administra los datos de la aplicación</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Peligro</AlertTitle>
                <AlertDescription>
                  Las siguientes acciones son irreversibles y pueden resultar en pérdida de datos.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2">
                <Button variant="destructive" onClick={handleResetData} disabled={isResetting} className="w-full">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {isResetting ? "Restableciendo..." : "Restablecer Datos"}
                </Button>

                <Button variant="destructive" onClick={handleClearAllData} disabled={isClearing} className="w-full">
                  <Trash className="w-4 h-4 mr-2" />
                  {isClearing ? "Eliminando..." : "Eliminar Todos los Datos"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sincronización</CardTitle>
              <CardDescription>Configura la sincronización de datos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch id="auto-sync" defaultChecked />
                <Label htmlFor="auto-sync">Sincronización Automática</Label>
              </div>

              <p className="text-sm text-muted-foreground">
                La sincronización automática guarda los cambios en el almacenamiento local del navegador. Para una
                persistencia completa, exporta regularmente los datos.
              </p>

              <Button variant="outline" className="w-full" onClick={() => saveDataToLocalStorage()}>
                <Save className="w-4 h-4 mr-2" />
                Sincronizar Ahora
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal para importar datos desde texto */}
      <Dialog open={showQrCode} onOpenChange={setShowQrCode}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Importar Datos desde Texto</DialogTitle>
            <DialogDescription>
              Pega el texto JSON exportado desde otro dispositivo para importar los datos.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Pega aquí el texto JSON exportado..."
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              className="min-h-[200px]"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowQrCode(false)}>
                Cancelar
              </Button>
              <Button onClick={handleImportFromText} disabled={!importText}>
                Importar Datos
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
