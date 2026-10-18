"use client"

import { User, Layers, Briefcase, Mail, Check, Share2 } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"
import type React from "react"
import Image from "next/image"
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useVelocity,
  useTransform,
} from "framer-motion"

const navItems = [
  { label: "About", href: "#about", icon: User },
  { label: "Stack", href: "#stack", icon: Layers },
  { label: "Experience", href: "#experience", icon: Briefcase },
  { label: "Contact", href: "#contact", icon: Mail },
]

const SECTION_DEFAULT_TOP: Record<string, number> = {
  about: 3,
  stack: 57,
  experience: 111,
  contact: 185,
}

export default function Header() {
  const [activeSection, setActiveSection] = useState("about")
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [isLensActive, setIsLensActive] = useState(false)
  const [lensCenterY, setLensCenterY] = useState<number>(SECTION_DEFAULT_TOP.about + 26)
  const [copied, setCopied] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [transitionDirection, setTransitionDirection] = useState<"to-contact" | "to-experience" | null>(null)

  const prevSectionRef = useRef(activeSection)
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isManualClickRef = useRef(false)
  const manualClickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isPointerDraggingRef = useRef(false)
  const constraintsRef = useRef<HTMLDivElement>(null)
  const navContainerRef = useRef<HTMLDivElement>(null)

  const highlightedSection = hoveredSection ?? activeSection

  // Continuous pixel-tracked Y coordinate of the liquid glass droplet inside navContainerRef
  const rawLensTop = useMotionValue<number>(SECTION_DEFAULT_TOP.about)
  const springLensTop = useSpring(rawLensTop, {
    stiffness: 520,
    damping: 32,
    mass: 0.45,
  })
  const lensVelocity = useVelocity(springLensTop)

  // Subtle, refined Apple iOS 26 pill expansion when hovering/dragging (no oversized ballooning)
  const baseScaleX = useSpring(1, { stiffness: 420, damping: 28 })
  const baseScaleY = useSpring(1, { stiffness: 420, damping: 28 })

  // Subtle velocity-driven elastic stretch while gliding
  const velocityStretchY = useTransform(lensVelocity, [-1000, 0, 1000], [0.08, 0, 0.08])
  const velocitySquashX = useTransform(lensVelocity, [-1000, 0, 1000], [-0.04, 0, -0.04])

  const dropletScaleX = useTransform(
    [baseScaleX, velocitySquashX],
    ([bx, vx]: number[]) => Math.max(0.95, bx + vx)
  )
  const dropletScaleY = useTransform(
    [baseScaleY, velocityStretchY],
    ([by, vy]: number[]) => by + vy
  )

  useEffect(() => {
    if (isLensActive) {
      baseScaleX.set(1.08)
      baseScaleY.set(1.06)
    } else {
      baseScaleX.set(1)
      baseScaleY.set(1)
    }
  }, [isLensActive, baseScaleX, baseScaleY])

  useEffect(() => {
    const unsubscribe = springLensTop.on("change", (latestTop: number) => {
      setLensCenterY(latestTop + 27)
    })
    return () => unsubscribe()
  }, [springLensTop])

  const getSectionLocalTop = useCallback((sectionKey: string): number => {
    if (!navContainerRef.current) {
      return SECTION_DEFAULT_TOP[sectionKey] ?? 2
    }
    const containerRect = navContainerRef.current.getBoundingClientRect()
    const targetEl = navContainerRef.current.querySelector<HTMLElement>(
      `[data-nav-section="${sectionKey}"]`
    )
    if (!targetEl) {
      return SECTION_DEFAULT_TOP[sectionKey] ?? 2
    }
    const rect = targetEl.getBoundingClientRect()
    return rect.top - containerRect.top
  }, [])

  // Snap droplet to active section when not actively scrubbing/hovering
  useEffect(() => {
    if (!isLensActive) {
      const targetTop = getSectionLocalTop(activeSection)
      rawLensTop.set(targetTop)
    }
  }, [activeSection, isLensActive, getSectionLocalTop, rawLensTop])

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

  const updateLensFromClientY = (clientY: number, shouldScroll: boolean) => {
    if (!navContainerRef.current) return
    const containerRect = navContainerRef.current.getBoundingClientRect()
    const items = navContainerRef.current.querySelectorAll<HTMLElement>("[data-nav-section]")

    let minTop = 2
    let maxTop = 178
    let closestSection: string | null = null
    let minDistance = Number.POSITIVE_INFINITY

    items.forEach((el, index) => {
      const rect = el.getBoundingClientRect()
      const localTop = rect.top - containerRect.top
      if (index === 0) minTop = localTop
      maxTop = localTop

      const section = el.dataset.navSection
      if (!section) return

      const center = rect.top + rect.height / 2
      const distance = Math.abs(clientY - center)
      if (distance < minDistance) {
        minDistance = distance
        closestSection = section
      }
    })

    // If pointer is below Contact (over the Share button), release the lens
    const localPointerY = clientY - containerRect.top
    if (localPointerY > maxTop + 56) {
      setIsLensActive(false)
      setHoveredSection(null)
      rawLensTop.set(getSectionLocalTop(activeSection))
      return
    }

    const clampedTop = Math.max(minTop, Math.min(maxTop, localPointerY - 27))
    rawLensTop.set(clampedTop)
    setIsLensActive(true)

    if (closestSection) {
      setHoveredSection(closestSection)
      if (shouldScroll && closestSection !== activeSection) {
        handleNavClick(closestSection)
        const sectionEl = document.getElementById(closestSection)
        if (sectionEl) {
          sectionEl.scrollIntoView({ behavior: "smooth" })
        }
      }
    }
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0]
    if (!touch) return
    updateLensFromClientY(touch.clientY, false)
  }

  const handleTouchMove = (event: React.TouchEvent<HTMLDivElement>) => {
    const touch = event.touches[0]
    if (!touch) return
    if (event.cancelable) {
      event.preventDefault()
    }
    updateLensFromClientY(touch.clientY, true)
  }

  const handleTouchEnd = () => {
    if (hoveredSection && hoveredSection !== activeSection) {
      handleNavClick(hoveredSection)
      const sectionEl = document.getElementById(hoveredSection)
      if (sectionEl) {
        sectionEl.scrollIntoView({ behavior: "smooth" })
      }
    }
    const finalSection = hoveredSection ?? activeSection
    setIsLensActive(false)
    setHoveredSection(null)
    rawLensTop.set(getSectionLocalTop(finalSection))
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    isPointerDraggingRef.current = true
    updateLensFromClientY(event.clientY, true)
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    updateLensFromClientY(event.clientY, isPointerDraggingRef.current)
  }

  const handleMouseUp = () => {
    isPointerDraggingRef.current = false
  }

  const handleMouseLeave = () => {
    isPointerDraggingRef.current = false
    setIsLensActive(false)
    setHoveredSection(null)
    rawLensTop.set(getSectionLocalTop(activeSection))
  }

  // Subtle optical magnification of the icon under the lens
  const getIconMagnification = (sectionKey: string): number => {
    if (!isLensActive) return 1
    const itemCenterY = (SECTION_DEFAULT_TOP[sectionKey] ?? 2) + 27
    const distance = Math.abs(lensCenterY - itemCenterY)
    const proximity = Math.max(0, 1 - distance / 52)
    return 1 + proximity * 0.12
  }

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      if (window.innerWidth >= 768) {
        if (!isVisible) setIsVisible(true)
        return
      }

      const currentScrollY = window.scrollY

      if (currentScrollY < 50) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY) {
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
        {/* Apple iOS 26 Liquid Glass Floating Navigation Bar */}
        <div
          ref={navContainerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 pointer-events-auto touch-none select-none"
        >
          {/* Apple iOS 26 Selection Pill: Smoky systemFill at rest, crisp clear Liquid Glass when sliding */}
          <motion.div
            style={{
              y: springLensTop,
              scaleX: dropletScaleX,
              scaleY: dropletScaleY,
              background: isLensActive
                ? "linear-gradient(180deg, rgba(255, 255, 255, 0.78) 0%, rgba(255, 255, 255, 0.52) 100%)"
                : "rgba(118, 118, 128, 0.15)",
              boxShadow: isLensActive
                ? "0 6px 20px rgba(0, 0, 0, 0.08), 0 0 0 0.5px rgba(0, 0, 0, 0.06), inset 0 1.5px 1px rgba(255, 255, 255, 0.98), inset 0 -1px 1px rgba(255, 255, 255, 0.75)"
                : "inset 0 1px 0.5px rgba(255, 255, 255, 0.65), inset 0 0 0 0.5px rgba(0, 0, 0, 0.03)",
            }}
            className="pointer-events-none absolute top-0 left-[3px] z-10 h-[52px] w-[52px] rounded-full transform-gpu will-change-transform transition-[background,box-shadow] duration-200"
          />

          {/* Main Apple Neutral Liquid Glass Capsule: Vertical side dock */}
          <nav className="relative flex w-[58px] flex-col items-center p-[3px] gap-0.5 rounded-full">
            {/* Capsule Glass Backdrop (z-0): Apple neutral #F5F5F7 translucent glass with crisp 0.5px hairline */}
            <div
              style={{
                background: "rgba(245, 245, 247, 0.68)",
                boxShadow:
                  "0 10px 30px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.04), 0 0 0 0.5px rgba(0, 0, 0, 0.08), inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 1px rgba(255, 255, 255, 0.7), inset 0 0 0 1px rgba(255, 255, 255, 0.6)",
              }}
              className="pointer-events-none absolute inset-0 z-0 rounded-full backdrop-blur-2xl backdrop-saturate-[190%] transform-gpu"
              aria-hidden="true"
            />

            {navItems
              .filter((item) => item.href !== "#contact")
              .map((item) => {
                const Icon = item.icon
                const sectionKey = item.href.substring(1)
                const isHighlighted = highlightedSection === sectionKey
                const iconScale = getIconMagnification(sectionKey)

                return (
                  <a
                    key={item.label}
                    href={item.href}
                    data-nav-section={sectionKey}
                    onClick={() => handleNavClick(sectionKey)}
                    className={`group relative z-20 flex h-[52px] w-[52px] flex-col items-center justify-center rounded-full transition-colors duration-150 ${
                      isHighlighted
                        ? "text-[#5826E0]"
                        : "text-[#1C1C1E] hover:text-[#5826E0]"
                    }`}
                  >
                    <span
                      style={{ transform: `scale(${iconScale})` }}
                      className="relative z-20 flex items-center justify-center transition-transform duration-75 ease-out will-change-transform"
                    >
                      <Icon
                        size={21}
                        strokeWidth={isHighlighted ? 2.3 : 2}
                        className={`transition-colors duration-150 ${
                          isHighlighted
                            ? "text-[#5826E0]"
                            : "text-[#1C1C1E] group-hover:text-[#5826E0]"
                        }`}
                      />
                    </span>
                  </a>
                )
              })}
          </nav>

          {/* Dynamic Traveling Liquid Glass Droplet Animation between Experience and Contact */}
          <div className="relative h-0 w-full flex items-center justify-center pointer-events-none z-20">
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
                  <div className="relative flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white/80 shadow-[0_2px_8px_rgba(0,0,0,0.08),0_0_0_0.5px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,1)] backdrop-blur-md" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Paired Apple Neutral Liquid Glass Capsule for Contact & Share */}
          <div className="relative flex w-[58px] flex-col items-center p-[3px] gap-0.5 rounded-full">
            {/* Capsule Glass Backdrop (z-0) */}
            <div
              style={{
                background: "rgba(245, 245, 247, 0.68)",
                boxShadow:
                  "0 10px 30px rgba(0, 0, 0, 0.07), 0 1px 3px rgba(0, 0, 0, 0.04), 0 0 0 0.5px rgba(0, 0, 0, 0.08), inset 0 1.5px 1px rgba(255, 255, 255, 0.95), inset 0 -1px 1px rgba(255, 255, 255, 0.7), inset 0 0 0 1px rgba(255, 255, 255, 0.6)",
              }}
              className="pointer-events-none absolute inset-0 z-0 rounded-full backdrop-blur-2xl backdrop-saturate-[190%] transform-gpu"
              aria-hidden="true"
            />

            <a
              href="#contact"
              data-nav-section="contact"
              onClick={() => handleNavClick("contact")}
              className={`group relative z-20 flex h-[52px] w-[52px] flex-col items-center justify-center rounded-full transition-colors duration-150 ${
                highlightedSection === "contact"
                  ? "text-[#5826E0]"
                  : "text-[#1C1C1E] hover:text-[#5826E0]"
              }`}
              aria-label="Contact"
            >
              <span
                style={{ transform: `scale(${getIconMagnification("contact")})` }}
                className="relative z-20 flex items-center justify-center transition-transform duration-75 ease-out will-change-transform"
              >
                <Mail
                  size={21}
                  strokeWidth={highlightedSection === "contact" ? 2.3 : 2}
                  className={`transition-colors duration-150 ${
                    highlightedSection === "contact"
                      ? "text-[#5826E0]"
                      : "text-[#1C1C1E] group-hover:text-[#5826E0]"
                  }`}
                />
              </span>
            </a>

            <button
              onClick={handleShare}
              onMouseEnter={() => {
                setIsLensActive(false)
                setHoveredSection(null)
                rawLensTop.set(getSectionLocalTop(activeSection))
              }}
              className="group relative z-20 flex h-[52px] w-[52px] flex-col items-center justify-center rounded-full text-[#1C1C1E] hover:text-[#5826E0] hover:bg-black/[0.04] transition-all duration-150 active:scale-95"
              aria-label="Share portfolio"
            >
              {copied ? (
                <Check size={21} strokeWidth={2.3} className="text-emerald-600" />
              ) : (
                <Share2 size={21} strokeWidth={2} className="transition-colors duration-150 text-[#1C1C1E] group-hover:text-[#5826E0]" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

