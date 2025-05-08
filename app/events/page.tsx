import type { Metadata } from "next"
import PublicLayout from "@/components/layouts/public-layout"
import EventsList from "@/components/events/events-list"

export const metadata: Metadata = {
  title: "Events - Football Tournament App",
  description: "View all tournament events and after-parties",
}

export default function EventsPage() {
  return (
    <PublicLayout>
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-8 text-3xl font-bold">Events & After-Parties</h1>
        <EventsList />
      </div>
    </PublicLayout>
  )
}
