import { useState } from "react"
import { Link } from "react-router-dom"
import {
  Heart,
  GraduationCap,
  Shield,
  Home,
  HandHeart,
  Hammer,
  Users,
  ArrowRight,
  X,
  MousePointer2,
  type LucideIcon,
} from "lucide-react"
import { BotaoCompartilhar } from "@/components/compartilhar/BotaoCompartilhar"
import { cn, formatBRL, formatNumber } from "@/lib/utils"

/**
 * Categorias de drill-down por município.
 *
 * Aparece abaixo do PainelMunicipio quando há município selecionado
 * no mapa. 6 categorias clicáveis com ícone, expansão inline com
 * dados específicos da categoria no município, e botão para a
 * página de detalhe completa.
 */

type Categoria = {
  slug: string
  label: string
  icon: LucideIcon
  cor: string
}

const CATEGORIAS: Categoria[] = [
  {
    slug: "educacao",
    label: "Educação",
    icon: GraduationCap,
    cor: "from-blue-500 to-blue-600",
  },
  {
    slug: "saude",
    label: "Saúde",
    icon: Heart,
    cor: "from-emerald-500 to-emerald-600",
  },
  {
    slug: "obras",
    label: "Obras",
    icon: Hammer,
    cor: "from-indigo-500 to-indigo-600",
  },
  {
    slug: "seguranca",
    label: "Segurança",
    icon: Shield,
    cor: "from-rose-500 to-rose-600",
  },
  {
    slug: "programas-sociais",
    label: "Programas",
    icon: HandHeart,
    cor: "from-pink-500 to-pink-600",
  },
  {
    slug: "gestao-publica",
    label: "Gestão",
    icon: Users,
    cor: "from-amber-500 to-amber-600",
  },
  {
    slug: "habitacao",
    label: "Habitação",
    icon: Home,
    cor: "from-orange-500 to-orange-600",
  },
]

type DadoCategoria = {
  valorTotal: number
  itensQtd: number
  itensLabel: string
  destaques: { titulo: string; valor: number }[]
}

function gerarDadoCategoria(
  codarea: number,
  slug: string
): DadoCategoria {
  const seed = (codarea * 9301 + 49297 + hashString(slug)) % 233280
  const r = seed / 233280

  const valorTotal = Math.round((r * 80 + 8) * 1_000_000)
  const itensQtd = Math.floor(r * 60 + 6)

  const labelPorSlug: Record<string, string> = {
    educacao: "escolas estaduais",
    saude: "unidades de saúde",
    obras: "obras ativas",
    seguranca: "viaturas e unidades",
    "programas-sociais": "famílias atendidas",
    "gestao-publica": "servidores em exercício",
    habitacao: "unidades habitacionais",
  }

  const destaquesPorSlug: Record<string, string[]> = {
    educacao: ["Escola Estadual A", "Escola Técnica B", "IEMA Unidade C"],
    saude: ["Hospital Regional", "UPA Centro", "UBS Bairro Novo"],
    obras: ["Pavimentação Av. Principal", "Reforma da Praça", "Ponte do Rio"],
    seguranca: ["Batalhão da PM", "Delegacia Civil", "Companhia BM"],
    "programas-sociais": ["Maranhão Livre da Fome", "Bolsa Estudante", "Auxílio Habitação"],
    "gestao-publica": ["Folha de pessoal", "Diárias e indenizações", "Manutenção administrativa"],
    habitacao: ["Conjunto Habitacional A", "Programa Casa Boa", "Regularização Fundiária"],
  }

  const destaques = (destaquesPorSlug[slug] ?? ["Item 1", "Item 2", "Item 3"]).map(
    (titulo, i) => ({
      titulo,
      valor: Math.round(((r + i * 0.1) * 24 + 2) * 1_000_000),
    })
  )

  return {
    valorTotal,
    itensQtd,
    itensLabel: labelPorSlug[slug] ?? "itens",
    destaques,
  }
}

export function CategoriasMunicipio({
  codarea,
  nome,
}: {
  codarea: number
  nome: string
}) {
  const [aberta, setAberta] = useState<string | null>(null)
  const dadoAberto = aberta ? gerarDadoCategoria(codarea, aberta) : null
  const categoriaAberta = aberta
    ? CATEGORIAS.find((c) => c.slug === aberta)
    : null

  return (
    <article
      data-categorias-municipio="true"
      className="overflow-hidden rounded-xl border border-border/70 bg-card p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04),_0_10px_28px_-12px_rgba(0,0,0,0.10)]"
    >
      <header className="mb-4">
        <h3 className="text-base font-semibold text-foreground">
          Explorar {nome} por categoria
        </h3>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          Toque em uma área para ver os dados específicos do município à direita.
        </p>
      </header>

      {/* Layout horizontal:
          - Esquerda: grid de cards de categoria
          - Direita: detalhes da categoria aberta (ou hint quando nada aberto) */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        {/* Cards das 7 categorias */}
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4">
          {CATEGORIAS.map((c) => {
            const ativa = aberta === c.slug
            const Icon = c.icon
            return (
              <li key={c.slug}>
                <button
                  type="button"
                  onClick={() => setAberta(ativa ? null : c.slug)}
                  aria-pressed={ativa}
                  aria-label={`${c.label}, ver dados no município`}
                  data-categoria-btn="true"
                  className={cn(
                    "group flex w-full flex-col items-center gap-3 rounded-xl border p-5 text-center",
                    "transition-all duration-300 ease-out",
                    ativa
                      ? "border-primary/40 bg-accent/40 shadow-md ring-1 ring-primary/20"
                      : "border-border/60 bg-card hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted/40 hover:shadow-md"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-20 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg transition-transform duration-300 group-hover:scale-105",
                      c.cor,
                      ativa && "scale-110"
                    )}
                  >
                    <Icon className="size-10" aria-hidden="true" />
                  </span>
                  <span
                    className={cn(
                      "text-sm font-semibold leading-tight md:text-base",
                      ativa ? "text-primary" : "text-foreground"
                    )}
                  >
                    {c.label}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>

        {/* Detalhes da categoria selecionada (ou estado vazio) */}
        <div className="lg:border-l lg:border-border lg:pl-5">
          {aberta && dadoAberto && categoriaAberta ? (
            <div
              className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300"
              role="region"
              aria-label={`Detalhes de ${categoriaAberta.label}`}
            >
              <header className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-lg bg-gradient-to-br text-white shadow-md",
                      categoriaAberta.cor
                    )}
                  >
                    <categoriaAberta.icon className="size-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      Categoria selecionada
                    </p>
                    <h4 className="font-display text-base font-bold tracking-tight text-foreground">
                      {categoriaAberta.label} em {nome}
                    </h4>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAberta(null)}
                  className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Fechar detalhes"
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </header>

              <div className="grid grid-cols-2 gap-2">
                <Indicador
                  label="Investido"
                  valor={formatBRL(dadoAberto.valorTotal)}
                  legenda="Acumulado 2026"
                />
                <Indicador
                  label={capitalize(dadoAberto.itensLabel)}
                  valor={formatNumber(dadoAberto.itensQtd)}
                  legenda="No município"
                />
              </div>

              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Destaques
                </p>
                <ul className="space-y-1.5">
                  {dadoAberto.destaques.map((d) => (
                    <li
                      key={d.titulo}
                      className="flex items-baseline justify-between gap-2 rounded-md border border-border/60 bg-background px-3 py-2 text-xs transition-colors hover:border-primary/40"
                    >
                      <span className="truncate text-foreground">{d.titulo}</span>
                      <span className="shrink-0 tabular font-semibold text-primary">
                        {formatBRL(d.valor)}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col gap-2 pt-1 sm:flex-row">
                <Link
                  to={`/detalhe?q=${encodeURIComponent(nome)}&tipo=municipio&eixo=${categoriaAberta.slug}`}
                  className={cn(
                    "group/cta inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold",
                    "bg-gradient-to-br from-primary to-primary/85 text-primary-foreground",
                    "shadow-[0_2px_4px_rgba(34,90,161,0.20),_0_8px_18px_-6px_rgba(34,90,161,0.40)]",
                    "ring-1 ring-primary/30 transition-all duration-300 ease-out",
                    "hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(34,90,161,0.25),_0_12px_24px_-6px_rgba(34,90,161,0.55)]"
                  )}
                >
                  Ver detalhes completos
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover/cta:translate-x-0.5" aria-hidden="true" />
                </Link>
                <BotaoCompartilhar
                  caminho={`/detalhe?q=${encodeURIComponent(nome)}&tipo=municipio&eixo=${categoriaAberta.slug}`}
                  mensagem={`📍 ${categoriaAberta.label} em ${nome}: ${formatBRL(dadoAberto.valorTotal)} investidos, ${formatNumber(dadoAberto.itensQtd)} ${dadoAberto.itensLabel}`}
                  rotulo="Compartilhar"
                  variante="padrao"
                />
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border/70 bg-muted/20 p-6 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <MousePointer2 className="size-5" aria-hidden="true" />
              </span>
              <p className="text-sm font-semibold text-foreground">
                Toque em uma categoria
              </p>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Os indicadores de {nome} aparecem aqui assim que você
                escolher uma categoria à esquerda.
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

function Indicador({
  label,
  valor,
  legenda,
}: {
  label: string
  valor: string
  legenda?: string
}) {
  return (
    <div className="rounded-md border border-border bg-card p-2">
      <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 font-display text-lg font-bold leading-tight tabular text-foreground">
        {valor}
      </p>
      {legenda && (
        <p className="mt-0.5 text-[10px] text-muted-foreground">{legenda}</p>
      )}
    </div>
  )
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function hashString(s: string): number {
  let h = 5381
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) | 0
  }
  return Math.abs(h) % 9999
}
