import { TrendingUp, Sparkles, Activity, ArrowUpRight } from "lucide-react"
import { useTermosBuscados } from "@/hooks/useTermosBuscados"
import { formatNumber } from "@/lib/utils"

export function DashboardInicial({ onTermoClick }: { onTermoClick?: (termo: string) => void }) {
  const { termos, loading, error } = useTermosBuscados(12)

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card
        title="Termos mais buscados"
        icon={<TrendingUp className="size-5 text-primary" />}
        description="Últimos 30 dias, fonte oficial STC"
        className="md:col-span-2"
      >
        {loading && <Skeleton lines={6} />}
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
            {termos.map((t) => (
              <li key={t.termo}>
                <button
                  type="button"
                  onClick={() => onTermoClick?.(t.termo)}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm transition-colors hover:bg-accent hover:border-primary/40 focus-visible:bg-accent"
                >
                  <span className="font-medium">{t.termo}</span>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {formatNumber(t.total_buscas)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card
        title="Métricas em destaque"
        icon={<Sparkles className="size-5 text-secondary" />}
        description="Visão geral do portal"
      >
        <ul className="flex flex-col gap-3">
          <Metrica label="Categorias de informação" valor="115" />
          <Metrica label="Selo Diamante" valor="2x" />
          <Metrica label="Score TCE" valor="98,5" />
        </ul>
      </Card>

      <Card
        title="Atualizações recentes"
        icon={<Activity className="size-5 text-primary" />}
        description="Últimas mudanças no portal"
        className="md:col-span-3"
      >
        <ul className="grid gap-3 md:grid-cols-3">
          <Atualizacao
            quando="Agora há pouco"
            titulo="Remuneração de servidores"
            descricao="Folha do mês atualizada"
          />
          <Atualizacao
            quando="Hoje"
            titulo="Novos contratos publicados"
            descricao="12 contratos firmados esta semana"
          />
          <Atualizacao
            quando="Esta semana"
            titulo="Saúde"
            descricao="47 atualizações nos últimos 7 dias"
          />
        </ul>
      </Card>
    </div>
  )
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
  return (
    <section
      className={`rounded-lg border border-border bg-card p-4 ${className ?? ""}`}
      aria-labelledby={`card-${title}`}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 id={`card-${title}`} className="flex items-center gap-2 font-semibold">
            {icon}
            <span>{title}</span>
          </h3>
          {description && (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  )
}

function Metrica({ label, valor }: { label: string; valor: string }) {
  return (
    <li className="flex items-baseline justify-between gap-3 border-b border-border last:border-0 pb-2 last:pb-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-xl font-semibold tabular-nums">{valor}</span>
    </li>
  )
}

function Atualizacao({
  quando,
  titulo,
  descricao,
}: {
  quando: string
  titulo: string
  descricao: string
}) {
  return (
    <li className="flex flex-col gap-1 rounded-md border border-border p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-primary">
          {quando}
        </span>
        <ArrowUpRight className="size-4 text-muted-foreground" aria-hidden="true" />
      </div>
      <p className="font-medium">{titulo}</p>
      <p className="text-sm text-muted-foreground">{descricao}</p>
    </li>
  )
}

function Skeleton({ lines }: { lines: number }) {
  return (
    <div className="flex flex-wrap gap-2" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <span
          key={i}
          className="h-7 w-24 animate-pulse rounded-full bg-muted"
          style={{ width: `${60 + (i % 4) * 20}px` }}
        />
      ))}
    </div>
  )
}
