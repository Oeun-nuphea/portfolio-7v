const stackGroups = [
  {
    category: "Application Frameworks",
    skills: ["TypeScript", "Node.js", "Express", "NestJS", "Go", "Vue 3", "React"],
  },
  {
    category: "Databases & Messaging Broker",
    skills: ["PostgreSQL", "MongoDB", "Redis", "RabbitMQ"],
  },
  {
    category: "Infrastructure & Tools",
    skills: ["Docker", "Kubernetes", "GitHub Actions", "AWS"],
  },
  {
    category: "Observability",
    skills: ["Grafana", "Prometheus", "Sentry"],
  },
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
            Technologies & Tools
          </h2>
          <p className="text-sm text-muted-foreground">
            Languages, frameworks, databases, and DevOps tools I use daily.
          </p>
        </div>

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
      </div>
    </section>
  )
}
