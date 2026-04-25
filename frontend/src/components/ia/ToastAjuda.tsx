import { useEffect, useState } from "react"
import { Sparkles, X } from "lucide-react"
import { useAjudaInteligenteContext } from "@/contexts/AjudaInteligenteContext"
import { cn } from "@/lib/utils"

/**
 * Toast "Posso ajudar?" estilo Alura.
 *
 * Aparece de forma discreta no canto inferior direito quando um
 * trigger contextual é satisfeito (ex: zero results na busca,
 * inatividade prolongada com query digitada).
 *
 * Click → abre o drawer da AjudaInteligente com a pergunta inicial
 * já preenchida e disparada automaticamente.
 *
 * Auto-dismiss após 12 segundos para não atrapalhar.
 */
export function ToastAjuda({
  visivel,
  pergunta,
  motivo,
  onDispensar,
  contextoExtra,
}: {
  visivel: boolean
  pergunta: string
  motivo:
    | "zero-results"
    | "inatividade"
    | "query-complexa"
    | "ajuda-contextual"
  onDispensar: () => void
  contextoExtra?: { eixo?: string; municipio?: string; pagina?: string }
}) {
  const { abrir, aberto: drawerAberto } = useAjudaInteligenteContext()
  const [mostrar, setMostrar] = useState(false)

  // Auto-dismiss após 12 segundos
  useEffect(() => {
    if (!visivel) {
      setMostrar(false)
      return
    }
    setMostrar(true)
    const timer = setTimeout(() => {
      setMostrar(false)
      onDispensar()
    }, 12000)
    return () => clearTimeout(timer)
  }, [visivel, onDispensar])

  // Fecha quando o drawer abre (não pode coexistir)
  useEffect(() => {
    if (drawerAberto) setMostrar(false)
  }, [drawerAberto])

  if (!mostrar) return null

  const titulo = MOTIVO_TITULOS[motivo]
  const subtitulo = MOTIVO_SUBTITULOS[motivo](pergunta)

  function aceitar() {
    setMostrar(false)
    abrir(contextoExtra, pergunta)
    onDispensar()
  }

  function dispensar() {
    setMostrar(false)
    onDispensar()
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        "fixed bottom-4 right-4 z-30 flex max-w-xs items-start gap-2 rounded-lg border border-primary/30 bg-card p-3 shadow-2xl",
        "duration-300 animate-in fade-in slide-in-from-bottom-2",
        "md:max-w-sm md:bottom-6 md:right-6"
      )}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
        <Sparkles className="size-4" aria-hidden="true" />
      </span>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{titulo}</p>
        <p className="mt-0.5 line-clamp-2 text-xs leading-snug text-muted-foreground">
          {subtitulo}
        </p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={aceitar}
            className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Sparkles className="size-3" aria-hidden="true" />
            Sim, ajude
          </button>
          <button
            type="button"
            onClick={dispensar}
            className="rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Agora não
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={dispensar}
        className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Dispensar sugestão"
      >
        <X className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}

const MOTIVO_TITULOS: Record<string, string> = {
  "zero-results": "Posso te ajudar a encontrar?",
  inatividade: "Posso te ajudar nessa busca?",
  "query-complexa": "Posso responder isso direto?",
  "ajuda-contextual": "Posso explicar?",
}

const MOTIVO_SUBTITULOS: Record<string, (q: string) => string> = {
  "zero-results": (q) =>
    `Não encontrei resultados para "${truncar(q)}". A AjudaInteligente pode buscar de outra forma.`,
  inatividade: (q) =>
    `Você buscou "${truncar(q)}". Quer que eu responda com base na pergunta?`,
  "query-complexa": (q) =>
    `Sua pergunta "${truncar(q)}" é detalhada. Posso responder em linguagem natural com fontes oficiais.`,
  "ajuda-contextual": (q) =>
    `Vou explicar "${truncar(q)}" em linguagem cidadã com fontes oficiais.`,
}

function truncar(s: string, max = 40): string {
  return s.length > max ? s.slice(0, max - 1) + "…" : s
}
