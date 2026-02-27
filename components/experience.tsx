export default function Experience() {
  const experiences = [
    {
      title: "Backenc Developer",
      company: "LTNG Properties",
      period: "2026-01 – present",
      description:
        "Contribute In Developing API and Database Design for LTNG Properties Platform",
      achievements: [
        "Gained deep understanding of backend architecture and API design.",
        "Implemented efficient database schemas and optimized queries.",
        "Collaborated with the team to improve platform performance and scalability."
      ],
      tech: [
        'Express Typescript',
        'MongoDB',
        'Database Design',
        'API Design',
        'Docker',
        'Gitlab'
      ]
    }
  ]

  return (
    <section id="experience" className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-foreground mb-12">Work Experience</h2>
        <div className="space-y-8">
          {experiences.map((exp) => (
            <div key={exp.title} className="bg-background rounded-lg p-8 border border-border">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="text-2xl font-bold text-foreground">{exp.title}</h3>
                  <p className="text-lg text-primary font-semibold">{exp.company}</p>
                </div>
                <p className="text-sm text-muted-foreground whitespace-nowrap ml-4">{exp.period}</p>
              </div>
              <p className="text-muted-foreground mb-4 leading-relaxed">{exp.description}</p>
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Key Achievements:</p>
                <ul className="space-y-2">
                  {exp.achievements.map((achievement) => (
                    <li key={achievement} className="text-muted-foreground text-sm flex items-start gap-3">
                      <span className="text-accent mt-1">•</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Technologies:</p>
                    <div className="flex flex-wrap gap-2">
                      {exp.tech.map((tech) => (
                        <span key={tech} className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
                          {tech}
                        </span>
                      ))}
                    </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
