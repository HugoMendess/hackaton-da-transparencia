import { useEffect, useMemo, useState } from "react"
import { geoMercator, geoPath } from "d3-geo"
import { Loader2, MapPin, X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { useMunicipios } from "@/hooks/useMunicipios"
import { formatBRL } from "@/lib/utils"

/**
 * Mapa interativo do Maranhão (217 municípios) com SVG puro + d3-geo.
 *
 * Projeção: Mercator centrada em (-45.28, -5.66) com scale 5400.
 * Valores calculados manualmente a partir do bounding box do GeoJSON
 * (lon -48.76 a -41.80, lat -10.26 a -1.05). Não usa fitSize do d3-geo
 * porque ele estava falhando silenciosamente em alguns ambientes.
 */

type FeatureRaw = {
  type: "Feature"
  properties: { codarea: string | number }
  geometry: unknown
}

type GeoCollection = {
  type: "FeatureCollection"
  features: FeatureRaw[]
}

type DadoMunicipio = {
  gastoTotal: number
  obrasAtivas: number
  servidoresAtivos: number
  classe: "baixo" | "medio" | "alto" | "altissimo"
}

type Selecionado = {
  codarea: number
  nome: string
  dado: DadoMunicipio
}

const VIEWBOX_W = 800
const VIEWBOX_H = 900

// Cores hex puras (CSS vars não funcionam confiavelmente em fill SVG)
const CLASSE_FILL: Record<DadoMunicipio["classe"], string> = {
  baixo: "#DCFCE7",
  medio: "#86EFAC",
  alto: "#22C55E",
  altissimo: "#15803D",
}

function gerarDadoMock(codarea: number): DadoMunicipio {
  const seed = (codarea * 9301 + 49297) % 233280
  const r = seed / 233280
  const gastoTotal = Math.round((r * 180 + 5) * 1_000_000)
  const obrasAtivas = Math.floor(r * 24)
  const servidoresAtivos = Math.floor(r * 850 + 20)

  let classe: DadoMunicipio["classe"]
  if (gastoTotal > 130_000_000) classe = "altissimo"
  else if (gastoTotal > 70_000_000) classe = "alto"
  else if (gastoTotal > 25_000_000) classe = "medio"
  else classe = "baixo"

  return { gastoTotal, obrasAtivas, servidoresAtivos, classe }
}

export function MapaMA() {
  const { mapa: nomes, loading: loadingNomes } = useMunicipios()
  const [geo, setGeo] = useState<GeoCollection | null>(null)
  const [loadingGeo, setLoadingGeo] = useState(true)
  const [erroGeo, setErroGeo] = useState<string | null>(null)
  const [selecionado, setSelecionado] = useState<Selecionado | null>(null)
  const [hover, setHover] = useState<string | null>(null)
  const [zoom, setZoom] = useState(1)

  useEffect(() => {
    let cancelled = false
    fetch("/geojson/maranhao-municipios.json")
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao carregar mapa")
        return res.json() as Promise<GeoCollection>
      })
      .then((data) => {
        if (cancelled) return
        setGeo(data)
        setLoadingGeo(false)
      })
      .catch((e: unknown) => {
        if (cancelled) return
        setErroGeo(e instanceof Error ? e.message : "Erro desconhecido")
        setLoadingGeo(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Path generator com projeção manual (Mercator centrada no MA).
  // Sem fitSize porque ele falhava silenciosamente.
  const pathOf = useMemo(() => {
    const projection = geoMercator()
      .center([-45.28, -5.66])
      .scale(5400)
      .translate([VIEWBOX_W / 2, VIEWBOX_H / 2])
    return geoPath(projection)
  }, [])

  const totalEstadual = useMemo(() => {
    if (!geo) return 0
    let total = 0
    for (const f of geo.features) {
      total += gerarDadoMock(Number(f.properties.codarea)).gastoTotal
    }
    return total
  }, [geo])

  const loading = loadingGeo || loadingNomes

  function reset() {
    setZoom(1)
    setSelecionado(null)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="relative overflow-hidden rounded-lg border border-border bg-card">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-card/80">
            <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
            <span className="sr-only">Carregando mapa do Maranhão</span>
          </div>
        )}

        {erroGeo && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-card text-sm text-muted-foreground">
            <MapPin className="size-6 text-destructive" aria-hidden="true" />
            <span>Não foi possível carregar o mapa.</span>
            <span className="text-xs">{erroGeo}</span>
          </div>
        )}

        {hover && (
          <div className="pointer-events-none absolute left-3 top-3 z-10 rounded-md bg-foreground/95 px-2.5 py-1 text-xs font-medium text-background shadow-md">
            {hover}
          </div>
        )}

        {/* Controles de zoom */}
        <div className="absolute right-3 top-3 z-10 flex flex-col gap-1 rounded-md border border-border bg-card/95 p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(z * 1.4, 4))}
            className="flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Aumentar zoom"
          >
            <ZoomIn className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(z / 1.4, 1))}
            className="flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Reduzir zoom"
          >
            <ZoomOut className="size-4" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={reset}
            className="flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Resetar zoom e seleção"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
          </button>
        </div>

        <svg
          viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
          width="100%"
          height="auto"
          style={{
            background: "#F0FDF4",
            display: "block",
          }}
          role="img"
          aria-label="Mapa interativo dos 217 municípios do Maranhão"
        >
          <g
            transform={`translate(${VIEWBOX_W / 2} ${VIEWBOX_H / 2}) scale(${zoom}) translate(${-VIEWBOX_W / 2} ${-VIEWBOX_H / 2})`}
          >
            {geo &&
              geo.features.map((f) => {
                const codarea = Number(f.properties.codarea)
                const d = pathOf(f as Parameters<typeof pathOf>[0])
                if (!d) return null

                const nome = nomes.get(codarea) ?? "Município"
                const dado = gerarDadoMock(codarea)
                const isSelected = selecionado?.codarea === codarea

                return (
                  <path
                    key={codarea}
                    d={d}
                    fill={isSelected ? "#0F7B40" : CLASSE_FILL[dado.classe]}
                    stroke={isSelected ? "#064E3B" : "#FFFFFF"}
                    strokeWidth={isSelected ? 2 : 0.6}
                    vectorEffect="non-scaling-stroke"
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => setHover(nome)}
                    onMouseLeave={() => setHover(null)}
                    onClick={() => setSelecionado({ codarea, nome, dado })}
                    role="button"
                    aria-label={`${nome}, ${formatBRL(dado.gastoTotal)} em gasto público estimado`}
                  />
                )
              })}
          </g>
        </svg>

        {/* Legenda */}
        <div className="flex flex-wrap items-center gap-3 border-t border-border px-4 py-3 text-xs">
          <span className="font-medium text-muted-foreground">Gasto público estimado:</span>
          <LegendaItem cor={CLASSE_FILL.baixo} label="< R$ 25 mi" />
          <LegendaItem cor={CLASSE_FILL.medio} label="R$ 25 a 70 mi" />
          <LegendaItem cor={CLASSE_FILL.alto} label="R$ 70 a 130 mi" />
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
            {loading ? "..." : formatBRL(totalEstadual)}
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
        className="size-3 rounded-sm border border-border"
        style={{ background: cor }}
        aria-hidden="true"
      />
      <span className="text-foreground/80">{label}</span>
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
