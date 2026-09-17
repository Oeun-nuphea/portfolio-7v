"use client"

import { User, Layers, Briefcase, Mail, Check, Settings, PanelLeft, PanelRight, PanelBottom, X } from "lucide-react"
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
  const [dockPosition, setDockPosition] = useState<"bottom" | "left" | "right">("bottom")
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const constraintsRef = useRef<HTMLDivElement>(null)
  const navContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let lastScrollY = window.scrollY

    // Find or create theme-color meta tag for Android status bar
    let metaThemeColor = document.querySelector('meta[name="theme-color"]')
    if (!metaThemeColor) {
      metaThemeColor = document.createElement("meta")
      metaThemeColor.setAttribute("name", "theme-color")
      document.head.appendChild(metaThemeColor)
    }

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
        if (metaThemeColor) metaThemeColor.setAttribute("content", "#ffffff")
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down -> hide top bar on mobile
        setIsVisible(false)
        if (metaThemeColor) metaThemeColor.setAttribute("content", "#f8fafc")
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up -> show top bar
        setIsVisible(true)
        if (metaThemeColor) metaThemeColor.setAttribute("content", "#ffffff")
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

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 border-b border-white/40 bg-white/[0.12] backdrop-blur-2xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/[0.10] pt-[env(safe-area-inset-top,0px)] shadow-[0_10px_30px_rgba(0,0,0,0.04),inset_0_-1px_1px_rgba(255,255,255,0.4)] transition-all duration-300 transform-gpu md:translate-y-0 md:opacity-100 md:pointer-events-auto ${
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
            <div className="hidden lg:flex lg:items-center lg:gap-1 p-1 rounded-full border border-white/60 bg-white/40 backdrop-blur-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.8)]">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.substring(1)
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setActiveSection(item.href.substring(1))}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-white text-foreground shadow-sm ring-1 ring-black/5"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/50"
                    }`}
                  >
                    {item.label}
                  </a>
                )
              })}
            </div>

            <div className="relative">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                className={`glass-button inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
                  isSettingsOpen ? "bg-white text-neutral-900 shadow-sm ring-1 ring-black/10" : "text-foreground hover:bg-white/90"
                }`}
                aria-label="Navigation settings"
              >
                <Settings size={14} className={`transition-transform duration-300 ${isSettingsOpen ? "rotate-90" : ""}`} />
                <span>Settings</span>
              </button>

              {/* Settings Dropdown Popover */}
              <AnimatePresence>
                {isSettingsOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -6 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/70 bg-white/80 p-3 shadow-[0_16px_40px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.9)] backdrop-blur-2xl backdrop-saturate-150 z-50"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
                      <span className="text-[11px] font-semibold text-neutral-800 tracking-wide uppercase">Bar Position</span>
                      <button
                        onClick={() => setIsSettingsOpen(false)}
                        className="rounded-full p-1 text-neutral-400 hover:text-neutral-700 hover:bg-black/[0.04] transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>

                    <div className="mt-2 space-y-1">
                      <button
                        onClick={() => {
                          setDockPosition("bottom")
                          setIsSettingsOpen(false)
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                          dockPosition === "bottom"
                            ? "bg-neutral-900 text-white shadow-sm"
                            : "text-neutral-700 hover:bg-black/[0.05]"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <PanelBottom size={15} />
                          <span>Bottom</span>
                        </span>
                        {dockPosition === "bottom" && <Check size={13} className="text-white" />}
                      </button>

                      <button
                        onClick={() => {
                          setDockPosition("left")
                          setIsSettingsOpen(false)
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                          dockPosition === "left"
                            ? "bg-neutral-900 text-white shadow-sm"
                            : "text-neutral-700 hover:bg-black/[0.05]"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <PanelLeft size={15} />
                          <span>Left Dock</span>
                        </span>
                        {dockPosition === "left" && <Check size={13} className="text-white" />}
                      </button>

                      <button
                        onClick={() => {
                          setDockPosition("right")
                          setIsSettingsOpen(false)
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-all ${
                          dockPosition === "right"
                            ? "bg-neutral-900 text-white shadow-sm"
                            : "text-neutral-700 hover:bg-black/[0.05]"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <PanelRight size={15} />
                          <span>Right Dock</span>
                        </span>
                        {dockPosition === "right" && <Check size={13} className="text-white" />}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </nav>
      </header>

      {/* Screen Boundary for Dragging Navigation (iPad Pro, iPad, Mobile) */}
      <div ref={constraintsRef} className="fixed inset-0 z-50 pointer-events-none p-4 lg:hidden">
        {/* Pure Crystal Glass Draggable Floating Navigation Bar */}
        <motion.div
          ref={navContainerRef}
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.06}
          dragMomentum={false}
          whileDrag={{ scale: 1.04, cursor: "grabbing" }}
          onDragEnd={(_e, info) => {
            if (!navContainerRef.current) return
            const rect = navContainerRef.current.getBoundingClientRect()
            const screenWidth = window.innerWidth
            const screenHeight = window.innerHeight

            // If dragged close to the left edge (< 25% of screen)
            if (rect.left < screenWidth * 0.25) {
              setDockPosition("left")
            }
            // If dragged close to the right edge (> 75% of screen)
            else if (rect.right > screenWidth * 0.75) {
              setDockPosition("right")
            }
            // If near the bottom or center
            else {
              setDockPosition("bottom")
            }
          }}
          animate={
            dockPosition === "left"
              ? { x: 0, y: 0, transition: { type: "spring", stiffness: 350, damping: 28 } }
              : dockPosition === "right"
              ? { x: 0, y: 0, transition: { type: "spring", stiffness: 350, damping: 28 } }
              : { x: 0, y: 0, transition: { type: "spring", stiffness: 350, damping: 28 } }
          }
          className={`absolute pointer-events-none touch-none transition-all duration-300 ${
            dockPosition === "left"
              ? "left-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2.5"
              : dockPosition === "right"
              ? "right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2.5"
              : "bottom-4 left-0 right-0 mx-auto flex items-center justify-center gap-3 w-fit"
          }`}
        >
          {/* Main Crystal Glass Capsule: Morphs between horizontal capsule and vertical side dock */}
          <nav
            className={`pointer-events-auto items-center border border-white/60 bg-white/[0.06] shadow-[0_20px_50px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.03),inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(255,255,255,0.3)] backdrop-blur-2xl backdrop-saturate-150 transform-gpu cursor-grab active:cursor-grabbing transition-all duration-300 ${
              dockPosition === "bottom"
                ? "flex h-[58px] min-w-[280px] max-w-[320px] flex-row p-0.5 rounded-[32px]"
                : "flex w-[58px] flex-col p-0.5 gap-0.5 rounded-[32px]"
            }`}
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
                    onClick={() => setActiveSection(sectionKey)}
                    className={`group relative flex flex-col items-center justify-center transition-all duration-200 ${
                      dockPosition === "bottom"
                        ? "h-full flex-1 rounded-[28px]"
                        : "h-[54px] w-full rounded-[28px]"
                    } ${
                      isActive
                        ? "border border-white/80 bg-white/[0.18] text-neutral-900 shadow-[0_4px_16px_rgba(0,0,0,0.06),inset_0_2px_3px_rgba(255,255,255,0.95),inset_0_-1px_2px_rgba(255,255,255,0.4),inset_0_0_10px_rgba(255,255,255,0.3)] backdrop-blur-xl"
                        : "border border-transparent text-neutral-500 hover:text-neutral-900 hover:bg-white/15"
                    }`}
                  >
                    <Icon
                      size={dockPosition === "bottom" ? 20 : 22}
                      strokeWidth={isActive ? 2.2 : 1.9}
                      className={`transition-colors duration-200 ${
                        isActive ? "text-neutral-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" : "text-neutral-500 group-hover:text-neutral-900"
                      }`}
                    />
                    {dockPosition === "bottom" && (
                      <span
                        className={`mt-0.5 text-[10px] font-medium tracking-tight transition-colors duration-200 ${
                          isActive
                            ? "text-neutral-900 font-semibold drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
                            : "text-neutral-500 group-hover:text-neutral-900"
                        }`}
                      >
                        {item.label}
                      </span>
                    )}
                  </a>
                )
              })}
          </nav>

          {/* Circular Crystal Glass Contact Button */}
          <a
            href="#contact"
            onClick={() => setActiveSection("contact")}
            className={`pointer-events-auto flex h-[58px] w-[58px] shrink-0 flex-col items-center justify-center rounded-full transition-all duration-200 active:scale-95 transform-gpu cursor-grab active:cursor-grabbing ${
              activeSection === "contact"
                ? "border border-white/85 bg-white/[0.18] text-neutral-900 shadow-[0_20px_50px_rgba(0,0,0,0.1),0_6px_16px_rgba(0,0,0,0.06),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(255,255,255,0.45),inset_0_0_12px_rgba(255,255,255,0.3)] backdrop-blur-2xl backdrop-saturate-150"
                : "border border-white/60 bg-white/[0.06] text-neutral-500 hover:bg-white/20 hover:text-neutral-900 shadow-[0_20px_50px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.03),inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(255,255,255,0.3)] backdrop-blur-2xl backdrop-saturate-150"
            }`}
            aria-label="Contact"
          >
            <Mail
              size={dockPosition === "bottom" ? 20 : 22}
              strokeWidth={activeSection === "contact" ? 2.2 : 1.9}
              className={activeSection === "contact" ? "drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" : ""}
            />
            {dockPosition === "bottom" && (
              <span className={`mt-0.5 text-[9px] leading-none ${activeSection === "contact" ? "font-semibold text-neutral-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" : "font-medium"}`}>
                Contact
              </span>
            )}
          </a>
        </motion.div>
      </div>
    </>
  )
}

