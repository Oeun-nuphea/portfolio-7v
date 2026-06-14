import Image from "next/image"
import { Github, ExternalLink } from "lucide-react"

const projects = [
  {
    title: "Spendwise",
    category: "Mobile Finance Application",
    image: "/spendwise.png",
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
    image: "/notion.png",
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
    image: "/e-commerce.png",
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
    image: "/blog.png",
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
    <section id="projects" className="scroll-mt-24 py-24 px-6 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 space-y-3 max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            My Portfolio
          </p>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            Featured Projects
          </h2>
          <p className="text-base text-muted-foreground">
            A selection of backend systems, microservice deployments, and full-stack applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {projects.map((project) => (
            <article
              key={project.title}
              className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-md"
            >
              {/* Image Container with Zoom effect */}
              <div className="relative aspect-video w-full overflow-hidden bg-muted border-b border-border/50">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover object-top transition duration-500 group-hover:scale-102"
                  sizes="(min-width: 768px) 50vw, 100vw"
                />
                <div className="absolute left-4 top-4 rounded-lg border border-border/10 bg-background/80 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm">
                  {project.category}
                </div>
              </div>

              {/* Card Details */}
              <div className="flex flex-1 flex-col p-6 space-y-5 justify-between">
                <div className="space-y-4">
                  <h3 className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>

                  {/* Highlights Bullet List */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85">
                      Key Highlights
                    </p>
                    <ul className="space-y-1.5">
                      {project.highlights.map((highlight) => (
                        <li key={highlight} className="flex items-start gap-2.5 text-xs text-muted-foreground leading-relaxed">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/80" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Tech Pills & Actions */}
                <div className="space-y-4 pt-2 border-t border-border/40">
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-md bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground tracking-wide"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <a
                      href={project.codeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-foreground px-4 py-2.5 text-xs font-bold text-background transition hover:opacity-90 active:scale-[0.98]"
                    >
                      <Github size={14} />
                      Source Code
                    </a>
                    {project.demoUrl && (
                      <a
                        href={project.demoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs font-bold text-foreground transition hover:bg-muted active:scale-[0.98]"
                      >
                        <ExternalLink size={14} />
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

