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
  const [activeSection, setActiveSection] = useState("")
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const shareData = {
      title: "Oeun Nuphea - Backend Engineer",
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
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }, observerOptions)

    navItems.forEach((item) => {
      const el = document.querySelector(item.href)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/50 bg-white/70 backdrop-blur-2xl supports-[backdrop-filter]:bg-white/60 pt-[env(safe-area-inset-top,0px)] shadow-[0_4px_24px_rgba(15,23,42,0.03)]">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3 lg:px-8">
          <a href="#top" className="flex items-center gap-2.5 group">
            <div className="relative h-8 w-8 overflow-hidden rounded-full border border-white/80 shadow-sm ring-1 ring-black/5 transition-transform duration-200 group-hover:scale-105">
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
              <span className="text-xs text-muted-foreground leading-tight">Backend Engineer</span>
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

      {/* Floating iOS Glass Dock for Mobile */}
      <div className="fixed inset-x-0 bottom-0 z-50 pointer-events-none flex justify-center pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] px-4 lg:hidden">
        <nav className="pointer-events-auto w-full max-w-md rounded-2xl border border-white/70 bg-white/80 backdrop-blur-2xl shadow-[0_12px_40px_rgba(15,23,42,0.1),inset_0_1px_1px_rgba(255,255,255,0.95)]">
          <div className="flex h-15 items-center justify-around px-2 py-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.href.substring(1)
              const isProfileTab = item.label === "About"

              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`relative flex flex-1 flex-col items-center justify-center gap-1 py-1 text-[10px] transition-all duration-200 rounded-xl ${
                    isActive
                      ? "text-foreground font-semibold bg-white/70 shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isProfileTab ? (
                    <div
                      className={`relative h-5 w-5 overflow-hidden rounded-full border transition-all ${
                        isActive ? "border-foreground ring-1 ring-foreground" : "border-muted-foreground/40"
                      }`}
                    >
                      <Image
                        src="/OUENNUPHEA.jpg"
                        alt="Profile"
                        fill
                        className="object-cover"
                        sizes="20px"
                      />
                    </div>
                  ) : (
                    <Icon size={18} className={isActive ? "stroke-[2.5]" : "stroke-[1.75]"} />
                  )}
                  <span className="leading-none">{item.label}</span>
                </a>
              )
            })}
          </div>
        </nav>
      </div>
    </>
  )
}

