const education = [
  {
    type: "Academic Degree",
    degree: "Bachelor of Science in Information Technology",
    school: "Royal University of Phnom Penh",
    period: "Graduated 2026",
  },
  {
    type: "Professional Training",
    degree: "Full-Stack Web Development Program",
    school: "ANT Training Center",
    period: "Graduated Jul 2026",
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
    <section id="education" className="scroll-mt-24 py-24 px-6 sm:px-8 bg-muted/40">
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

        <div className="divide-y divide-border/60">
          {education.map((item) => (
            <div
              key={item.degree}
              className="py-6 first:pt-0 last:pb-0 grid grid-cols-1 sm:grid-cols-[1fr_2.5fr] gap-4 sm:gap-6 items-start"
            >
              <div className="space-y-1.5">
                <span className="inline-block rounded-lg bg-primary/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                  {item.type}
                </span>
                <p className="text-sm font-bold text-muted-foreground">{item.period}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-foreground leading-snug">
                  {item.degree}
                </h3>
                <p className="text-sm font-semibold text-foreground/70">{item.school}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

