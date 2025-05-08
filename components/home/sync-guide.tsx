"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, X } from "lucide-react"
import Link from "next/link"

export default function SyncGuide() {
  const [isVisible, setIsVisible] = useState(true)
  const [isClient, setIsClient] = useState(false)

  // Set isClient to true when component mounts (client-side only)
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Check if guide has been seen before (client-side only)
  useEffect(() => {
    if (isClient) {
      try {
        const hasSeenGuide = localStorage.getItem("has_seen_sync_guide")
        if (hasSeenGuide) {
          setIsVisible(false)
        }
      } catch (error) {
        console.error("Error accessing localStorage:", error)
      }
    }
  }, [isClient])

  const handleDismiss = () => {
    try {
      localStorage.setItem("has_seen_sync_guide", "true")
      setIsVisible(false)
    } catch (error) {
      console.error("Error setting localStorage:", error)
      // Still hide the guide even if localStorage fails
      setIsVisible(false)
    }
  }

  // Don't render anything during SSR or if guide should be hidden
  if (!isClient || !isVisible) return null

  return (
    <Card className="relative border-yellow-200 bg-yellow-50">
      <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-gray-500" onClick={handleDismiss}>
        <X className="h-4 w-4" />
      </Button>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2 text-yellow-800">
          <AlertCircle className="h-4 w-4" />
          Información Importante
        </CardTitle>
        <CardDescription className="text-yellow-700">Sincronización entre dispositivos</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-yellow-800">
        <p className="mb-3">
          Los datos se guardan localmente en este dispositivo. Si estás usando múltiples dispositivos, necesitarás
          sincronizar tus datos manualmente.
        </p>
        <Button size="sm" asChild className="bg-yellow-600 hover:bg-yellow-700 text-white">
          <Link href="/admin/settings">Ver Opciones de Sincronización</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
