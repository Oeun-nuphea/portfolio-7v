"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { Download, ArrowRight, Share2, Check, Eye, X, ExternalLink, Loader2 } from "lucide-react"

interface PdfViewport {
  width: number
  height: number
}

interface PdfRenderTask {
  promise: Promise<void>
  cancel: () => void
}

interface PdfPageProxy {
  getViewport: (params: { scale: number }) => PdfViewport
  render: (params: {
    canvasContext: CanvasRenderingContext2D
    viewport: PdfViewport
  }) => PdfRenderTask
}

interface PdfDocumentProxy {
  numPages: number
  getPage: (pageNumber: number) => Promise<PdfPageProxy>
}

interface PdfLoadingTask {
  promise: Promise<PdfDocumentProxy>
  destroy: () => void
}

interface PdfJsLib {
  GlobalWorkerOptions: {
    workerSrc: string
  }
  getDocument: (url: string) => PdfLoadingTask
}

declare global {
  interface Window {
    pdfjsLib?: PdfJsLib
  }
}

const PDFJS_SCRIPT_SRC = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"
const PDFJS_WORKER_SRC = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"
const CV_PDF_URL = "/OEUN NUPHEA.pdf"

function loadPdfJs(): Promise<PdfJsLib> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(new Error("Window is not available"))
      return
    }

    if (window.pdfjsLib) {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_SRC
      resolve(window.pdfjsLib)
      return
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${PDFJS_SCRIPT_SRC}"]`
    )

    if (existingScript) {
      existingScript.addEventListener("load", () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_SRC
          resolve(window.pdfjsLib)
        } else {
          reject(new Error("PDF.js failed to initialize"))
        }
      })
      existingScript.addEventListener("error", () => {
        reject(new Error("Failed to load PDF.js script"))
      })
      return
    }

    const script = document.createElement("script")
    script.src = PDFJS_SCRIPT_SRC
    script.async = true
    script.onload = () => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_SRC
        resolve(window.pdfjsLib)
      } else {
        reject(new Error("PDF.js failed to initialize"))
      }
    }
    script.onerror = () => {
      reject(new Error("Failed to load PDF.js script"))
    }
    document.head.appendChild(script)
  })
}

export default function Hero() {
  const [copied, setCopied] = useState(false)
  const [isCvPreviewOpen, setIsCvPreviewOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [cvPages, setCvPages] = useState<string[]>([])
  const [isLoadingCv, setIsLoadingCv] = useState(false)
  const [cvRenderFailed, setCvRenderFailed] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isCvPreviewOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCvPreviewOpen(false)
      }
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    document.body.dataset.cvModalOpen = "true"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      delete document.body.dataset.cvModalOpen
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [isCvPreviewOpen])

  useEffect(() => {
    if (!isCvPreviewOpen || cvPages.length > 0 || cvRenderFailed) return

    let isCancelled = false
    setIsLoadingCv(true)

    const renderPdfToImages = async () => {
      try {
        const pdfjsLib = await loadPdfJs()
        const loadingTask = pdfjsLib.getDocument(encodeURI(CV_PDF_URL))
        const pdf = await loadingTask.promise
        const renderedPages: string[] = []

        for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
          if (isCancelled) return
          const page = await pdf.getPage(pageNumber)
          const viewport = page.getViewport({ scale: 2.2 })
          const canvas = document.createElement("canvas")
          const context = canvas.getContext("2d")

          if (!context) {
            throw new Error("Canvas 2D context unavailable")
          }

          canvas.width = viewport.width
          canvas.height = viewport.height

          await page.render({
            canvasContext: context,
            viewport,
          }).promise

          renderedPages.push(canvas.toDataURL("image/png"))
        }

        if (!isCancelled) {
          setCvPages(renderedPages)
          setIsLoadingCv(false)
        }
      } catch (error) {
        console.error("Failed to render CV preview:", error)
        if (!isCancelled) {
          setCvRenderFailed(true)
          setIsLoadingCv(false)
        }
      }
    }

    renderPdfToImages()

    return () => {
      isCancelled = true
    }
  }, [isCvPreviewOpen, cvPages.length, cvRenderFailed])

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

      {mounted &&
        isCvPreviewOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-3 backdrop-blur-md sm:p-6"
            onClick={() => setIsCvPreviewOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="cv-preview-title"
          >
            <div
              className="relative flex h-[88dvh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/80 bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex shrink-0 items-center justify-between gap-2 border-b border-neutral-200/80 bg-white px-4 py-3 sm:px-6 sm:py-3.5">
                <h2
                  id="cv-preview-title"
                  className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground sm:text-base"
                >
                  Oeun Nuphea — CV
                </h2>

                <div className="flex shrink-0 items-center gap-2">
                  <a
                    href={CV_PDF_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass-button hidden shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground sm:inline-flex"
                  >
                    <ExternalLink size={14} />
                    Open in Tab
                  </a>

                  <a
                    href={CV_PDF_URL}
                    download="OEUN NUPHEA.pdf"
                    className="inline-flex shrink-0 whitespace-nowrap items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-xs font-medium text-background transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                  >
                    <Download size={14} className="shrink-0" />
                    <span>Download CV</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => setIsCvPreviewOpen(false)}
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-neutral-100/80 text-muted-foreground transition-colors hover:bg-neutral-200/80 hover:text-foreground"
                    aria-label="Close CV preview"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto bg-neutral-100 p-2.5 sm:p-6">
                {isLoadingCv && (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
                    <Loader2 size={24} className="animate-spin text-foreground" />
                    <p className="text-xs font-medium">Loading CV preview...</p>
                  </div>
                )}

                {!isLoadingCv && cvPages.length > 0 && (
                  <div className="mx-auto flex max-w-3xl flex-col gap-4">
                    {cvPages.map((pageDataUrl, index) => (
                      <img
                        key={`cv-page-${index + 1}`}
                        src={pageDataUrl}
                        alt={`Oeun Nuphea CV Page ${index + 1}`}
                        className="h-auto w-full rounded-xl bg-white shadow-md"
                      />
                    ))}
                  </div>
                )}

                {!isLoadingCv && cvRenderFailed && (
                  <iframe
                    src={CV_PDF_URL}
                    title="Oeun Nuphea CV Preview"
                    className="h-full w-full rounded-xl border-0 bg-white"
                  />
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  )
}

