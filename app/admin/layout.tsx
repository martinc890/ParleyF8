import type React from "react"
import type { Metadata } from "next"
import AdminLayout from "@/components/layouts/admin-layout"

export const metadata: Metadata = {
  title: "Admin Dashboard - Football Tournament App",
  description: "Admin dashboard for managing the football tournament",
}

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}
