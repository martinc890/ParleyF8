import Image from "next/image"
import Link from "next/link"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  withText?: boolean
  asLink?: boolean
  linkHref?: string
}

export function Logo({ size = "md", withText = true, asLink = true, linkHref = "/" }: LogoProps) {
  const sizes = {
    sm: { container: "w-6 h-6", text: "text-sm" },
    md: { container: "w-10 h-10", text: "text-base" },
    lg: { container: "w-16 h-16", text: "text-xl" },
  }

  const logoElement = (
    <div className="flex items-center gap-2">
      <div className={`${sizes[size].container} relative`}>
        <Image
          src="/images/logo-p.png"
          alt="PARLEY"
          width={size === "lg" ? 64 : size === "md" ? 40 : 24}
          height={size === "lg" ? 64 : size === "md" ? 40 : 24}
          className="w-full h-full object-contain"
          priority
        />
      </div>
      {withText && <span className={`font-bold text-white ${sizes[size].text}`}>PARLEY</span>}
    </div>
  )

  if (asLink) {
    return <Link href={linkHref}>{logoElement}</Link>
  }

  return logoElement
}
