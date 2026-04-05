const principles = [
  {
    title: "Separation of concerns",
    description: "Clean, modular architecture that keeps responsibilities explicit.",
  },
  {
    title: "Event-driven design",
    description: "Loosely coupled systems built around asynchronous communication.",
  },
  {
    title: "Service isolation",
    description: "Independent deployability and clear ownership boundaries per service.",
  },
  {
    title: "Performance-first",
    description: "Optimize the layers that matter most to users and operators.",
  },
  {
    title: "Fault tolerance",
    description: "Design for failure with recoverability and resilience in mind.",
  },
  {
    title: "Always deployable",
    description: "Continuous delivery mindset backed by disciplined release workflows.",
  },
]

const stackGroups = [
  {
    category: "Application",
    skills: ["TypeScript", "Node.js", "Vue 3", "React", "Express"],
  },
  {
    category: "Data and Messaging",
    skills: ["PostgreSQL", "MongoDB", "Redis", "RabbitMQ"],
  },
  {
    category: "Delivery and Cloud",
    skills: ["Docker", "GitHub Actions", "AWS"],
  },
  {
    category: "Observability",
    skills: ["Grafana", "Prometheus"],
  },
]

const explorations = [
  {
    title: "Advanced system design and resilience patterns",
    progress: 75,
  },
  {
    title: "Distributed tracing and observability",
    progress: 55,
  },
  {
    title: "Kubernetes and container orchestration",
    progress: 40,
  },
]

export default function Skills() {
  return (
    <section id="principles" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-16">
        <div>
          <div className="mb-10 max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-primary/75">
              Engineering Principles
            </p>
            <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Architecture choices guided by clarity, resilience, and change over time.
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              The goal is not complexity for its own sake. It is systems that can
              grow without losing reliability, ownership, or deployment confidence.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {principles.map((principle) => (
              <article
                key={principle.title}
                className="rounded-[1.75rem] border border-border/70 bg-card/80 p-6 shadow-sm"
              >
                <h3 className="mb-3 text-xl font-semibold text-foreground">{principle.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{principle.description}</p>
              </article>
            ))}
          </div>
        </div>

        <div id="stack" className="scroll-mt-24 grid gap-6 lg:grid-cols-[1.35fr_0.85fr]">
          <div className="rounded-[2rem] border border-border/70 bg-card/80 p-8 shadow-sm">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-primary/75">
              Tech Stack
            </p>
            <h3 className="mb-6 text-3xl font-bold tracking-tight text-foreground">
              Tools used across services, interfaces, and delivery pipelines.
            </h3>

            <div className="grid gap-6 md:grid-cols-2">
              {stackGroups.map((group) => (
                <div key={group.category} className="rounded-2xl border border-border/70 bg-background/70 p-5">
                  <h4 className="mb-4 text-lg font-semibold text-foreground">{group.category}</h4>
                  <div className="flex flex-wrap gap-2">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-border/70 bg-card px-3 py-1 text-sm font-medium text-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border/70 bg-card/80 p-8 shadow-sm">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-primary/75">
              Currently Exploring
            </p>
            <h3 className="mb-6 text-3xl font-bold tracking-tight text-foreground">
              Depth areas getting the most attention right now.
            </h3>

            <div className="space-y-6">
              {explorations.map((item) => (
                <div key={item.title}>
                  <div className="mb-2 flex items-center justify-between gap-4">
                    <p className="text-sm font-medium leading-relaxed text-foreground">{item.title}</p>
                    <span className="text-sm font-semibold text-primary">{item.progress}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
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
