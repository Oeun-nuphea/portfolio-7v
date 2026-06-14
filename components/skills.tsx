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
    category: "Observability & Diagnostics",
    skills: ["Grafana", "Prometheus", "Sentry"],
  },
]

const explorations = [
  {
    title: "Distributed Tracing & APM Systems",
    progress: 75,
  },
  {
    title: "System Design for High Scale",
    progress: 60,
  },
]

export default function Skills() {
  return (
    <section id="principles" className="scroll-mt-24 py-24 px-6 sm:px-8">
      <div className="mx-auto max-w-7xl space-y-20">
        {/* Core Principles */}
        <div className="space-y-12">
          <div className="space-y-3 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              My Philosophy
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Engineering Principles
            </h2>
            <p className="text-base text-muted-foreground">
              Design paradigms I practice to build clear, resilient, and extensible systems.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map((principle) => (
              <div
                key={principle.title}
                className="pt-6 border-t border-border/60 space-y-2"
              >
                <h3 className="text-lg font-bold text-foreground">{principle.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{principle.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech Stack & Explorations */}
        <div id="stack" className="scroll-mt-24 grid gap-16 lg:grid-cols-[1.2fr_0.8fr] pt-12 border-t border-border/40">
          {/* Tech Stack */}
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Toolkit
              </p>
              <h3 className="text-2xl font-bold text-foreground">
                Technologies & Tools
              </h3>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {stackGroups.map((group) => (
                <div key={group.category} className="space-y-3 p-5 rounded-2xl border border-border bg-card/40">
                  <h4 className="text-sm font-bold text-foreground tracking-wide">{group.category}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold text-foreground/80"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Currently Exploring */}
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Professional Growth
              </p>
              <h3 className="text-2xl font-bold text-foreground">
                Active Learning Areas
              </h3>
            </div>

            <div className="space-y-6">
              {explorations.map((item) => (
                <div key={item.title} className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-bold text-foreground">{item.title}</p>
                    <span className="text-xs font-bold text-primary">{item.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-1000"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
