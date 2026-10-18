"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Download, ArrowRight, Share2, Check, Eye, X, ExternalLink } from "lucide-react"

export default function Hero() {
  const [copied, setCopied] = useState(false)
  const [isCvPreviewOpen, setIsCvPreviewOpen] = useState(false)

  useEffect(() => {
    if (!isCvPreviewOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCvPreviewOpen(false)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isCvPreviewOpen])

  const handleShare = async () => {
    const shareData = {
      title: "Oeun Nuphea - Software Engineer",
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

  return (
    <section className="min-h-[80vh] flex items-center px-6 pt-28 pb-10 sm:pt-32 sm:pb-12 lg:pb-12 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[1fr_auto]">
          <div className="space-y-8">

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                Oeun Nuphea
              </h1>
              <p className="text-xl text-muted-foreground font-medium">
                Software Engineer
              </p>
              <p className="max-w-lg text-base leading-relaxed text-muted-foreground">
                Computer Science senior at RUPP and Web Developer experienced in building responsive web applications with REST APIs, real-time WebSocket features, and SQL/NoSQL databases.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-2.5 text-sm font-medium text-background transition-all duration-200 shadow-md shadow-black/10 hover:shadow-lg active:scale-[0.98]"
              >
                Get In Touch
                <ArrowRight size={15} />
              </a>

              <a
                href="#projects"
                className="glass-button inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-foreground active:scale-[0.98]"
              >
                View Projects
              </a>

              <button
                type="button"
                onClick={() => setIsCvPreviewOpen(true)}
                className="glass-button inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground active:scale-[0.98]"
              >
                <Eye size={15} />
                Preview CV
              </button>

              <button
                onClick={handleShare}
                className="glass-button inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground active:scale-[0.98]"
                aria-label="Share portfolio"
              >
                {copied ? <Check size={15} className="text-emerald-500" /> : <Share2 size={15} />}
                {copied ? "Copied!" : "Share"}
              </button>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-blue-400/20 via-indigo-300/20 to-purple-400/20 blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative p-2 rounded-3xl glass-panel shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                <div className="relative h-56 w-56 overflow-hidden rounded-2xl sm:h-64 sm:w-64">
                  <Image
                    src="/OUENNUPHEA.jpg"
                    alt="Portrait of Nuphea"
                    fill
                    priority
                    className="object-cover transition-transform duration-500"
                    sizes="(min-width: 640px) 256px, 224px"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isCvPreviewOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm sm:p-6"
          onClick={() => setIsCvPreviewOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cv-preview-title"
        >
          <div
            className="glass-panel relative flex h-[85dvh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white/90 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-3 border-b border-black/5 px-5 py-3.5 sm:px-6">
              <h2 id="cv-preview-title" className="truncate text-sm font-semibold text-foreground sm:text-base">
                Oeun Nuphea — Curriculum Vitae
              </h2>

              <div className="flex items-center gap-2">
                <a
                  href="/OEUN NUPHEA.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-button hidden items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground sm:inline-flex"
                >
                  <ExternalLink size={14} />
                  Open in Tab
                </a>

                <a
                  href="/OEUN NUPHEA.pdf"
                  download="OEUN NUPHEA.pdf"
                  className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                >
                  <Download size={14} />
                  Download CV
                </a>

                <button
                  type="button"
                  onClick={() => setIsCvPreviewOpen(false)}
                  className="glass-button inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
                  aria-label="Close CV preview"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-neutral-100/80">
              <iframe
                src="/OEUN NUPHEA.pdf"
                title="Oeun Nuphea CV Preview"
                className="h-full w-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

