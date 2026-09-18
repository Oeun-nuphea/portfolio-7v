const stackGroups = [
  {
    category: "Backend & APIs",
    skills: ["Node.js", "ExpressJS", "NestJS", "REST APIs", "WebSockets", "Python"],
  },
  {
    category: "Frontend Development",
    skills: ["JavaScript", "TypeScript", "Vue.js", "React.js", "HTML5", "CSS / Tailwind"],
  },
  {
    category: "Databases & Caching",
    skills: ["MongoDB", "MySQL", "Redis"],
  },
  {
    category: "DevOps & Workflow",
    skills: ["GitHub", "Docker", "GitHub Actions (CI/CD)", "Git"],
  },
]

const softSkills = [
  "Self-Development",
  "Teamwork",
  "Time Management",
  "Leadership",
  "Effective Communication",
  "Critical Thinking",
  "Adaptability",
]

const languages = [
  { language: "Khmer", level: "Native" },
  { language: "English", level: "Good" },
]

export default function Skills() {
  return (
    <section id="stack" className="scroll-mt-20 sm:scroll-mt-24 py-8 sm:py-10 lg:py-12 px-6 sm:px-8">
      <div className="mx-auto max-w-5xl space-y-10">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Toolkit
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Technologies & Skills
          </h2>
          <p className="text-sm text-muted-foreground">
            Technical proficiencies, soft skills, and language capabilities.
          </p>
        </div>

        {/* Technical Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stackGroups.map((group) => (
            <div
              key={group.category}
              className="glass-panel p-6 rounded-3xl space-y-4 hover:bg-white/80 transition-all duration-300"
            >
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="glass-pill rounded-full px-3.5 py-1 text-xs font-medium text-foreground transition-all duration-200 hover:bg-white/90 shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Soft Skills & Languages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Soft Skills */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 hover:bg-white/80 transition-all duration-300">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Soft Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {softSkills.map((skill) => (
                <span
                  key={skill}
                  className="glass-pill rounded-full px-3.5 py-1 text-xs font-medium text-foreground transition-all duration-200 hover:bg-white/90 shadow-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div className="glass-panel p-6 rounded-3xl space-y-4 hover:bg-white/80 transition-all duration-300">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Languages
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {languages.map((lang) => (
                <div
                  key={lang.language}
                  className="rounded-2xl border border-white/60 bg-white/40 p-3.5 shadow-sm space-y-0.5"
                >
                  <p className="text-sm font-semibold text-foreground">{lang.language}</p>
                  <p className="text-xs font-medium text-muted-foreground">{lang.level}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
