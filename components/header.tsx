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

interface LiquidGlassMaps {
  bar: string | null
  lens: string | null
  circle: string | null
}

type LensMode = "idle" | "pulse" | "press"

const navItems: NavItem[] = [
  { label: "About", href: "/about", sectionKey: "about", icon: User },
  { label: "Stack", href: "/stack", sectionKey: "stack", icon: Layers },
  { label: "Experience", href: "/experience", sectionKey: "experience", icon: Briefcase },
  { label: "Contact", href: "/contact", sectionKey: "contact", icon: Mail },
]

const VALID_SECTION_PATHS: ReadonlySet<string> = new Set([
  "about",
  "stack",
  "experience",
  "projects",
  "contact",
])

function resolveTabForSection(sectionId: string): string {
  return sectionId === "projects" ? "experience" : sectionId
}

const DEFAULT_TAB_WIDTH = 80
const SECTION_DEFAULT_METRICS: Record<string, TabMetrics> = {
  about: { left: 4, width: DEFAULT_TAB_WIDTH, centerX: 4 + DEFAULT_TAB_WIDTH / 2 },
  stack: { left: 84, width: DEFAULT_TAB_WIDTH, centerX: 84 + DEFAULT_TAB_WIDTH / 2 },
  experience: { left: 164, width: DEFAULT_TAB_WIDTH, centerX: 164 + DEFAULT_TAB_WIDTH / 2 },
  contact: { left: 244, width: DEFAULT_TAB_WIDTH, centerX: 244 + DEFAULT_TAB_WIDTH / 2 },
}

// SwiftUI iOS 26 Liquid Glass spring presets (dampingFraction ~0.58 - 0.68 for authentic liquid bounce)
const SWIFTUI_SPRING_POSITION = {
  stiffness: 380,
  damping: 24,
  mass: 0.82,
}

const SWIFTUI_SPRING_JELLY = {
  stiffness: 420,
  damping: 20,
  mass: 0.72,
}

const SWIFTUI_SPRING_WOBBLE = {
  stiffness: 310,
  damping: 15,
  mass: 0.55,
}

const MIN_LENS_BLOOM_MS = 380

// Bar geometry: 64px capsule with 4px inner padding around 56px-tall tabs
const BAR_INNER_PADDING = 4
const BAR_EDGE_INSET = 1.5
const MAX_DROPLET_SCALE_Y = 62 / 56
// While held, the droplet lifts out of the bar like SwiftUI iOS 26 (56px -> ~78px tall, spilling above & below)
const MAX_PRESSED_SCALE_Y = 1.4
const MAX_PRESSED_EDGE_OVERFLOW = 10

function applyRubberBand(value: number, min: number, max: number): number {
  if (value < min) {
    const overscroll = min - value
    return min - (overscroll * 0.36) / (1 + overscroll * 0.038)
  }
  if (value > max) {
    const overscroll = value - max
    return max + (overscroll * 0.36) / (1 + overscroll * 0.038)
  }
  return value
}

/**
 * Generates a physically-based Snell's-Law convex capsule displacement map
 * (R = horizontal displacement, G = vertical displacement, 128 = zero distortion).
 * Produces an optically clear flat center with smooth curved-bezel edge refraction.
 */
function generateLiquidGlassDisplacementMap(
  width: number,
  height: number,
  bezelWidth: number,
  centerDomeStrength: number
): string | null {
  if (typeof document === "undefined") return null
  const safeWidth = Math.max(32, Math.round(width))
  const safeHeight = Math.max(32, Math.round(height))
  const canvas = document.createElement("canvas")
  canvas.width = safeWidth
  canvas.height = safeHeight
  const ctx = canvas.getContext("2d")
  if (!ctx) return null

  const imageData = ctx.createImageData(safeWidth, safeHeight)
  const data = imageData.data
  const radius = safeHeight / 2
  const coreLeft = radius
  const coreRight = Math.max(radius, safeWidth - radius)
  const coreY = safeHeight / 2
  const glassIor = 1.5
  const effectiveBezel = Math.min(bezelWidth, radius - 1)

  for (let y = 0; y < safeHeight; y += 1) {
    const py = y + 0.5
    for (let x = 0; x < safeWidth; x += 1) {
      const px = x + 0.5
      const qx = px < coreLeft ? coreLeft : px > coreRight ? coreRight : px
      const vx = px - qx
      const vy = py - coreY
      const distFromCore = Math.hypot(vx, vy)
      const distFromEdge = radius - distFromCore

      let dx = 0
      let dy = 0

      if (distFromEdge > 0 && distFromCore > 0.001) {
        const nx = vx / distFromCore
        const ny = vy / distFromCore
        let totalBend = 0

        if (centerDomeStrength > 0) {
          // Smooth spherical magnification across the lifted liquid glass droplet
          const normalizedR = Math.min(1, distFromCore / radius)
          totalBend += normalizedR * centerDomeStrength
        }

        if (distFromEdge < effectiveBezel) {
          // Squircle convex glass bezel profile h(t) = (1 - (1 - t)^4)^(1/4)
          const t = Math.max(0.015, distFromEdge / effectiveBezel)
          const oneMinusT = 1 - t
          const innerTerm = Math.max(0.0001, 1 - Math.pow(oneMinusT, 4))
          const slope = Math.pow(oneMinusT, 3) / Math.pow(innerTerm, 0.75)

          const incidentAngle = Math.atan(slope * 1.45)
          const sinRefracted = Math.min(0.999, Math.sin(incidentAngle) / glassIor)
          const refractedAngle = Math.asin(sinRefracted)
          const bezelDeflection = Math.tan(incidentAngle - refractedAngle) * 1.55
          totalBend += bezelDeflection
        }

        const clampedBend = Math.min(1, totalBend)
        // Sample inward along normal to create authentic convex magnifying glass edge bend
        dx = -nx * clampedBend
        dy = -ny * clampedBend
      }

      const idx = (y * safeWidth + x) * 4
      data[idx] = Math.max(0, Math.min(255, Math.round(128 + dx * 127)))
      data[idx + 1] = Math.max(0, Math.min(255, Math.round(128 + dy * 127)))
      data[idx + 2] = 128
      data[idx + 3] = 255
    }
  }

  ctx.putImageData(imageData, 0, 0)
  return canvas.toDataURL("image/png")
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

  // 120fps optical lens magnification driven purely by MotionValues (zero React re-renders)
  const opticalScale = useTransform(
    [lensCenterXMotion, lensIntensitySpring],
    ([centerX, intensity]: number[]) => {
      const { centerX: tabCenterX, width: tabWidth } = metricsRef.current
      const distance = Math.abs(centerX - tabCenterX)
      const proximity = Math.max(0, 1 - distance / (tabWidth * 0.85))
      const smooth = proximity * proximity * (3 - 2 * proximity)
      return 1 + smooth * intensity * 0.16
    }
  )

  const opticalLiftY = useTransform(
    [lensCenterXMotion, lensIntensitySpring],
    ([centerX, intensity]: number[]) => {
      const { centerX: tabCenterX, width: tabWidth } = metricsRef.current
      const distance = Math.abs(centerX - tabCenterX)
      const proximity = Math.max(0, 1 - distance / (tabWidth * 0.85))
      const smooth = proximity * proximity * (3 - 2 * proximity)
      return -smooth * intensity * 1.8
    }
  )

  return (
    <a
      href={item.href}
      data-nav-section={item.sectionKey}
      aria-current={isActive ? "page" : undefined}
      onClick={(event) => onSelect(item.sectionKey, event)}
      className={`group relative z-20 flex h-[56px] w-[80px] sm:w-[94px] flex-col items-center justify-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]/35 ${
        isHighlighted
          ? "text-[#007AFF]"
          : "text-[#1C1C1E]/75 hover:text-[#1C1C1E]"
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
          animate={
            isActive
              ? { scale: [1, 1.18, 0.96, 1], y: [0, -2, 0.5, 0] }
              : { scale: 1, y: 0 }
          }
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center justify-center"
        >
          <Icon
            size={21}
            strokeWidth={isHighlighted ? 2.35 : 1.85}
            className={`transition-colors duration-200 ${
              isHighlighted
                ? "text-[#007AFF] drop-shadow-[0_1px_1.5px_rgba(255,255,255,0.85)]"
                : "text-[#1C1C1E]/75 group-hover:text-[#1C1C1E]"
            }`}
          />
        </motion.span>
        <span
          className={`text-[10.5px] leading-none tracking-[-0.01em] transition-colors duration-200 ${
            isHighlighted
              ? "font-semibold text-[#007AFF] drop-shadow-[0_1px_1px_rgba(255,255,255,0.85)]"
              : "font-medium text-[#1C1C1E]/75 group-hover:text-[#1C1C1E]"
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
  const [isLensRendered, setIsLensRendered] = useState(false)
  const [tabMetricsMap, setTabMetricsMap] = useState<Record<string, TabMetrics>>(
    SECTION_DEFAULT_METRICS
  )
  const [glassMaps, setGlassMaps] = useState<LiquidGlassMaps>({
    bar: null,
    lens: null,
    circle: null,
  })
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
  const lensBloomStartRef = useRef<number>(0)
  const lensModeRef = useRef<LensMode>("idle")
  const hoveredSectionRef = useRef<string | null>(null)
  const navBarRef = useRef<HTMLElement>(null)
  const tabMetricsRef = useRef<Record<string, TabMetrics>>(SECTION_DEFAULT_METRICS)
  const lastMapKeyRef = useRef<string>("")

  lensModeRef.current = lensMode
  hoveredSectionRef.current = hoveredSection

  const highlightedSection = hoveredSection ?? activeSection
  const isLensElevated = lensMode !== "idle"

  // Continuous pixel-tracked X & width of the SwiftUI Liquid Glass pill inside navBarRef
  const rawLensLeft = useMotionValue<number>(SECTION_DEFAULT_METRICS.about.left)
  const springLensLeft = useSpring(rawLensLeft, SWIFTUI_SPRING_POSITION)
  const rawPillWidth = useMotionValue<number>(SECTION_DEFAULT_METRICS.about.width)
  const springPillWidth = useSpring(rawPillWidth, SWIFTUI_SPRING_POSITION)
  const lensVelocityX = useVelocity(springLensLeft)

  // Unscaled inner width of the bar, used to keep the pill fully inside the capsule
  const navWidthMotion = useMotionValue<number>(0)

  // Spring overshoot is clamped at the capsule's inner padding so the pill never spills past the bar edges
  const clampedLensLeft = useTransform(
    [springLensLeft, springPillWidth, navWidthMotion],
    ([left, width, navWidth]: number[]) => {
      if (navWidth <= 0) return left
      const minLeft = BAR_INNER_PADDING
      const maxLeft = Math.max(minLeft, navWidth - BAR_INNER_PADDING - width)
      return Math.min(maxLeft, Math.max(minLeft, left))
    }
  )

  // Continuous center X for optical icon magnification
  const lensCenterXMotion = useTransform(
    [clampedLensLeft, springPillWidth],
    ([left, width]: number[]) => left + width / 2
  )

  // Pointer-reactive specular rim highlight X (calmly tracks desktop hover OR active pill center)
  const rawRimLightX = useMotionValue<number>(SECTION_DEFAULT_METRICS.about.centerX)
  const springRimLightX = useSpring(rawRimLightX, { stiffness: 320, damping: 28, mass: 0.65 })
  const isPointerHoveringRef = useRef(false)

  // SwiftUI Liquid Glass bouncy morph springs (0 = calm resting pill, 1 = lifted refractive droplet)
  const baseScaleX = useSpring(1, SWIFTUI_SPRING_JELLY)
  const baseScaleY = useSpring(1, SWIFTUI_SPRING_JELLY)
  const lensIntensitySpring = useSpring(0, SWIFTUI_SPRING_JELLY)
  const barInteractiveScale = useSpring(1, SWIFTUI_SPRING_JELLY)
  const barRubberOffsetX = useSpring(0, SWIFTUI_SPRING_POSITION)
  // 0 = resting / tap glide (inside bar), 1 = held (droplet lifts out of the bar)
  const pressAmount = useSpring(0, SWIFTUI_SPRING_JELLY)

  // Velocity-coupled fluid stretch + lightly-damped spring for SwiftUI landing jelly wobble
  const rawVelocityStretchX = useTransform(
    lensVelocityX,
    [-1400, -240, 0, 240, 1400],
    [0.15, 0.035, 0, 0.035, 0.15]
  )
  const rawVelocitySquashY = useTransform(
    lensVelocityX,
    [-1400, -240, 0, 240, 1400],
    [-0.07, -0.015, 0, -0.015, -0.07]
  )
  const springVelocityStretchX = useSpring(rawVelocityStretchX, SWIFTUI_SPRING_WOBBLE)
  const springVelocitySquashY = useSpring(rawVelocitySquashY, SWIFTUI_SPRING_WOBBLE)
  const specularShiftX = useTransform(lensVelocityX, [-1200, 0, 1200], [-8, 0, 8])

  // Horizontal swell is limited by the free space to the nearest bar edge; while held it may spill past the rim
  const dropletScaleX = useTransform(
    [baseScaleX, springVelocityStretchX, clampedLensLeft, springPillWidth, navWidthMotion, pressAmount],
    ([bx, vx, left, width, navWidth, press]: number[]) => {
      const desired = Math.max(0.92, bx + vx)
      if (navWidth <= 0 || width <= 0) return desired
      const pressFactor = Math.min(1, Math.max(0, press))
      const center = left + width / 2
      const room =
        Math.min(center - BAR_EDGE_INSET, navWidth - BAR_EDGE_INSET - center) +
        pressFactor * MAX_PRESSED_EDGE_OVERFLOW
      const maxScale = Math.max(1, (2 * room) / width)
      return Math.min(desired, maxScale)
    }
  )
  // Vertical swell stays inside the capsule at rest/tap, and lifts out above & below the bar while held
  const dropletScaleY = useTransform(
    [baseScaleY, springVelocitySquashY, pressAmount],
    ([by, vy, press]: number[]) => {
      const pressFactor = Math.min(1, Math.max(0, press))
      const maxScaleY =
        MAX_DROPLET_SCALE_Y + (MAX_PRESSED_SCALE_Y - MAX_DROPLET_SCALE_Y) * pressFactor
      return Math.min(maxScaleY, Math.max(0.92, by + vy))
    }
  )

  const restingPillOpacity = useTransform(lensIntensitySpring, [0, 0.55], [1, 0])
  const activeLensOpacity = useTransform(lensIntensitySpring, [0, 0.95], [0, 1])

  // Pointer/droplet-reactive SwiftUI Fresnel rim illumination along top & bottom edges
  const rimGlintBackground = useMotionTemplate`radial-gradient(116px 26px at ${springRimLightX}px 0px, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0) 100%), radial-gradient(116px 24px at ${springRimLightX}px 64px, rgba(255, 255, 255, 0.72) 0%, rgba(255, 255, 255, 0) 100%)`

  // Keep rim light synced to pill center whenever not passively hovering on desktop
  useEffect(() => {
    const unsubscribe = lensCenterXMotion.on("change", (centerX: number) => {
      if (!isPointerHoveringRef.current || isPointerDraggingRef.current) {
        rawRimLightX.set(centerX)
      }
    })
    return () => unsubscribe()
  }, [lensCenterXMotion, rawRimLightX])

  // Mount/unmount z-30 refractive glass droplet only while visible so resting icons stay 100% native-sharp
  useEffect(() => {
    if (lensMode !== "idle") {
      setIsLensRendered(true)
    }
    const unsubscribe = lensIntensitySpring.on("change", (latest: number) => {
      if (latest < 0.015 && lensModeRef.current === "idle") {
        setIsLensRendered(false)
      }
    })
    return () => unsubscribe()
  }, [lensMode, lensIntensitySpring])

  useEffect(() => {
    if (lensMode === "press") {
      baseScaleX.set(1.22)
      baseScaleY.set(1.4)
      lensIntensitySpring.set(1)
      barInteractiveScale.set(1.015)
      pressAmount.set(1)
    } else if (lensMode === "pulse") {
      baseScaleX.set(1.09)
      baseScaleY.set(1.18)
      lensIntensitySpring.set(1)
      barInteractiveScale.set(1.008)
      pressAmount.set(0)
    } else {
      baseScaleX.set(1)
      baseScaleY.set(1)
      lensIntensitySpring.set(0)
      barInteractiveScale.set(1)
      barRubberOffsetX.set(0)
      pressAmount.set(0)
    }
  }, [lensMode, baseScaleX, baseScaleY, lensIntensitySpring, barInteractiveScale, barRubberOffsetX, pressAmount])

  const rebuildGlassMapsIfNeeded = useCallback((barWidth: number, tabWidth: number) => {
    const key = `${Math.round(barWidth)}x${Math.round(tabWidth)}`
    if (lastMapKeyRef.current === key) return
    lastMapKeyRef.current = key

    const barMap = generateLiquidGlassDisplacementMap(barWidth, 64, 14, 0)
    const lensMap = generateLiquidGlassDisplacementMap(tabWidth, 56, 17, 0.1)
    const circleMap = generateLiquidGlassDisplacementMap(64, 64, 15, 0.04)

    setGlassMaps({
      bar: barMap,
      lens: lensMap,
      circle: circleMap,
    })
  }, [])

  const measureAllTabs = useCallback((): Record<string, TabMetrics> => {
    if (!navBarRef.current) {
      return tabMetricsRef.current
    }
    // Use unscaled CSS layout coordinates (offsetLeft / offsetWidth) so entrance or press scale never skews pill bounds
    const navWidth = navBarRef.current.offsetWidth
    const items = navBarRef.current.querySelectorAll<HTMLElement>("[data-nav-section]")
    const measured: Record<string, TabMetrics> = { ...SECTION_DEFAULT_METRICS }
    let detectedTabWidth = DEFAULT_TAB_WIDTH

    items.forEach((el) => {
      const section = el.dataset.navSection
      if (!section) return
      const left = el.offsetLeft
      const width = el.offsetWidth
      detectedTabWidth = width
      measured[section] = {
        left,
        width,
        centerX: left + width / 2,
      }
    })

    tabMetricsRef.current = measured
    setTabMetricsMap(measured)
    navWidthMotion.set(navWidth)
    if (navWidth > 0 && detectedTabWidth > 0) {
      rebuildGlassMapsIfNeeded(navWidth, detectedTabWidth)
    }
    return measured
  }, [navWidthMotion, rebuildGlassMapsIfNeeded])

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

  const scheduleLensSettle = useCallback((delayMs: number) => {
    if (tapPulseTimeoutRef.current) {
      clearTimeout(tapPulseTimeoutRef.current)
    }
    if (delayMs <= 0) {
      setLensMode("idle")
      return
    }
    setLensMode("pulse")
    tapPulseTimeoutRef.current = setTimeout(() => {
      setLensMode((current) => (current === "pulse" ? "idle" : current))
    }, delayMs)
  }, [])

  // Measure tab geometry & generate exact Snell's-law refraction maps on mount and resize
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

  // Snap pill to active tab when returning to idle or scrolling sections
  useEffect(() => {
    if (lensMode === "idle") {
      const metrics = getSectionMetrics(activeSection)
      rawPillWidth.set(metrics.width)
      rawLensLeft.set(metrics.left)
    }
  }, [activeSection, lensMode, getSectionMetrics, rawLensLeft, rawPillWidth])

  const selectSection = useCallback(
    (sectionKey: string, enforceMinBloom: boolean) => {
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
      barRubberOffsetX.set(0)
      setActiveSection(sectionKey)
      setHoveredSection(null)

      const metrics = getSectionMetrics(sectionKey)
      rawPillWidth.set(metrics.width)
      rawLensLeft.set(metrics.left)

      if (enforceMinBloom && isChangingSection) {
        const now = performance.now()
        const elapsed = lensModeRef.current === "idle" ? 0 : now - lensBloomStartRef.current
        if (lensModeRef.current === "idle") {
          lensBloomStartRef.current = now
        }
        const remaining = Math.max(0, MIN_LENS_BLOOM_MS - elapsed)
        scheduleLensSettle(remaining > 40 ? remaining : 0)
      } else {
        scheduleLensSettle(0)
      }
    },
    [activeSection, barRubberOffsetX, getSectionMetrics, rawLensLeft, rawPillWidth, scheduleLensSettle]
  )

  const commitSectionAndScroll = useCallback(
    (sectionKey: string, enforceMinBloom: boolean, updateHistory = true) => {
      const targetTab = resolveTabForSection(sectionKey)
      selectSection(targetTab, enforceMinBloom)
      if (updateHistory && typeof window !== "undefined") {
        const nextPath = `/${sectionKey}`
        if (window.location.pathname !== nextPath || window.location.hash) {
          window.history.pushState(null, "", nextPath)
        }
      }
      const sectionEl = document.getElementById(sectionKey)
      if (sectionEl) {
        sectionEl.scrollIntoView({ behavior: "smooth" })
      }
    },
    [selectSection]
  )

  const handleNavClick = useCallback(
    (sectionKey: string, event: React.MouseEvent<HTMLAnchorElement>) => {
      if (suppressNextClickRef.current) {
        suppressNextClickRef.current = false
        event.preventDefault()
        return
      }
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
        return
      }
      event.preventDefault()
      commitSectionAndScroll(sectionKey, true)
    },
    [commitSectionAndScroll]
  )

  const handleTopClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
        return
      }
      event.preventDefault()
      isManualClickRef.current = true
      if (manualClickTimeoutRef.current) {
        clearTimeout(manualClickTimeoutRef.current)
      }
      manualClickTimeoutRef.current = setTimeout(() => {
        isManualClickRef.current = false
      }, 850)
      if (typeof window !== "undefined") {
        if (window.location.pathname !== "/" || window.location.hash) {
          window.history.pushState(null, "", "/")
        }
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
      setActiveSection("about")
      setHoveredSection(null)
    },
    []
  )

  const updateLensFromClientX = useCallback(
    (clientX: number) => {
      if (!navBarRef.current) return
      const navRect = navBarRef.current.getBoundingClientRect()
      const unscaledNavWidth = navBarRef.current.offsetWidth || navRect.width
      const scaleFactor = unscaledNavWidth > 0 ? navRect.width / unscaledNavWidth : 1
      const currentMetrics = tabMetricsRef.current

      const firstMetrics = currentMetrics[navItems[0].sectionKey] ?? SECTION_DEFAULT_METRICS.about
      const lastMetrics =
        currentMetrics[navItems[navItems.length - 1].sectionKey] ?? SECTION_DEFAULT_METRICS.contact

      const localPointerX = (clientX - navRect.left) / scaleFactor
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

      // Subtle SwiftUI rubber-band pull on the entire outer glass capsule when dragging past edges
      if (desiredLeft < firstMetrics.left) {
        const over = firstMetrics.left - desiredLeft
        barRubberOffsetX.set(-Math.min(5, over * 0.09))
      } else if (desiredLeft > lastMetrics.left) {
        const over = desiredLeft - lastMetrics.left
        barRubberOffsetX.set(Math.min(5, over * 0.09))
      } else {
        barRubberOffsetX.set(0)
      }

      if (tapPulseTimeoutRef.current) {
        clearTimeout(tapPulseTimeoutRef.current)
        tapPulseTimeoutRef.current = null
      }

      if (lensModeRef.current === "idle") {
        lensBloomStartRef.current = performance.now()
      }

      rawPillWidth.set(targetWidth)
      rawLensLeft.set(elasticLeft)
      rawRimLightX.set(Math.max(0, Math.min(unscaledNavWidth, localPointerX)))
      setLensMode("press")

      if (closestSection) {
        setHoveredSection(closestSection)
      }
    },
    [barRubberOffsetX, rawLensLeft, rawPillWidth, rawRimLightX]
  )

  // Global mouse drag tracking while scrubbing on desktop so vertical slip never breaks the gesture
  useEffect(() => {
    const handleWindowMouseMove = (event: MouseEvent) => {
      if (!isPointerDraggingRef.current || isTouchDeviceRef.current) return
      updateLensFromClientX(event.clientX)
    }

    const handleWindowMouseUp = () => {
      if (!isPointerDraggingRef.current || isTouchDeviceRef.current) return
      const targetSection = hoveredSectionRef.current
      isPointerDraggingRef.current = false
      dragStartXRef.current = null

      if (targetSection) {
        suppressNextClickRef.current = true
        if (suppressClickTimeoutRef.current) {
          clearTimeout(suppressClickTimeoutRef.current)
        }
        suppressClickTimeoutRef.current = setTimeout(() => {
          suppressNextClickRef.current = false
        }, 160)
        commitSectionAndScroll(targetSection, true)
      } else {
        scheduleLensSettle(0)
      }
    }

    window.addEventListener("mousemove", handleWindowMouseMove)
    window.addEventListener("mouseup", handleWindowMouseUp)
    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove)
      window.removeEventListener("mouseup", handleWindowMouseUp)
    }
  }, [commitSectionAndScroll, scheduleLensSettle, updateLensFromClientX])

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    isTouchDeviceRef.current = true
    const touch = event.touches[0]
    if (!touch) return
    measureAllTabs()
    dragStartXRef.current = touch.clientX
    hasTouchDraggedRef.current = false
    clearTouchHoldTimer()

    // SwiftUI press-and-hold inflates the liquid glass droplet under the finger
    const startX = touch.clientX
    touchHoldTimeoutRef.current = setTimeout(() => {
      hasTouchDraggedRef.current = true
      updateLensFromClientX(startX)
    }, 90)
  }

  const handleTouchMove = (event: React.TouchEvent<HTMLElement>) => {
    isTouchDeviceRef.current = true
    const touch = event.touches[0]
    if (!touch) return

    // Ignore tiny finger jitter (< 5px) during a normal tap
    if (
      dragStartXRef.current !== null &&
      Math.abs(touch.clientX - dragStartXRef.current) < 5 &&
      !hasTouchDraggedRef.current
    ) {
      return
    }

    clearTouchHoldTimer()
    hasTouchDraggedRef.current = true

    if (event.cancelable) {
      event.preventDefault()
    }
    updateLensFromClientX(touch.clientX)
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
        commitSectionAndScroll(hoveredSection, true)
        return
      }
    }

    hasTouchDraggedRef.current = false
    barRubberOffsetX.set(0)
    scheduleLensSettle(0)
    setHoveredSection(null)
    const metrics = getSectionMetrics(activeSection)
    rawPillWidth.set(metrics.width)
    rawLensLeft.set(metrics.left)
  }

  const handleTouchCancel = () => {
    clearTouchHoldTimer()
    dragStartXRef.current = null
    hasTouchDraggedRef.current = false
    barRubberOffsetX.set(0)
    scheduleLensSettle(0)
    setHoveredSection(null)
    const metrics = getSectionMetrics(activeSection)
    rawPillWidth.set(metrics.width)
    rawLensLeft.set(metrics.left)
  }

  // Authentic SwiftUI desktop hover: keeps pill calm, only glides the subtle glass rim reflection
  const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
    if (isTouchDeviceRef.current) return
    isPointerHoveringRef.current = true
    measureAllTabs()
    if (navBarRef.current) {
      const navRect = navBarRef.current.getBoundingClientRect()
      rawRimLightX.set(Math.max(0, Math.min(navRect.width, event.clientX - navRect.left)))
    }
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    if (isTouchDeviceRef.current) return
    isPointerHoveringRef.current = true
    if (isPointerDraggingRef.current) {
      updateLensFromClientX(event.clientX)
      return
    }
    if (navBarRef.current) {
      const navRect = navBarRef.current.getBoundingClientRect()
      rawRimLightX.set(Math.max(0, Math.min(navRect.width, event.clientX - navRect.left)))
    }
  }

  const handleMouseDown = (event: React.MouseEvent<HTMLElement>) => {
    if (isTouchDeviceRef.current || event.button !== 0) return
    measureAllTabs()
    isPointerDraggingRef.current = true
    dragStartXRef.current = event.clientX
    updateLensFromClientX(event.clientX)
  }

  const handleMouseLeave = () => {
    isPointerHoveringRef.current = false
    if (!isPointerDraggingRef.current) {
      const metrics = getSectionMetrics(activeSection)
      rawRimLightX.set(metrics.centerX)
    }
  }

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY < 80 && !isManualClickRef.current) {
        if (window.location.pathname !== "/" || window.location.hash) {
          window.history.replaceState(null, "", "/")
        }
      }

      if (window.innerWidth >= 768) {
        if (!isVisible) setIsVisible(true)
        return
      }

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

  // Sync direct path navigation (/about, /contact, etc.), legacy #hashes, and browser Back/Forward
  useEffect(() => {
    const syncFromLocation = (behavior: ScrollBehavior) => {
      const hashSection = window.location.hash.replace(/^#/, "")
      const pathSection = window.location.pathname.replace(/^\/+|\/+$/g, "")
      const targetSection = VALID_SECTION_PATHS.has(hashSection)
        ? hashSection
        : VALID_SECTION_PATHS.has(pathSection)
          ? pathSection
          : null

      if (!targetSection) {
        if (window.location.hash) {
          window.history.replaceState(null, "", "/")
        }
        return
      }

      const cleanPath = `/${targetSection}`
      if (window.location.pathname !== cleanPath || window.location.hash) {
        window.history.replaceState(null, "", cleanPath)
      }

      isManualClickRef.current = true
      if (manualClickTimeoutRef.current) {
        clearTimeout(manualClickTimeoutRef.current)
      }
      manualClickTimeoutRef.current = setTimeout(() => {
        isManualClickRef.current = false
      }, 900)

      setActiveSection(resolveTabForSection(targetSection))
      const sectionEl = document.getElementById(targetSection)
      if (sectionEl) {
        sectionEl.scrollIntoView({ behavior })
      }
    }

    syncFromLocation("smooth")

    const handlePopState = () => {
      const pathSection = window.location.pathname.replace(/^\/+|\/+$/g, "")
      if (!pathSection) {
        window.scrollTo({ top: 0, behavior: "smooth" })
        setActiveSection("about")
        return
      }
      syncFromLocation("smooth")
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

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
        const nextSection = intersecting[0].target.id
        setActiveSection(nextSection)
        if (window.scrollY >= 80) {
          const nextPath = `/${nextSection}`
          if (window.location.pathname !== nextPath || window.location.hash) {
            window.history.replaceState(null, "", nextPath)
          }
        }
      }
    }, observerOptions)

    navItems.forEach((item) => {
      const el = document.getElementById(item.sectionKey)
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
      {/* Snell's-Law Convex Capsule Optical Refraction + Subtle RGB Chromatic Dispersion Filters */}
      <svg className="pointer-events-none fixed h-0 w-0" aria-hidden="true">
        <defs>
          {glassMaps.bar && (
            <filter
              id="ios-bar-liquid-glass"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              colorInterpolationFilters="sRGB"
            >
              <feImage
                href={glassMaps.bar}
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                result="barDispMap"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="barDispMap"
                scale="18"
                xChannelSelector="R"
                yChannelSelector="G"
                result="barDispR"
              />
              <feColorMatrix
                in="barDispR"
                type="matrix"
                values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="barR"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="barDispMap"
                scale="16"
                xChannelSelector="R"
                yChannelSelector="G"
                result="barDispG"
              />
              <feColorMatrix
                in="barDispG"
                type="matrix"
                values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="barG"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="barDispMap"
                scale="14"
                xChannelSelector="R"
                yChannelSelector="G"
                result="barDispB"
              />
              <feColorMatrix
                in="barDispB"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                result="barB"
              />
              <feBlend in="barR" in2="barG" mode="screen" result="barRG" />
              <feBlend in="barRG" in2="barB" mode="screen" result="barRefracted" />
            </filter>
          )}

          {glassMaps.lens && (
            <filter
              id="ios-lens-liquid-glass"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              colorInterpolationFilters="sRGB"
            >
              <feImage
                href={glassMaps.lens}
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                result="lensDispMap"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="lensDispMap"
                scale="26"
                xChannelSelector="R"
                yChannelSelector="G"
                result="lensDispR"
              />
              <feColorMatrix
                in="lensDispR"
                type="matrix"
                values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="lensR"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="lensDispMap"
                scale="22"
                xChannelSelector="R"
                yChannelSelector="G"
                result="lensDispG"
              />
              <feColorMatrix
                in="lensDispG"
                type="matrix"
                values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="lensG"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="lensDispMap"
                scale="18"
                xChannelSelector="R"
                yChannelSelector="G"
                result="lensDispB"
              />
              <feColorMatrix
                in="lensDispB"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                result="lensB"
              />
              <feBlend in="lensR" in2="lensG" mode="screen" result="lensRG" />
              <feBlend in="lensRG" in2="lensB" mode="screen" result="lensRefracted" />
            </filter>
          )}

          {glassMaps.circle && (
            <filter
              id="ios-circle-liquid-glass"
              x="0%"
              y="0%"
              width="100%"
              height="100%"
              colorInterpolationFilters="sRGB"
            >
              <feImage
                href={glassMaps.circle}
                x="0%"
                y="0%"
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                result="circleDispMap"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="circleDispMap"
                scale="18"
                xChannelSelector="R"
                yChannelSelector="G"
                result="circleDispR"
              />
              <feColorMatrix
                in="circleDispR"
                type="matrix"
                values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="circleR"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="circleDispMap"
                scale="16"
                xChannelSelector="R"
                yChannelSelector="G"
                result="circleDispG"
              />
              <feColorMatrix
                in="circleDispG"
                type="matrix"
                values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
                result="circleG"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="circleDispMap"
                scale="14"
                xChannelSelector="R"
                yChannelSelector="G"
                result="circleDispB"
              />
              <feColorMatrix
                in="circleDispB"
                type="matrix"
                values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
                result="circleB"
              />
              <feBlend in="circleR" in2="circleG" mode="screen" result="circleRG" />
              <feBlend in="circleRG" in2="circleB" mode="screen" result="circleRefracted" />
            </filter>
          )}
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
          <a href="/" onClick={handleTopClick} className="flex items-center gap-2.5 group">
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

      {/* Bottom-Center SwiftUI iOS 26 Liquid Glass Tab Bar */}
      <div className="pointer-events-none fixed inset-x-0 bottom-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:bottom-[calc(1.5rem+env(safe-area-inset-bottom,0px))] z-50 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 22, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 320, damping: 24, mass: 0.78 }}
          className="pointer-events-auto flex items-center select-none"
        >
          <motion.nav
            ref={navBarRef}
            aria-label="Primary navigation"
            style={{
              scale: barInteractiveScale,
              x: barRubberOffsetX,
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
            onMouseEnter={handleMouseEnter}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative flex h-[64px] items-center p-[4px] rounded-full touch-none will-change-transform"
          >
            {/* Layer 1A (z-0): Clear SwiftUI Liquid Glass Capsule with Convex Edge Refraction */}
            <div
              style={{
                backdropFilter: glassMaps.bar
                  ? "url(#ios-bar-liquid-glass) blur(2.5px) saturate(195%) brightness(1.04)"
                  : "blur(10px) saturate(195%) brightness(1.05)",
                WebkitBackdropFilter: "blur(10px) saturate(195%) brightness(1.05)",
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0.44) 0%, rgba(255, 255, 255, 0.22) 52%, rgba(255, 255, 255, 0.34) 100%)",
                boxShadow:
                  "0 12px 32px -6px rgba(15, 23, 42, 0.14), 0 3px 10px -2px rgba(15, 23, 42, 0.06), 0 0 0 0.5px rgba(15, 23, 42, 0.1), inset 0 1.25px 0.75px rgba(255, 255, 255, 0.96), inset 0 -1px 1px rgba(255, 255, 255, 0.72), inset 1.25px 0 1px rgba(255, 255, 255, 0.65), inset -1.25px 0 1px rgba(255, 255, 255, 0.65)",
              }}
              className="pointer-events-none absolute inset-0 z-0 rounded-full transform-gpu"
              aria-hidden="true"
            />

            {/* Layer 1B (z-0): Fresnel Specular Rim Highlight & Reactive Glint */}
            <motion.div
              style={{
                background: rimGlintBackground,
              }}
              className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-full"
              aria-hidden="true"
            >
              {/* Top Specular Rim Filament */}
              <div className="absolute inset-x-6 top-[0.5px] h-[1.25px] rounded-full bg-gradient-to-r from-white/20 via-white to-white/20 opacity-90" />
              {/* Bottom Caustic Rim Reflection */}
              <div className="absolute inset-x-8 bottom-[0.5px] h-[1px] rounded-full bg-gradient-to-r from-transparent via-white/85 to-transparent opacity-80" />
            </motion.div>

            {/* Layer 2 (z-10, BEHIND icons): Calm SwiftUI Resting Selection Pill */}
            <motion.div
              style={{
                x: clampedLensLeft,
                width: springPillWidth,
                scaleX: dropletScaleX,
                scaleY: dropletScaleY,
                opacity: restingPillOpacity,
                transformOrigin: "50% 50%",
                background:
                  "linear-gradient(180deg, rgba(15, 23, 42, 0.07) 0%, rgba(15, 23, 42, 0.045) 100%)",
                boxShadow:
                  "inset 0 1px 0.5px rgba(255, 255, 255, 0.85), inset 0 -0.5px 0.5px rgba(255, 255, 255, 0.45), inset 0 0 0 0.5px rgba(15, 23, 42, 0.055)",
              }}
              className="pointer-events-none absolute top-[4px] left-0 z-10 h-[56px] rounded-full transform-gpu will-change-transform"
              aria-hidden="true"
            />

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

            {/* Layer 4 (z-30, OVER icons): Lifted Crystal-Clear Refractive Liquid Glass Droplet */}
            {isLensRendered && (
              <motion.div
                style={{
                  x: clampedLensLeft,
                  width: springPillWidth,
                  scaleX: dropletScaleX,
                  scaleY: dropletScaleY,
                  opacity: activeLensOpacity,
                  transformOrigin: "50% 50%",
                  backdropFilter: glassMaps.lens
                    ? "url(#ios-lens-liquid-glass) blur(0.3px) saturate(195%) contrast(1.03) brightness(1.05)"
                    : "blur(0.6px) saturate(195%) brightness(1.06)",
                  WebkitBackdropFilter: "blur(0.6px) saturate(195%) brightness(1.06)",
                  background:
                    "radial-gradient(68% 66% at 50% 50%, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.06) 64%, rgba(255, 255, 255, 0.44) 100%)",
                  boxShadow:
                    "0 14px 28px -6px rgba(15, 23, 42, 0.18), 0 4px 10px -2px rgba(15, 23, 42, 0.08), 0 0 0 0.5px rgba(15, 23, 42, 0.08), inset 0 0 10px rgba(255, 255, 255, 0.32), inset 1.5px 2px 2px rgba(255, 255, 255, 0.98), inset -1.5px -1.5px 2px rgba(255, 255, 255, 0.85), inset 2.5px 0 6px rgba(56, 189, 248, 0.22), inset -2.5px 0 6px rgba(168, 85, 247, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.72)",
                }}
                className="pointer-events-none absolute top-[4px] left-0 z-30 h-[56px] overflow-hidden rounded-full transform-gpu will-change-transform"
                aria-hidden="true"
              >
                {/* Velocity-Shifted Upper Specular Crescent */}
                <motion.div
                  style={{ x: specularShiftX }}
                  className={`pointer-events-none absolute inset-x-3 top-[1.5px] h-[7px] rounded-t-full bg-gradient-to-b from-white/85 to-transparent transition-opacity duration-150 ${
                    isLensElevated ? "opacity-95" : "opacity-0"
                  }`}
                />
                {/* Lower Caustic Rim Arc */}
                <motion.div
                  style={{ x: specularShiftX }}
                  className={`pointer-events-none absolute inset-x-4 bottom-[1.5px] h-[5px] rounded-b-full bg-gradient-to-t from-white/70 to-transparent transition-opacity duration-150 ${
                    isLensElevated ? "opacity-90" : "opacity-0"
                  }`}
                />
              </motion.div>
            )}
          </motion.nav>

          {/* Detached SwiftUI .glassEffect(.regular.interactive(), in: .circle) Action Button */}
          <motion.div
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 420, damping: 18, mass: 0.65 }}
            className="ml-3 will-change-transform"
          >
            <Link
              href="/montfort"
              aria-label="Open Montfort cinematic experience"
              style={{
                backdropFilter: glassMaps.circle
                  ? "url(#ios-circle-liquid-glass) blur(2.5px) saturate(195%) brightness(1.04)"
                  : "blur(10px) saturate(195%) brightness(1.05)",
                WebkitBackdropFilter: "blur(10px) saturate(195%) brightness(1.05)",
                background:
                  "linear-gradient(180deg, rgba(255, 255, 255, 0.44) 0%, rgba(255, 255, 255, 0.22) 52%, rgba(255, 255, 255, 0.34) 100%)",
                boxShadow:
                  "0 12px 32px -6px rgba(15, 23, 42, 0.14), 0 3px 10px -2px rgba(15, 23, 42, 0.06), 0 0 0 0.5px rgba(15, 23, 42, 0.1), inset 0 1.25px 0.75px rgba(255, 255, 255, 0.96), inset 0 -1px 1px rgba(255, 255, 255, 0.72), inset 1.25px 0 1px rgba(255, 255, 255, 0.65), inset -1.25px 0 1px rgba(255, 255, 255, 0.65)",
              }}
              className="group relative flex h-[64px] w-[64px] flex-col items-center justify-center gap-1 overflow-hidden rounded-full text-[#1C1C1E]/80 transition-colors duration-200 hover:text-[#007AFF] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#007AFF]/35"
            >
              <span
                className="pointer-events-none absolute inset-x-3 top-[0.5px] h-[1.25px] rounded-full bg-gradient-to-r from-white/20 via-white to-white/20 opacity-90"
                aria-hidden="true"
              />
              <span
                className="pointer-events-none absolute inset-x-4 bottom-[0.5px] h-[1px] rounded-full bg-gradient-to-r from-transparent via-white/85 to-transparent opacity-80"
                aria-hidden="true"
              />
              <Box
                size={21}
                strokeWidth={1.85}
                className="transition-transform duration-200 group-hover:scale-105"
              />
              <span className="text-[10.5px] font-medium leading-none tracking-[-0.01em]">3D</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </>
  )
}

