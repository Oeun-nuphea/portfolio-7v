const buildAreas = [
  {
    title: "Event-Driven Microservices",
    description:
      "Designing decoupled, fault-tolerant services utilizing message queues (RabbitMQ), dead-letter routing, and isolated datastores.",
    label: "Distributed Architecture",
  },
  {
    title: "High-Performance APIs",
    description:
      "Developing low-latency RESTful APIs using Node.js, Express, and TypeScript, backed by Redis caching and clean code principles.",
    label: "Services & API Design",
  },
  {
    title: "Modern Frontend Platforms",
    description:
      "Building responsive interfaces in React and Vue 3, ensuring fast rendering, intuitive UX, and clean state management.",
    label: "Frontend Systems",
  },
  {
    title: "CI/CD & Continuous Delivery",
    description:
      "Automating integration pipelines with GitHub Actions, containerizing environments with Docker, and hosting securely in AWS.",
    label: "DevOps & Infrastructure",
  },
]

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 py-24 px-6 sm:px-8 bg-muted/10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] items-start">
          {/* Left Side: Bio */}
          <div className="space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              Who I Am
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              About Me
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                I am a passionate Backend Engineer dedicated to building stable, performance-oriented backend platforms. I enjoy translating complex business logic into clean, reusable service code and decoupled microservice event flows.
              </p>
              <p>
                With continuous learning at my core, I keep myself up to date with modern system design paradigms, caching patterns, and automated CI/CD practices. I value clear communication, observability, and clean API design.
              </p>
            </div>
          </div>

          {/* Right Side: Areas of Expertise Grid */}
          <div className="space-y-8">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                Technical Focus
              </p>
              <h3 className="text-2xl font-bold text-foreground">
                Areas of Expertise
              </h3>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {buildAreas.map((area, index) => (
                <div
                  key={area.title}
                  className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary/5 px-2 py-1 rounded">
                      {area.label}
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground/50">
                      0{index + 1}
                    </span>
                  </div>
                  <h4 className="mb-2 text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                    {area.title}
                  </h4>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {area.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

