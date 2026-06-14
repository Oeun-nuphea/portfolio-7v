const education = [
  {
    type: "Academic Degree",
    degree: "Bachelor of Science in Information Technology",
    school: "Royal University of Phnom Penh",
    period: "Expected 2026",
  },
  {
    type: "Professional Training",
    degree: "Full-Stack Web Development Program",
    school: "ANT Training Center",
    period: "Expected Jul 2026",
  },
  {
    type: "Coursework",
    degree: "Python Programming & System Scripting",
    school: "Royal University of Phnom Penh",
    period: "2024 – 2025",
  },
]

export default function Education() {
  return (
    <section id="education" className="scroll-mt-24 py-24 px-6 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 space-y-3 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Credentials
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Education & Training
          </h2>
          <p className="text-base text-muted-foreground">
            Academic programs and professional training milestones.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {education.map((item) => (
            <article
              key={item.degree}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-md"
            >
              <div className="space-y-4">
                <span className="inline-block rounded-lg bg-primary/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
                  {item.type}
                </span>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {item.degree}
                  </h3>
                  <p className="text-sm font-semibold text-foreground/80">{item.school}</p>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-border/40 flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">{item.period}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

