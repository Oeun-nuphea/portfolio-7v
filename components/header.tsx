"use client"

import { User, Compass, Layers, FolderGit2, Briefcase, Mail, Share2, Check } from "lucide-react"
import { useState, useEffect } from "react"

const navItems = [
  { label: "About", href: "#about", icon: User },
  { label: "Principles", href: "#principles", icon: Compass },
  { label: "Stack", href: "#stack", icon: Layers },
  { label: "Projects", href: "#projects", icon: FolderGit2 },
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
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 lg:px-8">
          <a href="#top" className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">Nuphea</span>
            <span className="text-xs text-muted-foreground">Backend Engineer</span>
          </a>

          <div className="flex items-center gap-4">
            <div className="hidden lg:flex lg:items-center lg:gap-8">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.substring(1)
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`text-sm transition-colors duration-200 ${
                      isActive
                        ? "text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </a>
                )
              })}
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:text-foreground hover:bg-muted"
              aria-label="Share portfolio link"
            >
              {copied ? <Check size={14} className="text-emerald-500" /> : <Share2 size={14} />}
              <span>{copied ? "Copied" : "Share"}</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Instagram-style Bottom Navigation Bar for Mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-md lg:hidden">
        <div className="flex h-16 items-center justify-around px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.href.substring(1)
            return (
              <a
                key={item.label}
                href={item.href}
                className={`relative flex flex-1 flex-col items-center justify-center gap-1 py-1 text-[10px] transition-colors ${
                  isActive
                    ? "text-foreground font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={20} className={isActive ? "stroke-[2.5]" : "stroke-[1.75]"} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute -top-px h-0.5 w-6 rounded-full bg-foreground" />
                )}
              </a>
            )
          })}
        </div>
      </nav>
    </>
  )
}
