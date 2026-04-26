import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
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

// Mapeia o tipo da consulta para o tipo aceito pela rota /detalhe.
// "servidor" vira "cargo" porque a página de detalhe agrupa por cargo.
const TIPO_PARA_DETALHE: Record<TipoConsulta, "municipio" | "orgao" | "fornecedor" | "cargo"> = {
  municipio: "municipio",
  orgao: "orgao",
  fornecedor: "fornecedor",
  servidor: "cargo",
}

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

// Cargos populares por eixo - chips de descoberta rápida quando o cidadão
// escolhe "Por cargo". Click no chip preenche o campo e dispara a busca.
const CARGOS_POPULARES: Record<string, string[]> = {
  educacao: ["Professor", "Diretor Escolar", "Coordenador Pedagógico", "Bibliotecário"],
  saude: ["Médico", "Enfermeiro", "Técnico de Enfermagem", "Farmacêutico"],
  seguranca: ["Soldado", "Sargento", "Delegado", "Bombeiro", "Agente Penitenciário"],
  obras: ["Engenheiro Civil", "Arquiteto", "Topógrafo", "Técnico em Obras"],
  habitacao: ["Engenheiro", "Arquiteto", "Assistente Social"],
  "programas-sociais": ["Assistente Social", "Psicólogo", "Educador Social"],
  "cultura-esporte": ["Técnico Esportivo", "Produtor Cultural", "Bibliotecário"],
  "meio-ambiente": ["Analista Ambiental", "Fiscal de Meio Ambiente"],
  "gestao-publica": ["Auditor", "Analista Tributário", "Assessor", "Procurador"],
}

// Sugestões contextuais por eixo. Sobrescrevem placeholder/ajuda dos TIPOS
// para guiar o cidadão a cargos, órgãos e fornecedores plausíveis no contexto
// daquele eixo (evita pesquisar "Professor" em Obras, por exemplo).
const SUGESTOES_POR_EIXO: Record<
  string,
  Partial<Record<TipoConsulta, { placeholder: string; ajuda: string }>>
> = {
  "gestao-publica": {
    servidor: {
      placeholder: "Ex: Auditor, Analista, Assessor",
      ajuda: "Cargos da administração estadual",
    },
    orgao: {
      placeholder: "Ex: SEAD, SEFAZ, Casa Civil",
      ajuda: "Órgãos transversais do Estado",
    },
    fornecedor: {
      placeholder: "Ex: empresa de TI, segurança patrimonial",
      ajuda: "Fornecedores transversais ao Estado",
    },
  },
  educacao: {
    servidor: {
      placeholder: "Ex: Professor, Diretor, Coordenador Pedagógico",
      ajuda: "Cargos do magistério e coordenação escolar",
    },
    orgao: {
      placeholder: "Ex: SEDUC, IEMA, UEMA",
      ajuda: "Secretarias e autarquias de ensino",
    },
    fornecedor: {
      placeholder: "Ex: editora de livros, empresa de merenda",
      ajuda: "Fornecedores do setor educação",
    },
  },
  saude: {
    servidor: {
      placeholder: "Ex: Médico, Enfermeiro, Técnico de Enfermagem",
      ajuda: "Cargos da rede pública de saúde",
    },
    orgao: {
      placeholder: "Ex: SES, EMSERH, HUUFMA",
      ajuda: "Secretarias e hospitais públicos",
    },
    fornecedor: {
      placeholder: "Ex: laboratório, distribuidora de medicamentos",
      ajuda: "Fornecedores do setor saúde",
    },
  },
  seguranca: {
    servidor: {
      placeholder: "Ex: Soldado, Sargento, Agente Penitenciário",
      ajuda: "Cargos das forças de segurança",
    },
    orgao: {
      placeholder: "Ex: PMMA, PCMA, CBMMA, SEAP",
      ajuda: "Polícias, bombeiros e secretarias",
    },
    fornecedor: {
      placeholder: "Ex: fabricante de viatura, equipamento tático",
      ajuda: "Fornecedores da segurança pública",
    },
  },
  habitacao: {
    servidor: {
      placeholder: "Ex: Engenheiro, Arquiteto, Assistente Social",
      ajuda: "Cargos ligados à habitação social",
    },
    orgao: {
      placeholder: "Ex: SECID, COHAB",
      ajuda: "Órgãos de habitação e desenvolvimento urbano",
    },
    fornecedor: {
      placeholder: "Ex: construtora habitacional",
      ajuda: "Construtoras e empreiteiras de habitação",
    },
  },
  "programas-sociais": {
    servidor: {
      placeholder: "Ex: Assistente Social, Psicólogo",
      ajuda: "Cargos da assistência social",
    },
    orgao: {
      placeholder: "Ex: SEDIHPOP, SEAS",
      ajuda: "Secretarias de assistência e direitos humanos",
    },
    fornecedor: {
      placeholder: "Ex: distribuidora de cestas básicas",
      ajuda: "Fornecedores de programas sociais",
    },
  },
  obras: {
    servidor: {
      placeholder: "Ex: Engenheiro Civil, Técnico em Obras, Topógrafo",
      ajuda: "Cargos da área de infraestrutura",
    },
    orgao: {
      placeholder: "Ex: SINFRA, DER, SECID",
      ajuda: "Secretarias e autarquias de obras",
    },
    fornecedor: {
      placeholder: "Ex: construtora, empreiteira",
      ajuda: "Construtoras e empreiteiras contratadas",
    },
  },
  "cultura-esporte": {
    servidor: {
      placeholder: "Ex: Técnico Esportivo, Produtor Cultural",
      ajuda: "Cargos da cultura e esporte",
    },
    orgao: {
      placeholder: "Ex: SECTUR, SECMA",
      ajuda: "Secretarias de cultura, turismo e esporte",
    },
    fornecedor: {
      placeholder: "Ex: produtora cultural, equipamento esportivo",
      ajuda: "Fornecedores do setor cultural",
    },
  },
  "meio-ambiente": {
    servidor: {
      placeholder: "Ex: Analista Ambiental, Fiscal de Meio Ambiente",
      ajuda: "Cargos da gestão ambiental",
    },
    orgao: {
      placeholder: "Ex: SEMA, IEMA",
      ajuda: "Secretarias e autarquias ambientais",
    },
    fornecedor: {
      placeholder: "Ex: empresa de monitoramento ambiental",
      ajuda: "Fornecedores ambientais",
    },
  },
}

export function ConsultaEspecifica({ eixoSlug }: { eixoSlug: string }) {
  const [tipo, setTipo] = useState<TipoConsulta>("municipio")
  const [filtro, setFiltro] = useState("")
  const [ano, setAno] = useState<number>(2026)
  const [buscando, setBuscando] = useState(false)
  const [resultados, setResultados] = useState<Resultado[] | null>(null)

  const tipoAtual = useMemo(() => {
    const base = TIPOS.find((t) => t.id === tipo) ?? TIPOS[0]
    const override = SUGESTOES_POR_EIXO[eixoSlug]?.[tipo]
    if (override) {
      return { ...base, placeholder: override.placeholder, ajuda: override.ajuda }
    }
    return base
  }, [tipo, eixoSlug])

  function limpar() {
    setFiltro("")
    setResultados(null)
  }

  function buscar(e: React.FormEvent | null, valorOverride?: string) {
    e?.preventDefault()
    const valor = valorOverride ?? filtro
    if (!valor.trim()) return
    setBuscando(true)
    setResultados(null)
    // Stub: Simula busca + retorna resultados mockados realistas
    setTimeout(() => {
      setResultados(gerarResultadosMock(tipo, eixoSlug, valor, ano))
      setBuscando(false)
    }, 600)
  }

  // Cargos populares por eixo (chips de descoberta rápida)
  const cargosPopulares = CARGOS_POPULARES[eixoSlug] ?? []
  const mostrarChipsCargos = tipo === "servidor" && cargosPopulares.length > 0

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

        {/* Chips de cargos populares (descoberta rápida) */}
        {mostrarChipsCargos && (
          <div className="mt-4">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Cargos populares neste eixo:
            </p>
            <div className="flex flex-wrap gap-2">
              {cargosPopulares.map((cargo) => (
                <button
                  key={cargo}
                  type="button"
                  onClick={() => {
                    setFiltro(cargo)
                    buscar(null, cargo)
                  }}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                    filtro === cargo
                      ? "border-primary/40 bg-primary/10 text-primary"
                      : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-accent/40 hover:text-primary"
                  )}
                >
                  <User className="size-3" aria-hidden="true" />
                  {cargo}
                </button>
              ))}
            </div>
          </div>
        )}

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
              {resultados.map((r, i) => {
                const href = `/detalhe?q=${encodeURIComponent(filtro)}&tipo=${TIPO_PARA_DETALHE[tipo]}&eixo=${encodeURIComponent(eixoSlug)}`
                return (
                  <li key={`${r.titulo}-${i}`}>
                    <Link
                      to={href}
                      aria-label={`Ver detalhes de ${r.titulo}`}
                      className={cn(
                        "group flex flex-col gap-1 rounded-md border border-border bg-background p-3 transition-colors",
                        "hover:border-primary/40 hover:bg-accent/30",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                        "sm:flex-row sm:items-center sm:gap-4"
                      )}
                    >
                      <div className="min-w-0 flex-1">
                        <h5 className="font-medium text-foreground group-hover:text-primary">
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
                        className="size-4 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                )
              })}
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
