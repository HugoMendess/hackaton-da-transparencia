import { useEffect, useRef, useState } from "react"
import {
  Sparkles,
  X,
  Send,
  Loader2,
  ExternalLink,
  Trash2,
  Database,
  Zap,
  CircleAlert,
} from "lucide-react"
import { useAjudaInteligenteContext } from "@/contexts/AjudaInteligenteContext"
import type { MensagemConversa } from "@/hooks/useAjudaInteligente"
import { cn } from "@/lib/utils"

const PERGUNTAS_SUGERIDAS = [
  "Quanto o governo gastou com saúde esse ano?",
  "Quanto custa a folha de servidores por mês?",
  "As obras de educação estão sendo executadas?",
  "Como me inscrevo no Maranhão Livre da Fome?",
] as const

/**
 * Drawer da AjudaInteligente.
 *
 * Aparece como painel lateral à direita (estilo Alura). Pode ser
 * acionado de qualquer página via hook compartilhado. Inclui histórico
 * de conversa na sessão, sugestões de perguntas e citação de fontes.
 *
 * Acessibilidade:
 *  - role=dialog com aria-label
 *  - Escape fecha
 *  - Foco automático no input ao abrir
 *  - aria-live polite para anunciar respostas
 */
export function DrawerAjudaInteligente() {
  const { aberto, mensagens, perguntando, fechar, limpar, perguntar } =
    useAjudaInteligenteContext()
  const [input, setInput] = useState("")
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const conversaRef = useRef<HTMLDivElement>(null)

  // Foco no input ao abrir
  useEffect(() => {
    if (aberto) {
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [aberto])

  // Escape fecha
  useEffect(() => {
    if (!aberto) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") fechar()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [aberto, fechar])

  // Auto-scroll para o fim da conversa
  useEffect(() => {
    if (mensagens.length > 0 && conversaRef.current) {
      conversaRef.current.scrollTop = conversaRef.current.scrollHeight
    }
  }, [mensagens])

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const v = input.trim()
    if (!v || perguntando) return
    setInput("")
    perguntar(v)
  }

  function aplicarSugestao(s: string) {
    setInput("")
    perguntar(s)
    inputRef.current?.focus()
  }

  if (!aberto) return null

  return (
    <>
      {/* Overlay clicável */}
      <div
        className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-[2px]"
        onClick={fechar}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-label="AjudaInteligente do TransparaMA"
        aria-modal="true"
        className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-card shadow-2xl"
      >
        {/* Header */}
        <header className="flex items-start gap-3 border-b border-border bg-gradient-to-br from-primary/10 to-secondary/5 p-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
            <Sparkles className="size-5" aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-semibold text-foreground">
              AjudaInteligente
            </h2>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Pergunte em linguagem natural. Tenho acesso à base do portal.
            </p>
          </div>
          <div className="flex items-center gap-1">
            {mensagens.length > 0 && (
              <button
                type="button"
                onClick={limpar}
                className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                aria-label="Limpar conversa"
                title="Limpar conversa"
              >
                <Trash2 className="size-4" aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={fechar}
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Fechar AjudaInteligente"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
        </header>

        {/* Conversa ou estado inicial */}
        <div
          ref={conversaRef}
          className="flex-1 overflow-y-auto px-4 py-4"
          aria-live="polite"
          aria-atomic="false"
        >
          {mensagens.length === 0 ? (
            <EstadoInicial onSugestao={aplicarSugestao} />
          ) : (
            <ul className="space-y-3">
              {mensagens.map((m, i) => (
                <li key={i}>
                  <Bolha mensagem={m} />
                </li>
              ))}
              {perguntando && (
                <li>
                  <BolhaCarregando />
                </li>
              )}
            </ul>
          )}
        </div>

        {/* Form de input */}
        <form
          onSubmit={onSubmit}
          className="border-t border-border bg-card p-3"
        >
          <div className="flex items-end gap-2">
            <label htmlFor="ai-input" className="sr-only">
              Sua pergunta
            </label>
            <textarea
              id="ai-input"
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  onSubmit(e)
                }
              }}
              maxLength={500}
              rows={2}
              placeholder="Pergunte algo sobre o portal..."
              className={cn(
                "flex-1 resize-none rounded-md border border-border bg-background px-3 py-2 text-sm",
                "placeholder:text-muted-foreground/70",
                "transition-colors duration-200",
                "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              )}
              disabled={perguntando}
            />
            <button
              type="submit"
              disabled={!input.trim() || perguntando}
              className={cn(
                "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md",
                "bg-primary text-primary-foreground transition-colors",
                "hover:bg-primary/90 disabled:opacity-50"
              )}
              aria-label="Enviar pergunta"
            >
              {perguntando ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="size-4" aria-hidden="true" />
              )}
            </button>
          </div>
          <p className="mt-1.5 text-[10px] text-muted-foreground">
            Enter envia. Shift+Enter quebra linha. Sem dados pessoais (LGPD).
          </p>
        </form>
      </aside>
    </>
  )
}

// --------------------------------------------------------------------
// Estado inicial (sem mensagens)
// --------------------------------------------------------------------
function EstadoInicial({ onSugestao }: { onSugestao: (s: string) => void }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-foreground">
        Comece perguntando algo:
      </h3>
      <ul className="space-y-1.5">
        {PERGUNTAS_SUGERIDAS.map((p) => (
          <li key={p}>
            <button
              type="button"
              onClick={() => onSugestao(p)}
              className="group flex w-full items-start gap-2 rounded-md border border-border bg-background p-2.5 text-left text-sm transition-colors hover:border-primary/40 hover:bg-accent/30"
            >
              <Sparkles
                className="mt-0.5 size-3.5 shrink-0 text-primary/70"
                aria-hidden="true"
              />
              <span className="text-foreground">{p}</span>
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4 rounded-md border border-secondary/30 bg-secondary/10 p-2 text-xs text-foreground">
        Diferente da Juçara (chatbot oficial), eu tenho acesso direto à
        base do portal e cito fonte oficial em toda resposta.
      </div>
    </div>
  )
}

// --------------------------------------------------------------------
// Bolha de mensagem (pergunta, resposta ou erro)
// --------------------------------------------------------------------
function Bolha({ mensagem }: { mensagem: MensagemConversa }) {
  if (mensagem.tipo === "pergunta") {
    return (
      <div className="ml-6 rounded-lg rounded-tr-sm bg-primary px-3 py-2 text-sm text-primary-foreground">
        {mensagem.texto}
      </div>
    )
  }

  if (mensagem.tipo === "erro") {
    return (
      <div className="mr-6 flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
        <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
        <span>{mensagem.texto}</span>
      </div>
    )
  }

  // Resposta
  const { resposta, fontes, modo } = mensagem.data
  return (
    <div className="mr-6 space-y-2">
      <div className="rounded-lg rounded-tl-sm border border-border bg-card p-3 text-sm text-foreground">
        {resposta.split("\n\n").map((paragrafo, i) => (
          <p key={i} className={i > 0 ? "mt-2" : ""}>
            {paragrafo}
          </p>
        ))}
      </div>

      {/* Modo da resposta */}
      <div className="flex items-center gap-1.5 px-1 text-[10px] text-muted-foreground">
        {modo === "cache" && (
          <>
            <Database className="size-3" aria-hidden="true" />
            <span>Resposta em cache</span>
          </>
        )}
        {modo === "anthropic" && (
          <>
            <Zap className="size-3" aria-hidden="true" />
            <span>Gerado por IA</span>
          </>
        )}
        {modo === "fallback" && (
          <>
            <CircleAlert className="size-3" aria-hidden="true" />
            <span>Resposta padrão</span>
          </>
        )}
      </div>

      {/* Fontes */}
      {fontes.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Fontes
          </p>
          <ul className="space-y-1">
            {fontes.map((f, i) => (
              <li key={i}>
                <a
                  href={f.url}
                  target={f.url.startsWith("http") ? "_blank" : undefined}
                  rel={f.url.startsWith("http") ? "noreferrer" : undefined}
                  className="inline-flex items-center gap-1 rounded-sm bg-muted/40 px-2 py-1 text-xs text-foreground transition-colors hover:bg-muted hover:text-primary"
                >
                  <span>{f.titulo}</span>
                  {f.url.startsWith("http") && (
                    <ExternalLink className="size-3 shrink-0" aria-hidden="true" />
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

function BolhaCarregando() {
  return (
    <div className="mr-6 inline-flex items-center gap-2 rounded-lg rounded-tl-sm border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
      <Loader2 className="size-3 animate-spin" aria-hidden="true" />
      <span>Pensando...</span>
    </div>
  )
}
