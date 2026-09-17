import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Oeun Nuphea — Backend Engineer & Freelancer",
    short_name: "Oeun Nuphea",
    description:
      "Backend Engineer specializing in scalable event-driven systems, high-performance APIs, and continuous deployment pipelines. Available for contract work and freelance projects.",
    start_url: "/",
    id: "/",
    scope: "/",
    display: "standalone",
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
