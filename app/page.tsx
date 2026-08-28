import About from "@/components/about"
import Contact from "@/components/contact"
import Education from "@/components/education"
import Experience from "@/components/experience"
import Footer from "@/components/footer"
import Header from "@/components/header"
import Hero from "@/components/hero"
import Projects from "@/components/projects"
import Skills from "@/components/skills"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Oeun Nuphea",
  url: "https://oeunnuphea.vercel.app",
  jobTitle: "Backend Engineer",
  description:
    "Backend Engineer specializing in scalable event-driven systems, high-performance APIs, and continuous deployment pipelines. Available for contract work and freelance projects.",
  email: "nupheaoeun@gmail.com",
  sameAs: [
    "https://github.com/nuphea",
    "https://www.linkedin.com/in/ouen-nuphea/",
    "https://t.me/oeunnuphea",
  ],
  knowsAbout: [
    "Node.js",
    "TypeScript",
    "Go",
    "Docker",
    "Git",
    "Socket.io",
    "WebSocket",
    "Kubernetes",
    "RabbitMQ",
    "Redis",
    "MongoDB",
    "PostgreSQL",
    "AWS",
    "Microservices",
    "Event-Driven Architecture",
    "CI/CD",
    "REST APIs",
  ],
  alumniOf: [
    {
      "@type": "CollegeOrUniversity",
      name: "Royal University of Phnom Penh",
    },
    {
      "@type": "EducationalOrganization",
      name: "ANT Training Center",
    },
  ],
  worksFor: {
    "@type": "Organization",
    name: "LTNG Properties",
  },
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="top" className="min-h-screen bg-background text-foreground">
        <Header />
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Contact />
        <Footer />
      </main>
    </>
  )
}
