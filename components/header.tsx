"use client"

import { User, Layers, Briefcase, Mail, Share2, Check } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"

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

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Always show when near the top (within 50px)
      if (currentScrollY < 50) {
        setIsVisible(true)
      } else if (currentScrollY > lastScrollY) {
        // Scrolling down -> hide top bar
        setIsVisible(false)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up -> show top bar
        setIsVisible(true)
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
        className={`fixed inset-x-0 top-0 z-50 border-b border-white/50 bg-white/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/60 pt-[env(safe-area-inset-top,0px)] shadow-[0_4px_24px_rgba(15,23,42,0.03)] transition-all duration-300 transform-gpu ${
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

            <button
              onClick={handleShare}
              className="glass-button inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-foreground hover:bg-white/90"
              aria-label="Share portfolio link"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
              <span>{copied ? "Copied" : "Share"}</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Pure Crystal Glass Floating Bottom Navigation Bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 pointer-events-none flex items-center justify-center gap-3 pb-[calc(1rem+env(safe-area-inset-bottom,0px))] px-4 lg:hidden">
        {/* Main Crystal Glass Capsule (3 items: About, Stack, Experience) */}
        <nav className="pointer-events-auto flex flex-1 max-w-[320px] items-center rounded-[32px] border border-white/60 bg-white/[0.06] p-1.5 shadow-[0_20px_50px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.03),inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(255,255,255,0.3)] backdrop-blur-2xl backdrop-saturate-150 transform-gpu">
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
                  className={`group relative flex-1 flex flex-col items-center justify-center rounded-[24px] py-1.5 transition-all duration-200 ${
                    isActive
                      ? "border border-white/80 bg-white/[0.15] text-neutral-900 shadow-[0_6px_16px_rgba(0,0,0,0.06),inset_0_2px_3px_rgba(255,255,255,0.9),inset_0_-1px_2px_rgba(255,255,255,0.4),inset_0_0_8px_rgba(255,255,255,0.25)] backdrop-blur-xl"
                      : "border border-transparent text-neutral-500 hover:text-neutral-900 hover:bg-white/15"
                  }`}
                >
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.2 : 1.9}
                    className={`transition-colors duration-200 ${
                      isActive ? "text-neutral-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" : "text-neutral-500 group-hover:text-neutral-900"
                    }`}
                  />
                  <span
                    className={`mt-0.5 text-[10px] font-medium tracking-tight transition-colors duration-200 ${
                      isActive
                        ? "text-neutral-900 font-semibold drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]"
                        : "text-neutral-500 group-hover:text-neutral-900"
                    }`}
                  >
                    {item.label}
                  </span>
                </a>
              )
            })}
        </nav>

        {/* Circular Crystal Glass Contact Button */}
        <a
          href="#contact"
          onClick={() => setActiveSection("contact")}
          className={`pointer-events-auto flex h-[58px] w-[58px] shrink-0 flex-col items-center justify-center rounded-full transition-all duration-200 active:scale-95 transform-gpu ${
            activeSection === "contact"
              ? "border border-white/85 bg-white/[0.18] text-neutral-900 shadow-[0_20px_50px_rgba(0,0,0,0.1),0_6px_16px_rgba(0,0,0,0.06),inset_0_2px_4px_rgba(255,255,255,0.95),inset_0_-2px_4px_rgba(255,255,255,0.45),inset_0_0_12px_rgba(255,255,255,0.3)] backdrop-blur-2xl backdrop-saturate-150"
              : "border border-white/60 bg-white/[0.06] text-neutral-500 hover:bg-white/20 hover:text-neutral-900 shadow-[0_20px_50px_rgba(0,0,0,0.08),0_4px_16px_rgba(0,0,0,0.03),inset_0_2px_4px_rgba(255,255,255,0.8),inset_0_-2px_4px_rgba(255,255,255,0.3)] backdrop-blur-2xl backdrop-saturate-150"
          }`}
          aria-label="Contact"
        >
          <Mail
            size={20}
            strokeWidth={activeSection === "contact" ? 2.2 : 1.9}
            className={activeSection === "contact" ? "drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" : ""}
          />
          <span className={`mt-0.5 text-[9px] leading-none ${activeSection === "contact" ? "font-semibold text-neutral-900 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" : "font-medium"}`}>
            Contact
          </span>
        </a>
      </div>
    </>
  )
}

