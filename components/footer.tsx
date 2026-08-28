export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border py-8 px-6 sm:px-8 lg:px-8">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <p className="text-sm font-medium text-foreground">Nuphea</p>
        <p className="text-xs text-muted-foreground">© {currentYear} Oeun Nuphea</p>
      </div>
    </footer>
  )
}
