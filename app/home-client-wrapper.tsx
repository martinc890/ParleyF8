"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"

// Import the client component with dynamic to avoid SSR
const ClientHome = dynamic(() => import("@/components/home/client-home"), {
  ssr: false,
  loading: () => <p className="p-4 text-center">Cargando...</p>,
})

export default function HomeClientWrapper() {
  return (
    <Suspense fallback={<p className="p-4 text-center">Cargando...</p>}>
      <ClientHome />
    </Suspense>
  )
}
