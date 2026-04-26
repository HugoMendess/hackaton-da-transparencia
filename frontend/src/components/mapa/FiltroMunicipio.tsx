import { useEffect, useMemo, useRef, useState } from "react"
import { Search, MapPin, X, ChevronDown } from "lucide-react"
import { useMunicipios } from "@/hooks/useMunicipios"
import { cn } from "@/lib/utils"

/**
 * Filtro de município com autocomplete.
 *
 * Usa o hook useMunicipios (217 cidades do MA via /geojson/municipios-ma.json).
 * Match feito com normalização de acento e case-insensitive, ordenado por
 * relevância: prefixo > substring > resto. Limita lista a 12 resultados
 * para não inundar o dropdown.
 *
 * Acessibilidade:
 *  - Combobox pattern (input + listbox)
 *  - Setas teclado para navegar, Enter seleciona, Esc fecha
 *  - aria-expanded e aria-activedescendant atualizados
 *
 * Útil para cidadãos que não sabem onde a cidade fica geograficamente
 * no mapa - basta digitar o nome.
 */
export function FiltroMunicipio({
  selecionado,
  onSelecionar,
  className,
}: {
  selecionado: { codarea: number; nome: string } | null
  onSelecionar: (codarea: number, nome: string) => void
  className?: string
}) {
  const { mapa, loading } = useMunicipios()
  const [query, setQuery] = useState("")
  const [aberto, setAberto] = useState(false)
  const [destaque, setDestaque] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Lista completa (id + nome), ordenada alfabeticamente
  const lista = useMemo(() => {
    const arr: Array<{ id: number; nome: string; norm: string }> = []
    mapa.forEach((nome, id) => {
      arr.push({ id, nome, norm: normalizar(nome) })
    })
    arr.sort((a, b) => a.norm.localeCompare(b.norm))
    return arr
  }, [mapa])

  const filtrados = useMemo(() => {
    const q = normalizar(query.trim())
    if (!q) return lista.slice(0, 12)
    const prefixo: typeof lista = []
    const substring: typeof lista = []
    for (const item of lista) {
      if (item.norm.startsWith(q)) prefixo.push(item)
      else if (item.norm.includes(q)) substring.push(item)
    }
    return [...prefixo, ...substring].slice(0, 12)
  }, [lista, query])

  // Reset destaque quando lista filtrada muda
  useEffect(() => {
    setDestaque(0)
  }, [query])

  // Click fora fecha
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setAberto(false)
      }
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  function selecionar(item: { id: number; nome: string }) {
    onSelecionar(item.id, item.nome)
    setQuery("")
    setAberto(false)
    inputRef.current?.blur()
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setAberto(true)
      setDestaque((d) => Math.min(d + 1, filtrados.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setDestaque((d) => Math.max(d - 1, 0))
    } else if (e.key === "Enter" && aberto && filtrados[destaque]) {
      e.preventDefault()
      selecionar(filtrados[destaque])
    } else if (e.key === "Escape") {
      setAberto(false)
      inputRef.current?.blur()
    }
  }

  return (
    <div
      ref={wrapperRef}
      className={cn("relative", className)}
      data-filtro-municipio="true"
    >
      <label htmlFor="filtro-municipio-input" className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <MapPin className="size-3.5 text-primary" aria-hidden="true" />
        Não sabe onde fica? Selecione a cidade
      </label>

      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <input
          ref={inputRef}
          id="filtro-municipio-input"
          type="text"
          role="combobox"
          aria-expanded={aberto}
          aria-controls="filtro-municipio-lista"
          aria-autocomplete="list"
          aria-activedescendant={
            aberto && filtrados[destaque]
              ? `municipio-opt-${filtrados[destaque].id}`
              : undefined
          }
          placeholder={
            loading
              ? "Carregando municípios..."
              : selecionado
              ? selecionado.nome
              : "Digite o nome do município"
          }
          disabled={loading}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setAberto(true)
          }}
          onFocus={() => setAberto(true)}
          onKeyDown={onKeyDown}
          className={cn(
            "h-10 w-full rounded-lg border border-border bg-background pl-9 pr-9 text-sm text-foreground",
            "placeholder:text-muted-foreground/70",
            "transition-all duration-200",
            "focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20",
            "disabled:cursor-not-allowed disabled:opacity-60"
          )}
        />
        {query.length > 0 ? (
          <button
            type="button"
            onClick={() => {
              setQuery("")
              inputRef.current?.focus()
            }}
            className="absolute right-2 top-1/2 inline-flex size-6 -translate-y-1/2 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Limpar filtro"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        ) : (
          <ChevronDown
            className={cn(
              "pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-transform duration-200",
              aberto && "rotate-180"
            )}
            aria-hidden="true"
          />
        )}
      </div>

      {/* Lista de sugestões */}
      {aberto && filtrados.length > 0 && (
        <ul
          id="filtro-municipio-lista"
          role="listbox"
          aria-label="Municípios disponíveis"
          className={cn(
            "absolute left-0 right-0 top-full z-30 mt-1 max-h-72 overflow-auto rounded-lg border border-border bg-card",
            "shadow-[0_4px_12px_rgba(0,0,0,0.06),_0_18px_36px_-12px_rgba(0,0,0,0.16)]"
          )}
        >
          {!query && (
            <li className="border-b border-border bg-muted/40 px-3 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {lista.length} municípios disponíveis - digite para filtrar
            </li>
          )}
          {filtrados.map((item, i) => {
            const isAtivo = i === destaque
            const isSelecionado = selecionado?.codarea === item.id
            return (
              <li key={item.id}>
                <button
                  type="button"
                  id={`municipio-opt-${item.id}`}
                  role="option"
                  aria-selected={isSelecionado}
                  onClick={() => selecionar(item)}
                  onMouseEnter={() => setDestaque(i)}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors",
                    isAtivo
                      ? "bg-accent/60 text-foreground"
                      : "text-foreground hover:bg-accent/40",
                    isSelecionado && "font-semibold text-primary"
                  )}
                >
                  <MapPin
                    className={cn(
                      "size-3.5 shrink-0",
                      isSelecionado ? "text-primary" : "text-muted-foreground/60"
                    )}
                    aria-hidden="true"
                  />
                  <span className="flex-1">{realcar(item.nome, query)}</span>
                  {isSelecionado && (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      Atual
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {aberto && query && filtrados.length === 0 && (
        <div
          className={cn(
            "absolute left-0 right-0 top-full z-30 mt-1 rounded-lg border border-border bg-card p-3 text-center text-xs text-muted-foreground",
            "shadow-md"
          )}
        >
          Nenhum município encontrado para "<span className="font-medium text-foreground">{query}</span>"
        </div>
      )}
    </div>
  )
}

function normalizar(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
}

/**
 * Realça o trecho buscado dentro do nome (case e acento-insensitive).
 * Mantém o texto original do município, só envolve a parte que bate em <mark>.
 */
function realcar(texto: string, query: string): React.ReactNode {
  const q = normalizar(query.trim())
  if (!q) return texto
  const norm = normalizar(texto)
  const idx = norm.indexOf(q)
  if (idx === -1) return texto
  return (
    <>
      {texto.slice(0, idx)}
      <mark className="rounded bg-primary/20 px-0.5 text-primary">
        {texto.slice(idx, idx + q.length)}
      </mark>
      {texto.slice(idx + q.length)}
    </>
  )
}
