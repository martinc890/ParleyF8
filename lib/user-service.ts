import { getSupabase, getSupabaseAdmin } from "./supabase-client"
import { generatePassword } from "./utils"

// Tipos
interface UserData {
  id?: string
  email: string
  password?: string
  firstName: string
  lastName: string
  role: "admin" | "captain" | "player"
  teamId?: string
}

// Servicio para gestionar usuarios
export const userService = {
  // Crear un nuevo usuario
  createUser: async (userData: UserData): Promise<{ id: string; email: string } | null> => {
    try {
      // Usamos el cliente admin para crear usuarios
      const supabaseAdmin = getSupabaseAdmin()

      // Generar contraseña si no se proporciona
      const password = userData.password || generatePassword(userData.firstName, 8)

      // Crear usuario en Auth
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: userData.email,
        password,
        email_confirm: true, // Auto-confirmar email
      })

      if (authError) throw authError

      if (!authData.user) {
        throw new Error("No se pudo crear el usuario")
      }

      // Crear perfil de usuario
      const { error: profileError } = await supabaseAdmin.from("users").insert({
        id: authData.user.id,
        email: userData.email,
        first_name: userData.firstName,
        last_name: userData.lastName,
        role: userData.role,
        team_id: userData.teamId,
      })

      if (profileError) throw profileError

      return {
        id: authData.user.id,
        email: userData.email,
      }
    } catch (error) {
      console.error("Error creating user:", error)
      return null
    }
  },

  // Verificar si un usuario existe
  userExists: async (email: string): Promise<boolean> => {
    try {
      const supabase = getSupabase()
      const { data, error } = await supabase.from("users").select("id").eq("email", email).single()

      if (error && error.code !== "PGRST116") throw error // Ignorar error de no encontrado
      return !!data
    } catch (error) {
      console.error("Error checking if user exists:", error)
      return false
    }
  },

  // Crear usuario administrador
  createAdminUser: async (email: string, firstName: string, lastName: string): Promise<boolean> => {
    try {
      // Verificar si ya existe
      const exists = await userService.userExists(email)
      if (exists) return true

      // Crear usuario admin
      const result = await userService.createUser({
        email,
        firstName,
        lastName,
        role: "admin",
      })

      return !!result
    } catch (error) {
      console.error("Error creating admin user:", error)
      return false
    }
  },

  // Crear usuario capitán
  createCaptainUser: async (
    email: string,
    firstName: string,
    lastName: string,
    teamId: string,
  ): Promise<{ id: string; password: string } | null> => {
    try {
      // Generar contraseña
      const password = generatePassword(firstName, 8)

      // Crear usuario capitán
      const result = await userService.createUser({
        email,
        password,
        firstName,
        lastName,
        role: "captain",
        teamId,
      })

      if (!result) return null

      return {
        id: result.id,
        password,
      }
    } catch (error) {
      console.error("Error creating captain user:", error)
      return null
    }
  },

  // Crear usuario jugador
  createPlayerUser: async (
    email: string,
    firstName: string,
    lastName: string,
    teamId: string,
  ): Promise<{ id: string; password: string } | null> => {
    try {
      // Generar contraseña
      const password = generatePassword(firstName, 8)

      // Crear usuario jugador
      const result = await userService.createUser({
        email,
        password,
        firstName,
        lastName,
        role: "player",
        teamId,
      })

      if (!result) return null

      return {
        id: result.id,
        password,
      }
    } catch (error) {
      console.error("Error creating player user:", error)
      return null
    }
  },
}

// Función para configurar el usuario administrador inicial
export const setupAdminUser = async (): Promise<void> => {
  try {
    await userService.createAdminUser("martincarbajal890@gmail.com", "Martín", "Carbajal")
    console.log("Admin user setup completed")
  } catch (error) {
    console.error("Error setting up admin user:", error)
  }
}

export default userService
