import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowLeft,
  Users,
  TrendingUp,
  Wallet,
  Sparkles,
  Search,
} from "lucide-react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { BottomNav } from "@/components/layout/BottomNav"
import { CARGOS_CATALOG, EIXOS_DOS_CARGOS } from "@/data/cargos-catalog"
import type { CargoCatalog } from "@/data/cargos-catalog"
import { cn, formatBRL, formatNumber } from "@/lib/utils"

/**
 * Catálogo de cargos do Estado.
 *
 * Página servida em /cargos. Mostra todos os cargos da rede estadual
 * organizados por eixo da vida do cidadão, com folha consolidada,
 * número de servidores e salário médio. Click em um cargo leva ao
 * dashboard agregado (/detalhe) que tem o histórico do cargo +
 * lista de servidores individuais clicáveis.
 */

type FiltroEixo = "todos" | string

export function Cargos() {
  const [filtroEixo, setFiltroEixo] = useState<FiltroEixo>("todos")
  const [filtroTexto, setFiltroTexto] = useState("")

  const cargosFiltrados = useMemo(() => {
    const texto = filtroTexto.trim().toLowerCase()
    return CARGOS_CATALOG.filter((c) => {
      const passaEixo = filtroEixo === "todos" || c.eixoSlug === filtroEixo
      const passaTexto =
        texto.length === 0 ||
        c.nome.toLowerCase().includes(texto) ||
        c.descricaoCidada.toLowerCase().includes(texto)
      return passaEixo && passaTexto
    })
  }, [filtroEixo, filtroTexto])

  const totalFolha = cargosFiltrados.reduce(
    (s, c) => s + c.totalFolhaMensalMi,
    0
  )
  const totalServidores = cargosFiltrados.reduce(
    (s, c) => s + c.numServidores,
    0
  )

  return (
    <div className="min-h-svh bg-background text-foreground pb-16 md:pb-0">
      <a href="#main" className="skip-link">
        Pular para o conteúdo
      </a>
      <Header />

      <main id="main">
        {/* Cabeçalho */}
        <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-accent/40 via-background to-background">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-16 size-72 rounded-full bg-primary/10 blur-3xl"
          />
          <div className="container-page relative px-4 py-6">
            <Link
              to="/busca"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              <ArrowLeft className="size-3.5" aria-hidden="true" />
              Voltar para a busca
            </Link>

            <div className="mt-3 flex flex-wrap items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Users className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium uppercase tracking-wider text-primary">
                  Catálogo de cargos
                </p>
                <h1 className="mt-0.5 font-display text-2xl font-bold tracking-tight md:text-3xl">
                  Todos os cargos do Estado
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  Explore os cargos da rede estadual por eixo. Em cada cargo
                  você encontra a folha consolidada, total de servidores e o
                  histórico individual.
                </p>
              </div>
            </div>

            {/* Métricas agregadas (filtradas) */}
            <dl className="mt-5 grid grid-cols-3 gap-3">
              <div className="rounded-md border border-border bg-card p-3">
                <dt className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Cargos exibidos
                </dt>
                <dd className="mt-1 font-display text-xl font-bold tabular text-foreground">
                  {cargosFiltrados.length}
                </dd>
              </div>
              <div className="rounded-md border border-border bg-card p-3">
                <dt className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Folha total mensal
                </dt>
                <dd className="mt-1 font-display text-xl font-bold tabular text-primary">
                  R$ {totalFolha.toFixed(0)} mi
                </dd>
              </div>
              <div className="rounded-md border border-border bg-card p-3">
                <dt className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Servidores
                </dt>
                <dd className="mt-1 font-display text-xl font-bold tabular text-success">
                  {formatNumber(totalServidores)}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        {/* Filtros */}
        <section className="container-page px-4 py-5">
          {/* Busca por nome */}
          <div className="relative mb-4 max-w-md">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <input
              type="search"
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              placeholder="Filtrar cargo por nome (ex: professor, médico)"
              maxLength={120}
              className={cn(
                "h-11 w-full rounded-md border border-border bg-background pl-9 pr-3 text-sm text-foreground",
                "placeholder:text-muted-foreground/70",
                "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              )}
              aria-label="Filtrar cargos pelo nome"
            />
          </div>

          {/* Chips de eixo */}
          <div
            role="tablist"
            aria-label="Filtrar por eixo"
            className="-mx-1 flex flex-wrap gap-1.5 overflow-x-auto"
          >
            <FiltroChip
              ativo={filtroEixo === "todos"}
              onClick={() => setFiltroEixo("todos")}
            >
              Todos os eixos
            </FiltroChip>
            {EIXOS_DOS_CARGOS.map((e) => (
              <FiltroChip
                key={e.slug}
                ativo={filtroEixo === e.slug}
                onClick={() => setFiltroEixo(e.slug)}
              >
                {e.nome}
              </FiltroChip>
            ))}
          </div>
        </section>

        {/* Grid de cargos */}
        <section className="container-page px-4 pb-10">
          {cargosFiltrados.length === 0 ? (
            <div className="rounded-lg border border-border bg-card p-8 text-center">
              <Search
                className="mx-auto size-8 text-muted-foreground/60"
                aria-hidden="true"
              />
              <p className="mt-3 text-sm font-medium text-foreground">
                Nenhum cargo encontrado para o filtro atual
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Tente outro nome ou troque o eixo
              </p>
            </div>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {cargosFiltrados.map((cargo) => (
                <li key={`${cargo.eixoSlug}-${cargo.nome}`}>
                  <CardCargo cargo={cargo} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Nota de fonte */}
        <section className="container-page px-4 pb-8">
          <p className="rounded-md border border-secondary/30 bg-secondary/10 p-3 text-xs text-foreground">
            Catálogo construído a partir de modelo de consolidação para fins de
            demonstração. Em produção, virá da Folha de Pagamento oficial via
            API do Portal da Transparência. Nomes individuais nas páginas de
            detalhe são fictícios e o CPF é sempre mascarado por LGPD.
          </p>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  )
}

function FiltroChip({
  ativo,
  onClick,
  children,
}: {
  ativo: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={ativo}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        ativo
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-accent/40 hover:text-primary"
      )}
    >
      {children}
    </button>
  )
}

function CardCargo({ cargo }: { cargo: CargoCatalog }) {
  const href = `/detalhe?q=${encodeURIComponent(cargo.q)}&tipo=cargo&eixo=${cargo.eixoSlug}`
  return (
    <Link
      to={href}
      aria-label={`Ver detalhamento do cargo ${cargo.nome} no eixo ${cargo.eixoNome}`}
      className={cn(
        "group flex h-full flex-col gap-3 rounded-xl border border-border/70 bg-card p-4",
        "shadow-[0_1px_2px_rgba(0,0,0,0.04),_0_8px_22px_-10px_rgba(0,0,0,0.08)]",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_4px_12px_rgba(34,90,161,0.08),_0_16px_36px_-12px_rgba(34,90,161,0.16)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      )}
    >
      <header className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
            {cargo.eixoNome}
          </p>
          <h3 className="mt-0.5 font-display text-lg font-bold leading-tight text-foreground transition-colors group-hover:text-primary">
            {cargo.nome}
          </h3>
        </div>
        {cargo.destaque && (
          <span
            className="inline-flex shrink-0 items-center gap-1 rounded-full bg-secondary/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-secondary-foreground"
            title="Cargo de alto volume"
          >
            <Sparkles className="size-2.5" aria-hidden="true" />
            destaque
          </span>
        )}
      </header>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {cargo.descricaoCidada}
      </p>

      <dl className="mt-auto grid grid-cols-3 gap-2 border-t border-border pt-3">
        <div>
          <dt className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
            <Wallet className="size-2.5" aria-hidden="true" />
            Folha mensal
          </dt>
          <dd className="mt-0.5 font-display text-sm font-bold tabular text-primary">
            R$ {cargo.totalFolhaMensalMi} mi
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
            <Users className="size-2.5" aria-hidden="true" />
            Servidores
          </dt>
          <dd className="mt-0.5 font-display text-sm font-bold tabular text-foreground">
            {formatNumber(cargo.numServidores)}
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1 text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
            <TrendingUp className="size-2.5" aria-hidden="true" />
            Médio
          </dt>
          <dd className="mt-0.5 font-display text-sm font-bold tabular text-success">
            {formatBRL(cargo.salarioMedio)}
          </dd>
        </div>
      </dl>
    </Link>
  )
}
