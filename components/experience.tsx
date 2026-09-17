import Projects from "@/components/projects"

const experiences = [
  {
    title: "Backend Developer",
    company: "LTNG Properties",
    period: "Jan 2026 – Present",
    achievements: [
      // "Architected database schemas and streamlined API routing structures for core application features.",
      // "Maintained microservice boundaries and optimized backend services to support high-throughput operations.",
      // "Automated testing flows and continuous integration pipelines to guarantee service reliability.",
    ],
    tech: [
      // "Express.js", "TypeScript", "MongoDB", "Docker", "GitLab CI/CD"
    ],
  },
]

export default function Experience() {
  return (
    <section id="experience" className="scroll-mt-24 py-24 px-6 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-16">
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
