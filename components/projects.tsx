import { Github, ExternalLink } from "lucide-react"

const projects = [
  {
    title: "Spendwise",
    category: "Mobile Finance Application",
    description:
      "A feature-rich mobile wallet experience featuring secure authentication, real-time chat integration, and a production-grade backend stack.",
    technologies: ["Flutter", "TypeScript", "Express", "MongoDB", "Redis", "Docker", "AWS", "WebRTC"],
    highlights: [
      "Real-time chat with WebSocket and voice/video via WebRTC",
      "Live transaction and wallet flows with mobile-first UX",
      "Admin dashboard and Dockerized container workflow",
    ],
    codeUrl: "https://github.com/orgs/free-social/repositories",
  },
  {
    title: "Notion-Inspired Workspace",
    category: "Event-Driven Platform",
    description:
      "A collaborative notes and workspace platform structured around RabbitMQ message brokers, Node/TS APIs, and containerized dev systems.",
    technologies: ["ReactJS", "Express", "TypeScript", "PostgreSQL", "Docker", "RabbitMQ"],
    highlights: [
      "Flexible document hierarchy and content block structure",
      "Service-to-service decoupled communication via message queue",
      "Unified Docker environments for rapid developer onboarding",
    ],
    codeUrl: "https://github.com/Learning-and-Exploring/note-rabbitmq",
  },
  {
    title: "E-Shop Platform",
    category: "Full-Stack E-Commerce",
    description:
      "An end-to-end commercial storefront incorporating catalog management, dynamic shopping cart flows, and secure customer authentication.",
    technologies: ["Vue", "Node.js", "MongoDB", "Tailwind CSS", "Vercel"],
    highlights: [
      "Catalog browsing, category search, and real-time checkout updates",
      "Secure user sessions and profile dashboard functionality",
    ],
    codeUrl: "https://github.com/orgs/e-commerce-fullstack/repositories",
    demoUrl: "https://e-smart-shop.vercel.app/",
  },
  {
    title: "Blog Dashboard UI",
    category: "Frontend Control Panel",
    description:
      "A fully responsive and interactive back-office dashboard interface for organizing articles, tags, authors, and user interactions.",
    technologies: ["HTML", "CSS", "JavaScript"],
    highlights: [
      "Clean post, category, and metadata organization views",
      "Device-agnostic layout structures preserving grid density",
    ],
    codeUrl: "https://github.com/G4ANT/blog",
  },
]

export default function Projects() {
  return (
    <section id="projects" className="scroll-mt-24 py-24 px-6 sm:px-8 border-t border-border">
      <div className="mx-auto max-w-5xl">
        <div className="mb-14 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            My Portfolio
          </p>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Featured Projects
          </h2>
          <p className="text-sm text-muted-foreground">
            A selection of backend systems, microservice deployments, and full-stack applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <article
              key={project.title}
              className="flex flex-col rounded-xl border border-border overflow-hidden transition-colors duration-200 hover:border-foreground/20"
            >
              <div className="flex flex-1 flex-col p-6 space-y-5">
                <div className="space-y-3">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                      {project.category}
                    </p>
                    <h3 className="text-base font-semibold text-foreground">
                      {project.title}
                    </h3>
                  </div>

                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>

                  <ul className="space-y-1.5">
                    {project.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto space-y-4 pt-4 border-t border-border">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded border border-border px-2 py-0.5 text-[11px] font-medium text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2.5">
                    <a
                      href={project.codeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-foreground transition hover:bg-muted"
                    >
                      <Github size={13} />
                      Source Code
                    </a>
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-muted-foreground transition hover:text-foreground hover:bg-muted"
                      >
                        <ExternalLink size={13} />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
