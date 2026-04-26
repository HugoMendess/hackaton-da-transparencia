import { Search, Map as MapIcon, Sparkles } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { Logo } from "@/components/layout/Logo"
import { BackButton } from "@/components/layout/BackButton"
import { PainelAcessibilidade } from "@/components/acessibilidade/PainelAcessibilidade"
import { useAjudaInteligenteContext } from "@/contexts/AjudaInteligenteContext"
import { cn } from "@/lib/utils"

export function Header() {
  const location = useLocation()
  const isBuscaActive = location.pathname.startsWith("/busca")
  const isMapaActive = location.pathname.startsWith("/mapa")
  const { abrir: abrirAjuda } = useAjudaInteligenteContext()

  return (
    <header
      className="sticky top-0 z-30 w-full border-b border-border bg-background/85 backdrop-blur safe-top"
      role="banner"
    >
      <div className="container-page flex items-center gap-2 px-4 py-3">
        <BackButton />

        <Link
          to="/"
          className="flex items-center gap-2 rounded-md px-1 py-1 text-foreground transition-colors hover:text-primary focus-visible:text-primary"
          aria-label="Portal da Transparência, ir para a página inicial"
        >
          <Logo />
        </Link>

        <nav className="ml-auto flex items-center gap-1" aria-label="Navegação principal">
          <Link
            to="/busca"
            className={cn(
              "hidden items-center gap-1.5 rounded-md min-h-touch px-3 text-sm font-medium transition-colors sm:inline-flex",
              isBuscaActive
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "text-foreground hover:bg-muted"
            )}
            aria-current={isBuscaActive ? "page" : undefined}
          >
            <Search className="size-4" aria-hidden="true" />
            <span>Buscar</span>
          </Link>

          <Link
            to="/mapa"
            className={cn(
              "hidden items-center gap-1.5 rounded-md min-h-touch px-3 text-sm font-medium transition-colors sm:inline-flex",
              isMapaActive
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "text-foreground hover:bg-muted"
            )}
            aria-current={isMapaActive ? "page" : undefined}
          >
            <MapIcon className="size-4" aria-hidden="true" />
            <span>Mapa</span>
          </Link>

          <button
            type="button"
            onClick={() =>
              abrirAjuda({ pagina: location.pathname })
            }
            className="inline-flex items-center gap-1.5 rounded-md min-h-touch px-3 text-sm font-semibold transition-colors bg-secondary text-secondary-foreground hover:bg-secondary/90"
            aria-label="Abrir AjudaInteligente, perguntar em linguagem natural"
            title="AjudaInteligente"
          >
            <Sparkles className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Pergunte</span>
          </button>

          <PainelAcessibilidade variante="header" />
        </nav>
      </div>
    </header>
  )
}
