import { Analytics } from "@vercel/analytics/next"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import type React from "react"
import PwaInstallPrompt from "@/components/pwa-install-prompt"
import PwaRegister from "@/components/pwa-register"
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
const siteTitle = "Oeun Nuphea — Software Engineer & Freelancer"
const siteDescription =
  "Software Engineer specializing in scalable event-driven systems, high-performance APIs, and continuous deployment pipelines. Available for contract work and freelance projects."

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Oeun Nuphea",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icon-192.png",
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  formatDetection: {
    telephone: false,
  },
  title: {
    default: siteTitle,
    template: "%s | Nuphea",
  },
  description: siteDescription,
  keywords: [
    "Software Engineer",
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
        alt: "Oeun Nuphea — Software Engineer & Freelancer",
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
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased relative min-h-screen`}>
        {/* Ambient iOS liquid glass refraction background lights */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-32 right-1/4 h-[480px] w-[480px] rounded-full bg-gradient-to-br from-blue-300/20 to-sky-200/20 blur-[100px]" />
          <div className="absolute top-1/3 -left-32 h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-indigo-200/25 to-purple-200/15 blur-[120px]" />
          <div className="absolute top-2/3 -right-24 h-[440px] w-[440px] rounded-full bg-gradient-to-bl from-teal-200/20 to-sky-200/15 blur-[100px]" />
          <div className="absolute -bottom-24 left-1/3 h-[400px] w-[400px] rounded-full bg-gradient-to-r from-blue-200/20 to-indigo-200/15 blur-[110px]" />
        </div>
        {children}
        <PwaRegister />
        <PwaInstallPrompt />
        <Analytics />
      </body>
    </html>
  )
}
