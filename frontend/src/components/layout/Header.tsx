import { Search } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur safe-top">
      <div className="container flex items-center gap-4 py-3">
        <a href="/" className="flex items-center gap-2 font-semibold text-primary">
          <span className="text-lg">🏛️</span>
          <span>TransparaMA</span>
        </a>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md min-h-touch min-w-touch px-3 text-sm hover:bg-muted transition-colors"
            aria-label="Pesquisar"
          >
            <Search className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  )
}
