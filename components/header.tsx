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

      {/* Telegram iOS 100 Liquid Glass Bottom Bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 pointer-events-none flex justify-center pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] px-4 lg:hidden">
        <nav className="pointer-events-auto relative w-full max-w-sm rounded-[28px] border border-white/80 bg-white/70 backdrop-blur-3xl p-1.5 shadow-[0_16px_40px_-8px_rgba(0,136,204,0.18),0_8px_24px_rgba(15,23,42,0.06),inset_0_1.5px_2px_rgba(255,255,255,1)]">
          {/* Liquid refraction specular edge highlight */}
          <div className="absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />

          <div className="flex h-14 items-center justify-around px-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.href.substring(1)
              const isProfileTab = item.label === "About"

              return (
                <a
                  key={item.label}
                  href={item.href}
                  className={`relative flex flex-1 flex-col items-center justify-center gap-1 py-1.5 text-[10px] font-medium transition-all duration-300 rounded-[20px] ${
                    isActive
                      ? "text-[#0088cc] font-bold bg-white/95 shadow-[0_4px_14px_rgba(0,136,204,0.18),inset_0_1px_1px_rgba(255,255,255,1)] scale-[1.02]"
                      : "text-slate-400 hover:text-slate-600 active:scale-95"
                  }`}
                >
                  {isProfileTab ? (
                    <div
                      className={`relative h-5 w-5 overflow-hidden rounded-full border transition-all duration-300 ${
                        isActive
                          ? "border-[#0088cc] ring-2 ring-[#0088cc]/30 shadow-[0_0_10px_rgba(0,136,204,0.35)]"
                          : "border-slate-300"
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
                    <Icon
                      size={18}
                      className={`transition-all duration-300 ${
                        isActive
                          ? "stroke-[2.5] text-[#0088cc] drop-shadow-[0_2px_6px_rgba(0,136,204,0.35)]"
                          : "stroke-[1.75]"
                      }`}
                    />
                  )}
                  <span className={`leading-none transition-colors duration-300 ${isActive ? "text-[#0088cc]" : ""}`}>
                    {item.label}
                  </span>

                  {isActive && (
                    <span className="absolute -bottom-0.5 h-1 w-1 rounded-full bg-[#0088cc] shadow-[0_0_6px_#0088cc]" />
                  )}
                </a>
              )
            })}
          </div>
        </nav>
      </div>
    </>
  )
}

