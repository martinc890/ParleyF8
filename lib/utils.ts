import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Función para combinar clases de Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Función para generar una contraseña basada en el nombre y un número aleatorio
export function generatePassword(name: string, length = 8): string {
  // Limpiar el nombre (quitar espacios, acentos, etc.)
  const cleanName = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "")
    .substring(0, 5)

  // Generar número aleatorio
  const randomNum = Math.floor(Math.random() * 90 + 10)

  // Generar caracteres aleatorios para completar la longitud
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let randomChars = ""

  for (let i = 0; i < length - cleanName.length - 2; i++) {
    randomChars += chars.charAt(Math.floor(Math.random() * chars.length))
  }

  return `${cleanName}${randomNum}${randomChars}`
}

// Función para traducir posiciones de jugadores
export function translatePosition(position: string): string {
  const positions: Record<string, string> = {
    goalkeeper: "Portero",
    defender: "Defensa",
    midfielder: "Mediocampista",
    forward: "Delantero",
    coach: "Entrenador",
  }

  return positions[position] || position
}

// Función para formatear fecha
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
}

// Función para formatear nombre completo
export function formatFullName(firstName?: string, lastName?: string): string {
  if (!firstName && !lastName) return ""
  if (!firstName) return lastName || ""
  if (!lastName) return firstName
  return `${firstName} ${lastName}`
}

// Función para obtener iniciales de un nombre
export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

// Función para validar correo electrónico
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Función para generar un código QR (simulado)
export async function generateQRCode(data: string): Promise<string> {
  // En una implementación real, esto generaría un QR real
  // Por ahora, devolvemos una URL de placeholder
  return `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(data)}`
}
