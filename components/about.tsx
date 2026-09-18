const buildAreas = [
  {
    title: "REST APIs & Backend Integration",
    description:
      "Developing robust, low-latency RESTful APIs using Node.js, ExpressJS, and NestJS, adhering to clean architecture and modular system design.",
  },
  {
    title: "Real-Time Systems & WebSockets",
    description:
      "Building interactive web platforms and real-time communication services, including live business chat widgets and dynamic event handling.",
  },
  {
    title: "SQL & NoSQL Datastores",
    description:
      "Designing efficient database schemas, query optimization, and caching strategies utilizing MongoDB, MySQL, and Redis.",
  },
  {
    title: "CI/CD & DevOps Automation",
    description:
      "Automating testing and deployment workflows using GitHub Actions, containerizing environments with Docker, and ensuring rapid release cycles.",
  },
]

export default function About() {
  return (
    <section id="about" className="scroll-mt-20 sm:scroll-mt-24 py-8 sm:py-10 lg:py-12 px-6 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] items-start">
          {/* Left Side: Bio */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6">
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
                A Computer Science graduate from RUPP working as a Web Developer, experienced in building responsive web applications with REST APIs and real-time features using WebSockets, and working with both SQL and NoSQL databases.
              </p>
              <p>
                Familiar with CI/CD pipelines, containerized deployment with Docker, and backend system integration. Passionate about writing maintainable code, self-development, and collaborating with cross-functional teams to solve technical challenges.
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

            <div className="space-y-3">
              {buildAreas.map((area, index) => (
                <div
                  key={area.title}
                  className="glass-panel group p-4 sm:p-5 rounded-2xl flex gap-4 items-start transition-all duration-300 hover:bg-white/85 hover:shadow-lg"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/80 border border-white text-xs font-bold text-foreground shadow-sm transition-transform duration-200">
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
