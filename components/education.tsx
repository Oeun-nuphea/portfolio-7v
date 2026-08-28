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
    <section id="education" className="scroll-mt-24 py-24 px-6 sm:px-8 border-t border-border">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Credentials
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Education & Training
          </h2>
          <p className="text-sm text-muted-foreground">
            Academic programs and professional training milestones.
          </p>
        </div>

        <div className="divide-y divide-border">
          {education.map((item) => (
            <div
              key={item.degree}
              className="py-6 first:pt-0 last:pb-0 grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-3 sm:gap-8 items-start"
            >
              <div className="space-y-0.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {item.type}
                </p>
                <p className="text-xs text-muted-foreground">{item.period}</p>
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-semibold text-foreground leading-snug">
                  {item.degree}
                </h3>
                <p className="text-sm text-muted-foreground">{item.school}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
