"use client"

import type React from "react"

import { Github, Globe, Linkedin, Mail } from "lucide-react"
import { useState } from "react"

const contactLinks = [
  {
    label: "Email",
    value: "nupheaoeun@gmail.com",
    href: "mailto:nupheaoeun@gmail.com",
    icon: Mail,
    external: false,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/ouen-nuphea",
    href: "https://www.linkedin.com/in/ouen-nuphea/",
    icon: Linkedin,
    external: true,
  },
  {
    label: "GitHub",
    value: "github.com/nuphea",
    href: "https://github.com/nuphea",
    icon: Github,
    external: true,
  },
  {
    label: "Portfolio",
    value: "portfolio-oeun-nuphea.vercel.app",
    href: "https://portfolio-oeun-nuphea.vercel.app/",
    icon: Globe,
    external: true,
  },
]

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const subject = `Portfolio inquiry from ${formData.name}`
    const body = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      "",
      formData.message,
    ].join("\n")

    window.location.href = `mailto:nupheaoeun@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    setSubmitted(true)
    setFormData({ name: "", email: "", message: "" })
    setTimeout(() => setSubmitted(false), 4000)
  }

  return (
    <section id="contact" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-primary/75">
            Get In Touch
          </p>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Open to conversations about backend, platform, and frontend work.
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Email is the fastest route for project or role discussions. LinkedIn,
            GitHub, and the live portfolio are here as well.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            {contactLinks.map((link) => {
              const Icon = link.icon

              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className="flex items-center justify-between rounded-[1.5rem] border border-border/70 bg-card/85 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        {link.label}
                      </p>
                      <p className="text-base font-medium text-foreground">{link.value}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-primary">Open</span>
                </a>
              )
            })}

            <div className="rounded-[1.75rem] border border-border/70 bg-card/85 p-6 shadow-sm">
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-primary/75">
                Preferred Contact
              </p>
              <p className="leading-relaxed text-muted-foreground">
                Use email for direct project discussions and LinkedIn for broader
                networking. The form on the right opens a prefilled email draft.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border border-border/70 bg-card/85 p-8 shadow-sm">
            <h3 className="mb-3 text-2xl font-bold text-foreground">Start a Conversation</h3>
            <p className="mb-8 max-w-2xl leading-relaxed text-muted-foreground">
              Share a quick summary of the work, role, or collaboration you have in mind.
              Submitting this form opens an email draft with the details filled in.
            </p>

            {submitted ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <span className="text-2xl">✓</span>
                </div>
                <h4 className="text-xl font-semibold text-foreground">Email draft opened</h4>
                <p className="text-muted-foreground">
                  If a mail client is available, your message is ready to send.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your message..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 font-semibold text-white transition hover:brightness-110"
                >
                  Open Email Draft
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
