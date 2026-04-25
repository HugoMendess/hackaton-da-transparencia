import { EIXOS } from "@/data/eixos"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import {
  Users,
  Heart,
  GraduationCap,
  Shield,
  Home,
  HandHeart,
  Hammer,
  ArrowRight,
  type LucideIcon,
} from "lucide-react"

const ICONS: Record<string, LucideIcon> = {
  Users,
  Heart,
  GraduationCap,
  Shield,
  Home,
  HandHeart,
  Hammer,
}

export function EixoGrid() {
  return (
    <section
      aria-labelledby="eixos-titulo"
      className="container-page px-4 py-6"
    >
      <div className="mb-4 flex items-baseline justify-between gap-4">
        <div>
          <h2 id="eixos-titulo" className="text-xl font-semibold tracking-tight">
            Por onde começar
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            7 eixos da vida do cidadão. Sem jargão. Em até 3 toques.
          </p>
        </div>
      </div>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {EIXOS.map((eixo) => {
          const Icon = ICONS[eixo.icone] ?? Users
          return (
            <li key={eixo.slug}>
              <Link
                to={`/eixo/${eixo.slug}`}
                className={cn(
                  "group flex h-full flex-col gap-3 rounded-lg border border-border bg-card p-4",
                  "transition-colors duration-200",
                  "hover:border-primary/40 hover:bg-accent/50",
                  "focus-visible:border-primary focus-visible:bg-accent/50",
                  eixo.destaque && "border-primary/40 bg-accent/30 sm:col-span-2 lg:col-span-3"
                )}
                aria-label={`Acessar eixo ${eixo.nome}`}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-md",
                      eixo.destaque
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {eixo.nome}
                      </h3>
                      {eixo.destaque && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          Mais buscado
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                      {eixo.descricaoCidada}
                    </p>
                  </div>

                  <ArrowRight
                    className="mt-1 size-4 shrink-0 text-muted-foreground/60 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-primary"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
