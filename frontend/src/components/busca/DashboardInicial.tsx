import {
  TrendingUp,
  Sparkles,
  Activity,
  Award,
  Database,
  Layers,
  ArrowUpRight,
} from "lucide-react"
import { useTermosBuscados } from "@/hooks/useTermosBuscados"
import { formatNumber, cn } from "@/lib/utils"

export function DashboardInicial({
  onTermoClick,
}: {
  onTermoClick?: (termo: string) => void
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <TermosCard onTermoClick={onTermoClick} className="md:col-span-2" />
      <MetricasCard />
      <AtualizacoesCard className="md:col-span-3" />
    </div>
  )
}

// --------------------------------------------------------------------
// Card 1: Termos mais buscados
// --------------------------------------------------------------------
function TermosCard({
  onTermoClick,
  className,
}: {
  onTermoClick?: (termo: string) => void
  className?: string
}) {
  const { termos, loading, error } = useTermosBuscados(12)
  const total = termos.reduce((sum, t) => sum + t.total_buscas, 0)

  return (
    <Card
      className={className}
      title="Termos mais buscados"
      icon={<TrendingUp className="size-4" />}
      description={
        total > 0
          ? `${formatNumber(total)} buscas nos últimos meses, fonte STC`
          : "Histórico de buscas reais do portal"
      }
    >
      {loading && <SkeletonTags count={10} />}

      {error && (
        <p className="text-sm text-destructive">
          Não foi possível carregar agora. Tente novamente.
        </p>
      )}

      {!loading && !error && termos.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Sem dados ainda. Os termos aparecem conforme o uso.
        </p>
      )}

      {!loading && !error && termos.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {termos.map((t, i) => (
            <li key={t.termo}>
              <button
                type="button"
                onClick={() => onTermoClick?.(t.termo)}
                className={cn(
                  "group inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-sm transition-colors duration-200",
                  i === 0
                    ? "border-primary/40 bg-primary/5 text-primary hover:bg-primary/10"
                    : "border-border text-foreground hover:border-primary/40 hover:bg-accent/60"
                )}
              >
                <span className="font-medium">{t.termo}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 py-px text-xs tabular",
                    i === 0
                      ? "bg-primary/15 text-primary"
                      : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  )}
                >
                  {formatNumber(t.total_buscas)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}

// --------------------------------------------------------------------
// Card 2: Métricas em destaque
// --------------------------------------------------------------------
function MetricasCard() {
  return (
    <Card
      title="Métricas em destaque"
      icon={<Sparkles className="size-4" />}
      description="Visão geral do portal"
    >
      <ul className="flex flex-col divide-y divide-border">
        <Metrica
          icon={<Layers className="size-4 text-muted-foreground" />}
          label="Categorias de informação"
          valor="115"
        />
        <Metrica
          icon={<Award className="size-4 text-secondary" />}
          label="Selo Diamante"
          valor="2x"
          legenda="consecutivos"
        />
        <Metrica
          icon={<Database className="size-4 text-primary" />}
          label="Score TCE-MA"
          valor="98,5"
          legenda="de 100"
        />
      </ul>
    </Card>
  )
}

// --------------------------------------------------------------------
// Card 3: Atualizações recentes
// --------------------------------------------------------------------
function AtualizacoesCard({ className }: { className?: string }) {
  const items: Array<{
    quando: string
    titulo: string
    descricao: string
    href: string
  }> = [
    {
      quando: "Atualizado hoje",
      titulo: "Remuneração de servidores",
      descricao: "Folha do mês publicada na madrugada",
      href: "/eixo/gestao-publica",
    },
    {
      quando: "Esta semana",
      titulo: "Novos contratos",
      descricao: "12 contratos firmados nos últimos 7 dias",
      href: "/eixo/gestao-publica",
    },
    {
      quando: "Últimos 7 dias",
      titulo: "Saúde",
      descricao: "47 atualizações em programas e hospitais",
      href: "/eixo/saude",
    },
  ]

  return (
    <Card
      className={className}
      title="Atualizações recentes"
      icon={<Activity className="size-4" />}
      description="O que mudou no portal nos últimos dias"
    >
      <ul className="grid gap-3 md:grid-cols-3">
        {items.map((item) => (
          <li key={item.titulo}>
            <a
              href={item.href}
              className="group flex h-full flex-col gap-1.5 rounded-md border border-border p-3 transition-colors duration-200 hover:border-primary/40 hover:bg-accent/40"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-primary">
                  {item.quando}
                </span>
                <ArrowUpRight
                  className="size-4 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary"
                  aria-hidden="true"
                />
              </div>
              <p className="font-medium text-foreground">{item.titulo}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.descricao}
              </p>
            </a>
          </li>
        ))}
      </ul>
    </Card>
  )
}

// --------------------------------------------------------------------
// Helpers de UI
// --------------------------------------------------------------------
function slugifyId(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function Card({
  title,
  description,
  icon,
  children,
  className,
}: {
  title: string
  description?: string
  icon: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  const id = `card-${slugifyId(title)}`
  return (
    <section
      className={cn(
        "rounded-lg border border-border bg-card p-4 shadow-sm",
        className
      )}
      aria-labelledby={id}
    >
      <header className="mb-3 flex items-start gap-2">
        <span className="mt-0.5 flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
          {icon}
        </span>
        <div className="min-w-0">
          <h3 id={id} className="font-semibold text-foreground">
            {title}
          </h3>
          {description && (
            <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </header>
      {children}
    </section>
  )
}

function Metrica({
  icon,
  label,
  valor,
  legenda,
}: {
  icon?: React.ReactNode
  label: string
  valor: string
  legenda?: string
}) {
  return (
    <li className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-semibold text-foreground tabular">
          {valor}
        </span>
        {legenda && (
          <span className="text-xs text-muted-foreground">{legenda}</span>
        )}
      </div>
    </li>
  )
}

function SkeletonTags({ count }: { count: number }) {
  return (
    <div className="flex flex-wrap gap-2" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className="h-7 animate-pulse rounded-full bg-muted"
          style={{ width: `${72 + ((i * 17) % 80)}px` }}
        />
      ))}
    </div>
  )
}
