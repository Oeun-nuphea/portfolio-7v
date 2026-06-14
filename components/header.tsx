"use client"

import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

const navItems = [
  { label: "Build", href: "#about" },
  { label: "Principles", href: "#principles" },
  { label: "Stack", href: "#stack" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")

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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#top" className="group">
          <span className="block text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-primary/70">
            Nuphea
          </span>
          <span className="block text-sm font-medium text-foreground transition-colors group-hover:text-primary">
            Backend Engineer
          </span>
        </a>

        <div className="hidden lg:flex lg:items-center lg:gap-7">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.substring(1)
            return (
              <a
                key={item.label}
                href={item.href}
                className={`text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {item.label}
              </a>
            )
          })}
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-card/80 lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {isOpen && (
          <div className="absolute inset-x-0 top-full border-b border-border/70 bg-background/95 lg:hidden">
            <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.substring(1)
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`text-base font-semibold transition-all duration-200 ${
                      isActive ? "text-primary" : "text-foreground hover:text-primary"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </a>
                )
              })}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

