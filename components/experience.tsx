const experiences = [
  {
    title: "Backend Developer",
    company: "LTNG Properties",
    period: "Jan 2026 - Present",
    description:
      "Building APIs and data models for the LTNG Properties platform with an emphasis on maintainability, performance, and production-ready backend flows.",
    achievements: [
      "Designed backend API flows and database structures to support core product features.",
      "Improved maintainability by keeping service responsibilities and data access patterns clear.",
      "Worked with the team on scalable backend delivery and everyday production concerns.",
    ],
    tech: ["Express.js", "TypeScript", "MongoDB", "Database Design", "API Design", "Docker", "GitLab"],
  },
]

export default function Experience() {
  return (
    <section id="experience" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-primary/75">
            Experience
          </p>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Professional work focused on backend delivery and service design.
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Hands-on experience so far has centered on API development, database
            design, and keeping implementation practical for real product teams.
          </p>
        </div>

        <div className="space-y-8">
          {experiences.map((exp) => (
            <article key={exp.title} className="rounded-[2rem] border border-border/70 bg-card/85 p-8 shadow-sm">
              <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-foreground">{exp.title}</h3>
                  <p className="text-lg font-semibold text-primary">{exp.company}</p>
                </div>
                <p className="text-sm font-medium text-muted-foreground">{exp.period}</p>
              </div>

              <p className="mb-6 max-w-3xl leading-relaxed text-muted-foreground">{exp.description}</p>

              <div className="mb-6">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-foreground/80">
                  Key Contributions
                </p>
                <ul className="space-y-3">
                  {exp.achievements.map((achievement) => (
                    <li key={achievement} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-foreground/80">
                  Technologies
                </p>
                <div className="flex flex-wrap gap-2">
                  {exp.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-border/70 bg-background px-3 py-1 text-sm font-medium text-foreground"
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
