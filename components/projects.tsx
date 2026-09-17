import { Github, ExternalLink, Package } from "lucide-react"

interface Project {
  title: string
  category: string
  description: string
  technologies: string[]
  highlights: string[]
  codeUrl?: string
  demoUrl?: string
  npmUrl?: string
}

const projects: Project[] = [
  {
    title: "nestjs-mongo-paginator",
    category: "Open-Source NPM Package",
    description:
      "A lightweight, type-safe NestJS and Mongoose pagination library supporting both offset-based and cursor-based pagination strategies.",
    technologies: ["NestJS", "TypeScript", "MongoDB", "Mongoose", "NPM"],
    highlights: [
      "Unified type-safe API for offset-based and cursor-based pagination",
      "Supports custom query filtering, multi-field sorting, and projection",
      "Designed for NestJS microservices and REST APIs to handle high-performance queries",
    ],
    codeUrl: "https://github.com/Oeun-nuphea/nestjs-mongo-paginator",
    npmUrl: "https://www.npmjs.com/package/nestjs-mongo-paginator",
  },
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
    <div id="projects" className="scroll-mt-20 sm:scroll-mt-24 pt-10 sm:pt-16 space-y-8 sm:space-y-10">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          My Portfolio
        </p>
        <h3 className="text-2xl font-bold tracking-tight text-foreground">
          Featured Projects
        </h3>
        <p className="text-sm text-muted-foreground">
          A selection of backend systems, microservice deployments, and full-stack applications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <article
            key={project.title}
            className="glass-panel flex flex-col rounded-3xl overflow-hidden transition-all duration-300 hover:bg-white/85 hover:shadow-xl"
          >
            <div className="flex flex-1 flex-col p-6 sm:p-7 space-y-5">
              <div className="space-y-3">
                <div>
                  <span className="glass-pill inline-block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground px-2.5 py-0.5 rounded-full mb-2">
                    {project.category}
                  </span>
                  <h4 className="text-lg font-bold text-foreground">
                    {project.title}
                  </h4>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>

                <ul className="space-y-1.5 pt-1">
                  {project.highlights.map((highlight) => (
                    <li key={highlight} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-blue-500/70 shadow-sm" />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-auto space-y-4 pt-4 border-t border-white/60">
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="glass-pill rounded-full px-2.5 py-0.5 text-[11px] font-medium text-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {project.codeUrl && (
                    <a
                      href={project.codeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="glass-button inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-foreground hover:bg-white"
                    >
                      <Github size={13} />
                      Source Code
                    </a>
                  )}
                  {project.npmUrl && (
                    <a
                      href={project.npmUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="glass-button inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white"
                    >
                      <Package size={13} />
                      NPM Package
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="glass-button inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-white"
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
  )
}
