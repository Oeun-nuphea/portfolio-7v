const education = [
  {
    type: "Academic",
    degree: "Bachelor of Science in Information Technology",
    school: "Royal University of Phnom Penh",
    period: "Expected 2026",
    details: [],
  },
  {
    type: "Professional Training",
    degree: "Full-Stack Web Development",
    school: "ANT Training Center",
    period: "Expected Jul 2026",
    details: [],
  },
  {
    type: "Coursework",
    degree: "Python Programming",
    school: "Royal University of Phnom Penh",
    period: "2024 – 2025",
    details: [],
  },
]

export default function Education() {
  return (
    <section id="education" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-primary/75">
            Education
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Academic & professional training.
          </h2>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          {education.map((item) => (
            <article key={item.degree} className="space-y-2">
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
