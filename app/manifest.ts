import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PARLEY - Torneo de Fútbol",
    short_name: "PARLEY",
    description: "Aplicación moderna para la gestión de torneos de fútbol",
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
