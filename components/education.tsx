import { Award } from "lucide-react"

interface EducationItem {
  type: string
  degree: string
  school: string
  period: string
}

interface AchievementItem {
  title: string
  issuer: string
  description: string
}

const education: EducationItem[] = [
  {
    type: "Academic Degree",
    degree: "Bachelor of Computer Science",
    school: "Faculty of Science, Royal University of Phnom Penh (RUPP)",
    period: "2022 – 2026 (Year 4)",
  },
  {
    type: "Professional Training",
    degree: "Web Development",
    school: "ANT Training Center",
    period: "2025 – Present",
  },
  {
    type: "Scholarship Program",
    degree: "Samsung Python Program",
    school: "Royal University of Phnom Penh (RUPP)",
    period: "2024 – 2025",
  },
  {
    type: "Secondary Education",
    degree: "High School Diploma",
    school: "Phnom Srouch High School",
    period: "2016 – 2022",
  },
]

const achievements: AchievementItem[] = [
  {
    title: "Government-Sponsored Web Development Scholarship",
    issuer: "ANT Training Center",
    description: "Awarded a competitive government scholarship for professional web development.",
  },
  {
    title: "Python Programming Scholarship",
    issuer: "Royal University of Phnom Penh (RUPP)",
    description: "Selected for scholarship-funded intensive Python programming course.",
  },
  {
    title: "Cambodian National Exam (Bac II)",
    issuer: "Ministry of Education, Youth and Sport",
    description: "Successfully graduated and passed the national high school baccalaureate exam.",
  },
]

export default function Education() {
  return (
    <section id="education" className="scroll-mt-20 sm:scroll-mt-24 py-8 sm:py-10 lg:py-12 px-6 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Credentials
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Education & Training
          </h2>
          <p className="text-sm text-muted-foreground">
            Academic background, specialized training programs, and recognitions.
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

        {/* Achievements & Honors */}
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Achievements & Honors
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {achievements.map((item) => (
              <div
                key={item.title}
                className="glass-panel p-6 rounded-3xl space-y-3 hover:bg-white/80 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/80 border border-white text-foreground shadow-sm">
                    <Award size={18} />
                  </div>
                  <h4 className="text-sm font-bold text-foreground leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs font-semibold text-muted-foreground">
                    {item.issuer}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
