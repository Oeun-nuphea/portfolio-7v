"use client"

import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

const navItems = [
  { label: "About", href: "#about" },
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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4 lg:px-8">
        <a href="#top" className="flex flex-col">
          <span className="text-sm font-semibold text-foreground">Nuphea</span>
          <span className="text-xs text-muted-foreground">Backend Engineer</span>
        </a>

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
          className="inline-flex h-8 w-8 items-center justify-center rounded text-muted-foreground hover:text-foreground lg:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {isOpen && (
          <div className="absolute inset-x-0 top-full border-b border-border bg-background lg:hidden">
            <div className="mx-auto flex max-w-5xl flex-col gap-5 px-6 py-5 lg:px-8">
              {navItems.map((item) => {
                const isActive = activeSection === item.href.substring(1)
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className={`text-sm transition-colors duration-200 ${
                      isActive ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
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
