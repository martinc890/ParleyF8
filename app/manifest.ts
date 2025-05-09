import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Parley - Torneo de Fútbol",
    short_name: "Parley",
    description: "Aplicación oficial del torneo de fútbol Parley",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/images/parley-logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/parley-logo.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/images/parley-logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
