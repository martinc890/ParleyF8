import type { Metadata } from "next"
import PublicLayout from "@/components/layouts/public-layout"
import MatchDetails from "@/components/matches/match-details"

export const metadata: Metadata = {
  title: "Match Details - Football Tournament App",
  description: "View detailed information about a specific match",
}

export default function MatchDetailsPage({ params }: { params: { id: string } }) {
  return (
    <PublicLayout>
      <div className="container px-4 py-8 mx-auto">
        <MatchDetails matchId={params.id} />
      </div>
    </PublicLayout>
  )
}
