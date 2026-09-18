import type { LucideIcon } from "lucide-react"
import { Github, Globe, Linkedin, Mail, MapPin, Phone } from "lucide-react"

interface ContactLink {
  label: string
  value: string
  href: string
  icon: LucideIcon
  external: boolean
}

const contactLinks: ContactLink[] = [
  {
    label: "Email",
    value: "nupheaoeun@gmail.com",
    href: "mailto:nupheaoeun@gmail.com",
    icon: Mail,
    external: false,
  },
  {
    label: "Phone",
    value: "096 2469031",
    href: "tel:+855962469031",
    icon: Phone,
    external: false,
  },
  {
    label: "Telegram",
    value: "@oeunnuphea",
    href: "https://t.me/oeunnuphea",
    icon: Globe,
    external: true,
  },
  {
    label: "Location",
    value: "Phnom Penh, Cambodia",
    href: "https://maps.google.com/?q=Phnom+Penh,+Cambodia",
    icon: MapPin,
    external: true,
  },
  {
    label: "LinkedIn",
    value: "Oeun Nuphea",
    href: "https://www.linkedin.com/in/ouen-nuphea/",
    icon: Linkedin,
    external: true,
  },
  {
    label: "GitHub",
    value: "github.com/Oeun-nuphea",
    href: "https://github.com/Oeun-nuphea",
    icon: Github,
    external: true,
  },
]

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 sm:scroll-mt-24 py-8 sm:py-10 lg:py-12 px-6 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 sm:mb-12 space-y-2 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Connect
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Get In Touch
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Whether you want to discuss system design, a job opportunity, or just chat about backend architectures — feel free to reach out.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 max-w-2xl">
          {contactLinks.map((link) => {
            const Icon = link.icon

            return (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                className="glass-panel group flex items-center gap-4 rounded-2xl p-4 transition-all duration-300 hover:bg-white/85 hover:shadow-lg"
              >
                <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-xl bg-white/80 border border-white text-muted-foreground group-hover:text-foreground shadow-sm transition-all duration-200">
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {link.label}
                  </p>
                  <p className="truncate text-sm font-semibold text-foreground">
                    {link.value}
                  </p>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
