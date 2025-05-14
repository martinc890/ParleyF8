export interface CalendarItem {
  id: string
  date: string
  time?: string
  itemType: "match" | "event"
  title: string
  homeTeam?: {
    name: string
  }
  awayTeam?: {
    name: string
  }
}
