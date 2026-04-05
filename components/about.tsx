const buildAreas = [
  {
    title: "Event-driven microservices",
    description:
      "Decoupled services with RabbitMQ pub/sub, dead-letter queues, and isolated databases per service.",
    label: "Reliable message flows",
    gradient: "bg-gradient-to-br from-sky-500/14 via-sky-500/4 to-transparent",
    accent: "bg-sky-500",
  },
  {
    title: "High-performance APIs",
    description:
      "REST APIs with Node.js, Express, TypeScript, Redis caching, and clean architecture.",
    label: "Throughput with clarity",
    gradient: "bg-gradient-to-br from-blue-700/12 via-blue-700/4 to-transparent",
    accent: "bg-blue-700",
  },
  {
    title: "Modern frontend UIs",
    description:
      "Responsive applications in Vue 3 and React, including browser experiences built with the Canvas API.",
    label: "Interfaces that stay fast",
    gradient: "bg-gradient-to-br from-emerald-500/14 via-emerald-500/4 to-transparent",
    accent: "bg-emerald-500",
  },
  {
    title: "CI/CD and DevOps",
    description:
      "GitHub Actions pipelines, Docker-based environments, and PR-gated delivery workflows.",
    label: "Always deployable",
    gradient: "bg-gradient-to-br from-orange-500/14 via-orange-500/4 to-transparent",
    accent: "bg-orange-500",
  },
]

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-primary/75">
            What I Build
          </p>
          <h2 className="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Systems designed to scale cleanly and hold up under production pressure.
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            The focus is reliable backend architecture, responsive frontend delivery,
            and engineering workflows that stay maintainable as products grow.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {buildAreas.map((area, index) => (
            <article
              key={area.title}
              className={`rounded-[2rem] border border-border/70 p-8 shadow-sm ${area.gradient}`}
            >
              <div className="mb-6 flex items-center justify-between">
                <span className={`h-3 w-3 rounded-full ${area.accent}`} />
                <span className="text-sm font-medium text-muted-foreground">0{index + 1}</span>
              </div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-muted-foreground">
                {area.label}
              </p>
              <h3 className="mb-3 text-2xl font-semibold text-foreground">{area.title}</h3>
              <p className="text-base leading-relaxed text-muted-foreground">{area.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
