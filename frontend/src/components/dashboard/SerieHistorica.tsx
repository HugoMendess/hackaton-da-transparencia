import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { formatBRL } from "@/lib/utils"
import type { LinhaHistorica } from "@/data/eixos-dataset"

/**
 * Série histórica anual: empenhado, liquidado, pago (ARQUITETURA.md).
 * Valores em milhões. O ano corrente exibe valores parciais (apenas o
 * que já foi pago/liquidado), o que aparece como queda visual esperada.
 */
export function SerieHistorica({
  titulo,
  legenda,
  dados,
}: {
  titulo: string
  legenda?: string
  dados: LinhaHistorica[]
}) {
  return (
    <article
      className="rounded-lg border border-border bg-card p-4 shadow-sm"
      aria-labelledby={`serie-${titulo}`}
    >
      <header className="mb-3">
        <h3
          id={`serie-${titulo}`}
          className="font-semibold text-foreground"
        >
          {titulo}
        </h3>
        {legenda && (
          <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
            {legenda}
          </p>
        )}
      </header>

      <div role="img" aria-label={`Série histórica: ${titulo}`}>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={dados} margin={{ top: 4, right: 12, left: 0, bottom: 4 }}>
            <defs>
              <linearGradient id="empenhado-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="ano"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(v) => `R$ ${(v / 1000).toFixed(1)}b`}
              fontSize={11}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "0.5rem",
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--card))",
                fontSize: "0.875rem",
              }}
              formatter={(value) => {
                const num = typeof value === "number" ? value : Number(value)
                return formatBRL(num * 1_000_000)
              }}
              labelFormatter={(year) => `Ano ${year}`}
            />
            <Legend
              wrapperStyle={{ fontSize: "0.75rem" }}
              iconType="circle"
            />
            <Area
              type="monotone"
              name="Empenhado"
              dataKey="empenhado"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              fill="url(#empenhado-grad)"
            />
            <Area
              type="monotone"
              name="Liquidado"
              dataKey="liquidado"
              stroke="hsl(var(--info))"
              strokeWidth={2}
              fill="transparent"
            />
            <Area
              type="monotone"
              name="Pago"
              dataKey="pago"
              stroke="hsl(var(--success))"
              strokeWidth={2}
              fill="transparent"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}
