import { useEffect, useRef, useState } from "react"
import { BookOpen, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useGlossario, type Termo } from "@/hooks/useGlossario"

/**
 * Renderiza texto detectando termos do glossário e os transforma em
 * botões clicáveis que abrem um popover com a explicação cidadã.
 *
 * Use:
 *   <TextoComGlossario>
 *     O governo empenhou R$ 50 mil em medicamentos.
 *   </TextoComGlossario>
 */
export function TextoComGlossario({
  children,
  className,
}: {
  children: string
  className?: string
}) {
  const { termos } = useGlossario()
  const [aberto, setAberto] = useState<Termo | null>(null)

  if (!termos.length) {
    return <span className={className}>{children}</span>
  }

  const partes = renderizarComMarcadores(children, termos)

  return (
    <span className={className}>
      {partes.map((parte, i) =>
        typeof parte === "string" ? (
          <span key={i}>{parte}</span>
        ) : (
          <button
            key={i}
            type="button"
            onClick={() => setAberto(parte.termo)}
            className={cn(
              "inline-flex items-baseline gap-0.5 border-b border-dashed border-primary/60 text-primary transition-colors duration-200 hover:border-primary hover:bg-accent focus-visible:bg-accent",
              "min-h-0"
            )}
            aria-label={`Explicação cidadã: ${parte.termo.termo}`}
          >
            <span>{parte.match}</span>
            <BookOpen className="size-3 shrink-0 opacity-70" aria-hidden="true" />
          </button>
        )
      )}

      {aberto && <PopoverGlossario termo={aberto} onClose={() => setAberto(null)} />}
    </span>
  )
}

// --------------------------------------------------------------------
// Popover do glossário
// --------------------------------------------------------------------
function PopoverGlossario({ termo, onClose }: { termo: Termo; onClose: () => void }) {
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    closeBtnRef.current?.focus()
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [onClose])

  return (
    <div
      role="dialog"
      aria-labelledby="glossario-titulo"
      className="fixed inset-x-2 bottom-2 z-40 mx-auto max-w-md rounded-lg border border-border bg-card p-4 shadow-xl sm:inset-x-auto sm:right-4 sm:bottom-4 sm:left-auto sm:w-96"
    >
      <header className="mb-2 flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
            <BookOpen className="size-4" aria-hidden="true" />
          </span>
          <h4 id="glossario-titulo" className="font-semibold text-foreground">
            {termo.termo}
          </h4>
        </div>
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Fechar explicação"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </header>

      <p className="text-sm leading-relaxed text-foreground">
        {termo.explicacao_cidada}
      </p>

      {termo.exemplo && (
        <p className="mt-2 rounded-md bg-muted/60 p-2 text-xs leading-relaxed text-muted-foreground">
          <span className="font-medium text-foreground">Exemplo: </span>
          {termo.exemplo}
        </p>
      )}
    </div>
  )
}

// --------------------------------------------------------------------
// Renderização: divide texto em partes textuais e ocorrências de termos
// --------------------------------------------------------------------
type Parte = string | { match: string; termo: Termo }

function renderizarComMarcadores(texto: string, termos: Termo[]): Parte[] {
  if (!termos.length) return [texto]

  // Ordena termos por tamanho desc para casar primeiro os maiores
  // (evita que "folha" case antes de "folha de pagamento")
  const ordenados = [...termos].sort(
    (a, b) => b.termo.length - a.termo.length
  )

  // Constrói regex agregada com word boundaries
  const escapados = ordenados.map((t) =>
    t.termo.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  )
  const regex = new RegExp(
    `\\b(${escapados.join("|")})\\b`,
    "gi"
  )

  const partes: Parte[] = []
  let ultimoIndex = 0
  const usados = new Set<string>()

  for (const m of texto.matchAll(regex)) {
    const start = m.index ?? 0
    const match = m[0]
    const lower = match.toLowerCase()

    // Cada termo aparece com marcador apenas na primeira ocorrência
    if (usados.has(lower)) continue

    const termo = ordenados.find((t) => t.termo.toLowerCase() === lower)
    if (!termo) continue

    if (start > ultimoIndex) {
      partes.push(texto.slice(ultimoIndex, start))
    }
    partes.push({ match, termo })
    usados.add(lower)
    ultimoIndex = start + match.length
  }

  if (ultimoIndex < texto.length) {
    partes.push(texto.slice(ultimoIndex))
  }

  return partes.length ? partes : [texto]
}
