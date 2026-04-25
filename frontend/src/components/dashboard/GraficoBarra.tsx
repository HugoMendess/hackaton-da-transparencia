import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { formatBRL } from "@/lib/utils"
import type { GraficoBarra as DadosBarra } from "@/data/eixos-dataset"

/**
 * Gráfico de barras horizontais com formatação BRL.
 * Aceita valores em milhões (escala) e renderiza tooltip cidadão.
 */
export function GraficoBarra({
  titulo,
  legenda,
  dados,
  unidadeMilhoes = true,
}: {
  titulo: string
  legenda?: string
  dados: DadosBarra[]
  /** Quando true, o eixo X mostra "R$ X mi"; quando false, valor cru. */
  unidadeMilhoes?: boolean
}) {
  const total = dados.reduce((sum, d) => sum + d.valor, 0)

  return (
    <article
      className="rounded-lg border border-border bg-card p-4 shadow-sm"
      aria-labelledby={`grafico-barra-${titulo}`}
    >
      <header className="mb-3">
        <h3
          id={`grafico-barra-${titulo}`}
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

      <div role="img" aria-label={`Gráfico de barras: ${titulo}`}>
        <ResponsiveContainer width="100%" height={Math.max(180, dados.length * 40)}>
          <BarChart
            data={dados}
            layout="vertical"
            margin={{ top: 4, right: 12, bottom: 4, left: 0 }}
          >
            <CartesianGrid horizontal={false} stroke="hsl(var(--border))" />
            <XAxis
              type="number"
              stroke="hsl(var(--muted-foreground))"
              tickFormatter={(v) =>
                unidadeMilhoes ? `R$ ${(v / 1000).toFixed(1)}b` : formatBRL(v)
              }
              fontSize={11}
            />
            <YAxis
              type="category"
              dataKey="nome"
              stroke="hsl(var(--foreground))"
              width={140}
              fontSize={12}
              tick={{ textAnchor: "end" }}
            />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted) / 0.5)" }}
              contentStyle={{
                borderRadius: "0.5rem",
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--card))",
                fontSize: "0.875rem",
              }}
              formatter={(value) => {
                const num = typeof value === "number" ? value : Number(value)
                return [
                  unidadeMilhoes ? formatBRL(num * 1_000_000) : formatBRL(num),
                  "Valor",
                ]
              }}
            />
            <Bar
              dataKey="valor"
              fill="hsl(var(--primary))"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabela alternativa para acessibilidade (oculta visualmente) */}
      <table className="sr-only">
        <caption>{titulo}</caption>
        <thead>
          <tr>
            <th scope="col">Categoria</th>
            <th scope="col">Valor</th>
            <th scope="col">% do total</th>
          </tr>
        </thead>
        <tbody>
          {dados.map((d) => (
            <tr key={d.nome}>
              <td>{d.nome}</td>
              <td>{unidadeMilhoes ? formatBRL(d.valor * 1_000_000) : formatBRL(d.valor)}</td>
              <td>{((d.valor / total) * 100).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </article>
  )
}
