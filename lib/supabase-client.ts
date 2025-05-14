import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

// Crear un cliente para el lado del cliente
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Crear un cliente para el lado del servidor con la clave de servicio
// Esto permite operaciones privilegiadas como enviar correos
export const supabaseAdmin = createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY || "", {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
