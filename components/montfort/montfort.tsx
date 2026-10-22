"use client"

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react"
import dynamic from "next/dynamic"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"
import styles from "./montfort.module.css"
import type { SceneBridge } from "./scene/bridge"

gsap.registerPlugin(ScrollTrigger)

/* WebGL scene is client-only and code-split, so three.js never loads on the server or other routes. */
const MontfortCanvas = dynamic(() => import("./scene/montfort-canvas"), { ssr: false })

interface MontfortProps {
  fontClassName: string
}

interface Division {
  title: string
  headline: string
  link: string
}

interface DepthProps {
  z: number
  bleed?: boolean
  className?: string
  children: ReactNode
}

/* Live camera state, written by the camera rig and read by the rain canvas. */
interface CameraState {
  x: number
  y: number
  vel: number
  shake: number
}

interface IntroState {
  v: number
}

const CHARCOAL = "#2a2b2f"
const WHITE = "#ffffff"
const TOTAL = 110
/* Camera perspective in px. Must match `.camera { perspective }` in the CSS module. */
const PERSPECTIVE = 1000

const IMG = {
  mountain: "/montfort/mountain_night.jpg",
  clouds: "/montfort/storm_clouds.jpg",
  ship: "/montfort/tanker_ship.jpg",
  terrain: "/montfort/terrain_map.jpg",
  earth: "/montfort/earth_globe.jpg",
}

const DIVISIONS: Division[] = [
  { title: "Backend", headline: "REST APIs & backend integration", link: "Learn more" },
  { title: "Real-time", headline: "Real-time systems & WebSockets", link: "Learn more" },
  { title: "Data", headline: "SQL & NoSQL datastores", link: "Learn more" },
  { title: "DevOps", headline: "CI/CD & DevOps automation", link: "Learn more" },
]

/* Scroll progress (0-1) at which each scroll indicator dot becomes active. */
const DOT_STOPS: number[] = [0, 0.06, 0.18, 0.38, 0.62, 0.7, 0.8, 0.9]

const sel = (name: string): string => `[data-l="${name}"]`

/* WebGL availability check; when it fails the original image layers are used as a fallback. */
const hasWebGL = (): boolean => {
  try {
    const probe = document.createElement("canvas")
    return Boolean(probe.getContext("webgl2") ?? probe.getContext("webgl"))
  } catch {
    return false
  }
}

function Diamond({ n }: { n: string }) {
  return (
    <span className={styles.diamond}>
      <b>{n}</b>
    </span>
  )
}

function LinkCircle({ children, href = "/#about" }: { children: string; href?: string }) {
  return (
    <a className={styles.link} href={href}>
      {children}
      <span className={styles.circle} />
    </a>
  )
}

/*
 * A plane pushed to depth `z` inside the camera's perspective. The scale compensates for
 * perspective shrink, so at rest it looks identical; when the camera's perspective-origin
 * moves, planes shift by different amounts and the scene reads as real depth.
 * `bleed` oversizes full-screen planes so parallax never reveals their edges.
 */
function Depth({ z, bleed = false, className = "", children }: DepthProps) {
  const style: CSSProperties = { transform: `translate3d(0, 0, ${z}px) scale(${1 - z / PERSPECTIVE})` }
  return (
    <div className={`${styles.depth} ${bleed ? styles.bleed : ""} ${className}`} style={style}>
      {children}
    </div>
  )
}

export default function Montfort({ fontClassName }: MontfortProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cameraRef = useRef<HTMLDivElement>(null)
  const flashRef = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const camRef = useRef<CameraState>({ x: 0, y: 0, vel: 0, shake: 0 })
  const introRef = useRef<IntroState>({ v: 1 })
  const bridgeRef = useRef<SceneBridge>({ time: 0, camX: 0, camY: 0 })
  const [progress, setProgress] = useState<number>(0)
  const [ready, setReady] = useState<boolean>(false)
  /* null until checked on the client */
  const [webgl, setWebgl] = useState<boolean | null>(null)

  useEffect(() => {
    setWebgl(hasWebGL())
  }, [])

  /* Loading screen: only the hero image is critical, the rest is lazy-loaded afterwards. */
  useEffect(() => {
    let cancelled = false
    const hero = new Image()
    setProgress(0.3)
    const finish = (): void => {
      if (cancelled) return
      setProgress(1)
      window.setTimeout(() => {
        if (cancelled) return
        setReady(true)
        const rest: string[] = [IMG.clouds, IMG.ship, IMG.terrain, IMG.earth]
        rest.forEach((src) => {
          const img = new Image()
          img.src = src
        })
      }, 600)
    }
    hero.onload = finish
    hero.onerror = finish
    hero.src = IMG.mountain
    return () => {
      cancelled = true
    }
  }, [])

  /* Smooth scroll */
  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, smoothWheel: true })
    lenisRef.current = lenis
    lenis.stop()
    lenis.on("scroll", ScrollTrigger.update)
    const tick = (time: number): void => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  useEffect(() => {
    if (ready) lenisRef.current?.start()
  }, [ready])

  /* Opening shot: camera settles from a slight push-in while the wordmark focuses in. */
  useEffect(() => {
    if (!ready) return
    const root = rootRef.current
    if (!root) return
    const intro = introRef.current
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      intro.v = 0
      return
    }
    const settle = gsap.to(intro, { v: 0, duration: 3.4, ease: "power3.out" })
    const words = gsap.fromTo(
      root.querySelectorAll<HTMLElement>(`${sel("wmL")}, ${sel("wmR")}`),
      { opacity: 0, y: 24, filter: "blur(14px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 2.2,
        delay: 0.35,
        stagger: 0.18,
        ease: "power3.out",
        clearProps: "filter",
      },
    )
    return () => {
      settle.kill()
      words.kill()
    }
  }, [ready])

  /* Camera rig: pointer / gyro parallax, handheld drift, scroll-speed push-in and storm lightning */
  useEffect(() => {
    const root = rootRef.current
    const camera = cameraRef.current
    const flash = flashRef.current
    if (!root || !camera || !flash) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const cam = camRef.current
    const target = { x: 0, y: 0 }
    const clouds = root.querySelector<HTMLElement>(sel("clouds"))
    const white = root.querySelector<HTMLElement>(sel("white"))
    let time = 0
    let nextStrike = 0
    let strikeTl: gsap.core.Timeline | null = null
    let thunder: gsap.core.Tween | null = null

    const onPointer = (e: PointerEvent): void => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1
      target.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    const onTilt = (e: DeviceOrientationEvent): void => {
      if (e.gamma === null || e.beta === null) return
      target.x = gsap.utils.clamp(-1, 1, e.gamma / 30)
      target.y = gsap.utils.clamp(-1, 1, (e.beta - 45) / 30)
    }

    /* GSAP writes inline opacity on timeline layers, so it doubles as a cheap "is visible" check. */
    const opacityOf = (el: HTMLElement | null): number => (el ? parseFloat(el.style.opacity || "0") : 0)

    const strike = (): void => {
      const x = 20 + Math.random() * 60
      const y = 10 + Math.random() * 35
      flash.style.background = `radial-gradient(ellipse 55% 45% at ${x}% ${y}%, rgba(228, 234, 255, 0.95), rgba(165, 185, 235, 0.3) 45%, transparent 75%)`
      strikeTl?.kill()
      strikeTl = gsap
        .timeline()
        .set(flash, { opacity: 0 })
        .to(flash, { opacity: 0.9, duration: 0.05, ease: "power4.out" })
        .to(flash, { opacity: 0.15, duration: 0.08 })
        .to(flash, { opacity: 0.65, duration: 0.05 })
        .to(flash, { opacity: 0, duration: 1.1, ease: "power2.out" })
      /* Thunder arrives a moment later as a short camera rumble. */
      thunder?.kill()
      thunder = gsap.delayedCall(0.5 + Math.random() * 0.9, () => {
        cam.shake = 4
      })
    }

    const tick = (_time: number, deltaMs: number): void => {
      const dt = Math.min(deltaMs / 1000, 0.05)
      time += dt
      cam.x += (target.x - cam.x) * (1 - Math.exp(-dt * 2.5))
      cam.y += (target.y - cam.y) * (1 - Math.exp(-dt * 2.5))
      cam.vel += ((lenisRef.current?.velocity ?? 0) - cam.vel) * (1 - Math.exp(-dt * 6))
      cam.shake *= Math.exp(-dt * 4)
      bridgeRef.current.camX = cam.x
      bridgeRef.current.camY = cam.y

      /* Layered sines read as organic handheld drift without a noise library. */
      const dx = Math.sin(time * 0.23) * 0.6 + Math.sin(time * 0.61 + 1.7) * 0.3 + Math.sin(time * 1.37 + 0.4) * 0.1
      const dy = Math.sin(time * 0.19 + 2.1) * 0.6 + Math.sin(time * 0.53 + 0.3) * 0.3 + Math.sin(time * 1.21 + 2.2) * 0.1
      const jx = (Math.random() - 0.5) * cam.shake
      const jy = (Math.random() - 0.5) * cam.shake
      const speed = Math.min(Math.abs(cam.vel), 80)
      const ox = cam.x * 60 + dx * 10
      const oy = cam.y * 40 + dy * 8
      const zoom = 1.03 + introRef.current.v * 0.12 + speed * 0.0004
      const roll = dx * 0.12 + cam.x * 0.35

      camera.style.perspectiveOrigin = `calc(50% + ${ox.toFixed(2)}px) calc(50% + ${oy.toFixed(2)}px)`
      camera.style.transform = `translate3d(${(dx * 3 + jx).toFixed(2)}px, ${(dy * 3 + jy).toFixed(2)}px, 0) rotate(${roll.toFixed(3)}deg) scale(${zoom.toFixed(4)})`

      const stormy = opacityOf(clouds) > 0.6 && opacityOf(white) < 0.05
      if (!stormy) {
        nextStrike = time + 1.2
      } else if (time > nextStrike) {
        nextStrike = time + 3 + Math.random() * 6
        strike()
      }
    }

    window.addEventListener("pointermove", onPointer, { passive: true })
    window.addEventListener("deviceorientation", onTilt)
    gsap.ticker.add(tick)
    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener("pointermove", onPointer)
      window.removeEventListener("deviceorientation", onTilt)
      strikeTl?.kill()
      thunder?.kill()
    }
  }, [])

  /* Rain streaks and floating dots: three depth bands with wind, parallax and depth of field */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    interface Streak {
      x: number
      y: number
      len: number
      speed: number
      band: number
    }
    interface Dot {
      x: number
      y: number
      z: number
      r: number
      vx: number
      vy: number
      a: number
      phase: number
    }

    /* Depth of each rain band: 0 = far away, 1 = right in front of the lens. */
    const BANDS: number[] = [0.35, 0.65, 1]
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    /* Soft round sprite reused for every dot, so near dots can be drawn out of focus cheaply. */
    const sprite = document.createElement("canvas")
    sprite.width = 64
    sprite.height = 64
    const sctx = sprite.getContext("2d")
    if (sctx) {
      const g = sctx.createRadialGradient(32, 32, 0, 32, 32, 32)
      g.addColorStop(0, "rgba(90, 98, 112, 1)")
      g.addColorStop(0.35, "rgba(90, 98, 112, 0.55)")
      g.addColorStop(1, "rgba(90, 98, 112, 0)")
      sctx.fillStyle = g
      sctx.fillRect(0, 0, 64, 64)
    }

    let w = 0
    let h = 0
    let streaks: Streak[] = []
    let dots: Dot[] = []
    let raf = 0
    let last = performance.now()
    let t = 0
    let cleared = false

    const spawn = (s: Streak, fromTop: boolean): void => {
      const z = BANDS[s.band]
      s.len = 14 + z * 60 + Math.random() * 30 * z
      s.speed = 5 + z * 11 + Math.random() * 3
      s.x = Math.random() * (w + 200) - 100
      s.y = fromTop ? -Math.random() * h * 0.3 : Math.random() * h
    }

    const resize = (): void => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(Math.round((w * h) / (reduce ? 30000 : 9000)), 260)
      streaks = Array.from({ length: count }, () => {
        const r = Math.random()
        const s: Streak = { x: 0, y: 0, len: 0, speed: 0, band: r < 0.5 ? 0 : r < 0.8 ? 1 : 2 }
        spawn(s, false)
        return s
      })
      dots = Array.from({ length: 50 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        z: Math.random(),
        r: 0.6 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        a: 0.2 + Math.random() * 0.4,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    const draw = (now: number): void => {
      raf = requestAnimationFrame(draw)
      const dt = Math.min((now - last) / 16.667, 3)
      last = now

      /* Skip all work while the timeline keeps this layer hidden. */
      if (parseFloat(canvas.style.opacity || "0") < 0.01) {
        if (!cleared) {
          ctx.clearRect(0, 0, w, h)
          cleared = true
        }
        return
      }
      cleared = false
      t += dt / 60
      ctx.clearRect(0, 0, w, h)

      const cam = camRef.current
      const boost = 1 + Math.min(Math.abs(cam.vel), 60) / 40
      const wind = 0.14 + Math.sin(t * 0.45) * 0.06 + Math.sin(t * 1.9) * 0.02 + cam.x * 0.05

      ctx.lineCap = "round"
      BANDS.forEach((z, band) => {
        ctx.beginPath()
        ctx.lineWidth = 0.5 + z * 1.1
        ctx.strokeStyle = `rgba(80, 88, 100, ${0.05 + z * 0.15})`
        const ox = -cam.x * z * 26
        const oy = -cam.y * z * 14
        streaks.forEach((s) => {
          if (s.band !== band) return
          const len = s.len * (0.75 + boost * 0.25)
          const x = s.x + ox
          const y = s.y + oy
          ctx.moveTo(x, y)
          ctx.lineTo(x - wind * len, y - len)
          const step = s.speed * boost * dt
          s.y += step
          s.x += wind * step
          if (s.y - len > h + 20) spawn(s, true)
          else if (s.x > w + 120) s.x -= w + 240
        })
        ctx.stroke()
      })

      dots.forEach((d) => {
        d.x += (d.vx + wind * 0.4 * d.z + Math.sin(t * 0.7 + d.phase) * 0.12) * dt
        d.y += (d.vy + Math.cos(t * 0.5 + d.phase) * 0.1) * dt
        if (d.x < -40) d.x = w + 40
        if (d.x > w + 40) d.x = -40
        if (d.y < -40) d.y = h + 40
        if (d.y > h + 40) d.y = -40
        /* Dots closest to the lens fall out of focus: bigger and softer. */
        const blur = Math.max(0, d.z - 0.6) / 0.4
        const size = d.r * (2.5 + d.z * 2.5) * (1 + blur * 1.5)
        const x = d.x - cam.x * d.z * 40
        const y = d.y - cam.y * d.z * 24
        ctx.globalAlpha = d.a * (1 - blur * 0.65)
        ctx.drawImage(sprite, x - size / 2, y - size / 2, size, size)
      })
      ctx.globalAlpha = 1
    }

    resize()
    raf = requestAnimationFrame(draw)
    window.addEventListener("resize", resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [])

  /* Master scroll-scrubbed timeline (built once WebGL support is known, since layers differ) */
  useEffect(() => {
    const root = rootRef.current
    const scroller = scrollerRef.current
    if (!root || !scroller || webgl === null) return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const bridge = bridgeRef.current

    const ctx = gsap.context(() => {
      const dots = gsap.utils.toArray<HTMLElement>("[data-dot]")

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: scroller,
          start: "top top",
          end: "bottom bottom",
          /* Numeric scrub adds inertia: the scene catches up to the scroll position instead of snapping. */
          scrub: 1,
          onUpdate: (self) => {
            const p = self.progress
            dots.forEach((dot, i) => {
              const next = DOT_STOPS[i + 1] ?? 2
              dot.dataset.on = p >= DOT_STOPS[i] && p < next ? "1" : "0"
            })
          },
        },
      })

      /* The WebGL scene follows the smoothed (scrubbed) playhead, in timeline units. */
      tl.eventCallback("onUpdate", () => {
        bridge.time = tl.time()
      })

      /* Text reveal: soft fade, slight upward slide, letter-spacing settle. */
      const reveal = (name: string, tIn: number, tOut?: number): void => {
        const el = sel(name)
        tl.fromTo(
          el,
          { opacity: 0, y: 40, letterSpacing: "0.5em" },
          { opacity: 1, y: 0, letterSpacing: "0.22em", duration: 2.5, ease: "power2.out" },
          tIn,
        )
        if (tOut !== undefined) {
          tl.to(el, { opacity: 0, y: -30, duration: 2, ease: "power1.in" }, tOut)
        }
      }

      /* 0-6: night flips to cream ink-wash */
      tl.to(sel("heroColor"), { opacity: 0, duration: 6 }, 0)
        .to(sel("heroInk"), { opacity: 1, duration: 6 }, 0)
        .to(sel("cream"), { opacity: 1, duration: 6 }, 0)
        .to(sel("wordmark"), { color: CHARCOAL, duration: 6 }, 0)
        .to(sel("nav"), { color: CHARCOAL, duration: 6 }, 0)
        .to(sel("dots"), { color: CHARCOAL, duration: 6 }, 0)
        .to(sel("hint"), { opacity: 0, duration: 2 }, 0)

      /* 6-18: peak shrinks, recedes and racks out of focus, wordmark spreads, mist + rain */
      tl.to(sel("hero"), { scale: 0.5, yPercent: -8, duration: 12, ease: "power1.inOut" }, 6)
        .fromTo(
          sel("hero"),
          { filter: "blur(0px)" },
          { filter: "blur(5px)", duration: 6, ease: "power1.in", immediateRender: false },
          12,
        )
        .to(sel("wmL"), { x: "-30vw", letterSpacing: "0.6em", duration: 12, ease: "power1.inOut" }, 6)
        .to(sel("wmR"), { x: "30vw", letterSpacing: "0.6em", duration: 12, ease: "power1.inOut" }, 6)
        .to(sel("wordmark"), { opacity: 0, duration: 4 }, 14)
        .to(sel("mist"), { opacity: 1, duration: 6 }, 6)
        .to(sel("rain"), { opacity: 1, duration: 4 }, 8)

      /* 15-22: dissolve into pale blue-white glow and fog */
      tl.to(sel("dissolve"), { opacity: 1, duration: 3 }, 15)
        .to(sel("hero"), { opacity: 0, duration: 4 }, 16)
        .to(sel("dissolve"), { opacity: 0, duration: 4 }, 19)
        .to(sel("rain"), { opacity: 0, duration: 3 }, 19)

      /* 20-38: intro statements */
      reveal("stA", 20, 27)
      reveal("stB", 29, 36)
      reveal("stAside", 22, 36)
      tl.fromTo(sel("darkCloud"), { x: "-40vw" }, { x: "40vw", duration: 20 }, 20)
        .fromTo(sel("darkCloud"), { opacity: 0 }, { opacity: 1, duration: 3 }, 20)
        .to(sel("darkCloud"), { opacity: 0, duration: 3 }, 37)

      /* 36-44: cream gives way to storm clouds */
      tl.to(sel("mist"), { opacity: 0, duration: 4 }, 36)
        .to(sel("cream"), { opacity: 0, duration: 6 }, 38)
        .fromTo(sel("clouds"), { opacity: 0 }, { opacity: 1, duration: 6 }, 38)
        .fromTo(
          sel("clouds"),
          { scale: 1.25, filter: "brightness(2.4) contrast(0.55) saturate(0)" },
          { scale: 1, filter: "brightness(1) contrast(1) saturate(1)", duration: 28 },
          38,
        )
        .to(sel("nav"), { color: WHITE, duration: 4 }, 38)
        .to(sel("dots"), { color: WHITE, duration: 4 }, 38)

      /* 40-66: ship sails through the sky */
      tl.fromTo(sel("ship"), { x: "108vw" }, { x: "-85vw", duration: 26 }, 40)
        .fromTo(sel("ship"), { opacity: 0 }, { opacity: 0.95, duration: 4 }, 40)
        .to(sel("ship"), { opacity: 0, duration: 4 }, 62)

      /* 42-66: division labels with parallax */
      DIVISIONS.forEach((_, i) => {
        const name = `div${i}`
        reveal(name, 42 + i * 6, 46 + i * 6)
        tl.fromTo(sel(name), { x: "7vw" }, { x: "-5vw", duration: 6 }, 42 + i * 6)
      })

      /* 66-80: clouds whiteout, terrain, camera descent */
      tl.to(sel("white"), { opacity: 1, duration: 4 }, 66)
        .to(sel("clouds"), { opacity: 0, duration: 0.1 }, 70)
        .fromTo(sel("terrain"), { opacity: 0 }, { opacity: 1, duration: 4 }, 69)
        .to(sel("white"), { opacity: 0, duration: 4 }, 70)

      /* With WebGL the descent, relief and airplane are real 3D (scene/terrain-scene.tsx). */
      if (!webgl) {
        /* Fallback: the ground tilts up and levels out, 2D airplane icon */
        tl.fromTo(
          sel("terrain"),
          { scale: 1.7, rotationX: 24, transformPerspective: 900 },
          { scale: 1, rotationX: 0, transformPerspective: 900, duration: 12, ease: "power1.inOut" },
          69,
        )
          .fromTo(
            sel("plane"),
            { x: "18vw", y: "62vh", rotation: -38, scale: 1.3 },
            { x: "72vw", y: "34vh", rotation: -32, scale: 0.85, duration: 12 },
            70,
          )
          .fromTo(sel("plane"), { opacity: 0 }, { opacity: 1, duration: 2 }, 72)
          .to(sel("plane"), { opacity: 0, duration: 2 }, 78)
      }

      /* 76-93: planet Earth */
      tl.to(sel("terrain"), { opacity: 0, duration: 4 }, 77)
        .fromTo(sel("earth"), { opacity: 0 }, { opacity: 1, duration: 5 }, 76)
        .fromTo(sel("earth"), { scale: 1.7 }, { scale: 1.15, duration: 6, ease: "power1.out" }, 76)
        .to(sel("earth"), { rotation: 5, duration: 14 }, 82)
        .to(sel("earth"), { yPercent: 58, duration: 6, ease: "power1.inOut" }, 88)
        .to(sel("black"), { opacity: 0.88, duration: 4 }, 88)
      reveal("earthText", 80, 87)

      /* 91-98: sustainability, near-black */
      reveal("sust", 91, 96)

      /* 98-110: contact finale */
      reveal("forestA", 98, 103)
      reveal("forestB", 103)

      /* Nav links reappear near the end */
      tl.to(sel("navLinks"), { opacity: 0, duration: 2 }, 8)
        .to(sel("navLinks"), { opacity: 1, duration: 3 }, 106)

      /* Pad timeline so scroll maps exactly to TOTAL units */
      tl.to(root, { duration: 0.001 }, TOTAL - 0.001)

      /* Ship rides the swell: heave and roll on independent periods so it never loops visibly. */
      if (!reduce) {
        gsap.fromTo(sel("ship"), { y: 4 }, { y: -4, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1 })
        gsap.fromTo(
          sel("ship"),
          { rotation: -0.7 },
          { rotation: 0.7, duration: 3.7, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 80%" },
        )
      }
    }, root)

    const refresh = (): void => ScrollTrigger.refresh()
    window.addEventListener("load", refresh)
    return () => {
      window.removeEventListener("load", refresh)
      ctx.revert()
    }
  }, [webgl])

  return (
    <div ref={rootRef} className={`${styles.root} ${fontClassName}`}>
      <div className={`${styles.loader} ${ready ? styles.loaderDone : ""}`} role="status">
        <span>Nuphea</span>
        <div className={styles.loaderBar}>
          <i style={{ transform: `scaleX(${progress})` }} />
        </div>
      </div>

      <div ref={scrollerRef} className={styles.scroller} aria-hidden="true" />

      <main className={styles.stage}>
        <h1 style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
          Oeun Nuphea — Software Engineer
        </h1>

        {/* Camera: every visual layer sits at its own depth; copy and UI stay outside, like titles */}
        <div ref={cameraRef} className={styles.camera}>
          <Depth z={-600} bleed>
            <div className={`${styles.layer} ${styles.navy}`} />
          </Depth>
          <Depth z={-400} bleed>
            <div data-l="cream" className={`${styles.layer} ${styles.cream}`} />
          </Depth>

          <Depth z={-500} bleed className={styles.drift}>
            <img data-l="clouds" className={`${styles.cover} ${styles.clouds}`} src={IMG.clouds} alt="" />
          </Depth>
          <div data-l="white" className={`${styles.layer} ${styles.white}`} />
          {webgl ? (
            /* Real 3D terrain flyover; the timeline only fades this layer in and out */
            <div data-l="terrain" className={`${styles.layer} ${styles.terrain}`}>
              <MontfortCanvas bridge={bridgeRef} />
            </div>
          ) : (
            <>
              <Depth z={-350} bleed>
                <img data-l="terrain" className={`${styles.cover} ${styles.terrain}`} src={IMG.terrain} alt="" />
              </Depth>
              <svg
                data-l="plane"
                className={`${styles.layer} ${styles.plane}`}
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
              </svg>
            </>
          )}
          <Depth z={-450} bleed className={styles.orbit}>
            <img data-l="earth" className={`${styles.cover} ${styles.earth}`} src={IMG.earth} alt="" />
          </Depth>
          <div data-l="black" className={`${styles.layer} ${styles.black}`} />

          {/* Mountain hero: wordmark sits between the peak and a clipped copy of it for depth */}
          <Depth z={-220}>
            <div data-l="hero" className={styles.hero}>
              <div className={styles.frame}>
                <img data-l="heroColor" src={IMG.mountain} alt="" />
              </div>
              {/* Shimmering light column behind the peak (occluded by the clipped peak copy) */}
              <div className={`${styles.frame} ${styles.beamFrame}`} data-l="heroColor" aria-hidden="true">
                <span className={styles.beam} />
              </div>
              <div className={`${styles.frame} ${styles.ink}`} data-l="heroInk">
                <img src={IMG.mountain} alt="" />
              </div>
              <div data-l="wordmark" className={styles.wordmark} aria-hidden="true">
                <span data-l="wmL">Oeun</span>
                <span data-l="wmR">Nuphea</span>
              </div>
              <div className={`${styles.frame} ${styles.peakClip}`} data-l="heroColor">
                <img src={IMG.mountain} alt="" />
              </div>
              <div className={`${styles.frame} ${styles.peakClip} ${styles.ink}`} data-l="heroInk">
                <img src={IMG.mountain} alt="" />
              </div>
            </div>
          </Depth>

          <Depth z={-150} bleed>
            <div data-l="dissolve" className={`${styles.layer} ${styles.dissolve}`} />
          </Depth>
          <Depth z={150} bleed>
            <div data-l="mist" className={`${styles.layer} ${styles.mist}`}>
              <span className={styles.mistBlob} />
              <span className={styles.mistBlob} />
              <span className={styles.mistBlob} />
            </div>
          </Depth>
          <canvas data-l="rain" ref={canvasRef} className={`${styles.layer} ${styles.rain}`} />
          <Depth z={120}>
            <div data-l="darkCloud" className={`${styles.layer} ${styles.darkCloud}`} />
          </Depth>
          <Depth z={-120} className={styles.screen}>
            <img data-l="ship" className={`${styles.layer} ${styles.ship}`} src={IMG.ship} alt="" />
          </Depth>

          {/* Lightning flash, triggered by the camera rig during the storm */}
          <div ref={flashRef} className={`${styles.layer} ${styles.flash}`} aria-hidden="true" />
        </div>

        {/* Copy */}
        <p data-l="stA" className={`${styles.block} ${styles.statement} ${styles.dark}`}>
          Oeun Nuphea is a software engineer based in Phnom Penh, Cambodia.
        </p>
        <p data-l="stB" className={`${styles.block} ${styles.statement} ${styles.dark}`}>
          Specialising in scalable REST APIs, real-time WebSockets, database design and CI/CD automation.
        </p>
        <div data-l="stAside" className={`${styles.block} ${styles.aside} ${styles.dark}`}>
          <p>
            A Computer Science graduate from RUPP, building responsive web applications with REST APIs and
            real-time features, backed by both SQL and NoSQL databases.
          </p>
          <LinkCircle>Learn more</LinkCircle>
        </div>

        {DIVISIONS.map((d, i) => (
          <div key={d.title} data-l={`div${i}`} className={`${styles.block} ${styles.division} ${styles.light}`}>
            <div className={styles.tag}>
              <Diamond n={`0${i + 1}`} />
              {d.title}
            </div>
            <h3>{d.headline}</h3>
            <LinkCircle>{d.link}</LinkCircle>
          </div>
        ))}

        <p data-l="earthText" className={`${styles.block} ${styles.earthText} ${styles.light}`}>
          Currently a Backend Developer at LTNG Business, building a real-time chat application with
          WebSockets, MongoDB and Redis, and delivering full-stack solutions for clients.
        </p>

        <div data-l="sust" className={`${styles.block} ${styles.sust} ${styles.light}`}>
          <p>
            Passionate about writing maintainable code, self-development and collaborating with
            cross-functional teams to solve technical challenges…
          </p>
          <div className={styles.tag}>
            <Diamond n="" />
            Royal University of Phnom Penh
          </div>
        </div>

        <p data-l="forestA" className={`${styles.block} ${styles.forestA} ${styles.light}`}>
          Let&apos;s build something reliable together
        </p>
        <div data-l="forestB" className={`${styles.block} ${styles.forestB} ${styles.light}`}>
          <h3>Get in touch</h3>
          <p>
            <a href="mailto:nupheaoeun@gmail.com">nupheaoeun@gmail.com</a>
            <br />
            <a href="https://github.com/Oeun-nuphea">GitHub</a> ·{" "}
            <a href="https://www.linkedin.com/in/ouen-nuphea/">LinkedIn</a> ·{" "}
            <a href="https://t.me/oeunnuphea">Telegram</a>
          </p>
        </div>

        <div className={styles.vignette} />
        <div className={styles.grain} />

        {/* UI */}
        <nav data-l="nav" className={styles.nav} aria-label="Primary">
          <div className={styles.logo}>
            <svg viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
              <path d="M13 1 25 13 13 25 1 13Z" />
              <path d="M5 17 13 8l8 9" />
            </svg>
            <span>Nuphea</span>
          </div>
          <div className={styles.navRight}>
            <div data-l="navLinks" className={styles.navLinks}>
              <a href="/#about">About</a>
              <a href="/#stack">Stack</a>
              <a href="/#experience">Experience</a>
              <a href="/#contact">Contact</a>
            </div>
            <button type="button" className={styles.menuBtn}>
              Menu
              <i />
            </button>
          </div>
        </nav>

        <div data-l="dots" className={styles.dots} aria-hidden="true">
          {DOT_STOPS.map((stop) => (
            <i key={stop} data-dot data-on="0" />
          ))}
        </div>

        <div data-l="hint" className={styles.hint} aria-hidden="true">
          Scroll
          <span />
        </div>
      </main>
    </div>
  )
}
