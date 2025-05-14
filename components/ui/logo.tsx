import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Logo({ className = "", size = "md" }: LogoProps) {
  const sizes = {
    sm: { width: 32, height: 32 },
    md: { width: 40, height: 40 },
    lg: { width: 48, height: 48 },
  }

  const { width, height } = sizes[size]

  return (
    <Link href="/" className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Image
          src="/images/parley-logo.png"
          width={width}
          height={height}
          alt="Parley Logo"
          className="object-contain"
          priority
        />
      </div>
      <span className="font-bold text-lg">Parley</span>
    </Link>
  )
}
