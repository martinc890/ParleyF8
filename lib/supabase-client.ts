import { createClient } from "@supabase/supabase-js"

// Verificar que las variables de entorno estén definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// Validar que las claves estén disponibles
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL y Anon Key son requeridas")
}

// Cliente para el lado del cliente (con clave anónima)
let supabaseInstance: ReturnType<typeof createClient> | null = null

export const getSupabase = () => {
  if (!supabaseInstance && typeof window !== "undefined") {
    supabaseInstance = createClient(supabaseUrl!, supabaseAnonKey!)
  }
  return supabaseInstance || createClient(supabaseUrl!, supabaseAnonKey!)
}

// Cliente para el lado del servidor (con clave de servicio)
export const getSupabaseAdmin = () => {
  if (!supabaseServiceKey) {
    console.error("Supabase Service Role Key es requerida para operaciones administrativas")
    // Fallback al cliente anónimo si no hay clave de servicio
    return getSupabase()
  }
  return createClient(supabaseUrl!, supabaseServiceKey)
}

// Exportar el cliente para uso directo (singleton)
export const supabase = getSupabase()
