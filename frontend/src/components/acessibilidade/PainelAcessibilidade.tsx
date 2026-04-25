import { useEffect, useRef, useState } from "react"
import {
  Accessibility,
  Contrast,
  Type,
  Zap,
  RotateCcw,
  Check,
  Minus,
  Plus,
  X,
} from "lucide-react"
import { useAcessibilidade } from "@/hooks/useAcessibilidade"
import { cn } from "@/lib/utils"

/**
 * Painel de acessibilidade. Aparece como popover ao clicar no botão
 * com ícone de Acessibilidade no Header ou no BottomNav mobile.
 *
 * Toggles:
 *  - Alto contraste (WCAG 7:1)
 *  - Tamanho da fonte (3 níveis: 100%, 112,5%, 125%)
 *  - Reduzir movimento (anula animações além do prefers-reduced-motion)
 *
 * Persistência: localStorage. Aplica classes no <html>.
 */
export function PainelAcessibilidade({
  variante = "header",
}: {
  variante?: "header" | "bottom-nav"
}) {
  const [aberto, setAberto] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const {
    config,
    toggleAltoContraste,
    setFonte,
    toggleReduzirMovimento,
    restaurar,
  } = useAcessibilidade()

  // Fecha ao clicar fora
  useEffect(() => {
    if (!aberto) return
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setAberto(false)
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setAberto(false)
    }
    document.addEventListener("mousedown", onDocClick)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDocClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [aberto])

  // Foca no primeiro botão ao abrir
  useEffect(() => {
    if (aberto) {
      requestAnimationFrame(() => closeBtnRef.current?.focus())
    }
  }, [aberto])

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setAberto((s) => !s)}
        aria-expanded={aberto}
        aria-haspopup="dialog"
        aria-label="Opções de acessibilidade"
        title="Opções de acessibilidade"
        className={cn(
          "inline-flex items-center justify-center transition-colors",
          variante === "header" &&
            "rounded-md min-h-touch min-w-touch text-foreground hover:bg-muted",
          variante === "bottom-nav" &&
            "w-full flex-col gap-0.5 py-2 text-[11px] font-medium text-muted-foreground hover:text-foreground"
        )}
      >
        <Accessibility
          className={cn(
            variante === "header" ? "size-5" : "size-5",
            aberto && "text-primary"
          )}
          aria-hidden="true"
        />
        {variante === "bottom-nav" && (
          <span className={aberto ? "text-primary" : ""}>A11y</span>
        )}
      </button>

      {aberto && (
        <div
          role="dialog"
          aria-label="Opções de acessibilidade"
          className={cn(
            "absolute z-40 w-72 rounded-lg border border-border bg-card p-3 shadow-xl",
            variante === "header" && "right-0 top-full mt-2",
            variante === "bottom-nav" && "bottom-full right-0 mb-2"
          )}
        >
          {/* Cabeçalho */}
          <header className="mb-3 flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Acessibilidade
              </h3>
              <p className="text-xs text-muted-foreground">
                As escolhas ficam salvas neste navegador.
              </p>
            </div>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={() => setAberto(false)}
              className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Fechar painel"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </header>

          {/* Alto contraste */}
          <Linha
            icon={<Contrast className="size-4" />}
            titulo="Alto contraste"
            descricao="Cores em preto e branco para máxima legibilidade"
          >
            <Switch
              checked={config.altoContraste}
              onChange={toggleAltoContraste}
              label="Alto contraste"
            />
          </Linha>

          <Separador />

          {/* Tamanho da fonte */}
          <Linha
            icon={<Type className="size-4" />}
            titulo="Tamanho da fonte"
            descricao={`Atual: ${["100%", "112,5%", "125%"][config.fonte]}`}
          >
            <div
              role="radiogroup"
              aria-label="Tamanho da fonte"
              className="flex items-center gap-1"
            >
              <button
                type="button"
                onClick={() => setFonte(0)}
                aria-label="Diminuir fonte para o padrão"
                disabled={config.fonte === 0}
                className="inline-flex size-7 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:opacity-50"
              >
                <Minus className="size-3.5" aria-hidden="true" />
              </button>
              <div className="flex flex-1 gap-0.5 px-1">
                {([0, 1, 2] as const).map((n) => (
                  <button
                    key={n}
                    type="button"
                    role="radio"
                    aria-checked={config.fonte === n}
                    aria-label={`Fonte ${["padrão", "+10%", "+20%"][n]}`}
                    onClick={() => setFonte(n)}
                    className={cn(
                      "h-2 flex-1 rounded-full transition-colors",
                      config.fonte >= n ? "bg-primary" : "bg-muted"
                    )}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setFonte(2)}
                aria-label="Aumentar fonte para o máximo"
                disabled={config.fonte === 2}
                className="inline-flex size-7 items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted disabled:opacity-50"
              >
                <Plus className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          </Linha>

          <Separador />

          {/* Reduzir movimento */}
          <Linha
            icon={<Zap className="size-4" />}
            titulo="Reduzir movimento"
            descricao="Desativa animações e transições"
          >
            <Switch
              checked={config.reduzirMovimento}
              onChange={toggleReduzirMovimento}
              label="Reduzir movimento"
            />
          </Linha>

          <Separador />

          {/* Restaurar padrão */}
          <button
            type="button"
            onClick={restaurar}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            <RotateCcw className="size-3.5" aria-hidden="true" />
            Restaurar padrão
          </button>
        </div>
      )}
    </div>
  )
}

// --------------------------------------------------------------------
// Subcomponentes
// --------------------------------------------------------------------
function Linha({
  icon,
  titulo,
  descricao,
  children,
}: {
  icon: React.ReactNode
  titulo: string
  descricao: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-2 py-2">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground">{titulo}</p>
        <p className="text-[11px] leading-snug text-muted-foreground">
          {descricao}
        </p>
        <div className="mt-2">{children}</div>
      </div>
    </div>
  )
}

function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean
  onChange: () => void
  label: string
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={cn(
        "relative inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full border transition-colors",
        checked
          ? "border-primary bg-primary"
          : "border-border bg-muted"
      )}
    >
      <span
        className={cn(
          "inline-flex size-4 items-center justify-center rounded-full bg-background shadow-sm transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5"
        )}
      >
        {checked && (
          <Check className="size-3 text-primary" aria-hidden="true" />
        )}
      </span>
    </button>
  )
}

function Separador() {
  return <div className="my-1 border-t border-border" aria-hidden="true" />
}
