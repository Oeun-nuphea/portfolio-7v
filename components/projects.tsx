export default function Projects() {
  const projects = [
    {
      title: "E-Commerce Platform",
      description:
        "A full-featured e-commerce application with product catalog, shopping cart, and secure payment integration.",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
      features: [
        "Product filtering and search",
        "User authentication and profiles",
        "Payment processing",
        "Order management",
      ],
      link: "#",
      demo: "#",
    },
    {
      title: "Social Media Dashboard",
      description:
        "Analytics dashboard for tracking social media metrics and insights across multiple platforms in real-time.",
      technologies: ["Next.js", "TypeScript", "GraphQL", "MongoDB"],
      features: [
        "Real-time data updates",
        "Interactive charts and graphs",
        "Multi-platform integration",
        "Custom analytics reports",
      ],
      link: "#",
      demo: "#",
    },
    {
      title: "Task Management App",
      description:
        "Collaborative task management tool with real-time collaboration, team workspaces, and progress tracking.",
      technologies: ["React", "Firebase", "Tailwind CSS", "WebSockets"],
      features: [
        "Real-time collaboration",
        "Team workspaces",
        "Task prioritization",
        "Progress tracking and analytics",
      ],
      link: "#",
      demo: "#",
    },
  ]

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-foreground mb-12">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.title}
              className="bg-background rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
            >
              <div className="h-48 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                <img
                  src={`/.jpg?height=192&width=384&query=${project.title}`}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2">{project.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{project.description}</p>
                <div className="mb-4">
                  <p className="text-xs font-semibold text-primary uppercase mb-2">Technologies</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span key={tech} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Key Features</p>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    {project.features.slice(0, 2).map((feature) => (
                      <li key={feature}>• {feature}</li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2">
                  <a
                    href={project.link}
                    className="flex-1 px-4 py-2 text-sm bg-primary text-primary-foreground rounded hover:bg-accent transition-colors text-center font-medium"
                  >
                    View Code
                  </a>
                  <a
                    href={project.demo}
                    className="flex-1 px-4 py-2 text-sm border border-primary text-primary rounded hover:bg-primary/10 transition-colors text-center font-medium"
                  >
                    Live Demo
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
