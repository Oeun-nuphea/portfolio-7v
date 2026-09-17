"use client"

import { User, Layers, Briefcase, Mail, Check, Settings, PanelLeft, PanelRight, PanelBottom, X, Share2 } from "lucide-react"
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
            <div className="hidden lg:flex lg:items-center lg:gap-1 p-1 rounded-full border border-white/75 bg-white/[0.08] backdrop-blur-md backdrop-saturate-[180%] shadow-[0_8px_24px_rgba(0,0,0,0.04),inset_0_1.5px_2px_rgba(255,255,255,0.9),inset_0_-1px_2px_rgba(255,255,255,0.3)]">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.substring(1)
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setActiveSection(item.href.substring(1))}
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

      {/* Liquid Glass Optical Refraction SVG Filter */}
      <svg className="pointer-events-none fixed -top-full left-0 h-0 w-0 opacity-0" aria-hidden="true">
        <defs>
          <filter id="liquid-glass-lens" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015 0.015"
              numOctaves={2}
              seed={5}
              result="turbulence"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale={22}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
          </filter>
        </defs>
      </svg>

      {/* Screen Boundary for Dragging Navigation (iPad Pro, iPad, Mobile) */}
      <div ref={constraintsRef} className="fixed inset-0 z-50 pointer-events-none p-4 lg:hidden">
        {/* Pure Crystal Glass Floating Navigation Bar */}
        <motion.div
          ref={navContainerRef}
          key={dockPosition}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={`absolute pointer-events-none ${
            dockPosition === "left"
              ? "left-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2.5"
              : dockPosition === "right"
              ? "right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2.5"
              : "bottom-4 left-0 right-0 mx-auto flex items-center justify-center gap-3 w-fit"
          }`}
        >
          {/* Main Crystal Glass Capsule: Morphs between horizontal capsule and vertical side dock */}
          <nav
            style={{
              backdropFilter: "blur(2px) saturate(170%) url(#liquid-glass-lens)",
              WebkitBackdropFilter: "blur(2px) saturate(170%) url(#liquid-glass-lens)",
            }}
            className={`pointer-events-auto items-center border border-white/75 bg-white/[0.05] shadow-[0_16px_40px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04),inset_0_1.5px_2px_rgba(255,255,255,0.95),inset_0_-1.5px_2px_rgba(255,255,255,0.35),inset_0_0_0_1px_rgba(255,255,255,0.25),inset_0_0_14px_rgba(255,255,255,0.08)] hover:border-white/95 hover:bg-white/[0.1] hover:shadow-[0_20px_50px_rgba(0,0,0,0.11),0_6px_18px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(255,255,255,0.98),inset_0_-1px_2px_rgba(255,255,255,0.4)] backdrop-blur-md backdrop-saturate-[180%] transform-gpu transition-all duration-300 ${
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
                        ? "border border-white/85 bg-white/[0.08] text-neutral-950 shadow-[0_4px_14px_rgba(0,0,0,0.05),inset_0_1.5px_2px_rgba(255,255,255,0.95),inset_0_-1.5px_2px_rgba(255,255,255,0.35),inset_0_0_0_1px_rgba(255,255,255,0.25)] backdrop-blur-md"
                        : "border border-transparent text-neutral-600 hover:text-neutral-950 hover:bg-white/[0.14] hover:border-white/40"
                    }`}
                  >
                    <Icon
                      size={dockPosition === "bottom" ? 20 : 22}
                      strokeWidth={isActive ? 2.2 : 1.9}
                      className={`transition-colors duration-200 ${
                        isActive ? "text-neutral-950 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" : "text-neutral-600 group-hover:text-neutral-950"
                      }`}
                    />
                    {dockPosition === "bottom" && (
                      <span
                        className={`mt-0.5 text-[10px] tracking-tight transition-colors duration-200 ${
                          isActive
                            ? "text-neutral-950 font-semibold drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
                            : "text-neutral-600 group-hover:text-neutral-950 font-medium"
                        }`}
                      >
                        {item.label}
                      </span>
                    )}
                  </a>
                )
              })}
          </nav>

          {/* Standalone Circular Crystal Glass Contact Button (Bottom dock only) */}
          {dockPosition === "bottom" && (
            <a
              href="#contact"
              onClick={() => setActiveSection("contact")}
              style={{
                backdropFilter: "blur(2px) saturate(170%) url(#liquid-glass-lens)",
                WebkitBackdropFilter: "blur(2px) saturate(170%) url(#liquid-glass-lens)",
              }}
              className={`pointer-events-auto flex h-[58px] w-[58px] shrink-0 flex-col items-center justify-center rounded-full transition-all duration-200 active:scale-95 transform-gpu backdrop-blur-md backdrop-saturate-[180%] ${
                activeSection === "contact"
                  ? "border border-white/85 bg-white/[0.08] text-neutral-950 shadow-[0_16px_40px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04),inset_0_1.5px_2px_rgba(255,255,255,0.95),inset_0_-1.5px_2px_rgba(255,255,255,0.35),inset_0_0_0_1px_rgba(255,255,255,0.25)]"
                  : "border border-white/75 bg-white/[0.05] text-neutral-600 hover:bg-white/[0.14] hover:border-white/95 hover:text-neutral-950 hover:scale-[1.04] shadow-[0_16px_40px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04),inset_0_1.5px_2px_rgba(255,255,255,0.95),inset_0_-1.5px_2px_rgba(255,255,255,0.35),inset_0_0_0_1px_rgba(255,255,255,0.25),inset_0_0_14px_rgba(255,255,255,0.08)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.11),0_6px_18px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(255,255,255,0.98),inset_0_-1px_2px_rgba(255,255,255,0.4)]"
              }`}
              aria-label="Contact"
            >
              <Mail
                size={20}
                strokeWidth={activeSection === "contact" ? 2.2 : 1.9}
                className={`transition-colors duration-200 ${
                  activeSection === "contact" ? "drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)] text-neutral-950" : "text-neutral-600 group-hover:text-neutral-950"
                }`}
              />
              <span
                className={`mt-0.5 text-[9px] leading-none transition-colors duration-200 ${
                  activeSection === "contact"
                    ? "font-semibold text-neutral-950 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
                    : "font-medium text-neutral-600"
                }`}
              >
                Contact
              </span>
            </a>
          )}

          {/* Paired Crystal Glass Capsule for Contact & Share (Left & Right Dock only) */}
          {(dockPosition === "left" || dockPosition === "right") && (
            <div
              style={{
                backdropFilter: "blur(2px) saturate(170%) url(#liquid-glass-lens)",
                WebkitBackdropFilter: "blur(2px) saturate(170%) url(#liquid-glass-lens)",
              }}
              className="pointer-events-auto flex w-[58px] flex-col p-0.5 gap-0.5 rounded-[32px] border border-white/75 bg-white/[0.05] shadow-[0_16px_40px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04),inset_0_1.5px_2px_rgba(255,255,255,0.95),inset_0_-1.5px_2px_rgba(255,255,255,0.35),inset_0_0_0_1px_rgba(255,255,255,0.25),inset_0_0_14px_rgba(255,255,255,0.08)] hover:border-white/95 hover:bg-white/[0.1] hover:shadow-[0_20px_50px_rgba(0,0,0,0.11),0_6px_18px_rgba(0,0,0,0.05),inset_0_2px_4px_rgba(255,255,255,0.98),inset_0_-1px_2px_rgba(255,255,255,0.4)] backdrop-blur-md backdrop-saturate-[180%] transform-gpu transition-all duration-300"
            >
              <a
                href="#contact"
                onClick={() => setActiveSection("contact")}
                className={`group relative flex h-[54px] w-full flex-col items-center justify-center rounded-[28px] transition-all duration-200 ${
                  activeSection === "contact"
                    ? "border border-white/85 bg-white/[0.08] text-neutral-950 shadow-[0_4px_14px_rgba(0,0,0,0.05),inset_0_1.5px_2px_rgba(255,255,255,0.95),inset_0_-1.5px_2px_rgba(255,255,255,0.35),inset_0_0_0_1px_rgba(255,255,255,0.25)] backdrop-blur-md"
                    : "border border-transparent text-neutral-600 hover:text-neutral-950 hover:bg-white/[0.14] hover:border-white/40"
                }`}
                aria-label="Contact"
              >
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
          )}
        </motion.div>
      </div>
    </>
  )
}

