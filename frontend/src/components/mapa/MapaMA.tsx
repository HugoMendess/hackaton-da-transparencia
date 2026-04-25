import { useEffect, useMemo, useRef, useState } from "react"
import { geoMercator, geoPath } from "d3-geo"
import type {
  Feature,
  FeatureCollection,
  Geometry,
  GeoJsonProperties,
} from "geojson"
import { Loader2, MapPin, X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { useMunicipios } from "@/hooks/useMunicipios"
import { formatBRL } from "@/lib/utils"

/**
 * Mapa interativo do Maranhão (217 municípios) implementado com SVG
 * puro + d3-geo. Sem dependência de bibliotecas com require() CJS.
 *
 * Dados: /geojson/maranhao-municipios.json (IBGE intermediária).
 * Indicador: gasto público estimado por município (mock determinístico
 * por código IBGE até a consolidação real do SIAFEM).
 */

type MunicipioProps = GeoJsonProperties & { codarea: string | number }
type GeoFeature = Feature<Geometry, MunicipioProps>
type GeoCollection = FeatureCollection<Geometry, MunicipioProps>

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
const VIEWBOX_H = 800

const CLASSE_FILL: Record<DadoMunicipio["classe"], string> = {
  baixo: "hsl(152 50% 90%)",
  medio: "hsl(152 60% 65%)",
  alto: "hsl(152 70% 42%)",
  altissimo: "hsl(152 75% 25%)",
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
  const svgRef = useRef<SVGSVGElement>(null)

  // Carrega o GeoJSON apenas uma vez
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

  // Path generator d3-geo com fitSize automático no viewbox
  const pathGenerator = useMemo(() => {
    if (!geo) return null
    const projection = geoMercator().fitSize(
      [VIEWBOX_W, VIEWBOX_H],
      geo as unknown as GeoJSON.GeoJSON
    )
    return geoPath(projection)
  }, [geo])

  const totalEstadual = useMemo(() => {
    if (!geo) return 0
    let total = 0
    for (const f of geo.features) {
      total += gerarDadoMock(Number(f.properties?.codarea)).gastoTotal
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
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/80">
            <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
            <span className="sr-only">Carregando mapa do Maranhão</span>
          </div>
        )}

        {erroGeo && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-card text-sm text-muted-foreground">
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
            onClick={() => setZoom((z) => Math.min(z * 1.4, 6))}
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
          ref={svgRef}
          viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`}
          className="aspect-square w-full"
          role="img"
          aria-label="Mapa interativo dos 217 municípios do Maranhão"
        >
          <g style={{ transform: `scale(${zoom})`, transformOrigin: "center" }}>
            {geo && pathGenerator &&
              geo.features.map((f: GeoFeature) => {
                const codarea = Number(f.properties?.codarea)
                const nome = nomes.get(codarea) ?? "Município"
                const dado = gerarDadoMock(codarea)
                const isSelected = selecionado?.codarea === codarea
                const d =
                  pathGenerator(f as unknown as GeoJSON.GeoJSON) ?? ""

                return (
                  <path
                    key={codarea}
                    d={d}
                    fill={isSelected ? "hsl(var(--primary))" : CLASSE_FILL[dado.classe]}
                    stroke={isSelected ? "hsl(var(--primary))" : "hsl(var(--background))"}
                    strokeWidth={isSelected ? 1.6 / zoom : 0.5 / zoom}
                    className="cursor-pointer transition-colors duration-150 hover:stroke-primary hover:[stroke-width:1.4]"
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
      <span className="size-3 rounded-sm" style={{ background: cor }} aria-hidden="true" />
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
