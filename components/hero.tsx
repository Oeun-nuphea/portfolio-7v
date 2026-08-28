"use client"

import { useState } from "react"
import { saveAs } from "file-saver"
import JSZip from "jszip"
import Image from "next/image"
import { Download, ArrowRight, Share2, Check } from "lucide-react"

export default function Hero() {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const shareData = {
      title: "Oeun Nuphea - Backend Engineer",
      text: "Check out Oeun Nuphea's Portfolio",
      url: "https://oeunnuphea.vercel.app",
    }

    if (typeof navigator !== "undefined" && navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData)
        return
      } catch {
        // User closed share dialog
      }
    }

    try {
      await navigator.clipboard.writeText("https://oeunnuphea.vercel.app")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error("Failed to copy share link:", error)
    }
  }

  const downloadZip = async () => {
    const zip = new JSZip()

    const files = [
      { url: "/OEUN NUPHEA.pdf", name: "OEUN NUPHEA.pdf" },
      { url: "/Oeun Nuphea Cover Latter.pdf", name: "Cover Letter.pdf" },
    ]

    try {
      for (const file of files) {
        const response = await fetch(file.url)
        if (!response.ok) throw new Error(`Failed to fetch ${file.name}`)
        const blob = await response.blob()
        zip.file(file.name, blob)
      }

      const content = await zip.generateAsync({ type: "blob" })
      saveAs(content, "CVs.zip")
    } catch (error) {
      console.error("Failed to download CV package:", error)
    }
  }

  return (
    <section className="min-h-[90vh] flex items-center px-6 pt-32 pb-20 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1fr_auto]">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Open to Work
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Oeun Nuphea
              </h1>
              <p className="text-xl text-muted-foreground font-medium">
                Backend Engineer & Freelancer
              </p>
              <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
                I design and implement high-performance APIs, reliable microservices, and continuous deployment pipelines. Available for contract work and freelance projects.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-80"
              >
                Get In Touch
                <ArrowRight size={15} />
              </a>

              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-foreground transition hover:bg-muted"
              >
                View Projects
              </a>

              <button
                onClick={downloadZip}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground hover:bg-muted"
              >
                <Download size={15} />
                Download CVs
              </button>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition hover:text-foreground hover:bg-muted"
                aria-label="Share portfolio"
              >
                {copied ? <Check size={15} className="text-emerald-500" /> : <Share2 size={15} />}
                {copied ? "Copied!" : "Share"}
              </button>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative h-56 w-56 overflow-hidden rounded-2xl border border-border sm:h-64 sm:w-64">
              <Image
                src="/OUENNUPHEA.jpg"
                alt="Portrait of Nuphea"
                fill
                priority
                className="object-cover"
                sizes="(min-width: 640px) 256px, 224px"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
