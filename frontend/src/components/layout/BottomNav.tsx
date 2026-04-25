import { Link, useLocation } from "react-router-dom"
import { Home, Search, Map, Accessibility } from "lucide-react"
import { cn } from "@/lib/utils"

const ITEMS = [
  { to: "/", label: "Início", icon: Home, match: (p: string) => p === "/" },
  { to: "/busca", label: "Buscar", icon: Search, match: (p: string) => p.startsWith("/busca") },
  { to: "/mapa", label: "Mapa", icon: Map, match: (p: string) => p.startsWith("/mapa") },
] as const

export function BottomNav() {
  const location = useLocation()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-background/95 backdrop-blur md:hidden safe-bottom"
      aria-label="Navegação principal mobile"
    >
      <ul className="container-page flex items-stretch px-2">
        {ITEMS.map((item) => {
          const active = item.match(location.pathname)
          const Icon = item.icon
          return (
            <li key={item.to} className="flex-1">
              <Link
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon
                  className={cn(
                    "size-5 transition-transform duration-200",
                    active && "scale-110"
                  )}
                  aria-hidden="true"
                />
                {item.label}
              </Link>
            </li>
          )
        })}
        <li className="flex-1">
          <button
            type="button"
            aria-label="Opções de acessibilidade (em breve)"
            className="flex w-full flex-col items-center justify-center gap-0.5 py-2 text-[11px] font-medium text-muted-foreground hover:text-foreground"
          >
            <Accessibility className="size-5" aria-hidden="true" />
            A11y
          </button>
        </li>
      </ul>
    </nav>
  )
}
