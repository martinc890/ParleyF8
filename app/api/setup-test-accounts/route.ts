import { NextResponse } from "next/server"
import { getSupabaseAdmin } from "@/lib/supabase-client"
import { teamService } from "@/lib/supabase-service"

export async function GET() {
  try {
    const supabaseAdmin = getSupabaseAdmin()
    const results = {
      admin: null as any,
      captain: null as any,
      player: null as any,
      team: null as any,
    }

    // 1. Crear o actualizar el administrador
    const adminEmail = "martincarbajal890@gmail.com"
    const adminPassword = "admin123"

    // Verificar si el admin ya existe
    const { data: existingAdmin } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", adminEmail)
      .eq("role", "admin")
      .single()

    if (existingAdmin) {
      // Actualizar contraseña del admin existente
      await supabaseAdmin.auth.admin.updateUserById(existingAdmin.id, {
        password: adminPassword,
      })
      results.admin = { email: adminEmail, password: adminPassword, id: existingAdmin.id }
    } else {
      // Crear nuevo admin
      const { data: newAdmin, error } = await supabaseAdmin.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
      })

      if (error) throw error

      // Crear perfil de admin
      await supabaseAdmin.from("users").insert({
        id: newAdmin.user.id,
        email: adminEmail,
        first_name: "Martín",
        last_name: "Carbajal",
        role: "admin",
      })

      results.admin = { email: adminEmail, password: adminPassword, id: newAdmin.user.id }
    }

    // 2. Crear un equipo de prueba si no existe
    let teamId = ""
    const { data: existingTeam } = await supabaseAdmin
      .from("teams")
      .select("id, name")
      .eq("name", "Equipo de Prueba")
      .single()

    if (existingTeam) {
      teamId = existingTeam.id
      results.team = existingTeam
    } else {
      const newTeam = await teamService.create({
        name: "Equipo de Prueba",
        group: "A",
        logo: "/placeholder.svg?height=40&width=40",
      })

      if (!newTeam) throw new Error("No se pudo crear el equipo de prueba")

      teamId = newTeam.id
      results.team = newTeam
    }

    // 3. Crear o actualizar el capitán
    const captainEmail = "capitan@ejemplo.com"
    const captainPassword = "capitan123"

    // Verificar si el capitán ya existe
    const { data: existingCaptain } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", captainEmail)
      .eq("role", "captain")
      .single()

    if (existingCaptain) {
      // Actualizar contraseña del capitán existente
      await supabaseAdmin.auth.admin.updateUserById(existingCaptain.id, {
        password: captainPassword,
      })
      results.captain = { email: captainEmail, password: captainPassword, id: existingCaptain.id }
    } else {
      // Crear nuevo capitán
      const { data: newCaptain, error } = await supabaseAdmin.auth.admin.createUser({
        email: captainEmail,
        password: captainPassword,
        email_confirm: true,
      })

      if (error) throw error

      // Crear perfil de capitán
      await supabaseAdmin.from("users").insert({
        id: newCaptain.user.id,
        email: captainEmail,
        first_name: "Carlos",
        last_name: "Rodríguez",
        role: "captain",
        team_id: teamId,
      })

      results.captain = { email: captainEmail, password: captainPassword, id: newCaptain.user.id }
    }

    // 4. Crear o actualizar el jugador
    const playerEmail = "jugador@ejemplo.com"
    const playerPassword = "jugador123"

    // Verificar si el jugador ya existe
    const { data: existingPlayer } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", playerEmail)
      .eq("role", "player")
      .single()

    if (existingPlayer) {
      // Actualizar contraseña del jugador existente
      await supabaseAdmin.auth.admin.updateUserById(existingPlayer.id, {
        password: playerPassword,
      })

      results.player = { email: playerEmail, password: playerPassword, id: existingPlayer.id }
    } else {
      // Crear nuevo jugador
      const { data: newPlayer, error } = await supabaseAdmin.auth.admin.createUser({
        email: playerEmail,
        password: playerPassword,
        email_confirm: true,
      })

      if (error) throw error

      // Crear perfil de jugador
      await supabaseAdmin.from("users").insert({
        id: newPlayer.user.id,
        email: playerEmail,
        first_name: "Juan",
        last_name: "Pérez",
        role: "player",
        team_id: teamId,
      })

      // Crear registro de jugador
      await supabaseAdmin.from("players").insert({
        user_id: newPlayer.user.id,
        team_id: teamId,
        first_name: "Juan",
        last_name: "Pérez",
        number: 10,
        position: "delantero",
        email: playerEmail,
      })

      results.player = { email: playerEmail, password: playerPassword, id: newPlayer.user.id }
    }

    return NextResponse.json({
      success: true,
      message: "Cuentas de prueba configuradas correctamente",
      accounts: results,
    })
  } catch (error: any) {
    console.error("Error setting up test accounts:", error)
    return NextResponse.json(
      { success: false, message: error.message || "Error setting up test accounts" },
      { status: 500 },
    )
  }
}
