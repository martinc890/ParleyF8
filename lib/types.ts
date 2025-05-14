export interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  address: string
  type: string
  description: string
  image: string
}

export interface Media {
  id: string
  type: string
  thumbnail: string
  title: string
  date: string
  matchday: string
}

export interface CalendarItem {
  id: string
  date: string
  time: string
  title: string
  description: string
  type: string
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  teamId?: string
  photo?: string
}
