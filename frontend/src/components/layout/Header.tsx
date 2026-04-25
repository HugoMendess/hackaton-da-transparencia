import { Search } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

export function Header() {
  const location = useLocation()
  const isBuscaActive = location.pathname.startsWith("/busca")

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur safe-top">
      <div className="container flex items-center gap-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-semibold text-primary">
          <span className="text-lg" aria-hidden="true">🏛️</span>
          <span>TransparaMA</span>
        </Link>

        <Link
          to="/busca"
          className={cn(
            "ml-auto inline-flex items-center gap-2 rounded-md min-h-touch px-3 text-sm font-medium transition-colors",
            isBuscaActive
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted text-foreground"
          )}
          aria-label="Ir para busca"
        >
          <Search className="size-4" aria-hidden="true" />
          <span>Buscar</span>
        </Link>
      </div>
    </header>
  )
}
