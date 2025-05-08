import type { Metadata } from "next"
import PublicLayout from "@/components/layouts/public-layout"
import LoginForm from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login - Football Tournament App",
  description: "Login to your account",
}

export default function LoginPage() {
  return (
    <PublicLayout>
      <div className="container flex items-center justify-center min-h-[calc(100vh-200px)] px-4 py-8 mx-auto">
        <LoginForm />
      </div>
    </PublicLayout>
  )
}
