import { NextResponse } from "next/server"
import { setupAdminUser } from "@/lib/user-service"

export async function GET() {
  try {
    await setupAdminUser()
    return NextResponse.json({ success: true, message: "Admin user setup completed" })
  } catch (error: any) {
    console.error("Error setting up admin user:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Error setting up admin user" },
      { status: 500 },
    )
  }
}
