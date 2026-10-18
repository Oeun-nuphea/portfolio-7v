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
  const dragStartXRef = useRef<number | null>(null)
  const navBarRef = useRef<HTMLElement>(null)

  const highlightedSection = hoveredSection ?? activeSection

  // Continuous pixel-tracked X coordinate of the liquid glass pill inside navBarRef
  const rawLensLeft = useMotionValue<number>(SECTION_DEFAULT_LEFT.about)
  const springLensLeft = useSpring(rawLensLeft, {
    stiffness: 500,
    damping: 36,
    mass: 0.45,
  })
  const lensVelocityX = useVelocity(springLensLeft)

  // iOS Liquid Glass swell on hover / swipe: expands bigger and taller than the bar capsule
  const baseScaleX = useSpring(1, { stiffness: 380, damping: 26, mass: 0.5 })
  const baseScaleY = useSpring(1, { stiffness: 380, damping: 26, mass: 0.5 })

  // Velocity-driven horizontal liquid stretch & vertical tension while swiping
  const velocityStretchX = useTransform(lensVelocityX, [-1200, 0, 1200], [0.18, 0, 0.18])
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
      baseScaleY.set(1.28)
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

  // Snap pill to active tab when not actively swiping, and keep width synced on resize
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

    isPointerDraggingRef.current = false
    dragStartXRef.current = null
    setActiveSection(sectionKey)
    setIsLensActive(false)
    setHoveredSection(null)
    const metrics = getSectionMetrics(sectionKey)
    setPillWidth(metrics.width)
    rawLensLeft.set(metrics.left)
  }

  const commitSectionAndScroll = (sectionKey: string) => {
    handleNavClick(sectionKey)
    const sectionEl = document.getElementById(sectionKey)
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: "smooth" })
    }
  }

  const updateLensFromClientX = (clientX: number, activateLens: boolean) => {
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
    }
  }

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    isTouchDeviceRef.current = true
    const touch = event.touches[0]
    if (!touch) return
    dragStartXRef.current = touch.clientX
  }

  const handleTouchMove = (event: React.TouchEvent<HTMLElement>) => {
    isTouchDeviceRef.current = true
    const touch = event.touches[0]
    if (!touch) return

    // Ignore tiny finger jitter (< 8px) during a normal tap so tapping "About" never triggers the swipe lens
    if (dragStartXRef.current !== null && Math.abs(touch.clientX - dragStartXRef.current) < 8 && !isLensActive) {
      return
    }

    if (event.cancelable) {
      event.preventDefault()
    }
    // Only move the liquid glass lens while finger is down — do NOT scroll until finger is lifted
    updateLensFromClientX(touch.clientX, true)
  }

  const handleTouchEnd = () => {
    dragStartXRef.current = null
    if (hoveredSection) {
      commitSectionAndScroll(hoveredSection)
      return
    }
    setIsLensActive(false)
    setHoveredSection(null)
    const metrics = getSectionMetrics(activeSection)
    setPillWidth(metrics.width)
    rawLensLeft.set(metrics.left)
  }

  const handleTouchCancel = () => {
    dragStartXRef.current = null
    setIsLensActive(false)
    setHoveredSection(null)
    const metrics = getSectionMetrics(activeSection)
    setPillWidth(metrics.width)
    rawLensLeft.set(metrics.left)
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLElement>) => {
    if (isTouchDeviceRef.current) return
    isPointerDraggingRef.current = true
    dragStartXRef.current = event.clientX
    updateLensFromClientX(event.clientX, true)
  }

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    if (isTouchDeviceRef.current) return
    updateLensFromClientX(event.clientX, true)
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    if (isTouchDeviceRef.current) return
    updateLensFromClientX(event.clientX, true)
  }

  const handleMouseUp = () => {
    if (isTouchDeviceRef.current) return
    const wasDragging =
      isPointerDraggingRef.current &&
      dragStartXRef.current !== null &&
      hoveredSection !== null
    isPointerDraggingRef.current = false
    dragStartXRef.current = null
    if (wasDragging && hoveredSection) {
      commitSectionAndScroll(hoveredSection)
    }
  }

  const handleMouseLeave = () => {
    isPointerDraggingRef.current = false
    dragStartXRef.current = null
    setIsLensActive(false)
    setHoveredSection(null)
    const metrics = getSectionMetrics(activeSection)
    setPillWidth(metrics.width)
    rawLensLeft.set(metrics.left)
  }

  // Continuous optical magnification as the liquid glass lens hovers/passes over a tab
  const getTabMagnification = (sectionKey: string): number => {
    if (!isLensActive) return 1
    const metrics = getSectionMetrics(sectionKey)
    const itemCenterX = metrics.left + metrics.width / 2
    const distance = Math.abs(lensCenterX - itemCenterX)
    const proximity = Math.max(0, 1 - distance / (metrics.width * 0.9))
    return 1 + proximity * 0.16
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
      {/* SVG Optical Refraction + RGB Chromatic Dispersion Filter for 3D Liquid Glass */}
      <svg className="pointer-events-none fixed h-0 w-0" aria-hidden="true">
        <defs>
          <filter
            id="ios-liquid-glass-refraction"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012 0.034"
              numOctaves="2"
              seed="5"
              result="refractionNoise"
            />
            <feGaussianBlur in="refractionNoise" stdDeviation="1.8" result="smoothMap" />

            {/* Red Wavelength Refraction (Strongest Bend = Chromatic Fringe) */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="smoothMap"
              scale="26"
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispR"
            />
            <feColorMatrix
              in="dispR"
              type="matrix"
              values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="rChannel"
            />

            {/* Green Wavelength Refraction (Center Optical Axis) */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="smoothMap"
              scale="20"
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispG"
            />
            <feColorMatrix
              in="dispG"
              type="matrix"
              values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
              result="gChannel"
            />

            {/* Blue Wavelength Refraction (Tighter Bend = Opposite Chromatic Fringe) */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="smoothMap"
              scale="14"
              xChannelSelector="R"
              yChannelSelector="G"
              result="dispB"
            />
            <feColorMatrix
              in="dispB"
              type="matrix"
              values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
              result="bChannel"
            />

            {/* Recombine RGB Channels into Prismatic Refracted Glass */}
            <feBlend in="rChannel" in2="gChannel" mode="screen" result="rgChannels" />
            <feBlend in="rgChannels" in2="bChannel" mode="screen" result="prismaticGlass" />
          </filter>
        </defs>
      </svg>

      {/* Top Status Bar Soft Fade */}
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
        </nav>
      </header>

      {/* Bottom-Center 3D Optical Liquid Glass Menu Bar */}
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] z-50 flex items-center justify-center px-4">
        <div className="pointer-events-auto flex items-center select-none">
          <nav
            ref={navBarRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
            onMouseEnter={handleMouseEnter}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className="relative flex h-[64px] items-center p-[4px] rounded-full touch-none"
          >
            {/* Layer 1A (z-0): Ultra-Clear Prismatic Optical Refraction Glass Capsule (-20% opacity/blur) */}
            <div
              style={{
                backdropFilter:
                  "url(#ios-liquid-glass-refraction) blur(0.8px) saturate(200%) contrast(1.04) brightness(1.02)",
                WebkitBackdropFilter: "blur(1.5px) saturate(200%) contrast(1.04) brightness(1.02)",
                background:
                  "radial-gradient(100% 100% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.03) 70%, rgba(255, 255, 255, 0.18) 100%)",
                boxShadow:
                  "0 10px 28px -4px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04), 0 0 0 0.5px rgba(0, 0, 0, 0.1), inset 0 0 10px rgba(255, 255, 255, 0.28), inset 1.5px 1.5px 1.5px rgba(255, 255, 255, 0.85), inset -1.5px -1.5px 1.5px rgba(255, 255, 255, 0.7), inset 2.5px 0 5px rgba(56, 189, 248, 0.1), inset -2.5px 0 5px rgba(168, 85, 247, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.45)",
              }}
              className="pointer-events-none absolute inset-0 z-0 rounded-full transform-gpu"
              aria-hidden="true"
            />

            {/* Layer 1B (z-0): Subtle Pointer-Reactive Rim Glint (Zero Center Haze) */}
            <div
              style={{
                background: `radial-gradient(90px 24px at ${lensCenterX}px 0px, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(90px 24px at ${lensCenterX}px 64px, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0) 100%)`,
              }}
              className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-full"
              aria-hidden="true"
            >
              {/* Top Specular Filament */}
              <div className="absolute inset-x-8 top-[1px] h-[1px] rounded-full bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-75" />
              {/* Bottom Caustic Reflection Line */}
              <div className="absolute inset-x-10 bottom-[1px] h-[1px] rounded-full bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-65" />
            </div>

            {/* Layer 2 (z-10): Ultra-Clear 3D Water-Droplet Active / Sliding Tab Lens (-20% opacity) */}
            <motion.div
              style={{
                x: springLensLeft,
                width: pillWidth,
                scaleX: dropletScaleX,
                scaleY: dropletScaleY,
                transformOrigin:
                  highlightedSection === "about"
                    ? "15% 50%"
                    : highlightedSection === "contact"
                      ? "85% 50%"
                      : "50% 50%",
                background: isLensActive
                  ? "radial-gradient(62% 62% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.05) 68%, rgba(255, 255, 255, 0.32) 100%)"
                  : "radial-gradient(64% 64% at 50% 50%, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.06) 72%, rgba(255, 255, 255, 0.28) 100%)",
                boxShadow: isLensActive
                  ? "0 10px 24px -4px rgba(0, 0, 0, 0.14), 0 2px 6px rgba(0, 0, 0, 0.05), 0 0 0 0.5px rgba(0, 0, 0, 0.08), inset 0 0 10px rgba(255, 255, 255, 0.42), inset 2px 2px 2px rgba(255, 255, 255, 0.92), inset -2px -2px 2px rgba(255, 255, 255, 0.8), inset 2.5px 0 5px rgba(56, 189, 248, 0.16), inset -2.5px 0 5px rgba(168, 85, 247, 0.16), inset 0 0 0 1px rgba(255, 255, 255, 0.72)"
                  : "0 4px 12px rgba(0, 0, 0, 0.06), 0 0 0 0.5px rgba(0, 0, 0, 0.05), inset 0 0 8px rgba(255, 255, 255, 0.35), inset 1.5px 2px 1.5px rgba(255, 255, 255, 0.88), inset -1.5px -1.5px 1.5px rgba(255, 255, 255, 0.72), inset 2px 0 4px rgba(56, 189, 248, 0.12), inset -2px 0 4px rgba(168, 85, 247, 0.12), inset 0 0 0 1px rgba(255, 255, 255, 0.62)",
              }}
              className="pointer-events-none absolute top-[4px] left-0 z-10 h-[56px] overflow-hidden rounded-full transform-gpu will-change-transform transition-shadow duration-200"
            >
              {/* Thin Upper Rim Specular Crescent */}
              <div
                className={`pointer-events-none absolute inset-x-3 top-[1.5px] h-[6px] rounded-t-full bg-gradient-to-b from-white/55 to-transparent transition-opacity duration-200 ${
                  isLensActive ? "opacity-90" : "opacity-60"
                }`}
              />
              {/* Thin Lower Caustic Rim Arc */}
              <div
                className={`pointer-events-none absolute inset-x-4 bottom-[1.5px] h-[4px] rounded-b-full bg-gradient-to-t from-white/45 to-transparent transition-opacity duration-200 ${
                  isLensActive ? "opacity-85" : "opacity-50"
                }`}
              />
            </motion.div>

            {/* Layer 3 (z-20): Tab Items (Icon + Label) */}
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
                          ? "text-[#09090B] drop-shadow-[0_1px_1px_rgba(255,255,255,0.65)]"
                          : "text-neutral-600 group-hover:text-[#09090B]"
                      }`}
                    />
                    <span
                      className={`text-[11px] leading-none tracking-[-0.01em] transition-colors duration-150 ${
                        isHighlighted
                          ? "font-bold text-[#09090B] drop-shadow-[0_1px_1px_rgba(255,255,255,0.65)]"
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

