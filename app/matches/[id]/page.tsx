import type { Metadata } from "next"
import PublicLayout from "@/components/layouts/public-layout"
import MatchDetails from "@/components/matches/match-details"
import { BackButton } from "@/components/ui/back-button"

export const metadata: Metadata = {
  title: "Match Details - Football Tournament App",
  description: "View detailed information about a specific match",
}

export default function MatchDetailsPage({ params }: { params: { id: string } }) {
  return (
    <PublicLayout>
      <div className="container px-4 py-8 mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <BackButton href="/matches" />
          <h1 className="text-3xl font-bold">Detalles del Partido</h1>
        </div>
        <MatchDetails matchId={params.id} />
      </div>
    </PublicLayout>
  )
}
