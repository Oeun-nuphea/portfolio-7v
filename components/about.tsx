export default function About() {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-foreground mb-8">About Me</h2>
        <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
          <p>
            I'm an IT student with a strong passion for full-stack development and building elegant solutions to complex
            problems. My journey in technology started with a curiosity about how things work, which evolved into a
            dedicated pursuit of mastering both frontend and backend development.
          </p>
          <p>
            I specialize in creating responsive, user-friendly web applications using modern frameworks and best
            practices. I'm particularly interested in{" "}
            <span className="text-foreground font-semibold">Vue.js, Node.js, and database design</span>, and I'm always
            exploring new technologies to expand my skillset.
          </p>
          <p>
            Beyond coding, I'm committed to continuous learning, contributing to open-source projects, and collaborating
            with other developers to build impactful applications.
          </p>
        </div>
      </div>
    </section>
  )
}
