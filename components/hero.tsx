"use client"

import { saveAs } from "file-saver"
import { motion } from "framer-motion"
import JSZip from "jszip"
import Image from "next/image"
import { Download, FileText, ArrowRight } from "lucide-react"

const stackBadges = [
  "Node.js",
  "TypeScript",
  "Go",
  "Docker",
  "Kubernetes",
  "RabbitMQ",
  "Redis",
  "MongoDB",
  "PostgreSQL",
  "AWS",
]

export default function Hero() {
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
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden px-6 pt-32 pb-20 lg:px-8">
      {/* Subtle decorative background glow */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center opacity-30 dark:opacity-20 pointer-events-none">
        <div className="h-[400px] w-[600px] rounded-full bg-gradient-to-tr from-primary/20 to-accent/20 blur-[120px]" />
      </div>

      <div className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.2fr_0.8fr] xl:gap-20">
          <div className="text-left space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Open to Work
            </motion.div>

            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-foreground"
              >
                Hi, I'm <span className="text-primary">Nuphea</span>.
              </motion.h1>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-2xl font-bold tracking-tight sm:text-3xl text-foreground/90"
              >
                Backend Engineer building scalable, event-driven systems.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="max-w-xl text-base sm:text-lg leading-relaxed text-muted-foreground"
              >
                I design and implement high-performance APIs, reliable microservices, and continuous deployment pipelines. Focus on clean code, automated testing, and production observability.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-2 pt-2"
            >
              {stackBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-lg border border-border/60 bg-muted/30 px-3 py-1.5 text-xs font-semibold text-foreground/80 tracking-wide transition hover:border-primary/30"
                >
                  {badge}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap items-center gap-4 pt-4"
            >
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 active:scale-[0.98]"
              >
                Get In Touch
                <ArrowRight size={16} />
              </a>

              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3.5 text-sm font-semibold text-foreground transition hover:bg-muted active:scale-[0.98]"
              >
                View Projects
              </a>

              <button
                onClick={downloadZip}
                className="inline-flex items-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-6 py-3.5 text-sm font-semibold text-primary transition hover:bg-primary/10 active:scale-[0.98]"
              >
                <Download size={16} />
                Download CVs
              </button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative group">
              {/* Premium image decorative frames */}
              <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-primary to-accent opacity-20 blur-lg transition duration-1000 group-hover:opacity-40 group-hover:duration-200" />
              <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-2xl">
                <div className="relative h-[300px] w-[300px] overflow-hidden rounded-xl bg-muted sm:h-[350px] sm:w-[350px]">
                  <Image
                    src="/OUENNUPHEA.jpg"
                    alt="Portrait of Nuphea"
                    fill
                    priority
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(min-width: 640px) 350px, 300px"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

