import type { Metadata } from "next"
import PublicLayout from "@/components/layouts/public-layout"
import GroupsView from "@/components/groups/groups-view"

export const metadata: Metadata = {
  title: "Group Standings - Football Tournament App",
  description: "View the current standings for all groups in the tournament",
}

export default function GroupsPage() {
  return (
    <PublicLayout>
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-8 text-3xl font-bold">Group Standings</h1>
        <GroupsView />
      </div>
    </PublicLayout>
  )
}
