"use client"

import { User, Layers, Briefcase, Mail, Box, type LucideIcon } from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"
import type React from "react"
import Image from "next/image"
import Link from "next/link"
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useVelocity,
  useTransform,
  type MotionValue,
} from "framer-motion"

interface NavItem {
  label: string
  href: string
  sectionKey: string
  icon: LucideIcon
}

interface TabMetrics {
  left: number
  width: number
  centerX: number
}

type LensMode = "idle" | "pulse" | "hover" | "press"

const navItems: NavItem[] = [
  { label: "About", href: "#about", sectionKey: "about", icon: User },
  { label: "Stack", href: "#stack", sectionKey: "stack", icon: Layers },
  { label: "Experience", href: "#experience", sectionKey: "experience", icon: Briefcase },
  { label: "Contact", href: "#contact", sectionKey: "contact", icon: Mail },
]

const DEFAULT_TAB_WIDTH = 80
const SECTION_DEFAULT_METRICS: Record<string, TabMetrics> = {
  about: { left: 4, width: DEFAULT_TAB_WIDTH, centerX: 4 + DEFAULT_TAB_WIDTH / 2 },
  stack: { left: 84, width: DEFAULT_TAB_WIDTH, centerX: 84 + DEFAULT_TAB_WIDTH / 2 },
  experience: { left: 164, width: DEFAULT_TAB_WIDTH, centerX: 164 + DEFAULT_TAB_WIDTH / 2 },
  contact: { left: 244, width: DEFAULT_TAB_WIDTH, centerX: 244 + DEFAULT_TAB_WIDTH / 2 },
}

const SWIFTUI_SPRING_POSITION = {
  stiffness: 420,
  damping: 30,
  mass: 0.68,
}

const SWIFTUI_SPRING_MORPH = {
  stiffness: 360,
  damping: 25,
  mass: 0.62,
}

function applyRubberBand(value: number, min: number, max: number): number {
  if (value < min) {
    const overscroll = min - value
    return min - (overscroll * 0.35) / (1 + overscroll * 0.04)
  }
  if (value > max) {
    const overscroll = value - max
    return max + (overscroll * 0.35) / (1 + overscroll * 0.04)
  }
  return value
}

interface LiquidGlassTabItemProps {
  item: NavItem
  isActive: boolean
  isHighlighted: boolean
  metrics: TabMetrics
  lensCenterXMotion: MotionValue<number>
  lensIntensitySpring: MotionValue<number>
  onSelect: (sectionKey: string, event: React.MouseEvent<HTMLAnchorElement>) => void
}

function LiquidGlassTabItem({
  item,
  isActive,
  isHighlighted,
  metrics,
  lensCenterXMotion,
  lensIntensitySpring,
  onSelect,
}: LiquidGlassTabItemProps) {
  const Icon = item.icon
  const metricsRef = useRef<TabMetrics>(metrics)
  metricsRef.current = metrics

  // 120fps optical magnification curve driven directly by MotionValues (zero React re-renders)
  const opticalScale = useTransform(
    [lensCenterXMotion, lensIntensitySpring],
    ([centerX, intensity]: number[]) => {
      const { centerX: tabCenterX, width: tabWidth } = metricsRef.current
      const distance = Math.abs(centerX - tabCenterX)
      const proximity = Math.max(0, 1 - distance / (tabWidth * 0.88))
      const smooth = proximity * proximity * (3 - 2 * proximity)
      return 1 + smooth * intensity * 0.14
    }
  )

  const opticalLiftY = useTransform(
    [lensCenterXMotion, lensIntensitySpring],
    ([centerX, intensity]: number[]) => {
      const { centerX: tabCenterX, width: tabWidth } = metricsRef.current
      const distance = Math.abs(centerX - tabCenterX)
      const proximity = Math.max(0, 1 - distance / (tabWidth * 0.88))
      const smooth = proximity * proximity * (3 - 2 * proximity)
      return -smooth * intensity * 1.5
    }
  )

  return (
    <a
      href={item.href}
      data-nav-section={item.sectionKey}
      aria-current={isActive ? "page" : undefined}
      onClick={(event) => onSelect(item.sectionKey, event)}
      className={`group relative z-20 flex h-[56px] w-[80px] sm:w-[94px] flex-col items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20 ${
        isHighlighted
          ? "text-[#09090B]"
          : "text-neutral-600/90 hover:text-[#09090B]"
      }`}
    >
      <motion.span
        style={{
          scale: opticalScale,
          y: opticalLiftY,
        }}
        className="flex flex-col items-center justify-center gap-1 will-change-transform"
      >
        <motion.span
          animate={isActive ? { scale: [1, 1.16, 1], y: [0, -1.5, 0] } : { scale: 1, y: 0 }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center justify-center"
        >
          <Icon
            size={21}
            strokeWidth={isHighlighted ? 2.4 : 1.85}
            className={`transition-all duration-200 ${
              isHighlighted
                ? "text-[#09090B] drop-shadow-[0_1px_1px_rgba(255,255,255,0.75)]"
                : "text-neutral-600/90 group-hover:text-[#09090B]"
            }`}
          />
        </motion.span>
        <span
          className={`text-[11px] leading-none tracking-[-0.012em] transition-colors duration-200 ${
            isHighlighted
              ? "font-semibold text-[#09090B] drop-shadow-[0_1px_1px_rgba(255,255,255,0.75)]"
              : "font-medium text-neutral-600/90 group-hover:text-[#09090B]"
          }`}
        >
          {item.label}
        </span>
      </motion.span>
    </a>
  )
}

export default function Header() {
  const [activeSection, setActiveSection] = useState("about")
  const [hoveredSection, setHoveredSection] = useState<string | null>(null)
  const [lensMode, setLensMode] = useState<LensMode>("idle")
  const [tabMetricsMap, setTabMetricsMap] = useState<Record<string, TabMetrics>>(
    SECTION_DEFAULT_METRICS
  )
  const [isVisible, setIsVisible] = useState(true)

  const isManualClickRef = useRef(false)
  const manualClickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tapPulseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const touchHoldTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const suppressClickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isPointerDraggingRef = useRef(false)
  const hasTouchDraggedRef = useRef(false)
  const suppressNextClickRef = useRef(false)
  const isTouchDeviceRef = useRef(false)
  const dragStartXRef = useRef<number | null>(null)
  const navBarRef = useRef<HTMLElement>(null)
  const tabMetricsRef = useRef<Record<string, TabMetrics>>(SECTION_DEFAULT_METRICS)

  const highlightedSection = hoveredSection ?? activeSection
  const isLensElevated = lensMode !== "idle"

  // Continuous pixel-tracked X & width of the SwiftUI Liquid Glass pill inside navBarRef
  const rawLensLeft = useMotionValue<number>(SECTION_DEFAULT_METRICS.about.left)
  const springLensLeft = useSpring(rawLensLeft, SWIFTUI_SPRING_POSITION)
  const rawPillWidth = useMotionValue<number>(SECTION_DEFAULT_METRICS.about.width)
  const springPillWidth = useSpring(rawPillWidth, SWIFTUI_SPRING_POSITION)
  const lensVelocityX = useVelocity(springLensLeft)

  // Continuous center X for reactive specular rim illumination & per-tab optical magnification
  const lensCenterXMotion = useTransform(
    [springLensLeft, springPillWidth],
    ([left, width]: number[]) => left + width / 2
  )

  // SwiftUI Liquid Glass morph springs (0 = calm resting pill, 1 = lifted refractive droplet)
  const baseScaleX = useSpring(1, SWIFTUI_SPRING_MORPH)
  const baseScaleY = useSpring(1, SWIFTUI_SPRING_MORPH)
  const lensIntensitySpring = useSpring(0, SWIFTUI_SPRING_MORPH)
  const barInteractiveScale = useSpring(1, { stiffness: 380, damping: 28, mass: 0.6 })

  // Velocity-coupled fluid stretch & vertical tension during glides and swipes
  const velocityStretchX = useTransform(
    lensVelocityX,
    [-1400, -280, 0, 280, 1400],
    [0.17, 0.035, 0, 0.035, 0.17]
  )
  const velocitySquashY = useTransform(
    lensVelocityX,
    [-1400, -280, 0, 280, 1400],
    [-0.08, -0.015, 0, -0.015, -0.08]
  )
  const specularShiftX = useTransform(lensVelocityX, [-1200, 0, 1200], [-6, 0, 6])

  const dropletScaleX = useTransform(
    [baseScaleX, velocityStretchX],
    ([bx, vx]: number[]) => bx + vx
  )
  const dropletScaleY = useTransform(
    [baseScaleY, velocitySquashY],
    ([by, vy]: number[]) => Math.max(0.94, by + vy)
  )

  const restingPillOpacity = useTransform(lensIntensitySpring, [0, 0.65], [1, 0])
  const activeLensOpacity = useTransform(lensIntensitySpring, [0, 1], [0, 1])

  // Pointer-reactive SwiftUI glass rim illumination along top & bottom edges
  const rimGlintBackground = useMotionTemplate`radial-gradient(108px 26px at ${lensCenterXMotion}px 0px, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(108px 24px at ${lensCenterXMotion}px 64px, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 100%)`

  useEffect(() => {
    if (lensMode === "press") {
      baseScaleX.set(1.16)
      baseScaleY.set(1.26)
      lensIntensitySpring.set(1)
      barInteractiveScale.set(1.018)
    } else if (lensMode === "hover") {
      baseScaleX.set(1.12)
      baseScaleY.set(1.2)
      lensIntensitySpring.set(0.95)
      barInteractiveScale.set(1.008)
    } else if (lensMode === "pulse") {
      baseScaleX.set(1.1)
      baseScaleY.set(1.18)
      lensIntensitySpring.set(0.92)
      barInteractiveScale.set(1.006)
    } else {
      baseScaleX.set(1)
      baseScaleY.set(1)
      lensIntensitySpring.set(0)
      barInteractiveScale.set(1)
    }
  }, [lensMode, baseScaleX, baseScaleY, lensIntensitySpring, barInteractiveScale])

  const measureAllTabs = useCallback((): Record<string, TabMetrics> => {
    if (!navBarRef.current) {
      return tabMetricsRef.current
    }
    const navRect = navBarRef.current.getBoundingClientRect()
    const items = navBarRef.current.querySelectorAll<HTMLElement>("[data-nav-section]")
    const measured: Record<string, TabMetrics> = { ...SECTION_DEFAULT_METRICS }

    items.forEach((el) => {
      const section = el.dataset.navSection
      if (!section) return
      const rect = el.getBoundingClientRect()
      const left = rect.left - navRect.left
      measured[section] = {
        left,
        width: rect.width,
        centerX: left + rect.width / 2,
      }
    })

    tabMetricsRef.current = measured
    setTabMetricsMap(measured)
    return measured
  }, [])

  const getSectionMetrics = useCallback((sectionKey: string): TabMetrics => {
    return (
      tabMetricsRef.current[sectionKey] ??
      SECTION_DEFAULT_METRICS[sectionKey] ??
      SECTION_DEFAULT_METRICS.about
    )
  }, [])

  const clearTouchHoldTimer = useCallback(() => {
    if (touchHoldTimeoutRef.current) {
      clearTimeout(touchHoldTimeoutRef.current)
      touchHoldTimeoutRef.current = null
    }
  }, [])

  const triggerTapLensPulse = useCallback(() => {
    if (tapPulseTimeoutRef.current) {
      clearTimeout(tapPulseTimeoutRef.current)
    }
    setLensMode("pulse")
    tapPulseTimeoutRef.current = setTimeout(() => {
      setLensMode((current) => (current === "pulse" ? "idle" : current))
    }, 340)
  }, [])

  // Measure tab geometry on mount & resize and keep resting pill synced to activeSection
  useEffect(() => {
    const syncLayout = () => {
      const measured = measureAllTabs()
      if (!isPointerDraggingRef.current && !hasTouchDraggedRef.current) {
        const metrics = measured[activeSection] ?? SECTION_DEFAULT_METRICS.about
        rawPillWidth.set(metrics.width)
        rawLensLeft.set(metrics.left)
      }
    }

    syncLayout()
    window.addEventListener("resize", syncLayout)

    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== "undefined" && navBarRef.current) {
      resizeObserver = new ResizeObserver(syncLayout)
      resizeObserver.observe(navBarRef.current)
    }

    return () => {
      window.removeEventListener("resize", syncLayout)
      resizeObserver?.disconnect()
    }
  }, [activeSection, measureAllTabs, rawLensLeft, rawPillWidth])

  // Snap pill to active tab when returning to idle
  useEffect(() => {
    if (lensMode === "idle") {
      const metrics = getSectionMetrics(activeSection)
      rawPillWidth.set(metrics.width)
      rawLensLeft.set(metrics.left)
    }
  }, [activeSection, lensMode, getSectionMetrics, rawLensLeft, rawPillWidth])

  const selectSection = useCallback(
    (sectionKey: string, shouldPulseLens: boolean) => {
      const isChangingSection = sectionKey !== activeSection
      isManualClickRef.current = true
      if (manualClickTimeoutRef.current) {
        clearTimeout(manualClickTimeoutRef.current)
      }
      manualClickTimeoutRef.current = setTimeout(() => {
        isManualClickRef.current = false
      }, 850)

      isPointerDraggingRef.current = false
      hasTouchDraggedRef.current = false
      dragStartXRef.current = null
      setActiveSection(sectionKey)
      setHoveredSection(null)

      const metrics = getSectionMetrics(sectionKey)
      rawPillWidth.set(metrics.width)
      rawLensLeft.set(metrics.left)

      if (shouldPulseLens && isChangingSection) {
        triggerTapLensPulse()
      } else {
        setLensMode("idle")
      }
    },
    [activeSection, getSectionMetrics, rawLensLeft, rawPillWidth, triggerTapLensPulse]
  )

  const handleNavClick = useCallback(
    (sectionKey: string, event: React.MouseEvent<HTMLAnchorElement>) => {
      if (suppressNextClickRef.current) {
        suppressNextClickRef.current = false
        event.preventDefault()
        return
      }
      selectSection(sectionKey, true)
    },
    [selectSection]
  )

  const commitSectionAndScroll = useCallback(
    (sectionKey: string) => {
      selectSection(sectionKey, false)
      const sectionEl = document.getElementById(sectionKey)
      if (sectionEl) {
        sectionEl.scrollIntoView({ behavior: "smooth" })
      }
    },
    [selectSection]
  )

  const updateLensFromClientX = useCallback(
    (clientX: number, mode: Exclude<LensMode, "idle" | "pulse">) => {
      if (!navBarRef.current) return
      const navRect = navBarRef.current.getBoundingClientRect()
      const currentMetrics = tabMetricsRef.current

      const firstMetrics = currentMetrics[navItems[0].sectionKey] ?? SECTION_DEFAULT_METRICS.about
      const lastMetrics =
        currentMetrics[navItems[navItems.length - 1].sectionKey] ?? SECTION_DEFAULT_METRICS.contact

      const localPointerX = clientX - navRect.left
      let closestSection: string | null = null
      let minDistance = Number.POSITIVE_INFINITY
      let targetWidth = firstMetrics.width

      navItems.forEach((item) => {
        const metrics = currentMetrics[item.sectionKey]
        if (!metrics) return
        const distance = Math.abs(localPointerX - metrics.centerX)
        if (distance < minDistance) {
          minDistance = distance
          closestSection = item.sectionKey
          targetWidth = metrics.width
        }
      })

      const desiredLeft = localPointerX - targetWidth / 2
      const elasticLeft = applyRubberBand(desiredLeft, firstMetrics.left, lastMetrics.left)

      if (tapPulseTimeoutRef.current) {
        clearTimeout(tapPulseTimeoutRef.current)
        tapPulseTimeoutRef.current = null
      }

      rawPillWidth.set(targetWidth)
      rawLensLeft.set(elasticLeft)
      setLensMode(mode)

      if (closestSection) {
        setHoveredSection(closestSection)
      }
    },
    [rawLensLeft, rawPillWidth]
  )

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    isTouchDeviceRef.current = true
    const touch = event.touches[0]
    if (!touch) return
    measureAllTabs()
    dragStartXRef.current = touch.clientX
    hasTouchDraggedRef.current = false
    clearTouchHoldTimer()

    // SwiftUI long-press-to-scrub: holding briefly inflates the liquid glass lens under the finger
    const startX = touch.clientX
    touchHoldTimeoutRef.current = setTimeout(() => {
      hasTouchDraggedRef.current = true
      updateLensFromClientX(startX, "press")
    }, 110)
  }

  const handleTouchMove = (event: React.TouchEvent<HTMLElement>) => {
    isTouchDeviceRef.current = true
    const touch = event.touches[0]
    if (!touch) return

    // Ignore tiny finger jitter (< 6px) during a normal tap
    if (
      dragStartXRef.current !== null &&
      Math.abs(touch.clientX - dragStartXRef.current) < 6 &&
      !hasTouchDraggedRef.current
    ) {
      return
    }

    clearTouchHoldTimer()
    hasTouchDraggedRef.current = true

    if (event.cancelable) {
      event.preventDefault()
    }
    updateLensFromClientX(touch.clientX, "press")
  }

  const handleTouchEnd = () => {
    clearTouchHoldTimer()
    dragStartXRef.current = null

    if (hasTouchDraggedRef.current) {
      suppressNextClickRef.current = true
      if (suppressClickTimeoutRef.current) {
        clearTimeout(suppressClickTimeoutRef.current)
      }
      suppressClickTimeoutRef.current = setTimeout(() => {
        suppressNextClickRef.current = false
      }, 250)

      if (hoveredSection) {
        commitSectionAndScroll(hoveredSection)
        return
      }
    }

    hasTouchDraggedRef.current = false
    setLensMode("idle")
    setHoveredSection(null)
    const metrics = getSectionMetrics(activeSection)
    rawPillWidth.set(metrics.width)
    rawLensLeft.set(metrics.left)
  }

  const handleTouchCancel = () => {
    clearTouchHoldTimer()
    dragStartXRef.current = null
    hasTouchDraggedRef.current = false
    setLensMode("idle")
    setHoveredSection(null)
    const metrics = getSectionMetrics(activeSection)
    rawPillWidth.set(metrics.width)
    rawLensLeft.set(metrics.left)
  }

  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    if (isTouchDeviceRef.current) return
    measureAllTabs()
    updateLensFromClientX(event.clientX, "hover")
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLElement>) => {
    if (isTouchDeviceRef.current) return
    isPointerDraggingRef.current = true
    dragStartXRef.current = event.clientX
    updateLensFromClientX(event.clientX, "press")
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    if (isTouchDeviceRef.current) return
    updateLensFromClientX(event.clientX, isPointerDraggingRef.current ? "press" : "hover")
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
      suppressNextClickRef.current = true
      if (suppressClickTimeoutRef.current) {
        clearTimeout(suppressClickTimeoutRef.current)
      }
      suppressClickTimeoutRef.current = setTimeout(() => {
        suppressNextClickRef.current = false
      }, 120)
      commitSectionAndScroll(hoveredSection)
    } else if (hoveredSection) {
      setLensMode("hover")
    }
  }

  const handleMouseLeave = () => {
    isPointerDraggingRef.current = false
    dragStartXRef.current = null
    setLensMode("idle")
    setHoveredSection(null)
    const metrics = getSectionMetrics(activeSection)
    rawPillWidth.set(metrics.width)
    rawLensLeft.set(metrics.left)
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
      if (tapPulseTimeoutRef.current) {
        clearTimeout(tapPulseTimeoutRef.current)
      }
      if (touchHoldTimeoutRef.current) {
        clearTimeout(touchHoldTimeoutRef.current)
      }
      if (suppressClickTimeoutRef.current) {
        clearTimeout(suppressClickTimeoutRef.current)
      }
    }
  }, [])

  return (
    <>
      {/* SVG Optical Liquid Glass Lens Refraction + Subtle RGB Chromatic Dispersion */}
      <svg className="pointer-events-none fixed h-0 w-0" aria-hidden="true">
        <defs>
          <filter
            id="ios-liquid-glass-refraction"
            x="-15%"
            y="-15%"
            width="130%"
            height="130%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.02"
              numOctaves="2"
              seed="8"
              result="refractionNoise"
            />
            <feGaussianBlur in="refractionNoise" stdDeviation="2.4" result="smoothMap" />

            {/* Red Wavelength Refraction (Outer Prismatic Fringe) */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="smoothMap"
              scale="18"
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

            {/* Green Wavelength Refraction (Optical Center Axis) */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="smoothMap"
              scale="14"
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

            {/* Blue Wavelength Refraction (Opposite Prismatic Fringe) */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="smoothMap"
              scale="10"
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

      {/* Bottom-Center SwiftUI Liquid Glass Tab Bar */}
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] z-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 28, mass: 0.78 }}
          className="pointer-events-auto flex items-center select-none"
        >
          <motion.nav
            ref={navBarRef}
            aria-label="Primary navigation"
            style={{ scale: barInteractiveScale }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
            onMouseEnter={handleMouseEnter}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            className="relative flex h-[64px] items-center p-[4px] rounded-full touch-none will-change-transform"
          >
            {/* Layer 1A (z-0): SwiftUI .glassEffect(.regular, in: .capsule) Base Glass */}
            <div
              style={{
                backdropFilter: "blur(24px) saturate(210%) brightness(1.05)",
                WebkitBackdropFilter: "blur(24px) saturate(210%) brightness(1.05)",
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0.74) 0%, rgba(255, 255, 255, 0.48) 50%, rgba(255, 255, 255, 0.6) 100%)",
                boxShadow:
                  "0 12px 32px -6px rgba(15, 23, 42, 0.14), 0 4px 12px -2px rgba(15, 23, 42, 0.06), 0 0 0 0.5px rgba(15, 23, 42, 0.09), inset 0 1px 0.5px rgba(255, 255, 255, 0.96), inset 0 -1px 1px rgba(255, 255, 255, 0.64), inset 1px 0 1px rgba(255, 255, 255, 0.55), inset -1px 0 1px rgba(255, 255, 255, 0.55)",
              }}
              className="pointer-events-none absolute inset-0 z-0 rounded-full transform-gpu"
              aria-hidden="true"
            />

            {/* Layer 1B (z-0): Dynamic Pointer-Tracking Specular Rim Light */}
            <motion.div
              style={{
                background: rimGlintBackground,
              }}
              className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-full"
              aria-hidden="true"
            >
              {/* Top Specular Rim Filament */}
              <div className="absolute inset-x-7 top-[1px] h-[1px] rounded-full bg-gradient-to-r from-transparent via-white/95 to-transparent opacity-85" />
              {/* Bottom Internal Caustic Reflection */}
              <div className="absolute inset-x-9 bottom-[1px] h-[1px] rounded-full bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-70" />
            </motion.div>

            {/* Layer 2 (z-10): SwiftUI Selection Pill -> Swollen Refractive Liquid Glass Droplet */}
            <motion.div
              style={{
                x: springLensLeft,
                width: springPillWidth,
                scaleX: dropletScaleX,
                scaleY: dropletScaleY,
                transformOrigin:
                  highlightedSection === "about"
                    ? "25% 50%"
                    : highlightedSection === "contact"
                      ? "75% 50%"
                      : "50% 50%",
              }}
              className="pointer-events-none absolute top-[4px] left-0 z-10 h-[56px] rounded-full transform-gpu will-change-transform"
              aria-hidden="true"
            >
              {/* Resting State: Calm SwiftUI Tinted Selection Capsule */}
              <motion.div
                style={{
                  opacity: restingPillOpacity,
                  background:
                    "linear-gradient(180deg, rgba(15, 23, 42, 0.075) 0%, rgba(15, 23, 42, 0.045) 100%)",
                  boxShadow:
                    "inset 0 1px 0.5px rgba(255, 255, 255, 0.85), inset 0 -0.5px 0.5px rgba(255, 255, 255, 0.45), inset 0 0 0 0.5px rgba(15, 23, 42, 0.05)",
                }}
                className="absolute inset-0 rounded-full"
              />

              {/* Active / Gliding / Pressed State: Lifted Crystal-Clear 3D Liquid Glass Lens */}
              <motion.div
                style={{
                  opacity: activeLensOpacity,
                  backdropFilter:
                    "url(#ios-liquid-glass-refraction) blur(0.8px) saturate(225%) contrast(1.05) brightness(1.06)",
                  WebkitBackdropFilter: "blur(2.5px) saturate(225%) brightness(1.08)",
                  background:
                    "radial-gradient(66% 64% at 50% 50%, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.16) 66%, rgba(255, 255, 255, 0.56) 100%)",
                  boxShadow:
                    "0 12px 26px -4px rgba(15, 23, 42, 0.16), 0 4px 10px -2px rgba(15, 23, 42, 0.08), 0 0 0 0.5px rgba(15, 23, 42, 0.08), inset 0 0 12px rgba(255, 255, 255, 0.45), inset 1.5px 2px 2px rgba(255, 255, 255, 0.96), inset -1.5px -1.5px 2px rgba(255, 255, 255, 0.82), inset 2.5px 0 6px rgba(56, 189, 248, 0.2), inset -2.5px 0 6px rgba(168, 85, 247, 0.18), inset 0 0 0 1px rgba(255, 255, 255, 0.78)",
                }}
                className="absolute inset-0 overflow-hidden rounded-full"
              >
                {/* Velocity-Shifted Upper Specular Crescent */}
                <motion.div
                  style={{ x: specularShiftX }}
                  className={`pointer-events-none absolute inset-x-3 top-[1.5px] h-[7px] rounded-t-full bg-gradient-to-b from-white/80 to-transparent transition-opacity duration-150 ${
                    isLensElevated ? "opacity-95" : "opacity-0"
                  }`}
                />
                {/* Lower Caustic Rim Arc */}
                <motion.div
                  style={{ x: specularShiftX }}
                  className={`pointer-events-none absolute inset-x-4 bottom-[1.5px] h-[5px] rounded-b-full bg-gradient-to-t from-white/65 to-transparent transition-opacity duration-150 ${
                    isLensElevated ? "opacity-90" : "opacity-0"
                  }`}
                />
              </motion.div>
            </motion.div>

            {/* Layer 3 (z-20): Tab Items (Icon + Label) */}
            {navItems.map((item) => (
              <LiquidGlassTabItem
                key={item.label}
                item={item}
                isActive={activeSection === item.sectionKey}
                isHighlighted={highlightedSection === item.sectionKey}
                metrics={tabMetricsMap[item.sectionKey] ?? SECTION_DEFAULT_METRICS[item.sectionKey]}
                lensCenterXMotion={lensCenterXMotion}
                lensIntensitySpring={lensIntensitySpring}
                onSelect={handleNavClick}
              />
            ))}
          </motion.nav>

          {/* Detached SwiftUI .glassEffect(.regular.interactive(), in: .circle) Action Button */}
          <motion.div
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 420, damping: 24, mass: 0.6 }}
            className="ml-3 will-change-transform"
          >
            <Link
              href="/montfort"
              aria-label="Open Montfort cinematic experience"
              style={{
                backdropFilter: "blur(24px) saturate(210%) brightness(1.05)",
                WebkitBackdropFilter: "blur(24px) saturate(210%) brightness(1.05)",
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0.74) 0%, rgba(255, 255, 255, 0.48) 50%, rgba(255, 255, 255, 0.6) 100%)",
                boxShadow:
                  "0 12px 32px -6px rgba(15, 23, 42, 0.14), 0 4px 12px -2px rgba(15, 23, 42, 0.06), 0 0 0 0.5px rgba(15, 23, 42, 0.09), inset 0 1px 0.5px rgba(255, 255, 255, 0.96), inset 0 -1px 1px rgba(255, 255, 255, 0.64)",
              }}
              className="group relative flex h-[64px] w-[64px] flex-col items-center justify-center gap-1 overflow-hidden rounded-full text-neutral-600/90 transition-colors duration-200 hover:text-[#09090B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20"
            >
              <span
                className="pointer-events-none absolute inset-x-3 top-[1px] h-[1px] rounded-full bg-gradient-to-r from-transparent via-white/95 to-transparent opacity-85"
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute inset-x-4 bottom-[1px] h-[1px] rounded-full bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-70"
                aria-hidden="true"
              />
              <Box
                size={21}
                strokeWidth={1.85}
                className="transition-transform duration-200 group-hover:scale-105"
              />
              <span className="text-[11px] font-medium leading-none tracking-[-0.012em]">3D</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}

