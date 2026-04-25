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
    <section aria-labelledby="eixos-titulo" className="container py-6">
      <h2 id="eixos-titulo" className="mb-4 text-xl font-semibold">
        Por onde começar
      </h2>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {EIXOS.map((eixo) => {
          const Icon = ICONS[eixo.icone] ?? Users
          return (
            <Link
              key={eixo.slug}
              to={`/eixo/${eixo.slug}`}
              className={cn(
                "group flex flex-col gap-2 rounded-lg border border-border p-4 transition-colors",
                "hover:bg-accent hover:border-accent-foreground/20",
                "focus-visible:bg-accent",
                eixo.destaque && "border-primary/40 bg-accent/40 lg:col-span-2"
              )}
              aria-label={`Eixo ${eixo.nome}`}
            >
              <div className="flex items-center gap-2">
                <Icon
                  className={cn(
                    "size-6",
                    eixo.destaque ? "text-primary" : "text-muted-foreground"
                  )}
                  aria-hidden="true"
                />
                <span className="font-semibold">{eixo.nome}</span>
                {eixo.destaque && (
                  <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    Mais buscado
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {eixo.descricaoCidada}
              </p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
