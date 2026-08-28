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
  UserCheck,
  Landmark,
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
  UserCheck,
  Landmark,
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

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EIXOS.map((eixo) => {
          const Icon = ICONS[eixo.icone] ?? Users
          return (
            <li key={eixo.slug}>
              <Link
                to={`/eixo/${eixo.slug}`}
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-xl border bg-card",
                  "transition-all duration-300 ease-out",
                  "hover:-translate-y-1",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  eixo.destaque
                    ? [
                        "border-primary/40 ring-1 ring-primary/15",
                        "shadow-[0_2px_4px_rgba(34,90,161,0.08),_0_12px_32px_-10px_rgba(34,90,161,0.20)]",
                        "hover:border-primary/60 hover:shadow-[0_6px_16px_rgba(34,90,161,0.14),_0_22px_48px_-12px_rgba(34,90,161,0.30)]",
                      ]
                    : [
                        "border-border/70",
                        "shadow-[0_1px_3px_rgba(0,0,0,0.04),_0_10px_28px_-12px_rgba(0,0,0,0.10)]",
                        "hover:border-primary/40 hover:shadow-[0_6px_16px_rgba(0,0,0,0.08),_0_20px_44px_-14px_rgba(0,0,0,0.16)]",
                      ]
                )}
                aria-label={`Acessar eixo ${eixo.nome}`}
              >
                {/* Imagem decorativa (16:9) */}
                <div
                  className="relative aspect-[16/9] w-full overflow-hidden bg-muted"
                  data-image-container="true"
                >
                  <span
                    className="eixo-fallback-titulo absolute inset-0 hidden items-center justify-center px-4 text-center font-display text-2xl font-bold text-foreground/40 md:text-3xl"
                    aria-hidden="true"
                  >
                    {eixo.nome}
                  </span>

                  <img
                    src={`/images/eixos/${eixo.slug}.svg`}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
                  />

                  {/* Overlay sutil que escurece a imagem no hover, dando
                      profundidade sem competir com o conteúdo */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />

                  {eixo.destaque && (
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary/95 px-2.5 py-1 text-xs font-semibold text-primary-foreground shadow-lg shadow-primary/30 ring-1 ring-white/20 backdrop-blur-sm">
                      Mais buscado
                    </span>
                  )}
                </div>

                {/* Conteúdo */}
                <div className="flex flex-1 items-start gap-3 p-5">
                  <span
                    className={cn(
                      "flex size-11 shrink-0 items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-105",
                      eixo.destaque
                        ? "bg-gradient-to-br from-primary to-primary/85 text-primary-foreground shadow-md shadow-primary/25"
                        : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary group-hover:shadow-sm"
                    )}
                  >
                    <Icon className="size-5" aria-hidden="true" />
                  </span>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
                      {eixo.nome}
                    </h3>
                    <p className="mt-0.5 text-sm leading-relaxed text-muted-foreground">
                      {eixo.descricaoCidada}
                    </p>
                  </div>

                  <ArrowRight
                    className="mt-1 size-4 shrink-0 text-muted-foreground/50 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary"
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
