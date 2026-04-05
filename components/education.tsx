const education = [
  {
    type: "Academic",
    degree: "Bachelor of Science in Information Technology",
    school: "Royal University of Phnom Penh",
    period: "Expected Graduation 2026",
    details: [],
  },
  {
    type: "Professional Training",
    degree: "Full-Stack Web Development",
    school: "ANT Training Center",
    period: "Expected Completion Jul 2026",
    details: [
      "Comprehensive training in modern web development",
      "Hands-on projects and real-world application work",
    ],
  },
  {
    type: "Coursework",
    degree: "Python Programming",
    school: "Royal University of Phnom Penh",
    period: "2024 - 2025",
    details: [
      "Built fundamentals in Python and core programming concepts",
      "Applied Python in practical exercises and coursework",
    ],
  },
]

export default function Education() {
  return (
    <section id="education" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-primary/75">
            Education
          </p>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Academic foundations paired with hands-on technical training.
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Formal study and targeted training continue to support the production-focused
            work across backend systems, frontend delivery, and software design.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {education.map((item) => (
            <article key={item.degree} className="rounded-[2rem] border border-border/70 bg-card/85 p-8 shadow-sm">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.24em] text-primary/75">
                {item.type}
              </p>
              <h3 className="mb-3 text-2xl font-bold text-foreground">{item.degree}</h3>
              <p className="mb-1 text-lg font-semibold text-primary">{item.school}</p>
              <p className="mb-5 text-sm font-medium text-muted-foreground">{item.period}</p>

              {item.details.length > 0 && (
                <ul className="space-y-3">
                  {item.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-3 text-muted-foreground">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
