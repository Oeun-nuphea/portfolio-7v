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
  return (
    <section id="contact" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 max-w-xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-primary/75">
            Get In Touch
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Let's work together.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {contactLinks.map((link) => {
            const Icon = link.icon

            return (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                className="flex items-center justify-between rounded-[1.5rem] border border-border/70 bg-card/85 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 overflow-hidden"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="flex shrink-0 h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                      {link.label}
                    </p>
                    <p className="truncate text-base font-medium text-foreground">{link.value}</p>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
