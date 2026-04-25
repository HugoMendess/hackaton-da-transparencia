import { Users, Eye, Award, Database } from "lucide-react"
import { cn } from "@/lib/utils"

type Metrica = {
  icon: typeof Users
  valor: string
  legenda: string
  detalhe: string
  destaque?: boolean
}

const METRICAS: Metrica[] = [
  {
    icon: Users,
    valor: "320 mil",
    legenda: "Cidadãos por ano",
    detalhe: "Maranhenses que acessam o portal",
    destaque: true,
  },
  {
    icon: Eye,
    valor: "4 milhões",
    legenda: "Visualizações por ano",
    detalhe: "Mais que dobrou desde 2017",
  },
  {
    icon: Award,
    valor: "Selo Diamante",
    legenda: "TCE-MA, 2x consecutivo",
    detalhe: "Score 98,5/100 em transparência",
  },
  {
    icon: Database,
    valor: "115",
    legenda: "Categorias de informação",
    detalhe: "Mapeadas e auditadas",
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

        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {METRICAS.map((m) => {
            const Icon = m.icon
            return (
              <li key={m.legenda}>
                <article
                  className={cn(
                    "flex h-full flex-col gap-2 rounded-lg border p-4 transition-colors",
                    m.destaque
                      ? "border-primary/30 bg-accent/30"
                      : "border-border bg-background"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex size-8 items-center justify-center rounded-md",
                        m.destaque
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                  </div>
                  <p className="font-display text-3xl font-bold leading-none tracking-tight text-foreground md:text-4xl">
                    {m.valor}
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {m.legenda}
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {m.detalhe}
                  </p>
                </article>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
