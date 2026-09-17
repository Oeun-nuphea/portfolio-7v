export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="hidden lg:block border-t border-white/60 bg-white/40 backdrop-blur-xl py-8 px-6 sm:px-8 lg:px-8">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <p className="text-sm font-semibold text-foreground">Nuphea</p>
        <p className="text-xs text-muted-foreground">© {currentYear} Oeun Nuphea</p>
      </div>
    </footer>
  )
}
