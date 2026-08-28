const principles = [
  {
    title: "Separation of Concerns",
    description: "Structuring applications into modular components with singular, well-defined responsibilities.",
  },
  {
    title: "Event-Driven Design",
    description: "Leveraging decoupled message pub/sub patterns to support scalable, asynchronous workflows.",
  },
  {
    title: "Service Isolation",
    description: "Maintaining clear boundaries to ensure services can be built, tested, and deployed independently.",
  },
  {
    title: "Performance & Caching",
    description: "Optimizing code execution and caching at appropriate layers to ensure responsive user experiences.",
  },
  {
    title: "Fault Tolerance",
    description: "Developing resilient structures capable of self-healing, retry handling, and graceful degradation.",
  },
  {
    title: "Continuous Deployment",
    description: "Automating validation and integration pipelines to maintain a constant state of release readiness.",
  },
]

const stackGroups = [
  {
    category: "Application Frameworks",
    skills: ["TypeScript", "Node.js", "Express", "Go", "Vue 3", "React"],
  },
  {
    category: "Databases & Messaging",
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
    <section id="principles" className="scroll-mt-24 py-24 px-6 sm:px-8 border-t border-border">
      <div className="mx-auto max-w-5xl space-y-20">
        {/* Core Principles */}
        <div className="space-y-12">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              My Philosophy
            </p>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Engineering Principles
            </h2>
            <p className="text-sm text-muted-foreground">
              Design paradigms I practice to build clear, resilient, and extensible systems.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((principle) => (
              <div
                key={principle.title}
                className="pt-6 border-t border-border space-y-2"
              >
                <h3 className="text-sm font-semibold text-foreground">{principle.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack */}
        <div id="stack" className="scroll-mt-24 space-y-8 pt-12 border-t border-border">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Toolkit
            </p>
            <h3 className="text-2xl font-bold text-foreground">
              Technologies & Tools
            </h3>
          </div>

          <div className="space-y-4 divide-y divide-border">
            {stackGroups.map((group) => (
              <div key={group.category} className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-3 pt-4 first:pt-0 items-start">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground pt-0.5">{group.category}</h4>
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
      </div>
    </section>
  )
}
