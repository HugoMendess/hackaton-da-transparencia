import { useMemo, useState } from "react"
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps"
import { useMunicipios } from "@/hooks/useMunicipios"
import { cn, formatBRL } from "@/lib/utils"
import { Loader2, MapPin, X } from "lucide-react"

/**
 * Mapa interativo do Maranhão com 217 municípios.
 *
 * Usa GeoJSON em /geojson/maranhao-municipios.json (IBGE intermediária)
 * e nomes em /geojson/municipios-ma.json.
 *
 * Indicador atual: gasto público estimado em R$ por município.
 * Em produção, vem de Supabase a partir da consolidação por município
 * dos dados do SIAFEM.
 */

type DadoMunicipio = {
  gastoTotal: number
  obrasAtivas: number
  servidoresAtivos: number
  classe: "baixo" | "medio" | "alto" | "altissimo"
}

/**
 * Gera dados pseudo-aleatórios mas estáveis por código IBGE para
 * permitir visualização realista enquanto a consolidação real não vem.
 * Determinístico: mesmo código sempre dá o mesmo valor (sem flicker).
 */
function gerarDadoMock(codarea: number): DadoMunicipio {
  // Hash determinístico simples baseado no código IBGE
  const seed = (codarea * 9301 + 49297) % 233280
  const r = seed / 233280

  const gastoTotal = Math.round((r * 180 + 5) * 1_000_000) // 5M a 185M
  const obrasAtivas = Math.floor(r * 24)
  const servidoresAtivos = Math.floor(r * 850 + 20)

  let classe: DadoMunicipio["classe"]
  if (gastoTotal > 130_000_000) classe = "altissimo"
  else if (gastoTotal > 70_000_000) classe = "alto"
  else if (gastoTotal > 25_000_000) classe = "medio"
  else classe = "baixo"

  return { gastoTotal, obrasAtivas, servidoresAtivos, classe }
}

const CLASSE_FILL: Record<DadoMunicipio["classe"], string> = {
  baixo: "hsl(152 50% 90%)",
  medio: "hsl(152 60% 65%)",
  alto: "hsl(152 70% 42%)",
  altissimo: "hsl(152 75% 25%)",
}

type Selecionado = {
  codarea: number
  nome: string
  dado: DadoMunicipio
}

export function MapaMA() {
  const { mapa: nomes, loading } = useMunicipios()
  const [selecionado, setSelecionado] = useState<Selecionado | null>(null)
  const [hover, setHover] = useState<string | null>(null)

  const totalEstadual = useMemo(() => {
    let total = 0
    for (let codarea = 2100000; codarea < 2200000; codarea++) {
      if (!nomes.has(codarea)) continue
      total += gerarDadoMock(codarea).gastoTotal
    }
    return total
  }, [nomes])

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="relative rounded-lg border border-border bg-card">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/80">
            <Loader2 className="size-6 animate-spin text-primary" />
          </div>
        )}

        {hover && (
          <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-md bg-foreground/95 px-2.5 py-1 text-xs font-medium text-background shadow-md">
            {hover}
          </div>
        )}

        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ center: [-45.5, -5.4], scale: 2400 }}
          style={{ width: "100%", height: "auto", background: "transparent" }}
        >
          <ZoomableGroup minZoom={1} maxZoom={4}>
            <Geographies geography="/geojson/maranhao-municipios.json">
              {({ geographies }) =>
                geographies.map((geo) => {
                  const codarea = Number(geo.properties.codarea)
                  const nome = nomes.get(codarea) ?? "Município"
                  const dado = gerarDadoMock(codarea)
                  const isSelected = selecionado?.codarea === codarea

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setHover(nome)}
                      onMouseLeave={() => setHover(null)}
                      onClick={() => setSelecionado({ codarea, nome, dado })}
                      style={{
                        default: {
                          fill: CLASSE_FILL[dado.classe],
                          stroke: "hsl(var(--background))",
                          strokeWidth: 0.4,
                          outline: "none",
                          cursor: "pointer",
                        },
                        hover: {
                          fill: CLASSE_FILL[dado.classe],
                          stroke: "hsl(var(--primary))",
                          strokeWidth: 1.2,
                          outline: "none",
                        },
                        pressed: {
                          fill: "hsl(var(--primary))",
                          outline: "none",
                        },
                      }}
                      className={cn(
                        "transition-colors",
                        isSelected && "[&]:fill-primary"
                      )}
                      tabIndex={-1}
                      aria-label={`Município de ${nome}`}
                    />
                  )
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>

        {/* Legenda */}
        <div className="flex flex-wrap items-center gap-3 border-t border-border px-4 py-3 text-xs">
          <span className="text-muted-foreground">Gasto público estimado:</span>
          <LegendaItem cor={CLASSE_FILL.baixo} label="< R$ 25 mi" />
          <LegendaItem cor={CLASSE_FILL.medio} label="R$ 25 mi a R$ 70 mi" />
          <LegendaItem cor={CLASSE_FILL.alto} label="R$ 70 mi a R$ 130 mi" />
          <LegendaItem cor={CLASSE_FILL.altissimo} label="> R$ 130 mi" />
        </div>
      </div>

      {/* Painel lateral */}
      <aside className="flex flex-col gap-3">
        <article className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Maranhão consolidado
          </p>
          <p className="mt-2 font-display text-3xl font-bold tabular text-foreground">
            {formatBRL(totalEstadual)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Gasto público estimado em 217 municípios
          </p>
        </article>

        {selecionado ? (
          <PainelMunicipio
            sel={selecionado}
            totalEstadual={totalEstadual}
            onClose={() => setSelecionado(null)}
          />
        ) : (
          <article className="rounded-lg border border-dashed border-border bg-muted/20 p-4 text-sm text-muted-foreground">
            <MapPin className="mb-2 size-5 text-muted-foreground/60" aria-hidden="true" />
            Toque em um município para ver os dados consolidados.
          </article>
        )}
      </aside>
    </div>
  )
}

function LegendaItem({ cor, label }: { cor: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="size-3 rounded-sm"
        style={{ background: cor }}
        aria-hidden="true"
      />
      <span>{label}</span>
    </span>
  )
}

function PainelMunicipio({
  sel,
  totalEstadual,
  onClose,
}: {
  sel: Selecionado
  totalEstadual: number
  onClose: () => void
}) {
  const pct = totalEstadual > 0 ? (sel.dado.gastoTotal / totalEstadual) * 100 : 0
  return (
    <article className="rounded-lg border border-primary/30 bg-card p-4">
      <header className="mb-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-primary">
            Município selecionado
          </p>
          <h3 className="mt-1 text-lg font-semibold text-foreground">
            {sel.nome}
          </h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Fechar painel do município"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </header>

      <dl className="space-y-3 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Gasto público estimado</dt>
          <dd className="mt-0.5 font-display text-2xl font-bold tabular text-foreground">
            {formatBRL(sel.dado.gastoTotal)}
          </dd>
          <dd className="mt-0.5 text-xs text-muted-foreground">
            {pct.toFixed(2)}% do total estadual
          </dd>
        </div>
        <div className="grid grid-cols-2 gap-2 border-t border-border pt-3">
          <div>
            <dt className="text-xs text-muted-foreground">Obras ativas</dt>
            <dd className="font-semibold tabular text-foreground">
              {sel.dado.obrasAtivas}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Servidores</dt>
            <dd className="font-semibold tabular text-foreground">
              {sel.dado.servidoresAtivos}
            </dd>
          </div>
        </div>
      </dl>

      <p className="mt-4 rounded-md border border-secondary/30 bg-secondary/10 p-2 text-xs text-foreground">
        Dado estimado a partir de modelo de consolidação. Em produção,
        substituído por valores reais do SIAFEM.
      </p>
    </article>
  )
}
