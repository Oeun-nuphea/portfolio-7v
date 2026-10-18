"use client"

import { motion } from "framer-motion"

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
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-2"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Toolkit
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Technologies & Skills
          </h2>
          <p className="text-sm text-muted-foreground">
            Technical proficiencies, soft skills, and language capabilities.
          </p>
        </motion.div>

        {/* Technical Skills Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {stackGroups.map((group) => (
            <motion.div
              key={group.category}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.04 },
                },
              }}
              className="glass-panel p-6 rounded-3xl space-y-4 hover:bg-white/80 transition-colors duration-300"
            >
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    variants={{
                      hidden: { opacity: 0, y: 8 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                      },
                    }}
                    className="glass-pill rounded-full px-3.5 py-1 text-xs font-medium text-foreground transition-colors duration-200 hover:bg-white/90 shadow-sm"
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Soft Skills & Languages Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.12 },
            },
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Soft Skills */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1], staggerChildren: 0.04 },
              },
            }}
            className="glass-panel p-6 rounded-3xl space-y-4 hover:bg-white/80 transition-colors duration-300"
          >
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Soft Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {softSkills.map((skill) => (
                <motion.span
                  key={skill}
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                    },
                  }}
                  className="glass-pill rounded-full px-3.5 py-1 text-xs font-medium text-foreground transition-colors duration-200 hover:bg-white/90 shadow-sm"
                >
                  {skill}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Languages */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
              },
            }}
            className="glass-panel p-6 rounded-3xl space-y-4 hover:bg-white/80 transition-colors duration-300"
          >
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Languages
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {languages.map((lang) => (
                <div
                  key={lang.language}
                  className="rounded-2xl border border-white/60 bg-white/40 p-3.5 shadow-sm space-y-0.5 transition-colors hover:bg-white/70"
                >
                  <p className="text-sm font-semibold text-foreground">{lang.language}</p>
                  <p className="text-xs font-medium text-muted-foreground">{lang.level}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

