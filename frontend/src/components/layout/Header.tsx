import { Search, Map as MapIcon, Sparkles } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { Logo } from "@/components/layout/Logo"
import { BackButton } from "@/components/layout/BackButton"
import { BarraInstitucional } from "@/components/layout/BarraInstitucional"
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
      className="sticky top-0 z-30 w-full bg-background/85 backdrop-blur safe-top"
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
            data-btn-pergunte="true"
            onClick={() =>
              abrirAjuda({ pagina: location.pathname })
            }
            className={cn(
              "group relative inline-flex items-center gap-1.5 rounded-lg min-h-touch px-3.5 text-sm font-semibold",
              "bg-gradient-to-br from-secondary to-secondary/85 text-secondary-foreground",
              "shadow-[0_2px_4px_rgba(217,161,35,0.20),_0_8px_18px_-6px_rgba(217,161,35,0.40)]",
              "ring-1 ring-secondary/40",
              "transition-all duration-300 ease-out",
              "hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(217,161,35,0.25),_0_12px_24px_-6px_rgba(217,161,35,0.55)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            )}
            aria-label="Abrir AjudaInteligente, perguntar em linguagem natural"
            title="AjudaInteligente"
          >
            <Sparkles className="size-4 transition-transform duration-300 group-hover:rotate-12" aria-hidden="true" />
            <span className="hidden sm:inline">Pergunte</span>
          </button>

          <PainelAcessibilidade variante="header" />
        </nav>
      </div>

      {/* Barra colorida institucional, faz o papel da border-bottom
          do header dando acabamento governamental */}
      <BarraInstitucional className="h-1" />
    </header>
  )
}
