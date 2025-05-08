import type { Metadata } from "next"
import PublicLayout from "@/components/layouts/public-layout"
import CalendarView from "@/components/calendar/calendar-view"

export const metadata: Metadata = {
  title: "Calendar - Football Tournament App",
  description: "View the tournament calendar with all matches and events",
}

export default function CalendarPage() {
  return (
    <PublicLayout>
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-8 text-3xl font-bold">Tournament Calendar</h1>
        <CalendarView />
      </div>
    </PublicLayout>
  )
}
