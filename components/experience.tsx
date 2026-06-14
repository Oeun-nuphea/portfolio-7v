const experiences = [
  {
    title: "Backend Developer",
    company: "LTNG Properties",
    period: "Jan 2026 – Present",
    achievements: [
      "Architected database schemas and streamlined API routing structures for core application features.",
      "Maintained microservice boundaries and optimized backend services to support high-throughput operations.",
      "Automated testing flows and continuous integration pipelines to guarantee service reliability.",
    ],
    tech: ["Express.js", "TypeScript", "MongoDB", "Docker", "GitLab CI/CD"],
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
            Professional Experience
          </h2>
        </div>

        <div className="space-y-12">
          {experiences.map((exp) => (
            <article
              key={exp.title}
              className="relative rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6 transition-all duration-300 hover:border-primary/20 hover:shadow-md"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-foreground">{exp.title}</h3>
                  <p className="text-sm font-semibold text-primary">{exp.company}</p>
                </div>
                <span className="inline-block rounded-lg bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground/80 sm:mt-1 self-start">
                  {exp.period}
                </span>
              </div>

              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  Key Achievements
                </p>
                <ul className="space-y-2.5">
                  {exp.achievements.map((achievement) => (
                    <li key={achievement} className="flex items-start gap-2.5 text-sm text-muted-foreground leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-border/40 space-y-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  Technologies Utilized
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {exp.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-foreground/80"
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

