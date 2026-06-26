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
    <section id="experience" className="scroll-mt-24 py-24 px-6 sm:px-8 bg-muted/10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 space-y-3 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Career History
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Experience
          </h2>
        </div>

        <div className="relative border-l border-border/80 ml-3 pl-8 space-y-12">
          {experiences.map((exp) => (
            <article key={exp.title} className="relative space-y-5">
              {/* Timeline Bullet Node */}
              <div className="absolute -left-[41px] top-1.5 flex h-5 w-5 items-center justify-center rounded-full border-4 border-background bg-primary shadow-sm" />

              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground leading-snug">{exp.title}</h3>
                  <p className="text-sm font-bold text-primary">{exp.company}</p>
                </div>
                <span className="inline-block text-xs font-bold text-muted-foreground sm:mt-0">
                  {exp.period}
                </span>
              </div>

              <div className="space-y-2.5">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  Key Achievements
                </p>
                <ul className="space-y-2">
                  {exp.achievements.map((achievement) => (
                    <li key={achievement} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2 pt-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  Technologies Utilized
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {exp.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-foreground/80"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

