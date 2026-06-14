import Image from "next/image"

const projects = [
  {
    title: "Spendwise",
    category: "Mobile finance app",
    description:
      "Mobile wallet experience with authentication, real-time chat, and a production-ready backend stack.",
    technologies: ["Flutter", "TypeScript", "Express", "MongoDB", "Redis", "Docker", "AWS", "WebRTC"],
    highlights: [
      "Real-time chat with WebSocket and voice/video via WebRTC",
      "Live transaction and wallet flows with mobile-first UX",
      "Admin dashboard and Dockerized team setup",
    ],
    codeUrl: "https://github.com/orgs/free-social/repositories",
  },
  {
    title: "Notion-Inspired Workspace",
    category: "Event-driven platform",
    image: "/notion.png",
    description:
      "Collaborative note platform shaped around RabbitMQ-powered services, TypeScript APIs, and a containerized development workflow.",
    technologies: ["ReactJS", "Express", "TypeScript", "PostgreSQL", "Docker", "RabbitMQ"],
    highlights: [
      "Flexible note hierarchy and workspace organization",
      "Service-to-service communication with event-driven architecture",
      "Containerized local environment for consistent development",
    ],
    codeUrl: "https://github.com/Learning-and-Exploring/note-rabbitmq",
  },
  {
    title: "E-Shop",
    category: "Full-stack commerce",
    description:
      "End-to-end e-commerce platform with product management, cart flows, and secure auth.",
    technologies: ["Vue", "Node.js", "MongoDB", "Tailwind CSS", "Vercel"],
    highlights: [
      "Product browsing, cart, checkout, and order tracking",
      "User authentication and account management",
    ],
    codeUrl: "https://github.com/orgs/e-commerce-fullstack/repositories",
    demoUrl: "https://e-smart-shop.vercel.app/",
  },
  {
    title: "Blog Dashboard",
    category: "Frontend dashboard",
    // image: "/blog.png",
    description:
      "Responsive dashboard interface for managing blog content, categories, and user-facing navigation across screen sizes.",
    technologies: ["HTML", "CSS", "JavaScript"],
    highlights: [
      "Post, category, and tag presentation",
      "Responsive layout across mobile and desktop",
      "Clear navigation patterns for content discovery",
    ],
    codeUrl: "https://github.com/G4ANT/blog",
  },
]

export default function Projects() {
  return (
    <section id="projects" className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 max-w-xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-primary/75">
            Projects
          </p>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Things I’ve built.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
          {projects.map((project, index) => (
            <article
              key={project.title}
              className={`group border-b border-border/30 pb-12 last:border-0 hover:-translate-y-0.5 transition-transform ${index === 0 ? "xl:col-span-2 xl:border-b-0" : ""
                }`}
            >
              {/* <div className={`relative overflow-hidden ${index === 0 ? "h-72" : "h-60"}`}>
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  sizes={index === 0 ? "(min-width: 1280px) 1200px, 100vw" : "(min-width: 1280px) 560px, 100vw"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent" />
                <div className="absolute left-6 top-6 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
                  {project.category}
                </div>
              </div> */}

              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
                <div>
                  <h3 className="mb-3 text-2xl font-bold text-foreground">{project.title}</h3>
                  <p className="mb-5 text-base leading-relaxed text-muted-foreground">{project.description}</p>

                  <div className="mb-5">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-primary/75">
                      Technologies
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-full border border-border/70 bg-background px-3 py-1 text-sm font-medium text-foreground"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
                      Highlights
                    </p>
                    <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
                      {project.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-start gap-3">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex min-w-[10rem] flex-col gap-3">
                  <a
                    href={project.codeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl bg-foreground px-5 py-3 text-center text-sm font-semibold text-background transition hover:opacity-90"
                  >
                    View Code
                  </a>
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl border border-border bg-card px-5 py-3 text-center text-sm font-semibold text-foreground transition hover:bg-muted"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
