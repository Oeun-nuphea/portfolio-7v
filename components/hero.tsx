"use client"

import { saveAs } from "file-saver"
import { motion } from "framer-motion"
import JSZip from "jszip"
import Image from "next/image"
import { useEffect, useState } from "react"

const rotatingHighlights = [
  "Scalable APIs",
  "Event-Driven Systems",
  "Modern Frontend Platforms",
  "Observability-Ready Delivery",
]

const stackBadges = [
  "Node.js",
  "TypeScript",
  "Vue.js",
  "React",
  "Microservices",
  "AWS",
  "Grafana",
  "Prometheus",
]

const focusCards = [
  {
    title: "Event-driven microservices",
    description: "Decoupled services built for reliability and independent change.",
  },
  {
    title: "High-performance APIs",
    description: "Clean architecture and Redis caching shaped for throughput.",
  },
  {
    title: "CI/CD & Observability",
    description: "Dockerized pipelines with Grafana visibility baked in.",
  },
]

export default function Hero() {
  const [currentHighlight, setCurrentHighlight] = useState(0)

  const downloadZip = async () => {
    const zip = new JSZip()

    const files = [
      { url: "/OEUN NUPHEA.pdf", name: "OEUN NUPHEA.pdf" },
      { url: "/Oeun Nuphea Cover Latter.pdf", name: "Cover Letter.pdf" },
    ]

    for (const file of files) {
      const response = await fetch(file.url)
      const blob = await response.blob()
      zip.file(file.name, blob)
    }

    const content = await zip.generateAsync({ type: "blob" })
    saveAs(content, "CVs.zip")
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHighlight((prev) => (prev + 1) % rotatingHighlights.length)
    }, 2800)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-28 lg:px-8 lg:pt-32">

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(31rem,1fr)] xl:gap-16">
        <div className="text-center lg:text-left">
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mb-6 inline-flex rounded-full border border-primary/15 bg-card/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary/80 shadow-sm"
          >
            Open to Work
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-4 text-5xl font-black tracking-tight sm:text-6xl lg:text-7xl"
          >
            Nuphea
          </motion.h1>

          <motion.h2
            key={currentHighlight}
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7 }}
            className="mb-6 min-h-[5.5rem] text-2xl font-extrabold leading-[0.95] text-primary sm:min-h-[6.5rem] sm:text-4xl lg:min-h-[7rem] lg:text-5xl"
          >
            {rotatingHighlights[currentHighlight]}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
            className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl lg:mx-0"
          >
            Backend Engineer focused on event-driven systems, clean APIs, and shipping production-ready code.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.8, ease: "easeOut" }}
            className="mb-10 flex flex-wrap justify-center gap-3 lg:justify-start"
          >
            {stackBadges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-border/80 bg-card/85 px-4 py-2 text-sm font-medium text-foreground shadow-sm"
              >
                {badge}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
            className="mb-10 flex flex-wrap justify-center gap-4 lg:justify-start"
          >
            <a
              href="#projects"
              className="rounded-xl bg-foreground px-8 py-3 font-semibold text-background transition hover:opacity-90"
            >
              View Projects
            </a>

            <a
              href="#contact"
              className="rounded-xl border border-border bg-card/80 px-8 py-3 font-semibold transition hover:bg-muted"
            >
              Get In Touch
            </a>

            <button
              onClick={downloadZip}
              className="rounded-xl bg-gradient-to-r from-primary to-accent px-8 py-3 font-semibold text-white transition hover:brightness-110"
            >
              Download CVs
            </button>
          </motion.div>


        </div>

        <motion.div
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.9, ease: "easeOut" }}
          className="flex justify-center lg:justify-end lg:pt-2"
        >
          <div className="w-full max-w-2xl">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="shrink-0 overflow-hidden rounded-full border border-border/40 bg-card">
                  <div className="relative h-32 w-32 overflow-hidden rounded-full sm:h-36 sm:w-36">
                    <Image
                      src="/OUENNUPHEA.jpg"
                      alt="Portrait of Nuphea"
                      fill
                      priority
                      className="object-cover object-[50%_16%] scale-[1.28]"
                      sizes="(min-width: 640px) 144px, 128px"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/75">
                    What I Build
                  </p>
                  <h2 className="text-2xl font-bold leading-tight text-foreground">
                    Reliable, scalable systems with clear ownership.
                  </h2>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {focusCards.map((card) => (
                  <div
                    key={card.title}
                    className="p-4 rounded-xl border border-border/40 bg-card/50"
                  >
                    <p className="mb-1 text-sm font-semibold text-foreground">{card.title}</p>
                    <p className="text-sm leading-relaxed text-muted-foreground">{card.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
