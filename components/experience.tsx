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
    <section id="experience" className="scroll-mt-24 py-24 px-6 sm:px-8 border-t border-border">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Career History
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Experience
          </h2>
        </div>

        <div className="relative border-l border-border ml-3 pl-8 space-y-10">
          {experiences.map((exp) => (
            <article key={exp.title} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-[37px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-foreground" />

              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <h3 className="text-base font-semibold text-foreground">{exp.title}</h3>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                </div>
                <span className="text-xs text-muted-foreground sm:shrink-0">
                  {exp.period}
                </span>
              </div>

              {exp.achievements.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {exp.achievements.map((achievement) => (
                    <li key={achievement} className="flex items-start gap-2 text-sm text-muted-foreground leading-relaxed">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" />
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              )}

              {exp.tech.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {exp.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground"
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
    </section>
  )
}
