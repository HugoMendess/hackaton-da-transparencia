import { useEffect, useMemo, useState } from "react"
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet"
import type { Layer, PathOptions, LeafletMouseEvent } from "leaflet"
import type { Feature, FeatureCollection, Geometry } from "geojson"
import { Loader2, MapPin, X, Building2, Hammer, Users, TrendingUp } from "lucide-react"
import "leaflet/dist/leaflet.css"
import { useMunicipios } from "@/hooks/useMunicipios"
import { cn, formatBRL, formatNumber } from "@/lib/utils"
import { CategoriasMunicipio } from "@/components/mapa/CategoriasMunicipio"
import { FiltroMunicipio } from "@/components/mapa/FiltroMunicipio"

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

  // Município selecionado vira vermelho institucional para criar
  // contraste máximo contra o gradiente verde do mapa. Borda mais
  // grossa e escura para destacar como "ativo".
  const styleFeature = (feature?: MunicipioFeature): PathOptions => {
    const codarea = Number(feature?.properties?.codarea)
    const dado = gerarDadoMock(codarea)
    const isSelected = selecionado?.codarea === codarea
    return {
      fillColor: isSelected ? "#DC2626" : CLASSE_FILL[dado.classe],
      fillOpacity: isSelected ? 0.92 : 0.78,
      color: isSelected ? "#7F1D1D" : "#FFFFFF",
      weight: isSelected ? 2.5 : 0.7,
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
        const isSelected =
          selecionado?.codarea === Number(feature.properties.codarea)
        // Hover do selecionado mantém a borda vermelha escura, só engrossa
        target.setStyle({
          weight: isSelected ? 3 : 1.5,
          color: isSelected ? "#7F1D1D" : "#0F7B40",
        })
        target.bringToFront()
      },
      mouseout: (e: LeafletMouseEvent) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const target = e.target as any
        target.setStyle(styleFeature(feature))
      },
    })
  }

  const loading = loadingGeo || loadingNomes

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <div className="relative overflow-hidden rounded-xl border border-border/70 bg-card shadow-[0_1px_3px_rgba(0,0,0,0.04),_0_10px_28px_-12px_rgba(0,0,0,0.10)]">
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
        {/* Filtro de cidade: alternativa ao clique no mapa para quem
            não sabe a localização geográfica do município */}
        <article
          className="rounded-xl border border-border/70 bg-card p-4 shadow-[0_1px_3px_rgba(0,0,0,0.04),_0_8px_24px_-12px_rgba(0,0,0,0.10)]"
          data-card-filtro="true"
        >
          <FiltroMunicipio
            selecionado={selecionado}
            onSelecionar={(codarea, nome) =>
              setSelecionado({ codarea, nome, dado: gerarDadoMock(codarea) })
            }
          />
        </article>

        {/* Card "Maranhão consolidado" - hero do painel com glow azul */}
        <article
          data-card-consolidado="true"
          className={cn(
            "group relative overflow-hidden rounded-xl border border-primary/30 p-5",
            "bg-gradient-to-br from-accent/40 via-card to-card",
            "shadow-[0_2px_4px_rgba(34,90,161,0.08),_0_12px_32px_-10px_rgba(34,90,161,0.20)]",
            "transition-all duration-300 ease-out hover:-translate-y-0.5",
            "hover:shadow-[0_6px_16px_rgba(34,90,161,0.14),_0_22px_48px_-12px_rgba(34,90,161,0.30)]"
          )}
        >
          {/* Glow azul no canto */}
          <span
            aria-hidden="true"
            data-card-glow="true"
            className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-primary/15 blur-2xl"
          />

          <div className="flex items-center gap-2">
            <span
              className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/30 transition-transform duration-300 group-hover:scale-105"
              data-card-icon="true"
            >
              <TrendingUp className="size-4" aria-hidden="true" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Maranhão consolidado
              </p>
              <p className="text-[10px] text-muted-foreground">
                217 municípios
              </p>
            </div>
          </div>

          <p className="mt-3 font-display text-3xl font-bold tabular text-foreground">
            {loading ? "..." : formatBRL(totalEstadual)}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Gasto público estimado em todo o estado
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
          <article
            className="relative overflow-hidden rounded-xl border-2 border-dashed border-border/70 bg-gradient-to-br from-muted/30 to-muted/10 p-5 text-center"
            data-card-vazio="true"
          >
            <span
              aria-hidden="true"
              className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary"
            >
              <MapPin className="size-5" aria-hidden="true" />
            </span>
            <p className="mt-3 text-sm font-semibold text-foreground">
              Selecione um município
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Toque no mapa ou use o filtro acima para ver os dados
              consolidados de qualquer cidade.
            </p>
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
    <article
      data-card-municipio="true"
      className={cn(
        "group relative overflow-hidden rounded-xl border border-primary/30 p-5",
        "bg-gradient-to-br from-card via-card to-accent/30",
        "shadow-[0_2px_4px_rgba(34,90,161,0.08),_0_12px_32px_-10px_rgba(34,90,161,0.18)]",
        "animate-in fade-in slide-in-from-right-2 duration-300"
      )}
    >
      {/* Glow azul decorativo */}
      <span
        aria-hidden="true"
        data-card-glow="true"
        className="pointer-events-none absolute -bottom-8 -right-8 size-28 rounded-full bg-primary/15 blur-2xl"
      />

      <header className="relative mb-4 flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <span
            className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md shadow-primary/30"
            data-card-icon="true"
          >
            <MapPin className="size-4" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">
              Município selecionado
            </p>
            <h3 className="mt-0.5 truncate font-display text-lg font-bold tracking-tight text-foreground">
              {sel.nome}
            </h3>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Fechar painel do município"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </header>

      {/* Gasto principal: hero do card */}
      <div className="relative">
        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Gasto público estimado
        </p>
        <p className="mt-0.5 font-display text-2xl font-bold tabular text-foreground">
          {formatBRL(sel.dado.gastoTotal)}
        </p>

        {/* Mini barra de proporção em relação ao estado */}
        <div className="mt-2 flex items-center gap-2">
          <div
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${pct.toFixed(2)}% do total estadual`}
          >
            <span
              aria-hidden="true"
              className="block h-full rounded-full bg-gradient-to-r from-primary to-info transition-all duration-700 ease-out"
              style={{ width: `${Math.min(100, pct * 4)}%` }}
            />
          </div>
          <span className="text-[10px] font-semibold tabular text-primary">
            {pct.toFixed(2)}%
          </span>
        </div>
        <p className="mt-1 text-[10px] text-muted-foreground">
          do total estadual
        </p>
      </div>

      {/* Indicadores secundários: ícones grandes coloridos */}
      <div className="relative mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4">
        <IndicadorMini
          icon={Hammer}
          valor={formatNumber(sel.dado.obrasAtivas)}
          label="Obras ativas"
          tema="laranja"
        />
        <IndicadorMini
          icon={Users}
          valor={formatNumber(sel.dado.servidoresAtivos)}
          label="Servidores"
          tema="verde"
        />
      </div>

      <p className="relative mt-4 inline-flex items-center gap-1.5 rounded-md border border-secondary/30 bg-secondary/10 px-2 py-1.5 text-[10px] text-foreground">
        <Building2 className="size-3 shrink-0 text-secondary-foreground" aria-hidden="true" />
        <span>
          Estimado por modelo, substituído por SIAFEM em produção
        </span>
      </p>
    </article>
  )
}

/**
 * Indicador secundário do card de município (Obras / Servidores).
 * Tema visual define cor do ícone wrapper. Strings literais para Tailwind.
 */
function IndicadorMini({
  icon: Icon,
  valor,
  label,
  tema,
}: {
  icon: typeof Hammer
  valor: string
  label: string
  tema: "laranja" | "verde"
}) {
  const config =
    tema === "laranja"
      ? {
          iconBg: "bg-gradient-to-br from-orange-500 to-orange-400 text-white",
          iconShadow: "shadow-md shadow-orange-500/25",
        }
      : {
          iconBg: "bg-gradient-to-br from-success to-success/80 text-success-foreground",
          iconShadow: "shadow-md shadow-success/25",
        }

  return (
    <div
      className="rounded-lg border border-border/70 bg-background p-2.5"
      data-indicador-mini="true"
      data-indicador-tema={tema}
    >
      <span
        className={cn(
          "inline-flex size-7 items-center justify-center rounded-md",
          config.iconBg,
          config.iconShadow
        )}
      >
        <Icon className="size-3.5" aria-hidden="true" />
      </span>
      <p className="mt-1.5 font-display text-base font-bold tabular leading-none text-foreground">
        {valor}
      </p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  )
}
