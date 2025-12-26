export default function Skills() {
  const skillCategories = [
    {
      category: "Frontend",
      skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5", "CSS3", "JavaScript (ES6+)"],
    },
    {
      category: "Backend",
      skills: ["Node.js", "Express.js", "REST APIs", "GraphQL", "Server-side Rendering", "Authentication"],
    },
    {
      category: "Databases",
      skills: ["PostgreSQL", "MongoDB", "MySQL", "Firebase", "Prisma ORM", "SQL"],
    },
    {
      category: "Tools & Platforms",
      skills: ["Git/GitHub", "Docker", "Vercel", "AWS Basics", "VS Code", "Figma", "Linux"],
    },
  ]

  return (
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-foreground mb-12">Technical Skills</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((cat) => (
            <div key={cat.category} className="bg-card rounded-lg p-6 border border-border">
              <h3 className="text-xl font-semibold text-primary mb-4">{cat.category}</h3>
              <div className="flex flex-wrap gap-2">
                {cat.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
