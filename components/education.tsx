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
    <section id="education" className="scroll-mt-24 py-24 px-6 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="space-y-2">
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

        <div className="space-y-4">
          {education.map((item) => (
            <div
              key={item.degree}
              className="glass-panel p-6 sm:p-7 rounded-3xl grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-4 sm:gap-8 items-start transition-all duration-300 hover:bg-white/80 hover:shadow-lg"
            >
              <div className="space-y-1">
                <span className="glass-pill inline-block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-2.5 py-0.5 rounded-full">
                  {item.type}
                </span>
                <p className="text-xs text-muted-foreground">{item.period}</p>
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-foreground leading-snug">
                  {item.degree}
                </h3>
                <p className="text-sm font-medium text-muted-foreground">{item.school}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
