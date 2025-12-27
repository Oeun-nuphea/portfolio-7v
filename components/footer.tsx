export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center text-muted-foreground">
          <p>© {currentYear} Oeun Nuphea. All rights reserved.</p>
          <p className="text-sm mt-2">Built with Next.js, and Tailwind CSS</p>
        </div>
      </div>
    </footer>
  )
}
