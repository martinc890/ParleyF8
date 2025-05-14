import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Función para generar contraseñas aleatorias
export function generatePassword(length = 10): string {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+"
  let password = ""
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length)
    password += charset[randomIndex]
  }
  return password
}

// Función para generar un código QR (simulado)
export async function generateQRCode(data: string): Promise<string> {
  // En una implementación real, esto generaría un QR real
  // Por ahora, devolvemos una URL de placeholder
  return `/placeholder.svg?height=200&width=200&text=${encodeURIComponent(data)}`
}

// Función para formatear fecha
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
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

// Función para validar número de jugador
export function isValidPlayerNumber(number: number): boolean {
  return number >= 1 && number <= 99
}

// Función para validar DNI
export function isValidDNI(dni: string): boolean {
  // Implementar según el formato de DNI requerido
  return dni.length >= 7 && dni.length <= 10
}
