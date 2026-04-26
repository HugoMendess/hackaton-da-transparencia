import { Users, Eye, Award, Database } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Temas de cor da identidade STC. Cada métrica escolhe um tema e ele
 * é aplicado de forma coerente no ícone, na faixa do rodapé, no glow
 * decorativo e nas sombras coloridas. As classes precisam ser strings
 * literais para o Tailwind detectar no scan estático.
 */
type Tema = {
  faixa: string
  iconBg: string
  iconText: string
  iconShadow: string
  glow: string
}

const TEMAS = {
  azul: {
    faixa: "bg-primary",
    iconBg: "bg-gradient-to-br from-primary to-primary/80",
    iconText: "text-primary-foreground",
    iconShadow: "shadow-md shadow-primary/30",
    glow: "bg-primary/15",
  },
  vermelho: {
    faixa: "bg-destructive",
    iconBg: "bg-gradient-to-br from-destructive to-destructive/80",
    iconText: "text-destructive-foreground",
    iconShadow: "shadow-md shadow-destructive/30",
    glow: "bg-destructive/15",
  },
  verde: {
    faixa: "bg-success",
    iconBg: "bg-gradient-to-br from-success to-success/80",
    iconText: "text-success-foreground",
    iconShadow: "shadow-md shadow-success/30",
    glow: "bg-success/15",
  },
  laranja: {
    faixa: "bg-orange-500",
    iconBg: "bg-gradient-to-br from-orange-500 to-orange-400",
    iconText: "text-white",
    iconShadow: "shadow-md shadow-orange-500/30",
    glow: "bg-orange-500/15",
  },
} as const satisfies Record<string, Tema>

type Metrica = {
  icon: typeof Users
  valor: string
  legenda: string
  detalhe: string
  destaque?: boolean
  tema: keyof typeof TEMAS
}

const METRICAS: Metrica[] = [
  {
    icon: Users,
    valor: "320 mil",
    legenda: "Cidadãos por ano",
    detalhe: "Maranhenses que acessam o portal",
    destaque: true,
    tema: "azul",
  },
  {
    icon: Eye,
    valor: "4 milhões",
    legenda: "Visualizações por ano",
    detalhe: "Mais que dobrou desde 2017",
    tema: "vermelho",
  },
  {
    icon: Award,
    valor: "Selo Diamante",
    legenda: "TCE-MA, 2x consecutivo",
    detalhe: "Score 98,5/100 em transparência",
    tema: "verde",
  },
  {
    icon: Database,
    valor: "115",
    legenda: "Categorias de informação",
    detalhe: "Mapeadas e auditadas",
    tema: "laranja",
  },
]

export function MetricasDestaque() {
  return (
    <section
      aria-labelledby="metricas-destaque-titulo"
      className="border-y border-border bg-card"
    >
      <div className="container-page px-4 py-8">
        <header className="mb-6 max-w-2xl">
          <span className="text-xs font-medium uppercase tracking-wider text-primary">
            O Portal da Transparência do MA hoje
          </span>
          <h2
            id="metricas-destaque-titulo"
            className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl"
          >
            Já é o portal mais acessado do Estado.
            <span className="text-muted-foreground"> Vamos torná-lo o mais usado.</span>
          </h2>
        </header>

        <ul className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {METRICAS.map((m) => {
            const Icon = m.icon
            const tema = TEMAS[m.tema]
            return (
              <li key={m.legenda}>
                <article
                  data-tema={m.tema}
                  data-metrica-card="true"
                  className={cn(
                    "group relative flex h-full flex-col gap-3 overflow-hidden rounded-xl border p-5",
                    "transition-all duration-300 ease-out",
                    "hover:-translate-y-0.5",
                    m.destaque
                      ? [
                          "border-primary/30 bg-gradient-to-br from-accent/40 via-card to-card",
                          "shadow-[0_1px_3px_rgba(34,90,161,0.08),_0_10px_28px_-10px_rgba(34,90,161,0.18)]",
                          "hover:shadow-[0_4px_12px_rgba(34,90,161,0.12),_0_18px_40px_-12px_rgba(34,90,161,0.25)]",
                        ]
                      : [
                          "border-border/70 bg-background",
                          "shadow-[0_1px_2px_rgba(0,0,0,0.04),_0_8px_24px_-10px_rgba(0,0,0,0.08)]",
                          "hover:border-primary/30 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06),_0_16px_36px_-12px_rgba(0,0,0,0.12)]",
                        ]
                  )}
                >
                  {/* Glow decorativo no canto superior direito (cor do tema) */}
                  <span
                    aria-hidden="true"
                    data-glow-canto="true"
                    className={cn(
                      "pointer-events-none absolute -right-8 -top-8 size-24 rounded-full blur-2xl",
                      tema.glow
                    )}
                  />

                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex size-10 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-105",
                        tema.iconBg,
                        tema.iconText,
                        tema.iconShadow
                      )}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                  </div>
                  <p className="font-display text-3xl font-bold leading-none tracking-tight text-foreground md:text-4xl">
                    {m.valor}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {m.legenda}
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {m.detalhe}
                  </p>

                  {/* Faixa colorida institucional na base do card.
                      Cresce sutilmente no hover para reforçar a identidade STC. */}
                  <span
                    aria-hidden="true"
                    data-faixa-tema="true"
                    className={cn(
                      "absolute inset-x-0 bottom-0 h-1 transition-all duration-300 group-hover:h-1.5",
                      tema.faixa
                    )}
                  />
                  {/* Glow vertical sutil que sai da faixa colorida no hover */}
                  <span
                    aria-hidden="true"
                    data-glow-tema="true"
                    className={cn(
                      "pointer-events-none absolute inset-x-0 bottom-0 h-12 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-25",
                      tema.faixa
                    )}
                  />
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
