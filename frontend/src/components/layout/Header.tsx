import { Search, Accessibility } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { Logo } from "@/components/layout/Logo"
import { cn } from "@/lib/utils"

export function Header() {
  const location = useLocation()
  const isBuscaActive = location.pathname.startsWith("/busca")

  return (
    <header
      className="sticky top-0 z-30 w-full border-b border-border bg-background/85 backdrop-blur safe-top"
      role="banner"
    >
      <div className="container-page flex items-center gap-3 px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-md px-1 py-1 text-foreground transition-colors hover:text-primary focus-visible:text-primary"
          aria-label="TransparaMA, ir para a página inicial"
        >
          <Logo />
        </Link>

        <nav className="ml-auto flex items-center gap-1" aria-label="Navegação principal">
          <Link
            to="/busca"
            className={cn(
              "inline-flex items-center gap-1.5 rounded-md min-h-touch px-3 text-sm font-medium transition-colors",
              isBuscaActive
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "text-foreground hover:bg-muted"
            )}
            aria-current={isBuscaActive ? "page" : undefined}
          >
            <Search className="size-4" aria-hidden="true" />
            <span>Buscar</span>
          </Link>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md min-h-touch min-w-touch text-foreground transition-colors hover:bg-muted"
            aria-label="Opções de acessibilidade"
            title="Opções de acessibilidade (em breve)"
          >
            <Accessibility className="size-5" aria-hidden="true" />
          </button>
        </nav>
      </div>
    </header>
  )
}
