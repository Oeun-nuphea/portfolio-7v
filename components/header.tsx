"use client"

import { User, Layers, Briefcase, Mail, Check, Share2 } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
  { label: "About", href: "#about", icon: User },
  { label: "Stack", href: "#stack", icon: Layers },
  { label: "Experience", href: "#experience", icon: Briefcase },
  { label: "Contact", href: "#contact", icon: Mail },
]

export default function Header() {
  const [activeSection, setActiveSection] = useState("about")
  const [copied, setCopied] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [transitionDirection, setTransitionDirection] = useState<"to-contact" | "to-experience" | null>(null)
  const prevSectionRef = useRef(activeSection)
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isManualClickRef = useRef(false)
  const manualClickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const constraintsRef = useRef<HTMLDivElement>(null)
  const navContainerRef = useRef<HTMLDivElement>(null)

  const triggerTransition = (direction: "to-contact" | "to-experience") => {
    setTransitionDirection(direction)
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
    }
    animationTimeoutRef.current = setTimeout(() => {
      setTransitionDirection(null)
    }, 650)
  }

  const handleNavClick = (sectionKey: string) => {
    isManualClickRef.current = true
    if (manualClickTimeoutRef.current) {
      clearTimeout(manualClickTimeoutRef.current)
    }
    manualClickTimeoutRef.current = setTimeout(() => {
      isManualClickRef.current = false
    }, 800)

    if (sectionKey === "contact" && activeSection !== "contact") {
      triggerTransition("to-contact")
    } else if (activeSection === "contact" && sectionKey !== "contact") {
      triggerTransition("to-experience")
    }

    setActiveSection(sectionKey)
  }

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      // Don't hide top bar on iPad mini and above (>= 768px)
      if (window.innerWidth >= 768) {
        if (!isVisible) setIsVisible(true)
        return
      }

      const currentScrollY = window.scrollY

      // Always show when near the top (within 50px)
      if (currentScrollY < 50) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down -> hide top bar on mobile
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up -> show top bar
        setIsVisible(true)
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isVisible])

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

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px",
      threshold: [0, 0.2, 0.5],
    }

    const observer = new IntersectionObserver((entries) => {
      if (isManualClickRef.current) return
      // Pick the entry with the highest intersection ratio or is currently intersecting
      const intersecting = entries.filter((e) => e.isIntersecting)
      if (intersecting.length > 0) {
        intersecting.sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        setActiveSection(intersecting[0].target.id)
      }
    }, observerOptions)

    navItems.forEach((item) => {
      const el = document.querySelector(item.href)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const prev = prevSectionRef.current
    const current = activeSection

    if (current === "contact" && prev !== "contact") {
      triggerTransition("to-contact")
    } else if (prev === "contact" && current !== "contact") {
      triggerTransition("to-experience")
    }

    prevSectionRef.current = activeSection
  }, [activeSection])

  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
      if (manualClickTimeoutRef.current) {
        clearTimeout(manualClickTimeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      {/* Top Status Bar Soft Fade so scrolled content and header blend invisibly into Android 15 / iOS status bar */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-10 bg-gradient-to-b from-white via-white/80 to-transparent"
        aria-hidden="true"
      />

      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-black/[0.03] bg-gradient-to-b from-white via-white/95 to-white/80 backdrop-blur-2xl backdrop-saturate-150 pt-[env(safe-area-inset-top,0px)] shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 transform-gpu will-change-transform md:translate-y-0 md:opacity-100 md:pointer-events-auto ${
          isVisible ? "translate-y-0 opacity-100 pointer-events-auto" : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3 lg:px-8">
          <a href="#top" className="flex items-center gap-2.5 group">
            <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/80 shadow-sm ring-1 ring-black/5">
              <Image
                src="/OUENNUPHEA.jpg"
                alt="Oeun Nuphea"
                fill
                className="object-cover"
                sizes="32px"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-foreground leading-tight">Nuphea</span>
              <span className="text-xs text-muted-foreground leading-tight">Software Engineer</span>
            </div>
          </a>

          <div className="flex items-center gap-4">
            <div className="hidden">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.substring(1)
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => handleNavClick(item.href.substring(1))}
                    className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? "border border-white/85 bg-white/[0.15] text-foreground shadow-[0_4px_14px_rgba(0,0,0,0.05),inset_0_1.5px_2px_rgba(255,255,255,0.95),inset_0_-1px_2px_rgba(255,255,255,0.35)] backdrop-blur-md"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/30"
                    }`}
                  >
                    {item.label}
                  </a>
                )
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* Bottom Edge Soft Fade so content never hard-clips against Android 15 gesture bar */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-8 bg-gradient-to-t from-white via-white/70 to-transparent lg:hidden"
        aria-hidden="true"
      />

      {/* Screen Boundary for Navigation (Desktop, iPad, Mobile) */}
      <div ref={constraintsRef} className="fixed inset-0 z-50 pointer-events-none p-4 sm:p-6">
        {/* Pure Crystal Glass Floating Navigation Bar */}
        <div
          ref={navContainerRef}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1.5 pointer-events-none"
        >
          {/* Main Crystal Glass Capsule: Vertical side dock */}
          <nav
            className="pointer-events-auto flex w-[58px] flex-col items-center p-0.5 gap-0.5 rounded-[32px] border border-white/75 bg-white/60 shadow-[0_16px_40px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04),inset_0_1.5px_2px_rgba(255,255,255,0.95),inset_0_-1.5px_2px_rgba(255,255,255,0.35),inset_0_0_0_1px_rgba(255,255,255,0.25),inset_0_0_14px_rgba(255,255,255,0.08)] hover:border-white/95 hover:bg-white/70 hover:shadow-[0_20px_50px_rgba(0,0,0,0.11),0_6px_18px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(255,255,255,0.98),inset_0_-1px_2px_rgba(255,255,255,0.4)] backdrop-blur-xl backdrop-saturate-[180%] transform-gpu will-change-transform transition-all duration-300"
          >
            {navItems
              .filter((item) => item.href !== "#contact")
              .map((item) => {
                const Icon = item.icon
                const sectionKey = item.href.substring(1)
                const isActive = activeSection === sectionKey

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => handleNavClick(sectionKey)}
                    className={`group relative flex h-[54px] w-full flex-col items-center justify-center rounded-[28px] transition-all duration-200 ${
                      isActive
                        ? "border border-white/85 bg-white/80 text-neutral-950 shadow-[0_4px_14px_rgba(0,0,0,0.05),inset_0_1.5px_2px_rgba(255,255,255,0.95),inset_0_-1.5px_2px_rgba(255,255,255,0.35),inset_0_0_0_1px_rgba(255,255,255,0.25)]"
                        : "border border-transparent text-neutral-600 hover:text-neutral-950 hover:bg-white/40 hover:border-white/40"
                    }`}
                  >
                    {/* Expanding liquid ripple when droplet arrives at Experience */}
                    {sectionKey === "experience" && transitionDirection === "to-experience" && (
                      <motion.span
                        initial={{ scale: 0.85, opacity: 0.8 }}
                        animate={{ scale: 1.18, opacity: 0 }}
                        transition={{ duration: 0.4, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute inset-0 rounded-[28px] border border-white/90 bg-white/20 pointer-events-none"
                      />
                    )}
                    <Icon
                      size={22}
                      strokeWidth={isActive ? 2.2 : 1.9}
                      className={`transition-colors duration-200 ${
                        isActive ? "text-neutral-950 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" : "text-neutral-600 group-hover:text-neutral-950"
                      }`}
                    />
                  </a>
                )
              })}
          </nav>

          {/* Dynamic Traveling Liquid Glass Droplet Animation between Experience and Contact */}
          <div className="relative h-0 w-full flex items-center justify-center pointer-events-none z-30">
            <AnimatePresence>
              {transitionDirection && (
                <motion.div
                  key={transitionDirection}
                  initial={{
                    opacity: 0,
                    y: transitionDirection === "to-contact" ? -22 : 26,
                    scale: 0.7,
                  }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    y: transitionDirection === "to-contact" ? 26 : -22,
                    scale: [0.7, 1.1, 0.75],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    y: { duration: 0.55, ease: [0.25, 1, 0.5, 1] },
                    scale: { duration: 0.55, ease: "easeInOut" },
                    opacity: { duration: 0.55, times: [0, 0.15, 0.8, 1], ease: "easeInOut" },
                  }}
                  className="absolute flex flex-col items-center justify-center pointer-events-none transform-gpu"
                >
                  {/* Glowing liquid light streak trailing behind the droplet in direction of motion */}
                  {transitionDirection === "to-contact" ? (
                    <div className="absolute -top-3 h-4 w-[2px] rounded-full bg-gradient-to-t from-white/95 via-white/40 to-transparent blur-[0.5px]" />
                  ) : (
                    <div className="absolute -bottom-3 h-4 w-[2px] rounded-full bg-gradient-to-b from-white/95 via-white/40 to-transparent blur-[0.5px]" />
                  )}

                  {/* Liquid Glass Droplet Orb */}
                  <div className="relative flex h-4 w-4 items-center justify-center rounded-full border border-white/95 bg-white/40 shadow-[0_2px_10px_rgba(255,255,255,0.85),0_4px_12px_rgba(0,0,0,0.12),inset_0_1px_1.5px_rgba(255,255,255,1)] backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_6px_rgba(255,255,255,1)]" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Paired Crystal Glass Capsule for Contact & Share */}
          <div
            className="pointer-events-auto flex w-[58px] flex-col p-0.5 gap-0.5 rounded-[32px] border border-white/75 bg-white/60 shadow-[0_16px_40px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04),inset_0_1.5px_2px_rgba(255,255,255,0.95),inset_0_-1.5px_2px_rgba(255,255,255,0.35),inset_0_0_0_1px_rgba(255,255,255,0.25),inset_0_0_14px_rgba(255,255,255,0.08)] hover:border-white/95 hover:bg-white/70 hover:shadow-[0_20px_50px_rgba(0,0,0,0.11),0_6px_18px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(255,255,255,0.98),inset_0_-1px_2px_rgba(255,255,255,0.4)] backdrop-blur-xl backdrop-saturate-[180%] transform-gpu will-change-transform transition-all duration-300"
          >
            <a
              href="#contact"
              onClick={() => handleNavClick("contact")}
              className={`group relative flex h-[54px] w-full flex-col items-center justify-center rounded-[28px] transition-all duration-200 ${
                activeSection === "contact"
                  ? "border border-white/85 bg-white/80 text-neutral-950 shadow-[0_4px_14px_rgba(0,0,0,0.05),inset_0_1.5px_2px_rgba(255,255,255,0.95),inset_0_-1.5px_2px_rgba(255,255,255,0.35),inset_0_0_0_1px_rgba(255,255,255,0.25)]"
                  : "border border-transparent text-neutral-600 hover:text-neutral-950 hover:bg-white/40 hover:border-white/40"
              }`}
              aria-label="Contact"
            >
              {/* Expanding liquid ripple when droplet arrives at Contact */}
              {transitionDirection === "to-contact" && (
                <motion.span
                  initial={{ scale: 0.85, opacity: 0.8 }}
                  animate={{ scale: 1.18, opacity: 0 }}
                  transition={{ duration: 0.4, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0 rounded-[28px] border border-white/90 bg-white/20 pointer-events-none"
                />
              )}
              <Mail
                size={22}
                strokeWidth={activeSection === "contact" ? 2.2 : 1.9}
                className={`transition-colors duration-200 ${
                  activeSection === "contact" ? "drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] text-neutral-950" : "text-neutral-600 group-hover:text-neutral-950"
                }`}
              />
            </a>

            <button
              onClick={handleShare}
              className="group relative flex h-[54px] w-full flex-col items-center justify-center rounded-[28px] border border-transparent text-neutral-600 hover:text-neutral-950 hover:bg-white/[0.14] hover:border-white/40 transition-all duration-200 active:scale-95"
              aria-label="Share portfolio"
            >
              {copied ? (
                <Check size={22} strokeWidth={2.2} className="text-emerald-600 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" />
              ) : (
                <Share2 size={22} strokeWidth={1.9} className="transition-colors duration-200 text-neutral-600 group-hover:text-neutral-950" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

