import { Github, Globe, Linkedin, Mail } from "lucide-react"

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
    value: "Oeun Nuphea",
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
    label: "Telegram",
    value: "Oeun Nuphea",
    href: "https://t.me/oeunnuphea",
    icon: Globe,
    external: true,
  },
]

export default function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 py-24 px-6 sm:px-8 border-t border-border">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 space-y-2 max-w-xl">
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-2xl">
          {contactLinks.map((link) => {
            const Icon = link.icon

            return (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                className="group flex items-center gap-3.5 rounded-xl border border-border p-4 transition-colors duration-200 hover:border-foreground/20 hover:bg-muted/40"
              >
                <div className="flex shrink-0 h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground group-hover:text-foreground transition-colors duration-200">
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {link.label}
                  </p>
                  <p className="truncate text-sm font-medium text-foreground">
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
