import { useEffect, useMemo, useState } from "react"
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet"
import type { Layer, PathOptions, LeafletMouseEvent } from "leaflet"
import type { Feature, FeatureCollection, Geometry } from "geojson"
import { Loader2, MapPin, X } from "lucide-react"
import "leaflet/dist/leaflet.css"
import { useMunicipios } from "@/hooks/useMunicipios"
import { formatBRL } from "@/lib/utils"
import { CategoriasMunicipio } from "@/components/mapa/CategoriasMunicipio"

/**
 * Mapa interativo do Maranhão (217 municípios) com Leaflet.
 *
 * Tile de fundo: Carto Positron (mapa claro, institucional, sem
 * propaganda visual). Overlay GeoJSON do IBGE pinta cada município
 * com cor proporcional ao gasto público estimado.
 */

type MunicipioProps = { codarea: string | number }
type MunicipioFeature = Feature<Geometry, MunicipioProps>
type MunicipioFC = FeatureCollection<Geometry, MunicipioProps>

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

// Centro aproximado do Maranhão
const MA_CENTER: [number, number] = [-5.66, -45.28]
const MA_ZOOM_INICIAL = 6
const MA_BOUNDS: [[number, number], [number, number]] = [
  [-10.5, -49.0], // SW
  [-1.0, -41.5],  // NE
]

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
  const [geo, setGeo] = useState<MunicipioFC | null>(null)
  const [loadingGeo, setLoadingGeo] = useState(true)
  const [erroGeo, setErroGeo] = useState<string | null>(null)
  const [selecionado, setSelecionado] = useState<Selecionado | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch("/geojson/maranhao-municipios.json")
      .then((res) => {
        if (!res.ok) throw new Error("Falha ao carregar mapa")
        return res.json() as Promise<MunicipioFC>
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

  const totalEstadual = useMemo(() => {
    if (!geo) return 0
    let total = 0
    for (const f of geo.features) {
      total += gerarDadoMock(Number(f.properties.codarea)).gastoTotal
    }
    return total
  }, [geo])

  const styleFeature = (feature?: MunicipioFeature): PathOptions => {
    const codarea = Number(feature?.properties?.codarea)
    const dado = gerarDadoMock(codarea)
    const isSelected = selecionado?.codarea === codarea
    return {
      fillColor: isSelected ? "#0F7B40" : CLASSE_FILL[dado.classe],
      fillOpacity: isSelected ? 0.95 : 0.78,
      color: isSelected ? "#064E3B" : "#FFFFFF",
      weight: isSelected ? 2 : 0.7,
      opacity: 1,
    }
  }

  const onEachFeature = (feature: MunicipioFeature, layer: Layer) => {
    const codarea = Number(feature.properties.codarea)
    const nome = nomes.get(codarea) ?? "Município"
    const dado = gerarDadoMock(codarea)

    layer.bindTooltip(nome, {
      sticky: true,
      direction: "top",
      offset: [0, -8],
      className: "mapa-tooltip",
    })

    layer.on({
      click: () => setSelecionado({ codarea, nome, dado }),
      mouseover: (e: LeafletMouseEvent) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const target = e.target as any
        target.setStyle({ weight: 1.5, color: "#0F7B40" })
        target.bringToFront()
      },
      mouseout: (e: LeafletMouseEvent) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const target = e.target as any
        const isStillSelected =
          selecionado?.codarea === Number(feature.properties.codarea)
        target.setStyle(styleFeature(feature))
        if (isStillSelected) target.setStyle(styleFeature(feature))
      },
    })
  }

  const loading = loadingGeo || loadingNomes

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="relative overflow-hidden rounded-lg border border-border bg-card">
        {loading && (
          <div className="absolute inset-0 z-[1000] flex items-center justify-center bg-card/80">
            <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
            <span className="sr-only">Carregando mapa do Maranhão</span>
          </div>
        )}

        {erroGeo && (
          <div className="absolute inset-0 z-[1000] flex flex-col items-center justify-center gap-2 bg-card text-sm text-muted-foreground">
            <MapPin className="size-6 text-destructive" aria-hidden="true" />
            <span>Não foi possível carregar o mapa.</span>
            <span className="text-xs">{erroGeo}</span>
          </div>
        )}

        <div className="h-[520px] w-full" role="application" aria-label="Mapa interativo dos 217 municípios do Maranhão">
          <MapContainer
            center={MA_CENTER}
            zoom={MA_ZOOM_INICIAL}
            minZoom={5}
            maxZoom={11}
            maxBounds={MA_BOUNDS}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%", background: "#F0FDF4" }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">Carto</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            {geo && (
              <GeoJSON
                key={selecionado?.codarea ?? "none"}
                data={geo}
                style={styleFeature as never}
                onEachFeature={onEachFeature as never}
              />
            )}
          </MapContainer>
        </div>

        {/* Legenda */}
        <div className="flex flex-wrap items-center gap-3 border-t border-border px-4 py-3 text-xs">
          <span className="font-medium text-muted-foreground">Gasto público estimado:</span>
          <LegendaItem cor={CLASSE_FILL.baixo} label="< R$ 25 mi" />
          <LegendaItem cor={CLASSE_FILL.medio} label="R$ 25 a 70 mi" />
          <LegendaItem cor={CLASSE_FILL.alto} label="R$ 70 a 130 mi" />
          <LegendaItem cor={CLASSE_FILL.altissimo} label="> R$ 130 mi" />
          <span className="ml-auto text-muted-foreground">
            Use o scroll com Ctrl ou os botões + e - do mapa para zoom
          </span>
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
          <>
            <PainelMunicipio
              sel={selecionado}
              totalEstadual={totalEstadual}
              onClose={() => setSelecionado(null)}
            />
            <CategoriasMunicipio
              codarea={selecionado.codarea}
              nome={selecionado.nome}
            />
          </>
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
