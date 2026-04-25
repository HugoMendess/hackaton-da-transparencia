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
  Drama,
  Leaf,
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
  Drama,
  Leaf,
}

/**
 * Grid de 9 eixos temáticos (3x3 no desktop).
 *
 * Cada card carrega imagem de /images/eixos/{slug}.svg (placeholder
 * atual). Quando a equipe entregar a versão .webp, basta substituir
 * o arquivo no mesmo path.
 *
 * O eixo com `destaque: true` (Gestão Pública) recebe apenas borda
 * primária e badge "Mais buscado" - mantém o mesmo tamanho dos demais
 * para preservar a harmonia do grid.
 */
export function EixoGrid() {
  return (
    <section
      aria-labelledby="eixos-titulo"
      className="container-page px-4 py-8"
    >
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <div>
          <h2 id="eixos-titulo" className="text-xl font-semibold tracking-tight md:text-2xl">
            Por onde começar
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            9 eixos da vida do cidadão. Sem jargão. Em até 3 toques.
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
                  "group flex h-full flex-col overflow-hidden rounded-lg border bg-card",
                  "transition-all duration-200",
                  "hover:shadow-md focus-visible:shadow-md",
                  eixo.destaque
                    ? "border-primary/40 ring-1 ring-primary/20 hover:border-primary/60"
                    : "border-border hover:border-primary/40"
                )}
                aria-label={`Acessar eixo ${eixo.nome}`}
              >
                {/* Imagem decorativa (16:9) */}
                <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                  <img
                    src={`/images/eixos/${eixo.slug}.svg`}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                  {eixo.destaque && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-md">
                      Mais buscado
                    </span>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="flex flex-1 items-start gap-3 p-4">
                  <span
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-md transition-colors",
                      eixo.destaque
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground">
                      {eixo.nome}
                    </h3>
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
