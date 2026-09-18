import Projects from "@/components/projects"

const experiences = [
  {
    title: "Backend Developer",
    company: "LTNG Business",
    period: "2026 – Present",
    achievements: [
      "Working on core backend architecture, service integration, and RESTful APIs.",
      "Built a real-time chat application featuring an integrated business chat widget powered by WebSockets.",
      "Engineered reliable datastores and caching layers using MongoDB and Redis for high-throughput messaging.",
    ],
    tech: ["Node.js", "ExpressJS", "WebSockets", "MongoDB", "Redis", "Docker", "REST APIs"],
  },
  {
    title: "Freelance Full-Stack Developer",
    company: "Freelance / Client Engagements",
    period: "2026 – Present",
    achievements: [
      "Developing full-stack web applications and custom digital solutions for clients.",
      "Built a specialized law management system tailored for legal professionals, featuring case tracking and document workflows.",
      "Implemented responsive frontend interfaces backed by secure, robust server-side APIs.",
    ],
    tech: ["React.js", "TypeScript", "Node.js", "MySQL", "MongoDB", "Tailwind CSS"],
  },
]

export default function Experience() {
  return (
    <section id="experience" className="scroll-mt-20 sm:scroll-mt-24 py-8 sm:py-10 lg:py-12 px-6 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-10 sm:space-y-16">
        <div>
          <div className="mb-10 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Career History
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Experience
            </h2>
          </div>

          <div className="space-y-6">
            {experiences.map((exp) => (
              <article
                key={exp.title}
                className="glass-panel p-6 sm:p-8 rounded-3xl space-y-4 transition-all duration-300 hover:bg-white/80 hover:shadow-lg"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-foreground">{exp.title}</h3>
                    <p className="text-sm font-medium text-muted-foreground">{exp.company}</p>
                  </div>
                  <span className="glass-pill rounded-full px-3.5 py-1 text-xs font-medium text-muted-foreground sm:shrink-0">
                    {exp.period}
                  </span>
                </div>

                {exp.achievements.length > 0 && (
                  <ul className="space-y-2 pt-2">
                    {exp.achievements.map((achievement) => (
                      <li key={achievement} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500/70 shadow-sm" />
                        <span>{achievement}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {exp.tech.length > 0 && (
                  <div className="pt-2 flex flex-wrap gap-1.5">
                    {exp.tech.map((tech) => (
                      <span
                        key={tech}
                        className="glass-pill rounded-full px-3 py-0.5 text-xs font-medium text-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>

        <Projects />
      </div>
    </section>
  )
}
