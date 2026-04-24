export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/70 bg-background/80 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-semibold text-foreground">Nuphea</p>
          <p className="text-sm text-muted-foreground">
            Backend Engineer building scalable, event-driven systems.
          </p>
        </div>

        <div className="text-sm text-muted-foreground sm:text-right">
          <p>© {currentYear} Nuphea. All rights reserved.</p>
          <p className="mt-1">Built with Next.js and Tailwind CSS.</p>
        </div>
      </div>
    </footer>
  )
}
