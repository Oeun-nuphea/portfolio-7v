import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Oeun Nuphea — Software Engineer",
    short_name: "Oeun Nuphea",
    description:
      "Software Engineer specializing in scalable REST APIs, real-time WebSockets, database design, and CI/CD pipelines.",
    start_url: "/",
    id: "/",
    scope: "/",
    display: "fullscreen",
    display_override: ["fullscreen", "standalone"],
    background_color: "#ffffff",
    theme_color: "#ffffff",
    categories: ["portfolio", "resume", "developer"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
