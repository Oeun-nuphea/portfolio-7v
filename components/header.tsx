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

      {/* Telegram iOS Bottom Navigation Bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 pointer-events-none flex justify-center pb-[calc(1rem+env(safe-area-inset-bottom,0px))] px-4 lg:hidden">
        <nav className="pointer-events-auto flex w-full max-w-[340px] items-center justify-between rounded-full border border-white/70 bg-white/80 backdrop-blur-2xl p-1 shadow-[0_10px_35px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.04)]">
          {navItems.map((item) => {
            const Icon = item.icon
            const sectionKey = item.href.substring(1)
            const isActive = activeSection === sectionKey

            return (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setActiveSection(sectionKey)}
                className={`flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-full transition-colors duration-150 ${
                  isActive
                    ? "bg-[#EAEFF5] text-[#0088cc]"
                    : "text-[#707579] hover:text-slate-800"
                }`}
              >
                <Icon
                  size={20}
                  strokeWidth={2}
                  className={`transition-colors duration-150 ${
                    isActive ? "text-[#0088cc]" : "text-[#707579]"
                  }`}
                />
                <span
                  className={`text-[10px] leading-tight mt-0.5 tracking-tight transition-colors duration-150 ${
                    isActive ? "font-semibold text-[#0088cc]" : "font-medium text-[#707579]"
                  }`}
                >
                  {item.label}
                </span>
              </a>
            )
          })}
        </nav>
      </div>
    </>
  )
}

