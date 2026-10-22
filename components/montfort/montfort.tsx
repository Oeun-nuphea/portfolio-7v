"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "lenis"
import styles from "./montfort.module.css"

gsap.registerPlugin(ScrollTrigger)

interface MontfortProps {
  fontClassName: string
}

interface Division {
  title: string
  headline: string
  link: string
}

const CHARCOAL = "#2a2b2f"
const WHITE = "#ffffff"
const TOTAL = 110

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

export default function Montfort({ fontClassName }: MontfortProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const [progress, setProgress] = useState<number>(0)
  const [ready, setReady] = useState<boolean>(false)

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

  /* Rain streaks and floating dots */
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
      a: number
    }
    interface Dot {
      x: number
      y: number
      r: number
      vx: number
      vy: number
      a: number
    }

    let w = 0
    let h = 0
    let streaks: Streak[] = []
    let dots: Dot[] = []
    let raf = 0

    const resize = (): void => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      streaks = Array.from({ length: 70 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        len: 60 + Math.random() * 160,
        speed: 1.2 + Math.random() * 2.4,
        a: 0.06 + Math.random() * 0.14,
      }))
      dots = Array.from({ length: 50 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.6,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        a: 0.2 + Math.random() * 0.4,
      }))
    }

    const draw = (): void => {
      ctx.clearRect(0, 0, w, h)
      ctx.lineWidth = 1
      streaks.forEach((s) => {
        ctx.strokeStyle = `rgba(80, 88, 100, ${s.a})`
        ctx.beginPath()
        ctx.moveTo(s.x, s.y)
        ctx.lineTo(s.x, s.y + s.len)
        ctx.stroke()
        s.y += s.speed
        if (s.y > h) {
          s.y = -s.len
          s.x = Math.random() * w
        }
      })
      dots.forEach((d) => {
        ctx.fillStyle = `rgba(90, 98, 112, ${d.a})`
        ctx.beginPath()
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2)
        ctx.fill()
        d.x += d.vx
        d.y += d.vy
        if (d.x < 0) d.x = w
        if (d.x > w) d.x = 0
        if (d.y < 0) d.y = h
        if (d.y > h) d.y = 0
      })
      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener("resize", resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", resize)
    }
  }, [])

  /* Master scroll-scrubbed timeline */
  useEffect(() => {
    const root = rootRef.current
    const scroller = scrollerRef.current
    if (!root || !scroller) return

    const ctx = gsap.context(() => {
      const dots = gsap.utils.toArray<HTMLElement>("[data-dot]")

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: scroller,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress
            dots.forEach((dot, i) => {
              const next = DOT_STOPS[i + 1] ?? 2
              dot.dataset.on = p >= DOT_STOPS[i] && p < next ? "1" : "0"
            })
          },
        },
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

      /* 6-18: peak shrinks and recedes, wordmark spreads, mist + rain */
      tl.to(sel("hero"), { scale: 0.5, yPercent: -8, duration: 12, ease: "power1.inOut" }, 6)
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
        .fromTo(sel("terrain"), { scale: 1.7 }, { scale: 1, duration: 12, ease: "power1.inOut" }, 69)
        .to(sel("white"), { opacity: 0, duration: 4 }, 70)
        .fromTo(
          sel("plane"),
          { x: "18vw", y: "62vh", rotation: -35 },
          { x: "72vw", y: "34vh", rotation: -35, duration: 12 },
          70,
        )
        .fromTo(sel("plane"), { opacity: 0 }, { opacity: 1, duration: 2 }, 72)
        .to(sel("plane"), { opacity: 0, duration: 2 }, 78)

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
    }, root)

    const refresh = (): void => ScrollTrigger.refresh()
    window.addEventListener("load", refresh)
    return () => {
      window.removeEventListener("load", refresh)
      ctx.revert()
    }
  }, [])

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

        <div className={`${styles.layer} ${styles.navy}`} />
        <div data-l="cream" className={`${styles.layer} ${styles.cream}`} />

        <img data-l="clouds" className={`${styles.cover} ${styles.clouds}`} src={IMG.clouds} alt="" />
        <div data-l="white" className={`${styles.layer} ${styles.white}`} />
        <img data-l="terrain" className={`${styles.cover} ${styles.terrain}`} src={IMG.terrain} alt="" />
        <svg
          data-l="plane"
          className={`${styles.layer} ${styles.plane}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
        </svg>
        <img data-l="earth" className={`${styles.cover} ${styles.earth}`} src={IMG.earth} alt="" />
        <div data-l="black" className={`${styles.layer} ${styles.black}`} />

        {/* Mountain hero: wordmark sits between the peak and a clipped copy of it for depth */}
        <div data-l="hero" className={styles.hero}>
          <div className={styles.frame}>
            <img data-l="heroColor" src={IMG.mountain} alt="" />
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

        <div data-l="dissolve" className={`${styles.layer} ${styles.dissolve}`} />
        <div data-l="mist" className={`${styles.layer} ${styles.mist}`}>
          <span className={styles.mistBlob} />
          <span className={styles.mistBlob} />
          <span className={styles.mistBlob} />
        </div>
        <canvas data-l="rain" ref={canvasRef} className={`${styles.layer} ${styles.rain}`} />
        <div data-l="darkCloud" className={`${styles.layer} ${styles.darkCloud}`} />
        <img data-l="ship" className={`${styles.layer} ${styles.ship}`} src={IMG.ship} alt="" />

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
