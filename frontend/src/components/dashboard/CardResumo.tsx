import { TrendingUp, TrendingDown, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ResumoCard } from "@/data/eixos-dataset"

export function CardResumo({ card, destaque }: { card: ResumoCard; destaque?: boolean }) {
  return (
    <article
      className={cn(
        "flex flex-col gap-2 rounded-lg border bg-card p-4 shadow-sm",
        destaque
          ? "border-primary/40 bg-accent/20"
          : "border-border"
      )}
      aria-label={`${card.label}: ${card.valor}`}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {card.label}
        </p>
        {destaque && (
          <Sparkles className="size-4 text-primary" aria-hidden="true" />
        )}
      </div>

      <p className="text-2xl font-semibold tabular text-foreground md:text-3xl">
        {card.valor}
      </p>

      <div className="flex items-center justify-between gap-2 text-xs">
        {card.legenda && (
          <span className="text-muted-foreground">{card.legenda}</span>
        )}
        {card.variacao && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-medium",
              card.variacao.positiva
                ? "bg-success/10 text-success"
                : "bg-destructive/10 text-destructive"
            )}
          >
            {card.variacao.positiva ? (
              <TrendingUp className="size-3" aria-hidden="true" />
            ) : (
              <TrendingDown className="size-3" aria-hidden="true" />
            )}
            {card.variacao.texto}
          </span>
        )}
      </div>
    </article>
  )
}
