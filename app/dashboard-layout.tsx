import type React from "react"
import { DashboardHeader } from "@/components/layouts/dashboard-header"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <DashboardHeader />
      <main className="flex-1 container py-6">{children}</main>
    </div>
  )
}
