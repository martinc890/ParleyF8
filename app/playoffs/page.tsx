import type { Metadata } from "next"
import PublicLayout from "@/components/layouts/public-layout"
import PlayoffBracket from "@/components/playoffs/playoff-bracket"

export const metadata: Metadata = {
  title: "Playoffs - Football Tournament App",
  description: "View the playoff bracket and knockout stage matches",
}

export default function PlayoffsPage() {
  return (
    <PublicLayout>
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-8 text-3xl font-bold">Playoffs</h1>
        <PlayoffBracket />
      </div>
    </PublicLayout>
  )
}
