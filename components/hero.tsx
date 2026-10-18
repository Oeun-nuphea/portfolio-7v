"use client"

import { useState, useEffect, useRef } from "react"
import type React from "react"
import { createPortal } from "react-dom"
import Image from "next/image"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Download, ArrowRight, Share2, Check, Eye, X, ExternalLink, Loader2, Heart } from "lucide-react"

interface FloatingHeart {
  id: number
  x: number
  y: number
  rotation: number
}

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
  const [portraitSrc, setPortraitSrc] = useState("/OUENNUPHEA-3D.jpg")
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([])

  const cardRef = useRef<HTMLDivElement>(null)
  const lastTapTimeRef = useRef<number>(0)
  const heartIdCounterRef = useRef<number>(0)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)

  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [14, -14]), {
    stiffness: 260,
    damping: 22,
  })
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-14, 14]), {
    stiffness: 260,
    damping: 22,
  })
  const glareX = useTransform(pointerX, [-0.5, 0.5], [0, 100])
  const glareY = useTransform(pointerY, [-0.5, 0.5], [0, 100])
  const glareBackground = useTransform(
    [glareX, glareY],
    ([latestX, latestY]: number[]) =>
      `radial-gradient(circle at ${latestX}% ${latestY}%, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0) 65%)`
  )

  const spawnHeartAtClientPoint = (clientX: number, clientY: number) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const x = clientX - rect.left
    const y = clientY - rect.top
    const rotation = Math.round((Math.random() - 0.5) * 44)
    heartIdCounterRef.current += 1
    const newHeartId = Date.now() + heartIdCounterRef.current

    setFloatingHearts((prev) => [...prev, { id: newHeartId, x, y, rotation }])

    window.setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((heart) => heart.id !== newHeartId))
    }, 950)
  }

  const handleCardDoubleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    spawnHeartAtClientPoint(event.clientX, event.clientY)
  }

  const handleCardTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0]
    if (!touch) return
    const now = Date.now()
    if (now - lastTapTimeRef.current < 300) {
      spawnHeartAtClientPoint(touch.clientX, touch.clientY)
    }
    lastTapTimeRef.current = now
  }

  const handleCardPointerMove = (clientX: number, clientY: number) => {
    const rect = cardRef.current?.getBoundingClientRect()
    if (!rect) return
    const normalizedX = (clientX - rect.left) / rect.width - 0.5
    const normalizedY = (clientY - rect.top) / rect.height - 0.5
    pointerX.set(Math.max(-0.5, Math.min(0.5, normalizedX)))
    pointerY.set(Math.max(-0.5, Math.min(0.5, normalizedY)))
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    handleCardPointerMove(event.clientX, event.clientY)
  }

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0]
    if (!touch) return
    handleCardPointerMove(touch.clientX, touch.clientY)
  }

  const resetCardTilt = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

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
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.1, delayChildren: 0.05 },
              },
            }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
              >
                Oeun Nuphea
              </motion.h1>
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                className="text-xl text-muted-foreground font-medium"
              >
                Software Engineer
              </motion.p>
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
                  visible: {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                  },
                }}
                className="max-w-lg text-base leading-relaxed text-muted-foreground"
              >
                Computer Science senior at RUPP and Web Developer experienced in building responsive web applications with REST APIs, real-time WebSocket features, and SQL/NoSQL databases.
              </motion.p>
            </div>

            <motion.div
              variants={{
                hidden: { opacity: 0, y: 14 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                },
              }}
              className="flex flex-wrap items-center gap-3"
            >
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
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center lg:justify-end [perspective:1100px]"
          >
            <motion.div
              ref={cardRef}
              onDoubleClick={handleCardDoubleClick}
              onTouchStart={handleCardTouchStart}
              onMouseMove={handleMouseMove}
              onMouseLeave={resetCardTilt}
              onTouchMove={handleTouchMove}
              onTouchEnd={resetCardTilt}
              animate={{ y: [0, -7, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
              }}
              className="relative group select-none cursor-pointer"
            >
              {/* Deep 3D Back Ambient Glow Layer */}
              <div
                style={{ transform: "translateZ(-28px)" }}
                className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-blue-500/30 via-indigo-400/25 to-purple-500/30 blur-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500"
              />

              {/* Raised 3D Portrait Layer */}
              <div
                style={{ transform: "translateZ(24px)" }}
                className="relative h-56 w-56 overflow-hidden rounded-3xl shadow-[0_24px_50px_rgba(15,23,42,0.22),0_10px_20px_rgba(15,23,42,0.12)] sm:h-64 sm:w-64"
              >
                <Image
                  src={portraitSrc}
                  alt="Portrait of Nuphea"
                  fill
                  priority
                  onError={() => {
                    if (portraitSrc !== "/OUENNUPHEA.jpg") {
                      setPortraitSrc("/OUENNUPHEA.jpg")
                    }
                  }}
                  className="object-cover"
                  sizes="(min-width: 640px) 256px, 224px"
                />

                {/* Dynamic 3D Specular Light Glare */}
                <motion.div
                  style={{ background: glareBackground }}
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
              </div>

              {/* TikTok-Style Double-Click / Double-Tap Floating Hearts (3D Layer Above Portrait) */}
              <div
                style={{ transform: "translateZ(48px)" }}
                className="pointer-events-none absolute inset-0 overflow-visible"
              >
                <AnimatePresence>
                  {floatingHearts.map((heart) => (
                    <motion.div
                      key={heart.id}
                      initial={{
                        opacity: 0,
                        scale: 0,
                        x: heart.x - 36,
                        y: heart.y - 36,
                        rotate: heart.rotation - 12,
                      }}
                      animate={{
                        opacity: [0, 1, 1, 0],
                        scale: [0, 1.35, 1, 1.15],
                        x: heart.x - 36,
                        y: [heart.y - 36, heart.y - 46, heart.y - 115],
                        rotate: [heart.rotation - 10, heart.rotation + 6, heart.rotation],
                      }}
                      exit={{ opacity: 0 }}
                      transition={{
                        duration: 0.9,
                        times: [0, 0.22, 0.55, 1],
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="pointer-events-none absolute top-0 left-0 flex h-[72px] w-[72px] items-center justify-center"
                    >
                      {/* Expanding Burst Ring */}
                      <motion.span
                        initial={{ scale: 0.3, opacity: 0.85 }}
                        animate={{ scale: 1.75, opacity: 0 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        className="absolute inset-2 rounded-full border-2 border-[#FE2C55]/70"
                      />
                      <Heart
                        size={64}
                        strokeWidth={1.5}
                        className="fill-[#FE2C55] text-[#FF4D79] drop-shadow-[0_10px_24px_rgba(254,44,85,0.55)]"
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isCvPreviewOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-3 pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-[max(0.75rem,env(safe-area-inset-bottom,0px))] backdrop-blur-2xl backdrop-saturate-150 sm:p-6"
                style={{
                  background:
                    "linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.98) 6%, rgba(255,255,255,0.9) 14%, rgba(255,255,255,0.78) 28%, rgba(255,255,255,0.78) 72%, rgba(255,255,255,0.9) 86%, rgba(255,255,255,0.98) 94%, #ffffff 100%)",
                }}
                onClick={() => setIsCvPreviewOpen(false)}
                role="dialog"
                aria-modal="true"
                aria-labelledby="cv-preview-title"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.94, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 12 }}
                  transition={{ type: "spring", stiffness: 360, damping: 28 }}
                  className="relative z-10 flex h-[86dvh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-neutral-200/80 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.1),0_4px_16px_rgba(15,23,42,0.05)]"
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
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  )
}

