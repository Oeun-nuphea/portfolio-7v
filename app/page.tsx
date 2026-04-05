import About from "@/components/about"
import Contact from "@/components/contact"
import Education from "@/components/education"
import Experience from "@/components/experience"
import Footer from "@/components/footer"
import Header from "@/components/header"
import Hero from "@/components/hero"
import Projects from "@/components/projects"
import Skills from "@/components/skills"

export default function Home() {
  return (
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
  )
}
