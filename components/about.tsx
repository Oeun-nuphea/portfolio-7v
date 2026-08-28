const buildAreas = [
  {
    title: "Event-Driven Microservices",
    description:
      "Designing decoupled, fault-tolerant services utilizing message queues (RabbitMQ), dead-letter routing, and isolated datastores.",
  },
  {
    title: "High-Performance APIs",
    description:
      "Developing low-latency RESTful APIs using Node.js, Express, and TypeScript, backed by Redis caching and clean code principles.",
  },
  {
    title: "Modern Frontend Platforms",
    description:
      "Building responsive interfaces in React and Vue 3, ensuring fast rendering, intuitive UX, and clean state management.",
  },
  {
    title: "CI/CD & Continuous Delivery",
    description:
      "Automating integration pipelines with GitHub Actions, containerizing environments with Docker, and hosting securely in AWS.",
  },
]

export default function About() {
  return (
    <section id="about" className="scroll-mt-24 py-24 px-6 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] items-start">
          {/* Left Side: Bio */}
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Who I Am
              </p>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                About Me
              </h2>
            </div>
            <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
              <p>
                I am a passionate Backend Engineer and Freelancer dedicated to building stable, performance-oriented backend platforms. I enjoy translating complex business logic into clean, reusable service code and decoupled microservice event flows.
              </p>
              <p>
                With continuous learning at my core, I keep myself up to date with modern system design paradigms, caching patterns, and automated CI/CD practices. I value clear communication, observability, and clean API design.
              </p>
            </div>
          </div>

          {/* Right Side: Areas of Expertise */}
          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Technical Focus
              </p>
              <h3 className="text-2xl font-bold text-foreground">
                Areas of Expertise
              </h3>
            </div>

            <div className="divide-y divide-border">
              {buildAreas.map((area, index) => (
                <div
                  key={area.title}
                  className="group py-5 first:pt-0 last:pb-0 flex gap-5 items-start"
                >
                  <span className="text-2xl font-bold tabular-nums text-border group-hover:text-muted-foreground transition-colors duration-200 select-none">
                    0{index + 1}
                  </span>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold text-foreground">
                      {area.title}
                    </h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {area.description}
                    </p>
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
