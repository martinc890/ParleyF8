import type { Metadata } from "next"
import PublicLayout from "@/components/layouts/public-layout"
import MatchesView from "@/components/matches/matches-view"

export const metadata: Metadata = {
  title: "Matches - Football Tournament App",
  description: "View all matches in the tournament",
}

export default function MatchesPage() {
  return (
    <PublicLayout>
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-8 text-3xl font-bold">Matches</h1>
        <MatchesView />
      </div>
    </PublicLayout>
  )
}
