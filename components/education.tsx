export default function Education() {
  const education = [
    {
      degree: "Bachelor of Science in Information Technology",
      school: "[Your University Name]",
      period: "[Expected Graduation: 20XX]",
      details: [
        "GPA: [Your GPA]",
        "Relevant Coursework: Data Structures, Web Development, Database Management, Software Engineering",
      ],
    },
    {
      degree: "Full-Stack Web Development Certification",
      school: "[Certificate Program Name]",
      period: "[Year Completed]",
      details: ["Comprehensive training in modern web development", "Hands-on projects and real-world applications"],
    },
  ]

  return (
    <section id="education" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-foreground mb-12">Education</h2>
        <div className="space-y-8">
          {education.map((item) => (
            <div key={item.degree} className="bg-card rounded-lg p-8 border border-border">
              <h3 className="text-2xl font-bold text-foreground mb-2">{item.degree}</h3>
              <p className="text-lg text-primary font-semibold mb-1">{item.school}</p>
              <p className="text-sm text-muted-foreground mb-4">{item.period}</p>
              <ul className="space-y-2">
                {item.details.map((detail) => (
                  <li key={detail} className="text-muted-foreground flex items-start gap-3">
                    <span className="text-accent mt-1">•</span>
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
