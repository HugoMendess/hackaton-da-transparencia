import { useEffect, useMemo, useRef, useState } from "react"
import {
  Search,
  Sparkles,
  Loader2,
  X,
  Clock,
  TrendingUp,
  MapPin,
  Building2,
  Briefcase,
  User,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { BottomNav } from "@/components/layout/BottomNav"
import { DashboardInicial } from "@/components/busca/DashboardInicial"
import { useTermosBuscados } from "@/hooks/useTermosBuscados"
import { useBuscaHistorico } from "@/hooks/useBuscaHistorico"
import { cn, formatBRL, formatNumber } from "@/lib/utils"

type Atalho = {
  tipo: "municipio" | "orgao" | "fornecedor" | "cargo"
  label: string
  icone: LucideIcon
  exemplos: string[]
  cor: string
}

const ATALHOS: Atalho[] = [
  {
    tipo: "municipio",
    label: "Município",
    icone: MapPin,
    exemplos: ["São Luís", "Imperatriz", "Caxias"],
    cor: "from-emerald-500 to-emerald-600",
  },
  {
    tipo: "orgao",
    label: "Órgão",
    icone: Building2,
    exemplos: ["SEDUC", "SES", "Polícia Civil"],
    cor: "from-sky-500 to-sky-600",
  },
  {
    tipo: "fornecedor",
    label: "Fornecedor",
    icone: Briefcase,
    exemplos: ["Norcia", "Fast Ambiental", "CNPJ"],
    cor: "from-amber-500 to-amber-600",
  },
  {
    tipo: "cargo",
    label: "Cargo",
    icone: User,
    exemplos: ["Professor", "Médico", "Soldado"],
    cor: "from-rose-500 to-rose-600",
  },
]

type ResultadoMock = {
  titulo: string
  subtitulo: string
  valor: string
  detalhe: string
  href: string
}

export function Busca() {
  const [query, setQuery] = useState("")
  const [submitted, setSubmitted] = useState("")
  const [searching, setSearching] = useState(false)
  const [resultados, setResultados] = useState<ResultadoMock[] | null>(null)
  const [showSugestoes, setShowSugestoes] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const { termos: termosTop } = useTermosBuscados(15)
  const { historico, adicionar, remover, limpar } = useBuscaHistorico()

  const sugestoes = useMemo(() => {
    if (query.trim().length < 2) return []
    const q = query.toLowerCase()
    return termosTop
      .filter((t) => t.termo.toLowerCase().includes(q))
      .slice(0, 6)
  }, [query, termosTop])

  function executarBusca(termo: string) {
    const limpo = termo.trim()
    if (!limpo) return
    setSubmitted(limpo)
    setSearching(true)
    setShowSugestoes(false)
    setResultados(null)
    adicionar(limpo)

    // Stub: gera resultados mockados realistas
    setTimeout(() => {
      setResultados(gerarResultados(limpo))
      setSearching(false)
    }, 700)
  }

  function aplicarTermo(termo: string) {
    setQuery(termo)
    // Foca o input e rola pra ele para feedback visual imediato
    inputRef.current?.focus()
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    executarBusca(termo)
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    executarBusca(query)
  }

  // Fecha sugestões ao clicar fora
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!formRef.current?.contains(e.target as Node)) {
        setShowSugestoes(false)
      }
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  return (
    <div className="min-h-svh bg-background text-foreground pb-16 md:pb-0">
      <a href="#main" className="skip-link">Pular para o conteúdo</a>
      <Header />

      <main id="main">
        {/* Hero compacto + Input */}
        <section
          ref={formRef}
          className="border-b border-border bg-gradient-to-b from-accent/30 via-background to-background"
        >
          <div className="container-page px-4 py-6 md:py-8">
            <span className="text-xs font-medium uppercase tracking-wider text-primary">
              Busca em linguagem natural
            </span>
            <h1 className="mt-1 font-display text-2xl font-bold tracking-tight md:text-3xl">
              O que você procura no portal?
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Pergunte como você falaria com outra pessoa. Nada de termos técnicos.
            </p>

            <form
              onSubmit={onSubmit}
              role="search"
              aria-label="Buscar no portal"
              className="relative mt-4"
            >
              <label htmlFor="campo-busca" className="sr-only">
                Termo ou pergunta
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    ref={inputRef}
                    id="campo-busca"
                    type="search"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value)
                      setShowSugestoes(true)
                    }}
                    onFocus={() => setShowSugestoes(true)}
                    maxLength={500}
                    autoComplete="off"
                    placeholder="Ex: quanto foi gasto com merenda em São Luís este mês"
                    className={cn(
                      "h-12 w-full rounded-md border border-border bg-background pl-10 pr-10 text-base text-foreground",
                      "placeholder:text-muted-foreground/60",
                      "transition-colors duration-200",
                      "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    )}
                  />
                  {query.length > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery("")
                        setSubmitted("")
                        setResultados(null)
                        inputRef.current?.focus()
                      }}
                      className="absolute right-3 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label="Limpar busca"
                    >
                      <X className="size-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={query.trim().length === 0 || searching}
                  className={cn(
                    "inline-flex h-12 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition-colors duration-200",
                    "bg-primary text-primary-foreground hover:bg-primary/90",
                    "disabled:opacity-50 disabled:hover:bg-primary"
                  )}
                >
                  {searching ? (
                    <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                  ) : (
                    <Sparkles className="size-4" aria-hidden="true" />
                  )}
                  Buscar
                </button>
              </div>

              {/* Sugestões inline (autocomplete) */}
              {showSugestoes && sugestoes.length > 0 && (
                <div
                  role="listbox"
                  className="absolute left-0 right-0 top-full z-30 mt-1 max-h-80 overflow-auto rounded-md border border-border bg-card shadow-lg"
                >
                  <p className="border-b border-border bg-muted/40 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    Sugestões com base nos termos mais buscados
                  </p>
                  {sugestoes.map((s) => (
                    <button
                      key={s.termo}
                      type="button"
                      role="option"
                      aria-selected="false"
                      onClick={() => aplicarTermo(s.termo)}
                      className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-accent/60 focus-visible:bg-accent/60"
                    >
                      <span className="flex items-center gap-2">
                        <TrendingUp className="size-3.5 shrink-0 text-primary/70" aria-hidden="true" />
                        <span className="text-foreground">{s.termo}</span>
                      </span>
                      <span className="text-xs tabular text-muted-foreground">
                        {formatNumber(s.total_buscas)} buscas
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </form>

            {/* Histórico de buscas recentes */}
            {historico.length > 0 && !submitted && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3.5" aria-hidden="true" />
                  Recentes:
                </span>
                {historico.map((termo) => (
                  <span
                    key={termo}
                    className="group inline-flex items-center gap-1 rounded-full border border-border bg-card pl-3 text-xs"
                  >
                    <button
                      type="button"
                      onClick={() => aplicarTermo(termo)}
                      className="py-1 font-medium text-foreground transition-colors hover:text-primary"
                    >
                      {termo}
                    </button>
                    <button
                      type="button"
                      onClick={() => remover(termo)}
                      className="inline-flex size-5 items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
                      aria-label={`Remover ${termo} do histórico`}
                    >
                      <X className="size-3" aria-hidden="true" />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={limpar}
                  className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                >
                  limpar tudo
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Atalhos por tipo de consulta */}
        {!submitted && (
          <section
            aria-labelledby="atalhos-titulo"
            className="container-page px-4 py-6"
          >
            <header className="mb-3">
              <h2 id="atalhos-titulo" className="text-lg font-semibold tracking-tight">
                Buscar por tipo
              </h2>
              <p className="text-sm text-muted-foreground">
                Atalhos para os tipos de consulta mais comuns
              </p>
            </header>
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {ATALHOS.map((a) => (
                <li key={a.tipo}>
                  <button
                    type="button"
                    onClick={() => aplicarTermo(a.exemplos[0])}
                    className="group flex h-full w-full flex-col items-start gap-2 rounded-lg border border-border bg-card p-4 text-left transition-all duration-200 hover:border-primary/40 hover:shadow-md focus-visible:border-primary"
                  >
                    <span
                      className={cn(
                        "flex size-9 items-center justify-center rounded-md bg-gradient-to-br text-white shadow-sm",
                        a.cor
                      )}
                    >
                      <a.icone className="size-5" aria-hidden="true" />
                    </span>
                    <span className="font-semibold text-foreground">
                      Por {a.label}
                    </span>
                    <span className="text-xs leading-relaxed text-muted-foreground">
                      Ex: {a.exemplos.slice(0, 2).join(", ")}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Resultados */}
        {submitted && (
          <section
            aria-labelledby="resultados-titulo"
            className="container-page px-4 py-6"
          >
            <header className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h2 id="resultados-titulo" className="text-lg font-semibold tracking-tight">
                  {searching
                    ? "Procurando..."
                    : `${resultados?.length ?? 0} resultados`}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Para: <span className="font-medium text-foreground">{submitted}</span>
                </p>
              </div>
              {!searching && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("")
                    setSubmitted("")
                    setResultados(null)
                  }}
                  className="text-xs text-muted-foreground underline-offset-2 hover:text-primary hover:underline"
                >
                  Nova busca
                </button>
              )}
            </header>

            {searching ? (
              <ul className="space-y-2">
                {[0, 1, 2, 3].map((i) => (
                  <li
                    key={i}
                    className="h-20 animate-pulse rounded-md bg-muted"
                    style={{ animationDelay: `${i * 80}ms` }}
                  />
                ))}
              </ul>
            ) : resultados && resultados.length > 0 ? (
              <>
                <ul className="space-y-2">
                  {resultados.map((r, i) => (
                    <li key={i}>
                      <a
                        href={r.href}
                        className="group flex flex-col gap-1 rounded-md border border-border bg-card p-3 transition-colors duration-200 hover:border-primary/40 hover:bg-accent/30 sm:flex-row sm:items-center sm:gap-4"
                      >
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-foreground">
                            {r.titulo}
                          </h3>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {r.subtitulo}
                          </p>
                        </div>
                        <div className="flex items-baseline gap-3 sm:flex-col sm:items-end sm:gap-0">
                          <span className="font-display text-lg font-bold tabular text-primary">
                            {r.valor}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {r.detalhe}
                          </span>
                        </div>
                        <ArrowUpRight
                          className="hidden size-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary sm:block"
                          aria-hidden="true"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
                <p className="mt-4 rounded-md border border-secondary/30 bg-secondary/10 p-2 text-xs text-foreground">
                  Resultados gerados a partir de modelo de consolidação. Em
                  produção virão do SIAFEM via Edge Function com a AjudaInteligente.
                </p>
              </>
            ) : (
              <div className="rounded-lg border border-dashed border-border bg-muted/20 p-8 text-center">
                <Search className="mx-auto size-8 text-muted-foreground/60" aria-hidden="true" />
                <p className="mt-3 text-sm font-medium">
                  Nenhum resultado encontrado para "{submitted}"
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Tente reformular a busca ou usar um dos atalhos acima.
                </p>
              </div>
            )}
          </section>
        )}

        {/* Dashboard inicial (só quando não tem busca submetida) */}
        {!submitted && (
          <section className="container-page px-4 py-6">
            <DashboardInicial onTermoClick={aplicarTermo} />
          </section>
        )}
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}

// --------------------------------------------------------------------
// Geração de resultados mockados (determinístico por termo)
// --------------------------------------------------------------------
function gerarResultados(termo: string): ResultadoMock[] {
  const seed = hashString(termo)
  const eixosAplicaveis = [
    { slug: "gestao-publica", nome: "Gestão Pública" },
    { slug: "saude", nome: "Saúde e Bem-Estar" },
    { slug: "educacao", nome: "Educação e Futuro" },
  ]
  const total = (seed % 4) + 3
  return Array.from({ length: total }, (_, i) => {
    const eixo = eixosAplicaveis[i % eixosAplicaveis.length]
    const valor = ((seed + i * 137) % 280 + 12) * 1_000_000
    const tipos = [
      { lbl: "Despesa consolidada", det: "Acumulado em 2026" },
      { lbl: "Contratos vigentes", det: `${(seed + i * 19) % 24 + 3} contratos` },
      { lbl: "Folha mensal", det: "Última atualização: hoje" },
      { lbl: "Empenhos do mês", det: `${(seed + i * 41) % 58 + 8} empenhos` },
    ]
    const t = tipos[i % tipos.length]
    return {
      titulo: `${capitalize(termo)} - ${t.lbl}`,
      subtitulo: `${eixo.nome} - clique para detalhar`,
      valor: formatBRL(valor),
      detalhe: t.det,
      href: `/eixo/${eixo.slug}`,
    }
  })
}

function hashString(s: string): number {
  let h = 5381
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) | 0
  }
  return Math.abs(h) % 9999
}

function capitalize(s: string): string {
  return s.replace(/\b\w/g, (c) => c.toUpperCase())
}
