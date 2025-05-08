import type { Metadata } from "next"
import PublicLayout from "@/components/layouts/public-layout"
import MediaGallery from "@/components/media/media-gallery"

export const metadata: Metadata = {
  title: "Media Gallery - Football Tournament App",
  description: "Browse photos and videos from the tournament",
}

export default function MediaPage() {
  return (
    <PublicLayout>
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-8 text-3xl font-bold">Media Gallery</h1>
        <MediaGallery />
      </div>
    </PublicLayout>
  )
}
