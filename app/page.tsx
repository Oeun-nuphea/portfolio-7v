import About from "@/components/about"
import Contact from "@/components/contact"
import Education from "@/components/education"
import Experience from "@/components/experience"
import Footer from "@/components/footer"
import Header from "@/components/header"
import Hero from "@/components/hero"
import Skills from "@/components/skills"

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Oeun Nuphea",
  url: "https://oeunnuphea.vercel.app",
  jobTitle: "Software Engineer",
  description:
    "Software Engineer specializing in scalable REST APIs, real-time WebSockets, database design (MongoDB, MySQL, Redis), and CI/CD automation.",
  email: "nupheaoeun@gmail.com",
  telephone: "+855962469031",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Phnom Penh",
    addressCountry: "Cambodia",
  },
  sameAs: [
    "https://github.com/Oeun-nuphea",
    "https://www.linkedin.com/in/ouen-nuphea/",
    "https://t.me/oeunnuphea",
  ],
  knowsAbout: [
    "Backend Development",
    "REST APIs",
    "WebSockets",
    "Node.js",
    "ExpressJS",
    "NestJS",
    "Python",
    "TypeScript",
    "JavaScript",
    "Vue.js",
    "React.js",
    "MongoDB",
    "MySQL",
    "Redis",
    "Docker",
    "GitHub Actions",
    "CI/CD",
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
    name: "LTNG Business",
  },
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="top" className="min-h-screen bg-transparent text-foreground pb-[calc(5rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
        <Header />
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Education />
        <Contact />
        <Footer />
      </main>
    </>
  )
}
