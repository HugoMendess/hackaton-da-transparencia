import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Botão "Voltar" sensível ao contexto.
 *
 * Comportamento:
 *  - Se há histórico de navegação interno (entrou navegando), volta uma página
 *  - Se chegou direto pela URL (refresh ou link externo), vai para /
 *  - Não aparece na home (nada para voltar)
 *
 * Acessibilidade: aria-label explícito, foco visível, atalho semântico.
 */
export function BackButton({ className }: { className?: string }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [hasHistory, setHasHistory] = useState(false)

  useEffect(() => {
    // window.history.length aumenta quando há navegação. Se for 1, é a
    // primeira página (acessou direto pela URL).
    setHasHistory(window.history.length > 1)
  }, [location.pathname])

  // Não mostra na home
  if (location.pathname === "/") return null

  function voltar() {
    if (hasHistory) {
      navigate(-1)
    } else {
      navigate("/")
    }
  }

  return (
    <button
      type="button"
      onClick={voltar}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md min-h-touch px-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:bg-muted",
        className
      )}
      aria-label="Voltar para a página anterior"
      title={hasHistory ? "Voltar para a página anterior" : "Voltar para a tela inicial"}
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      <span className="hidden sm:inline">Voltar</span>
    </button>
  )
}
