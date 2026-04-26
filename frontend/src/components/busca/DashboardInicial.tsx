import {
  TrendingUp,
  Sparkles,
  Activity,
  Award,
  Database,
  Layers,
  ArrowUpRight,
  Flame,
  Medal,
  Trophy,
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
  const maxBuscas = termos[0]?.total_buscas ?? 1

  const top3 = termos.slice(0, 3)
  const restante = termos.slice(3)

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

      {!loading && !error && top3.length > 0 && (
        <>
          {/* Podium: top 3 destacados como medalha (ouro / prata / bronze) */}
          <ul className="grid gap-2 sm:grid-cols-3">
            {top3.map((t, i) => {
              const proporcao = (t.total_buscas / maxBuscas) * 100
              return (
                <li key={t.termo}>
                  <PodiumItem
                    posicao={(i + 1) as 1 | 2 | 3}
                    termo={t.termo}
                    buscas={t.total_buscas}
                    proporcao={proporcao}
                    onClick={() => onTermoClick?.(t.termo)}
                  />
                </li>
              )
            })}
          </ul>

          {/* Restante: pills compactos */}
          {restante.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Também populares
              </p>
              <ul className="flex flex-wrap gap-1.5">
                {restante.map((t) => (
                  <li key={t.termo}>
                    <button
                      type="button"
                      onClick={() => onTermoClick?.(t.termo)}
                      className="group/pill inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-2.5 py-1 text-xs text-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-accent/40 hover:text-primary"
                    >
                      <TrendingUp
                        className="size-3 text-muted-foreground/50 transition-colors group-hover/pill:text-primary"
                        aria-hidden="true"
                      />
                      <span className="font-medium">{t.termo}</span>
                      <span className="tabular text-muted-foreground/70 group-hover/pill:text-primary/70">
                        {formatNumber(t.total_buscas)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </Card>
  )
}

/**
 * Item do podium dos termos mais buscados. As 3 primeiras posições
 * recebem destaque visual de "medalha":
 *  - 1º: ouro (mostarda institucional) com chama animada (trending hot)
 *  - 2º: prata (cinza claro) com troféu
 *  - 3º: bronze (laranja institucional) com medalha
 *
 * Cada item mostra uma mini progress bar com a proporção de buscas
 * em relação ao 1º colocado, dando contexto visual de quão "hot" é.
 */
function PodiumItem({
  posicao,
  termo,
  buscas,
  proporcao,
  onClick,
}: {
  posicao: 1 | 2 | 3
  termo: string
  buscas: number
  proporcao: number
  onClick: () => void
}) {
  const config = PODIUM_CONFIG[posicao]
  const Icon = config.icon

  return (
    <button
      type="button"
      onClick={onClick}
      data-podium="true"
      data-podium-pos={posicao}
      className={cn(
        "group/podium relative flex h-full w-full flex-col gap-2 overflow-hidden rounded-lg border-2 p-3 text-left",
        "transition-all duration-300 ease-out hover:-translate-y-0.5",
        config.borda,
        config.fundo,
        config.shadow
      )}
    >
      {/* Glow no canto superior direito */}
      <span
        aria-hidden="true"
        data-podium-glow="true"
        className={cn(
          "pointer-events-none absolute -right-6 -top-6 size-16 rounded-full blur-2xl",
          config.glow
        )}
      />

      <header className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1",
            config.badgeBg,
            config.badgeText,
            config.badgeRing
          )}
        >
          <Icon className="size-3" aria-hidden="true" />
          {posicao}º
        </span>
        {posicao === 1 && (
          <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-orange-500">
            <Flame className="size-3 animate-pulse" aria-hidden="true" />
            HOT
          </span>
        )}
      </header>

      <p className="line-clamp-2 text-sm font-semibold leading-tight text-foreground transition-colors group-hover/podium:text-primary">
        {termo}
      </p>

      <div className="mt-auto flex items-baseline gap-1">
        <span className="font-display text-lg font-bold tabular text-foreground">
          {formatNumber(buscas)}
        </span>
        <span className="text-[10px] text-muted-foreground">buscas</span>
      </div>

      {/* Mini progress bar mostrando proporção em relação ao 1º */}
      <div
        className="h-1 w-full overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-valuenow={Math.round(proporcao)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${Math.round(proporcao)}% das buscas do mais popular`}
      >
        <span
          aria-hidden="true"
          className={cn(
            "block h-full rounded-full transition-all duration-700 ease-out",
            config.barra
          )}
          style={{ width: `${proporcao}%` }}
        />
      </div>
    </button>
  )
}

const PODIUM_CONFIG = {
  1: {
    icon: Trophy,
    borda: "border-yellow-400/50",
    fundo: "bg-gradient-to-br from-yellow-50 via-card to-card",
    shadow:
      "shadow-[0_2px_4px_rgba(217,161,35,0.15),_0_10px_28px_-10px_rgba(217,161,35,0.30)] hover:shadow-[0_6px_16px_rgba(217,161,35,0.25),_0_22px_48px_-12px_rgba(217,161,35,0.45)]",
    glow: "bg-yellow-400/30",
    badgeBg: "bg-gradient-to-br from-yellow-400 to-yellow-500",
    badgeText: "text-yellow-950",
    badgeRing: "ring-yellow-500/30",
    barra: "bg-gradient-to-r from-yellow-400 to-yellow-500",
  },
  2: {
    icon: Medal,
    borda: "border-slate-300/60",
    fundo: "bg-gradient-to-br from-slate-50 via-card to-card",
    shadow:
      "shadow-[0_2px_4px_rgba(0,0,0,0.06),_0_10px_28px_-10px_rgba(0,0,0,0.12)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.08),_0_22px_48px_-12px_rgba(0,0,0,0.18)]",
    glow: "bg-slate-300/30",
    badgeBg: "bg-gradient-to-br from-slate-300 to-slate-400",
    badgeText: "text-slate-900",
    badgeRing: "ring-slate-400/30",
    barra: "bg-gradient-to-r from-slate-300 to-slate-400",
  },
  3: {
    icon: Medal,
    borda: "border-orange-400/50",
    fundo: "bg-gradient-to-br from-orange-50 via-card to-card",
    shadow:
      "shadow-[0_2px_4px_rgba(249,115,22,0.10),_0_10px_28px_-10px_rgba(249,115,22,0.22)] hover:shadow-[0_6px_16px_rgba(249,115,22,0.18),_0_22px_48px_-12px_rgba(249,115,22,0.36)]",
    glow: "bg-orange-400/25",
    badgeBg: "bg-gradient-to-br from-orange-500 to-orange-600",
    badgeText: "text-white",
    badgeRing: "ring-orange-500/30",
    barra: "bg-gradient-to-r from-orange-500 to-orange-600",
  },
} as const

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
      {/* Score TCE-MA: gauge circular como herói da seção */}
      <ScoreGauge score={98.5} max={100} />

      {/* Selo Diamante + Categorias: cards menores em grid */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <MetricaMini
          icon={<Award className="size-4" />}
          valor="2x"
          legenda="Selo Diamante"
          detalhe="Consecutivos"
          variant="mostarda"
        />
        <MetricaMini
          icon={<Layers className="size-4" />}
          valor="115"
          legenda="Categorias"
          detalhe="Auditadas"
          variant="azul"
        />
      </div>
    </Card>
  )
}

/**
 * Gauge circular SVG para o Score TCE-MA. Anel com gradiente azul que
 * preenche conforme a proporção score/max. Centro mostra o número e a
 * legenda. A animação no preenchimento é feita via stroke-dashoffset
 * (clássico SVG progress ring).
 */
function ScoreGauge({ score, max }: { score: number; max: number }) {
  const tamanho = 120
  const stroke = 10
  const raio = (tamanho - stroke) / 2
  const circ = 2 * Math.PI * raio
  const proporcao = Math.min(1, score / max)
  const offset = circ * (1 - proporcao)

  return (
    <div className="flex items-center gap-3">
      <div
        className="relative shrink-0"
        style={{ width: tamanho, height: tamanho }}
      >
        <svg
          width={tamanho}
          height={tamanho}
          viewBox={`0 0 ${tamanho} ${tamanho}`}
          aria-hidden="true"
          className="-rotate-90"
        >
          <defs>
            <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--info))" />
            </linearGradient>
          </defs>
          {/* Trilha (cinza claro) */}
          <circle
            cx={tamanho / 2}
            cy={tamanho / 2}
            r={raio}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth={stroke}
          />
          {/* Preenchimento (gradiente azul) */}
          <circle
            cx={tamanho / 2}
            cy={tamanho / 2}
            r={raio}
            fill="none"
            stroke="url(#gauge-grad)"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 1s ease-out",
            }}
          />
        </svg>
        {/* Centro: número grande + legenda */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-bold tabular leading-none text-foreground">
            {score.toString().replace(".", ",")}
          </span>
          <span className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            de {max}
          </span>
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-wider text-primary">
          Score TCE-MA
        </p>
        <p className="mt-1 text-sm font-semibold text-foreground">
          Transparência avaliada
        </p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Avaliação oficial do Tribunal de Contas do Estado, atualizada
          anualmente.
        </p>
      </div>
    </div>
  )
}

/**
 * Mini-card de métrica complementar (Selo Diamante, Categorias).
 * Variante de cor controla o tom do ícone e do gradient.
 */
function MetricaMini({
  icon,
  valor,
  legenda,
  detalhe,
  variant,
}: {
  icon: React.ReactNode
  valor: string
  legenda: string
  detalhe: string
  variant: "mostarda" | "azul"
}) {
  const config =
    variant === "mostarda"
      ? {
          iconBg: "bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground",
          iconShadow: "shadow-md shadow-secondary/30",
          glow: "bg-secondary/15",
        }
      : {
          iconBg: "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground",
          iconShadow: "shadow-md shadow-primary/30",
          glow: "bg-primary/15",
        }

  return (
    <div
      className="group/mini relative overflow-hidden rounded-lg border border-border/70 bg-background p-3 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-md"
      data-metrica-mini="true"
      data-metrica-variant={variant}
    >
      {/* Glow */}
      <span
        aria-hidden="true"
        data-metrica-glow="true"
        className={cn(
          "pointer-events-none absolute -right-4 -top-4 size-12 rounded-full blur-xl",
          config.glow
        )}
      />

      <span
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-md transition-transform duration-300 group-hover/mini:scale-105",
          config.iconBg,
          config.iconShadow
        )}
      >
        {icon}
      </span>
      <p className="mt-2 font-display text-xl font-bold tabular leading-none text-foreground">
        {valor}
      </p>
      <p className="mt-1 text-xs font-semibold text-foreground">{legenda}</p>
      <p className="text-[10px] text-muted-foreground">{detalhe}</p>
    </div>
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
    /** Determina o tom da bolinha da timeline: hoje fica pulsando */
    recencia: "hoje" | "semana" | "antes"
  }> = [
    {
      quando: "Atualizado hoje",
      titulo: "Remuneração de servidores",
      descricao: "Folha do mês publicada na madrugada",
      href: "/eixo/gestao-publica",
      recencia: "hoje",
    },
    {
      quando: "Esta semana",
      titulo: "Novos contratos",
      descricao: "12 contratos firmados nos últimos 7 dias",
      href: "/eixo/gestao-publica",
      recencia: "semana",
    },
    {
      quando: "Últimos 7 dias",
      titulo: "Saúde",
      descricao: "47 atualizações em programas e hospitais",
      href: "/eixo/saude",
      recencia: "antes",
    },
  ]

  return (
    <Card
      className={className}
      title="Atualizações recentes"
      icon={<Activity className="size-4" />}
      description="O que mudou no portal nos últimos dias"
    >
      {/* Timeline horizontal: bolinhas conectadas por linha contínua no
          topo, cards descendo de cada bolinha. O item "hoje" pulsa e
          puxa a cor primária para indicar atividade recente. */}
      <ol className="relative grid gap-x-3 gap-y-2 md:grid-cols-3">
        {/* Linha horizontal (atrás das bolinhas) - só aparece em md+ */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-[16%] right-[16%] top-3 hidden h-px bg-gradient-to-r from-primary via-border to-border md:block"
        />

        {items.map((item) => {
          const isHoje = item.recencia === "hoje"
          return (
            <li key={item.titulo} className="relative flex flex-col items-stretch pt-9">
              {/* Bolinha da timeline (centralizada no topo) */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-1/2 top-0 flex size-6 -translate-x-1/2 items-center justify-center rounded-full ring-4 ring-card",
                  isHoje
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                    : "bg-background text-muted-foreground"
                )}
              >
                {isHoje && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 animate-ping rounded-full bg-primary opacity-40"
                  />
                )}
                <span
                  className={cn(
                    "relative size-1.5 rounded-full",
                    isHoje ? "bg-primary-foreground" : "bg-current opacity-50"
                  )}
                />
              </span>

              <a
                href={item.href}
                className={cn(
                  "group/item flex h-full flex-col gap-1 rounded-lg border bg-background p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)]",
                  "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_4px_12px_rgba(34,90,161,0.08)]",
                  isHoje ? "border-primary/30 bg-accent/20" : "border-border/70"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                      isHoje
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {item.quando}
                  </span>
                  <ArrowUpRight
                    className="size-4 shrink-0 text-muted-foreground/60 transition-all duration-300 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 group-hover/item:text-primary"
                    aria-hidden="true"
                  />
                </div>
                <p className="font-semibold text-foreground transition-colors group-hover/item:text-primary">
                  {item.titulo}
                </p>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {item.descricao}
                </p>
              </a>
            </li>
          )
        })}
      </ol>
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
        "group relative overflow-hidden rounded-xl border border-border/70 bg-card p-5",
        "shadow-[0_1px_3px_rgba(0,0,0,0.04),_0_10px_28px_-12px_rgba(0,0,0,0.10)]",
        "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06),_0_18px_36px_-12px_rgba(0,0,0,0.14)]",
        className
      )}
      aria-labelledby={id}
    >
      <header className="mb-4 flex items-start gap-2.5">
        <span className="mt-0.5 flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary/15 to-primary/5 text-primary ring-1 ring-primary/15 transition-transform duration-300 group-hover:scale-105">
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
