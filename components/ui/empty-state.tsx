import type React from "react"
import type { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-6 sm:py-12 text-center">
      <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 mb-3 sm:mb-4 rounded-full bg-muted">
        <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
      </div>
      <h3 className="mb-1 sm:mb-2 text-base sm:text-lg font-medium">{title}</h3>
      <p className="mb-3 sm:mb-6 text-xs sm:text-sm text-muted-foreground max-w-md">{description}</p>
      {action}
    </div>
  )
}
