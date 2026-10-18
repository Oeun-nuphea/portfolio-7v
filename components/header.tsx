"use client"

import { User, Layers, Briefcase, Mail } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"
import type React from "react"
import Image from "next/image"
import {
  motion,
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

const SECTION_DEFAULT_LEFT: Record<string, number> = {
  about: 4,
  stack: 88,
  experience: 172,
  contact: 256,
}

export default function Header() {
  const [activeSection, setActiveSection] = useState("about")
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [isLensActive, setIsLensActive] = useState(false)
  const [lensCenterX, setLensCenterX] = useState<number>(SECTION_DEFAULT_LEFT.about + 41)
  const [pillWidth, setPillWidth] = useState<number>(82)
  const [isVisible, setIsVisible] = useState(true)

  const isManualClickRef = useRef(false)
  const manualClickTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isPointerDraggingRef = useRef(false)
  const isTouchDeviceRef = useRef(false)
  const navBarRef = useRef<HTMLElement>(null)

  const highlightedSection = hoveredSection ?? activeSection

  // Continuous pixel-tracked X coordinate of the liquid glass pill inside navBarRef
  const rawLensLeft = useMotionValue<number>(SECTION_DEFAULT_LEFT.about)
  const springLensLeft = useSpring(rawLensLeft, {
    stiffness: 500,
    damping: 34,
    mass: 0.45,
  })
  const lensVelocityX = useVelocity(springLensLeft)

  // iOS 26 Liquid Glass: Flush (1x) at rest; bulges bigger/taller than the bar ONLY while actively swiping/hovering
  const baseScaleX = useSpring(1, { stiffness: 380, damping: 26, mass: 0.5 })
  const baseScaleY = useSpring(1, { stiffness: 380, damping: 26, mass: 0.5 })

  // Velocity-driven horizontal liquid stretch & vertical tension while swiping
  const velocityStretchX = useTransform(lensVelocityX, [-1200, 0, 1200], [0.2, 0, 0.2])
  const velocitySquashY = useTransform(lensVelocityX, [-1200, 0, 1200], [-0.08, 0, -0.08])

  const dropletScaleX = useTransform(
    [baseScaleX, velocityStretchX],
    ([bx, vx]: number[]) => bx + vx
  )
  const dropletScaleY = useTransform(
    [baseScaleY, velocitySquashY],
    ([by, vy]: number[]) => Math.max(0.95, by + vy)
  )

  useEffect(() => {
    if (isLensActive) {
      baseScaleX.set(1.18)
      baseScaleY.set(1.26)
    } else {
      baseScaleX.set(1)
      baseScaleY.set(1)
    }
  }, [isLensActive, baseScaleX, baseScaleY])

  useEffect(() => {
    const unsubscribe = springLensLeft.on("change", (latestLeft: number) => {
      setLensCenterX(latestLeft + pillWidth / 2)
    })
    return () => unsubscribe()
  }, [springLensLeft, pillWidth])

  const getSectionMetrics = useCallback((sectionKey: string): { left: number; width: number } => {
    if (!navBarRef.current) {
      return { left: SECTION_DEFAULT_LEFT[sectionKey] ?? 4, width: 82 }
    }
    const navRect = navBarRef.current.getBoundingClientRect()
    const targetEl = navBarRef.current.querySelector<HTMLElement>(
      `[data-nav-section="${sectionKey}"]`
    )
    if (!targetEl) {
      return { left: SECTION_DEFAULT_LEFT[sectionKey] ?? 4, width: 82 }
    }
    const rect = targetEl.getBoundingClientRect()
    return {
      left: rect.left - navRect.left,
      width: rect.width,
    }
  }, [])

  // Snap pill to active tab when not actively hovering/swiping, and keep width synced on resize
  useEffect(() => {
    const syncPillToActive = () => {
      if (!isLensActive) {
        const metrics = getSectionMetrics(activeSection)
        setPillWidth(metrics.width)
        rawLensLeft.set(metrics.left)
        setLensCenterX(metrics.left + metrics.width / 2)
      }
    }
    syncPillToActive()
    window.addEventListener("resize", syncPillToActive)
    return () => window.removeEventListener("resize", syncPillToActive)
  }, [activeSection, isLensActive, getSectionMetrics, rawLensLeft])

  const handleNavClick = (sectionKey: string) => {
    isManualClickRef.current = true
    if (manualClickTimeoutRef.current) {
      clearTimeout(manualClickTimeoutRef.current)
    }
    manualClickTimeoutRef.current = setTimeout(() => {
      isManualClickRef.current = false
    }, 800)

    setActiveSection(sectionKey)
    setIsLensActive(false)
    setHoveredSection(null)
    const metrics = getSectionMetrics(sectionKey)
    setPillWidth(metrics.width)
    rawLensLeft.set(metrics.left)
  }

  const updateLensFromClientX = (clientX: number, shouldScroll: boolean, activateLens: boolean) => {
    if (!navBarRef.current) return
    const navRect = navBarRef.current.getBoundingClientRect()
    const items = navBarRef.current.querySelectorAll<HTMLElement>("[data-nav-section]")

    let minLeft = 4
    let maxLeft = 256
    let currentWidth = pillWidth
    let closestSection: string | null = null
    let minDistance = Number.POSITIVE_INFINITY

    items.forEach((el, index) => {
      const rect = el.getBoundingClientRect()
      const localLeft = rect.left - navRect.left
      currentWidth = rect.width
      if (index === 0) minLeft = localLeft
      maxLeft = localLeft

      const section = el.dataset.navSection
      if (!section) return

      const center = rect.left + rect.width / 2
      const distance = Math.abs(clientX - center)
      if (distance < minDistance) {
        minDistance = distance
        closestSection = section
      }
    })

    setPillWidth(currentWidth)
    const localPointerX = clientX - navRect.left
    const clampedLeft = Math.max(minLeft, Math.min(maxLeft, localPointerX - currentWidth / 2))
    rawLensLeft.set(clampedLeft)
    if (activateLens) {
      setIsLensActive(true)
    }

    if (closestSection) {
      setHoveredSection(closestSection)
      if (shouldScroll && closestSection !== activeSection) {
        isManualClickRef.current = true
        if (manualClickTimeoutRef.current) {
          clearTimeout(manualClickTimeoutRef.current)
        }
        manualClickTimeoutRef.current = setTimeout(() => {
          isManualClickRef.current = false
        }, 800)
        setActiveSection(closestSection)
        const sectionEl = document.getElementById(closestSection)
        if (sectionEl) {
          sectionEl.scrollIntoView({ behavior: "smooth" })
        }
      }
    }
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    isTouchDeviceRef.current = true
    const touch = event.touches[0]
    if (!touch) return
    // Do not swell on simple tap start; only swell when finger drags in handleTouchMove
    updateLensFromClientX(touch.clientX, false, false)
  }

  const handleTouchMove = (event: React.TouchEvent<HTMLElement>) => {
    isTouchDeviceRef.current = true
    const touch = event.touches[0]
    if (!touch) return
    if (event.cancelable) {
      event.preventDefault()
    }
    updateLensFromClientX(touch.clientX, true, true)
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
    const metrics = getSectionMetrics(finalSection)
    setPillWidth(metrics.width)
    rawLensLeft.set(metrics.left)
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLElement>) => {
    if (isTouchDeviceRef.current) return
    isPointerDraggingRef.current = true
    updateLensFromClientX(event.clientX, true, true)
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    if (isTouchDeviceRef.current) return
    updateLensFromClientX(event.clientX, isPointerDraggingRef.current, true)
  }

  const handleMouseUp = () => {
    if (isTouchDeviceRef.current) return
    isPointerDraggingRef.current = false
  }

  const handleMouseLeave = () => {
    isPointerDraggingRef.current = false
    setIsLensActive(false)
    setHoveredSection(null)
    const metrics = getSectionMetrics(activeSection)
    setPillWidth(metrics.width)
    rawLensLeft.set(metrics.left)
  }

  // Continuous optical magnification as the oversized liquid glass lens passes over a tab
  const getTabMagnification = (sectionKey: string): number => {
    if (!isLensActive) return 1
    const metrics = getSectionMetrics(sectionKey)
    const itemCenterX = metrics.left + metrics.width / 2
    const distance = Math.abs(lensCenterX - itemCenterX)
    const proximity = Math.max(0, 1 - distance / (metrics.width * 0.9))
    return 1 + proximity * 0.18
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
    return () => {
      if (manualClickTimeoutRef.current) {
        clearTimeout(manualClickTimeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      {/* SVG Optical Refraction Filter for iOS 26/27 Liquid Glass */}
      <svg className="pointer-events-none fixed h-0 w-0" aria-hidden="true">
        <defs>
          <filter id="ios-liquid-glass-refraction" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.014 0.024"
              numOctaves="2"
              seed="7"
              result="refractionNoise"
            />
            <feGaussianBlur in="refractionNoise" stdDeviation="1.2" result="smoothNoise" />
            <feDisplacementMap
              in="SourceGraphic"
              in2="smoothNoise"
              scale="14"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Top Status Bar Soft Fade so scrolled content and header blend invisibly into Android 15 / iOS status bar */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-40 h-12 bg-gradient-to-b from-white via-white/85 to-transparent"
        aria-hidden="true"
      />

      {/* Bottom Gesture Navigation Bar Soft Fade so scrolled cards never hard-clip below the floating navbar */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-16 bg-gradient-to-t from-white via-white/90 to-transparent"
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
        </nav>
      </header>

      {/* iPhone iOS 26/27 Bottom-Center Ultra-Transparent 3D Liquid Glass Tab Bar */}
      <div className="pointer-events-none fixed inset-x-0 bottom-3 sm:bottom-6 z-50 flex items-center justify-center px-4 pb-[env(safe-area-inset-bottom,0px)]">
        <div className="pointer-events-auto flex items-center select-none">
          {/* 4-Tab Horizontal Liquid Glass Capsule (About, Stack, Experience, Contact) */}
          <nav
            ref={navBarRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className="relative flex h-[64px] items-center p-[4px] rounded-full touch-none"
          >
            {/* Layer 1 (z-0): Ultra-Transparent 3D Beveled Optical Glass Shell */}
            <div
              style={{
                backdropFilter:
                  "url(#ios-liquid-glass-refraction) blur(4px) saturate(210%) contrast(1.05) brightness(1.02)",
                WebkitBackdropFilter: "blur(4px) saturate(210%) contrast(1.05) brightness(1.02)",
                background:
                  "linear-gradient(125deg, rgba(255, 255, 255, 0.28) 0%, rgba(255, 255, 255, 0.04) 32%, rgba(255, 255, 255, 0.02) 68%, rgba(255, 255, 255, 0.22) 100%)",
                boxShadow:
                  "0 14px 36px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.05), 0 0 0 0.5px rgba(0, 0, 0, 0.11), inset 0 2px 1.5px rgba(255, 255, 255, 1), inset 0 -2px 1.5px rgba(255, 255, 255, 0.88), inset 0 0 0 1px rgba(255, 255, 255, 0.55), inset 0 5px 8px -2px rgba(255, 255, 255, 0.42), inset 0 -5px 8px -2px rgba(255, 255, 255, 0.28)",
              }}
              className="pointer-events-none absolute inset-0 z-0 rounded-full transform-gpu"
              aria-hidden="true"
            >
              {/* Top specular glass reflection arc */}
              <div className="absolute inset-x-4 top-[1px] h-[2px] rounded-full bg-gradient-to-r from-transparent via-white/95 to-transparent" />
              {/* Left & Right internal curved glass lens crescents */}
              <div className="absolute left-[3.5px] top-1/2 -translate-y-1/2 h-9 w-3.5 rounded-l-full bg-gradient-to-r from-white/65 via-white/25 to-transparent blur-[0.2px]" />
              <div className="absolute right-[3.5px] top-1/2 -translate-y-1/2 h-9 w-3.5 rounded-r-full bg-gradient-to-l from-white/65 via-white/25 to-transparent blur-[0.2px]" />
            </div>

            {/* Layer 2 (z-10): Ultra-Clear 3D Glass Active Pill (Flush 56px inside 64px bar at rest; swells bigger when swiping) */}
            <motion.div
              style={{
                x: springLensLeft,
                width: pillWidth,
                scaleX: dropletScaleX,
                scaleY: dropletScaleY,
                backdropFilter: isLensActive
                  ? "url(#ios-liquid-glass-refraction) blur(1.5px) saturate(240%) brightness(1.06) contrast(1.08)"
                  : "none",
                WebkitBackdropFilter: isLensActive
                  ? "blur(1.5px) saturate(240%) brightness(1.06) contrast(1.08)"
                  : "none",
                background: isLensActive
                  ? "radial-gradient(125% 100% at 50% 12%, rgba(255, 255, 255, 0.34) 0%, rgba(255, 255, 255, 0.015) 45%, rgba(255, 255, 255, 0.01) 75%, rgba(255, 255, 255, 0.22) 100%)"
                  : "linear-gradient(180deg, rgba(140, 142, 154, 0.14) 0%, rgba(160, 162, 174, 0.1) 100%)",
                boxShadow: isLensActive
                  ? "0 16px 36px rgba(0, 0, 0, 0.16), 0 4px 12px rgba(0, 0, 0, 0.08), 0 0 0 0.5px rgba(0, 0, 0, 0.1)"
                  : "inset 0 1.5px 1px rgba(255, 255, 255, 0.85), inset 0 -1px 1px rgba(255, 255, 255, 0.5), 0 1px 3px rgba(0, 0, 0, 0.04)",
              }}
              className="pointer-events-none absolute top-[4px] left-0 z-10 h-[56px] rounded-full transform-gpu will-change-transform transition-[background,box-shadow] duration-200"
            />

            {/* Layer 3 (z-30): Specular 3D Glass Meniscus Rim when Swiping */}
            <motion.div
              style={{
                x: springLensLeft,
                width: pillWidth,
                scaleX: dropletScaleX,
                scaleY: dropletScaleY,
                boxShadow: isLensActive
                  ? "inset 0 2.5px 2px rgba(255, 255, 255, 1), inset 0 -2px 2px rgba(255, 255, 255, 0.92), inset 2px 0 2px rgba(255, 255, 255, 0.85), inset -2px 0 2px rgba(255, 255, 255, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.92)"
                  : "none",
              }}
              className="pointer-events-none absolute top-[4px] left-0 z-30 h-[56px] rounded-full transform-gpu will-change-transform transition-shadow duration-200"
            >
              {/* Top curved specular reflection arc */}
              <div
                className={`pointer-events-none absolute inset-x-3 top-[1.5px] h-2.5 rounded-t-full bg-gradient-to-b from-white/95 via-white/35 to-transparent transition-opacity duration-200 ${
                  isLensActive ? "opacity-100" : "opacity-0"
                }`}
              />
              {/* Bottom curved caustic rim */}
              <div
                className={`pointer-events-none absolute inset-x-4 bottom-[1.5px] h-2 rounded-b-full bg-gradient-to-t from-white/80 to-transparent transition-opacity duration-200 ${
                  isLensActive ? "opacity-100" : "opacity-0"
                }`}
              />
            </motion.div>

            {/* Layer 4 (z-20): Crisp Apple Tab Items (Icon + Label) */}
            {navItems.map((item) => {
              const Icon = item.icon
              const sectionKey = item.href.substring(1)
              const isHighlighted = highlightedSection === sectionKey
              const tabScale = getTabMagnification(sectionKey)

              return (
                <a
                  key={item.label}
                  href={item.href}
                  data-nav-section={sectionKey}
                  onClick={() => handleNavClick(sectionKey)}
                  className={`group relative z-20 flex h-[56px] w-[80px] sm:w-[94px] flex-col items-center justify-center rounded-full transition-colors duration-150 ${
                    isHighlighted
                      ? "text-[#09090B]"
                      : "text-neutral-600 hover:text-[#09090B]"
                  }`}
                >
                  <span
                    style={{ transform: `scale(${tabScale})` }}
                    className="flex flex-col items-center justify-center gap-1 transition-transform duration-75 ease-out will-change-transform"
                  >
                    <Icon
                      size={21}
                      strokeWidth={isHighlighted ? 2.6 : 1.9}
                      className={`transition-colors duration-150 ${
                        isHighlighted
                          ? "text-[#09090B]"
                          : "text-neutral-600 group-hover:text-[#09090B]"
                      }`}
                    />
                    <span
                      className={`text-[11px] leading-none tracking-[-0.01em] transition-colors duration-150 ${
                        isHighlighted
                          ? "font-bold text-[#09090B]"
                          : "font-medium text-neutral-600 group-hover:text-[#09090B]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </span>
                </a>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}

