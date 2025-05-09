"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

interface BackButtonProps {
  href?: string
  className?: string
}

export function BackButton({ href, className = "" }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={`rounded-full h-8 w-8 ${className}`}
      onClick={handleClick}
      aria-label="Volver"
    >
      <ChevronLeft className="h-5 w-5" />
    </Button>
  )
}
