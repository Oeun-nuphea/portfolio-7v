import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import type React from "react"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const siteUrl = "https://oeunnuphea.vercel.app"
const siteTitle = "Oeun Nuphea — Backend Engineer & Freelancer"
const siteDescription =
  "Backend Engineer specializing in scalable event-driven systems, high-performance APIs, and continuous deployment pipelines. Available for contract work and freelance projects."

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | Nuphea",
  },
  description: siteDescription,
  keywords: [
    "Backend Engineer",
    "Freelancer",
    "Node.js",
    "TypeScript",
    "Go",
    "Microservices",
    "Docker",
    "Kubernetes",
    "AWS",
    "RabbitMQ",
    "Redis",
    "MongoDB",
    "PostgreSQL",
    "API Development",
    "Event-Driven Systems",
    "Oeun Nuphea",
    "Cambodia Developer",
  ],
  authors: [{ name: "Oeun Nuphea", url: siteUrl }],
  creator: "Oeun Nuphea",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Oeun Nuphea",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Oeun Nuphea — Backend Engineer & Freelancer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    creator: "@oeunnuphea",
    images: ["/opengraph-image"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
  alternates: {
    canonical: siteUrl,
  },
  verification: {
    google: "z5Lf_qvjAaS137922mkFkm79P2ePPPg27j4ElTfGTKI",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
