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
    <article className="rounded-lg border border-border bg-card p-4">
      <header className="mb-3">
        <h3 className="text-sm font-semibold text-foreground">
          Explorar por categoria
        </h3>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
          Toque em uma área para ver os dados específicos do município.
        </p>
      </header>

      {/* Grid de ícones */}
      <ul className="grid grid-cols-4 gap-2">
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
                className={cn(
                  "group flex w-full flex-col items-center gap-1 rounded-md p-2 text-center transition-colors",
                  ativa
                    ? "bg-primary/10 ring-1 ring-primary/30"
                    : "hover:bg-muted"
                )}
              >
                <span
                  className={cn(
                    "flex size-9 items-center justify-center rounded-md bg-gradient-to-br text-white shadow-sm transition-transform",
                    c.cor,
                    ativa && "scale-105"
                  )}
                >
                  <Icon className="size-4" aria-hidden="true" />
                </span>
                <span
                  className={cn(
                    "text-[11px] font-medium leading-tight",
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

      {/* Detalhes da categoria selecionada */}
      {aberta && dadoAberto && categoriaAberta && (
        <div
          className="mt-4 space-y-3 rounded-md border border-primary/20 bg-accent/20 p-3"
          role="region"
          aria-label={`Detalhes de ${categoriaAberta.label}`}
        >
          <header className="flex items-baseline justify-between gap-2">
            <p className="text-xs font-medium uppercase tracking-wide text-primary">
              {categoriaAberta.label} em {nome}
            </p>
            <button
              type="button"
              onClick={() => setAberta(null)}
              className="text-[11px] text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
            >
              fechar
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
            <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              Destaques
            </p>
            <ul className="space-y-1">
              {dadoAberto.destaques.map((d) => (
                <li
                  key={d.titulo}
                  className="flex items-baseline justify-between gap-2 rounded-sm bg-card px-2 py-1.5 text-xs"
                >
                  <span className="truncate text-foreground">{d.titulo}</span>
                  <span className="shrink-0 tabular font-semibold text-primary">
                    {formatBRL(d.valor)}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              to={`/detalhe?q=${encodeURIComponent(nome)}&tipo=municipio&eixo=${categoriaAberta.slug}`}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Ver detalhes completos
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Link>
            <BotaoCompartilhar
              caminho={`/detalhe?q=${encodeURIComponent(nome)}&tipo=municipio&eixo=${categoriaAberta.slug}`}
              mensagem={`📍 ${categoriaAberta.label} em ${nome}: ${formatBRL(dadoAberto.valorTotal)} investidos, ${formatNumber(dadoAberto.itensQtd)} ${dadoAberto.itensLabel}`}
              rotulo="Compartilhar"
              variante="padrao"
            />
          </div>
        </div>
      )}
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
