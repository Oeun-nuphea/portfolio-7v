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
    <section id="contact" className="scroll-mt-24 py-24 px-6 sm:px-8 bg-muted/10">
      <div className="mx-auto max-w-4xl text-center space-y-12">
        <div className="space-y-4 max-w-xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Connect
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Get In Touch
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed">
            Whether you want to discuss system design, a job opportunity, or just chat about backend architectures—feel free to reach out.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-2xl mx-auto">
          {contactLinks.map((link) => {
            const Icon = link.icon

            return (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noreferrer" : undefined}
                className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md "
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex shrink-0 h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Icon size={18} />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {link.label}
                    </p>
                    <p className="truncate text-sm font-semibold text-foreground">
                      {link.value}
                    </p>
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

