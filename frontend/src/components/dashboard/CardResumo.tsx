import { TrendingUp, TrendingDown, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ResumoCard } from "@/data/eixos-dataset"

export function CardResumo({ card, destaque }: { card: ResumoCard; destaque?: boolean }) {
  return (
    <article
      className={cn(
        "group relative flex flex-col gap-2.5 overflow-hidden rounded-xl border p-5",
        "transition-all duration-300 ease-out hover:-translate-y-0.5",
        destaque
          ? [
              "border-primary/30 bg-gradient-to-br from-accent/40 via-card to-card",
              "shadow-[0_1px_3px_rgba(34,90,161,0.08),_0_10px_28px_-10px_rgba(34,90,161,0.18)]",
              "hover:shadow-[0_4px_12px_rgba(34,90,161,0.12),_0_18px_40px_-12px_rgba(34,90,161,0.25)]",
            ]
          : [
              "border-border/70 bg-card",
              "shadow-[0_1px_2px_rgba(0,0,0,0.04),_0_6px_18px_-8px_rgba(0,0,0,0.08)]",
              "hover:border-primary/30 hover:shadow-[0_4px_10px_rgba(0,0,0,0.06),_0_14px_30px_-10px_rgba(0,0,0,0.10)]",
            ]
      )}
      aria-label={`${card.label}: ${card.valor}`}
    >
      {/* Glow no canto pro card destaque */}
      {destaque && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-6 size-20 rounded-full bg-primary/15 blur-2xl"
        />
      )}

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
              "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ring-1",
              card.variacao.positiva
                ? "bg-success/10 text-success ring-success/20"
                : "bg-destructive/10 text-destructive ring-destructive/20"
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
