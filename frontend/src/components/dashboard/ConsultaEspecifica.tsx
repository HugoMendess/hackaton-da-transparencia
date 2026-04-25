import { useMemo, useState } from "react"
import {
  MapPin,
  Building2,
  Briefcase,
  User,
  Search,
  Loader2,
  Filter,
  ArrowRight,
  Sparkles,
  type LucideIcon,
} from "lucide-react"
import { cn, formatBRL, formatNumber } from "@/lib/utils"

/**
 * Consulta específica por eixo.
 *
 * Inspirada na "Pesquisa Avançada" e "Despesas" do Portal MA atual,
 * mas refinada: filtros visuais com tabs e chips em vez de dropdowns
 * cinza, período em botões, resultado já com hierarquia visual.
 *
 * Cobre 4 tipos de consulta (municipio, orgao, fornecedor, servidor)
 * com filtros pré-aplicados ao eixo da página. Os resultados são
 * mockados realistas até a integração com o SIAFEM via Edge Function.
 */

type TipoConsulta = "municipio" | "orgao" | "fornecedor" | "servidor"

type Resultado = {
  titulo: string
  subtitulo: string
  valor: string
  detalhe: string
}

const TIPOS: Array<{
  id: TipoConsulta
  label: string
  labelMobile: string
  icon: LucideIcon
  placeholder: string
  ajuda: string
}> = [
  {
    id: "municipio",
    label: "Por município",
    labelMobile: "Município",
    icon: MapPin,
    placeholder: "Ex: São Luís, Imperatriz, Caxias",
    ajuda: "Veja os gastos consolidados por cidade do Maranhão",
  },
  {
    id: "orgao",
    label: "Por órgão",
    labelMobile: "Órgão",
    icon: Building2,
    placeholder: "Ex: SEDUC, SES, Polícia Civil",
    ajuda: "Filtre por secretaria, autarquia ou empresa pública",
  },
  {
    id: "fornecedor",
    label: "Por fornecedor",
    labelMobile: "Fornecedor",
    icon: Briefcase,
    placeholder: "Ex: nome da empresa ou CNPJ",
    ajuda: "Quem recebeu pagamentos do Estado neste eixo",
  },
  {
    id: "servidor",
    label: "Por cargo",
    labelMobile: "Cargo",
    icon: User,
    placeholder: "Ex: professor, médico, soldado",
    ajuda: "Remuneração consolidada por cargo (sem expor nomes)",
  },
]

const ANOS = [2024, 2025, 2026]

export function ConsultaEspecifica({ eixoSlug }: { eixoSlug: string }) {
  const [tipo, setTipo] = useState<TipoConsulta>("municipio")
  const [filtro, setFiltro] = useState("")
  const [ano, setAno] = useState<number>(2026)
  const [buscando, setBuscando] = useState(false)
  const [resultados, setResultados] = useState<Resultado[] | null>(null)

  const tipoAtual = useMemo(
    () => TIPOS.find((t) => t.id === tipo) ?? TIPOS[0],
    [tipo]
  )

  function limpar() {
    setFiltro("")
    setResultados(null)
  }

  function buscar(e: React.FormEvent) {
    e.preventDefault()
    setBuscando(true)
    setResultados(null)
    // Stub: Simula busca + retorna resultados mockados realistas
    setTimeout(() => {
      setResultados(gerarResultadosMock(tipo, eixoSlug, filtro, ano))
      setBuscando(false)
    }, 600)
  }

  return (
    <div className="rounded-lg border border-border bg-card shadow-sm">
      {/* Cabeçalho compacto */}
      <header className="flex items-start gap-3 border-b border-border p-4 md:p-5">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Filter className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-foreground">
            Encontre informações específicas
          </h3>
          <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
            Filtre por município, órgão, fornecedor ou cargo. Sem jargão, com
            os dados deste eixo já pré-aplicados.
          </p>
        </div>
      </header>

      <form onSubmit={buscar} className="p-4 md:p-5">
        {/* Tabs de tipo de consulta */}
        <div
          role="tablist"
          aria-label="Tipo de consulta"
          className="-mx-1 mb-5 flex flex-wrap gap-1 overflow-x-auto"
        >
          {TIPOS.map((t) => {
            const Icon = t.icon
            const ativo = tipo === t.id
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={ativo}
                onClick={() => {
                  setTipo(t.id)
                  setResultados(null)
                }}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  ativo
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">{t.label}</span>
                <span className="inline sm:hidden">{t.labelMobile}</span>
              </button>
            )
          })}
        </div>

        <p className="mb-3 text-xs text-muted-foreground">{tipoAtual.ajuda}</p>

        {/* Campo de filtro principal */}
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <div>
            <label
              htmlFor="filtro-consulta"
              className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground"
            >
              {tipoAtual.label.replace("Por ", "")}
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <input
                id="filtro-consulta"
                type="search"
                value={filtro}
                onChange={(e) => setFiltro(e.target.value)}
                maxLength={200}
                placeholder={tipoAtual.placeholder}
                autoComplete="off"
                className={cn(
                  "h-11 w-full rounded-md border border-border bg-background pl-9 pr-3 text-base text-foreground",
                  "placeholder:text-muted-foreground/70",
                  "transition-colors duration-200",
                  "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                )}
              />
            </div>
          </div>

          <div>
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Ano
            </span>
            <div role="radiogroup" aria-label="Ano de referência" className="flex gap-1">
              {ANOS.map((a) => {
                const ativo = ano === a
                return (
                  <button
                    key={a}
                    type="button"
                    role="radio"
                    aria-checked={ativo}
                    onClick={() => {
                      setAno(a)
                      setResultados(null)
                    }}
                    className={cn(
                      "h-11 min-w-touch rounded-md px-3 text-sm font-medium tabular transition-colors",
                      ativo
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-background text-foreground hover:bg-muted"
                    )}
                  >
                    {a}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={buscando || filtro.trim().length === 0}
            className={cn(
              "inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition-colors",
              "bg-primary text-primary-foreground hover:bg-primary/90",
              "disabled:opacity-50 disabled:hover:bg-primary"
            )}
          >
            {buscando ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles className="size-4" aria-hidden="true" />
            )}
            Buscar resultados
          </button>
          {(filtro.length > 0 || resultados) && (
            <button
              type="button"
              onClick={limpar}
              className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Limpar
            </button>
          )}
        </div>
      </form>

      {/* Resultados */}
      {(resultados || buscando) && (
        <div className="border-t border-border p-4 md:p-5">
          <header className="mb-3 flex items-baseline justify-between gap-2">
            <h4 className="text-sm font-semibold text-foreground">
              {buscando
                ? "Procurando..."
                : `${resultados?.length ?? 0} resultados encontrados`}
            </h4>
            {resultados && (
              <span className="text-xs text-muted-foreground">
                {tipoAtual.label} · ano {ano}
              </span>
            )}
          </header>

          {buscando ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-md bg-muted"
                  style={{ animationDelay: `${i * 80}ms` }}
                />
              ))}
            </div>
          ) : resultados && resultados.length > 0 ? (
            <ul className="space-y-2">
              {resultados.map((r, i) => (
                <li key={`${r.titulo}-${i}`}>
                  <article className="group flex flex-col gap-1 rounded-md border border-border bg-background p-3 transition-colors hover:border-primary/40 hover:bg-accent/30 sm:flex-row sm:items-center sm:gap-4">
                    <div className="min-w-0 flex-1">
                      <h5 className="font-medium text-foreground">
                        {r.titulo}
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        {r.subtitulo}
                      </p>
                    </div>
                    <div className="flex items-baseline gap-3 sm:flex-col sm:items-end sm:gap-0">
                      <span className="font-display text-base font-bold tabular text-primary sm:text-lg">
                        {r.valor}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {r.detalhe}
                      </span>
                    </div>
                    <ArrowRight
                      className="hidden size-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-primary sm:block"
                      aria-hidden="true"
                    />
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhum resultado para "{filtro}".
            </p>
          )}

          {resultados && resultados.length > 0 && (
            <p className="mt-3 rounded-md border border-secondary/30 bg-secondary/10 p-2 text-xs text-foreground">
              Resultados gerados a partir de modelo de consolidação. Em
              produção, virão diretamente do SIAFEM via Edge Function.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// --------------------------------------------------------------------
// Geração de resultados mockados (determinísticos por filtro)
// --------------------------------------------------------------------
function gerarResultadosMock(
  tipo: TipoConsulta,
  eixoSlug: string,
  filtro: string,
  ano: number
): Resultado[] {
  const seedBase = hashString(`${tipo}-${eixoSlug}-${filtro}-${ano}`)

  const templates: Record<TipoConsulta, (i: number) => Resultado> = {
    municipio: (i) => ({
      titulo: `${capitalize(filtro)} (município)`,
      subtitulo: `Detalhamento por categoria de gasto - ${ano}`,
      valor: formatBRL(((seedBase + i * 137) % 280 + 12) * 1_000_000),
      detalhe: `${formatNumber(((seedBase + i * 41) % 14) + 2)} obras ativas`,
    }),
    orgao: (i) => ({
      titulo: `${capitalize(filtro)} - dotação ${ano}`,
      subtitulo: `Empenhado, liquidado e pago consolidados`,
      valor: formatBRL(((seedBase + i * 211) % 580 + 80) * 1_000_000),
      detalhe: `${formatNumber(((seedBase + i * 61) % 850) + 200)} servidores`,
    }),
    fornecedor: (i) => ({
      titulo: `Pagamentos a ${capitalize(filtro)}`,
      subtitulo: `Notas e contratos no exercício ${ano}`,
      valor: formatBRL(((seedBase + i * 79) % 38 + 2) * 1_000_000),
      detalhe: `${formatNumber(((seedBase + i * 19) % 58) + 4)} notas pagas`,
    }),
    servidor: (i) => ({
      titulo: `Cargo: ${capitalize(filtro)}`,
      subtitulo: `Remuneração média mensal e total por cargo`,
      valor: formatBRL(((seedBase + i * 43) % 8 + 4) * 1_000),
      detalhe: `${formatNumber(((seedBase + i * 23) % 380) + 40)} servidores no cargo`,
    }),
  }

  const total = (seedBase % 4) + 3 // 3 a 6 resultados
  return Array.from({ length: total }, (_, i) => templates[tipo](i))
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
