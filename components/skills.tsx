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
    <section id="stack" className="scroll-mt-24 py-24 px-6 sm:px-8 border-t border-border">
      <div className="mx-auto max-w-5xl space-y-8">
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

        <div className="space-y-4 divide-y divide-border">
          {stackGroups.map((group) => (
            <div key={group.category} className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-3 pt-4 first:pt-0 items-start">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground pt-0.5">{group.category}</h3>
              <div className="flex flex-wrap gap-1.5">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded border border-border px-2.5 py-1 text-xs font-medium text-foreground"
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
